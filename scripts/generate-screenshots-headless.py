#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Magic Tarot - Chrome Web Store Screenshot Generator (Headless)
Generates 3 introduction-style screenshots per language (zh + en) at 1280x800.
Output: store-assets/screenshots/{zh,en}/screenshot-{1,2,3}.png (RGB, no alpha)
"""
import os
import sys
import io
import base64
from playwright.sync_api import sync_playwright

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
OUT_DIR = os.path.join(PROJECT_ROOT, "store-assets", "screenshots")

W, H = 1280, 800

def b64(path):
    with open(path, "rb") as f:
        return "data:image/png;base64," + base64.b64encode(f.read()).decode()

ICON = b64(os.path.join(PROJECT_ROOT, "icons", "icon128.png"))
CARD_BACK = b64(os.path.join(PROJECT_ROOT, "icons", "card-backs", "card-back-hp.png"))
CARD_FRONT_1 = b64(os.path.join(PROJECT_ROOT, "icons", "major", "tarot-major-00.png"))
CARD_FRONT_2 = b64(os.path.join(PROJECT_ROOT, "icons", "major", "tarot-major-01.png"))
CARD_FRONT_3 = b64(os.path.join(PROJECT_ROOT, "icons", "major", "tarot-major-19.png"))

# 扇形牌（截图2）：预生成旋转角度
FAN_CARDS = []
angles = [-36, -27, -18, -9, 0, 9, 18, 27, 36]
for a in angles:
    FAN_CARDS.append(a)

CSS = """
* { margin:0; padding:0; box-sizing:border-box; }
body {
  width: 1280px; height: 800px; overflow: hidden;
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
  background: linear-gradient(180deg, #0d0620 0%, #1a0a3e 55%, #2a1157 100%);
  color: #fff; position: relative;
}
.stars { position:absolute; inset:0; }
.star { position:absolute; width:2px; height:2px; border-radius:50%; background:#fff8e1; }
.glow {
  position:absolute; top:-220px; left:50%; transform:translateX(-50%);
  width:900px; height:520px; border-radius:50%;
  background: radial-gradient(circle, rgba(155,89,182,0.4) 0%, transparent 65%);
}
.content { position:relative; z-index:2; width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; }

.header { text-align:center; }
.header .icon-row { display:flex; align-items:center; justify-content:center; gap:20px; }
.header img.icon { width:88px; height:88px; border-radius:20px; box-shadow:0 0 40px rgba(255,215,0,0.35); }
.header h1 { font-size:52px; font-weight:800; letter-spacing:6px; color:#ffd700; text-shadow:0 0 24px rgba(255,215,0,0.45); }
.header h1 .en { font-size:30px; letter-spacing:2px; color:#c9a0dc; margin-left:14px; }
.header .slogan { margin-top:12px; font-size:22px; color:#c0b8d8; letter-spacing:3px; }

.chips { display:flex; gap:16px; justify-content:center; margin-top:26px; }
.chip {
  padding:9px 26px; border-radius:999px; font-size:19px; letter-spacing:1px;
  color:#ffd700; background:rgba(255,215,0,0.07);
  border:1.5px solid rgba(255,215,0,0.4);
}

/* 复刻真实 popup 的 UI 元素 */
.ui-panel {
  margin-top:30px; width:760px; border-radius:22px;
  background: rgba(26,15,64,0.72);
  border:1.5px solid rgba(255,215,0,0.3);
  box-shadow: 0 24px 70px rgba(0,0,0,0.55), 0 0 40px rgba(155,89,182,0.25);
  padding:22px 26px;
}
.toolbar { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
.toolbar .selects { display:flex; gap:10px; }
.select-box {
  padding:8px 16px; border-radius:8px; font-size:16px; color:#ffd700;
  background:rgba(13,10,26,0.7); border:1.5px solid rgba(255,215,0,0.35);
}
.tool-icons { display:flex; gap:10px; }
.tool-icon {
  width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center;
  background:rgba(13,10,26,0.7); border:1.5px solid rgba(255,215,0,0.35); font-size:19px;
}
.tool-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.tool-card {
  border-radius:12px; padding:20px 10px; text-align:center;
  background:linear-gradient(135deg,#2d1b69,#4a1f7a);
  border:1.5px solid rgba(255,215,0,0.3); font-size:20px; font-weight:700; color:#ffd700;
}
.tool-card .sub { display:block; font-size:14px; font-weight:400; color:#c0b8d8; margin-top:6px; }
.tool-card.purple { background:linear-gradient(135deg,#4a148c,#6a1b9a); }
.tool-card.pink { background:linear-gradient(135deg,#880e4f,#ad1457); }
.spread-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-top:16px; }
.spread-item {
  border-radius:10px; padding:14px 8px; text-align:center;
  background:rgba(13,10,26,0.55); border:1px solid rgba(255,215,0,0.22);
}
.spread-item .name { font-size:17px; font-weight:700; color:#fff; }
.spread-item .cnt { font-size:13px; color:#c0b8d8; margin-top:4px; }

/* 截图2：扇形牌 */
.fan-stage { position:relative; height:430px; width:900px; margin-top:16px; }
.fan-card {
  position:absolute; left:50%; top:40px; width:150px; height:236px;
  margin-left:-75px; transform-origin:50% 480px;
  border-radius:10px; overflow:hidden;
  box-shadow:0 14px 34px rgba(0,0,0,0.6);
  border:1px solid rgba(255,215,0,0.35);
}
.fan-card img { width:100%; height:100%; object-fit:cover; display:block; }
.fan-card.lit { box-shadow:0 18px 44px rgba(0,0,0,0.7), 0 0 34px rgba(255,215,0,0.45); border-color:#ffd700; }

/* 截图3：解读卡 */
.reading-card {
  margin-top:28px; width:820px; border-radius:18px;
  background:rgba(26,15,64,0.75);
  border:2px solid rgba(255,215,0,0.55);
  padding:24px 30px;
  box-shadow:0 24px 60px rgba(0,0,0,0.5);
}
.reading-card .rc-title { text-align:center; font-size:26px; font-weight:800; color:#ffd700; letter-spacing:2px; }
.tags { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; margin:16px 0; }
.tag {
  padding:7px 20px; border-radius:999px; font-size:17px;
  color:#e8dcb8; background:rgba(255,215,0,0.06);
  border:1px solid rgba(255,215,0,0.3);
}
.ai-box {
  margin-top:6px; border-radius:14px; padding:18px 22px;
  background:linear-gradient(135deg, rgba(156,39,176,0.22) 0%, rgba(26,15,64,0.85) 100%);
  border:1.5px solid rgba(233,30,99,0.5);
}
.ai-box .ai-title { font-size:20px; font-weight:800; color:#f8bbd0; letter-spacing:1px; margin-bottom:8px; }
.ai-box .ai-body { font-size:17px; line-height:1.75; color:#f0eaff; }
.deck-row { display:flex; gap:14px; justify-content:center; margin-top:24px; }
.deck-card {
  width:104px; height:158px; border-radius:10px; overflow:hidden;
  border:1.5px solid rgba(255,215,0,0.4);
  box-shadow:0 12px 30px rgba(0,0,0,0.55);
  background:#1a0f40;
}
.deck-card img { width:100%; height:100%; object-fit:cover; display:block; }
"""

def stars_html(n=90):
    import random
    random.seed(7)
    out = []
    for _ in range(n):
        x = random.randint(0, 1279)
        y = random.randint(0, 799)
        s = random.choice([1, 1, 1, 2, 3])
        o = random.choice([0.35, 0.6, 0.9])
        out.append('<div class="star" style="left:%dpx;top:%dpx;width:%dpx;height:%dpx;opacity:%.2f"></div>'
                   % (x, y, s, s, o))
    return "".join(out)

def fan_html():
    cards = []
    for i, a in enumerate(FAN_CARDS):
        lit = ' lit' if a == 0 else ''
        img = CARD_FRONT_3 if a == 0 else CARD_BACK
        cards.append('<div class="fan-card%s" style="transform:rotate(%ddeg)"><img src="%s"></div>'
                     % (lit, a, img))
    return "".join(cards)

T = {
  "zh": {
    "title": "魔法塔罗牌",
    "title_en": "Magic Tarot",
    "slogan": "探索魔法世界的命运指引",
    "chip1": "8 套牌组 · 40+ 牌阵",
    "chip2": "真实抽卡 · 自选牌",
    "chip3": "中英双语",
    "s2_title": "真实抽卡体验",
    "s2_sub": "整副牌扇形摊开 · 左右滑动浏览 · 点击抽牌 · 正逆位随机",
    "s2_chip1": "模拟真实翻牌",
    "s2_chip2": "结果公平随机",
    "s2_chip3": "支持全部牌阵",
    "s3_title": "AI 智能解读",
    "s3_sub": "接入你自己的 AI，为每次占卜生成深度个性化解读",
    "rc_title": "愚者（今日指引）· 正位",
    "tags": ["新的开始", "冒险", "自由", "无限可能"],
    "ai_title": "✦ AI 深度解读",
    "ai_body": "今天抽到「愚者」正位，宇宙在提醒你：一个新的开始正在门前。不必等万事俱备，带着好奇心迈出第一步，路会在你脚下展开。今天适合尝试新事物、跟随直觉，而不是过度计划。",
    "providers": ["硅基流动", "OpenAI", "自定义接口", "Key 仅存本地"],
    "deck_names": [("单牌占卜", "1 张"), ("三牌阵", "3 张"), ("凯尔特十字", "10 张"), ("恋人牌阵", "7 张")],
    "tool1": "今日运势", "tool1sub": "9月2日 星期三",
    "tool2": "命运数字", "tool3": "选择困难症",
  },
  "en": {
    "title": "Magic Tarot",
    "title_en": "",
    "slogan": "Mystic guidance for your daily life",
    "chip1": "8 Decks · 40+ Spreads",
    "chip2": "Real Card Picking",
    "chip3": "EN & CN Bilingual",
    "s2_title": "A Real Card-Drawing Experience",
    "s2_sub": "The full deck fans out · Swipe to browse · Tap to pick · Random reversals",
    "s2_chip1": "Realistic Flipping",
    "s2_chip2": "Fair & Random",
    "s2_chip3": "Works with Every Spread",
    "s3_title": "AI-Powered Readings",
    "s3_sub": "Bring your own AI for deep, personalized interpretation of every draw",
    "rc_title": "The Fool (Daily Guidance) · Upright",
    "tags": ["New Beginnings", "Adventure", "Freedom", "Infinite Potential"],
    "ai_title": "✦ AI Deep Reading",
    "ai_body": "The Fool upright appears today as a gentle nudge from the universe: a fresh start is at your door. You don't need everything to be perfect — take the first step with curiosity, and the path will unfold beneath your feet.",
    "providers": ["SiliconFlow", "OpenAI", "Custom Endpoint", "Key Stays Local"],
    "deck_names": [("Single Card", "1 card"), ("Three Card", "3 cards"), ("Celtic Cross", "10 cards"), ("Lovers Spread", "7 cards")],
    "tool1": "Daily Fortune", "tool1sub": "Wed, Sep 2",
    "tool2": "Lucky Number", "tool3": "Decider",
  },
}

def page1(t):
    decks = "".join('<div class="spread-item"><div class="name">%s</div><div class="cnt">%s</div></div>' % (n, c)
                    for n, c in t["deck_names"])
    return """
    <div class="header">
      <div class="icon-row"><img class="icon" src="%s"><h1>%s<span class="en">%s</span></h1></div>
      <div class="slogan">%s</div>
    </div>
    <div class="chips"><div class="chip">%s</div><div class="chip">%s</div><div class="chip">%s</div></div>
    <div class="ui-panel">
      <div class="toolbar">
        <div class="selects"><div class="select-box">✦ %s</div><div class="select-box">中文 / EN</div></div>
        <div class="tool-icons"><div class="tool-icon">🔊</div><div class="tool-icon">📖</div><div class="tool-icon">⚙</div></div>
      </div>
      <div class="tool-grid">
        <div class="tool-card">%s<span class="sub">%s</span></div>
        <div class="tool-card purple">%s</div>
        <div class="tool-card pink">%s</div>
      </div>
      <div class="spread-grid">%s</div>
    </div>
    """ % (ICON, t["title"], t["title_en"], t["slogan"], t["chip1"], t["chip2"], t["chip3"],
           t["title"], t["tool1"], t["tool1sub"], t["tool2"], t["tool3"], decks)

def page2(t):
    return """
    <div class="header">
      <h1 style="font-size:46px;">%s</h1>
      <div class="slogan">%s</div>
    </div>
    <div class="fan-stage">%s</div>
    <div class="chips"><div class="chip">%s</div><div class="chip">%s</div><div class="chip">%s</div></div>
    """ % (t["s2_title"], t["s2_sub"], fan_html(), t["s2_chip1"], t["s2_chip2"], t["s2_chip3"])

def page3(t):
    tags = "".join('<div class="tag">%s</div>' % x for x in t["tags"])
    provs = "".join('<div class="chip" style="margin-top:22px;">%s</div>' % x for x in t["providers"])
    return """
    <div class="header">
      <h1 style="font-size:46px;">%s</h1>
      <div class="slogan">%s</div>
    </div>
    <div class="reading-card">
      <div class="rc-title">%s</div>
      <div class="tags">%s</div>
      <div class="ai-box">
        <div class="ai-title">%s</div>
        <div class="ai-body">%s</div>
      </div>
    </div>
    <div class="chips">%s</div>
    """ % (t["s3_title"], t["s3_sub"], t["rc_title"], tags, t["ai_title"], t["ai_body"], provs)

PAGES = [page1, page2, page3]

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
        for lang in ("zh", "en"):
            outdir = os.path.join(OUT_DIR, lang)
            os.makedirs(outdir, exist_ok=True)
            for idx, builder in enumerate(PAGES, start=1):
                html = ("<html><head><meta charset='utf-8'><style>%s</style></head>"
                        "<body><div class='stars'>%s</div><div class='glow'></div>"
                        "<div class='content'>%s</div></body></html>"
                        % (CSS, stars_html(), builder(T[lang])))
                page.set_content(html, wait_until="networkidle")
                out = os.path.join(outdir, "screenshot-%d.png" % idx)
                page.screenshot(path=out, clip={"x": 0, "y": 0, "width": W, "height": H})
                # 强制 RGB 无 alpha
                from PIL import Image
                img = Image.open(out).convert("RGB")
                img.save(out)
                print("saved", out)
        browser.close()

if __name__ == "__main__":
    main()
