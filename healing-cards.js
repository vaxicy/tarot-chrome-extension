// 治愈塔罗牌数据 (Healing Tarot) - 78张牌完整版
// 专注于心理疗愈、情绪释放和内在成长
// 牌意强调：自我接纳、创伤修复、能量疗愈、内在小孩
const healingCards = [
  // ============ 大阿卡纳 Major Arcana (22张) ============
  {
    id: 0, name: "愚者", originalName: "The Fool", suit: "major", element: "风",
    keywords: ["新的开始", "信任", "自由", "无限可能", "纯真"],
    uprightBrief: "带着信任踏上疗愈之旅", reversedBrief: "恐惧阻碍新开始",
    imageUrl: "icons/major/tarot-major-00.png",
    upright: "你正站在疗愈之旅的起点。放下过去的包袱，像孩子一样信任生命的流动。每一次跌倒都是学习，每一次起身都是成长。拥抱未知，你的内在智慧会指引你。",
    reversed: "对未知的恐惧让你停滞不前。可能需要先疗愈安全感的问题，才能勇敢迈出第一步。记住：你比自己想象的更勇敢。",
    translations: {
      en: {
        upright: "You are standing at the starting point of a healing journey. Let go of past burdens, trust the flow of life like a child. Every fall is learning, every rise is growth. Embrace the unknown, your inner wisdom will guide you.",
        reversed: "Fear of the unknown keeps you stuck. You may need to heal safety issues before bravely taking the first step. Remember: you are braver than you think."
      }
    }
  },
  {
    id: 1, name: "魔法师", originalName: "The Magician", suit: "major", element: "风",
    keywords: ["显化", "创造力", "意志力", "资源", "疗愈力量"],
    uprightBrief: "运用内在力量显化疗愈", reversedBrief: "怀疑自己的疗愈能力",
    imageUrl: "icons/major/tarot-major-01.png",
    upright: "你拥有疗愈自己和他人的力量。你的意念、话语和行动都是工具。相信自己，你就是奇迹的创造者。现在是将内在疗愈显化为现实的时候了。",
    reversed: "你忘记了自己的力量。可能陷入「我不行」的信念中。重新连接你的内在魔法，你值得被疗愈，也有能力疗愈。",
    translations: {
      en: {
        upright: "You have the power to heal yourself and others. Your thoughts, words, and actions are tools. Believe in yourself, you are the creator of miracles. Now is the time to manifest inner healing into reality.",
        reversed: "You have forgotten your power. You may be trapped in the belief of 'I can't'. Reconnect with your inner magic, you deserve to be healed and have the ability to heal."
      }
    }
  },
  {
    id: 2, name: "女祭司", originalName: "The High Priestess", suit: "major", element: "水",
    keywords: ["直觉", "内在智慧", "静心", "神秘", "潜意识"],
    uprightBrief: "倾听内在声音与直觉", reversedBrief: "忽视直觉或过度理性",
    imageUrl: "icons/major/tarot-major-02.png",
    upright: "你的直觉正在对你说话。在静默中，答案会浮现。不要急于寻求外在的答案，你的内在知道所有真相。给自己独处的时间，聆听内心的低语。",
    reversed: "你一直在忽视自己的直觉。可能用理性压抑了内在的声音。试着放下分析，感受身体的智慧。答案不在头脑里，而在心里。",
    translations: {
      en: {
        upright: "Your intuition is speaking to you. In silence, answers will surface. Don't rush to seek external answers, your inner self knows all truths. Give yourself alone time, listen to the whisper of your heart.",
        reversed: "You have been ignoring your intuition. You may have suppressed your inner voice with rationality. Try to let go of analysis, feel the wisdom of your body. Answers are not in the mind, but in the heart."
      }
    }
  },
  {
    id: 3, name: "女皇", originalName: "The Empress", suit: "major", element: "土",
    keywords: ["自我关爱", "丰盛", "滋养", "接受", "感官疗愈"],
    uprightBrief: "学会珍爱自己滋养他人", reversedBrief: "自我批评或过度付出",
    imageUrl: "icons/major/tarot-major-03.png",
    upright: "你是值得被爱的。学会像对待最好的朋友一样对待自己。给自己温柔、耐心和滋养。当你填满自己的杯子，你才能分享爱给他人。这是自我接纳的美好时刻。",
    reversed: "你对自己太苛刻了。可能一直在向外给予，却忘记了照顾自己。你的内在小孩需要你的爱和关注。先疗愈自己，才能健康地爱他人。",
    translations: {
      en: {
        upright: "You are worthy of love. Learn to treat yourself like you would treat your best friend. Give yourself gentleness, patience, and nourishment. When you fill your own cup, you can share love with others. This is a beautiful moment of self-acceptance.",
        reversed: "You are too harsh on yourself. You may have been giving outward but forgotten to take care of yourself. Your inner child needs your love and attention. Heal yourself first before you can love others healthily."
      }
    }
  },
  {
    id: 4, name: "皇帝", originalName: "The Emperor", suit: "major", element: "火",
    keywords: ["边界", "稳定", "自我纪律", "保护", "内在权威"],
    uprightBrief: "建立健康的个人边界", reversedBrief: "控制欲过强或缺乏结构",
    imageUrl: "icons/major/tarot-major-04.png",
    upright: "健康的边界是爱的表现。学会说「不」，保护自己的能量。你不需要取悦所有人。建立内在的结构和安全感，你就是自己生命的统治者。",
    reversed: "你可能在他人面前失去了自己，或者相反——用控制来保护自己。健康的权威来自于内在的稳定，而非外在的强迫。重新连接你的中心。",
    translations: {
      en: {
        upright: "Healthy boundaries are an expression of love. Learn to say 'no' and protect your energy. You don't need to please everyone. Establish inner structure and security, you are the ruler of your own life.",
        reversed: "You may have lost yourself in front of others, or conversely - using control to protect yourself. Healthy authority comes from inner stability, not external force. Reconnect with your center."
      }
    }
  },
  {
    id: 5, name: "教皇", originalName: "The Hierophant", suit: "major", element: "土",
    keywords: ["内在导师", "灵性疗愈", "传统智慧", "信仰", "连接高我"],
    uprightBrief: "连接内在导师与更高智慧", reversedBrief: "盲目追随或反叛权威",
    imageUrl: "icons/major/tarot-major-05.png",
    upright: "你内在的导师一直都在。不需要向外寻求认可，你的高我深知你该走的路。尊重你的灵性旅程，也尊重他人的。疗愈往往来自于与更高意识的连接。",
    reversed: "你可能在盲目追随外在权威，或者相反——完全拒绝任何指导。真正的老师在你心中。学会区分外在声音和内在智慧，你的答案在你之内。",
    translations: {
      en: {
        upright: "Your inner teacher has always been there. No need to seek external approval, your Higher Self knows the path you should take. Respect your spiritual journey and others' too. Healing often comes from connecting with higher consciousness.",
        reversed: "You may be blindly following external authorities, or conversely - completely rejecting any guidance. The true teacher is within you. Learn to distinguish external voices from inner wisdom, your answers are within you."
      }
    }
  },
  {
    id: 6, name: "恋人", originalName: "The Lovers", suit: "major", element: "风",
    keywords: ["自爱", "和谐关系", "价值选择", "整合", "内在合一"],
    uprightBrief: "学习爱自己与他人", reversedBrief: "关系失衡或价值冲突",
    imageUrl: "icons/major/tarot-major-06.png",
    upright: "真正的爱始于自爱。当你接纳自己的一切——光明与阴影，你才能健康地爱他人。这是关于选择：选择符合你最高利益的道路。你值得被爱，首先是被你自己爱。",
    reversed: "你可能在关系中失去了自己，或者在自我接纳上有困难。外在的关系反映内在的关系。先疗愈与自己的关系，外在关系自然会改善。",
    translations: {
      en: {
        upright: "True love begins with self-love. When you accept all of yourself - light and shadow, you can love others healthily. This is about choice: choose the path that aligns with your highest good. You deserve love, first of all from yourself.",
        reversed: "You may have lost yourself in relationships, or have difficulty with self-acceptance. External relationships reflect internal relationships. Heal your relationship with yourself first, external relationships will naturally improve."
      }
    }
  },
  {
    id: 7, name: "战车", originalName: "The Chariot", suit: "major", element: "水",
    keywords: ["意志力", "克服恐惧", "专注", "胜利", "疗愈动力"],
    uprightBrief: "用意志力推动疗愈进程", reversedBrief: "缺乏方向或过度控制",
    imageUrl: "icons/major/tarot-major-07.png",
    upright: "你有力量克服一切障碍。你的意志力是强大的疗愈工具。专注在你的目标上，不要让恐惧阻止你。你正在赢得与自己的战斗——战胜自我怀疑和限制性信念。",
    reversed: "你可能感到失去控制，或者相反——试图过度控制一切。真正的力量是柔韧的。有时候，你需要放下控制，让生命流动。信任过程。",
    translations: {
      en: {
        upright: "You have the power to overcome all obstacles. Your willpower is a powerful healing tool. Focus on your goal, don't let fear stop you. You are winning the battle with yourself - overcoming self-doubt and limiting beliefs.",
        reversed: "You may feel out of control, or conversely - trying to control everything excessively. True power is flexible. Sometimes, you need to let go of control and let life flow. Trust the process."
      }
    }
  },
  {
    id: 8, name: "力量", originalName: "Strength", suit: "major", element: "火",
    keywords: ["勇气", "温柔力量", "耐心", "同理心", "内在韧性"],
    uprightBrief: "用温柔和勇气面对创伤", reversedBrief: "自我怀疑或内在批判",
    imageUrl: "icons/major/tarot-major-08.png",
    upright: "真正的力量是温柔的。你不需要变得强硬来疗愈。用同理心和耐心对待自己的伤口。你的内在韧性比你想象的更强大。拥抱你的脆弱，那是勇气的入口。",
    reversed: "你可能在批判自己「不够坚强」。事实上，承认脆弱需要更大的勇气。停止内在批判，用温柔的声音对待自己。你已经足够勇敢了。",
    translations: {
      en: {
        upright: "True strength is gentle. You don't need to become tough to heal. Treat your wounds with empathy and patience. Your inner resilience is stronger than you think. Embrace your vulnerability, that is the entrance to courage.",
        reversed: "You may be criticizing yourself for 'not being strong enough'. In fact, admitting vulnerability takes even greater courage. Stop inner criticism, treat yourself with a gentle voice. You are already brave enough."
      }
    }
  },
  {
    id: 9, name: "隐士", originalName: "The Hermit", suit: "major", element: "土",
    keywords: ["内省", "独处疗愈", "智慧", "寻找真相", "灵性 retreat"],
    uprightBrief: "在独处中找到内在答案", reversedBrief: "孤立或逃避现实",
    imageUrl: "icons/major/tarot-major-09.png",
    upright: "有时候，你需要退隐来听见自己。独处不是孤独，而是与自己的约会。在安静中，你会找到一直寻找的答案。这是深度疗愈的时刻——与自己重新连接。",
    reversed: "你可能用孤独来逃避，或者害怕面对自己。独处应该是滋养的，而非隔离的。如果你感到孤独，那是你的内在在呼唤连接。先与自己成为朋友。",
    translations: {
      en: {
        upright: "Sometimes, you need to retreat to hear yourself. Solitude is not loneliness, but a date with yourself. In quiet, you will find the answers you have been seeking. This is a moment of deep healing - reconnecting with yourself.",
        reversed: "You may be using loneliness to escape, or afraid to face yourself. Solitude should be nourishing, not isolating. If you feel lonely, it's your inner self calling for connection. Become friends with yourself first."
      }
    }
  },
  {
    id: 10, name: "命运之轮", originalName: "Wheel of Fortune", suit: "major", element: "火",
    keywords: ["转变", "接受变化", "周期", "信任过程", "释放控制"],
    uprightBrief: "接受生命的自然流转", reversedBrief: "抗拒变化或宿命论",
    imageUrl: "icons/major/tarot-major-10.png",
    upright: "生命是循环的。好坏都会过去。不要执着于此刻的状况，也不要抗拒变化。疗愈往往发生在你放下「应该」、接受「是」的时候。信任生命的流转。",
    reversed: "你可能在抗拒必要的改变，或者相信自己是命运的受害者。记住：轮子在转动，这也会过去。你不是受害者，你是自己生命的共同创造者。",
    translations: {
      en: {
        upright: "Life is cyclical. Both good and bad will pass. Don't cling to the current situation, don't resist change. Healing often happens when you let go of 'should' and accept 'is'. Trust the flow of life.",
        reversed: "You may be resisting necessary changes, or believing you are a victim of fate. Remember: the wheel is turning, this too shall pass. You are not a victim, you are the co-creator of your own life."
      }
    }
  },
  {
    id: 11, name: "正义", originalName: "Justice", suit: "major", element: "风",
    keywords: ["自我诚实", "因果", "宽恕", "平衡", "接纳真相"],
    uprightBrief: "诚实地面对自己与他人", reversedBrief: "自我审判或指责他人",
    imageUrl: "icons/major/tarot-major-11.png",
    upright: "疗愈需要诚实。诚实地看待自己的模式、选择和创伤。不是为了审判，而是为了理解。当你对自己诚实，你就能释放评判，拥抱宽恕。平衡终将到来。",
    reversed: "你可能在严厉地审判自己，或者指责他人。真正的正义不是惩罚，而是理解和平衡。放下「对与错」的二元对立，看见更大的画面。宽恕是给你的礼物。",
    translations: {
      en: {
        upright: "Healing requires honesty. Honestly look at your patterns, choices, and traumas. Not to judge, but to understand. When you are honest with yourself, you can release judgment and embrace forgiveness. Balance will eventually come.",
        reversed: "You may be judging yourself harshly, or blaming others. True justice is not punishment, but understanding and balance. Let go of the binary of 'right and wrong', see the bigger picture. Forgiveness is a gift to yourself."
      }
    }
  },
  {
    id: 12, name: "倒吊人", originalName: "The Hanged Man", suit: "major", element: "水",
    keywords: ["放下", "换个视角", "臣服", "耐心", "灵性觉醒"],
    uprightBrief: "放下控制获得新的视角", reversedBrief: "拖延或抗拒放下",
    imageUrl: "icons/major/tarot-major-12.png",
    upright: "有时候，停止挣扎就是疗愈的开始。放下「必须怎样」的执念，换个角度看问题。臣服不是放弃，而是信任更大的计划。在「不做」中，你会找到真正的「做」。",
    reversed: "你可能在拖延必要的放手，或者用旧模式拖延疗愈。有时候，你需要采取行动而非被动等待。分辨哪些是你可以控制的，哪些需要臣服。",
    translations: {
      en: {
        upright: "Sometimes, stopping struggling is the beginning of healing. Let go of the obsession of 'how it must be', look at the problem from a different angle. Surrender is not giving up, but trusting a bigger plan. In 'non-doing', you will find true 'doing'.",
        reversed: "You may be procrastinating necessary letting go, or using old patterns to delay healing. Sometimes, you need to take action rather than wait passively. Distinguish what you can control and what requires surrender."
      }
    }
  },
  {
    id: 13, name: "死神", originalName: "Death", suit: "major", element: "水",
    keywords: ["释放", "终结旧模式", "重生", "转化", "深度疗愈"],
    uprightBrief: "勇敢地结束以迎接新生", reversedBrief: "抗拒结束恐惧改变",
    imageUrl: "icons/major/tarot-major-13.png",
    upright: "疗愈常常需要「死亡」——结束旧的模式、信念和关系。这不是真正的死亡，而是转化。允许旧的自我的部分死去，新的你会从灰烬中重生。这是深度释放的时刻。",
    reversed: "你可能在抗拒必要的结束。紧抓着不再服务你的事物只会延长痛苦。死神不是来带走什么，而是来释放你。信任这个过程，你有重生的力量。",
    translations: {
      en: {
        upright: "Healing often requires 'death' - ending old patterns, beliefs, and relationships. This is not real death, but transformation. Allow parts of your old self to die, the new you will be reborn from the ashes. This is a moment of deep release.",
        reversed: "You may be resisting necessary endings. Clinging to what no longer serves you only prolongs pain. Death is not here to take anything, but to set you free. Trust this process, you have the power to be reborn."
      }
    }
  },
  {
    id: 14, name: "节制", originalName: "Temperance", suit: "major", element: "火",
    keywords: ["平衡", "耐心", "接纳", "融合", "内在和谐"],
    uprightBrief: "找到内在的平衡与和谐", reversedBrief: "失衡或过度极端",
    imageUrl: "icons/major/tarot-major-14.png",
    upright: "疗愈是寻找平衡的艺术。不是压抑情绪，也不是被情绪淹没。在接纳和释放之间找到中点。你的内在正在融合对立面，创造新的和谐。耐心些，你在正确的道路上。",
    reversed: "你可能陷入了极端——要么过度控制，要么完全失控。疗愈需要耐心和温和。不要急于「变好」，允许自己按照自己的节奏愈合。平衡是可以找回的。",
    translations: {
      en: {
        upright: "Healing is the art of finding balance. Not suppressing emotions, nor being overwhelmed by them. Find the middle point between acceptance and release. Your inner self is integrating opposites, creating new harmony. Be patient, you are on the right path.",
        reversed: "You may have fallen into extremes - either over-controlling or completely out of control. Healing requires patience and gentleness. Don't rush to 'get better', allow yourself to heal at your own pace. Balance can be regained."
      }
    }
  },
  {
    id: 15, name: "恶魔", originalName: "The Devil", suit: "major", element: "土",
    keywords: ["阴影整合", "破除执念", "自由", "面对恐惧", "限制性信念"],
    uprightBrief: "面对并整合内在的阴影", reversedBrief: "从束缚中觉醒自由",
    imageUrl: "icons/major/tarot-major-15.png",
    upright: "恶魔邀请你看见自己的阴影。那些被你否认的部分，那些你害怕面对的欲望和恐惧。整合阴影不是邪恶的，而是完整的。当你看见并接纳你的全部，链锁就会脱落。你是自由的。",
    reversed: "你正在从旧有的束缚中觉醒。可能意识到某些执念不再服务你。这是解放的时刻——释放那些限制你的信念。你一直都是自由的，只是忘记了。",
    translations: {
      en: {
        upright: "The Devil invites you to see your shadow. Those parts you denied, those desires and fears you were afraid to face. Integrating shadow is not evil, it's wholeness. When you see and accept all of you, the chains fall off. You are free.",
        reversed: "You are awakening from old bonds. You may realize that certain obsessions no longer serve you. This is a moment of liberation - releasing those beliefs that limit you. You have always been free, just forgot."
      }
    }
  },
  {
    id: 16, name: "塔", originalName: "The Tower", suit: "major", element: "火",
    keywords: ["释放压抑", "真相大白", "重建", "觉醒", "必要的崩塌"],
    uprightBrief: "旧结构崩塌为新疗愈腾出空间", reversedBrief: "抗拒必然的改变",
    imageUrl: "icons/major/tarot-major-16.png",
    upright: "有时候，疗愈需要崩塌。那些不再真实的事物必须被拆除，才能建造新的。这很痛苦，但是必要的。塔的倒塌释放了被压抑的真相。不要害怕，暴风雨后会见彩虹。",
    reversed: "你可能在抗拒必要的改变。内在的动荡需要被释放，拖延只会让情况更激烈。有时候，你需要主动拆除旧墙，而不是等待它倒塌。你有重建的力量。",
    translations: {
      en: {
        upright: "Sometimes, healing requires collapse. What is no longer true must be demolished to build anew. This is painful but necessary. The fall of the Tower releases suppressed truth. Don't be afraid, there is a rainbow after the storm.",
        reversed: "You may be resisting necessary changes. Inner turmoil needs to be released, delaying only makes it more intense. Sometimes, you need to actively demolish old walls instead of waiting for them to fall. You have the power to rebuild."
      }
    }
  },
  {
    id: 17, name: "星星", originalName: "The Star", suit: "major", element: "风",
    keywords: ["希望", "灵性疗愈", "宁静", "信任", "内在和平"],
    uprightBrief: "在黑暗中保持希望与信任", reversedBrief: "绝望或失去信心",
    imageUrl: "icons/major/tarot-major-17.png",
    upright: "即使在最黑暗的夜晚，星星也在闪耀。你没有被遗弃，你永远不会被遗弃。疗愈需要希望——相信明天会更好。让自己被宁静包围，你是被爱的，被支持的。",
    reversed: "你可能暂时失去了希望。这很正常，疗愈不是线性的。允许自己感受绝望，但不要停留在那里。寻求帮助，你不需要独自承受。星星还在，只是被云层遮挡。",
    translations: {
      en: {
        upright: "Even in the darkest night, stars are shining. You are not abandoned, you will never be abandoned. Healing requires hope - believing that tomorrow will be better. Allow yourself to be surrounded by tranquility, you are loved, you are supported.",
        reversed: "You may have temporarily lost hope. This is normal, healing is not linear. Allow yourself to feel despair, but don't stay there. Seek help, you don't need to bear it alone. The stars are still there, just obscured by clouds."
      }
    }
  },
  {
    id: 18, name: "月亮", originalName: "The Moon", suit: "major", element: "水",
    keywords: ["面对恐惧", "潜意识", "直觉", "释放", "梦境疗愈"],
    uprightBrief: "勇敢地面对深层恐惧", reversedBrief: "恐惧消散真相浮现",
    imageUrl: "icons/major/tarot-major-18.png",
    upright: "月亮照亮了被你隐藏的部分。那些深夜浮现的恐惧、焦虑和未处理的情绪。不要害怕，这些都是可以被疗愈的。你的潜意识正在与你沟通。倾听梦境，它们携带疗愈的信息。",
    reversed: "恐惧正在消散，真相逐渐浮现。你可能终于看清了某些幻觉。这是从迷茫中清醒的时刻。信任你的直觉，它比你认为的更清晰。",
    translations: {
      en: {
        upright: "The Moon illuminates the parts you hid. Those fears, anxieties, and unprocessed emotions that surface at night. Don't be afraid, these can all be healed. Your subconscious is communicating with you. Listen to dreams, they carry healing messages.",
        reversed: "Fears are dissipating, truth is gradually emerging. You may finally see through some illusions. This is a moment of waking from confusion. Trust your intuition, it is clearer than you think."
      }
    }
  },
  {
    id: 19, name: "太阳", originalName: "The Sun", suit: "major", element: "火",
    keywords: ["喜悦", "活力", "真相", "纯真", "光明疗愈"],
    uprightBrief: "拥抱内在的喜悦与光明", reversedBrief: "暂时的阴霾或过度乐观",
    imageUrl: "icons/major/tarot-major-19.png",
    upright: "太阳疗愈了一切。温暖、喜悦和活力正在回归。你内在的孩子正在欢笑。不要怀疑这个好消息——你值得快乐，值得被爱，值得光明。让阳光照进你生命的每一个角落。",
    reversed: "暂时的阴霾遮挡了阳光，但它从未离开。或者你可能过于乐观而忽视了一些需要关注的部分。平衡光明与阴影，真正的阳光能照亮一切。",
    translations: {
      en: {
        upright: "The Sun heals everything. Warmth, joy, and vitality are returning. Your inner child is laughing. Don't doubt this good news - you deserve happiness, deserve love, deserve light. Let the sunlight into every corner of your life.",
        reversed: "Temporary clouds block the sunlight, but it never left. Or you may be overly optimistic and ignore some parts that need attention. Balance light and shadow, true sunlight can illuminate everything."
      }
    }
  },
  {
    id: 20, name: "审判", originalName: "Judgement", suit: "major", element: "火",
    keywords: ["自我接纳", "重生", "宽恕", "觉醒", "整合过往"],
    uprightBrief: "宽恕自己与他人获得重生", reversedBrief: "自我批判或拒绝宽恕",
    imageUrl: "icons/major/tarot-major-20.png",
    upright: "疗愈的高潮是宽恕。不是因为「他们值得」，而是因为你值得自由。宽恕自己——你做了当时能做到的最好。宽恕他人——他们也在自己的限制中行动。这是重生的时刻，过去的你已死，新的你正在升起。",
    reversed: "你可能在严厉地审判自己或他人。宽恕看起来像是不可能的，但它是疗愈的关键。你不需要忘记，但你可以释放。听见内心的召唤了吗？是时候醒来了。",
    translations: {
      en: {
        upright: "The climax of healing is forgiveness. Not because 'they deserve it', but because you deserve freedom. Forgive yourself - you did the best you could at the time. Forgive others - they were also acting within their limitations. This is a moment of rebirth, the old you died, the new you is rising.",
        reversed: "You may be judging yourself or others harshly. Forgiveness may seem impossible, but it is the key to healing. You don't need to forget, but you can release. Do you hear the call of your heart? It's time to wake up."
      }
    }
  },
  {
    id: 21, name: "世界", originalName: "The World", suit: "major", element: "土",
    keywords: ["完整", "整合", "成就", "疗愈完成", "新循环开始"],
    uprightBrief: "疗愈循环完成准备新旅程", reversedBrief: "未完成或害怕结束",
    imageUrl: "icons/major/tarot-major-21.png",
    upright: "你做到了。疗愈的循环完成了，你整合了所有的经验、创伤和礼物。你现在是更完整的自己。这不是终点，而是新循环的开始。带着智慧和慈悲，继续你的旅程。你是完整的。",
    reversed: "你可能觉得疗愈「还没完成」，或者害怕结束这个身份。事实上，疗愈是持续的旅程。允许自己庆祝成就，也允许自己继续成长。完整不是完美，而是接纳全部。",
    translations: {
      en: {
        upright: "You did it. The healing cycle is complete, you have integrated all experiences, traumas, and gifts. You are now a more complete version of yourself. This is not the end, but the beginning of a new cycle. With wisdom and compassion, continue your journey. You are whole.",
        reversed: "You may feel that healing is 'not yet complete', or afraid to end this identity. In fact, healing is a continuous journey. Allow yourself to celebrate achievements, and allow yourself to continue growing. Wholeness is not perfection, but accepting all."
      }
    }
  },

  // ============ 小阿卡纳 - 权杖 Wands (14张) ============
  {
    id: "W1", name: "权杖王牌", originalName: "Ace of Wands", suit: "wands", element: "火",
    keywords: ["创意火花", "新灵感", "激情", "行动召唤", "生命力"],
    uprightBrief: "新的创意能量正在涌现", reversedBrief: "创意受阻或延迟开始",
    imageUrl: "icons/wands/tarot-wands-01.png",
    upright: "一股新的生命力正在你体内苏醒。创意的火花、灵感的光芒——这些都是疗愈的能量。不要质疑，直接行动。你的热情是宇宙的礼物，分享它会疗愈你自己和他人。",
    reversed: "你的创意之火可能暂时被遮蔽。可能是恐惧、可能是疲惫。给自己时间休息，但不要让火焰完全熄灭。重新连接你的热情——什么让你感觉活着？",
    translations: {
      en: {
        upright: "A new life force is awakening within you. Creative sparks, light of inspiration - these are healing energies. Don't question, act directly. Your passion is a gift from the universe, sharing it will heal yourself and others.",
        reversed: "Your creative fire may be temporarily obscured. Could be fear, could be exhaustion. Give yourself time to rest, but don't let the flame go out completely. Reconnect with your passion - what makes you feel alive?"
      }
    }
  },
  {
    id: "W2", name: "权杖二", originalName: "Two of Wands", suit: "wands", element: "火",
    keywords: ["规划未来", "远见", "可能性", "耐心", "扩展视野"],
    uprightBrief: "站在新视角规划未来", reversedBrief: "恐惧改变或规划过度",
    imageUrl: "icons/wands/tarot-wands-02.png",
    upright: "你站在生命的新高点，俯瞰可能的未来。这是一个充满可能性的时刻。不要被恐惧限制——你的视野比你想象的更广阔。规划，但也信任未知会带来比你想象更好的礼物。",
    reversed: "对改变的恐惧让你固守现状，或者相反——过度规划而失去了自发性。平衡计划和信任。有时候，最好的疗愈来自于放下「知道」一切的需要。",
    translations: {
      en: {
        upright: "You stand at a new high point in life, overlooking possible futures. This is a moment full of possibilities. Don't be limited by fear - your vision is broader than you think. Plan, but also trust that the unknown will bring better gifts than you imagine.",
        reversed: "Fear of change keeps you stuck in status quo, or conversely - over-planning and losing spontaneity. Balance planning and trust. Sometimes, the best healing comes from letting go of the need to 'know' everything."
      }
    }
  },
  {
    id: "W3", name: "权杖三", originalName: "Three of Wands", suit: "wands", element: "火",
    keywords: ["远见实现", "等待果实", "合作", "扩展", "耐心信任"],
    uprightBrief: "你的远见正在成为现实", reversedBrief: "延迟或视野受限",
    imageUrl: "icons/wands/tarot-wands-03.png",
    upright: "你播下的种子正在发芽。可能还看不到完整的果实，但请相信过程。这是扩展的时刻——你的影响力正在增长。与他人合作会带来更大的疗愈。保持耐心，信任时机。",
    reversed: "进展可能比预期慢，或者你感到视野受限。可能是时候重新评估你的方向了。不要放弃，只是调整航向。有时候，延迟是为了更好的准备。",
    translations: {
      en: {
        upright: "The seeds you planted are sprouting. You may not see the full fruit yet, but please trust the process. This is a moment of expansion - your influence is growing. Collaborating with others will bring greater healing. Be patient, trust the timing.",
        reversed: "Progress may be slower than expected, or you feel your vision is limited. It may be time to re-evaluate your direction. Don't give up, just adjust the course. Sometimes, delay is for better preparation."
      }
    }
  },
  {
    id: "W4", name: "权杖四", originalName: "Four of Wands", suit: "wands", element: "火",
    keywords: ["庆祝", "稳定", "家庭", "和谐", "感恩"],
    uprightBrief: "庆祝疗愈的里程碑", reversedBrief: "不稳定性或延迟的庆祝",
    imageUrl: "icons/wands/tarot-wands-04.png",
    upright: "停下来庆祝吧！无论疗愈旅程走了多远，都值得认可。这是关于稳定、和谐和归属感。与爱你的人分享你的喜悦。感恩是强大的疗愈工具——它打开心门迎接更多祝福。",
    reversed: "可能觉得「还没到庆祝的时候」，或者家庭/关系中的不和谐让你无法放松。记住：进步不是完美。即使小步骤也值得庆祝。你正在建立稳定的基础。",
    translations: {
      en: {
        upright: "Stop and celebrate! No matter how far you've come on your healing journey, it's worth acknowledging. This is about stability, harmony, and belonging. Share your joy with those who love you. Gratitude is a powerful healing tool - it opens the heart door to welcome more blessings.",
        reversed: "You may feel 'it's not time to celebrate yet', or disharmony in family/relationships prevents you from relaxing. Remember: progress is not perfection. Even small steps are worth celebrating. You are building a stable foundation."
      }
    }
  },
  {
    id: "W5", name: "权杖五", originalName: "Five of Wands", suit: "wands", element: "火",
    keywords: ["内在冲突", "竞争", "差异", "成长", "表达自己"],
    uprightBrief: "通过冲突认清自己的立场", reversedBrief: "避免冲突或内在混乱",
    imageUrl: "icons/wands/tarot-wands-05.png",
    upright: "冲突不一定是坏事。有时候，你需要看清自己的立场，表达自己的真相。不同的观点碰撞会带来成长。不要害怕争论——只要保持尊重。你的声音值得被听见。",
    reversed: "你可能在避免必要的冲突，或者内在的混乱让你无法清晰表达。有时候，和平是通过诚实的对话建立的，而非回避。找到你的声音，温柔但坚定地表达。",
    translations: {
      en: {
        upright: "Conflict is not necessarily bad. Sometimes, you need to see your position clearly and express your truth. Clashing different viewpoints brings growth. Don't be afraid to argue - as long as you keep respect. Your voice deserves to be heard.",
        reversed: "You may be avoiding necessary conflict, or inner chaos prevents you from expressing clearly. Sometimes, peace is built through honest conversation, not avoidance. Find your voice, express gently but firmly."
      }
    }
  },
  {
    id: "W6", name: "权杖六", originalName: "Six of Wands", suit: "wands", element: "火",
    keywords: ["胜利", "认可", "自信", "进步", "分享成功"],
    uprightBrief: "认可自己的进步与成就", reversedBrief: "缺乏认可或自负",
    imageUrl: "icons/wands/tarot-wands-06.png",
    upright: "为你自己鼓掌！你走了很远的路，值得被认可——首先是被你自己认可。胜利不一定是外在的，内在的突破同样值得庆祝。分享你的成功会激励他人，也会巩固你自己的疗愈。",
    reversed: "你可能觉得自己的成就「不够好」，或者相反——过于自负而失去了与他人的连接。真正的胜利是谦逊的。认可自己的进步，但也记住那些支持过你的人。",
    translations: {
      en: {
        upright: "Applaud for yourself! You have come a long way and deserve recognition - first of all from yourself. Victory is not necessarily external, inner breakthroughs are equally worth celebrating. Sharing your success will inspire others and consolidate your own healing.",
        reversed: "You may feel your achievements are 'not good enough', or conversely - too arrogant and lost connection with others. True victory is humble. Acknowledge your progress, but also remember those who supported you."
      }
    }
  },
  {
    id: "W7", name: "权杖七", originalName: "Seven of Wands", suit: "wands", element: "火",
    keywords: ["坚持", "边界", "勇气", "防御", "不屈不挠"],
    uprightBrief: "为自己的疗愈边界而战", reversedBrief: "不堪重负或放弃抵抗",
    imageUrl: "icons/wands/tarot-wands-07.png",
    upright: "你已经走了这么远，不要放弃！是的，有时候会很累，有时候会想「算了吧」。但你的疗愈值得战斗。坚守你的边界，保护你的能量。你比你想象的更强大。",
    reversed: "你可能感到不堪重负，想要放弃。或者你一直在为他人而战，忘记了为自己而战。休息是可以的，但不要让暂时的疲惫变成永久的放弃。你值得坚持下去。",
    translations: {
      en: {
        upright: "You have come this far, don't give up! Yes, sometimes it's tiring, sometimes you want to say 'forget it'. But your healing is worth fighting for. Hold your boundaries, protect your energy. You are stronger than you think.",
        reversed: "You may feel overwhelmed and want to give up. Or you have been fighting for others and forgotten to fight for yourself. Rest is okay, but don't let temporary exhaustion become permanent surrender. You are worth persisting for."
      }
    }
  },
  {
    id: "W8", name: "权杖八", originalName: "Eight of Wands", suit: "wands", element: "火",
    keywords: ["快速进展", "能量流动", "同步性", "释放", "行动"],
    uprightBrief: "疗愈能量快速流动中", reversedBrief: "延迟或能量阻塞",
    imageUrl: "icons/wands/tarot-wands-08.png",
    upright: "事情正在加速！能量在流动，障碍在消散。这是一个快速进展的时期。把握时机，不要犹豫。同步性会指引你——注意那些「巧合」，它们是宇宙的信息。",
    reversed: "能量可能暂时阻塞，或者你感到不耐烦。记住：不是所有的快速都是好的，也不是所有的延迟都是坏的。有时候，缓慢是为了更好的准备。信任时机。",
    translations: {
      en: {
        upright: "Things are accelerating! Energy is flowing, obstacles are dissolving. This is a period of rapid progress. Seize the moment, don't hesitate. Synchronicity will guide you - pay attention to those 'coincidences', they are messages from the universe.",
        reversed: "Energy may be temporarily blocked, or you feel impatient. Remember: not all speed is good, not all delay is bad. Sometimes, slowness is for better preparation. Trust the timing."
      }
    }
  },
  {
    id: "W9", name: "权杖九", originalName: "Nine of Wands", suit: "wands", element: "火",
    keywords: ["韧性", "警惕", "几乎到达", "创伤记忆", "不屈"],
    uprightBrief: "用韧性接近疗愈的终点", reversedBrief: "精疲力竭或偏执防御",
    imageUrl: "icons/wands/tarot-wands-09.png",
    upright: "你已经接近终点了。是的，伤疤还在，记忆还在。但你比这些创伤更强大。保持警惕，但不要让过去的伤害变成偏执。你几乎做到了——再坚持一下。",
    reversed: "你可能感到精疲力竭，或者因为过去的创伤而对未来过度警惕。休息不是放弃。有时候，放下防御才是最强大的防御。你安全了，可以放松了。",
    translations: {
      en: {
        upright: "You are close to the finish line. Yes, scars are still there, memories are still there. But you are stronger than these traumas. Stay vigilant, but don't let past hurts turn into paranoia. You almost made it - hold on a little longer.",
        reversed: "You may feel exhausted, or overly vigilant about the future because of past trauma. Rest is not giving up. Sometimes, letting go of defense is the strongest defense. You are safe, you can relax."
      }
    }
  },
  {
    id: "W10", name: "权杖十", originalName: "Ten of Wands", suit: "wands", element: "火",
    keywords: ["释放负担", "责任", "过度劳累", "允许帮助", "放下"],
    uprightBrief: "放下不属于你的负担", reversedBrief: "释放或无法承受",
    imageUrl: "icons/wands/tarot-wands-10.png",
    upright: "你不需要承担所有人的责任。是的，你很强，但强不代表你应该独自承受一切。这个牌邀请你放下一些负担——不是所有的战斗都是你的。允许自己被帮助，允许自己说「我需要支持」。",
    reversed: "你终于放下了一些负担，或者你意识到某些责任真的不必要。这是解放的时刻。不要觉得「放下」是失败——它是智慧。你值得轻松一些。",
    translations: {
      en: {
        upright: "You don't need to bear everyone's responsibility. Yes, you are strong, but being strong doesn't mean you should bear everything alone. This card invites you to put down some burdens - not all battles are yours. Allow yourself to be helped, allow yourself to say 'I need support'.",
        reversed: "You finally put down some burdens, or you realize that certain responsibilities are really unnecessary. This is a moment of liberation. Don't think 'letting go' is failure - it is wisdom. You deserve to be lighter."
      }
    }
  },
  {
    id: "W11", name: "权杖侍从", originalName: "Page of Wands", suit: "wands", element: "火",
    keywords: ["新想法", "探索", "热情", "自由精神", "尝试"],
    uprightBrief: "用好奇心探索新疗愈方法", reversedBrief: "延迟行动或鲁莽",
    imageUrl: "icons/wands/tarot-wands-11.png",
    upright: "保持好奇心！你的内在孩子想要探索新的疗愈方式。不要因为「看起来傻」就拒绝尝试。有时候，最不可能的疗愈方式会带来最大的突破。带着玩心去探索——疗愈不必总是严肃的。",
    reversed: "你可能有些想法但不敢行动，或者相反——过于冲动而没有考虑后果。平衡热情和谨慎。新的探索是好的，但也需要一些规划。相信你的灵感，但也测试水域。",
    translations: {
      en: {
        upright: "Stay curious! Your inner child wants to explore new healing methods. Don't reject trying because it 'looks silly'. Sometimes, the most unlikely healing method brings the biggest breakthrough. Explore with playfulness - healing doesn't have to be always serious.",
        reversed: "You may have some ideas but dare not act, or conversely - too impulsive without considering consequences. Balance enthusiasm and caution. New exploration is good, but also needs some planning. Trust your inspiration, but also test the waters."
      }
    }
  },
  {
    id: "W12", name: "权杖骑士", originalName: "Knight of Wands", suit: "wands", element: "火",
    keywords: ["行动", "冒险", "热情", "快速变化", "跟随灵感"],
    uprightBrief: "迅速行动跟随灵感", reversedBrief: "鲁莽或缺乏方向",
    imageUrl: "icons/wands/tarot-wands-12.png",
    upright: "跟随你的火焰！这是一个行动的时期，不要过度思考——直接做。你的热情会指引你。是的，可能会犯一些错误，但那是学习的一部分。冒险，探索，活出你的激情！",
    reversed: "你的行动可能过于冲动，或者你失去了方向。热情需要焦点。停下来，重新连接你的「为什么」。你不需要一直奔跑——有时候，暂停是为了更好的跳跃。",
    translations: {
      en: {
        upright: "Follow your fire! This is a time for action, don't overthink - just do. Your passion will guide you. Yes, you may make some mistakes, but that's part of learning. Adventure, explore, live your passion!",
        reversed: "Your actions may be too impulsive, or you lost your direction. Passion needs focus. Stop, reconnect with your 'why'. You don't need to keep running - sometimes, pausing is for a better leap."
      }
    }
  },
  {
    id: "W13", name: "权杖王后", originalName: "Queen of Wands", suit: "wands", element: "火",
    keywords: ["自信", "魅力", "创造力", "独立", "鼓舞他人"],
    uprightBrief: "用自信和创造力疗愈自己与他人", reversedBrief: "自我怀疑或过度支配",
    imageUrl: "icons/wands/tarot-wands-13.png",
    upright: "你是充满创造力的存在！你的自信和魅力不仅疗愈你自己，也激励他人。不要隐藏你的光芒——世界需要你的独特。相信自己，表达自己，你的创造力是强大的疗愈工具。",
    reversed: "你可能在怀疑自己的价值，或者相反——用支配来掩盖不安全感。真正的自信是温柔的。重新连接你的内在力量，你不需要证明任何东西给任何人。",
    translations: {
      en: {
        upright: "You are a creative being! Your confidence and charm not only heal yourself but also inspire others. Don't hide your light - the world needs your uniqueness. Believe in yourself, express yourself, your creativity is a powerful healing tool.",
        reversed: "You may be doubting your worth, or conversely - using domination to cover insecurity. True confidence is gentle. Reconnect with your inner power, you don't need to prove anything to anyone."
      }
    }
  },
  {
    id: "W14", name: "权杖国王", originalName: "King of Wands", suit: "wands", element: "火",
    keywords: ["远见", "领导力", "企业家精神", "行动导向", "激励他人"],
    uprightBrief: "用远见和行动领导疗愈", reversedBrief: "专制或缺乏方向",
    imageUrl: "icons/wands/tarot-wands-14.png",
    upright: "你有远见，也有能力将它变为现实。你的热情具有感染力——他人会被你的愿景吸引。领导不是控制，而是激励。分享你的火焰，它会燃烧得更旺。相信你的直觉，它是你的指南针。",
    reversed: "你可能变得过于控制或冲动，或者你失去了方向。真正的领导者首先领导自己。重新连接你的内在权威——不是来自 ego，而是来自心。你的愿景值得被实现。",
    translations: {
      en: {
        upright: "You have vision and the ability to turn it into reality. Your passion is contagious - others will be attracted by your vision. Leadership is not control, but inspiration. Share your fire, it will burn even stronger. Trust your intuition, it is your compass.",
        reversed: "You may become too controlling or impulsive, or you lost your direction. A true leader first leads themselves. Reconnect with your inner authority - not from ego, but from heart. Your vision deserves to be realized."
      }
    }
  },

  // ============ 小阿卡纳 - 圣杯 Cups (14张) 情绪疗愈与内在小孩 ============
  {
    id: "C1", name: "圣杯王牌", originalName: "Ace of Cups", suit: "cups", element: "水",
    keywords: ["新情感", "爱", "直觉", "慈悲", "打开心扉"],
    uprightBrief: "新的情感疗愈开始", reversedBrief: "情感阻塞或恐惧亲密",
    imageUrl: "icons/cups/tarot-cups-01.png",
    upright: "你的心正在打开。新的爱、新的情感正在涌入。不要害怕感受——你的心有足够空间容纳所有情感。这是深度情绪疗愈的开始。允许自己被触动，允许自己感受。",
    reversed: "你可能害怕打开心扉，或者情感被阻塞了。这是可以的——疗愈需要时间。温柔地对待自己，不要强迫。心会以自己的节奏打开。",
    translations: {
      en: {
        upright: "Your heart is opening. New love, new emotions are flowing in. Don't be afraid to feel - your heart has enough space to hold all emotions. This is the beginning of deep emotional healing. Allow yourself to be touched, allow yourself to feel.",
        reversed: "You may be afraid to open your heart, or emotions are blocked. This is okay - healing takes time. Treat yourself gently, don't force. The heart will open at its own pace."
      }
    }
  },
  {
    id: "C2", name: "圣杯二", originalName: "Two of Cups", suit: "cups", element: "水",
    keywords: ["相互理解", "平等", "和谐", "连接", "真爱"],
    uprightBrief: "建立平等和谐的连接", reversedBrief: "关系失衡或误解",
    imageUrl: "icons/cups/tarot-cups-02.png",
    upright: "真正的连接来自于平等和相互理解。这不是关于「得到」，而是关于「分享」。在关系中保持你的完整性，也尊重对方的完整性。爱是自由的，不是占有的。",
    reversed: "关系中可能有失衡，或者你害怕真正的亲密。记住：健康的关系是两座独立的塔，而非一座倒塌在另一座上。你是完整的，不需要他人来「完成」你。",
    translations: {
      en: {
        upright: "True connection comes from equality and mutual understanding. This is not about 'getting', but about 'sharing'. Maintain your integrity in relationships, and respect the other's integrity too. Love is free, not possessive.",
        reversed: "There may be imbalance in relationships, or you fear true intimacy. Remember: healthy relationship is two independent towers, not one collapsing on another. You are complete, don't need others to 'complete' you."
      }
    }
  },
  {
    id: "C3", name: "圣杯三", originalName: "Three of Cups", suit: "cups", element: "水",
    keywords: ["庆祝", "友谊", "支持", "欢乐", "社群疗愈"],
    uprightBrief: "在友谊和支持中疗愈", reversedBrief: "过度社交或孤立",
    imageUrl: "icons/cups/tarot-cups-03.png",
    upright: "你不需要独自疗愈。朋友、社群、支持系统——这些都是疗愈的重要部分。允许自己被支持，允许自己享受欢乐。分享快乐会让它加倍，分享痛苦会让它减半。",
    reversed: "你可能过度社交来逃避内在感受，或者相反——孤立自己拒绝支持。平衡独处和社交。真正的朋友会陪伴你的黑暗，不只是你的光明。",
    translations: {
      en: {
        upright: "You don't need to heal alone. Friends, community, support systems - these are all important parts of healing. Allow yourself to be supported, allow yourself to enjoy joy. Sharing happiness doubles it, sharing pain halves it.",
        reversed: "You may be over-socializing to escape inner feelings, or conversely - isolating yourself and rejecting support. Balance solitude and socializing. True friends will accompany your darkness, not just your light."
      }
    }
  },
  {
    id: "C4", name: "圣杯四", originalName: "Four of Cups", suit: "cups", element: "水",
    keywords: ["内省", "重新评估", "不满", "觉醒", "寻找意义"],
    uprightBrief: "在内省中重新评估情感", reversedBrief: "从冷漠中觉醒",
    imageUrl: "icons/cups/tarot-cups-04.png",
    upright: "有时候，你需要暂停和反思。不是所有的「不」都是拒绝——有些是为了更好的「是」。你的不满是灵魂在告诉你：有更深处需要满足。倾听这种感觉，它在指引你。",
    reversed: "你正在从情感冷漠中醒来。可能意识到自己一直在拒绝生命的礼物。睁开眼睛，看看那些一直在你面前的可能性。你值得更多的快乐。",
    translations: {
      en: {
        upright: "Sometimes, you need to pause and reflect. Not all 'no's are rejections - some are for a better 'yes'. Your dissatisfaction is your soul telling you: there is something deeper that needs to be satisfied. Listen to this feeling, it is guiding you.",
        reversed: "You are waking from emotional apathy. You may realize that you have been rejecting life's gifts. Open your eyes, look at those possibilities that have been in front of you. You deserve more joy."
      }
    }
  },
  {
    id: "C5", name: "圣杯五", originalName: "Five of Cups", suit: "cups", element: "水",
    keywords: ["悲伤", "失落", "原谅自己", "看见礼物", "情绪释放"],
    uprightBrief: "允许自己感受悲伤", reversedBrief: "从悲伤中恢复看见希望",
    imageUrl: "icons/cups/tarot-cups-05.png",
    upright: "悲伤是需要被感受的。不要急于「好起来」，不要否认你的失落。哭泣是疗愈的一部分。但同时，也看看那些还站着的圣杯——你生命中还有值得感恩的东西。",
    reversed: "你正在从悲伤中恢复。可能终于允许自己感受了，或者准备向前看了。悲伤不会完全消失，但它会变得可以承受。你比自己想象的更坚强。",
    translations: {
      en: {
        upright: "Grief needs to be felt. Don't rush to 'get better', don't deny your loss. Crying is part of healing. But at the same time, also look at those cups that are still standing - there are things in your life worth being grateful for.",
        reversed: "You are recovering from grief. You may finally allow yourself to feel, or are ready to look forward. Grief won't completely disappear, but it will become bearable. You are stronger than you think."
      }
    }
  },
  {
    id: "C6", name: "圣杯六", originalName: "Six of Cups", suit: "cups", element: "水",
    keywords: ["内在小孩", "怀旧", "纯真", "疗愈童年", "善意"],
    uprightBrief: "疗愈内在小孩的连接", reversedBrief: "困在过去或过度天真",
    imageUrl: "icons/cups/tarot-cups-06.png",
    upright: "你的内在小孩想要被看见、被拥抱。回去拥抱那个小小的你——告诉他们「你是被爱的，你是安全的」。疗愈童年的伤口是可能的。善意不仅给别人，也给自己。",
    reversed: "你可能困在过去的记忆中，或者相反——完全拒绝回顾。疗愈需要平衡：看见过去，但不要让过去定义你。你是现在的你，也是未来的你。",
    translations: {
      en: {
        upright: "Your inner child wants to be seen, to be hugged. Go back and hug that little you - tell them 'you are loved, you are safe'. Healing childhood wounds is possible. Kindness is not only for others, but also for yourself.",
        reversed: "You may be trapped in past memories, or conversely - completely refusing to look back. Healing requires balance: see the past, but don't let the past define you. You are who you are now, and who you will be."
      }
    }
  },
  {
    id: "C7", name: "圣杯七", originalName: "Seven of Cups", suit: "cups", element: "水",
    keywords: ["幻想", "选择", "直觉", "澄清欲望", "梦境"],
    uprightBrief: "在幻想和选择中澄清真愿", reversedBrief: "从幻想中清醒面对现实",
    imageUrl: "icons/cups/tarot-cups-07.png",
    upright: "你的心有很多渴望。有些是真实的，有些是幻象。花时间澄清：什么真正属于你？什么只是你以为自己应该想要的？梦境和幻想携带信息——倾听它们，但也落地。",
    reversed: "你正在从幻想中清醒。可能意识到某些「梦想」只是逃避。这是好的——现在你可以做出真实的选择。不要害怕放弃那些不再服务你的梦想。",
    translations: {
      en: {
        upright: "Your heart has many desires. Some are real, some are illusions. Take time to clarify: what truly belongs to you? What is just what you think you should want? Dreams and fantasies carry messages - listen to them, but also ground.",
        reversed: "You are waking from fantasies. You may realize that some 'dreams' were just escapes. This is good - now you can make real choices. Don't be afraid to let go of dreams that no longer serve you."
      }
    }
  },
  {
    id: "C8", name: "圣杯八", originalName: "Eight of Cups", suit: "cups", element: "水",
    keywords: ["离开", "寻求意义", "勇气", "内在召唤", "放下过去"],
    uprightBrief: "勇敢地离开不满足寻找更深", reversedBrief: "害怕离开或回到过去",
    imageUrl: "icons/cups/tarot-cups-08.png",
    upright: "有时候，爱自己意味着离开。不是因为你不感恩，而是因为你值得更多。你的灵魂在召唤你走向更深处。这需要勇气，但你会感谢自己的。离开不是失败，而是进化。",
    reversed: "你可能害怕离开熟悉的一切，或者相反——离开得太快而没有完成未竟之事。确保你离开是因为「朝向」，而不是「逃离」。两者有很大的不同。",
    translations: {
      en: {
        upright: "Sometimes, loving yourself means leaving. Not because you are not grateful, but because you deserve more. Your soul is calling you to go deeper. This takes courage, but you will thank yourself. Leaving is not failure, it's evolution.",
        reversed: "You may be afraid to leave everything familiar, or conversely - left too quickly without completing unfinished business. Make sure you leave because of 'moving toward', not 'running away'. The two are very different."
      }
    }
  },
  {
    id: "C9", name: "圣杯九", originalName: "Nine of Cups", suit: "cups", element: "水",
    keywords: ["满足", "感恩", "情绪丰盛", "愿望成真", "享受当下"],
    uprightBrief: "感恩和情绪的丰盛", reversedBrief: "虚荣或情感不满足",
    imageUrl: "icons/cups/tarot-cups-09.png",
    upright: "你正在情绪丰盛的时期。感恩你所拥有的，享受当下的快乐。这不是「自私」——你值得快乐。你的愿望正在成真，或者即将成真。打开心，接收生命的礼物。",
    reversed: "你可能在外在的追求中寻找满足，但内在仍然感到空虚。真正的满足来自于感恩和接纳。你不需要更多——你需要意识到你已经足够。",
    translations: {
      en: {
        upright: "You are in a period of emotional abundance. Be grateful for what you have, enjoy the joy of the present. This is not 'selfish' - you deserve happiness. Your wishes are coming true, or about to come true. Open your heart, receive life's gifts.",
        reversed: "You may be seeking satisfaction in external pursuits, but still feel empty inside. True satisfaction comes from gratitude and acceptance. You don't need more - you need to realize that you are already enough."
      }
    }
  },
  {
    id: "C10", name: "圣杯十", originalName: "Ten of Cups", suit: "cups", element: "水",
    keywords: ["情绪圆满", "家庭和谐", "长久快乐", "接纳", "归属感"],
    uprightBrief: "情绪疗愈的圆满和归属感", reversedBrief: "家庭不和谐或情感断裂",
    imageUrl: "icons/cups/tarot-cups-10.png",
    upright: "你正在体验情绪的圆满。可能不是完美的，但你是完整的。家庭、关系、归属感——这些都是可以创造的。你值得被爱，值得归属。接纳自己和他人的全部，这就是圆满。",
    reversed: "家庭中可能有不和谐，或者你感到情感上的断裂。疗愈需要从自己开始。你无法改变他人，但你可以改变自己回应他人的方式。从接纳自己开始。",
    translations: {
      en: {
        upright: "You are experiencing emotional fulfillment. Maybe not perfect, but you are whole. Family, relationships, belonging - these are all things that can be created. You deserve to be loved, deserve to belong. Accept all of yourself and others, this is fulfillment.",
        reversed: "There may be disharmony in the family, or you feel emotionally disconnected. Healing needs to start with yourself. You cannot change others, but you can change how you respond to others. Start with accepting yourself."
      }
    }
  },
  {
    id: "C11", name: "圣杯侍从", originalName: "Page of Cups", suit: "cups", element: "水",
    keywords: ["情感开放", "直觉消息", "创意想象", "敏感", "内在小孩"],
    uprightBrief: "保持情感开放和好奇心", reversedBrief: "情感不成熟或忽视直觉",
    imageUrl: "icons/cups/tarot-cups-11.png",
    upright: "你的心是开放的，像孩子一样好奇。这是一个接收直觉消息的好时机。不要judge你的感受——所有的感受都是有用的信息。你的敏感度是天赋，不是弱点。",
    reversed: "你可能关闭了心扉，或者不知道如何处理自己的情绪。这是可以的——学习情绪智慧是一辈子的旅程。对自己耐心些，你的心会重新打开的。",
    translations: {
      en: {
        upright: "Your heart is open, curious like a child. This is a good time to receive intuitive messages. Don't judge your feelings - all feelings are useful information. Your sensitivity is a gift, not a weakness.",
        reversed: "You may have closed your heart, or don't know how to process your emotions. This is okay - learning emotional wisdom is a lifetime journey. Be patient with yourself, your heart will open again."
      }
    }
  },
  {
    id: "C12", name: "圣杯骑士", originalName: "Knight of Cups", suit: "cups", element: "水",
    keywords: ["浪漫", "跟随心", "理想主义", "情感表达", "温柔行动"],
    uprightBrief: "跟随心的指引行动", reversedBrief: "情感操纵或不切实际",
    imageUrl: "icons/cups/tarot-cups-12.png",
    upright: "跟随你的心。它不是「不理性」——它是另一种智慧。你的情感是指南针，它们知道方向。表达你的感受，不要隐藏。温柔的行动比强硬的控制更有力量。",
    reversed: "你可能在用情感操纵他人，或者你的梦想太不切实际了。平衡心和头脑。是的，跟随心，但也带上你的常识。真正的浪漫是落地的一一不是空中楼阁。",
    translations: {
      en: {
        upright: "Follow your heart. It's not 'irrational' - it's another kind of wisdom. Your emotions are a compass, they know the direction. Express your feelings, don't hide. Gentle action is more powerful than forceful control.",
        reversed: "You may be using emotions to manipulate others, or your dreams are too unrealistic. Balance heart and head. Yes, follow your heart, but also bring your common sense. True romance is grounded - not a castle in the air."
      }
    }
  },
  {
    id: "C13", name: "圣杯王后", originalName: "Queen of Cups", suit: "cups", element: "水",
    keywords: ["深度同理心", "直觉", "慈悲", "情绪智慧", "包容"],
    uprightBrief: "用深度同理心和慈悲疗愈", reversedBrief: "情绪过度依赖或封闭",
    imageUrl: "icons/cups/tarot-cups-13.png",
    upright: "你的同理心是深度的。你不仅能感受自己的情感，也能感受他人的。这是强大的疗愈礼物。用你的慈悲拥抱自己与他人。但记住：同理心不是承担他人的情绪——你可以同情而不拯救。",
    reversed: "你可能过度吸收他人的情绪，或者相反——完全封闭了自己的心。学习健康的情绪边界。是的，你可以关心他人，但你不需要为他人的情绪负责。",
    translations: {
      en: {
        upright: "Your empathy is deep. You can not only feel your own emotions, but also others'. This is a powerful healing gift. Embrace yourself and others with your compassion. But remember: empathy is not taking on others' emotions - you can sympathize without rescuing.",
        reversed: "You may be over-absorbing others' emotions, or conversely - completely closed your own heart. Learn healthy emotional boundaries. Yes, you can care about others, but you don't need to be responsible for others' emotions."
      }
    }
  },
  {
    id: "C14", name: "圣杯国王", originalName: "King of Cups", suit: "cups", element: "水",
    keywords: ["情绪成熟", "平衡", "智慧慈悲", "稳定", "深度理解"],
    uprightBrief: "情绪成熟和智慧慈悲的平衡", reversedBrief: "情绪操纵或情感压抑",
    imageUrl: "icons/cups/tarot-cups-14.png",
    upright: "你已经在情绪上成熟了。你能在感受的同时保持稳定和清晰。你的慈悲来自智慧，你的智慧来自感受。这是一个强大的组合。你可以用你的情绪智慧帮助他人，同时也照顾好自己。",
    reversed: "你可能在用情绪操纵他人，或者完全压抑了自己的感受。真正的情绪成熟是：感受一切，但不被任何东西控制。你是情绪的主人，不是奴隶。",
    translations: {
      en: {
        upright: "You are already emotionally mature. You can feel while maintaining stability and clarity. Your compassion comes from wisdom, your wisdom comes from feeling. This is a powerful combination. You can help others with your emotional wisdom while also taking good care of yourself.",
        reversed: "You may be using emotions to manipulate others, or completely repress your own feelings. True emotional maturity is: feel everything, but don't be controlled by anything. You are the master of emotions, not the slave."
      }
    }
  },

  // ============ 小阿卡纳 - 宝剑 Swords (14张) 心智疗愈与清晰思维 ============
  {
    id: "S1", name: "宝剑王牌", originalName: "Ace of Swords", suit: "swords", element: "风",
    keywords: ["真相", "清晰", "突破", "新视角", "心智清明"],
    uprightBrief: "真相带来心智的突破和清晰", reversedBrief: "思维混乱或真相过于尖锐",
    imageUrl: "icons/swords/tarot-swords-01.png",
    upright: "真相让你自由。可能不舒适，但它是疗愈的开始。你的心智正在清明——你能看见以前看不见的。拥抱这个清晰，即使它要求你改变。真理是爱的另一种形式。",
    reversed: "真相可能过于尖锐，或者你的思维陷入混乱。有时候，我们需要时间消化真相。对自己耐心些。清晰会来的——可能不是一次全部，而是一步一步。",
    translations: {
      en: {
        upright: "Truth sets you free. May be uncomfortable, but it's the beginning of healing. Your mind is clearing - you can see what you couldn't see before. Embrace this clarity, even if it asks you to change. Truth is another form of love.",
        reversed: "Truth may be too sharp, or your mind is in chaos. Sometimes, we need time to digest truth. Be patient with yourself. Clarity will come - maybe not all at once, but step by step."
      }
    }
  },
  {
    id: "S2", name: "宝剑二", originalName: "Two of Swords", suit: "swords", element: "风",
    keywords: ["两难", "内在冲突", "暂停", "寻找平衡", "静心"],
    uprightBrief: "在两难中暂停寻找内在平衡", reversedBrief: "做出决定或从逃避中出来",
    imageUrl: "icons/swords/tarot-swords-02.png",
    upright: "你处在一个困难的决定前。不要急于选择——有时候，「不选择」也是一个选择。给自己时间。答案不在头脑的辩论中，而在心的安静中。信任你会知道的。",
    reversed: "你可能终于做出了决定，或者你意识到逃避不再是选项。好消息是：没有「错误」的决定——每个决定都是学习的机会。相信自己的判断。",
    translations: {
      en: {
        upright: "You are in front of a difficult decision. Don't rush to choose - sometimes, 'not choosing' is also a choice. Give yourself time. The answer is not in the mind's debate, but in the heart's quiet. Trust that you will know.",
        reversed: "You may have finally made a decision, or you realize that avoidance is no longer an option. Good news is: there is no 'wrong' decision - every decision is a learning opportunity. Trust your own judgment."
      }
    }
  },
  {
    id: "S3", name: "宝剑三", originalName: "Three of Swords", suit: "swords", element: "风",
    keywords: ["心碎", "释放悲伤", "宽恕", "疗愈痛苦", "成长"],
    uprightBrief: "允许心碎和悲伤被释放", reversedBrief: "从痛苦中恢复学习宽恕",
    imageUrl: "icons/swords/tarot-swords-03.png",
    upright: "心碎是打开心的另一种方式。是的，它很痛。但每一次心碎都在扩大你爱的能力。不要抗拒这个痛苦——它是疗愈的一部分。宽恕不是为他们，而是为你自己。",
    reversed: "你正在从痛苦中恢复。可能终于准备好宽恕了——首先宽恕自己。你做了当时能做到的最好。现在，把碎片捡起来，你会发现自己比之前更强大。",
    translations: {
      en: {
        upright: "Heartbreak is another way of opening the heart. Yes, it hurts. But every heartbreak is expanding your capacity to love. Don't resist this pain - it's part of healing. Forgiveness is not for them, but for yourself.",
        reversed: "You are recovering from pain. You may finally be ready to forgive - first forgive yourself. You did the best you could at the time. Now, pick up the pieces, you will find yourself stronger than before."
      }
    }
  },
  {
    id: "S4", name: "宝剑四", originalName: "Four of Swords", suit: "swords", element: "风",
    keywords: ["休息", "静心", "恢复", "冥想", "充电"],
    uprightBrief: "在静息和冥想中恢复", reversedBrief: "不安或急于返回行动",
    imageUrl: "icons/swords/tarot-swords-04.png",
    upright: "休息不是懒惰。你的心智需要休息来整合和疗愈。给自己 permission 去什么也不做。冥想、睡觉、发呆——这些都是疗愈。你的思想会在安静中自我修复。",
    reversed: "你可能急于回到行动中，或者感到不安无法休息。记住：休息是生产力的 part。你没有「落后」——你在充电。给自己时间，你会回来的，更清晰更强壮。",
    translations: {
      en: {
        upright: "Rest is not laziness. Your mind needs rest to integrate and heal. Give yourself permission to do nothing. Meditation, sleep, daydreaming - these are all healing. Your mind will self-repair in quiet.",
        reversed: "You may be eager to return to action, or feel restless and unable to rest. Remember: rest is part of productivity. You are not 'falling behind' - you are recharging. Give yourself time, you will come back, clearer and stronger."
      }
    }
  },
  {
    id: "S5", name: "宝剑五", originalName: "Five of Swords", suit: "swords", element: "风",
    keywords: ["冲突", "放下 ego", "内在和平", "选择战斗", "和解"],
    uprightBrief: "选择和平而非赢得战斗", reversedBrief: "和解或接受失败学习",
    imageUrl: "icons/swords/tarot-swords-05.png",
    upright: "不是所有的战斗都值得打。有时候，赢得争论但失去关系是不值得的。放下 ego，选择和平。这不是「认输」——这是智慧。你的内在和平比「正确」更重要。",
    reversed: "你可能终于放下了需要「赢」的需求，或者你意识到某些战斗不值得。这是成长。和解始于你——首先与自己和解，然后与他人。",
    translations: {
      en: {
        upright: "Not all battles are worth fighting. Sometimes, winning an argument but losing a relationship is not worth it. Let go of ego, choose peace. This is not 'admitting defeat' - this is wisdom. Your inner peace is more important than 'being right'.",
        reversed: "You may finally let go of the need to 'win', or you realize that some battles are not worth it. This is growth. Reconciliation starts with you - first reconcile with yourself, then with others."
      }
    }
  },
  {
    id: "S6", name: "宝剑六", originalName: "Six of Swords", suit: "swords", element: "风",
    keywords: ["过渡", "疗愈旅程", "离开痛苦", "寻求平静", "慢慢来"],
    uprightBrief: "在过渡中温柔地离开痛苦", reversedBrief: "抗拒改变或困在痛苦中",
    imageUrl: "icons/swords/tarot-swords-06.png",
    upright: "你正在离开痛苦的思想模式。这可能不容易，但这是必要的。像渡船一样，一次只渡一点。不要急于「完全疗愈」——疗愈是一步一步的。对自己温柔些，你正在做很好的工作。",
    reversed: "你可能抗拒这个过渡，或者感到困在痛苦中无法移动。这是可以的——有时候我们需要更多时间。寻求帮助。你不需要独自渡这个河。有人愿意帮你。",
    translations: {
      en: {
        upright: "You are leaving painful thought patterns. This may not be easy, but it is necessary. Like a ferry, cross a little at a time. Don't rush to 'completely heal' - healing is step by step. Be gentle with yourself, you are doing good work.",
        reversed: "You may resist this transition, or feel trapped in pain and unable to move. This is okay - sometimes we need more time. Seek help. You don't need to cross this river alone. Someone is willing to help you."
      }
    }
  },
  {
    id: "S7", name: "宝剑七", originalName: "Seven of Swords", suit: "swords", element: "风",
    keywords: ["诚实面对", "策略", "自我欺骗", "真相", "勇气"],
    uprightBrief: "诚实地面对自己的模式和逃避", reversedBrief: "坦白或从自我欺骗中清醒",
    imageUrl: "icons/swords/tarot-swords-07.png",
    upright: "你在对自己诚实吗？或者你在用故事来说服自己某些不是真的的东西？诚实地面对自己的模式需要勇气。但你值得真相——即使它不舒适。自由从真相开始。",
    reversed: "你可能终于坦白了一些事情，或者你意识到自己在自我欺骗。恭喜——这是疗愈的巨大一步。现在，你可以开始重建在真相之上，而非幻想之上。",
    translations: {
      en: {
        upright: "Are you being honest with yourself? Or are you using stories to convince yourself of something that's not true? Facing your own patterns honestly takes courage. But you deserve truth - even if it's uncomfortable. Freedom starts with truth.",
        reversed: "You may have finally confessed something, or you realize that you were self-deceiving. Congratulations - this is a huge step in healing. Now, you can start rebuilding on truth, not fantasy."
      }
    }
  },
  {
    id: "S8", name: "宝剑八", originalName: "Eight of Swords", suit: "swords", element: "风",
    keywords: ["解放思维", "看见真相", "打破限制", "自我赋权", "自由"],
    uprightBrief: "看见思维的限制并解放自己", reversedBrief: "从限制中解放获得自由",
    imageUrl: "icons/swords/tarot-swords-08.png",
    upright: "那些限制你的信念——它们是真的吗？还是你一直相信的故事？你实际上比自己想象的更自由。看见这些思维陷阱，然后 step out。你没有被绑住——绑住你的是你的信念。",
    reversed: "你正在从思维的限制中解放自己。可能终于看清了某些幻觉。这是令人兴奋的！你的心智正在扩展。继续质疑那些「不可质疑」的东西——真相在另一边。",
    translations: {
      en: {
        upright: "Those beliefs that limit you - are they true? Or are they stories you have been believing? You are actually freer than you think. See these mental traps, then step out. You are not tied up - what ties you is your beliefs.",
        reversed: "You are freeing yourself from mental limitations. You may finally see through some illusions. This is exciting! Your mind is expanding. Continue to question those things that are 'unquestionable' - truth is on the other side."
      }
    }
  },
  {
    id: "S9", name: "宝剑九", originalName: "Nine of Swords", suit: "swords", element: "风",
    keywords: ["释放焦虑", "噩梦结束", "慈悲对自己", "寻求支持", "希望"],
    uprightBrief: "在失眠和焦虑中慈悲对待自己", reversedBrief: "从焦虑中恢复噩梦结束",
    imageUrl: "icons/swords/tarot-swords-09.png",
    upright: "深夜的焦虑是真实的。但记住：这些想法不是事实。你在恐惧中放大了最坏的情况。对自己慈悲些——你正在做最好的你能做的。寻求支持。你不需要独自承受这些担忧。",
    reversed: "最糟糕的已经过去了。你可能终于睡了一个好觉，或者找到了应对焦虑的方法。继续照顾好自己的心智。康复是可能的，你正在证明这一点。",
    translations: {
      en: {
        upright: "Middle-of-the-night anxiety is real. But remember: these thoughts are not facts. You are amplifying worst-case scenarios in fear. Be compassionate with yourself - you are doing the best you can. Seek support. You don't need to bear these worries alone.",
        reversed: "The worst has passed. You may finally have slept a good sleep, or found ways to cope with anxiety. Continue to take good care of your mind. Recovery is possible, you are proving it."
      }
    }
  },
  {
    id: "S10", name: "宝剑十", originalName: "Ten of Swords", suit: "swords", element: "风",
    keywords: ["终结痛苦", "重生", "从废墟中站起", "释放", "新开始"],
    uprightBrief: "痛苦思维的终结和新开始的准备", reversedBrief: "从绝境中恢复站起",
    imageUrl: "icons/swords/tarot-swords-10.png",
    upright: "是的，它很痛。是的，你可能觉得你无法承受更多。但你看——你还在这里。你还站着。事实上，这是结束，也是开始。旧的思维正在死，新的正在出生。你会从废墟中站起来——你会。",
    reversed: "你正在从你认为永远不会恢复的绝望中恢复。这可能感觉像奇迹，但它是你内在力量的证明。继续前进。你已经通过了最困难的部分。现在，开始重建。",
    translations: {
      en: {
        upright: "Yes, it hurts. Yes, you may feel you cannot bear more. But look - you are still here. You are still standing. In fact, this is an ending, and also a beginning. Old thoughts are dying, new ones are being born. You will rise from the ruins - you will.",
        reversed: "You are recovering from a despair you thought you would never recover from. This may feel like a miracle, but it is proof of your inner strength. Keep going. You have passed the hardest part. Now, start rebuilding."
      }
    }
  },
  {
    id: "S11", name: "宝剑侍从", originalName: "Page of Swords", suit: "swords", element: "风",
    keywords: ["好奇心", "寻求真相", "直言", "新想法", "开放思维"],
    uprightBrief: "用好奇心和开放思维寻求真相", reversedBrief: "八卦或思维散乱",
    imageUrl: "icons/swords/tarot-swords-11.png",
    upright: "你的心智是敏锐的。保持好奇心——问问题，寻求真相。不要接受表面的答案。你的直言不讳可能会冒犯一些人，但这也是你的诚信。保持真实，同时保持尊重。",
    reversed: "你可能陷入八卦或思维散乱中。或者你害怕说出真相。记住：真相不会因为你不说出它就消失。找到你的声音，用尊重和清晰表达它。",
    translations: {
      en: {
        upright: "Your mind is sharp. Stay curious - ask questions, seek truth. Don't accept surface answers. Your straight-talk may offend some, but this is also your integrity. Stay authentic, while maintaining respect.",
        reversed: "You may be caught in gossip or scattered thinking. Or you are afraid to speak the truth. Remember: truth won't disappear just because you don't speak it. Find your voice, express it with respect and clarity."
      }
    }
  },
  {
    id: "S12", name: "宝剑骑士", originalName: "Knight of Swords", suit: "swords", element: "风",
    keywords: ["清晰行动", "说出真相", "直接", "速度", "突破"],
    uprightBrief: "用清晰和直接突破障碍", reversedBrief: "鲁莽或冷酷无情",
    imageUrl: "icons/swords/tarot-swords-12.png",
    upright: "你知道你需要说什么和做什么。不要犹豫——直接行动。你的清晰是强大的。但记住：真相可以用慈悲的方式说出。你有能力打破障碍，同时不伤害任何人。",
    reversed: "你的直接可能变得冷酷或鲁莽。或者你失去了方向，思维和行动不一致。停下来。重新连接你的「为什么」。清晰和行动需要对齐。",
    translations: {
      en: {
        upright: "You know what you need to say and do. Don't hesitate - act directly. Your clarity is powerful. But remember: truth can be spoken in a compassionate way. You have the ability to break barriers without hurting anyone.",
        reversed: "Your directness may become cold or reckless. Or you lost your direction, thinking and action are not aligned. Stop. Reconnect with your 'why'. Clarity and action need to be aligned."
      }
    }
  },
  {
    id: "S13", name: "宝剑王后", originalName: "Queen of Swords", suit: "swords", element: "风",
    keywords: ["清晰思维", "独立判断", "诚实沟通", "设定边界", "智慧"],
    uprightBrief: "用清晰和诚实设定健康边界", reversedBrief: "冷酷批判或过度尖锐",
    imageUrl: "icons/swords/tarot-swords-13.png",
    upright: "你的思维是清晰的，你的沟通是诚实的。你不怕说出困难的真话。但你也知道如何设定健康的边界。独立不是孤立——你可以连接他人，同时保持你的完整性。",
    reversed: "你可能变得过于批判或冷酷。或者你在用尖锐的话来保护自己。记住：真相可以用温柔的方式说出。你不需要变得坚硬来被尊重。",
    translations: {
      en: {
        upright: "Your thinking is clear, your communication is honest. You are not afraid to speak difficult truths. But you also know how to set healthy boundaries. Independence is not isolation - you can connect with others while maintaining your integrity.",
        reversed: "You may become too critical or cold. Or you are using sharp words to protect yourself. Remember: truth can be spoken in a gentle way. You don't need to become hard to be respected."
      }
    }
  },
  {
    id: "S14", name: "宝剑国王", originalName: "King of Swords", suit: "swords", element: "风",
    keywords: ["理性领导", "公正", "权威", "清晰决策", "智慧真理"],
    uprightBrief: "用理性和公正做出清晰决策", reversedBrief: "专制冷酷或滥用权力",
    imageUrl: "icons/swords/tarot-swords-14.png",
    upright: "你的决策是清晰和公正的。你可以用理性和智慧领导他人。但记住：真正的权威不是控制他人——而是激励他们找到自己的真相。用你的理智服务更高的善。",
    reversed: "你可能变得专制冷酷，或者你在滥用你的理性能力。真正的力量是谦逊的。你不需要总是「正确」——有时候，承认「我不知道」是最大的力量。",
    translations: {
      en: {
        upright: "Your decisions are clear and fair. You can lead others with reason and wisdom. But remember: true authority is not controlling others - but inspiring them to find their own truth. Use your intellect in service of the higher good.",
        reversed: "You may become autocratic and cold, or you are abusing your rational abilities. True power is humble. You don't need to always be 'right' - sometimes, admitting 'I don't know' is the greatest power."
      }
    }
  },

  // ============ 小阿卡纳 - 星币 Pentacles (14张) 身体疗愈与物质稳定 ============
  {
    id: "P1", name: "星币王牌", originalName: "Ace of Pentacles", suit: "pentacles", element: "土",
    keywords: ["新机会", "身体健康", "丰盛", "落地", "实际"],
    uprightBrief: "新的身体健康和丰盛机会", reversedBrief: "延迟开始或机会被错过",
    imageUrl: "icons/pentacles/tarot-pentacles-01.png",
    upright: "一个新的身体或物质机会正在来到你面前。可能是新的健康习惯、工作机会或财务增益。这是落地和实际的能量。抓住这个机会——它会带来长期的丰盛。你的身体是你灵魂的殿堂，好好照顾它。",
    reversed: "机会可能被延迟，或者你还没有准备好抓住它。这是可以的——时机很重要。同时，检查你的健康：你在给自己足够的休息和营养吗？身体知道答案。",
    translations: {
      en: {
        upright: "A new physical or material opportunity is coming to you. Could be a new health habit, work opportunity, or financial gain. This is grounded and practical energy. Seize this opportunity - it will bring long-term abundance. Your body is the temple of your soul, take good care of it.",
        reversed: "Opportunity may be delayed, or you are not ready to seize it yet. This is okay - timing matters. Meanwhile, check your health: are you giving yourself enough rest and nutrition? The body knows the answer."
      }
    }
  },
  {
    id: "P2", name: "星币二", originalName: "Two of Pentacles", suit: "pentacles", element: "土",
    keywords: ["平衡生活", "适应变化", "灵活", "健康习惯", "多任务"],
    uprightBrief: "在变化中平衡生活和健康", reversedBrief: "失衡或过度扩张",
    imageUrl: "icons/pentacles/tarot-pentacles-02.png",
    upright: "你在学习平衡多个领域：工作、健康、关系、休息。这不容易，但你是灵活的。像舞者一样移动——有时候你需要专注于一端，有时候另一端。倾听你的身体，它会告诉你什么时候需要调整。",
    reversed: "你可能感到失衡，或者承担了太多。你的身体在用症状说话——头痛、疲劳、压力。停下来。你不需要做所有事情。优先排序，放下那些不真正重要的。",
    translations: {
      en: {
        upright: "You are learning to balance multiple areas: work, health, relationships, rest. This is not easy, but you are flexible. Move like a dancer - sometimes you need to focus on one end, sometimes the other. Listen to your body, it will tell you when you need to adjust.",
        reversed: "You may feel out of balance, or took on too much. Your body is speaking in symptoms - headaches, fatigue, stress. Stop. You don't need to do everything. Prioritize, let go of those that are not truly important."
      }
    }
  },
  {
    id: "P3", name: "星币三", originalName: "Three of Pentacles", suit: "pentacles", element: "土",
    keywords: ["团队合作", "身体疗愈", "技能提升", "认可", "共建健康"],
    uprightBrief: "在团队合作中共建健康", reversedBrief: "缺乏合作或质量不佳",
    imageUrl: "icons/pentacles/tarot-pentacles-03.png",
    upright: "疗愈不是独自的旅程。寻找支持团队：医生、治疗师、教练、朋友。一起工作，你会走得更远。也认可自己的进步——你正在学习新的健康技能，这是值得庆祝的。",
    reversed: "你可能感觉你的疗愈团队不协调，或者你对 progress 不满意。沟通你的需求。你值得被听见。同时，检查你是否在做你这部分的工作——疗愈是需要你参与的。",
    translations: {
      en: {
        upright: "Healing is not a solo journey. Find a support team: doctors, therapists, coaches, friends. Work together, you will go further. Also acknowledge your own progress - you are learning new health skills, this is worth celebrating.",
        reversed: "You may feel your healing team is not coordinated, or you are not satisfied with progress. Communicate your needs. You deserve to be heard. Meanwhile, check if you are doing your part of the work - healing requires your participation."
      }
    }
  },
  {
    id: "P4", name: "星币四", originalName: "Four of Pentacles", suit: "pentacles", element: "土",
    keywords: ["稳定", "自我照顾", "保护能量", "建立安全", "健康基础"],
    uprightBrief: "建立稳定的自我照顾基础", reversedBrief: "过度控制或财务/健康不稳定",
    imageUrl: "icons/pentacles/tarot-pentacles-04.png",
    upright: "你在建立稳定的健康基础。规律作息、营养饮食、稳定关系——这些都是自我照顾的砖块。保护你的能量，学会说「不」。稳定不是无聊——它是自由的基础。",
    reversed: "你可能过度控制你的健康或财务，或者相反——感到不稳定。真正的稳定来自于内在，而非外在的占有。放下对控制的执着，你会找到真正的安心。",
    translations: {
      en: {
        upright: "You are building a stable foundation for self-care. Regular schedule, nutritious diet, stable relationships - these are the bricks of self-care. Protect your energy, learn to say 'no'. Stability is not boring - it is the foundation of freedom.",
        reversed: "You may be over-controlling your health or finances, or conversely - feeling unstable. True stability comes from within, not external possession. Let go of attachment to control, you will find true peace of mind."
      }
    }
  },
  {
    id: "P5", name: "星币五", originalName: "Five of Pentacles", suit: "pentacles", element: "土",
    keywords: ["身体困难", "寻求支持", "你不被遗弃", "疗愈", "内在财富"],
    uprightBrief: "在身体或物质困难中寻求支持", reversedBrief: "从困难中恢复发现内在财富",
    imageUrl: "icons/pentacles/tarot-pentacles-05.png",
    upright: "你可能正在经历健康或财务的困难。但请记住：你并不孤单。寻求支持——有资源和人会帮助你。同时，记住你的内在财富：你的韧性、你的勇气、你的生命本身。这些是没人能拿走的。",
    reversed: "你正在从困难中恢复。可能发现了你其实比自己想象的更有资源。困难教会了你什么？有时候，失去外在的东西会让我们发现内在的丰盛。你是丰富的，即使你不总是感觉得到。",
    translations: {
      en: {
        upright: "You may be experiencing health or financial difficulties. But please remember: you are not alone. Seek support - there are resources and people who can help you. Meanwhile, remember your inner wealth: your resilience, your courage, your life itself. These are things no one can take away.",
        reversed: "You are recovering from difficulties. You may have discovered that you actually have more resources than you thought. What did difficulties teach you? Sometimes, losing external things helps us discover inner abundance. You are abundant, even if you don't always feel it."
      }
    }
  },
  {
    id: "P6", name: "星币六", originalName: "Six of Pentacles", suit: "pentacles", element: "土",
    keywords: ["分享健康", "平衡给予接受", "慷慨", "接受支持", "互惠"],
    uprightBrief: "在给予和接受支持中找到平衡", reversedBrief: "不平衡或难以接受帮助",
    imageUrl: "icons/pentacles/tarot-pentacles-06.png",
    upright: "健康的疗愈是给予和接受的舞蹈。有时候你需要给予支持，有时候你需要接受。两者都是礼物。如果你有困难接受帮助——记住：允许他人给予也是给他们的礼物。我们都在一起。",
    reversed: "给予和接受可能不平衡。你可能给得太多而耗尽自己，或者相反——难以接受帮助。健康的关系是互惠的。学习说「我需要帮助」不是弱点——它是勇气。",
    translations: {
      en: {
        upright: "Healthy healing is a dance of giving and receiving. Sometimes you need to give support, sometimes you need to receive. Both are gifts. If you have difficulty accepting help - remember: allowing others to give is also a gift to them. We are all in this together.",
        reversed: "Giving and receiving may be out of balance. You may give too much and burn yourself out, or conversely - have difficulty accepting help. Healthy relationships are reciprocal. Learning to say 'I need help' is not weakness - it is courage."
      }
    }
  },
  {
    id: "P7", name: "星币七", originalName: "Seven of Pentacles", suit: "pentacles", element: "土",
    keywords: ["耐心", "信任过程", "评估健康", "长期疗愈", "投资自己"],
    uprightBrief: "耐心地投资长期的身体疗愈", reversedBrief: "缺乏进展或急于求成",
    imageUrl: "icons/pentacles/tarot-pentacles-07.png",
    upright: "疗愈身体需要时间。就像种树，你需要浇水、等待、信任。不要急于看到结果——过程本身就是礼物。评估你的健康习惯：它们在长期会服务你吗？投资你自己，你值得。",
    reversed: "你可能感到沮丧，因为结果来得比预期慢。或者你在质疑你的努力是否值得。继续。身体的疗愈是马拉松，不是短跑。相信种子正在地下生长，即使你还看不见芽。",
    translations: {
      en: {
        upright: "Healing the body takes time. Like planting a tree, you need to water, wait, trust. Don't rush to see results - the process itself is a gift. Evaluate your health habits: will they serve you in the long term? Invest in yourself, you are worth it.",
        reversed: "You may feel frustrated because results come slower than expected. Or you are questioning whether your efforts are worth it. Continue. Healing the body is a marathon, not a sprint. Trust that seeds are growing underground, even if you can't see the sprouts yet."
      }
    }
  },
  {
    id: "P8", name: "星币八", originalName: "Eight of Pentacles", suit: "pentacles", element: "土",
    keywords: ["持续练习", "精进技能", "身体健康", "纪律", "专注疗愈"],
    uprightBrief: "通过持续练习精进健康技能", reversedBrief: "缺乏动力或质量下降",
    imageUrl: "icons/pentacles/tarot-pentacles-08.png",
    upright: "你在精进你的健康技能：可能是瑜伽、冥想、营养、运动。持续练习会带来精通。不要低估日常小步骤的力量。你正在建造一个健康的身体——一块砖一块砖地。专注和纪律会带你很远。",
    reversed: "你可能失去了动力，或者你的健康习惯的质量在下降。这是正常的——我们都有低谷。不要放弃。重新开始，即使从小步骤开始。你的身体会感谢你的。",
    translations: {
      en: {
        upright: "You are refining your health skills: could be yoga, meditation, nutrition, exercise. Consistent practice leads to mastery. Don't underestimate the power of small daily steps. You are building a healthy body - brick by brick. Focus and discipline will take you far.",
        reversed: "You may have lost motivation, or the quality of your health habits is declining. This is normal - we all have low periods. Don't give up. Start again, even if from small steps. Your body will thank you."
      }
    }
  },
  {
    id: "P9", name: "星币九", originalName: "Nine of Pentacles", originalName: "Nine of Pentacles", suit: "pentacles", element: "土",
    keywords: ["身体独立", "自我滋养", "享受健康", "丰盛", "感恩身体"],
    uprightBrief: "享受身体独立和健康的丰盛", reversedBrief: "过度独立或物质替代情感",
    imageUrl: "icons/pentacles/tarot-pentacles-09.png",
    upright: "你正在享受健康的丰盛。你的身体感觉良好，你的生活习惯支持你。享受这个！你值得感觉良好。同时，感恩你的身体——它一直陪伴你，即使在你不总是善待它的时候。现在，好好对待它。",
    reversed: "你可能过于独立而不寻求帮助，或者你在用物质舒适替代真正的情感满足。真正的丰盛包括身体、情感和精神。平衡。你不需要独自做所有事情。",
    translations: {
      en: {
        upright: "You are enjoying the abundance of health. Your body feels good, your habits support you. Enjoy this! You deserve to feel good. Meanwhile, be grateful to your body - it has been with you all along, even when you haven't always treated it well. Now, treat it well.",
        reversed: "You may be too independent and not seek help, or you are using material comforts to replace true emotional satisfaction. True abundance includes physical, emotional, and spiritual. Balance. You don't need to do everything alone."
      }
    }
  },
  {
    id: "P10", name: "星币十", originalName: "Ten of Pentacles", suit: "pentacles", element: "土",
    keywords: ["长期健康", "家族疗愈", "传承", "稳定丰盛", "根基"],
    uprightBrief: "建立长期的健康和家族疗愈", reversedBrief: "家庭健康问题或财务不稳定",
    imageUrl: "icons/pentacles/tarot-pentacles-10.png",
    upright: "你在建立长期的健康和稳定。这可能是关于建立家族健康传统——好的饮食习惯、运动习惯、情绪健康习惯。你想把什么传给下一代？你的疗愈不仅是为了你自己——它涟漪效应到你的家庭和社区。",
    reversed: "家庭中可能有健康问题或财务不稳定。或者你感到与家族的连接断裂。疗愈家庭模式需要时间和勇气。但你是可以打破循环的人。你的疗愈是给未来世代的礼物。",
    translations: {
      en: {
        upright: "You are building long-term health and stability. This could be about establishing family health traditions - good eating habits, exercise habits, emotional health habits. What do you want to pass on to the next generation? Your healing is not only for yourself - it ripples to your family and community.",
        reversed: "There may be health issues or financial instability in the family. Or you feel disconnected from family. Healing family patterns takes time and courage. But you are the one who can break the cycle. Your healing is a gift to future generations."
      }
    }
  },
  {
    id: "P11", name: "星币侍从", originalName: "Page of Pentacles", suit: "pentacles", element: "土",
    keywords: ["学习健康", "新开始", "接地气", "好奇身体", "小步骤"],
    uprightBrief: "用好奇心学习新的健康习惯", reversedBrief: "缺乏承诺或拖延开始",
    imageUrl: "icons/pentacles/tarot-pentacles-11.png",
    upright: "你对学习新的健康习惯感到兴奋。保持这种好奇心！你不需要一次改变所有事情——小步骤会带你走很远。接地气，连接大自然，连接你的身体。它是智慧的。倾听它。",
    reversed: "你可能拖延开始新的健康习惯，或者你缺乏承诺。这是可以的——改变需要时间来调整。但不要放弃。即使很小的步骤也是步骤。你的未来 self 会感谢你。",
    translations: {
      en: {
        upright: "You are excited to learn new health habits. Keep this curiosity! You don't need to change everything at once - small steps will take you far. Ground yourself, connect with nature, connect with your body. It is wise. Listen to it.",
        reversed: "You may be procrastinating starting new health habits, or you lack commitment. This is okay - change takes time to adjust. But don't give up. Even very small steps are steps. Your future self will thank you."
      }
    }
  },
  {
    id: "P12", name: "星币骑士", originalName: "Knight of Pentacles", suit: "pentacles", element: "土",
    keywords: ["可靠", "持续进步", "耐心", "健康纪律", "稳定前进"],
    uprightBrief: "用可靠和耐心持续进步", reversedBrief: "固执或进展过于缓慢",
    imageUrl: "icons/pentacles/tarot-pentacles-12.png",
    upright: "你在稳定地前进。可能不快，但是可靠。你的健康纪律是令人钦佩的。继续——你的坚持会带来长期的回报。有时候，最慢的路实际上是最快的，因为它是可持续的。",
    reversed: "你可能过于固执于某些健康方法，或者进展慢到令人沮丧。检查：你的方法真的服务你吗？有时候，你需要调整而不是放弃。灵活和坚持之间需要平衡。",
    translations: {
      en: {
        upright: "You are moving forward steadily. May not be fast, but reliable. Your health discipline is admirable. Continue - your persistence will bring long-term rewards. Sometimes, the slowest path is actually the fastest, because it is sustainable.",
        reversed: "You may be too stubborn about certain health methods, or progress is so slow that it's frustrating. Check: are your methods really serving you? Sometimes, you need to adjust rather than give up. Balance between flexibility and persistence is needed."
      }
    }
  },
  {
    id: "P13", name: "星币王后", originalName: "Queen of Pentacles", suit: "pentacles", element: "土",
    keywords: ["实际滋养", "接地气", "身体智慧", "照顾自己他人", "丰盛实践"],
    uprightBrief: "用实际和接地气的方式滋养", reversedBrief: "忽视自我照顾或过度工作",
    imageUrl: "icons/pentacles/tarot-pentacles-13.png",
    upright: "你懂得如何实际地照顾自己和他人。你的滋养是接地气的——好食物、舒适的环境、稳定的日常。连接大自然，连接你的身体。你不需要复杂的方法来健康——有时候，最简单的是最好的。",
    reversed: "你可能忽视了自我照顾，或者过度工作以至于忘记了连接身体。停下来。你的身体在说话——疲劳、紧张、不安。倾听它。你值得被照顾，首先是被你自己。",
    translations: {
      en: {
        upright: "You know how to practically take care of yourself and others. Your nurturing is down-to-earth - good food, comfortable environment, stable routine. Connect with nature, connect with your body. You don't need complicated methods to be healthy - sometimes, simplest is best.",
        reversed: "You may have neglected self-care, or overworked to the point of forgetting to connect with your body. Stop. Your body is speaking - fatigue, tension, restlessness. Listen to it. You deserve to be taken care of, first of all by yourself."
      }
    }
  },
  {
    id: "P14", name: "星币国王", originalName: "King of Pentacles", suit: "pentacles", element: "土",
    keywords: ["物质丰盛", "健康稳定", "可靠提供", "长期规划", "身体智慧"],
    uprightBrief: "建立物质的丰盛和健康的稳定", reversedBrief: "过度控制或忽视健康",
    imageUrl: "icons/pentacles/tarot-pentacles-14.png",
    upright: "你已经建立了物质的丰盛和健康的稳定。你的身体感觉良好，你的财务状况支持你的健康选择。分享你的丰盛——不仅仅是金钱，还有你的健康智慧。你可以通过你的例子激励他人。",
    reversed: "你可能过于执着于物质成功而忽视了健康，或者你在用工作逃避情感。真正的丰盛包括身体、情感和精神。重新平衡。你值得拥有所有层面的丰盛。",
    translations: {
      en: {
        upright: "You have established material abundance and health stability. Your body feels good, your financial situation supports your health choices. Share your abundance - not only money, but also your health wisdom. You can inspire others through your example.",
        reversed: "You may be too attached to material success and neglect health, or you are using work to escape emotions. True abundance includes physical, emotional, and spiritual. Rebalance. You deserve abundance at all levels."
      }
    }
  }
];

module.exports = healingCards;
