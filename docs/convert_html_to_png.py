#!/usr/bin/env python3
"""Convert HTML diagrams to PNG using Chrome headless with proper settings."""
import subprocess
import os

OUTPUT_DIR = "/Users/openclaw/.hermes/projects/habit-forge/docs/images"
HTML_DIR = os.path.join(OUTPUT_DIR, "html_temp")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

diagrams = ["class_diagram", "er_diagram"]

for name in diagrams:
    html_path = os.path.join(HTML_DIR, f"{name}.html")
    png_path = os.path.join(OUTPUT_DIR, f"{name}.png")
    
    # Use Chrome with --hide-scrollbars and explicit viewport
    cmd = [
        CHROME,
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--disable-software-rasterizer",
        "--disable-dev-shm-usage",
        f"--screenshot={png_path}",
        "--window-size=1400,1000",
        "--default-background-color=00000000",
        f"file://{html_path}"
    ]
    
    print(f"Converting {name}...")
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    
    if result.returncode == 0 and os.path.exists(png_path):
        size = os.path.getsize(png_path)
        print(f"  ✓ Saved: {png_path} ({size} bytes)")
    else:
        print(f"  ✗ Failed: {result.stderr[:200]}")

print("\nDone!")
