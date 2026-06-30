#!/usr/bin/env python3
"""Convert FULL_REPORT.md to PDF using markdown + weasyprint."""
import re, sys
import markdown
from weasyprint import HTML

md_path = sys.argv[1] if len(sys.argv) > 1 else 'docs/FULL_REPORT.md'
out_path = sys.argv[2] if len(sys.argv) > 2 else 'docs/FULL_REPORT.pdf'

with open(md_path, 'r') as f:
    md_text = f.read()

# Convert markdown to HTML
md = markdown.Markdown(extensions=['tables', 'fenced_code', 'toc'])
html_body = md.convert(md_text)

# Wrap in styled HTML
html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
@page {{
    size: A4;
    margin: 2cm 2.5cm;
    @bottom-center {{ content: counter(page); font-size: 9px; color: #888; }}
}}
body {{
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 11pt;
    line-height: 1.6;
    color: #333;
    max-width: 100%;
}}
h1 {{
    font-size: 20pt;
    color: #1a3366;
    border-bottom: 2px solid #1a3366;
    padding-bottom: 8px;
    page-break-before: always;
}}
h1:first-of-type {{ page-break-before: avoid; }}
h2 {{
    font-size: 15pt;
    color: #284482;
    border-bottom: 1px solid #ccc;
    padding-bottom: 4px;
    margin-top: 24px;
}}
h3 {{
    font-size: 12pt;
    color: #3c5a9e;
    margin-top: 18px;
}}
code {{
    font-family: 'Courier New', Courier, monospace;
    font-size: 9pt;
    background: #f5f5f5;
    padding: 1px 4px;
    border-radius: 3px;
}}
pre {{
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 12px;
    font-size: 9pt;
    line-height: 1.4;
    overflow-wrap: break-word;
    white-space: pre-wrap;
}}
pre code {{ background: none; padding: 0; }}
table {{
    border-collapse: collapse;
    width: 100%;
    font-size: 9pt;
    margin: 12px 0;
}}
th {{
    background: #1a3366;
    color: white;
    padding: 6px 10px;
    text-align: left;
    font-size: 9pt;
}}
td {{
    border: 1px solid #ddd;
    padding: 5px 10px;
}}
tr:nth-child(even) {{ background: #f9f9f9; }}
a {{ color: #284482; }}
hr {{ border: none; border-top: 1px solid #ccc; margin: 16px 0; }}
ul {{ padding-left: 20px; }}
li {{ margin-bottom: 3px; }}
</style>
</head>
<body>
{html_body}
</body>
</html>"""

HTML(string=html).write_pdf(out_path)
print(f'PDF written to {out_path}')
