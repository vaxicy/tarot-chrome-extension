const fs = require('fs');

// 为马赛塔罗每张牌定义第5个关键词
const fifthKeywords = {
  // 大阿卡纳 Major Arcana (0-21)
  0: "无限可能",
  1: "意志力",
  2: "静心",
  3: "富足",
  4: "控制",
  5: "价值观",
  6: "结合",
  7: "行动力",
  8: "自信",
  9: "谨慎",
  10: "轮回",
  11: "平衡",
  12: "臣服",
  13: "蜕变",
  14: "融合",
  15: "诱惑",
  16: "觉醒",
  17: "灵感",
  18: "不确定",
  19: "活力",
  20: "救赎",
  21: "整合",
  
  // 小阿卡纳 - 权杖 Wands (W1-W14)
  "W1": "潜力",
  "W2": "决策",
  "W3": "进展",
  "W4": "稳定",
  "W5": "成长",
  "W6": "自信",
  "W7": "挑战",
  "W8": "迅速",
  "W9": "警惕",
  "W10": "负担",
  "W11": "探索",
  "W12": "速度",
  "W13": "独立",
  "W14": "企业家",
  
  // 小阿卡纳 - 圣杯 Cups (C1-C14)
  "C1": "直觉",
  "C2": "吸引",
  "C3": "欢乐",
  "C4": "觉醒",
  "C5": "原谅",
  "C6": "分享",
  "C7": "欲望",
  "C8": "勇气",
  "C9": "愉悦",
  "C10": "长久",
  "C11": "敏感",
  "C12": "魅力",
  "C13": "理解",
  "C14": "智慧",
  
  // 小阿卡纳 - 宝剑 Swords (S1-S14)
  "S1": "突破",
  "S2": "平衡",
  "S3": "宽恕",
  "S4": "平静",
  "S5": "和解",
  "S6": "旅程",
  "S7": "策略",
  "S8": "恐惧",
  "S9": "恢复",
  "S10": "释放",
  "S11": "警觉",
  "S12": "果断",
  "S13": "诚实",
  "S14": "权威",
  
  // 小阿卡纳 - 星币 Pentacles (P1-P14)
  "P1": "实际",
  "P2": "多任务",
  "P3": "协作",
  "P4": "安全感",
  "P5": "孤立",
  "P6": "接受",
  "P7": "投资",
  "P8": "专注",
  "P9": "自足",
  "P10": "传承",
  "P11": "踏实",
  "P12": "坚持",
  "P13": "平衡",
  "P14": "富有"
};

// 读取文件
const filePath = 'marseille-cards.js';
let content = fs.readFileSync(filePath, 'utf8');

// 对每个牌添加第5个关键词
for (const [id, keyword] of Object.entries(fifthKeywords)) {
  // 匹配 keywords: ["...", "...", "...", "..."] 模式
  const idPattern = new RegExp(`id:\\s*${isNaN(id) ? `"${id}"` : id}`);
  const match = content.match(idPattern);
  
  if (match) {
    const index = match.index;
    // 找到从匹配位置开始的关键词数组
    const afterId = content.substring(index);
    const keywordsMatch = afterId.match(/keywords:\s*\[([^\]]+)\]/);
    
    if (keywordsMatch) {
      const currentKeywords = keywordsMatch[1].trim();
      const newKeywords = currentKeywords + `, "${keyword}"`;
      
      // 替换关键词数组
      const fullMatch = keywordsMatch[0];
      const newFullMatch = fullMatch.replace(currentKeywords, newKeywords);
      
      // 只替换第一个匹配项（当前牌）
      content = content.substring(0, index) + afterId.replace(fullMatch, newFullMatch) + content.substring(index + afterId.length);
    }
  }
}

// 写回文件
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ 成功为所有78张牌添加了第5个关键词！');

// 验证结果
const verifyContent = fs.readFileSync(filePath, 'utf8');
const keywordPattern = /keywords:\s*\[([^\]]+)\]/g;
let allFive = true;
let count = 0;
for (const match of verifyContent.matchAll(keywordPattern)) {
  const keywords = match[1].match(/"[^"]+"/g) || [];
  if (keywords.length !== 5) {
    console.log(`❌ 牌${count}只有${keywords.length}个关键词: ${match[1]}`);
    allFive = false;
  }
  count++;
}
if (allFive) {
  console.log(`✅ 验证通过：所有${count}张牌都是5个关键词！`);
}
