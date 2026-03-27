import os

base_dir = "d:/archivos gaaa/SDK-FINIX PAGES"
os.chdir(base_dir)

html_files = []
for root, dirs, files in os.walk("."):
    for file in files:
        if file.endswith("index.html"):
            html_files.append(os.path.join(root, file))

snippet = """
    <script>
        if (window.location.pathname.endsWith("index.html")) {
            window.location.replace(window.location.pathname.replace("index.html", ""));
        }
    </script>
</head>"""

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "window.location.replace" not in content:
        content = content.replace("</head>", snippet)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
            
print(f"Script inyectado en {len(html_files)} archivos HTML exitosamente.")
