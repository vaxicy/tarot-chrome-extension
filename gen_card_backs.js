// gen_card_backs.js - 生成治愈牌组和奥修禅卡的牌背图片
// 运行: node gen_card_backs.js

const sharp = require('sharp');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'icons', 'card-backs');
const WIDTH = 300;
const HEIGHT = 500;

// 创建治愈牌组牌背 - 绿色治愈主题
async function generateHealingBack() {
  const outputPath = path.join(OUTPUT_DIR, 'card-back-healing.png');
  
  // 创建SVG - 治愈主题：绿色渐变，生命之树图案
  const svg = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0d2818;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#1a4a2e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0d2818;stop-opacity:1" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:#4a8c5c;stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:#4a8c5c;stop-opacity:0" />
        </radialGradient>
        <linearGradient id="border" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#66bb6a;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#a5d6a7;stop-opacity:0.8" />
        </linearGradient>
      </defs>
      
      <!-- 背景 -->
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" rx="15"/>
      
      <!-- 光晕 -->
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)" rx="15"/>
      
      <!-- 装饰边框 -->
      <rect x="10" y="10" width="${WIDTH-20}" height="${HEIGHT-20}" 
            fill="none" stroke="url(#border)" stroke-width="2" rx="10" opacity="0.6"/>
      <rect x="20" y="20" width="${WIDTH-40}" height="${HEIGHT-40}" 
            fill="none" stroke="url(#border)" stroke-width="1" rx="8" opacity="0.4"/>
      
      <!-- 生命之树图案 -->
      <g transform="translate(${WIDTH/2}, ${HEIGHT/2})" opacity="0.25">
        <!-- 树干 -->
        <line x1="0" y1="-80" x2="0" y2="80" stroke="#66bb6a" stroke-width="3"/>
        <!-- 树枝 -->
        <line x1="0" y1="-80" x2="-40" y2="-120" stroke="#66bb6a" stroke-width="2"/>
        <line x1="0" y1="-80" x2="40" y2="-120" stroke="#66bb6a" stroke-width="2"/>
        <line x1="0" y1="-80" x2="-25" y2="-100" stroke="#66bb6a" stroke-width="2"/>
        <line x1="0" y1="-80" x2="25" y2="-100" stroke="#66bb6a" stroke-width="2"/>
        <!-- 树冠 -->
        <circle cx="0" cy="-130" r="35" fill="#4a8c5c" opacity="0.5"/>
        <circle cx="-25" cy="-115" r="25" fill="#4a8c5c" opacity="0.4"/>
        <circle cx="25" cy="-115" r="25" fill="#4a8c5c" opacity="0.4"/>
        <!-- 树根 -->
        <line x1="0" y1="80" x2="-30" y2="120" stroke="#66bb6a" stroke-width="2"/>
        <line x1="0" y1="80" x2="30" y2="120" stroke="#66bb6a" stroke-width="2"/>
        <line x1="0" y1="80" x2="-15" y2="110" stroke="#66bb6a" stroke-width="1.5"/>
        <line x1="0" y1="80" x2="15" y2="110" stroke="#66bb6a" stroke-width="1.5"/>
      </g>
      
      <!-- 治愈符号：双手 -->
      <g transform="translate(${WIDTH/2}, ${HEIGHT/2 - 60})" opacity="0.3">
        <path d="M -20,-10 Q -30,10 -20,30 Q -10,50 0,40 Q 10,50 20,30 Q 30,10 20,-10 Q 10,-20 0,-15 Q -10,-20 -20,-10 Z" 
              fill="#a5d6a7" opacity="0.6"/>
      </g>
      
      <!-- 装饰花纹：四角 -->
      <g opacity="0.2">
        <!-- 左上 -->
        <path d="M 30,30 Q 50,20 70,30 Q 60,50 70,70 Q 50,60 30,70 Q 20,50 30,30 Z" 
              fill="#66bb6a"/>
        <!-- 右上 -->
        <path d="M ${WIDTH-30},30 Q ${WIDTH-50},20 ${WIDTH-70},30 Q ${WIDTH-60},50 ${WIDTH-70},70 Q ${WIDTH-50},60 ${WIDTH-30},70 Q ${WIDTH-20},50 ${WIDTH-30},30 Z" 
              fill="#66bb6a"/>
        <!-- 左下 -->
        <path d="M 30,${HEIGHT-30} Q 50,${HEIGHT-20} 70,${HEIGHT-30} Q 60,${HEIGHT-50} 70,${HEIGHT-70} Q 50,${HEIGHT-60} 30,${HEIGHT-70} Q 20,${HEIGHT-50} 30,${HEIGHT-30} Z" 
              fill="#66bb6a"/>
        <!-- 右下 -->
        <path d="M ${WIDTH-30},${HEIGHT-30} Q ${WIDTH-50},${HEIGHT-20} ${WIDTH-70},${HEIGHT-30} Q ${WIDTH-60},${HEIGHT-50} ${WIDTH-70},${HEIGHT-70} Q ${WIDTH-50},${HEIGHT-60} ${WIDTH-30},${HEIGHT-70} Q ${WIDTH-20},${HEIGHT-50} ${WIDTH-30},${HEIGHT-30} Z" 
              fill="#66bb6a"/>
      </g>
      
      <!-- 中心文字 -->
      <text x="${WIDTH/2}" y="${HEIGHT/2 + 100}" 
            font-family="Georgia, serif" font-size="24" font-weight="bold"
            fill="#a5d6a7" text-anchor="middle" opacity="0.6">
        Healing
      </text>
      <text x="${WIDTH/2}" y="${HEIGHT/2 + 130}" 
            font-family="Georgia, serif" font-size="18"
            fill="#81c784" text-anchor="middle" opacity="0.5">
        治愈
      </text>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);
  
  console.log(`✓ 生成治愈牌背: ${outputPath}`);
}

