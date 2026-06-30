#!/usr/bin/env python3
"""
Generate professional PDF from HabitForge report markdown.
"""

import re
import markdown
import pymupdf
from weasyprint import HTML

INPUT_MD = '/Users/openclaw/.hermes/projects/habit-forge/docs/FULL_REPORT.md'
OUTPUT_PDF = '/Users/openclaw/.hermes/projects/habit-forge/docs/FULL_REPORT.pdf'
TEMPLATE_HTML = '/Users/openclaw/.hermes/projects/habit-forge/docs/template.html'

ASCII_CHARS = set('┌┐└┘│─═├┤┬┴┼╔╗╚╝║─━│┃┏┓┗┛┣┫┳┻╋')

def has_ascii_art(text):
    return any(c in ASCII_CHARS for c in text)

def clean_ascii_art(content):
    lines = content.strip().split('\n')
    cleaned = []
    for line in lines:
        cleaned_line = line
        for char in ASCII_CHARS:
            cleaned_line = cleaned_line.replace(char, ' ')
        cleaned_line = cleaned_line.rstrip()
        if cleaned_line.strip():
            cleaned.append(cleaned_line)
    return '\n'.join(cleaned)

def preprocess_markdown(text):
    # Replace code blocks containing ASCII art
    def replace_code_block(match):
        content = match.group(1)
        if has_ascii_art(content):
            cleaned = clean_ascii_art(content)
            return '<div class="diagram"><pre><code>' + cleaned + '</code></pre></div>'
        return '<pre><code>' + content + '</code></pre>'
    
    # Use flexible pattern that handles content after opening backticks
    text = re.sub(r'```[^\n]*\n([\s\S]*?)```', replace_code_block, text)
    
    # Convert title section to proper title page
    title_pattern = r'^# (HabitForge — A Full-Stack Habit Tracking Web Application)\n\n## (Major Project Report)\n\n\*\*Course:\*\* (.*?)\n\*\*Subject Code:\*\* (.*?)\n\*\*Credits:\*\* (.*?)\n\*\*Project Duration:\*\* (.*?)\n'
    title_match = re.search(title_pattern, text)
    if title_match:
        title_page = f'''<div class="title-page">
<h1>{title_match.group(1)}</h1>
<div class="subtitle">{title_match.group(2)}</div>
<div class="meta">
  <strong>{title_match.group(3)}</strong><br>
  {title_match.group(4)} &nbsp;|&nbsp; {title_match.group(5)}<br>
  {title_match.group(6)}
</div>
<div class="tech-badges">
  <span class="badge">Next.js 14</span>
  <span class="badge">Supabase</span>
  <span class="badge">PostgreSQL</span>
  <span class="badge">Tailwind CSS v4</span>
  <span class="badge">TypeScript</span>
  <span class="badge">Vercel</span>
</div>
</div>
<hr>
'''
        text = text[:title_match.start()] + title_page + text[title_match.end():]
    
    return text

def main():
    with open(INPUT_MD, 'r') as f:
        md_text = f.read()
    
    md_text = preprocess_markdown(md_text)
    
    md = markdown.Markdown(extensions=['tables', 'fenced_code', 'toc'])
    html_body = md.convert(md_text)
    
    with open(TEMPLATE_HTML, 'r') as f:
        template = f.read()
    
    html_full = template.replace('$body$', html_body)
    html_full = html_full.replace('$title$', 'HabitForge — Major Project Report')
    
    with open('/Users/openclaw/.hermes/projects/habit-forge/docs/output.html', 'w') as f:
        f.write(html_full)
    
    print(f"HTML generated: {len(html_full)} chars")
    
    base_url = 'file:///Users/openclaw/.hermes/projects/habit-forge/docs/'
    html_obj = HTML(string=html_full, base_url=base_url)
    html_obj.write_pdf(OUTPUT_PDF)
    
    import os
    size = os.path.getsize(OUTPUT_PDF)
    print(f"PDF generated: {OUTPUT_PDF} ({size/1024:.1f} KB)")
    
    # Verify
    doc = pymupdf.open(OUTPUT_PDF)
    ascii_pages = []
    for i, page in enumerate(doc):
        text = page.get_text()
        if any(c in ASCII_CHARS for c in text):
            ascii_pages.append(i+1)
    if ascii_pages:
        print(f"WARNING: ASCII art still on pages: {ascii_pages}")
    else:
        print("✓ No ASCII art remaining in PDF")
    
    print(f"✓ Total pages: {len(doc)}")

if __name__ == '__main__':
    main()
