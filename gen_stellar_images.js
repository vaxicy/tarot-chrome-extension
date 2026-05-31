// gen_stellar_images.js - 生成星辰塔罗所有78张牌面图片
// 运行: node gen_stellar_images.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const WIDTH = 300;
const HEIGHT = 500;

// 花色主题配色
const suitThemes = {
  major: {
    bg1: '#060614', bg2: '#1a0d2e', bg3: '#0f0820',
    accent: '#ffd700', accent2: '#ffaa00', glow: 'rgba(255,215,0,0.2)',
    label: '大阿卡纳', element: '宇宙'
  },
  wands: {
    bg1: '#140505', bg2: '#2e0f14', bg3: '#1a080a',
    accent: '#ff7043', accent2: '#ffab91', glow: 'rgba(255,112,67,0.2)',
    label: '权杖', element: '火'
  },
  cups: {
    bg1: '#050a14', bg2: '#0d1f3d', bg3: '#081228',
    accent: '#4fc3f7', accent2: '#81d4fa', glow: 'rgba(79,195,247,0.2)',
    label: '圣杯', element: '水'
  },
  swords: {
    bg1: '#0a0a14', bg2: '#1a1a2e', bg3: '#0f0f1f',
    accent: '#cfd8dc', accent2: '#eceff1', glow: 'rgba(207,216,220,0.15)',
    label: '宝剑', element: '风'
  },
  pentacles: {
    bg1: '#050f05', bg2: '#0f1f0f', bg3: '#0a140a',
    accent: '#81c784', accent2: '#a5d6a7', glow: 'rgba(129,199,132,0.2)',
    label: '钱币', element: '土'
  }
};

// 基于种子的伪随机数生成器 (Mulberry32)
function mulberry32(a) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 将字符串id转为数字种子
function hashId(id) {
  const str = String(id);
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

// 读取卡牌数据
function loadCards() {
  const code = fs.readFileSync(path.join(__dirname, 'stellar-cards.js'), 'utf8');
  const fn = new Function(code + '; return stellarCards;');
  return fn();
}

// 生成背景星星
function generateStars(rand, count, width, height, theme) {
  let stars = '';
  for (let i = 0; i < count; i++) {
    const x = rand() * width;
    const y = rand() * height;
    const r = 0.5 + rand() * 1.5;
    const opacity = 0.2 + rand() * 0.8;
    const isBright = rand() > 0.85;
    const color = isBright ? theme.accent : '#ffffff';
    const glowR = isBright ? r * 3 : r * 1.5;
    const glowOp = isBright ? 0.3 : 0.1;
    // 发光层
    stars += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${glowR.toFixed(1)}" fill="${color}" opacity="${glowOp}"/>`;
    // 星核
    stars += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}" opacity="${opacity.toFixed(2)}"/>`;
  }
  return stars;
}

// 生成中央星座图案
function generateConstellation(rand, cx, cy, theme) {
  const starCount = 6 + Math.floor(rand() * 5); // 6-10颗星
  const points = [];
  const maxR = 70;
  const minR = 25;

  for (let i = 0; i < starCount; i++) {
    const angle = (i / starCount) * Math.PI * 2 + rand() * 0.5;
    const r = minR + rand() * (maxR - minR);
    const px = cx + Math.cos(angle) * r + (rand() - 0.5) * 20;
    const py = cy + Math.sin(angle) * r * 0.7 + (rand() - 0.5) * 20;
    points.push({ x: px, y: py, size: 1.5 + rand() * 2.5 });
  }

  // 按距离最近连接成线
  const lines = [];
  const visited = new Set();
  visited.add(0);
  while (visited.size < points.length) {
    let bestDist = Infinity;
    let bestPair = null;
    for (const i of visited) {
      for (let j = 0; j < points.length; j++) {
        if (visited.has(j)) continue;
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = dx * dx + dy * dy;
        if (dist < bestDist) {
          bestDist = dist;
          bestPair = [i, j];
        }
      }
    }
    if (bestPair) {
      lines.push(bestPair);
      visited.add(bestPair[1]);
    } else break;
  }

  // 额外添加1-2条跨线增加美感
  const extraLines = 1 + Math.floor(rand() * 2);
  for (let e = 0; e < extraLines; e++) {
    const a = Math.floor(rand() * points.length);
    const b = Math.floor(rand() * points.length);
    if (a !== b) lines.push([a, b]);
  }

  let svg = '';
  // 连线
  for (const [a, b] of lines) {
    svg += `<line x1="${points[a].x.toFixed(1)}" y1="${points[a].y.toFixed(1)}" x2="${points[b].x.toFixed(1)}" y2="${points[b].y.toFixed(1)}" stroke="${theme.accent}" stroke-width="0.8" opacity="0.35"/>`;
  }
  // 星点发光
  for (const p of points) {
    svg += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${(p.size * 2).toFixed(1)}" fill="${theme.accent}" opacity="0.15"/>`;
    svg += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.size.toFixed(1)}" fill="${theme.accent}" opacity="0.9"/>`;
  }
  return svg;
}

