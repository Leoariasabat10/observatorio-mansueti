"""Optimized web copy of a downloaded image: WebP, max 1200 px on the long side, never enlarged. Usage: optimizar.py origen destino"""
import sys
from PIL import Image, ImageOps

src, dst = sys.argv[1], sys.argv[2]
im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
im.thumbnail((1200, 1200), Image.LANCZOS)  # thumbnail never upsizes
im.save(dst, "WEBP", quality=82, method=6)
print(f"{src} -> {dst} {im.size}")
