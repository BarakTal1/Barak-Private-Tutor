"""Draws a picture of a Hebrew page, like a scan, for the transcription scenario.

Run: python3 eval/fixtures/make_scan.py   (needs Pillow and a Hebrew font, here SF Hebrew on macOS)
"""
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

here = Path(__file__).parent
FONT = "/System/Library/Fonts/SFHebrew.ttf"
LINES = [
    "משולש הוא צורה עם שלוש צלעות.",
    "סכום הזוויות במשולש הוא מאה ושמונים מעלות.",
    "במשולש ישר זווית יש זווית אחת של תשעים מעלות.",
    "הצלע הארוכה ביותר נקראת יתר.",
]

random.seed(7)
page = Image.new("L", (1100, 520), 245)
draw = ImageDraw.Draw(page)
font = ImageFont.truetype(FONT, 44)
for index, line in enumerate(LINES):
    visual = line[::-1]  # Pillow draws left to right, so the line is written in visual order
    width = draw.textlength(visual, font=font)
    draw.text((1060 - width, 40 + index * 110), visual, font=font, fill=20)
for _ in range(2500):
    x, y = random.randrange(page.width), random.randrange(page.height)
    draw.point((x, y), fill=random.randrange(150, 230))
page = page.rotate(1.2, expand=True, fillcolor=245).filter(ImageFilter.GaussianBlur(0.6))
page.convert("RGB").save(here / "hebrew-scan.jpg", quality=70)
print("written", here / "hebrew-scan.jpg")
