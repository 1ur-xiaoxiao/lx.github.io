import olefile, os

ppt = r'C:\Users\14909\OneDrive\Desktop\课程总览\概率论\第四章.ppt'
ole = olefile.OleFileIO(ppt)
all_text = []
for s in ole.listdir():
    try:
        data = ole.openstream(s).read()
        text = data.decode('utf-16-le', errors='replace')
        clean = ''.join(ch for ch in text if ord(ch) > 31 or ch in '\n\r\t')
        if len(clean.strip()) > 30:
            all_text.append(clean)
    except:
        pass
ole.close()

output = r'C:\Users\14909\OneDrive\Desktop\课程总览\ppt_ch4_output.txt'
with open(output, 'w', encoding='utf-8') as f:
    for i, t in enumerate(all_text):
        f.write(f'\n{"="*60}\nSTREAM {i}\n{"="*60}\n')
        f.write(t[:5000])
        f.write('\n')

print(f'Written {len(all_text)} streams to {output}')
