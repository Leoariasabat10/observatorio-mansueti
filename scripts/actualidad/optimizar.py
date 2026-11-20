"""Optimized web copy of a saved image: trims black bars left by the viewer capture, WebP, max 1200 px on the long side, never enlarged.
Usage: optimizar.py origen destino"""
import sys
from PIL import Image, ImageChops, ImageOps

src, dst = sys.argv[1], sys.argv[2]
im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
# crop near-black borders (viewer letterboxing); keeps everything if the image has none
box = ImageChops.difference(im, Image.new("RGB", im.size, (0, 0, 0))).point(lambda p: 255 if p > 24 else 0).getbbox()
if box:
    im = im.crop(box)
im.thumbnail((1200, 1200), Image.LANCZOS)  # thumbnail never upsizes
im.save(dst, "WEBP", quality=84, method=6)
print(f"{src} -> {dst} {im.size}")
