#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Magic Tarot - Chrome Web Store Promo Tile Generator
Generates bilingual promo images:
  - Small: 440x280  -> store-assets/promo/promo-small-440x280.png
  - Large: 1400x560 -> store-assets/promo/promo-large-1400x560.png

v2: All emojis replaced with PIL-drawn shapes (no □ boxes).
    Dice replaced with tarot card icon.
    Banner text left-aligned to avoid icon overlap.
"""

import os
import sys
import io
import math
import random
from PIL import Image, ImageDraw, ImageFont

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
PROMO_DIR = os.path.join(PROJECT_ROOT, "store-assets", "promo")
ICON_PATH = os.path.join(PROJECT_ROOT, "icons", "icon128.png")

BG_TOP = "#0d0620"
BG_BOTTOM = "#1a0a3e"
ACCENT_GOLD = "#ffd700"
ACCENT_PURPLE = "#9b59b6"
ACCENT_LIGHT = "#c9a0dc"
TEXT_WHITE = "#ffffff"
TEXT_SUB = "#c0b8d8"
CARD_BG = "#2a1548"
CARD_BORDER = "#7d3c98"

_FONT_CACHE = {}

def font_zh(size, bold=False):
    key = ("zh", size, bold)
    if key not in _FONT_CACHE:
        names = ["msyhbd.ttc", "Microsoft YaHei Bold"] if bold else \
                ["msyh.ttc", "Microsoft YaHei", "simhei.ttf"]
        for n in names:
            try:
                _FONT_CACHE[key] = ImageFont.truetype(n, size)
                return _FONT_CACHE[key]
            except:
                continue
        _FONT_CACHE[key] = ImageFont.load_default()
    return _FONT_CACHE[key]

def font_en(size, bold=False):
    key = ("en", size, bold)
    if key not in _FONT_CACHE:
        names = ["seguiuib.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf"] if bold else \
                ["seguiui.ttf", "arial.ttf", "DejaVuSans.ttf"]
        for n in names:
            try:
                _FONT_CACHE[key] = ImageFont.truetype(n, size)
                return _FONT_CACHE[key]
            except:
                continue
        _FONT_CACHE[key] = ImageFont.load_default()
    return _FONT_CACHE[key]

def draw_gradient_bg(draw, w, h):
    for y in range(h):
        r = int(13 + (26 - 13) * y / h)
        g = int(6 + (10 - 6) * y / h)
        b = int(32 + (62 - 32) * y / h)
        draw.line([(0, y), (w, y)], fill=(r, g, b))
    random.seed(42)
    for _ in range(80):
        sx, sy = random.randint(0, w), random.randint(0, h)
        sr = random.choice([1, 1, 1, 2])
        draw.ellipse([sx - sr, sy - sr, sx + sr, sy + sr],
                     fill=(255, 248, 225, random.randint(100, 255)))

def draw_rr(draw, coords, radius, fill=None, outline=None, width=1):
    draw_rounded_rect(draw, coords, radius, fill=fill, outline=outline, width=width)

def draw_rounded_rect(draw, coords, radius, fill=None, outline=None, width=1):
    x1, y1, x2, y2 = coords
    if fill:
        draw.rectangle([x1 + radius, y1, x2 - radius, y2], fill=fill)
        draw.rectangle([x1, y1 + radius, x2, y2 - radius], fill=fill)
        draw.pieslice([x1, y1, x1 + 2 * radius, y1 + 2 * radius], 180, 270, fill=fill)
        draw.pieslice([x2 - 2 * radius, y1, x2, y1 + 2 * radius], 270, 360, fill=fill)
        draw.pieslice([x1, y2 - 2 * radius, x1 + 2 * radius, y2], 90, 180, fill=fill)
        draw.pieslice([x2 - 2 * radius, y2 - 2 * radius, x2, y2], 0, 90, fill=fill)
    if outline:
        draw.rounded_rectangle(coords, radius=radius, outline=outline, width=width)

def text_center(draw, xy, text, font, fill=TEXT_WHITE):
    bbox = draw.textbbox(xy, text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x, y = xy
    draw.text((x - tw // 2, y - th // 2), text, font=font, fill=fill)
    return (x - tw // 2, y - th // 2, x + tw // 2, y + th // 2)

def text_left(draw, xy, text, font, fill=TEXT_WHITE):
    draw.text(xy, text, font=font, fill=fill)

def load_icon(size=64):
    try:
        icon = Image.open(ICON_PATH).convert("RGBA")
        return icon.resize((size, size), Image.LANCZOS)
    except:
        img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        d = ImageDraw.Draw(img)
        d.ellipse([3, 3, size - 3, size - 3], fill=ACCENT_PURPLE)
        return img

def _shade(hex_color, factor):
    hex_color = hex_color.lstrip("#")
    r, g, b = int(hex_color[0:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
    return (min(255, int(r * factor)), min(255, int(g * factor)), min(255, int(b * factor)))

# ════════════════════════════════════════
#  ICON DRAWING FUNCTIONS
# ════════════════════════════════════════

def _draw_star(draw, cx, cy, outer_r, fill_color, points=5):
    inner_r = outer_r * 0.4
    pts = []
    for i in range(points * 2):
        angle = math.pi / 2 + i * math.pi / points
        r = outer_r if i % 2 == 0 else inner_r
        px = cx + r * math.cos(angle)
        py = cy - r * math.sin(angle)
        pts.append((px, py))
    draw.polygon(pts, fill=fill_color)

def _draw_sun(draw, cx, cy, radius, fill_color):
    draw.ellipse([cx - radius * 0.45, cy - radius * 0.45,
                  cx + radius * 0.45, cy + radius * 0.45], fill=fill_color)
    for i in range(8):
        angle = i * math.pi / 4
        x1 = cx + radius * 0.55 * math.cos(angle)
        y1 = cy - radius * 0.55 * math.sin(angle)
        x2 = cx + (radius * 0.55 + radius * 0.35) * math.cos(angle)
        y2 = cy - (radius * 0.55 + radius * 0.35) * math.sin(angle)
        draw.line([(x1, y1), (x2, y2)], fill=fill_color, width=2)

def _draw_think_bubble(draw, cx, cy, size, fill_color):
    half = size // 2
    draw.ellipse([cx - half, cy - half - size // 6,
                  cx + half, cy + half - size // 6], fill=fill_color)
    s1 = size // 5
    draw.ellipse([cx - half // 2 - s1, cy + half - size // 6,
                  cx - half // 2 + s1, cy + half - size // 6 + s1 * 2], fill=fill_color)
    q_font = font_zh(int(size * 0.5), True)
    text_center(draw, (cx, cy - size // 12), "?", q_font, TEXT_WHITE)

def _draw_sparkle(draw, cx, cy, size, fill_color):
    pts = []
    for i in range(8):
        angle = i * math.pi / 4
        r = size if i % 2 == 0 else size * 0.3
        px = cx + r * math.cos(angle)
        py = cy - r * math.sin(angle)
        pts.append((px, py))
    draw.polygon(pts, fill=fill_color)

def _draw_hourglass(draw, cx, cy, size, fill_color):
    half = size // 2
    margin = size // 6
    draw.polygon([(cx - half + margin, cy - half + margin),
                  (cx + half - margin, cy - half + margin),
                  (cx, cy - size // 8)], fill=fill_color)
    draw.polygon([(cx - half + margin, cy + half - margin),
                  (cx + half - margin, cy + half - margin),
                  (cx, cy + size // 8)], fill=fill_color)
    draw.line([(cx - half // 3, cy), (cx + half // 3, cy)], fill=fill_color, width=2)

def _draw_heart(draw, cx, cy, size, fill_color):
    r = size // 5
    draw.ellipse([cx - r * 1.8, cy - r * 0.3, cx - r * 0.2, cy + r * 1.5], fill=fill_color)
    draw.ellipse([cx + r * 0.2, cy - r * 0.3, cx + r * 1.8, cy + r * 1.5], fill=fill_color)
    draw.polygon([(cx - r * 1.8, cy + r * 0.5), (cx + r * 1.8, cy + r * 0.5),
                  (cx, cy + r * 2)], fill=fill_color)

def _draw_gamepad(draw, cx, cy, size, fill_color):
    half = size // 2
    m = size // 7
    draw_rounded_rect(draw, (cx - half + m, cy - half // 2 + m,
                             cx + half - m, cy + half // 2 + m),
                      radius=half // 2, fill=fill_color)
    br = size // 14
    for dx, dy in [(br, 0), (-br, 0), (0, br), (0, -br)]:
        draw.ellipse([cx + half // 3 + dx - br, cy + dy - br,
                      cx + half // 3 + dx + br, cy + dy + br], fill="#1a0a2e")

def _draw_cards_icon(draw, cx, cy, size, fill_color):
    """Stacked tarot cards (used in place of dice)."""
    card_w = size * 0.6
    card_h = size * 0.85
    offset = size // 8
    draw_rounded_rect(draw, (cx - card_w // 2 + offset, cy - card_h // 2 + offset,
                             cx + card_w // 2 + offset, cy + card_h // 2 + offset),
                      radius=4, fill="#4a2070", outline=fill_color, width=1)
    draw_rounded_rect(draw, (cx - card_w // 2, cy - card_h // 2,
                             cx + card_w // 2, cy + card_h // 2),
                      radius=4, fill="#2a1548", outline=fill_color, width=2)
    _draw_star(draw, cx, cy, size // 5, fill_color)

def _draw_checkmark_circle(draw, cx, cy, size, fill_color):
    r = size // 2
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=fill_color)
    cw = size // 4
    ch = size // 6
    draw.line([(cx - cw, cy), (cx - size // 12, cy + ch)], fill=TEXT_WHITE, width=3)
    draw.line([(cx - size // 12, cy + ch), (cx + cw, cy - ch)], fill=TEXT_WHITE, width=3)

def _draw_moon(draw, cx, cy, size, fill_color):
    r = size // 2
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=fill_color)
    draw.ellipse([cx - r // 2, cy - r, cx + int(r * 0.8), cy + r], fill="#0d0620")

def _draw_lock(draw, cx, cy, size, fill_color):
    bw = size * 0.62
    bh = size * 0.46
    bx = cx - bw // 2
    by = cy + size * 0.04
    arc_r = bh * 0.55
    draw.arc([bx + bw * 0.28, by - arc_r * 0.9,
              bx + bw * 0.72, by + arc_r * 0.5],
             180, 360, fill=fill_color, width=max(2, size // 12))
    draw_rounded_rect(draw, (bx, by, bx + bw, by + bh), radius=4, fill=fill_color)
    kh = size // 9
    draw.ellipse([cx - kh, by + bh * 0.28, cx + kh, by + bh * 0.58], fill="#1a0a2e")
    draw.polygon([(cx - kh // 2, by + bh * 0.52), (cx + kh // 2, by + bh * 0.52),
                  (cx, by + bh * 0.82)], fill="#1a0a2e")

# ════════════════════════════════════════
#  SMALL PROMO 440×280 (BILINGUAL)
# ════════════════════════════════════════

def small_promo():
    W, H = 440, 280
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)
    draw_gradient_bg(draw, W, H)

    icon = load_icon(64)
    img.paste(icon, (28, 22), icon)

    # Bilingual title
    text_left(draw, (108, 30), "魔法塔罗牌 Magic Tarot", font_zh(22, True), fill=TEXT_WHITE)
    text_left(draw, (108, 60), "每日占卜 · Daily Divination", font_zh(16), fill=ACCENT_LIGHT)
    draw.line([(108, 86), (290, 86)], fill=ACCENT_GOLD, width=2)

    # Feature box
    box_x, box_y = 28, 105
    box_w, box_h = W - 56, 120
    draw_rr(draw, (box_x, box_y, box_x + box_w, box_y + box_h),
            radius=14, fill="#15082b", outline=CARD_BORDER, width=1)

    # 4 rows: dot + bilingual text
    rows = [
        "今日运势 Daily Fortune",
        "选择困难助手 · Dilemma Helper",
        "真实抽卡自选牌 · Real Card Picking",
        "AI 智能解读 · AI Interpretation",
    ]
    fy = box_y + 16
    for label in rows:
        dot_r = 4
        cy = fy + 11
        draw.ellipse([box_x + 26 - dot_r, cy - dot_r, box_x + 26 + dot_r, cy + dot_r], fill=ACCENT_GOLD)
        text_left(draw, (box_x + 46, fy + 1), label, font_zh(13), fill=TEXT_SUB)
        fy += 25

    # CTA bilingual
    cta_y = 236
    cta_w = 260
    cta_x = (W - cta_w) // 2
    draw_rr(draw, (cta_x, cta_y, cta_x + cta_w, cta_y + 32), radius=16, fill=ACCENT_GOLD)
    text_center(draw, (W // 2, cta_y + 16), "立即体验 · Try It Free →",
                font_zh(13, True), fill="#1a0a2e")

    return img


# ════════════════════════════════════════
#  LARGE PROMO 1400×560 (BILINGUAL)
# ════════════════════════════════════════

def large_promo():
    W, H = 1400, 560
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)
    draw_gradient_bg(draw, W, H)

    # ── Left: Icon + Bilingual Title (left-aligned, no overlap) ──
    icon = load_icon(100)
    img.paste(icon, (50, 40), icon)

    # Title starts at x=185 to clear icon (50+100=150, +35 margin)
    text_left(draw, (185, 45), "魔法塔罗牌 · Magic Tarot", font_zh(32, True), fill=TEXT_WHITE)
    text_left(draw, (185, 90), "每日占卜 · Daily Divination", font_zh(19), fill=ACCENT_LIGHT)
    draw.line([(185, 124), (540, 124)], fill=ACCENT_GOLD, width=2)

    # ── Left popup mockup ──
    mock_x, mock_y = 50, 150
    mock_w, mock_h = 400, 338
    draw_rr(draw, (mock_x, mock_y, mock_x + mock_w, mock_y + mock_h),
            radius=16, fill="#0a0418", outline=CARD_BORDER, width=2)
    draw_rr(draw, (mock_x + 10, mock_y + 10, mock_x + mock_w - 10, mock_y + 42),
            radius=8, fill="#15082b")
    text_left(draw, (mock_x + 18, mock_y + 17), "魔法主题 · Mystic Theme", font_zh(12), fill=TEXT_SUB)

    # Tool cards - 每个专属图标 + 统一视觉尺寸（~22px）
    tc_y = mock_y + 56
    tc_w = (mock_w - 30) // 3
    mock_tools = [
        ("sun", "今日 Today"),
        ("cards", "命运 Lucky"),
        ("think", "难题 Dilemma"),
    ]
    MT = {"sun": _draw_sun, "cards": _draw_cards_icon, "think": _draw_think_bubble}
    # 视觉统一：sun 参数为半径、核心圆 0.9r；cards/think 参数为直径
    MOCK_ICON_SZ = {"sun": 12, "cards": 22, "think": 20}
    for ti, (ic, lbl) in enumerate(mock_tools):
        tx = mock_x + 12 + ti * (tc_w + 5)
        draw_rr(draw, (tx, tc_y, tx + tc_w - 5, tc_y + 60), radius=8, fill=CARD_BG)
        MT[ic](draw, tx + (tc_w - 5) // 2, tc_y + 22, MOCK_ICON_SZ[ic], ACCENT_GOLD)
        text_center(draw, (tx + (tc_w - 5) // 2, tc_y + 46), lbl, font_zh(11), fill=TEXT_SUB)

    # Spread list
    sl_y = tc_y + 70
    SL = {"sparkle": _draw_sparkle, "hourglass": _draw_hourglass,
          "gamepad": _draw_gamepad, "heart": _draw_heart}
    mock_spreads = [
        ("sparkle", "单牌占卜 Single Card", "1 张"),
        ("hourglass", "三牌占卜 Three Card", "3 张"),
        ("gamepad", "凯尔特十字 Celtic Cross", "10 张"),
        ("heart", "恋人牌阵 Love Spread", "5 张"),
    ]
    for si, (ic, name, cnt) in enumerate(mock_spreads):
        sy = sl_y + si * 48
        draw_rr(draw, (mock_x + 12, sy, mock_x + mock_w - 12, sy + 42), radius=8, fill="#1e0e38")
        # 统一金色圆点（替代大小不一的图标）
        dot_r = 5
        cy = sy + 21
        draw.ellipse([mock_x + 30 - dot_r, cy - dot_r, mock_x + 30 + dot_r, cy + dot_r], fill=ACCENT_GOLD)
        text_left(draw, (mock_x + 48, sy + 12), name, font_zh(12), fill=TEXT_WHITE)
        text_left(draw, (mock_x + mock_w - 56, sy + 12), cnt, font_zh(12), fill=TEXT_SUB)

    # ── Center: Core Features ──
    center_x = 480
    center_y = 150
    center_w = 480
    text_left(draw, (center_x, center_y), "核心功能 · Core Features", font_zh(20, True), fill=ACCENT_GOLD)

    # 统一金色圆点（替代大小不一的图标），圆圈底保留作为视觉容器
    features_main = [
        ("今日运势 Daily Fortune", "AI 深度解读每日命运 · AI-powered daily reading"),
        ("真实抽卡 · 自选牌 Real Card Picking", "整副摊开滑动选牌 · Fan, swipe & pick"),
        ("选择困难症 · Dilemma Helper", "让命运帮你做决定 · Let fate decide for you"),
        ("AI 智能解读 · AI Interpretation", "支持硅基流动 / OpenAI · BYO AI provider"),
    ]
    feat_y = center_y + 38
    for i, (name, desc) in enumerate(features_main):
        fh = 72
        fx = center_x
        fy = feat_y + i * (fh + 10)
        draw_rr(draw, (fx, fy, fx + center_w, fy + fh), radius=12,
                fill="#15082b", outline="#2a1548")
        draw.ellipse([fx + 16, fy + 14, fx + 52, fy + 50], fill="#2a1548", outline=ACCENT_PURPLE, width=1)
        dot_r = 8
        cx = fx + 34
        cy = fy + 32
        draw.ellipse([cx - dot_r, cy - dot_r, cx + dot_r, cy + dot_r], fill=ACCENT_GOLD)
        text_left(draw, (fx + 64, fy + 16), name, font_zh(14, True), fill=TEXT_WHITE)
        text_left(draw, (fx + 64, fy + 42), desc, font_zh(12), fill=TEXT_SUB)

    # ── Right: Highlights + CTA ──
    right_x = 990
    right_y = 150
    text_left(draw, (right_x, right_y), "特色亮点 · Highlights", font_zh(18, True), fill=ACCENT_GOLD)

    highlights = [
        "8 大主题牌组 · 8 Themed Decks",
        "50+ 专业牌阵 · 50+ Pro Spreads",
        "深色魔法主题 · Dark Magical UI",
        "API Key 仅存本地 · Key Stored Locally",
        "全功能免费 · 无限制 · Fully Free · No Limits",
    ]
    hy = right_y + 34
    for hi, txt in enumerate(highlights):
        hh = 44
        hx = right_x
        hyy = hy + hi * (hh + 8)
        draw_rr(draw, (hx, hyy, hx + 370, hyy + hh), radius=10, fill="#1a0a30", outline="#2a1548")
        dot_r = 6
        cx = hx + 28
        cy = hyy + hh // 2
        draw.ellipse([cx - dot_r, cy - dot_r, cx + dot_r, cy + dot_r], fill=ACCENT_GOLD)
        text_left(draw, (hx + 52, hyy + hh // 2 - 9), txt, font_zh(12, True), fill=TEXT_WHITE)

    # Big CTA with correct vertical centering
    cta_x = right_x
    cta_y = hy + len(highlights) * (44 + 8) + 20
    cta_w = 370
    cta_h = 56
    draw_rr(draw, (cta_x, cta_y, cta_x + cta_w, cta_y + cta_h), radius=28, fill=ACCENT_GOLD)
    cta_text = "立即安装体验 · Install Now →"
    cb = draw.textbbox((0, 0), cta_text, font=font_zh(18, True))
    ct_h = cb[3] - cb[1]
    text_center(draw, (cta_x + cta_w // 2, cta_y + cta_h // 2), cta_text,
                font_zh(18, True), fill="#1a0a2e")

    return img


# ════════════════════════════════════════
#  MAIN
# ════════════════════════════════════════

def main():
    os.makedirs(PROMO_DIR, exist_ok=True)
    print("Generating bilingual promo tiles...")

    sp = small_promo()
    sp_path = os.path.join(PROMO_DIR, "promo-small-440x280.png")
    sp.save(sp_path, "PNG")
    print(f"  ✓ promo-small-440x280.png ({os.path.getsize(sp_path)//1024} KB)")

    lp = large_promo()
    lp_path = os.path.join(PROMO_DIR, "promo-large-1400x560.png")
    lp.save(lp_path, "PNG")
    print(f"  ✓ promo-large-1400x560.png ({os.path.getsize(lp_path)//1024} KB)")

    print(f"\nDone! Bilingual promo tiles saved to: {PROMO_DIR}")


if __name__ == "__main__":
    main()
