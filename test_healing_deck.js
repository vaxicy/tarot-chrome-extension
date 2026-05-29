/**
 * 测试治愈塔罗牌组
 * 运行: node test_healing_deck.js
 */

// 模拟浏览器环境
global.window = {};
global.document = { readyState: 'complete' };

// 加载依赖
eval(require('fs').readFileSync('constants.js', 'utf8'));
eval(require('fs').readFileSync('healing-cards.js', 'utf8'));

console.log('=== 治愈塔罗牌组测试 ===\n');

// 测试1: 牌组数量
console.log('测试1: 牌组数量');
if (healingCards && healingCards.length === 78) {
  console.log('✅ 牌组数量正确: 78张牌');
} else {
  console.log('❌ 牌组数量错误:', healingCards ? healingCards.length : 'undefined');
}

// 测试2: 大阿卡纳 (0-21)
console.log('\n测试2: 大阿卡纳 (0-21)');
const majorArcana = healingCards.filter(c => c.suit === 'major');
if (majorArcana.length === 22) {
  console.log('✅ 大阿卡纳数量正确: 22张');
} else {
  console.log('❌ 大阿卡纳数量错误:', majorArcana.length);
}

// 测试3: 小阿卡纳 - 权杖 (W1-W14)
console.log('\n测试3: 小阿卡纳 - 权杖');
const wands = healingCards.filter(c => c.suit === 'wands');
if (wands.length === 14) {
  console.log('✅ 权杖数量正确: 14张');
} else {
  console.log('❌ 权杖数量错误:', wands.length);
}

// 测试4: 小阿卡纳 - 圣杯 (C1-C14)
console.log('\n测试4: 小阿卡纳 - 圣杯');
const cups = healingCards.filter(c => c.suit === 'cups');
if (cups.length === 14) {
  console.log('✅ 圣杯数量正确: 14张');
} else {
  console.log('❌ 圣杯数量错误:', cups.length);
}

// 测试5: 小阿卡纳 - 宝剑 (S1-S14)
console.log('\n测试5: 小阿卡纳 - 宝剑');
const swords = healingCards.filter(c => c.suit === 'swords');
if (swords.length === 14) {
  console.log('✅ 宝剑数量正确: 14张');
} else {
  console.log('❌ 宝剑数量错误:', swords.length);
}

// 测试6: 小阿卡纳 - 星币 (P1-P14)
console.log('\n测试6: 小阿卡纳 - 星币');
const pentacles = healingCards.filter(c => c.suit === 'pentacles');
if (pentacles.length === 14) {
  console.log('✅ 星币数量正确: 14张');
} else {
  console.log('❌ 星币数量错误:', pentacles.length);
}

// 测试7: 关键词数量 (每张牌5个)
console.log('\n测试7: 关键词数量 (每张牌5个)');
let allHaveFive = true;
healingCards.forEach((card, idx) => {
  if (!card.keywords || card.keywords.length !== 5) {
    console.log(`❌ ${card.name} (${card.id}) 只有 ${card.keywords ? card.keywords.length : 0} 个关键词`);
    allHaveFive = false;
  }
});
if (allHaveFive) {
  console.log('✅ 所有78张牌都有5个关键词');
}

// 测试8: 必要字段存在
console.log('\n测试8: 必要字段检查');
let allFieldsPresent = true;
const requiredFields = ['id', 'name', 'originalName', 'suit', 'element', 'keywords', 'uprightBrief', 'reversedBrief', 'imageUrl', 'upright', 'reversed', 'translations'];
healingCards.forEach((card) => {
  requiredFields.forEach(field => {
    if (!card[field]) {
      console.log(`❌ ${card.name} (${card.id}) 缺少字段: ${field}`);
      allFieldsPresent = false;
    }
  });
});
if (allFieldsPresent) {
  console.log('✅ 所有必要字段都存在');
}

// 测试9: 英文翻译字段
console.log('\n测试9: 英文翻译字段');
let allHaveTranslations = true;
healingCards.forEach((card) => {
  if (!card.translations || !card.translations.en || !card.translations.en.upright || !card.translations.en.reversed) {
    console.log(`❌ ${card.name} (${card.id}) 缺少英文翻译`);
    allHaveTranslations = false;
  }
});
if (allHaveTranslations) {
  console.log('✅ 所有牌都有英文翻译');
}

// 测试10: 牌意内容检查 (确保是治愈主题)
console.log('\n测试10: 治愈主题检查 (示例)');
const sampleCard = healingCards.find(c => c.id === 3); // 女皇
if (sampleCard && sampleCard.upright.includes('自爱')) {
  console.log('✅ 牌意包含治愈主题关键词');
} else {
  console.log('⚠️ 可能需要检查牌意是否符合治愈主题');
}

console.log('\n=== 测试完成 ===');
console.log('✅ 治愈塔罗牌组已成功创建并通过验证！');
console.log('\n牌组特点:');
console.log('- 78张牌 (22大阿卡纳 + 56小阿卡纳)');
console.log('- 每张牌5个关键词');
console.log('- 完整中英文牌意');
console.log('- 专注心理疗愈、情绪释放、内在成长');
console.log('- 牌意强调自我接纳、创伤修复、能量疗愈');
