const fs = require('fs');
const { createCanvas } = require('canvas');

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawStar(ctx, cx, cy, r, points) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI / 2 * 3) + (i * Math.PI / points);
    const radius = i % 2 === 0 ? r : r * 0.45;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const s = size, half = s / 2;

  roundRect(ctx, 0, 0, s, s, s * 0.2);
  const bgGrad = ctx.createRadialGradient(half, half, 0, half, half, s * 0.7);
  bgGrad.addColorStop(0, '#4A2F9F');
  bgGrad.addColorStop(1, '#1A0F40');
  ctx.fillStyle = bgGrad;
  ctx.fill();

  ctx.fillStyle = 'rgba(255,215,0,0.3)';
  const stars = [[0.18,0.15],[0.82,0.12],[0.15,0.85],[0.88,0.88],[0.5,0.08],[0.08,0.5]];
  stars.forEach(p => {
    ctx.beginPath();
    ctx.arc(s*p[0], s*p[1], s*0.03, 0, Math.PI*2);
    ctx.fill();
  });

  const pad = s * 0.15;
  const cardW = s - pad * 2;
  const cardH = cardW * 1.4;
  const cardX = pad;
  const cardY = (s - cardH) / 2;

  roundRect(ctx, cardX, cardY, cardW, cardH, s * 0.06);
  ctx.fillStyle = '#1A0F40';
  ctx.fill();
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = Math.max(1, s * 0.025);
  ctx.stroke();

  const cx = half, cy = half, starR = s * 0.22;
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = s * 0.1;
  drawStar(ctx, cx, cy, starR, 5);
  ctx.fillStyle = '#FFD700';
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.beginPath();
  ctx.arc(cx, cy, s * 0.06, 0, Math.PI * 2);
  ctx.fillStyle = '#1A0F40';
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,215,0,0.5)';
  ctx.lineWidth = Math.max(1, s * 0.01);
  ctx.beginPath();
  ctx.moveTo(cardX + cardW * 0.2, cardY + cardH * 0.18);
  ctx.lineTo(cardX + cardW * 0.8, cardY + cardH * 0.18);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cardX + cardW * 0.2, cardY + cardH * 0.82);
  ctx.lineTo(cardX + cardW * 0.8, cardY + cardH * 0.82);
  ctx.stroke();

  const cornerSize = s * 0.04;
  [[cardX+cardW*0.08,cardY+cardH*0.08],[cardX+cardW*0.92,cardY+cardH*0.08],[cardX+cardW*0.08,cardY+cardH*0.92],[cardX+cardW*0.92,cardY+cardH*0.92]].forEach(p => {
    ctx.beginPath();
    ctx.arc(p[0], p[1], cornerSize, 0, Math.PI*2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
  });

  return canvas.toBuffer('image/png');
}

[16,48,128].forEach(size => {
  fs.writeFileSync('icons/icon' + size + '.png', drawIcon(size));
  console.log('Generated icon' + size + '.png');
});
console.log('Done!');
