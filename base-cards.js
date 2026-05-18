/**
 * base-cards.js - 塔罗牌基础数据结构
 * 包含所有牌的公共字段（id, name, originalName, suit, element, keywords）
 * 各主题牌组只需在此基础上添加自己的释义字段
 */

// 大阿卡纳基础数据（22张）
const baseMajorArcana = [
  { id: 0,  name: "愚者",   originalName: "The Fool",      suit: "major", element: "风", keywords: ["新的开始", "冒险", "自由", "天真"] },
  { id: 1,  name: "魔术师", originalName: "The Magician",   suit: "major", element: "风", keywords: ["创造力", "技能", "行动力", "意志力"] },
  { id: 2,  name: "女祭司", originalName: "The High Priestess", suit: "major", element: "水", keywords: ["直觉", "潜意识", "神秘", "内在智慧"] },
  { id: 3,  name: "女皇",   originalName: "The Empress",    suit: "major", element: "土", keywords: ["丰饶", "创造力", "养育", "感官"] },
  { id: 4,  name: "皇帝",   originalName: "The Emperor",    suit: "major", element: "火", keywords: ["权威", "稳定", "领导力", "结构"] },
  { id: 5,  name: "教皇",   originalName: "The Hierophant",  suit: "major", element: "土", keywords: ["传统", "信仰", "指引", "规则"] },
  { id: 6,  name: "恋人",   originalName: "The Lovers",     suit: "major", element: "风", keywords: ["选择", "爱情", "和谐", "价值观"] },
  { id: 7,  name: "战车",   originalName: "The Chariot",    suit: "major", element: "水", keywords: ["意志", "胜利", "决心", "控制"] },
  { id: 8,  name: "力量",   originalName: "Strength",       suit: "major", element: "火", keywords: ["勇气", "耐心", "内在力量", "温柔"] },
  { id: 9,  name: "隐士",   originalName: "The Hermit",     suit: "major", element: "土", keywords: ["内省", "智慧", "独处", "寻求真理"] },
  { id: 10, name: "命运之轮", originalName: "Wheel of Fortune", suit: "major", element: "火", keywords: ["命运", "转变", "机遇", "周期"] },
  { id: 11, name: "正义",   originalName: "Justice",        suit: "major", element: "风", keywords: ["公正", "真理", "因果", "平衡"] },
  { id: 12, name: "倒吊人", originalName: "The Hanged Man",  suit: "major", element: "水", keywords: ["牺牲", "等待", "换个角度", "放手"] },
  { id: 13, name: "死神",   originalName: "Death",           suit: "major", element: "水", keywords: ["结束", "转化", "重生", "释放"] },
  { id: 14, name: "节制",   originalName: "Temperance",     suit: "major", element: "火", keywords: ["平衡", "耐心", "适度", "调和"] },
  { id: 15, name: "恶魔",   originalName: "The Devil",       suit: "major", element: "土", keywords: ["束缚", "物质欲望", "阴影", "觉醒"] },
  { id: 16, name: "塔",     originalName: "The Tower",       suit: "major", element: "火", keywords: ["突变", "崩塌", "觉醒", "重建"] },
  { id: 17, name: "星星",   originalName: "The Star",        suit: "major", element: "风", keywords: ["希望", "灵感", "治愈", "信仰"] },
  { id: 18, name: "月亮",   originalName: "The Moon",        suit: "major", element: "水", keywords: ["幻觉", "恐惧", "潜意识", "不确定"] },
  { id: 19, name: "太阳",   originalName: "The Sun",         suit: "major", element: "火", keywords: ["喜悦", "成功", "活力", "光明"] },
  { id: 20, name: "审判",   originalName: "Judgement",      suit: "major", element: "火", keywords: ["觉醒", "重生", "使命", "反思"] },
  { id: 21, name: "世界",   originalName: "The World",       suit: "major", element: "土", keywords: ["完成", "圆满", "成就", "旅行"] }
];

// 小阿卡纳基础数据生成函数（根据花色自动分配元素）
function getBaseMinorArcana() {
  var suits = [
    { key: 'wands',     name: '权杖', element: '火', color: '红' },
    { key: 'cups',      name: '圣杯', element: '水', color: '蓝' },
    { key: 'swords',    name: '宝剑', element: '风', color: '黄' },
    { key: 'pentacles', name: '星币', element: '土', color: '绿' }
  ];

  var result = [];
  suits.forEach(function(suit) {
    var prefix = suit.key.charAt(0).toUpperCase();
    // 王牌
    result.push({
      id: prefix + '1',
      name: suit.name + '王牌',
      originalName: '', // 由各牌组填充
      suit: suit.key,
      element: suit.element,
      keywords: [] // 由各牌组填充
    });
    // 2-10
    for (var i = 2; i <= 10; i++) {
      result.push({
        id: prefix + i,
        name: suit.name + i,
        originalName: '',
        suit: suit.key,
        element: suit.element,
        keywords: []
      });
    }
    // 侍从、骑士、王后、国王
    var court = ['侍从', '骑士', '王后', '国王'];
    var courtKeys = ['11', '12', '13', '14'];
    court.forEach(function(title, idx) {
      result.push({
        id: prefix + courtKeys[idx],
        name: suit.name + title,
        originalName: '',
        suit: suit.key,
        element: suit.element,
        keywords: []
      });
    });
  });
  return result;
}

// 英文原名模板（小阿卡纳）
var minorOriginalNames = {
  '1':  'Ace',   '2': 'Two',   '3': 'Three', '4': 'Four',
  '5':  'Five',   '6': 'Six',   '7': 'Seven', '8': 'Eight',
  '9':  'Nine',  '10': 'Ten',
  '11': 'Page',   '12': 'Knight', '13': 'Queen', '14': 'King'
};

var suitOriginalNames = {
  wands:     'of Wands',
  cups:      'of Cups',
  swords:    'of Swords',
  pentacles: 'of Pentacles'
};

function buildMinorOriginalName(number, suitKey) {
  return minorOriginalNames[number] + ' ' + suitOriginalNames[suitKey];
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { baseMajorArcana, getBaseMinorArcana, buildMinorOriginalName };
}
