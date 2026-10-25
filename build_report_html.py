import re
import os

md_path = r"d:\newprojectworknamansaini\fee3sem\EduPixel_Major_Capstone_Project_Report.md"
html_path = r"d:\newprojectworknamansaini\fee3sem\EduPixel_Major_Capstone_Project_Report.html"

with open(md_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Custom Markdown to HTML Converter
def parse_markdown(text):
    lines = text.split('\n')
    html_lines = []
    in_code = False
    code_lang = ''
    code_buf = []
    in_table = False
    table_buf = []
    in_list = False
    list_type = None

    def flush_table(buf):
        if not buf:
            return ''
        res = ['<div class="table-container"><table class="pixel-table">']
        for i, row in enumerate(buf):
            if '---' in row:
                continue
            cols = [c.strip() for c in row.strip('|').split('|')]
            tag = 'th' if i == 0 else 'td'
            row_html = '  <tr>' + ''.join(f'<{tag}>{parse_inline(c)}</{tag}>' for c in cols) + '</tr>'
            res.append(row_html)
        res.append('</table></div>')
        return '\n'.join(res)

    def parse_inline(s):
        # Images
        s = re.sub(r'!\[(.*?)\]\((.*?)\)', r'<div class="img-card"><img src="\2" alt="\1" /><span class="caption">\1</span></div>', s)
        # File Links
        s = re.sub(r'\[(.*?)\]\((file:///.*?)\)', r'<a href="\2" class="doc-link" target="_blank">\1</a>', s)
        # Web Links
        s = re.sub(r'\[(.*?)\]\((http.*?)\)', r'<a href="\2" target="_blank" rel="noopener">\1</a>', s)
        # Bold
        s = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', s)
        # Italic
        s = re.sub(r'\*(.*?)\*', r'<em>\1</em>', s)
        # Inline code
        s = re.sub(r'`(.*?)`', r'<code class="inline-code">\1</code>', s)
        return s

    for line in lines:
        # Code block toggle
        if line.strip().startswith('```'):
            if in_code:
                in_code = False
                code_text = '\n'.join(code_buf)
                # escape html
                code_text = code_text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
                html_lines.append(f'<pre class="code-block"><code class="language-{code_lang}">{code_text}</code></pre>')
                code_buf = []
            else:
                in_code = True
                code_lang = line.strip()[3:].strip()
            continue

        if in_code:
            code_buf.append(line)
            continue

        # Tables
        if '|' in line and (line.strip().startswith('|') or line.strip().endswith('|')):
            if not in_table:
                in_table = True
                table_buf = []
            table_buf.append(line)
            continue
        else:
            if in_table:
                in_table = False
                html_lines.append(flush_table(table_buf))
                table_buf = []

        line_str = line.strip()

        # Empty lines
        if not line_str:
            if in_list:
                html_lines.append(f'</{list_type}>')
                in_list = False
            html_lines.append('<div class="spacer"></div>')
            continue

        # Horizontal Rule
        if line_str in ('---', '***', '___'):
            html_lines.append('<hr class="section-divider" />')
            continue

        # Headings
        if line_str.startswith('# '):
            html_lines.append(f'<h1 class="heading-1">{parse_inline(line_str[2:])}</h1>')
            continue
        elif line_str.startswith('## '):
            html_lines.append(f'<h2 class="heading-2">{parse_inline(line_str[3:])}</h2>')
            continue
        elif line_str.startswith('### '):
            html_lines.append(f'<h3 class="heading-3">{parse_inline(line_str[4:])}</h3>')
            continue
        elif line_str.startswith('#### '):
            html_lines.append(f'<h4 class="heading-4">{parse_inline(line_str[5:])}</h4>')
            continue

        # Blockquote
        if line_str.startswith('> '):
            html_lines.append(f'<blockquote class="quote-box">{parse_inline(line_str[2:])}</blockquote>')
            continue

        # Unordered list
        if line_str.startswith('- ') or line_str.startswith('* '):
            if not in_list or list_type != 'ul':
                if in_list:
                    html_lines.append(f'</{list_type}>')
                in_list = True
                list_type = 'ul'
                html_lines.append('<ul class="report-list">')
            html_lines.append(f'  <li>{parse_inline(line_str[2:])}</li>')
            continue

        # Paragraph
        html_lines.append(f'<p class="para">{parse_inline(line_str)}</p>')

    if in_table:
        html_lines.append(flush_table(table_buf))
    if in_list:
        html_lines.append(f'</{list_type}>')

    return '\n'.join(html_lines)

body_html = parse_markdown(content)

full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EduPixel - Major Capstone Project Report | Chitkara University</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        @font-face {{
            font-family: 'Harmond';
            src: url('https://fonts.cdnfonts.com/s/72288/Harmond-FreeDisplay.woff') format('woff');
            font-weight: normal;
            font-style: normal;
        }}

        :root {{
            --bg-surface: #fdfae9;
            --on-bg: #1c1c13;
            --primary-green: #366a19;
            --secondary-blue: #365e9f;
            --surface-card: #f1eede;
            --gold-accent: #d4a73e;
            --border-color: #1c1c13;
        }}

        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            font-family: 'Inter', 'Space Grotesk', sans-serif;
            background-color: var(--bg-surface);
            color: var(--on-bg);
            line-height: 1.6;
            padding: 40px 20px;
        }}

        .report-wrapper {{
            max-width: 1000px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 4px solid var(--border-color);
            box-shadow: 8px 8px 0px 0px var(--border-color);
            padding: 60px 50px;
        }}

        .header-banner {{
            text-align: center;
            border-bottom: 4px solid var(--border-color);
            padding-bottom: 25px;
            margin-bottom: 35px;
        }}

        h1, h2, h3, h4 {{
            font-family: 'Harmond', 'Space Grotesk', serif;
            color: var(--on-bg);
            margin-bottom: 12px;
        }}

        .heading-1 {{
            font-size: 2.2rem;
            text-transform: uppercase;
            letter-spacing: -0.02em;
            color: var(--primary-green);
            border-bottom: 3px solid var(--border-color);
            padding-bottom: 8px;
            margin-top: 35px;
            margin-bottom: 20px;
        }}

        .heading-2 {{
            font-size: 1.6rem;
            color: var(--secondary-blue);
            margin-top: 28px;
            margin-bottom: 14px;
        }}

        .heading-3 {{
            font-size: 1.25rem;
            color: var(--on-bg);
            margin-top: 22px;
            margin-bottom: 10px;
        }}

        .heading-4 {{
            font-size: 1.05rem;
            font-weight: 700;
            color: #444;
            margin-top: 16px;
        }}

        .para {{
            font-size: 1rem;
            margin-bottom: 14px;
            color: #2b2b2b;
            text-align: justify;
        }}

        .spacer {{
            height: 10px;
        }}

        .section-divider {{
            border: none;
            border-top: 4px solid var(--border-color);
            margin: 40px 0;
        }}

        /* Table Styling */
        .table-container {{
            width: 100%;
            overflow-x: auto;
            margin: 20px 0;
        }}

        .pixel-table {{
            width: 100%;
            border-collapse: collapse;
            border: 3px solid var(--border-color);
            font-size: 0.92rem;
            background-color: var(--bg-surface);
        }}

        .pixel-table th {{
            background-color: var(--primary-green);
            color: #ffffff;
            font-family: 'Space Grotesk', sans-serif;
            text-transform: uppercase;
            padding: 10px 14px;
            border: 2px solid var(--border-color);
            text-align: left;
        }}

        .pixel-table td {{
            padding: 10px 14px;
            border: 2px solid var(--border-color);
            color: #111;
        }}

        .pixel-table tr:nth-child(even) {{
            background-color: #f5f2e1;
        }}

        /* Code Blocks */
        .code-block {{
            background-color: #1c1c13;
            color: #85d064;
            font-family: 'JetBrains Mono', monospace;
            padding: 18px 22px;
            border: 3px solid var(--border-color);
            box-shadow: 4px 4px 0px 0px var(--border-color);
            border-radius: 4px;
            overflow-x: auto;
            font-size: 0.88rem;
            margin: 20px 0;
            line-height: 1.5;
        }}

        .inline-code {{
            font-family: 'JetBrains Mono', monospace;
            background-color: #eae5cc;
            color: #922b21;
            padding: 2px 6px;
            border: 1px solid var(--border-color);
            border-radius: 3px;
            font-size: 0.88rem;
        }}

        /* Image Cards */
        .img-card {{
            margin: 30px 0;
            text-align: center;
            background: var(--bg-surface);
            border: 3px solid var(--border-color);
            box-shadow: 6px 6px 0px 0px var(--border-color);
            padding: 16px;
        }}

        .img-card img {{
            max-width: 100%;
            height: auto;
            border: 2px solid var(--border-color);
            border-radius: 2px;
        }}

        .img-card .caption {{
            display: block;
            margin-top: 10px;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 700;
            font-size: 0.9rem;
            color: var(--secondary-blue);
            text-transform: uppercase;
        }}

        /* Quotes & Notes */
        .quote-box {{
            background-color: var(--surface-card);
            border-left: 6px solid var(--gold-accent);
            border-top: 2px solid var(--border-color);
            border-right: 2px solid var(--border-color);
            border-bottom: 2px solid var(--border-color);
            padding: 16px 20px;
            margin: 20px 0;
            font-style: italic;
            color: #333;
        }}

        .report-list {{
            margin-left: 24px;
            margin-bottom: 16px;
        }}

        .report-list li {{
            margin-bottom: 6px;
        }}

        .doc-link {{
            color: var(--secondary-blue);
            font-weight: 600;
            text-decoration: underline;
        }}

        /* Print Controls Bar */
        .print-bar {{
            position: fixed;
            top: 15px;
            right: 20px;
            z-index: 1000;
            background: var(--primary-green);
            color: #fff;
            padding: 10px 20px;
            border: 3px solid var(--border-color);
            box-shadow: 4px 4px 0px 0px var(--border-color);
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 700;
            cursor: pointer;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 8px;
        }}
        .print-bar:hover {{
            background: #2a5213;
        }}

        @media print {{
            .print-bar {{ display: none; }}
            body {{ padding: 0; background: #fff; }}
            .report-wrapper {{ border: none; box-shadow: none; padding: 0; max-width: 100%; }}
            .heading-1 {{ page-break-before: always; }}
            .img-card, .code-block, .table-container {{ page-break-inside: avoid; }}
        }}
    </style>
</head>
<body>
    <button class="print-bar" onclick="window.print()">🖨️ Save as PDF / Print Report</button>
    <div class="report-wrapper">
        {body_html}
    </div>
</body>
</html>
"""

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(full_html)

print("SUCCESS: EduPixel_Major_Capstone_Project_Report.html successfully generated!")