// 生成星云效果（几个大圆形渐变）
function generateNebula(rand, width, height, theme) {
  let svg = '';
  const count = 2 + Math.floor(rand() * 2);
  for (let i = 0; i < count; i++) {
    const cx = rand() * width;
    const cy = rand() * height;
    const r = 60 + rand() * 100;
    const opacity = 0.03 + rand() * 0.04;
    svg += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="${theme.accent}" opacity="${opacity.toFixed(3)}"/>`;
  }
  return svg;
}

// 生成单张卡牌图片
async function generateCardImage(card) {
  const theme = suitThemes[card.suit] || suitThemes.major;
  const seed = hashId(card.id);
  const rand = mulberry32(seed);

  const fileName = path.basename(card.imageUrl);
  const outputPath = path.join(__dirname, 'icons', 'stellar', fileName);

  // 确保目录存在
  const outDir = path.dirname(outputPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 提取编号显示
  const numMatch = fileName.match(/-(\d+)\.png$/);
  const displayNum = numMatch ? numMatch[1] : '';
  const displayId = card.suit === 'major' ? `No.${String(card.id).padStart(2, '0')}` : `${displayNum}`;

  // 提取 astro 信息（取 · 前面的部分作为符号显示）
  const astroParts = (card.astro || '').split('·');
  const astroSymbol = astroParts[0] ? astroParts[0].trim() : '';
  const astroDesc = astroParts[1] ? astroParts[1].trim() : '';

  // 构建SVG
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${theme.bg1};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${theme.bg3};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${theme.bg2};stop-opacity:1" />
    </linearGradient>
    <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${theme.accent};stop-opacity:0.5" />
      <stop offset="100%" style="stop-color:${theme.accent2};stop-opacity:0.2" />
    </linearGradient>
  </defs>

  <!-- 背景 -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGrad)" rx="14"/>

  <!-- 星云 -->
  ${generateNebula(rand, WIDTH, HEIGHT, theme)}

  <!-- 背景星星 -->
  ${generateStars(rand, 45, WIDTH, HEIGHT, theme)}

  <!-- 中央星座 -->
  ${generateConstellation(rand, WIDTH / 2, HEIGHT / 2 - 10, theme)}

  <!-- 外层边框 -->
  <rect x="10" y="10" width="${WIDTH - 20}" height="${HEIGHT - 20}" fill="none" stroke="url(#frameGrad)" stroke-width="1.5" rx="10"/>
  <rect x="16" y="16" width="${WIDTH - 32}" height="${HEIGHT - 32}" fill="none" stroke="${theme.accent}" stroke-width="0.6" rx="7" opacity="0.25"/>

  <!-- 顶部标签 -->
  <text x="${WIDTH / 2}" y="40"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="12" font-weight="500" letter-spacing="2"
        fill="${theme.accent}" text-anchor="middle" opacity="0.65">
    ${theme.label}${card.suit !== 'major' ? ' · ' + displayId : ''}
  </text>

  <!-- 占星符号 -->
  <text x="${WIDTH / 2}" y="105"
        font-family="'Microsoft YaHei', 'PingFang SC', sans-serif"
        font-size="13" font-weight="500"
        fill="${theme.accent2}" text-anchor="middle" opacity="0.6">
    ${astroSymbol}
  </text>

  <!-- 中文牌名 -->
  <text x="${WIDTH / 2}" y="${HEIGHT / 2 + 55}"
        font-family="'Microsoft YaHei', 'PingFang SC', 'SimHei', sans-serif"
        font-size="30" font-weight="bold"
        fill="${theme.accent}" text-anchor="middle" opacity="0.92">
    ${card.name}
  </text>

  <!-- 英文名 -->
  <text x="${WIDTH / 2}" y="${HEIGHT / 2 + 88}"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="13" font-style="italic"
        fill="${theme.accent2}" text-anchor="middle" opacity="0.5">
    ${card.originalName || ''}
  </text>

  <!-- 占星描述 -->
  <text x="${WIDTH / 2}" y="${HEIGHT / 2 + 115}"
        font-family="'Microsoft YaHei', 'PingFang SC', sans-serif"
        font-size="11"
        fill="${theme.accent2}" text-anchor="middle" opacity="0.4">
    ${astroDesc}
  </text>

  <!-- 底部编号/元素 -->
  <text x="${WIDTH / 2}" y="${HEIGHT - 32}"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="14" letter-spacing="1"
        fill="${theme.accent}" text-anchor="middle" opacity="0.35">
    ${card.suit === 'major' ? displayId : theme.element + ' · ' + displayId}
  </text>

  <!-- 四角星形装饰 -->
  <g opacity="0.5">
    <polygon points="22,14 23,18 27,18 24,20 25,24 22,21 19,24 20,20 17,18 21,18" fill="${theme.accent}"/>
    <polygon points="${WIDTH - 22},14 ${WIDTH - 21},18 ${WIDTH - 17},18 ${WIDTH - 20},20 ${WIDTH - 19},24 ${WIDTH - 22},21 ${WIDTH - 25},24 ${WIDTH - 24},20 ${WIDTH - 27},18 ${WIDTH - 23},18" fill="${theme.accent}"/>
    <polygon points="22,${HEIGHT - 14} 23,${HEIGHT - 18} 27,${HEIGHT - 18} 24,${HEIGHT - 20} 25,${HEIGHT - 24} 22,${HEIGHT - 21} 19,${HEIGHT - 24} 20,${HEIGHT - 20} 17,${HEIGHT - 18} 21,${HEIGHT - 18}" fill="${theme.accent}"/>
    <polygon points="${WIDTH - 22},${HEIGHT - 14} ${WIDTH - 21},${HEIGHT - 18} ${WIDTH - 17},${HEIGHT - 18} ${WIDTH - 20},${HEIGHT - 20} ${WIDTH - 19},${HEIGHT - 24} ${WIDTH - 22},${HEIGHT - 21} ${WIDTH - 25},${HEIGHT - 24} ${WIDTH - 24},${HEIGHT - 20} ${WIDTH - 27},${HEIGHT - 18} ${WIDTH - 23},${HEIGHT - 18}" fill="${theme.accent}"/>
  </g>
</svg>`;

  await sharp(Buffer.from(svg), { density: 150 })
    .png()
    .toFile(outputPath);

  return outputPath;
}

// 主函数
async function main() {
  try {
    console.log('读取星辰塔罗数据...');
    const cards = loadCards();
    console.log(`共 ${cards.length} 张牌\n`);

    console.log('开始生成牌面图片...');
    let count = 0;
    for (const card of cards) {
      const outPath = await generateCardImage(card);
      count++;
      process.stdout.write(`\r进度: ${count}/${cards.length} - ${card.name}`);
    }

    console.log(`\n\n全部生成完成！共 ${count} 张图片`);
    console.log('输出目录: icons/stellar/');

  } catch (error) {
    console.error('\n生成失败:', error);
    process.exit(1);
  }
}

main();
