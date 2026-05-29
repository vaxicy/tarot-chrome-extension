// 马赛塔罗牌数据 - 78张牌（优化版）
// 马赛塔罗是历史最悠久的塔罗牌体系，图案更偏象征主义
// 新增字段：element, keywords, uprightBrief, reversedBrief, imageUrl, translations
const marseilleCards = [
  // ============ 大阿卡纳 Major Arcana (22张) ============
  {
    id: 0, name: "愚者", originalName: "Le Mat", suit: "major", element: "风",
    keywords: ["新的开始", "纯真", "自由", "冒险", "无限可能"],
    uprightBrief: "全新的开始信任何宇宙", reversedBrief: "盲目冲动缺乏规划",
    imageUrl: "icons/major/tarot-major-00.png",
    upright: "新的开始，带着纯真与信任踏上旅程。拥抱变化，放下恐惧，相信宇宙会接住你。这是充满潜能的起点。",
    reversed: "盲目冲动或逃避责任。可能被幻想蒙蔽，需要更务实地评估风险，避免不计后果的跳跃。",
    translations: {
      en: {
        upright: "A new beginning, embarking on a journey with innocence and trust. Embrace change, let go of fear, and believe the universe will catch you. This is a starting point full of potential.",
        reversed: "Reckless impulse or evading responsibility. You may be blinded by fantasies and need to assess risks more pragmatically to avoid reckless leaps."
      }
    }
  },
  {
    id: 1, name: "魔术师", originalName: "Le Bateleur", suit: "major", element: "风",
    keywords: ["巧思", "创造力", "行动力", "资源", "意志力"],
    uprightBrief: "巧思与创造力", reversedBrief: "才能被误用或缺乏自信",
    imageUrl: "icons/major/tarot-major-01.png",
    upright: "巧思与创造力。马赛传统中魔术师手持魔杖，象征将创意转化为现实的能力。沟通与行动力兼备。",
    reversed: "才能被误用或缺乏自信。可能感到资源不足，需要重新评估自己的真正能力。",
    translations: {
      en: {
        upright: "Ingenuity and creativity. In the Marseille tradition, the Magician holds a wand, symbolizing the ability to turn creativity into reality. Communication and action go hand in hand.",
        reversed: "Talents are misused or lack of self-confidence. You may feel resources are insufficient and need to re-evaluate your true abilities."
      }
    }
  },
  {
    id: 2, name: "女祭司", originalName: "La Papesse", suit: "major", element: "水",
    keywords: ["内在智慧", "直觉", "神秘", "隐秘知识", "静心"],
    uprightBrief: "内在的智慧与直觉", reversedBrief: "忽视直觉或过于理性",
    imageUrl: "icons/major/tarot-major-02.png",
    upright: "内在的智慧与直觉。马赛传统中她代表神圣的女性力量与隐秘知识。静心倾听内心的声音。",
    reversed: "忽视直觉或过于理性。可能被表象迷惑，需要重新连接内在的智慧源泉。",
    translations: {
      en: {
        upright: "Inner wisdom and intuition. In the Marseille tradition, she represents divine feminine power and hidden knowledge. Quietly listen to the voice within.",
        reversed: "Ignoring intuition or being overly rational. You may be deceived by appearances and need to reconnect with the source of inner wisdom."
      }
    }
  },
  {
    id: 3, name: "女皇", originalName: "L'Imperatrice", suit: "major", element: "土",
    keywords: ["丰饶", "创造力", "母性", "感官", "富足"],
    uprightBrief: "丰饶与创造力", reversedBrief: "创造力受阻过度放纵",
    imageUrl: "icons/major/tarot-major-03.png",
    upright: "丰饶与创造力。马赛牌中女皇与大自然紧密相连，代表物质世界的富足与感官的愉悦。",
    reversed: "创造力受阻或过度放纵。可能缺乏自我滋养，需要在给予他人前先照顾好自己。",
    translations: {
      en: {
        upright: "Abundance and creativity. In the Marseille deck, the Empress is closely connected to nature, representing material world abundance and sensory pleasure.",
        reversed: "Creativity is blocked or excessive indulgence. You may lack self-nurturing and need to take care of yourself before giving to others."
      }
    }
  },
  {
    id: 4, name: "皇帝", originalName: "L'Empereur", suit: "major", element: "火",
    keywords: ["权威", "稳定", "秩序", "结构", "控制"],
    uprightBrief: "权威与稳定", reversedBrief: "专制固执缺乏自律",
    imageUrl: "icons/major/tarot-major-04.png",
    upright: "权威与稳定。马赛传统中皇帝代表世俗的权力与结构。建立秩序，用理性引领方向。",
    reversed: "专制固执或缺乏自律。可能面临权威的挑战，需要学会灵活变通，而非一味控制。",
    translations: {
      en: {
        upright: "Authority and stability. In the Marseille tradition, the Emperor represents secular power and structure. Establish order, lead with reason.",
        reversed: "Autocratic stubbornness or lack of self-discipline. You may face challenges to authority and need to learn flexibility rather than rigid control."
      }
    }
  },
  {
    id: 5, name: "教皇", originalName: "Le Pape", suit: "major", element: "土",
    keywords: ["传统", "信仰", "指引", "道德", "价值观"],
    uprightBrief: "精神指引与传统智慧", reversedBrief: "挑战传统或精神束缚",
    imageUrl: "icons/major/tarot-major-05.png",
    upright: "精神指引与传统智慧。马赛牌中教皇代表宗教与道德权威，遵循传统价值观寻找人生方向。",
    reversed: "挑战传统或感到精神束缚。需要打破常规，寻找属于你自己的真理与独立道路。",
    translations: {
      en: {
        upright: "Spiritual guidance and traditional wisdom. In the Marseille deck, the Pope represents religious and moral authority. Follow traditional values to find life's direction.",
        reversed: "Challenging tradition or feeling spiritually constrained. You need to break conventions and find your own truth and independent path."
      }
    }
  },
  {
    id: 6, name: "恋人", originalName: "L'Amoureux", suit: "major", element: "风",
    keywords: ["选择", "价值观", "和谐", "关系", "结合"],
    uprightBrief: "重要的抉择与价值观契合", reversedBrief: "价值观冲突或选择困难",
    imageUrl: "icons/major/tarot-major-06.png",
    upright: "重要的抉择与价值观的契合。马赛传统中这张牌代表人生重大抉择，需要在不同道路中做出选择。",
    reversed: "价值观冲突或选择困难。可能面临两难境地，需要诚实地面对自己的内心愿望。",
    translations: {
      en: {
        upright: "Important choices and alignment of values. In the Marseille tradition, this card represents major life decisions, needing to choose among different paths.",
        reversed: "Conflicting values or difficulty choosing. You may face a dilemma and need to honestly confront your inner desires."
      }
    }
  },
  {
    id: 7, name: "战车", originalName: "Le Chariot", suit: "major", element: "水",
    keywords: ["意志", "胜利", "控制", "决心", "行动力"],
    uprightBrief: "意志的胜利", reversedBrief: "失去控制方向不明",
    imageUrl: "icons/major/tarot-major-07.png",
    upright: "意志的胜利。马赛牌中战车由两匹马拉动，象征需要平衡对立力量才能前进。决心与自律带来成功。",
    reversed: "失去控制或方向不明。可能遇到阻碍与挫折，需要重新调整心态与策略才能继续前进。",
    translations: {
      en: {
        upright: "The victory of will. In the Marseille deck, the Chariot is pulled by two horses, symbolizing the need to balance opposing forces to move forward. Determination and self-discipline bring success.",
        reversed: "Loss of control or unclear direction. You may encounter obstacles and setbacks, need to re-adjust your mindset and strategy to move forward."
      }
    }
  },
  {
    id: 8, name: "力量", originalName: "La Force", suit: "major", element: "火",
    keywords: ["勇气", "耐心", "温柔", "内在力量", "自信"],
    uprightBrief: "内在力量与温柔的勇气", reversedBrief: "自我怀疑内心恐惧",
    imageUrl: "icons/major/tarot-major-08.png",
    upright: "内在的力量与温柔的勇气。马赛传统中力量代表以柔克刚，用耐心与同理心克服困难。",
    reversed: "自我怀疑或内心恐惧。可能感到力量不足，需要重新连接内在的自信源泉。",
    translations: {
      en: {
        upright: "Inner strength and gentle courage. In the Marseille tradition, Strength represents overcoming with softness, using patience and empathy to overcome difficulties.",
        reversed: "Self-doubt or inner fear. You may feel lacking in strength and need to reconnect with the source of inner confidence."
      }
    }
  },
  {
    id: 9, name: "隐士", originalName: "L'Hermite", suit: "major", element: "土",
    keywords: ["内省", "智慧", "孤独", "寻求", "谨慎"],
    uprightBrief: "内省与寻求真理", reversedBrief: "孤立过度拒绝帮助",
    imageUrl: "icons/major/tarot-major-09.png",
    upright: "内省与寻求真理。马赛牌中隐士手持明灯，象征在孤独中寻找内在的指引与智慧。",
    reversed: "孤立过度或拒绝帮助。可能在逃避现实责任，需要重新融入世界并分享你的光芒。",
    translations: {
      en: {
        upright: "Introspection and seeking truth. In the Marseille deck, the Hermit holds a lantern, symbolizing the search for inner guidance and wisdom in solitude.",
        reversed: "Excessive isolation or refusing help. You may be escaping real-world responsibilities and need to re-engage with the world and share your light."
      }
    }
  },
  {
    id: 10, name: "命运之轮", originalName: "La Roue de Fortune", suit: "major", element: "火",
    keywords: ["命运", "转变", "周期", "机遇", "轮回"],
    uprightBrief: "命运的转变与机遇到来", reversedBrief: "抗拒不确定的变化",
    imageUrl: "icons/major/tarot-major-10.png",
    upright: "命运的转变与机遇到来。马赛传统中命运之轮象征轮回与变化，接受生活的起伏是智慧的表现。",
    reversed: "抗拒不确定的变化。可能感到命运不公，但记住车轮总会转动，困难只是暂时的。",
    translations: {
      en: {
        upright: "The transformation of fate and the arrival of opportunity. In the Marseille tradition, the Wheel of Fortune symbolizes cycles and change. Accepting life's ups and downs is a sign of wisdom.",
        reversed: "Resisting uncertain changes. You may feel fate is unfair, but remember the wheel always turns. Difficulties are only temporary."
      }
    }
  },
  {
    id: 11, name: "正义", originalName: "La Justice", suit: "major", element: "风",
    keywords: ["公正", "因果", "判断", "诚实", "平衡"],
    uprightBrief: "公正与因果法则", reversedBrief: "不公正或逃避责任",
    imageUrl: "icons/major/tarot-major-11.png",
    upright: "公正与因果法则。马赛牌中正义手持天平与剑，象征清晰的判断与诚实面对自己的行为后果。",
    reversed: "不公正或逃避责任。可能面临不公平的对待，需要坚持真理并寻求正义。",
    translations: {
      en: {
        upright: "Justice and the law of cause and effect. In the Marseille deck, Justice holds scales and a sword, symbolizing clear judgment and honestly facing the consequences of your actions.",
        reversed: "Injustice or evading responsibility. You may face unfair treatment and need to uphold the truth and seek justice."
      }
    }
  },
  {
    id: 12, name: "倒吊人", originalName: "Le Pendu", suit: "major", element: "水",
    keywords: ["牺牲", "等待", "换个角度", "放手", "臣服"],
    uprightBrief: "牺牲与等待的智慧", reversedBrief: "拖延或不必要的执着",
    imageUrl: "icons/major/tarot-major-12.png",
    upright: "牺牲与等待的智慧。马赛传统中倒吊人代表自愿的牺牲，在等待中获得更深的理解与转机。",
    reversed: "拖延或不必要的执着。可能陷入僵局无法自拔，需要采取行动而非被动等待。",
    translations: {
      en: {
        upright: "The wisdom of sacrifice and waiting. In the Marseille tradition, the Hanged Man represents voluntary sacrifice, gaining deeper understanding and a turning point in waiting.",
        reversed: "Procrastination or unnecessary attachment. You may be trapped in a deadlock and need to take action rather than wait passively."
      }
    }
  },
  {
    id: 13, name: "死神", originalName: "La Mort", suit: "major", element: "水",
    keywords: ["结束", "转化", "重生", "释放", "蜕变"],
    uprightBrief: "结束与转化", reversedBrief: "抗拒变化无法放下过去",
    imageUrl: "icons/major/tarot-major-13.png",
    upright: "结束与转化。马赛牌中死神骑着白马，象征不可逆转的转变。接受结束才能迎接新生。",
    reversed: "抗拒变化或无法放下过去。可能陷入停滞，勇敢面对结束才能迎来新生。",
    translations: {
      en: {
        upright: "Ending and transformation. In the Marseille deck, Death rides a white horse, symbolizing irreversible transformation. Accept the ending to welcome new life.",
        reversed: "Resisting change or unable to let go of the past. You may be stuck in stagnation. Bravely face the ending to welcome new life."
      }
    }
  },
  {
    id: 14, name: "节制", originalName: "Tempérance", suit: "major", element: "火",
    keywords: ["平衡", "调和", "耐心", "融合", "融合"],
    uprightBrief: "平衡与调和", reversedBrief: "失衡或过度行为",
    imageUrl: "icons/major/tarot-major-14.png",
    upright: "平衡与调和。马赛传统中节制天使将水在两个容器间倒来倒去，象征融合对立力量达到和谐。",
    reversed: "失衡或过度行为。可能缺乏远见或过于冲动，需要重新寻找生活的平衡点。",
    translations: {
      en: {
        upright: "Balance and moderation. In the Marseille tradition, the Temperance angel pours water between two vessels, symbolizing the blending of opposing forces to achieve harmony.",
        reversed: "Imbalance or excessive behavior. You may lack foresight or be too impulsive. Need to rediscover life's balance point."
      }
    }
  },
  {
    id: 15, name: "恶魔", originalName: "Le Diable", suit: "major", element: "土",
    keywords: ["束缚", "欲望", "阴影", "物质", "诱惑"],
    uprightBrief: "面对内心的阴影与束缚", reversedBrief: "从束缚中解放",
    imageUrl: "icons/major/tarot-major-15.png",
    upright: "面对内心的阴影与束缚。马赛牌中恶魔代表被欲望和执念所困。认识到束缚来自于内心。",
    reversed: "从束缚中解放。打破旧有模式重获自由，意识到自己的力量，摆脱负面影响。",
    translations: {
      en: {
        upright: "Face your inner shadow and bonds. In the Marseille deck, the Devil represents being trapped by desires and obsessions. Realize that the bonds come from within.",
        reversed: "Liberation from bonds. Break old patterns and regain freedom. Realize your own power and shake off negative influences."
      }
    }
  },
  {
    id: 16, name: "塔", originalName: "La Maison Dieu", suit: "major", element: "火",
    keywords: ["突变", "崩塌", "重建", "觉醒", "觉醒"],
    uprightBrief: "突然的转变与崩塌", reversedBrief: "避免灾难延迟必然改变",
    imageUrl: "icons/major/tarot-major-16.png",
    upright: "突然的转变与崩塌。马赛传统中塔代表神性的介入，旧结构必须被摧毁才能重建。",
    reversed: "避免灾难或延迟必然的改变。内在的动荡需要释放，逃避只会让情况变得更糟。",
    translations: {
      en: {
        upright: "Sudden transformation and collapse. In the Marseille tradition, the Tower represents divine intervention. Old structures must be destroyed to be rebuilt.",
        reversed: "Avoiding disaster or delaying inevitable change. Inner turmoil needs release. Escaping will only make the situation worse."
      }
    }
  },
  {
    id: 17, name: "星星", originalName: "L'Etoile", suit: "major", element: "风",
    keywords: ["希望", "灵感", "治愈", "信仰", "灵感"],
    uprightBrief: "希望与灵性指引", reversedBrief: "失去希望或过于理想化",
    imageUrl: "icons/major/tarot-major-17.png",
    upright: "希望与灵性指引。马赛牌中星星代表夜空中的希望之光，在黑暗中保持信心与灵感。",
    reversed: "失去希望或感到绝望。需要重新连接内心的信仰，在困境中寻找微光并脚踏实地。",
    translations: {
      en: {
        upright: "Hope and spiritual guidance. In the Marseille deck, the Star represents the light of hope in the night sky. Maintain confidence and inspiration in darkness.",
        reversed: "Lost hope or feeling despair. Need to reconnect with inner faith, find the glimmer in difficult situations and keep your feet on the ground."
      }
    }
  },
  {
    id: 18, name: "月亮", originalName: "La Lune", suit: "major", element: "水",
    keywords: ["幻觉", "恐惧", "潜意识", "不确定", "不确定"],
    uprightBrief: "幻觉与不确定性的时期", reversedBrief: "恐惧消散真相大白",
    imageUrl: "icons/major/tarot-major-18.png",
    upright: "幻觉与不确定性的时期。马赛传统中月亮代表不确定性与隐藏的恐惧。信任直觉但小心错觉。",
    reversed: "恐惧消散，真相逐渐浮现。走出迷茫，清晰地看到事物的本质。",
    translations: {
      en: {
        upright: "A period of illusion and uncertainty. In the Marseille tradition, the Moon represents uncertainty and hidden fears. Trust intuition but be careful of delusions.",
        reversed: "Fears dissipate, truth gradually emerges. Walk out of confusion, clearly see the essence of things."
      }
    }
  },
  {
    id: 19, name: "太阳", originalName: "Le Soleil", suit: "major", element: "火",
    keywords: ["光明", "成功", "喜悦", "活力", "活力"],
    uprightBrief: "光明与成功", reversedBrief: "暂时的阴霾或过度乐观",
    imageUrl: "icons/major/tarot-major-19.png",
    upright: "光明与成功。马赛牌中太阳代表纯粹的生命力与喜悦，一切在阳光下无所隐藏。",
    reversed: "暂时的阴霾或过度乐观。可能需要调整期望，在光明中寻找真实而非幻象。",
    translations: {
      en: {
        upright: "Light and success. In the Marseille deck, the Sun represents pure vitality and joy. Nothing is hidden under the sun.",
        reversed: "Temporary gloom or excessive optimism. You may need to adjust expectations, seeking truth rather than illusion in the light."
      }
    }
  },
  {
    id: 20, name: "审判", originalName: "Le Jugement", suit: "major", element: "火",
    keywords: ["觉醒", "重生", "救赎", "反思", "救赎"],
    uprightBrief: "觉醒与重生", reversedBrief: "自我怀疑拒绝反思",
    imageUrl: "icons/major/tarot-major-20.png",
    upright: "觉醒与重生。马赛传统中审判代表灵魂的觉醒，过去的行为需要被审视与宽恕。",
    reversed: "自我怀疑或拒绝反思。可能在逃避过去的错误，需要勇敢地面对并寻求救赎。",
    translations: {
      en: {
        upright: "Awakening and rebirth. In the Marseille tradition, Judgement represents the awakening of the soul. Past actions need to be examined and forgiven.",
        reversed: "Self-doubt or refusing reflection. You may be escaping past mistakes and need to bravely face them and seek redemption."
      }
    }
  },
  {
    id: 21, name: "世界", originalName: "Le Monde", suit: "major", element: "土",
    keywords: ["完成", "圆满", "成就", "整合", "整合"],
    uprightBrief: "完成与圆满", reversedBrief: "未完成或延迟成功",
    imageUrl: "icons/major/tarot-major-21.png",
    upright: "完成与圆满。马赛牌中世界代表旅程的完美结束，达成与宇宙的和解与融合。",
    reversed: "未完成或延迟成功。可能急于求成，需要完善细节才能真正达成目标。",
    translations: {
      en: {
        upright: "Completion and fulfillment. In the Marseille deck, the World represents the perfect ending of a journey, achieving reconciliation and fusion with the universe.",
        reversed: "Incomplete or delayed success. You may be eager for quick results. Need to perfect the details to truly achieve your goal."
      }
    }
  },

  // ============ 小阿卡纳 - 权杖 Wands (14张) ============
  {
    id: "W1", name: "权杖王牌", originalName: "As de Bâtons", suit: "wands", element: "火",
    keywords: ["创意", "新开始", "潜力", "行动", "潜力"], uprightBrief: "创意的新火花", reversedBrief: "创意受阻延迟开始",
    imageUrl: "icons/wands/tarot-wands-01.png",
    upright: "创意的新火花。马赛牌中权杖王牌代表原始的生命力与行动力，充满激情地开始新项目。",
    reversed: "创意受阻或延迟开始。可能缺乏信心，需要重新点燃内心的火焰。",
    translations: {
      en: {
        upright: "A new spark of creativity. In the Marseille deck, the Ace of Wands represents primal vitality and action power. Start new projects with passion.",
        reversed: "Creativity is blocked or delayed start. You may lack confidence and need to rekindle the inner flame."
      }
    }
  },
  {
    id: "W2", name: "权杖二", originalName: "Deux de Bâtons", suit: "wands", element: "火",
    keywords: ["规划", "远见", "扩张", "决策", "决策"], uprightBrief: "规划与远见", reversedBrief: "恐惧改变计划延迟",
    imageUrl: "icons/wands/tarot-wands-02.png",
    upright: "规划与远见。站在高处俯瞰未来，制定长远计划。这是扩张和探索新领域的好时机。",
    reversed: "恐惧改变或计划延迟。可能在犹豫不决，需要勇敢地迈出舒适区。",
    translations: {
      en: {
        upright: "Planning and foresight. Overlook the future from a high vantage point, make long-term plans. This is a good time for expansion and exploring new territories.",
        reversed: "Fear of change or delayed plans. You may be hesitating and need to bravely step out of your comfort zone."
      }
    }
  },
  {
    id: "W3", name: "权杖三", originalName: "Trois de Bâtons", suit: "wands", element: "火",
    keywords: ["远见", "成果", "扩展", "等待", "进展"], uprightBrief: "远见卓识开始显现成果", reversedBrief: "进展延迟视野受限",
    imageUrl: "icons/wands/tarot-wands-03.png",
    upright: "远见卓识开始显现成果。等待已久的机会终于到来，扩展视野迎接更广阔的天地。",
    reversed: "进展延迟或视野受限。可能遇到障碍，需要重新评估长期策略。",
    translations: {
      en: {
        upright: "Foresight begins to show results. The long-awaited opportunity has finally arrived. Expand your vision to welcome broader horizons.",
        reversed: "Progress is delayed or vision is limited. You may encounter obstacles and need to re-evaluate long-term strategies."
      }
    }
  },
  {
    id: "W4", name: "权杖四", originalName: "Quatre de Bâtons", suit: "wands", element: "火",
    keywords: ["庆祝", "和谐", "稳定", "团聚", "稳定"], uprightBrief: "庆祝与和谐", reversedBrief: "不和谐延迟的庆祝",
    imageUrl: "icons/wands/tarot-wands-04.png",
    upright: "庆祝与和谐。努力得到回报，享受成果和团聚的喜悦。这是稳定与幸福的时刻。",
    reversed: "不和谐或延迟的庆祝。可能缺乏稳定感，需要建立更牢固的基础。",
    translations: {
      en: {
        upright: "Celebration and harmony. Efforts are rewarded, enjoy the fruits and the joy of reunion. This is a moment of stability and happiness.",
        reversed: "Disharmony or delayed celebration. You may lack a sense of stability and need to build a stronger foundation."
      }
    }
  },
  {
    id: "W5", name: "权杖五", originalName: "Cinq de Bâtons", suit: "wands", element: "火",
    keywords: ["竞争", "冲突", "成长", "观点", "成长"], uprightBrief: "竞争与冲突", reversedBrief: "避免冲突内在混乱",
    imageUrl: "icons/wands/tarot-wands-05.png",
    upright: "竞争与冲突。不同的观点相互碰撞，这是通过竞争获得成长的机会，保持开放心态。",
    reversed: "避免冲突或内在的混乱。可能感到不堪重负，需要找到和平的解决方案。",
    translations: {
      en: {
        upright: "Competition and conflict. Different viewpoints collide. This is an opportunity for growth through competition. Keep an open mind.",
        reversed: "Avoiding conflict or inner chaos. You may feel overwhelmed and need to find a peaceful solution."
      }
    }
  },
  {
    id: "W6", name: "权杖六", originalName: "Six de Bâtons", suit: "wands", element: "火",
    keywords: ["胜利", "认可", "自信", "成功", "自信"], uprightBrief: "胜利与认可", reversedBrief: "缺乏认可或自大",
    imageUrl: "icons/wands/tarot-wands-06.png",
    upright: "胜利与认可。你的努力得到了应有的赞赏。自信地前进，成功正在向你招手。",
    reversed: "缺乏认可或自大。可能感到被忽视，或者过于自负需要保持谦逊。",
    translations: {
      en: {
        upright: "Victory and recognition. Your efforts have received due appreciation. Move forward confidently, success is beckoning to you.",
        reversed: "Lack of recognition or arrogance. You may feel overlooked, or you may be too arrogant and need to remain humble."
      }
    }
  },
  {
    id: "W7", name: "权杖七", originalName: "Sept de Bâtons", suit: "wands", element: "火",
    keywords: ["防御", "坚持", "勇气", "挑战", "挑战"], uprightBrief: "坚守立场和防御", reversedBrief: "不堪重负放弃抵抗",
    imageUrl: "icons/wands/tarot-wands-07.png",
    upright: "坚守立场和防御。面对挑战需要勇气和毅力。相信自己的立场不要轻易放弃。",
    reversed: "不堪重负或放弃抵抗。可能感到无法继续，需要重新评估是否值得这场战斗。",
    translations: {
      en: {
        upright: "Hold your ground and defend. Facing challenges requires courage and perseverance. Believe in your position, don't give up easily.",
        reversed: "Overwhelmed or giving up resistance. You may feel unable to continue and need to re-evaluate whether this battle is worth it."
      }
    }
  },
  {
    id: "W8", name: "权杖八", originalName: "Huit de Bâtons", suit: "wands", element: "火",
    keywords: ["快速", "进展", "消息", "行动", "迅速"], uprightBrief: "快速进展和能量流动", reversedBrief: "延迟缺乏方向",
    imageUrl: "icons/wands/tarot-wands-08.png",
    upright: "快速进展和能量流动。事情正在加速发展，把握时机迅速行动。",
    reversed: "延迟或缺乏方向。可能感到事情停滞，需要重新找到行动的节奏。",
    translations: {
      en: {
        upright: "Rapid progress and energy flow. Things are accelerating. Seize the moment and act swiftly.",
        reversed: "Delay or lack of direction. You may feel things are stagnant and need to rediscover the rhythm of action."
      }
    }
  },
  {
    id: "W9", name: "权杖九", originalName: "Neuf de Bâtons", suit: "wands", element: "火",
    keywords: ["韧性", "坚持", "防御", "警惕", "警惕"], uprightBrief: "韧性和持久的防御", reversedBrief: "精疲力竭或偏执",
    imageUrl: "icons/wands/tarot-wands-09.png",
    upright: "韧性和持久的防御。虽然疲惫但依然坚持。你已经接近终点，再坚持一下。",
    reversed: "精疲力竭或偏执。可能承担了太多，需要学会放下一些负担。",
    translations: {
      en: {
        upright: "Resilience and persistent defense. Though tired, you still persist. You are close to the finish line, hold on a little longer.",
        reversed: "Exhausted or paranoid. You may have taken on too much and need to learn to let go of some burdens."
      }
    }
  },
  {
    id: "W10", name: "权杖十", originalName: "Dix de Bâtons", suit: "wands", element: "火",
    keywords: ["责任", "压力", "负担", "坚持", "负担"], uprightBrief: "承担重任和压力", reversedBrief: "释放负担或无法承受",
    imageUrl: "icons/wands/tarot-wands-10.png",
    upright: "承担重任和压力。虽然艰难但你能够承受，有时需要放下一些负担才能轻装前行。",
    reversed: "释放负担或无法承受。可能终于放下了重担，或者需要寻求帮助来完成任务。",
    translations: {
      en: {
        upright: "Bearing heavy responsibilities and pressure. Though difficult, you can endure. Sometimes you need to put down some burdens to move forward lightly.",
        reversed: "Releasing burdens or unable to bear. You may have finally put down the heavy load, or need to seek help to complete the task."
      }
    }
  },
  {
    id: "W11", name: "权杖侍从", originalName: "Valet de Bâtons", suit: "wands", element: "火",
    keywords: ["热情", "新想法", "冒险", "探索", "探索"], uprightBrief: "充满热情的新想法", reversedBrief: "延迟或鲁莽",
    imageUrl: "icons/wands/tarot-wands-11.png",
    upright: "充满热情的新想法。冒险精神和自由探索的欲望。保持好奇心，勇敢尝试新事物。",
    reversed: "延迟或鲁莽。可能缺乏方向或过于冲动，需要更有计划地行动。",
    translations: {
      en: {
        upright: "Enthusiastic new ideas. The spirit of adventure and the desire for free exploration. Stay curious, bravely try new things.",
        reversed: "Delay or recklessness. You may lack direction or be too impulsive. Need to act with more planning."
      }
    }
  },
  {
    id: "W12", name: "权杖骑士", originalName: "Cavalier de Bâtons", suit: "wands", element: "火",
    keywords: ["行动", "冒险", "急躁", "魅力", "速度"], uprightBrief: "迅速行动和冒险", reversedBrief: "鲁莽或延迟",
    imageUrl: "icons/wands/tarot-wands-12.png",
    upright: "迅速行动和冒险。充满魅力和活力，但有时可能过于急躁。把握机会但也要留意细节。",
    reversed: "鲁莽或延迟。可能行动过于冲动导致问题，需要放慢脚步思考。",
    translations: {
      en: {
        upright: "Swift action and adventure. Full of charm and vitality, but sometimes may be too impatient. Seize opportunities but also pay attention to details.",
        reversed: "Recklessness or delay. Actions may be too impulsive and cause problems. Need to slow down and think."
      }
    }
  },
  {
    id: "W13", name: "权杖王后", originalName: "Reine de Bâtons", suit: "wands", element: "火",
    keywords: ["热情", "自信", "创造力", "独立", "独立"], uprightBrief: "热情和自信的领导力", reversedBrief: "缺乏自信过度支配",
    imageUrl: "icons/wands/tarot-wands-13.png",
    upright: "热情和自信的领导力。充满魅力和创造力，能够激励他人。相信自己，展现你的光芒。",
    reversed: "缺乏自信或过度支配。可能感到自我怀疑，或者变得过于控制欲强。",
    translations: {
      en: {
        upright: "Passionate and confident leadership. Full of charm and creativity, able to inspire others. Believe in yourself, show your light.",
        reversed: "Lack of confidence or excessive control. You may feel self-doubt, or become too controlling."
      }
    }
  },
  {
    id: "W14", name: "权杖国王", originalName: "Roi de Bâtons", suit: "wands", element: "火",
    keywords: ["远见", "领导力", "企业家", "魅力", "企业家"], uprightBrief: "远见卓识的领导力", reversedBrief: "专制或缺乏远见",
    imageUrl: "icons/wands/tarot-wands-14.png",
    upright: "远见卓识的领导力。充满魅力和企业家精神。自然地吸引他人跟随你的愿景。",
    reversed: "专制或缺乏远见。可能变得过于控制或冲动，需要平衡热情与理智。",
    translations: {
      en: {
        upright: "Visionary leadership. Full of charm and entrepreneurial spirit. Naturally attract others to follow your vision.",
        reversed: "Autocratic or lacking foresight. You may become too controlling or impulsive. Need to balance passion with reason."
      }
    }
  },

  // ============ 小阿卡纳 - 圣杯 Cups (14张) ============
  {
    id: "C1", name: "圣杯王牌", originalName: "As de Coupes", suit: "cups", element: "水",
    keywords: ["新情感", "爱", "喜悦", "直觉", "直觉"], uprightBrief: "新的情感开始", reversedBrief: "情感受阻内在空虚",
    imageUrl: "icons/cups/tarot-cups-01.png",
    upright: "新的情感开始。马赛牌中圣杯王牌代表纯粹的情感与直觉的涌现。打开你的心，接受情感的馈赠。",
    reversed: "情感受阻或内在空虚。可能需要疗愈过去的情感创伤，重新连接内心的感受。",
    translations: {
      en: {
        upright: "A new emotional beginning. In the Marseille deck, the Ace of Cups represents the emergence of pure emotion and intuition. Open your heart, accept the gifts of emotion.",
        reversed: "Emotions are blocked or inner emptiness. You may need to heal past emotional wounds and reconnect with inner feelings."
      }
    }
  },
  {
    id: "C2", name: "圣杯二", originalName: "Deux de Coupes", suit: "cups", element: "水",
    keywords: ["和谐", "吸引", "合作", "关系", "吸引"], uprightBrief: "和谐的关系和相互吸引", reversedBrief: "关系失衡或误解",
    imageUrl: "icons/cups/tarot-cups-02.png",
    upright: "和谐的关系和相互吸引。平等的合作和深厚的情感连接。这是建立重要关系的时刻。",
    reversed: "关系失衡或误解。可能面临分歧，需要沟通和理解来修复关系。",
    translations: {
      en: {
        upright: "Harmonious relationship and mutual attraction. Equal cooperation and deep emotional connection. This is the moment to build important relationships.",
        reversed: "Relationship imbalance or misunderstanding. You may face disagreements and need communication and understanding to repair the relationship."
      }
    }
  },
  {
    id: "C3", name: "圣杯三", originalName: "Trois de Coupes", suit: "cups", element: "水",
    keywords: ["庆祝", "友谊", "社交", "欢乐", "欢乐"], uprightBrief: "庆祝和友谊的喜悦", reversedBrief: "过度放纵社交孤立",
    imageUrl: "icons/cups/tarot-cups-03.png",
    upright: "庆祝和友谊的喜悦。与挚友共度的美好时光。分享快乐，扩大你的社交圈。",
    reversed: "过度放纵或社交孤立。可能在群体中感到不适，需要平衡社交与个人空间。",
    translations: {
      en: {
        upright: "The joy of celebration and friendship. Wonderful times spent with close friends. Share happiness, expand your social circle.",
        reversed: "Excessive indulgence or social isolation. You may feel uncomfortable in groups and need to balance socializing with personal space."
      }
    }
  },
  {
    id: "C4", name: "圣杯四", originalName: "Quatre de Coupes", suit: "cups", element: "水",
    keywords: ["沉思", "重新评估", "不满", "觉醒", "觉醒"], uprightBrief: "沉思和重新评估", reversedBrief: "觉醒和新机会",
    imageUrl: "icons/cups/tarot-cups-04.png",
    upright: "沉思和重新评估。可能对现状感到不满，但需要睁开眼睛看到已有的祝福。",
    reversed: "觉醒和新机会。从冷漠中走出，重新拥抱生活的可能性。",
    translations: {
      en: {
        upright: "Contemplation and re-evaluation. You may be dissatisfied with the status quo, but need to open your eyes to see the blessings you already have.",
        reversed: "Awakening and new opportunities. Walk out of apathy and re-embrace the possibilities of life."
      }
    }
  },
  {
    id: "C5", name: "圣杯五", originalName: "Cinq de Coupes", suit: "cups", element: "水",
    keywords: ["悲伤", "失落", "恢复", "原谅", "原谅"], uprightBrief: "失落和悲伤", reversedBrief: "从悲伤中恢复",
    imageUrl: "icons/cups/tarot-cups-05.png",
    upright: "失落和悲伤。专注于失去的东西而忽视了还在身边的。允许自己悲伤然后向前看。",
    reversed: "从悲伤中恢复。接受过去重新开始，学会原谅自己和他人。",
    translations: {
      en: {
        upright: "Loss and sorrow. Focusing on what is lost while ignoring what remains. Allow yourself to grieve and then look forward.",
        reversed: "Recovering from sorrow. Accept the past and start anew. Learn to forgive yourself and others."
      }
    }
  },
  {
    id: "C6", name: "圣杯六", originalName: "Six de Coupes", suit: "cups", element: "水",
    keywords: ["怀旧", "童年", "回忆", "分享", "分享"], uprightBrief: "怀旧和童真的快乐", reversedBrief: "困在过去天真过度",
    imageUrl: "icons/cups/tarot-cups-06.png",
    upright: "怀旧和童真的快乐。美好的回忆带来温暖。分享和慷慨让关系更加深厚。",
    reversed: "困在过去或天真过度。可能需要放下过去，或者过于依赖旧有的模式。",
    translations: {
      en: {
        upright: "Nostalgia and the joy of childhood innocence. Beautiful memories bring warmth. Sharing and generosity deepen relationships.",
        reversed: "Trapped in the past or excessive naivety. You may need to let go of the past, or rely too much on old patterns."
      }
    }
  },
  {
    id: "C7", name: "圣杯七", originalName: "Sept de Coupes", suit: "cups", element: "水",
    keywords: ["想象", "选择", "幻想", "欲望", "欲望"], uprightBrief: "丰富的想象和多个选择", reversedBrief: "从幻想中清醒",
    imageUrl: "icons/cups/tarot-cups-07.png",
    upright: "丰富的想象和多个选择。可能感到困惑不知如何选择。需要澄清你的真实欲望。",
    reversed: "从幻想中清醒。做出实际的选择，将梦想变为现实。",
    translations: {
      en: {
        upright: "Rich imagination and multiple choices. You may feel confused and not know how to choose. Need to clarify your true desires.",
        reversed: "Waking from fantasy. Make practical choices, turn dreams into reality."
      }
    }
  },
  {
    id: "C8", name: "圣杯八", originalName: "Huit de Coupes", suit: "cups", element: "水",
    keywords: ["离开", "寻求", "成长", "勇气", "勇气"], uprightBrief: "离开不满足寻找更深意义", reversedBrief: "害怕离开或回到过去",
    imageUrl: "icons/cups/tarot-cups-08.png",
    upright: "离开不满足的状况寻找更深的意义。虽然有遗憾但必须前行。这是灵魂成长的旅程。",
    reversed: "害怕离开或回到过去。可能犹豫不决，需要勇气面对改变。",
    translations: {
      en: {
        upright: "Leave unsatisfying situations to seek deeper meaning. Though there is regret, you must move forward. This is the journey of soul growth.",
        reversed: "Afraid to leave or returning to the past. You may be indecisive and need courage to face change."
      }
    }
  },
  {
    id: "C9", name: "圣杯九", originalName: "Neuf de Coupes", suit: "cups", element: "水",
    keywords: ["满足", "愿望", "愉悦", "富足", "愉悦"], uprightBrief: "愿望成真和情感的满足", reversedBrief: "虚荣或贪婪",
    imageUrl: "icons/cups/tarot-cups-09.png",
    upright: "愿望成真和情感的满足。这是一个充满喜悦和满足的时期。享受你努力带来的成果。",
    reversed: "虚荣或贪婪。可能过于关注物质满足而忽视精神成长，需要平衡欲望。",
    translations: {
      en: {
        upright: "Wishes come true and emotional satisfaction. This is a period full of joy and contentment. Enjoy the fruits of your efforts.",
        reversed: "Vanity or greed. You may focus too much on material satisfaction and neglect spiritual growth. Need to balance desires."
      }
    }
  },
  {
    id: "C10", name: "圣杯十", originalName: "Dix de Coupes", suit: "cups", element: "水",
    keywords: ["家庭", "和谐", "幸福", "长久", "长久"], uprightBrief: "家庭的和谐与长久幸福", reversedBrief: "家庭不和破碎的梦想",
    imageUrl: "icons/cups/tarot-cups-10.png",
    upright: "家庭的和谐与长久的幸福。真正的快乐来自于爱与归属。珍惜与亲人共度的时光。",
    reversed: "家庭不和或破碎的梦想。可能面临关系问题，需要努力修复和维护。",
    translations: {
      en: {
        upright: "Family harmony and lasting happiness. True joy comes from love and belonging. Cherish the time spent with loved ones.",
        reversed: "Family discord or broken dreams. You may face relationship problems and need to work hard to repair and maintain them."
      }
    }
  },
  {
    id: "C11", name: "圣杯侍从", originalName: "Valet de Coupes", suit: "cups", element: "水",
    keywords: ["情感萌芽", "直觉", "创意", "敏感", "敏感"], uprightBrief: "情感的萌芽和直觉的消息", reversedBrief: "情感不成熟错过直觉",
    imageUrl: "icons/cups/tarot-cups-11.png",
    upright: "情感的萌芽和直觉的消息。保持开放和敏感，创造性的想法正在涌现。",
    reversed: "情感不成熟或错过直觉。可能需要更多地关注内心世界，发展情商。",
    translations: {
      en: {
        upright: "The budding of emotions and messages of intuition. Stay open and sensitive, creative ideas are emerging.",
        reversed: "Emotional immaturity or missing intuition. You may need to pay more attention to the inner world and develop emotional intelligence."
      }
    }
  },
  {
    id: "C12", name: "圣杯骑士", originalName: "Cavalier de Coupes", suit: "cups", element: "水",
    keywords: ["浪漫", "追求", "理想", "魅力", "魅力"], uprightBrief: "浪漫和追求理想", reversedBrief: "情感操纵不切实际",
    imageUrl: "icons/cups/tarot-cups-12.png",
    upright: "浪漫和追求理想。带着情感和魅力前进。跟随你的心，但也要保持理智。",
    reversed: "情感操纵或不切实际。可能过于理想化，需要脚踏实地。",
    translations: {
      en: {
        upright: "Romance and the pursuit of ideals. Move forward with emotion and charm. Follow your heart, but also keep your reason.",
        reversed: "Emotional manipulation or unrealistic. You may be too idealistic and need to keep your feet on the ground."
      }
    }
  },
  {
    id: "C13", name: "圣杯王后", originalName: "Reine de Coupes", suit: "cups", element: "水",
    keywords: ["同情心", "直觉", "慈悲", "理解", "理解"], uprightBrief: "同情心和直觉的智慧", reversedBrief: "情感依赖封闭内心",
    imageUrl: "icons/cups/tarot-cups-13.png",
    upright: "同情心和直觉的智慧。深深地理解他人，用爱和慈悲引导。信任你的直觉。",
    reversed: "情感依赖或封闭内心。可能在情感上过度投入，需要建立健康的界限。",
    translations: {
      en: {
        upright: "Compassion and the wisdom of intuition. Deeply understand others, guide with love and compassion. Trust your intuition.",
        reversed: "Emotional dependence or closed heart. You may be overly invested emotionally and need to establish healthy boundaries."
      }
    }
  },
  {
    id: "C14", name: "圣杯国王", originalName: "Roi de Coupes", suit: "cups", element: "水",
    keywords: ["成熟", "平衡", "同理心", "智慧", "智慧"], uprightBrief: "情感的成熟和平衡", reversedBrief: "情感操控压抑感情",
    imageUrl: "icons/cups/tarot-cups-14.png",
    upright: "情感的成熟和平衡。用同理心和智慧领导。在情感表达和理智之间找到完美平衡。",
    reversed: "情感操控或压抑感情。可能滥用情感力量，或者无法表达真实的感受。",
    translations: {
      en: {
        upright: "Emotional maturity and balance. Lead with empathy and wisdom. Find the perfect balance between emotional expression and reason.",
        reversed: "Emotional manipulation or repressing feelings. You may abuse emotional power, or be unable to express true feelings."
      }
    }
  },

  // ============ 小阿卡纳 - 宝剑 Swords (14张) ============
  {
    id: "S1", name: "宝剑王牌", originalName: "As d'Épées", suit: "swords", element: "风",
    keywords: ["真理", "清晰", "突破", "新想法", "突破"], uprightBrief: "清晰的思维和突破性的真理", reversedBrief: "思维混乱滥用真理",
    imageUrl: "icons/swords/tarot-swords-01.png",
    upright: "清晰的思维和突破性的真理。新的想法和洞察力。用理性和逻辑切割迷惑。",
    reversed: "思维混乱或滥用真理。可能沟通不当，需要澄清思路和意图。",
    translations: {
      en: {
        upright: "Clear thinking and breakthrough truth. New ideas and insight. Use reason and logic to cut through confusion.",
        reversed: "Confused thinking or misuse of truth. You may communicate inappropriately and need to clarify thoughts and intentions."
      }
    }
  },
  {
    id: "S2", name: "宝剑二", originalName: "Deux d'Épées", suit: "swords", element: "风",
    keywords: ["两难", "选择", "僵局", "平衡", "平衡"], uprightBrief: "两难的选择和内心的僵局", reversedBrief: "信息不明避免决定",
    imageUrl: "icons/swords/tarot-swords-02.png",
    upright: "两难的选择和内心的僵局。需要平衡对立的观点。暂时封闭情感用理性做决定。",
    reversed: "信息不明或避免决定。可能终于做出了选择，或者需要更多信息来做决定。",
    translations: {
      en: {
        upright: "A difficult choice and inner deadlock. Need to balance opposing viewpoints. Temporarily close off emotions and use reason to make decisions.",
        reversed: "Unclear information or avoiding decisions. You may have finally made a choice, or need more information to decide."
      }
    }
  },
  {
    id: "S3", name: "宝剑三", originalName: "Trois d'Épées", suit: "swords", element: "风",
    keywords: ["心碎", "痛苦", "疗愈", "宽恕", "宽恕"], uprightBrief: "心碎和痛苦的时刻", reversedBrief: "从痛苦中恢复",
    imageUrl: "icons/swords/tarot-swords-03.png",
    upright: "心碎和痛苦的时刻。虽然艰难但是必要的净化。允许自己感受痛苦这是愈合的开始。",
    reversed: "从痛苦中恢复。宽恕和释放过去。伤口愈合准备重新打开心扉。",
    translations: {
      en: {
        upright: "A moment of heartbreak and pain. Though difficult, it is necessary purification. Allow yourself to feel the pain—this is the beginning of healing.",
        reversed: "Recovering from pain. Forgiveness and releasing the past. Wounds are healing, ready to reopen the heart."
      }
    }
  },
  {
    id: "S4", name: "宝剑四", originalName: "Quatre d'Épées", suit: "swords", element: "风",
    keywords: ["休息", "反思", "恢复", "平静", "平静"], uprightBrief: "休息和反思的时期", reversedBrief: "不安或急于行动",
    imageUrl: "icons/swords/tarot-swords-04.png",
    upright: "休息和反思的时期。从混乱中退隐恢复精力和清晰度。静心思考后再行动。",
    reversed: "不安或急于行动。可能休息不足就匆忙返回，需要更多时间恢复。",
    translations: {
      en: {
        upright: "A period of rest and reflection. Withdraw from chaos to recover energy and clarity. Think quietly before acting.",
        reversed: "Restlessness or eager to act. You may return hastily without enough rest and need more time to recover."
      }
    }
  },
  {
    id: "S5", name: "宝剑五", originalName: "Cinq d'Épées", suit: "swords", element: "风",
    keywords: ["冲突", "胜利", "空虚", "和解", "和解"], uprightBrief: "冲突和空虚的胜利", reversedBrief: "和解或接受失败",
    imageUrl: "icons/swords/tarot-swords-05.png",
    upright: "冲突和空虚的胜利。赢得战斗但失去关系。反思什么才是真正重要的。",
    reversed: "和解或接受失败。从冲突中学习和成长。放下自我，寻求和平。",
    translations: {
      en: {
        upright: "Conflict and empty victory. Win the battle but lose the relationship. Reflect on what is truly important.",
        reversed: "Reconciliation or accepting defeat. Learn and grow from conflict. Let go of ego, seek peace."
      }
    }
  },
  {
    id: "S6", name: "宝剑六", originalName: "Six d'Épées", suit: "swords", element: "风",
    keywords: ["过渡", "离开", "疗愈", "旅程", "旅程"], uprightBrief: "过渡和离开困难", reversedBrief: "抵抗改变困在困境中",
    imageUrl: "icons/swords/tarot-swords-06.png",
    upright: "过渡和离开困难。虽然不舍但必须前行。这是通往更平静水域的旅程。",
    reversed: "抵抗改变或困在困境中。可能不愿意离开舒适区，需要勇气面对过渡。",
    translations: {
      en: {
        upright: "Transition and leaving difficulties. Though reluctant, you must move forward. This is a journey toward calmer waters.",
        reversed: "Resisting change or trapped in difficulties. You may be unwilling to leave your comfort zone and need courage to face transitions."
      }
    }
  },
  {
    id: "S7", name: "宝剑七", originalName: "Sept d'Épées", suit: "swords", element: "风",
    keywords: ["策略", "欺骗", "智慧", "隐瞒", "策略"], uprightBrief: "策略和不正当的手段", reversedBrief: "坦白或内疚",
    imageUrl: "icons/swords/tarot-swords-07.png",
    upright: "策略和不正当的手段。可能需要运用智慧而非力量。小心被欺骗或自欺。",
    reversed: "坦白或内疚。可能真相大白，或者需要诚实地面对自己的行动。",
    translations: {
      en: {
        upright: "Strategy and improper means. You may need to use wisdom rather than force. Be careful of being deceived or self-deception.",
        reversed: "Confession or guilt. Truth may come to light, or you need to honestly face your actions."
      }
    }
  },
  {
    id: "S8", name: "宝剑八", originalName: "Huit d'Épées", suit: "swords", element: "风",
    keywords: ["限制", "束缚", "恐惧", "觉醒", "恐惧"], uprightBrief: "感觉被困和受限", reversedBrief: "解放和自我发现",
    imageUrl: "icons/swords/tarot-swords-08.png",
    upright: "感觉被困和受限。但实际上束缚多来自于内心。重新审视处境，你会发现出路。",
    reversed: "解放和自我发现。从限制中挣脱，重新获得自由和清晰的视野。",
    translations: {
      en: {
        upright: "Feeling trapped and restricted. But in fact, the bonds mostly come from within. Re-examine your situation, you will find a way out.",
        reversed: "Liberation and self-discovery. Break free from restrictions, regain freedom and clear vision."
      }
    }
  },
  {
    id: "S9", name: "宝剑九", originalName: "Neuf d'Épées", suit: "swords", element: "风",
    keywords: ["焦虑", "恐惧", "噩梦", "恢复", "恢复"], uprightBrief: "焦虑和不眠之夜", reversedBrief: "从焦虑中恢复",
    imageUrl: "icons/swords/tarot-swords-09.png",
    upright: "焦虑和不眠之夜。担忧和恐惧在夜间放大。寻求支持不要独自承受。",
    reversed: "从焦虑中恢复。噩梦结束黎明到来。学会管理担忧寻找内心的平静。",
    translations: {
      en: {
        upright: "Anxiety and sleepless nights. Worries and fears are amplified at night. Seek support, don't bear it alone.",
        reversed: "Recovering from anxiety. Nightmares end, dawn arrives. Learn to manage worries and find inner peace."
      }
    }
  },
  {
    id: "S10", name: "宝剑十", originalName: "Dix d'Épées", suit: "swords", element: "风",
    keywords: ["结束", "最低谷", "重生", "释放", "释放"], uprightBrief: "痛苦的结束和最低谷", reversedBrief: "从绝境中恢复",
    imageUrl: "icons/swords/tarot-swords-10.png",
    upright: "痛苦的结束和最低谷。虽然看起来绝望，但这是结束也是新开始的可能。接受无法改变的。",
    reversed: "从绝境中恢复。最糟糕的已经过去，慢慢重建。找到从废墟中站起来的力量。",
    translations: {
      en: {
        upright: "Painful ending and rock bottom. Though it looks hopeless, this is an end but also a possibility for a new beginning. Accept what cannot be changed.",
        reversed: "Recovering from desperation. The worst is over, slowly rebuild. Find the strength to stand up from the ruins."
      }
    }
  },
  {
    id: "S11", name: "宝剑侍从", originalName: "Valet d'Épées", suit: "swords", element: "风",
    keywords: ["好奇", "信息", "沟通", "警觉", "警觉"], uprightBrief: "好奇心和信息的好奇", reversedBrief: "八卦或鲁莽的沟通",
    imageUrl: "icons/swords/tarot-swords-11.png",
    upright: "好奇心和信息的好奇。敏锐的观察和直接的沟通。保持警惕真相即将揭露。",
    reversed: "八卦或鲁莽的沟通。可能说话不经思考，或者过于多疑需要辨别信息。",
    translations: {
      en: {
        upright: "Curiosity and inquisitiveness for information. Keen observation and direct communication. Stay alert, truth is about to be revealed.",
        reversed: "Gossip or reckless communication. You may speak without thinking, or be too suspicious and need to discern information."
      }
    }
  },
  {
    id: "S12", name: "宝剑骑士", originalName: "Cavalier d'Épées", suit: "swords", element: "风",
    keywords: ["行动", "果断", "激进", "速度", "果断"], uprightBrief: "迅速和直接的行动", reversedBrief: "鲁莽或冷酷",
    imageUrl: "icons/swords/tarot-swords-12.png",
    upright: "迅速和直接的行动。锐利的思维和果断的决策。但小心不要过于冲动而伤到他人。",
    reversed: "鲁莽或冷酷。可能行动过于激进，需要放慢速度考虑后果。",
    translations: {
      en: {
        upright: "Swift and direct action. Sharp thinking and decisive decision-making. But be careful not to be too impulsive and hurt others.",
        reversed: "Reckless or cold. Your actions may be too aggressive and need to slow down to consider consequences."
      }
    }
  },
  {
    id: "S13", name: "宝剑王后", originalName: "Reine d'Épées", suit: "swords", element: "风",
    keywords: ["清晰", "独立", "诚实", "智慧", "诚实"], uprightBrief: "清晰的思维和独立的判断", reversedBrief: "冷酷或过于批判",
    imageUrl: "icons/swords/tarot-swords-13.png",
    upright: "清晰的思维和独立的判断。用智慧和诚实沟通。不畏惧说出真相即使它很尖锐。",
    reversed: "冷酷或过于批判。可能变得尖酸刻薄，需要平衡真理与同情心。",
    translations: {
      en: {
        upright: "Clear thinking and independent judgment. Communicate with wisdom and honesty. Not afraid to speak the truth even if it is sharp.",
        reversed: "Cold or overly critical. You may become bitter and need to balance truth with compassion."
      }
    }
  },
  {
    id: "S14", name: "宝剑国王", originalName: "Roi d'Épées", suit: "swords", element: "风",
    keywords: ["理智", "公正", "权威", "真理", "权威"], uprightBrief: "理智的领导力和公正的裁决", reversedBrief: "专制或滥用权力",
    imageUrl: "icons/swords/tarot-swords-14.png",
    upright: "理智的领导力和公正的裁决。用逻辑和真理引导他人。权威而不专制明智而不冷漠。",
    reversed: "专制或滥用权力。可能变得冷酷无情，需要平衡理性与同理心。",
    translations: {
      en: {
        upright: "Rational leadership and fair judgment. Guide others with logic and truth. Authoritative but not autocratic, wise but not indifferent.",
        reversed: "Autocratic or abusing power. You may become cold and ruthless and need to balance reason with empathy."
      }
    }
  },

  // ============ 小阿卡纳 - 星币 Pentacles (14张) ============
  {
    id: "P1", name: "星币王牌", originalName: "As de Deniers", suit: "pentacles", element: "土",
    keywords: ["机会", "繁荣", "富足", "实际", "实际"], uprightBrief: "新的财务机会和物质繁荣", reversedBrief: "财务延迟机会错失",
    imageUrl: "icons/pentacles/tarot-pentacles-01.png",
    upright: "新的财务机会和物质繁荣。实际的开始和稳固的基础。这是一个播种财富种子的好时机。",
    reversed: "财务延迟或机会错失。可能需要重新评估财务计划，或者机会需要更多努力才能实现。",
    translations: {
      en: {
        upright: "New financial opportunity and material prosperity. A practical beginning and solid foundation. This is a good time to sow the seeds of wealth.",
        reversed: "Financial delay or missed opportunity. You may need to re-evaluate financial plans, or the opportunity requires more effort to realize."
      }
    }
  },
  {
    id: "P2", name: "星币二", originalName: "Deux de Deniers", suit: "pentacles", element: "土",
    keywords: ["平衡", "适应", "波动", "多任务", "多任务"], uprightBrief: "平衡多重责任和适应变化", reversedBrief: "失衡或过度扩张",
    imageUrl: "icons/pentacles/tarot-pentacles-02.png",
    upright: "平衡多重责任和适应变化。在波动中保持灵活。管理好资源和优先级。",
    reversed: "失衡或过度扩张。可能承担了太多无法管理的事情，需要重新优先排序。",
    translations: {
      en: {
        upright: "Balance multiple responsibilities and adapt to changes. Stay flexible amid fluctuations. Manage resources and priorities well.",
        reversed: "Imbalance or overexpansion. You may have taken on too many things to manage and need to re-prioritize."
      }
    }
  },
  {
    id: "P3", name: "星币三", originalName: "Trois de Deniers", suit: "pentacles", element: "土",
    keywords: ["团队合作", "技艺", "认可", "协作", "协作"], uprightBrief: "团队合作和技艺的精进", reversedBrief: "缺乏团队合作质量不佳",
    imageUrl: "icons/pentacles/tarot-pentacles-03.png",
    upright: "团队合作和技艺的精进。共同努力创造价值。认可和奖励即将到来。",
    reversed: "缺乏团队合作或质量不佳。可能工作不协调，需要改善沟通和协作。",
    translations: {
      en: {
        upright: "Teamwork and refinement of craftsmanship. Joint efforts create value. Recognition and rewards are coming.",
        reversed: "Lack of teamwork or poor quality. Work may be uncoordinated and need to improve communication and collaboration."
      }
    }
  },
  {
    id: "P4", name: "星币四", originalName: "Quatre de Deniers", suit: "pentacles", element: "土",
    keywords: ["稳定", "保守", "控制", "安全感", "安全感"], uprightBrief: "财务的稳定和保守管理", reversedBrief: "过度控制财务损失",
    imageUrl: "icons/pentacles/tarot-pentacles-04.png",
    upright: "财务的稳定和保守管理。保护你拥有的，但小心不要变得过于吝啬。安全感是重要的。",
    reversed: "过度控制或财务损失。可能过于执着于物质，需要学会分享和放手。",
    translations: {
      en: {
        upright: "Financial stability and conservative management. Protect what you have, but be careful not to become too stingy. Security is important.",
        reversed: "Excessive control or financial loss. You may be too attached to material things and need to learn to share and let go."
      }
    }
  },
  {
    id: "P5", name: "星币五", originalName: "Cinq de Deniers", suit: "pentacles", element: "土",
    keywords: ["困难", "孤立", "支持", "恢复", "孤立"], uprightBrief: "财务困难和感觉被排斥", reversedBrief: "从困难中恢复",
    imageUrl: "icons/pentacles/tarot-pentacles-05.png",
    upright: "财务困难和感觉被排斥。虽然艰难但你并不孤单。寻求帮助困难不会永远持续。",
    reversed: "从困难中恢复。财务状况改善，或者精神上的富足取代物质匮乏。",
    translations: {
      en: {
        upright: "Financial difficulty and feeling excluded. Though difficult, you are not alone. Seek help, difficulties will not last forever.",
        reversed: "Recovering from difficulties. Financial situation improves, or spiritual abundance replaces material lack."
      }
    }
  },
  {
    id: "P6", name: "星币六", originalName: "Six de Deniers", suit: "pentacles", element: "土",
    keywords: ["慷慨", "公平", "分享", "接受", "接受"], uprightBrief: "慷慨和公平的交换", reversedBrief: "不平等或自私",
    imageUrl: "icons/pentacles/tarot-pentacles-06.png",
    upright: "慷慨和公平的交换。分享你的财富和知识。接受帮助也是一种智慧。",
    reversed: "不平等或自私。可能给予带有条件，或者需要建立更健康的给予和接受平衡。",
    translations: {
      en: {
        upright: "Generosity and fair exchange. Share your wealth and knowledge. Accepting help is also a kind of wisdom.",
        reversed: "Inequality or selfishness. Giving may come with conditions, or you need to establish a healthier balance of giving and receiving."
      }
    }
  },
  {
    id: "P7", name: "星币七", originalName: "Sept de Deniers", suit: "pentacles", element: "土",
    keywords: ["耐心", "评估", "成长", "投资", "投资"], uprightBrief: "耐心和评估进展", reversedBrief: "缺乏进展急于求成",
    imageUrl: "icons/pentacles/tarot-pentacles-07.png",
    upright: "耐心和评估进展。投资需要时间成长。审视你的努力是否朝着正确的方向。",
    reversed: "缺乏进展或急于求成。可能付出与回报不成正比，需要重新评估策略。",
    translations: {
      en: {
        upright: "Patience and assessing progress. Investments need time to grow. Examine whether your efforts are heading in the right direction.",
        reversed: "Lack of progress or eager for quick results. You may find that effort and reward are not proportional and need to re-evaluate strategy."
      }
    }
  },
  {
    id: "P8", name: "星币八", originalName: "Huit de Deniers", suit: "pentacles", element: "土",
    keywords: ["努力", "技艺", "精通", "专注", "专注"], uprightBrief: "专注的工作和技艺的磨练", reversedBrief: "缺乏动力质量下降",
    imageUrl: "icons/pentacles/tarot-pentacles-08.png",
    upright: "专注的工作和技艺的磨练。通过持续的努力达成精通。这是产出高质量工作的时期。",
    reversed: "缺乏动力或质量下降。可能对工作失去热情，需要重新找到工作的意义。",
    translations: {
      en: {
        upright: "Focused work and refinement of craftsmanship. Achieve mastery through sustained effort. This is a period of producing high-quality work.",
        reversed: "Lack of motivation or declining quality. You may have lost enthusiasm for work and need to rediscover the meaning of work."
      }
    }
  },
  {
    id: "P9", name: "星币九", originalName: "Neuf de Deniers", suit: "pentacles", element: "土",
    keywords: ["独立", "丰裕", "优雅", "自足", "自足"], uprightBrief: "物质上的独立和丰裕", reversedBrief: "过度依赖空虚的富有",
    imageUrl: "icons/pentacles/tarot-pentacles-09.png",
    upright: "物质上的独立和丰裕。享受你努力工作的成果。这是自我满足和优雅生活的时期。",
    reversed: "过度依赖或空虚的富有。可能物质丰富但精神贫乏，需要寻找更深层的满足。",
    translations: {
      en: {
        upright: "Material independence and abundance. Enjoy the fruits of your hard work. This is a period of self-satisfaction and elegant living.",
        reversed: "Excessive dependence or empty wealth. You may be materially rich but spiritually poor and need to find deeper satisfaction."
      }
    }
  },
  {
    id: "P10", name: "星币十", originalName: "Dix de Deniers", suit: "pentacles", element: "土",
    keywords: ["传承", "家族", "长久", "财富", "传承"], uprightBrief: "长久的财务安全和家族传承", reversedBrief: "财务损失家庭不和",
    imageUrl: "icons/pentacles/tarot-pentacles-10.png",
    upright: "长久的财务安全和家族传承。物质上的圆满和传统的价值。建立可以传承的财富。",
    reversed: "财务损失或家庭不和。可能传统成为负担，需要重新定义什么是真正的财富。",
    translations: {
      en: {
        upright: "Long-term financial security and family legacy. Material fulfillment and the value of tradition. Build wealth that can be passed on.",
        reversed: "Financial loss or family discord. Tradition may become a burden and you need to redefine what true wealth is."
      }
    }
  },
  {
    id: "P11", name: "星币侍从", originalName: "Valet de Deniers", suit: "pentacles", element: "土",
    keywords: ["学习", "新开始", "踏实", "计划", "踏实"], uprightBrief: "学习新技能和财务上的新开始", reversedBrief: "缺乏承诺或懒惰",
    imageUrl: "icons/pentacles/tarot-pentacles-11.png",
    upright: "学习新技能和财务上的新开始。踏实的态度和实际的计划。专注于长期目标。",
    reversed: "缺乏承诺或懒惰。可能缺乏纪律，需要更有条理地追求目标。",
    translations: {
      en: {
        upright: "Learning new skills and a new financial beginning. A down-to-earth attitude and practical plans. Focus on long-term goals.",
        reversed: "Lack of commitment or laziness. You may lack discipline and need to pursue goals more methodically."
      }
    }
  },
  {
    id: "P12", name: "星币骑士", originalName: "Cavalier de Deniers", suit: "pentacles", element: "土",
    keywords: ["可靠", "勤奋", "稳定", "坚持", "坚持"], uprightBrief: "可靠和勤奋的工作", reversedBrief: "懒惰或过度保守",
    imageUrl: "icons/pentacles/tarot-pentacles-12.png",
    upright: "可靠和勤奋的工作。稳定地朝着目标前进。虽然缓慢但坚定最终会到达目的地。",
    reversed: "懒惰或过度保守。可能抗拒改变，或者进展过于缓慢需要加快步伐。",
    translations: {
      en: {
        upright: "Reliable and diligent work. Move steadily toward your goal. Though slow but firm, you will eventually reach your destination.",
        reversed: "Lazy or overly conservative. You may resist change, or progress is too slow and need to speed up."
      }
    }
  },
  {
    id: "P13", name: "星币王后", originalName: "Reine de Deniers", suit: "pentacles", element: "土",
    keywords: ["实用", "养育", "管理", "平衡", "平衡"], uprightBrief: "实用和养育的财富", reversedBrief: "忽视自我照顾过度工作",
    imageUrl: "icons/pentacles/tarot-pentacles-13.png",
    upright: "实用和养育的财富。善于管理资源和照顾他人。在物质和精神之间找到平衡。",
    reversed: "忽视自我照顾或过度工作。可能过于关注他人而忽视自己的需求，需要自我滋养。",
    translations: {
      en: {
        upright: "Practical and nurturing wealth. Good at managing resources and caring for others. Find balance between material and spiritual.",
        reversed: "Neglecting self-care or overworking. You may focus too much on others and neglect your own needs. Need self-nurturing."
      }
    }
  },
  {
    id: "P14", name: "星币国王", originalName: "Roi de Deniers", suit: "pentacles", element: "土",
    keywords: ["成功", "稳定", "富有", "实际", "富有"], uprightBrief: "财务上的成功和稳定的领导", reversedBrief: "贪婪或过度控制",
    imageUrl: "icons/pentacles/tarot-pentacles-14.png",
    upright: "财务上的成功和稳定的领导。通过实际和智慧的方式积累财富。你是可靠的提供者。",
    reversed: "贪婪或过度控制。可能过于执着于物质成功，需要记住财富不是一切。",
    translations: {
      en: {
        upright: "Financial success and stable leadership. Accumulate wealth through practical and wise means. You are a reliable provider.",
        reversed: "Greed or excessive control. You may be too attached to material success and need to remember that wealth is not everything."
      }
    }
  }
];

// 导出 Map 以便 O(1) 查找
const marseilleCardsMap = new Map(marseilleCards.map(function(c) { return [c.id, c]; }));
