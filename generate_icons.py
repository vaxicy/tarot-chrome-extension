#!/usr/bin/env python3
"""生成哈利波特塔罗牌 Chrome 扩展图标 (16/48/128)"""
import struct, zlib, os, math

def make_png(width, height, pixels):
    """pixels: list of height rows, each row is list of (R,G,B,A) tuples"""
    def chunk(chunk_type, data):
        c = chunk_type + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xFFFFFFFF)

    raw = b''
    for row in pixels:
        raw += b'\x00'  # filter byte: None
        for r, g, b, a in row:
            raw += struct.pack('BBBB', r, g, b, a)

    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)

    png = b'\x89PNG\r\n\x1a\n'
    png += chunk(b'IHDR', ihdr)
    png += chunk(b'IDAT', zlib.compress(raw))
    png += chunk(b'IEND', b'')
    return png

def blend_pixel(pixels, x, y, s, r, g, b, a):
    if not (0 <= x < s and 0 <= y < s) or a == 0:
        return
    old = pixels[y][x]
    if a >= 255:
        pixels[y][x] = (r, g, b, 255)
    else:
        oa = old[3] / 255.0
        na = a / 255.0
        out_a = na + oa * (1 - na)
        if out_a > 0:
            pixels[y][x] = (
                int((r * na + old[0] * oa * (1 - na)) / out_a),
                int((g * na + old[1] * oa * (1 - na)) / out_a),
                int((b * na + old[2] * oa * (1 - na)) / out_a),
                int(out_a * 255)
            )

def fill_circle(pixels, s, cx, cy, rad, r, g, b, a=255):
    for y in range(max(0, int(cy - rad - 1)), min(s, int(cy + rad + 2))):
        for x in range(max(0, int(cx - rad - 1)), min(s, int(cx + rad + 2))):
            if (x - cx)**2 + (y - cy)**2 <= rad**2:
                blend_pixel(pixels, x, y, s, r, g, b, a)

def fill_rect(pixels, s, x1, y1, x2, y2, r, g, b, a=255):
    for y in range(max(0, y1), min(s, y2 + 1)):
        for x in range(max(0, x1), min(s, x2 + 1)):
            blend_pixel(pixels, x, y, s, r, g, b, a)

def draw_star_pixels(pixels, s, cx, cy, outer_r, inner_r, points, r, g, b, a=255):
    """Draw a star using scanline fill of the polygon defined by outer/inner points."""
    # Build polygon points
    poly = []
    for i in range(points * 2):
        angle = math.pi / 2 * 3 + (i * math.pi / points)
        rad = outer_r if i % 2 == 0 else inner_r
        px = cx + math.cos(angle) * rad
        py = cy + math.sin(angle) * rad
        poly.append((px, py))

    # Scanline fill
    min_y = int(min(p[1] for p in poly)) - 1
    max_y = int(max(p[1] for p in poly)) + 1
    n = len(poly)
    for y in range(max(0, min_y), min(s, max_y + 1)):
        intersections = []
        for i in range(n):
            x0, y0 = poly[i]
            x1, y1 = poly[(i + 1) % n]
            if (y0 <= y < y1) or (y1 <= y < y0):
                if y1 != y0:
                    x_int = x0 + (y - y0) * (x1 - x0) / (y1 - y0)
                    intersections.append(x_int)
        intersections.sort()
        for j in range(0, len(intersections) - 1, 2):
            for x in range(max(0, int(intersections[j])), min(s, int(intersections[j+1]) + 1)):
                blend_pixel(pixels, x, y, s, r, g, b, a)

def is_in_rounded_rect(x, y, w, h, rad):
    """Check if point (x,y) is inside a rounded rectangle."""
    # Main rectangle (excluding corners)
    if rad <= x < w - rad and 0 <= y < h:
        return True
    if 0 <= x < w and rad <= y < h - rad:
        return True
    # Corner circles
    corners = [(rad, rad), (w - rad, rad), (rad, h - rad), (w - rad, h - rad)]
    for cx, cy in corners:
        dx = x - cx
        dy = y - cy
        # Determine which quadrant
        if x < rad and y < rad:
            if dx*dx + dy*dy <= rad*rad:
                return True
        elif x >= w - rad and y < rad:
            if dx*dx + dy*dy <= rad*rad:
                return True
        elif x < rad and y >= h - rad:
            if dx*dx + dy*dy <= rad*rad:
                return True
        elif x >= w - rad and y >= h - rad:
            if dx*dx + dy*dy <= rad*rad:
                return True
    return False

