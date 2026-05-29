const fs = require('fs');

function analyzeKeywords(filename) {
  const content = fs.readFileSync(filename, 'utf8');
  const keywordPattern = /keywords:\s*\[([^\]]+)\]/g;
  const matches = [...content.matchAll(keywordPattern)];
  
  console.log(`\n=== ${filename} ===`);
  
  const counts = {};
  const details = [];
  
  matches.forEach((match, i) => {
    const keywordStr = match[1];
    const keywords = keywordStr.match(/"[^"]+"/g) || [];
    const count = keywords.length;
    counts[count] = (counts[count] || 0) + 1;
    details.push({ index: i, count, keywords: keywords.map(k => k.replace(/"/g, '')) });
  });
  
  console.log('关键词数量分布:');
  Object.keys(counts).sort().forEach(k => {
    console.log(`  ${k}个关键词: ${counts[k]}张牌`);
  });
  
  // 找出不是5个关键词的牌
  const notFive = details.filter(d => d.count !== 5);
  if (notFive.length > 0) {
    console.log('\n需要补充到5个关键词的牌:');
    notFive.forEach(d => {
      console.log(`  牌${d.index}: 当前${d.count}个 [${d.keywords.join(', ')}]`);
    });
  } else {
    console.log('\n✅ 所有牌都是5个关键词！');
  }
}

analyzeKeywords('rider-waite-cards.js');
analyzeKeywords('marseille-cards.js');
analyzeKeywords('thoth-cards.js');
analyzeKeywords('angel-cards.js');
