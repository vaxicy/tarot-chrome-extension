#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Magic Tarot - Chrome Web Store Screenshot Generator
Generates 5 screenshots per language (zh + en) at 1280x800
Output: store-assets/screenshots/{zh,en}/screenshot-{1..5}.png

v2: All emojis replaced with PIL-drawn shapes to avoid □ rendering issues.
"""

import os
import sys
import io
import math
import random
from PIL import Image, ImageDraw, ImageFont

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# ── Paths ──
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
ASSETS_DIR = os.path.join(PROJECT_ROOT, "store-assets")
SCREENSHOTS_DIR = os.path.join(ASSETS_DIR, "screenshots")
ICON_PATH = os.path.join(PROJECT_ROOT, "icons", "icon128.png")

# ── Canvas Size ──
W, H = 1280, 800

# ── Colors (Dark magical theme) ──
BG_TOP = "#0d0620"
BG_BOTTOM = "#1a0a3e"
ACCENT_GOLD = "#ffd700"
ACCENT_PURPLE = "#9b59b6"
ACCENT_LIGHT_PURPLE = "#c9a0dc"
TEXT_WHITE = "#ffffff"
TEXT_SUB = "#c0b8d8"
CARD_BG = "rgba(155,89,182,0.12)"
CARD_BORDER = "#7d3c98"
STARS_COLOR = "#fff8e1"
GREEN_OK = "#2ecc71"
RED_REVERSE = "#e74c3c"

# ── Fonts ──
def get_font(size, bold=False):
    """Try multiple font fallbacks for cross-platform support."""
    font_names = []
    if bold:
        font_names = [
            "msyhbd.ttc", "Microsoft YaHei Bold",
            "PingFang SC Semibold", "Heiti SC Medium",
            "NotoSansCJK-Bold.ttc", "simhei.ttf"
        ]
    else:
        font_names = [
            "msyh.ttc", "Microsoft YaHei",
            "PingFang SC Regular", "Heiti SC Light",
            "NotoSansCJK-Regular.ttc", "simsun.ttc", "simhei.ttf"
        ]
    for name in font_names:
        try:
            return ImageFont.truetype(name, size)
        except:
            continue
    return ImageFont.load_default()

def get_en_font(size, bold=False):
    """English font fallback."""
    names = ["seguiui.ttf", "arial.ttf", "DejaVuSans.ttf"]
    if bold:
        names = ["seguiuib.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf"]
    for name in names:
        try:
            return ImageFont.truetype(name, size)
        except:
            continue
    return get_font(size, bold)

FONT_TITLE_ZH = None  # lazy init
FONT_TITLE_EN = None
_FONT_CACHE = {}

def font_zh(size, bold=False):
    key = ("zh", size, bold)
    if key not in _FONT_CACHE:
        _FONT_CACHE[key] = get_font(size, bold)
    return _FONT_CACHE[key]

def font_en(size, bold=False):
    key = ("en", size, bold)
    if key not in _FONT_CACHE:
        _FONT_CACHE[key] = get_en_font(size, bold)
    return _FONT_CACHE[key]


# ════════════════════════════════════════════════
#  DRAWING HELPERS
# ════════════════════════════════════════════════

def draw_gradient_bg(draw, w, h):
    """Dark purple gradient background with stars."""
    for y in range(h):
        ratio = y / h
        r = int(13 + (26 - 13) * ratio)
        g = int(6 + (10 - 6) * ratio)
        b = int(32 + (62 - 32) * ratio)
        draw.line([(0, y), (w, y)], fill=(r, g, b))
    
    # Add scattered stars
    random.seed(42)
    for _ in range(80):
        sx = random.randint(0, w)
        sy = random.randint(0, h)
        sr = random.choice([1, 1, 1, 2])
        alpha = random.randint(100, 255)
        draw.ellipse([sx-sr, sy-sr, sx+sr, sy+sr], fill=(255, 248, 225, alpha))


def draw_rounded_rect(draw, coords, radius, fill=None, outline=None, width=1):
    """Draw a rounded rectangle."""
    x1, y1, x2, y2 = coords
    if fill:
        draw.rectangle([x1+radius, y1, x2-radius, y2], fill=fill)
        draw.rectangle([x1, y1+radius, x2, y2-radius], fill=fill)
        draw.pieslice([x1, y1, x1+2*radius, y1+2*radius], 180, 270, fill=fill)
        draw.pieslice([x2-2*radius, y1, x2, y1+2*radius], 270, 360, fill=fill)
        draw.pieslice([x1, y2-2*radius, x1+2*radius, y2], 90, 180, fill=fill)
        draw.pieslice([x2-2*radius, y2-2*radius, x2, y2], 0, 90, fill=fill)
    if outline:
        draw.rounded_rectangle(coords, radius=radius, outline=outline, width=width)


def draw_stars_decor(draw, cx, cy, count=5, spread=30):
    """Draw small star decorations around a point."""
    random.seed(hash((cx, cy)) % (2**31))
    for _ in range(count):
        angle = random.uniform(0, 2 * math.pi)
        dist = random.uniform(spread * 0.5, spread)
        sx = cx + int(dist * math.cos(angle))
        sy = cy + int(dist * math.sin(angle))
        sr = random.choice([1, 1, 2])
        draw.ellipse([sx-sr, sy-sr, sx+sr, sy+sr], fill=STARS_COLOR)


def text_center(draw, xy, text, font, fill=TEXT_WHITE):
    """Draw centered text, return bounding box."""
    bbox = draw.textbbox(xy, text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x, y = xy
    draw.text((x - tw // 2, y - th // 2), text, font=font, fill=fill)
    return (x - tw // 2, y - th // 2, x + tw // 2, y + th // 2)


def text_left(draw, xy, text, font, fill=TEXT_WHITE):
    """Draw left-aligned text."""
    draw.text(xy, text, font=font, fill=fill)


def load_icon(size=128):
    """Load and resize extension icon."""
    try:
        icon = Image.open(ICON_PATH).convert("RGBA")
        return icon.resize((size, size), Image.LANCZOS)
    except:
        # Fallback: draw a tarot-style card icon
        img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        d = ImageDraw.Draw(img)
        # Card shape with gold border
        margin = size // 8
        draw_rounded_rect(d, (margin, margin, size - margin, size - margin),
                         radius=size//10, fill="#2a1548", outline=ACCENT_GOLD, width=3)
        # Star in center
        cx, cy = size // 2, size // 2
        _draw_star(d, cx, cy, size//4, ACCENT_GOLD)
        return img


# ════════════════════════════════════════════════
#  ICON DRAWING FUNCTIONS (replace emojis)
# ════════════════════════════════════════════════

def _draw_star(draw, cx, cy, outer_r, fill_color, points=5):
    """Draw a star shape at (cx, cy)."""
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
    """Draw a sun icon (circle + rays)."""
    # Center circle
    draw.ellipse([cx - radius*0.45, cy - radius*0.45,
                  cx + radius*0.45, cy + radius*0.45], fill=fill_color)
    # Rays
    ray_len = radius * 0.35
    for i in range(8):
        angle = i * math.pi / 4
        x1 = cx + radius * 0.55 * math.cos(angle)
        y1 = cy - radius * 0.55 * math.sin(angle)
        x2 = cx + (radius * 0.55 + ray_len) * math.cos(angle)
        y2 = cy - (radius * 0.55 + ray_len) * math.sin(angle)
        draw.line([(x1, y1), (x2, y2)], fill=fill_color, width=2)


def _draw_dice(draw, cx, cy, size, fill_color, dot_color=TEXT_WHITE):
    """Draw a dice icon (rounded square with dots)."""
    half = size // 2
    margin = size // 8
    # Dice body
    draw_rounded_rect(draw, (cx - half + margin, cy - half + margin,
                             cx + half - margin, cy + half - margin),
                      radius=size//8, fill=fill_color)
    # Dots (showing 5 pattern)
    dot_r = size // 10
    dc = cx
    # Center dot
    draw.ellipse([dc - dot_r, cy - dot_r, dc + dot_r, cy + dot_r], fill=dot_color)
    # Corner dots
    offset = size // 4
    for dx, dy in [(-offset, -offset), (offset, -offset), (-offset, offset), (offset, offset)]:
        draw.ellipse([dc + dx - dot_r, cy + dy - dot_r,
                      dc + dx + dot_r, cy + dy + dot_r], fill=dot_color)


def _draw_think_bubble(draw, cx, cy, size, fill_color):
    """Draw a thinking bubble icon."""
    half = size // 2
    # Main bubble (ellipse)
    draw.ellipse([cx - half, cy - half - size//6,
                  cx + half, cy + half - size//6], fill=fill_color)
    # Small bubbles below
    s1 = size // 5
    draw.ellipse([cx - half//2 - s1, cy + half - size//6,
                  cx - half//2 + s1, cy + half - size//6 + s1*2], fill=fill_color)
    s2 = size // 7
    draw.ellipse([cx - half//4 - s2, cy + half - size//6 + s1*2 + 2,
                  cx - half//4 + s2, cy + half - size//6 + s1*2 + s2*2], fill=fill_color)
    # Question mark
    q_font = font_zh(int(size * 0.5), True)
    text_center(draw, (cx, cy - size//12), "?", q_font, TEXT_WHITE)


def _draw_tarot_card(draw, cx, cy, w, h, fill_color, border_color=ACCENT_PURPLE):
    """Draw a mini tarot card shape."""
    draw_rounded_rect(draw, (cx - w//2, cy - h//2, cx + w//2, cy + h//2),
                      radius=w//10, fill=fill_color, outline=border_color, width=2)
    # Star symbol on card
    _draw_star(draw, cx, cy, min(w, h)//4, ACCENT_GOLD)


def _draw_sparkle(draw, cx, cy, size, fill_color):
    """Draw a sparkle ✨ icon (4-pointed star)."""
    pts = []
    for i in range(8):
        angle = i * math.pi / 4
        r = size if i % 2 == 0 else size * 0.3
        px = cx + r * math.cos(angle)
        py = cy - r * math.sin(angle)
        pts.append((px, py))
    draw.polygon(pts, fill=fill_color)


def _draw_hourglass(draw, cx, cy, size, fill_color):
    """Draw an hourglass ⏳ icon."""
    half = size // 2
    margin = size // 6
    # Top triangle
    draw.polygon([(cx - half + margin, cy - half + margin),
                  (cx + half - margin, cy - half + margin),
                  (cx, cy - size//8)], fill=fill_color)
    # Bottom triangle
    draw.polygon([(cx - half + margin, cy + half - margin),
                  (cx + half - margin, cy + half - margin),
                  (cx, cy + size//8)], fill=fill_color)
    # Middle line
    draw.line([(cx - half//3, cy), (cx + half//3, cy)], fill=fill_color, width=2)


def _draw_yin_yang(draw, cx, cy, size, fill_color):
    """Draw a yin-yang ☯ symbol."""
    r = size // 2
    # Outer circle
    draw.ellipse([cx - r, cy - r, cx + r, cy + r],
                 fill="#1a0a2e", outline=fill_color, width=2)
    # Simplified: two arcs
    r2 = r * 0.48
    draw.pieslice([cx - r2, cy - r, cx + r2, cy + r], 0, 180, fill=fill_color)
    draw.pieslice([cx - r2, cy - r, cx + r2, cy + r], 180, 360, fill="#1a0a2e")
    # Dots
    dr = r * 0.15
    draw.ellipse([cx - dr, cy - r*0.5 - dr, cx + dr, cy - r*0.5 + dr], fill=fill_color)
    draw.ellipse([cx - dr, cy + r*0.5 - dr, cx + dr, cy + r*0.5 + dr], fill="#1a0a2e")


def _draw_heart(draw, cx, cy, size, fill_color):
    """Draw a heart ❤️ icon."""
    # Two circles + triangle approach
    r = size // 5
    draw.ellipse([cx - r*1.8, cy - r*0.3, cx - r*0.2, cy + r*1.5], fill=fill_color)
    draw.ellipse([cx + r*0.2, cy - r*0.3, cx + r*1.8, cy + r*1.5], fill=fill_color)
    draw.polygon([(cx - r*1.8, cy + r*0.5), (cx + r*1.8, cy + r*0.5),
                  (cx, cy + r*2)], fill=fill_color)


def _draw_gamepad(draw, cx, cy, size, fill_color):
    """Draw a gamepad 🎮 icon."""
    half = size // 2
    m = size // 7
    # Body
    draw_rounded_rect(draw, (cx - half + m, cy - half//2 + m,
                             cx + half - m, cy + half//2 + m),
                      radius=half//2, fill=fill_color)
    # Left stick
    draw.ellipse([cx - half//2 - size//10, cy - size//12,
                  cx - half//2 + size//10, cy + size//12], fill="#1a0a2e")
    # Right buttons
    br = size // 14
    for dx, dy in [(br, 0), (-br, 0), (0, br), (0, -br)]:
        draw.ellipse([cx + half//3 + dx - br, cy + dy - br,
                      cx + half//3 + dx + br, cy + dy + br], fill="#1a0a2e")


def _draw_cards_icon(draw, cx, cy, size, fill_color):
    """Draw stacked cards 🎴 icon."""
    card_w = size * 0.6
    card_h = size * 0.85
    offset = size // 8
    # Back card
    draw_rounded_rect(draw, (cx - card_w//2 + offset, cy - card_h//2 + offset,
                             cx + card_w//2 + offset, cy + card_h//2 + offset),
                      radius=4, fill="#4a2070", outline=fill_color, width=1)
    # Front card
    draw_rounded_rect(draw, (cx - card_w//2, cy - card_h//2,
                             cx + card_w//2, cy + card_h//2),
                      radius=4, fill="#2a1548", outline=fill_color, width=2)
    # Star on front
    _draw_star(draw, cx, cy, size//5, fill_color)


def _draw_checkmark_circle(draw, cx, cy, size, fill_color):
    """Draw a checkmark in circle ✅ icon."""
    r = size // 2
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=fill_color)
    # Checkmark
    cw = size // 4
    ch = size // 6
    draw.line([(cx - cw, cy), (cx - size//12, cy + ch)], fill=TEXT_WHITE, width=3)
    draw.line([(cx - size//12, cy + ch), (cx + cw, cy - ch)], fill=TEXT_WHITE, width=3)


def _draw_globe(draw, cx, cy, size, fill_color):
    """Draw a globe 🌐 icon."""
    r = size // 2
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=fill_color, width=2)
    # Latitude lines
    draw.arc([cx - r, cy - r, cx + r, cy + r], 0, 180, fill=fill_color, width=1)
    # Longitude lines
    draw.line([(cx, cy - r), (cx, cy + r)], fill=fill_color, width=1)
    draw.ellipse([cx - r//2, cy - r, cx + r//2, cy + r], outline=fill_color, width=1)


def _draw_moon(draw, cx, cy, size, fill_color):
    """Draw a moon 🌙 icon."""
    r = size // 2
    # Crescent shape via two overlapping circles
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=fill_color)
    draw.ellipse([cx - r//2, cy - r, cx + int(r*0.8), cy + r], fill="#0d0620")


def _draw_lock(draw, cx, cy, size, fill_color):
    """Draw a lock 🔒 icon."""
    bw = size * 0.65
    bh = size * 0.5
    bx = cx - bw // 2
    by = cy
    # Shackle
    arc_r = bh * 0.55
    draw.arc([bx + bw*0.25, by - bh*0.7, bx + bw*0.75, by + bh*0.1],
             0, 180, fill=fill_color, width=max(2, size//10))
    # Body
    draw_rounded_rect(draw, (bx, by, bx + bw, by + bh), radius=4, fill=fill_color)
    # Keyhole
    kh = size // 8
    draw.ellipse([cx - kh, by + bh*0.25, cx + kh, by + bh*0.55], fill="#1a0a2e")
    draw.polygon([(cx - kh//2, by + bh*0.5), (cx + kh//2, by + bh*0.5),
                  (cx, by + bh*0.8)], fill="#1a0a2e")


def _draw_refresh(draw, cx, cy, size, fill_color):
    """Draw a refresh 🔄 icon."""
    r = size // 2 - 2
    # Arc
    draw.arc([cx - r, cy - r, cx + r, cy + r], 30, 300, fill=fill_color, width=max(2, size//8))
    # Arrow head
    arrow_len = size // 4
    ax = cx + r * math.cos(math.radians(30))
    ay = cy - r * math.sin(math.radians(30))
    draw.polygon([(ax, ay), (ax - arrow_len//2, ay + arrow_len//3),
                  (ax, ay + arrow_len//2)], fill=fill_color)


def _draw_bookmark(draw, cx, cy, size, fill_color):
    """Draw a bookmark/ribbon icon."""
    hw = size // 2
    hh = size * 0.7
    draw.polygon([(cx - hw, cy - hh), (cx + hw, cy - hh),
                  (cx + hw, cy + hh//3), (cx, cy + hh),
                  (cx - hw, cy + hh//3)], fill=fill_color)


def _draw_clipboard(draw, cx, cy, size, fill_color):
    """Draw a clipboard 📋 icon."""
    bw = max(int(size * 0.6), 8)
    bh = max(int(size * 0.8), 10)
    bx = cx - bw // 2
    by = cy - bh // 2 + size // 10
    # Clip at top
    clip_w = max(int(bw * 0.5), 6)
    clip_h = max(size // 5, 4)
    draw_rounded_rect(draw, (cx - clip_w//2, by - clip_h, cx + clip_w//2, by + clip_h),
                      radius=3, fill=fill_color)
    # Board body
    draw_rounded_rect(draw, (bx, by, bx + bw, by + bh), radius=3,
                      fill="#1a0a2e", outline=fill_color, width=1)
    # Lines on board
    lh = max(size // 12, 2)
    for i in range(3):
        ly = by + bh//4 + i * (lh + 2)
        if ly < by + bh - 2:
            draw.line([(bx + bw//6, ly), (bx + bw - bw//6, ly)],
                      fill=fill_color, width=1)


def _draw_speaker(draw, cx, cy, size, fill_color):
    """Draw speaker/volume icon."""
    # Speaker body
    bw = size * 0.35
    bh = size * 0.45
    sx = cx - size // 3
    sy = cy - bh // 2
    draw.polygon([(sx, sy + bh//4), (sx + bw*0.6, sy),
                  (sx + bw*0.6, sy + bh), (sx, sy + bh*0.75)], fill=fill_color)
    # Sound waves
    wx = sx + bw + size//10
    for i in range(3):
        wr = size//6 + i * size//10
        draw.arc([wx, cy - wr, wx + wr*2, cy + wr], -60, 60,
                 fill=fill_color, width=max(1, size//16))


def _draw_target(draw, cx, cy, size, fill_color):
    """Draw target/bullseye icon."""
    r = size // 2
    # Outer ring
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=fill_color, width=2)
    # Middle ring
    mr = r * 0.6
    draw.ellipse([cx - mr, cy - mr, cx + mr, cy + mr], outline=fill_color, width=1)
    # Inner dot
    ir = r * 0.2
    draw.ellipse([cx - ir, cy - ir, cx + ir, cy + ir], fill=fill_color)


def _draw_infinity(draw, cx, cy, size, fill_color):
    """Draw infinity ∞ symbol."""
    r = size // 4
    # Left loop
    draw.arc([cx - r*2.2, cy - r, cx - r*0.2, cy + r], 0, 180,
             fill=fill_color, width=max(2, size//10))
    # Right loop
    draw.arc([cx + r*0.2, cy - r, cx + r*2.2, cy + r], 0, 180,
             fill=fill_color, width=max(2, size//10))


def _draw_lightning(draw, cx, cy, size, fill_color):
    """Draw lightning bolt ⚡ icon."""
    hw = size * 0.25
    hh = size * 0.7
    pts = [
        (cx - hw*0.3, cy - hh),
        (cx - hw, cy - hh*0.15),
        (cx + hw*0.2, cy - hh*0.15),
        (cx - hw*0.1, cy + hh*0.1),
        (cx + hw, cy + hh*0.15),
        (cx + hw*0.3, cy + hh*0.15),
        (cx + hw*0.1, cy + hh),
    ]
    draw.polygon(pts, fill=fill_color)


def _draw_robot(draw, cx, cy, size, fill_color):
    """Draw robot/AI 🤖 icon."""
    hw = size * 0.4
    hh = size * 0.4
    # Head
    draw_rounded_rect(draw, (cx - hw, cy - hh, cx + hw, cy + hh),
                      radius=6, fill=fill_color)
    # Eyes
    er = size // 10
    draw.ellipse([cx - hw//2 - er, cy - hh//3 - er,
                  cx - hw//2 + er, cy - hh//3 + er], fill="#1a0a2e")
    draw.ellipse([cx + hw//2 - er, cy - hh//3 - er,
                  cx + hw//2 + er, cy - hh//3 + er], fill="#1a0a2e")
    # Antenna
    draw.line([(cx, cy - hh), (cx, cy - hh - size//5)], fill=fill_color, width=2)
    draw.ellipse([cx - size//20, cy - hh - size//5 - size//14,
                  cx + size//20, cy - hh - size//5 + size//20], fill=fill_color)


def _draw_palette(draw, cx, cy, size, fill_color):
    """Draw color palette 🎨 icon."""
    r = size // 2 - 2
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=fill_color)
    # Color dots
    colors = ["#e74c3c", "#f39c12", "#2ecc71", "#3498db", "#9b59b6"]
    dr = size // 10
    for i, clr in enumerate(colors):
        angle = -math.pi/3 + i * math.pi/6
        dx = r * 0.55 * math.cos(angle)
        dy = r * 0.55 * math.sin(angle)
        draw.ellipse([cx + dx - dr, cy + dy - dr, cx + dx + dr, cy + dy + dr], fill=clr)
    # Hole
    hr = r * 0.28
    draw.ellipse([cx - hr, cy + hr*0.5, cx + hr, cy + hr*1.5], fill="#1a0a2e")


def _draw_rock_paper_scissors(draw, cx, cy, size, fill_color):
    """Draw RPS icon (three-fingered hand / scissors shape)."""
    r = size // 2 - 2
    # Outer circle (hand boundary)
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=fill_color)
    # Draw a simple V shape for scissors/choice gesture
    pen_w = max(2, size // 10)
    # Two fingers as lines from center
    angle_spread = 0.5
    for sign in [-1, 1]:
        fx = cx + int(r * 0.6 * math.cos(sign * angle_spread))
        fy = cy - int(r * 0.6 * math.sin(sign * angle_spread))
        draw.line([(cx, cy + r * 0.2), (fx, fy)], fill="#1a0a2e", width=pen_w)


# Icon dispatcher: maps semantic names to drawing functions
ICONS = {
    'sun':       lambda d,cx,cy,s,_fc=None: _draw_sun(d, cx, cy, s, _fc or ACCENT_GOLD),
    'dice':      lambda d,cx,cy,s,_fc=None: _draw_dice(d, cx, cy, s, _fc or ACCENT_LIGHT_PURPLE, TEXT_WHITE),
    'think':     lambda d,cx,cy,s,_fc=None: _draw_think_bubble(d, cx, cy, s, _fc or ACCENT_LIGHT_PURPLE),
    'star':      lambda d,cx,cy,s,_fc=None: _draw_star(d, cx, cy, s//2, _fc or ACCENT_GOLD),
    'sparkle':   lambda d,cx,cy,s,_fc=None: _draw_sparkle(d, cx, cy, s//2, _fc or ACCENT_GOLD),
    'hourglass': lambda d,cx,cy,s,_fc=None: _draw_hourglass(d, cx, cy, s, _fc or ACCENT_GOLD),
    'yinyang':   lambda d,cx,cy,s,_fc=None: _draw_yin_yang(d, cx, cy, s, _fc or ACCENT_GOLD),
    'heart':     lambda d,cx,cy,s,_fc=None: _draw_heart(d, cx, cy, s, _fc or RED_REVERSE),
    'gamepad':   lambda d,cx,cy,s,_fc=None: _draw_gamepad(d, cx, cy, s, _fc or ACCENT_PURPLE),
    'cards':     lambda d,cx,cy,s,_fc=None: _draw_cards_icon(d, cx, cy, s, _fc or ACCENT_GOLD),
    'check':     lambda d,cx,cy,s,_fc=None: _draw_checkmark_circle(d, cx, cy, s, _fc or GREEN_OK),
    'globe':     lambda d,cx,cy,s,_fc=None: _draw_globe(d, cx, cy, s, _fc or ACCENT_LIGHT_PURPLE),
    'moon':      lambda d,cx,cy,s,_fc=None: _draw_moon(d, cx, cy, s, _fc or ACCENT_LIGHT_PURPLE),
    'lock':      lambda d,cx,cy,s,_fc=None: _draw_lock(d, cx, cy, s, _fc or TEXT_SUB),
    'refresh':   lambda d,cx,cy,s,_fc=None: _draw_refresh(d, cx, cy, s, _fc or ACCENT_PURPLE),
    'bookmark':  lambda d,cx,cy,s,_fc=None: _draw_bookmark(d, cx, cy, s, _fc or ACCENT_GOLD),
    'clipboard': lambda d,cx,cy,s,_fc=None: _draw_clipboard(d, cx, cy, s, _fc or ACCENT_LIGHT_PURPLE),
    'speaker':   lambda d,cx,cy,s,_fc=None: _draw_speaker(d, cx, cy, s, _fc or TEXT_WHITE),
    'target':    lambda d,cx,cy,s,_fc=None: _draw_target(d, cx, cy, s, _fc or ACCENT_GOLD),
    'infinity':  lambda d,cx,cy,s,_fc=None: _draw_infinity(d, cx, cy, s, _fc or ACCENT_GOLD),
    'lightning': lambda d,cx,cy,s,_fc=None: _draw_lightning(d, cx, cy, s, _fc or ACCENT_GOLD),
    'robot':     lambda d,cx,cy,s,_fc=None: _draw_robot(d, cx, cy, s, _fc or ACCENT_PURPLE),
    'palette':   lambda d,cx,cy,s,_fc=None: _draw_palette(d, cx, cy, s, _fc or ACCENT_PURPLE),
    'tarot':     lambda d,cx,cy,s,_fc=None: _draw_tarot_card(d, cx, cy, s, int(s*1.4), _fc or "#2a1548"),
    'rps':       lambda d,cx,cy,s,_fc=None: _draw_rock_paper_scissors(d, cx, cy, s, _fc or ACCENT_PURPLE),
}


def draw_icon(draw, cx, cy, name, size, color=None):
    """Dispatch to the correct icon drawing function."""
    if name in ICONS:
        ICONS[name](draw, cx, cy, size, color)
    else:
        # Fallback: draw a simple circle with star
        draw.ellipse([cx - size//2, cy - size//2, cx + size//2, cy + size//2],
                     fill=color or ACCENT_PURPLE)
        _draw_star(draw, cx, cy, size//3, ACCENT_GOLD)


def draw_icon_in_circle(draw, cx, cy, icon_name, circle_r, icon_size=None):
    """Draw an icon centered inside a colored circle."""
    if icon_size is None:
        icon_size = int(circle_r * 0.9)
    # Circle background
    draw.ellipse([cx - circle_r, cy - circle_r, cx + circle_r, cy + circle_r],
                fill="#3d2066", outline=ACCENT_PURPLE, width=2)
    # Icon
    draw_icon(draw, cx, cy, icon_name, icon_size)


# ════════════════════════════════════════════════
#  SCREENSHOT FUNCTIONS
# ════════════════════════════════════════════════

def screenshot_1(lang="zh"):
    """Hero / Welcome page — shows the main interface overview."""
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)
    draw_gradient_bg(draw, W, H)
    
    is_zh = lang == "zh"
    
    # ── Top Banner Area ──
    banner_h = 220
    
    # Icon
    icon = load_icon(120)
    img.paste(icon, (80, 50), icon)
    
    # Title (left-aligned from icon right edge to avoid overlap)
    title = "魔法塔罗牌 · 每日占卜" if is_zh else "Magic Tarot · Daily Divination"
    subtitle = "探索魔法世界的命运指引" if is_zh else "Discover your destiny through magic"
    
    text_left(draw, (220, 70), title, font_zh(36, True), fill=TEXT_WHITE)
    text_left(draw, (220, 115), subtitle, font_zh(20), fill=TEXT_SUB)
    
    # Decorative stars near title
    draw_stars_decor(draw, 420, 90, 8, 40)
    
    # Gold underline under subtitle
    draw.line([(220, 148), (460, 148)], fill=ACCENT_GOLD, width=2)
    
    # ── Tool Cards Row ──
    card_y = 260
    card_w, card_h = 350, 130
    card_gap = 30
    start_x = (W - 3 * card_w - 2 * card_gap) // 2
    
    tools = [
        ('sun', "今日运势" if is_zh else "Daily Fortune", "AI 深度解读每日指引" if is_zh else "AI-powered daily reading"),
        ('cards', "命运数字" if is_zh else "Lucky Numbers", "塔罗指引的幸运数字" if is_zh else "Tarot-guided luck"),
        ('think', "选择困难症" if is_zh else "Dilemma Helper", "随机帮你做决定" if is_zh else "Let fate decide"),
    ]
    
    for i, (icon_name, label, desc) in enumerate(tools):
        cx = start_x + i * (card_w + card_gap)
        
        # Card bg
        draw_rounded_rect(draw, (cx, card_y, cx + card_w, card_y + card_h),
                         radius=16, fill="#2a1548", outline=CARD_BORDER, width=1)
        
        # Icon circle with drawn icon — per-icon size override for uniformity
        icon_cx = cx + 55
        icon_cy = card_y + card_h // 2
        TOOL_ICON_SIZE = {"sun": 32, "cards": 36, "think": 34}
        actual_size = TOOL_ICON_SIZE.get(icon_name, 36)
        draw_icon_in_circle(draw, icon_cx, icon_cy, icon_name, 28, actual_size)
        
        # Label & desc
        text_left(draw, (cx + 100, card_y + 35), label, font_zh(22, True), fill=TEXT_WHITE)
        text_left(draw, (cx + 100, card_y + 72), desc, font_zh(15), fill=TEXT_SUB)
    
    # ── Deck Tags Section ──
    deck_y = 430
    deck_label = "8 大主题牌组" if is_zh else "8 Themed Decks"
    text_left(draw, (80, deck_y), deck_label, font_zh(18, True), fill=ACCENT_GOLD)
    
    decks = ["Magic", "Rider-Waite", "Marseille", "Thoth", "Angel", "Healing", "Osho Zen", "Stellar"]
    tag_y = deck_y + 35
    tag_x = 80
    tag_gap = 10
    for deck in decks:
        tw = draw.textlength(deck, font=font_en(14))
        draw_rounded_rect(draw, (tag_x, tag_y, tag_x + tw + 20, tag_y + 32),
                         radius=16, fill="#2a1548", outline="#5a2d82")
        text_center(draw, (tag_x + tw//2 + 10, tag_y + 16), deck, font=font_en(14), fill=TEXT_WHITE)
        tag_x += tw + 20 + tag_gap
    
    # ── Spread Preview Cards ──
    preview_y = 520
    preview_label = "热门牌阵" if is_zh else "Popular Spreads"
    text_left(draw, (80, preview_y), preview_label, font_zh(18, True), fill=ACCENT_GOLD)
    
    spreads = [
        ('sparkle', "单牌占卜" if is_zh else "Single Card", "1 张牌 · 每日指引" if is_zh else "1 card · Daily guidance"),
        ('hourglass', "三牌占卜" if is_zh else "Three Card", "3 张牌 · 过去·现在·未来" if is_zh else "3 cards · Past·Present·Future"),
        ('cards', "凯尔特十字" if is_zh else "Celtic Cross", "10 张牌 · 全面解读" if is_zh else "10 cards · Full reading"),
    ]
    
    pc_w, pc_h = 340, 85
    pc_gap = 25
    pc_start_x = 80
    for i, (icon_name, name, desc) in enumerate(spreads):
        px = pc_start_x + i * (pc_w + pc_gap)
        draw_rounded_rect(draw, (px, preview_y + 35, px + pc_w, preview_y + 35 + pc_h),
                         radius=12, fill="#1e0e38", outline="#4a2070", width=1)
        # Draw icon instead of emoji
        draw_icon(draw, px + 27, preview_y + 60, icon_name, 24)
        text_left(draw, (px + 50, preview_y + 45), name, font_zh(17, True), fill=TEXT_WHITE)
        text_left(draw, (px + 50, preview_y + 73), desc, font_zh(13), fill=TEXT_SUB)
    
    # ── Bottom Feature Bar ──
    bar_y = 700
    draw_rounded_rect(draw, (60, bar_y, W - 60, bar_y + 55), radius=27,
                     fill="#1a0a30", outline="#3d1a66", width=1)
    
    # Draw checkmark + text features
    feat_items_zh = [("check", "全功能免费"), ("globe", "中英双语"), ("moon", "深色主题"), ("lock", "隐私安全")]
    feat_items_en = [("check", "Fully Free"), ("globe", "Bilingual UI"), ("moon", "Dark Theme"), ("lock", "Privacy Safe")]
    feat_items = feat_items_zh if is_zh else feat_items_en
    
    fx = 120
    spacing = 280
    for idx, (icon_name, txt) in enumerate(feat_items):
        ix = fx + idx * spacing
        draw_icon(draw, ix, bar_y + 28, icon_name, 16)
        text_left(draw, (ix + 20, bar_y + 20), txt, font_zh(16), fill=TEXT_SUB)
    
    return img


def screenshot_2(lang="zh"):
    """Deck selector & spread list view."""
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)
    draw_gradient_bg(draw, W, H)
    
    is_zh = lang == "zh"
    
    # ── Header ──
    header_title = "牌组与牌阵" if is_zh else "Decks & Spreads"
    text_center(draw, (W // 2, 45), header_title, font_zh(32, True), fill=TEXT_WHITE)
    draw.line([(W//2 - 200, 75), (W//2 + 200, 75)], fill=ACCENT_GOLD, width=2)
    
    # ── Deck Selector Bar ──
    bar_y = 100
    bar_label = "选择你的牌组" if is_zh else "Choose Your Deck"
    text_left(draw, (60, bar_y), bar_label, font_zh(18, True), fill=ACCENT_GOLD)
    
    decks_zh = ["魔法主题", "伟特塔罗", "马赛塔罗", "托特塔罗", "天使", "治愈", "奥修禅卡", "星辰"]
    decks_en = ["Magic", "Rider-Waite", "Marseille", "Thoth", "Angel", "Healing", "Osho Zen", "Stellar"]
    decks = decks_zh if is_zh else decks_en
    
    sel_y = bar_y + 32
    sel_x = 60
    sel_gap = 8
    for i, deck in enumerate(decks):
        is_selected = (i == 0)
        tw = draw.textlength(deck, font=font_zh(14))
        bg_color = ACCENT_PURPLE if is_selected else "#2a1548"
        border_color = ACCENT_GOLD if is_selected else "#4a2070"
        draw_rounded_rect(draw, (sel_x, sel_y, sel_x + tw + 24, sel_y + 36),
                         radius=18, fill=bg_color, outline=border_color, width=1 if is_selected else 0)
        text_center(draw, (sel_x + tw//2 + 12, sel_y + 18), deck, font=font_zh(14),
                   fill=TEXT_WHITE if is_selected else TEXT_SUB)
        sel_x += tw + 24 + sel_gap
    
    # ── Filter Tags ──
    filter_y = 195
    filter_label = "牌阵分类" if is_zh else "Categories"
    text_left(draw, (60, filter_y), filter_label, font_zh(18, True), fill=ACCENT_GOLD)
    
    filters_zh = ["全部", "入门经典", "情感", "决策", "生活", "运势", "事业", "灵性"]
    filters_en = ["All", "Classic", "Love", "Decision", "Life", "Fortune", "Career", "Spiritual"]
    filters = filters_zh if is_zh else filters_en
    
    fil_y = filter_y + 32
    fil_x = 60
    fil_gap = 8
    for i, f in enumerate(filters):
        is_active = (i == 0)
        tw = draw.textlength(f, font=font_zh(13))
        bg = "#3d2066" if is_active else "#1e0e38"
        fc = TEXT_WHITE if is_active else TEXT_SUB
        draw_rounded_rect(draw, (fil_x, fil_y, fil_x + tw + 20, fil_y + 34),
                         radius=17, fill=bg)
        text_center(draw, (fil_x + tw//2 + 10, fil_y + 17), f, font=font_zh(13), fill=fc)
        fil_x += tw + 20 + fil_gap
    
    # ── Spread Cards Grid (2 columns) ──
    grid_y = 290
    grid_label = "热门牌阵" if is_zh else "Popular Spreads"
    text_left(draw, (60, grid_y), grid_label, font_zh(18, True), fill=ACCENT_GOLD)
    
    spreads_data = [
        ('sparkle', "单牌占卜" if is_zh else "Single Draw",
         "1 张牌 · 每日指引 / 快速决策" if is_zh else "1 card · Daily guidance / Quick decision"),
        ('hourglass', "三牌占卜" if is_zh else "Three Card",
         "3 张牌 · 过去 · 现在 · 未来" if is_zh else "3 cards · Past · Present · Future"),
        ('yinyang', "是否牌阵" if is_zh else "Yes/No Spread",
         "3 张牌 · 是/否决策指引" if is_zh else "3 cards · Yes/No decision guide"),
        ('heart', "恋人牌阵" if is_zh else "Lovers Spread",
         "5 张牌 · 恋爱关系全面分析" if is_zh else "5 cards · Relationship analysis"),
        ('cards', "凯尔特十字" if is_zh else "Celtic Cross",
         "10 张牌 · 经典全面解读" if is_zh else "10 cards · Classic full reading"),
        ('cards', "马赞牌阵" if is_zh else "Horseshoe",
         "7 张牌 · 详细情况分析" if is_zh else "7 cards · Detailed situation analysis"),
    ]
    
    sc_w, sc_h = 560, 90
    sc_gap_x, sc_gap_y = 25, 15
    cols = 2
    for idx, (icon_name, name, desc) in enumerate(spreads_data):
        row = idx // cols
        col = idx % cols
        sx = 60 + col * (sc_w + sc_gap_x)
        sy = grid_y + 38 + row * (sc_h + sc_gap_y)
        
        draw_rounded_rect(draw, (sx, sy, sx + sc_w, sy + sc_h),
                         radius=14, fill="#1e0e38", outline="#3d1a66", width=1)
        
        # Draw icon instead of emoji
        draw_icon(draw, sx + 34, sy + 23, icon_name, 22)
        text_left(draw, (sx + 58, sy + 14), name, font_zh(18, True), fill=TEXT_WHITE)
        text_left(draw, (sx + 58, sy + 48), desc, font_zh(14), fill=TEXT_SUB)
        
        # Recommended badge on first two
        if idx < 2:
            badge_text = "★ 推荐" if is_zh else "★ TOP"
            btw = draw.textlength(badge_text, font=font_zh(11))
            bx = sx + sc_w - btw - 15
            draw_rounded_rect(draw, (bx, sy + 8, sx + sc_w - 8, sy + 30),
                             radius=8, fill=ACCENT_GOLD)
            text_center(draw, (bx + btw//2 + 4, sy + 19), badge_text, font=font_zh(11, True), fill="#1a0a2e")
    
    # ── Bottom stats bar ──
    stats_y = 720
    stats = [
        ("8", "套牌组" if is_zh else "Decks"),
        ("50+", "牌阵" if is_zh else "Spreads"),
        ("9", "大分类" if is_zh else "Categories"),
        ("∞", "免费" if is_zh else "Free"),
    ]
    stat_w = 250
    stat_start = (W - len(stats) * stat_w - (len(stats)-1) * 20) // 2
    for i, (num, label) in enumerate(stats):
        stx = stat_start + i * (stat_w + 20)
        draw_rounded_rect(draw, (stx, stats_y, stx + stat_w, stats_y + 55),
                         radius=12, fill="#1a0a30", outline="#3d1a66")
        if num == "∞":
            draw_icon(draw, stx + 50, stats_y + 28, 'infinity', 28, ACCENT_GOLD)
        else:
            text_center(draw, (stx + 50, stats_y + 28), num, font_zh(28, True), fill=ACCENT_GOLD)
        text_left(draw, (stx + 80, stats_y + 20), label, font_zh(16), fill=TEXT_WHITE)
    
    return img


def screenshot_3(lang="zh"):
    """Daily Fortune panel."""
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)
    draw_gradient_bg(draw, W, H)
    
    is_zh = lang == "zh"
    
    # ── Header with sun icon ──
    header_title = "今日运势" if is_zh else "Daily Fortune"
    # Draw sun icon before header
    draw_icon(draw, W // 2 - 140, 44, 'sun', 28)
    text_center(draw, (W // 2 + 20, 45), header_title, font_zh(32, True), fill=TEXT_WHITE)
    draw.line([(W//2 - 160, 78), (W//2 + 160, 78)], fill=ACCENT_GOLD, width=2)
    
    # ── Date display ──
    date_text = "2026年7月25日 星期六" if is_zh else "Saturday, July 25, 2026"
    text_center(draw, (W // 2, 110), date_text, font_zh(16), fill=TEXT_SUB)
    
    # ── Fortune Panel (main content area) ──
    panel_x, panel_y = 60, 145
    panel_w, panel_h = W - 120, 500
    draw_rounded_rect(draw, (panel_x, panel_y, panel_x + panel_w, panel_y + panel_h),
                     radius=20, fill="#15082b", outline="#3d1a66", width=2)
    
    # Overall fortune score
    score_y = panel_y + 30
    score_label = "综合运势" if is_zh else "Overall Fortune"
    text_left(draw, (panel_x + 30, score_y), score_label, font_zh(18, True), fill=TEXT_WHITE)
    
    # Stars (drawn as filled stars)
    star_y = score_y + 32
    star_x = panel_x + 30
    for i in range(5):
        color = ACCENT_GOLD if i < 4 else "#4a3060"
        _draw_star(draw, star_x + i * 34 + 10, star_y + 12, 12, color)
    
    score_num = "4 / 5"
    text_left(draw, (star_x + 5 * 34 + 15, star_y + 4), score_num, font_zh(18), fill=ACCENT_GOLD)
    
    # Divider
    div_y = star_y + 50
    draw.line([(panel_x + 30, div_y), (panel_x + panel_w - 30, div_y)], fill="#2a1548", width=1)
    
    # Lucky number
    ln_y = div_y + 20
    ln_label = "幸运数字" if is_zh else "Lucky Number"
    text_left(draw, (panel_x + 30, ln_y), ln_label, font_zh(16, True), fill=TEXT_WHITE)
    
    # Big number display
    num_box_x = panel_x + panel_w - 180
    draw_rounded_rect(draw, (num_box_x, ln_y - 5, num_box_x + 120, ln_y + 50),
                     radius=12, fill="#2a1548", outline=ACCENT_GOLD, width=2)
    text_center(draw, (num_box_x + 60, ln_y + 22), "7", font_zh(40, True), fill=ACCENT_GOLD)
    
    # Lucky color with compact layout
    lc_y = ln_y + 55
    lc_label = "幸运颜色" if is_zh else "Lucky Color"
    text_left(draw, (panel_x + 30, lc_y), lc_label, font_zh(16, True), fill=TEXT_WHITE)
    
    color_name = "紫罗兰色" if is_zh else "Purple"
    swatch_x = panel_x + 150
    draw_rounded_rect(draw, (swatch_x, lc_y, swatch_x + 28, lc_y + 28), radius=6, fill=ACCENT_PURPLE)
    text_left(draw, (swatch_x + 36, lc_y + 4), color_name, font_zh(14), fill=TEXT_SUB)
    text_left(draw, (swatch_x + 36 + draw.textlength(color_name, font=font_zh(14)) + 8, lc_y + 4),
              "(#9B59B6)", font_en(12), fill="#6a4a8a")
    
    # Divider 2
    div2_y = lc_y + 55
    draw.line([(panel_x + 30, div2_y), (panel_x + panel_w - 30, div2_y)], fill="#2a1548", width=1)
    
    # AI Reading text with robot icon
    ai_label = "AI 深度解读" if is_zh else "AI Interpretation"
    draw_icon(draw, panel_x + 30, div2_y + 20, 'robot', 18)
    text_left(draw, (panel_x + 56, div2_y + 15), ai_label, font_zh(16, True), fill=ACCENT_GOLD)
    
    reading_lines_zh = [
        "今日是一个适合重新开始的日子，星星们的能量正在引导你向前。",
        "在工作上，你可能会收到意想不到的合作邀请，不要害怕表现自己。",
        "感情方面，单身者可能遇到令人心动的人，有伴者则关系更加稳定。",
        "健康提示：多喝水，保持充足睡眠，适度运动。",
    ]
    reading_lines_en = [
        "Today marks a fresh beginning. The stars are aligning to guide you forward.",
        "At work, unexpected collaboration opportunities may arise. Don't hold back from expressing yourself.",
        "In love, singles may meet someone special; couples will find deeper stability.",
        "Health tip: Stay hydrated, get enough sleep, and exercise moderately.",
    ]
    reading_lines = reading_lines_zh if is_zh else reading_lines_en
    
    text_y = div2_y + 45
    for line in reading_lines:
        text_left(draw, (panel_x + 30, text_y), line, font_zh(15), fill=TEXT_SUB)
        text_y += 32
    
    # Regenerate button hint with refresh icon
    regen_hint = "点击重新生成不同的运势解读" if is_zh else "Tap regenerate for a new reading"
    draw_icon(draw, W // 2 - 180, panel_y + panel_h - 28, 'refresh', 14)
    text_left(draw, (W // 2 - 162, panel_y + panel_h - 33), regen_hint, font_zh(13), fill=TEXT_SUB)
    
    # ── Bottom feature tags ──
    feat_y = 670
    features = [
        ('star', "星级评分" if is_zh else "Star Rating"),
        ('cards', "命运数字" if is_zh else "Lucky Number"),
        ('palette', "幸运颜色" if is_zh else "Lucky Color"),
        ('robot', "AI 解读" if is_zh else "AI Reading"),
        ('refresh', "重新生成" if is_zh else "Regenerate"),
    ]
    fw = 210
    fx = (W - len(features) * fw - (len(features)-1) * 15) // 2
    for i, (icon_name, lbl) in enumerate(features):
        fxx = fx + i * (fw + 15)
        draw_rounded_rect(draw, (fxx, feat_y, fxx + fw, feat_y + 48), radius=12,
                         fill="#1a0a30", outline="#3d1a66")
        draw_icon(draw, fxx + 22, feat_y + 24, icon_name, 20)
        text_left(draw, (fxx + 48, feat_y + 14), lbl, font_zh(14), fill=TEXT_SUB)
    
    # Version note at very bottom
    ver_text = "Magic Tarot v1.2.3  ·  全功能免费" if is_zh else "Magic Tarot v1.2.3  ·  Fully Free"
    text_center(draw, (W // 2, 765), ver_text, font_zh(12), fill="#5a4a70")
    
    return img


def screenshot_4(lang="zh"):
    """Reading result / spread interpretation view."""
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)
    draw_gradient_bg(draw, W, H)
    
    is_zh = lang == "zh"
    
    # ── Header with gamepad icon ──
    header_title = "占卜结果" if is_zh else "Reading Result"
    draw_icon(draw, W // 2 - 120, 41, 'cards', 26)
    text_center(draw, (W // 2 + 20, 42), header_title, font_zh(30, True), fill=TEXT_WHITE)
    draw.line([(W//2 - 140, 72), (W//2 + 140, 72)], fill=ACCENT_GOLD, width=2)
    
    # ── Question input area ──
    q_y = 92
    q_label = "你的问题" if is_zh else "Your Question"
    text_left(draw, (60, q_y), q_label, font_zh(14, True), fill=TEXT_SUB)
    
    q_text = "我今天的工作决策应该怎么选？" if is_zh else "How should I approach my work decision today?"
    draw_rounded_rect(draw, (60, q_y + 22, W - 60, q_y + 58), radius=10,
                     fill="#15082b", outline="#3d1a66")
    text_left(draw, (76, q_y + 32), q_text, font_zh(15), fill=TEXT_WHITE)
    
    # ── Cards Display (3 cards) ──
    cards_y = 170
    cards_label = "抽出的牌" if is_zh else "Drawn Cards"
    text_left(draw, (60, cards_y), cards_label, font_zh(16, True), fill=ACCENT_GOLD)
    
    card_display_y = cards_y + 30
    c_w, c_h = 200, 280
    c_gap = 50
    c_start = (W - 3 * c_w - 2 * c_gap) // 2
    
    cards_info_zh = [
        ("过去", "魔法师", "正位"),
        ("现在", "教皇", "逆位"),
        ("未来", "星星", "正位"),
    ]
    cards_info_en = [
        ("Past", "The Magician", "Upright"),
        ("Present", "The Hierophant", "Reversed"),
        ("Future", "The Star", "Upright"),
    ]
    cards_info = cards_info_zh if is_zh else cards_info_en
    
    card_symbols = ['sparkle', 'yinyang', 'star']
    card_colors = ["#4a2c82", "#2a1548", "#3d2066"]
    
    for i, (pos, name, orient) in enumerate(cards_info):
        cx = c_start + i * (c_w + c_gap)
        card_color = card_colors[i]
        
        # Card body with gold inner border
        draw_rounded_rect(draw, (cx, card_display_y, cx + c_w, card_display_y + c_h),
                         radius=12, fill=card_color, outline=ACCENT_GOLD, width=1)
        # Inner subtle border
        inner_m = 3
        draw_rounded_rect(draw, (cx + inner_m, card_display_y + inner_m,
                                 cx + c_w - inner_m, card_display_y + c_h - inner_m),
                         radius=10, outline=ACCENT_PURPLE, width=1)
        
        # Corner decorations (small gold arcs)
        for x_sign, y_sign in [(1,1), (-1,1), (1,-1), (-1,-1)]:
            acx = cx + c_w//2 + x_sign * (c_w//2 - 8)
            acy = card_display_y + c_h//2 + y_sign * (c_h//2 - 8)
            draw.ellipse([acx - 4, acy - 4, acx + 4, acy + 4], fill=ACCENT_GOLD)
        
        # Position label (top of card)
        text_center(draw, (cx + c_w // 2, card_display_y + 20), pos, font_zh(12), fill=ACCENT_GOLD)
        
        # Card image placeholder with decorative border
        img_area_y = card_display_y + 38
        img_area_h = 170
        draw_rounded_rect(draw, (cx + 10, img_area_y, cx + c_w - 10, img_area_y + img_area_h),
                         radius=8, fill="#0d0620", outline=ACCENT_PURPLE, width=1)
        
        # Inner glow ring for card image
        gcx, gcy = cx + c_w // 2, img_area_y + img_area_h // 2
        glow_r = 20
        draw.ellipse([gcx - glow_r, gcy - glow_r, gcx + glow_r, gcy + glow_r],
                    outline=ACCENT_PURPLE, width=1)
        
        # Draw larger tarot-style symbol in center — uniform visual size
        CARD_ICON_SIZE = {"sparkle": 44, "yinyang": 40, "star": 42}
        draw_icon(draw, gcx, gcy, card_symbols[i], CARD_ICON_SIZE.get(card_symbols[i], 44))
        
        # Card name (single language only)
        text_center(draw, (cx + c_w // 2, img_area_y + img_area_h + 20),
                   name, font_zh(14, True), fill=TEXT_WHITE)
        
        # Star decorations around card name
        draw_stars_decor(draw, cx + c_w // 2, img_area_y + img_area_h + 20, 3, 20)
        
        # Orientation badge
        ori_color = GREEN_OK if orient == "正位" or orient == "Upright" else RED_REVERSE
        ori_bold = font_zh(11, True)
        obw = draw.textlength(orient, font=ori_bold) + 18
        obx = cx + c_w // 2 - obw // 2
        ob_y = card_display_y + c_h - 32
        draw_rounded_rect(draw, (obx, ob_y, obx + obw, ob_y + 22), radius=6, fill=ori_color)
        text_center(draw, (cx + c_w // 2, ob_y + 11), orient, font=ori_bold, fill=TEXT_WHITE)
    
    # ── Interpretation Area ──
    interp_y = card_display_y + c_h + 20
    interp_label = "解读" if is_zh else "Interpretation"
    text_left(draw, (60, interp_y), interp_label, font_zh(16, True), fill=ACCENT_GOLD)
    
    interp_panel_y = interp_y + 28
    interp_panel_h = 165
    draw_rounded_rect(draw, (60, interp_panel_y, W - 60, interp_panel_y + interp_panel_h),
                     radius=14, fill="#15082b", outline="#3d1a66")
    
    summary_zh = "【整体解读】从牌面来看，你目前的状态较为稳定，虽然内心有一些疑虑，但有足够的能力应对。未来的星星牌显示希望与治愈，建议你信任直觉，大胆前行。"
    summary_en = "[Summary] The cards show you are currently stable internally despite some doubts, with enough capacity to cope. The Star card ahead signals hope and healing — trust your intuition and move forward boldly."
    summary = summary_zh if is_zh else summary_en
    
    # Wrap text manually
    max_width = W - 140
    lines = []
    current_line = ""
    for char in summary:
        test_line = current_line + char
        if draw.textlength(test_line, font=font_zh(14)) < max_width:
            current_line = test_line
        else:
            lines.append(current_line)
            current_line = char
    if current_line:
        lines.append(current_line)
    
    ly = interp_panel_y + 15
    for line in lines[:5]:
        text_left(draw, (80, ly), line, font_zh(14), fill=TEXT_SUB)
        ly += 24
    
    # ── Bottom action bar ──
    act_y = 715
    actions = [
        ('star', "收藏" if is_zh else "Favorite"),
        ('refresh', "重施" if is_zh else "Redraw"),
        ('clipboard', "历史" if is_zh else "History"),
        ('clipboard', "分享" if is_zh else "Share"),
    ]
    aw = 250
    ax = (W - len(actions) * aw - (len(actions)-1) * 20) // 2
    for i, (icon_name, lbl) in enumerate(actions):
        axx = ax + i * (aw + 20)
        draw_rounded_rect(draw, (axx, act_y, axx + aw, act_y + 50), radius=12,
                         fill="#2a1548", outline=ACCENT_PURPLE)
        draw_icon(draw, axx + 25, act_y + 25, icon_name, 20)
        text_left(draw, (axx + 52, act_y + 14), lbl, font_zh(15), fill=TEXT_WHITE)
    
    return img


def screenshot_5(lang="zh"):
    """More features: lucky number generator + dilemma helper + settings."""
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)
    draw_gradient_bg(draw, W, H)
    
    is_zh = lang == "zh"
    
    # ── Header without lightning icon ──
    header_title = "更多功能" if is_zh else "More Features"
    text_center(draw, (W // 2, 42), header_title, font_zh(30, True), fill=TEXT_WHITE)
    draw.line([(W//2 - 140, 72), (W//2 + 140, 72)], fill=ACCENT_GOLD, width=2)
    
    # ── Left Panel: Lucky Number Generator ──
    left_x, left_y = 50, 95
    left_w, left_h = 580, 330
    draw_rounded_rect(draw, (left_x, left_y, left_x + left_w, left_y + left_h),
                     radius=16, fill="#15082b", outline="#3d1a66", width=2)
    
    # Title with cards icon (was dice)
    ln_title = "命运数字生成器" if is_zh else "Lucky Number Generator"
    draw_icon(draw, left_x + 20, left_y + 22, 'cards', 18)
    text_left(draw, (left_x + 46, left_y + 15), ln_title, font_zh(18, True), fill=ACCENT_GOLD)
    
    # Range input mockup
    range_label = "数字范围" if is_zh else "Number Range"
    text_left(draw, (left_x + 20, left_y + 50), range_label, font_zh(13), fill=TEXT_SUB)
    draw_rounded_rect(draw, (left_x + 20, left_y + 70, left_x + 250, left_y + 102),
                     radius=8, fill="#0d0620", outline="#3d1a66")
    range_val = "1 - 49"
    text_left(draw, (left_x + 32, left_y + 80), range_val, font_zh(14), fill=TEXT_WHITE)
    
    generate_btn_text = "生成 Generate" if is_zh else "Generate"
    btn_tw = draw.textlength(generate_btn_text, font=font_zh(13)) + 30
    draw_rounded_rect(draw, (left_x + 265, left_y + 70, left_x + 265 + btn_tw, left_y + 102),
                     radius=8, fill=ACCENT_PURPLE)
    text_center(draw, (left_x + 265 + btn_tw//2, left_y + 86), generate_btn_text,
               font=font_zh(13, True), fill=TEXT_WHITE)
    
    # Preset modes
    preset_label = "预设模式" if is_zh else "Preset Modes"
    text_left(draw, (left_x + 20, left_y + 115), preset_label, font_zh(13), fill=TEXT_SUB)
    
    presets_zh = ["六合彩", "骰子", "手机尾号", "自定义"]
    presets_en = ["Mark Six", "Dice", "Phone Tail", "Custom"]
    presets = presets_zh if is_zh else presets_en
    
    preset_y = left_y + 138
    px = left_x + 20
    pgap = 8
    for pi, pres in enumerate(presets):
        active = (pi == 0)
        ptw = draw.textlength(pres, font=font_zh(12)) + 16
        pbg = ACCENT_PURPLE if active else "#1e0e38"
        pfc = TEXT_WHITE if active else TEXT_SUB
        draw_rounded_rect(draw, (px, preset_y, px + ptw, preset_y + 30), radius=15, fill=pbg)
        text_center(draw, (px + ptw//2, preset_y + 15), pres, font=font_zh(12), fill=pfc)
        px += ptw + pgap
    
    # Result display
    result_y = preset_y + 45
    draw.line([(left_x + 20, result_y), (left_x + left_w - 20, result_y)], fill="#2a1548", width=1)
    
    result_big_num = "7"
    text_center(draw, (left_x + 100, result_y + 55), result_big_num, font_zh(56, True), fill=ACCENT_GOLD)
    
    tarot_hint = "塔罗数字解读: 战车 · 精神力量 · 分析思维" if is_zh else "Tarot meaning: Chariot · Mental power · Analytical thinking"
    text_left(draw, (left_x + 20, result_y + 115), tarot_hint, font_zh(12), fill=TEXT_SUB)
    
    # ── Right Panel: Dilemma Helper ──
    right_x = left_x + left_w + 30
    right_y = left_y
    right_w, right_h = W - right_x - 50, 330
    draw_rounded_rect(draw, (right_x, right_y, right_x + right_w, right_y + right_h),
                     radius=16, fill="#15082b", outline="#3d1a66", width=2)
    
    # Title with think icon
    dl_title = "选择困难症助手" if is_zh else "Dilemma Helper"
    draw_icon(draw, right_x + 20, right_y + 22, 'think', 18)
    text_left(draw, (right_x + 46, right_y + 15), dl_title, font_zh(18, True), fill=ACCENT_GOLD)
    
    dilemma_q = "无法决定？让命运帮你选！" if is_zh else "Can't decide? Let fate choose!"
    text_left(draw, (right_x + 20, right_y + 48), dilemma_q, font_zh(14), fill=TEXT_SUB)
    
    # Three option cards with drawn icons — real-life dilemma choices
    options = [
        ('sparkle', "接受 Offer", "Accept Offer"),
        ('star', "继续深造", "Study More"),
        ('yinyang', "自由职业", "Freelance"),
    ]
    opt_w = (right_w - 60) // 3
    opt_y = right_y + 80
    opt_h = 140
    for oi, (icon_name, lbl_zh, lbl_en) in enumerate(options):
        ox = right_x + 20 + oi * (opt_w + 10)
        lbl = lbl_zh if is_zh else lbl_en
        draw_rounded_rect(draw, (ox, opt_y, ox + opt_w, opt_y + opt_h),
                         radius=12, fill="#1e0e38", outline="#4a2070")
        draw_icon(draw, ox + opt_w // 2, opt_y + 50, icon_name, 36)
        text_center(draw, (ox + opt_w // 2, opt_y + 100), lbl, font=font_zh(13), fill=TEXT_SUB)
    
    # Result mock with sparkle — tarot advice (no special unicode chars)
    res_y = opt_y + opt_h + 15
    res_text = "★ 建议：追随内心，星光指引方向" if is_zh else "★ Advice: Follow your inner light"
    draw_icon(draw, right_x + right_w // 2 - 100, res_y + 8, 'sparkle', 14)
    res_cx = right_x + (right_w - 82) // 2 + 41
    text_center(draw, (res_cx, res_y + 8), res_text, font_zh(16, True), fill=ACCENT_GOLD)
    
    # ── Bottom Feature Highlights with uniform icon sizes ──
    feat_y = 445
    feat_title = "体验优化" if is_zh else "Experience"
    text_left(draw, (60, feat_y), feat_title, font_zh(18, True), fill=ACCENT_GOLD)
    
    # Per-icon size overrides for visual uniformity (all appear ~26px)
    ICON_VIZ_SIZE = {"speaker": 26, "clipboard": 26, "bookmark": 26,
                     "globe": 26, "moon": 26, "lock": 26}
    
    highlights = [
        ('speaker', "翻牌音效开关", "Sound Effects Toggle"),
        ('clipboard', "历史占卜记录", "Reading History"),
        ('bookmark', "卡片收藏夹", "Card Favorites"),
        ('globe', "中英双语界面", "Bilingual UI"),
        ('moon', "深色魔法主题", "Dark Magical Theme"),
        ('lock', "隐私安全本地", "Privacy & Local"),
    ]
    
    hf_w, hf_h = 370, 80
    h_cols = 3
    h_gap_x, h_gap_y = 20, 15
    for hi, (icon_name, zh_lbl, en_lbl) in enumerate(highlights):
        hr = hi // h_cols
        hc = hi % h_cols
        hx = 60 + hc * (hf_w + h_gap_x)
        hy = feat_y + 32 + hr * (hf_h + h_gap_y)
        
        lbl = zh_lbl if is_zh else en_lbl
        draw_rounded_rect(draw, (hx, hy, hx + hf_w, hy + hf_h), radius=12,
                         fill="#1a0a30", outline="#3d1a66")
        draw_icon(draw, hx + 27, hy + 40, icon_name, ICON_VIZ_SIZE.get(icon_name, 24))
        text_left(draw, (hx + 52, hy + 26), lbl, font=font_zh(14), fill=TEXT_SUB)
    
    # ── Very bottom CTA with proper vertical centering ──
    cta_y = 705
    cta_w = 420
    cta_x = (W - cta_w) // 2
    cta_h = 55
    draw_rounded_rect(draw, (cta_x, cta_y, cta_x + cta_w, cta_y + cta_h), radius=27,
                     fill=ACCENT_GOLD)
    cta_text = "立即体验 · Try It Free →" if is_zh else "Install Now · It's Free →"
    cb = draw.textbbox((0, 0), cta_text, font=font_zh(18, True))
    ct_h = cb[3] - cb[1]
    text_center(draw, (W // 2, cta_y + (cta_h - ct_h) // 2 + ct_h // 2),
                cta_text, font=font_zh(18, True), fill="#1a0a2e")
    
    return img


# ════════════════════════════════════════════════
#  MAIN
# ════════════════════════════════════════════════

def main():
    screenshot_funcs = [screenshot_1, screenshot_2, screenshot_3, screenshot_4, screenshot_5]
    
    for lang in ["zh", "en"]:
        lang_dir = os.path.join(SCREENSHOTS_DIR, lang)
        os.makedirs(lang_dir, exist_ok=True)
        
        print(f"\nGenerating {lang.upper()} screenshots...")
        for i, func in enumerate(screenshot_funcs):
            img = func(lang=lang)
            out_path = os.path.join(lang_dir, f"screenshot-{i+1}.png")
            img.save(out_path, "PNG")
            size_kb = os.path.getsize(out_path) / 1024
            print(f"  ✓ screenshot-{i+1}.png ({size_kb:.0f} KB)")
    
    print(f"\nDone! Screenshots saved to: {SCREENSHOTS_DIR}")


if __name__ == "__main__":
    main()