def draw_icon(size):
    s = size
    half = s // 2
    pixels = [[(0, 0, 0, 0) for _ in range(s)] for _ in range(s)]

    # ========== 16x16: ultra-simplified, bold silhouette ==========
    if s == 16:
        rad = 3
        # Background: rounded rect with subtle radial gradient
        for y in range(s):
            for x in range(s):
                if is_in_rounded_rect(x, y, s, s, rad):
                    dx2 = (x - half) / max(half, 1)
                    dy2 = (y - half) / max(half, 1)
                    dist = math.sqrt(dx2*dx2 + dy2*dy2)
                    r2 = int(74 + (26 - 74) * dist)
                    g2 = int(47 + (15 - 47) * dist)
                    b2 = int(159 + (64 - 159) * dist)
                    r2 = max(0, min(255, r2))
                    g2 = max(0, min(255, g2))
                    b2 = max(0, min(255, b2))
                    pixels[y][x] = (r2, g2, b2, 255)

        # Single bold gold star, no extra details
        cx, cy = half, half
        draw_star_pixels(pixels, s, cx, cy, 5.5, 2.2, 5, 255, 215, 0, 255)
        return pixels

    # ========== 48 / 128: full detailed design ==========
    rad = max(1, s // 8)  # corner radius

    # ---- Background: rounded rect with radial gradient ----
    for y in range(s):
        for x in range(s):
            if is_in_rounded_rect(x, y, s, s, rad):
                dx2 = (x - half) / max(half, 1)
                dy2 = (y - half) / max(half, 1)
                dist = math.sqrt(dx2*dx2 + dy2*dy2)
                # #4A2F9F -> #1A0F40
                r2 = int(74 + (26 - 74) * dist)
                g2 = int(47 + (15 - 47) * dist)
                b2 = int(159 + (64 - 159) * dist)
                r2 = max(0, min(255, r2))
                g2 = max(0, min(255, g2))
                b2 = max(0, min(255, b2))
                pixels[y][x] = (r2, g2, b2, 255)

    # ---- Small decorative stars ----
    star_positions = [(0.18, 0.15), (0.82, 0.12), (0.15, 0.85),
                     (0.88, 0.88), (0.5, 0.08), (0.08, 0.5)]
    for sx, sy in star_positions:
        fill_circle(pixels, s, sx * s, sy * s, max(1, s // 16), 255, 215, 0, int(255 * 0.3))

    # ---- Tarot card body ----
    card_pad = int(s * 0.10)
    card_x = card_pad
    card_y = (s - int((s - 2*card_pad) * 1.4)) // 2
    card_w = s - 2 * card_pad
    card_h = int(card_w * 1.4)
    if card_y < 0:
        card_y = 0
        card_h = min(card_h, s)

    border = max(1, s // 20)

    # Card background (dark purple)
    for y in range(card_y + border, min(s, card_y + card_h - border)):
        for x in range(card_x + border, min(s, card_x + card_w - border)):
            if 0 <= x < s and 0 <= y < s:
                pixels[y][x] = (26, 15, 64, 255)

    # Card border (gold)
    for y in range(card_y, min(s, card_y + card_h)):
        for x in range(card_x, min(s, card_x + card_w)):
            is_border = (x < card_x + border or x >= card_x + card_w - border or
                         y < card_y + border or y >= card_y + card_h - border)
            if is_border and 0 <= x < s and 0 <= y < s:
                pixels[y][x] = (255, 215, 0, 255)

    # ---- Center gold star ----
    cx, cy = half, half
    star_r = s * 0.20

    # Star glow (larger, transparent)
    fill_circle(pixels, s, cx, cy, star_r * 1.3, 255, 215, 0, int(255 * 0.15))

    # Draw the star
    draw_star_pixels(pixels, s, cx, cy, star_r, star_r * 0.45, 5, 255, 215, 0, 255)

    # Star center circle (dark)
    fill_circle(pixels, s, cx, cy, max(1, s // 10), 26, 15, 64, 255)

    # ---- Card decoration lines ----
    line_y1 = int(card_y + card_h * 0.18)
    line_y2 = int(card_y + card_h * 0.82)
    for x in range(card_x + int(card_w * 0.2), min(s, card_x + int(card_w * 0.8))):
        for dy in range(-max(1, s//40), max(1, s//40) + 1):
            blend_pixel(pixels, x, line_y1 + dy, s, 255, 215, 0, int(255 * 0.5))
            blend_pixel(pixels, x, line_y2 + dy, s, 255, 215, 0, int(255 * 0.5))

    # ---- Corner dots ----
    corner_positions = [
        (card_x + int(card_w * 0.08), card_y + int(card_h * 0.08)),
        (card_x + int(card_w * 0.92), card_y + int(card_h * 0.08)),
        (card_x + int(card_w * 0.08), card_y + int(card_h * 0.92)),
        (card_x + int(card_w * 0.92), card_y + int(card_h * 0.92)),
    ]
    for cxx, cyy in corner_positions:
        fill_circle(pixels, s, cxx, cyy, max(1, s // 20), 255, 215, 0, 255)

    return pixels

# ---- Main: generate all 3 sizes ----
sizes = [16, 48, 128]
script_dir = os.path.dirname(os.path.abspath(__file__))
icons_dir = os.path.join(script_dir, 'icons')
os.makedirs(icons_dir, exist_ok=True)

for sz in sizes:
    pixels = draw_icon(sz)
    png_data = make_png(sz, sz, pixels)
    path = os.path.join(icons_dir, f'icon{sz}.png')
    with open(path, 'wb') as f:
        f.write(png_data)
    print(f'[OK] Generated {path} ({sz}x{sz})')

print('All icons generated successfully!')