// 创建奥修禅卡牌背 - 禅宗风格
// 创建星辰塔罗牌背 - 宇宙星空主题
async function generateStellarBack() {
  const outputPath = path.join(OUTPUT_DIR, 'card-back-stellar.png');

  // 星辰主题SVG：深空背景 + 星点 + 星座连线 + 银河光晕
  const svg = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="nebula" cx="50%" cy="50%" r="60%">
          <stop offset="0%" style="stop-color:#1a0d4e;stop-opacity:0.5" />
          <stop offset="100%" style="stop-color:#0d0d2e;stop-opacity:0" />
        </radialGradient>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0a0a1a;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#1a0d3e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0d0d2a;stop-opacity:1" />
        </linearGradient>
        <radialGradient id="galaxy" cx="50%" cy="50%" r="35%">
          <stop offset="0%" style="stop-color:#7b68ee;stop-opacity:0.15" />
          <stop offset="100%" style="stop-color:#7b68ee;stop-opacity:0" />
        </radialGradient>
        <linearGradient id="border" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#9b8cff;stop-opacity:0.7" />
          <stop offset="100%" style="stop-color:#c8b8ff;stop-opacity:0.7" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- 深空背景 -->
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" rx="15"/>

      <!-- 银河光晕 -->
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#galaxy)" rx="15"/>
      <!-- 星云 -->
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#nebula)" rx="15"/>

      <!-- 星点背景（随机散布的小圆点） -->
      <g opacity="0.6">
        ${_stellarStars(20, 280, 40, 460, 12)}
      </g>

      <!-- 装饰边框 -->
      <rect x="8" y="8" width="${WIDTH-16}" height="${HEIGHT-16}"
            fill="none" stroke="url(#border)" stroke-width="2.5" rx="12" opacity="0.6"/>
      <rect x="18" y="18" width="${WIDTH-36}" height="${HEIGHT-36}"
            fill="none" stroke="url(#border)" stroke-width="1" rx="10" opacity="0.3"/>

      <!-- 星座图案：大熊座（北斗七星）简化 -->
      <g transform="translate(${WIDTH/2}, ${HEIGHT/2 - 20})" opacity="0.35" filter="url(#glow)">
        ${_stellarConstellation()}
      </g>

      <!-- 中心星辰符号：六角星 + 圆 -->
      <g transform="translate(${WIDTH/2}, ${HEIGHT/2 + 40})" opacity="0.25" filter="url(#glow)">
        <!-- 六角星 -->
        <polygon points="0,-35 10,-10 35,-10 15,5 25,35 0,15 -25,35 -15,5 -35,-10 -10,-10"
                  fill="none" stroke="#9b8cff" stroke-width="1.5"/>
        <!-- 外圈 -->
        <circle cx="0" cy="0" r="45" fill="none" stroke="#c8b8ff" stroke-width="1" stroke-dasharray="4 6"/>
        <!-- 内圈 -->
        <circle cx="0" cy="0" r="28" fill="none" stroke="#9b8cff" stroke-width="1" stroke-dasharray="3 5"/>
        <!-- 中心点 -->
        <circle cx="0" cy="0" r="4" fill="#c8b8ff" opacity="0.8"/>
      </g>

      <!-- 四角星标 -->
      <g opacity="0.3" filter="url(#glow)">
        <path d="M 40,40 l 4,-12 4,12 -10,-6 h 12 l -4,12 -4,-12" fill="#9b8cff"/>
        <path d="${WIDTH-40},40 l 4,-12 4,12 -10,-6 h 12 l -4,12 -4,-12" fill="#9b8cff"/>
        <path d="40,${HEIGHT-40} l 4,-12 4,12 -10,-6 h 12 l -4,12 -4,-12" fill="#9b8cff"/>
        <path d="${WIDTH-40},${HEIGHT-40} l 4,-12 4,12 -10,-6 h 12 l -4,12 -4,-12" fill="#9b8cff"/>
      </g>

      <!-- 中心文字 -->
      <text x="${WIDTH/2}" y="${HEIGHT/2 + 120}"
            font-family="Georgia, serif" font-size="22" font-weight="bold"
            fill="#9b8cff" text-anchor="middle" opacity="0.6" filter="url(#glow)">
        Stellar
      </text>
      <text x="${WIDTH/2}" y="${HEIGHT/2 + 150}"
            font-family="Georgia, serif" font-size="16"
            fill="#c8b8ff" text-anchor="middle" opacity="0.45">
        星辰塔罗
      </text>

      <!-- 底部装饰线 -->
      <line x1="${WIDTH/2 - 45}" y1="${HEIGHT/2 + 168}"
            x2="${WIDTH/2 + 45}" y2="${HEIGHT/2 + 168}"
            stroke="#9b8cff" stroke-width="0.8" opacity="0.25"/>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);

  console.log(`✓ 生成星辰牌背: ${outputPath}`);
}

