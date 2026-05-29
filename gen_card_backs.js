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
    
    console.log('\n✅ 所有牌背图片生成完成！');
    console.log('输出目录:', OUTPUT_DIR);
    
  } catch (error) {
    console.error('❌ 生成失败:', error);
    process.exit(1);
  }
}

main();
