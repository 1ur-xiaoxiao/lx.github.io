"""Fix < to \lt inside $...$ and $$...$$ math blocks in HTML files."""
import sys, os

def fix_math_lt_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    result = []
    i = 0
    in_script = False
    in_math = False
    math_delim = None

    while i < len(text):
        # Track script/style blocks (don't touch them)
        if text[i:i+7] == '<script' and not in_math:
            in_script = True
        if in_script and text[i:i+9] == '</script>':
            result.append(text[i:i+9])
            i += 9
            in_script = False
            continue
        if in_script:
            result.append(text[i])
            i += 1
            continue

        # Handle display math $$...$$
        if text[i:i+2] == '$$':
            if not in_math:
                in_math = True
                math_delim = '$$'
                result.append('$$')
                i += 2
                continue
            elif math_delim == '$$':
                in_math = False
                math_delim = None
                result.append('$$')
                i += 2
                continue

        # Handle inline math $...$
        if text[i] == '$' and (i == 0 or text[i-1] != '\\'):
            if not in_math:
                in_math = True
                math_delim = '$'
                result.append('$')
                i += 1
                continue
            elif math_delim == '$':
                in_math = False
                math_delim = None
                result.append('$')
                i += 1
                continue

        # Replace < with \lt when inside math mode
        if in_math and text[i] == '<':
            result.append('\\lt')
        else:
            result.append(text[i])
        i += 1

    new_text = ''.join(result)

    if new_text != text:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_text)
        return True
    return False

if __name__ == '__main__':
    base = os.path.dirname(os.path.abspath(__file__))
    files = ['ch1.html', 'ch2.html', 'ch3.html', 'ch4.html', 'appendix.html', 'mock.html']
    for f in files:
        path = os.path.join(base, f)
        if os.path.exists(path):
            changed = fix_math_lt_in_file(path)
            print(f"{'FIXED' if changed else 'OK'}: {f}")
        else:
            print(f"SKIP (not found): {f}")
