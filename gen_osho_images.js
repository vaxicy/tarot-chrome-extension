// gen_osho_images.js - 生成奥修禅卡所有79张占位图片
// 运行: node gen_osho_images.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, 'icons', 'osho');
const WIDTH = 300;
const HEIGHT = 500;

// 花色配色方案
const suitColors = {
  major: { bg1: '#1a0a2e', bg2: '#2d1b4e', accent: '#ffd700', label: '大阿卡纳' },
  water: { bg1: '#0a1a3e', bg2: '#0d2b5e', accent: '#4fc3f7', label: '水' },
  fire:  { bg1: '#2e0a0a', bg2: '#5e1b1b', accent: '#ff7043', label: '火' },
  clouds:{ bg1: '#1a1a2e', bg2: '#2e2e4e', accent: '#b0bec5', label: '云' },
  rainbow:{ bg1: '#1a0a1a', bg2: '#2e1b3e', accent: '#ff69b4', label: '彩虹' }
};

// 读取卡牌数据
function loadCards() {
  const code = fs.readFileSync(path.join(__dirname, 'osho-zen-cards.js'), 'utf8');
  const fn = new Function(code + '; return oshoZenCards;');
  return fn();
}

// 生成单张卡牌图片
async function generateCardImage(card) {
  const suit = card.suit;
  const colors = suitColors[suit];
  const fileName = path.basename(card.imageUrl);
  const dir = path.dirname(card.imageUrl).replace('icons/', '');
  const outputPath = path.join(__dirname, 'icons', dir, fileName);

  // 确保目录存在
  const outDir = path.dirname(outputPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 提取数字（用于显示）
  const numMatch = fileName.match(/-(\d+)\.png$/);
  const displayNum = numMatch ? numMatch[1] : '';

  // 根据花色选择装饰图案
  let decoration = '';
  if (suit === 'major') {
    decoration = `
      <!-- 大阿卡纳：星形/曼陀罗装饰 -->
      <g transform="translate(${WIDTH/2}, 100)" opacity="0.15">
        <circle cx="0" cy="0" r="60" fill="none" stroke="${colors.accent}" stroke-width="1"/>
        <circle cx="0" cy="0" r="45" fill="none" stroke="${colors.accent}" stroke-width="1"/>
        <circle cx="0" cy="0" r="30" fill="none" stroke="${colors.accent}" stroke-width="1"/>
        ${Array.from({length: 8}, (_, i) => {
          const angle = (i * 45) * Math.PI / 180;
          const x = Math.cos(angle) * 60;
          const y = Math.sin(angle) * 60;
          return `<line x1="0" y1="0" x2="${x}" y2="${y}" stroke="${colors.accent}" stroke-width="1"/>`;
        }).join('\n')}
      </g>
    `;
  } else if (suit === 'water') {
    decoration = `
      <!-- 水：波浪装饰 -->
      <g opacity="0.12">
        ${Array.from({length: 5}, (_, i) => {
          const y = 80 + i * 35;
          return `<path d="M 20,${y} Q ${WIDTH/2},${y-15} ${WIDTH-20},${y}" fill="none" stroke="${colors.accent}" stroke-width="2"/>`;
        }).join('\n')}
      </g>
    `;
  } else if (suit === 'fire') {
    decoration = `
      <!-- 火：火焰装饰 -->
      <g transform="translate(${WIDTH/2}, 100)" opacity="0.12">
        ${Array.from({length: 5}, (_, i) => {
          const x = (i - 2) * 30;
          return `<path d="M ${x},40 Q ${x-10},0 ${x},-20 Q ${x+10},0 ${x},40" fill="${colors.accent}"/>`;
        }).join('\n')}
      </g>
    `;
  } else if (suit === 'clouds') {
    decoration = `
      <!-- 云：云朵装饰 -->
      <g opacity="0.12">
        <ellipse cx="80" cy="100" rx="40" ry="25" fill="${colors.accent}"/>
        <ellipse cx="120" cy="90" rx="35" ry="22" fill="${colors.accent}"/>
        <ellipse cx="${WIDTH-80}" cy="${HEIGHT-100}" rx="45" ry="28" fill="${colors.accent}"/>
        <ellipse cx="${WIDTH-120}" cy="${HEIGHT-90}" rx="38" ry="24" fill="${colors.accent}"/>
      </g>
    `;
  } else if (suit === 'rainbow') {
    decoration = `
      <!-- 彩虹：弧形装饰 -->
      <g opacity="0.12">
        ${['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'].map((c, i) => {
          const r = 100 - i * 8;
          return `<path d="M ${WIDTH/2 - r},${HEIGHT/2 + 80} A ${r},${r} 0 0,1 ${WIDTH/2 + r},${HEIGHT/2 + 80}" fill="none" stroke="${c}" stroke-width="6"/>`;
        }).join('\n')}
      </g>
    `;
  }

  // 构建SVG
  const svg = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.bg1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.bg2};stop-opacity:1" />
        </linearGradient>
        <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.accent};stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:${colors.accent};stop-opacity:0.05" />
        </linearGradient>
      </defs>

      <!-- 背景 -->
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" rx="12"/>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#accent)" rx="12"/>

      <!-- 装饰边框 -->
      <rect x="12" y="12" width="${WIDTH-24}" height="${HEIGHT-24}" fill="none" stroke="${colors.accent}" stroke-width="1.5" rx="8" opacity="0.4"/>
      <rect x="20" y="20" width="${WIDTH-40}" height="${HEIGHT-40}" fill="none" stroke="${colors.accent}" stroke-width="0.8" rx="6" opacity="0.25"/>

      ${decoration}

      <!-- 顶部：花色标签 -->
      <text x="${WIDTH/2}" y="45"
            font-family="'Microsoft YaHei', 'PingFang SC', sans-serif"
            font-size="14" font-weight="500"
            fill="${colors.accent}" text-anchor="middle" opacity="0.7">
        ${colors.label}${suit !== 'major' ? ' ' + displayNum : ''}
      </text>

      <!-- 中心：卡牌中文名 -->
      <text x="${WIDTH/2}" y="${HEIGHT/2 - 20}"
            font-family="'Microsoft YaHei', 'PingFang SC', sans-serif"
            font-size="32" font-weight="bold"
            fill="${colors.accent}" text-anchor="middle" opacity="0.9">
        ${card.name}
      </text>

      <!-- 中心下方：英文名 -->
      <text x="${WIDTH/2}" y="${HEIGHT/2 + 20}"
            font-family="Georgia, serif"
            font-size="14" font-style="italic"
            fill="${colors.accent}" text-anchor="middle" opacity="0.5">
        ${card.originalName || ''}
      </text>

      <!-- 底部：编号 -->
      <text x="${WIDTH/2}" y="${HEIGHT - 35}"
            font-family="Georgia, serif"
            font-size="16"
            fill="${colors.accent}" text-anchor="middle" opacity="0.4">
        No. ${card.id}
      </text>

      <!-- 四角装饰点 -->
      <g opacity="0.3">
        <circle cx="25" cy="25" r="2.5" fill="${colors.accent}"/>
        <circle cx="${WIDTH-25}" cy="25" r="2.5" fill="${colors.accent}"/>
        <circle cx="25" cy="${HEIGHT-25}" r="2.5" fill="${colors.accent}"/>
        <circle cx="${WIDTH-25}" cy="${HEIGHT-25}" r="2.5" fill="${colors.accent}"/>
      </g>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);

  return outputPath;
}

// 主函数
async function main() {
  try {
    console.log('读取奥修禅卡数据...');
    const cards = loadCards();
    console.log(`共 ${cards.length} 张牌\n`);

    console.log('开始生成占位图片...');
    let count = 0;
    for (const card of cards) {
      const outPath = await generateCardImage(card);
      count++;
      process.stdout.write(`\r进度: ${count}/${cards.length} - ${card.name}`);
    }

    console.log(`\n\n✅ 全部生成完成！共 ${count} 张图片`);
    console.log('输出目录:', BASE_DIR);

  } catch (error) {
    console.error('\n❌ 生成失败:', error);
    process.exit(1);
  }
}

main();
