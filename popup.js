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
        const enNames = { hp: 'Magic Theme', rider: 'Rider-Waite', marseille: 'Marseille', thoth: 'Thoth', angel: 'Angel' };
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
      const idx = FORTUNE_LEVELS.indexOf(level);
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

      // 卡片：在名称后插入星级
      document.querySelectorAll('.spread-card').forEach(btn => {
        const key = btn.dataset.spread;
        const spread = SPREADS[key];
        if (!spread) return;
        const nameEl = btn.querySelector('.spread-card-name');
        if (!nameEl) return;
        let inline = nameEl.querySelector('.difficulty-inline');
        if (!inline) {
          inline = document.createElement('span');
          inline.className = 'difficulty-inline';
          nameEl.appendChild(inline);
        }
        inline.textContent = diffStars[spread.difficulty] || '★☆☆';
      });

      // 列表项：在描述前插入星级
      document.querySelectorAll('.spread-btn, .spread-card').forEach(btn => {
        const key = btn.dataset.spread;
        const spread = SPREADS[key];
        if (!spread) return;
        const descEl = btn.querySelector('.spread-desc');
        if (!descEl) return;
        let inline = descEl.querySelector('.difficulty-inline');
        if (!inline) {
          inline = document.createElement('span');
          inline.className = 'difficulty-inline';
          descEl.insertBefore(inline, descEl.firstChild);
        }
        inline.textContent = (diffStars[spread.difficulty] || '★☆☆') + '  ';
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
    createCardEl(card, isReversed, startFlipped, cardWidth, cardHeight) {
      cardWidth = cardWidth || 80;
      cardHeight = cardHeight || 126;

      const wrap = document.createElement('div');
      wrap.className = 'card-3d-wrap';
      wrap.style.width = cardWidth + 'px';
      wrap.style.height = cardHeight + 'px';
      wrap.style.perspective = '1000px';

      const el = document.createElement('div');
      el.className = 'tarot-card' + (startFlipped ? ' flipped' : '');
      el.style.width = cardWidth + 'px';
      el.style.height = cardHeight + 'px';
      el.dataset.cardId = card.id;
      el.dataset.reversed = isReversed ? '1' : '0';

      const localizedName = deckManager.getCardName(card);
      const displayName = isReversed ? localizedName + (this.currentLang === 'en' ? ' (Reversed)' : '（逆位）') : localizedName;

      el.innerHTML =
        '<div class="card-inner">' +
          '<div class="card-back-face"></div>' +
          '<div class="card-front">' +
            '<div class="card-content">' +
              '<span class="card-symbol">&#9733;</span>' +
              '<span class="card-number">' + card.id + '</span>' +
              '<span class="card-name">' + displayName + '</span>' +
            '</div>' +
          '</div>' +
        '</div>';

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

      container.innerHTML =
        '<div class="card-meaning">' +
          '<div class="meaning-header">' + displayName + posLabel + ' - ' + posText + '</div>' +
          '<div class="meaning-text">' + meaning + '</div>' +
          '<button class="custom-meaning-btn" data-card-id="' + card.id + '" data-type="' + (isReversed ? 'reversed' : 'upright') + '">' + this.t('btn_custom_meaning') + '</button>' +
        '</div>';

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
        if (item.card.suit === 'wands') elements.wands++;
        else if (item.card.suit === 'cups') elements.cups++;
        else if (item.card.suit === 'swords') elements.swords++;
        else if (item.card.suit === 'pentacles') elements.pentacles++;
      });

      let dominantElement = 'none';
      let maxCount = 0;
      for (const el in elements) {
        if (elements[el] > maxCount) { maxCount = elements[el]; dominantElement = el; }
      }
      const elementNames = this.currentLang === 'en'
        ? { wands: 'Wands (Fire)', cups: 'Cups (Water)', swords: 'Swords (Air)', pentacles: 'Pentacles (Earth)' }
        : { wands: '权杖（火）', cups: '圣杯（水）', swords: '宝剑（风）', pentacles: '星币（土）' };

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

      if (reversedCount >= cards.length * 0.5) {
        text += this.t('theme_mostly_reversed');
      } else if (uprightCount >= cards.length * 0.7) {
        text += this.t('theme_mostly_upright');
      }

      html += text + '</div></div>';
      return html;
    }

    // ============ 综合解读 - 分析牌面关系 ============
    analyzeCardRelations(mode, cards, positions) {
      let html = '<div class="reading-section">';
      html += '<div class="reading-section-title">' + this.t('relation_title') + '</div>';
      html += '<div class="reading-section-body">';

      let text = '';

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
      } else {
        for (let i = 0; i < cards.length - 1; i++) {
          const c1 = cards[i], c2 = cards[i + 1];
          if (c1.card.suit === c2.card.suit) {
            text += this.t('relation_suite_continue', positions[i], positions[i + 1], c1.card.suit);
          }
          if (c1.isReversed && !c2.isReversed) {
            text += this.t('relation_rev_to_up', positions[i], positions[i + 1]);
          }
          if (!c1.isReversed && c2.isReversed) {
            text += this.t('relation_up_to_rev', positions[i], positions[i + 1]);
          }
        }
        if (text === '') text = this.t('relation_smooth');
      }

      html += text + '</div></div>';
      return html;
    }

    // ============ 综合解读 - 分析运势走向 ============
    analyzeTrend(cards) {
      let html = '<div class="reading-section">';
      html += '<div class="reading-section-title">' + this.t('trend_title') + '</div>';
      html += '<div class="reading-section-body">';

      let text = '';
      const firstHalf = cards.slice(0, Math.ceil(cards.length / 2));
      const secondHalf = cards.slice(Math.ceil(cards.length / 2));
      let firstRev = 0, secondRev = 0;
      firstHalf.forEach((c) => { if (c.isReversed) firstRev++; });
      secondHalf.forEach((c) => { if (c.isReversed) secondRev++; });

      if (secondRev < firstRev) {
        text = this.t('trend_good');
      } else if (secondRev > firstRev) {
        text = this.t('trend_warning');
      } else {
        text = this.t('trend_stable');
      }

      const turningCardsEn = ['Wheel of Fortune', 'Judgement', 'The Tower', 'Death'];
      const turningCardsZh = ['命运之轮', '审判', '塔', '死神'];
      cards.forEach((item) => {
        const nameToCheck = this.currentLang === 'en' ? item.card.originalName : item.card.name;
        const turningCards = this.currentLang === 'en' ? turningCardsEn : turningCardsZh;
        if (turningCards.includes(nameToCheck)) {
          text += this.t('trend_major_turn', deckManager.getCardName(item.card));
        }
      });

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
      if (mode === 'five' && cards[3]) adviceCard = cards[3];
      else if (mode === 'career' && cards[3]) adviceCard = cards[3];
      else if (mode === 'choice' && cards[4]) adviceCard = cards[4];
      else adviceCard = cards[cards.length - 1];

      if (adviceCard) {
        text += this.t('advice_intro');
        if (!adviceCard.isReversed) {
          text += this.t('advice_upright', deckManager.getCardName(adviceCard.card), this.getMeaningText(adviceCard.card, false));
          if (adviceCard.card.suit === 'wands') text += this.t('advice_wands');
          else if (adviceCard.card.suit === 'cups') text += this.t('advice_cups');
          else if (adviceCard.card.suit === 'swords') text += this.t('advice_swords');
          else if (adviceCard.card.suit === 'pentacles') text += this.t('advice_pentacles');
          else text += this.t('advice_major');
        } else {
          text += this.t('advice_reversed', deckManager.getCardName(adviceCard.card), this.getMeaningText(adviceCard.card, true));
        }
      }

      const reversedCount = cards.filter((item) => item.isReversed).length;
      if (reversedCount >= cards.length * 0.5) {
        text += this.t('advice_many_reversed');
      }

      html += '<div class="reading-advice">' + text + '</div></div></div>';
      return html;
    }

    // ============ 综合解读生成 ============
    generateComprehensiveReading() {
      if (!this.currentCards || this.currentCards.length === 0) return '';

      const cards = this.currentCards;
      const mode = this.currentMode;
      const spreadName = this.getLocalizedSpreadName(mode);
      const positions = this.getLocalizedPositions(mode);

      let html = this.analyzeTheme(cards, spreadName);
      html += this.analyzeCardRelations(mode, cards, positions);
      html += this.analyzeTrend(cards);
      html += this.generateAdvice(mode, cards);

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

      const spread = SPREADS[spreadType];
      if (!spread) return;

      positions.forEach((pos, idx) => {
        const card = document.createElement('div');
        card.className = 'result-diagram-card';
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
            cards[idx].style.transition = 'box-shadow 0.2s';
            cards[idx].style.boxShadow = '0 0 20px var(--color-gold)';
            setTimeout(() => { cards[idx].style.boxShadow = ''; }, 500);
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
            const wrap = this.createCardEl(item.card, item.isReversed, false, 80, 126);
            const innerCard = wrap.querySelector('.tarot-card');

            wrap.addEventListener('click', (e) => {
              e.stopPropagation();
              innerCard.classList.toggle('flipped');
              this.playFlipSound();
              const rev = innerCard.classList.contains('flipped') ? !item.isReversed : item.isReversed;
              this.showMeaning(item.card, rev, singlePos);
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

          for (let i = 0; i < drawn.length; i++) {
            this.currentCards.push({ card: drawn[i].card, isReversed: drawn[i].isReversed, position: positions[i] });

            let cW = cardW, cH = cardH;
            if (spreadType === 'horseshoe' && i === 3) { cW = 70; cH = Math.round(cW * 1.5); }

            const wrap = this.createCardEl(drawn[i].card, drawn[i].isReversed, true, cW, cH);
            wrap.classList.add(spreadType + '-card-wrap');

            if (spreadType === 'horseshoe' && i === 3) wrap.classList.add('horseshoe-center');

            ((c, rev, pos, idx) => {
              wrap.addEventListener('click', (e) => {
                e.stopPropagation();
                this.playFlipSound();
                this.showMeaning(c, rev, pos);
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
            compContent.innerHTML = this.generateComprehensiveReading();
            compSection.classList.remove('hidden');
            compContent.classList.remove('hidden');
            const tBtn = document.getElementById('toggle-reading-btn');
            if (tBtn) tBtn.textContent = this.t('btn_collapse');
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

        const wrap = this.createCardEl(drawn[posIdx].card, drawn[posIdx].isReversed, true, 58, 90);
        wrap.classList.add('cc-card-wrap');

        if (posIdx === 1) {
          wrap.style.transform = 'rotate(90deg)';
          wrap.style.zIndex = '2';
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'cc-pos-' + (posIdx + 1);
        wrapper.appendChild(wrap);

        ((c, rev, pos, idx) => {
          wrap.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showMeaning(c, rev, pos);
          });
        })(drawn[posIdx].card, drawn[posIdx].isReversed, positions[posIdx], posIdx);

        crossGrid.appendChild(wrapper);
      });

      crossContainer.appendChild(crossGrid);

      const staffContainer = document.createElement('div');
      staffContainer.className = 'celtic-cross-staff';

      for (let i = 5; i < 10; i++) {
        this.currentCards.push({ card: drawn[i].card, isReversed: drawn[i].isReversed, position: positions[i] });

        const wrap2 = this.createCardEl(drawn[i].card, drawn[i].isReversed, true, 58, 90);
        wrap2.classList.add('cc-card-wrap');

        const wrapper2 = document.createElement('div');
        wrapper2.className = 'cc-staff-pos';
        wrapper2.appendChild(wrap2);

        ((c, rev, pos, idx) => {
          wrap2.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showMeaning(c, rev, pos);
          });
        })(drawn[i].card, drawn[i].isReversed, positions[i], i);

        staffContainer.appendChild(wrapper2);
      }

      crossContainer.appendChild(staffContainer);

      if (resultCards) resultCards.appendChild(crossContainer);

      this.renderResultSpreadDiagram('celtic', positions);
      this.showMeaning(drawn[0].card, drawn[0].isReversed, positions[0]);

      document.getElementById('page-title').textContent = this.getLocalizedSpreadName('celtic');
      this.setDeckHint(this.currentLang === 'en' ? 'Tap a card to see its meaning' : '点击卡牌查看对应牌义');

      const compContent = document.getElementById('comprehensive-content');
      const compSection = document.getElementById('comprehensive-reading');
      if (compContent && compSection) {
        compContent.innerHTML = this.generateComprehensiveReading();
        compSection.classList.remove('hidden');
        compContent.classList.remove('hidden');
        const tBtn = document.getElementById('toggle-reading-btn');
        if (tBtn) tBtn.textContent = this.t('btn_collapse');
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
      }
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
        html += '<div class="fortune-guide-name">' + guideCard.name + (guideCard.originalName ? ' <span class="fortune-guide-orig">(' + guideCard.originalName + ')</span>' : '') + '</div>';
        html += '<div class="fortune-guide-pos">' + (guideCard.isReversed ? (this.currentLang === 'en' ? 'Reversed' : '逆位') : (this.currentLang === 'en' ? 'Upright' : '正位')) + '</div>';
        html += '<div class="fortune-guide-brief">' + guideCard.brief + '</div>';
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
        html += '<span class="fortune-lucky-num-badge">灵数 ' + fortune.luckyNumberRoot + '</span>';
      } else if (fortune.luckyNumberRoot) {
        html += '<span class="fortune-lucky-num-badge">数字根 ' + fortune.luckyNumberRoot + '</span>';
      }
      html += '</div>';
      if (luckyCardName) {
        html += '<div class="fortune-lucky-num-card">' + luckyCardName + (luckyCardOrig ? ' (' + luckyCardOrig + ')' : '') + '</div>';
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

              const categoryKeyMap = { simple: 'cat_beginner', relationship: 'cat_relationship', decision: 'cat_decision', general: 'cat_general', career: 'cat_career', advanced: 'filter_advanced' };
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
            simple: this.t('cat_beginner') || '新手',
            relationship: this.t('cat_relationship') || '情感',
            decision: this.t('cat_decision') || '决策',
            general: this.t('cat_general') || '通用',
            career: this.t('cat_career') || '事业',
            self: this.t('cat_self') || '自我成长',
            advanced: this.t('filter_advanced') || '复杂'
          };

          const hoverDict = I18N[this.currentLang] || I18N.zh;
          preview.innerHTML =
            '<div class="hover-title">' + this.getLocalizedSpreadName(key) + '</div>' +
            '<div class="hover-meta">' +
              '<span class="hover-meta-tag">' + (diffStars[spread.difficulty] || '★☆☆') + '</span>' +
              '<span class="hover-meta-tag">' + (catLabels[spread.category] || spread.category) + '</span>' +
              '<span class="hover-meta-tag">' + spread.positions.length + ' ' + (hoverDict['cards_count_label'] || '张牌') + '</span>' +
            '</div>' +
            '<div class="hover-usage">' + (this.currentLang === 'en' ? (spread.usageEn || spread.usage || '') : (spread.usage || '')) + '</div>';

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
        this.updateFortuneDate();

        console.log('Tarot App 初始化完成');
      } catch (err) {
        console.error('初始化错误:', err);
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
            } else if (filter === 'advanced') {
              show = spread.difficulty === 'hard';
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
        simple: 'cat_beginner', relationship: 'cat_relationship', decision: 'cat_decision',
        general: 'cat_general', career: 'cat_career', advanced: 'filter_advanced',
        self: 'cat_self'
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

        case 'year':
          // 年运牌阵：纵向一列
          html += '<div style="display:flex;flex-direction:column;gap:3px;align-items:center;">';
          for (let i = 0; i < positions.length; i++) {
            html += this.diagramCard(i + 1, positions[i], i === 6 ? '32px' : '26px');
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