// 生成随机星点
function _stellarStars(xMin, xMax, yMin, yMax, count) {
  let xml = '';
  for (let i = 0; i < count; i++) {
    const cx = xMin + Math.round(Math.random() * (xMax - xMin));
    const cy = yMin + Math.round(Math.random() * (yMax - yMin));
    const r = 1 + Math.round(Math.random() * 2);
    const o = (0.3 + Math.random() * 0.5).toFixed(2);
    xml += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#c8b8ff" opacity="${o}"/>\n        `;
  }
  return xml;
}

// 生成星座连线图案（北斗七星简化）
function _stellarConstellation() {
  // 北斗七星相对坐标
  const stars = [
    [-40, -50], [-15, -55], [5, -40], [25, -42],
    [45, -25], [55, -5], [40, 15]
  ];
  let xml = '';
  // 连线
  const edges = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]];
  for (const [a, b] of edges) {
    xml += `<line x1="${stars[a][0]}" y1="${stars[a][1]}" x2="${stars[b][0]}" y2="${stars[b][1]}" stroke="#9b8cff" stroke-width="1" opacity="0.6"/>\n        `;
  }
  // 星点
  for (let i = 0; i < stars.length; i++) {
    const [x, y] = stars[i];
    xml += `<circle cx="${x}" cy="${y}" r="${i === 3 ? 4 : 3}" fill="#c8b8ff" opacity="0.8"/>\n        `;
    xml += `<circle cx="${x}" cy="${y}" r="${i === 3 ? 7 : 5}" fill="none" stroke="#9b8cff" stroke-width="0.8" opacity="0.4"/>\n        `;
  }
  return xml;
}

