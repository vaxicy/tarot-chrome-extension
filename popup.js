/**
 * 哈利波特塔罗牌 - 主逻辑（支持多牌阵、多牌组）
 * 已重构：使用 ES6+ 语法、类封装、async/await
 */
(function () {
  'use strict';

  // ============ 主应用类 ============
  class TarotApp {
    constructor() {
      // 状态
      this.currentCards = [];
      this.currentMode = 'single';
      this.currentDeck = 'magic';
      this.currentLang = 'zh';
      this.soundEnabled = true;  // 音效/触觉开关（与 toggleSound 同步）

      // 洗牌缓存
      this.shuffledDeckCache = null;
      this.lastShuffleDeck = null;

      // 自定义牌意
      this.customMeanings = {};
      this.CUSTOM_MEANINGS_KEY = 'tarot_custom_meanings';

      // 英文牌意 fallback 缓存（rider-waite 映射）
      this.riderWaiteMap = new Map();

      // 初始化
      this.init();
    }

    // ============ 工具方法 ============
    t(key, ...args) {
      const dict = I18N[this.currentLang] || I18N.zh;
      let text = dict[key] || key;
      args.forEach((arg, idx) => {
        text = text.replace(new RegExp('\\{' + idx + '\\}', 'g'), arg);
      });
      return text;
    }

    // ============ 自定义牌意管理 ============
    async loadCustomMeanings() {
      return new Promise((resolve) => {
        chrome.storage.local.get(this.CUSTOM_MEANINGS_KEY, (result) => {
          this.customMeanings = result[this.CUSTOM_MEANINGS_KEY] || {};
          resolve(this.customMeanings);
        });
      });
    }

    async saveCustomMeaning(cardId, type, text) {
      if (!this.customMeanings[cardId]) this.customMeanings[cardId] = {};
      this.customMeanings[cardId][type] = text;
      const data = {};
      data[this.CUSTOM_MEANINGS_KEY] = this.customMeanings;
      return new Promise((resolve) => {
        chrome.storage.local.set(data, resolve);
      });
    }

    getMeaningText(card, isReversed) {
      const type = isReversed ? 'reversed' : 'upright';
      // 优先使用自定义牌意
      if (this.customMeanings[card.id] && this.customMeanings[card.id][type]) {
        return this.customMeanings[card.id][type];
      }
      // 其次使用当前牌组的多语言 translations
      if (card.translations && card.translations[this.currentLang]) {
        const trans = card.translations[this.currentLang][type];
        if (trans) return trans;
      }
      // fallback：英文模式下从 rider-waite 牌组查找同 ID 卡的英文翻译
      if (this.currentLang === 'en' && this.riderWaiteMap && this.riderWaiteMap.has(card.id)) {
        const riderCard = this.riderWaiteMap.get(card.id);
        if (riderCard.translations && riderCard.translations.en && riderCard.translations.en[type]) {
          return riderCard.translations.en[type];
        }
      }
      // 兜底：原始中文
      return isReversed ? card.reversed : card.upright;
    }

    // ============ 语言管理 ============
    setLanguage(lang) {
      if (SUPPORTED_LANGS.includes(lang)) {
        this.currentLang = lang;
        deckManager.setLanguage(lang);
        chrome.storage.local.set({ tarot_lang: lang });
      }
    }

    getPosText(isReversed) {
      return isReversed
        ? (this.currentLang === 'en' ? 'Reversed' : '逆位')
        : (this.currentLang === 'en' ? 'Upright' : '正位');
    }

    getLocalizedDeckName(deckKey) {
      if (this.currentLang === 'en') {
        const enNames = { hp: 'Magic Theme', rider: 'Rider-Waite', marseille: 'Marseille', thoth: 'Thoth', angel: 'Angel', healing: 'Healing', osho: 'Osho Zen' };
        return enNames[deckKey] || 'Tarot';
      }
      return DECK_NAMES[deckKey] || '塔罗牌';
    }

    getLocalizedSpreadName(mode) {
      const spread = SPREADS[mode];
      if (!spread) return this.currentLang === 'en' ? 'Tarot Reading' : '塔罗占卜';
      return this.currentLang === 'en' ? (spread.nameEn || spread.name) : spread.name;
    }

    getLocalizedPositions(mode) {
      const spread = SPREADS[mode];
      if (!spread) return [];
      if (this.currentLang === 'en') {
        return spread.positionsEn || spread.positions;
      }
      return spread.positions;
    }

    getLocalizedLoadingText(mode) {
      const spread = SPREADS[mode];
      if (!spread) return this.currentLang === 'en' ? 'Shuffling cards...' : '正在洗牌...';
      if (this.currentLang === 'en') {
        return spread.loadingTextEn || 'Shuffling cards...';
      }
      return spread.loadingText || '正在洗牌...';
    }

    // ============ 运势相关本地化 ============
    getLocalizedFortuneCategory(cat) {
      if (this.currentLang !== 'en') return cat;
      const map = { '事业': 'Career', '财运': 'Wealth', '感情': 'Love', '健康': 'Health', '学习': 'Study', '社交': 'Social' };
      return map[cat] || cat;
    }

    getLocalizedFortuneLevel(level) {
      if (this.currentLang !== 'en') return level;
      const enLevels = [
        { text: 'Excellent', desc: 'Today\'s fortune is excellent. Everything goes smoothly. Great for pushing forward important plans.' },
        { text: 'Good', desc: 'Today\'s fortune is good. Positive actions will bring rewarding results.' },
        { text: 'Fair', desc: 'Today\'s fortune is steady. Follow the routine and avoid aggressive moves.' },
        { text: 'Slight Good', desc: 'Today\'s fortune is okay. Small matters go well, but be cautious with big decisions.' },
        { text: 'Neutral', desc: 'Today\'s fortune is plain. Good for rest and planning. Avoid risky moves.' },
        { text: 'Slight Bad', desc: 'Be cautious today. Avoid important decisions and large expenses.' },
        { text: 'Bad', desc: 'Today\'s fortune is low. Stay calm and still. Pay attention to safety and health.' }
      ];
      // 按 text 匹配索引，而不是对象引用
      const idx = FORTUNE_LEVELS.findIndex(l => l.text === level.text);
      if (idx >= 0 && idx < enLevels.length) {
        return { text: enLevels[idx].text, score: level.score, color: level.color, desc: enLevels[idx].desc };
      }
      return level;
    }

    getLocalizedLuckyColor(colorObj) {
      if (this.currentLang !== 'en') return colorObj;
      const map = { '金色': 'Gold', '紫色': 'Purple', '蓝色': 'Blue', '绿色': 'Green', '红色': 'Red', '橙色': 'Orange', '青色': 'Cyan', '粉色': 'Pink', '白色': 'White', '银色': 'Silver' };
      return { name: map[colorObj.name] || colorObj.name, hex: colorObj.hex };
    }

    getLocalizedDirection(dir) {
      if (this.currentLang !== 'en') return dir;
      const map = { '东': 'East', '南': 'South', '西': 'West', '北': 'North', '东南': 'Southeast', '西南': 'Southwest', '东北': 'Northeast', '西北': 'Northwest' };
      return map[dir] || dir;
    }

    getLocalizedAdvice(levelText) {
      if (this.currentLang !== 'en') {
        const advices = LUCKY_ADVICE[levelText] || ['宜：平常心对待', '忌：过度焦虑'];
        return { suit: advices[0], avoid: advices[1] };
      }
      const enAdvice = {
        '大吉': { suit: 'Do: Sign contracts, confess feelings, invest, travel', avoid: 'Avoid: Wasting opportunities' },
        '吉': { suit: 'Do: Study, socialize, shop, exercise', avoid: 'Avoid: Impulsive decisions, arguments' },
        '中吉': { suit: 'Do: Organize, plan, communicate, rest', avoid: 'Avoid: Risky investments, major changes' },
        '小吉': { suit: 'Do: Read, walk, do housework, listen to music', avoid: 'Avoid: Staying up late, overeating' },
        '平': { suit: 'Do: Meditate, review, maintain relationships, save', avoid: 'Avoid: Borrowing, job-hopping, long trips' },
        '小凶': { suit: 'Do: Stay alone, study, make plans', avoid: 'Avoid: Signing contracts, surgery, quarrels' },
        '凶': { suit: 'Do: Rest, reflect, sort old things', avoid: 'Avoid: Investing, traveling, major decisions' }
      };
      const res = enAdvice[levelText];
      if (res) return res;
      return { suit: 'Do: Stay calm', avoid: 'Avoid: Over-anxiety' };
    }

    getLocalizedDailyTip(tip) {
      if (this.currentLang !== 'en') return tip;
      const zhTips = [
        '今天的你散发着独特的魅力，相信自己。',
        '保持开放的心态，惊喜可能就在转角处。',
        '耐心是今天的关键词，等待合适的时机。',
        '与人交流会带来新的灵感和机会。',
        '关注自己的内心需求，不要忽视直觉。',
        '适度休息能让你的效率大幅提升。',
        '今天适合整理思绪，为明天做好准备。'
      ];
      const enTips = [
        'You radiate unique charm today. Believe in yourself.',
        'Keep an open mind; surprises may be around the corner.',
        'Patience is the keyword today. Wait for the right moment.',
        'Communicating with others will bring new inspiration and opportunities.',
        'Pay attention to your inner needs and don\'t ignore intuition.',
        'Moderate rest can greatly boost your efficiency.',
        'Today is a good day to sort out your thoughts and prepare for tomorrow.'
      ];
      const idx = zhTips.indexOf(tip);
      return idx >= 0 ? enTips[idx] : tip;
    }

    // ============ 应用静态文本国际化 ============
    applyStaticI18n() {
      // data-i18n-key 元素
      document.querySelectorAll('[data-i18n-key]').forEach((el) => {
        const key = el.dataset.i18nKey;
        if (!key) return;
        const text = this.t(key);
        if (el.tagName === 'OPTION') {
          el.textContent = text;
        } else if (el.children.length === 0) {
          el.textContent = text;
        } else {
          let hasNonSpanChild = false;
          for (let i = 0; i < el.childNodes.length; i++) {
            if (el.childNodes[i].nodeType === 3 && el.childNodes[i].textContent.trim()) {
              el.childNodes[i].textContent = text;
              hasNonSpanChild = true;
              break;
            }
          }
          if (!hasNonSpanChild) el.textContent = text;
        }
      });

      // data-i18n-spread 元素
      document.querySelectorAll('[data-i18n-spread]').forEach((el) => {
        const key = 'spread_' + el.dataset.i18nSpread;
        el.textContent = this.t(key);
      });

      // data-i18n-placeholder 元素（input placeholder）
      document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        const key = el.dataset.i18nPlaceholder;
        if (!key) return;
        el.placeholder = this.t(key);
      });

      // 更新 html lang 和 title
      document.documentElement.lang = this.currentLang === 'en' ? 'en' : 'zh-CN';
      const titleEl = document.querySelector('title');
      if (titleEl) titleEl.textContent = this.t('welcome_title');

      // 更新按钮文本
      this.updateButtonTexts();

      // 注入星级到名称/描述行
      this.injectDifficultyStars();
    }

    injectDifficultyStars() {
      const diffStars = { easy: '★☆☆', medium: '★★☆', hard: '★★★' };

      // 所有牌阵按钮：统一在名称末尾插入星级，描述行保持纯文字
      document.querySelectorAll('.spread-card, .spread-btn').forEach(btn => {
        const key = btn.dataset.spread;
        const spread = SPREADS[key];
        if (!spread) return;

        // 名称行末尾插入星级
        const nameEl = btn.querySelector('.spread-card-name, .spread-name');
        if (nameEl) {
          let inline = nameEl.querySelector('.difficulty-inline');
          if (!inline) {
            inline = document.createElement('span');
            inline.className = 'difficulty-inline';
            nameEl.appendChild(inline);
          }
          inline.textContent = ' ' + (diffStars[spread.difficulty] || '★☆☆');
        }

        // 描述行：移除可能已存在的星级，保持纯文字
        const descEl = btn.querySelector('.spread-desc');
        if (descEl) {
          const existing = descEl.querySelector('.difficulty-inline');
          if (existing) existing.remove();
        }
      });
    }

    updateButtonTexts() {
      const updateBtn = (id, key) => {
        const btn = document.getElementById(id);
        if (btn) {
          const span = btn.querySelector('span[data-i18n-key]');
          if (span && key) span.textContent = this.t(key);
        }
      };

      updateBtn('back-btn', 'btn_back');
      updateBtn('history-back-btn', 'btn_back');
      updateBtn('history-detail-back-btn', 'btn_back_to_list');

      // 更新综合解读按钮
      const toggleBtn = document.getElementById('toggle-reading-btn');
      if (toggleBtn) {
        const compContent = document.getElementById('comprehensive-content');
        const isCollapsed = compContent ? compContent.classList.contains('hidden') : true;
        toggleBtn.textContent = isCollapsed ? this.t('btn_expand') : this.t('btn_collapse');
      }
    }

    // ============ 洗牌算法 ============
    shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
      }
      return a;
    }

    // ============ 洗牌缓存 ============
    getShuffledDeck() {
      if (this.shuffledDeckCache && this.lastShuffleDeck === this.currentDeck) {
        return this.shuffledDeckCache;
      }
      const cardsData = this.getDeckData();
      this.shuffledDeckCache = this.shuffle(cardsData.slice());
      this.lastShuffleDeck = this.currentDeck;
      return this.shuffledDeckCache;
    }

    // ============ 获取当前牌组数据 ============
    getDeckData() {
      if (this.currentDeck === 'marseille' && typeof marseilleCards !== 'undefined') {
        return marseilleCards;
      }
      if (this.currentDeck === 'rider' && typeof riderWaiteCards !== 'undefined') {
        return riderWaiteCards;
      }
      if (this.currentDeck === 'thoth' && typeof thothCards !== 'undefined') {
        return thothCards;
      }
      if (this.currentDeck === 'angel' && typeof angelCards !== 'undefined') {
        return angelCards;
      }
      if (this.currentDeck === 'osho' && typeof oshoZenCards !== 'undefined') {
        return oshoZenCards;
      }
      return tarotCards;
    }

    setDeckHint(baseText) {
      const hint = document.getElementById('step-hint');
      if (hint) {
        hint.textContent = baseText + ' · ' + this.getLocalizedDeckName(this.currentDeck);
      }
    }

    // ============ 页面切换 ============
    showPage(pageId) {
      document.querySelectorAll('.page').forEach((p) => {
        p.classList.add('hidden');
      });
      const target = document.getElementById(pageId);
      if (target) target.classList.remove('hidden');
      // 非占卜页面时隐藏牌阵布局可视化
      if (pageId !== 'divination-page') {
        const diag = document.getElementById('result-spread-diagram');
        if (diag) diag.classList.add('hidden');
      }
    }

    // ============ 创建卡牌 DOM ============
    createCardEl(card, isReversed, startFlipped, cardWidth, cardHeight, index) {
      cardWidth = cardWidth || 80;
      cardHeight = cardHeight || 126;

      const wrap = document.createElement('div');
      wrap.className = 'card-3d-wrap';
      wrap.style.width = cardWidth + 'px';
      wrap.style.height = cardHeight + 'px';
      wrap.style.perspective = '1000px';
      if (index !== undefined) wrap.dataset.index = index;

      const el = document.createElement('div');
      el.className = 'tarot-card' + (startFlipped ? ' flipped' : '');
      el.style.width = cardWidth + 'px';
      el.style.height = cardHeight + 'px';
      el.dataset.cardId = card.id;
      el.dataset.reversed = isReversed ? '1' : '0';
      if (index !== undefined) el.dataset.index = index;

      const localizedName = deckManager.getCardName(card);
      const displayName = isReversed ? localizedName + (this.currentLang === 'en' ? ' (Reversed)' : '（逆位）') : localizedName;

      // 构建图片HTML（如果有imageUrl）
      let imgHtml = '';
      if (card.imageUrl) {
        let imgUrl = card.imageUrl;

        // 如果已经是正确格式，直接使用
        if (!imgUrl.match(/^icons\/(major|wands|cups|swords|pentacles)\/tarot-/)) {
          // 统一图片路径：将各种旧格式映射到 icons/[suit]/tarot-[suit]-[number].png
          // 支持格式：icons/major-00.png、icons/wands-06.png、icons/thoth-wands-06.png、icons/thoth-wands-p.png
          const match = imgUrl.match(/^icons\/(?:(\w+)-)?(major|wands|cups|swords|pentacles)-(.+?)\.png$/);
          if (match) {
            let suit = match[2];
            let num = match[3];

            // 托特塔罗宫廷牌映射：p(公主/侍从)→11, kn(王子/骑士)→12, q(王后)→13, k(国王)→14
            const courtMap = { 'p': '11', 'kn': '12', 'q': '13', 'k': '14' };
            if (courtMap[num]) {
              num = courtMap[num];
            }

            // 大阿卡纳补零（如果是一位数）
            if (suit === 'major' && num.length === 1) {
              num = '0' + num;
            }

            imgUrl = 'icons/' + suit + '/tarot-' + suit + '-' + num + '.png';
          }
        }

        imgHtml = '<img class="card-image" src="' + imgUrl + '" alt="' + localizedName + '" data-img-src="' + imgUrl + '" />';
      }

      // 根据当前牌组设置牌背样式
      let backClass = 'card-back-face';
      let backImg = '';
      if (this.currentDeck) {
        backClass += ' card-back-' + this.currentDeck;
        // 检查是否有牌背图片（magic 牌组对应 hp 文件名）
        const backImgId = this.currentDeck === 'magic' ? 'hp' : this.currentDeck;
        const backImgPath = 'icons/card-backs/card-back-' + backImgId + '.png';
        backImg = '<img class="card-back-img" src="' + backImgPath + '" alt="Card Back" />';
        backClass += ' has-back-img';
      }

      el.innerHTML =
        '<div class="card-inner">' +
          '<div class="' + backClass + '">' + backImg + '</div>' +
          '<div class="card-front">' +
            imgHtml +
          '</div>' +
        '</div>';

      // 使用事件监听器处理图片加载错误（替代内联 onerror，避免CSP限制）
      const imgEl = el.querySelector('.card-image');
      if (imgEl) {
        imgEl.addEventListener('error', function() {
          this.classList.add('img-error');
          this.style.display = 'none';
        });
      }
      const backImgEl = el.querySelector('.card-back-img');
      if (backImgEl) {
        backImgEl.addEventListener('error', function() {
          this.style.display = 'none';
        });
      }

      wrap.appendChild(el);
      return wrap;
    }

    // ============ 展示解读 ============
    showMeaning(card, isReversed, position) {
      const container = document.getElementById('result-meaning');
      if (!container) return;

      const meaning = this.getMeaningText(card, isReversed);
      const posText = this.getPosText(isReversed);
      const posLabel = position ? (this.currentLang === 'en' ? ' (' + position + ')' : '（' + position + '）') : '';
      const displayName = deckManager.getCardName(card);

      // 获取位置含义
      let positionMeaning = '';
      const spread = SPREADS[this.currentMode];
      if (spread && position) {
        const positions = this.currentLang === 'en' ? (spread.positionsEn || spread.positions) : spread.positions;
        const positionMeanings = this.currentLang === 'en'
          ? (spread.positionMeaningsEn || spread.positionMeanings || [])
          : (spread.positionMeanings || []);
        const idx = positions.indexOf(position);
        if (idx >= 0 && positionMeanings && positionMeanings[idx]) {
          positionMeaning = positionMeanings[idx];
        }
      }

      let html = '<div class="card-meaning">';
      html += '<div class="meaning-header">' + displayName + posLabel + ' - ' + posText + '</div>';

      // 添加关键词标签
      const keywords = this.currentLang === 'en' ? this.getCardKeywords(card, isReversed) : (card.keywords || []);
      if (keywords && keywords.length > 0) {
        html += '<div class="meaning-keywords">';
        keywords.forEach(keyword => {
          html += '<span class="keyword-tag">' + keyword + '</span>';
        });
        html += '</div>';
      }

      if (positionMeaning) {
        html += '<div class="meaning-position"><span class="meaning-position-label">' + (this.currentLang === 'en' ? 'Position: ' : '位置含义：') + '</span>' + positionMeaning + '</div>';
      }
      html += '<div class="meaning-text">' + meaning + '</div>';
      html += '<button class="custom-meaning-btn" data-card-id="' + card.id + '" data-type="' + (isReversed ? 'reversed' : 'upright') + '">' + this.t('btn_custom_meaning') + '</button>';
      html += '</div>';

      container.innerHTML = html;

      // 绑定自定义牌意按钮
      const btn = container.querySelector('.custom-meaning-btn');
      if (btn) {
        btn.addEventListener('click', async () => {
          const cardId = btn.dataset.cardId;
          const type = btn.dataset.type;
          const currentText = this.getMeaningText(card, isReversed);
          const promptText = this.currentLang === 'en'
            ? ('Enter custom ' + (type === 'upright' ? 'upright' : 'reversed') + ' meaning:')
            : ('请输入自定义' + (type === 'upright' ? '正位' : '逆位') + '牌意：');
          const newText = prompt(promptText, currentText);
          if (newText !== null) {
            await this.saveCustomMeaning(cardId, type, newText);
            this.showMeaning(card, isReversed, position);
          }
        });
      }
    }

    // ============ 综合解读 - 分析整体主题 ============
    analyzeTheme(cards, spreadName) {
      let uprightCount = 0, reversedCount = 0;
      cards.forEach((item) => {
        if (item.isReversed) reversedCount++; else uprightCount++;
      });

      const majors = cards.filter((item) => item.card.suit === 'major');

      const elements = { wands: 0, cups: 0, swords: 0, pentacles: 0 };
      cards.forEach((item) => {
        const suit = item.card.suit;
        if (suit === 'wands' || suit === 'fire') elements.wands++;
        else if (suit === 'cups' || suit === 'water') elements.cups++;
        else if (suit === 'swords' || suit === 'clouds') elements.swords++;
        else if (suit === 'pentacles' || suit === 'rainbow') elements.pentacles++;
      });

      let dominantElement = 'none';
      let maxCount = 0;
      for (const el in elements) {
        if (elements[el] > maxCount) { maxCount = elements[el]; dominantElement = el; }
      }
      const elementNames = this.currentLang === 'en'
        ? { wands: '<span class="element-fire">Wands (Fire)</span>', cups: '<span class="element-water">Cups (Water)</span>', swords: '<span class="element-air">Swords (Air)</span>', pentacles: '<span class="element-earth">Pentacles (Earth)</span>' }
        : { wands: '<span class="element-fire">权杖（火）</span>', cups: '<span class="element-water">圣杯（水）</span>', swords: '<span class="element-air">宝剑（风）</span>', pentacles: '<span class="element-earth">星币（土）</span>' };

      let html = '<div class="reading-section">';
      html += '<div class="reading-section-title">' + this.t('theme_title') + '</div>';
      html += '<div class="reading-section-body">';

      let text = this.t('theme_intro', spreadName, cards.length, uprightCount, reversedCount);

      if (majors.length > 0) {
        const sep = this.currentLang === 'en' ? ', ' : '、';
        const majorNames = majors.map((m) => deckManager.getCardName(m.card)).join(sep);
        text += this.t('theme_has_majors', majors.length, majorNames);
      } else {
        text += this.t('theme_no_majors');
      }

      if (maxCount > 1) {
        text += this.t('theme_dominant', elementNames[dominantElement] || dominantElement);
        if (dominantElement === 'wands') text += this.t('theme_wands');
        else if (dominantElement === 'cups') text += this.t('theme_cups');
        else if (dominantElement === 'swords') text += this.t('theme_swords');
        else if (dominantElement === 'pentacles') text += this.t('theme_pentacles');
      }

      // 检测元素互动
      const hasFire = elements.wands > 0;
      const hasWater = elements.cups > 0;
      const hasAir = elements.swords > 0;
      const hasEarth = elements.pentacles > 0;

      if (hasFire && hasWater) text += this.t('theme_element_fire_water');
      if (hasFire && hasAir) text += this.t('theme_element_fire_air');
      if (hasFire && hasEarth) text += this.t('theme_element_fire_earth');
      if (hasWater && hasAir) text += this.t('theme_element_water_air');
      if (hasWater && hasEarth) text += this.t('theme_element_water_earth');
      if (hasAir && hasEarth) text += this.t('theme_element_air_earth');

      // 正逆位平衡分析
      if (reversedCount >= cards.length * 0.5) {
        text += this.t('theme_mostly_reversed');
      } else if (uprightCount >= cards.length * 0.7) {
        text += this.t('theme_mostly_upright');
      } else if (uprightCount > 0 && reversedCount > 0) {
        text += this.t('theme_balanced');
      }

      // Level 3 优化：添加牌面"故事线"解读
      text += this.generateStoryline(cards);

      html += text + '</div></div>';
      return html;
    }

    // ============ Level 3 优化：生成牌面故事线 ============
    generateStoryline(cards) {
      if (cards.length < 3) return '';

      let text = '<br><br><strong>' + (this.currentLang === 'en' ? 'Storyline: ' : '故事线：') + '</strong>';
      text += this.currentLang === 'en' ? 'The cards tell a story — ' : '牌面在讲述一个故事——';

      // 根据牌面生成简单的叙事
      const firstCard = cards[0];
      const lastCard = cards[cards.length - 1];

      if (firstCard.isReversed && !lastCard.isReversed) {
        text += this.currentLang === 'en'
          ? 'starting with challenges but moving toward resolution.'
          : '从挑战开始，但正走向解决。';
      } else if (!firstCard.isReversed && lastCard.isReversed) {
        text += this.currentLang === 'en'
          ? 'starting smoothly but facing tests ahead.'
          : '开始顺利，但前方有考验。';
      } else if (!firstCard.isReversed && !lastCard.isReversed) {
        text += this.currentLang === 'en'
          ? 'the energy flows positively from beginning to end.'
          : '能量从开始到结束都是正向流动的。';
      } else {
        text += this.currentLang === 'en'
          ? 'there are challenges to work through, but each step brings growth.'
          : '有需要克服的挑战，但每一步都带来成长。';
      }

      return text;
    }

    // ============ 综合解读 - 分析牌面关系（智能增强版）============
    analyzeCardRelations(mode, cards, positions) {
      let html = '<div class="reading-section">';
      html += '<div class="reading-section-title">' + (this.currentLang === 'en' ? '🃏 Smart Card Relations' : '🃏 智能牌面关系分析') + '</div>';
      html += '<div class="reading-section-body">';

      let text = '';

      // 特殊处理特定牌阵
      if (mode === 'three') {
        const past = cards[0], now = cards[1], future = cards[2];
        text += this.t('relation_three_past',
          deckManager.getCardName(past.card), this.getPosText(past.isReversed),
          deckManager.getCardName(now.card), this.getPosText(now.isReversed),
          deckManager.getCardName(future.card), this.getPosText(future.isReversed));
        if (past.isReversed && !now.isReversed) text += this.t('relation_three_past_rev_now_up');
        if (!past.isReversed && now.isReversed) text += this.t('relation_three_past_up_now_rev');
        if (now.isReversed && !future.isReversed) text += this.t('relation_three_now_rev_future_up');
      } else if (mode === 'relation') {
        text += this.t('relation_you',
          deckManager.getCardName(cards[0].card), this.getPosText(cards[0].isReversed),
          deckManager.getCardName(cards[1].card), this.getPosText(cards[1].isReversed));
        if (cards[0].isReversed === cards[1].isReversed) {
          text += cards[0].isReversed ? this.t('relation_same_rev') : this.t('relation_same_up');
        } else {
          text += this.t('relation_diff');
        }
      } else if (mode === 'choice') {
        text += this.t('relation_choice',
          deckManager.getCardName(cards[0].card), this.getPosText(cards[0].isReversed),
          deckManager.getCardName(cards[1].card), this.getPosText(cards[1].isReversed),
          deckManager.getCardName(cards[4].card), this.getPosText(cards[4].isReversed));
      } else if (mode === 'celtic') {
        text += this.t('relation_celtic',
          deckManager.getCardName(cards[0].card),
          deckManager.getCardName(cards[1].card),
          deckManager.getCardName(cards[2].card),
          deckManager.getCardName(cards[9].card));
      }

      // ===== 智能牌面关系分析（通用增强）=====
      
      // 1. 分析所有牌对的关系（不仅仅是相邻牌）
      const relations = [];
      for (let i = 0; i < cards.length; i++) {
        for (let j = i + 1; j < cards.length; j++) {
          const relation = this.analyzeCardPairRelation(cards[i], cards[j], positions[i], positions[j]);
          if (relation) {
            relations.push(relation);
          }
        }
      }

      // 2. 按关系强度排序并去重
      relations.sort((a, b) => b.strength - a.strength);
      const uniqueRelations = [];
      const seenPairs = new Set();
      for (const rel of relations) {
        const pairKey = [rel.card1Id, rel.card2Id].sort().join('-');
        if (!seenPairs.has(pairKey)) {
          seenPairs.add(pairKey);
          uniqueRelations.push(rel);
        }
      }

      // 3. 添加最强的关系分析（带详细解释）
      if (uniqueRelations.length > 0) {
        text += '<div style="margin-top:10px;"><strong>' + (this.currentLang === 'en' ? 'Key Card Relations:' : '关键牌面关系：') + '</strong><br/>';
        uniqueRelations.slice(0, 5).forEach(rel => {
          text += '<div style="margin-bottom:12px; padding:8px; background:rgba(255,215,0,0.05); border-left:3px solid var(--color-gold);">';
          text += '<div style="font-weight:bold; margin-bottom:5px;">• ' + rel.description + '</div>';
          if (rel.detailedExplanation) {
            text += '<div style="font-size:0.9em; color:var(--color-text-muted); line-height:1.4;">' + rel.detailedExplanation + '</div>';
          }
          text += '</div>';
        });
        text += '</div>';
      }

      // 4. 能量流动分析
      if (cards.length >= 3) {
        text += '<div style="margin-top:10px;"><strong>' + (this.currentLang === 'en' ? 'Energy Flow:' : '能量流动分析：') + '</strong><br/>';
        const flow = this.analyzeEnergyFlow(cards, positions);
        text += '• ' + flow + '<br/></div>';
      }

      // 5. 如果没找到特殊关系，显示默认文本
      if (text === '') {
        text = this.t('relation_smooth');
      }

      html += text + '</div></div>';
      return html;
    }

    // ============ 分析两张牌的关系（带详细解释）============
    analyzeCardPairRelation(card1, card2, pos1, pos2) {
      const c1 = card1.card;
      const c2 = card2.card;
      const isRev1 = card1.isReversed;
      const isRev2 = card2.isReversed;
      
      let strength = 0;
      let description = '';
      let detailedExplanation = '';
      let relationType = ''; // synergy, conflict, complementary, tension

      // 1. 大阿卡那牌对（最强关系）
      if (c1.suit === 'major' && c2.suit === 'major') {
        strength = 10;
        relationType = 'synergy';
        const name1 = deckManager.getCardName(c1) + ' ' + this.getPosText(isRev1);
        const name2 = deckManager.getCardName(c2) + ' ' + this.getPosText(isRev2);
        description = this.t('relation_synergy', name1, name2);
        
        // 详细解释
        const explanation = this.getMajorPairExplanation(c1.id, c2.id, isRev1, isRev2);
        detailedExplanation = this.t('relation_explain_synergy', 
          name1, name2, 
          explanation.meaning, 
          explanation.advice);
      }
      
      // 2. 同元素牌（相生关系）
      else if (c1.suit === c2.suit && c1.suit !== 'major') {
        strength = 7;
        relationType = 'synergy';
        const suitNames = { wands: '权杖', cups: '圣杯', swords: '宝剑', pentacles: '星币', fire: '火', water: '水', clouds: '云', rainbow: '彩虹' };
        const suitName = this.currentLang === 'en' ? c1.suit : (suitNames[c1.suit] || c1.suit);
        description = this.currentLang === 'en' 
          ? `Cards of the same suit (${suitName}) enhance each other's energy.`
          : `同牌组（${suitName}）的牌相互增强能量。`;
        
        // 详细解释
        const explanation = this.getSameSuitExplanation(c1.suit, isRev1, isRev2);
        detailedExplanation = this.t('relation_explain_synergy', 
          deckManager.getCardName(c1) + ' ' + this.getPosText(isRev1), 
          deckManager.getCardName(c2) + ' ' + this.getPosText(isRev2), 
          explanation.meaning, 
          explanation.advice);
      }
      
      // 3. 元素相克关系（火vs水，风vs土）
      else if (this.isElementConflict(c1.suit, c2.suit)) {
        strength = 8;
        relationType = 'conflict';
        const name1 = deckManager.getCardName(c1) + ' ' + this.getPosText(isRev1);
        const name2 = deckManager.getCardName(c2) + ' ' + this.getPosText(isRev2);
        description = this.t('relation_conflict', name1, name2);
        
        // 详细解释
        const explanation = this.getElementConflictExplanation(c1.suit, c2.suit, isRev1, isRev2);
        detailedExplanation = this.t('relation_explain_conflict', 
          name1, name2, 
          explanation.meaning, 
          explanation.advice);
      }
      
      // 4. 元素互补关系（火+风，水+土，等）
      else if (this.isElementComplementary(c1.suit, c2.suit)) {
        strength = 6;
        relationType = 'complementary';
        const name1 = deckManager.getCardName(c1) + ' ' + this.getPosText(isRev1);
        const name2 = deckManager.getCardName(c2) + ' ' + this.getPosText(isRev2);
        description = this.t('relation_complementary', name1, name2);
        
        // 详细解释
        const explanation = this.getElementComplementaryExplanation(c1.suit, c2.suit, isRev1, isRev2);
        detailedExplanation = this.t('relation_explain_complementary', 
          name1, name2, 
          explanation.meaning, 
          explanation.advice);
      }
      
      // 5. 正逆位对比（张力关系）
      else if (isRev1 !== isRev2) {
        strength = 5;
        relationType = 'tension';
        const name1 = deckManager.getCardName(c1) + ' ' + this.getPosText(isRev1);
        const name2 = deckManager.getCardName(c2) + ' ' + this.getPosText(isRev2);
        description = this.t('relation_tension', name1, name2);
        
        // 详细解释
        const explanation = this.getTensionExplanation(c1, c2, isRev1, isRev2);
        detailedExplanation = this.t('relation_explain_tension', 
          name1, name2, 
          explanation.meaning, 
          explanation.advice);
      }

      if (description) {
        return {
          card1Id: c1.id,
          card2Id: c2.id,
          strength,
          description,
          detailedExplanation,
          relationType
        };
      }
      return null;
    }

    // ============ 大阿卡那牌对解释 ============
    getMajorPairExplanation(id1, id2, isRev1, isRev2) {
      // 常见大阿卡那牌对组合解释
      const pairs = {
        'major-00_major-01': {
          zh: { meaning: '愚者与魔术师同时出现，代表全新的开始和无限可能。宇宙正在给你一个"重启按钮"，鼓励你从零开始，勇敢追求梦想。', advice: '抓住这个能量强大的时刻，大胆迈出第一步。不要被过去的经验限制，相信自己的创造力。' },
          en: { meaning: 'The Fool and The Magician together represent a powerful new beginning and infinite possibilities. The universe is giving you a "reset button", encouraging you to start anew and pursue your dreams bravely.', advice: 'Seize this moment of powerful energy, take the first step boldly. Do not be limited by past experiences, trust your creativity.' }
        },
        'major-13_major-20': {
          zh: { meaning: '死神与审判同时出现，预示着彻底的转化与重生。你正在经历灵魂层面的深刻改变，旧的自我的正在瓦解，新的自我即将诞生。', advice: '接受这个转化的过程，不要抗拒改变。这是成长必经的阶段，熬过去后你会变得更强大。' },
          en: { meaning: 'Death and Judgement together indicate complete transformation and rebirth. You are going through a deep soul-level change. The old self is disintegrating, and a new self is about to be born.', advice: 'Accept this transformation process, do not resist change. This is a necessary stage of growth. You will become stronger after getting through this.' }
        },
        'major-19_major-06': {
          zh: { meaning: '太阳与恋人同时出现，预示着跟随内心会走向光明的结果。爱与喜悦正在支持你的道路，这是做出重要选择的好时机。', advice: '相信自己的直觉和内心感受。当你出于爱而非恐惧做决定时，结果往往会很好。' },
          en: { meaning: 'The Sun and The Lovers together indicate that following your heart will lead to bright outcomes. Love and joy are supporting your path. This is a good time to make important choices.', advice: 'Trust your intuition and inner feelings. When you make decisions out of love rather than fear, the outcome tends to be good.' }
        }
      };

      const key = [id1, id2].sort().join('_');
      const pair = pairs[key];
      
      if (pair) {
        return this.currentLang === 'en' ? pair.en : pair.zh;
      }
      
      // 默认解释
      const defaultExplanation = {
        zh: { meaning: '这两张大阿卡那牌形成强烈的能量共振，提示你关注灵魂层面的课题。', advice: '深入反思这两张牌的寓意，它们共同指向你当前最重要的成长主题。' },
        en: { meaning: 'These two Major Arcana cards create strong energy resonance, reminding you to pay attention to soul-level themes.', advice: 'Reflect deeply on the meanings of these two cards. Together they point to the most important growth theme in your current phase.' }
      };
      
      return this.currentLang === 'en' ? defaultExplanation.en : defaultExplanation.zh;
    }

    // ============ 同元素牌解释 ============
    getSameSuitExplanation(suit, isRev1, isRev2) {
      const explanations = {
        wands: {
          zh: { meaning: '权杖牌组代表火元素，象征热情、行动力和创造力。多张权杖牌同时出现，说明你需要将想法转化为行动，充满激情地去追求目标。', advice: isRev1 || isRev2 ? '注意行动力是否被延迟或受阻。检查是否有恐惧或自我怀疑在阻碍你前进。' : '保持热情和动力，抓住机会采取行动。这是充满能量和创造力的时期。' },
          en: { meaning: 'Wands suit represents fire element, symbolizing passion, action, and creativity. Multiple Wands cards appearing together indicate you need to turn ideas into action and pursue goals with passion.', advice: isRev1 || isRev2 ? 'Pay attention to whether action is delayed or blocked. Check if fear or self-doubt is hindering your progress.' : 'Maintain enthusiasm and motivation, seize opportunities to take action. This is a period full of energy and creativity.' }
        },
        cups: {
          zh: { meaning: '圣杯牌组代表水元素，象征情感、直觉和人际关系。多张圣杯牌同时出现，说明你需要关注情感层面，倾听内心的声音，培养人际关系。', advice: isRev1 || isRev2 ? '注意情感是否被压抑或过度情绪化。给自己时间和空间去感受和疗愈。' : '敞开心扉，表达情感，与他人建立深层连接。这是情感丰富和直觉敏锐的时期。' },
          en: { meaning: 'Cups suit represents water element, symbolizing emotions, intuition, and relationships. Multiple Cups cards appearing together indicate you need to pay attention to the emotional level, listen to your inner voice, and nurture relationships.', advice: isRev1 || isRev2 ? 'Pay attention to whether emotions are suppressed or overly emotional. Give yourself time and space to feel and heal.' : 'Open your heart, express emotions, build deep connections with others. This is a period of emotional richness and keen intuition.' }
        },
        swords: {
          zh: { meaning: '宝剑牌组代表风元素，象征理智、思考和沟通。多张宝剑牌同时出现，说明你需要理性分析问题，清晰思考，有效沟通。', advice: isRev1 || isRev2 ? '注意思维是否过于混乱或决策困难。尝试冥想或写下来理清思路。' : '运用逻辑和理性分析问题。这是适合做计划、沟通和解决冲突的时期。' },
          en: { meaning: 'Swords suit represents air element, symbolizing intellect, thinking, and communication. Multiple Swords cards appearing together indicate you need to analyze problems rationally, think clearly, and communicate effectively.', advice: isRev1 || isRev2 ? 'Pay attention to whether thoughts are too chaotic or decision-making is difficult. Try meditation or writing to clarify thoughts.' : 'Use logic and reason to analyze problems. This is a good period for planning, communication, and resolving conflicts.' }
        },
        pentacles: {
          zh: { meaning: '星币牌组代表土元素，象征物质、财富和实际成果。多张星币牌同时出现，说明你需要关注实际层面，制定具体计划，稳步积累成果。', advice: isRev1 || isRev2 ? '注意物质层面是否有损失或延迟。检查财务和健康状况，做好风险管理。' : '专注于实际目标和物质成果。这是适合投资、工作和健康管理的时期。' },
          en: { meaning: 'Pentacles suit represents earth element, symbolizing material, wealth, and practical results. Multiple Pentacles cards appearing together indicate you need to focus on the practical level, make concrete plans, and accumulate results steadily.', advice: isRev1 || isRev2 ? 'Pay attention to whether there are losses or delays in the material level. Check financial and health status, do risk management.' : 'Focus on practical goals and material results. This is a good period for investment, work, and health management.' }
        },
        // 奥修禅卡花色
        fire: {
          zh: { meaning: '火牌组象征热情、行动力和创造力。多张火牌同时出现，说明你需要将想法转化为行动，充满激情地去追求目标。', advice: isRev1 || isRev2 ? '注意行动力是否被延迟或受阻。检查是否有恐惧在阻碍你前进。' : '保持热情和动力，抓住机会采取行动。这是充满能量和创造力的时期。' },
          en: { meaning: 'Fire suit symbolizes passion, action, and creativity. Multiple Fire cards appearing together indicate you need to turn ideas into action and pursue goals with passion.', advice: isRev1 || isRev2 ? 'Pay attention to whether action is delayed or blocked. Check if fear is hindering your progress.' : 'Maintain enthusiasm and motivation, seize opportunities to take action. This is a period full of energy and creativity.' }
        },
        water: {
          zh: { meaning: '水牌组象征情感、直觉和流动。多张水牌同时出现，说明你需要关注情感层面，倾听内心的声音，允许自己流动。', advice: isRev1 || isRev2 ? '注意情感是否被压抑或过度情绪化。给自己时间和空间去感受和疗愈。' : '敞开心扉，表达情感，与他人建立深层连接。这是情感丰富和直觉敏锐的时期。' },
          en: { meaning: 'Water suit symbolizes emotions, intuition, and flow. Multiple Water cards appearing together indicate you need to pay attention to the emotional level and listen to your inner voice.', advice: isRev1 || isRev2 ? 'Pay attention to whether emotions are suppressed or overly emotional. Give yourself time and space to feel and heal.' : 'Open your heart, express emotions, build deep connections with others. This is a period of emotional richness and keen intuition.' }
        },
        clouds: {
          zh: { meaning: '云牌组象征思维、观察和不清晰。多张云牌同时出现，说明你需要理清思绪，透过表象看本质，找到清晰度。', advice: isRev1 || isRev2 ? '注意思维是否过于混乱或困惑。尝试冥想或写下来理清思路。' : '运用观察和理性分析。这是适合澄清困惑、看清真相的时期。' },
          en: { meaning: 'Clouds suit symbolizes thoughts, observation, and confusion. Multiple Clouds cards appearing together indicate you need to clarify your thoughts and see through appearances to find clarity.', advice: isRev1 || isRev2 ? 'Pay attention to whether thoughts are too chaotic or confusing. Try meditation or writing to clarify thoughts.' : 'Use observation and rational analysis. This is a good period for clarifying confusion and seeing the truth.' }
        },
        rainbow: {
          zh: { meaning: '彩虹牌组象征完整、多彩和可能性。多张彩虹牌同时出现，说明你需要整合各个层面，拥抱生命的多彩。', advice: isRev1 || isRev2 ? '注意是否有某个层面的能量被忽视。尝试整合身心灵各个层面。' : '拥抱生命的多样性和完整性。这是适合整合、包容和庆祝的时期。' },
          en: { meaning: 'Rainbow suit symbolizes wholeness, diversity, and possibilities. Multiple Rainbow cards appearing together indicate you need to integrate all levels and embrace the colors of life.', advice: isRev1 || isRev2 ? 'Pay attention to whether any level of energy is being neglected. Try integrating body, mind, and spirit.' : 'Embrace the diversity and wholeness of life. This is a good period for integration, inclusion, and celebration.' }
        }
      };
      
      const explanation = explanations[suit];
      if (!explanation) {
        return { meaning: '', advice: '' };
      }
      return this.currentLang === 'en' ? explanation.en : explanation.zh;
    }

    // ============ 元素冲突解释 ============
    getElementConflictExplanation(suit1, suit2, isRev1, isRev2) {
      const conflicts = {
        'wands_cups': {
          zh: { meaning: '火元素（权杖）与水元素（圣杯）冲突，代表热情与情感之间的张力。你可能感到理性与情感在拉扯，需要找到平衡点。', advice: '不要完全被情绪左右，也不要完全压抑情感。找到行动与感受之间的平衡，让热情与情感相互滋养而非相互消耗。' },
          en: { meaning: 'Fire element (Wands) conflicts with Water element (Cups), representing tension between passion and emotions. You may feel rational and emotional pulling in different directions, need to find a balance.', advice: 'Do not be completely led by emotions, nor completely suppress emotions. Find a balance between action and feeling, let passion and emotions nourish each other rather than consume each other.' }
        },
        'swords_pentacles': {
          zh: { meaning: '风元素（宝剑）与土元素（星币）冲突，代表理智与现实之间的张力。你可能想得很多但行动不足，或者过于务实而缺乏灵感。', advice: '将想法落地，制定具体可行的计划。同时也要保持开放的心态，不要过于固执于既定方案，适时调整策略。' },
          en: { meaning: 'Air element (Swords) conflicts with Earth element (Pentacles), representing tension between intellect and reality. You may think a lot but lack action, or be too pragmatic and lack inspiration.', advice: 'Ground your ideas, make concrete and feasible plans. At the same time, maintain an open mind, do not be too attached to established plans, adjust strategies when appropriate.' }
        }
      };
      
      const key = [suit1, suit2].sort().join('_');
      const conflict = conflicts[key];
      
      if (conflict) {
        return this.currentLang === 'en' ? conflict.en : conflict.zh;
      }
      
      // 默认解释
      const defaultExplanation = {
        zh: { meaning: '这两种元素存在能量冲突，提示你需要关注内在的矛盾和张力。', advice: '识别冲突的根源，寻找整合而非对抗的方式。有时候，冲突正是成长的契机。' },
        en: { meaning: 'These two elements have energy conflict, reminding you to pay attention to inner contradictions and tension.', advice: 'Identify the root of the conflict, look for ways to integrate rather than confront. Sometimes, conflict is exactly the opportunity for growth.' }
      };
      
      return this.currentLang === 'en' ? defaultExplanation.en : defaultExplanation.zh;
    }

    // ============ 元素互补解释 ============
    getElementComplementaryExplanation(suit1, suit2, isRev1, isRev2) {
      const complementaries = {
        'wands_swords': {
          zh: { meaning: '火元素（权杖）与风元素（宝剑）互补，代表热情与理智的结合。你有创意也有执行力，能将想法转化为实际行动。', advice: '运用你的创造力和逻辑思维能力。这是启动新项目、制定战略和有效沟通的好时机。' },
          en: { meaning: 'Fire element (Wands) and Air element (Swords) are complementary, representing the combination of passion and intellect. You have creativity and execution ability, can turn ideas into practical actions.', advice: 'Use your creativity and logical thinking ability. This is a good time to launch new projects, formulate strategies, and communicate effectively.' }
        },
        'cups_pentacles': {
          zh: { meaning: '水元素（圣杯）与土元素（星币）互补，代表情感与物质的结合。你能在追求物质成功的同时，保持情感的满足和人际关系的和谐。', advice: '在追求实际目标的同时，不要忽略情感和人际关系。找到工作与生活、物质与精神的平衡点。' },
          en: { meaning: 'Water element (Cups) and Earth element (Pentacles) are complementary, representing the combination of emotions and material. You can pursue material success while maintaining emotional satisfaction and harmonious relationships.', advice: 'While pursuing practical goals, do not ignore emotions and relationships. Find the balance point between work and life, material and spirit.' }
        }
      };
      
      const key = [suit1, suit2].sort().join('_');
      const complementary = complementaries[key];
      
      if (complementary) {
        return this.currentLang === 'en' ? complementary.en : complementary.zh;
      }
      
      // 默认解释
      const defaultExplanation = {
        zh: { meaning: '这两种元素相互补充，提供全面的视角和平衡的能量。', advice: '善用这两种元素的优势，它们可以相互增强，帮助你更全面地应对当前情况。' },
        en: { meaning: 'These two elements complement each other, providing a comprehensive perspective and balanced energy.', advice: 'Make good use of the advantages of these two elements. They can enhance each other and help you cope with the current situation more comprehensively.' }
      };
      
      return this.currentLang === 'en' ? defaultExplanation.en : defaultExplanation.zh;
    }

    // ============ 张力关系解释 ============
    getTensionExplanation(card1, card2, isRev1, isRev2) {
      const name1 = deckManager.getCardName(card1);
      const name2 = deckManager.getCardName(card2);
      
      const explanation = {
        zh: { meaning: `「${name1}」与「${name2}」呈现正逆位对比，形成张力关系。这提示你内在可能存在矛盾：一部分你倾向于{isRev1 ? '保守/内省' : '开放/行动'}，而另一部分你倾向于{isRev2 ? '保守/内省' : '开放/行动'}。`, advice: '接受这种内在的矛盾，它正是你成长的机会。试着理解这两方面的需求，寻找整合而非排斥的方式。' },
        en: { meaning: `"${name1}" and "${name2}" show upright-reversed contrast, forming a tense relationship. This suggests there may be inner contradiction: part of you tends to be {isRev1 ? 'conservative/introspective' : 'open/action-oriented'}, while another part of you tends to be {isRev2 ? 'conservative/introspective' : 'open/action-oriented'}.`, advice: 'Accept this inner contradiction, it is exactly an opportunity for your growth. Try to understand the needs of both aspects, look for ways to integrate rather than exclude.' }
      };
      
      return this.currentLang === 'en' ? explanation.en : explanation.zh;
    }

    // ============ 检测元素冲突 ============
    isElementConflict(suit1, suit2) {
      const conflicts = [
        ['wands', 'cups'], ['cups', 'wands'],
        ['swords', 'pentacles'], ['pentacles', 'swords'],
        // 奥修禅卡映射
        ['fire', 'water'], ['water', 'fire'],
        ['clouds', 'rainbow'], ['rainbow', 'clouds']
      ];
      return conflicts.some(([a, b]) => (suit1 === a && suit2 === b) || (suit1 === b && suit2 === a));
    }

    // ============ 检测元素互补 ============
    isElementComplementary(suit1, suit2) {
      const complementary = [
        ['wands', 'swords'], ['swords', 'wands'],
        ['cups', 'pentacles'], ['pentacles', 'cups'],
        ['wands', 'pentacles'], ['pentacles', 'wands'],
        ['cups', 'swords'], ['swords', 'cups'],
        // 奥修禅卡映射
        ['fire', 'clouds'], ['clouds', 'fire'],
        ['water', 'rainbow'], ['rainbow', 'water'],
        ['fire', 'rainbow'], ['rainbow', 'fire'],
        ['water', 'clouds'], ['clouds', 'water']
      ];
      return complementary.some(([a, b]) => (suit1 === a && suit2 === b) || (suit1 === b && suit2 === a));
    }

    // ============ 分析能量流动 ============
    analyzeEnergyFlow(cards, positions) {
      // 简单能量流动分析：检查正位/逆位的变化趋势
      let flowType = '';
      let flowDescription = '';
      
      const reversedPositions = cards.map((item, idx) => ({
        position: positions[idx] || `位置${idx + 1}`,
        isReversed: item.isReversed,
        name: deckManager.getCardName(item.card)
      }));

      // 检测能量流动模式
      const firstHalf = reversedPositions.slice(0, Math.ceil(reversedPositions.length / 2));
      const secondHalf = reversedPositions.slice(Math.ceil(reversedPositions.length / 2));
      
      const firstRevCount = firstHalf.filter(p => p.isReversed).length;
      const secondRevCount = secondHalf.filter(p => p.isReversed).length;
      
      if (secondRevCount < firstRevCount) {
        flowType = 'improving';
        flowDescription = this.currentLang === 'en' 
          ? 'Energy is improving from challenge to smoothness.'
          : '能量从挑战流向顺畅，情况正在好转。';
      } else if (secondRevCount > firstRevCount) {
        flowType = 'declining';
        flowDescription = this.currentLang === 'en'
          ? 'Energy is declining from smoothness to challenge. Need to be cautious.'
          : '能量从顺畅流向挑战，需要谨慎应对。';
      } else {
        flowType = 'stable';
        flowDescription = this.currentLang === 'en'
          ? 'Energy flow is stable. Current situation may continue for some time.'
          : '能量流动稳定，当前情况可能会持续一段时间。';
      }

      // 添加具体牌面描述
      if (reversedPositions.length >= 2) {
        const start = reversedPositions[0];
        const end = reversedPositions[reversedPositions.length - 1];
        flowDescription += this.currentLang === 'en'
          ? ` From "${start.name}" to "${end.name}", energy shows a ${flowType} trend.`
          : `从「${start.name}」到「${end.name}」，能量呈现${flowType === 'improving' ? '改善' : flowType === 'declining' ? '下降' : '稳定'}的趋势。`;
      }

      return flowDescription;
    }

    // ============ 综合解读 - 分析运势走向 ============
    analyzeTrend(cards) {
      let html = '<div class="reading-section">';
      html += '<div class="reading-section-title">' + this.t('trend_title') + '</div>';
      html += '<div class="reading-section-body">';

      let text = '';

      // 更精细的走势分析：逐张检查正逆位变化
      let revCount = 0;
      let trend = [];
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].isReversed) revCount++;
        trend.push(cards[i].isReversed ? 0 : 1); // 0=逆位, 1=正位
      }

      // 计算前半段和后半段逆位比例
      const firstHalf = cards.slice(0, Math.ceil(cards.length / 2));
      const secondHalf = cards.slice(Math.ceil(cards.length / 2));
      let firstRev = 0, secondRev = 0;
      firstHalf.forEach((c) => { if (c.isReversed) firstRev++; });
      secondHalf.forEach((c) => { if (c.isReversed) secondRev++; });

      // 检测走势趋势（改善/恶化/平稳）
      const firstRevRatio = firstRev / firstHalf.length;
      const secondRevRatio = secondRev / secondHalf.length;

      if (secondRevRatio < firstRevRatio - 0.2) {
        text = this.t('trend_improvement');
      } else if (secondRevRatio > firstRevRatio + 0.2) {
        text = this.t('trend_decline');
      } else if (secondRev < firstRev) {
        text = this.t('trend_good');
      } else if (secondRev > firstRev) {
        text = this.t('trend_warning');
      } else {
        text = this.t('trend_stable');
      }

      // 检测大阿卡那转折牌
      const turningCardsEn = ['Wheel of Fortune', 'Judgement', 'The Tower', 'Death'];
      const turningCardsZh = ['命运之轮', '审判', '塔', '死神'];
      cards.forEach((item) => {
        const nameToCheck = this.currentLang === 'en' ? item.card.originalName : item.card.name;
        const turningCards = this.currentLang === 'en' ? turningCardsEn : turningCardsZh;
        if (turningCards.includes(nameToCheck)) {
          text += this.t('trend_major_turn', deckManager.getCardName(item.card));
        }
      });

      // 检测连续正位/逆位
      let consecutiveUp = 0, consecutiveRev = 0;
      let maxConsecutiveUp = 0, maxConsecutiveRev = 0;
      for (let i = 0; i < trend.length; i++) {
        if (trend[i] === 1) {
          consecutiveUp++;
          consecutiveRev = 0;
          maxConsecutiveUp = Math.max(maxConsecutiveUp, consecutiveUp);
        } else {
          consecutiveRev++;
          consecutiveUp = 0;
          maxConsecutiveRev = Math.max(maxConsecutiveRev, consecutiveRev);
        }
      }

      if (maxConsecutiveRev >= 3) {
        text += this.currentLang === 'en'
          ? ' There is a sequence of ' + maxConsecutiveRev + ' reversed cards, indicating a period of significant challenge or inner resistance that needs sustained attention.'
          : ' 出现连续 ' + maxConsecutiveRev + ' 张逆位牌，显示有一段时期面临较大挑战或内在抗拒，需要持续关注。';
      }
      if (maxConsecutiveUp >= 3) {
        text += this.currentLang === 'en'
          ? ' There is a sequence of ' + maxConsecutiveUp + ' upright cards, indicating a period of strong positive energy and smooth progress.'
          : ' 出现连续 ' + maxConsecutiveUp + ' 张正位牌，显示有一段时期能量通畅，进展顺利。';
      }

      html += text + '</div></div>';
      return html;
    }

    // ============ 综合解读 - 生成行动建议 ============
    generateAdvice(mode, cards) {
      let html = '<div class="reading-section">';
      html += '<div class="reading-section-title">' + this.t('advice_title') + '</div>';
      html += '<div class="reading-section-body">';

      let text = '';
      let adviceCard = null;

      // ===== 牌阵差异化：建议牌位置 =====
      switch (mode) {
        case 'five':
        case 'career':
          adviceCard = cards[3] || null;
          break;
        case 'choice':
          adviceCard = cards[4] || null;
          break;
        case 'love':
        case 'broken':
        case 'exam':
        case 'jobchange':
        case 'travel':
        case 'shadow':
        case 'proscons':
        case 'year':
        case 'creative':
        case 'finance':
          adviceCard = cards[4] || null;
          break;
        case 'declutter':
          adviceCard = cards[3] || null;
          break;
        case 'horseshoe':
        case 'timeflow':
        case 'fatewheel':
        case 'monthly':
          adviceCard = cards[6] || null;
          break;
        case 'souljourney':
          adviceCard = cards[8] || null;
          break;
        case 'zodiac':
          adviceCard = cards[11] || null;
          break;
        case 'pastlife':
        case 'health':
        case 'family':
        case 'weekly':
        case 'decisiontree':
          adviceCard = cards[5] || null; // 决策树牌阵的建议在第6张（索引5）
          break;
        case 'lifepurpose':
          adviceCard = cards[7] || null;
          break;
        default:
          adviceCard = cards[cards.length - 1] || null;
          break;
      }

      // ===== 牌阵差异化：建议内容 =====
      if (adviceCard) {
        text += this.t('advice_intro');
        if (!adviceCard.isReversed) {
          text += this.t('advice_upright', deckManager.getCardName(adviceCard.card), this.getMeaningText(adviceCard.card, false));
          // 牌组差异化建议
          if (adviceCard.card.suit === 'wands') {
            text += this.t('advice_wands');
          } else if (adviceCard.card.suit === 'cups') {
            text += this.t('advice_cups');
          } else if (adviceCard.card.suit === 'swords') {
            text += this.t('advice_swords');
          } else if (adviceCard.card.suit === 'pentacles') {
            text += this.t('advice_pentacles');
          } else {
            text += this.t('advice_major');
          }
        } else {
          text += this.t('advice_reversed', deckManager.getCardName(adviceCard.card), this.getMeaningText(adviceCard.card, true));
        }
      }

      // ===== 牌阵差异化：当前/核心位置大阿卡那检测 =====
      const currentIdxMap = {
        'five': 1, 'career': 1, 'choice': 0, 'celtic': 0,
        'three': 1, 'single': 0, 'love': 0, 'broken': 2,
        'exam': 0, 'jobchange': 0, 'shadow': 0, 'lifepurpose': 0,
        'horseshoe': 1, 'timeflow': 1, 'fatewheel': 0, 'monthly': 0,
        'souljourney': 0, 'zodiac': 0, 'pastlife': 0, 'health': 0,
        'family': 0, 'weekly': 0, 'proscons': 0, 'travel': 0, 'yesno': 0,
        'creative': 0, 'finance': 0, 'declutter': 0
      };
      const currentIdx = currentIdxMap[mode] !== undefined ? currentIdxMap[mode] : (cards.length > 1 ? 1 : -1);
      if (currentIdx >= 0 && cards[currentIdx] && cards[currentIdx].card.suit === 'major') {
        text += this.t('advice_major_present', deckManager.getCardName(cards[currentIdx].card));
      }

      // ===== 牌阵差异化：专属建议追加 =====
      const isEn = this.currentLang === 'en';
      switch (mode) {
        case 'love':
          if (!isEn) {
            text += ' 恋人牌阵建议：不要只关注"我们是否会在一起"，更要关注"这段关系是否让我成长为更好的自己"。';
          } else {
            text += ' Love spread advice: Do not just focus on "will we be together", but more on "does this relationship help me grow into a better version of myself?"';
          }
          break;
        case 'broken':
          if (!isEn) {
            text += ' 复合牌阵建议：复合的本质不是"回到过去"，而是"以新的方式重新相遇"。如果双方都没有成长，复合只是重复旧的模式。';
          } else {
            text += ' Reunion spread advice: The essence of getting back together is not "going back to the past", but "meeting again in a new way". If both have not grown, reunion only repeats old patterns.';
          }
          break;
        case 'exam':
          if (!isEn) {
            text += ' 考试牌阵建议：塔罗可以预示能量倾向，但考试结果最终取决于你的准备程度。把牌面指引转化为具体的复习行动，才是真正的"改命"。';
          } else {
            text += ' Exam spread advice: Tarot can indicate energy tendencies, but exam results ultimately depend on your preparation. Transform the card guidance into concrete review actions — that is the real way to "change fate".';
          }
          break;
        case 'jobchange':
          if (!isEn) {
            text += ' 换工作牌阵建议：不要因为"逃避现状"而跳槽，要因为"向往新可能"而换工作。牌面指引的是方向，具体时机需要你结合现实判断。';
          } else {
            text += ' Job Change spread advice: Do not change jobs just to "escape the status quo", but to "embrace new possibilities". The cards show direction; specific timing requires your own real-world judgment.';
          }
          break;
        case 'shadow':
          if (!isEn) {
            text += ' 阴影牌阵建议：你排斥的他人特质，往往正是你拒绝承认的自己。下次当你对某人感到强烈反感时，问问自己："这是我吗？"';
          } else {
            text += ' Shadow spread advice: The traits you dislike in others are often exactly what you refuse to acknowledge in yourself. Next time you feel strong dislike toward someone, ask yourself: "Is this me?"';
          }
          break;
        case 'lifepurpose':
          if (!isEn) {
            text += ' 人生使命牌阵建议：你的使命不是"找到"的，而是"活出来"的。当你做某件事时感到"这就是我"而不是"这能带来什么"，你就在使命之中了。';
          } else {
            text += ' Life Purpose spread advice: Your purpose is not something you "find", but something you "live out". When you do something and feel "this is me" rather than "what can this bring me", you are already in your purpose.';
          }
          break;
        case 'health':
          if (!isEn) {
            text += ' 健康牌阵建议：身体是灵魂的日记本。每一个症状都可能在诉说一个未被倾听的情绪。疗愈需要身心同步进行，必要时请寻求专业医疗帮助。';
          } else {
            text += ' Health spread advice: The body is the soul\'s diary. Every symptom may be telling an unheard emotion. Healing requires working on both body and mind. Please seek professional medical help when necessary.';
          }
          break;
        case 'family':
          if (!isEn) {
            text += ' 家庭关系牌阵建议：我们无法选择家人，但可以选择与家人相处的方式。改变从自己开始——当你变了，家庭的能量场也会随之改变。';
          } else {
            text += ' Family spread advice: We cannot choose our family, but we can choose how to get along with them. Change starts with yourself — when you change, the family energy field changes too.';
          }
          break;
        case 'yesno':
          if (!isEn) {
            text += ' 是否牌阵建议：塔罗给出的是"能量倾向"而非"定论"。即使结果倾向"否"，也不代表永远不行——只是现在不是最佳时机。';
          } else {
            text += ' Yes/No spread advice: Tarot gives an "energy tendency", not a "final verdict". Even if the result leans toward "No", it does not mean never — just that now is not the best timing.';
          }
          break;
        case 'proscons':
          if (!isEn) {
            text += ' 利弊分析建议：最困难的决策往往不是"利大于弊"那么简单。真正的答案通常在"即使有弊，我也愿意"的那个选项里。';
          } else {
            text += ' Pros & Cons advice: The hardest decisions are rarely as simple as "more pros than cons". The real answer is usually in the option where you think "I am willing even with the cons".';
          }
          break;
        // 新增：决策树牌阵的综合解读
        case 'decisiontree':
          if (!isEn) {
            text += '\n\n📊 决策树分析：\n';
            
            // 分析选择A的短期vs长期
            const aShort = !cards[1].isReversed ? 1 : 0;
            const aLong = !cards[2].isReversed ? 1 : 0;
            const bShort = !cards[3].isReversed ? 1 : 0;
            const bLong = !cards[4].isReversed ? 1 : 0;
            
            text += '【选择A】短期：' + (aShort ? '✅ 顺利' : '⚠️ 有挑战') + ' | 长期：' + (aLong ? '✅ 向好' : '⚠️ 需谨慎') + '\n';
            text += '【选择B】短期：' + (bShort ? '✅ 顺利' : '⚠️ 有挑战') + ' | 长期：' + (bLong ? '✅ 向好' : '⚠️ 需谨慎') + '\n\n';
            
            // 给出差异化建议
            if (aShort && !aLong) {
              text += '💡 选择A是「蜜糖陷阱」——短期甜，长期苦。小心！\n';
            } else if (!aShort && aLong) {
              text += '💡 选择A是「先苦后甜」——短期痛，长期爽。你愿意吃苦吗？\n';
            }
            
            if (bShort && !bLong) {
              text += '💡 选择B也是「蜜糖陷阱」——短期甜，长期苦。小心！\n';
            } else if (!bShort && bLong) {
              text += '💡 选择B也是「先苦后甜」——短期痛，长期爽。你愿意吃苦吗？\n';
            }
            
            if (aLong && bLong) {
              text += '🌟 好消息：两个选择的长期结果都不错！那就选那个让你短期更开心的吧。\n';
            } else if (!aLong && !bLong) {
              text += '⚠️ 提醒：两个选择的长期都有挑战。此时要问自己：哪个挑战我更愿意面对？\n';
            }
            
            // 建议牌的解读
            text += '\n【建议】';
            if (cards[5].card.suit === 'major') {
              text += ' 这张牌是「人生课题级」的，说明这个决策会深刻影响你的成长轨迹。不要轻率，但也不要因为害怕而逃避。';
            } else if (cards[5].card.suit === 'pentacles') {
              text += ' 这张牌提醒你要考虑实际条件——钱、时间、资源够吗？梦想很重要，但面包也很重要。';
            } else if (cards[5].card.suit === 'cups') {
              text += ' 这张牌指向你的心。逻辑上再完美的选择，如果心里不愿意，也很难坚持。听听内心的声音。';
            } else if (cards[5].card.suit === 'swords') {
              text += ' 这张牌要求你理性分析。不要被情绪裹挟，拿出纸笔，列出利弊，用大脑做决策。';
            } else if (cards[5].card.suit === 'wands') {
              text += ' 这张牌关于行动和激情。如果选择让你觉得「等不及要开始」，那可能就是它了！';
            }
          } else {
            text += '\n\n📊 Decision Tree Analysis:\n';
            
            const aShort = !cards[1].isReversed ? 1 : 0;
            const aLong = !cards[2].isReversed ? 1 : 0;
            const bShort = !cards[3].isReversed ? 1 : 0;
            const bLong = !cards[4].isReversed ? 1 : 0;
            
            text += '[Option A] Short: ' + (aShort ? '✅ Good' : '⚠️ Challenging') + ' | Long: ' + (aLong ? '✅ Good' : '⚠️ Caution') + '\n';
            text += '[Option B] Short: ' + (bShort ? '✅ Good' : '⚠️ Challenging') + ' | Long: ' + (bLong ? '✅ Good' : '⚠️ Caution') + '\n\n';
            
            if (aShort && !aLong) {
              text += '💡 Option A is a "honey trap" — sweet now, bitter later. Be careful!\n';
            } else if (!aShort && aLong) {
              text += '💡 Option A is "bitter now, sweet later" — painful now, great later. Are you willing to endure?\n';
            }
            
            if (bShort && !bLong) {
              text += '💡 Option B is also a "honey trap" — sweet now, bitter later. Be careful!\n';
            } else if (!bShort && bLong) {
              text += '💡 Option B is also "bitter now, sweet later" — painful now, great later. Are you willing to endure?\n';
            }
            
            if (aLong && bLong) {
              text += '🌟 Good news: Both options have good long-term results! Then pick the one that makes you happier short-term.\n';
            } else if (!aLong && !bLong) {
              text += '⚠️ Warning: Both options have challenging long-term results. Ask yourself: Which challenge am I more willing to face?\n';
            }
            
            text += '\n[Advice]';
            if (cards[5].card.suit === 'major') {
              text += ' This card is "life-lesson level", indicating this decision will profoundly affect your growth path. Don\'t be rash, but don\'t escape because of fear either.';
            } else if (cards[5].card.suit === 'pentacles') {
              text += ' This card reminds you to consider practical conditions — money, time, resources. Dreams matter, but bread matters too.';
            } else if (cards[5].card.suit === 'cups') {
              text += ' This card points to your heart. No matter how perfect a choice is logically, if your heart isn\'t in it, it\'s hard to persist. Listen to your inner voice.';
            } else if (cards[5].card.suit === 'swords') {
              text += ' This card demands rational analysis. Don\'t be swayed by emotions. Take out paper, list pros and cons, use your brain to decide.';
            } else if (cards[5].card.suit === 'wands') {
              text += ' This card is about action and passion. If a choice makes you think "can\'t wait to start", then that might be it!';
            }
          }
          break;
        case 'travel':
          if (!isEn) {
            text += ' 旅行牌阵建议：最好的旅行不是"完美按计划执行"，而是"带着开放的心迎接意外"。逆位牌出现时，恰恰是旅程中可能最难忘的时刻。';
          } else {
            text += ' Travel spread advice: The best travel is not "perfectly executing the plan", but "greeting surprises with an open heart". When reversed cards appear, those may be the most unforgettable moments of the journey.';
          }
          break;
        case 'finance':
          if (!isEn) {
            text += ' 财务投资牌阵建议：塔罗解读的是能量趋势，不等于投资建议。任何财务决策请结合自身风险承受能力和专业理财意见，切勿孤注一掷。';
          } else {
            text += ' Finance spread advice: Tarot interprets energy trends, not investment advice. Any financial decision should combine with your own risk tolerance and professional advice. Never put all your eggs in one basket.';
          }
          break;
        case 'declutter':
          if (!isEn) {
            text += ' 断舍离牌阵建议：断舍离不是"丢弃一切"，而是"留下真正重要的"。如果某样东西让你犹豫，说明你还需要它——真正的放下是自然而然的。';
          } else {
            text += ' Declutter spread advice: Decluttering is not "throwing away everything", but "keeping what truly matters". If something makes you hesitate, you still need it — true letting go happens naturally.';
          }
          break;
        default:
          break;
      }

      // 根据逆位数量给出通用建议
      const reversedCount = cards.filter((item) => item.isReversed).length;
      if (reversedCount >= cards.length * 0.5) {
        text += this.t('advice_many_reversed');
      }

      // 根据牌组组合给出更细致的建议
      const suits = cards.map(c => c.card.suit);
      const uniqueSuits = [...new Set(suits)];
      if (uniqueSuits.length === 1 && uniqueSuits[0] !== 'major') {
        const suitNames = { wands: '权杖', cups: '圣杯', swords: '宝剑', pentacles: '星币', fire: '火', water: '水', clouds: '云', rainbow: '彩虹' };
        const suitName = suitNames[uniqueSuits[0]] || uniqueSuits[0];
        text += this.currentLang === 'en'
          ? ' All cards are from the ' + uniqueSuits[0] + ' suit, suggesting you should focus entirely on this area of life.'
          : ' 本次牌面全部为' + suitName + '牌组，建议你将注意力完全集中在这个生活领域。';
      } else if (uniqueSuits.length >= 3) {
        text += this.currentLang === 'en'
          ? ' The cards span multiple suits, indicating that your situation involves multiple aspects. Try to prioritize and focus on the most important one.'
          : ' 牌面涉及多个牌组，说明你的处境涉及多个面向。尝试分清优先级，聚焦在最有影响力的那个方面。';
      }

      html += '<div class="reading-advice">' + text + '</div></div></div>';
      return html;
    }

    // ============ 新增功能1：综合解读摘要 ============
    generateSummary(cards, mode) {
      let html = '<div class="reading-section reading-summary">';
      html += '<div class="reading-section-title">' + this.t('summary_title') + '</div>';
      html += '<div class="reading-section-body">';

      let text = '';
      const majorCount = cards.filter(c => c.card.suit === 'major').length;
      const reversedCount = cards.filter(c => c.isReversed).length;
      const uprightCount = cards.length - reversedCount;
      const spreadName = this.getLocalizedSpreadName(mode);

      // 基本摘要
      text += this.t('summary_intro', spreadName);
      
      // 大阿卡那分析
      if (majorCount > 0) {
        const majorNames = cards
          .filter(c => c.card.suit === 'major')
          .map(c => deckManager.getCardName(c.card) + ' ' + this.getPosText(c.isReversed))
          .join(this.currentLang === 'en' ? ', ' : '、');
        text += this.t('summary_major', majorCount, majorNames);
      }

      // 正逆位分析
      if (reversedCount > uprightCount) {
        text += this.t('summary_mostly_reversed');
      } else if (uprightCount > reversedCount) {
        text += this.t('summary_mostly_upright');
      } else {
        text += this.t('summary_balanced');
      }

      html += '<p>' + text + '</p></div></div>';
      return html;
    }

    // ============ 新增功能2：关键词标签 ============
    generateKeywordTags(cards) {
      let html = '<div class="reading-section keyword-tags-container">';
      html += '<div class="reading-section-title">' + this.t('keyword_tags_title') + '</div>';
      html += '<div class="reading-section-body">';
      html += '<p class="keyword-tags-intro">' + this.t('keyword_tags_intro') + '</p>';
      html += '<div class="keyword-tags-list">';

      cards.forEach((item) => {
        const keywords = this.getCardKeywords(item.card, item.isReversed);
        const cardName = deckManager.getCardName(item.card);
        const posText = this.getPosText(item.isReversed);
        
        html += '<div class="keyword-tag-item">';
        html += '<div class="keyword-tag-card-name">' + cardName + ' ' + posText + '</div>';
        html += '<div class="keyword-tag-list">';
        keywords.forEach((kw) => {
          html += '<span class="keyword-tag">' + kw + '</span>';
        });
        html += '</div></div>';
      });

      html += '</div></div></div>';
      return html;
    }

    // 获取单张牌的关键词
    getCardKeywords(card, isReversed) {
      // 大阿卡那关键词库
      const majorKeywords = {
        'major-00': { 
          upright: ['新的开始', '冒险', '纯真', '自由'], 
          reversed: ['鲁莽', '风险', '犹豫', '拖延'],
          en: { upright: ['New Beginning', 'Adventure', 'Innocence', 'Freedom'], reversed: ['Reckless', 'Risk', 'Hesitation', 'Delay'] }
        },
        'major-01': { 
          upright: ['意志力', '创造力', '技能', '行动力'], 
          reversed: ['拖延', '缺乏自信', '技能不足', '计划落空'],
          en: { upright: ['Willpower', 'Creativity', 'Skill', 'Action'], reversed: ['Delay', 'Lack Confidence', 'Lack Skill', 'Plan Fails'] }
        },
        'major-02': { 
          upright: ['直觉', '潜意识', '内在智慧', '神秘'], 
          reversed: ['压抑直觉', '恐惧', '表面化', '逃避'],
          en: { upright: ['Intuition', 'Subconscious', 'Inner Wisdom', 'Mystery'], reversed: ['Repressed Intuition', 'Fear', 'Superficial', 'Avoidance'] }
        },
        'major-03': { 
          upright: ['丰收', '成果', '团队合作', '创造力'], 
          reversed: ['缺乏成果', '团队合作失败', '延迟', '浪费'],
          en: { upright: ['Abundance', 'Result', 'Teamwork', 'Creativity'], reversed: ['Lack Result', 'Team Fail', 'Delay', 'Waste'] }
        },
        'major-04': { 
          upright: ['传统', '结构', '规则', '稳定'], 
          reversed: ['打破传统', '混乱', '缺乏结构', '反叛'],
          en: { upright: ['Tradition', 'Structure', 'Rules', 'Stability'], reversed: ['Break Tradition', 'Chaos', 'Lack Structure', 'Rebellion'] }
        },
        'major-05': { 
          upright: ['冲突', '分歧', '竞争', '挑战'], 
          reversed: ['避免冲突', '和解', '内在冲突', '压抑'],
          en: { upright: ['Conflict', 'Disagreement', 'Competition', 'Challenge'], reversed: ['Avoid Conflict', 'Reconciliation', 'Inner Conflict', 'Repression'] }
        },
        'major-06': { 
          upright: ['爱情', '选择', '和谐', '价值观'], 
          reversed: ['关系不和', '错误选择', '价值观冲突', '不和谐'],
          en: { upright: ['Love', 'Choice', 'Harmony', 'Values'], reversed: ['Relationship Disharmony', 'Wrong Choice', 'Value Conflict', 'Disharmony'] }
        },
        'major-07': { 
          upright: ['胜利', '勇气', '意志', '自信'], 
          reversed: ['自卑', '犹豫', '恐惧失败', '缺乏勇气'],
          en: { upright: ['Victory', 'Courage', 'Will', 'Confidence'], reversed: ['Inferiority', 'Hesitation', 'Fear Failure', 'Lack Courage'] }
        },
        'major-08': { 
          upright: ['力量', '勇气', '耐心', '柔能克刚'], 
          reversed: ['软弱', '自我怀疑', '缺乏勇气', '不耐心'],
          en: { upright: ['Strength', 'Courage', 'Patience', 'Gentle Power'], reversed: ['Weakness', 'Self-Doubt', 'Lack Courage', 'Impatience'] }
        },
        'major-09': { 
          upright: ['智慧', '内省', '寻求真理', '孤独'], 
          reversed: ['教条主义', '缺乏内省', '孤立', '错误判断'],
          en: { upright: ['Wisdom', 'Introspection', 'Seeking Truth', 'Solitude'], reversed: ['Dogmatism', 'Lack Introspection', 'Isolation', 'Misjudgment'] }
        },
        'major-10': { 
          upright: ['命运', '转折点', '机遇', '轮回'], 
          reversed: ['抵抗命运', '延迟', '错过机会', '缺乏控制'],
          en: { upright: ['Fate', 'Turning Point', 'Opportunity', 'Cycle'], reversed: ['Resist Fate', 'Delay', 'Miss Opportunity', 'Lack Control'] }
        },
        'major-11': { 
          upright: ['正义', '真相', '因果', '平衡'], 
          reversed: ['不公正', '不诚实', '逃避责任', '失衡'],
          en: { upright: ['Justice', 'Truth', 'Karma', 'Balance'], reversed: ['Injustice', 'Dishonesty', 'Avoid Responsibility', 'Imbalance'] }
        },
        'major-12': { 
          upright: ['牺牲', '奉献', '精神指引', '信仰'], 
          reversed: ['自我牺牲', '受害者心态', '缺乏信仰', '浪费'],
          en: { upright: ['Sacrifice', 'Devotion', 'Spiritual Guidance', 'Faith'], reversed: ['Self-Sacrifice', 'Victim Mentality', 'Lack Faith', 'Waste'] }
        },
        'major-13': { 
          upright: ['结束', '转变', '释放', '新生'], 
          reversed: ['抗拒改变', '无法释怀', '停滞', '恐惧'],
          en: { upright: ['End', 'Transformation', 'Release', 'Rebirth'], reversed: ['Resist Change', 'Unable to Let Go', 'Stagnation', 'Fear'] }
        },
        'major-14': { 
          upright: ['平衡', '调和', '耐心', '适度'], 
          reversed: ['不平衡', '过度', '缺乏调和', '不耐烦'],
          en: { upright: ['Balance', 'Harmony', 'Patience', 'Moderation'], reversed: ['Imbalance', 'Excess', 'Lack Harmony', 'Impatience'] }
        },
        'major-15': { 
          upright: ['诱惑', '束缚', '物质主义', '欲望'], 
          reversed: ['解放', '克服诱惑', '觉醒', '自由'],
          en: { upright: ['Temptation', 'Bondage', 'Materialism', 'Desire'], reversed: ['Liberation', 'Overcome Temptation', 'Awakening', 'Freedom'] }
        },
        'major-16': { 
          upright: ['突变', '解放', '打破旧有', '觉醒'], 
          reversed: ['避免灾难', '抵抗改变', '延迟崩溃', '恐惧'],
          en: { upright: ['Sudden Change', 'Liberation', 'Break Old', 'Awakening'], reversed: ['Avoid Disaster', 'Resist Change', 'Delay Collapse', 'Fear'] }
        },
        'major-17': { 
          upright: ['希望', '灵感', '平静', '治愈'], 
          reversed: ['绝望', '失望', '缺乏灵感', '悲观'],
          en: { upright: ['Hope', 'Inspiration', 'Calm', 'Healing'], reversed: ['Despair', 'Disappointment', 'Lack Inspiration', 'Pessimism'] }
        },
        'major-18': { 
          upright: ['幻觉', '恐惧', '潜意识', '不安'], 
          reversed: ['释放恐惧', '真相大白', '克服幻觉', '内在平静'],
          en: { upright: ['Illusion', 'Fear', 'Subconscious', 'Unease'], reversed: ['Release Fear', 'Truth Revealed', 'Overcome Illusion', 'Inner Peace'] }
        },
        'major-19': { 
          upright: ['快乐', '活力', '成功', '阳光'], 
          reversed: ['过度乐观', '延迟', '缺乏成功', '内在小孩受伤'],
          en: { upright: ['Joy', 'Vitality', 'Success', 'Sunshine'], reversed: ['Over-Optimism', 'Delay', 'Lack Success', 'Inner Child Wounded'] }
        },
        'major-20': { 
          upright: ['觉醒', '复活', '呼唤', '重生'], 
          reversed: ['逃避呼唤', '延迟', '内在审判', '抗拒觉醒'],
          en: { upright: ['Awakening', 'Resurrection', 'Call', 'Rebirth'], reversed: ['Avoid Call', 'Delay', 'Inner Judgment', 'Resist Awakening'] }
        },
        'major-21': { 
          upright: ['完成', '成就', '整合', '圆满'], 
          reversed: ['未完成', '缺乏成就', '延迟', '不完整'],
          en: { upright: ['Completion', 'Achievement', 'Integration', 'Fulfillment'], reversed: ['Incomplete', 'Lack Achievement', 'Delay', 'Lack Closure'] }
        }
      };

      // 小阿卡那默认关键词
      const defaultKeywords = {
        upright: ['能量', '行动', '成长'],
        reversed: ['阻碍', '反思', '调整'],
        en: { upright: ['Energy', 'Action', 'Growth'], reversed: ['Obstacle', 'Reflection', 'Adjustment'] }
      };

      // 获取关键词
      let keywordsData;
      if (card.suit === 'major') {
        // 兼容 card.id 为数字或字符串的情况
        let majorKey = card.id;
        if (typeof card.id === 'number') {
          majorKey = `major-${String(card.id).padStart(2, '0')}`;
        }
        if (majorKeywords[majorKey]) {
          keywordsData = majorKeywords[majorKey];
        } else {
          keywordsData = defaultKeywords;
        }
      } else {
        keywordsData = defaultKeywords;
      }

      const lang = this.currentLang === 'en' ? 'en' : 'default';
      if (lang === 'en') {
        return keywordsData.en[isReversed ? 'reversed' : 'upright'] || keywordsData.en.upright;
      } else {
        return keywordsData[isReversed ? 'reversed' : 'upright'] || keywordsData.upright;
      }
    }

    // ============ 新增功能3：行动步骤清单 ============
    generateActionSteps(cards, mode) {
      let html = '<div class="reading-section action-steps-container">';
      html += '<div class="reading-section-title">' + this.t('action_steps_title') + '</div>';
      html += '<div class="reading-section-body">';
      html += '<p class="action-steps-intro">' + this.t('action_steps_intro') + '</p>';

      // 根据牌面类型生成行动步骤
      const steps = this.generateStepsByCards(cards, mode);
      
      html += '<div class="action-steps-list">';
      steps.forEach((step) => {
        html += '<div class="action-step-item">';
        html += '<div class="action-step-time">' + step.time + '</div>';
        html += '<div class="action-step-content">';
        html += '<div class="action-step-title">' + step.title + '</div>';
        html += '<div class="action-step-desc">' + step.desc + '</div>';
        html += '</div></div>';
      });
      html += '</div></div></div>';
      return html;
    }

    // 根据牌面生成行动步骤
    generateStepsByCards(cards, mode) {
      const steps = [];
      const hasMajor = cards.some(c => c.card.suit === 'major');
      const reversedCount = cards.filter(c => c.isReversed).length;
      const dominantSuit = this.getDominantSuit(cards);

      // 立即行动
      let immediateAction = '';
      if (dominantSuit === 'wands') {
        immediateAction = this.currentLang === 'en' ? 'Take the first step today — do not wait for perfect conditions.' : '今天迈出第一步——不要等待完美条件。';
      } else if (dominantSuit === 'cups') {
        immediateAction = this.currentLang === 'en' ? 'Listen to your heart and express your true feelings.' : '倾听内心，表达真实感受。';
      } else if (dominantSuit === 'swords') {
        immediateAction = this.currentLang === 'en' ? 'Write down your thoughts to clarify confusion.' : '写下想法，理清困惑。';
      } else if (dominantSuit === 'pentacles') {
        immediateAction = this.currentLang === 'en' ? 'Check your finances and make a practical plan.' : '检查财务状况，制定实际计划。';
      } else {
        immediateAction = this.currentLang === 'en' ? 'Meditate or journal to connect with your inner guidance.' : '冥想或写日记，连接内在指引。';
      }
      steps.push({
        time: this.t('action_step_immediate'),
        title: this.currentLang === 'en' ? 'First Step' : '第一步',
        desc: immediateAction
      });

      // 短期行动
      let shortTermAction = '';
      if (reversedCount >= cards.length * 0.5) {
        shortTermAction = this.currentLang === 'en' ? 'Review what needs to be released or adjusted. Make space for new energy.' : '检视需要释放或调整的部分，为新能量腾出空间。';
      } else {
        shortTermAction = this.currentLang === 'en' ? 'Build on current momentum and take concrete actions toward your goal.' : '借助当前动能，朝着目标采取具体行动。';
      }
      steps.push({
        time: this.t('action_step_short_term'),
        title: this.currentLang === 'en' ? 'Consolidate Foundation' : '巩固基础',
        desc: shortTermAction
      });

      // 中期行动
      let mediumTermAction = '';
      if (hasMajor) {
        mediumTermAction = this.currentLang === 'en' ? 'Reflect on the life lessons the Major Arcana cards are bringing. These are not small matters.' : '反思大阿卡那牌带来的生命课题，这些不是小事。';
      } else {
        mediumTermAction = this.currentLang === 'en' ? 'Establish stable routines and habits that support your goal.' : '建立支持目标的稳定 routines 和习惯。';
      }
      steps.push({
        time: this.t('action_step_medium_term'),
        title: this.currentLang === 'en' ? 'Deepen Practice' : '深化实践',
        desc: mediumTermAction
      });

      // 长期行动
      let longTermAction = this.currentLang === 'en' 
        ? 'Review your progress after three months and adjust your direction accordingly.' 
        : '三个月后回顾进展，并相应调整方向。';
      steps.push({
        time: this.t('action_step_long_term'),
        title: this.currentLang === 'en' ? 'Long-term Vision' : '长期愿景',
        desc: longTermAction
      });

      return steps;
    }

    // 获取主导牌组
    getDominantSuit(cards) {
      const suitCounts = { wands: 0, cups: 0, swords: 0, pentacles: 0, major: 0 };
      cards.forEach((c) => {
        suitCounts[c.card.suit] = (suitCounts[c.card.suit] || 0) + 1;
      });
      let maxSuit = 'major';
      let maxCount = 0;
      for (const suit in suitCounts) {
        if (suitCounts[suit] > maxCount) {
          maxCount = suitCounts[suit];
          maxSuit = suit;
        }
      }
      return maxSuit;
    }

    // ============ 新增功能4：元素平衡分析 ============
    analyzeElementBalance(cards) {
      let html = '<div class="reading-section element-balance-container">';
      html += '<div class="reading-section-title">' + this.t('element_balance_title') + '</div>';
      html += '<div class="reading-section-body">';
      html += '<p class="element-balance-intro">' + this.t('element_balance_intro') + '</p>';

      // 统计四元素（支持传统塔罗 + 奥修禅卡花色）
      const elements = { fire: 0, water: 0, air: 0, earth: 0 };
      cards.forEach((item) => {
        const suit = item.card.suit;
        if (suit === 'wands' || suit === 'fire') elements.fire++;
        else if (suit === 'cups' || suit === 'water') elements.water++;
        else if (suit === 'swords' || suit === 'clouds') elements.air++;
        else if (suit === 'pentacles' || suit === 'rainbow') elements.earth++;
        // 大阿卡那不计元素，或视为全能元素
      });

      const total = elements.fire + elements.water + elements.air + elements.earth;
      const hasCards = total > 0;

      // 显示元素分布
      html += '<div class="element-balance-bars">';
      const elementKeys = [
        { key: 'fire', nameKey: 'element_fire', color: '#FF6B6B' },
        { key: 'water', nameKey: 'element_water', color: '#4ECDC4' },
        { key: 'air', nameKey: 'element_air', color: '#45B7D1' },
        { key: 'earth', nameKey: 'element_earth', color: '#96CEB4' }
      ];

      elementKeys.forEach((elem) => {
        const count = elements[elem.key];
        const percent = hasCards ? Math.round((count / total) * 100) : 0;
        const name = this.t(elem.nameKey);
        html += '<div class="element-balance-row">';
        html += '<div class="element-balance-label">' + name + '</div>';
        html += '<div class="element-balance-bar-bg">';
        html += '<div class="element-balance-bar-fill" style="width:' + percent + '%;background:' + elem.color + ';"></div>';
        html += '</div>';
        html += '<div class="element-balance-count">' + count + '</div>';
        html += '</div>';
      });
      html += '</div>';

      // 分析主导元素和缺失元素
      let dominantElement = '';
      let missingElements = [];
      let maxCount = 0;
      
      for (const key in elements) {
        if (elements[key] > maxCount) {
          maxCount = elements[key];
          dominantElement = key;
        }
        if (elements[key] === 0) {
          missingElements.push(key);
        }
      }

      // 输出分析建议
      if (hasCards) {
        if (missingElements.length === 0) {
          html += '<div class="element-balance-analysis">' + this.t('element_balanced') + '</div>';
        } else {
          const missingNames = missingElements.map((e) => {
            const nameKey = 'element_' + e;
            return this.t(nameKey);
          }).join(this.currentLang === 'en' ? ', ' : '、');
          html += '<div class="element-balance-analysis"><strong>' + this.t('element_missing') + ':</strong> ' + missingNames + '</div>';
          
          // 给出补充建议
          missingElements.forEach((elem) => {
            let advice = '';
            if (elem === 'fire') {
              advice = this.currentLang === 'en' ? 'Exercise, start new projects, express passion.' : '运动、启动新项目、表达热情。';
            } else if (elem === 'water') {
              advice = this.currentLang === 'en' ? 'Connect with emotions, nurture relationships, practice empathy.' : '连接情感、滋养关系、练习同理心。';
            } else if (elem === 'air') {
              advice = this.currentLang === 'en' ? 'Read, communicate, analyze problems, meditate.' : '阅读、沟通、分析问题、冥想。';
            } else if (elem === 'earth') {
              advice = this.currentLang === 'en' ? 'Manage finances, build routines, spend time in nature.' : '管理财务、建立常规、花时间在大自然中。';
            }
            html += '<div class="element-balance-advice">' + this.t('element_advice_missing', this.t('element_' + elem), advice) + '</div>';
          });
        }

        // 主导元素建议
        if (dominantElement && maxCount > 0) {
          let advice = '';
          if (dominantElement === 'fire') {
            advice = this.currentLang === 'en' ? 'Use your passion and initiative to drive things forward, but be careful not to be too impulsive.' : '利用你的热情和主动性推动事情前进，但要注意不要过于冲动。';
          } else if (dominantElement === 'water') {
            advice = this.currentLang === 'en' ? 'Trust your intuition and emotions, but be careful not to be overly sentimental.' : '相信你的直觉和情感，但要注意不要过于情绪化。';
          } else if (dominantElement === 'air') {
            advice = this.currentLang === 'en' ? 'Use rational analysis and communication skills, but be careful not to be too cold and rational.' : '运用理性分析和沟通能力，但要注意不要过于冷酷理性。';
          } else if (dominantElement === 'earth') {
            advice = this.currentLang === 'en' ? 'Focus on practical results and long-term planning, but be careful not to be too stubborn.' : '专注于实际成果和长期规划，但要注意不要过于固执。';
          }
          const dominantName = this.t('element_' + dominantElement);
          html += '<div class="element-balance-advice"><strong>' + this.t('element_dominant') + ':</strong> ' + this.t('element_advice_dominant', dominantName, advice) + '</div>';
        }
      }

      html += '</div></div>';
      return html;
    }

    // ============ 牌阵专属解读段落（新增） ============
    generateSpreadSpecificReading(mode, cards, positions) {
      let html = '<div class="reading-section spread-specific">';
      html += '<div class="reading-section-title">' + (this.currentLang === 'en' ? '★ Spread-Specific Reading' : '★ 牌阵专属解读') + '</div>';
      html += '<div class="reading-section-body">';

      let text = '';
      const isEn = this.currentLang === 'en';

      switch (mode) {
        // ---- 单牌占卜 ----
        case 'single':
          if (!isEn) {
            text += '单牌占卜是一天方向的浓缩指引。';
            if (cards[0].isReversed) {
              text += '逆位出现，提醒你今日需要特别留意内在状态——可能有隐藏的阻力或未处理的情绪。正位则预示今日能量通畅，适合推进计划。';
            } else {
              text += '正位出现，预示今日能量通畅，是行动的好日子。跟随这张牌的指引，让它成为你今日的主题。';
            }
          } else {
            text += 'A single card is a condensed guidance for the day. ';
            if (cards[0].isReversed) {
              text += 'The reversed card suggests paying attention to your inner state today — there may be hidden resistance or unprocessed emotions.';
            } else {
              text += 'The upright card indicates smooth energy today. It is a good day to take action. Let this card be your theme for the day.';
            }
          }
          break;

        // ---- 三牌阵 ----
        case 'three': {
          const past = cards[0], now = cards[1], future = cards[2];
          if (!isEn) {
            text += '三牌阵呈现出清晰的时间线。';
            if (!past.isReversed && !now.isReversed && !future.isReversed) {
              text += '三张正位连成一条顺畅的能量流，说明过去、现在与未来都在良性循环中，顺势而为即可。';
            } else if (past.isReversed && !future.isReversed) {
              text += '过去逆位、未来正位，说明你正在从旧有模式中走出来，未来的光明已经隐约可见。这是疗愈与转化的过程。';
            } else if (!past.isReversed && future.isReversed) {
              text += '过去正位、未来逆位，提醒你不要因为过去的顺利而掉以轻心，未来可能有需要调整的之处。提前准备是明智的。';
            } else {
              text += '三张牌呈现复杂的能量交织。过去的影响仍在，但现在的选择可以改写未来的走向。你不是命运的囚徒，而是自己故事的作者。';
            }
          } else {
            text += 'The three-card spread shows a clear timeline. ';
            if (!past.isReversed && !now.isReversed && !future.isReversed) {
              text += 'Three upright cards form a smooth energy flow, indicating a positive cycle across past, present, and future. Simply go with the flow.';
            } else if (past.isReversed && !future.isReversed) {
              text += 'Past reversed, future upright — you are walking out of old patterns, and the light of the future is already visible. This is a process of healing and transformation.';
            } else if (!past.isReversed && future.isReversed) {
              text += 'Past upright, future reversed — do not be complacent because of past success. The future may require adjustments. Preparing in advance is wise.';
            } else {
              text += 'The three cards show complex energy interweaving. The influence of the past remains, but choices now can rewrite the future. You are not a prisoner of fate, but the author of your own story.';
            }
          }
          break;
        }

        // ---- 凯尔特十字 ----
        case 'celtic': {
          const current = cards[0], challenge = cards[1], outcome = cards[9];
          if (!isEn) {
            text += '凯尔特十字覆盖了问题的全部层面。核心牌「' + deckManager.getCardName(current.card) + ' ' + this.getPosText(current.isReversed) + '」揭示了你当前最关注的能量；';
            text += '「挑战」位置的「' + deckManager.getCardName(challenge.card) + ' ' + this.getPosText(challenge.isReversed) + '」指出了需要克服的障碍；';
            text += '而「最终结果」位置的「' + deckManager.getCardName(outcome.card) + ' ' + this.getPosText(outcome.isReversed) + '」则预示了综合所有因素后最可能的归宿。';
            if (current.card.suit === 'major' || challenge.card.suit === 'major' || outcome.card.suit === 'major') {
              text += ' 大阿卡那牌出现在关键位置，说明这个问题触及你灵魂层面的课题，值得深度反思而非浅层应对。';
            }
          } else {
            text += 'The Celtic Cross covers all aspects of the question. The core card "' + deckManager.getCardName(current.card) + ' ' + this.getPosText(current.isReversed) + '" reveals the energy you are most concerned about; ';
            text += '"Challenge" position "' + deckManager.getCardName(challenge.card) + ' ' + this.getPosText(challenge.isReversed) + '" points to the obstacle to overcome; ';
            text += 'and "Outcome" position "' + deckManager.getCardName(outcome.card) + ' ' + this.getPosText(outcome.isReversed) + '" indicates the most likely destination after integrating all factors.';
            if (current.card.suit === 'major' || challenge.card.suit === 'major' || outcome.card.suit === 'major') {
              text += ' Major Arcana cards appear in key positions, indicating this question touches soul-level lessons, deserving deep reflection rather than superficial response.';
            }
          }
          break;
        }

        // ---- 关系牌阵 ----
        case 'relation': {
          const you = cards[0], partner = cards[1], yourAtt = cards[2], theirAtt = cards[3];
          if (!isEn) {
            text += '关系牌阵揭示了人际互动的全貌。';
            if (you.card.suit === partner.card.suit) {
              text += '你与对方同属「' + this.suitName(you.card.suit, false) + '」能量，说明你们有深层的共鸣或相似的处事方式——这可以是优势，也可能导致视角过于相似而缺乏互补。';
            }
            if (yourAtt.isReversed !== theirAtt.isReversed) {
              text += ' 你们对这段关系的态度不同步：一方可能比另一方更投入或更犹豫。沟通彼此的真实感受是改善关系的关键。';
            }
            if (cards[4].card.suit === 'major') {
              text += ' 「当前关系」位置出现大阿卡那牌，说明这段关系对你有着超越普通交往的意义，可能是你灵魂成长的重要一环。';
            }
          } else {
            text += 'The Relationship spread reveals the full picture of interpersonal interaction. ';
            if (you.card.suit === partner.card.suit) {
              text += 'You and the other person share the same "' + this.suitName(you.card.suit, true) + '" energy, indicating deep resonance or similar ways of handling things.';
            }
            if (yourAtt.isReversed !== theirAtt.isReversed) {
              text += ' Your attitudes toward this relationship are out of sync. Communicating true feelings is key to improving the relationship.';
            }
          }
          break;
        }

        // ---- 二选一牌阵 ----
        case 'choice': {
          const optA = cards[0], optB = cards[1], outA = cards[2], outB = cards[3];
          if (!isEn) {
            text += '二选一牌阵帮助你从结果倒推选择。';
            const aScore = (!outA.isReversed ? 1 : 0) + (outA.card.suit === 'major' ? 1 : 0);
            const bScore = (!outB.isReversed ? 1 : 0) + (outB.card.suit === 'major' ? 1 : 0);
            if (aScore > bScore) {
              text += '从结果牌来看，选项A（' + deckManager.getCardName(optA.card) + '）的能量更积极，更可能带来你期望的结果。';
            } else if (bScore > aScore) {
              text += '从结果牌来看，选项B（' + deckManager.getCardName(optB.card) + '）的能量更积极，更可能带来你期望的结果。';
            } else {
              text += '两个选项的结果牌能量相当，说明选择哪个都可能面临类似的挑战。此时应跟随内心最真实的渴望，而非仅仅权衡利弊。';
            }
            if (cards[4].card.suit === 'pentacles') {
              text += ' 建议牌是星币组，提醒你做决定时要考虑实际条件和资源限制。';
            } else if (cards[4].card.suit === 'cups') {
              text += ' 建议牌是圣杯组，提醒你做决定时要倾听内心的声音和情感需求。';
            }
          } else {
            text += 'The Choice spread helps you reason backward from outcomes. ';
            const aScore = (!outA.isReversed ? 1 : 0) + (outA.card.suit === 'major' ? 1 : 0);
            const bScore = (!outB.isReversed ? 1 : 0) + (outB.card.suit === 'major' ? 1 : 0);
            if (aScore > bScore) {
              text += 'From the outcome cards, Option A (' + deckManager.getCardName(optA.card) + ') has more positive energy.';
            } else if (bScore > aScore) {
              text += 'From the outcome cards, Option B (' + deckManager.getCardName(optB.card) + ') has more positive energy.';
            } else {
              text += 'Both options have similar outcome energy. Follow your truest desire rather than just weighing pros and cons.';
            }
          }
          break;
        }

        // ---- 五张牌阵 ----
        case 'five':
          if (!isEn) {
            text += '五张牌阵从问题核心到解决方案层层递进。';
            if (cards[1].isReversed) {
              text += '「面临的障碍」逆位，说明阻碍可能来自内在——自我怀疑、恐惧或旧有模式，而非外在环境。向内探索比向外突围更有效。';
            } else {
              text += '「面临的障碍」正位，说明阻碍是具体而真实的，需要有策略地应对，而非逃避或否认。';
            }
            if (cards[2].card.suit === 'swords') {
              text += ' 「潜意识/隐藏因素」是宝剑牌，提示你的理性思维可能在掩盖真实的情感需求。试着问自己：如果不考虑逻辑，我真正想要的是什么？';
            } else if (cards[2].card.suit === 'cups') {
              text += ' 「潜意识/隐藏因素」是圣杯牌，提示情感需求是推动你行动的核心动力，也许你自己还没有完全意识到。';
            }
          } else {
            text += 'The Five Card spread progresses layer by layer from problem core to solution. ';
            if (cards[1].isReversed) {
              text += 'The "Obstacle" card is reversed, suggesting the blockage may come from within — self-doubt, fear, or old patterns. Inner exploration is more effective than outward breakthrough.';
            }
          }
          break;

        // ---- 马蹄铁牌阵 ----
        case 'horseshoe':
          if (!isEn) {
            text += '马蹄铁牌阵覆盖了从过去到未来的完整弧线。';
            if (cards[2].card.suit === 'major') {
              text += '「隐藏的因素」是大阿卡那牌，说明有一股深层的命运力量在暗中运作，可能不是表面上看到的那样。保持开放，接受意外。';
            }
            if (cards[5].card.suit === 'cups' || cards[5].card.suit === 'pentacles') {
              text += ' 「希望与恐惧」位置出现温和的牌，说明你的内心对这个结果其实是有期待的，恐惧可能大于实际风险。';
            } else if (cards[5].isReversed) {
              text += ' 「希望与恐惧」逆位，说明你可能对结果感到迷茫或不敢奢望，需要重新连接内心的渴望。';
            }
          } else {
            text += 'The Horseshoe spread covers the complete arc from past to future. ';
            if (cards[2].card.suit === 'major') {
              text += 'The "Hidden Factor" is a Major Arcana card, indicating a deep fate force is operating in the dark.';
            }
          }
          break;

        // ---- 事业牌阵 ----
        case 'career':
          if (!isEn) {
            text += '事业牌阵聚焦你的职业与学业发展。';
            if (cards[2].card.suit === 'wands' || cards[2].card.suit === 'fire') {
              text += '「你的优势」属于火元素，说明你的核心竞争力在于行动力、创造力或领导能力。在事业上，主动出击比等待机会更有效。';
            } else if (cards[2].card.suit === 'pentacles') {
              text += '「你的优势」属于土元素，说明你的核心竞争力在于务实、可靠和执行力。在事业上，稳扎稳打比冒险跃进更能积累成果。';
            }
            if (cards[1].isReversed) {
              text += ' 「面临的挑战」逆位，说明职场上的困难可能源于内在的自我设限，而非外在环境。突破点在于重新认识自己的价值。';
            }
          } else {
            text += 'The Career spread focuses on your professional and academic development. ';
            if (cards[2].card.suit === 'wands') {
              text += 'Your "Strengths" are in Fire element — your core competitiveness lies in action, creativity, or leadership.';
            } else if (cards[2].card.suit === 'pentacles') {
              text += 'Your "Strengths" are in Earth element — your core competitiveness lies in being practical, reliable, and execution-oriented.';
            }
          }
          break;

        // ---- 时间之流 ----
        case 'timeflow':
          if (!isEn) {
            text += '时间之流牌阵在时间维度上深入剖析问题。';
            if (cards[3].card.suit === 'major') {
              text += '「深层原因」是大阿卡那牌，说明问题的根源可以追溯到灵魂层面的课题，不是靠表面调整就能解决的。';
            }
            if (cards[0].isReversed && cards[2].isReversed) {
              text += ' 过去与未来都出现逆位，说明这个问题可能是一个反复出现的模式，需要更深层的觉察才能打破循环。';
            } else if (!cards[0].isReversed && !cards[2].isReversed) {
              text += ' 过去与未来都正位，说明这个问题正在朝着积极的方向演化，你的努力已经有了成效。';
            }
          } else {
            text += 'The Time Flow spread deeply analyzes the question across the time dimension. ';
            if (cards[3].card.suit === 'major') {
              text += 'The "Root Cause" is a Major Arcana card, indicating the root of the problem traces back to a soul-level lesson.';
            }
          }
          break;

        // ---- 问题行动结果 ----
        case 'action':
          if (!isEn) {
            text += '问题行动结果牌阵是最简洁的决策指引。';
            if (cards[1].card.suit === 'wands' || cards[1].card.suit === 'swords') {
              text += '「建议行动」是主动型牌（权杖或宝剑），说明你需要立即采取行动，等待只会让情况更复杂。';
            } else if (cards[1].card.suit === 'cups' || cards[1].card.suit === 'pentacles') {
              text += '「建议行动」是沉淀型牌（圣杯或星币），说明你需要更多耐心和内省，贸然行动可能适得其反。';
            }
            if (cards[2].isReversed) {
              text += ' 「可能结果」逆位，提醒你即使按照建议行动，也可能遇到预期之外的变化。保持弹性比执着于特定结果更重要。';
            }
          } else {
            text += 'The Problem-Action-Result spread is the most concise decision guidance. ';
            if (cards[1].card.suit === 'wands' || cards[1].card.suit === 'swords') {
              text += 'The "Suggested Action" is an active card (Wands or Swords), indicating you need to take action immediately.';
            }
          }
          break;

        // ---- 心灵牌阵 ----
        case 'mind':
          if (!isEn) {
            text += '心灵牌阵帮助你整合意识与潜意识。';
            if (cards[0].card.suit !== cards[1].card.suit) {
              text += '「意识」与「潜意识」属于不同元素，说明你的意识认知与内在真实感受之间存在gap。你可能在对自己说谎，或者还没有完全觉察自己的真实需求。';
            }
            if (cards[2].card.suit === 'major' || cards[3].card.suit === 'major') {
              text += ' 「理想」或「现实」位置出现大阿卡那牌，说明你内心深处对这个议题有着超越日常的期待，可能需要重新定义什么是"现实"。';
            }
            if (cards[4].isReversed) {
              text += ' 「建议」逆位，说明你可能需要先放下固有的思维框架，才能接收到真正的指引。';
            }
          } else {
            text += 'The Mind spread helps you integrate consciousness and subconscious. ';
            if (cards[0].card.suit !== cards[1].card.suit) {
              text += 'Your "Conscious" and "Subconscious" cards belong to different elements, indicating a gap between your conscious awareness and inner truth.';
            }
          }
          break;

        // ---- 恋人牌阵 ----
        case 'love':
          if (!isEn) {
            text += '恋人牌阵深入解读两人关系的各个层面。';
            if (cards[0].card.suit === 'cups' && cards[1].card.suit === 'cups') {
              text += '你与对方都受到水元素（圣杯）的影响，说明这是一段情感浓度很高的关系，直觉和感受主导着互动。';
            } else if (cards[0].isReversed || cards[1].isReversed) {
              text += '你或对方的状态出现逆位，说明这段关系中至少有一方感到不确定、困惑或有所保留。开诚布公的沟通是破局关键。';
            }
            if (cards[3].isReversed) {
              text += ' 「面临的挑战」逆位，说明挑战可能来自逃避或不敢面对问题，而非问题本身无法解决。';
            }
            if (cards[6].card.suit === 'pentacles' || cards[6].card.suit === 'wands') {
              text += ' 「建议」是务实或行动导向的牌，说明改善这段关系需要具体的行动，而非仅仅停留在情感表达上。';
            }
          } else {
            text += 'The Love spread deeply interprets all levels of a two-person relationship. ';
            if (cards[0].card.suit === 'cups' && cards[1].card.suit === 'cups') {
              text += 'Both you and your partner are influenced by Water element (Cups), indicating a relationship with high emotional intensity.';
            } else if (cards[0].isReversed || cards[1].isReversed) {
              text += 'Either you or your partner has a reversed card, suggesting at least one party feels uncertain or hesitant.';
            }
          }
          break;

        // ---- 复合牌阵 ----
        case 'broken':
          if (!isEn) {
            text += '复合牌阵帮助你理性看待分手与复合的可能。';
            if (cards[0].card.suit === 'major') {
              text += '「问题根源」是大阿卡那牌，说明分手的原因触及深层的灵魂课题，可能不是简单的性格不合，而是成长节奏的不同步。';
            }
            if (cards[1].isReversed) {
              text += ' 「对方的想法」逆位，说明对方可能还在情感上处于防御状态，或者还没有理清自己的感受。此时推进复合可能操之过急。';
            } else {
              text += ' 「对方的想法」正位，说明对方对这段关系仍有清晰的感受，复合的可能性相对较高。';
            }
            if (cards[4].isReversed) {
              text += ' 「复合的可能性」逆位，不代表完全没有可能，而是提示复合的过程可能比预期更曲折，需要更多耐心和自我成长。';
            }
          } else {
            text += 'The Reunion spread helps you rationally view the breakup and possibility of getting back together. ';
            if (cards[1].isReversed) {
              text += 'The other person\'s thoughts are reversed — they may still be in emotional defense mode. Pushing for reunion now may be too hasty.';
            }
          }
          break;

        // ---- 是否牌阵 ----
        case 'yesno':
          if (!isEn) {
            text += '是否牌阵给出支持与反对因素的平衡视角。';
            const supportRev = cards[0].isReversed ? 1 : 0;
            const opposeRev = cards[1].isReversed ? 1 : 0;
            if (supportRev < opposeRev) {
              text += '支持因素比反对因素更积极，整体倾向「是」。但即使如此，逆位牌提醒你仍需注意潜在的风险。';
            } else if (opposeRev < supportRev) {
              text += '反对因素比支持因素更积极（即支持因素逆位、反对因素正位），整体倾向「否」。但这并不意味着失败，而是提醒你需要换一个方向。';
            } else {
              text += '支持与反对因素能量相当，说明这件事的成败很大程度上取决于你的行动和态度。塔罗给出的不是定论，而是当下的能量快照。';
            }
          } else {
            text += 'The Yes/No spread gives a balanced view of supporting and opposing factors. ';
            const supportRevEn = cards[0].isReversed ? 1 : 0;
            const opposeRevEn = cards[1].isReversed ? 1 : 0;
            if (supportRevEn < opposeRevEn) {
              text += 'Supporting factors are more positive than opposing factors — the tendency leans toward "Yes".';
            } else if (opposeRevEn < supportRevEn) {
              text += 'Opposing factors are more positive — the tendency leans toward "No". But this does not mean failure, only that you may need a different direction.';
            }
          }
          break;

        // ---- 换工作牌阵 ----
        case 'jobchange':
          if (!isEn) {
            text += '换工作牌阵帮助你在职业转折点上做出明智选择。';
            if (cards[0].card.suit === 'pentacles' && cards[0].isReversed) {
              text += '「现状」是星币逆位，说明当前工作可能在物质回报或安全感上无法满足你，这是促使你想离开的核心动因。';
            }
            if (cards[2].isReversed) {
              text += ' 「新机会的本质」逆位，提醒你不要理想化新工作，它可能有你看不到的挑战。建议多做调研，而不仅仅凭感觉做决定。';
            } else {
              text += ' 「新机会的本质」正位，说明新机会确实是真实而有益的，但仍需评估自己是否准备好了迎接变化。';
            }
          } else {
            text += 'The Job Change spread helps you make wise choices at career turning points. ';
            if (cards[2].isReversed) {
              text += 'The "Nature of New Opportunity" is reversed — do not idealize the new job. It may have challenges you cannot see yet.';
            }
          }
          break;

        // ---- 阴影牌阵 ----
        case 'shadow':
          if (!isEn) {
            text += '阴影牌阵引导你遇见被自己否认或压抑的那部分自我。';
            if (cards[1].card.suit === 'major') {
              text += '「阴影自我」是大阿卡那牌，说明你的阴影面承载着重要的灵魂课题。否认它只会让它以更强烈的方式反弹。';
            }
            if (cards[2].isReversed) {
              text += ' 「需要释放的」逆位，说明你可能还没有准备好放下某些旧模式，或者你以为已经放下了但实则还在执着。温柔地对待自己，整合是一个过程。';
            }
            if (cards[4].card.suit === 'wands' || cards[4].card.suit === 'swords') {
              text += ' 「建议」是主动型牌，说明自我整合需要你主动面对，而非等待阴影自己浮现。';
            }
          } else {
            text += 'The Shadow spread guides you to meet the part of yourself that is denied or suppressed. ';
            if (cards[1].card.suit === 'major') {
              text += 'Your "Shadow Self" is a Major Arcana card, indicating your shadow carries important soul lessons.';
            }
          }
          break;

        // ---- 年运牌阵 ----
        case 'year':
          if (!isEn) {
            text += '年运牌阵勾勒出一整年的能量地图。';
            if (cards[0].card.suit === 'major') {
              text += '「整体运势」是大阿卡那牌，说明这一年将是一个重要的转折年，可能有重大事件或深层转变发生。';
            }
            const yearSuits = cards.map(c => c.card.suit);
            if (yearSuits.filter(s => s === 'pentacles').length >= 2) {
              text += ' 星币牌在年运中占据重要位置，说明这一年物质层面（财务、工作、健康）将是重点关注的领域。';
            } else if (yearSuits.filter(s => s === 'cups').length >= 2) {
              text += ' 圣杯牌在年运中占据重要位置，说明这一年情感与人际关系将是主旋律。';
            }
          } else {
            text += 'The Yearly spread outlines the energy map for the entire year. ';
            if (cards[0].card.suit === 'major') {
              text += 'The "Overall Fortune" is a Major Arcana card, indicating this year will be an important turning point year.';
            }
          }
          break;

            // ---- 利弊分析 ----
        case 'proscons':
          if (!isEn) {
            text += '利弊分析牌阵帮助你理性权衡决策的各个方面。';
            if (cards[0].isReversed) {
              text += '「利」逆位，说明支持你做这件事的理由可能没有你想象的那么充分，或者有利条件中隐藏着代价。';
            }
            if (cards[1].isReversed) {
              text += ' 「弊」逆位，说明反对理由可能被夸大了——你担心的风险实际发生的概率比你认为的要低。';
            }
            if (cards[3].card.suit === 'pentacles') {
              text += ' 「建议」是星币牌，说明最终决策应该基于实际条件和长期规划，而非一时冲动或情绪。';
            }
          } else {
            text += 'The Pros & Cons spread helps you rationally weigh all aspects of a decision. ';
            if (cards[0].isReversed) {
              text += 'The "Pros" card is reversed — the reasons supporting this action may not be as sufficient as you think.';
            }
          }
          break;

        // ---- 旅行牌阵 ----
        case 'travel':
          if (!isEn) {
            text += '旅行牌阵为你的出行提供全方位的指引。';
            if (cards[0].isReversed) {
              text += '「旅行整体能量」逆位，说明这次旅行可能不会完全按照计划进行，可能会有意外状况。但逆位也意味着惊喜——最美好的时刻往往在不经意间发生。';
            } else {
              text += '「旅行整体能量」正位，预示这次旅行整体顺利，是放松和充电的好时机。';
            }
            if (cards[2].card.suit === 'swords' || cards[2].card.suit === 'pentacles') {
              text += ' 「需要注意的事项」是宝剑或星币牌，提醒你在行程安排和财物安全上需要格外留意。';
            }
          } else {
            text += 'The Travel spread provides all-around guidance for your trip. ';
            if (cards[0].isReversed) {
              text += 'The "Overall Travel Energy" is reversed — the trip may not go exactly as planned, but surprises may also appear.';
            }
          }
          break;

        // ---- 灵感创作牌阵 ----
        case 'creative':
          if (!isEn) {
            text += '灵感创作牌阵为你的创作之路提供指引。';
            if (cards[0].isReversed) {
              text += '「创作瓶颈根源」逆位，说明瓶颈可能来自内在恐惧——害怕作品不被认可、害怕灵感和预期不符。试着先为自己而创作。';
            } else {
              text += '「创作瓶颈根源」正位，瓶颈的根源已经清晰，现在需要的是找到突破的方法而非继续纠结原因。';
            }
            if (cards[1].card.suit === 'wands' || cards[1].card.suit === 'fire') {
              text += ' 「灵感方向」是权杖/火牌，灵感来自行动和冒险——走出去、尝试新事物，灵感会在行动中自然涌现。';
            } else if (cards[1].card.suit === 'cups' || cards[1].card.suit === 'water') {
              text += ' 「灵感方向」是圣杯/水牌，灵感来自情感和直觉——关注你的感受，最深的情感往往是最好的创作素材。';
            } else if (cards[1].card.suit === 'swords' || cards[1].card.suit === 'clouds') {
              text += ' 「灵感方向」是宝剑/云牌，灵感来自思考和观察——换个角度看待问题，灵感藏在你未曾留意的细节里。';
            } else if (cards[1].card.suit === 'pentacles' || cards[1].card.suit === 'rainbow') {
              text += ' 「灵感方向」是星币/彩虹牌，灵感来自扎实的积累——回顾你已有的作品和经验，灵感就在你走过的路里。';
            }
            if (cards[3].isReversed) {
              text += ' 「创作能量状态」逆位，说明你目前创作能量偏低，需要休息、充电或转换节奏，不要强迫自己输出。';
            }
          } else {
            text += 'The Creative Inspiration spread provides guidance for your creative journey. ';
            if (cards[0].isReversed) {
              text += 'The "Root of Creative Block" is reversed — the block may come from inner fear. Try creating for yourself first.';
            }
            if (cards[3].isReversed) {
              text += ' "Creative Energy" is reversed — your creative energy is low right now. Rest and recharge, do not force output.';
            }
          }
          break;

        // ---- 人生使命牌阵 ----
        case 'lifepurpose':
          if (!isEn) {
            text += '人生使命牌阵帮助你连接内在的天命召唤。';
            if (cards[0].card.suit === 'major') {
              text += '「你的核心天赋」是大阿卡那牌，说明你的天赋不仅仅是技能，而是一种灵魂层面的特质，可能与你此生的使命直接相关。';
            }
            if (cards[1].isReversed) {
              text += ' 「你的人生课题」逆位，说明你可能在重复逃避这个课题，但它会不断以不同形式出现在你的生活中，直到你真正面对它。';
            }
            if (cards[5].isReversed) {
              text += ' 「需要释放的信念」逆位，说明有些旧有信念你已经意识到了，但还没有完全放下。释放是一个层层递进的过程。';
            }
          } else {
            text += 'The Life Purpose spread helps you connect with your inner calling. ';
            if (cards[0].card.suit === 'major') {
              text += 'Your "Core Talent" is a Major Arcana card, indicating your talent is not just a skill but a soul-level trait.';
            }
          }
          break;

        // ---- 考试牌阵 ----
        case 'exam':
          if (!isEn) {
            text += '考试牌阵为你的备考和应试提供精准指引。';
            if (cards[0].isReversed) {
              text += '「考试/面试结果」逆位，不代表一定会失败，而是提醒你结果可能不如预期，需要更加努力或者调整期望值。';
            } else {
              text += '「考试/面试结果」正位，预示考试或面试结果偏向积极，但正位不代表可以掉以轻心——充分准备仍然是成功的基础。';
            }
            if (cards[1].card.suit === 'swords') {
              text += ' 「准备方向」是宝剑牌，说明你需要更多理性分析和系统复习，重点攻克弱项而非重复已经掌握的内容。';
            } else if (cards[1].card.suit === 'pentacles') {
              text += ' 「准备方向」是星币牌，说明你需要制定具体的复习计划，按部就班、稳扎稳打比临时抱佛脚更有效。';
            }
            if (cards[3].isReversed) {
              text += ' 「潜在障碍」逆位，说明障碍可能来自内心——紧张、自我怀疑或完美主义，而非知识储备不足。';
            }
          } else {
            text += 'The Exam spread provides precise guidance for your preparation and performance. ';
            if (cards[0].isReversed) {
              text += 'The "Exam/Interview Result" is reversed — this does not mean certain failure, but reminds you the result may not meet expectations.';
            } else {
              text += 'The "Exam/Interview Result" is upright — the result tends to be positive, but full preparation is still the foundation of success.';
            }
          }
          break;

        // ---- 财务投资牌阵 ----
        case 'finance':
          if (!isEn) {
            text += '财务投资牌阵为你的财务决策提供能量层面的指引。';
            if (cards[0].card.suit === 'pentacles') {
              text += '「当前财务状况」是星币牌，你的财务基础相对稳固，此时做出的财务决策有较好的现实支撑。';
            } else if (cards[0].card.suit === 'swords') {
              text += '「当前财务状况」是宝剑牌，财务上可能有些焦虑和不确定性，做决策前需要理性分析而非情绪化行动。';
            } else if (cards[0].card.suit === 'cups') {
              text += '「当前财务状况」是圣杯牌，财务决策可能受到情感因素影响，注意不要让情感凌驾于理性判断之上。';
            } else if (cards[0].card.suit === 'wands') {
              text += '「当前财务状况」是权杖牌，财务上有行动力和机会，但也可能有冲动消费的倾向，需要平衡冒险与稳健。';
            }
            if (cards[1].isReversed) {
              text += ' 「投资风险」逆位，风险可能来自你未曾预料的方向，或者你低估了风险——务必做好最坏打算。';
            } else {
              text += ' 「投资风险」正位，风险是可见且可控的，关键在于你是否有足够的心理准备和资金准备去面对。';
            }
            if (cards[2].isReversed) {
              text += ' 「潜在收益」逆位，预示回报可能不如预期，或需要更长周期才能看到收益，做好心理准备。';
            } else {
              text += ' 「潜在收益」正位，预示这个决策有实质性回报潜力，值得认真考虑。';
            }
            if (cards[3].isReversed) {
              text += ' 「时间因素」逆位，时机可能不太对——要么是太着急，要么是拖延太久。耐心等待更好的时机可能会更好。';
            } else {
              text += ' 「时间因素」正位，时机基本合适，按节奏推进即可，但也要留意市场变化。';
            }
            if (cards[4].card.suit === 'pentacles') {
              text += ' 「建议」是星币牌，稳健投资、分散风险是关键词，避免孤注一掷。';
            } else if (cards[4].card.suit === 'swords') {
              text += ' 「建议」是宝剑牌，需要理性分析和充分调研，不要被情绪或他人意见左右。';
            } else if (cards[4].card.suit === 'cups') {
              text += ' 「建议」是圣杯牌，这个财务决策与情感价值有关——确保它真正符合你内心的渴望，而非他人的期待。';
            } else if (cards[4].card.suit === 'wands') {
              text += ' 「建议」是权杖牌，适合积极主动地把握机会，但也要设定止损点，避免盲目扩张。';
            }
          } else {
            text += 'The Finance spread provides guidance for your financial decisions from an energy perspective. ';
            if (cards[0].card.suit === 'pentacles') {
              text += ' "Current Finance" is a Pentacles card — your financial foundation is relatively solid.';
            } else if (cards[0].card.suit === 'swords') {
              text += ' "Current Finance" is a Swords card — there may be anxiety and uncertainty in finance.';
            } else if (cards[0].card.suit === 'cups') {
              text += ' "Current Finance" is a Cups card — financial decisions may be influenced by emotions.';
            } else if (cards[0].card.suit === 'wands') {
              text += ' "Current Finance" is a Wands card — there is action and opportunity, but also impulse.';
            }
            if (cards[1].isReversed) {
              text += ' "Investment Risk" is reversed — the risk may come from an unexpected direction. Make sure you have a backup plan.';
            } else {
              text += ' "Investment Risk" is upright — the risk is visible and controllable.';
            }
            if (cards[2].isReversed) {
              text += ' "Potential Returns" is reversed — returns may be less than expected, or take longer to manifest.';
            } else {
              text += ' "Potential Returns" is upright — this decision has substantial return potential.';
            }
            if (cards[4].card.suit === 'pentacles') {
              text += ' "Advice" is a Pentacles card — steady investment and risk diversification are key.';
            } else if (cards[4].card.suit === 'swords') {
              text += ' "Advice" is a Swords card — rational analysis and thorough research are needed.';
            } else if (cards[4].card.suit === 'cups') {
              text += ' "Advice" is a Cups card — ensure this decision truly aligns with your inner desire.';
            } else if (cards[4].card.suit === 'wands') {
              text += ' "Advice" is a Wands card — actively seize opportunities, but set stop-loss points.';
            }
          }
          break;

        // ---- 断舍离牌阵 ----
        case 'declutter':
          if (!isEn) {
            text += '断舍离牌阵帮助你清理能量场，勇敢放下执念。';
            if (cards[0].isReversed) {
              text += '「要舍弃的对象本质」逆位，说明你其实已经知道该放下什么，但还在找借口拖延。承认它、面对它。';
            } else {
              text += '「要舍弃的对象本质」正位，这个对象对你的影响已经清晰可见，是时候正视它带给你的消耗了。';
            }
            if (cards[1].card.suit === 'cups') {
              text += ' 「不舍的原因」是圣杯牌，情感羁绊是你最大的执着——你可能还在期待一个不会到来的结局。';
            } else if (cards[1].card.suit === 'pentacles') {
              text += ' 「不舍的原因」是星币牌，物质或现实层面的顾虑让你难以放手——担心失去安全感或实际利益。';
            } else if (cards[1].card.suit === 'swords') {
              text += ' 「不舍的原因」是宝剑牌，理性分析反而让你更纠结——你可能在用"道理"说服自己留下，而非跟随内心。';
            } else if (cards[1].card.suit === 'wands') {
              text += ' 「不舍的原因」是权杖牌，激情或惯性让你难以放下——你可能只是习惯了它的存在，而非真正需要它。';
            }
            if (cards[2].isReversed) {
              text += ' 「舍弃后的收获」逆位，说明放下后的正面影响可能需要一段时间才能显现，不要因为短期内感觉"空落落"就回头。';
            } else {
              text += ' 「舍弃后的收获」正位，预示放下后你会感受到明显的轻松与自由，新能量将迅速填补空白。';
            }
            if (cards[3].card.suit === 'swords') {
              text += ' 「建议」是宝剑牌，需要用理性和清晰的界限来辅助断舍离，情感上可能会反复，需要坚定的决心。';
            } else if (cards[3].card.suit === 'cups') {
              text += ' 「建议」是圣杯牌，断舍离的过程需要温柔对待自己的情感，允许自己悲伤，但不要回头。';
            } else if (cards[3].card.suit === 'pentacles') {
              text += ' 「建议」是星币牌，断舍离需要循序渐进，可以从最容易的对象开始，逐步建立信心。';
            } else if (cards[3].card.suit === 'wands') {
              text += ' 「建议」是权杖牌，断舍离需要果断行动，不要反复犹豫——一旦决定，就全力以赴向前看。';
            }
          } else {
            text += 'The Declutter spread helps you clear your energy field and let go of attachments. ';
            if (cards[0].isReversed) {
              text += ' "What to Let Go" is reversed — you already know what to release, but you are making excuses to delay. Acknowledge it and face it.';
            } else {
              text += ' "What to Let Go" is upright — the impact of this object is clearly visible. It is time to face the drain it brings you.';
            }
            if (cards[1].card.suit === 'cups') {
              text += ' "Reason of Attachment" is a Cups card — emotional bonds are your biggest attachment.';
            } else if (cards[1].card.suit === 'pentacles') {
              text += ' "Reason of Attachment" is a Pentacles card — material or practical concerns make it hard to let go.';
            } else if (cards[1].card.suit === 'swords') {
              text += ' "Reason of Attachment" is a Swords card — rational analysis makes you more entangled.';
            } else if (cards[1].card.suit === 'wands') {
              text += ' "Reason of Attachment" is a Wands card — passion or inertia makes it hard to let go.';
            }
            if (cards[2].isReversed) {
              text += ' "Gain After Letting Go" is reversed — the positive effects may take time to manifest. Do not look back just because you feel empty in the short term.';
            } else {
              text += ' "Gain After Letting Go" is upright — after letting go, you will feel obvious lightness and freedom.';
            }
            if (cards[3].card.suit === 'swords') {
              text += ' "Advice" is a Swords card — you need rationality and clear boundaries to assist decluttering.';
            } else if (cards[3].card.suit === 'cups') {
              text += ' "Advice" is a Cups card — be gentle with your emotions during decluttering, allow yourself to grieve, but do not look back.';
            } else if (cards[3].card.suit === 'pentacles') {
              text += ' "Advice" is a Pentacles card — decluttering needs to be gradual, start with the easiest objects.';
            } else if (cards[3].card.suit === 'wands') {
              text += ' "Advice" is a Wands card — decluttering requires decisive action, do not hesitate repeatedly.';
            }
          }
          break;

        // ---- 命运之轮 ----
        case 'fatewheel':
          if (!isEn) {
            text += '命运之轮牌阵帮助你理解命运的起伏与转折。';
            if (cards[0].card.suit === 'major') {
              text += '「当前命运状态」是大阿卡那牌，说明你正处于一个命运的关键节点上，个人的选择会与更大的命运力量交汇。';
            }
            if (cards[1].isReversed) {
              text += ' 「命运的转变点」逆位，说明转变可能以你不期望的方式发生，或者时机与你预期的不同。接受而非抗拒是智慧的选择。';
            }
            if (cards[4].isReversed) {
              text += ' 「最终的命运走向」逆位，说明命运之轮可能会转向一个你未曾预料的方向，但逆位也意味着你有重新定义结局的力量。';
            }
          } else {
            text += 'The Wheel of Fortune spread helps you understand the rises and turns of fate. ';
            if (cards[0].card.suit === 'major') {
              text += 'Your "Current Fate Status" is a Major Arcana card — you are at a key node of fate where personal choice meets larger fate forces.';
            }
          }
          break;

        // ---- 月运牌阵 ----
        case 'monthly':
          if (!isEn) {
            text += '月运牌阵为你勾勒未来一个月的能量蓝图。';
            if (cards[0].isReversed) {
              text += '「本月主题」逆位，说明这个月可能不会一帆风顺，但逆位也意味着你有突破旧模式的机会。这个月的课题可能恰恰是你需要成长的领域。';
            }
            const monthSuits = cards.map(c => c.card.suit);
            if (monthSuits.filter(s => s === 'wands').length >= 2) {
              text += ' 权杖牌在本月占据重要位置，说明这个月行动力充沛，适合启动新项目或推进搁置的计划。';
            } else if (monthSuits.filter(s => s === 'cups').length >= 2) {
              text += ' 圣杯牌在本月占据重要位置，说明这个月情感丰富，适合处理人际关系或内在探索。';
            }
          } else {
            text += 'The Monthly Fortune spread outlines the energy blueprint for the coming month. ';
            if (cards[0].isReversed) {
              text += 'The "Monthly Theme" is reversed — this month may not be smooth sailing, but it also means you have the opportunity to break old patterns.';
            }
          }
          break;

        // ---- 灵魂旅程 ----
        case 'souljourney':
          if (!isEn) {
            text += '灵魂旅程牌阵引导你深入灵性成长的核心。';
            if (cards[0].card.suit === 'major') {
              text += '「当下的灵魂状态」是大阿卡那牌，说明你正处于一个灵魂层面的重要阶段，日常的表面问题可能只是灵魂课题的映射。';
            }
            if (cards[3].isReversed) {
              text += ' 「当前的精神挑战」逆位，说明挑战可能来自你不愿意面对的真相，或者你以为自己已经超越了某些模式但实际上还没有。';
            }
            if (cards[6].card.suit === 'cups' || cards[6].card.suit === 'wands') {
              text += ' 「高我/直觉声音」是情感或行动导向的牌，说明你的高我通过感受和直觉与你沟通，而非理性的声音。学会信任那份"说不出的感觉"。';
            }
          } else {
            text += 'The Soul Journey spread guides you into the core of spiritual growth. ';
            if (cards[0].card.suit === 'major') {
              text += 'Your "Current Soul State" is a Major Arcana card, indicating you are at an important soul-level stage.';
            }
          }
          break;

        // ---- 星座牌阵（12宫位）----
        case 'zodiac':
          if (!isEn) {
            text += '星座牌阵对应黄道12宫位，全面解读生活的各个面向。';
            const zodiacMajors = cards.filter(c => c.card.suit === 'major');
            if (zodiacMajors.length >= 3) {
              text += '有' + zodiacMajors.length + '张大阿卡那牌出现在宫位中，说明这一年（或这一阶段）将发生多个重要的生命事件，命运的集中度很高。';
            }
            // 检查第1宫与第7宫的关系（自我 vs 关系）
            if (cards[0].card.suit === cards[6].card.suit) {
              text += ' 第1宫（自我）与第7宫（伴侣）属于同元素，说明你在关系中寻找的是与自己相似的能量，这可能带来共鸣，也可能导致缺乏成长刺激。';
            }
          } else {
            text += 'The Zodiac spread corresponds to the 12 astrological houses, comprehensively interpreting all areas of life. ';
            const zodiacMajors = cards.filter(c => c.card.suit === 'major');
            if (zodiacMajors.length >= 3) {
              text += 'There are ' + zodiacMajors.length + ' Major Arcana cards in the houses, indicating multiple important life events concentrated in this period.';
            }
          }
          break;

        // ---- 前世今生 ----
        case 'pastlife':
          if (!isEn) {
            text += '前世今生牌阵帮助你理解跨越时间的灵魂课题。';
            if (cards[0].card.suit === 'major') {
              text += '「前世身份」是大阿卡那牌，说明你的前世经历与重要的灵魂原型相关，可能不是普通人的生活，而是带有某种使命或特殊遭遇。';
            }
            if (cards[1].card.suit === cards[3].card.suit) {
              text += ' 「未完成课题」与「灵魂成长方向」属于同元素，说明你今生的成长方向正是前世未竟的事业——这是一种灵魂的延续，而非重新开始。';
            }
            if (cards[4].card.suit === 'pentacles' || cards[4].card.suit === 'wands') {
              text += ' 「建议」是行动导向的牌，说明理解前世今生不是为了沉溺于故事，而是为了在今生的行动上做出不同的选择。';
            }
          } else {
            text += 'The Past Life spread helps you understand soul lessons across time. ';
            if (cards[0].card.suit === 'major') {
              text += 'Your "Past Life Identity" is a Major Arcana card, indicating your past life was connected to important soul archetypes.';
            }
          }
          break;

        // ---- 健康牌阵 ----
        case 'health':
          if (!isEn) {
            text += '健康牌阵从身心整合的角度给出疗愈指引。';
            if (cards[0].card.suit === 'swords') {
              text += '「身体状态」是宝剑牌，说明身体症状可能与思维过度、焦虑或压力有关。身心是一体的，放松头脑可能是改善身体的第一步。';
            } else if (cards[0].card.suit === 'cups') {
              text += '「身体状态」是圣杯牌，说明身体症状可能与情感压抑、未表达的情绪有关。允许自己感受并表达情感，身体会随之放松。';
            }
            if (cards[1].isReversed) {
              text += ' 「心理情绪」逆位，说明你可能没有意识到自己的情绪状态对身体的影响，或者在否认某些情感需求。';
            }
            text += ' 请注意：塔罗健康解读仅供辅助参考，任何身体症状请务必咨询专业医师。';
          } else {
            text += 'The Health spread gives healing guidance from the perspective of mind-body integration. ';
            if (cards[0].card.suit === 'swords') {
              text += 'Your "Physical Condition" is a Swords card — body symptoms may be related to overthinking, anxiety, or stress.';
            }
            text += ' Note: Tarot health reading is for reference only. Please consult a professional doctor for any physical symptoms.';
          }
          break;

        // ---- 家庭关系 ----
        case 'family':
          if (!isEn) {
            text += '家庭关系牌阵帮助你理解家庭动力与改善亲子/亲人关系。';
            if (cards[1].isReversed) {
              text += '「父亲」逆位，可能意味着父亲的形象在你心中是缺失的、疏远的，或者你对父亲有未化解的情绪。这可能影响你与权威人物的关系模式。';
            }
            if (cards[2].isReversed) {
              text += ' 「母亲」逆位，可能意味着母亲的形象在你心中是过度控制的、情绪化的，或者你对母亲有未化解的情绪。这可能影响你的安全感和亲密关系模式。';
            }
            if (!cards[3].isReversed) {
              text += ' 「家庭氛围」正位，说明尽管可能存在个体层面的问题，但家庭整体的能量是健康的，有改善和疗愈的空间。';
            }
          } else {
            text += 'The Family spread helps you understand family dynamics and improve parent-child/relative relationships. ';
            if (cards[1].isReversed) {
              text += 'The "Father" card is reversed — the father figure may feel absent or distant in your heart.';
            }
            if (cards[2].isReversed) {
              text += 'The "Mother" card is reversed — the mother figure may feel over-controlling or emotional in your heart.';
            }
          }
          break;

        // ---- 一周运势 ----
        case 'weekly':
          if (!isEn) {
            text += '一周运势牌阵为你预示未来七天可能的能量起伏。';
            const weekRevCount = cards.filter(c => c.isReversed).length;
            if (weekRevCount >= 5) {
              text += '本周逆位牌占多数，预示这可能是一个需要更多耐心和自我关怀的星期。不要对每一天都有太高期待，允许自己休息和充电。';
            } else if (weekRevCount <= 2) {
              text += '本周正位牌占多数，预示这将是充满能量和机会的一周。充分利用这股正向能量，推进重要计划。';
            }
            // 找出能量最强的一天
            const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
            const dayNamesEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            let strongestDay = 0, maxEnergy = 0;
            cards.forEach((item, i) => {
              let e = item.card.suit === 'major' ? 10 : 5;
              if (item.isReversed) e *= 0.7;
              if (e > maxEnergy) { maxEnergy = e; strongestDay = i; }
            });
            text += ' 本周能量最强的一天是' + (isEn ? dayNamesEn[strongestDay] : dayNames[strongestDay]) + '（' + deckManager.getCardName(cards[strongestDay].card) + '），这天适合重点推进重要事项。';
          } else {
            text += 'The Weekly Fortune spread forecasts the possible energy fluctuations for the coming seven days. ';
            const weekRevCount = cards.filter(c => c.isReversed).length;
            if (weekRevCount >= 5) {
              text += 'Reversed cards are in the majority this week — this may be a week requiring more patience and self-care.';
            } else if (weekRevCount <= 2) {
              text += 'Upright cards are in the majority — this will be a week full of energy and opportunities.';
            }
          }
          break;

        default:
          text += isEn
            ? 'This spread provides unique insights based on the cards drawn. Please refer to the position meanings and individual card interpretations above.'
            : '该牌阵根据所抽到的牌提供独特见解，请参考上方的位置含义和单张牌意解读。';
          break;
      }

      html += '<p>' + text + '</p></div></div>';
      return html;
    }

    // 辅助函数：获取牌组名称（用于专属解读）
    suitName(suit, isEn) {
      const names = isEn
        ? { wands: 'Wands (Fire)', cups: 'Cups (Water)', swords: 'Swords (Air)', pentacles: 'Pentacles (Earth)', major: 'Major Arcana' }
        : { wands: '权杖（火）', cups: '圣杯（水）', swords: '宝剑（风）', pentacles: '星币（土）', major: '大阿卡那' };
      return names[suit] || suit;
    }

    // ============ 综合解读生成（支持三级模式） ============
    async generateComprehensiveReading() {
      if (!this.currentCards || this.currentCards.length === 0) return '';

      // 获取当前解读模式
      const modeToggle = document.querySelector('.mode-btn.active');
      const currentMode = modeToggle ? modeToggle.dataset.mode : 'standard';

      console.log('[Debug] 当前解读模式:', currentMode); // 调试日志

      const cards = this.currentCards;
      const mode = this.currentMode;
      const spreadName = this.getLocalizedSpreadName(mode);
      const positions = this.getLocalizedPositions(mode);

      // 根据模式生成不同内容
      if (currentMode === 'simple') {
        console.log('[Debug] 生成简单解读');
        return this.generateSimpleReading(cards, mode);
      }

      if (currentMode === 'standard') {
        console.log('[Debug] 生成标准解读');
        return this.generateStandardReading(cards, mode, positions);
      }

      // 深度模式：显式检查 + 独立方法调用
      if (currentMode === 'deep') {
        console.log('[Debug] 生成深度解读');
        return await this.generateDeepReading(cards, mode, positions, spreadName);
      }

      // 兜底：如果模式未知，使用标准模式
      console.warn('[Debug] 未知模式，使用标准模式:', currentMode);
      return this.generateStandardReading(cards, mode, positions);
    }

    // ============ 深度解读生成（独立方法，避免与标准模式混淆）============
    async generateDeepReading(cards, mode, positions, spreadName) {
      let html = '<div class="deep-reading">';
      
      try {
        // 各个分析方法内部已经包含 reading-section 和 reading-section-title
        // 直接拼接即可，不需要额外添加标题包装
        html += this.analyzeTheme(cards, spreadName);
        html += this.analyzeCardRelations(mode, cards, positions);
        html += this.analyzeTrend(cards);
        html += this.generateSpreadSpecificReading(mode, cards, positions);
        html += this.generateAdvice(mode, cards);
        html += this.analyzeCardCombinations(cards);
        html += this.analyzeEnergyIntensity(cards);
        html += this.generateSummary(cards, mode);
        html += this.generateKeywordTags(cards);
        html += this.generateActionSteps(cards, mode);
        html += this.analyzeElementBalance(cards);

        // 扩展功能（可选）
        const extendedToggle = document.getElementById('extended-reading-toggle');
        const enableExtended = extendedToggle ? extendedToggle.checked : true;

        if (enableExtended) {
          try {
            const extendedReading = await this.generateExtendedReading();
            if (extendedReading) {
              html += '<hr style="margin:20px 0;border-color:var(--color-gold);opacity:0.3;"/>';
              html += '<div style="margin-top:20px;">' + extendedReading + '</div>';
            }
          } catch (extErr) {
            console.warn('扩展解读生成失败，跳过:', extErr);
          }
        }

      } catch (deepErr) {
        console.error('深度解读生成失败:', deepErr);
        html += '<div class="reading-section error">';
        html += '<div class="reading-section-title">❌ ' + (this.currentLang === 'en' ? 'Error' : '错误') + '</div>';
        html += '<div class="reading-section-body"><p style="color:red;">' + (this.currentLang === 'en' 
          ? 'Deep reading generation failed: ' + deepErr.message 
          : '深度解读生成失败：' + deepErr.message) + '</p></div>';
        html += '</div>';
      }

      html += '</div>';
      return html;
    }

    // ============ 简单解读生成（一句话启示） ============
    generateSimpleReading(cards, mode) {
      const isEn = this.currentLang === 'en';
      let html = '<div class="simple-reading">';

      // 1. 核心结论（一句话，含牌阵定位）
      html += '<div class="simple-core">';
      html += this.generateCoreInsight(cards, isEn, mode);
      html += '</div>';

      // 2. 关键词标签
      html += this.generateKeywordTags(cards);

      // 3. 一句话建议（含牌阵特色）
      html += '<div class="simple-advice">';
      html += this.generateOneLineAdvice(cards, isEn, mode);
      html += '</div>';

      html += '</div>';
      return html;
    }

    // 获取牌阵上下文（简单/标准模式共用）
    getSpreadContext(mode, isEn) {
      const ctx = {
        zh: {
          single:     { prefix: '【今日指引】', theme: '关注当下的能量状态', advice: '以这张牌为核心指引' },
          three:      { prefix: '【时间线】', theme: '过去、现在与未来的能量流动', advice: '结合三张牌的时间脉络' },
          celtic:     { prefix: '【深度探索】', theme: '全方位的人生课题分析', advice: '综合十个位置的深层讯息' },
          relation:   { prefix: '【关系动态】', theme: '你与对方的互动能量', advice: '关注双方态度与关系走向' },
          choice:     { prefix: '【决策分析】', theme: '两个选项的比较与权衡', advice: '权衡A/B的利弊与结果' },
          five:       { prefix: '【问题剖析】', theme: '从核心到结果的完整路径', advice: '针对问题核心采取行动' },
          horseshoe:  { prefix: '【全面洞察】', theme: '从过去到未来的全貌', advice: '综合七个位置的指引' },
          career:     { prefix: '【事业指引】', theme: '职场与学业的能量状态', advice: '聚焦事业发展方向' },
          timeflow:   { prefix: '【时间之流】', theme: '深层原因与可能结果', advice: '理解时间线上的因果' },
          action:     { prefix: '【行动指引】', theme: '问题、行动与结果的关联', advice: '立即采取建议的行动' },
          mind:       { prefix: '【心灵探索】', theme: '意识与潜意识的对谈', advice: '整合内心各层面的声音' },
          love:       { prefix: '【感情分析】', theme: '恋爱关系的各个层面', advice: '关注彼此感受与关系未来' },
          broken:     { prefix: '【复合可能】', theme: '分手原因与复合机会', advice: '诚实面对关系的问题' },
          yesno:      { prefix: '【是否判断】', theme: '支持与反对因素的权衡', advice: '正位偏向「是」，逆位偏向「否」' },
          jobchange:  { prefix: '【职业变动】', theme: '离职与新机会的评估', advice: '谨慎评估风险与机会' },
          shadow:     { prefix: '【阴影整合】', theme: '意识与阴影自我的对话', advice: '接纳被否认的自我面向' },
          year:       { prefix: '【年度运势】', theme: '一整年的能量主题', advice: '把握年度重要领域' },
          proscons:   { prefix: '【利弊权衡】', theme: '支持与反对因素的细致分析', advice: '综合利弊后做决定' },
          travel:     { prefix: '【旅行指引】', theme: '旅途的能量与注意事项', advice: '关注旅途安全与收获' },
          lifepurpose:{ prefix: '【人生使命】', theme: '天命与核心天赋的探索', advice: '活出真正的自我' },
          exam:       { prefix: '【考试运势】', theme: '考试/面试的表现与准备', advice: '针对重点方向复习' },
          fatewheel:  { prefix: '【命运走向】', theme: '命运之轮的转动方向', advice: '把握转变的关键点' },
          monthly:    { prefix: '【月度运势】', theme: '本月各方面的能量主题', advice: '关注本月重点领域' },
          souljourney:{ prefix: '【灵魂成长】', theme: '灵魂阶段的课题与方向', advice: '连接高我与内在指引' },
          zodiac:     { prefix: '【星座分析】', theme: '十二宫位的全面解读', advice: '关注重点宫位的讯息' },
          pastlife:   { prefix: '【前世今生】', theme: '跨生命的灵魂课题', advice: '化解前世的未完成课题' },
          health:     { prefix: '【健康指引】', theme: '身心健康的根本因素', advice: '关注身心整合的疗愈' },
          finance:    { prefix: '【财务决策】', theme: '财务风险与机会的能量分析', advice: '综合考虑风险与收益后行动' },
          declutter:  { prefix: '【断舍离】', theme: '放下执念与清理能量场', advice: '识别真正需要释放的对象' }
        },
        en: {
          single:     { prefix: '[Daily Guidance]', theme: 'Focus on current energy', advice: 'Take this card as core guidance' },
          three:      { prefix: '[Timeline]', theme: 'Energy flow of past, present, future', advice: 'Combine the timeline of three cards' },
          celtic:     { prefix: '[Deep Exploration]', theme: 'Comprehensive life theme analysis', advice: 'Integrate insights from ten positions' },
          relation:   { prefix: '[Relationship]', theme: 'Interaction energy between you two', advice: 'Focus on both attitudes and relationship direction' },
          choice:     { prefix: '[Decision]', theme: 'Comparison and trade-off of two options', advice: 'Weigh pros/cons and outcomes of A/B' },
          five:       { prefix: '[Problem Analysis]', theme: 'Complete path from core to result', advice: 'Take action targeting the problem core' },
          horseshoe:  { prefix: '[Full Insight]', theme: 'Full picture from past to future', advice: 'Integrate guidance from seven positions' },
          career:     { prefix: '[Career]', theme: 'Energy status of work and study', advice: 'Focus on career development direction' },
          timeflow:   { prefix: '[Time Flow]', theme: 'Deep causes and possible results', advice: 'Understand causality on the timeline' },
          action:     { prefix: '[Action Guide]', theme: 'Link problem, action, and result', advice: 'Take the suggested action immediately' },
          mind:       { prefix: '[Mind Explore]', theme: 'Dialogue between conscious and subconscious', advice: 'Integrate voices from all inner levels' },
          love:       { prefix: '[Love Analysis]', theme: 'All aspects of romantic relationship', advice: 'Focus on mutual feelings and relationship future' },
          broken:     { prefix: '[Reunion]', theme: 'Breakup causes and reunion chance', advice: 'Face relationship issues honestly' },
          yesno:      { prefix: '[Yes/No]', theme: 'Weighing supporting and opposing factors', advice: 'Upright leans yes, reversed leans no' },
          jobchange:  { prefix: '[Career Change]', theme: 'Evaluation of leaving and new opportunities', advice: 'Carefully assess risks and opportunities' },
          shadow:     { prefix: '[Shadow Work]', theme: 'Dialogue between conscious and shadow self', advice: 'Embrace denied aspects of yourself' },
          year:       { prefix: '[Yearly]', theme: 'Energy themes for the whole year', advice: 'Grasp important areas of the year' },
          proscons:   { prefix: '[Pros & Cons]', theme: 'Detailed analysis of supporting and opposing factors', advice: 'Decide after weighing pros and cons' },
          travel:     { prefix: '[Travel]', theme: 'Travel energy and precautions', advice: 'Pay attention to travel safety and gains' },
          lifepurpose:{ prefix: '[Life Purpose]', theme: 'Exploration of destiny and core talents', advice: 'Live as your true self' },
          exam:       { prefix: '[Exam]', theme: 'Exam/interview performance and preparation', advice: 'Review focusing on key directions' },
          fatewheel:  { prefix: '[Fate]', theme: 'Direction the Wheel of Fortune turns', advice: 'Grasp the key turning point' },
          monthly:    { prefix: '[Monthly]', theme: 'Energy themes across all areas this month', advice: 'Focus on key areas of this month' },
          souljourney:{ prefix: '[Soul Journey]', theme: 'Soul stage lessons and direction', advice: 'Connect with higher self and inner guidance' },
          zodiac:     { prefix: '[Zodiac]', theme: 'Comprehensive reading of twelve houses', advice: 'Focus on messages from key houses' },
          pastlife:   { prefix: '[Past Life]', theme: 'Cross-life soul lessons', advice: 'Resolve unfinished past-life lessons' },
          health:     { prefix: '[Health]', theme: 'Root causes of body-mind health', advice: 'Focus on body-mind integrative healing' },
          finance:    { prefix: '[Finance]', theme: 'Energy analysis of financial risk and opportunity', advice: 'Act after comprehensive consideration of risk and return' },
          declutter:  { prefix: '[Declutter]', theme: 'Letting go of attachments and clearing energy field', advice: 'Identify what truly needs to be released' }
        }
      };
      return ctx[isEn ? 'en' : 'zh'][mode] || ctx[isEn ? 'en' : 'zh']['single'];
    }

    // 生成核心洞察（一句话，含牌阵定位）
    generateCoreInsight(cards, isEn, mode) {
      const uprightCount = cards.filter(c => !c.isReversed).length;
      const total = cards.length;
      const ratio = uprightCount / total;
      const ctx = this.getSpreadContext(mode, isEn);

      let base = '';
      if (isEn) {
        if (ratio >= 0.7) base = 'The energy is generally positive. Move forward with confidence.';
        else if (ratio <= 0.3) base = 'Challenges exist, but they are guiding you to grow.';
        else base = 'Mixed energies. Balance and integration are key.';
      } else {
        if (ratio >= 0.7) base = '整体能量偏积极，可以信心满满地前进。';
        else if (ratio <= 0.3) base = '存在挑战，但这些挑战正在引导你成长。';
        else base = '能量好坏参半，平衡与整合是关键。';
      }

      return ctx.prefix + ' ' + base;
    }

    // 生成一句话建议（含牌阵特色）
    generateOneLineAdvice(cards, isEn, mode) {
      const ctx = this.getSpreadContext(mode, isEn);

      // 根据主导元素给出建议
      const elements = { wands: 0, cups: 0, swords: 0, pentacles: 0 };
      cards.forEach(c => {
        if (c.card.suit === 'wands') elements.wands++;
        else if (c.card.suit === 'cups') elements.cups++;
        else if (c.card.suit === 'swords') elements.swords++;
        else if (c.card.suit === 'pentacles') elements.pentacles++;
      });

      const dominant = Object.entries(elements).sort((a, b) => b[1] - a[1])[0][0];

      const adviceMap = {
        zh: {
          wands: '💡 建议：主动行动，抓住机会，但别忘记计划。' + ctx.advice,
          cups: '💡 建议：倾听内心，表达情感，让直觉引导你。' + ctx.advice,
          swords: '💡 建议：理性分析，清晰沟通，避免冲动决策。' + ctx.advice,
          pentacles: '💡 建议：脚踏实地，关注实际，耐心积累成果。' + ctx.advice
        },
        en: {
          wands: '💡 Advice: Take action, seize opportunities, but don\'t forget to plan. ' + ctx.advice,
          cups: '💡 Advice: Listen to your heart, express emotions, let intuition guide you. ' + ctx.advice,
          swords: '💡 Advice: Analyze rationally, communicate clearly, avoid impulsive decisions. ' + ctx.advice,
          pentacles: '💡 Advice: Stay grounded, focus on practicalities, accumulate results patiently. ' + ctx.advice
        }
      };

      return adviceMap[isEn ? 'en' : 'zh'][dominant] || '';
    }

    // ============ 标准解读生成（5段式，含牌阵感知 + 牌面组合 + 能量趋势）============
    generateStandardReading(cards, mode, positions) {
      const isEn = this.currentLang === 'en';
      const ctx = this.getSpreadContext(mode, isEn);
      let html = '<div class="standard-reading">';

      // 1. 核心主题（融入牌阵特色 + 牌面组合分析）
      html += '<div class="std-section">';
      html += '<div class="std-title">' + (isEn ? '★ Core Theme' : '★ 核心主题') + '</div>';
      html += '<div class="std-content">' + this.generateCoreTheme(cards, isEn, mode, ctx) + '</div>';
      html += '</div>';

      // 2. 牌面组合解读（新增：标准模式专属增强）
      html += '<div class="std-section">';
      html += '<div class="std-title">' + (isEn ? '⚕ Card Combinations' : '⚕ 牌面组合解读') + '</div>';
      html += '<div class="std-content">' + this.generateStandardCombinations(cards, isEn) + '</div>';
      html += '</div>';

      // 3. 关键建议（融入牌阵特色 + 结合具体牌面）
      html += '<div class="std-section">';
      html += '<div class="std-title">' + (isEn ? '⚡ Key Advice' : '⚡ 关键建议') + '</div>';
      html += '<div class="std-content"><ul>' + this.generateKeyAdvice(cards, isEn, mode, ctx) + '</ul></div>';
      html += '</div>';

      // 4. 能量趋势（新增：简化版趋势分析）
      html += '<div class="std-section">';
      html += '<div class="std-title">' + (isEn ? '📈 Energy Trend' : '📈 能量趋势') + '</div>';
      html += '<div class="std-content">' + this.generateStandardTrend(cards, isEn) + '</div>';
      html += '</div>';

      // 5. 注意事项（融入牌阵特色）
      html += '<div class="std-section">';
      html += '<div class="std-title">' + (isEn ? '⚠ Things to Note' : '⚠ 注意事项') + '</div>';
      html += '<div class="std-content">' + this.generateWarnings(cards, isEn, mode, ctx) + '</div>';
      html += '</div>';

      html += '</div>';
      return html;
    }

    generateCoreTheme(cards, isEn, mode, ctx) {
      const hasMajor = cards.some(c => c.card.suit === 'major');
      const revCount = cards.filter(c => c.isReversed).length;
      const majorCards = cards.filter(c => c.card.suit === 'major');

      // 牌阵专属主题前缀
      let prefix = (isEn ? 'This reading focuses on: ' : '本次占卜聚焦于：') + ctx.theme + '。';

      if (isEn) {
        let text = prefix + ' ';
        if (hasMajor) {
          text += 'Important life themes are present';
          if (majorCards.length === 1) {
            text += ' — ' + deckManager.getCardName(majorCards[0].card) + ' indicates ' + 
                    (isEn ? 'a key lesson you need to learn' : '你需要学习的重要课题');
          } else if (majorCards.length >= 2) {
            const sep = ', ';
            const majorNames = majorCards.map(c => deckManager.getCardName(c.card)).join(sep);
            text += ' — multiple Major Arcana (' + majorNames + ') suggest this is a fateful period';
          }
          text += '. ';
        }
        if (revCount > cards.length / 2) text += 'Challenges you face are guiding necessary transformations. ';
        else if (revCount > 0) text += 'Some challenges need attention, but overall the energy supports moving forward. ';
        else text += 'The energy is very supportive for moving forward. ';
        return text;
      } else {
        let text = prefix + ' ';
        if (hasMajor) {
          text += '重要的生命课题正在显现';
          if (majorCards.length === 1) {
            text += '——「' + deckManager.getCardName(majorCards[0].card) + '」指示了你需要学习的核心课题';
          } else if (majorCards.length >= 2) {
            const sep = '、';
            const majorNames = majorCards.map(c => '「' + deckManager.getCardName(c.card) + '」').join(sep);
            text += '——多张张大阿卡那牌（' + majorNames + '）同时出现，说明这是一个充满命运转折的时期';
          }
          text += '。';
        }
        if (revCount > cards.length / 2) text += '你面临的挑战正在引导必要的转化。';
        else if (revCount > 0) text += '部分牌面逆位提示需要注意的挑战，但整体能量对前进是比较支持的。';
        else text += '所有牌面都是正位，整体能量非常支持你前进。';
        return text;
      }
    }

    // ============ 标准模式：牌面组合解读（简化版）============
    generateStandardCombinations(cards, isEn) {
      let text = '';
      const majors = cards.filter(c => c.card.suit === 'major');
      const elements = { wands: 0, cups: 0, swords: 0, pentacles: 0 };
      
      cards.forEach(c => {
        const suit = c.card.suit;
        if (suit === 'wands' || suit === 'fire') elements.wands++;
        else if (suit === 'cups' || suit === 'water') elements.cups++;
        else if (suit === 'swords' || suit === 'clouds') elements.swords++;
        else if (suit === 'pentacles' || suit === 'rainbow') elements.pentacles++;
      });

      // 1. 检测大阿卡那牌对组合
      const majorIds = majors.map(m => {
        if (typeof m.card.id === 'number') {
          return `major-${String(m.card.id).padStart(2, '0')}`;
        }
        return m.card.id;
      });
      if (majorIds.includes('major-00') && majorIds.includes('major-01')) {
        text += isEn 
          ? 'The Fool and The Magician together indicate a powerful new beginning. The universe is giving you a "reset button".'
          : '【愚者】与【魔术师】同时出现，预示着强大的新开始。宇宙正在给你一个"重启按钮"。';
        text += '<br/>';
      }
      if (majorIds.includes('major-13') && majorIds.includes('major-20')) {
        text += isEn
          ? 'Death and Judgement together indicate complete transformation and rebirth. You are going through a soul-level change.'
          : '【死神】与【审判】同时出现，预示着彻底的转化与重生。你正在经历灵魂层面的深刻改变。';
        text += '<br/>';
      }
      if (majorIds.includes('major-19') && majorIds.includes('major-06')) {
        text += isEn
          ? 'The Sun and The Lovers together indicate that following your heart will lead to bright outcomes.'
          : '【太阳】与【恋人】同时出现，预示着跟随内心会走向光明的结果。';
        text += '<br/>';
      }

      // 2. 检测元素主导与缺失
      const maxElement = Object.entries(elements).sort((a, b) => b[1] - a[1])[0];
      const minElement = Object.entries(elements).sort((a, b) => a[1] - b[1])[0];
      const elementNames = { wands: '权杖', cups: '圣杯', swords: '宝剑', pentacles: '星币' };
      const elementNamesEn = { wands: 'Wands', cups: 'Cups', swords: 'Swords', pentacles: 'Pentacles' };

      if (maxElement[1] >= 2) {
        const elemName = isEn ? elementNamesEn[maxElement[0]] : elementNames[maxElement[0]];
        text += isEn
          ? `The dominance of ${elemName} suit indicates strong energy in this area. `
          : `牌面中【${elemName}】牌组占主导，说明这个领域的能量很强。`;
        text += '<br/>';
      }

      if (minElement[1] === 0 && cards.length >= 4) {
        const elemName = isEn ? elementNamesEn[minElement[0]] : elementNames[minElement[0]];
        text += isEn
          ? `The absence of ${elemName} suit suggests this element needs more attention in the situation.`
          : `牌面中缺少【${elemName}】牌组，说明在这个情境中这个元素需要更多关注。`;
        text += '<br/>';
      }

      // 3. 检测同牌组相邻牌的增强效果
      for (let i = 0; i < cards.length - 1; i++) {
        if (cards[i].card.suit === cards[i+1].card.suit && cards[i].card.suit !== 'major') {
          const suitName = isEn ? cards[i].card.suit : elementNames[cards[i].card.suit];
          text += isEn
            ? `Adjacent ${suitName} cards enhance each other's energy, creating a focused influence.`
            : `相邻的【${suitName}】牌相互增强能量，形成集中的影响力。`;
          text += '<br/>';
          break; // 只显示第一个
        }
      }

      if (text === '') {
        text = isEn 
          ? 'The cards work together harmoniously. Refer to individual card meanings above for detailed interpretation.'
          : '牌面和谐共事。请参考上方各张牌的牌意进行解读。';
      }

      return text;
    }

    // ============ 标准模式：能量趋势分析（简化版）============
    generateStandardTrend(cards, isEn) {
      let text = '';
      
      // 计算前半段和后半段逆位比例
      const firstHalf = cards.slice(0, Math.ceil(cards.length / 2));
      const secondHalf = cards.slice(Math.ceil(cards.length / 2));
      let firstRev = 0, secondRev = 0;
      firstHalf.forEach(c => { if (c.isReversed) firstRev++; });
      secondHalf.forEach(c => { if (c.isReversed) secondRev++; });

      const firstRevRatio = firstRev / firstHalf.length;
      const secondRevRatio = secondHalf.length > 0 ? secondRev / secondHalf.length : 0;

      // 判断趋势
      if (secondRevRatio < firstRevRatio - 0.3) {
        text = isEn 
          ? 'The energy trend is <strong>improving</strong>. Challenges in the early stage are gradually being resolved, and the future looks more positive.'
          : '能量趋势<strong>正在好转</strong>。前期的挑战正在逐步化解，未来走向更加积极。';
      } else if (secondRevRatio > firstRevRatio + 0.3) {
        text = isEn
          ? 'The energy trend shows <strong>caution</strong>. The situation may face increasing challenges. Early preparation and adjustment are recommended.'
          : '能量趋势显示需要<strong>谨慎</strong>。情况可能面临越来越多挑战，建议提前做好准备和调整。';
      } else {
        text = isEn
          ? 'The energy trend is <strong>stable</strong>. The situation will develop steadily. Maintaining current direction and pace is appropriate.'
          : '能量趋势<strong>平稳</strong>。情况会稳步发展，保持目前的方向和节奏即可。';
      }

      // 检测是否有大阿卡那转折牌
      const turningCardsEn = ['Wheel of Fortune', 'Judgement', 'The Tower', 'Death'];
      const turningCardsZh = ['命运之轮', '审判', '塔', '死神'];
      const turningCards = isEn ? turningCardsEn : turningCardsZh;
      
      cards.forEach(c => {
        const nameToCheck = isEn ? c.card.originalName : c.card.name;
        if (turningCards.includes(nameToCheck)) {
          text += isEn
            ? '<br/><br/><strong>Note:</strong> ' + deckManager.getCardName(c.card) + ' indicates a possible turning point. The situation may change unexpectedly.'
            : '<br/><br/><strong>注意：</strong>【' + deckManager.getCardName(c.card) + '】的出现预示可能的转折点，情况可能有意外变化。';
        }
      });

      return text;
    }

    generateKeyAdvice(cards, isEn, mode, ctx) {
      const advice = [];
      const elements = { wands: 0, cups: 0, swords: 0, pentacles: 0 };

      cards.forEach(c => {
        if (c.card.suit in elements) elements[c.card.suit]++;
      });

      const dominant = Object.entries(elements).sort((a, b) => b[1] - a[1])[0][0];

      // 牌阵专属建议（优先加入，限制2条以留出空间给牌面建议）
      const spreadAdvice = isEn ? this.getSpreadSpecificAdviceEn(mode) : this.getSpreadSpecificAdviceZh(mode);
      spreadAdvice.slice(0, 2).forEach(a => { if (advice.length < 5) advice.push(a); });

      // 基于具体牌面给出针对性建议（新增：结合具体抽到的牌）
      cards.forEach(c => {
        if (advice.length >= 5) return;
        const cardName = deckManager.getCardName(c.card);
        const isRev = c.isReversed;
        
        if (isEn) {
          const adviceText = this.getCardSpecificAdviceEn(c.card, isRev, cardName);
          if (adviceText && !advice.includes(adviceText)) {
            advice.push(adviceText);
          }
        } else {
          const adviceText = this.getCardSpecificAdviceZh(c.card, isRev, cardName);
          if (adviceText && !advice.includes(adviceText)) {
            advice.push(adviceText);
          }
        }
      });

      // 如果建议不够5条，补充元素主导建议
      if (isEn) {
        if (dominant === 'wands' && advice.length < 5) advice.push('Take initiative and act on your goals with confidence');
        if (dominant === 'cups' && advice.length < 5) advice.push('Trust your intuition and let emotions guide your decisions');
        if (dominant === 'swords' && advice.length < 5) advice.push('Think clearly and communicate your truth honestly');
        if (dominant === 'pentacles' && advice.length < 5) advice.push('Focus on practical steps and build solid foundations');
      } else {
        if (dominant === 'wands' && advice.length < 5) advice.push('主动出击，自信地朝目标行动');
        if (dominant === 'cups' && advice.length < 5) advice.push('信任直觉，让情感指引你的决定');
        if (dominant === 'swords' && advice.length < 5) advice.push('清晰思考，诚实地沟通你的真相');
        if (dominant === 'pentacles' && advice.length < 5) advice.push('关注实际步骤，打下坚实基础');
      }

      return advice.slice(0, 5).map(a => '<li>' + a + '</li>').join('');
    }

    // ============ 根据具体牌面生成针对性建议（中文）============
    getCardSpecificAdviceZh(card, isReversed, cardName) {
      if (!card || !card.id) return null;
      const suit = card.suit;
      const id = card.id;
      
      // 大阿卡那牌的针对性建议
      if (suit === 'major') {
        const majorAdvice = {
          'major-00': isReversed ? '不要冲动开始新事物，先做好规划再行动' : '勇敢踏上新旅程，这是属于你的时刻',
          'major-01': isReversed ? '暂时不要操控局面，让事情自然发展' : '运用你的创造力和意志力去实现目标',
          'major-02': isReversed ? '不要过度牺牲自己，学会设立边界' : '相信直觉，在合适时机采取行动',
          'major-03': isReversed ? '不要被过剩的母性/控制欲束缚，给对方空间' : '用爱和耐心滋养周围的人事物',
          'major-04': isReversed ? '打破僵化的传统和限制，拥抱变化' : '在传统和稳定中建立扎实的基础',
          'major-05': isReversed ? '困境即将过去，保持希望' : '接受当前的挑战，它们让你更强大',
          'major-06': isReversed ? '不要陷入不平衡的关系，做出选择' : '跟随内心的声音，做出真诚的选择',
          'major-07': isReversed ? '不要被恐惧支配，面对你的阴影' : '运用内在力量和勇气战胜挑战',
          'major-08': isReversed ? '不要过度控制，学会放松和信任' : '保持自律和耐心，正义终将到来',
          'major-09': isReversed ? '不要过度孤立自己，适当寻求支持' : '享受独处的智慧，内在力量正在增长',
          'major-10': isReversed ? '命运之轮暂时在低处，但很快就会转动起来' : '接受命运的起伏，好运转眼即到',
          'major-11': isReversed ? '不要滥用力量，真正的力量来自内在' : '运用你的力量为他人服务，保持正义',
          'major-12': isReversed ? '牺牲已经完成，现在可以放下重担了' : '有些牺牲是必要的，但为了更高的善',
          'major-13': isReversed ? '抗拒改变只会带来更多痛苦，试着放下' : '彻底放下旧的模式，为新生让路',
          'major-14': isReversed ? '不要抗拒内在的转化，保持平衡' : '在变化中保持内在平衡，耐心等待',
          'major-15': isReversed ? '正在从阴影中走出来，继续前进' : '面对你的阴影和执念，它们是成长的契机',
          'major-16': isReversed ? '危机已经过去，从废墟中重建' : '突如其来的变化正在打破旧结构，接受它',
          'major-17': isReversed ? '不要失去希望，星星仍在照耀' : '保持希望和信心，宇宙正在回应你的愿望',
          'major-18': isReversed ? '幻觉正在消散，真相即将显现' : '信任你的直觉，但小心不要被幻觉迷惑',
          'major-19': isReversed ? '暂时的阴霾遮挡了阳光，但光明仍在' : '光明和喜悦正在到来，享受生命的礼物',
          'major-20': isReversed ? '不要忽略内在的召唤，是时候醒来了' : '内在的声音正在召唤你，倾听并行动',
          'major-21': isReversed ? '尚未完成整合，需要更多内在工作' : '你已经完成了一个重要阶段，庆祝你的成就'
        };
        return majorAdvice[id] || null;
      }
      
      // 小阿卡那牌的针对性建议（按牌组给出）
      // 安全获取牌面数字（兼容 id 为数字或字符串的情况）
      const getNumFromId = (id) => {
        if (typeof id === 'number') return id;
        if (!id) return 0;
        return parseInt(String(id).split('-').pop()) || 0;
      };
      
      if (suit === 'wands') {
        const num = getNumFromId(id);
        if (num <= 3) return isReversed ? '权杖牌逆位提示行动受阻，检查是否有内在恐惧' : '权杖牌正位鼓励你主动行动，抓住机会';
        if (num <= 7) return isReversed ? '行动过程中遇到挑战，需要调整策略' : '行动顺利推进中，保持专注和热情';
        if (num <= 10) return isReversed ? '行动的结果不如预期，反思并从中学习' : '行动即将带来成果，坚持到底';
        // 宫廷牌
        return isReversed ? '权杖宫廷牌逆位提示行动能量失衡' : '权杖宫廷牌鼓励你用热情和创意领导';
      }
      
      if (suit === 'cups') {
        const num = getNumFromId(id);
        if (num <= 3) return isReversed ? '情感上可能有失落，给自己时间疗愈' : '情感上正在经历甜蜜或新的开始';
        if (num <= 7) return isReversed ? '情感上需要做出选择或放下' : '情感丰富，享受并信任这份能量';
        if (num <= 10) return isReversed ? '情感上的满足感受到挑战' : '情感上的满足和家庭幸福正在实现';
        return isReversed ? '圣杯宫廷牌逆位提示情感表达受阻' : '圣杯宫廷牌鼓励你用爱和同理心交流';
      }
      
      if (suit === 'swords') {
        const num = getNumFromId(id);
        if (num <= 3) return isReversed ? '思维上的痛苦正在缓解' : '思维清晰但可能伴随痛苦，保持理性';
        if (num <= 7) return isReversed ? '过度的思考正在制造混乱，需要静心' : '思维活跃，用逻辑和沟通解决问题';
        if (num <= 10) return isReversed ? '痛苦的结束，真相即将大白' : '思维上的挑战正在带来真相和释放';
        return isReversed ? '宝剑宫廷牌逆位提示思维或沟通偏颇' : '宝剑宫廷牌鼓励你用清晰思维和公正沟通';
      }
      
      if (suit === 'pentacles') {
        const num = getNumFromId(id);
        if (num <= 3) return isReversed ? '财务或资源上的新开始受阻' : '财务或资源上的新机会正在出现';
        if (num <= 7) return isReversed ? '努力尚未带来回报，不要放弃' : '务实的努力正在积累，耐心等待收获';
        if (num <= 10) return isReversed ? '财务上的损失或不安' : '财务稳定和丰盛正在实现';
        return isReversed ? '星币宫廷牌逆位提示务实或财务上有盲点' : '星币宫廷牌鼓励你务实并有耐心地积累';
      }
      
      return null;
    }

    // ============ 根据具体牌面生成针对性建议（英文）============
    getCardSpecificAdviceEn(card, isReversed, cardName) {
      if (!card || !card.id) return null;
      const suit = card.suit;
      const id = card.id;
      
      // 大阿卡那牌的针对性建议
      if (suit === 'major') {
        const majorAdvice = {
          'major-00': isReversed ? 'Don\'t rush into new things; plan first' : 'Bravely embark on a new journey; this is your moment',
          'major-01': isReversed ? 'Don\'t manipulate; let things unfold naturally' : 'Use your creativity and willpower to achieve goals',
          'major-02': isReversed ? 'Don\'t over-sacrifice; learn to set boundaries' : 'Trust intuition and act at the right moment',
          'major-03': isReversed ? 'Don\'t be controlled by excessive nurturing; give space' : 'Nurture people and things around you with love',
          'major-04': isReversed ? 'Break rigid traditions and embrace change' : 'Build a solid foundation within tradition',
          'major-05': isReversed ? 'Hardship is passing; keep hope' : 'Accept current challenges; they make you stronger',
          'major-06': isReversed ? 'Don\'t stay in unbalanced relationships; make a choice' : 'Follow your heart and make authentic choices',
          'major-07': isReversed ? 'Don\'t be ruled by fear; face your shadow' : 'Use inner strength and courage to overcome challenges',
          'major-08': isReversed ? 'Don\'t over-control; learn to relax and trust' : 'Maintain self-discipline and patience; justice will come',
          'major-09': isReversed ? 'Don\'t over-isolate; seek support when needed' : 'Enjoy the wisdom of solitude; inner strength grows',
          'major-10': isReversed ? 'The Wheel is temporarily low, but will turn soon' : 'Accept the ups and downs of fate; good luck is coming',
          'major-11': isReversed ? 'Don\'t abuse power; true power comes from within' : 'Use your power to serve others; maintain justice',
          'major-12': isReversed ? 'Sacrifice is complete; you can let go now' : 'Some sacrifice is necessary for the higher good',
          'major-13': isReversed ? 'Resisting change brings more pain; try to let go' : 'Completely release old patterns; make way for rebirth',
          'major-14': isReversed ? 'Don\'t resist inner transformation; maintain balance' : 'Maintain inner balance amid changes; wait patiently',
          'major-15': isReversed ? 'You are walking out of shadow; keep going' : 'Face your shadow and attachments; they are growth opportunities',
          'major-16': isReversed ? 'Crisis has passed; rebuild from ruins' : 'Sudden change is breaking old structures; accept it',
          'major-17': isReversed ? 'Don\'t lose hope; the Star still shines' : 'Keep hope and faith; the universe is answering',
          'major-18': isReversed ? 'Illusions are dissolving; truth is coming' : 'Trust your intuition, but beware of illusions',
          'major-19': isReversed ? 'Temporary clouds obscure the Sun, but light remains' : 'Light and joy are coming; enjoy life\'s gifts',
          'major-20': isReversed ? 'Don\'t ignore the inner call; time to wake up' : 'Inner voice is calling you; listen and act',
          'major-21': isReversed ? 'Integration incomplete; more inner work needed' : 'You have completed an important phase; celebrate'
        };
        return majorAdvice[id] || null;
      }
      
      // 小阿卡那牌的针对性建议（按牌组给出）
      // 安全获取牌面数字（兼容 id 为数字或字符串的情况）
      const getNumFromId = (id) => {
        if (typeof id === 'number') return id;
        if (!id) return 0;
        return parseInt(String(id).split('-').pop()) || 0;
      };
      
      if (suit === 'wands') {
        const num = getNumFromId(id);
        if (num <= 3) return isReversed ? 'Reversed Wands suggest blocked action; check inner fears' : 'Upright Wands encourage taking initiative and seizing opportunities';
        if (num <= 7) return isReversed ? 'Challenges in action; adjust your strategy' : 'Action progressing smoothly; stay focused and passionate';
        if (num <= 10) return isReversed ? 'Action results not as expected; reflect and learn' : 'Action about to bear fruit; persevere to the end';
        return isReversed ? 'Reversed Wands Court card suggests imbalanced action energy' : 'Wands Court cards encourage leading with passion and creativity';
      }
      
      if (suit === 'cups') {
        const num = getNumFromId(id);
        if (num <= 3) return isReversed ? 'Emotional loss possible; give yourself time to heal' : 'Experiencing sweetness or new emotional beginnings';
        if (num <= 7) return isReversed ? 'Need to make emotional choices or let go' : 'Emotions are rich; enjoy and trust this energy';
        if (num <= 10) return isReversed ? 'Emotional fulfillment challenged' : 'Emotional fulfillment and family happiness manifesting';
        return isReversed ? 'Reversed Cups Court card suggests blocked emotional expression' : 'Cups Court cards encourage communicating with love and empathy';
      }
      
      if (suit === 'swords') {
        const num = getNumFromId(id);
        if (num <= 3) return isReversed ? 'Mental pain is easing' : 'Mind is clear but may involve pain; stay rational';
        if (num <= 7) return isReversed ? 'Overthinking creating chaos; need to calm mind' : 'Mind is active; use logic and communication to solve problems';
        if (num <= 10) return isReversed ? 'Pain ending; truth about to surface' : 'Mental challenges bringing truth and release';
        return isReversed ? 'Reversed Swords Court card suggests biased thinking or communication' : 'Swords Court cards encourage clear thinking and fair communication';
      }
      
      if (suit === 'pentacles') {
        const num = getNumFromId(id);
        if (num <= 3) return isReversed ? 'New financial or resource beginnings blocked' : 'New financial or resource opportunities appearing';
        if (num <= 7) return isReversed ? 'Effort not yet bringing rewards; don\'t give up' : 'Practical efforts accumulating; wait patiently for harvest';
        if (num <= 10) return isReversed ? 'Financial loss or insecurity' : 'Financial stability and abundance manifesting';
        return isReversed ? 'Reversed Pentacles Court card suggests blind spots in practical or financial matters' : 'Pentacles Court cards encourage being practical and patiently accumulating';
      }
      
      return null;
    }

    // 牌阵专属建议（中文）
    getSpreadSpecificAdviceZh(mode) {
      const map = {
        single:     ['以今日抽到的牌为核心指引，专注当下'],
        three:      ['结合过去、现在、未来三张牌理解时间线'],
        celtic:     ['综合十个位置全面分析当前处境'],
        relation:   ['关注你与对方各自的状态和态度', '留意关系发展的可能方向'],
        choice:     ['比较A、B两个选项的可能结果', '权衡后做出最适合自己的选择'],
        five:       ['针对问题核心采取行动', '留意潜意识中隐藏的影响因素'],
        horseshoe:  ['从过去的影响到最终结果全面考量', '留意未被重视的隐藏因素'],
        career:     ['关注事业发展的优势与挑战', '把握建议的行动方向'],
        timeflow:   ['理解事情从过去到未来的发展脉络', '关注深层根本原因'],
        action:     ['明确问题核心后立即采取行动', '相信牌面指引的可能结果'],
        mind:       ['整合意识与潜意识的讯息', '在理想与现实之间找到平衡'],
        love:       ['关注彼此的真实感受与关系本质', '留意外部影响对关系的干扰'],
        broken:     ['诚实面对导致分开的根本原因', '评估双方是否都有复合的意愿'],
        yesno:      ['正位牌偏向「是」，逆位牌偏向「否」', '综合支持与反对因素后判断'],
        jobchange:  ['评估现工作的离职原因是否充分', '了解新机会的真实情况与风险'],
        shadow:     ['接纳自己不愿面对的阴影面向', '释放阻碍成长的旧有模式'],
        year:       ['关注年度各领域的整体能量走向', '在重点领域提前做好准备'],
        proscons:   ['列出所有支持与反对的理由', '留意未被考虑的隐藏因素'],
        travel:     ['关注旅途整体能量与安全事项', '以开放心态迎接旅途的收获'],
        lifepurpose:['认清自己的核心天赋与人生课题', '勇敢走向属于自己的使命方向'],
        exam:       ['针对牌面指示的重点方向复习', '调整心态，保持适度紧张'],
        fatewheel:  ['把握命运之轮即将转动的转折点', '留意隐藏的机遇与可能的陷阱'],
        monthly:    ['关注本月核心能量主题', '在本月重点领域中积极行动'],
        souljourney:['连接内在高我的声音与指引', '接纳灵魂深处需要整合的阴影'],
        zodiac:     ['关注重点宫位显示的领域讯息', '综合十二宫位全面了解自己'],
        pastlife:   ['理解前世未完成课题对今生的影响', '以慈悲心化解前世的业力模式'],
        health:     ['关注身心健康的根本能量因素', '必要时寻求专业医疗建议']
      };
      return map[mode] || [];
    }

    // 牌阵专属建议（英文）
    getSpreadSpecificAdviceEn(mode) {
      const map = {
        single:     ['Take the drawn card as core guidance, focus on the present'],
        three:      ['Understand the timeline by combining past, present, and future cards'],
        celtic:     ['Comprehensively analyze current situation from ten positions'],
        relation:   ['Pay attention to each other\'s state and attitude', 'Notice the possible direction of relationship development'],
        choice:     ['Compare possible outcomes of options A and B', 'Make the choice that suits you best after weighing'],
        five:       ['Take action targeting the problem core', 'Notice hidden influencing factors in the subconscious'],
        horseshoe:  ['Consider comprehensively from past influence to final outcome', 'Notice hidden factors not valued'],
        career:     ['Focus on advantages and challenges in career development', 'Grasp the suggested action direction'],
        timeflow:   ['Understand the development from past to future', 'Pay attention to the deep root cause'],
        action:     ['Take action immediately after clarifying the problem core', 'Trust the possible outcome shown by the cards'],
        mind:       ['Integrate messages from conscious and subconscious', 'Find balance between ideal and reality'],
        love:       ['Focus on each other\'s true feelings and relationship essence', 'Notice external influences on the relationship'],
        broken:     ['Face the root cause of the breakup honestly', 'Assess whether both parties have willingness to reunite'],
        yesno:      ['Upright cards lean toward "yes", reversed lean toward "no"', 'Judge after integrating supporting and opposing factors'],
        jobchange:  ['Assess whether the reason for leaving is sufficient', 'Understand the reality and risks of the new opportunity'],
        shadow:     ['Embrace the shadow aspects you are unwilling to face', 'Release old patterns that hinder growth'],
        year:       ['Focus on the overall energy direction of each area this year', 'Prepare in advance in key focus areas'],
        proscons:   ['List all supporting and opposing reasons', 'Notice hidden factors not yet considered'],
        travel:     ['Pay attention to overall travel energy and safety', 'Welcome travel gains with an open mind'],
        lifepurpose:['Recognize your core talent and life lessons', 'Bravely move toward your own mission direction'],
        exam:       ['Review focusing on the direction indicated by the cards', 'Adjust mindset, maintain moderate tension'],
        fatewheel:  ['Grasp the turning point where the Wheel of Fortune is about to turn', 'Notice hidden opportunities and possible traps'],
        monthly:    ['Focus on this month\'s core energy theme', 'Take active action in this month\'s key areas'],
        souljourney:['Connect with the voice and guidance of your higher self', 'Embrace the shadows deep in your soul that need integration'],
        zodiac:     ['Focus on messages from key house positions', 'Comprehensively understand yourself through twelve houses'],
        pastlife:   ['Understand the impact of past-life unfinished lessons on this life', 'Resolve past-life karmic patterns with compassion'],
        health:     ['Focus on root energy factors of body-mind health', 'Seek professional medical advice when necessary']
      };
      return map[mode] || [];
    }

    generateWarnings(cards, isEn, mode, ctx) {
      const revCount = cards.filter(c => c.isReversed).length;

      // 牌阵专属注意事项
      const spreadWarn = isEn ? this.getSpreadSpecificWarningEn(mode) : this.getSpreadSpecificWarningZh(mode);

      if (isEn) {
        let text = '';
        if (spreadWarn) text += spreadWarn + ' ';
        if (revCount >= 2) text += 'Some reversed cards suggest inner resistance. Allow time for integration.';
        else text += 'Overall the energy flows well. Stay mindful of details.';
        return text;
      } else {
        let text = '';
        if (spreadWarn) text += spreadWarn + ' ';
        if (revCount >= 2) text += '部分逆位牌提示内在抗拒。给自己时间整合。';
        else text += '整体能量流动顺畅，注意保持对细节的觉察。';
        return text;
      }
    }

    // 牌阵专属注意事项（中文）
    getSpreadSpecificWarningZh(mode) {
      const map = {
        celtic:     '凯尔特十字信息量大，建议分次理解',
        relation:   '关系解读仅供参考，真实感情需要双方沟通',
        choice:     '塔罗显示的可能性，最终决定权在你手中',
        five:       '建议的行动需要配合实际状况灵活调整',
        career:     '事业决策建议结合现实条件综合判断',
        shadow:     '阴影工作可能带来不适，请温柔对待自己',
        year:       '年运显示整体趋势，具体事件仍有变数',
        lifepurpose:'人生使命的探索是一生的旅程，不必急于求成',
        exam:       '考试结果也受实际准备程度影响，牌面仅供参考',
        fatewheel:  '命运之轮有升有降，顺境时勿骄，逆境时勿馁',
        zodiac:     '十二宫位信息量大，建议分次深入理解',
        pastlife:   '前世解读属于灵性探索，请以开放心态看待',
        health:     '健康解读不能替代专业医疗诊断，如有不适请及时就医'
      };
      return map[mode] || '';
    }

    // 牌阵专属注意事项（英文）
    getSpreadSpecificWarningEn(mode) {
      const map = {
        celtic:     'Celtic Cross has rich information; it is recommended to understand it in stages',
        relation:   'Relationship reading is for reference only; real feelings need communication from both sides',
        choice:     'Tarot shows possibilities; the final decision is in your hands',
        five:       'Suggested actions need flexible adjustment according to actual conditions',
        career:     'Career decisions should be comprehensively judged combined with realistic conditions',
        shadow:     'Shadow work may cause discomfort; please treat yourself gently',
        year:       'Yearly reading shows overall trends; specific events still have variables',
        lifepurpose:'Exploring life purpose is a lifelong journey; no need to rush',
        exam:       'Exam results are also affected by actual preparation; the reading is for reference only',
        fatewheel:  'The Wheel of Fortune has ups and downs; don\'t be proud in good times, don\'t be discouraged in bad times',
        zodiac:     'Twelve houses have rich information; it is recommended to understand deeply in stages',
        pastlife:   'Past-life reading is spiritual exploration; please view it with an open mind',
        health:     'Health reading cannot replace professional medical diagnosis; please seek medical attention if unwell'
      };
      return map[mode] || '';
    }

    // ============ Level 2 优化：分析牌意组合 ============
    analyzeCardCombinations(cards) {
      let html = '<div class="reading-section">';
      html += '<div class="reading-section-title">' + (this.currentLang === 'en' ? '⚕ Card Combinations' : '⚕ 牌意组合解读') + '</div>';
      html += '<div class="reading-section-body">';

      let text = '';
      const majors = cards.filter((item) => item.card.suit === 'major');
      const elements = { wands: 0, cups: 0, swords: 0, pentacles: 0 };
      cards.forEach((item) => {
        const suit = item.card.suit;
        if (suit === 'wands' || suit === 'fire') elements.wands++;
        else if (suit === 'cups' || suit === 'water') elements.cups++;
        else if (suit === 'swords' || suit === 'clouds') elements.swords++;
        else if (suit === 'pentacles' || suit === 'rainbow') elements.pentacles++;
      });

      // 检测多张大阿卡那牌
      if (majors.length >= 2) {
        const sep = this.currentLang === 'en' ? ', ' : '、';
        const majorNames = majors.map((m) => deckManager.getCardName(m.card) + ' ' + this.getPosText(m.isReversed)).join(sep);
        text += this.t('combo_major_many', majors.length, majorNames);
      }

      // 检测特定大阿卡那牌对（如：死神+审判=重生，魔术师+愚者=新开始）
      const majorIds = majors.map((m) => {
        if (typeof m.card.id === 'number') {
          return `major-${String(m.card.id).padStart(2, '0')}`;
        }
        return m.card.id;
      });
      if (majorIds.includes('major-00') && majorIds.includes('major-01')) {
        text += this.currentLang === 'en'
          ? 'The Fool and The Magician appearing together indicate a powerful new beginning. The universe is giving you a "reset button" — dare to start anew.'
          : '愚者与魔术师同时出现，预示着强大的新开始。宇宙正在给你一个"重启按钮"——勇敢地从零开始吧。';
      }
      if (majorIds.includes('major-13') && majorIds.includes('major-20')) {
        text += this.currentLang === 'en'
          ? 'Death and Judgement together indicate a complete transformation and rebirth. You are going through a deep soul-level change.'
          : '死神与审判同时出现，预示着彻底的转化与重生。你正在经历灵魂层面的深刻改变。';
      }
      if (majorIds.includes('major-19') && majorIds.includes('major-06')) {
        text += this.currentLang === 'en'
          ? 'The Sun and The Lovers together indicate that following your heart will lead to bright outcomes. Love and joy are supporting your path.'
          : '太阳与恋人同时出现，预示着跟随内心会走向光明的结果。爱与喜悦正在支持你的道路。';
      }
      if (majorIds.includes('major-07') && majorIds.includes('major-08')) {
        text += this.currentLang === 'en'
          ? 'The Chariot and Strength together indicate that willpower and inner strength are combined — nothing can stop you now.'
          : '战车与力量同时出现，预示着意志力与内在力量结合，无往不利。';
      }
      if (majorIds.includes('major-15') && item.isReversed && majorIds.includes('major-13')) {
        text += this.currentLang === 'en'
          ? 'The Devil reversed and Death together indicate strong release and rebirth energy. You are breaking free from old chains.'
          : '恶魔逆位与死神同时出现，预示着强烈的释放与重生能量。你正在打破旧的枷锁。';
      }
      if (majorIds.includes('major-17') && majorIds.includes('major-18')) {
        text += this.currentLang === 'en'
          ? 'The Star and The Moon together indicate that hope and confusion coexist. Trust your intuition even when the path is not clear.'
          : '星星与月亮同时出现，预示着希望与迷茫并存。即使道路不清晰，也要信任你的直觉。';
      }

      // 检测小阿卡那强力组合
      const hasAceWands = cards.some(c => {
        const id = c.card.id;
        if (typeof id === 'number') return id === 1 && (c.card.suit === 'wands' || c.card.suit === 'fire');
        return id === 'wands-01' || id === 'fire-01';
      });
      const hasAcePentacles = cards.some(c => {
        const id = c.card.id;
        if (typeof id === 'number') return id === 1 && (c.card.suit === 'pentacles' || c.card.suit === 'rainbow');
        return id === 'pentacles-01' || id === 'rainbow-01';
      });
      if (hasAceWands && hasAcePentacles) {
        text += this.currentLang === 'en'
          ? 'Ace of Wands and Ace of Pentacles together indicate that both inspiration and implementation are present. This is an excellent time for starting a business or making investments.'
          : '权杖王牌与星币王牌同时出现，预示着想法与落地兼备，适合创业或投资。';
      }

      // 检测元素缺失/过剩
      if (elements.pentacles === 0 && cards.length >= 4) {
        text += this.t('combo_light');
      }
      if (elements.pentacles >= 3) {
        text += this.t('combo_grounded');
      }

      // 检测元素对话
      if (elements.swords > 0 && elements.cups > 0) {
        text += this.t('combo_air_water');
      }
      if (elements.wands > 0 && elements.pentacles > 0 && elements.wands >= 2 && elements.pentacles >= 2) {
        text += this.t('combo_fire_earth_block');
      }

      if (text === '') {
        text = this.currentLang === 'en'
          ? 'No special card combinations detected. Please refer to the individual card meanings and position interpretations above.'
          : '未检测到特殊牌意组合。请参考上方各张牌的牌意和位置解读。';
      }

      html += text + '</div></div>';
      return html;
    }

    // ============ Level 3 优化：分析牌面能量强度 ============
    analyzeEnergyIntensity(cards) {
      let html = '<div class="reading-section">';
      html += '<div class="reading-section-title">' + (this.currentLang === 'en' ? '⚡ Energy Intensity' : '⚡ 牌面能量强度') + '</div>';
      html += '<div class="reading-section-body">';

      let text = '';

      // 计算能量强度（大阿卡那牌权重更高，根据序号递增）
      let totalEnergy = 0;
      const cardEnergies = [];
      cards.forEach((item) => {
        let energy = 0;
        if (!item.card || item.card.id == null) {
          console.warn('[analyzeEnergyIntensity] 卡牌数据异常:', item);
          return; // 跳过异常数据
        }
        // 安全获取牌面数字（兼容 id 为数字或字符串的情况）
        const getNumFromId = (id) => {
          if (typeof id === 'number') return id;
          if (!id) return 0;
          return parseInt(String(id).split('-').pop()) || 0;
        };
        if (item.card.suit === 'major') {
          // 大阿卡那牌：根据序号给予不同权重（0愚者=8，21世界=12，中间递增）
          const majorNum = getNumFromId(item.card.id);
          energy = 8 + (majorNum / 21) * 4; // 8~12 的范围
        } else {
          // 小阿卡那牌：宫廷牌 > 数字牌
          const num = getNumFromId(item.card.id);
          if (num >= 11) energy = 7; // 宫廷牌
          else if (num >= 7) energy = 5; // 高数字牌
          else energy = 3; // 低数字牌
        }
        if (item.isReversed) energy *= 0.7; // 逆位能量减弱
        totalEnergy += energy;
        cardEnergies.push({ card: item, energy });
      });

      const avgEnergy = totalEnergy / cards.length;

      // 根据平均能量给出解读
      if (avgEnergy >= 8) {
        text += this.currentLang === 'en'
          ? 'The overall energy of the spread is <strong>very strong</strong>. Major life events or transformations are at play. This is not a time for half-measures.'
          : '牌面整体能量<strong>非常强</strong>。重大生活事件或转化正在发生。这不是一个可以半途而废的时刻。';
      } else if (avgEnergy >= 5) {
        text += this.currentLang === 'en'
          ? 'The overall energy of the spread is <strong>moderate to strong</strong>. Things are moving, and your actions have significant impact. Stay focused and committed.'
          : '牌面整体能量<strong>中等偏强</strong>。事情正在推进，你的行动有重要影响。保持专注和投入。';
      } else {
        text += this.currentLang === 'en'
          ? 'The overall energy of the spread is <strong>gentle</strong>. Changes may be subtle and require patience. This is a time for quiet cultivation rather than dramatic action.'
          : '牌面整体能量<strong>温和</strong>。变化可能微妙，需要耐心。这是默默耕耘而非剧烈行动的时刻。';
      }

      // 找出能量最强和最弱的牌
      cardEnergies.sort((a, b) => b.energy - a.energy);
      const strongest = cardEnergies[0];
      const weakest = cardEnergies[cardEnergies.length - 1];

      text += this.currentLang === 'en'
        ? '<br><br>The card with the <strong>strongest energy</strong> is <strong>' + deckManager.getCardName(strongest.card.card) + ' ' + this.getPosText(strongest.card.isReversed) + '</strong>. This is where your attention and energy should focus.'
        : '<br><br>能量<strong>最强</strong>的牌是<strong>' + deckManager.getCardName(strongest.card.card) + ' ' + this.getPosText(strongest.card.isReversed) + '</strong>。这是你需要注意力和能量投入的地方。';

      // 安全比较两张牌的 id（兼容数字和字符串类型）
      const strongestId = strongest.card.card.id;
      const weakestId = weakest.card.card.id;
      const isSameCard = (typeof strongestId === 'number' && typeof weakestId === 'number') 
        ? strongestId === weakestId 
        : String(strongestId) === String(weakestId);
      
      if (!isSameCard) {
        text += this.currentLang === 'en'
          ? '<br>The card with the <strong>weakest energy</strong> is <strong>' + deckManager.getCardName(weakest.card.card) + ' ' + this.getPosText(weakest.card.isReversed) + '</strong>. This area may need more attention or nurturing.'
          : '<br>能量<strong>最弱</strong>的牌是<strong>' + deckManager.getCardName(weakest.card.card) + ' ' + this.getPosText(weakest.card.isReversed) + '</strong>。这个领域可能需要更多关注或滋养。';
      }

      html += text + '</div></div>';
      return html;
    }

    // ============ 加载动画 ============
    showLoading(text) {
      const overlay = document.getElementById('loading-overlay');
      const loadingText = document.querySelector('.loading-text');
      if (loadingText && text) loadingText.textContent = text;
      if (overlay) overlay.classList.remove('hidden');
    }

    hideLoading() {
      const overlay = document.getElementById('loading-overlay');
      const loadingText = document.querySelector('.loading-text');
      if (loadingText) loadingText.textContent = this.currentLang === 'en' ? 'Shuffling...' : '正在洗牌...';
      if (overlay) overlay.classList.add('hidden');
    }

    // ============ 显示/隐藏综合解读 ============
    toggleComprehensiveReading() {
      const content = document.getElementById('comprehensive-content');
      const btn = document.getElementById('toggle-reading-btn');
      if (!content || !btn) return;
      if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        btn.textContent = this.t('btn_collapse');
      } else {
        content.classList.add('hidden');
        btn.textContent = this.t('btn_expand');
      }
    }

    // ============ 结果页：渲染牌阵布局可视化 ============
    renderResultSpreadDiagram(spreadType, positions) {
      const container = document.getElementById('result-spread-diagram');
      if (!container) return;
      container.innerHTML = '';
      container.classList.remove('hidden');
      container.classList.add('diagram-' + spreadType);

      const spread = SPREADS[spreadType];
      if (!spread) return;

      positions.forEach((pos, idx) => {
        const card = document.createElement('div');
        card.className = 'result-diagram-card diag-pos-' + (idx + 1);
        card.dataset.index = idx;

        // 添加序号
        const numSpan = document.createElement('span');
        numSpan.textContent = (idx + 1);
        card.appendChild(numSpan);

        // 添加位置标签
        const label = document.createElement('div');
        label.className = 'result-diagram-card-label';
        label.textContent = pos.name || pos;
        card.appendChild(label);

        card.addEventListener('click', () => {
          // 高亮对应牌
          container.querySelectorAll('.result-diagram-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');

          const cards = document.querySelectorAll('.tarot-card');
          if (cards[idx]) {
            // 滚动到对应大卡片
            cards[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
            // 高亮效果
            cards[idx].style.transition = 'box-shadow 0.3s';
            cards[idx].style.boxShadow = '0 0 20px var(--color-gold)';
            setTimeout(() => { cards[idx].style.boxShadow = ''; }, 800);
          }
        });

        // 鼠标悬停效果
        card.addEventListener('mouseenter', () => {
          const cards = document.querySelectorAll('.tarot-card');
          if (cards[idx]) {
            cards[idx].style.transition = 'box-shadow 0.2s';
            cards[idx].style.boxShadow = '0 0 10px rgba(212, 175, 55, 0.5)';
          }
        });
        card.addEventListener('mouseleave', () => {
          const cards = document.querySelectorAll('.tarot-card');
          if (cards[idx] && !cards[idx].classList.contains('active')) {
            cards[idx].style.boxShadow = '';
          }
        });

        container.appendChild(card);
      });
    }

    // ============ 抽牌通用函数 ============
    drawCards(count) {
      const deck = this.getShuffledDeck();
      const result = [];
      for (let i = 0; i < count; i++) {
        if (deck.length === 0) break;
        const idx = Math.floor(Math.random() * deck.length);
        const item = deck.splice(idx, 1)[0];
        const isReversed = Math.random() < 0.5;
        result.push({ card: item, isReversed: isReversed });
      }
      this.shuffledDeckCache = deck;
      return result;
    }

    // ============ 单牌占卜 ============
    drawSingle() {
      this.showLoading(this.getLocalizedLoadingText('single'));
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.currentMode = 'single';
          const drawn = this.drawCards(1);
          const item = drawn[0];

          const singlePos = this.currentLang === 'en' ? 'Daily Guidance' : '今日指引';
          this.currentCards = [{ card: item.card, isReversed: item.isReversed, position: singlePos }];

          const resultCards = document.getElementById('result-cards');
          if (resultCards) {
            resultCards.innerHTML = '';
            resultCards.className = 'result-cards';
            const wrap = this.createCardEl(item.card, item.isReversed, false, 80, 126, 0);
            const innerCard = wrap.querySelector('.tarot-card');

            wrap.addEventListener('click', (e) => {
              e.stopPropagation();
              innerCard.classList.toggle('flipped');
              this.playFlipSound();
              const rev = innerCard.classList.contains('flipped') ? !item.isReversed : item.isReversed;
              this.showMeaning(item.card, rev, singlePos);

              // 高亮对应的示意图小卡
              const diagCards = document.querySelectorAll('.result-diagram-card');
              diagCards.forEach(c => c.classList.remove('active'));
              if (diagCards[0]) diagCards[0].classList.add('active');
            });

            setTimeout(() => {
              innerCard.classList.add('flipped');
              this.showMeaning(item.card, item.isReversed, singlePos);
            }, 600);

            resultCards.appendChild(wrap);
          }


          document.getElementById('page-title').textContent = this.getLocalizedSpreadName('single');
          this.setDeckHint(this.currentLang === 'en' ? 'Tap card to toggle upright/reversed' : '点击卡牌可切换正/逆位解读');

          const compSecSingle = document.getElementById('comprehensive-reading');
          if (compSecSingle) compSecSingle.classList.add('hidden');

          this.showPage('divination-page');
          this.hideLoading();
          this.saveToHistory();
        });
      });
    }

    // ============ 通用多牌阵绘制函数 ============
    drawStandardSpread(spreadType, cardW, cardH) {
      const spread = SPREADS[spreadType];
      if (!spread) { this.hideLoading(); return; }
      this.showLoading(this.getLocalizedLoadingText(spreadType));
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.currentMode = spreadType;
          const drawn = this.drawCards(spread.positions.length);
          const positions = this.getLocalizedPositions(spreadType);
          this.currentCards = [];

          const resultCards = document.getElementById('result-cards');
          if (resultCards) {
            resultCards.innerHTML = '';
            resultCards.className = 'result-cards ' + spreadType + '-spread-layout';
          }

          // 牌数自适应：牌越多卡片越小
          const totalCards = drawn.length;
          let baseW = cardW, baseH = cardH;
          if (totalCards >= 10)      { baseW = Math.max(46, Math.round(cardW * 0.6)); baseH = Math.round(baseW * 1.55); }
          else if (totalCards >= 8) { baseW = Math.max(50, Math.round(cardW * 0.75)); baseH = Math.round(baseW * 1.55); }
          else if (totalCards >= 6) { baseW = Math.max(58, Math.round(cardW * 0.9)); baseH = Math.round(baseW * 1.55); }

          for (let i = 0; i < drawn.length; i++) {
            this.currentCards.push({ card: drawn[i].card, isReversed: drawn[i].isReversed, position: positions[i] });

            let cW = baseW, cH = baseH;
            if (spreadType === 'horseshoe' && i === 3) { cW = Math.round(baseW * 1.2); cH = Math.round(cW * 1.5); }

            const wrap = this.createCardEl(drawn[i].card, drawn[i].isReversed, true, cW, cH, i);
            wrap.classList.add(spreadType + '-card-wrap');

            if (spreadType === 'horseshoe' && i === 3) wrap.classList.add('horseshoe-center');

            ((c, rev, pos, idx) => {
              wrap.addEventListener('click', (e) => {
                e.stopPropagation();
                this.playFlipSound();
                this.showMeaning(c, rev, pos);

                // 高亮对应的示意图小卡
                const diagCards = document.querySelectorAll('.result-diagram-card');
                diagCards.forEach(card => card.classList.remove('active'));
                if (diagCards[idx]) diagCards[idx].classList.add('active');
              });
            })(drawn[i].card, drawn[i].isReversed, positions[i], i);

            if (resultCards) resultCards.appendChild(wrap);
          }

          this.renderResultSpreadDiagram(spreadType, positions);
          this.showMeaning(drawn[0].card, drawn[0].isReversed, positions[0]);

          document.getElementById('page-title').textContent = this.getLocalizedSpreadName(spreadType);
          this.setDeckHint(this.currentLang === 'en' ? 'Tap a card to see its meaning' : '点击卡牌查看对应牌义');

          const compContent = document.getElementById('comprehensive-content');
          const compSection = document.getElementById('comprehensive-reading');
          if (compContent && compSection) {
            this.generateComprehensiveReading().then(reading => {
              compContent.innerHTML = reading;
              compSection.classList.remove('hidden');
              compContent.classList.remove('hidden');
              const tBtn = document.getElementById('toggle-reading-btn');
              if (tBtn) tBtn.textContent = this.t('btn_collapse');
            });
          }

          this.showPage('divination-page');
          this.hideLoading();
          this.saveToHistory();
        });
      });
    }

    // ============ 三牌占卜 ============
    drawThree() {
      this.drawStandardSpread('three', 80, 126);
    }

    // ============ 凯尔特十字占卜 ============
    drawCeltic() {
      this.currentMode = 'celtic';
      const drawn = this.drawCards(10);
      const positions = this.getLocalizedPositions('celtic');
      this.currentCards = [];

      const resultCards = document.getElementById('result-cards');
      if (resultCards) {
        resultCards.innerHTML = '';
        resultCards.className = 'result-cards celtic-cross-layout';
      }

      const crossContainer = document.createElement('div');
      crossContainer.className = 'celtic-cross-center';

      const crossGrid = document.createElement('div');
      crossGrid.className = 'celtic-cross-cross';

      const crossPositions = [0, 1, 2, 3, 4];
      crossPositions.forEach((posIdx) => {
        this.currentCards.push({ card: drawn[posIdx].card, isReversed: drawn[posIdx].isReversed, position: positions[posIdx] });

        // 10张牌统一缩小
        const wrap = this.createCardEl(drawn[posIdx].card, drawn[posIdx].isReversed, true, 50, 78, posIdx);
        wrap.classList.add('cc-card-wrap');

        const wrapper = document.createElement('div');
        wrapper.className = 'cc-pos-' + (posIdx + 1);
        wrapper.appendChild(wrap);

        ((c, rev, pos, idx) => {
          wrap.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showMeaning(c, rev, pos);

            // 高亮对应的示意图小卡
            const diagCards = document.querySelectorAll('.result-diagram-card');
            diagCards.forEach(card => card.classList.remove('active'));
            if (diagCards[idx]) diagCards[idx].classList.add('active');
          });
        })(drawn[posIdx].card, drawn[posIdx].isReversed, positions[posIdx], posIdx);

        crossGrid.appendChild(wrapper);
      });

      crossContainer.appendChild(crossGrid);

      const staffContainer = document.createElement('div');
      staffContainer.className = 'celtic-cross-staff';

      for (let i = 5; i < 10; i++) {
        this.currentCards.push({ card: drawn[i].card, isReversed: drawn[i].isReversed, position: positions[i] });

        // 10张牌权杖列统一缩小
        const wrap2 = this.createCardEl(drawn[i].card, drawn[i].isReversed, true, 44, 68, i);
        wrap2.classList.add('cc-card-wrap');

        const wrapper2 = document.createElement('div');
        wrapper2.className = 'cc-staff-pos';
        wrapper2.appendChild(wrap2);

        ((c, rev, pos, idx) => {
          wrap2.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showMeaning(c, rev, pos);

            // 高亮对应的示意图小卡
            const diagCards = document.querySelectorAll('.result-diagram-card');
            diagCards.forEach(card => card.classList.remove('active'));
            if (diagCards[idx]) diagCards[idx].classList.add('active');
          });
        })(drawn[i].card, drawn[i].isReversed, positions[i], i);

        staffContainer.appendChild(wrapper2);
      }

      crossContainer.appendChild(staffContainer);

      if (resultCards) resultCards.appendChild(crossContainer);

      this.renderResultSpreadDiagram('celtic', positions);
      this.showMeaning(drawn[0].card, drawn[0].isReversed, positions[0]);

      document.getElementById('page-title').textContent = this.getLocalizedSpreadName('celtic');
      this.setDeckHint(this.currentLang === 'en' ? 'Tap a card to see its meaning' : '点击卡牌查看对应牌義');

      const compContent = document.getElementById('comprehensive-content');
      const compSection = document.getElementById('comprehensive-reading');
      if (compContent && compSection) {
        this.generateComprehensiveReading().then(reading => {
          compContent.innerHTML = reading;
          compSection.classList.remove('hidden');
          compContent.classList.remove('hidden');
          const tBtn = document.getElementById('toggle-reading-btn');
          if (tBtn) tBtn.textContent = this.t('btn_collapse');
        });
      }

      this.showPage('divination-page');
      this.saveToHistory();
    }

    // ============ 关系牌阵占卜 ============
    drawRelation() {
      this.drawStandardSpread('relation', 60, 96);
    }

    // ============ 二选一牌阵 ============
    drawChoice() {
      this.drawStandardSpread('choice', 60, 96);
    }

    // ============ 决策树牌阵 ============
    drawDecisiontree() {
      this.drawStandardSpread('decisiontree', 60, 96);
    }

    // ============ 五张牌阵 ============
    drawFive() {
      this.drawStandardSpread('five', 60, 96);
    }

    // ============ 马蹄铁牌阵 ============
    drawHorseshoe() {
      this.drawStandardSpread('horseshoe', 60, 96);
    }

    // ============ 事业牌阵 ============
    drawCareer() {
      this.drawStandardSpread('career', 60, 96);
    }

    // ============ 时间之流 ============
    drawTimeflow() {
      this.drawStandardSpread('timeflow', 60, 96);
    }

    // ============ 问题行动结果 ============
    drawAction() {
      this.drawStandardSpread('action', 60, 110);
    }

    // ============ 心灵牌阵 ============
    drawMind() {
      this.drawStandardSpread('mind', 60, 96);
    }

    // ============ 新增情感关系牌阵 ============
    // ============ 恋人牌阵 ============
    drawLove() {
      this.drawStandardSpread('love', 60, 96);
    }

    // ============ 复合牌阵 ============
    drawBroken() {
      this.drawStandardSpread('broken', 60, 96);
    }

    // ============ 新增决策分析牌阵 ============
    // ============ 是否牌阵 ============
    drawYesno() {
      this.drawStandardSpread('yesno', 70, 112);
    }

    // ============ 新增事业学业牌阵 ============
    // ============ 换工作牌阵 ============
    drawJobchange() {
      this.drawStandardSpread('jobchange', 60, 96);
    }

    // ============ 新增自我成长牌阵 ============
    // ============ 阴影牌阵 ============
    drawShadow() {
      this.drawStandardSpread('shadow', 60, 96);
    }

    // ============ 年运牌阵 ============
    drawYear() {
      this.drawStandardSpread('year', 60, 96);
    }

    // ============ 新增决策分析牌阵 ============
    // ============ 利弊分析牌阵 ============
    drawProscons() {
      this.drawStandardSpread('proscons', 70, 110);
    }

    // ============ 新增旅行牌阵 ============
    drawTravel() {
      this.drawStandardSpread('travel', 60, 96);
    }

    // ============ 新增自我成长牌阵 ============
    // ============ 人生使命牌阵 ============
    drawLifepurpose() {
      this.drawStandardSpread('lifepurpose', 55, 90);
    }

    // ============ 新增学业考试牌阵 ============
    drawExam() {
      this.drawStandardSpread('exam', 60, 96);
    }

    // ============ 新增命运之轮牌阵 ============
    drawFatewheel() {
      this.drawStandardSpread('fatewheel', 60, 96);
    }

    // ============ 新增月运牌阵 ============
    drawMonthly() {
      this.drawStandardSpread('monthly', 60, 96);
    }

    // ============ 新增灵魂旅程牌阵 ============
    drawSouljourney() {
      this.drawStandardSpread('souljourney', 50, 80);
    }

    // ============ 重新占卜 ============
    reshuffle() {
      switch (this.currentMode) {
        case 'single':     this.drawSingle(); break;
        case 'three':      this.drawThree(); break;
        case 'celtic':    this.drawCeltic(); break;
        case 'relation':   this.drawRelation(); break;
        case 'choice':     this.drawChoice(); break;
        case 'five':      this.drawFive(); break;
        case 'horseshoe': this.drawHorseshoe(); break;
        case 'career':    this.drawCareer(); break;
        case 'timeflow':  this.drawTimeflow(); break;
        case 'action':    this.drawAction(); break;
        case 'mind':      this.drawMind(); break;
        // 新增牌阵
        case 'love':      this.drawLove(); break;
        case 'broken':    this.drawBroken(); break;
        case 'yesno':     this.drawYesno(); break;
        case 'jobchange': this.drawJobchange(); break;
        case 'shadow':    this.drawShadow(); break;
        case 'year':      this.drawYear(); break;
        // 新增：利弊分析、人生使命
        case 'proscons':   this.drawProscons(); break;
        case 'lifepurpose': this.drawLifepurpose(); break;
        // 新增：决策树牌阵
        case 'decisiontree': this.drawDecisiontree(); break;
        // 新增：旅行牌阵
        case 'travel':     this.drawTravel(); break;
        // 新增：考试牌阵
        case 'exam':      this.drawExam(); break;
        // 新增：命运之轮
        case 'fatewheel': this.drawFatewheel(); break;
        // 新增：月运牌阵
        case 'monthly':   this.drawMonthly(); break;
    // 新增：灵魂旅程牌阵
    case 'souljourney': this.drawSouljourney(); break;
    // 新增：星座牌阵
    case 'zodiac':    this.drawZodiac(); break;
        // 新增：前世今生牌阵
        case 'pastlife': this.drawPastlife(); break;
        // 新增：健康牌阵
        case 'health':    this.drawHealth(); break;
        // 新增：家庭关系牌阵
        case 'family':    this.drawFamily(); break;
        // 新增：一周运势牌阵
        case 'weekly':    this.drawWeekly(); break;
        // 新增：灵感创作牌阵
        case 'creative':  this.drawCreative(); break;
        // 新增：财务投资牌阵
        case 'finance':   this.drawFinance(); break;
        // 新增：断舍离牌阵
        case 'declutter': this.drawDeclutter(); break;
        // 新增：办公室人际牌阵
        case 'office':     this.drawOffice(); break;
        // 新增：梦境解读牌阵
        case 'dream':      this.drawDream(); break;
        // 新增：失物寻找牌阵
        case 'lost':      this.drawLost(); break;
      }
    }

    // ============ 新增星座牌阵（12宫位）============
    drawZodiac() {
      this.drawStandardSpread('zodiac', 42, 67);
    }

    // ============ 新增前世今生牌阵 ============
    drawPastlife() {
      this.drawStandardSpread('pastlife', 60, 96);
    }

    // ============ 新增健康牌阵 ============
    drawHealth() {
      this.drawStandardSpread('health', 60, 96);
    }

    // ============ 新增家庭关系牌阵 ============
    drawFamily() {
      this.drawStandardSpread('family', 60, 96);
    }

    // ============ 新增一周运势牌阵 ============
    drawWeekly() {
      this.drawStandardSpread('weekly', 55, 88);
    }

    // ============ 新增灵感创作牌阵 ============
    drawCreative() {
      this.drawStandardSpread('creative', 60, 96);
    }

    // ============ 新增财务投资牌阵 ============
    drawFinance() {
      this.drawStandardSpread('finance', 60, 96);
    }

    // ============ 新增断舍离牌阵 ============
    drawDeclutter() {
      this.drawStandardSpread('declutter', 60, 96);
    }

    // ============ 新增办公室人际牌阵 ============
    drawOffice() {
      this.drawStandardSpread('office', 55, 88);
    }

    // ============ 新增梦境解读牌阵 ============
    drawDream() {
      this.drawStandardSpread('dream', 55, 88);
    }

    // ============ 新增失物寻找牌阵 ============
    drawLost() {
      this.drawStandardSpread('lost', 55, 88);
    }

    // ============ 返回欢迎页 ============
    goBack() {
      this.currentCards = [];
      const panel = document.getElementById('daily-fortune-panel');
      if (panel) panel.classList.add('hidden');
      this.showPage('welcome-page');
    }

    // ============ 更新静态 UI 文本 ============
    updateStaticUIText() {
      const pageTitle = document.getElementById('page-title');
      if (pageTitle && this.currentCards.length > 0) {
        pageTitle.textContent = this.getLocalizedSpreadName(this.currentMode);
      }
      const stepHint = document.getElementById('step-hint');
      if (stepHint && this.currentCards.length > 0) {
        stepHint.textContent = this.t('inst_click') + ' · ' + this.getLocalizedDeckName(this.currentDeck);
      }
      const historyEmpty = document.querySelector('.history-empty');
      if (historyEmpty) {
        historyEmpty.textContent = this.t('history_empty');
      }
    }

    // ============ 重新渲染当前卡牌文字 ============
    reRenderCurrentCards() {
      const cards = document.querySelectorAll('.tarot-card');
      cards.forEach((cardEl, idx) => {
        const item = this.currentCards[idx];
        if (!item) return;
        const localizedName = deckManager.getCardName(item.card);
        const displayName = item.isReversed
          ? localizedName + (this.currentLang === 'en' ? ' (Reversed)' : '（逆位）')
          : localizedName;
        const nameSpan = cardEl.querySelector('.card-name');
        if (nameSpan) nameSpan.textContent = displayName;
      });

    }

    // ============ 切换牌组 ============
    changeDeck(deckType) {
      this.currentDeck = deckType;
      this.shuffledDeckCache = null;
      this.lastShuffleDeck = null;
      if (typeof deckManager !== 'undefined') {
        deckManager.currentDeckName = deckType;
        deckManager.clearShuffleCache();
        deckManager.setLanguage(this.currentLang);
      }
    }

    // ============ 分享结果 ============
    async shareResult() {
      if (!this.currentCards || this.currentCards.length === 0) return;

      const spreadName = this.getLocalizedSpreadName(this.currentMode);
      const deckName = this.getLocalizedDeckName(this.currentDeck);
      const dateStr = this.currentLang === 'en'
        ? new Date().toLocaleString('en-US')
        : new Date().toLocaleString('zh-CN');

      let text = '🔮 ' + spreadName + ' - ' + deckName + '\n\n';
      text += '📅 ' + dateStr + '\n\n';

      this.currentCards.forEach((item, idx) => {
        const pos = item.position ? (this.currentLang === 'en' ? ' (' + item.position + ')' : '（' + item.position + '）') : '';
        const rev = this.getPosText(item.isReversed);
        text += (idx + 1) + '. ' + deckManager.getCardName(item.card) + ' ' + rev + ' ' + pos + '\n';
      });

      text += '\n✨ ' + (this.currentLang === 'en' ? 'Reading: ' : '综合解读：\n');
      const compContent = document.getElementById('comprehensive-content');
      if (compContent && !compContent.classList.contains('hidden')) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = compContent.innerHTML;
        const compText = tempDiv.textContent || tempDiv.innerText || '';
        text += compText.substring(0, 200) + (compText.length > 200 ? '...' : '');
      }

      text += '\n\n—— ' + (this.currentLang === 'en' ? 'From Magic Tarot' : '来自魔法塔罗牌扩展');

      if (navigator.share) {
        try {
          await navigator.share({
            title: '塔罗牌占卜结果',
            text: text
          });
        } catch (e) {
          this.copyToClipboard(text);
        }
      } else {
        this.copyToClipboard(text);
      }
    }

    async copyToClipboard(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          alert(this.t('alert_copy_success'));
        } catch (e) {
          this.fallbackCopyToClipboard(text);
        }
      } else {
        this.fallbackCopyToClipboard(text);
      }
    }

    fallbackCopyToClipboard(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        alert(this.t('alert_copy_success'));
      } catch (e) {
        alert(this.t('alert_copy_fail'));
      }
      document.body.removeChild(textarea);
    }

    // ============ 复制当前结果 ============
    copyResult() {
      const meaningEl = document.getElementById('result-meaning');
      if (!meaningEl) return;
      const text = (this.currentLang === 'en' ? 'Tarot Reading Result\n\n' : '塔罗牌占卜结果\n\n') +
        (meaningEl.innerText || meaningEl.textContent || '');
      this.copyToClipboard(text);
    }

    // ============ 收藏/取消收藏卡牌 ============
    toggleFavorite() {
      const favBtn = document.getElementById('card-preview-fav');
      if (!favBtn || !favBtn._currentCard) return;
      const card = favBtn._currentCard;
      chrome.storage.local.get({ tarot_favorites: [] }, (result) => {
        let favs = result.tarot_favorites || [];
        const idx = favs.findIndex(c => c.id === card.id && c.deck === card.deck);
        if (idx >= 0) {
          favs.splice(idx, 1);
          favBtn.textContent = '☆';
          favBtn.classList.remove('active');
        } else {
          favs.push({ id: card.id, name: card.name, originalName: card.originalName || '', deck: card.deck });
          favBtn.textContent = '★';
          favBtn.classList.add('active');
        }
        chrome.storage.local.set({ tarot_favorites: favs });
      });
    }

    // ============ 翻牌音效 ============
    playFlipSound() {
      this.triggerHaptic();
      chrome.storage.local.get({ tarot_sound: true }, (result) => {
        if (!result.tarot_sound) return;
        try {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.15);
          gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
          oscillator.start(audioCtx.currentTime);
          oscillator.stop(audioCtx.currentTime + 0.2);
        } catch (e) {}
      });
    }

    // ============ 魔法音效（运势结果弹出） ============
    playMagicSound() {
      this.triggerHaptic();
      chrome.storage.local.get({ tarot_sound: true }, (result) => {
        if (!result.tarot_sound) return;
        try {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          // 上行和弦：C-E-G 泛音
          [261.6, 329.6, 392.0].forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.12);
            gain.gain.setValueAtTime(0, audioCtx.currentTime + i * 0.12);
            gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + i * 0.12 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.12 + 0.6);
            osc.start(audioCtx.currentTime + i * 0.12);
            osc.stop(audioCtx.currentTime + i * 0.12 + 0.6);
          });
        } catch (e) {}
      });
    }

    // ============ 触觉反馈（按钮点击震动） ============
    triggerHaptic() {
      if (!this.soundEnabled) return;
      try {
        if (navigator.vibrate) navigator.vibrate(12);
      } catch (e) {}
    }

    toggleSound() {
      chrome.storage.local.get({ tarot_sound: true }, (result) => {
        const newVal = !result.tarot_sound;
        chrome.storage.local.set({ tarot_sound: newVal });
        this.soundEnabled = newVal;
        const btn = document.getElementById('sound-toggle-btn');
        if (btn) btn.classList.toggle('muted', !newVal);
        this.triggerHaptic();
      });
    }

    // ============ 每日运势功能 ============
    daySeed(dateStr) {
      let hash = 0;
      for (let i = 0; i < dateStr.length; i++) {
        const ch = dateStr.charCodeAt(i);
        hash = ((hash << 5) - hash) + ch;
        hash = hash & hash;
      }
      return Math.abs(hash);
    }

    // Mulberry32 均匀伪随机数生成器（替代 Math.sin 方案）
    mulberry32(seed) {
      return function() {
        seed |= 0; seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      }
    }

    // 基于日期种子的随机数（兼容旧调用方式）
    seededRandom(seed) {
      const rng = this.mulberry32(seed);
      return rng();
    }

    // 计算数字根（塔罗数字学）
    getDigitalRoot(n) {
      while (n > 9 && n !== 11 && n !== 22) {
        n = String(n).split('').reduce((s, d) => s + parseInt(d, 10), 0);
      }
      return n;
    }

    getDailyFortune(forceRefresh = false) {
      const now = new Date();
      const dateStr = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
      const CACHE_VERSION = 2;

      if (!forceRefresh) {
        const cached = localStorage.getItem('daily_fortune_' + dateStr);
        if (cached) {
          try {
            const data = JSON.parse(cached);
            if (data && data._v === CACHE_VERSION) return data;
          } catch (e) {}
        }
      }

      const seed = forceRefresh ? Date.now() : this.daySeed(dateStr);
      const rng = this.mulberry32(seed);

      // 用均匀的 Mulberry32 RNG 替代旧方案
      const rand = () => rng();

      const levelIdx = Math.floor(rand() * FORTUNE_LEVELS.length);
      const level = FORTUNE_LEVELS[levelIdx];

      const dimensions = {};
      FORTUNE_CATEGORIES.forEach((cat, i) => {
        let base = level.score - 15 + Math.floor(rand() * 30);
        base = Math.max(10, Math.min(99, base));
        dimensions[cat] = base;
      });

      const colorIdx = Math.floor(rand() * LUCKY_COLORS.length);
      const luckyColor = LUCKY_COLORS[colorIdx];

      // 幸运数字关联塔罗数字学：提高灵数 11、22 出现概率
      let luckyNum;
      const masterChance = rand();
      if (masterChance < 0.15) {
        luckyNum = rand() < 0.5 ? 11 : 22;
      } else {
        luckyNum = Math.floor(rand() * 99) + 1;
      }
      const luckyNumRoot = this.getDigitalRoot(luckyNum);

      // ---- 今日指引牌：随机抽取一张大阿尔卡那 ----
      let guideCard = null;
      try {
        const deckData = this.getDeckData();
        const majorCards = deckData.filter(c => c.suit === 'major' || c.id <= 21);
        if (majorCards.length > 0) {
          const ci = Math.floor(rand() * majorCards.length);
          const card = majorCards[ci];
          const isRev = rand() < 0.5;
          guideCard = {
            id: card.id,
            name: card.name,
            originalName: card.originalName || '',
            imageUrl: card.imageUrl || '',
            isReversed: isRev,
            brief: isRev ? (card.reversedBrief || '') : (card.uprightBrief || ''),
            meaning: isRev ? (card.reversed || card.upright) : (card.upright || ''),
            icon: (MAJOR_ARCANA_ICONS[card.id] || '🔮')
          };
        }
      } catch (e) { guideCard = null; }

      // ---- 幸运数字映射大阿尔卡那牌 ----
      let luckyCardName = '';
      let luckyCardOrig = '';
      try {
        const deckData = this.getDeckData();
        const majorCards = deckData.filter(c => c.suit === 'major' || c.id <= 21);
        // 数字 1~21 → id 0~20；22 → id 21（世界）
        let tid = luckyNum;
        if (tid > 21) tid = ((tid - 1) % 21) + 1; // 循环映射到 1~21
        const targetId = tid >= 21 ? 20 : (tid - 1);
        const found = majorCards.find(c => c.id === targetId);
        if (found) {
          luckyCardName = found.name;
          luckyCardOrig = found.originalName || '';
        }
      } catch (e) {}

      const directions = ['东', '南', '西', '北', '东南', '西南', '东北', '西北'];
      const dirIdx = Math.floor(rand() * directions.length);
      const luckyDir = directions[dirIdx];

      const advices = LUCKY_ADVICE[level.text] || ['宜：平常心对待', '忌：过度焦虑'];
      const suit = advices[0];
      const avoid = advices[1];

      const tips = [
        '今天的你散发着独特的魅力，相信自己。',
        '保持开放的心态，惊喜可能就在转角处。',
        '耐心是今天的关键词，等待合适的时机。',
        '与人交流会带来新的灵感和机会。',
        '关注自己的内心需求，不要忽视直觉。',
        '适度休息能让你的效率大幅提升。',
        '今天适合整理思绪，为明天做好准备。'
      ];
      const tipIdx = Math.floor(rand() * tips.length);
      const dailyTip = tips[tipIdx];

      const fortune = {
        _v: CACHE_VERSION,
        date: dateStr,
        level: level,
        dimensions: dimensions,
        luckyColor: luckyColor,
        luckyNumber: luckyNum,
        luckyNumberRoot: luckyNumRoot,
        luckyDirection: luckyDir,
        suit: suit,
        avoid: avoid,
        dailyTip: dailyTip,
        timestamp: now.getTime(),
        guideCard: guideCard,
        luckyCardName: luckyCardName,
        luckyCardOrig: luckyCardOrig
      };

      try {
        localStorage.setItem('daily_fortune_' + dateStr, JSON.stringify(fortune));
      } catch (e) {}

      return fortune;
    }

    renderDailyFortune(forceRefresh = false) {
      const fortune = this.getDailyFortune(forceRefresh);
      const container = document.getElementById('fortune-content');
      if (!container) return;

      const level = this.getLocalizedFortuneLevel(fortune.level);
      const dims = fortune.dimensions;
      const luckyColor = this.getLocalizedLuckyColor(fortune.luckyColor);
      const luckyDir = this.getLocalizedDirection(fortune.luckyDirection);
      const advice = this.getLocalizedAdvice(fortune.level.text);
      const dailyTip = this.getLocalizedDailyTip(fortune.dailyTip);
      const guideCard = fortune.guideCard;
      const luckyCardName = fortune.luckyCardName || '';
      const luckyCardOrig = fortune.luckyCardOrig || '';

      // 各维度简短解读文案（中英文）
      const DIMENSION_TIPS_ZH = {
        '高': '状态极佳，积极行动会有丰厚回报。',
        '中高': '整体顺利，把握机会即可更上一层楼。',
        '中等': '平稳的一天，按部就班，不宜冒进。',
        '中低': '略有阻碍，谨慎行事，避免重大决策。',
        '低': '宜静不宜动，注意休息与调整。'
      };
      const DIMENSION_TIPS_EN = {
        '高': 'Excellent state. Take action and you will be richly rewarded.',
        '中高': 'Overall smooth. Seize the opportunity to reach the next level.',
        '中等': 'A steady day. Follow the routine and avoid aggressive moves.',
        '中低': 'Slight obstacles. Be cautious and avoid major decisions.',
        '低': 'Better to stay still than act. Rest and recalibrate.'
      };
      const tipsMap = this.currentLang === 'en' ? DIMENSION_TIPS_EN : DIMENSION_TIPS_ZH;
      function getDimTip(score) {
        if (score >= 80) return tipsMap['高'];
        if (score >= 60) return tipsMap['中高'];
        if (score >= 45) return tipsMap['中等'];
        if (score >= 30) return tipsMap['中低'];
        return tipsMap['低'];
      }

      // 解析宜忌标签
      function parseTags(str) {
        const m = str.match(/^(宜|忌)[:：](.+)$/);
        if (!m) return null;
        return { prefix: m[1], tags: m[2].split(/[、，,]/).map(s => s.trim()).filter(Boolean) };
      }
      const suitParsed = parseTags(advice.suit);
      const avoidParsed = parseTags(advice.avoid);

      let html = '';

      // ---- 今日指引牌 ----
      if (guideCard) {
        html += '<div class="fortune-section fortune-guide-section">';
        html += '<div class="fortune-section-title">' + (this.currentLang === 'en' ? '✨ Today\'s Guide Card' : '✨ 今日指引牌') + '</div>';
        html += '<div class="fortune-guide-card" data-card-id="' + guideCard.id + '" data-card-rev="' + (guideCard.isReversed ? '1' : '0') + '">';
        html += '<div class="fortune-guide-inner">';
        html += '<div class="fortune-guide-img-placeholder">';
        html += '<span class="fortune-guide-img-char">' + (guideCard.icon || '🔮') + '</span>';
        html += '</div>';
        html += '<div class="fortune-guide-info">';
        // 英文模式下优先显示 originalName
        const guideName = this.currentLang === 'en' && guideCard.originalName ? guideCard.originalName : guideCard.name;
        const guideNameOrig = this.currentLang === 'en' && guideCard.originalName ? guideCard.name : (guideCard.originalName || '');
        html += '<div class="fortune-guide-name">' + guideName + (guideNameOrig ? ' <span class="fortune-guide-orig">(' + guideNameOrig + ')</span>' : '') + '</div>';
        html += '<div class="fortune-guide-pos">' + (guideCard.isReversed ? (this.currentLang === 'en' ? 'Reversed' : '逆位') : (this.currentLang === 'en' ? 'Upright' : '正位')) + '</div>';
        // 英文模式下重新获取英文牌意（缓存的 brief 只有中文）
        let guideBrief = guideCard.brief;
        if (this.currentLang === 'en') {
          try {
            const deckData = this.getDeckData();
            const foundCard = deckData.find(c => c.id === guideCard.id);
            if (foundCard) {
              guideBrief = this.getMeaningText(foundCard, guideCard.isReversed);
            }
          } catch (e) {}
        }
        html += '<div class="fortune-guide-brief">' + guideBrief + '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="fortune-guide-hint">' + (this.currentLang === 'en' ? 'Click to view details' : '点击查看详情') + '</div>';
        html += '</div></div>';
      }

      html += '<div class="fortune-section">';
      html += '<div class="fortune-section-title">' + this.t('fortune_overall') + '</div>';
      html += '<div class="fortune-section-body">';
      html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">';
      html += '<span style="font-size:22px;font-weight:700;color:' + level.color + ';">' + level.text + '</span>';
      html += '<div class="fortune-score-bar"><div class="fortune-score-fill" style="width:' + level.score + '%;background:' + level.color + ';"></div></div>';
      html += '<span class="fortune-score-text" style="color:' + level.color + ';">' + level.score + this.t('fortune_score_unit') + '</span>';
      html += '</div>';
      html += '<div style="font-size:11px;color:var(--color-text);line-height:1.6;">' + level.desc + '</div>';
      html += '</div></div>';

      html += '<div class="fortune-section">';
      html += '<div class="fortune-section-title">' + this.t('fortune_dimensions') + '</div>';
      html += '<div class="fortune-section-body">';
      FORTUNE_CATEGORIES.forEach((cat) => {
        const score = dims[cat];
        const barColor = score >= 80 ? '#4CAF50' : (score >= 60 ? '#FFD700' : (score >= 40 ? '#FF9800' : '#F44336'));
        const tip = getDimTip(score);
        html += '<div style="margin-bottom:6px;">';
        html += '<div style="display:flex;align-items:center;gap:6px;font-size:10px;">';
        html += '<span style="width:36px;color:var(--color-text-muted);">' + this.getLocalizedFortuneCategory(cat) + '</span>';
        html += '<div class="fortune-score-bar" style="flex:1;height:4px;"><div class="fortune-score-fill" style="width:' + score + '%;background:' + barColor + ';"></div></div>';
        html += '<span style="width:22px;text-align:right;color:' + barColor + ';font-weight:700;">' + score + '</span>';
        html += '</div>';
        html += '<div style="font-size:9px;color:var(--color-text-muted);margin-top:1px;padding-left:42px;">' + tip + '</div>';
        html += '</div>';
      });
      html += '</div></div>';

      html += '<div class="fortune-section">';
      html += '<div class="fortune-section-title">' + this.t('fortune_lucky_info') + '</div>';
      html += '<div class="fortune-lucky-info">';
      html += '<div class="fortune-lucky-item">';
      html += '<div class="fortune-lucky-label">' + this.t('fortune_lucky_color') + '</div>';
      html += '<div class="fortune-lucky-value"><div class="fortune-color-display"><span class="fortune-color-swatch" style="background:' + luckyColor.hex + ';"></span>' + luckyColor.name + '</div></div>';
      html += '</div>';
      html += '<div class="fortune-lucky-item">';
      html += '<div class="fortune-lucky-label">' + this.t('fortune_lucky_number') + '</div>';
      html += '<div class="fortune-lucky-value">';
      html += '<div class="fortune-lucky-num-wrap">';
      html += '<span class="fortune-lucky-num-main">' + fortune.luckyNumber + '</span>';
      if (fortune.luckyNumberRoot === 11 || fortune.luckyNumberRoot === 22) {
        html += '<span class="fortune-lucky-num-badge">' + (this.currentLang === 'en' ? 'Master ' : '灵数 ') + fortune.luckyNumberRoot + '</span>';
      } else if (fortune.luckyNumberRoot) {
        html += '<span class="fortune-lucky-num-badge">' + (this.currentLang === 'en' ? 'Digit Root ' : '数字根 ') + fortune.luckyNumberRoot + '</span>';
      }
      html += '</div>';
      if (luckyCardName) {
        // 英文模式下优先显示英文名
        const displayLuckyName = this.currentLang === 'en' && luckyCardOrig ? luckyCardOrig : luckyCardName;
        const displayLuckyOrig = this.currentLang === 'en' && luckyCardOrig ? luckyCardName : luckyCardOrig;
        html += '<div class="fortune-lucky-num-card">' + displayLuckyName + (displayLuckyOrig ? ' (' + displayLuckyOrig + ')' : '') + '</div>';
      }
      html += '</div>';
      html += '</div>';
      html += '<div class="fortune-lucky-item">';
      html += '<div class="fortune-lucky-label">' + this.t('fortune_lucky_direction') + '</div>';
      html += '<div class="fortune-lucky-value"><span class="fortune-lucky-dir">' + luckyDir + '</span></div>';
      html += '</div>';
      html += '</div></div>';

      // ---- 宜忌标签化 ----
      html += '<div class="fortune-section">';
      html += '<div class="fortune-section-title">' + this.t('fortune_dos_donts') + '</div>';
      html += '<div class="fortune-section-body">';
      html += '<div class="fortune-tags-wrap">';
      if (suitParsed) {
        html += '<div class="fortune-tag-row">';
        html += '<span class="fortune-tag-prefix fortune-tag-suit">' + (this.currentLang === 'en' ? 'Do' : '宜') + '</span>';
        suitParsed.tags.forEach(t => { html += '<span class="fortune-tag fortune-tag-suit-item">' + t + '</span>'; });
        html += '</div>';
      } else {
        html += '<div class="fortune-tag-row" style="color:#4CAF50;font-size:11px;">' + advice.suit + '</div>';
      }
      if (avoidParsed) {
        html += '<div class="fortune-tag-row">';
        html += '<span class="fortune-tag-prefix fortune-tag-avoid">' + (this.currentLang === 'en' ? 'Avoid' : '忌') + '</span>';
        avoidParsed.tags.forEach(t => { html += '<span class="fortune-tag fortune-tag-avoid-item">' + t + '</span>'; });
        html += '</div>';
      } else {
        html += '<div class="fortune-tag-row" style="color:#F44336;font-size:11px;">' + advice.avoid + '</div>';
      }
      html += '</div>';
      html += '</div></div>';

      html += '<div class="fortune-section">';
      html += '<div class="fortune-section-title">' + this.t('fortune_tips') + '</div>';
      html += '<div class="fortune-section-body" style="font-style:italic;color:var(--color-gold-light);">' + dailyTip + '</div>';
      html += '</div>';

      container.innerHTML = html;

      // 运势结果弹出音效
      this.playMagicSound();

      // 绑定今日指引牌点击事件
      const guideEl = container.querySelector('.fortune-guide-card');
      if (guideEl) {
        guideEl.addEventListener('click', () => {
          const cardId = parseInt(guideEl.dataset.cardId, 10);
          const isRev = guideEl.dataset.cardRev === '1';
          const deckData = this.getDeckData();
          const found = deckData.find(c => c.id === cardId);
          if (found) {
            this.showCardPreview(found);
          }
        });
      }

      setTimeout(() => {
        const fills = container.querySelectorAll('.fortune-score-fill');
        fills.forEach((f) => {
          const w = f.style.width;
          f.style.width = '0%';
          setTimeout(() => { f.style.width = w; }, 50);
        });
      }, 100);
    }

    toggleDailyFortune() {
      const panel = document.getElementById('daily-fortune-panel');
      if (!panel) return;
      if (panel.classList.contains('hidden')) {
        panel.classList.remove('hidden');
        this.renderDailyFortune();
      } else {
        panel.classList.add('hidden');
      }
    }

    updateFortuneDate() {
      const el = document.getElementById('fortune-date');
      if (el) {
        const now = new Date();
        const m = now.getMonth() + 1;
        const d = now.getDate();
        if (this.currentLang === 'en') {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          el.textContent = months[now.getMonth()] + ' ' + d;
        } else {
          el.textContent = m + '月' + d + '日';
        }
      }
    }

    // ============ 历史记录功能 ============
    async saveToHistory() {
      if (!this.currentCards || this.currentCards.length === 0) return;

      const spreadName = this.getLocalizedSpreadName(this.currentMode);
      const deckName = this.getLocalizedDeckName(this.currentDeck);

      const record = {
        id: Date.now(),
        timestamp: this.currentLang === 'en' ? new Date().toLocaleString('en-US') : new Date().toLocaleString('zh-CN'),
        mode: this.currentMode,
        spreadName: spreadName,
        deckName: deckName,
        lang: this.currentLang,
        cards: this.currentCards.map((item) => ({
          cardId: item.card.id,
          cardName: deckManager.getCardName(item.card),
          originalName: item.card.originalName,
          nameZh: item.card.name,
          isReversed: item.isReversed,
          position: item.position,
          meaning: item.isReversed ? item.card.reversed : item.card.upright
        }))
      };

      return new Promise((resolve) => {
        chrome.storage.local.get({ history: [] }, (result) => {
          const history = result.history;
          history.unshift(record);
          if (history.length > 50) history.splice(50);
          chrome.storage.local.set({ history: history }, () => {
            console.log('历史记录已保存');
            resolve();
          });
        });
      });
    }

    loadHistory() {
      chrome.storage.local.get({ history: [] }, (result) => {
        const history = result.history;
        const historyList = document.getElementById('history-list');
        if (!historyList) return;

        if (history.length === 0) {
          historyList.innerHTML = '<div class="history-empty">' + (this.currentLang === 'en' ? 'No history yet' : '暂无历史记录') + '</div>';
          return;
        }

        let html = '';
        history.forEach((record, idx) => {
          const recordLang = record.lang || 'zh';
          const revChar = recordLang === 'en' ? (record.cards[0] && record.cards[0].isReversed ? 'R' : 'U') : (record.cards[0] && record.cards[0].isReversed ? '逆' : '正');
          html += '<div class="history-item" data-index="' + idx + '">';
          html += '<div class="history-item-header">';
          html += '<span class="history-spread">' + record.spreadName + '</span>';
          html += '<span class="history-time">' + record.timestamp + '</span>';
          html += '<button class="history-delete-btn" data-delete-idx="' + idx + '" title="' + (recordLang === 'en' ? 'Delete' : '删除') + '">✕</button>';
          html += '</div>';
          html += '<div class="history-cards-preview">';
          record.cards.forEach((cardInfo, cIdx) => {
            const rev = cardInfo.isReversed ? (recordLang === 'en' ? ' R' : '逆') : (recordLang === 'en' ? ' U' : '正');
            html += '<span class="history-card-tag">' + (cIdx + 1) + '. ' + cardInfo.cardName + rev + '</span>';
          });
          html += '</div>';
          html += '</div>';
        });
        historyList.innerHTML = html;

        historyList.onclick = (e) => {
          // 删除按钮
          const delBtn = e.target.closest('.history-delete-btn');
          if (delBtn) {
            const delIdx = parseInt(delBtn.dataset.deleteIdx, 10);
            const confirmMsg = this.currentLang === 'en' ? 'Delete this record?' : '确定删除这条记录吗？';
            if (confirm(confirmMsg)) {
              chrome.storage.local.get({ history: [] }, (result) => {
                const h = result.history;
                h.splice(delIdx, 1);
                chrome.storage.local.set({ history: h }, () => {
                  this.loadHistory();
                });
              });
            }
            return;
          }
          // 查看详情
          const item = e.target.closest('.history-item');
          if (item) {
            const idx = parseInt(item.dataset.index, 10);
            this.viewHistoryDetail(idx);
          }
        };
      });
    }

    viewHistoryDetail(index) {
      chrome.storage.local.get({ history: [] }, (result) => {
        const history = result.history;
        if (index >= history.length) return;

        const record = history[index];
        const title = document.getElementById('history-detail-title');
        const content = document.getElementById('history-detail-content');
        const panel = document.getElementById('history-detail-panel');
        if (!content || !panel) return;

        if (title) title.textContent = record.spreadName + ' · ' + record.timestamp;

        const recordLang = record.lang || 'zh';
        const deckLabel = recordLang === 'en' ? 'Deck: ' : '牌组：';
        const revLabel = recordLang === 'en' ? ' (Reversed)' : '（逆位）';
        const upLabel = recordLang === 'en' ? ' (Upright)' : '（正位）';
        let html = '<div style="margin-bottom:12px;padding:8px 10px;background:rgba(255,215,0,0.06);border-radius:8px;font-size:11px;color:var(--color-text-muted);">' + deckLabel + record.deckName + '</div>';

        record.cards.forEach((cardInfo, idx) => {
          let meaning = cardInfo.meaning || '';
          if (!meaning) {
            const deckData = this.getDeckData();
            if (deckData) {
              for (let i = 0; i < deckData.length; i++) {
                if (deckData[i].id === cardInfo.cardId) {
                  meaning = cardInfo.isReversed ? deckData[i].reversed : deckData[i].upright;
                  break;
                }
              }
            }
          }
          if (meaning.length > 80) meaning = meaning.substring(0, 80) + '...';
          html += '<div class="history-detail-card">';
          html += '<div class="history-detail-card-name">' + (idx + 1) + '. ' + cardInfo.cardName + (cardInfo.isReversed ? revLabel : upLabel) + (cardInfo.position ? ' · ' + cardInfo.position : '') + '</div>';
          if (meaning) html += '<div class="history-detail-card-meaning">' + meaning + '</div>';
          html += '</div>';
        });

        content.innerHTML = html;
        panel.classList.remove('hidden');
      });
    }

    closeHistoryDetail() {
      const panel = document.getElementById('history-detail-panel');
      if (panel) panel.classList.add('hidden');
    }

    clearHistory() {
      const msg = this.currentLang === 'en' ? 'Are you sure you want to clear all history?' : '确定要清空所有历史记录吗？';
      if (confirm(msg)) {
        chrome.storage.local.set({ history: [] }, () => {
          this.loadHistory();
        });
      }
    }

    showHistoryPage() {
      this.loadHistory();
      this.showPage('history-page');
    }

    // ============ 收藏夹功能 ============
    showFavorites() {
      this.loadFavorites();
      this.showPage('fav-page');
    }

    loadFavorites() {
      const favList = document.getElementById('fav-list');
      if (!favList) return;
      chrome.storage.local.get({ tarot_favorites: [] }, (result) => {
        const favs = result.tarot_favorites || [];
        if (favs.length === 0) {
          favList.innerHTML = '<div class="fav-empty"><div class="fav-empty-icon">&#9734;</div><div class="fav-empty-text">' + this.t('fav_empty') + '</div></div>';
          return;
        }
        let html = '';
        favs.forEach((card, idx) => {
          html += '<div class="fav-item" data-fav-idx="' + idx + '">';
          html += '<div class="fav-item-header">';
          html += '<span class="fav-item-name">' + (card.name || card.originalName || 'Unknown') + '</span>';
          html += '<button class="fav-item-delete" data-fav-delete-idx="' + idx + '" title="' + (this.currentLang === 'en' ? 'Remove' : '移除') + '">&#10005;</button>';
          html += '</div>';
          if (card.originalName && card.originalName !== card.name) {
            html += '<div class="fav-item-sub">' + card.originalName + '</div>';
          }
          html += '</div>';
        });
        favList.innerHTML = html;

        favList.onclick = (e) => {
          const delBtn = e.target.closest('.fav-item-delete');
          if (delBtn) {
            const delIdx = parseInt(delBtn.dataset.favDeleteIdx, 10);
            chrome.storage.local.get({ tarot_favorites: [] }, (result) => {
              const currentFavs = result.tarot_favorites || [];
              currentFavs.splice(delIdx, 1);
              chrome.storage.local.set({ tarot_favorites: currentFavs }, () => {
                this.loadFavorites();
              });
            });
            return;
          }
          const item = e.target.closest('.fav-item');
          if (item) {
            const idx = parseInt(item.dataset.favIdx, 10);
            const card = favs[idx];
            if (card) {
              const deckData = this.getDeckData();
              const found = deckData.find(c => c.id === card.id);
              if (found) {
                this.showCardPreview(found);
              } else {
                this.showCardPreview({
                  id: card.id,
                  name: card.name || card.originalName,
                  originalName: card.originalName,
                  upright: this.currentLang === 'en' ? 'No data in current deck' : '当前牌组无此卡牌数据',
                  reversed: this.currentLang === 'en' ? 'No data in current deck' : '当前牌组无此卡牌数据'
                });
              }
            }
          }
        };
      });
    }

    // ============ Toast 提示 ============
    showToast(msg, duration) {
      duration = duration || 1500;
      let toast = document.getElementById('toast-msg');
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add('show');
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, duration);
    }

    // ============ 命运数字：加载/保存常驻结果 ============
    loadSavedNumgen() {
      try {
        return JSON.parse(localStorage.getItem('numgen_current'));
      } catch (e) { return null; }
    }

    saveCurrentNumgen(numbers, min, max) {
      try {
        localStorage.setItem('numgen_current', JSON.stringify({ numbers: numbers, min: min, max: max }));
      } catch (e) {}
    }

    // ============ 命运数字生成器 ============
    showNumberGenPage() {
      const minInput = document.getElementById('numgen-min');
      const maxInput = document.getElementById('numgen-max');
      const qtyInput = document.getElementById('numgen-qty');
      const resultDiv = document.getElementById('numgen-result');
      const regenBtn = document.getElementById('numgen-regenerate-btn');
      const numbersContainer = document.getElementById('numgen-numbers');
      const copyBtn = document.getElementById('numgen-copy-btn');
      const readingContent = document.getElementById('numgen-reading-content');
      const errorDiv = document.getElementById('numgen-error');
      const genBtn = document.getElementById('numgen-generate-btn');

      if (minInput) minInput.value = 1;
      if (maxInput) maxInput.value = 100;
      if (qtyInput) qtyInput.value = 1;
      if (copyBtn) copyBtn.textContent = this.t('numgen_copy');
      if (errorDiv) errorDiv.classList.add('hidden');
      if (genBtn) {
        genBtn.classList.remove('loading');
        const btnText = genBtn.querySelector('.btn-text');
        const btnLoading = genBtn.querySelector('.btn-loading');
        if (btnText) btnText.classList.remove('hidden');
        if (btnLoading) btnLoading.classList.add('hidden');
      }

      // 添加实时输入验证
      this.attachNumgenValidation();

      // 恢复常驻结果
      const saved = this.loadSavedNumgen();
      if (saved && saved.numbers && saved.numbers.length > 0) {
        if (minInput) minInput.value = saved.min;
        if (maxInput) maxInput.value = saved.max;
        if (qtyInput) qtyInput.value = saved.numbers.length;
        if (resultDiv) resultDiv.classList.remove('hidden');
        if (regenBtn) regenBtn.classList.remove('hidden');
        if (numbersContainer) {
          const isMulti = saved.numbers.length > 1;
          numbersContainer.innerHTML = saved.numbers.map(n => {
            const longClass = String(n).length >= 4 ? ' long-num' : '';
            const colorClass = this.getNumberColorClass(n);
            return '<div class="numgen-number-wrap ' + colorClass + (isMulti ? '' : ' auto-size') + '">' +
              '<span class="numgen-number' + longClass + '">' + n + '</span>' +
              '</div>';
          }).join('');
          numbersContainer.classList.toggle('multi', isMulti);
        }
        if (copyBtn) {
          copyBtn.textContent = this.t(saved.numbers.length > 1 ? 'numgen_copy_all' : 'numgen_copy');
        }
        if (readingContent) {
          const digitalRoot = this.getDigitalRoot(saved.numbers[0]);
          readingContent.innerHTML = this.getNumberReading(saved.numbers, digitalRoot);
        }
      } else {
        if (resultDiv) resultDiv.classList.add('hidden');
        if (regenBtn) regenBtn.classList.add('hidden');
        if (numbersContainer) numbersContainer.innerHTML = '';
        if (readingContent) readingContent.innerHTML = '';
      }

      this.loadNumgenHistory();
      this.showPage('number-gen-page');
    }

    // ============ 命运数字输入验证 ============
    attachNumgenValidation() {
      const minInput = document.getElementById('numgen-min');
      const maxInput = document.getElementById('numgen-max');
      const qtyInput = document.getElementById('numgen-qty');
      const errorDiv = document.getElementById('numgen-error');
      const genBtn = document.getElementById('numgen-generate-btn');

      if (!minInput || !maxInput || !qtyInput || !errorDiv) return;

      const validate = () => {
        const min = parseInt(minInput.value, 10);
        const max = parseInt(maxInput.value, 10);
        const qty = parseInt(qtyInput.value, 10);
        let errorMsg = '';
        let hasError = false;

        // 清除之前的错误状态
        minInput.classList.remove('input-error');
        maxInput.classList.remove('input-error');
        qtyInput.classList.remove('input-error');

        // 验证最小值
        if (isNaN(min) || min < 0) {
          errorMsg = this.currentLang === 'en' ? 'Minimum value must be a valid number ≥ 0' : '最小值必须是 ≥ 0 的有效数字';
          minInput.classList.add('input-error');
          hasError = true;
        }

        // 验证最大值
        if (!hasError && (isNaN(max) || max <= min)) {
          errorMsg = this.t('numgen_error_min');
          maxInput.classList.add('input-error');
          hasError = true;
        }

        // 验证生成数量
        if (!hasError) {
          const rangeSize = max - min + 1;
          if (isNaN(qty) || qty < 1) {
            errorMsg = this.currentLang === 'en' ? 'Quantity must be ≥ 1' : '生成数量必须 ≥ 1';
            qtyInput.classList.add('input-error');
            hasError = true;
          } else if (qty > rangeSize) {
            errorMsg = this.t('numgen_error_quantity');
            qtyInput.classList.add('input-error');
            hasError = true;
          }
        }

        // 显示或隐藏错误
        if (hasError) {
          errorDiv.textContent = errorMsg;
          errorDiv.classList.remove('hidden');
          if (genBtn) genBtn.disabled = true;
        } else {
          errorDiv.classList.add('hidden');
          if (genBtn) genBtn.disabled = false;
        }
      };

      // 移除旧的事件监听（如果存在）
      minInput.removeEventListener('input', minInput._validateHandler);
      maxInput.removeEventListener('input', maxInput._validateHandler);
      qtyInput.removeEventListener('input', qtyInput._validateHandler);

      // 保存处理函数引用以便移除
      minInput._validateHandler = validate;
      maxInput._validateHandler = validate;
      qtyInput._validateHandler = validate;

      // 添加事件监听
      minInput.addEventListener('input', validate);
      maxInput.addEventListener('input', validate);
      qtyInput.addEventListener('input', validate);

      // 初始验证
      validate();
    }

    // ============ 选择困难症 ============
    showDilemmaPage() {
      const inputA = document.getElementById('dilemma-input-a');
      const inputB = document.getElementById('dilemma-input-b');
      const gameArea = document.getElementById('dilemma-game-area');
      const resultDiv = document.getElementById('dilemma-result');
      const readingDiv = document.getElementById('dilemma-reading');
      const redoBtn = document.getElementById('dilemma-redo-btn');
      if (inputA) inputA.value = '';
      if (inputB) inputB.value = '';
      if (gameArea) gameArea.classList.add('hidden');
      if (resultDiv) resultDiv.classList.add('hidden');
      if (readingDiv) readingDiv.classList.add('hidden');
      if (redoBtn) redoBtn.classList.add('hidden');
      this.showPage('dilemma-page');
      if (typeof renderDilemmaHistory === 'function') renderDilemmaHistory();
    }

    generateFateNumber() {
      const minInput = document.getElementById('numgen-min');
      const maxInput = document.getElementById('numgen-max');
      const qtyInput = document.getElementById('numgen-qty');
      const resultDiv = document.getElementById('numgen-result');
      const regenBtn = document.getElementById('numgen-regenerate-btn');
      const numbersContainer = document.getElementById('numgen-numbers');
      const readingEl = document.getElementById('numgen-reading-content');
      const copyBtn = document.getElementById('numgen-copy-btn');
      const genBtn = document.getElementById('numgen-generate-btn');

      // 验证输入
      const min = parseInt(minInput ? minInput.value : '1', 10);
      const max = parseInt(maxInput ? maxInput.value : '100', 10);
      const qty = parseInt(qtyInput ? qtyInput.value : '1', 10);

      if (isNaN(min) || isNaN(max) || max <= min) {
        alert(this.t('numgen_error_range'));
        return;
      }
      if (isNaN(qty) || qty < 1 || qty > 100) {
        alert(this.t('numgen_error_quantity') || '生成数量无效（1-100）');
        return;
      }

      const rangeSize = max - min + 1;
      if (qty > rangeSize) {
        alert(this.t('numgen_error_quantity'));
        return;
      }

      // 设置 loading 状态
      if (genBtn) {
        genBtn.classList.add('loading');
        genBtn.disabled = true;
        const btnText = genBtn.querySelector('.btn-text');
        const btnLoading = genBtn.querySelector('.btn-loading');
        if (btnText) btnText.classList.add('hidden');
        if (btnLoading) btnLoading.classList.remove('hidden');
      }

      // 使用 mulberry32 均匀伪随机算法
      const seed = (Date.now() + Math.floor(Math.random() * 1000000)) >>> 0;
      const rng = this.mulberry32(seed);

      // 生成不重复数字
      const numbers = [];
      if (qty <= rangeSize * 0.7) {
        // 少量：用 Set 去重
        const used = new Set();
        while (numbers.length < qty) {
          const n = min + Math.floor(rng() * rangeSize);
          if (!used.has(n)) {
            used.add(n);
            numbers.push(n);
          }
        }
      } else {
        // 大量：Fisher-Yates 洗牌思想，生成全量后取前 qty 个
        const pool = Array.from({ length: rangeSize }, (_, i) => min + i);
        for (let i = pool.length - 1; i > 0; i--) {
          const j = Math.floor(rng() * (i + 1));
          [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        numbers.push(...pool.slice(0, qty));
      }

      // 保存历史记录（存数组）
      this.saveNumgenHistory(numbers, min, max);

      // 显示数字（先展示滚动动画）
      const isMulti = numbers.length > 1;

      // 清除上一次未结束的滚动动画
      if (this._numgenRollInterval) {
        clearInterval(this._numgenRollInterval);
        this._numgenRollInterval = null;
      }

      if (numbersContainer) {
        // 构建圆球 DOM，先显示占位符
        numbersContainer.innerHTML = numbers.map(n => {
          const longClass = String(n).length >= 4 ? ' long-num' : '';
          const colorClass = this.getNumberColorClass(n);
          return '<div class="numgen-number-wrap ' + colorClass + (isMulti ? '' : ' auto-size') + '">' +
            '<span class="numgen-number numgen-rolling' + longClass + '">?</span>' +
          '</div>';
        }).join('');
        numbersContainer.classList.toggle('multi', isMulti);

        // 滚动动画：快速变换数字
        const wraps = numbersContainer.querySelectorAll('.numgen-number-wrap');
        let tick = 0;
        const totalTicks = 18 + Math.floor(Math.random() * 8);
        const delayPerTick = 50;
        this._numgenRollInterval = setInterval(() => {
          tick++;
          wraps.forEach(wrap => {
            const span = wrap.querySelector('.numgen-number');
            if (span) {
              span.textContent = min + Math.floor(rng() * rangeSize);
            }
          });
          if (tick >= totalTicks) {
            clearInterval(this._numgenRollInterval);
            this._numgenRollInterval = null;
            // 最终展示真实数字，带 3D 翻转动画
            wraps.forEach((wrap, i) => {
              const span = wrap.querySelector('.numgen-number');
              if (span) {
                span.textContent = numbers[i];
                span.classList.remove('numgen-rolling');
              }
              // 添加 3D 翻转效果
              wrap.classList.add('flip');
              wrap.addEventListener('animationend', () => {
                wrap.classList.remove('flip');
              }, { once: true });
            });

            // 保存常驻结果
            this.saveCurrentNumgen(numbers, min, max);

            // 恢复按钮状态
            const genBtn = document.getElementById('numgen-generate-btn');
            if (genBtn) {
              genBtn.classList.remove('loading');
              genBtn.disabled = false;
              const btnText = genBtn.querySelector('.btn-text');
              const btnLoading = genBtn.querySelector('.btn-loading');
              if (btnText) btnText.classList.remove('hidden');
              if (btnLoading) btnLoading.classList.add('hidden');
            }
          }
        }, delayPerTick);
      }

      // 更新复制按钮文案
      if (copyBtn) {
        copyBtn.textContent = this.t(isMulti ? 'numgen_copy_all' : 'numgen_copy');
      }

      // 解读（用第一个数字）
      const digitalRoot = this.getDigitalRoot(numbers[0]);
      if (readingEl) {
        readingEl.innerHTML = this.getNumberReading(numbers, digitalRoot);
      }

      // 数字含义解读（1-78 范围内显示对应塔罗牌）
      this.showNumgenTarotMeaning(numbers);

      // 更新统计数据
      this.updateNumgenStats(numbers);

      if (resultDiv) resultDiv.classList.remove('hidden');
      if (regenBtn) regenBtn.classList.remove('hidden');
      this.loadNumgenHistory();
    }

    getDigitalRoot(n) {
      while (n > 9 && n !== 11 && n !== 22) {
        n = String(n).split('').reduce((s, d) => s + parseInt(d, 10), 0);
      }
      return n;
    }

    // 根据数字大小返回颜色类名
    getNumberColorClass(n) {
      if (n >= 1 && n <= 9) return 'color-green';
      if (n >= 10 && n <= 99) return 'color-blue';
      return 'color-purple';
    }

    // 显示数字对应的塔罗牌含义（1-78）
    showNumgenTarotMeaning(numbers) {
      const meaningDiv = document.getElementById('numgen-tarot-meaning');
      const contentEl = document.getElementById('numgen-tarot-meaning-content');
      if (!meaningDiv || !contentEl) return;

      // 只取第一个数字，且必须在 0-77 范围内（对应 78 张塔罗牌）
      const n = numbers[0];
      if (n < 0 || n > 77) {
        meaningDiv.classList.add('hidden');
        return;
      }

      // tarotCards 全局可用（来自 tarot-cards.js）
      const card = tarotCards && tarotCards[n];
      if (!card) {
        meaningDiv.classList.add('hidden');
        return;
      }

      meaningDiv.classList.remove('hidden');
      const name = this.currentLang === 'en' ? card.originalName : card.name;
      const brief = card.uprightBrief || '';
      contentEl.innerHTML =
        '<div style="margin-bottom:6px;"><span style="color:var(--color-gold);font-weight:700;">' + name + '</span>' +
        ' <span style="font-size:11px;color:var(--color-text-muted);">（第 ' + (n + 1) + ' 张牌）</span></div>' +
        '<div style="font-size:12px;line-height:1.7;">' + (card.upright || brief) + '</div>';
    }

    // 更新统计数据
    updateNumgenStats(numbers) {
      const statsDiv = document.getElementById('numgen-stats');
      const countEl = document.getElementById('numgen-stats-count');
      const hotEl = document.getElementById('numgen-stats-hot');
      if (!statsDiv || !countEl || !hotEl) return;

      const today = new Date().toISOString().slice(0, 10);
      try {
        // 读取今日统计
        const stats = JSON.parse(localStorage.getItem('numgen_stats') || '{}');
        if (!stats[today]) stats[today] = { count: 0, freq: {} };

        // 更新计数和频率
        stats[today].count += 1;
        numbers.forEach(n => {
          stats[today].freq[n] = (stats[today].freq[n] || 0) + 1;
        });

        // 只保留最近 7 天
        const keys = Object.keys(stats).sort().reverse().slice(0, 7);
        const cleaned = {};
        keys.forEach(k => cleaned[k] = stats[k]);

        localStorage.setItem('numgen_stats', JSON.stringify(cleaned));

        // 显示计数
        countEl.textContent = (this.currentLang === 'en' ? 'Generated ' : '今日已生成 ') + stats[today].count + (this.currentLang === 'en' ? ' times today' : ' 次');

        // 显示最常出现的数字
        const freq = stats[today].freq;
        const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
        if (sorted.length > 0) {
          const top = sorted[0];
          hotEl.textContent = (this.currentLang === 'en' ? 'Most frequent: ' : '最常出现：') + top[0] + '（' + top[1] + (this.currentLang === 'en' ? ' times' : '次') + '）';
          hotEl.classList.remove('hidden');
        } else {
          hotEl.classList.add('hidden');
        }

        statsDiv.classList.remove('hidden');
      } catch (e) {
        statsDiv.classList.add('hidden');
      }
    }

    animateNumber(el, target, callback) {
      if (!el) return;
      const duration = 800;
      const start = performance.now();
      const initial = Math.max(1, Math.floor(target / 3));

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // 缓出效果
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(initial + (target - initial) * ease);
        el.textContent = current;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
          if (callback) callback();
        }
      };
      requestAnimationFrame(step);
    }

    getNumberReading(numbers, digitalRoot) {
      // numbers 现在是数组
      const majorArcana = this.getMajorArcanaInfo();
      const firstNumber = numbers[0];
      const arcanaIdx = firstNumber % 22;
      const arcana = majorArcana[arcanaIdx] || majorArcana[0];

      if (this.currentLang === 'en') {
        return this.getNumberReadingEn(numbers, digitalRoot, arcana);
      }

      // 中文解读
      let html = '';

      // 数字分析
      html += '<div style="margin-bottom:10px;"><span style="color:var(--color-gold);font-weight:700;">📊 数字分析</span><br/>';
      if (numbers.length === 1) {
        html += '你选择的区间中，塔罗命运指引生成了数字 <span style="color:var(--color-gold);font-weight:700;">' + firstNumber + '</span>。';
      } else {
        html += '塔罗命运指引生成了 <span style="color:var(--color-gold);font-weight:700;">' + numbers.length + ' 个数字</span>：';
        html += '<span style="color:var(--color-gold-light);font-weight:700;">' + numbers.join('、') + '</span>。';
      }
      html += ' 首数字 ' + firstNumber + ' 的数字根为 <span style="color:var(--color-gold-light);">' + digitalRoot + '</span>';
      if (digitalRoot === 11 || digitalRoot === 22) {
        html += '，是一个<span style="color:#FF9800;">特殊灵数</span>';
      }
      html += '。</div>';

      // 塔罗关联（以首数字为准）
      html += '<div style="margin-bottom:10px;"><span style="color:var(--color-gold);font-weight:700;">🃏 塔罗关联</span><br/>';
      html += '首数字 ' + firstNumber + ' 关联塔罗大阿卡纳第 ' + arcana.num + ' 张：';
      html += '<span style="color:var(--color-gold-light);font-weight:700;">' + arcana.name + '</span>。';
      html += '<br/><span style="font-size:11px;color:var(--color-text-muted);">' + arcana.mean + '</span></div>';

      // 为什么这个数字好
      html += '<div style="margin-bottom:10px;"><span style="color:var(--color-gold);font-weight:700;">✨ 命运指引</span><br/>';
      html += this.getNumberLuckReason(firstNumber, digitalRoot, arcana);
      html += '</div>';

      // 使用建议
      html += '<div><span style="color:var(--color-gold);font-weight:700;">💫 使用建议</span><br/>';
      html += this.getNumberAdvice(firstNumber, digitalRoot);
      html += '</div>';

      return html;
    }

    getNumberReadingEn(numbers, digitalRoot, arcana) {
      const firstNumber = numbers[0];
      let html = '';

      html += '<div style="margin-bottom:10px;"><span style="color:var(--color-gold);font-weight:700;">📊 Number Analysis</span><br/>';
      if (numbers.length === 1) {
        html += 'The tarot fate guide generated number <span style="color:var(--color-gold);font-weight:700;">' + firstNumber + '</span>.';
      } else {
        html += 'The tarot fate guide generated <span style="color:var(--color-gold);font-weight:700;">' + numbers.length + ' numbers</span>: ';
        html += '<span style="color:var(--color-gold-light);font-weight:700;">' + numbers.join(', ') + '</span>.';
      }
      html += ' The digital root of ' + firstNumber + ' is <span style="color:var(--color-gold-light);">' + digitalRoot + '</span>';
      if (digitalRoot === 11 || digitalRoot === 22) {
        html += ', a <span style="color:#FF9800;">Master Number</span>';
      }
      html += '.</div>';

      html += '<div style="margin-bottom:10px;"><span style="color:var(--color-gold);font-weight:700;">🃏 Tarot Connection</span><br/>';
      html += 'Fate number ' + firstNumber + ' connects to Major Arcana #' + arcana.num + ': ';
      html += '<span style="color:var(--color-gold-light);font-weight:700;">' + arcana.nameEn + '</span>.';
      html += '<br/><span style="font-size:11px;color:var(--color-text-muted);">' + arcana.meanEn + '</span></div>';

      html += '<div style="margin-bottom:10px;"><span style="color:var(--color-gold);font-weight:700;">✨ Fate Guidance</span><br/>';
      html += this.getNumberLuckReasonEn(firstNumber, digitalRoot, arcana);
      html += '</div>';

      html += '<div><span style="color:var(--color-gold);font-weight:700;">💫 Advice</span><br/>';
      html += this.getNumberAdviceEn(firstNumber, digitalRoot);
      html += '</div>';

      return html;
    }

    getMajorArcanaInfo() {
      // 0-21 大阿卡纳信息
      const zh = [
        { num: 0, name: '愚者', mean: '新的开始、无限可能、冒险精神' },
        { num: 1, name: '魔法师', mean: '创造力、意志力、技能施展' },
        { num: 2, name: '女祭司', mean: '直觉、潜意识、内在智慧' },
        { num: 3, name: '女皇', mean: '丰收、滋养、感官愉悦' },
        { num: 4, name: '皇帝', mean: '权威、稳定、领导力' },
        { num: 5, name: '教皇', mean: '传统、指引、精神导师' },
        { num: 6, name: '恋人', mean: '爱情、选择、价值观契合' },
        { num: 7, name: '战车', mean: '意志力、胜利、克服障碍' },
        { num: 8, name: '力量', mean: '勇气、耐心、以柔克刚' },
        { num: 9, name: '隐者', mean: '内省、寻求真理、独处智慧' },
        { num: 10, name: '命运之轮', mean: '命运转变、机遇、轮回' },
        { num: 11, name: '正义', mean: '公正、因果、理性判断' },
        { num: 12, name: '倒吊人', mean: '牺牲、换个角度、等待' },
        { num: 13, name: '死神', mean: '结束与新生、转化、释放过去' },
        { num: 14, name: '节制', mean: '平衡、耐心、适度' },
        { num: 15, name: '恶魔', mean: '束缚、物质诱惑、打破枷锁' },
        { num: 16, name: '塔', mean: '突变、觉醒、打破旧有' },
        { num: 17, name: '星星', mean: '希望、灵感、宁静信念' },
        { num: 18, name: '月亮', mean: '幻觉、恐惧、潜意识浮现' },
        { num: 19, name: '太阳', mean: '活力、成功、光明正大' },
        { num: 20, name: '审判', mean: '觉醒、重生、召唤' },
        { num: 21, name: '世界', mean: '完成、整合、成就感' }
      ];
      const en = [
        { num: 0, nameEn: 'The Fool', meanEn: 'New beginnings, infinite possibilities, adventure' },
        { num: 1, nameEn: 'The Magician', meanEn: 'Creativity, willpower, skill manifestation' },
        { num: 2, nameEn: 'The High Priestess', meanEn: 'Intuition, subconscious, inner wisdom' },
        { num: 3, nameEn: 'The Empress', meanEn: 'Abundance, nurturing, sensory pleasure' },
        { num: 4, nameEn: 'The Emperor', meanEn: 'Authority, stability, leadership' },
        { num: 5, nameEn: 'The Hierophant', meanEn: 'Tradition, guidance, spiritual mentor' },
        { num: 6, nameEn: 'The Lovers', meanEn: 'Love, choices, value alignment' },
        { num: 7, nameEn: 'The Chariot', meanEn: 'Willpower, victory, overcoming obstacles' },
        { num: 8, nameEn: 'Strength', meanEn: 'Courage, patience, gentle power' },
        { num: 9, nameEn: 'The Hermit', meanEn: 'Introspection, seeking truth, solitude wisdom' },
        { num: 10, nameEn: 'Wheel of Fortune', meanEn: 'Fate turning, opportunity, cycles' },
        { num: 11, nameEn: 'Justice', meanEn: 'Fairness, karma, rational judgment' },
        { num: 12, nameEn: 'The Hanged Man', meanEn: 'Sacrifice, new perspective, waiting' },
        { num: 13, nameEn: 'Death', meanEn: 'Endings and beginnings, transformation' },
        { num: 14, nameEn: 'Temperance', meanEn: 'Balance, patience, moderation' },
        { num: 15, nameEn: 'The Devil', meanEn: 'Bondage, material temptation, breaking chains' },
        { num: 16, nameEn: 'The Tower', meanEn: 'Sudden change, awakening, breaking old' },
        { num: 17, nameEn: 'The Star', meanEn: 'Hope, inspiration, serene faith' },
        { num: 18, nameEn: 'The Moon', meanEn: 'Illusion, fear, subconscious surfacing' },
        { num: 19, nameEn: 'The Sun', meanEn: 'Vitality, success, radiant clarity' },
        { num: 20, nameEn: 'Judgment', meanEn: 'Awakening, rebirth, calling' },
        { num: 21, nameEn: 'The World', meanEn: 'Completion, integration, accomplishment' }
      ];
      // merge
      for (let i = 0; i < zh.length && i < en.length; i++) {
        Object.assign(zh[i], en[i]);
      }
      return zh;
    }

    getNumberLuckReason(number, digitalRoot, arcana) {
      const reasons = [
        '数字 ' + number + ' 在塔罗指引下与「' + arcana.name + '」产生共鸣。' + arcana.mean + '——这预示着你当前正处于一个充满可能性的节点，这个数字将为你带来对应的能量加持。',
        '命运之轮转动到 ' + number + '，对应塔罗牌「' + arcana.name + '」的启示：' + arcana.mean + '。选择这个数字，等于选择了与宇宙频率对齐。',
        '数字 ' + number + ' 的数字根为 ' + digitalRoot + '，在塔罗中象征「' + arcana.name + '」——' + arcana.mean + '。今天与这个数字相关的决定会得到命运的眷顾。',
        '从塔罗的角度来看，数字 ' + number + ' 与「' + arcana.name + '」之间存在着微妙的联系。' + arcana.mean + '，这意味着选择这个数字将为你的决策增添一份神秘的力量。',
        '数字 ' + number + ' 被命运之轮选中，与塔罗大阿卡纳「' + arcana.name + '」产生共振。' + arcana.mean + '，让这个数字成为你今天的幸运符。',
        '在塔罗的智慧中，每个数字都有其独特的振动频率。数字 ' + number + ' 的频率与「' + arcana.name + '」相匹配，' + arcana.mean + '，这将为你的选择提供强大的支持。',
        '命运的数字 ' + number + ' 在塔罗指引下闪耀着独特的光芒。它与大阿卡纳「' + arcana.name + '」相连，' + arcana.mean + '，选择它就是选择接受命运的祝福。',
        '数字 ' + number + ' 和塔罗牌「' + arcana.name + '」在今天产生了特殊的缘分。' + arcana.mean + '，这个数字将为你带来意想不到的好运和启示。',
        '通过塔罗的透视，数字 ' + number + ' 与「' + arcana.name + '」之间建立了一座无形的桥梁。' + arcana.mean + '，让这个数字成为你决策时的得力助手。'
      ];
      const idx = number % reasons.length;
      let reason = reasons[idx] || reasons[0];

      // 根据奇偶性补充
      if (number % 2 === 0) {
        reason += ' 偶数属性为这个数字增添了稳定与和谐的特质，适合用于需要平衡的决策。';
      } else {
        reason += ' 奇数属性为这个数字注入了主动与开创的能量，适合用于需要突破的决策。';
      }

      return reason;
    }

    getNumberLuckReasonEn(number, digitalRoot, arcana) {
      const reasons = [
        'Number ' + number + ' resonates with "' + arcana.nameEn + '" under the tarot guidance. ' + arcana.meanEn + ' — this means you are at a node full of possibilities, and this number brings you corresponding energy.',
        'The Wheel of Fortune turns to ' + number + ', corresponding to the revelation of tarot "' + arcana.nameEn + '": ' + arcana.meanEn + '. Choosing this number means aligning with the frequency of the universe.',
        'The digital root of ' + number + ' is ' + digitalRoot + ', symbolizing "' + arcana.nameEn + '" in tarot — ' + arcana.meanEn + '. Decisions related to this number today will be blessed by fate.',
        'From a tarot perspective, number ' + number + ' has a subtle connection with "' + arcana.nameEn + '". ' + arcana.meanEn + ' — this means choosing this number adds a layer of mystical power to your decision.',
        'Number ' + number + ' is chosen by the Wheel of Fortune, resonating with Major Arcana "' + arcana.nameEn + '". ' + arcana.meanEn + ' — let this number be your lucky charm today.',
        'In tarot wisdom, each number has its unique vibration frequency. Number ' + number + ' matches the frequency of "' + arcana.nameEn + '", ' + arcana.meanEn + ', which provides strong support for your choices.',
        'The fate number ' + number + ' shines with unique light under the tarot guidance. It connects with Major Arcana "' + arcana.nameEn + '", ' + arcana.meanEn + ', and choosing it means accepting fate\'s blessing.',
        'Number ' + number + ' and tarot card "' + arcana.nameEn + '" have a special affinity today. ' + arcana.meanEn + ' — this number will bring you unexpected luck and insights.',
        'Through the tarot\'s perspective, an invisible bridge is built between number ' + number + ' and "' + arcana.nameEn + '". ' + arcana.meanEn + ' — let this number be your capable assistant in decision-making.'
      ];
      const idx = number % reasons.length;
      let reason = reasons[idx] || reasons[0];

      if (number % 2 === 0) {
        reason += ' Its even nature adds stability and harmony, making it great for balanced decisions.';
      } else {
        reason += ' Its odd nature injects initiative and pioneering energy, great for breakthrough decisions.';
      }

      return reason;
    }

    getNumberAdvice(number, digitalRoot) {
      const advices = [
        '可以尝试在重要决定中参考数字 ' + number + '，比如选择时间、金额或数量时优先考虑它。',
        '今天如果面临需要数字选择的场景，相信第一眼看到的 ' + number + '，那是命运的暗示。',
        '将 ' + number + ' 作为今日幸运数字，在需要随机选择的场合优先考虑它。',
        '在填写表单、选择座位号或挑选日期时，优先考虑包含 ' + number + ' 的选项，命运会眷顾你的选择。',
        '今天如果遇到需要掷骰子、抽签或任何随机数字的场景，暗自期待 ' + number + ' 的出现，它会为你带来好运。',
        '可以将 ' + number + ' 设为今日的目标数字，比如步数目标、饮水杯数等，让幸运数字陪伴你一整天。',
        '在购买彩票、抽奖或任何需要选号的活动中，将 ' + number + ' 作为首选号码，塔罗的命运指引会为你加持。',
        '今天在做任何决策时，可以观察周围是否出现 ' + number + ' 这个数字，它是命运给你的信号。',
        '将 ' + number + ' 记在心中，今天每当看到这个数字时，就把它当作一个小小的幸运提醒。'
      ];
      return advices[number % advices.length] || advices[0];
    }

    getNumberAdviceEn(number, digitalRoot) {
      const advices = [
        'Consider referring to number ' + number + ' in important decisions, such as choosing time, amount, or quantity — prioritize it.',
        'If you face a scenario requiring a number choice today, trust ' + number + ' if you see it — it\'s a hint from fate.',
        'Use ' + number + ' as today\'s lucky number. Prioritize it when a random choice is needed.',
        'When filling forms, choosing seat numbers, or picking dates, prioritize options containing ' + number + ' — fate will bless your choice.',
        'If you encounter scenarios requiring dice rolling, drawing lots, or any random numbers today, silently hope for ' + number + ' — it will bring you good luck.',
        'Set ' + number + ' as today\'s target number, such as step count, water intake cups, etc. — let the lucky number accompany you all day.',
        'In lottery purchases, raffles, or any number-selection activities, use ' + number + ' as the first choice — the tarot fate guide will bless you.',
        'When making any decision today, observe if number ' + number + ' appears around you — it\'s a signal from fate.',
        'Keep ' + number + ' in your heart. Whenever you see this number today, take it as a small lucky reminder.'
      ];
      return advices[number % advices.length] || advices[0];
    }

    // ============ 命运数字历史记录 ============
    saveNumgenHistory(numbers, min, max) {
      try {
        const history = JSON.parse(localStorage.getItem('numgen_history') || '[]');
        history.unshift({ numbers, min, max, time: Date.now() });
        if (history.length > 10) history.length = 10;
        localStorage.setItem('numgen_history', JSON.stringify(history));
      } catch (e) {}
    }

    loadNumgenHistory() {
      const listEl = document.getElementById('numgen-history-list');
      const historyEl = document.getElementById('numgen-history');
      if (!listEl || !historyEl) return;

      let history = [];
      try { history = JSON.parse(localStorage.getItem('numgen_history') || '[]'); } catch (e) {}

      if (history.length === 0) {
        historyEl.classList.add('hidden');
        return;
      }

      historyEl.classList.remove('hidden');
      listEl.innerHTML = history.slice(0, 5).map((item, idx) => {
        const d = new Date(item.time);
        const timeStr = (d.getMonth() + 1) + '/' + d.getDate() + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
        // 兼容旧数据（number 为数字）和新数据（numbers 为数组）
        const nums = Array.isArray(item.numbers) ? item.numbers : [item.number];
        const numDisplay = nums.join(this.currentLang === 'en' ? ', ' : '、');
        const numShort = numDisplay.length > 15 ? numDisplay.slice(0, 15) + '…' : numDisplay;
        return '<div class="numgen-history-item" data-index="' + idx + '">' +
          '<span class="num" title="' + numDisplay + '">' + numShort + '</span>' +
          '<div style="display:flex;align-items:center;gap:8px;">' +
            '<span class="meta">' + timeStr + '</span>' +
            '<button class="numgen-history-delete" data-index="' + idx + '" title="' + (this.currentLang === 'en' ? 'Delete' : '删除') + '">✕</button>' +
          '</div>' +
          '</div>';
      }).join('');

      // 添加点击事件：点击历史记录项查看详情
      listEl.querySelectorAll('.numgen-history-item').forEach(item => {
        item.addEventListener('click', (e) => {
          // 如果点击的是删除按钮，不触发
          if (e.target.classList.contains('numgen-history-delete')) return;
          const idx = parseInt(item.dataset.index, 10);
          if (history[idx]) {
            this.showHistoryDetail(history[idx]);
          }
        });
      });

      // 添加删除按钮事件
      listEl.querySelectorAll('.numgen-history-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.deleteNumgenHistoryItem(parseInt(btn.dataset.index, 10));
        });
      });
    }

    deleteNumgenHistoryItem(index) {
      try {
        let history = JSON.parse(localStorage.getItem('numgen_history') || '[]');
        if (index >= 0 && index < history.length) {
          history.splice(index, 1);
          localStorage.setItem('numgen_history', JSON.stringify(history));
          this.loadNumgenHistory();
        }
      } catch (e) {}
    }

    showHistoryDetail(item) {
      const minInput = document.getElementById('numgen-min');
      const maxInput = document.getElementById('numgen-max');
      const qtyInput = document.getElementById('numgen-qty');
      const resultDiv = document.getElementById('numgen-result');
      const numbersContainer = document.getElementById('numgen-numbers');
      const readingContent = document.getElementById('numgen-reading-content');
      const copyBtn = document.getElementById('numgen-copy-btn');
      const regenBtn = document.getElementById('numgen-regenerate-btn');

      const nums = Array.isArray(item.numbers) ? item.numbers : [item.number];
      if (minInput) minInput.value = item.min;
      if (maxInput) maxInput.value = item.max;
      if (qtyInput) qtyInput.value = nums.length;

      if (resultDiv) resultDiv.classList.remove('hidden');
      if (regenBtn) regenBtn.classList.remove('hidden');

      if (numbersContainer) {
        const isMulti = nums.length > 1;
        numbersContainer.innerHTML = nums.map(n => {
          const longClass = String(n).length >= 4 ? ' long-num' : '';
          const colorClass = this.getNumberColorClass(n);
          return '<div class="numgen-number-wrap ' + colorClass + (isMulti ? '' : ' auto-size') + '">' +
            '<span class="numgen-number' + longClass + '">' + n + '</span>' +
            '</div>';
        }).join('');
        numbersContainer.classList.toggle('multi', isMulti);
      }

      if (copyBtn) {
        copyBtn.textContent = this.t(nums.length > 1 ? 'numgen_copy_all' : 'numgen_copy');
      }

      if (readingContent) {
        const digitalRoot = this.getDigitalRoot(nums[0]);
        readingContent.innerHTML = this.getNumberReading(nums, digitalRoot);
      }

      // 保存为当前结果
      this.saveCurrentNumgen(nums, item.min, item.max);
    }

    clearNumgenHistory() {
      const msg = this.currentLang === 'en' ? 'Clear all number generation history?' : '确定清空所有命运数字历史记录吗？';
      if (!confirm(msg)) return;
      localStorage.removeItem('numgen_history');
      const listEl = document.getElementById('numgen-history-list');
      if (listEl) listEl.innerHTML = '';
      this.loadNumgenHistory();
      console.log('命运数字历史已清空');
    }

    copyNumgenNumber() {
      const container = document.getElementById('numgen-numbers');
      if (!container) return;
      const nums = Array.from(container.querySelectorAll('.numgen-number'))
        .map(el => el.textContent.trim())
        .join(this.currentLang === 'en' ? ', ' : '、');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(nums).then(() => {
          this.showToast(this.currentLang === 'en' ? 'Copied!' : '已复制 ✓');
        }).catch(() => {});
      }
    }

    // ============ 牌阵搜索功能 ============
    initSpreadSearch() {
      const searchInput = document.getElementById('spread-search-input');
      const clearBtn = document.getElementById('spread-search-clear');
      if (!searchInput) return;

      searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        if (clearBtn) clearBtn.classList.toggle('hidden', query.length === 0);

        const spreadBtns = document.querySelectorAll('.spread-btn, .spread-card');
        const categoryTitles = document.querySelectorAll('.spread-category-title');
        const filterBtns = document.querySelectorAll('.spread-filter-btn');

        // 搜索时取消分类筛选高亮
        filterBtns.forEach(b => b.classList.remove('active'));
        const allBtn = document.querySelector('.spread-filter-btn[data-filter="all"]');
        if (allBtn) allBtn.classList.add('active');

        if (!query) {
          // 清空搜索，显示所有牌阵
          spreadBtns.forEach(btn => btn.style.display = '');
          categoryTitles.forEach(title => title.style.display = '');
          return;
        }

        // 搜索匹配：名称、描述、分类、难度
        spreadBtns.forEach(btn => {
          const key = btn.dataset.spread;
          const spread = SPREADS[key];
          if (!spread) return;

          const nameZh = (spread.name || '').toLowerCase();
          const nameEn = (this.t('spread_' + key + '_name') || '').toLowerCase();
          const desc = (spread.usage || '').toLowerCase();
          const category = (spread.category || '').toLowerCase();
          const difficulty = (spread.difficulty || '').toLowerCase();

              const categoryKeyMap = { simple: 'cat_simple', relationship: 'cat_relationship', decision: 'cat_decision', advanced: 'cat_advanced', career: 'cat_career', self: 'cat_self', fortune: 'cat_fortune', spiritual: 'cat_spiritual', life: 'cat_life' };
          const catKey = categoryKeyMap[spread.category] || '';
          const catName = (this.t(catKey) || '') + (spread.category || '');
          const matches = nameZh.includes(query) || nameEn.includes(query)
            || desc.includes(query) || category.includes(query)
            || catName.toLowerCase().includes(query)
            || difficulty.includes(query);

          btn.style.display = matches ? '' : 'none';
        });

        // 控制分类标题显示
        categoryTitles.forEach(title => {
          let showTitle = false;
          let nextEl = title.nextElementSibling;
          while (nextEl && !nextEl.classList.contains('spread-category-title')) {
            if (nextEl.classList.contains('spread-btn') && nextEl.style.display !== 'none') {
              showTitle = true;
              break;
            }
            nextEl = nextEl.nextElementSibling;
          }
          title.style.display = showTitle ? '' : 'none';
        });
      });

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          searchInput.value = '';
          searchInput.dispatchEvent(new Event('input'));
        });
      }
    }

    // ============ 牌阵悬浮预览 ============
    initSpreadHoverPreview() {
      const preview = document.getElementById('spread-hover-preview');
      if (!preview) return;

      document.querySelectorAll('.spread-info-btn').forEach(btn => {
        btn.addEventListener('mouseenter', (e) => {
          const key = btn.dataset.spreadKey;
          const spread = SPREADS[key];
          if (!spread) return;

          const diffStars = { easy: '★☆☆', medium: '★★☆', hard: '★★★' };
          const catLabels = {
            simple: this.t('cat_simple') || '入门经典',
            relationship: this.t('cat_relationship') || '情感',
            decision: this.t('cat_decision') || '决策',
            advanced: this.t('cat_advanced') || '深度专题',
            career: this.t('cat_career') || '事业',
            self: this.t('cat_self') || '自我成长'
          };

          const hoverDict = I18N[this.currentLang] || I18N.zh;
          // 生成位置列表 HTML
      const localizedPositions = this.getLocalizedPositions(key);
      let positionsHtml = '<div class="hover-positions">';
      const showCount = Math.min(localizedPositions.length, 5);
      for (let i = 0; i < showCount; i++) {
        positionsHtml += '<div class="hover-pos"><span class="hover-pos-num">' + (i + 1) + '.</span> ' + localizedPositions[i] + '</div>';
      }
      if (localizedPositions.length > showCount) {
        positionsHtml += '<div class="hover-more">+' + (localizedPositions.length - showCount) + '...</div>';
      }
      positionsHtml += '</div>';

      preview.innerHTML =
            '<div class="hover-title">' + this.getLocalizedSpreadName(key) + '</div>' +
            '<div class="hover-meta">' +
              '<span class="hover-meta-tag">' + (diffStars[spread.difficulty] || '★☆☆') + '</span>' +
              '<span class="hover-meta-tag">' + (catLabels[spread.category] || spread.category) + '</span>' +
              '<span class="hover-meta-tag">' + spread.positions.length + ' ' + (hoverDict['cards_count_label'] || '张牌') + '</span>' +
            '</div>' +
            '<div class="hover-usage">' + (this.currentLang === 'en' ? (spread.usageEn || spread.usage || '') : (spread.usage || '')) + '</div>' +
            positionsHtml;

          preview.classList.remove('hidden');
          this.positionHoverPreview(e.target, preview);
        });

        btn.addEventListener('mousemove', (e) => {
          this.positionHoverPreview(e.target, preview);
        });

        btn.addEventListener('mouseleave', () => {
          preview.classList.add('hidden');
        });
      });
    }

    positionHoverPreview(target, preview) {
      const rect = target.getBoundingClientRect();
      const pw = preview.offsetWidth || 260;
      const ph = preview.offsetHeight;
      const parentCard = target.closest('.spread-card');

      let left, top;

      if (parentCard) {
        // 卡片（单牌阵/三牌阵）：预览框放卡片正下方，居中对齐
        left = rect.left + rect.width / 2 - pw / 2;
        top = parentCard.getBoundingClientRect().bottom + 8;
      } else {
        // 列表项：i 在左侧 → 预览框放按钮左侧
        left = rect.left - pw - 8;
        top = rect.top;
      }

      // 左边界保护
      if (left < 4) left = 4;
      // 右边界保护
      if (left + pw > window.innerWidth - 4) {
        left = window.innerWidth - pw - 4;
      }

      // 下边界保护：空间不足则改到上方
      if (top + ph > window.innerHeight - 4) {
        top = rect.top - ph - 8;
      }
      // 上边界保护
      if (top < 4) top = 4;

      preview.style.left = left + 'px';
      preview.style.top = top + 'px';
    }

    // ============ 牌阵收藏功能 ============
    initSpreadFavorites() {
      const FAV_KEY = 'tarot_spread_favorites';
      const toggleBtns = () => {
        chrome.storage.local.get({ [FAV_KEY]: [] }, (result) => {
          const favs = result[FAV_KEY] || [];
          document.querySelectorAll('.spread-fav-btn').forEach(btn => {
            const key = btn.dataset.spreadKey;
            btn.textContent = favs.includes(key) ? '★' : '☆';
            btn.classList.toggle('active', favs.includes(key));
            btn.title = favs.includes(key) ? (this.currentLang === 'en' ? 'Unfavorite' : '取消收藏') : (this.currentLang === 'en' ? 'Add to Favorites' : '收藏牌阵');
          });
        });
      };

      // 为所有牌阵按钮添加收藏按钮
      document.querySelectorAll('[data-spread]').forEach(btn => {
        const key = btn.dataset.spread;
        if (!key) return;
        // 避免重复添加
        if (btn.querySelector('.spread-fav-btn')) return;

        const favBtn = document.createElement('button');
        favBtn.className = 'spread-fav-btn';
        favBtn.dataset.spreadKey = key;
        favBtn.type = 'button';
        favBtn.textContent = '☆';
        btn.appendChild(favBtn);
      });

      toggleBtns();

      document.querySelectorAll('.spread-fav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const key = btn.dataset.spreadKey;
          chrome.storage.local.get({ [FAV_KEY]: [] }, (result) => {
            let favs = result[FAV_KEY] || [];
            if (favs.includes(key)) {
              favs = favs.filter(k => k !== key);
            } else {
              favs.push(key);
            }
            const data = {};
            data[FAV_KEY] = favs;
            chrome.storage.local.set(data, () => {
              toggleBtns();
              // 如果当前正在按收藏筛选，刷新显示
              const activeFilter = document.querySelector('.spread-filter-btn.active');
              if (activeFilter && activeFilter.dataset.filter === 'favorites') {
                this.applySpreadFilter('favorites');
              }
            });
          });
        });
      });
    }

    applySpreadFilter(filter) {
      const allBtns = document.querySelectorAll('[data-spread]');
      const categoryTitles = document.querySelectorAll('.spread-category-title');
      const FAV_KEY = 'tarot_spread_favorites';

      if (filter === 'favorites') {
        chrome.storage.local.get({ [FAV_KEY]: [] }, (result) => {
          const favs = result[FAV_KEY] || [];
          allBtns.forEach(b => {
            b.style.display = favs.includes(b.dataset.spread) ? '' : 'none';
          });
          categoryTitles.forEach(t => t.style.display = 'none');
        });
        return;
      }

      // 其他筛选逻辑
      allBtns.forEach(b => {
        const spread = SPREADS[b.dataset.spread];
        if (!spread) return;
        if (filter === 'all') {
          b.style.display = '';
        } else {
          b.style.display = (spread.category === filter || (filter === 'advanced' && spread.difficulty === 'hard')) ? '' : 'none';
        }
      });

      // 控制分类标题
      categoryTitles.forEach(title => {
        let showTitle = false;
        let nextEl = title.nextElementSibling;
        while (nextEl && !nextEl.classList.contains('spread-category-title')) {
          if ((nextEl.classList.contains('spread-btn') || nextEl.classList.contains('spread-card')) && nextEl.style.display !== 'none') {
            showTitle = true;
            break;
          }
          nextEl = nextEl.nextElementSibling;
        }
        title.style.display = showTitle ? '' : 'none';
      });
    }

    // ============ 卡牌预览功能 ============
    showCardPreview(card) {
      const modal = document.getElementById('card-preview-modal');
      const body = document.getElementById('card-preview-body');
      if (!modal || !body) return;

      const displayName = deckManager.getCardName(card);
      const originalName = card.originalName || '';
      const upright = this.getMeaningText(card, false);
      const reversed = this.getMeaningText(card, true);

      let html = '<div class="card-preview-header">';
      html += '<div class="card-preview-name">' + displayName + '</div>';
      if (originalName && originalName !== displayName) {
        html += '<div class="card-preview-subtitle">' + originalName + '</div>';
      }
      html += '</div>';

      html += '<div class="card-preview-meaning">';
      html += '<div class="card-preview-meaning-title">' + (this.currentLang === 'en' ? 'Upright' : '正位') + '</div>';
      html += '<div class="card-preview-meaning-text">' + upright + '</div>';
      html += '</div>';

      html += '<div class="card-preview-meaning" style="margin-top:16px;">';
      html += '<div class="card-preview-meaning-title">' + (this.currentLang === 'en' ? 'Reversed' : '逆位') + '</div>';
      html += '<div class="card-preview-meaning-text">' + reversed + '</div>';
      html += '</div>';

      body.innerHTML = html;
      modal.classList.remove('hidden');

      // 绑定关闭事件
      const closeBtn = document.getElementById('card-preview-close');
      if (closeBtn) {
        closeBtn.onclick = () => {
          modal.classList.add('hidden');
        };
      }

      // 点击模态框背景关闭
      modal.onclick = (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      };

      // 更新收藏按钮状态
      const favBtn = document.getElementById('card-preview-fav');
      if (favBtn) {
        chrome.storage.local.get({ tarot_favorites: [] }, (result) => {
          const favs = result.tarot_favorites || [];
          const isFav = favs.some(c => c.id === card.id && c.deck === this.currentDeck);
          favBtn.textContent = isFav ? '★' : '☆';
          favBtn.classList.toggle('active', isFav);
          favBtn._currentCard = { id: card.id, name: deckManager.getCardName(card), deck: this.currentDeck, originalName: card.originalName || '' };
        });
        favBtn.onclick = () => { this.toggleFavorite(); };
      }

      // 绑定 Esc 键关闭预览
      this._previewEscHandler = (e) => {
        if (e.key === 'Escape') {
          modal.classList.add('hidden');
          document.removeEventListener('keydown', this._previewEscHandler);
        }
      };
      document.addEventListener('keydown', this._previewEscHandler);
    }

    // ============ 初始化 ============
    async init() {
      try {
        if (typeof tarotCards === 'undefined') {
          throw new Error('tarot-cards.js 未正确加载');
        }

        // 加载自定义牌意
        await this.loadCustomMeanings();

        // 加载语言偏好
        await new Promise((resolve) => {
          chrome.storage.local.get({ tarot_lang: 'zh' }, (result) => {
            this.currentLang = result.tarot_lang || 'zh';
            if (typeof deckManager !== 'undefined') {
              deckManager.setLanguage(this.currentLang);
            }
            const langSelect = document.getElementById('lang-select');
            if (langSelect) langSelect.value = this.currentLang;
            this.applyStaticI18n();
            this.updateFortuneDate();
            resolve();
          });
        });

        // 初始化 deckManager
        if (typeof deckManager !== 'undefined') {
          deckManager.currentDeckName = this.currentDeck;
          // 预加载 rider-waite 牌组，用于英文牌意 fallback
          try {
            const riderDeck = await deckManager.getDeck('rider');
            this.riderWaiteMap = new Map(riderDeck.map((c) => [c.id, c]));
          } catch (e) {
            console.warn('预加载 rider-waite 牌组失败:', e);
          }
        }

        // 恢复音效开关状态
        chrome.storage.local.get({ tarot_sound: true }, (result) => {
          this.soundEnabled = result.tarot_sound !== false;
          const btn = document.getElementById('sound-toggle-btn');
          if (btn) btn.classList.toggle('muted', !this.soundEnabled);
        });

        this.showPage('welcome-page');
        this.bindEvents();
        this.initSpreadSearch();
        this.initSpreadFilter();
        this.initSpreadHoverPreview();
        this.initSpreadFavorites();
        this.initCategoryCollapse();
        this.updateCategoryCounts();  // 动态计算分类数量
        this.updateFortuneDate();

        console.log('Tarot App 初始化完成');
      } catch (err) {
        console.error('初始化错误:', err);
      }
    }

    // ============ 动态更新分类牌阵数量 ============
    updateCategoryCounts() {
      if (typeof SPREADS === 'undefined') return;
      
      // 统计每个 category 的牌阵数量
      const counts = {};
      Object.values(SPREADS).forEach(spread => {
        const cat = spread.category || 'other';
        counts[cat] = (counts[cat] || 0) + 1;
      });

      // 遍历所有分类标题，更新对应的数量显示
      const categories = document.querySelectorAll('.spread-category');
      categories.forEach(cat => {
        const header = cat.querySelector('.spread-category-header');
        if (!header) return;
        const titleEl = header.querySelector('.category-title');
        if (!titleEl) return;
        const i18nKey = titleEl.dataset.i18nKey;
        if (!i18nKey) return;

        // 将 i18n key 映射到 category 名称
        const keyToCategory = {
          'cat_simple': 'simple',
          'cat_relationship': 'relationship',
          'cat_decision': 'decision',
          'cat_advanced': 'advanced',
          'cat_career': 'career',
          'cat_self': 'self',
          'cat_fortune': 'fortune',
          'cat_spiritual': 'spiritual',
          'cat_life': 'life'
        };
        const category = keyToCategory[i18nKey];
        if (!category) return;

        const countEl = header.querySelector('.category-count');
        if (countEl) {
          countEl.textContent = counts[category] || 0;
        }
      });
    }

    // ============ 牌阵分类折叠 ============
    initCategoryCollapse() {
      const categories = document.querySelectorAll('.spread-category');

      // 恢复折叠状态
      categories.forEach(cat => {
        const header = cat.querySelector('.spread-category-header');
        if (!header) return;
        const key = header.querySelector('.category-title')?.dataset?.i18nKey;
        if (!key) return;

        // 从 localStorage 恢复状态（默认展开）
        const collapsed = localStorage.getItem('tarot_cat_' + key) === 'true';
        if (collapsed) {
          cat.classList.add('collapsed');
        }

        // 点击事件
        header.addEventListener('click', () => {
          cat.classList.toggle('collapsed');
          const isCollapsed = cat.classList.contains('collapsed');
          localStorage.setItem('tarot_cat_' + key, isCollapsed);
        });
      });

      // 搜索时自动展开所有分类
      const searchInput = document.getElementById('spread-search-input');
      if (searchInput) {
        searchInput.addEventListener('input', () => {
          const keyword = searchInput.value.trim();
          if (keyword) {
            // 搜索时展开所有
            categories.forEach(cat => cat.classList.remove('collapsed'));
          } else {
            // 搜索清空时恢复状态
            categories.forEach(cat => {
              const header = cat.querySelector('.spread-category-header');
              const key = header?.querySelector('.category-title')?.dataset?.i18nKey;
              if (key && localStorage.getItem('tarot_cat_' + key) === 'true') {
                cat.classList.add('collapsed');
              }
            });
          }
        });
      }
    }

    // ============ 绑定事件（扩展） ============
    bindEvents() {
      // 触觉反馈：按钮点击震动（捕获阶段触发，卡牌震动由 playFlipSound 处理）
      document.addEventListener('click', (e) => {
        const target = e.target.closest('button, .spread-btn, .spread-card, .tool-card, .numgen-preset-btn, .dilemma-method-btn, .history-delete-btn');
        if (target) {
          this.triggerHaptic();
        }
      }, true);

      const spreadBtns = document.querySelectorAll('.spread-btn, .spread-card');
      console.log('绑定事件，找到', spreadBtns.length, '个牌阵按钮');
      spreadBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const spread = e.currentTarget.dataset.spread;
          console.log('点击牌阵:', spread);
          try {
            switch (spread) {
              case 'single':     this.drawSingle(); break;
              case 'three':      this.drawThree(); break;
              case 'celtic':    this.drawCeltic(); break;
              case 'relation':   this.drawRelation(); break;
              case 'choice':     this.drawChoice(); break;
              case 'five':      this.drawFive(); break;
              case 'horseshoe': this.drawHorseshoe(); break;
              case 'career':    this.drawCareer(); break;
              case 'timeflow':  this.drawTimeflow(); break;
              case 'action':    this.drawAction(); break;
              case 'mind':      this.drawMind(); break;
              // 新增牌阵
              case 'love':      this.drawLove(); break;
              case 'broken':    this.drawBroken(); break;
              case 'yesno':     this.drawYesno(); break;
              case 'jobchange': this.drawJobchange(); break;
              case 'shadow':    this.drawShadow(); break;
              case 'year':      this.drawYear(); break;
              // 新增：利弊分析、人生使命
              case 'proscons':   this.drawProscons(); break;
              case 'lifepurpose': this.drawLifepurpose(); break;
              // 新增：决策树牌阵
              case 'decisiontree': this.drawDecisiontree(); break;
              // 新增：旅行牌阵
              case 'travel':     this.drawTravel(); break;
              // 新增：考试牌阵
              case 'exam':      this.drawExam(); break;
              // 新增：命运之轮
              case 'fatewheel': this.drawFatewheel(); break;
              // 新增：月运牌阵
              case 'monthly':   this.drawMonthly(); break;
    // 新增：灵魂旅程牌阵
    case 'souljourney': this.drawSouljourney(); break;
              // 新增：星座牌阵
              case 'zodiac':    this.drawZodiac(); break;
              // 新增：前世今生牌阵
              case 'pastlife':  this.drawPastlife(); break;
              // 新增：健康牌阵
              case 'health':     this.drawHealth(); break;
              // 新增：家庭关系牌阵
              case 'family':    this.drawFamily(); break;
              // 新增：一周运势牌阵
              case 'weekly':    this.drawWeekly(); break;
              // 新增：灵感创作牌阵
              case 'creative':  this.drawCreative(); break;
              // 新增：财务投资牌阵
              case 'finance':   this.drawFinance(); break;
              // 新增：断舍离牌阵
              case 'declutter': this.drawDeclutter(); break;
              // 新增：办公室人际牌阵
              case 'office':     this.drawOffice(); break;
              // 新增：梦境解读牌阵
              case 'dream':      this.drawDream(); break;
              // 新增：失物寻找牌阵
              case 'lost':      this.drawLost(); break;
            }
          } catch (err) {
            console.error('抽牌错误:', err);
            alert(this.t('alert_draw_error') + err.message);
          }
        });
      });

      const deckSelect = document.getElementById('deck-select');
      if (deckSelect) {
        deckSelect.addEventListener('change', (e) => {
          this.changeDeck(e.target.value);
        });
      }

      // 语言切换
      const langSelect = document.getElementById('lang-select');
      if (langSelect) {
        langSelect.addEventListener('change', (e) => {
          this.setLanguage(e.target.value);
          this.applyStaticI18n();
          this.updateStaticUIText();
          this.updateFortuneDate();
          if (this.currentCards && this.currentCards.length > 0) {
            this.reRenderCurrentCards();
            const item = this.currentCards[0];
            if (item) this.showMeaning(item.card, item.isReversed, item.position);
          }
        });
      }

      // 绑定按钮事件
      const buttonHandlers = {
        'back-btn': () => this.goBack(),
        'reshuffle-btn': () => this.reshuffle(),
        'reinterpret-btn': () => this.reshuffle(),
        'share-btn': () => this.shareResult(),
        'history-btn': () => this.showHistoryPage(),
        'history-back-btn': () => this.showPage('welcome-page'),
        'clear-history-btn': () => this.clearHistory(),
        'daily-fortune-btn': () => this.toggleDailyFortune(),
        'regenerate-fortune-btn': () => {
          const now = new Date();
          const dateStr = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
          try { localStorage.removeItem('daily_fortune_' + dateStr); } catch (e) {}
          this.renderDailyFortune(true);
        },
        'close-fortune-btn': () => {
          const panel = document.getElementById('daily-fortune-panel');
          if (panel) panel.classList.add('hidden');
        },
        'close-history-detail-btn': () => this.closeHistoryDetail(),
        'history-detail-back-btn': () => this.closeHistoryDetail(),
        'sound-toggle-btn': () => this.toggleSound(),
        'copy-result-btn': () => this.copyResult(),
        'fav-btn': () => this.showFavorites(),
        'fav-back-btn': () => this.showPage('welcome-page'),
        // 命运数字生成器
        'number-gen-btn': () => this.showNumberGenPage(),
        'numgen-generate-btn': () => this.generateFateNumber(),
        'numgen-regenerate-btn': () => this.generateFateNumber(),
        'numgen-back-btn': () => this.showPage('welcome-page'),
        // 选择困难症
        'dilemma-btn': () => this.showDilemmaPage(),
        'dilemma-back-btn': () => this.showPage('welcome-page'),
        // 命运数字：复制、清除历史
        'numgen-copy-btn': () => this.copyNumgenNumber(),
        'numgen-clear-history-btn': () => this.clearNumgenHistory(),
      };

      Object.entries(buttonHandlers).forEach(([id, handler]) => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', handler);
      });

      // 综合解读切换
      const toggleBtn = document.getElementById('toggle-reading-btn');
      const compHeader = document.querySelector('.comprehensive-header');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleComprehensiveReading();
        });
      }
      if (compHeader) {
        compHeader.addEventListener('click', () => this.toggleComprehensiveReading());
      }

      // 解读模式切换
      document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          // 重新生成解读
          const compContent = document.getElementById('comprehensive-content');
          if (compContent && this.currentCards && this.currentCards.length > 0) {
            this.generateComprehensiveReading().then(reading => {
              compContent.innerHTML = reading;
              compContent.classList.remove('hidden');
              const tBtn = document.getElementById('toggle-reading-btn');
              if (tBtn) tBtn.textContent = this.t('btn_collapse');
            });
          }
        });
      });

      // 问题输入 → 牌阵智能推荐
      const questionInput = document.getElementById('spread-question-input');
      if (questionInput) {
        let debounceTimer = null;
        questionInput.addEventListener('input', () => {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            const q = questionInput.value.trim();
            if (q.length >= 2) {
              this.showRecommendedSpreads(q);
            } else {
              const recContainer = document.getElementById('recommended-spreads');
              if (recContainer) recContainer.classList.add('hidden');
            }
          }, 300);
        });
        // 点击推荐牌阵时清空输入
        const recContainer = document.getElementById('recommended-spreads');
        if (recContainer) {
          recContainer.addEventListener('click', () => {
            questionInput.value = '';
            recContainer.classList.add('hidden');
          });
        }
      }

      // 牌阵按钮 tooltip
      const tooltipEl = document.getElementById('spread-tooltip');
      if (tooltipEl) {
        document.querySelectorAll('.spread-btn[data-i18n-tip]').forEach((btn) => {
          btn.addEventListener('mouseenter', (e) => {
            const tipKey = btn.dataset.i18nTip;
            if (!tipKey) return;
            const tipText = this.t(tipKey);
            if (!tipText) return;
            tooltipEl.textContent = tipText;
            tooltipEl.classList.remove('hidden');
            // 强制回流获取真实尺寸
            const tw = tooltipEl.offsetWidth;
            const th = tooltipEl.offsetHeight;
            const rect = btn.getBoundingClientRect();
            let left = rect.left + rect.width / 2 - tw / 2;
            let top = rect.top - th - 8;
            left = Math.max(4, Math.min(left, window.innerWidth - tw - 4));
            if (top < 0) top = rect.bottom + 8;
            tooltipEl.style.left = left + 'px';
            tooltipEl.style.top = top + 'px';
          });
          btn.addEventListener('mouseleave', () => {
            tooltipEl.classList.add('hidden');
          });
        });
      }

      // 牌阵详情按钮（阻止冒泡，不触发占卜）
      document.querySelectorAll('.spread-info-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const key = btn.dataset.spreadKey;
          if (key) this.showSpreadDetail(key);
        });
      });

      // 牌阵详情弹窗关闭
      const detailClose = document.getElementById('spread-detail-close');
      if (detailClose) {
        detailClose.addEventListener('click', () => {
          const modal = document.getElementById('spread-detail-modal');
          if (modal) modal.classList.add('hidden');
        });
      }

      // 命运数字：预设范围按钮
      document.querySelectorAll('.numgen-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const min = btn.dataset.min;
          const max = btn.dataset.max;
          const minInput = document.getElementById('numgen-min');
          const maxInput = document.getElementById('numgen-max');
          if (minInput) minInput.value = min;
          if (maxInput) maxInput.value = max;
          const genBtn = document.getElementById('numgen-generate-btn');
          if (genBtn) genBtn.click();
        });
      });
    }

    // ============ 牌阵筛选功能 ============
    initSpreadFilter() {
      const filterBtns = document.querySelectorAll('.spread-filter-btn');
      const spreadBtns = document.querySelectorAll('[data-spread]');
      const categoryTitles = document.querySelectorAll('.spread-category-title');

      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const filter = btn.dataset.filter;

          // 更新按钮状态
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          if (filter === 'favorites') {
            this.applySpreadFilter('favorites');
            return;
          }

          // 筛选牌阵按钮
          spreadBtns.forEach(spreadBtn => {
            const spreadKey = spreadBtn.dataset.spread;
            const spread = SPREADS[spreadKey];
            if (!spread) return;

            let show = false;
            if (filter === 'all') {
              show = true;
            } else {
              show = spread.category === filter;
            }

            spreadBtn.style.display = show ? '' : 'none';
          });

          // 控制分类标题显示
          categoryTitles.forEach(title => {
            let showTitle = false;
            let nextEl = title.nextElementSibling;
            while (nextEl && !nextEl.classList.contains('spread-category-title')) {
              if ((nextEl.classList.contains('spread-btn') || nextEl.classList.contains('spread-card')) && nextEl.style.display !== 'none') {
                showTitle = true;
                break;
              }
              nextEl = nextEl.nextElementSibling;
            }
            title.style.display = showTitle ? '' : 'none';
          });
        });
      });
    }

    // ============ 牌阵详情弹窗 ============
    showSpreadDetail(spreadKey) {
      const spread = SPREADS[spreadKey];
      if (!spread) return;

      const modal = document.getElementById('spread-detail-modal');
      const body = document.getElementById('spread-detail-body');
      if (!modal || !body) return;

      const diffStars = { easy: '★☆☆', medium: '★★☆', hard: '★★★' };
      const diffColors = { easy: '#4CAF50', medium: '#FF9800', hard: '#F44336' };
      const diffLabel = diffStars[spread.difficulty] || '★☆☆';
      const diffColor = diffColors[spread.difficulty] || '#999';

      const categoryKeyMap = {
        simple: 'cat_simple', relationship: 'cat_relationship', decision: 'cat_decision',
        advanced: 'cat_advanced', career: 'cat_career',
        self: 'cat_self', fortune: 'cat_fortune',
        spiritual: 'cat_spiritual', life: 'cat_life'
      };
      const catKey = categoryKeyMap[spread.category] || spread.category;
      const catLabel = this.t(catKey) || spread.category;

      const localizedPositions = this.getLocalizedPositions(spreadKey);
      const dict = I18N[this.currentLang] || I18N.zh;
      let html = '';
      html += '<div class="spread-detail-header">';
      html += '  <div class="spread-detail-title">' + this.getLocalizedSpreadName(spreadKey) + '</div>';
      html += '  <div class="spread-detail-tags">';
      html += '    <span class="spread-detail-tag" style="color:' + diffColor + ';border-color:' + diffColor + '">' + diffLabel + '</span>';
      html += '    <span class="spread-detail-tag">' + catLabel + '</span>';
      html += '    <span class="spread-detail-tag">' + spread.positions.length + ' ' + (dict['cards_count_label'] || '张牌') + '</span>';
      html += '  </div>';
      html += '</div>';

      // 视觉示意图
      html += this.getSpreadDiagramHtml(spreadKey);

      const usageText = this.currentLang === 'en'
        ? (spread.usageEn || spread.usage || '')
        : (spread.usage || '');
      html += '<div class="spread-detail-usage">';
      html += '  <div class="spread-detail-section-title">' + (this.currentLang === 'en' ? 'When to Use' : '适用场景') + '</div>';
      html += '  <div class="spread-detail-text">' + usageText + '</div>';
      html += '</div>';

      html += '<div class="spread-detail-positions">';
      html += '  <div class="spread-detail-section-title">' + (this.currentLang === 'en' ? 'Positions' : '牌位含义') + '</div>';
      for (let i = 0; i < localizedPositions.length; i++) {
        const posMeaning = this.currentLang === 'en'
          ? (spread.positionMeaningsEn ? (spread.positionMeaningsEn[i] || spread.positionMeanings[i] || '') : (spread.positionMeanings[i] || ''))
          : (spread.positionMeanings[i] || '');
        html += '<div class="spread-detail-position">';
        html += '  <div class="spread-detail-pos-name">' + (i + 1) + '. ' + localizedPositions[i] + '</div>';
        html += '  <div class="spread-detail-pos-desc">' + posMeaning + '</div>';
        html += '</div>';
      }
      html += '</div>';

      body.innerHTML = html;
      modal.classList.remove('hidden');

      // 点击遮罩关闭
      modal.onclick = (e) => {
        if (e.target === modal) modal.classList.add('hidden');
      };
    }



    // ============ 牌阵智能推荐 ============
    getRecommendedSpreads(question) {
      if (!question) return [];
      const q = question.toLowerCase();
      const keywords = {
        'single': ['每日', '今天', '指引', '快速', '简单', 'daily', 'today', 'guide', 'quick', 'simple'],
        'three': ['过去', '现在', '未来', '时间', 'past', 'present', 'future', 'timeline'],
        'celtic': ['深入', '全面', '复杂', '重要', 'deep', 'comprehensive', 'complex', 'important'],
        'relation': ['感情', '关系', '对方', '恋爱', '婚姻', 'love', 'relationship', 'partner', 'marriage'],
        'love': ['恋爱', '喜欢', '约会', '感情状况', 'dating', 'crush', 'love status'],
        'broken': ['分手', '复合', '分开', '断联', 'breakup', 'reunion', 'no contact'],
        'choice': ['选择', '二选一', '决定', '犹豫', 'choose', 'decision', 'hesitate', 'option'],
        'yesno': ['是否', '能不能', '可不可以', 'yes', 'no', 'can', 'should'],
        'five': ['深入', '分析', '问题', '核心', 'analyze', 'problem', 'core', 'deep'],
        'career': ['工作', '事业', '职场', '薪水或', 'job', 'career', 'work', 'office', 'promotion'],
        'jobchange': ['跳槽', '换工作', '转行', '离职', 'job change', 'resign', 'switch career'],
        'horseshoe': ['全面', '生活', '各方面', 'comprehensive', 'life', 'aspects'],
        'timeflow': ['时间', '发展', '趋势', 'time', 'development', 'trend'],
        'action': ['行动', '怎么做', '建议', 'action', 'how', 'advice', 'what to do'],
        'mind': ['内心', '想法', '自我', '成长', 'inner', 'self', 'growth', 'mind'],
        'shadow': ['阴影', '恐惧', '潜意识', 'shadow', 'fear', 'subconscious'],
        'year': ['年运', '今年', '明年', '年度', 'year', 'annual', 'yearly']
      };

      const scores = {};
      for (const [spreadKey, kws] of Object.entries(keywords)) {
        scores[spreadKey] = 0;
        for (const kw of kws) {
          if (q.includes(kw)) {
            scores[spreadKey] += 1;
          }
        }
      }

      // 按分数排序，返回前3个
      const recommended = Object.entries(scores)
        .filter(([_, score]) => score > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([key]) => key);

      // 如果没有匹配，返回推荐牌阵
      if (recommended.length === 0) {
        return ['single', 'three', 'action'];
      }
      return recommended;
    }

    // 显示推荐牌阵
    showRecommendedSpreads(question) {
      const recommended = this.getRecommendedSpreads(question);
      if (recommended.length === 0) return;

      const container = document.getElementById('recommended-spreads');
      if (!container) return;

      container.innerHTML = '';
      container.classList.remove('hidden');

      const title = document.createElement('div');
      title.className = 'recommended-title';
      title.textContent = this.currentLang === 'en' ? 'Recommended Spreads:' : '推荐牌阵：';
      container.appendChild(title);

      recommended.forEach(key => {
        const spread = SPREADS[key];
        if (!spread) return;

        const btn = document.createElement('button');
        btn.className = 'recommended-spread-btn';
        btn.dataset.spread = key;
        btn.innerHTML = '<span class="recommended-spread-name">' + (this.currentLang === 'en' ? spread.nameEn : spread.name) + '</span>' +
          '<span class="recommended-spread-desc">' + spread.positions.length + ' ' + (this.currentLang === 'en' ? 'cards' : '张牌') + '</span>';
        btn.addEventListener('click', (e) => {
          const spreadKey = e.currentTarget.dataset.spread;
          if (spreadKey) {
            // 触发对应的牌阵按钮点击
            const spreadBtn = document.querySelector('[data-spread="' + spreadKey + '"]');
            if (spreadBtn) spreadBtn.click();
          }
        });
        container.appendChild(btn);
      });
    }
    // ============ 牌阵视觉示意图 ============
    getSpreadDiagramHtml(spreadKey) {
      const spread = SPREADS[spreadKey];
      if (!spread) return '';

      const positions = spread.positions;
      let html = '<div class="spread-detail-diagram">';
      html += '<div class="spread-detail-diagram-title">' + (this.currentLang === 'en' ? 'Layout Diagram' : '牌阵布局示意图') + '</div>';
      html += '<div class="spread-diagram-layout">';

      switch (spreadKey) {
        case 'single':
          // 单张牌：居中
          html += this.diagramCard(1, positions[0]);
          break;

        case 'three':
          // 三牌阵：横向一排
          for (let i = 0; i < positions.length; i++) {
            html += this.diagramCard(i + 1, positions[i]);
          }
          break;

        case 'celtic':
          // 凯尔特十字：十字形 + 右侧一列
          html += '<div style="display:flex;flex-direction:column;align-items:center;gap:2px;margin:0 4px;">';
          html += this.diagramCard(2, positions[1], '28px');
          html += this.diagramCard(1, positions[0], '28px');
          html += this.diagramCard(3, positions[2], '28px');
          html += '</div>';
          html += '<div style="display:flex;flex-direction:column;gap:2px;">';
          for (let i = 3; i < positions.length; i++) {
            html += this.diagramCard(i + 1, positions[i], '28px');
          }
          html += '</div>';
          break;

        case 'relation':
          // 关系牌阵：2×3
          html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">';
          for (let i = 0; i < positions.length; i++) {
            html += this.diagramCard(i + 1, positions[i], '26px');
          }
          html += '</div>';
          break;

        case 'choice':
          // 二选一：A/B 并排 + 下方综合
          html += '<div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;">';
          html += '<div style="display:flex;flex-direction:column;gap:2px;">';
          html += this.diagramCard(1, '选项A', '26px');
          html += this.diagramCard(3, 'A结果', '26px');
          html += '</div>';
          html += '<div style="display:flex;flex-direction:column;gap:2px;">';
          html += this.diagramCard(2, '选项B', '26px');
          html += this.diagramCard(4, 'B结果', '26px');
          html += '</div>';
          html += '</div>';
          html += '<div style="display:flex;justify-content:center;margin-top:4px;">';
          html += this.diagramCard(5, positions[4], '26px');
          html += '</div>';
          break;

        // 新增：决策树牌阵图示
        case 'decisiontree':
          // 布局：上方当前决策，中间A/B选择对比，下方建议
          html += '<div style="display:flex;flex-direction:column;align-items:center;gap:6px;">';
          // 第一行：当前决策
          html += this.diagramCard(1, positions[0], '28px');
          // 第二行：A/B 选择对比
          html += '<div style="display:flex;gap:10px;justify-content:center;">';
          html += '<div style="display:flex;flex-direction:column;gap:2px;">';
          html += this.diagramCard(2, 'A短期', '24px');
          html += this.diagramCard(3, 'A长期', '24px');
          html += '</div>';
          html += '<div style="display:flex;flex-direction:column;gap:2px;">';
          html += this.diagramCard(4, 'B短期', '24px');
          html += this.diagramCard(5, 'B长期', '24px');
          html += '</div>';
          html += '</div>';
          // 第三行：建议
          html += '<div style="display:flex;justify-content:center;margin-top:4px;">';
          html += this.diagramCard(6, positions[5], '28px');
          html += '</div>';
          html += '</div>';
          break;

        case 'five':
          // 五张牌阵：十字
          html += '<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">';
          html += this.diagramCard(3, positions[2], '28px');
          html += this.diagramCard(1, positions[0], '28px');
          html += this.diagramCard(2, positions[1], '28px');
          html += this.diagramCard(4, positions[3], '28px');
          html += '</div>';
          html += '<div style="display:flex;justify-content:center;margin-top:2px;">';
          html += this.diagramCard(5, positions[4], '28px');
          html += '</div>';
          break;

        case 'horseshoe':
          // 马蹄铁：U形
          html += '<div style="display:flex;gap:3px;flex-wrap:wrap;justify-content:center;">';
          for (let i = 0; i < positions.length; i++) {
            html += this.diagramCard(i + 1, positions[i], i >= 4 ? '26px' : '28px');
          }
          html += '</div>';
          break;

        case 'career':
          // 事业牌阵：纵向
          html += '<div style="display:flex;flex-direction:column;gap:3px;align-items:center;">';
          for (let i = 0; i < positions.length; i++) {
            html += this.diagramCard(i + 1, positions[i], '28px');
          }
          html += '</div>';
          break;

        case 'timeflow':
          // 时间之流：从左到右时间轴
          html += '<div style="display:flex;gap:4px;align-items:flex-end;justify-content:center;flex-wrap:wrap;">';
          for (let i = 0; i < positions.length; i++) {
            html += this.diagramCard(i + 1, positions[i], i >= 3 ? '26px' : '30px');
          }
          html += '</div>';
          break;

        case 'action':
          // 问题行动结果：横向一排
          html += '<div style="display:flex;gap:6px;justify-content:center;">';
          for (let i = 0; i < positions.length; i++) {
            html += this.diagramCard(i + 1, positions[i]);
          }
          html += '</div>';
          break;

        case 'mind':
          // 心灵牌阵：十字形
          html += '<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">';
          html += this.diagramCard(2, positions[1], '26px');
          html += '<div style="display:flex;gap:4px;align-items:center;">';
          html += this.diagramCard(1, positions[0], '30px');
          html += this.diagramCard(5, positions[4], '30px');
          html += '</div>';
          html += this.diagramCard(3, positions[2], '26px');
          html += this.diagramCard(4, positions[3], '26px');
          html += '</div>';
          break;

        case 'love':
          // 恋人牌阵：2×3 + 下方建议
          html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:4px;">';
          html += this.diagramCard(1, positions[0], '26px');
          html += this.diagramCard(2, positions[1], '26px');
          html += this.diagramCard(3, positions[2], '26px');
          html += this.diagramCard(4, positions[3], '26px');
          html += '</div>';
          html += '<div style="display:flex;gap:4px;justify-content:center;">';
          html += this.diagramCard(5, positions[4], '26px');
          html += this.diagramCard(6, positions[5], '26px');
          html += '</div>';
          html += '<div style="display:flex;justify-content:center;margin-top:4px;">';
          html += this.diagramCard(7, positions[6], '26px');
          html += '</div>';
          break;

        case 'broken':
          // 复合牌阵：纵向
          html += '<div style="display:flex;flex-direction:column;gap:3px;align-items:center;">';
          for (let i = 0; i < positions.length; i++) {
            html += this.diagramCard(i + 1, positions[i], '28px');
          }
          html += '</div>';
          break;

        case 'yesno':
          // 是否牌阵：横向一排
          html += '<div style="display:flex;gap:6px;justify-content:center;">';
          for (let i = 0; i < positions.length; i++) {
            html += this.diagramCard(i + 1, positions[i]);
          }
          html += '</div>';
          break;

        case 'jobchange':
          // 换工作牌阵：纵向
          html += '<div style="display:flex;flex-direction:column;gap:3px;align-items:center;">';
          for (let i = 0; i < positions.length; i++) {
            html += this.diagramCard(i + 1, positions[i], '28px');
          }
          html += '</div>';
          break;

        case 'shadow':
          // 阴影牌阵：十字形
          html += '<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">';
          html += this.diagramCard(2, positions[1], '26px');
          html += '<div style="display:flex;gap:4px;align-items:center;">';
          html += this.diagramCard(1, positions[0], '30px');
          html += this.diagramCard(5, positions[4], '30px');
          html += '</div>';
          html += this.diagramCard(3, positions[2], '26px');
          html += this.diagramCard(4, positions[3], '26px');
          html += '</div>';
          break;

        case 'fatewheel':
          // 命运之轮：圆形布局
          html += '<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">';
          html += this.diagramCard(1, positions[0], '28px');
          html += '<div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;">';
          html += this.diagramCard(2, positions[1], '26px');
          html += this.diagramCard(5, positions[4], '26px');
          html += '</div>';
          html += '<div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;">';
          html += this.diagramCard(3, positions[2], '26px');
          html += this.diagramCard(4, positions[3], '26px');
          html += '</div>';
          html += '</div>';
          break;

        case 'year':
          // 年运牌阵：纵向一列
          html += '<div style="display:flex;flex-direction:column;gap:3px;align-items:center;">';
          for (let i = 0; i < positions.length; i++) {
            html += this.diagramCard(i + 1, positions[i], i === 6 ? '32px' : '26px');
          }
          html += '</div>';
          break;

        case 'monthly':
          // 月运牌阵：横向一排
          html += '<div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;">';
          for (let i = 0; i < positions.length; i++) {
            html += this.diagramCard(i + 1, positions[i], '26px');
          }
          html += '</div>';
          break;

        case 'souljourney':
          // 灵魂旅程：3×3 网格
          html += '<div style="display:grid;grid-template-columns:repeat(3,auto);gap:3px;justify-content:center;">';
          for (let i = 0; i < positions.length; i++) {
            html += this.diagramCard(i + 1, positions[i], '24px');
          }
          html += '</div>';
          break;

        default:
          for (let i = 0; i < positions.length; i++) {
            html += this.diagramCard(i + 1, positions[i]);
          }
      }

      html += '</div></div>';
      return html;
    }

    diagramCard(num, label, height) {
      const h = height || '44px';
      const fontSize = height ? '8px' : '9px';
      const labelSize = height ? '7px' : '8px';
      const shortLabel = label.length > 5 ? label.substring(0, 5) + '…' : label;
      return '<div class="spread-diagram-card" style="height:' + h + ';font-size:' + fontSize + ';">' +
               num +
               '<span class="spread-diagram-card-label" style="font-size:' + labelSize + ';">' + shortLabel + '</span>' +
             '</div>';
    }

    // ============ 扩展功能1：用户历史记录分析 ============
    async analyzeUserHistory() {
      return new Promise((resolve) => {
        chrome.storage.local.get({ history: [] }, (result) => {
          const history = result.history || [];
          if (history.length < 3) {
            resolve(null); // 历史记录不足
            return;
          }

          try {
            const analysis = {
              totalReadings: history.length,
              frequentCards: this.getFrequentCards(history),
              suitDistribution: this.getSuitDistribution(history),
              reversalsTrend: this.getReversalsTrend(history),
              spreadPreferences: this.getSpreadPreferences(history),
              timePattern: this.getTimePattern(history)
            };
            resolve(analysis);
          } catch (e) {
            console.error('分析历史记录出错:', e);
            resolve(null);
          }
        });
      });
    }

    getFrequentCards(history) {
      const cardCount = {};
      history.forEach(record => {
        record.cards.forEach(cardInfo => {
          const key = cardInfo.cardId;
          cardCount[key] = (cardCount[key] || 0) + 1;
        });
      });

      // 返回出现最多的5张牌
      return Object.entries(cardCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([cardId, count]) => ({
          cardId,
          count,
          percentage: ((count / (history.length * this.getAverageCards(history))) * 100).toFixed(1)
        }));
    }

    getAverageCards(history) {
      const total = history.reduce((sum, record) => sum + record.cards.length, 0);
      return total / history.length;
    }

    getSuitDistribution(history) {
      const suits = { major: 0, wands: 0, cups: 0, swords: 0, pentacles: 0 };
      let total = 0;

      history.forEach(record => {
        record.cards.forEach(cardInfo => {
          const card = this.findCardById(cardInfo.cardId);
          if (card) {
            suits[card.suit] = (suits[card.suit] || 0) + 1;
            total++;
          }
        });
      });

      // 转换为百分比
      const distribution = {};
      for (const suit in suits) {
        distribution[suit] = total > 0 ? ((suits[suit] / total) * 100).toFixed(1) : 0;
      }
      return distribution;
    }

    findCardById(cardId) {
      const deckData = this.getDeckData();
      return deckData ? deckData.find(c => c.id === cardId) : null;
    }

    getReversalsTrend(history) {
      const recent = history.slice(0, 10); // 最近10次
      let reversalCount = 0;
      let total = 0;

      recent.forEach(record => {
        record.cards.forEach(cardInfo => {
          if (cardInfo.isReversed) reversalCount++;
          total++;
        });
      });

      return {
        recentReversalRate: total > 0 ? ((reversalCount / total) * 100).toFixed(1) : 0,
        trend: reversalCount > total / 2 ? 'high_reversal' : 'balanced'
      };
    }

    getSpreadPreferences(history) {
      const spreadCount = {};
      history.forEach(record => {
        spreadCount[record.mode] = (spreadCount[record.mode] || 0) + 1;
      });

      return Object.entries(spreadCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([mode, count]) => ({
          mode,
          count,
          percentage: ((count / history.length) * 100).toFixed(1)
        }));
    }

    getTimePattern(history) {
      const isEn = this.currentLang === 'en';
      const hourCount = {};
      history.forEach(record => {
        const hour = new Date(record.timestamp).getHours();
        const timeSlot = hour < 6 ? (isEn ? 'Early Morning' : '凌晨') : hour < 12 ? (isEn ? 'Morning' : '上午') : hour < 18 ? (isEn ? 'Afternoon' : '下午') : (isEn ? 'Evening' : '晚上');
        hourCount[timeSlot] = (hourCount[timeSlot] || 0) + 1;
      });

      return hourCount;
    }

    // ============ 扩展功能2：时间维度解读 ============
    getTimeBasedInterpretation() {
      const now = new Date();
      const hour = now.getHours();
      const dayOfWeek = now.getDay();
      const date = now.getDate();

      let timeFactors = {
        timeOfDay: this.getTimeOfDayEnergy(hour),
        dayEnergy: this.getDayEnergy(dayOfWeek),
        dateEnergy: this.getDateEnergy(date),
        lunarPhase: this.getLunarPhase(now) // 简化版月相
      };

      return timeFactors;
    }

    getTimeOfDayEnergy(hour) {
      const isEn = this.currentLang === 'en';
      if (hour >= 5 && hour < 9) {
        return { phase: 'morning', energy: 'fire', description: isEn ? 'Morning fire energy is strong, suitable for new beginnings and proactive action' : '晨间火能量旺盛，适合新开始和主动行动' };
      } else if (hour >= 9 && hour < 13) {
        return { phase: 'noon', energy: 'earth', description: isEn ? 'Noon earth energy is stable, suitable for practical decisions and execution' : '午间土能量稳定，适合务实决策和执行' };
      } else if (hour >= 13 && hour < 17) {
        return { phase: 'afternoon', energy: 'air', description: isEn ? 'Afternoon air energy is active, suitable for communication and thinking' : '下午风能量活跃，适合沟通和思考' };
      } else if (hour >= 17 && hour < 21) {
        return { phase: 'evening', energy: 'water', description: isEn ? 'Evening water energy flows, suitable for emotions and intuition' : '晚间水能量流动，适合情感和直觉' };
      } else {
        return { phase: 'night', energy: 'spirit', description: isEn ? 'Night spiritual energy is strong, suitable for introspection and spiritual exploration' : '夜间精神能量强，适合内省和灵性探索' };
      }
    }

    getDayEnergy(dayOfWeek) {
      const isEn = this.currentLang === 'en';
      const dayEnergies = {
        0: { planet: isEn ? 'Sun' : '太阳', energy: isEn ? 'Leadership, Creativity' : '领导、创造', suit: 'wands' },
        1: { planet: isEn ? 'Moon' : '月亮', energy: isEn ? 'Emotion, Intuition' : '情感、直觉', suit: 'cups' },
        2: { planet: isEn ? 'Mars' : '火星', energy: isEn ? 'Action, Conflict' : '行动、冲突', suit: 'wands' },
        3: { planet: isEn ? 'Mercury' : '水星', energy: isEn ? 'Communication, Wisdom' : '沟通、智慧', suit: 'swords' },
        4: { planet: isEn ? 'Jupiter' : '木星', energy: isEn ? 'Expansion, Luck' : '扩张、幸运', suit: 'pentacles' },
        5: { planet: isEn ? 'Venus' : '金星', energy: isEn ? 'Love, Harmony' : '爱情、和谐', suit: 'cups' },
        6: { planet: isEn ? 'Saturn' : '土星', energy: isEn ? 'Restriction, Responsibility' : '限制、责任', suit: 'pentacles' }
      };
      return dayEnergies[dayOfWeek] || dayEnergies[0];
    }

    getDateEnergy(date) {
      // 简化：日期数字的根数对应塔罗牌
      const root = this.getDigitalRoot(date);
      const majorArcana = this.getMajorArcanaInfo();
      return {
        dateNumber: date,
        digitalRoot: root,
        correspondingCard: majorArcana[root] || majorArcana[0]
      };
    }

    getLunarPhase(date) {
      // 简化月相计算（实际应使用精确算法）
      const isEn = this.currentLang === 'en';
      const lunarCycle = 29.53;
      const knownNewMoon = new Date('2024-01-11'); // 已知新月
      const daysSince = (date - knownNewMoon) / (1000 * 60 * 60 * 24);
      const phase = (daysSince % lunarCycle) / lunarCycle;

      if (phase < 0.125) return { phase: isEn ? 'New Moon' : '新月', energy: isEn ? 'Beginnings, Intention Setting' : '开始、意图设定' };
      if (phase < 0.25) return { phase: isEn ? 'First Quarter' : '上弦月', energy: isEn ? 'Action, Growth' : '行动、成长' };
      if (phase < 0.375) return { phase: isEn ? 'Waxing Gibbous' : '盈凸月', energy: isEn ? 'Adjustment, Optimization' : '调整、优化' };
      if (phase < 0.5) return { phase: isEn ? 'Full Moon' : '满月', energy: isEn ? 'Completion, Release' : '完成、释放' };
      if (phase < 0.625) return { phase: isEn ? 'Waning Gibbous' : '亏凸月', energy: isEn ? 'Gratitude, Sharing' : '感恩、分享' };
      if (phase < 0.75) return { phase: isEn ? 'Last Quarter' : '下弦月', energy: isEn ? 'Release, Letting Go' : '释放、放下' };
      if (phase < 0.875) return { phase: isEn ? 'Waning Crescent' : '残月', energy: isEn ? 'Rest, Introspection' : '休息、内省' };
      return { phase: isEn ? 'New Moon' : '新月', energy: isEn ? 'Beginnings, Intention Setting' : '开始、意图设定' };
    }

    // ============ 扩展功能3：问卜者性格分析 ============
    async analyzeUserPersonality() {
      const historyAnalysis = await this.analyzeUserHistory();
      if (!historyAnalysis) return null;

      const personality = {
        preferredElement: this.inferPreferredElement(historyAnalysis.suitDistribution),
        decisionStyle: this.inferDecisionStyle(historyAnalysis),
        spiritualGrowthStage: this.inferGrowthStage(historyAnalysis.frequentCards),
        advice: this.generatePersonalityAdvice(historyAnalysis)
      };

      return personality;
    }

    inferPreferredElement(suitDistribution) {
      const isEn = this.currentLang === 'en';
      const suits = suitDistribution;
      let maxSuit = 'wands';
      let maxValue = 0;

      for (const suit in suits) {
        if (parseFloat(suits[suit]) > maxValue) {
          maxValue = parseFloat(suits[suit]);
          maxSuit = suit;
        }
      }

      const elementMap = {
        'wands': { element: isEn ? 'Fire' : '火', trait: isEn ? 'Passionate, Proactive, Creative' : '热情、主动、创造力强', suit: isEn ? 'Wands' : '权杖' },
        'cups': { element: isEn ? 'Water' : '水', trait: isEn ? 'Emotionally Rich, Intuitive' : '情感丰富、直觉敏锐', suit: isEn ? 'Cups' : '圣杯' },
        'swords': { element: isEn ? 'Air' : '风', trait: isEn ? 'Rational, Analytical, Truth-Seeking' : '理性、善于分析、追求真理', suit: isEn ? 'Swords' : '宝剑' },
        'pentacles': { element: isEn ? 'Earth' : '土', trait: isEn ? 'Practical, Stable, Material-Oriented' : '务实、稳定、重视物质', suit: isEn ? 'Pentacles' : '星币' },
        'major': { element: isEn ? 'Spirit' : '灵性', trait: isEn ? 'Values Spiritual Growth and Life Lessons' : '重视精神成长和人生课题', suit: isEn ? 'Major Arcana' : '大阿卡纳' },
        'fire': { element: isEn ? 'Fire' : '火', trait: isEn ? 'Passionate, Proactive, Energetic' : '热情、主动、充满活力', suit: isEn ? 'Fire' : '火' },
        'water': { element: isEn ? 'Water' : '水', trait: isEn ? 'Emotionally Rich, Intuitive, Flowing' : '情感丰富、直觉敏锐、善于流动', suit: isEn ? 'Water' : '水' },
        'clouds': { element: isEn ? 'Air' : '风', trait: isEn ? 'Active Mind, Observant, Clarity-Seeking' : '思维活跃、善于观察、追求清晰', suit: isEn ? 'Clouds' : '云' },
        'rainbow': { element: isEn ? 'Earth' : '土', trait: isEn ? 'Practical, Inclusive, Holistic' : '务实、包容、重视整体', suit: isEn ? 'Rainbow' : '彩虹' }
      };

      return elementMap[maxSuit] || elementMap['wands'];
    }

    inferDecisionStyle(historyAnalysis) {
      const isEn = this.currentLang === 'en';
      const { reversalsTrend, spreadPreferences } = historyAnalysis;

      if (reversalsTrend.trend === 'high_reversal') {
        return {
          style: isEn ? 'Cautious' : '谨慎型',
          description: isEn ? 'You tend to see the other side of things, are cautious when making decisions, and easily hesitate.' : '你倾向于看到事物的另一面，做决定时较为谨慎，容易犹豫。',
          advice: isEn ? 'Try to trust your first instinct; sometimes over-analysis can cause you to miss good opportunities.' : '尝试相信第一直觉，有时过度分析反而会错失良机。'
        };
      }

      const prefersSimple = spreadPreferences.some(p => p.mode === 'single' || p.mode === 'three');
      if (prefersSimple) {
        return {
          style: isEn ? 'Intuitive' : '直觉型',
          description: isEn ? 'You prefer simple and direct answers, trust your intuition, and dislike complex analysis.' : '你喜欢简单直接的解答，相信直觉，不喜欢复杂分析。',
          advice: isEn ? 'Occasionally try complex spreads; you may discover important information that was overlooked.' : '偶尔尝试复杂牌阵，可能会发现被忽略的重要信息。'
        };
      }

      return {
        style: isEn ? 'Analytical' : '分析型',
        description: isEn ? 'You like to deeply understand problems and are willing to spend time analyzing various possibilities.' : '你喜欢深入了解问题，愿意花时间分析各种可能性。',
        advice: isEn ? 'Your analytical skills are strong, but be careful not to fall into overthinking; timely action is more important.' : '你的分析能力很强，但要注意不要陷入过度思考，适时行动更重要。'
      };
    }

    inferGrowthStage(frequentCards) {
      // 根据频繁出现的牌推断成长阶段
      const isEn = this.currentLang === 'en';
      const majorCards = frequentCards.filter(f => f.cardId.startsWith('major-'));

      if (majorCards.some(c => c.cardId === 'major-00' || c.cardId === 'major-01')) {
        return isEn ? 'Beginner Stage: You are in a period of exploration and self-discovery' : '新手阶段：你正处于探索和自我发现的时期';
      }
      if (majorCards.some(c => c.cardId === 'major-07' || c.cardId === 'major-08')) {
        return isEn ? 'Strength Building: You are learning how to use inner strength to face challenges' : '力量培养期：你在学习如何运用内在力量面对挑战';
      }
      if (majorCards.some(c => c.cardId === 'major-13' || c.cardId === 'major-16')) {
        return isEn ? 'Transformation Period: You are experiencing or have just experienced a major life change' : '转化期：你正在经历或刚刚经历重大人生转变';
      }
      if (majorCards.some(c => c.cardId === 'major-19' || c.cardId === 'major-21')) {
        return isEn ? 'Integration Phase: You are integrating life experiences, moving toward wholeness and self-realization' : '整合期：你正在整合人生经验，走向完整和自我实现';
      }

      return isEn ? 'Exploration Phase: You are continuously exploring life direction and self-awareness' : '探索期：你正在不断探索人生方向和自我认知';
    }

    generatePersonalityAdvice(historyAnalysis) {
      const isEn = this.currentLang === 'en';
      const { frequentCards, suitDistribution } = historyAnalysis;
      let advice = '';

      // 根据元素分布给建议
      const fire = parseFloat(suitDistribution.wands || 0);
      const water = parseFloat(suitDistribution.cups || 0);
      const air = parseFloat(suitDistribution.swords || 0);
      const earth = parseFloat(suitDistribution.pentacles || 0);

      if (fire > 30) {
        advice += isEn ? 'Your life is full of passion and action, but be careful to avoid impulsiveness and overexertion.' : '你的人生充满热情和行动力，但要注意避免冲动和过度消耗。';
      }
      if (water > 30) {
        advice += isEn ? 'You are emotionally rich and intuitively sharp; remember to also take care of your rational side.' : '你的情感丰富且直觉敏锐，记得也要照顾自己的理性面。';
      }
      if (air > 30) {
        advice += isEn ? 'You are good at thinking and analyzing, but sometimes need to let go of your mind and listen more to your inner voice.' : '你善于思考和分析，但有时需要放下头脑，多倾听内心声音。';
      }
      if (earth > 30) {
        advice += isEn ? 'You are practical and reliable, but occasionally allow yourself to relax and enjoy uncertainty.' : '你务实可靠，但偶尔也要允许自己放松和享受不确定性。';
      }

      return advice || (isEn ? 'Maintain balance and continue exploring the path of self-growth.' : '保持平衡，继续探索自我成长之路。');
    }

    // ============ 生成扩展解读内容 ============
    async generateExtendedReading() {
      let html = '';

      // 1. 历史记录分析
      const historyAnalysis = await this.analyzeUserHistory();
      if (historyAnalysis) {
        html += '<div class="reading-section">';
        html += '<div class="reading-section-title">' + (this.currentLang === 'en' ? '📊 Your Reading Patterns' : '📊 你的占卜模式') + '</div>';
        html += '<div class="reading-section-body">';

        // 频繁出现的牌
        if (historyAnalysis.frequentCards.length > 0) {
          html += '<div style="margin-bottom:10px;"><strong>' + (this.currentLang === 'en' ? 'Frequently Appearing Cards:' : '频繁出现的牌：') + '</strong><br/>';
          historyAnalysis.frequentCards.forEach(f => {
            const card = this.findCardById(f.cardId);
            if (card) {
              const cardName = this.currentLang === 'en' ? card.originalName : card.name;
              html += this.currentLang === 'en' ? `• ${cardName} (appeared ${f.count} times, ${f.percentage}%)<br/>` : `• ${cardName} (出现${f.count}次，占比${f.percentage}%)<br/>`;
            }
          });
          html += '</div>';
        }

        // 元素分布
        html += '<div style="margin-bottom:10px;"><strong>' + (this.currentLang === 'en' ? 'Element Distribution:' : '元素分布：') + '</strong><br/>';
        const suitNames = this.currentLang === 'en'
          ? { major: 'Major Arcana', wands: 'Wands', cups: 'Cups', swords: 'Swords', pentacles: 'Pentacles' }
          : { major: '大阿卡纳', wands: '权杖', cups: '圣杯', swords: '宝剑', pentacles: '星币' };
        for (const [suit, percentage] of Object.entries(historyAnalysis.suitDistribution)) {
          html += `• ${suitNames[suit] || suit}: ${percentage}%<br/>`;
        }
        html += '</div>';

        // 逆位趋势
        html += '<div style="margin-bottom:10px;"><strong>' + (this.currentLang === 'en' ? 'Recent Trend:' : '近期趋势：') + '</strong> ';
        html += this.currentLang === 'en' 
          ? `Reversal rate: ${historyAnalysis.reversalsTrend.recentReversalRate}% (${historyAnalysis.reversalsTrend.trend === 'high_reversal' ? 'High challenges period' : 'Balanced'})`
          : `逆位率：${historyAnalysis.reversalsTrend.recentReversalRate}%（${historyAnalysis.reversalsTrend.trend === 'high_reversal' ? '挑战较多时期' : '相对平衡'}）`;
        html += '</div>';

        html += '</div></div>';
      }

      // 2. 时间维度解读
      const timeFactors = this.getTimeBasedInterpretation();
      html += '<div class="reading-section">';
      html += '<div class="reading-section-title">' + (this.currentLang === 'en' ? '⏰ Time Dimension' : '⏰ 时间维度') + '</div>';
      html += '<div class="reading-section-body">';

      html += '<div style="margin-bottom:10px;"><strong>' + (this.currentLang === 'en' ? 'Current Time Energy:' : '当前时间能量：') + '</strong><br/>';
      html += `• ${this.currentLang === 'en' ? 'Time of Day' : '时辰'}：${timeFactors.timeOfDay.description}<br/>`;
      html += `• ${this.currentLang === 'en' ? 'Day Energy' : '星期能量'}：${timeFactors.dayEnergy.planet} - ${timeFactors.dayEnergy.energy}<br/>`;
      html += `• ${this.currentLang === 'en' ? 'Date Energy' : '日期能量'}：${this.currentLang === 'en' ? 'Card' : '对应牌'} #${timeFactors.dateEnergy.digitalRoot} ${timeFactors.dateEnergy.correspondingCard.name}<br/>`;
      html += `• ${this.currentLang === 'en' ? 'Lunar Phase' : '月相'}：${timeFactors.lunarPhase.phase} - ${timeFactors.lunarPhase.energy}`;
      html += '</div>';

      html += '</div></div>';

      // 3. 性格分析
      const personality = await this.analyzeUserPersonality();
      if (personality) {
        html += '<div class="reading-section">';
        html += '<div class="reading-section-title">' + (this.currentLang === 'en' ? '🧠 Your Tarot Personality' : '🧠 你的塔罗性格') + '</div>';
        html += '<div class="reading-section-body">';

        html += '<div style="margin-bottom:10px;"><strong>' + (this.currentLang === 'en' ? 'Preferred Element:' : '偏好元素：') + '</strong> ';
        html += `${personality.preferredElement.element}（${personality.preferredElement.trait}）</div>`;

        html += '<div style="margin-bottom:10px;"><strong>' + (this.currentLang === 'en' ? 'Decision Style:' : '决策风格：') + '</strong><br/>';
        html += `• ${this.currentLang === 'en' ? 'Type' : '类型'}：${personality.decisionStyle.style}<br/>`;
        html += `• ${this.currentLang === 'en' ? 'Description' : '描述'}：${personality.decisionStyle.description}<br/>`;
        html += `• ${this.currentLang === 'en' ? 'Advice' : '建议'}：${personality.decisionStyle.advice}`;
        html += '</div>';

        html += '<div style="margin-bottom:10px;"><strong>' + (this.currentLang === 'en' ? 'Growth Stage:' : '成长阶段：') + '</strong> ';
        html += personality.spiritualGrowthStage + '</div>';

        html += '<div style="margin-bottom:10px;"><strong>' + (this.currentLang === 'en' ? 'Personalized Advice:' : '个性化建议：') + '</strong><br/>';
        html += personality.advice + '</div>';

        html += '</div></div>';
      }

      return html;
    }
  }

  // ============ 创建应用实例 ============
  let app;

  function createApp() {
    app = new TarotApp();
    window.app = app;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createApp);
  } else {
    createApp();
  }
})();
