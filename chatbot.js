document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar marked.js dinámicamente para parsear Markdown (tablas, negritas, etc)
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
    document.head.appendChild(script);

    const WORKER_URL = "https://zenix-api.vegaquispeelvis.workers.dev/"; 

    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatBtn = document.getElementById('chat-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatHeader = document.getElementById('chat-header');
    const chatInputArea = document.getElementById('chat-input-area');
    const chatClose = document.getElementById('chat-close');

    // 2. Inyectar botones de Voz y Borrar en el UI dinámicamente
    if (chatHeader) {
        // Contenedor para los controles extra en el header
        const headerControls = document.createElement('div');
        headerControls.style.display = 'flex';
        headerControls.style.gap = '5px';
        headerControls.style.marginRight = '10px';
        headerControls.style.marginLeft = 'auto';
        headerControls.style.alignItems = 'center';

        // Botón Altavoz
        const btnSpeaker = document.createElement('button');
        btnSpeaker.innerHTML = '🔈';
        btnSpeaker.title = "Activar voz de Zenix";
        btnSpeaker.style.background = 'transparent';
        btnSpeaker.style.border = 'none';
        btnSpeaker.style.cursor = 'pointer';
        btnSpeaker.style.fontSize = '1.2rem';
        headerControls.appendChild(btnSpeaker);

        // Botón Borrar Chat
        const btnClear = document.createElement('button');
        btnClear.innerHTML = '🗑️';
        btnClear.title = "Borrar chat";
        btnClear.style.background = 'transparent';
        btnClear.style.border = 'none';
        btnClear.style.cursor = 'pointer';
        btnClear.style.fontSize = '1.2rem';
        headerControls.appendChild(btnClear);

        // Insertar antes del botón de cerrar
        chatHeader.insertBefore(headerControls, chatClose);

        // Lógica de Voz (Text-to-Speech)
        let isSpeakerEnabled = false;
        btnSpeaker.onclick = () => {
            isSpeakerEnabled = !isSpeakerEnabled;
            btnSpeaker.innerText = isSpeakerEnabled ? "🔊" : "🔈";
        };

        // Exportar variable para uso en sendMessage
        window.zenixSpeakerEnabled = () => isSpeakerEnabled;

        // Lógica Borrar Historial
        btnClear.onclick = () => {
            if(confirm("¿Seguro que deseas borrar el chat?")) {
                chatBody.innerHTML = '';
                addSuggestions();
            }
        };
    }

    if (chatInputArea) {
        // Botón Micrófono
        const btnMic = document.createElement('button');
        btnMic.innerHTML = '🎙️';
        btnMic.title = "Dictar por voz";
        btnMic.style.background = 'transparent';
        btnMic.style.border = 'none';
        btnMic.style.cursor = 'pointer';
        btnMic.style.fontSize = '1.2rem';
        btnMic.style.padding = '0 10px';
        
        chatInputArea.insertBefore(btnMic, chatInput);

        // Lógica Micrófono (Voice-to-Text)
        let recognition;
        let isRecording = false;
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.lang = 'es-ES';
            recognition.onstart = () => { 
                isRecording = true; 
                btnMic.style.color = "red"; 
                chatInput.placeholder = "Escuchando...";
            };
            recognition.onresult = (e) => { 
                chatInput.value = e.results[0][0].transcript; 
                sendMessage(); 
            };
            recognition.onend = () => { 
                isRecording = false; 
                btnMic.style.color = ""; 
                chatInput.placeholder = "Escribe tu consulta...";
            };
            btnMic.onclick = () => { isRecording ? recognition.stop() : recognition.start(); };
        } else {
            btnMic.style.display = 'none';
        }
    }

    const faqs = [
        "¿Qué servicios ofrece SDK FINIX? 🚀",
        "¿Eres experto en C# y SQL? 💻",
        "¿Cómo contacto con soporte técnico? 🛠️"
    ];

    if (chatBtn) {
        chatBtn.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
            if (chatWindow.classList.contains('active')) {
                chatInput.focus();
                if (chatBody.innerHTML.trim() === "") addSuggestions();
            }
        });
    }

    if (chatClose) chatClose.addEventListener('click', () => chatWindow.classList.remove('active'));

    function addSuggestions() {
        const container = document.createElement('div');
        container.className = 'suggestion-container';
        container.style.cssText = "display:flex; flex-wrap:wrap; gap:8px; padding:10px;";

        faqs.forEach(q => {
            const btn = document.createElement('button');
            btn.innerText = q;
            btn.style.cssText = "background:#00f2ff22; border:1px solid #00f2ff; color:#00f2ff; padding:5px 10px; border-radius:5px; cursor:pointer; font-size:0.8em;";
            btn.onclick = () => {
                sendMessage(q);
                container.remove();
            };
            container.appendChild(btn);
        });
        chatBody.appendChild(container);
    }

    async function sendMessage(overrideText = null) {
        const text = overrideText || chatInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatInput.value = '';
        
        const oldSuggestions = chatBody.querySelector('.suggestion-container');
        if (oldSuggestions) oldSuggestions.remove();

        const typing = showTyping();

        try {
            const response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();
            if (typing) typing.remove();

            let rawReply = data.reply || "Error de red.";
            addMessage(rawReply, 'bot');

            // Leer respuesta en voz alta si está habilitado
            if (window.zenixSpeakerEnabled && window.zenixSpeakerEnabled()) {
                const cleanText = rawReply.replace(/[*#`_]/g, ''); // Limpiar markdown para hablar
                const u = new SpeechSynthesisUtterance(cleanText);
                u.lang = 'es-ES';
                window.speechSynthesis.speak(u);
            }

        } catch (error) {
            if (typing) typing.remove();
            addMessage("Error de conexión neuronal.", 'bot');
        }
    }

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `msg ${sender}`;
        
        if (sender === 'bot' && typeof marked !== 'undefined') {
            const fixedText = fixIncompleteTables(text);
            div.innerHTML = marked.parse(fixedText);
            enhanceTables(div);
        } else if (sender === 'bot') {
            // Fallback si marked no cargó aún
            div.innerHTML = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        } else {
            div.innerText = text;
        }

        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function fixIncompleteTables(text) {
        const lines = text.split('\n');
        let inTable = false;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('|')) {
                if (!inTable) {
                    inTable = true;
                    // Check if next line is a separator
                    if (i + 1 >= lines.length || !lines[i + 1].trim().match(/^\|?[\s\-:]+\|/)) {
                        const pipes = (line.match(/\|/g) || []).length;
                        const cols = Math.max(1, pipes);
                        let sep = '|' + '---|'.repeat(cols);
                        lines.splice(i + 1, 0, sep);
                    }
                }
            } else {
                inTable = false;
            }
        }
        return lines.join('\n');
    }

    function showTyping() {
        const div = document.createElement('div');
        div.className = 'msg bot typing';
        div.innerHTML = 'Zenix pensando... ⚡';
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
        return div;
    }

    function enhanceTables(container) {
        const tables = container.querySelectorAll('table');
        tables.forEach(table => {
            // Aplicar estilos locales a la tabla para que se vea bien
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.style.marginTop = '10px';
            table.style.marginBottom = '10px';
            table.style.fontSize = '0.9em';
            table.style.color = '#fff';
            
            table.querySelectorAll('th, td').forEach(cell => {
                cell.style.border = '1px solid rgba(34, 211, 238, 0.3)';
                cell.style.padding = '8px';
                cell.style.textAlign = 'left';
            });
            table.querySelectorAll('th').forEach(th => {
                th.style.background = 'rgba(34, 211, 238, 0.15)';
                th.style.color = 'var(--cyan, #22d3ee)';
            });

            // Envolver en un div exportable
            const wrapper = document.createElement('div');
            wrapper.className = 'zenix-table-container';
            wrapper.style.position = 'relative';
            wrapper.style.overflowX = 'auto';
            wrapper.style.marginBottom = '15px';
            wrapper.style.border = '1px solid rgba(34, 211, 238, 0.2)';
            wrapper.style.borderRadius = '8px';
            wrapper.style.padding = '10px';
            wrapper.style.background = 'rgba(0,0,0,0.3)';
            
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);

            // Botón de exportación a CSV
            const btnExport = document.createElement('button');
            btnExport.innerHTML = '📥 Exportar a CSV (Excel)';
            btnExport.title = "Descargar tabla en formato CSV";
            btnExport.style.cssText = "display:block; margin-top:10px; background:var(--grad-main, linear-gradient(90deg, #22d3ee, #a855f7)); color:#000; border:none; padding:8px 12px; border-radius:5px; cursor:pointer; font-weight:bold; font-size:0.85rem; width:100%; transition: transform 0.2s;";
            btnExport.onmouseover = () => btnExport.style.transform = 'scale(1.02)';
            btnExport.onmouseout = () => btnExport.style.transform = 'scale(1)';
            btnExport.onclick = () => exportTableToCSV(table);
            wrapper.appendChild(btnExport);
        });
    }

    function exportTableToCSV(table) {
        let csv = [];
        const rows = table.querySelectorAll("tr");
        for (let i = 0; i < rows.length; i++) {
            let row = [], cols = rows[i].querySelectorAll("td, th");
            for (let j = 0; j < cols.length; j++) {
                // Escapar comillas dobles y envolver texto en comillas
                let data = cols[j].innerText.replace(/"/g, '""');
                row.push('"' + data + '"');
            }
            csv.push(row.join(","));
        }
        const csvFile = new Blob(["\uFEFF" + csv.join("\n")], { type: "text/csv;charset=utf-8;" }); // uFEFF para soportar tildes en Excel
        const downloadLink = document.createElement("a");
        downloadLink.download = "datos_zenix.csv";
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    if(chatSend) chatSend.addEventListener('click', () => sendMessage());
    if(chatInput) chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
});