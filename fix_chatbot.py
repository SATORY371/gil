import os
import re

base_dir = "d:/archivos gaaa/SDK-FINIX PAGES"
os.chdir(base_dir)

html_files = []
for root, dirs, files in os.walk("."):
    # Exclude agente-zenix (has its own full-screen chat)
    dirs[:] = [d for d in dirs if d not in ['agente-zenix', '.git']]
    for file in files:
        if file.endswith("index.html"):
            html_files.append(os.path.join(root, file))

# Also include agente-zenix separately (needs logo fix but NOT chatbot)
agente_file = os.path.join(".", "agente-zenix", "index.html")

# Determine prefix (../ or empty) based on depth
def get_prefix(filepath):
    # filepath is like ./index.html or ./services/index.html
    parts = filepath.replace("\\", "/").split("/")
    depth = len(parts) - 2  # subtract ./ and filename
    return "../" * depth

# The chatbot HTML block
def chatbot_html(prefix):
    return f"""
    <!-- ===================== CHATBOT FLOTANTE ===================== -->
    <div id="chatbot-container">
        <div id="zenix-side-avatar" title="Hablar con Zenix IA">
            <img src="{prefix}IMAGEN/SDK.png" alt="Zenix IA - Asistente Virtual SDK FINIX">
        </div>
        <div style="position:relative; display:flex; flex-direction:column; align-items:center;">
            <div id="chat-window">
                <div id="chat-header">
                    <h3>⚡ Zenix IA</h3>
                    <button id="chat-close" title="Cerrar">✕</button>
                </div>
                <div id="chat-body" class="chat-body">
                    <div class="msg bot">¡Hola! Soy <strong>Zenix</strong> ⚡, la IA oficial de SDK FINIX. Estoy aquí para ayudarte con cualquier consulta sobre nuestros servicios. ¿En qué puedo ayudarte hoy?</div>
                </div>
                <div id="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Escribe tu consulta...">
                    <button id="chat-send" title="Enviar">▶</button>
                </div>
            </div>
            <button id="chat-btn" title="Chatear con Zenix">💬</button>
        </div>
    </div>
</body>"""

# Fix logo-icon in header: replace ⚡ emoji with the .ico image
def fix_logo(content, prefix):
    # Replace the logo-icon div that contains just the emoji
    old = '<div class="logo-icon">⚡</div>'
    new = f'<div class="logo-icon" style="background:none;padding:0;width:36px;height:36px;overflow:hidden;"><img src="{prefix}IMAGEN/SDK-FINIX.ico" alt="SDK FINIX Logo" style="width:100%;height:100%;object-fit:contain;border-radius:8px;"></div>'
    return content.replace(old, new)

fixed = 0
for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    prefix = get_prefix(filepath)
    changed = False

    # 1. Fix logo icon
    if '<div class="logo-icon">⚡</div>' in content:
        content = fix_logo(content, prefix)
        changed = True

    # 2. Inject chatbot HTML (only if not already present)
    if 'id="chatbot-container"' not in content:
        content = content.replace('</body>', chatbot_html(prefix))
        changed = True

    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        fixed += 1
        print(f"[OK] Arreglado: {filepath}")
    else:
        print(f"[--] Sin cambios: {filepath}")

# Fix logo only in agente-zenix (no chatbot there, it has its own agent.js)
with open(agente_file, 'r', encoding='utf-8') as f:
    content = f.read()

prefix = "../"
if '<div class="logo-icon">\u26a1</div>' in content:
    content = fix_logo(content, prefix)
    with open(agente_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"[OK] Logo arreglado en: {agente_file}")

print(f"\n[DONE] Proceso completado. {fixed} archivos actualizados con chatbot + logo.")
