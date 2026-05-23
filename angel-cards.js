// 天使塔罗牌数据 (Angel Tarot) - 78张牌完整版
// 基于Angel Tarot的温和、治愈风格
// 牌意更加积极、充满希望，强调天使的指引与爱
const angelCards = [
  // ============ 大阿卡纳 Major Arcana (22张) ============
  {
    id: 0, name: "愚者", originalName: "The Fool", suit: "major", element: "风",
    keywords: ["新的开始", "信仰", "天使的守护", "自由", "信任"],
    uprightBrief: "天使守护下的全新开始", reversedBrief: "缺乏信任或盲目跳跃",
    imageUrl: "icons/major/tarot-major-00.png",
    upright: "在天使的守护下，你正踏上全新的灵性旅程。宇宙和你的守护天使正支持着你，请带着信心和喜悦踏入未知。这是充满祝福的新开始。",
    reversed: "可能需要更多的信任和准备。你的守护天使提醒你：在跳跃之前，先建立内在的稳固。不要害怕，但也要明智地行动。",
    translations: {
      en: {
        upright: "Under the protection of angels, you are embarking on a brand new spiritual journey. The universe and your guardian angels support you. Step into the unknown with faith and joy.",
        reversed: "More trust and preparation may be needed. Your guardian angel reminds you: build inner stability before leaping. Don't be afraid, but act wisely."
      }
    }
  },
  {
    id: 1, name: "魔术师", originalName: "The Magician", suit: "major", element: "风",
    keywords: ["显化", "天使的协助", "创造力", "力量", "专注"],
    uprightBrief: "天使协助你显化梦想", reversedBrief: "才能被隐藏或自我怀疑",
    imageUrl: "icons/major/tarot-major-01.png",
    upright: "你的守护天使正在帮助你将梦想变为现实。你拥有所需的一切工具和天赋。专注于你的意图，宇宙会协同你创造奇迹。这是显化的强大时刻。",
    reversed: "你的天使看到你隐藏的才能。不要自我怀疑，你是被祝福的。重新连接你的内在力量，你的天使正等待帮助你。",
    translations: {
      en: {
        upright: "Your guardian angel is helping you manifest your dreams. You have all the tools and gifts needed. Focus on your intention; the universe co-creates miracles with you.",
        reversed: "Your angel sees your hidden talents. Don't doubt yourself; you are blessed. Reconnect with your inner power; your angel is waiting to help."
      }
    }
  },
  {
    id: 2, name: "女祭司", originalName: "The High Priestess", suit: "major", element: "水",
    keywords: ["直觉", "天使的低语", "内在智慧", "神秘", "静心"],
    uprightBrief: "倾听天使的低语与直觉", reversedBrief: "忽视直觉或过度理性",
    imageUrl: "icons/major/tarot-major-02.png",
    upright: "你的天使正通过直觉与你沟通。静下心来，在沉默中聆听。你内在的智慧是来自最高源头的指引。信任那些温柔的、反复出现的感觉。",
    reversed: "你的天使温柔地提醒你：不要只依赖理性。你的直觉是天使的声音。重新连接内在的宁静，答案就在你心中。",
    translations: {
      en: {
        upright: "Your angel is communicating through your intuition. Quiet your mind and listen in stillness. Your inner wisdom is guidance from the Highest Source. Trust those gentle, recurring feelings.",
        reversed: "Your angel gently reminds you: don't rely only on logic. Your intuition is the voice of angels. Reconnect with inner stillness; the answer is within."
      }
    }
  },
  {
    id: 3, name: "女皇", originalName: "The Empress", suit: "major", element: "土",
    keywords: ["天使的滋养", "丰盛", "美", "创造力", "自我关爱"],
    uprightBrief: "天使般的滋养与丰盛", reversedBrief: "需要更多自我关爱",
    imageUrl: "icons/major/tarot-major-03.png",
    upright: "你正被天使的爱深深滋养着。宇宙以丰盛回应你的振动。享受生活中的美，善待自己。你值得所有的美好，你的天使正为你编织祝福。",
    reversed: "你的天使邀请你更多地关爱自己。你无法从空杯中倾倒。先滋养自己，然后你才能分享爱。你是值得被爱的。",
    translations: {
      en: {
        upright: "You are deeply nourished by angelic love. The universe responds to your vibration with abundance. Enjoy the beauty in life. You deserve all good things; your angels are weaving blessings for you.",
        reversed: "Your angel invites you to love yourself more. You cannot pour from an empty cup. Nourish yourself first, then you can share love. You are worthy of love."
      }
    }
  },
  {
    id: 4, name: "皇帝", originalName: "The Emperor", suit: "major", element: "火",
    keywords: ["神圣的秩序", "保护", "领导力", "稳定", "结构"],
    uprightBrief: "建立神圣的秩序与稳定", reversedBrief: "需要更灵活的结构",
    imageUrl: "icons/major/tarot-major-04.png",
    upright: "你的天使正在帮助你建立稳固的基础。以爱与智慧领导自己和他人。真正的力量来自于服务和保护。在你的生活中创造神圣的秩序。",
    reversed: "你的天使提醒你：真正的力量是柔韧的。不需要严格控制一切。以信任和灵活性来领导，你的天使会支持你的每一步。",
    translations: {
      en: {
        upright: "Your angel is helping you build a solid foundation. Lead yourself and others with love and wisdom. True power comes from service and protection. Create divine order in your life.",
        reversed: "Your angel reminds you: true strength is flexible. You don't need to control everything tightly. Lead with trust and flexibility; your angel supports every step."
      }
    }
  },
  {
    id: 5, name: "教皇", originalName: "The Hierophant", suit: "major", element: "土",
    keywords: ["天使的教导", "灵性指引", "传统智慧", "内在导师", "信仰"],
    uprightBrief: "接收天使的教导与指引", reversedBrief: "寻找内在的声音",
    imageUrl: "icons/major/tarot-major-05.png",
    upright: "你的天使正通过导师、书籍或同步性事件向你传递神圣的教导。保持开放，接收来自高我的指引。你并不孤单，天使们正陪伴着你。",
    reversed: "你的天使鼓励你信任自己的内在导师。外在的权威可以提供帮助，但最终，你的答案来自与神圣的连接。你是被引导的。",
    translations: {
      en: {
        upright: "Your angel is delivering divine teachings through mentors, books, or synchronicities. Stay open to guidance from your Higher Self. You are not alone; angels accompany you.",
        reversed: "Your angel encourages you to trust your inner teacher. External authorities can help, but ultimately your answers come from connection with the Divine. You are guided."
      }
    }
  },
  {
    id: 6, name: "恋人", originalName: "The Lovers", suit: "major", element: "风",
    keywords: ["神圣的爱", "和谐", "选择", "灵魂连接", "价值观"],
    uprightBrief: "天使祝福的爱与和谐选择", reversedBrief: "需要做出符合灵魂的选择",
    imageUrl: "icons/major/tarot-major-06.png",
    upright: "天使正在祝福你的关系和选择。这是关于爱与和谐的美好时刻。在做出决定时，倾听你灵魂的声音。真正的爱始于自爱，然后流向他人。",
    reversed: "你的天使邀请你做出符合你最高利益的选择。不要在恐惧中做决定。以爱和清晰来审视你的关系和价值。你值得被爱。",
    translations: {
      en: {
        upright: "Angels are blessing your relationships and choices. This is a beautiful time for love and harmony. When making decisions, listen to your soul's voice. True love begins with self-love.",
        reversed: "Your angel invites you to make choices aligned with your highest good. Don't decide from fear. Examine your relationships and values with love and clarity."
      }
    }
  },
  {
    id: 7, name: "战车", originalName: "The Chariot", suit: "major", element: "水",
    keywords: ["神圣的推进", "胜利", "意志力", "专注", "克服"],
    uprightBrief: "在天使支持下前进",
    reversedBrief: "需要重新调整方向",
    imageUrl: "icons/major/tarot-major-07.png",
    upright: "你的天使正为你清除道路上的障碍。以坚定的意志和信心前进。你正在胜利的路上，你的天使战车正带你走向应许之地。相信过程。",
    reversed: "你的天使温柔地建议你重新调整方向。你可能在对抗而不是流动。放下对结果的控制，让你的天使为你导航。",
    translations: {
      en: {
        upright: "Your angel is clearing obstacles from your path. Move forward with determined will and confidence. You are on the road to victory. Your angel chariot is taking you to the promised land. Trust the process.",
        reversed: "Your angel gently suggests you realign your direction. You may be resisting rather than flowing. Release control of outcomes; let your angel navigate for you."
      }
    }
  },
  {
    id: 8, name: "力量", originalName: "Strength", suit: "major", element: "火",
    keywords: ["天使的勇气", "温柔的力量", "耐心", "慈悲", "内在力量"],
    uprightBrief: "天使赋予的温柔力量", reversedBrief: "需要更多的自我慈悲",
    imageUrl: "icons/major/tarot-major-08.png",
    upright: "你的天使正赋予你温柔而强大的力量。真正的力量不是控制，而是以爱和慈悲驯服内在的野兽。你比想象中更强大，你的天使与你同在。",
    reversed: "你的天使提醒你：对自己温柔一点。你不需要完美才能被爱。你的温柔本身就是一种力量。让天使的爱治愈你的自我怀疑。",
    translations: {
      en: {
        upright: "Your angel is granting you gentle yet powerful strength. True strength is not control, but taming the inner beast with love and compassion. You are stronger than you think.",
        reversed: "Your angel reminds you: be gentle with yourself. You don't need to be perfect to be loved. Your gentleness is itself a strength. Let angelic love heal your self-doubt."
      }
    }
  },
  {
    id: 9, name: "隐士", originalName: "The Hermit", suit: "major", element: "火",
    keywords: ["天使的指引", "内省", "灵性觉醒", "独处", "光"],
    uprightBrief: "在天使的光中内省", reversedBrief: "从孤独中走出来",
    imageUrl: "icons/major/tarot-major-09.png",
    upright: "你的天使正引领你进入内在的圣殿。在静默中，你会找到所有的答案。这不是孤独，而是与神圣的约会。你的内在之光正等待着被发现。",
    reversed: "你的天使看到你准备好重新与世界分享你的光了。你内在的旅程已经给了你智慧。现在，以爱与他人连接，分享你的光芒。",
    translations: {
      en: {
        upright: "Your angel is leading you into the inner sanctuary. In silence, you will find all answers. This is not loneliness, but a date with the Divine. Your inner light awaits discovery.",
        reversed: "Your angel sees you're ready to share your light with the world again. Your inner journey has given you wisdom. Now connect with others in love, share your light."
      }
    }
  },
  {
    id: 10, name: "命运之轮", originalName: "Wheel of Fortune", suit: "major", element: "火",
    keywords: ["天使的祝福", "转折点", "好运", "命运", "同步性"],
    uprightBrief: "天使转动的命运之轮", reversedBrief: "耐心等待轮子的转动",
    imageUrl: "icons/major/tarot-major-10.png",
    upright: "你的天使正在为你转动命运之轮。好运、机遇和祝福正在向你涌来。对同步性保持警觉——你的天使正通过它们与你沟通。感恩是加速好运的秘诀。",
    reversed: "你的天使提醒你：即使看起来什么都没有发生，轮子仍在转动。耐心等待，继续感恩和祈祷。你的时刻即将到来，天使正在为你工作。",
    translations: {
      en: {
        upright: "Your angel is spinning the Wheel of Fortune for you. Good luck, opportunities and blessings are flowing to you. Stay alert to synchronicities—your angel is communicating through them.",
        reversed: "Your angel reminds you: even if nothing seems to be happening, the wheel is still turning. Wait patiently, keep gratitude and prayer. Your moment is coming; angels are working for you."
      }
    }
  },
  {
    id: 11, name: "正义", originalName: "Justice", suit: "major", element: "风",
    keywords: ["天使的正义", "因果", "真相", "平衡", "诚实"],
    uprightBrief: "天使带来的正义与平衡", reversedBrief: "需要对自己诚实",
    imageUrl: "icons/major/tarot-major-11.png",
    upright: "你的天使正在为你带来正义和平衡。因果法则正在运作，你的善行正在回到你身上。保持诚实和高振动，宇宙是公平的，你的天使确保一切都好。",
    reversed: "你的天使邀请你对自己完全诚实。你是否在逃避某些真相？正义可能会延迟，但永远不会缺席。以爱和真理来面对你的处境。",
    translations: {
      en: {
        upright: "Your angel is bringing justice and balance to you. The law of cause and effect is operating; your good deeds are returning to you. Stay honest and high-vibrational. The universe is fair.",
        reversed: "Your angel invites you to be completely honest with yourself. Are you avoiding some truth? Justice may be delayed but never denied. Face your situation with love and truth."
      }
    }
  },
  {
    id: 12, name: "倒吊人", originalName: "The Hanged Man", suit: "major", element: "水",
    keywords: ["神圣的暂停", "放下", "新视角", "信任", "牺牲"],
    uprightBrief: "在神圣暂停中信任",
    reversedBrief: "抗拒导致更多的挣扎",
    imageUrl: "icons/major/tarot-major-12.png",
    upright: "你的天使邀请你放下的控制，进入神圣的暂停。这不是惩罚，而是礼物。从新的角度看待你的处境，信任神圣的时机。在等待中，祝福正在酝酿。",
    reversed: "你的天使看到你的挣扎。放下抗拒，臣服不是放弃，而是信任更高的计划。你的天使正在为你工作，即使在看似的停滞中。",
    translations: {
      en: {
        upright: "Your angel invites you to release control and enter a sacred pause. This is not punishment, but a gift. See your situation from a new angle. Trust divine timing. Blessings are brewing in the waiting.",
        reversed: "Your angel sees your struggle. Release resistance. Surrendering is not giving up, but trusting a higher plan. Your angel is working for you, even in apparent stillness."
      }
    }
  },
  {
    id: 13, name: "死亡", originalName: "Death", suit: "major", element: "水",
    keywords: ["天使的转化", "重生", "释放", "蜕变", "新的开始"],
    uprightBrief: "天使引导的美丽转化", reversedBrief: "抗拒必要的改变",
    imageUrl: "icons/major/tarot-major-13.png",
    upright: "你的天使正在帮助你释放旧的模式，为新的成长腾出空间。这不是真正的结束，而是美丽的转化和重生。信任这个过程，你的天使正牵着你的手走过转变。",
    reversed: "你的天使温柔地鼓励你放下抗拒。你紧紧抓住的东西可能不再服务于你。允许自己蜕变，就像蝴蝶从茧中出来一样美丽。",
    translations: {
      en: {
        upright: "Your angel is helping you release old patterns to make room for new growth. This is not a true ending, but beautiful transformation and rebirth. Trust the process; your angel holds your hand through transition.",
        reversed: "Your angel gently encourages you to release resistance. What you're clinging to may no longer serve you. Allow yourself to metamorphose, as beautifully as a butterfly from its cocoon."
      }
    }
  },
  {
    id: 14, name: "节制", originalName: "Temperance", suit: "major", element: "火",
    keywords: ["天使的治愈", "平衡", "耐心", "融合", "和谐"],
    uprightBrief: "天使带来的平衡与治愈", reversedBrief: "需要找到内在的平衡",
    imageUrl: "icons/major/tarot-major-14.png",
    upright: "你的天使正在为你带来深层的治愈和平衡。你生活中的各个部分正在美丽地融合。耐心等待，信任神圣的时机。你的天使正在调和你的处境。",
    reversed: "你的天使提醒你：你可能在生活的某个领域失去了平衡。回到中心，你的天使会帮助你重新调整。你不需要急于求成，慢慢来。",
    translations: {
      en: {
        upright: "Your angel is bringing deep healing and balance to you. Different parts of your life are beautifully blending. Wait patiently, trust divine timing. Your angel is harmonizing your situation.",
        reversed: "Your angel reminds you: you may have lost balance in some area of life. Return to center; your angel will help you realign. You don't need to rush."
      }
    }
  },
  {
    id: 15, name: "恶魔", originalName: "The Devil", suit: "major", element: "土",
    keywords: ["释放束缚", "光之天使", "自由", "觉醒", "幻象"],
    uprightBrief: "天使帮助你打破束缚", reversedBrief: "正在从幻象中觉醒",
    imageUrl: "icons/major/tarot-major-15.png",
    upright: "光之天使正在帮助你看到：你身上的锁链其实是松开的。你所相信的束缚往往是幻象。你是自由的，你是光，你的天使正帮助你记起你的真实身份。",
    reversed: "你的天使庆祝你正在从旧的束缚中觉醒。你正在打破限制性的信念。继续前进，你的天使为你欢呼。你是自由的！",
    translations: {
      en: {
        upright: "Angels of Light are helping you see: the chains on you are actually loose. The bonds you believe in are often illusions. You are free, you are light. Your angel helps you remember your true identity.",
        reversed: "Your angel celebrates your awakening from old bonds. You are breaking limiting beliefs. Keep going; your angel cheers for you. You are free!"
      }
    }
  },
  {
    id: 16, name: "塔", originalName: "The Tower", suit: "major", element: "火",
    keywords: ["天使的重建", "觉醒", "释放", "真相", "新的基础"],
    uprightBrief: "天使在废墟上重建",
    reversedBrief: "恐惧变化或抗拒真相",
    imageUrl: "icons/major/tarot-major-16.png",
    upright: "你的天使正在拆除不再服务于你的最高的旧结构，以便在更真实的基础上重建。虽然这可能感觉具有挑战性，但这是来自爱的干预。信任你的天使，新的、更美的事物正在出现。",
    reversed: "你的天使看到你对变化的恐惧。你不需要紧紧抓住摇摇欲坠的东西。释放，让你的天使为你建造更美好的事物。你被爱和保护的。",
    translations: {
      en: {
        upright: "Your angel is dismantling old structures that no longer serve your highest good, so reconstruction can happen on a truer foundation. Though challenging, this is intervention from love. Trust your angel; new, more beautiful things are emerging.",
        reversed: "Your angel sees your fear of change. You don't need to cling to what's crumbling. Release, let your angel build better things for you. You are loved and protected."
      }
    }
  },
  {
    id: 17, name: "星星", originalName: "The Star", suit: "major", element: "风",
    keywords: ["天使的希望", "治愈", "灵感", "宁静", "祝福"],
    uprightBrief: "天使灌注的希望与治愈", reversedBrief: "重新连接希望",
    imageUrl: "icons/major/tarot-major-17.png",
    upright: "你的天使正在用希望和治愈的能量灌注你。你是被祝福的，你的愿望正在被听到。保持希望和信心，你的星星正在照耀。这是一个深刻治愈和灵感激发的时刻。",
    reversed: "你的天使温柔地提醒你：即使在最黑暗的夜晚，星星仍在照耀。重新连接希望，你的天使从未离开。你被爱，你是光。",
    translations: {
      en: {
        upright: "Your angel is infusing you with hope and healing energy. You are blessed, your wishes are being heard. Keep hope and faith; your star is shining. This is a time of deep healing and inspiration.",
        reversed: "Your angel gently reminds you: even on the darkest night, stars still shine. Reconnect with hope; your angel has never left. You are loved, you are light."
      }
    }
  },
  {
    id: 18, name: "月亮", originalName: "The Moon", suit: "major", element: "水",
    keywords: ["穿越幻象", "信任直觉", "释放恐惧", "灵性成长", "月亮天使"],
    uprightBrief: "月亮天使帮助你穿越幻象", reversedBrief: "恐惧正在消散",
    imageUrl: "icons/major/tarot-major-18.png",
    upright: "月亮天使正在帮助你穿越幻象，到达清晰的彼岸。你可能在面对恐惧或不安全感，但请知道：这些是基于过去的幻象。你的天使正牵着你的手走过这片月光。",
    reversed: "你的天使庆祝你正在从恐惧和幻象中走出来。真相正在显现，你正在进入更清晰的状态。继续信任，你的天使与你同在。",
    translations: {
      en: {
        upright: "The Moon Angel is helping you navigate through illusions to the shore of clarity. You may be facing fears or insecurities, but know: these are illusions based on the past. Your angel holds your hand through this moonlight.",
        reversed: "Your angel celebrates your walking out of fear and illusions. Truth is revealing itself. You're entering clearer states. Keep trusting; your angel is with you."
      }
    }
  },
  {
    id: 19, name: "太阳", originalName: "The Sun", suit: "major", element: "火",
    keywords: ["天使的喜悦", "成功", "活力", "真相", "纯真"],
    uprightBrief: "天使沐浴在阳光下",
    reversedBrief: "暂时的云层，太阳仍在",
    imageUrl: "icons/major/tarot-major-19.png",
    upright: "你的天使正在用纯粹的喜悦和成功沐浴你。这是你生命中最光明的时刻之一。真相大白，一切都清晰明亮。让你的内在孩子在阳光下跳舞，你是被深深爱的。",
    reversed: "你的天使提醒你：暂时的云层无法遮蔽太阳。你可能感到沮丧，但光明仍在。很快，太阳会再次照耀，继续相信美好。",
    translations: {
      en: {
        upright: "Your angel is bathing you in pure joy and success. This is one of the brightest moments of your life. Truth is revealed, all is clear and bright. Let your inner child dance in the sunlight; you are deeply loved.",
        reversed: "Your angel reminds you: temporary clouds cannot block the sun. You may feel discouraged, but light remains. Soon the sun will shine again. Keep believing in the good."
      }
    }
  },
  {
    id: 20, name: "审判", originalName: "Judgment", suit: "major", element: "风",
    keywords: ["天使的召唤", "觉醒", "重生", "使命", "宽恕"],
    uprightBrief: "天使召唤你觉醒与重生", reversedBrief: "需要宽恕和释放过去",
    imageUrl: "icons/major/tarot-major-20.png",
    upright: "你的天使正在召唤你觉醒到你真正的使命和身份。这是重生和复活的时候。倾听你灵魂的召唤，你的天使正等待帮助你踏上更高的道路。宽恕自己和他人。",
    reversed: "你的天使鼓励你释放过去，以便你可以完全地重生。你是否在评判自己或他人？宽恕是自由的关键，你的天使正为你打开新生之门。",
    translations: {
      en: {
        upright: "Your angel is calling you to awaken to your true mission and identity. This is a time of rebirth and resurrection. Listen to your soul's call; your angel awaits to help you step onto a higher path. Forgive yourself and others.",
        reversed: "Your angel encourages you to release the past so you can fully rebirth. Are you judging yourself or others? Forgiveness is the key to freedom; your angel is opening the door to new life for you."
      }
    }
  },
  {
    id: 21, name: "世界", originalName: "The World", suit: "major", element: "土",
    keywords: ["天使的完成", "圆满", "整合", "成就", "新周期"],
    uprightBrief: "天使祝福的圆满完成",
    reversedBrief: "整合剩余的碎片",
    imageUrl: "icons/major/tarot-major-21.png",
    upright: "你的天使正在祝福你生命中一个周期的圆满完成。你已经学到了你需要学习的一切，现在准备好进入新的层次。庆祝你的成就，你的天使为你鼓掌。你是完整的。",
    reversed: "你的天使看到你正在整合最后的碎片。你几乎完成了这个周期，只需要再一点耐心。信任你的旅程，你的天使正帮助你完美地收尾。",
    translations: {
      en: {
        upright: "Your angel is blessing the completion of a life cycle for you. You have learned what you needed to learn, now ready to enter a new level. Celebrate your achievement; your angel applauds you. You are complete.",
        reversed: "Your angel sees you integrating the final fragments. You've almost completed this cycle, just need a little more patience. Trust your journey; your angel helps you finish perfectly."
      }
    }
  },
  
  // ---------- 权杖/火元素 (Wands) ----------
  {
    id: "W1", name: "权杖王牌", originalName: "Ace of Wands", suit: "wands", element: "火",
    keywords: ["创造的火花", "灵感", "新开始", "潜能", "热情"],
    uprightBrief: "天使点燃创造火花", reversedBrief: "创造力需要被重新点燃",
    imageUrl: "icons/wands/tarot-wands-01.png",
    upright: "你的创造天使正在为你点燃新的火花。这是灵感、热情和新开始的时刻。跟随你的兴奋，你的天使正引导你走向你的使命。行动吧，宇宙支持你！",
    reversed: "你的天使提醒你：你的创造力只是暂时休眠，而非消失。重新连接你的喜悦和热情。做让你兴奋的事情，火花会重新点燃。",
    translations: {
      en: {
        upright: "Your creative angel is igniting a new spark for you. This is a time of inspiration, passion and new beginnings. Follow your excitement; your angel guides you to your mission. Act, the universe supports you!",
        reversed: "Your angel reminds you: your creativity is only temporarily dormant, not gone. Reconnect with your joy and passion. Do what excites you, the spark will reignite."
      }
    }
  },
  {
    id: "W2", name: "权杖二", originalName: "Two of Wands", suit: "wands", element: "火",
    keywords: ["远见", "规划", "合作", "扩张", "决定"],
    uprightBrief: "天使支持你的远见", reversedBrief: "需要做出决定",
    imageUrl: "icons/wands/tarot-wands-02.png",
    upright: "你的天使正在支持你的远见和计划。你已经在心中看到了更大的画面。这是与天使合作、将你的愿景变为现实的时候。信任你的直觉，迈出步伐。",
    reversed: "你的天使鼓励你做出决定。你可能在两个选择之间犹豫。倾听你的心，你的天使会引导你到正确的方向。你被支持。",
    translations: {
      en: {
        upright: "Your angel is supporting your vision and plans. You already see the bigger picture in your heart. Co-create with angels to manifest your vision. Trust your intuition, take the step.",
        reversed: "Your angel encourages you to make a decision. You may be hesitating between two choices. Listen to your heart; your angel will guide you to the right direction."
      }
    }
  },
  {
    id: "W3", name: "权杖三", originalName: "Three of Wands", suit: "wands", element: "火",
    keywords: ["扩展", "等待", "合作", "进展", "庆祝"],
    uprightBrief: "天使带来扩展与进展", reversedBrief: "需要更多的耐心",
    imageUrl: "icons/wands/tarot-wands-03.png",
    upright: "你的天使正在为你带来扩展和进展。你的努力开始开花结果。继续保持信心和耐心，你的天使正为你安排最佳的时机和结果。庆祝每一个小胜利。",
    reversed: "你的天使提醒你：进展可能比预期慢，但仍在发生。保持耐心和信心。你的天使正在幕后工作，为你准备更好的事物。",
    translations: {
      en: {
        upright: "Your angel is bringing expansion and progress to you. Your efforts are starting to bear fruit. Keep faith and patience; your angel arranges the best timing and outcomes. Celebrate every small victory.",
        reversed: "Your angel reminds you: progress may be slower than expected, but still happening. Keep patience and faith. Your angel is working behind the scenes, preparing better things for you."
      }
    }
  },
  {
    id: "W4", name: "权杖四", originalName: "Four of Wands", suit: "wands", element: "火",
    keywords: ["庆祝", "和谐", "家庭", "完成", "喜悦"],
    uprightBrief: "天使祝福的庆祝时刻", reversedBrief: "需要建立更稳定的基础",
    imageUrl: "icons/wands/tarot-wands-04.png",
    upright: "你的天使正在祝福你生命中的庆祝时刻。和谐、喜悦和稳定的基础正在建立。与你所爱的人一起庆祝，你的天使正与你同在，享受这个美好的时刻。",
    reversed: "你的天使看到你需要更稳定的基础。可能庆祝被延迟，但不要担心。你的天使正在为你建立更牢固的基础。耐心等待，美好即将到来。",
    translations: {
      en: {
        upright: "Your angel is blessing celebration moments in your life. Harmony, joy and stable foundation are being established. Celebrate with your loved ones; your angel is with you. Enjoy this beautiful moment.",
        reversed: "Your angel sees you need a more stable foundation. Celebrations may be delayed, but don't worry. Your angel is building a stronger foundation for you. Wait patiently, goodness is coming."
      }
    }
  },
  {
    id: "W5", name: "权杖五", originalName: "Five of Wands", suit: "wands", element: "火",
    keywords: ["友好的竞争", "活力", "成长", "观点", "动力"],
    uprightBrief: "天使帮助你在挑战中成长", reversedBrief: "需要避免不必要的冲突",
    imageUrl: "icons/wands/tarot-wands-05.png",
    upright: "你的天使正在帮助你通过友好的挑战和竞争来成长。不同的观点可以带来进步。保持开放的心态，你的天使正将挑战转化为祝福。",
    reversed: "你的天使提醒你：不是所有的战斗都值得参与。避免不必要的冲突，选择你的战场。你的天使正保护你的和平。",
    translations: {
      en: {
        upright: "Your angel is helping you grow through friendly challenges and competition. Different viewpoints bring progress. Keep an open mind; your angel is transforming challenges into blessings.",
        reversed: "Your angel reminds you: not all battles are worth engaging in. Avoid unnecessary conflicts, choose your battles. Your angel protects your peace."
      }
    }
  },
  {
    id: "W6", name: "权杖六", originalName: "Six of Wands", suit: "wands", element: "火",
    keywords: ["胜利", "认可", "成功", "进展", "自信"],
    uprightBrief: "天使庆祝你的胜利", reversedBrief: "需要更多的自我认可",
    imageUrl: "icons/wands/tarot-wands-06.png",
    upright: "你的天使正在庆祝你的胜利！你的努力得到了认可和成功。继续自信地前进，你的天使正为你鼓掌。你是成功的，你是被祝福的。",
    reversed: "你的天使提醒你：即使他人可能没有注意到，你的胜利仍然是真实的。给自己更多的认可。你的天使看到你的努力，继续前进。",
    translations: {
      en: {
        upright: "Your angel is celebrating your victory! Your efforts are recognized and successful. Keep moving forward with confidence; your angel applauds you. You are successful, you are blessed.",
        reversed: "Your angel reminds you: even if others may not notice, your victory is still real. Give yourself more recognition. Your angel sees your efforts, keep going."
      }
    }
  },
  {
    id: "W7", name: "权杖七", originalName: "Seven of Wands", suit: "wands", element: "火",
    keywords: ["坚持", "勇气", "防御", "信念", "韧性"],
    uprightBrief: "天使赋予你坚持的勇气", reversedBrief: "需要评估是否值得坚持",
    imageUrl: "icons/wands/tarot-wands-07.png",
    upright: "你的天使正在赋予你坚持和勇气的力量。你可能感到挑战，但你有能力捍卫你的信念。你的天使正站在你身边，继续前进！",
    reversed: "你的天使邀请你评估：这场战斗是否仍然符合你的最高利益？有时候，放下比坚持更需要勇气。你的天使会引导你。",
    translations: {
      en: {
        upright: "Your angel is granting you the power of perseverance and courage. You may feel challenged, but you have the ability to defend your beliefs. Your angel stands by your side, keep going!",
        reversed: "Your angel invites you to assess: is this battle still aligned with your highest good? Sometimes, letting go takes more courage than persisting. Your angel will guide you."
      }
    }
  },
  {
    id: "W8", name: "权杖八", originalName: "Eight of Wands", suit: "wands", element: "火",
    keywords: ["快速", "进展", "消息", "行动", "同步"],
    uprightBrief: "天使加速你的进展", reversedBrief: "需要耐心等待时机",
    imageUrl: "icons/wands/tarot-wands-08.png",
    upright: "你的天使正在加速你的进展！快速的消息、行动和同步性正在到来。顺应这股能量，你的天使正为你清除道路。这是快速移动的时刻！",
    reversed: "你的天使提醒你：有时候，等待是神圣的。不要急于求成。你的天使正在为你安排完美的时机。耐心等待，一切会在最佳时刻发生。",
    translations: {
      en: {
        upright: "Your angel is accelerating your progress! Swift messages, actions and synchronicities are coming. Flow with this energy; your angel clears your path. This is a time to move quickly!",
        reversed: "Your angel reminds you: sometimes, waiting is divine. Don't rush. Your angel is arranging perfect timing for you. Wait patiently, everything happens at the best moment."
      }
    }
  },
  {
    id: "W9", name: "权杖九", originalName: "Nine of Wands", suit: "wands", element: "火",
    keywords: ["韧性", "治愈", "准备", "边界", "坚持"],
    uprightBrief: "天使治愈并赋予你韧性", reversedBrief: "需要休息和释放",
    imageUrl: "icons/wands/tarot-wands-09.png",
    upright: "你的天使正在治愈你并赋予你韧性。你可能感到疲惫，但你比想象中更强大。设定健康的边界，你的天使正为你注入持续的力量。你几乎到达终点了！",
    reversed: "你的天使邀请你休息和释放。你不需要一直保持警惕。放下一些负担，你的天使会接手。你值得休息和治愈。",
    translations: {
      en: {
        upright: "Your angel is healing you and granting you resilience. You may feel tired, but you're stronger than you think. Set healthy boundaries; your angel infuses you with enduring strength. You're almost at the finish line!",
        reversed: "Your angel invites you to rest and release. You don't need to be on guard all the time. Put down some burdens; your angel will take over. You deserve rest and healing."
      }
    }
  },
  {
    id: "W10", name: "权杖十", originalName: "Ten of Wands", suit: "wands", element: "火",
    keywords: ["释放负担", "委托", "休息", "完成", "轻松"],
    uprightBrief: "天使帮助你释放重担", reversedBrief: "正在学习委托和放下",
    imageUrl: "icons/wands/tarot-wands-10.png",
    upright: "你的天使正在帮助你释放沉重的负担。你不需要独自承担一切。委托给他人，或放下不再服务于你的事物。你的天使正邀请你进入更轻松的存在方式。",
    reversed: "你的天使看到你正在学习放下和委托。这是成长的过程！继续释放，你的天使正帮助你找到更轻松的方式来完成你的使命。",
    translations: {
      en: {
        upright: "Your angel is helping you release heavy burdens. You don't need to carry everything alone. Delegate to others, or release what no longer serves you. Your angel invites you to a lighter way of being.",
        reversed: "Your angel sees you learning to let go and delegate. This is a process of growth! Keep releasing; your angel helps you find easier ways to fulfill your mission."
      }
    }
  },
  // 权杖宫廷牌
  {
    id: "W11", name: "权杖侍从", originalName: "Page of Wands", suit: "wands", element: "火/土",
    keywords: ["灵感", "探索", "消息", "热情", "冒险"],
    uprightBrief: "天使带来灵感的好消息", reversedBrief: "需要重新连接热情",
    imageUrl: "icons/angel-wands-p.png",
    upright: "你的天使正在通过一位充满热情的信使为你带来好消息和灵感。保持开放和好奇，新的冒险正在召唤你。你的天使正鼓励你探索！",
    reversed: "你的天使提醒你：重新连接你的热情和灵感。你可能感到缺乏动力，但火花仍在。做让你兴奋的小事情，热情会回来。",
    translations: {
      en: {
        upright: "Your angel is bringing good news and inspiration through an enthusiastic messenger. Stay open and curious; new adventures are calling you. Your angel encourages you to explore!",
        reversed: "Your angel reminds you: reconnect with your passion and inspiration. You may feel lack of motivation, but the spark is still there. Do small things that excite you, passion will return."
      }
    }
  },
  {
    id: "W12", name: "权杖骑士", originalName: "Knight of Wands", suit: "wands", element: "火/风",
    keywords: ["行动", "冒险", "热情", "自由", "能量"],
    uprightBrief: "天使推动你采取行动", reversedBrief: "需要更有方向地行动",
    imageUrl: "icons/angel-wands-kn.png",
    upright: "你的天使正在推动你采取行动和追求你的热情。这是冒险和自由的能量。跟随你的兴奋，你的天使正为你清除障碍。勇敢地前进！",
    reversed: "你的天使建议你更有方向地行动。你可能在冲动中跳跃，而没有清晰的目标。暂停，与你的天使连接，获得清晰的方向。",
    translations: {
      en: {
        upright: "Your angel is propelling you to take action and pursue your passion. This is energy of adventure and freedom. Follow your excitement; your angel clears obstacles. Move forward bravely!",
        reversed: "Your angel suggests you act with more direction. You may be jumping impulsively without clear goals. Pause, connect with your angel, gain clear direction."
      }
    }
  },
  {
    id: "W13", name: "权杖王后", originalName: "Queen of Wands", suit: "wands", element: "火/水",
    keywords: ["自信", "魅力", "创造力", "热情", "独立"],
    uprightBrief: "天使祝福的自信与魅力", reversedBrief: "需要重新连接自我价值",
    imageUrl: "icons/angel-wands-q.png",
    upright: "你的天使正在祝福你以自信、魅力和创造力。你是独立的、有吸引力的，你的光正在照耀。相信你的创造力，你的天使正通过你表达爱。",
    reversed: "你的天使提醒你：你的价值不取决于他人的认可。重新连接你的内在力量。你是被爱的，你的天使看到你的真实美。",
    translations: {
      en: {
        upright: "Your angel is blessing you with confidence, charm and creativity. You are independent, attractive, your light is shining. Trust your creativity; your angel expresses love through you.",
        reversed: "Your angel reminds you: your worth doesn't depend on others' approval. Reconnect with your inner power. You are loved; your angel sees your true beauty."
      }
    }
  },
  {
    id: "W14", name: "权杖国王", originalName: "King of Wands", suit: "wands", element: "火/火",
    keywords: ["领导力", "远见", "企业家", "自信", "行动"],
    uprightBrief: "天使祝福的领导力", reversedBrief: "需要平衡力量与慈悲",
    imageUrl: "icons/angel-wands-k.png",
    upright: "你的天使正在祝福你以有远见的领导力和企业家精神。你是行动派，能够激励他人。以慈悲和智慧领导，你的天使正支持你的每一个正当行动。",
    reversed: "你的天使邀请你平衡力量与慈悲。真正的领导者服务于他人。重新连接你的心，你的领导方式会变得更加温暖和有效。",
    translations: {
      en: {
        upright: "Your angel is blessing you with visionary leadership and entrepreneurial spirit. You are a person of action who inspires others. Lead with compassion and wisdom; your angel supports every right action.",
        reversed: "Your angel invites you to balance power with compassion. A true leader serves others. Reconnect with your heart; your leadership style becomes warmer and more effective."
      }
    }
  },

  // ---------- 圣杯/水元素 (Cups) ----------
  {
    id: "C1", name: "圣杯王牌", originalName: "Ace of Cups", suit: "cups", element: "水",
    keywords: ["爱的礼物", "情感", "直觉", "滋养", "慈悲"],
    uprightBrief: "天使赠予爱的礼物",
    reversedBrief: "需要打开心扉接收爱",
    imageUrl: "icons/cups/tarot-cups-01.png",
    upright: "你的天使正在赠予你爱的礼物！这是情感治愈、新关系和深层滋养的时刻。打开你的心，接收来自宇宙和你的天使的爱。你是被深深爱的。",
    reversed: "你的天使温柔地鼓励你打开你的心。你可能一直在保护自己，但现在是时候接收爱了。你的天使正等待用爱填满你的杯。",
    translations: {
      en: {
        upright: "Your angel is gifting you with love! This is a time of emotional healing, new relationships and deep nourishment. Open your heart, receive love from the universe and your angels. You are deeply loved.",
        reversed: "Your angel gently encourages you to open your heart. You may have been protecting yourself, but it's time to receive love. Your angel awaits to fill your cup with love."
      }
    }
  },
  {
    id: "C2", name: "圣杯二", originalName: "Two of Cups", suit: "cups", element: "水",
    keywords: ["伙伴关系", "相互的爱", "和谐", "吸引", "结合"],
    uprightBrief: "天使祝福的伙伴关系",
    reversedBrief: "需要恢复关系的平衡",
    imageUrl: "icons/cups/tarot-cups-02.png",
    upright: "你的天使正在祝福一段和谐、相互滋养的伙伴关系。这可能是爱情、友谊或业务合作。爱在流动，你的天使正为你带来或加强美好的关系。",
    reversed: "你的天使邀请你恢复关系中的平衡。可能给予和接收不平衡。以爱和诚实沟通，你的天使会帮助你修复和恢复和谐。",
    translations: {
      en: {
        upright: "Your angel is blessing a harmonious, mutually nourishing partnership. This could be romantic love, friendship or business cooperation. Love is flowing; your angel brings or strengthens wonderful relationships.",
        reversed: "Your angel invites you to restore balance in relationships. Giving and receiving may be imbalanced. Communicate with love and honesty; your angel helps you repair and restore harmony."
      }
    }
  },
  {
    id: "C3", name: "圣杯三", originalName: "Three of Cups", suit: "cups", element: "水",
    keywords: ["友谊", "庆祝", "社群", "欢乐", "支持"],
    uprightBrief: "天使祝福的友谊与庆祝",
    reversedBrief: "需要更健康的社交",
    imageUrl: "icons/cups/tarot-cups-03.png",
    upright: "你的天使正在祝福你与朋友和社群的欢乐庆祝。这是与你所爱的人相聚、分享喜悦的时刻。你的天使正将支持你、提升你的人带入你的生命。",
    reversed: "你的天使提醒你：审视你的社交圈。是否有些人不再服务于你的最高利益？以爱设定边界，你的天使会为你带来更健康的友谊。",
    translations: {
      en: {
        upright: "Your angel is blessing joyful celebrations with friends and community. This is a time to gather with loved ones, share joy. Your angel brings people who support and uplift you into your life.",
        reversed: "Your angel reminds you: examine your social circle. Are there people who no longer serve your highest good? Set boundaries with love; your angel will bring healthier friendships."
      }
    }
  },
  {
    id: "C4", name: "圣杯四", originalName: "Four of Cups", suit: "cups", element: "水",
    keywords: ["重新开始", "感恩", "觉知", "选择", "平静"],
    uprightBrief: "天使邀请你重新评估",
    reversedBrief: "正在接受新的机会",
    imageUrl: "icons/cups/tarot-cups-04.png",
    upright: "你的天使邀请你重新评估和重新连接对你的祝福的感恩。你可能忽视了正在被提供的东西。抬头看，你的天使正为你呈现新的可能性。",
    reversed: "你的天使庆祝你正在从冷漠中走出来，接受新的机会。你的心正在重新打开，你的天使正为你带来令人兴奋的新情感体验。",
    translations: {
      en: {
        upright: "Your angel invites you to re-evaluate and reconnect with gratitude for your blessings. You may be overlooking what's being offered. Look up; your angel is presenting new possibilities for you.",
        reversed: "Your angel celebrates your walking out of apathy and accepting new opportunities. Your heart is re-opening; your angel brings exciting new emotional experiences."
      }
    }
  },
  {
    id: "C5", name: "圣杯五", originalName: "Five of Cups", suit: "cups", element: "水",
    keywords: ["治愈", "希望", "释放悲伤", "宽恕", "向前看"],
    uprightBrief: "天使帮助你治愈悲伤",
    reversedBrief: "正在从悲伤中恢复",
    imageUrl: "icons/cups/tarot-cups-05.png",
    upright: "你的天使正在帮助你治愈情感的失落和悲伤。允许自己感受，然后让天使的爱带走你的痛苦。不要忘记，仍然有完整的杯子在你身边。希望仍在。",
    reversed: "你的天使庆祝你正在从悲伤中恢复。你正在找到希望和向前看的力量。你的天使正牵着你的手，带你走向更光明的日子。",
    translations: {
      en: {
        upright: "Your angel is helping you heal from emotional loss and grief. Allow yourself to feel, then let angelic love take away your pain. Don't forget, there are still full cups by your side. Hope remains.",
        reversed: "Your angel celebrates your recovery from grief. You're finding the strength to hope and look forward. Your angel holds your hand, leading you to brighter days."
      }
    }
  },
  {
    id: "C6", name: "圣杯六", originalName: "Six of Cups", suit: "cups", element: "水",
    keywords: ["怀旧", "善良", "纯真", "礼物", "治愈内在小孩"],
    uprightBrief: "天使治愈你的内在小孩",
    reversedBrief: "需要释放过去的模式",
    imageUrl: "icons/cups/tarot-cups-06.png",
    upright: "你的天使正在通过怀旧和善良的举动治愈你的内在小孩。这是分享爱和礼物的美好时刻。你的天使正帮助你释放过去的伤口，重新连接纯真。",
    reversed: "你的天使鼓励你释放不再服务于你的过去的模式。你可能在怀旧中停滞。你的天使正帮助你以爱放下过去，拥抱更自由的未来。",
    translations: {
      en: {
        upright: "Your angel is healing your inner child through nostalgia and acts of kindness. This is a beautiful time to share love and gifts. Your angel helps you release past wounds, reconnect with innocence.",
        reversed: "Your angel encourages you to release past patterns that no longer serve you. You may be stuck in nostalgia. Your angel helps you let go of the past with love, embrace a freer future."
      }
    }
  },
  {
    id: "C7", name: "圣杯七", originalName: "Seven of Cups", suit: "cups", element: "水",
    keywords: ["清晰的梦想", "选择", "直觉", "幻想", "专注"],
    uprightBrief: "天使帮助你澄清梦想",
    reversedBrief: "正在将梦想变为现实",
    imageUrl: "icons/cups/tarot-cups-07.png",
    upright: "你的天使正在帮助你澄清你的梦想和选择。不是所有的选项都是平等的。与你的天使连接，获得清晰。选择那些与你的灵魂共鸣的道路。",
    reversed: "你的天使庆祝你正在将你的梦想变为现实！你已经从幻想中走出来，采取了实际行动。你的天使正支持你将愿景落地。",
    translations: {
      en: {
        upright: "Your angel is helping you clarify your dreams and choices. Not all options are equal. Connect with your angel, gain clarity. Choose the paths that resonate with your soul.",
        reversed: "Your angel celebrates your turning dreams into reality! You've walked out of fantasy into practical action. Your angel supports you in grounding your vision."
      }
    }
  },
  {
    id: "C8", name: "圣杯八", originalName: "Eight of Cups", suit: "cups", element: "水",
    keywords: ["寻求更多", "勇气", "内在指引", "成长", "信任"],
    uprightBrief: "天使支持你寻求更多",
    reversedBrief: "需要更多的时间反思",
    imageUrl: "icons/cups/tarot-cups-08.png",
    upright: "你的天使正在支持你寻求更深的意义和满足。你有勇气离开舒适但不再成长的情况。信任你的内在指引，你的天使正引领你到更真实的地方。",
    reversed: "你的天使提醒你：在离开之前，可能需要更多的时间来反思和整合。不要急于行动。你的天使正帮助你获得清晰。",
    translations: {
      en: {
        upright: "Your angel is supporting your search for deeper meaning and fulfillment. You have the courage to leave comfortable but no-longer-growing situations. Trust your inner guidance; your angel leads you to truer places.",
        reversed: "Your angel reminds you: before leaving, more time for reflection and integration may be needed. Don't rush to act. Your angel helps you gain clarity."
      }
    }
  },
  {
    id: "C9", name: "圣杯九", originalName: "Nine of Cups", suit: "cups", element: "水",
    keywords: ["愿望成真", "满足", "感恩", "庆祝", "丰盛"],
    uprightBrief: "天使实现你的愿望",
    reversedBrief: "需要更深的满足感",
    imageUrl: "icons/cups/tarot-cups-09.png",
    upright: "你的天使正在实现你的愿望！这是满足、感恩和庆祝的时刻。你的心正在被填满，你的天使正祝福你以情感上的丰盛。享受这份美好！",
    reversed: "你的天使提醒你：真正的满足来自内在。你可能在外在寻求充实，但你的天使正邀请你连接内在的丰盛。你已经被爱充满了。",
    translations: {
      en: {
        upright: "Your angel is fulfilling your wishes! This is a time of satisfaction, gratitude and celebration. Your heart is being filled; your angel blesses you with emotional abundance. Enjoy this goodness!",
        reversed: "Your angel reminds you: true satisfaction comes from within. You may be seeking fulfillment outwardly, but your angel invites you to connect with inner abundance. You are already filled with love."
      }
    }
  },
  {
    id: "C10", name: "圣杯十", originalName: "Ten of Cups", suit: "cups", element: "水",
    keywords: ["家庭的幸福", "圆满", "和谐", "祝福", "情感完成"],
    uprightBrief: "天使祝福家庭的幸福",
    reversedBrief: "需要修复家庭关系",
    imageUrl: "icons/cups/tarot-cups-10.png",
    upright: "你的天使正在祝福你和你的家庭的幸福与和谐。这是情感圆满和家庭支持的时刻。你的天使正将爱与和平充满你的家。珍惜这些美好的连接。",
    reversed: "你的天使看到家庭关系可能需要修复。以爱和宽恕来接近你的家人。你的天使正帮助你治愈家庭纽带，恢复和谐。",
    translations: {
      en: {
        upright: "Your angel is blessing happiness and harmony for you and your family. This is a time of emotional fulfillment and family support. Your angel fills your home with love and peace. Cherish these beautiful connections.",
        reversed: "Your angel sees family relationships may need repair. Approach your family with love and forgiveness. Your angel helps you heal family bonds, restore harmony."
      }
    }
  },
  // 圣杯宫廷牌
  {
    id: "C11", name: "圣杯侍从", originalName: "Page of Cups", suit: "cups", element: "水/土",
    keywords: ["直觉的消息", "敏感", "创意", "温柔", "开放"],
    uprightBrief: "天使带来直觉的消息",
    reversedBrief: "需要更多的情感边界",
    imageUrl: "icons/angel-cups-p.png",
    upright: "你的天使正在通过一位敏感和富有创意的信使为你带来直觉的消息。保持开放和接收，你的情感正在被唤醒。你的天使正鼓励你表达你的感受。",
    reversed: "你的天使提醒你：设定健康的情感边界。你可能过于敏感或容易受到影响。保护你的能量，你的天使正帮助你区分什么是你的，什么不是。",
    translations: {
      en: {
        upright: "Your angel is bringing intuitive messages through a sensitive and creative messenger. Stay open and receptive; your emotions are awakening. Your angel encourages you to express your feelings.",
        reversed: "Your angel reminds you: set healthy emotional boundaries. You may be overly sensitive or impressionable. Protect your energy; your angel helps you distinguish what's yours and what's not."
      }
    }
  },
  {
    id: "C12", name: "圣杯骑士", originalName: "Knight of Cups", suit: "cups", element: "水/风",
    keywords: ["浪漫", "追求", "灵感", "温柔", "梦想家"],
    uprightBrief: "天使带来浪漫的追求",
    reversedBrief: "需要更实际的行动",
    imageUrl: "icons/angel-cups-kn.png",
    upright: "你的天使正在通过一位浪漫的追求者或创意项目为你带来灵感和情感。跟随你的心，你的天使正支持你表达爱和美丽。这是浪漫和创意的时刻！",
    reversed: "你的天使提醒你：将你的梦想和浪漫想法变为实际行动。你可能在幻想中，而没有落地。你的天使正帮助你以更实际的方式表达你的心。",
    translations: {
      en: {
        upright: "Your angel is bringing inspiration and emotion through a romantic pursuer or creative project. Follow your heart; your angel supports you in expressing love and beauty. This is a time for romance and creativity!",
        reversed: "Your angel reminds you: turn your dreams and romantic ideas into actual action. You may be in fantasies without grounding. Your angel helps you express your heart more practically."
      }
    }
  },
  {
    id: "C13", name: "圣杯王后", originalName: "Queen of Cups", suit: "cups", element: "水/水",
    keywords: ["深度的直觉", "慈悲", "情感智慧", "治愈", "同理心"],
    uprightBrief: "天使祝福的情感智慧",
    reversedBrief: "需要保护自己的能量",
    imageUrl: "icons/angel-cups-q.png",
    upright: "你的天使正在祝福你以深度的直觉、慈悲和情感智慧。你是情感的容器，能够深深同理他人。你的天使正通过你表达无条件的爱。信任你的直觉。",
    reversed: "你的天使提醒你：在照顾他人之前，先照顾好自己。你可能吸收了太多的情感。保护你的能量，你的天使正帮助你清理和重新平衡。",
    translations: {
      en: {
        upright: "Your angel is blessing you with deep intuition, compassion and emotional wisdom. You are a vessel of emotion, able to deeply empathize. Your angel expresses unconditional love through you. Trust your intuition.",
        reversed: "Your angel reminds you: before caring for others, care for yourself first. You may be absorbing too much emotion. Protect your energy; your angel helps you cleanse and rebalance."
      }
    }
  },
  {
    id: "C14", name: "圣杯国王", originalName: "King of Cups", suit: "cups", element: "水/火",
    keywords: ["情感成熟", "智慧", "慈悲的领导", "平衡", "稳定"],
    uprightBrief: "天使祝福的情感成熟的领导者",
    reversedBrief: "需要更健康的情感表达",
    imageUrl: "icons/angel-cups-k.png",
    upright: "你的天使正在祝福你以情感的成熟和智慧。你是慈悲的领导者，能够平衡情感和理性。你的天使正支持你以爱和智慧来引导和治愈他人。",
    reversed: "你的天使鼓励你以更健康的方式表达你的情感。你可能压抑或过度表达。你的天使正帮助你找到情感的平衡和健康表达。",
    translations: {
      en: {
        upright: "Your angel is blessing you with emotional maturity and wisdom. You are a compassionate leader, able to balance emotion and reason. Your angel supports you in guiding and healing others with love and wisdom.",
        reversed: "Your angel encourages you to express your emotions in healthier ways. You may be suppressing or over-expressing. Your angel helps you find emotional balance and healthy expression."
      }
    }
  },

  // ---------- 宝剑/风元素 (Swords) ----------
  {
    id: "S1", name: "宝剑王牌", originalName: "Ace of Swords", suit: "swords", element: "风",
    keywords: ["清晰的真理", "突破", "真相", "智慧", "新生"],
    uprightBrief: "天使带来清晰的真理",
    reversedBrief: "需要更清晰的思维",
    imageUrl: "icons/swords/tarot-swords-01.png",
    upright: "你的天使正在带来清晰的真理和突破！这是以全新的、清晰的方式看待情况的时刻。真相正在显现，你的天使正赋予你以智慧和诚实沟通的力量。",
    reversed: "你的天使提醒你：在行动之前，需要更清晰的思维。你可能感到困惑，但你的天使正帮助你清理思维的迷雾。耐心等待清晰。",
    translations: {
      en: {
        upright: "Your angel is bringing clear truth and breakthrough! This is a time to see situations in a new, clear way. Truth is revealing itself; your angel grants you the power to communicate with wisdom and honesty.",
        reversed: "Your angel reminds you: clearer thinking is needed before acting. You may feel confused, but your angel helps you clear the fog of mind. Wait patiently for clarity."
      }
    }
  },
  {
    id: "S2", name: "宝剑二", originalName: "Two of Swords", suit: "swords", element: "风",
    keywords: ["和平的决定", "信任", "平衡", "直觉", "暂停"],
    uprightBrief: "天使帮助你做出和平的决定",
    reversedBrief: "需要面对被回避的真相",
    imageUrl: "icons/swords/tarot-swords-02.png",
    upright: "你的天使正在帮助你做出困难但必要的决定。在做出选择之前，先找到内在的和平。你的天使正为你照亮两条道路，信任你的直觉。",
    reversed: "你的天使鼓励你面对你一直在回避的真相。做出决定可能不舒服，但是必要的。你的天使会支持你，无论你选择什么。",
    translations: {
      en: {
        upright: "Your angel is helping you make difficult but necessary decisions. Before choosing, find inner peace. Your angel illuminates both paths for you; trust your intuition.",
        reversed: "Your angel encourages you to face the truth you've been avoiding. Making a decision may be uncomfortable but necessary. Your angel supports you, whatever you choose."
      }
    }
  },
  {
    id: "S3", name: "宝剑三", originalName: "Three of Swords", suit: "swords", element: "风",
    keywords: ["治愈的眼泪", "释放", "宽恕", "成长", "希望"],
    uprightBrief: "天使的眼泪带来治愈",
    reversedBrief: "正在从心碎中恢复",
    imageUrl: "icons/swords/tarot-swords-03.png",
    upright: "你的天使正在以最温柔的方式陪伴你度过情感的痛苦。这些眼泪正在清洗旧伤口，为新的爱腾出空间。你并不孤单，你的天使正抱着你。",
    reversed: "你的天使庆祝你正在从心碎中恢复。治愈正在发生，你的心正在重新打开。你的天使正为你带来新的希望和爱的机会。",
    translations: {
      en: {
        upright: "Your angel is accompanying you through emotional pain in the gentlest way. These tears are washing old wounds, making room for new love. You are not alone; your angel holds you.",
        reversed: "Your angel celebrates your recovery from heartbreak. Healing is happening, your heart is re-opening. Your angel brings new hope and opportunities for love."
      }
    }
  },
  {
    id: "S4", name: "宝剑四", originalName: "Four of Swords", suit: "swords", element: "风",
    keywords: ["神圣的休息", "治愈", "宁静", "反思", "恢复"],
    uprightBrief: "天使邀请你休息和治愈",
    reversedBrief: "需要慢慢地重新参与",
    imageUrl: "icons/swords/tarot-swords-04.png",
    upright: "你的天使正在邀请你进入神圣的休息和治愈。你的身体、心灵和精神需要充电。在沉默中与你的天使连接，你会以更大的清晰度回来。",
    reversed: "你的天使看到你准备好慢慢地重新参与生活了。以温和的方式回来，你的天使正支持你的每一步。你恢复了，准备好继续前进。",
    translations: {
      en: {
        upright: "Your angel is inviting you into sacred rest and healing. Your body, mind and spirit need recharging. Connect with your angel in silence; you'll return with greater clarity.",
        reversed: "Your angel sees you're ready to slowly re-engage with life. Come back in gentle ways; your angel supports every step. You're refreshed, ready to move forward."
      }
    }
  },
  {
    id: "S5", name: "宝剑五", originalName: "Five of Swords", suit: "swords", element: "风",
    keywords: ["和平的解决", "宽恕", "释怀", "更高的视角", "爱"],
    uprightBrief: "天使帮助你找到和平的解决",
    reversedBrief: "正在释放对冲突的需要",
    imageUrl: "icons/swords/tarot-swords-05.png",
    upright: "你的天使正在帮助你找到和平解决冲突的方式。不是所有的战斗都值得。以爱和宽恕来应对，你的天使正将你从不必要的戏剧中解放出来。",
    reversed: "你的天使庆祝你正在释放对冲突的需要。你正在选择和平而不是正确。你的天使正祝福你以成熟和优雅处理困难的情况。",
    translations: {
      en: {
        upright: "Your angel is helping you find peaceful resolution to conflicts. Not all battles are worth it. Respond with love and forgiveness; your angel liberates you from unnecessary drama.",
        reversed: "Your angel celebrates your releasing the need for conflict. You're choosing peace over being right. Your angel blesses you with maturity and grace in handling difficult situations."
      }
    }
  },
  {
    id: "S6", name: "宝剑六", originalName: "Six of Swords", suit: "swords", element: "风",
    keywords: ["温和的过渡", "治愈之旅", "希望", "支持", "向前"],
    uprightBrief: "天使支持你的温和过渡",
    reversedBrief: "需要释放对过去的执着",
    imageUrl: "icons/swords/tarot-swords-06.png",
    upright: "你的天使正在支持你从困难中过渡到更平静的水域。这可能具有挑战性，但你的天使正牵着你的手。你正在前往更好的地方，不要回头。",
    reversed: "你的天使邀请你释放对过去的执着。你可能在过渡中挣扎，但你的天使正提醒你：更好的事物正在前方。信任旅程。",
    translations: {
      en: {
        upright: "Your angel is supporting your transition from difficulty to calmer waters. This may be challenging, but your angel holds your hand. You're heading to a better place, don't look back.",
        reversed: "Your angel invites you to release attachment to the past. You may be struggling in transition, but your angel reminds you: better things are ahead. Trust the journey."
      }
    }
  },
  {
    id: "S7", name: "宝剑七", originalName: "Seven of Swords", suit: "swords", element: "风",
    keywords: ["诚实", "策略", "光明", "正直", "勇气"],
    uprightBrief: "天使鼓励你以诚实应对",
    reversedBrief: "正在走向更多的诚实",
    imageUrl: "icons/swords/tarot-swords-07.png",
    upright: "你的天使鼓励你以完全的诚实和正直来应对情况。如果有任何不诚实，现在是澄清的时候。你的天使正支持你走在光中，以勇气和诚实面对一切。",
    reversed: "你的天使庆祝你正在走向更多的诚实和正直。你正在释放不诚实的策略。你的天使正祝福你以勇气和真理生活。",
    translations: {
      en: {
        upright: "Your angel encourages you to respond with complete honesty and integrity. If there's any dishonesty, now is the time to clarify. Your angel supports you walking in light, facing everything with courage and honesty.",
        reversed: "Your angel celebrates your moving toward more honesty and integrity. You're releasing dishonest strategies. Your angel blesses you to live with courage and truth."
      }
    }
  },
  {
    id: "S8", name: "宝剑八", originalName: "Eight of Swords", suit: "swords", element: "风",
    keywords: ["自由", "释放恐惧", "新视角", "力量", "希望"],
    uprightBrief: "天使帮助你看到你是自由的",
    reversedBrief: "正在从限制中解放",
    imageUrl: "icons/swords/tarot-swords-08.png",
    upright: "你的天使正在帮助你看到：你身上的束缚其实是你可以松开的。你是自由的！释放基于恐惧的限制性信念，你的天使正为你打开监狱的门。",
    reversed: "你的天使庆祝你正在从自我施加的限制中解放出来。你正在看到新的视角和可能性。你的天使正为你打开新的自由和希望之门。",
    translations: {
      en: {
        upright: "Your angel is helping you see: the bonds on you are ones you can loosen. You are free! Release fear-based limiting beliefs; your angel opens the prison doors for you.",
        reversed: "Your angel celebrates your liberation from self-imposed limitations. You're seeing new perspectives and possibilities. Your angel opens new doors of freedom and hope for you."
      }
    }
  },
  {
    id: "S9", name: "宝剑九", originalName: "Nine of Swords", suit: "swords", element: "风",
    keywords: ["平安", "释放焦虑", "天使的安慰", "希望", "治愈"],
    uprightBrief: "天使安慰你的焦虑",
    reversedBrief: "正在从担忧中恢复",
    imageUrl: "icons/swords/tarot-swords-09.png",
    upright: "你的天使正在用和平和安慰包围你。你一直在担忧，但你的天使正提醒你：你被保护、被爱、被照顾。将你的焦虑交给你的天使，接收平安。",
    reversed: "你的天使庆祝你正在从焦虑和过度担忧中恢复。你的心正在找到和平。你的天使正持续为你带来安慰和希望。",
    translations: {
      en: {
        upright: "Your angel is surrounding you with peace and comfort. You've been worrying, but your angel reminds you: you are protected, loved, cared for. Give your anxieties to your angel, receive peace.",
        reversed: "Your angel celebrates your recovery from anxiety and excessive worry. Your heart is finding peace. Your angel continuously brings you comfort and hope."
      }
    }
  },
  {
    id: "S10", name: "宝剑十", originalName: "Ten of Swords", suit: "swords", element: "风",
    keywords: ["新的黎明", "重生", "希望", "释放", "光"],
    uprightBrief: "天使带来新的黎明",
    reversedBrief: "正在从最黑暗中恢复",
    imageUrl: "icons/swords/tarot-swords-10.png",
    upright: "你的天使正在为你带来新的黎明！最黑暗的时刻已经过去，光明正在回来。这是结束和新的开始。你的天使正将你从痛苦中举起，带入新的希望。",
    reversed: "你的天使庆祝你正在从最困难的处境中恢复。你正在看到希望和光明。你的天使正牵着你的手，带你走向更光明的日子。",
    translations: {
      en: {
        upright: "Your angel is bringing a new dawn for you! The darkest moment has passed, light is returning. This is an ending and a new beginning. Your angel lifts you from pain into new hope.",
        reversed: "Your angel celebrates your recovery from the most difficult situation. You're beginning to see hope and light. Your angel holds your hand, leads you to brighter days."
      }
    }
  },
  // 宝剑宫廷牌
  {
    id: "S11", name: "宝剑侍从", originalName: "Page of Swords", suit: "swords", element: "风/土",
    keywords: ["真相的探索者", "好奇心", "诚实", "沟通", "警觉"],
    uprightBrief: "天使带来真相的消息",
    reversedBrief: "需要更谨慎的沟通",
    imageUrl: "icons/angel-swords-p.png",
    upright: "你的天使正在通过一位好奇和诚实的信使为你带来真相的消息。保持警觉和开放，你的天使正鼓励你寻求真相并以诚实沟通。",
    reversed: "你的天使提醒你：在沟通中要更加谨慎和善良。你的话语有力量，使用它们来治愈而不是伤害。你的天使正帮助你以更多的智慧和慈悲说话。",
    translations: {
      en: {
        upright: "Your angel is bringing messages of truth through a curious and honest messenger. Stay alert and open; your angel encourages you to seek truth and communicate honestly.",
        reversed: "Your angel reminds you: be more careful and kind in communication. Your words have power; use them to heal, not hurt. Your angel helps you speak with more wisdom and compassion."
      }
    }
  },
  {
    id: "S12", name: "宝剑骑士", originalName: "Knight of Swords", suit: "swords", element: "风/火",
    keywords: ["清晰的行动", "真理", "速度", "直接", "勇气"],
    uprightBrief: "天使推动你以真理行动",
    reversedBrief: "需要更有耐心的沟通",
    imageUrl: "icons/angel-swords-kn.png",
    upright: "你的天使正在推动你以清晰的真理和勇气采取行动。跟随你的真理，但要以慈悲为伴。你的天使正支持你以诚实和直接沟通。",
    reversed: "你的天使建议你放慢速度，在行动和沟通中更有耐心。你可能在冲动中说话或行动。你的天使正帮助你以更多的智慧和考虑来行动。",
    translations: {
      en: {
        upright: "Your angel is propelling you to take action with clear truth and courage. Follow your truth, but with compassion as companion. Your angel supports you in honest and direct communication.",
        reversed: "Your angel suggests you slow down, have more patience in action and communication. You may speak or act impulsively. Your angel helps you act with more wisdom and consideration."
      }
    }
  },
  {
    id: "S13", name: "宝剑王后", originalName: "Queen of Swords", suit: "swords", element: "风/水",
    keywords: ["清晰的智慧", "诚实", "独立", "慈悲的真理", "界限"],
    uprightBrief: "天使祝福的清晰与智慧",
    reversedBrief: "需要以更多的慈悲沟通",
    imageUrl: "icons/angel-swords-q.png",
    upright: "你的天使正在祝福你以清晰的思维、智慧和独立的判断。你能够以慈悲和诚实设定健康的界限。你的天使正支持你以真理和优雅说话。",
    reversed: "你的天使提醒你：在表达真理时，以更多的慈悲和温暖。你的话语可以是真实的，同时也是善良的。你的天使正帮助你平衡真理与爱心。",
    translations: {
      en: {
        upright: "Your angel is blessing you with clear thinking, wisdom and independent judgment. You can set healthy boundaries with compassion and honesty. Your angel supports you in speaking truth with grace.",
        reversed: "Your angel reminds you: when expressing truth, do so with more compassion and warmth. Your words can be true and also kind. Your angel helps you balance truth with heart."
      }
    }
  },
  {
    id: "S14", name: "宝剑国王", originalName: "King of Swords", suit: "swords", element: "风/风",
    keywords: ["公正的权威", "真理", "清晰的思维", "智慧", "正直"],
    uprightBrief: "天使祝福的公正与智慧",
    reversedBrief: "需要更平衡的公正",
    imageUrl: "icons/angel-swords-k.png",
    upright: "你的天使正在祝福你以公正的权威、清晰的思维和智慧的判断。你能够以正直和公平领导。你的天使正支持你以真理和正义使用你的智力。",
    reversed: "你的天使鼓励你以更平衡和慈悲的方式行使权威。真正的公正包含理解和服务。你的天使正帮助你平衡理性与情感智慧。",
    translations: {
      en: {
        upright: "Your angel is blessing you with just authority, clear thinking and wise judgment. You can lead with integrity and fairness. Your angel supports you in using your intellect with truth and justice.",
        reversed: "Your angel encourages you to exercise authority in more balanced and compassionate ways. True justice includes understanding and service. Your angel helps you balance reason with emotional wisdom."
      }
    }
  },

  // ---------- 星币/土元素 (Pentacles) ----------
  {
    id: "P1", name: "星币王牌", originalName: "Ace of Pentacles", suit: "pentacles", element: "土",
    keywords: ["物质的祝福", "机会", "丰盛", "新开始", "显化"],
    uprightBrief: "天使带来物质的祝福",
    reversedBrief: "需要为机会做好准备",
    imageUrl: "icons/angel-pents-01.png",
    upright: "你的天使正在为你带来物质的祝福和新机会！这是新工作、财务增长或实用项目开始的时刻。保持开放接收，你的天使正将丰盛流入你的生活。",
    reversed: "你的天使提醒你：为机会做好准备。你可能在错失财务机会，但你的天使正鼓励你采取实际步骤来改善你的物质状况。行动吧！",
    translations: {
      en: {
        upright: "Your angel is bringing material blessings and new opportunities for you! This is a time for new job, financial growth or starting practical projects. Stay open to receive; your angel flows abundance into your life.",
        reversed: "Your angel reminds you: prepare for opportunities. You may be missing financial opportunities, but your angel encourages you to take practical steps to improve your material situation. Act!"
      }
    }
  },
  {
    id: "P2", name: "星币二", originalName: "Two of Pentacles", suit: "pentacles", element: "土",
    keywords: ["平衡", "适应", "快乐", "优先", "流动"],
    uprightBrief: "天使帮助你找到平衡",
    reversedBrief: "需要重新优先排序",
    imageUrl: "icons/angel-pents-02.png",
    upright: "你的天使正在帮助你平衡多个责任，同时保持快乐和轻松。你正在学会适应变化，以优雅应对。你的天使正提醒你：你可以在享受的同时完成很多。",
    reversed: "你的天使邀请你重新评估你的优先事项。你可能在试图做太多事情，而感到不堪重负。放下一些东西，你的天使正帮助你找到更可持续的节奏。",
    translations: {
      en: {
        upright: "Your angel is helping you balance multiple responsibilities while maintaining joy and lightness. You're learning to adapt to changes, cope with grace. Your angel reminds you: you can accomplish much while enjoying.",
        reversed: "Your angel invites you to re-evaluate your priorities. You may be trying to do too much and feeling overwhelmed. Put down some things; your angel helps you find a more sustainable pace."
      }
    }
  },
  {
    id: "P3", name: "星币三", originalName: "Three of Pentacles", suit: "pentacles", element: "土",
    keywords: ["合作的丰盛", "技能", "认可", "团队", "质量"],
    uprightBrief: "天使祝福的合作与技能",
    reversedBrief: "需要更好的团队合作",
    imageUrl: "icons/angel-pents-03.png",
    upright: "你的天使正在祝福你与他人的合作和技能的精致体现。你的努力得到了认可和赞赏。你的天使正为你带来能够提升你工作的合作伙伴。",
    reversed: "你的天使鼓励你改善团队合作的动态。可能有人不和谐，但你的天使正帮助你以爱和清晰沟通来修复工作关系。",
    translations: {
      en: {
        upright: "Your angel is blessing your collaboration with others and refined expression of skills. Your efforts are recognized and appreciated. Your angel brings partners who can elevate your work.",
        reversed: "Your angel encourages you to improve team dynamics. There may be disharmony, but your angel helps you repair work relationships with love and clear communication."
      }
    }
  },
  {
    id: "P4", name: "星币四", originalName: "Four of Pentacles", suit: "pentacles", element: "土",
    keywords: ["稳定的丰盛", "安全感", "智慧的管理", "信任", "分享"],
    uprightBrief: "天使祝福的稳定与安全",
    reversedBrief: "需要更多的流动与分享",
    imageUrl: "icons/angel-pents-04.png",
    upright: "你的天使正在祝福你以物质的稳定和安全的感觉。你正在智慧地管理你的资源。你的天使正提醒你：当你分享时，更多的丰盛会流向你。",
    reversed: "你的天使邀请你释放对物质的安全感的过度执着。真正的保障来自信任宇宙，而不是紧紧抓住。你的天使正帮助你打开手，允许更多的流动。",
    translations: {
      en: {
        upright: "Your angel is blessing you with material stability and sense of security. You're managing your resources wisely. Your angel reminds you: when you share, more abundance flows to you.",
        reversed: "Your angel invites you to release excessive attachment to material security. True security comes from trusting the universe, not clinging tightly. Your angel helps you open your hands, allow more flow."
      }
    }
  },
  {
    id: "P5", name: "星币五", originalName: "Five of Pentacles", suit: "pentacles", element: "土",
    keywords: ["天使的提供", "希望", "支持", "信念", "丰盛仍在"],
    uprightBrief: "天使在困难中提供希望",
    reversedBrief: "正在从困难中恢复",
    imageUrl: "icons/angel-pents-05.png",
    upright: "你的天使正在困难中为你提供希望和支持。你可能在经历财务或物质的挑战，但你的天使正提醒你：你永远不会被遗弃。帮助就在附近，请求支持。",
    reversed: "你的天使庆祝你正在从财务困难中恢复。你的状况正在改善，你的天使正为你打开新的资源和机会之门。继续相信，美好正在到来。",
    translations: {
      en: {
        upright: "Your angel is providing hope and support for you amid difficulties. You may be experiencing financial or material challenges, but your angel reminds you: you are never abandoned. Help is near, ask for support.",
        reversed: "Your angel celebrates your recovery from financial difficulties. Your situation is improving; your angel opens doors to new resources and opportunities. Keep believing, goodness is coming."
      }
    }
  },
  {
    id: "P6", name: "星币六", originalName: "Six of Pentacles", suit: "pentacles", element: "土",
    keywords: ["慈悲的给予", "接收", "平衡", "感恩", "丰盛的循环"],
    uprightBrief: "天使祝福的给予与接收",
    reversedBrief: "需要平衡的给予和接收",
    imageUrl: "icons/angel-pents-06.png",
    upright: "你的天使正在祝福你以慈悲的给予和感恩的接收。丰盛正在你生活中流动，你既是渠道也是接收者。你的天使正提醒你：给予和接收都是神圣的。",
    reversed: "你的天使邀请你平衡给予和接收。你可能只给予而不接收，或只接收而不给予。你的天使正帮助你参与丰盛的完整循环。",
    translations: {
      en: {
        upright: "Your angel is blessing you with compassionate giving and grateful receiving. Abundance is flowing in your life; you are both channel and receiver. Your angel reminds you: both giving and receiving are divine.",
        reversed: "Your angel invites you to balance giving and receiving. You may only give without receiving, or only receive without giving. Your angel helps you participate in the full cycle of abundance."
      }
    }
  },
  {
    id: "P7", name: "星币七", originalName: "Seven of Pentacles", suit: "pentacles", element: "土",
    keywords: ["耐心的丰收", "信任", "投资", "成长", "感恩"],
    uprightBrief: "天使祝福耐心的成长",
    reversedBrief: "需要重新评估投资",
    imageUrl: "icons/angel-pents-07.png",
    upright: "你的天使正在祝福你的耐心和对你努力的成果的信任。收获需要时间，但你的天使正提醒你：你的投资正在增长。继续滋养你的项目，感恩过程。",
    reversed: "你的天使鼓励你重新评估你的投资和努力。可能某些事情没有如预期那样增长。你的天使正帮助你做出调整或释放不再服务于你的事物。",
    translations: {
      en: {
        upright: "Your angel is blessing your patience and trust in the fruits of your efforts. Harvest takes time, but your angel reminds you: your investments are growing. Continue nourishing your projects, be grateful for the process.",
        reversed: "Your angel encourages you to re-evaluate your investments and efforts. Something may not be growing as expected. Your angel helps you make adjustments or release what no longer serves you."
      }
    }
  },
  {
    id: "P8", name: "星币八", originalName: "Eight of Pentacles", suit: "pentacles", element: "土",
    keywords: ["专注的工艺", "技能提升", "奉献", "质量", "进步"],
    uprightBrief: "天使祝福专注的工艺",
    reversedBrief: "需要更多的激情和专注",
    imageUrl: "icons/angel-pents-08.png",
    upright: "你的天使正在祝福你以专注的努力和技能的精进。你致力于 mastering 你的工艺，你的天使正支持你以奉献和快乐达到卓越。你的努力正在变成大师级的作品。",
    reversed: "你的天使提醒你：重新连接对你工作的激情和专注。你可能感到无聊或没有动力，但你的天使正帮助你找到你工作的更深意义。",
    translations: {
      en: {
        upright: "Your angel is blessing you with dedicated effort and refinement of skills. You're committed to mastering your craft; your angel supports you in reaching excellence with devotion and joy. Your efforts are becoming masterwork.",
        reversed: "Your angel reminds you: reconnect with passion and focus for your work. You may feel bored or unmotivated, but your angel helps you find deeper meaning in your work."
      }
    }
  },
  {
    id: "P9", name: "星币九", originalName: "Nine of Pentacles", suit: "pentacles", element: "土",
    keywords: ["独立的丰盛", "优雅", "享受", "感恩", "自我价值"],
    uprightBrief: "天使祝福独立的丰盛",
    reversedBrief: "需要认识到自己的价值",
    imageUrl: "icons/angel-pents-09.png",
    upright: "你的天使正在祝福你以独立的丰盛和优雅的生活。你已经通过努力和智慧创造了美好的生活。你的天使正邀请你享受你的成果，知道你是值得的。",
    reversed: "你的天使鼓励你认识到你的真实价值。你可能在外部寻找认可，但你的天使正提醒你：你的价值不取决于外在的成就。你是内在丰盛的。",
    translations: {
      en: {
        upright: "Your angel is blessing you with independent abundance and elegant living. You've created a beautiful life through effort and wisdom. Your angel invites you to enjoy your fruits, knowing you are worthy.",
        reversed: "Your angel encourages you to recognize your true worth. You may be seeking approval outwardly, but your angel reminds you: your worth doesn't depend on external achievements. You are inwardly abundant."
      }
    }
  },
  {
    id: "P10", name: "星币十", originalName: "Ten of Pentacles", suit: "pentacles", element: "土",
    keywords: ["家族的祝福", "传承", "长期的丰盛", "和谐", "根基"],
    uprightBrief: "天使祝福家族的长期丰盛",
    reversedBrief: "需要修复家庭关系",
    imageUrl: "icons/angel-pents-10.png",
    upright: "你的天使正在祝福你和你的家族的长期丰盛和和谐。这是享受家庭纽带、传承智慧和建立持久基础的时刻。你的天使正将代际的祝福流入你的生活。",
    reversed: "你的天使看到家庭关系或财务稳定性可能需要关注。以爱和宽恕来接近你的家人，你的天使正帮助你修复和治愈家庭纽带。",
    translations: {
      en: {
        upright: "Your angel is blessing long-term abundance and harmony for you and your family. This is a time to enjoy family bonds, pass on wisdom and build lasting foundation. Your angel flows generational blessings into your life.",
        reversed: "Your angel sees family relationships or financial stability may need attention. Approach your family with love and forgiveness; your angel helps you repair and heal family bonds."
      }
    }
  },
  // 星币宫廷牌
  {
    id: "P11", name: "星币侍从", originalName: "Page of Pentacles", suit: "pentacles", element: "土/土",
    keywords: ["实用的消息", "新机会", "学习", "稳重", "潜力"],
    uprightBrief: "天使带来实用的新机会",
    reversedBrief: "需要更多的专注和纪律",
    imageUrl: "icons/angel-pents-p.png",
    upright: "你的天使正在通过一位可靠和务实的信使为你带来实用的新机会。保持开放接收，你的天使正鼓励你以纪律和专注追求你的目标。新种子正在发芽！",
    reversed: "你的天使提醒你：需要更多的专注和纪律来实现你的目标。你可能分散注意力，但你的天使正帮助你重新集中和承诺于你的梦想。",
    translations: {
      en: {
        upright: "Your angel is bringing practical new opportunities through a reliable and down-to-earth messenger. Stay open to receive; your angel encourages you to pursue your goals with discipline and focus. New seeds are sprouting!",
        reversed: "Your angel reminds you: more focus and discipline are needed to achieve your goals. You may be distracted, but your angel helps you re-center and commit to your dreams."
      }
    }
  },
  {
    id: "P12", name: "星币骑士", originalName: "Knight of Pentacles", suit: "pentacles", element: "土/风",
    keywords: ["可靠的进展", "耐心", "勤奋", "稳定", "实用"],
    uprightBrief: "天使祝福可靠的进展",
    reversedBrief: "需要避免拖延或过度工作",
    imageUrl: "icons/angel-pents-kn.png",
    upright: "你的天使正在祝福你以可靠的进展和勤奋的努力。你正在以耐心和实用建立你的基础。你的天使正提醒你：缓慢而稳定地赢得比赛。继续前进！",
    reversed: "你的天使鼓励你避免拖延或过度工作。你可能在进展中过于谨慎，或工作到精疲力尽。你的天使正帮助你找到工作与休息的健康平衡。",
    translations: {
      en: {
        upright: "Your angel is blessing you with reliable progress and diligent effort. You're building your foundation with patience and practicality. Your angel reminds you: slow and steady wins the race. Keep going!",
        reversed: "Your angel encourages you to avoid procrastination or overworking. You may be overly cautious in progress, or working to exhaustion. Your angel helps you find healthy work-rest balance."
      }
    }
  },
  {
    id: "P13", name: "星币王后", originalName: "Queen of Pentacles", suit: "pentacles", element: "土/水",
    keywords: ["滋养的实用", "丰盛", "接地", "照顾", "独立"],
    uprightBrief: "天使祝福滋养的丰盛",
    reversedBrief: "需要更多的自我照顾",
    imageUrl: "icons/angel-pents-q.png",
    upright: "你的天使正在祝福你以实用的滋养和物质的丰盛。你是出色的照顾者，能够创造舒适和安全的家。你的天使正提醒你：在照顾他人之前，先照顾好自己。",
    reversed: "你的天使邀请你优先考虑自我照顾。你可能过度专注于照顾他人而忽视自己。你的天使正帮助你建立健康的界限和更多的自我滋养。",
    translations: {
      en: {
        upright: "Your angel is blessing you with practical nurturing and material abundance. You're an excellent caregiver, able to create comfortable and safe home. Your angel reminds you: before caring for others, care for yourself first.",
        reversed: "Your angel invites you to prioritize self-care. You may be over-focused on caring for others while neglecting yourself. Your angel helps you establish healthy boundaries and more self-nurturing."
      }
    }
  },
  {
    id: "P14", name: "星币国王", originalName: "King of Pentacles", suit: "pentacles", element: "土/风",
    keywords: ["丰盛的领导者", "成功", "实用", "稳定", "提供商"],
    uprightBrief: "天使祝福物质的成功",
    reversedBrief: "需要更平衡的物质焦点",
    imageUrl: "icons/angel-pents-k.png",
    upright: "你的天使正在祝福你以物质的成功和可靠的领导。你是丰盛的提供商，能够建立持久的物质基础。你的天使正支持你以智慧、实用和慷慨管理你的资源。",
    reversed: "你的天使鼓励你以更平衡的方式看待物质成功。真正的丰盛包含分享和精神价值。你的天使正帮助你将物质成功与更高的目的对齐。",
    translations: {
      en: {
        upright: "Your angel is blessing you with material success and reliable leadership. You're an abundant provider, able to build lasting material foundation. Your angel supports you in managing resources with wisdom, practicality and generosity.",
        reversed: "Your angel encourages you to view material success in a more balanced way. True abundance includes sharing and spiritual values. Your angel helps you align material success with higher purpose."
      }
    }
  }
];
