/**
 * deck-manager.js - 统一牌组管理
 * 支持多牌组、自定义牌意、多语言、缓存
 */

class DeckManager {
  constructor() {
    this.decks = {};
    this.currentDeckName = 'magic';
    this.customMeanings = {};
    this.language = 'zh'; // 'zh' | 'en'
    this.cache = {
      shuffled: null,
      lastDeck: null,
      dailyFortune: null,
      dailyDate: null
    };
  }

  /**
   * 注册牌组
   * @param {string} name - 牌组名称键
   * @param {Function} loader - 返回 Promise<array> 的加载函数
   * @param {object} meta - 牌组元信息 { nameZh, nameEn, description }
   */
  registerDeck(name, loader, meta) {
    this.decks[name] = { loader, meta, data: null, map: null, loaded: false };
  }

  /**
   * 加载指定牌组
   */
  async loadDeck(name) {
    if (!this.decks[name]) {
      throw new Error('未知牌组: ' + name);
    }
    const deck = this.decks[name];
    if (deck.loaded && deck.data) {
      return deck.data;
    }
    const data = await deck.loader();
    deck.data = data;
    deck.map = new Map(data.map((c) => [c.id, c]));
    deck.loaded = true;
    this.currentDeckName = name;
    return data;
  }

  /**
   * 获取当前牌组数组
   */
  async getDeck(name) {
    name = name || this.currentDeckName;
    return await this.loadDeck(name);
  }

  /**
   * 获取当前牌组 Map（O(1) 查找）
   */
  async getDeckMap(name) {
    name = name || this.currentDeckName;
    await this.loadDeck(name);
    return this.decks[name].map;
  }

  /**
   * 根据 id 快速查找牌
   */
  async getCardById(cardId, deckName) {
    var map = await this.getDeckMap(deckName);
    return map.get(cardId);
  }

  // ============ 缓存洗牌结果 ============
  /**
   * 获取洗牌后的牌组（带缓存）
   */
  async getShuffledDeck(deckName) {
    const name = deckName || this.currentDeckName;
    if (this.cache.shuffled && this.cache.lastDeck === name) {
      return this.cache.shuffled;
    }
    const deck = await this.getDeck(name);
    this.cache.shuffled = this.shuffle(deck.slice());
    this.cache.lastDeck = name;
    return this.cache.shuffled;
  }

  /**
   * 清除洗牌缓存
   */
  clearShuffleCache() {
    this.cache.shuffled = null;
    this.cache.lastDeck = null;
  }

  /**
   * Fisher-Yates 洗牌算法
   */
  shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  // ============ 自定义牌意 ============
  /**
   * 加载自定义牌意
   */
  async loadCustomMeanings() {
    return new Promise(function (resolve) {
      chrome.storage.local.get({ customMeanings: {} }, function (result) {
        resolve(result.customMeanings);
      });
    });
  }

  /**
   * 保存自定义牌意
   */
  async saveCustomMeaning(cardId, type, text) {
    var customs = await this.loadCustomMeanings();
    if (!customs[cardId]) customs[cardId] = {};
    customs[cardId][type] = text;
    return new Promise(function (resolve) {
      chrome.storage.local.set({ customMeanings: customs }, resolve);
    });
  }

  /**
   * 获取牌意（优先使用自定义牌意，支持多语言）
   * @param {string|number} cardId - 牌ID
   * @param {string} type - 'upright' | 'reversed'
   * @param {string} deckName - 牌组名
   * @returns {Promise<string>}
   */
  async getMeaning(cardId, type, deckName) {
    const customs = await this.loadCustomMeanings();
    if (customs[cardId] && customs[cardId][type]) {
      return customs[cardId][type];
    }
    const card = await this.getCardById(cardId, deckName);
    if (!card) return '';

    // 英文模式下尝试获取 translations 中的英文牌意
    if (this.language === 'en') {
      const trans = card.translations && card.translations.en;
      if (trans) {
        const key = type === 'upright' ? 'upright' : 'reversed';
        if (trans[key]) return trans[key];
      }
      // 没有英文牌意时返回中文（可后续补充翻译）
      return type === 'upright' ? card.upright : card.reversed;
    }

    return type === 'upright' ? card.upright : card.reversed;
  }

  // ============ 多语言支持 ============
  setLanguage(lang) {
    this.language = lang;
  }

  getLanguage() {
    return this.language;
  }

  /**
   * 获取牌的多语言字段
   * 支持两种数据结构：
   *   1. card.translations.en.name / upright / reversed
   *   2. card.originalName（英文牌名）+ card.upright / reversed（中文释义）
   */
  getLocalizedField(card, field) {
    // 优先使用 translations 字段（完整多语言支持）
    if (card.translations && card.translations[this.language]) {
      const val = card.translations[this.language][field];
      if (val) return val;
    }
    // 英文模式下，name 字段回退到 originalName
    if (this.language === 'en' && field === 'name') {
      return card.originalName || card.name;
    }
    return card[field];
  }

  /**
   * 获取牌名（多语言）
   */
  getCardName(card) {
    if (!card) return '';
    if (this.language === 'en') {
      return card.originalName || card.name;
    }
    return card.name;
  }
}

// 导出全局实例
var deckManager = new DeckManager();

// 注册默认牌组
deckManager.registerDeck('magic', function () {
  return Promise.resolve(typeof tarotCards !== 'undefined' ? tarotCards : []);
}, { nameZh: '魔法主题', nameEn: 'Magic Theme', description: '魔法主题塔罗牌' });

deckManager.registerDeck('rider', function () {
  return Promise.resolve(typeof riderWaiteCards !== 'undefined' ? riderWaiteCards : []);
}, { nameZh: '伟特塔罗', nameEn: 'Rider-Waite', description: '标准伟特塔罗牌' });

deckManager.registerDeck('marseille', function () {
  return Promise.resolve(typeof marseilleCards !== 'undefined' ? marseilleCards : []);
}, { nameZh: '马赛塔罗', nameEn: 'Marseille', description: '传统马赛塔罗牌' });

deckManager.registerDeck('thoth', function () {
  return Promise.resolve(typeof thothCards !== 'undefined' ? thothCards : []);
}, { nameZh: '托特塔罗', nameEn: 'Thoth', description: '克劳利托特塔罗牌' });

deckManager.registerDeck('angel', function () {
  return Promise.resolve(typeof angelCards !== 'undefined' ? angelCards : []);
}, { nameZh: '天使塔罗', nameEn: 'Angel', description: '天使指引塔罗牌' });
