// 托特塔罗牌数据 (Thoth Tarot) - 78张牌完整版
// 基于Aleister Crowley与Frieda Harris的创作
// 注意：托特牌的牌名、元素对应与伟特塔罗有所不同
const thothCards = [
  // ============ 大阿卡纳 Major Arcana (22张) ============
  {
    id: 0, name: "愚者", originalName: "The Fool", suit: "major", element: "风",
    keywords: ["精髓", "纯真", "狂喜", "自由精神", "新开始"],
    uprightBrief: "零点的精髓，无限可能", reversedBrief: "盲目或精神涣散",
    imageUrl: "icons/major/tarot-major-00.png",
    upright: "零点的精髓。代表无限的可能性与狂喜的自由。你是纯粹的意识，准备好踏上灵性进化的新旅程。拥抱未知，信任生命的流动。",
    reversed: "盲目的冲动或精神涣散。可能忽视危险，或灵性逃避。需要重新连接内在的纯真，但要以更觉知的方式。",
    translations: {
      en: {
        upright: "The essence of zero. Represents infinite possibility and ecstatic freedom. You are pure consciousness, ready to embark on a new journey of spiritual evolution. Embrace the unknown.",
        reversed: "Reckless impulse or scattered spirit. You may be ignoring dangers or escaping through spirituality. Reconnect with inner innocence more consciously."
      }
    }
  },
  {
    id: 1, name: "魔法师", originalName: "The Magus", suit: "major", element: "风",
    keywords: ["意志", "技巧", "魔法", "沟通", "显化"],
    uprightBrief: "纯粹意志的显化力量", reversedBrief: "意志被扭曲或操纵",
    imageUrl: "icons/major/tarot-major-01.png",
    upright: "纯粹意志的显化力量。魔法师是意识的代理人，将精神转化为物质。你的意志清晰有力，能够驾驭四元素，将想法变为现实。",
    reversed: "意志被扭曲或用于操纵。可能滥用力量，或缺乏真正的意图。需要重新审视你的动机。",
    translations: {
      en: {
        upright: "The manifesting power of pure will. The Magus is the agent of consciousness, transforming spirit into matter. Your will is clear and strong.",
        reversed: "Will distorted or used for manipulation. Power may be misused, or true intention is lacking. Re-examine your motives."
      }
    }
  },
  {
    id: 2, name: "女祭司", originalName: "The Priestess", suit: "major", element: "水",
    keywords: ["直觉", "潜意识", "月亮智慧", "神秘", "内在知晓"],
    uprightBrief: "月亮的智慧与直觉", reversedBrief: "直觉被阻塞或幻觉",
    imageUrl: "icons/major/tarot-major-02.png",
    upright: "月亮的智慧。女祭司代表潜意识的深处，连接直觉与内在知晓。这是接收神秘知识和灵性启示的时刻。信任你的直觉。",
    reversed: "直觉被阻塞，或被情绪幻觉蒙蔽。可能与内在智慧失去联系。需要清理情绪体，重新连接潜意识的智慧。",
    translations: {
      en: {
        upright: "Lunar wisdom. The Priestess represents the depths of the subconscious, connecting intuition and inner knowing. Trust your intuition.",
        reversed: "Intuition is blocked or clouded by emotional illusion. Reconnect with subconscious wisdom."
      }
    }
  },
  {
    id: 3, name: "女皇", originalName: "The Empress", suit: "major", element: "土",
    keywords: ["丰饶", "美", "感官愉悦", "自然", "创造力"],
    uprightBrief: "美的丰饶与感官愉悦", reversedBrief: "创造力枯竭或过度放纵",
    imageUrl: "icons/major/tarot-major-03.png",
    upright: "美的丰饶。女皇是自然的创造力量，带来感官的愉悦与物质的丰盛。享受生命的美好，在大自然中找到滋养与灵感。",
    reversed: "创造力枯竭，或过度放纵于感官。可能与身体或自然失去联系。需要重新找回对生命之美的欣赏。",
    translations: {
      en: {
        upright: "Fertility of Beauty. The Empress is the creative force of nature, bringing sensory pleasure and material abundance. Enjoy the beauty of life.",
        reversed: "Creative energy is depleted, or excessive indulgence in senses. Reclaim appreciation for life's beauty."
      }
    }
  },
  {
    id: 4, name: "皇帝", originalName: "The Emperor", suit: "major", element: "火",
    keywords: ["意志", "稳定", "父亲能量", "结构", "统治"],
    uprightBrief: "意志的稳定与父亲能量", reversedBrief: "专制或缺乏自律",
    imageUrl: "icons/major/tarot-major-04.png",
    upright: "意志的稳定。皇帝代表有结构的力量和父亲能量。通过纪律和决心建立秩序。你是自己王国的主人，以智慧和力量统治。",
    reversed: "专制固执，或缺乏自律和方向。可能过度控制，或无法建立边界。需要平衡力量与慈悲。",
    translations: {
      en: {
        upright: "Stability of Will. The Emperor represents structured power and father energy. Establish order through discipline and determination.",
        reversed: "Dictatorial stubbornness, or lack of self-discipline. Balance power with compassion."
      }
    }
  },
  {
    id: 5, name: "教皇", originalName: "The Hierophant", suit: "major", element: "土",
    keywords: ["启示", "内在声音", "导师", "传统", "灵性教导"],
    uprightBrief: "启示与内在声音的指引", reversedBrief: "教条主义或虚假导师",
    imageUrl: "icons/major/tarot-major-05.png",
    upright: "启示。教皇代表内在声音和更高知识的传授。这不是外在的宗教权威，而是内在的灵性导师。倾听内在的智慧，接受启示。",
    reversed: "教条主义，或跟随虚假导师。可能过度依赖外在权威而忽视内在声音。需要打破陈旧信念。",
    translations: {
      en: {
        upright: "Revelation. The Hierophant represents the inner voice and transmission of higher knowledge. Listen to inner wisdom and receive revelation.",
        reversed: "Dogmatism, or following false teachers. Break old beliefs and find your own truth."
      }
    }
  },
  {
    id: 6, name: "恋人", originalName: "The Lovers", suit: "major", element: "风",
    keywords: ["选择", "爱", "和谐", "结合", "价值"],
    uprightBrief: "爱与选择的和谐", reversedBrief: "不和谐或错误的选择",
    imageUrl: "icons/major/tarot-major-06.png",
    upright: "爱与选择的和谐。恋人代表灵魂层面的连接与重要选择。在爱与自由意志中找到平衡，做出符合更高自我的决定。",
    reversed: "不和谐或做出错误选择。可能在关系中犹豫不决，或价值观冲突。需要诚实面对内心的真实渴望。",
    translations: {
      en: {
        upright: "Harmony of love and choice. The Lovers represent soul-level connection and important choices. Make decisions aligned with your higher self.",
        reversed: "Disharmony or wrong choices. Indecision in relationships or conflicting values. Face your true desires honestly."
      }
    }
  },
  {
    id: 7, name: "战车", originalName: "The Chariot", suit: "major", element: "水",
    keywords: ["胜利", "意志", "控制", "前进", "决心"],
    uprightBrief: "意志的胜利与控制", reversedBrief: "失控或侵略性过强",
    imageUrl: "icons/major/tarot-major-07.png",
    upright: "意志的胜利。战车代表通过意志和决心克服困难。你拥有前进的动力和方向，能够驾驭对立的力量，走向胜利。",
    reversed: "失控或侵略性过强。可能缺乏方向，或被情绪驱使。需要重新获得控制，以更平衡的方式前进。",
    translations: {
      en: {
        upright: "Victory of Will. The Chariot represents overcoming difficulties through will and determination. You have the drive to move forward.",
        reversed: "Loss of control or excessive aggression. Lack of direction or driven by emotions. Regain control and move forward more balanced."
      }
    }
  },
  {
    id: 8, name: "调整", originalName: "Adjustment", suit: "major", element: "风",
    keywords: ["正义", "平衡", "真相", "因果", "公平"],
    uprightBrief: "精确的调整与平衡", reversedBrief: "不平衡或不公正",
    imageUrl: "icons/major/tarot-major-08.png",
    upright: "调整（对应伟特的「正义」）。代表精确的平衡与因果律。真相会显现，你需要为自己的行为负责。以公正和客观的态度行事。",
    reversed: "不平衡或不公正。可能逃避责任，或遭受不公平的对待。需要重新调整生活的各个方面，恢复平衡。",
    translations: {
      en: {
        upright: "Adjustment (Justice in Rider-Waite). Represents precise balance and the law of cause and effect. Truth will surface. Act with fairness and objectivity.",
        reversed: "Imbalance or injustice. You may be avoiding responsibility or receiving unfair treatment. Re-adjust aspects of life and restore balance."
      }
    }
  },
  {
    id: 9, name: "隐士", originalName: "The Hermit", suit: "major", element: "火",
    keywords: ["内省", "智慧", "独处", "寻找真理", "灵性指引"],
    uprightBrief: "内省的智慧与独处", reversedBrief: "孤立或拒绝帮助",
    imageUrl: "icons/major/tarot-major-09.png",
    upright: "内省的智慧。隐士代表在独处中寻找内在真理。退隐不是逃避，而是为了更深的领悟。倾听内在的声音，找到真正的智慧。",
    reversed: "过度孤立或拒绝帮助。可能在孤独中迷失，或逃避与世界的连接。需要平衡独处与参与，分享你的智慧。",
    translations: {
      en: {
        upright: "Wisdom through introspection. The Hermit represents finding inner truth in solitude. Withdraw not to escape, but for deeper realization.",
        reversed: "Excessive isolation or refusing help. You may be lost in loneliness. Balance solitude with engagement, share your wisdom."
      }
    }
  },
  {
    id: 10, name: "命运之轮", originalName: "Fortune", suit: "major", element: "火",
    keywords: ["命运", "轮回", "机遇", "变化", "转折点"],
    uprightBrief: "命运的转折与机遇", reversedBrief: "命运的低谷或抗拒变化",
    imageUrl: "icons/major/tarot-major-10.png",
    upright: "命运（对应伟特的「命运之轮」）。代表命运的转折点和生命的轮回。机遇正在到来，接受变化，理解万物皆在流动中。",
    reversed: "命运的低谷或抗拒变化。可能感到被困在不利的处境中。记住，轮子会继续转动，黑暗之后必有光明。",
    translations: {
      en: {
        upright: "Fortune (Wheel of Fortune in Rider-Waite). Represents turning points of destiny and life cycles. Opportunities are coming. Accept change.",
        reversed: "Low point of fortune or resisting change. You may feel trapped. Remember, the wheel continues to turn; after darkness comes light."
      }
    }
  },
  {
    id: 11, name: "欲望", originalName: "Lust", suit: "major", element: "火",
    keywords: ["激情", "生命力", "意志", "融合", "能量"],
    uprightBrief: "生命力的激情与融合", reversedBrief: "欲望失控或能量阻塞",
    imageUrl: "icons/major/tarot-major-11.png",
    upright: "欲望（对应伟特的「力量」）。代表生命力的激情与意志的力量。不是盲目的欲望，而是有意识的能量融合。以热情和决心追求你的目标。",
    reversed: "欲望失控或能量阻塞。可能过度放纵，或缺乏生命力。需要平衡激情与节制，引导能量向更高目标。",
    translations: {
      en: {
        upright: "Lust (Strength in Rider-Waite). Represents passionate life force and the power of will. Conscious fusion of energies. Pursue your goals with passion.",
        reversed: "Uncontrolled desire or blocked energy. Excessive indulgence or lack of life force. Balance passion with moderation."
      }
    }
  },
  {
    id: 12, name: "倒吊人", originalName: "The Hanged Man", suit: "major", element: "水",
    keywords: ["牺牲", "放下", "新视角", "等待", "灵性觉醒"],
    uprightBrief: "牺牲与新的视角", reversedBrief: "拖延或拒绝牺牲",
    imageUrl: "icons/major/tarot-major-12.png",
    upright: "牺牲与新的视角。倒吊人代表自愿的牺牲和视角的转变。放下旧的模式，从不同的角度看待问题。在静默中找到智慧。",
    reversed: "拖延或拒绝必要的牺牲。可能固执于旧方式，或无法放下。需要接受暂时的停滞，为了更大的成长。",
    translations: {
      en: {
        upright: "Sacrifice and new perspective. The Hanged Man represents voluntary sacrifice and shift in viewpoint. Let go of old patterns.",
        reversed: "Procrastination or refusing necessary sacrifice. Clinging to old ways. Accept temporary stagnation for greater growth."
      }
    }
  },
  {
    id: 13, name: "死亡", originalName: "Death", suit: "major", element: "水",
    keywords: ["转化", "结束", "重生", "释放", "深层变化"],
    uprightBrief: "深层的转化与重生", reversedBrief: "抗拒变化或无法放下",
    imageUrl: "icons/major/tarot-major-13.png",
    upright: "深层的转化。死亡不代表真正的终结，而是旧形式的瓦解和新生的准备。放下不再服务你的事物，迎接深层的转变。",
    reversed: "抗拒变化或无法放下。可能停留在过去，或恐惧未知。需要接受结束是新开始的前提，释放执念。",
    translations: {
      en: {
        upright: "Deep transformation. Death does not mean true ending, but the dissolution of old forms and preparation for rebirth. Let go and welcome transformation.",
        reversed: "Resisting change or unable to let go. Clinging to the past or fearing the unknown. Accept that ending is the prerequisite for new beginning."
      }
    }
  },
  {
    id: 14, name: "艺术", originalName: "Art", suit: "major", element: "火",
    keywords: ["融合", "炼金术", "平衡", "耐心", "创造"],
    uprightBrief: "炼金术般的融合与创造", reversedBrief: "不平衡或缺乏耐心",
    imageUrl: "icons/major/tarot-major-14.png",
    upright: "艺术（对应伟特的「节制」）。代表炼金术般的融合与创造。将对立的力量融合，以耐心和技巧创造新的现实。这是真正平衡的所在。",
    reversed: "不平衡或缺乏耐心。可能急于求成，或无法融合对立面。需要放慢脚步，以更艺术的方式处理生活。",
    translations: {
      en: {
        upright: "Art (Temperance in Rider-Waite). Represents alchemical fusion and creation. Blend opposing forces, create new reality with patience and skill.",
        reversed: "Imbalance or lack of patience. Rushing or unable to blend opposites. Slow down and handle life in a more artistic way."
      }
    }
  },
  {
    id: 15, name: "恶魔", originalName: "The Devil", suit: "major", element: "土",
    keywords: ["束缚", "物质主义", "欲望", "幻象", "解放"],
    uprightBrief: "物质束缚与幻象", reversedBrief: "从束缚中解放",
    imageUrl: "icons/major/tarot-major-15.png",
    upright: "物质束缚与幻象。恶魔代表对物质和欲望的执着。审视是什么束缚了你——往往是你自己的信念。认识到这一点，你就能获得自由。",
    reversed: "从束缚中解放。正在打破旧的模式和限制。你已经意识到真正的自由在于内在，不再被外在的欲望所控制。",
    translations: {
      en: {
        upright: "Material bonds and illusion. The Devil represents attachment to matter and desire. Examine what binds you—often your own beliefs. Recognize this and you can be free.",
        reversed: "Liberation from bonds. Breaking old patterns and limitations. You realize true freedom lies within, no longer controlled by external desires."
      }
    }
  },
  {
    id: 16, name: "塔", originalName: "The Tower", suit: "major", element: "火",
    keywords: ["突变", "崩塌", "觉醒", "释放", "重建"],
    uprightBrief: "突然的崩塌与觉醒", reversedBrief: "延迟的崩塌或恐惧变化",
    imageUrl: "icons/major/tarot-major-16.png",
    upright: "突变与觉醒。塔代表突然的崩塌，打破陈旧不实的结构。虽然痛苦，但这是必要的解放。真相会摧毁幻象，为重建腾出空间。",
    reversed: "延迟的崩塌或恐惧变化。可能勉强维持摇摇欲坠的结构。需要主动面对真相，而不是等待被迫的崩塌。",
    translations: {
      en: {
        upright: "Sudden change and awakening. The Tower represents the collapse of old, false structures. Painful but necessary liberation. Truth destroys illusion.",
        reversed: "Delayed collapse or fear of change. You may be barely maintaining a crumbling structure. Face the truth actively rather than waiting for forced collapse."
      }
    }
  },
  {
    id: 17, name: "星星", originalName: "The Star", suit: "major", element: "风",
    keywords: ["希望", "灵感", "治愈", "宁静", "灵性"],
    uprightBrief: "希望与灵感的治愈", reversedBrief: "绝望或失去希望",
    imageUrl: "icons/major/tarot-major-17.png",
    upright: "希望与灵感。星星代表在黑暗之后的希望与治愈。与宇宙的流动重新连接，找到内在的平静与灵感。相信宇宙的善意。",
    reversed: "绝望或失去希望。可能与内在的光芒失去联系。需要重新连接希望，相信即使在最黑暗的时刻，星星也在照耀。",
    translations: {
      en: {
        upright: "Hope and inspiration. The Star represents hope and healing after darkness. Reconnect with the flow of the universe. Trust in the benevolence of the cosmos.",
        reversed: "Despair or loss of hope. Disconnected from inner light. Reconnect with hope; even in darkest moments, the stars are shining."
      }
    }
  },
  {
    id: 18, name: "月亮", originalName: "The Moon", suit: "major", element: "水",
    keywords: ["幻觉", "恐惧", "潜意识", "直觉", "不确定"],
    uprightBrief: "潜意识的幻觉与恐惧", reversedBrief: "释放恐惧或真相显现",
    imageUrl: "icons/major/tarot-major-18.png",
    upright: "潜意识的幻觉。月亮代表恐惧、幻觉和潜意识的阴影。不是所有的都是它看起来的样子。面对你的恐惧，它们会在光中消散。",
    reversed: "释放恐惧或真相开始显现。幻觉正在散去，你能够更清楚地看见。这是从混乱中找出秩序的时候。",
    translations: {
      en: {
        upright: "Illusion of the subconscious. The Moon represents fear, illusion, and the shadow of the subconscious. Not all is as it appears. Face your fears.",
        reversed: "Releasing fear or truth beginning to show. Illusions are dissipating. This is the time to find order out of chaos."
      }
    }
  },
  {
    id: 19, name: "太阳", originalName: "The Sun", suit: "major", element: "火",
    keywords: ["快乐", "成功", "活力", "真相", "光明"],
    uprightBrief: "快乐的成功与光明", reversedBrief: "暂时的阴云或过度乐观",
    imageUrl: "icons/major/tarot-major-19.png",
    upright: "快乐的成功。太阳代表生命的喜悦、成功和活力的绽放。真相大白，一切都清晰明亮。享受生命的礼物，分享你的光明。",
    reversed: "暂时的阴云或过度乐观。可能成功被延迟，或现实检查需要。记住太阳仍在云端之上，光明会回来。",
    translations: {
      en: {
        upright: "Joyful success. The Sun represents the joy of life, success, and blossoming vitality. Truth is revealed, all is clear and bright. Share your light.",
        reversed: "Temporary clouds or excessive optimism. Success may be delayed. Remember the sun is still above the clouds; light will return."
      }
    }
  },
  {
    id: 20, name: "永恒", originalName: "The Aeon", suit: "major", element: "风",
    keywords: ["审判", "进化", "新纪元", "觉醒", "因果"],
    uprightBrief: "新纪元的觉醒与进化", reversedBrief: "抗拒进化或停留在过去",
    imageUrl: "icons/major/tarot-major-20.png",
    upright: "永恒/新纪元（对应伟特的「审判」）。代表新纪元的觉醒和灵性进化。这是意识扩展的时刻，过去的因果带来必然的结果。拥抱新的你。",
    reversed: "抗拒进化或停留在过去。可能不愿放下旧身份，或恐惧未来。需要接受进化的必然性，迈向更高的意识。",
    translations: {
      en: {
        upright: "The Aeon (Judgment in Rider-Waite). Represents awakening of the New Age and spiritual evolution. This is a moment of consciousness expansion. Embrace the new you.",
        reversed: "Resisting evolution or staying in the past. Unwilling to let go of old identity. Accept the inevitability of evolution."
      }
    }
  },
  {
    id: 21, name: "宇宙", originalName: "The Universe", suit: "major", element: "土",
    keywords: ["完成", "整合", "成功", "旅行", "圆满"],
    uprightBrief: "圆满的完成与整合", reversedBrief: "未完成或延迟的成功",
    imageUrl: "icons/major/tarot-major-21.png",
    upright: "宇宙（对应伟特的「世界」）。代表圆满的完成和整合。你已经经历了完整的循环，准备好进入新的层次。这是成功、旅行和成就的时刻。",
    reversed: "未完成或延迟的成功。可能感到循环尚未结束，或缺乏完成的力量。需要整合剩余的碎片，然后才能圆满。",
    translations: {
      en: {
        upright: "The Universe (The World in Rider-Waite). Represents complete fulfillment and integration. You have completed the full cycle, ready for a new level. Success and achievement.",
        reversed: "Incompletion or delayed success. The cycle may not feel finished. Integrate remaining fragments before fulfillment can occur."
      }
    }
  },
  // ============ 小阿卡纳 Minor Arcana ============
  // 托特的宫廷牌名称：公主(Princess)=Page，王子(Prince)=Knight，王后(Queen)，国王(King)
  // 托特的牌组名称：权杖(Wands)=Rodst，圣杯(Cups)，宝剑(Swords)，星币(Pentacles)=Disks
  
  // ---------- 权杖/火元素 (Wands/Rods) ----------
  {
    id: "W1", name: "权杖王牌", originalName: "Ace of Wands", suit: "wands", element: "火",
    keywords: ["创造力", "灵感", "新开始", "潜能", "热情"],
    uprightBrief: "创造力的种子与灵感", reversedBrief: "创造力被阻塞或延迟",
    imageUrl: "icons/thoth-wands-01.png",
    upright: "创造力的种子。王牌代表火元素纯粹的能量，带来灵感、热情和新开始的潜能。这是采取行动、追求创意项目的绝佳时机。",
    reversed: "创造力被阻塞或延迟。可能感到缺乏动力，或想法无法落地。需要重新点燃内心的火焰，找到表达的热情。",
    translations: {
      en: {
        upright: "The seed of creativity. The Ace represents pure energy of fire element, bringing inspiration, passion and potential for new beginnings. Take action.",
        reversed: "Creativity blocked or delayed. Feeling lack of motivation. Reignite the inner flame and find passion for expression."
      }
    }
  },
  {
    id: "W2", name: "权杖二", originalName: "Two of Wands", suit: "wands", element: "火",
    keywords: ["规划", "远见", "选择", "合作", "扩张"],
    uprightBrief: "规划未来与远见", reversedBrief: "缺乏规划或犹豫不决",
    imageUrl: "icons/thoth-wands-02.png",
    upright: "规划未来。二权杖代表远见和扩展的视野。你已经在心中看到了目标，现在需要制定计划并准备行动。合作可以带来更大的成功。",
    reversed: "缺乏规划或犹豫不决。可能对未来感到不确定，或无法做出决定。需要澄清你的愿景，然后坚定地前进。",
    translations: {
      en: {
        upright: "Planning the future. Two of Wands represents vision and expanded perspective. You see the goal in mind; now make plans and prepare to act.",
        reversed: "Lack of planning or indecision. Uncertainty about the future. Clarify your vision, then move forward firmly."
      }
    }
  },
  {
    id: "W3", name: "权杖三", originalName: "Three of Wands", suit: "wands", element: "火",
    keywords: ["扩展", "远见", "等待", "合作", "进展"],
    uprightBrief: "扩展视野与等待成果", reversedBrief: "延迟或缺乏远见",
    imageUrl: "icons/thoth-wands-03.png",
    upright: "扩展与远见。三权杖代表你的努力开始扩展，视野变得更加广阔。这是等待成果的时候，同时保持警觉和开放。",
    reversed: "延迟或缺乏远见。可能期望落空，或无法看到更大的画面。需要重新评估你的长期计划。",
    translations: {
      en: {
        upright: "Expansion and vision. Three of Wands represents your efforts beginning to expand. This is the time to wait for results while staying alert.",
        reversed: "Delay or lack of vision. Expectations may not be met. Re-evaluate your long-term plans."
      }
    }
  },
  {
    id: "W4", name: "权杖四", originalName: "Four of Wands", suit: "wands", element: "火",
    keywords: ["庆祝", "和谐", "稳定", "家庭", "完成"],
    uprightBrief: "庆祝与稳定的基础", reversedBrief: "不稳定或缺乏和谐",
    imageUrl: "icons/thoth-wands-04.png",
    upright: "庆祝与和谐。四权杖代表稳定和完成的喜悦。这是庆祝成就、巩固基础的时刻。家庭和谐，生活步入正轨。",
    reversed: "不稳定或缺乏和谐。可能基础不牢固，或庆祝被延迟。需要巩固基础，在动荡中找到稳定。",
    translations: {
      en: {
        upright: "Celebration and harmony. Four of Wands represents stability and joy of completion. Time to celebrate achievements and consolidate foundation.",
        reversed: "Instability or lack of harmony. Foundation may be unstable. Consolidate the foundation, find stability amid turbulence."
      }
    }
  },
  {
    id: "W5", name: "权杖五", originalName: "Five of Wands", suit: "wands", element: "火",
    keywords: ["冲突", "竞争", "挑战", "活力", "分歧"],
    uprightBrief: "竞争与观点的冲突", reversedBrief: "避免冲突或内在混乱",
    imageUrl: "icons/thoth-wands-05.png",
    upright: "竞争与冲突。五权杖代表观点的碰撞和竞争的挑战。这不是恶意的冲突，而是活力的表达。通过辩论和竞争，真理会更加清晰。",
    reversed: "避免冲突或内在混乱。可能逃避必要的竞争，或内部充满矛盾。需要直面分歧，在冲突中找到成长。",
    translations: {
      en: {
        upright: "Competition and conflict. Five of Wands represents clashing views and competitive challenges. Not malicious conflict, but expression of vitality.",
        reversed: "Avoiding conflict or inner chaos. Escaping necessary competition. Face differences directly, find growth in conflict."
      }
    }
  },
  {
    id: "W6", name: "权杖六", originalName: "Six of Wands", suit: "wands", element: "火",
    keywords: ["胜利", "认可", "进展", "自信", "成功"],
    uprightBrief: "胜利与公开的认可", reversedBrief: "缺乏认可或自负",
    imageUrl: "icons/thoth-wands-06.png",
    upright: "胜利与认可。六权杖代表公开的成功和他人的认可。你的努力得到了回报，现在是庆祝和分享胜利的时刻。自信地前进。",
    reversed: "缺乏认可或过度自负。可能成功被忽视，或过于骄傲而失去支持。需要保持谦逊，同时认可自己的成就。",
    translations: {
      en: {
        upright: "Victory and recognition. Six of Wands represents public success and recognition from others. Your efforts have paid off. Move forward confidently.",
        reversed: "Lack of recognition or excessive pride. Success may be overlooked. Stay humble while acknowledging your achievements."
      }
    }
  },
  {
    id: "W7", name: "权杖七", originalName: "Seven of Wands", suit: "wands", element: "火",
    keywords: ["防御", "坚持", "挑战", "勇气", "立场"],
    uprightBrief: "坚持立场与防御", reversedBrief: "放弃或过度防御",
    imageUrl: "icons/thoth-wands-07.png",
    upright: "坚持立场。七权杖代表在挑战中坚守自己的立场。你可能感到压力，但你有能力和勇气去捍卫自己的信念。不要轻易放弃。",
    reversed: "放弃或过度防御。可能感到不堪重负，或选择退让。需要评估是否值得继续战斗，或寻找更有策略的方式。",
    translations: {
      en: {
        upright: "Holding your position. Seven of Wands represents standing firm in the face of challenges. You have the ability and courage to defend your beliefs.",
        reversed: "Giving up or over-defending. Feeling overwhelmed. Assess whether it's worth continuing to fight."
      }
    }
  },
  {
    id: "W8", name: "权杖八", originalName: "Eight of Wands", suit: "wands", element: "火",
    keywords: ["快速", "行动", "进展", "消息", "流动"],
    uprightBrief: "快速的进展与行动", reversedBrief: "延迟或混乱",
    imageUrl: "icons/thoth-wands-08.png",
    upright: "快速的进展。八权杖代表迅速的行动和信息的流动。事情正在加速，消息即将到达。顺应这股能量，快速前进。",
    reversed: "延迟或混乱。可能事情进展不如预期，或沟通出现问题。需要放慢脚步，重新组织思路。",
    translations: {
      en: {
        upright: "Rapid progress. Eight of Wands represents swift action and flow of information. Things are accelerating. Ride this energy, move quickly.",
        reversed: "Delay or chaos. Things may not progress as expected. Slow down and reorganize your thoughts."
      }
    }
  },
  {
    id: "W9", name: "权杖九", originalName: "Nine of Wands", suit: "wands", element: "火",
    keywords: ["韧性", "坚持", "警惕", "恢复", "边界"],
    uprightBrief: "韧性与最后的坚持", reversedBrief: "疲惫或偏执",
    imageUrl: "icons/thoth-wands-09.png",
    upright: "韧性与坚持。九权杖代表在经历挑战后仍然保持警惕和韧性。你可能感到疲惫，但你已经走了这么远，不要放弃。设置健康的边界。",
    reversed: "疲惫或偏执。可能过度防御，或无法放下过去的伤害。需要休息和治愈，然后以更清晰的心态继续。",
    translations: {
      en: {
        upright: "Resilience and persistence. Nine of Wands represents staying vigilant after challenges. You may be tired, but don't give up. Set healthy boundaries.",
        reversed: "Exhaustion or paranoia. Over-defending or unable to let go of past hurts. Rest and heal, then continue with clearer mindset."
      }
    }
  },
  {
    id: "W10", name: "权杖十", originalName: "Ten of Wands", suit: "wands", element: "火",
    keywords: ["负担", "责任", "压力", "完成", "释放"],
    uprightBrief: "沉重的负担与责任", reversedBrief: "释放负担或无法承担",
    imageUrl: "icons/thoth-wands-10.png",
    upright: "沉重的负担。十权杖代表承担过多的责任，感到压力和疲惫。你可能试图做太多事情。学会放下，寻求支持，或重新分配任务。",
    reversed: "释放负担或无法承担。可能终于放下了重担，或仍然挣扎着承担一切。需要诚实地评估你的极限。",
    translations: {
      en: {
        upright: "Heavy burden. Ten of Wands represents taking on too much responsibility. You may be trying to do too many things. Learn to let go.",
        reversed: "Releasing burden or unable to bear. Finally letting go of the heavy load. Honestly assess your limits."
      }
    }
  },
  // 权杖宫廷牌 - 托特体系
  {
    id: "W11", name: "权杖公主", originalName: "Princess of Wands", suit: "wands", element: "火/土",
    keywords: ["热情", "冒险", "灵感", "自由精神", "行动"],
    uprightBrief: "热情的冒险者与灵感", reversedBrief: "鲁莽或缺乏方向",
    imageUrl: "icons/thoth-wands-p.png",
    upright: "权杖公主（对应Page）。代表火元素中最年轻的能量——热情、冒险和灵感。她是自由的灵魂，带着创意和热情探索世界。行动起来！",
    reversed: "鲁莽或缺乏方向。可能冲动行事而没有计划，或灵感无法落地。需要更有策略地引导你的热情。",
    translations: {
      en: {
        upright: "Princess of Wands represents the youngest fire energy—passion, adventure and inspiration. A free spirit exploring the world with creativity. Take action!",
        reversed: "Reckless or lacking direction. Acting on impulse without plan. Channel your passion more strategically."
      }
    }
  },
  {
    id: "W12", name: "权杖王子", originalName: "Prince of Wands", suit: "wands", element: "火/风",
    keywords: ["行动", "热情", "领导", "冒险", "迅速"],
    uprightBrief: "迅速的行动与领导力", reversedBrief: "急躁或鲁莽",
    imageUrl: "icons/thoth-wands-kn.png",
    upright: "权杖王子（对应Knight）。代表火与风的结合——迅速的行动和热情的领导力。他是冒险家和开拓者，带着决心和魅力前进。",
    reversed: "急躁或鲁莽。可能行动过快而没有思考，或热情变成侵略性。需要放慢脚步，更有耐心地规划。",
    translations: {
      en: {
        upright: "Prince of Wands represents fire and air combined—swift action and passionate leadership. An adventurer and pioneer moving forward with determination.",
        reversed: "Impulsive or reckless. Acting too fast without thinking. Slow down and plan with more patience."
      }
    }
  },
  {
    id: "W13", name: "权杖王后", originalName: "Queen of Wands", suit: "wands", element: "火/水",
    keywords: ["魅力", "自信", "创造力", "热情", "独立"],
    uprightBrief: "自信的魅力与创造力", reversedBrief: "嫉妒或自我怀疑",
    imageUrl: "icons/thoth-wands-q.png",
    upright: "权杖王后代表火与水的结合——热情的创造力和自信的魅力。她是独立的、有吸引力的，能够激励他人。相信自己的创造力。",
    reversed: "嫉妒或自我怀疑。可能滥用魅力，或缺乏自信。需要重新连接内在的力量，相信自己的价值。",
    translations: {
      en: {
        upright: "Queen of Wands represents fire and water combined—passionate creativity and confident charm. Independent and inspiring to others. Trust your creativity.",
        reversed: "Jealousy or self-doubt. Misusing charm or lacking confidence. Reconnect with inner power, trust your worth."
      }
    }
  },
  {
    id: "W14", name: "权杖国王", originalName: "King of Wands", suit: "wands", element: "火/火",
    keywords: ["领导力", "远见", "企业家", "自信", "行动"],
    uprightBrief: "有远见的领导力", reversedBrief: "专制或缺乏方向",
    imageUrl: "icons/thoth-wands-k.png",
    upright: "权杖国王代表火元素的成熟表达——有远见的领导力和企业家的精神。他是行动派，能够激励他人跟随他的愿景。",
    reversed: "专制或缺乏方向。可能过度控制，或热情变成傲慢。需要平衡力量与灵活性，听取他人的意见。",
    translations: {
      en: {
        upright: "King of Wands represents mature expression of fire—visionary leadership and entrepreneurial spirit. A man of action who inspires others.",
        reversed: "Dictatorial or lacking direction. Excessive control or arrogance. Balance power with flexibility."
      }
    }
  },
  
  // ---------- 圣杯/水元素 (Cups) ----------
  {
    id: "C1", name: "圣杯王牌", originalName: "Ace of Cups", suit: "cups", element: "水",
    keywords: ["爱", "情感", "直觉", "新开始", "滋养"],
    uprightBrief: "爱的种子与情感滋养", reversedBrief: "情感阻塞或空虚",
    imageUrl: "icons/thoth-cups-01.png",
    upright: "爱的种子。圣杯王牌代表水元素的纯粹情感，带来爱、慈悲和直觉的滋养。这是开启新关系或深化现有情感的时刻。",
    reversed: "情感阻塞或空虚。可能感到情感麻木，或无法接收爱。需要打开心扉，允许情感流动。",
    translations: {
      en: {
        upright: "The seed of love. Ace of Cups represents pure emotion of water element, bringing love, compassion and intuitive nourishment. Open your heart.",
        reversed: "Emotional blockage or emptiness. Feeling emotionally numb. Open your heart and allow emotions to flow."
      }
    }
  },
  {
    id: "C2", name: "圣杯二", originalName: "Two of Cups", suit: "cups", element: "水",
    keywords: ["伙伴关系", "吸引", "和谐", "爱", "结合"],
    uprightBrief: "伙伴关系的和谐", reversedBrief: "不和谐或关系失衡",
    imageUrl: "icons/thoth-cups-02.png",
    upright: "伙伴关系的和谐。圣杯二代表平等的伙伴关系、相互吸引和情感的交流。这是建立或深化关系的好时机，爱与理解在流动。",
    reversed: "不和谐或关系失衡。可能在伙伴关系中存在分歧，或吸引力减弱。需要重新平衡给予和接收。",
    translations: {
      en: {
        upright: "Harmony in partnership. Two of Cups represents equal partnership, mutual attraction and emotional exchange. Good time to build or deepen relationships.",
        reversed: "Disharmony or imbalance in relationship. Disagreement or fading attraction. Rebalance giving and receiving."
      }
    }
  },
  {
    id: "C3", name: "圣杯三", originalName: "Three of Cups", suit: "cups", element: "水",
    keywords: ["友谊", "庆祝", "社群", "欢乐", "合作"],
    uprightBrief: "友谊的庆祝与合作", reversedBrief: "过度放纵或孤立",
    imageUrl: "icons/thoth-cups-03.png",
    upright: "友谊与庆祝。圣杯三代表社群的欢乐、友谊的庆祝和创造性的合作。这是与朋友相聚、分享喜悦的时刻。",
    reversed: "过度放纵或孤立。可能在社交中过度，或感到与社群隔离。需要找到健康的社交平衡。",
    translations: {
      en: {
        upright: "Friendship and celebration. Three of Cups represents joyful community, friendship celebrations and creative collaboration. Time to gather with friends.",
        reversed: "Excessive indulgence or isolation. Over-socializing or feeling disconnected from community. Find healthy social balance."
      }
    }
  },
  {
    id: "C4", name: "圣杯四", originalName: "Four of Cups", suit: "cups", element: "水",
    keywords: ["沉思", "不满", "重新评估", "退缩", "可能性"],
    uprightBrief: "沉思与重新评估", reversedBrief: "参与或接受机会",
    imageUrl: "icons/thoth-cups-04.png",
    upright: "沉思与重新评估。圣杯四代表对现状的不满和内在的反省。你可能感到无聊或脱离，但这也是重新评估情感需求的机会。",
    reversed: "参与或接受机会。可能从沉思中走出来，或终于看到可用的选项。需要开放心态，接受新的可能性。",
    translations: {
      en: {
        upright: "Contemplation and re-evaluation. Four of Cups represents dissatisfaction with status quo and inner reflection. Opportunity to reassess emotional needs.",
        reversed: "Engaging or accepting opportunities. Coming out of contemplation. Open your mind to new possibilities."
      }
    }
  },
  {
    id: "C5", name: "圣杯五", originalName: "Five of Cups", suit: "cups", element: "水",
    keywords: ["悲伤", "失落", "遗憾", "治愈", "希望"],
    uprightBrief: "悲伤与关注失落", reversedBrief: "接受或向前看",
    imageUrl: "icons/thoth-cups-05.png",
    upright: "悲伤与失落。圣杯五代表情感的失落和遗憾。你可能专注于失去了什么，而忽视了仍然拥有的。允许自己悲伤，然后寻找希望。",
    reversed: "接受或向前看。可能正在从失落中恢复，或终于看到光明的一面。需要原谅过去，拥抱未来。",
    translations: {
      en: {
        upright: "Grief and loss. Five of Cups represents emotional loss and regret. You may focus on what's lost while ignoring what remains. Allow grief, then find hope.",
        reversed: "Acceptance or moving forward. Recovering from loss. Forgive the past and embrace the future."
      }
    }
  },
  {
    id: "C6", name: "圣杯六", originalName: "Six of Cups", suit: "cups", element: "水",
    keywords: ["怀旧", "童年", "礼物", "回忆", "纯真"],
    uprightBrief: "怀旧与纯真的回忆", reversedBrief: "走出过去或依赖",
    imageUrl: "icons/thoth-cups-06.png",
    upright: "怀旧与纯真。圣杯六代表美好的回忆、童年的纯真和善意的馈赠。这是重温美好时光或与他人分享温暖的时刻。",
    reversed: "走出过去或依赖。可能停留在过去，或无法放下童年模式。需要活在当下，建立健康的独立。",
    translations: {
      en: {
        upright: "Nostalgia and innocence. Six of Cups represents fond memories, childhood innocence and kind gifts. Time to revisit good times or share warmth.",
        reversed: "Moving beyond the past or dependency. Stuck in the past. Live in the present, build healthy independence."
      }
    }
  },
  {
    id: "C7", name: "圣杯七", originalName: "Seven of Cups", suit: "cups", element: "水",
    keywords: ["幻想", "选择", "幻觉", "可能性", "迷茫"],
    uprightBrief: "幻想与多种可能性", reversedBrief: "澄清或做出选择",
    imageUrl: "icons/thoth-cups-07.png",
    upright: "幻想与可能性。圣杯七代表丰富的想象力和多种选择，但也可能陷入幻觉和迷茫。不是所有的选项都是真实的。需要澄清什么是真正重要的。",
    reversed: "澄清或做出选择。可能从幻想中清醒，或终于做出决定。需要专注于可行的选项，将梦想变为现实。",
    translations: {
      en: {
        upright: "Fantasy and possibilities. Seven of Cups represents rich imagination and multiple choices, but also illusion and confusion. Not all options are real. Clarify what truly matters.",
        reversed: "Clarification or making a choice. Waking from fantasy. Focus on viable options, turn dreams into reality."
      }
    }
  },
  {
    id: "C8", name: "圣杯八", originalName: "Eight of Cups", suit: "cups", element: "水",
    keywords: ["寻求", "离开", "内在旅程", "不满足", "勇气"],
    uprightBrief: "离开寻求更深的满足", reversedBrief: "停留在不满足中",
    imageUrl: "icons/thoth-cups-08.png",
    upright: "离开与寻求。圣杯八代表离开表面上的满足，寻求更深的意义。你可能有勇气放弃舒适，踏上内在探索的旅程。",
    reversed: "停留在不满足中。可能害怕离开，或无法找到更深的意义。需要诚实地评估什么真正让你满足。",
    translations: {
      en: {
        upright: "Walking away and seeking. Eight of Cups represents leaving surface satisfaction to seek deeper meaning. Courage to abandon comfort for inner exploration.",
        reversed: "Staying in dissatisfaction. Afraid to leave. Honestly assess what truly fulfills you."
      }
    }
  },
  {
    id: "C9", name: "圣杯九", originalName: "Nine of Cups", suit: "cups", element: "水",
    keywords: ["满足", "愿望成真", "愉悦", "享受", "感恩"],
    uprightBrief: "情感的满足与愉悦", reversedBrief: "不满或物质主义",
    imageUrl: "icons/thoth-cups-09.png",
    upright: "情感的满足。圣杯九代表愿望成真和情感的丰盛。你是满足的、愉悦的，能够享受生活中的美好。感恩你所拥有的。",
    reversed: "不满或物质主义。可能外在成功但内在空虚，或无法感到满足。需要寻找更深层次的满足感。",
    translations: {
      en: {
        upright: "Emotional fulfillment. Nine of Cups represents wishes coming true and emotional abundance. You are satisfied. Be grateful for what you have.",
        reversed: "Dissatisfaction or materialism. External success but inner emptiness. Seek deeper fulfillment."
      }
    }
  },
  {
    id: "C10", name: "圣杯十", originalName: "Ten of Cups", suit: "cups", element: "水",
    keywords: ["圆满", "家庭和谐", "幸福", "情感完成", "祝福"],
    uprightBrief: "情感的圆满与幸福", reversedBrief: "家庭不和谐或缺乏连接",
    imageUrl: "icons/thoth-cups-10.png",
    upright: "情感的圆满。圣杯十代表家庭的和谐、情感的完成和生活的幸福。这是被爱和祝福包围的时刻。珍惜与亲人的连接。",
    reversed: "家庭不和谐或缺乏连接。可能家庭关系出现问题，或无法感到真正的幸福。需要修复关系，找到内在的稳定。",
    translations: {
      en: {
        upright: "Emotional completion. Ten of Cups represents family harmony, emotional fulfillment and life happiness. Cherish connections with loved ones.",
        reversed: "Family disharmony or lack of connection. Problems in family relationships. Repair relationships, find inner stability."
      }
    }
  },
  // 圣杯宫廷牌
  {
    id: "C11", name: "圣杯公主", originalName: "Princess of Cups", suit: "cups", element: "水/土",
    keywords: ["敏感", "直觉", "梦想", "温柔", "内省"],
    uprightBrief: "敏感的梦想家与直觉", reversedBrief: "情绪化或脱离现实",
    imageUrl: "icons/thoth-cups-p.png",
    upright: "圣杯公主代表水与土的结合——敏感的直觉和梦想的滋养。她是内在的梦想家，能够深入情感的领域。倾听你的心。",
    reversed: "情绪化或脱离现实。可能沉浸在自己的世界中，或情感过于敏感。需要落地，将梦想变为现实。",
    translations: {
      en: {
        upright: "Princess of Cups represents water and earth combined—sensitive intuition and dream nourishment. An inner dreamer. Listen to your heart.",
        reversed: "Over-emotional or disconnected from reality. Immersed in own world. Ground yourself, turn dreams into reality."
      }
    }
  },
  {
    id: "C12", name: "圣杯王子", originalName: "Prince of Cups", suit: "cups", element: "水/风",
    keywords: ["浪漫", "直觉", "优雅", "变化", "灵感"],
    uprightBrief: "浪漫的灵感与变化", reversedBrief: "情绪化或不稳定",
    imageUrl: "icons/thoth-cups-kn.png",
    upright: "圣杯王子代表水与风的结合——浪漫的灵感和情感的优雅。他带来变化和创造力，以温柔和魅力影响他人。",
    reversed: "情绪化或不稳定。可能情感变化无常，或无法兑现承诺。需要更稳定地表达情感。",
    translations: {
      en: {
        upright: "Prince of Cups represents water and air combined—romantic inspiration and emotional elegance. He brings change and creativity.",
        reversed: "Over-emotional or unstable. Emotionally inconsistent. Express emotions more stably."
      }
    }
  },
  {
    id: "C13", name: "圣杯王后", originalName: "Queen of Cups", suit: "cups", element: "水/水",
    keywords: ["直觉", "慈悲", "情感深度", "同理心", "梦幻"],
    uprightBrief: "深度的直觉与慈悲", reversedBrief: "情绪化或脱离",
    imageUrl: "icons/thoth-cups-q.png",
    upright: "圣杯王后代表水元素的深度——直觉、慈悲和情感的理解。她是情感的容器，能够深深同理他人。信任你的直觉。",
    reversed: "情绪化或脱离现实。可能沉浸在幻想中，或情感变成依赖。需要保持情感的清晰和独立。",
    translations: {
      en: {
        upright: "Queen of Cups represents the depth of water—intuition, compassion and emotional understanding. Trust your intuition.",
        reversed: "Over-emotional or disconnected. Immersed in fantasy. Maintain emotional clarity and independence."
      }
    }
  },
  {
    id: "C14", name: "圣杯国王", originalName: "King of Cups", suit: "cups", element: "水/火",
    keywords: ["情感成熟", "智慧", "慈悲", "平衡", "领导者"],
    uprightBrief: "情感成熟的智慧领导者", reversedBrief: "情感操纵或压抑",
    imageUrl: "icons/thoth-cups-k.png",
    upright: "圣杯国王代表情感的成熟和智慧。他能够平衡情感与理性，以慈悲和理解领导。这是情感智慧和内在平静的象征。",
    reversed: "情感操纵或压抑。可能使用情感控制他人，或无法表达真实的感受。需要诚实地面对自己的情感。",
    translations: {
      en: {
        upright: "King of Cups represents emotional maturity and wisdom. He balances emotion and reason, leads with compassion. Symbol of emotional wisdom.",
        reversed: "Emotional manipulation or suppression. Using emotions to control others. Face your true feelings honestly."
      }
    }
  },

  // ---------- 宝剑/风元素 (Swords) ----------
  {
    id: "S1", name: "宝剑王牌", originalName: "Ace of Swords", suit: "swords", element: "风",
    keywords: ["真理", "清晰", "突破", "智慧", "真相"],
    uprightBrief: "真理的突破与清晰", reversedBrief: "混乱或误用真理",
    imageUrl: "icons/thoth-swords-01.png",
    upright: "真理的突破。宝剑王牌代表风元素的纯粹智慧，带来清晰的思维、真相的显现和突破性的洞察。这是以理性和真理武装自己的时刻。",
    reversed: "混乱或误用真理。可能思维不清晰，或使用真理伤害他人。需要重新整理思绪，以更慈悲的方式表达真相。",
    translations: {
      en: {
        upright: "Breakthrough of truth. Ace of Swords represents pure intelligence of air element, bringing mental clarity and revelation of truth. Arm yourself with reason.",
        reversed: "Confusion or misusing truth. Unclear thinking. Reorganize thoughts, express truth more compassionately."
      }
    }
  },
  {
    id: "S2", name: "宝剑二", originalName: "Two of Swords", suit: "swords", element: "风",
    keywords: ["僵局", "选择", "平衡", "回避", "内心冲突"],
    uprightBrief: "僵局与艰难的选择", reversedBrief: "突破僵局或信息不足",
    imageUrl: "icons/thoth-swords-02.png",
    upright: "僵局与选择。宝剑二代表内心的冲突和难以做出的决定。你可能试图平衡对立的观点，但需要突破僵局，做出选择。",
    reversed: "突破僵局或信息不足。可能终于做出决定，或仍然缺乏清晰的判断。需要获取更多信息，然后行动。",
    translations: {
      en: {
        upright: "Stalemate and choice. Two of Swords represents inner conflict and difficult decisions. You may be trying to balance opposing views. Make a choice.",
        reversed: "Breaking stalemate or lack of information. Finally making a decision. Gather more information, then act."
      }
    }
  },
  {
    id: "S3", name: "宝剑三", originalName: "Three of Swords", suit: "swords", element: "风",
    keywords: ["心碎", "痛苦", "真相", "治愈", "释放"],
    uprightBrief: "心碎与痛苦的真相", reversedBrief: "原谅或从痛苦中恢复",
    imageUrl: "icons/thoth-swords-03.png",
    upright: "心碎与痛苦。宝剑三代表情感上的痛苦和心碎，但这也是真相显现的时刻。通过痛苦，你能够释放旧的模式，走向治愈。",
    reversed: "原谅或恢复。可能正在从痛苦中愈合，或终于能够原谅。需要释放怨恨，让心灵重新打开。",
    translations: {
      en: {
        upright: "Heartbreak and pain. Three of Swords represents emotional pain, but also truth revealed. Through pain, release old patterns and move toward healing.",
        reversed: "Forgiveness or recovery. Healing from pain. Release resentment, allow the heart to open again."
      }
    }
  },
  {
    id: "S4", name: "宝剑四", originalName: "Four of Swords", suit: "swords", element: "风",
    keywords: ["休息", "恢复", "沉思", "安静", "充电"],
    uprightBrief: "休息与恢复的能量", reversedBrief: "不安或拒绝休息",
    imageUrl: "icons/thoth-swords-04.png",
    upright: "休息与恢复。宝剑四代表需要从心智活动中退隐，休息和充电。这不是放弃，而是为了更清晰的思维而进行的必要休整。",
    reversed: "不安或拒绝休息。可能感到内疚而休息，或无法安静下来。需要优先照顾自己的心理健康。",
    translations: {
      en: {
        upright: "Rest and recovery. Four of Swords represents withdrawing from mental activity to rest and recharge. Not giving up, but necessary recuperation.",
        reversed: "Restlessness or refusing rest. Feeling guilty about resting. Prioritize your mental health."
      }
    }
  },
  {
    id: "S5", name: "宝剑五", originalName: "Five of Swords", suit: "swords", element: "风",
    keywords: ["冲突", "胜利", "空虚", "争执", "代价"],
    uprightBrief: "空洞的胜利或冲突", reversedBrief: "和解或放下争执",
    imageUrl: "icons/thoth-swords-05.png",
    upright: "空洞的胜利。宝剑五代表通过冲突获得的胜利，但代价是关系的损害。问自己：这场胜利值得吗？可能有更有尊严的方式。",
    reversed: "和解或放下争执。可能意识到冲突的徒劳，或选择原谅。需要从争斗中走出来，寻找和平。",
    translations: {
      en: {
        upright: "Hollow victory. Five of Swords represents victory through conflict, but at the cost of relationships. Is this victory worth it? Seek more dignified ways.",
        reversed: "Reconciliation or letting go of conflict. Realizing the futility of fighting. Walk away from battle, seek peace."
      }
    }
  },
  {
    id: "S6", name: "宝剑六", originalName: "Six of Swords", suit: "swords", element: "风",
    keywords: ["过渡", "疗愈之旅", "放下", "移动", "平静"],
    uprightBrief: "平静的过渡与疗愈", reversedBrief: "抗拒过渡或无法放下",
    imageUrl: "icons/thoth-swords-06.png",
    upright: "过渡与疗愈。宝剑六代表从困难中移动到更平静的水域。这可能是一个艰难的过渡，但必要且最终会带来平静。",
    reversed: "抗拒过渡或无法放下。可能停留在痛苦中，或无法前进。需要勇敢地迈出下一步，相信前方有更好的。",
    translations: {
      en: {
        upright: "Transition and healing. Six of Swords represents moving from difficulty to calmer waters. A challenging transition, but necessary and ultimately peaceful.",
        reversed: "Resisting transition or unable to let go. Staying in pain. Brave the next step, trust that better lies ahead."
      }
    }
  },
  {
    id: "S7", name: "宝剑七", originalName: "Seven of Swords", suit: "swords", element: "风",
    keywords: ["策略", "欺骗", "隐秘", "机智", "逃避"],
    uprightBrief: "策略或隐秘的行动", reversedBrief: "坦白或面对真相",
    imageUrl: "icons/thoth-swords-07.png",
    upright: "策略与隐秘。宝剑七代表使用机智和策略达到目的，但也可能涉及欺骗或逃避。审视你的动机——是聪明的策略还是不诚实？",
    reversed: "坦白或面对真相。可能不再隐藏，或欺骗被揭露。需要诚实面对自己和他人。",
    translations: {
      en: {
        upright: "Strategy and secrecy. Seven of Swords represents using wit and strategy, but may also involve deception. Examine your motives—clever strategy or dishonesty?",
        reversed: "Coming clean or facing truth. No longer hiding. Be honest with yourself and others."
      }
    }
  },
  {
    id: "S8", name: "宝剑八", originalName: "Eight of Swords", suit: "swords", element: "风",
    keywords: ["限制", "受害者", "绝望", "觉醒", "自由"],
    uprightBrief: "自我限制与受害者心态", reversedBrief: "解放或看到出路",
    imageUrl: "icons/thoth-swords-08.png",
    upright: "自我限制。宝剑八代表感到被困和无力，但往往限制是你自己创造的。你拥有自由，只需要睁开眼睛看见出路。",
    reversed: "解放或看到出路。可能意识到自己不是真正的受害者，或找到了解决问题的方法。需要采取行动打破限制。",
    translations: {
      en: {
        upright: "Self-imposed limitation. Eight of Swords represents feeling trapped, but the restrictions are often self-created. You have freedom, just open your eyes.",
        reversed: "Liberation or seeing a way out. Realizing you're not truly a victim. Take action to break limitations."
      }
    }
  },
  {
    id: "S9", name: "宝剑九", originalName: "Nine of Swords", suit: "swords", element: "风",
    keywords: ["焦虑", "噩梦", "恐惧", "担忧", "绝望"],
    uprightBrief: "焦虑与深夜的恐惧", reversedBrief: "释放恐惧或寻求帮助",
    imageUrl: "icons/thoth-swords-09.png",
    upright: "焦虑与恐惧。宝剑九代表深夜的担忧、噩梦和焦虑。你的思维可能在制造恐惧。需要区分真实的威胁和想象的恐惧。",
    reversed: "释放恐惧或寻求帮助。可能焦虑开始缓解，或终于愿意谈论恐惧。需要寻求支持，不要独自承受。",
    translations: {
      en: {
        upright: "Anxiety and fear. Nine of Swords represents midnight worries, nightmares and anxiety. Your mind may be creating fear. Distinguish real threats from imagined.",
        reversed: "Releasing fear or seeking help. Anxiety beginning to ease. Seek support, don't bear it alone."
      }
    }
  },
  {
    id: "S10", name: "宝剑十", originalName: "Ten of Swords", suit: "swords", element: "风",
    keywords: ["终结", "失败", "谷底", "释放", "重新开始"],
    uprightBrief: "痛苦的终结与谷底", reversedBrief: "恢复或从谷底爬起",
    imageUrl: "icons/thoth-swords-10.png",
    upright: "痛苦的终结。宝剑十代表情况的彻底结束，往往是痛苦的。但这也是谷底——最黑暗的时刻之后，唯一的方向是向上。",
    reversed: "恢复或从谷底爬起。可能正在从最困难的情况中恢复，或终于能够放下。需要相信新的开始是可能的。",
    translations: {
      en: {
        upright: "Painful ending. Ten of Swords represents the complete end of a situation, often painful. But this is rock bottom—after darkest moment, only direction is up.",
        reversed: "Recovery or rising from rock bottom. Healing from the most difficult situation. Believe that new beginnings are possible."
      }
    }
  },
  // 宝剑宫廷牌
  {
    id: "S11", name: "宝剑公主", originalName: "Princess of Swords", suit: "swords", element: "风/土",
    keywords: ["清晰", "真理", "敏锐", "独立", "直接"],
    uprightBrief: "清晰的真理与敏锐", reversedBrief: "刻薄或过于批判",
    imageUrl: "icons/thoth-swords-p.png",
    upright: "宝剑公主代表风与土的结合——清晰的思维和对真理的追求。她是独立的思考者，能够看穿幻象。以清晰和直接沟通。",
    reversed: "刻薄或过于批判。可能使用真理作为武器，或思维过于尖锐。需要以更多的慈悲来表达真相。",
    translations: {
      en: {
        upright: "Princess of Swords represents air and earth combined—clear thinking and pursuit of truth. An independent thinker. Communicate with clarity and directness.",
        reversed: "Harsh or overly critical. Using truth as a weapon. Express truth with more compassion."
      }
    }
  },
  {
    id: "S12", name: "宝剑王子", originalName: "Prince of Swords", suit: "swords", element: "风/火",
    keywords: ["行动", "真理", "速度", "智力", "冲动"],
    uprightBrief: "迅速的行动与真理", reversedBrief: "鲁莽或冷酷",
    imageUrl: "icons/thoth-swords-kn.png",
    upright: "宝剑王子代表风与火的结合——迅速的行动和敏锐的智力。他带来真理和改变，但也可能过于冲动。以速度和智慧前进。",
    reversed: "鲁莽或冷酷。可能行动不考虑后果，或真理变成残忍。需要更有策略地和慈悲地行动。",
    translations: {
      en: {
        upright: "Prince of Swords represents air and fire combined—swift action and keen intelligence. He brings truth and change, but may be too impulsive.",
        reversed: "Reckless or cold. Acting without considering consequences. Act more strategically and compassionately."
      }
    }
  },
  {
    id: "S13", name: "宝剑王后", originalName: "Queen of Swords", suit: "swords", element: "风/水",
    keywords: ["独立", "清晰", "诚实", "智慧", "界限"],
    uprightBrief: "独立的清晰与智慧", reversedBrief: "冷酷或过于尖锐",
    imageUrl: "icons/thoth-swords-q.png",
    upright: "宝剑王后代表风与水的结合——独立的思维和情感的清晰。她是诚实的、智慧的，能够设定健康的界限。以真理和慈悲领导。",
    reversed: "冷酷或过于尖锐。可能使用智力批评他人，或无法表达脆弱。需要平衡真理与同理心。",
    translations: {
      en: {
        upright: "Queen of Swords represents air and water combined—independent thinking and emotional clarity. Honest and wise. Lead with truth and compassion.",
        reversed: "Cold or overly sharp. Using intellect to criticize. Balance truth with empathy."
      }
    }
  },
  {
    id: "S14", name: "宝剑国王", originalName: "King of Swords", suit: "swords", element: "风/风",
    keywords: ["权威", "真理", "公正", "逻辑", "力量"],
    uprightBrief: "权威的真理与公正", reversedBrief: "专制或冷酷理智",
    imageUrl: "icons/thoth-swords-k.png",
    upright: "宝剑国王代表风元素的权威——真理、公正和清晰的思维。他以逻辑和理性领导，做出公正的判断。这是理智和权威的象征。",
    reversed: "专制或冷酷的理智。可能滥用逻辑控制他人，或缺乏同理心。需要平衡理性与情感智慧。",
    translations: {
      en: {
        upright: "King of Swords represents authority of air—truth, justice and clear thinking. He leads with logic and reason. Symbol of intellectual authority.",
        reversed: "Dictatorial or cold intellect. Misusing logic to control. Balance reason with emotional wisdom."
      }
    }
  },

  // ---------- 星币/土元素 (Pentacles/Disks) ----------
  {
    id: "P1", name: "星币王牌", originalName: "Ace of Pentacles", suit: "pentacles", element: "土",
    keywords: ["机会", "丰盛", "物质", "新开始", "显化"],
    uprightBrief: "物质机会的种子", reversedBrief: "错失机会或延迟",
    imageUrl: "icons/thoth-pents-01.png",
    upright: "物质机会的种子。星币王牌代表土元素的纯粹丰盛，带来物质成功、财务机会和实用的新开始。这是播种物质收获的时刻。",
    reversed: "错失机会或延迟。可能物质机会被忽视，或无法落地。需要重新评估你的实用计划，抓住可用的机会。",
    translations: {
      en: {
        upright: "The seed of material opportunity. Ace of Pentacles represents pure abundance of earth element, bringing material success and financial opportunity. Time to plant for material harvest.",
        reversed: "Missed opportunity or delay. Material opportunities overlooked. Re-evaluate your practical plans, seize available opportunities."
      }
    }
  },
  {
    id: "P2", name: "星币二", originalName: "Two of Pentacles", suit: "pentacles", element: "土",
    keywords: ["平衡", "适应", "多任务", "灵活", "调整"],
    uprightBrief: "平衡多个责任", reversedBrief: "不平衡或过度伸展",
    imageUrl: "icons/thoth-pents-02.png",
    upright: "平衡与适应。星币二代表在多任务中保持平衡，灵活地适应变化。你可能感到忙碌，但能够优雅地应对多个责任。",
    reversed: "不平衡或过度伸展。可能试图做太多事情，或无法保持平衡。需要优先排序，放下一些负担。",
    translations: {
      en: {
        upright: "Balance and adaptation. Two of Pentacles represents maintaining balance amid multitasking. You may be busy, but handling multiple responsibilities gracefully.",
        reversed: "Imbalance or overstretching. Trying to do too much. Prioritize and put down some burdens."
      }
    }
  },
  {
    id: "P3", name: "星币三", originalName: "Three of Pentacles", suit: "pentacles", element: "土",
    keywords: ["合作", "技能", "团队", "质量", "认可"],
    uprightBrief: "合作与技能的体现", reversedBrief: "缺乏合作或低质量",
    imageUrl: "icons/thoth-pents-03.png",
    upright: "合作与技能。星币三代表团队合作和技能的精致体现。你的努力得到了认可，团队工作带来高质量的结果。继续建造。",
    reversed: "缺乏合作或低质量。可能团队不和谐，或工作质量不佳。需要重新评估合作方式，提高标准。",
    translations: {
      en: {
        upright: "Collaboration and skill. Three of Pentacles represents teamwork and refined expression of skills. Your efforts are recognized. Continue building.",
        reversed: "Lack of collaboration or poor quality. Team disharmony. Re-evaluate collaboration, raise standards."
      }
    }
  },
  {
    id: "P4", name: "星币四", originalName: "Four of Pentacles", suit: "pentacles", element: "土",
    keywords: ["稳定", "控制", "固执", "安全", "保留"],
    uprightBrief: "物质的稳定与控制", reversedBrief: "释放或过度控制",
    imageUrl: "icons/thoth-pents-04.png",
    upright: "稳定与控制。星币四代表对资源和财务的牢牢控制。这带来安全感，但也可能变成固执或吝啬。需要平衡安全与流动。",
    reversed: "释放或过度控制。可能终于愿意分享，或仍然紧紧抓住不放。需要信任生命的丰盛，允许能量流动。",
    translations: {
      en: {
        upright: "Stability and control. Four of Pentacles represents tight control over resources. Brings security, but may become stubbornness. Balance security with flow.",
        reversed: "Releasing or over-controlling. Finally willing to share. Trust in abundance, allow energy to flow."
      }
    }
  },
  {
    id: "P5", name: "星币五", originalName: "Five of Pentacles", suit: "pentacles", element: "土",
    keywords: ["困难", "贫困", "孤立", "健康", "支持"],
    uprightBrief: "物质的困难与挑战", reversedBrief: "改善或寻求帮助",
    imageUrl: "icons/thoth-pents-05.png",
    upright: "物质的困难。星币五代表财务上的挑战、贫困或健康问题。你可能感到孤立无援，但帮助就在附近。不要害怕寻求支持。",
    reversed: "改善或寻求帮助。可能情况开始好转，或终于愿意接受帮助。需要从困难中学习和成长。",
    translations: {
      en: {
        upright: "Material hardship. Five of Pentacles represents financial challenges or health issues. You may feel isolated, but help is near. Don't hesitate to seek support.",
        reversed: "Improvement or seeking help. Situation beginning to improve. Learn and grow from difficulties."
      }
    }
  },
  {
    id: "P6", name: "星币六", originalName: "Six of Pentacles", suit: "pentacles", element: "土",
    keywords: ["慷慨", "给予", "接收", "平衡", "慈善"],
    uprightBrief: "慷慨与资源的分享", reversedBrief: "自私或依赖",
    imageUrl: "icons/thoth-pents-06.png",
    upright: "慷慨与分享。星币六代表资源的公平分配、慷慨的给予和感恩的接收。这是分享你的丰盛或接受帮助的时刻。",
    reversed: "自私或依赖。可能不愿意分享，或过度依赖他人的慷慨。需要找到给予和接收的健康平衡。",
    translations: {
      en: {
        upright: "Generosity and sharing. Six of Pentacles represents fair distribution of resources. Time to share your abundance or accept help.",
        reversed: "Selfishness or dependency. Unwilling to share. Find healthy balance between giving and receiving."
      }
    }
  },
  {
    id: "P7", name: "星币七", originalName: "Seven of Pentacles", suit: "pentacles", element: "土",
    keywords: ["耐心", "评估", "成长", "投资", "等待"],
    uprightBrief: "评估成长与耐心等待", reversedBrief: "不耐烦或放弃",
    imageUrl: "icons/thoth-pents-07.png",
    upright: "耐心与评估。星币七代表审视你的投资和努力的成长。收获需要时间，不要急于求成。评估什么在起作用，什么需要调整。",
    reversed: "不耐烦或放弃。可能期望过快的结果，或考虑放弃。需要重新评估你的长期计划，保持耐心。",
    translations: {
      en: {
        upright: "Patience and evaluation. Seven of Pentacles represents examining the growth of your investments. Harvest takes time. Assess what's working.",
        reversed: "Impatience or giving up. Expecting quick results. Re-evaluate long-term plans, be patient."
      }
    }
  },
  {
    id: "P8", name: "星币八", originalName: "Eight of Pentacles", suit: "pentacles", element: "土",
    keywords: ["工艺", "努力", "学习", "专注", "精进"],
    uprightBrief: "专注的工艺与精进", reversedBrief: "缺乏动力或低质量工作",
    imageUrl: "icons/thoth-pents-08.png",
    upright: "工艺与精进。星币八代表专注的努力、学习和技能的精进。你致力于精通你的工艺，通过持续的努力达到卓越。",
    reversed: "缺乏动力或低质量工作。可能对工作失去兴趣，或无法专注于任务。需要重新找到工作的意义和动力。",
    translations: {
      en: {
        upright: "Craftsmanship and refinement. Eight of Pentacles represents dedicated effort and skill refinement. You are committed to mastering your craft.",
        reversed: "Lack of motivation or poor quality work. Lost interest in work. Re-find meaning and motivation in your work."
      }
    }
  },
  {
    id: "P9", name: "星币九", originalName: "Nine of Pentacles", suit: "pentacles", element: "土",
    keywords: ["丰盛", "独立", "优雅", "成就", "享受"],
    uprightBrief: "物质的丰盛与独立", reversedBrief: "依赖或物质主义",
    imageUrl: "icons/thoth-pents-09.png",
    upright: "物质的丰盛。星币九代表独立、优雅和物质的成就。你已经通过努力获得了丰盛，现在是享受成果的时候。欣赏你创造的美好。",
    reversed: "依赖或物质主义。可能外在成功但内在空虚，或无法独立。需要重新评估什么真正带来满足。",
    translations: {
      en: {
        upright: "Material abundance. Nine of Pentacles represents independence and material achievement. You have earned abundance through effort. Enjoy the fruits of your labor.",
        reversed: "Dependency or materialism. External success but inner emptiness. Re-evaluate what truly brings fulfillment."
      }
    }
  },
  {
    id: "P10", name: "星币十", originalName: "Ten of Pentacles", suit: "pentacles", element: "土",
    keywords: ["传承", "家族", "财富", "完成", "稳定"],
    uprightBrief: "家族的传承与物质完成", reversedBrief: "家庭冲突或财富损失",
    imageUrl: "icons/thoth-pents-10.png",
    upright: "家族的传承。星币十代表物质的完成、家族的财富和长期的稳定。这是享受家族祝福和传承智慧的时刻。建立持久的 foundation。",
    reversed: "家庭冲突或财富损失。可能家庭关系紧张，或财务不稳定。需要修复家庭纽带，重新建立稳定。",
    translations: {
      en: {
        upright: "Family legacy. Ten of Pentacles represents material completion, family wealth and long-term stability. Enjoy family blessings. Build lasting foundation.",
        reversed: "Family conflict or wealth loss. Tension in family relationships. Repair family bonds, re-establish stability."
      }
    }
  },
  // 星币宫廷牌
  {
    id: "P11", name: "星币公主", originalName: "Princess of Pentacles", suit: "pentacles", element: "土/土",
    keywords: ["滋养", "实用", "耐心", "接地", "丰盛"],
    uprightBrief: "滋养的实用与耐心", reversedBrief: "过度谨慎或固执",
    imageUrl: "icons/thoth-pents-p.png",
    upright: "星币公主代表土元素的纯粹——滋养、实用和耐心。她是土地的守护者，能够将想法变为有形的现实。以耐心和 dedication 培育你的项目。",
    reversed: "过度谨慎或固执。可能抗拒变化，或过于保守。需要更加开放和灵活，允许新的成长。",
    translations: {
      en: {
        upright: "Princess of Pentacles represents purity of earth—nurturing, practical and patient. She can turn ideas into tangible reality. Nurture your projects with patience.",
        reversed: "Overly cautious or stubborn. Resisting change. Be more open and flexible, allow new growth."
      }
    }
  },
  {
    id: "P12", name: "星币王子", originalName: "Prince of Pentacles", suit: "pentacles", element: "土/火",
    keywords: ["可靠", "努力", "稳定", "慢速", "实用"],
    uprightBrief: "可靠的努力与稳定", reversedBrief: "懒惰或过度工作",
    imageUrl: "icons/thoth-pents-kn.png",
    upright: "星币王子代表土与火的结合——可靠的努力和稳定的进展。他带来实际的成果，但进展可能较慢。以耐心和一致性工作。",
    reversed: "懒惰或过度工作。可能缺乏动力，或工作到精疲力尽。需要找到工作与休息的健康平衡。",
    translations: {
      en: {
        upright: "Prince of Pentacles represents earth and fire combined—reliable effort and steady progress. He brings practical results. Work with patience and consistency.",
        reversed: "Laziness or overworking. Lack of motivation or working to exhaustion. Find healthy work-rest balance."
      }
    }
  },
  {
    id: "P13", name: "星币王后", originalName: "Queen of Pentacles", suit: "pentacles", element: "土/水",
    keywords: ["滋养", "实用", "丰盛", "接地", "照顾"],
    uprightBrief: "滋养的丰盛与实用智慧", reversedBrief: "过度保护或忽视自我",
    imageUrl: "icons/thoth-pents-q.png",
    upright: "星币王后代表土与水的结合——实用的滋养和物质的丰盛。她是照顾者，能够创造舒适和安全的家。以实用和智慧管理资源。",
    reversed: "过度保护或忽视自我照顾。可能过于关注他人而忽略自己，或无法有效管理资源。需要平衡给予和接收。",
    translations: {
      en: {
        upright: "Queen of Pentacles represents earth and water combined—practical nurturing and material abundance. She creates comfortable home. Manage resources with wisdom.",
        reversed: "Overprotective or neglecting self-care. Focusing too much on others. Balance giving and receiving."
      }
    }
  },
  {
    id: "P14", name: "星币国王", originalName: "King of Pentacles", suit: "pentacles", element: "土/风",
    keywords: ["丰盛", "商业", "稳定", "实用", "成功"],
    uprightBrief: "物质的丰盛与商业成功", reversedBrief: "贪婪或过度控制",
    imageUrl: "icons/thoth-pents-k.png",
    upright: "星币国王代表物质的丰盛和商业的成功。他是可靠的管理者，能够建立持久的物质基础。以实用和智慧管理你的资源。",
    reversed: "贪婪或过度控制。可能过于执着于物质，或滥用财务权力。需要重新平衡物质与精神价值。",
    translations: {
      en: {
        upright: "King of Pentacles represents material abundance and business success. A reliable manager who builds lasting foundation. Manage resources with practicality.",
        reversed: "Greed or excessive control. Overly attached to material. Re-balance material and spiritual values."
      }
    }
  }
];