async function generateOshoBack() {
  const outputPath = path.join(OUTPUT_DIR, 'card-back-osho.png');
  
  // 创建SVG - 奥修禅卡主题：简约、禅意、空性
  const svg = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#16213e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0f3460;stop-opacity:1" />
        </linearGradient>
        <radialGradient id="center" cx="50%" cy="50%" r="40%">
          <stop offset="0%" style="stop-color:#e94560;stop-opacity:0.15" />
          <stop offset="100%" style="stop-color:#e94560;stop-opacity:0" />
        </radialGradient>
        <linearGradient id="border" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#e94560;stop-opacity:0.6" />
          <stop offset="100%" style="stop-color:#ff6b6b;stop-opacity:0.6" />
        </linearGradient>
      </defs>
      
      <!-- 背景 -->
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" rx="15"/>
      
      <!-- 中心光晕 -->
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#center)" rx="15"/>
      
      <!-- 装饰边框 -->
      <rect x="8" y="8" width="${WIDTH-16}" height="${HEIGHT-16}" 
            fill="none" stroke="url(#border)" stroke-width="2.5" rx="12" opacity="0.7"/>
      <rect x="18" y="18" width="${WIDTH-36}" height="${HEIGHT-36}" 
            fill="none" stroke="url(#border)" stroke-width="1" rx="10" opacity="0.4"/>
      
      <!-- 禅宗圆圈：一圆（Enso） -->
      <g transform="translate(${WIDTH/2}, ${HEIGHT/2})" opacity="0.35">
        <!-- 主圆：不闭合，有笔触感 -->
        <path d="M -80,0 
                 A 80,80 0 1,1 80,0
                 A 80,80 0 1,1 -80,0"
              fill="none" stroke="#e94560" stroke-width="4" 
              stroke-linecap="round" stroke-dasharray="400 100"/>
        
        <!-- 内圆 -->
        <path d="M -50,0 
                 A 50,50 0 1,1 50,0
                 A 50,50 0 1,1 -50,0"
              fill="none" stroke="#ff6b6b" stroke-width="2" 
              stroke-linecap="round" stroke-dasharray="250 80" opacity="0.6"/>
      </g>
      
      <!-- 装饰点：四角 -->
      <g opacity="0.3">
        <circle cx="40" cy="40" r="3" fill="#e94560"/>
        <circle cx="40" cy="40" r="8" fill="none" stroke="#e94560" stroke-width="1"/>
        
        <circle cx="${WIDTH-40}" cy="40" r="3" fill="#e94560"/>
        <circle cx="${WIDTH-40}" cy="40" r="8" fill="none" stroke="#e94560" stroke-width="1"/>
        
        <circle cx="40" cy="${HEIGHT-40}" r="3" fill="#e94560"/>
        <circle cx="40" cy="${HEIGHT-40}" r="8" fill="none" stroke="#e94560" stroke-width="1"/>
        
        <circle cx="${WIDTH-40}" cy="${HEIGHT-40}" r="3" fill="#e94560"/>
        <circle cx="${WIDTH-40}" cy="${HEIGHT-40}" r="8" fill="none" stroke="#e94560" stroke-width="1"/>
      </g>
      
      <!-- 莲花图案：简约风格 -->
      <g transform="translate(${WIDTH/2}, ${HEIGHT/2 - 80})" opacity="0.2">
        <!-- 花瓣 -->
        <ellipse cx="0" cy="-15" rx="8" ry="20" fill="#ff6b6b" transform="rotate(0)"/>
        <ellipse cx="0" cy="-15" rx="8" ry="20" fill="#ff6b6b" transform="rotate(45)"/>
        <ellipse cx="0" cy="-15" rx="8" ry="20" fill="#ff6b6b" transform="rotate(90)"/>
        <ellipse cx="0" cy="-15" rx="8" ry="20" fill="#ff6b6b" transform="rotate(135)"/>
        <ellipse cx="0" cy="-15" rx="8" ry="20" fill="#ff6b6b" transform="rotate(180)"/>
        <ellipse cx="0" cy="-15" rx="8" ry="20" fill="#ff6b6b" transform="rotate(225)"/>
        <ellipse cx="0" cy="-15" rx="8" ry="20" fill="#ff6b6b" transform="rotate(270)"/>
        <ellipse cx="0" cy="-15" rx="8" ry="20" fill="#ff6b6b" transform="rotate(315)"/>
        <!-- 花心 -->
        <circle cx="0" cy="0" r="6" fill="#e94560" opacity="0.8"/>
      </g>
      
      <!-- 中心文字 -->
      <text x="${WIDTH/2}" y="${HEIGHT/2 + 120}" 
            font-family="Georgia, serif" font-size="22" font-weight="bold"
            fill="#e94560" text-anchor="middle" opacity="0.6">
        Osho Zen
      </text>
      <text x="${WIDTH/2}" y="${HEIGHT/2 + 150}" 
            font-family="Georgia, serif" font-size="18"
            fill="#ff6b6b" text-anchor="middle" opacity="0.5">
        奥修禅卡
      </text>
      
      <!-- 底部装饰线 -->
      <line x1="${WIDTH/2 - 50}" y1="${HEIGHT/2 + 170}" 
            x2="${WIDTH/2 + 50}" y2="${HEIGHT/2 + 170}" 
            stroke="#e94560" stroke-width="1" opacity="0.3"/>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);
  
  console.log(`✓ 生成奥修禅卡牌背: ${outputPath}`);
}

// 主函数
async function main() {
  try {
    console.log('开始生成牌背图片...\n');

    await generateHealingBack();
    await generateOshoBack();
    await generateStellarBack();

    console.log('\n✅ 所有牌背图片生成完成！');
    console.log('输出目录:', OUTPUT_DIR);

  } catch (error) {
    console.error('❌ 生成失败:', error);
    process.exit(1);
  }
}

main();
