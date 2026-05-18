/**
 * 哈利波特塔罗牌 - 主逻辑（支持多牌阵、多牌组）
 * 已重构：使用 ES6+ 语法、类封装、async/await
 */
(function () {
  'use strict';

  // ============ 常量定义 ============
  const SUPPORTED_LANGS = ['zh', 'en'];

  const DECK_NAMES = {
    hp: '哈利波特主题',
    rider: '伟特塔罗',
    marseille: '马赛塔罗',
    thoth: '托特塔罗',
    angel: '天使塔罗'
  };

  const SPREADS = {
    single: {
      name: '单牌占卜',
      positions: ['今日指引'],
      positionMeanings: ['一张牌概括当前能量状态，适合快速提问或每日指引。正位通常表示顺利，逆位提示需要注意的方向。'],
      category: 'simple', difficulty: 'easy', recommended: true, loadingText: '正在抽取今日指引...',
      usage: '适合每日抽一张牌作为当日指引，或针对一个具体问题寻求答案。'
    },
    three: {
      name: '三牌占卜',
      positions: ['过去', '现在', '未来'],
      positionMeanings: [
        '过去：影响当前情况的历史因素或已发生的事件。',
        '现在：当前的核心状况、你的状态和正在发生的事。',
        '未来：基于当前趋势可能的发展方向，并非注定不变。'
      ],
      category: 'simple', difficulty: 'easy', recommended: true, loadingText: '正在展开三张牌...',
      usage: '最经典的牌阵，适合大多数问题，时间线清晰，解读直观。'
    },
    celtic: {
      name: '凯尔特十字',
      positions: ['当前情况', '挑战/障碍', '过去基础', '近期过去', '可能未来', '近期未来', '你的态度', '外部影响', '希望与恐惧', '最终结果'],
      positionMeanings: [
        '当前情况：你目前所处的境况和核心问题。',
        '挑战/障碍：当前面临的主要困难或需要克服的挑战。',
        '过去基础：形成当前状况的过去原因和根基。',
        '近期过去：最近发生并仍在影响你的事情。',
        '可能未来：未来可能发展的方向（不一定发生）。',
        '近期未来：短期内即将发生的事。',
        '你的态度：你内心对这个问题的真实态度和感受。',
        '外部影响：来自外界的人、事、物对问题的影响。',
        '希望与恐惧：你内心深处的期望和担忧。',
        '最终结果：综合所有因素后最可能的结果。'
      ],
      category: 'advanced', difficulty: 'hard', recommended: false, loadingText: '正在展开凯尔特十字...',
      usage: '适合重要且复杂的问题，需要全面深入分析时使用。建议有一定塔罗基础后再尝试。'
    },
    relation: {
      name: '关系牌阵',
      positions: ['你', '对方', '你的态度', '对方的态度', '当前关系', '发展方向'],
      positionMeanings: [
        '你：你在这段关系中的状态、能量和角色。',
        '对方：对方在这段关系中的状态、能量和角色。',
        '你的态度：你对这段关系的真实感受和态度。',
        '对方的态度：对方对这段关系的真实感受和态度。',
        '当前关系：你们之间目前的关系状态和互动模式。',
        '发展方向：这段关系未来的可能走向。'
      ],
      category: 'relationship', difficulty: 'medium', recommended: true, loadingText: '正在解读关系牌阵...',
      usage: '适合分析任何人际关系，包括爱情、友情、亲子关系、职场关系等。'
    },
    choice: {
      name: '二选一牌阵',
      positions: ['选项A', '选项B', 'A的可能结果', 'B的可能结果', '建议/提醒'],
      positionMeanings: [
        '选项A：第一个选项的现状和本质。',
        '选项B：第二个选项的现状和本质。',
        'A的可能结果：如果选择A，可能带来的结果。',
        'B的可能结果：如果选择B，可能带来的结果。',
        '建议/提醒：塔罗对你的建议，以及需要特别注意的事项。'
      ],
      category: 'decision', difficulty: 'medium', recommended: false, loadingText: '正在分析两个选项...',
      usage: '当你在两个选项中犹豫不决时使用，帮助看清每个选项的利弊和可能结果。'
    },
    five: {
      name: '五张牌阵',
      positions: ['问题核心', '面临的障碍', '潜意识/隐藏因素', '建议的行动', '可能的结果'],
      positionMeanings: [
        '问题核心：问题的本质和最关键的因素。',
        '面临的障碍：阻碍问题解决的主要困难和挑战。',
        '潜意识/隐藏因素：你自己可能未察觉的动机、情感或隐藏的影响因素。',
        '建议的行动：塔罗建议你采取的行动方向。',
        '可能的结果：如果按照建议行动，可能得到的结果。'
      ],
      category: 'general', difficulty: 'medium', recommended: false, loadingText: '正在展开五张牌阵...',
      usage: '适合分析任何类型的问题，从问题核心到解决方案，层层递进。'
    },
    horseshoe: {
      name: '马蹄铁牌阵',
      positions: ['过去的影响', '现在的情况', '隐藏的因素', '面临的挑战', '外部影响', '希望与恐惧', '最终结果'],
      positionMeanings: [
        '过去的影响：过去事件对当前情况的持续影响。',
        '现在的情况：当前问题的实际状况。',
        '隐藏的因素：未被发现或未被重视的重要因素。',
        '面临的挑战：需要面对和克服的困难。',
        '外部影响：环境、他人或不可控因素对问题的影响。',
        '希望与恐惧：内心深处的期望与担忧，可能影响决策。',
        '最终结果：综合所有因素后，最有可能发生的结果。'
      ],
      category: 'general', difficulty: 'medium', recommended: false, loadingText: '正在展开马蹄铁牌阵...',
      usage: '适合全面了解一个情况的各个层面，时间跨度从过去到未来。'
    },
    career: {
      name: '事业牌阵',
      positions: ['当前状况', '面临的挑战', '你的优势', '建议的行动', '未来发展'],
      positionMeanings: [
        '当前状况：你在事业/学业方面的现状。',
        '面临的挑战：工作中遇到的困难或需要克服的障碍。',
        '你的优势：你拥有的能力、资源或有利条件。',
        '建议的行动：塔罗建议你在事业/学业上采取的行动。',
        '未来发展：基于当前情况，事业/学业的可能发展方向。'
      ],
      category: 'career', difficulty: 'medium', recommended: false, loadingText: '正在展开事业牌阵...',
      usage: '适合分析工作、学业、职业发展相关的问题，帮助做出更明智的职业决策。'
    },
    timeflow: {
      name: '时间之流',
      positions: ['过去', '现在', '未来', '深层原因', '可能的结果'],
      positionMeanings: [
        '过去：影响当前情况的历史因素和已发生的事件。',
        '现在：当前的核心状况和你的真实状态。',
        '未来：基于当前趋势最可能的发展方向。',
        '深层原因：潜藏在问题背后的根本动因。',
        '可能的结果：综合所有因素后最终可能呈现的状态。'
      ],
      category: 'general', difficulty: 'medium', recommended: false, loadingText: '正在展开时间之流...',
      usage: '在时间维度上全面分析问题，适合想要看清事情来龙去脉的情况。'
    },
    action: {
      name: '问题行动结果',
      positions: ['问题核心', '建议行动', '可能结果'],
      positionMeanings: [
        '问题核心：你最关心的核心问题或担忧。',
        '建议行动：塔罗建议你采取的具体行动方向。',
        '可能结果：如果按照建议行动，最可能得到的结果。'
      ],
      category: 'decision', difficulty: 'easy', recommended: true, loadingText: '正在展开问题行动结果...',
      usage: '简洁明了的三位牌阵，适合快速决策和明确行动方向。'
    },
    mind: {
      name: '心灵牌阵',
      positions: ['意识', '潜意识', '理想', '现实', '建议'],
      positionMeanings: [
        '意识：你清醒时对自己和问题的认知。',
        '潜意识：内心深处隐藏的动机、恐惧或渴望。',
        '理想：你内心真正渴望达到的状态或结果。',
        '现实：客观现实和实际的限制条件。',
        '建议：综合意识与潜意识、理想与现实后的最佳建议。'
      ],
      category: 'general', difficulty: 'medium', recommended: false, loadingText: '正在展开心灵牌阵...',
      usage: '适合自我探索和内心成长类问题，帮助看清内心真实想法。'
    }
  };

  const FORTUNE_CATEGORIES = ['事业', '财运', '感情', '健康', '学习', '社交'];
  const FORTUNE_LEVELS = [
    { text: '大吉', score: 95, color: '#FFD700', desc: '今日运势极佳，万事顺遂，适合推进重要计划。' },
    { text: '吉', score: 80, color: '#4CAF50', desc: '今日运势良好，积极行动会有不错的收获。' },
    { text: '中吉', score: 70, color: '#2196F3', desc: '今日运势平稳，按部就班即可，宜守不宜攻。' },
    { text: '小吉', score: 60, color: '#9C27B0', desc: '今日运势尚可，小事顺利但大事需谨慎。' },
    { text: '平', score: 50, color: '#607D8B', desc: '今日运势平淡，适合休整和规划，不宜冒进。' },
    { text: '小凶', score: 40, color: '#FF9800', desc: '今日需谨慎行事，避免重要决策和大额支出。' },
    { text: '凶', score: 25, color: '#F44336', desc: '今日运势低迷，宜静不宜动，注意安全和健康。' }
  ];

  const LUCKY_COLORS = [
    { name: '金色', hex: '#FFD700' },
    { name: '紫色', hex: '#9C27B0' },
    { name: '蓝色', hex: '#2196F3' },
    { name: '绿色', hex: '#4CAF50' },
    { name: '红色', hex: '#F44336' },
    { name: '橙色', hex: '#FF9800' },
    { name: '青色', hex: '#00BCD4' },
    { name: '粉色', hex: '#E91E63' },
    { name: '白色', hex: '#FFFFFF' },
    { name: '银色', hex: '#9E9E9E' }
  ];

  const LUCKY_ADVICE = {
    '大吉': ['宜：签约、表白、投资、出行', '忌：无所事事、浪费机会'],
    '吉': ['宜：学习、社交、购物、运动', '忌：冲动决策、与人争执'],
    '中吉': ['宜：整理、规划、沟通、休息', '忌：冒险投资、重大变动'],
    '小吉': ['宜：阅读、散步、做家务、听音乐', '忌：熬夜、过量饮食'],
    '平': ['宜：冥想、复盘、维护关系、储蓄', '忌：借贷、跳槽、远行'],
    '小凶': ['宜：独处、学习、做计划', '忌：签约、手术、争吵'],
    '凶': ['宜：静养、念佛、整理旧物', '忌：投资、远行、重大决定']
  };

  // ============ 静态文本国际化字典 ============
  const I18N = {
    zh: {
      welcome_title: '哈利波特塔罗牌',
      welcome_subtitle: '探索魔法世界的命运指引',
      label_deck: '选择牌组：',
      deck_hp: '哈利波特主题',
      deck_rider: '伟特塔罗',
      deck_marseille: '马赛塔罗',
      deck_thoth: '托特塔罗',
      deck_angel: '天使塔罗',
      label_lang: '语言：',
      inst_start: '选择牌阵开始你的魔法之旅',
      inst_click: '点击卡牌查看正/逆位解读',
      inst_reshuffle: '随时可以重新洗牌占卜',
      btn_history: '查看历史记录',
      btn_favorites: '收藏夹',
      btn_daily_fortune: '今日运势',
      fortune_panel_title: '✨ 今日运势',
      fortune_loading: '正在解读今日运势...',
      cat_beginner: '⭐ 新手推荐',
      cat_relationship: '💕 情感关系',
      cat_decision: '💡 决策分析',
      cat_general: '🔮 通用深入',
      cat_career: '💼 事业学业',
      badge_recommended: '★ 推荐',
      spread_single_name: '单牌阵',
      spread_single_desc: '1张牌 · 每日指引 / 快速决策',
      spread_three_name: '三牌阵',
      spread_three_desc: '3张牌 · 过去·现在·未来',
      spread_celtic_name: '凯尔特十字',
      spread_celtic_desc: '10张牌 · 全面深入解读',
      spread_relation_name: '关系牌阵',
      spread_relation_desc: '6张牌 · 人际关系 / 感情',
      spread_choice_name: '二选一牌阵',
      spread_choice_desc: '5张牌 · 面临两个选择时',
      spread_five_name: '五张牌阵',
      spread_five_desc: '5张牌 · 通用问题深入分析',
      spread_horseshoe_name: '马蹄铁牌阵',
      spread_horseshoe_desc: '7张牌 · 全面生活指引',
      spread_career_name: '事业牌阵',
      spread_career_desc: '5张牌 · 工作/学业决策',
      spread_timeflow_name: '时间之流',
      spread_timeflow_desc: '5张牌 · 时间维度全面分析',
      spread_action_name: '问题行动结果',
      spread_action_desc: '3张牌 · 快速决策与行动指引',
      spread_mind_name: '心灵牌阵',
      spread_mind_desc: '5张牌 · 自我探索与内心成长',
      placeholder_click_card: '点击上方卡牌查看详细解读',
      comprehensive_reading: '综合解读',
      btn_expand: '展开',
      btn_collapse: '收起',
      btn_back: '返回',
      btn_reshuffle: '重新占卜',
      btn_share: '分享结果',
      btn_copy_result: '复制结果',
      history_title: '历史记录',
      history_hint: '查看过往的占卜记录',
      history_detail_title: '占卜详情',
      btn_back_to_list: '返回列表',
      btn_clear_history: '清空记录',
      history_empty: '暂无历史记录',
      fav_empty: '暂无收藏，点击卡牌预览中的 ☆ 可收藏喜欢的卡牌。',
      fav_title: '收藏夹',
      fav_hint: '你收藏的卡牌',
      loading_shuffle: '正在洗牌...',
      single_tip: '适合每日快速占卜，一张牌给出今日指引方向。',
      three_tip: '最经典的牌阵，分别解读过去的影响、现在的状态和未来的发展。',
      celtic_tip: '最全面的牌阵，适合重要问题深入解读，共10张牌覆盖问题各个层面。',
      relation_tip: '专门用于人际关系和感情问题，帮你理解双方状态与关系走向。',
      choice_tip: '当你在两个选项中犹豫不决时使用，帮助看清每个选项的可能结果。',
      five_tip: '通用深入分析牌阵，从问题核心到最终结果，层层递进。',
      horseshoe_tip: '马蹄铁形牌阵，覆盖过去到未来的完整时间线，适合全面了解局势。',
      career_tip: '专注事业与学业决策，从当前状况到未来发展，给出实用建议。',
      timeflow_tip: '从时间维度全面分析问题，看清事情的来龙去脉与可能走向。',
      action_tip: '简洁明了的三位牌阵，快速明确问题核心与最佳行动方向。',
      mind_tip: '适合自我探索与内心成长，帮助看清意识与潜意识、理想与现实。',
      fortune_overall: '★ 综合运势',
      fortune_dimensions: '➡ 各维度评分',
      fortune_lucky_info: '💫 幸运信息',
      fortune_lucky_color: '幸运颜色',
      fortune_lucky_number: '幸运数字',
      fortune_lucky_direction: '幸运方位',
      fortune_dos_donts: '☯ 今日宜忌',
      fortune_tips: '💬 温馨提示',
      fortune_score_unit: '分',
      fortune_suitable: '宜：',
      fortune_avoid: '忌：',
      btn_number_gen: '命运数字',
      numgen_title: '命运数字生成器',
      numgen_hint: '让塔罗命运指引为你挑选幸运数字',
      numgen_min: '最小值',
      numgen_max: '最大值',
      numgen_generate: '生成命运数字',
      numgen_regenerate: '重新生成',
      numgen_your_number: '你的命运数字',
      numgen_reading_title: '✨ 塔罗命运指引',
      numgen_error_min: '最小值不能大于最大值',
      numgen_error_range: '请输入有效范围（最大值 - 最小值 ≥ 1）',
      numgen_copy: '复制数字',
      numgen_copy_all: '复制全部',
      numgen_quantity: '生成数量',
      numgen_numbers_label: '你的命运数字',
      numgen_history_title: '历史记录',
      numgen_clear_history: '清空历史',
      numgen_preset_lottery: '六合彩(1-49)',
      numgen_error_quantity: '生成数量不能超过取值范围大小',
      btn_dilemma: '选择困难症',
      dilemma_title: '选择困难症',
      dilemma_hint: '输入两个选项，用猜拳、摇骰子或塔罗帮你做决定',
      dilemma_label_a: '选项 A',
      dilemma_label_b: '选项 B',
      dilemma_choose_method: '选择决定方式',
      dilemma_rps: '猜拳决胜',
      dilemma_dice: '摇骰子',
      dilemma_tarot: '塔罗抽牌',
      dilemma_rps_title: '✊ 猜拳决胜',
      dilemma_dice_title: '🎲 摇骰子',
      dilemma_dice_high: '大（4-6）',
      dilemma_dice_low: '小（1-3）',
      dilemma_tarot_reading: '✨ 塔罗命运解读',
      dilemma_redo: '再来一次',
      dilemma_enter_both: '请输入两个选项',
      dilemma_you_chose: '你出了：',
      dilemma_computer_chose: '电脑出了：',
      dilemma_winner_is: '胜出选项：',
      dilemma_dice_point: '骰子点数：',
      dilemma_computer_roll: '电脑摇出：',
      dilemma_you_bet: '你押：',
      dilemma_dice_result_high: '大（4-6）',
      dilemma_dice_result_low: '小（1-3）',
      dilemma_winner_is: '胜出选项：',
      decision_tie: '平局，请再试一次！',
      difficulty_easy: '★☆☆',
      difficulty_medium: '★★☆',
      difficulty_hard: '★★★',
      filter_all: '全部',
      filter_advanced: '复杂',
      filter_favorites: '★ 收藏',
      spread_search_placeholder: '搜索牌阵...'
    },
    en: {
      welcome_title: 'Harry Potter Tarot',
      welcome_subtitle: 'Explore the magical guidance of fate',
      label_deck: 'Deck:',
      deck_hp: 'Harry Potter Theme',
      deck_rider: 'Rider-Waite',
      deck_marseille: 'Marseille',
      deck_thoth: 'Thoth',
      deck_angel: 'Angel',
      label_lang: 'Language:',
      inst_start: 'Choose a spread to begin your magical journey',
      inst_click: 'Tap cards to view upright / reversed meaning',
      inst_reshuffle: 'Reshuffle anytime for a new reading',
      btn_history: 'View History',
      btn_favorites: 'Favorites',
      btn_daily_fortune: 'Daily Fortune',
      fortune_panel_title: '✨ Daily Fortune',
      fortune_loading: 'Reading today\'s fortune...',
      cat_beginner: '⭐ Beginner Recommended',
      cat_relationship: '💕 Love & Relationship',
      cat_decision: '💡 Decision Analysis',
      cat_general: '🔮 General In-depth',
      cat_career: '💼 Career & Study',
      badge_recommended: '★ Recommended',
      spread_single_name: 'Single Card',
      spread_single_desc: '1 card · Daily guidance / Quick decision',
      spread_three_name: 'Three Cards',
      spread_three_desc: '3 cards · Past · Present · Future',
      spread_celtic_name: 'Celtic Cross',
      spread_celtic_desc: '10 cards · Comprehensive in-depth reading',
      spread_relation_name: 'Relationship',
      spread_relation_desc: '6 cards · Interpersonal / Love',
      spread_choice_name: 'Choice Spread',
      spread_choice_desc: '5 cards · When facing two options',
      spread_five_name: 'Five Cards',
      spread_five_desc: '5 cards · General in-depth analysis',
      spread_horseshoe_name: 'Horseshoe',
      spread_horseshoe_desc: '7 cards · Comprehensive life guidance',
      spread_career_name: 'Career Spread',
      spread_career_desc: '5 cards · Work / Study decisions',
      spread_timeflow_name: 'Time Flow',
      spread_timeflow_desc: '5 cards · Past to future analysis',
      spread_action_name: 'Problem-Action-Result',
      spread_action_desc: '3 cards · Quick decision & action guide',
      spread_mind_name: 'Mind Spread',
      spread_mind_desc: '5 cards · Self-exploration & inner growth',
      placeholder_click_card: 'Tap a card above to see detailed meaning',
      comprehensive_reading: 'Comprehensive Reading',
      btn_expand: 'Expand',
      btn_collapse: 'Collapse',
      btn_back: 'Back',
      btn_reshuffle: 'Redraw',
      btn_share: 'Share Result',
      btn_copy_result: 'Copy Result',
      history_title: 'History',
      history_hint: 'View past readings',
      history_detail_title: 'Reading Detail',
      btn_back_to_list: 'Back to List',
      btn_clear_history: 'Clear History',
      history_empty: 'No history yet',
      fav_empty: 'No favorites yet. Click ☆ in card preview to favorite a card.',
      fav_title: 'Favorites',
      fav_hint: 'Your favorite cards',
      loading_shuffle: 'Shuffling...',
      single_tip: 'Quick daily guidance. One card shows your direction for today.',
      three_tip: 'Classic three-card spread: past influence, current state, and future development.',
      celtic_tip: 'Most comprehensive spread with 10 cards covering all aspects of a situation.',
      relation_tip: 'Designed for relationships and emotions. Understand both sides and where the relationship is heading.',
      choice_tip: 'Use when hesitating between two options. Shows possible outcomes for each choice.',
      five_tip: 'General in-depth spread. From core issue to final outcome, layer by layer.',
      horseshoe_tip: 'Horseshoe-shaped spread covering the full timeline from past to future. Great for a complete overview.',
      career_tip: 'Focused on career and study decisions. From current status to future development, with practical advice.',
      timeflow_tip: 'Analyze the problem through time dimensions. See the past, present and future clearly.',
      action_tip: 'Simple three-card spread. Quickly clarify the core issue and best action direction.',
      mind_tip: 'For self-exploration and inner growth. Helps see consciousness, subconscious, ideal and reality.',
      fortune_overall: '★ Overall Fortune',
      fortune_dimensions: '➡ Dimension Scores',
      fortune_lucky_info: '💫 Lucky Info',
      fortune_lucky_color: 'Lucky Color',
      fortune_lucky_number: 'Lucky Number',
      fortune_lucky_direction: 'Lucky Direction',
      fortune_dos_donts: '☯ Dos & Don\'ts',
      fortune_tips: '💬 Daily Tip',
      fortune_score_unit: 'pts',
      fortune_suitable: 'Do: ',
      fortune_avoid: 'Avoid: ',
      btn_number_gen: 'Fate Number',
      numgen_title: 'Fate Number Generator',
      numgen_hint: 'Let tarot fate guide you to your lucky number',
      numgen_min: 'Min',
      numgen_max: 'Max',
      numgen_generate: 'Generate Fate Number',
      numgen_regenerate: 'Regenerate',
      numgen_your_number: 'Your Fate Number',
      numgen_reading_title: '✨ Tarot Fate Guidance',
      numgen_error_min: 'Min cannot be greater than max',
      numgen_error_range: 'Please enter a valid range (max - min ≥ 1)',
      numgen_copy: 'Copy Number',
      numgen_copy_all: 'Copy All',
      numgen_quantity: 'Quantity',
      numgen_numbers_label: 'Your Fate Numbers',
      numgen_error_quantity: 'Quantity cannot exceed the range size',
      btn_dilemma: 'Decision Helper',
      dilemma_title: 'Decision Helper',
      dilemma_hint: 'Enter two options, let Rock-Paper-Scissors, Dice, or Tarot help you decide',
      dilemma_label_a: 'Option A',
      dilemma_label_b: 'Option B',
      dilemma_choose_method: 'Choose a method',
      dilemma_rps: 'Rock Paper Scissors',
      dilemma_dice: 'Roll Dice',
      dilemma_tarot: 'Tarot Draw',
      dilemma_rps_title: '✊ Rock Paper Scissors',
      dilemma_dice_title: '🎲 Roll Dice',
      dilemma_dice_high: 'High (4-6)',
      dilemma_dice_low: 'Low (1-3)',
      dilemma_tarot_reading: '✨ Tarot Fate Reading',
      dilemma_redo: 'Try Again',
      dilemma_enter_both: 'Please enter both options',
      dilemma_you_chose: 'You chose: ',
      dilemma_computer_chose: 'Computer chose: ',
      dilemma_winner_is: 'Winner: ',
      dilemma_dice_point: 'Dice roll: ',
      dilemma_computer_roll: 'Computer rolled: ',
      dilemma_you_bet: 'You bet: ',
      dilemma_dice_result_high: 'High (4-6)',
      dilemma_dice_result_low: 'Low (1-3)',
      dilemma_winner_is: 'Winner: ',
      decision_tie: 'It\'s a tie, try again!',
      difficulty_easy: '★☆☆',
      difficulty_medium: '★★☆',
      difficulty_hard: '★★★',
      filter_all: 'All',
      filter_advanced: 'Complex',
      filter_favorites: '★ Favorites',
      spread_search_placeholder: 'Search spreads...'
    }
  };

  // ============ 主应用类 ============
  class TarotApp {
    constructor() {
      // 状态
      this.currentCards = [];
      this.currentMode = 'single';
      this.currentDeck = 'hp';
      this.currentLang = 'zh';

      // 洗牌缓存
      this.shuffledDeckCache = null;
      this.lastShuffleDeck = null;

      // 自定义牌意
      this.customMeanings = {};
      this.CUSTOM_MEANINGS_KEY = 'tarot_custom_meanings';

      // 初始化
      this.init();
    }

    // ============ 工具方法 ============
    t(key) {
      const dict = I18N[this.currentLang] || I18N.zh;
      return dict[key] || key;
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
      if (this.customMeanings[card.id] && this.customMeanings[card.id][type]) {
        return this.customMeanings[card.id][type];
      }
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
        const enNames = { hp: 'Harry Potter', rider: 'Rider-Waite', marseille: 'Marseille', thoth: 'Thoth', angel: 'Angel' };
        return enNames[deckKey] || 'Tarot';
      }
      return DECK_NAMES[deckKey] || '塔罗牌';
    }

    getLocalizedSpreadName(mode) {
      const spread = SPREADS[mode];
      if (!spread) return this.currentLang === 'en' ? 'Tarot Reading' : '塔罗占卜';
      if (this.currentLang === 'en') {
        const enNames = {
          single: 'Single Card', three: 'Past-Present-Future', celtic: 'Celtic Cross',
          relation: 'Relationship', choice: 'Choice Spread', five: 'Five Card',
          horseshoe: 'Horseshoe', career: 'Career Spread'
        };
        return enNames[mode] || spread.name;
      }
      return spread.name;
    }

    getLocalizedPositions(mode) {
      const spread = SPREADS[mode];
      if (!spread) return [];
      if (this.currentLang === 'en') {
        const enPositions = {
          single: ['Daily Guidance'],
          three: ['Past', 'Present', 'Future'],
          celtic: ['Current Situation', 'Challenge', 'Past', 'Future', 'Above', 'Below', 'Advice', 'External', 'Hopes/Fears', 'Outcome'],
          relation: ['You', 'Partner', 'Your Attitude', 'Their Attitude', 'Current Relationship', 'Direction'],
          choice: ['Option A', 'Option B', 'Pros A', 'Pros B', 'Advice'],
          five: ['Present', 'Past', 'Future', 'Advice', 'Potential'],
          horseshoe: ['Past Influence', 'Current', 'Hidden Factor', 'Challenge', 'External', 'Hopes/Fears', 'Outcome'],
          career: ['Current', 'Challenge', 'Strengths', 'Action', 'Future'],
          timeflow: ['Past', 'Present', 'Future', 'Root Cause', 'Possible Outcome'],
          action: ['Problem', 'Suggested Action', 'Possible Outcome'],
          mind: ['Conscious', 'Subconscious', 'Ideal', 'Reality', 'Advice']
        };
        return enPositions[mode] || spread.positions;
      }
      return spread.positions;
    }

    getLocalizedLoadingText(mode) {
      if (this.currentLang === 'en') {
        const enTexts = {
          single: 'Drawing your daily guidance...',
          three: 'Laying out three cards...',
          celtic: 'Unfolding the Celtic Cross...',
          relation: 'Reading the relationship spread...',
          choice: 'Analyzing the two options...',
          five: 'Unfolding the five-card spread...',
          horseshoe: 'Unfolding the Horseshoe spread...',
          career: 'Unfolding the Career spread...',
          timeflow: 'Unfolding the Time Flow spread...',
          action: 'Analyzing Problem-Action-Result...',
          mind: 'Exploring the Mind spread...'
        };
        return enTexts[mode] || 'Shuffling cards...';
      }
      const spread = SPREADS[mode];
      return spread ? spread.loadingText : '正在洗牌...';
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
      document.querySelectorAll('.spread-btn').forEach(btn => {
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
        hint.textContent = baseText + ' · ' + DECK_NAMES[this.currentDeck];
      }
    }

    // ============ 页面切换 ============
    showPage(pageId) {
      document.querySelectorAll('.page').forEach((p) => {
        p.classList.add('hidden');
      });
      const target = document.getElementById(pageId);
      if (target) target.classList.remove('hidden');
      if (pageId === 'welcome-page') {
        const tag = document.getElementById('spread-name-tag');
        if (tag) tag.classList.add('hidden');
      }
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
          '<button class="custom-meaning-btn" data-card-id="' + card.id + '" data-type="' + (isReversed ? 'reversed' : 'upright') + '">' + this.t('自定义牌意') + '</button>' +
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
      const minors = cards.filter((item) => item.card.suit !== 'major');

      const elements = { wands: 0, cups: 0, swords: 0, pentacles: 0 };
      cards.forEach((item) => {
        if (item.card.suit === 'wands') elements.wands++;
        else if (item.card.suit === 'cups') elements.cups++;
        else if (item.card.suit === 'swords') elements.swords++;
        else if (item.card.suit === 'pentacles') elements.pentacles++;
      });

      let dominantElement = '无';
      let maxCount = 0;
      for (const el in elements) {
        if (elements[el] > maxCount) { maxCount = elements[el]; dominantElement = el; }
      }
      const elementNames = this.currentLang === 'en'
        ? { wands: 'Wands (Fire)', cups: 'Cups (Water)', swords: 'Swords (Air)', pentacles: 'Pentacles (Earth)' }
        : { wands: '权杖（火）', cups: '圣杯（水）', swords: '宝剑（风）', pentacles: '星币（土）' };

      let html = '<div class="reading-section">';
      html += '<div class="reading-section-title">★ 整体主题</div>';
      html += '<div class="reading-section-body">';

      let text = '本次' + spreadName + '抽取了 ' + cards.length + ' 张牌，';
      text += '其中正位 ' + uprightCount + ' 张，逆位 ' + reversedCount + ' 张。';

      if (majors.length > 0) {
        text += ' 大阿卡那牌出现了 ' + majors.length + ' 张（' + majors.map((m) => deckManager.getCardName(m.card)).join('、') + '），';
        text += '预示本次问题涉及重要的生命课题或深层转变，值得认真对待。';
      } else {
        text += ' 本次抽到的均为小阿卡那牌，问题更偏向日常生活层面的具体事务。';
      }

      if (maxCount > 1) {
        text += ' 牌面中「' + (elementNames[dominantElement] || dominantElement) + '」元素最为突出，';
        if (dominantElement === 'wands') text += '整体能量偏向行动、热情与创造力，是一个需要主动出击的时期。';
        else if (dominantElement === 'cups') text += '整体能量偏向情感、直觉与人际关系，需要更多关注内心感受。';
        else if (dominantElement === 'swords') text += '整体能量偏向思维、沟通与挑战，需要理性分析和清晰判断。';
        else if (dominantElement === 'pentacles') text += '整体能量偏向物质、事业与实际成果，需要脚踏实地的行动。';
      }

      if (reversedCount >= cards.length * 0.5) {
        text += ' 逆位牌占多数，提示当前局面可能存在阻碍、内在抗拒或需要调整方向；建议以更灵活的态度面对变化。';
      } else if (uprightCount >= cards.length * 0.7) {
        text += ' 正位牌占多数，整体能量通畅，当前方向基本正确，保持信心继续推进即可。';
      }

      html += text + '</div></div>';
      return html;
    }

    // ============ 综合解读 - 分析牌面关系 ============
    analyzeCardRelations(mode, cards, positions) {
      let html = '<div class="reading-section">';
      html += '<div class="reading-section-title">⚙ 牌面关系分析</div>';
      html += '<div class="reading-section-body">';

      let text = '';

      if (mode === 'three') {
        const past = cards[0], now = cards[1], future = cards[2];
        text += '过去（' + deckManager.getCardName(past.card) + ' ' + this.getPosText(past.isReversed) + '）';
        text += '为现在（' + deckManager.getCardName(now.card) + ' ' + this.getPosText(now.isReversed) + '）';
        text += '埋下了伏笔，而现在的能量将延续至未来（' + deckManager.getCardName(future.card) + ' ' + this.getPosText(future.isReversed) + '）。';
        if (past.isReversed && !now.isReversed) text += ' 逆位的过去牌显示旧有模式正在被化解，现在是一个重新出发的契机。';
        if (!past.isReversed && now.isReversed) text += ' 过去的顺利积累未能延续到现在，需要审视哪里出现了偏差。';
        if (now.isReversed && !future.isReversed) text += ' 现在的困难是暂时的，未来有逆转向上的趋势，请坚持下去。';
      } else if (mode === 'relation') {
        text += '你（' + deckManager.getCardName(cards[0].card) + ' ' + this.getPosText(cards[0].isReversed) + '）与对方（' + deckManager.getCardName(cards[1].card) + ' ' + this.getPosText(cards[1].isReversed) + '）';
        text += '之间存在着明显的能量互动。';
        if (cards[0].isReversed === cards[1].isReversed) {
          text += ' 双方的牌位状态相似，说明你们对这段关系的认知较为一致，';
          text += cards[0].isReversed ? '但双方都可能带着某些内在抗拒或困惑。' : '这是一段相对和谐、互相理解的关系。';
        } else {
          text += ' 你们的牌位状态不同，可能存在认知差异或不同步的情况，需要更多沟通。';
        }
      } else if (mode === 'choice') {
        text += '选项A（' + deckManager.getCardName(cards[0].card) + ' ' + this.getPosText(cards[0].isReversed) + '）与选项B（' + deckManager.getCardName(cards[1].card) + ' ' + this.getPosText(cards[1].isReversed) + '）';
        text += '呈现出不同的能量走向。';
        text += ' 建议牌（' + deckManager.getCardName(cards[4].card) + ' ' + this.getPosText(cards[4].isReversed) + '）';
        text += '为你的决策提供了重要指引，请仔细体悟这张牌的启示。';
      } else if (mode === 'celtic') {
        text += '十字中心的两张牌——当前情况（' + deckManager.getCardName(cards[0].card) + '）与挑战（' + deckManager.getCardName(cards[1].card) + '）';
        text += '——构成了问题的核心张力。';
        text += ' 过去的能量（' + deckManager.getCardName(cards[2].card) + '）仍在影响着现在，';
        text += '而最终结果牌（' + deckManager.getCardName(cards[9].card) + '）指明了这段旅程可能的归宿。';
      } else {
        for (let i = 0; i < cards.length - 1; i++) {
          const c1 = cards[i], c2 = cards[i + 1];
          if (c1.card.suit === c2.card.suit) {
            text += '「' + positions[i] + '」与「' + positions[i + 1] + '」同为' + c1.card.suit + '  suite，能量有延续性；';
          }
          if (c1.isReversed && !c2.isReversed) {
            text += '从「' + positions[i] + '」的逆位转向「' + positions[i + 1] + '」的正位，说明局势正在好转；';
          }
          if (!c1.isReversed && c2.isReversed) {
            text += '从「' + positions[i] + '」的正位走向「' + positions[i + 1] + '」的逆位，需要警惕潜在风险；';
          }
        }
        if (text === '') text = '各张牌位之间的能量流转较为平稳，没有明显的冲突或突变，整体呈现出渐进式的发展轨迹。';
      }

      html += text + '</div></div>';
      return html;
    }

    // ============ 综合解读 - 分析运势走向 ============
    analyzeTrend(cards) {
      let html = '<div class="reading-section">';
      html += '<div class="reading-section-title">➡ 运势走向</div>';
      html += '<div class="reading-section-body">';

      let text = '';
      const firstHalf = cards.slice(0, Math.ceil(cards.length / 2));
      const secondHalf = cards.slice(Math.ceil(cards.length / 2));
      let firstRev = 0, secondRev = 0;
      firstHalf.forEach((c) => { if (c.isReversed) firstRev++; });
      secondHalf.forEach((c) => { if (c.isReversed) secondRev++; });

      if (secondRev < firstRev) {
        text = '牌面显示整体走势向好——前半段逆位较多，暗示起步或有阻碍；后半段正位增多，预示局面将逐步打开，坚持将有所收获。';
      } else if (secondRev > firstRev) {
        text = '需要留意的走势——前半段相对顺利，但后半段逆位增多，提示后续可能出现变数或挑战，宜未雨绸缪、保持警觉。';
      } else {
        text = '牌面显示能量相对平稳，没有剧烈的好转或恶化。这是一个沉淀和积累的时期，适合稳扎稳打，不宜冒进也不宜消极。';
      }

      const 转折牌En = ['Wheel of Fortune', 'Judgement', 'The Tower', 'Death'];
      const 转折牌Zh = ['命运之轮', '审判', '塔', '死神'];
      cards.forEach((item) => {
        const nameToCheck = this.currentLang === 'en' ? item.card.originalName : item.card.name;
        const 转折牌 = this.currentLang === 'en' ? 转折牌En : 转折牌Zh;
        if (转折牌.includes(nameToCheck)) {
          text += ' 「' + deckManager.getCardName(item.card) + '」的出现预示着重大转折即将到来，请做好迎接变化的心理准备。';
        }
      });

      html += text + '</div></div>';
      return html;
    }

    // ============ 综合解读 - 生成行动建议 ============
    generateAdvice(mode, cards) {
      let html = '<div class="reading-section">';
      html += '<div class="reading-section-title">⚡ 行动建议</div>';
      html += '<div class="reading-section-body">';

      let text = '';
      let adviceCard = null;
      if (mode === 'five' && cards[3]) adviceCard = cards[3];
      else if (mode === 'career' && cards[3]) adviceCard = cards[3];
      else if (mode === 'choice' && cards[4]) adviceCard = cards[4];
      else adviceCard = cards[cards.length - 1];

      if (adviceCard) {
        text += '综合牌面指引，当前最值得采取的态度是：';
        if (!adviceCard.isReversed) {
          text += '积极践行「' + deckManager.getCardName(adviceCard.card) + '」的正位能量——' + adviceCard.card.upright + ' 在具体行动上，';
          if (adviceCard.card.suit === 'wands') text += '请主动出击，不要等待机会来找你。';
          else if (adviceCard.card.suit === 'cups') text += '请倾听内心的声音，跟随直觉做出选择。';
          else if (adviceCard.card.suit === 'swords') text += '请理性分析局势，用清晰的思维指导行动。';
          else if (adviceCard.card.suit === 'pentacles') text += '请专注实际步骤，一步一个脚印地推进计划。';
          else text += '请思考这张牌所传达的核心讯息，并将其融入你的决策中。';
        } else {
          text += '「' + deckManager.getCardName(adviceCard.card) + '」逆位提醒你，';
          text += adviceCard.card.reversed + ' 建议先处理内在阻碍，再重新出发。';
        }
      }

      const reversedCount = cards.filter((item) => item.isReversed).length;
      if (reversedCount >= cards.length * 0.5) {
        text += ' 牌面逆位较多，建议给自己更多耐心和宽容，不要强求立竿见影的结果，允许事物按照自己的节奏展开。';
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

    // ============ 渲染牌位标签 ============
    renderPositionLabels(positions) {
      const container = document.getElementById('position-labels');
      if (!container) return;
      container.innerHTML = '';
      positions.forEach((pos, idx) => {
        const span = document.createElement('span');
        span.className = 'pos-label' + (idx === 0 ? ' active' : '');
        span.textContent = (idx + 1) + '. ' + pos;
        span.dataset.index = idx;
        span.addEventListener('click', () => {
          if (this.currentCards && this.currentCards[idx]) {
            const item = this.currentCards[idx];
            this.showMeaning(item.card, item.isReversed, item.position);
            container.querySelectorAll('.pos-label').forEach((l) => { l.classList.remove('active'); });
            span.classList.add('active');
            const cards = document.querySelectorAll('.tarot-card');
            if (cards[idx]) {
              cards[idx].style.transition = 'box-shadow 0.1s';
              cards[idx].style.boxShadow = '0 0 20px var(--color-gold)';
              setTimeout(() => {
                cards[idx].style.boxShadow = '';
              }, 400);
            }
          }
        });
        container.appendChild(span);
      });
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
        card.innerHTML = (idx + 1) + '<span class="result-diagram-card-label">' + pos + '</span>';

        card.addEventListener('click', () => {
          // 高亮对应牌和位置标签
          container.querySelectorAll('.result-diagram-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');

          const labels = document.querySelectorAll('.pos-label');
          labels.forEach(l => l.classList.remove('active'));
          if (labels[idx]) labels[idx].classList.add('active');

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

          this.renderPositionLabels([singlePos]);
          document.getElementById('page-title').textContent = this.currentLang === 'en' ? 'Single Card' : '单牌占卜';
          this.showSpreadNameTag('single');
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

            const label = document.createElement('div');
            label.className = spreadType + '-pos-label';
            label.textContent = (i + 1) + '. ' + positions[i];
            wrap.appendChild(label);

            ((c, rev, pos, idx) => {
              wrap.addEventListener('click', (e) => {
                e.stopPropagation();
                this.playFlipSound();
                this.showMeaning(c, rev, pos);
                const labels = document.querySelectorAll('.pos-label');
                labels.forEach((l) => { l.classList.remove('active'); });
                if (labels[idx]) labels[idx].classList.add('active');
              });
            })(drawn[i].card, drawn[i].isReversed, positions[i], i);

            if (resultCards) resultCards.appendChild(wrap);
          }

          this.renderPositionLabels(positions);
          this.renderResultSpreadDiagram(spreadType, positions);
          this.showMeaning(drawn[0].card, drawn[0].isReversed, positions[0]);

          document.getElementById('page-title').textContent = this.getLocalizedSpreadName(spreadType);
          this.showSpreadNameTag(spreadType);
          this.setDeckHint(this.currentLang === 'en' ? 'Tap a card to see its meaning' : '点击卡牌查看对应牌义');

          const compContent = document.getElementById('comprehensive-content');
          const compSection = document.getElementById('comprehensive-reading');
          if (compContent && compSection) {
            compContent.innerHTML = this.generateComprehensiveReading();
            compSection.classList.remove('hidden');
            compContent.classList.remove('hidden');
            const tBtn = document.getElementById('toggle-reading-btn');
            if (tBtn) tBtn.textContent = this.currentLang === 'en' ? 'Collapse' : '收起';
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
      this.showLoading(this.getLocalizedLoadingText('celtic'));
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
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

            const wrap = this.createCardEl(drawn[posIdx].card, drawn[posIdx].isReversed, true, 52, 82);
            wrap.classList.add('cc-card-wrap');

            if (posIdx === 1) {
              wrap.style.transform = 'rotate(90deg)';
              wrap.style.zIndex = '2';
            }

            const label = document.createElement('div');
            label.className = 'cc-pos-label';
            label.textContent = (posIdx + 1) + '. ' + positions[posIdx];

            const wrapper = document.createElement('div');
            wrapper.className = 'cc-pos-' + (posIdx + 1);
            wrapper.appendChild(wrap);
            wrapper.appendChild(label);

            ((c, rev, pos, idx) => {
              wrap.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showMeaning(c, rev, pos);
                const labels = document.querySelectorAll('.pos-label');
                labels.forEach((l) => { l.classList.remove('active'); });
                if (labels[idx]) labels[idx].classList.add('active');
              });
            })(drawn[posIdx].card, drawn[posIdx].isReversed, positions[posIdx], posIdx);

            crossGrid.appendChild(wrapper);
          });

          crossContainer.appendChild(crossGrid);

          const staffContainer = document.createElement('div');
          staffContainer.className = 'celtic-cross-staff';

          for (let i = 5; i < 10; i++) {
            this.currentCards.push({ card: drawn[i].card, isReversed: drawn[i].isReversed, position: positions[i] });

            const wrap2 = this.createCardEl(drawn[i].card, drawn[i].isReversed, true, 52, 82);
            wrap2.classList.add('cc-card-wrap');

            const label2 = document.createElement('div');
            label2.className = 'cc-pos-label';
            label2.textContent = (i + 1) + '. ' + positions[i];

            const wrapper2 = document.createElement('div');
            wrapper2.className = 'cc-staff-pos';
            wrapper2.appendChild(wrap2);
            wrapper2.appendChild(label2);

            ((c, rev, pos, idx) => {
              wrap2.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showMeaning(c, rev, pos);
                const labels = document.querySelectorAll('.pos-label');
                labels.forEach((l) => { l.classList.remove('active'); });
                if (labels[idx]) labels[idx].classList.add('active');
              });
            })(drawn[i].card, drawn[i].isReversed, positions[i], i);

            staffContainer.appendChild(wrapper2);
          }

          crossContainer.appendChild(staffContainer);

          if (resultCards) resultCards.appendChild(crossContainer);

          this.renderPositionLabels(positions);
          this.renderResultSpreadDiagram(spreadType, positions);
          this.showMeaning(drawn[0].card, drawn[0].isReversed, positions[0]);

          document.getElementById('page-title').textContent = this.getLocalizedSpreadName('celtic');
          this.showSpreadNameTag('celtic');
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
      }
    }

    // ============ 返回欢迎页 ============
    goBack() {
      this.currentCards = [];
      const panel = document.getElementById('daily-fortune-panel');
      if (panel) panel.classList.add('hidden');
      this.showPage('welcome-page');
    }

    // ============ 显示结果页牌阵名标签 ============
    showSpreadNameTag(spreadType) {
      const tag = document.getElementById('spread-name-tag');
      if (!tag) return;
      const spread = SPREADS[spreadType];
      if (!spread) return;
      const name = this.getLocalizedSpreadName(spreadType);
      tag.textContent = this.currentLang === 'en' ? name + ' Spread' : name;
      tag.classList.remove('hidden');
    }

    // ============ 更新静态 UI 文本 ============
    updateStaticUIText() {
      const pageTitle = document.getElementById('page-title');
      if (pageTitle && this.currentCards.length > 0) {
        pageTitle.textContent = this.getLocalizedSpreadName(this.currentMode);
        this.showSpreadNameTag(this.currentMode);
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

      // 更新位置标签
      const posLabels = document.querySelectorAll('.pos-label');
      const positions = this.getLocalizedPositions(this.currentMode);
      posLabels.forEach((label, idx) => {
        if (positions[idx]) {
          label.textContent = (idx + 1) + '. ' + positions[idx];
        }
      });

      // 更新牌阵内的内联标签
      const inlineLabels = document.querySelectorAll('[class*="-pos-label"]');
      inlineLabels.forEach((label, idx) => {
        if (positions[idx]) {
          const num = label.textContent.match(/^\d+\./);
          if (num) label.textContent = num[0] + ' ' + positions[idx];
        }
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

      text += '\n\n—— ' + (this.currentLang === 'en' ? 'From Harry Potter Tarot' : '来自哈利波特塔罗牌扩展');

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
          alert('占卜结果已复制到剪贴板！');
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
        alert('占卜结果已复制到剪贴板！');
      } catch (e) {
        alert('复制失败，请手动复制结果');
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

    toggleSound() {
      chrome.storage.local.get({ tarot_sound: true }, (result) => {
        const newVal = !result.tarot_sound;
        chrome.storage.local.set({ tarot_sound: newVal });
        const btn = document.getElementById('sound-toggle-btn');
        if (btn) btn.classList.toggle('muted', !newVal);
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

    getDailyFortune() {
      const now = new Date();
      const dateStr = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
      const seed = this.daySeed(dateStr);
      const rng = this.mulberry32(seed);

      const cached = localStorage.getItem('daily_fortune_' + dateStr);
      if (cached) {
        try { return JSON.parse(cached); } catch (e) {}
      }

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
        timestamp: now.getTime()
      };

      try {
        localStorage.setItem('daily_fortune_' + dateStr, JSON.stringify(fortune));
      } catch (e) {}

      return fortune;
    }

    renderDailyFortune() {
      const fortune = this.getDailyFortune();
      const container = document.getElementById('fortune-content');
      if (!container) return;

      const level = this.getLocalizedFortuneLevel(fortune.level);
      const dims = fortune.dimensions;
      const luckyColor = this.getLocalizedLuckyColor(fortune.luckyColor);
      const luckyDir = this.getLocalizedDirection(fortune.luckyDirection);
      const advice = this.getLocalizedAdvice(fortune.level.text);
      const dailyTip = this.getLocalizedDailyTip(fortune.dailyTip);

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

      let html = '';

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
      html += '<div class="fortune-lucky-value"><span class="fortune-color-swatch" style="background:' + luckyColor.hex + ';"></span>' + luckyColor.name + '</div>';
      html += '</div>';
      html += '<div class="fortune-lucky-item">';
      html += '<div class="fortune-lucky-label">' + this.t('fortune_lucky_number') + '</div>';
      html += '<div class="fortune-lucky-value">' + fortune.luckyNumber;
      if (fortune.luckyNumberRoot === 11 || fortune.luckyNumberRoot === 22) {
        html += ' <span style="color:#FF9800;font-size:9px;">(灵数' + fortune.luckyNumberRoot + ')</span>';
      } else if (fortune.luckyNumberRoot) {
        html += ' <span style="color:var(--color-text-muted);font-size:9px;">(数字根' + fortune.luckyNumberRoot + ')</span>';
      }
      html += '</div>';
      html += '</div>';
      html += '<div class="fortune-lucky-item">';
      html += '<div class="fortune-lucky-label">' + this.t('fortune_lucky_direction') + '</div>';
      html += '<div class="fortune-lucky-value">' + luckyDir + '</div>';
      html += '</div>';
      html += '</div></div>';

      html += '<div class="fortune-section">';
      html += '<div class="fortune-section-title">' + this.t('fortune_dos_donts') + '</div>';
      html += '<div class="fortune-section-body">';
      html += '<div style="color:#4CAF50;font-size:11px;margin-bottom:3px;">' + advice.suit + '</div>';
      html += '<div style="color:#F44336;font-size:11px;">' + advice.avoid + '</div>';
      html += '</div></div>';

      html += '<div class="fortune-section">';
      html += '<div class="fortune-section-title">' + this.t('fortune_tips') + '</div>';
      html += '<div class="fortune-section-body" style="font-style:italic;color:var(--color-gold-light);">' + dailyTip + '</div>';
      html += '</div>';

      container.innerHTML = html;

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

    // ============ 命运数字生成器 ============
    showNumberGenPage() {
      const minInput = document.getElementById('numgen-min');
      const maxInput = document.getElementById('numgen-max');
      const qtyInput = document.getElementById('numgen-qty');
      const resultDiv = document.getElementById('numgen-result');
      const regenBtn = document.getElementById('numgen-regenerate-btn');
      const numbersContainer = document.getElementById('numgen-numbers');
      const copyBtn = document.getElementById('numgen-copy-btn');
      if (resultDiv) resultDiv.classList.add('hidden');
      if (regenBtn) regenBtn.classList.add('hidden');
      if (minInput) minInput.value = 1;
      if (maxInput) maxInput.value = 100;
      if (qtyInput) qtyInput.value = 1;
      if (numbersContainer) numbersContainer.innerHTML = '';
      if (copyBtn) copyBtn.textContent = this.t('numgen_copy');
      this.loadNumgenHistory();
      this.showPage('number-gen-page');
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

      // 显示数字
      const isMulti = numbers.length > 1;
      if (numbersContainer) {
        numbersContainer.innerHTML = numbers.map(n =>
          '<div class="numgen-number-wrap">' +
            '<span class="numgen-number">' + n + '</span>' +
          '</div>'
        ).join('');
        numbersContainer.classList.toggle('multi', isMulti);
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
      listEl.innerHTML = history.slice(0, 5).map(item => {
        const d = new Date(item.time);
        const timeStr = (d.getMonth() + 1) + '/' + d.getDate() + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
        // 兼容旧数据（number 为数字）和新数据（numbers 为数组）
        const nums = Array.isArray(item.numbers) ? item.numbers : [item.number];
        const numDisplay = nums.join(this.currentLang === 'en' ? ', ' : '、');
        const numShort = numDisplay.length > 15 ? numDisplay.slice(0, 15) + '…' : numDisplay;
        return '<div class="numgen-history-item">' +
          '<span class="num" title="' + numDisplay + '">' + numShort + '</span>' +
          '<span class="meta">区间 ' + item.min + '-' + item.max + ' · ' + timeStr + '</span>' +
          '</div>';
      }).join('');
    }

    clearNumgenHistory() {
      localStorage.removeItem('numgen_history');
      this.loadNumgenHistory();
    }

    copyNumgenNumber() {
      const container = document.getElementById('numgen-numbers');
      if (!container) return;
      const nums = Array.from(container.querySelectorAll('.numgen-number'))
        .map(el => el.textContent.trim())
        .join(this.currentLang === 'en' ? ', ' : '、');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(nums).catch(() => {});
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

        const spreadBtns = document.querySelectorAll('.spread-btn');
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
            advanced: this.t('filter_advanced') || '复杂'
          };

          preview.innerHTML =
            '<div class="hover-title">' + spread.name + '</div>' +
            '<div class="hover-meta">' +
              '<span class="hover-meta-tag">' + (diffStars[spread.difficulty] || '★☆☆') + '</span>' +
              '<span class="hover-meta-tag">' + (catLabels[spread.category] || spread.category) + '</span>' +
              '<span class="hover-meta-tag">' + spread.positions.length + '张牌</span>' +
            '</div>' +
            '<div class="hover-usage">' + (spread.usage || '') + '</div>';

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
      const previewRect = preview.getBoundingClientRect();
      let left = rect.right + 10;
      let top = rect.top;

      // 防止超出右边界
      if (left + 260 > window.innerWidth) {
        left = rect.left - 270;
      }
      // 防止超出下边界
      if (top + preview.offsetHeight > window.innerHeight) {
        top = window.innerHeight - preview.offsetHeight - 10;
      }
      // 防止超出上边界
      if (top < 0) top = 10;

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
        }

        // 恢复音效开关状态
        chrome.storage.local.get({ tarot_sound: true }, (result) => {
          const btn = document.getElementById('sound-toggle-btn');
          if (btn) btn.classList.toggle('muted', !result.tarot_sound);
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
      const spreadBtns = document.querySelectorAll('.spread-btn');
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
            }
          } catch (err) {
            console.error('抽牌错误:', err);
            alert('抽牌出错: ' + err.message);
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
            const activeLabel = document.querySelector('.pos-label.active');
            const activeIdx = activeLabel ? parseInt(activeLabel.dataset.index || '0') : 0;
            const item = this.currentCards[activeIdx] || this.currentCards[0];
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
          this.renderDailyFortune();
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
        general: 'cat_general', career: 'cat_career', advanced: 'filter_advanced'
      };
      const catKey = categoryKeyMap[spread.category] || spread.category;
      const catLabel = this.t(catKey) || spread.category;

      let html = '';
      html += '<div class="spread-detail-header">';
      html += '  <div class="spread-detail-title">' + spread.name + '</div>';
      html += '  <div class="spread-detail-tags">';
      html += '    <span class="spread-detail-tag" style="color:' + diffColor + ';border-color:' + diffColor + '">' + diffLabel + '</span>';
      html += '    <span class="spread-detail-tag">' + catLabel + '</span>';
      html += '    <span class="spread-detail-tag">' + spread.positions.length + '张牌</span>';
      html += '  </div>';
      html += '</div>';

      // 视觉示意图
      html += this.getSpreadDiagramHtml(spreadKey);

      html += '<div class="spread-detail-usage">';
      html += '  <div class="spread-detail-section-title">' + (this.currentLang === 'en' ? 'When to Use' : '适用场景') + '</div>';
      html += '  <div class="spread-detail-text">' + (spread.usage || '') + '</div>';
      html += '</div>';

      html += '<div class="spread-detail-positions">';
      html += '  <div class="spread-detail-section-title">' + (this.currentLang === 'en' ? 'Positions' : '牌位含义') + '</div>';
      for (let i = 0; i < spread.positions.length; i++) {
        html += '<div class="spread-detail-position">';
        html += '  <div class="spread-detail-pos-name">' + (i + 1) + '. ' + spread.positions[i] + '</div>';
        html += '  <div class="spread-detail-pos-desc">' + (spread.positionMeanings[i] || '') + '</div>';
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
