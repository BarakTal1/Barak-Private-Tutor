"""Builds the small PDF files that the parser tests read.

Run: python3 tests/fixtures/make_pdfs.py   (needs reportlab and pypdf)
"""
from pathlib import Path

from PIL import Image, ImageDraw
from pypdf import PdfReader, PdfWriter
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas

here = Path(__file__).parent


def text_page(pdf, text):
    pdf.setFont("Helvetica", 14)
    y = 780
    for line in text.split("\n"):
        pdf.drawString(72, y, line)
        y -= 20
    pdf.showPage()


def image_page(pdf):
    # A page that is only a picture of text: it has no text layer.
    picture = Image.new("RGB", (600, 400), "white")
    draw = ImageDraw.Draw(picture)
    draw.rectangle((40, 40, 560, 360), outline="black", width=4)
    draw.text((80, 180), "SCANNED PAGE", fill="black")
    pdf.drawImage(ImageReader(picture), 72, 400, width=450, height=300)
    pdf.showPage()


def build(name, pages):
    pdf = canvas.Canvas(str(here / name))
    for page in pages:
        page(pdf)
    pdf.save()


build(
    "text.pdf",
    [
        lambda p: text_page(p, "Triangles\nA triangle has three sides.\nThe longest side is the hypotenuse."),
        lambda p: text_page(p, "Pythagoras\nIn a right triangle a^2 + b^2 = c^2."),
    ],
)
build("scan.pdf", [image_page, image_page])
build(
    "mixed.pdf",
    [lambda p: text_page(p, "A page with real text.\nIt has enough characters to be trusted."), image_page],
)
build("many.pdf", [(lambda n: lambda p: text_page(p, f"This is page number {n} of the long file."))(n) for n in range(1, 121)])

writer = PdfWriter(clone_from=PdfReader(str(here / "text.pdf")))
writer.encrypt(user_password="secret", owner_password="owner")
with open(here / "locked.pdf", "wb") as handle:
    writer.write(handle)

print("pdf fixtures written to", here)
