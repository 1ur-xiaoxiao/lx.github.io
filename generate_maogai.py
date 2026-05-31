import re
import os

base_dir = os.path.dirname(__file__)

with open(os.path.join(base_dir, 'maogai_extracted.txt'), 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Parse into chapters
chapters = []
current_chapter = None
current_questions = []
current_question = None
current_answer_lines = []
in_question = False

chapter_pattern = re.compile(r'^第([一二三四五六七八])章\s+.+')

for line in lines:
    line = line.rstrip()

    # Check if this is a chapter header
    m = chapter_pattern.match(line)
    if m:
        # Save previous chapter
        if current_chapter is not None:
            if current_question is not None:
                current_questions.append((current_question, '\n'.join(current_answer_lines)))
            chapters.append((current_chapter, current_questions))

        current_chapter = line.strip()
        current_questions = []
        current_question = None
        current_answer_lines = []
        in_question = False
        continue

    # Check if this is a question (starts with digit followed by 、)
    if re.match(r'^\d+[、.]', line) and len(line) < 200:
        # Save previous question
        if current_question is not None:
            current_questions.append((current_question, '\n'.join(current_answer_lines)))

        current_question = line.strip()
        current_answer_lines = []
        in_question = True
        continue

    # Collect answer lines
    if in_question and current_chapter is not None:
        current_answer_lines.append(line)

# Don't forget last question and chapter
if current_question is not None:
    current_questions.append((current_question, '\n'.join(current_answer_lines)))
if current_chapter is not None:
    chapters.append((current_chapter, current_questions))

print(f"Found {len(chapters)} chapters:")
for ch_title, qs in chapters:
    print(f"  {ch_title}: {len(qs)} questions")

# Chapter number mapping
ch_nums = {'一': '1', '二': '2', '三': '3', '四': '4', '六': '6', '七': '7', '八': '8'}
# Note: Chapter 5 and 9+ are not in the document

# All chapter names for nav
all_chapters_nav = [
    ('第一章', 'ch1.html'),
    ('第二章', 'ch2.html'),
    ('第三章', 'ch3.html'),
    ('第四章', 'ch4.html'),
    ('第六章', 'ch6.html'),
    ('第七章', 'ch7.html'),
    ('第八章', 'ch8.html'),
]

def make_nav(current_page=''):
    """Generate navigation bar HTML"""
    items = []
    for ch_name, ch_file in all_chapters_nav:
        if ch_file == current_page:
            items.append(f'<li><a href="{ch_file}" style="background:rgba(255,255,255,0.2);color:#fff;">{ch_name}</a></li>')
        else:
            items.append(f'<li><a href="{ch_file}">{ch_name}</a></li>')
    return '\n          '.join(items)

def format_answer(text):
    """Format answer text into HTML with proper structure"""
    if not text.strip():
        return ''

    lines = text.strip().split('\n')
    result = []
    current_section = []  # lines within current （N） or main section
    current_label = None  # e.g. （1）, （2）

    def flush_section():
        nonlocal current_section, current_label
        if not current_section:
            return
        content = ' '.join(current_section).strip()
        if not content:
            current_section = []
            return

        # Split inline ①②③ items into separate lines with <br>
        # Pattern: ①... ②... ③...
        if re.search(r'[①②③④⑤⑥⑦⑧⑨⑩]\s*[^①②③④⑤⑥⑦⑧⑨⑩]*[①②③④⑤⑥⑦⑧⑨⑩]', content):
            # Has multiple numbered items inline - split them
            parts = re.split(r'(?=[①②③④⑤⑥⑦⑧⑨⑩])', content)
            formatted_parts = []
            for part in parts:
                part = part.strip()
                if part:
                    formatted_parts.append(part)
            content = '<br>'.join(formatted_parts)

        if current_label:
            result.append(f'<p><strong>{current_label}</strong> {content}</p>')
        else:
            result.append(f'<p>{content}</p>')
        current_section = []
        current_label = None

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        # Check if this starts a new （N） or (N) section
        m = re.match(r'^[（(](\d+)[)）](.*)', stripped)
        if m:
            flush_section()
            num = m.group(1)
            rest = m.group(2).strip()
            label = f'（{num}）'
            if rest:
                current_label = label
                current_section = [rest]
            else:
                current_label = label
                current_section = []
            continue

        # Check if this is a standalone label like （1） on its own line
        current_section.append(stripped)

    flush_section()

    return '\n'.join(result) if result else '<p>' + text.strip() + '</p>'

def build_chapter_html(ch_title, questions, ch_file):
    """Build complete HTML for a chapter page"""

    # Extract chapter number and name
    m = re.match(r'^(第[一二三四五六七八]章)\s+(.+)', ch_title)
    if m:
        ch_label = m.group(1)
        ch_name = m.group(2)
    else:
        ch_label = ch_title
        ch_name = ''

    nav_html = make_nav(ch_file)

    # Build Q&A sections
    qa_html_parts = []
    for q_title, q_answer in questions:
        # Clean question title
        q_clean = re.sub(r'^\d+[、.]\s*', '', q_title)
        qa_html_parts.append(f'''    <div class="qa-item">
      <div class="qa-question">{q_title}</div>
      <div class="qa-answer">
        {format_answer(q_answer)}
      </div>
    </div>''')

    qa_html = '\n\n'.join(qa_html_parts)

    # Find prev/next links
    chapter_order = [c[0] for c in all_chapters_nav]
    try:
        idx = [c[0] for c in all_chapters_nav].index(ch_label)
    except ValueError:
        idx = -1

    prev_link = ''
    next_link = ''
    if idx > 0:
        prev_label, prev_file = all_chapters_nav[idx - 1]
        prev_link = f'<a href="{prev_file}" class="prev">← {prev_label}</a>'
    else:
        prev_link = f'<a href="index.html" class="prev">← 目录</a>'

    if idx < len(all_chapters_nav) - 1:
        next_label, next_file = all_chapters_nav[idx + 1]
        next_link = f'<a href="{next_file}" class="next">{next_label} →</a>'
    else:
        next_link = f'<a href="index.html" class="next">目录 →</a>'

    html = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{ch_label} · {ch_name} · 毛概课后题</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

<nav class="navbar">
  <a href="../index.html" style="color:rgba(255,255,255,0.65);text-decoration:none;font-size:0.82rem;margin-right:8px;">← 总览</a>
  <a href="index.html" class="nav-brand">毛概 · 课后题标答</a>
  <button class="nav-toggle" aria-label="菜单">☰</button>
  <ul class="nav-links">
    {nav_html}
  </ul>
</nav>

<div class="main-content">

  <div class="chapter-header">
    <h1>{ch_label} · {ch_name}</h1>
    <p>共 {len(questions)} 道课后题 · 基于 2023 版教材</p>
  </div>

  <div class="qa-section">

{qa_html}

  </div>

  <div class="chapter-nav">
    {prev_link}
    {next_link}
  </div>

</div>

<footer class="footer">
  <p>毛概课后题知识点标答 · 基于 2023 版教材 · 仅供学习参考</p>
</footer>

<script>
document.querySelector('.nav-toggle').addEventListener('click', function() {{
  document.querySelector('.nav-links').classList.toggle('open');
}});
</script>
</body>
</html>'''
    return html


def build_index_html(chapters_info):
    """Build the main index.html"""

    nav_html = make_nav()

    # Build chapter cards
    cards = []
    for ch_title, questions in chapters_info:
        m = re.match(r'^(第[一二三四五六七八]章)\s+(.+)', ch_title)
        if m:
            ch_label = m.group(1)
            ch_name = m.group(2)
        else:
            continue

        ch_num = ch_label.replace('第', '').replace('章', '')
        ch_num_display = ch_nums.get(ch_num, '')
        ch_file = f'ch{ch_num_display}.html'
        n_q = len(questions)

        # Get first few questions as preview
        preview_items = []
        for q_title, _ in questions[:3]:
            q_clean = re.sub(r'^\d+[、.]\s*', '', q_title)
            if len(q_clean) > 40:
                q_clean = q_clean[:40] + '...'
            preview_items.append(f'<li>{q_clean}</li>')

        preview_html = '\n          '.join(preview_items)

        cards.append(f'''    <div class="chapter-card">
      <span class="card-number">{ch_num_display}</span>
      <h3>{ch_label}</h3>
      <p>{ch_name} · {n_q} 道课后题</p>
      <ul style="font-size:0.82rem;color:var(--text-muted);margin-bottom:12px;">
        {preview_html}
      </ul>
      <a href="{ch_file}" class="card-link">进入{ch_label} →</a>
    </div>''')

    cards_html = '\n\n'.join(cards)

    html = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>毛概 · 课后题知识点标答</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

<nav class="navbar">
  <a href="../index.html" style="color:rgba(255,255,255,0.65);text-decoration:none;font-size:0.82rem;margin-right:8px;">← 总览</a>
  <a href="index.html" class="nav-brand">毛概 · 课后题标答</a>
  <button class="nav-toggle" aria-label="菜单">☰</button>
  <ul class="nav-links">
    {nav_html}
  </ul>
</nav>

<div class="main-content">

  <div class="hero">
    <h1>毛泽东思想和中国特色社会主义理论体系概论</h1>
    <p>课后题知识点标准答案 · 基于 2023 版教材整理</p>
  </div>

  <div class="chapter-cards">

{cards_html}

  </div>

</div>

<footer class="footer">
  <p>毛概课后题知识点标答 · 基于 2023 版教材 · 仅供学习参考</p>
</footer>

<script>
document.querySelector('.nav-toggle').addEventListener('click', function() {{
  document.querySelector('.nav-links').classList.toggle('open');
}});
</script>
</body>
</html>'''
    return html


# Generate all files
output_dir = os.path.join(base_dir, '毛概')

# Generate index page
index_html = build_index_html(chapters)
with open(os.path.join(output_dir, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(index_html)
print("Created index.html")

# Generate chapter pages
for ch_title, questions in chapters:
    m = re.match(r'^第([一二三四五六七八])章', ch_title)
    if m:
        ch_num_char = m.group(1)
        ch_num = ch_nums.get(ch_num_char, '0')
        ch_file = f'ch{ch_num}.html'

        html = build_chapter_html(ch_title, questions, ch_file)
        with open(os.path.join(output_dir, ch_file), 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Created {ch_file} ({len(questions)} questions)")

print("\nDone! All pages generated.")
