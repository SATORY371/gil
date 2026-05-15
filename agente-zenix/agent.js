document.addEventListener('DOMContentLoaded', () => {

    // 1. Cargar marked.js dinámicamente
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
    document.head.appendChild(script);

    // ==================== CONFIGURACIÓN ====================
    const WORKER_URL = "https://zenix-api.vegaquispeelvis.workers.dev"; 

    // ==================== LOCAL STORAGE ====================
    const STORAGE_KEY = 'zenix_chats';
    let chats = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    let currentChatId = null;

    // ==================== ELEMENTOS DOM ====================
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const historyList = document.getElementById('chat-history-list');
    const newChatBtn = document.getElementById('new-chat-btn');
    const btnSpeaker = document.getElementById('btn-speaker');
    const btnMic = document.getElementById('btn-mic');
    
    // Botón Borrar Historial (inyectado dinámicamente debajo del nuevo chat)
    const btnClearHistory = document.createElement('button');
    btnClearHistory.innerHTML = '🗑️ Borrar Historial';
    btnClearHistory.className = 'new-chat-btn';
    btnClearHistory.style.borderColor = 'rgba(239, 68, 68, 0.5)';
    btnClearHistory.style.color = '#ef4444';
    btnClearHistory.style.marginTop = '10px';
    
    if (newChatBtn && newChatBtn.parentNode) {
        newChatBtn.parentNode.insertBefore(btnClearHistory, newChatBtn.nextSibling);
    }
    
    btnClearHistory.onclick = () => {
        if(confirm("¿Estás seguro de que quieres borrar todos tus chats?")) {
            chats = [];
            currentChatId = null;
            save();
            createNewChat();
        }
    };

    // ==================== VOZ (DICTADO Y AUDIO) ====================
    let isSpeakerEnabled = false;
    let recognition;
    let isRecording = false;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.onstart = () => { 
            isRecording = true; 
            if(btnMic) btnMic.classList.add('recording'); 
            chatInput.placeholder = "Escuchando...";
        };
        recognition.onresult = (e) => { 
            chatInput.value = e.results[0][0].transcript; 
            sendMessage(); 
        };
        recognition.onend = () => { 
            isRecording = false; 
            if(btnMic) btnMic.classList.remove('recording'); 
            chatInput.placeholder = "Escribe tu mensaje o usa el micrófono...";
        };
    }

    // ==================== LÓGICA DE HISTORIAL ====================
    function createNewChat() {
        const id = Date.now();
        chats.unshift({ id, title: 'Consulta Nueva', messages: [] });
        currentChatId = id;
        save();
        renderHistory();
        renderActiveChat();
    }

    function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(chats)); }

    function renderHistory() {
        if (!historyList) return;
        historyList.innerHTML = '';
        chats.forEach(c => {
            const li = document.createElement('li');
            li.className = 'chat-item ' + (c.id === currentChatId ? 'active' : '');
            li.innerHTML = `<span>💬 ${c.title}</span>`;
            li.onclick = () => { 
                currentChatId = c.id; 
                renderHistory(); 
                renderActiveChat(); 
            };
            historyList.appendChild(li);
        });
    }

    function renderActiveChat() {
        if (!chatBody) return;
        chatBody.innerHTML = '';
        const act = chats.find(c => c.id === currentChatId);
        if (act) act.messages.forEach(m => addMsgUI(m.text, m.sender));
    }

    function addMsgUI(text, sender) {
        const div = document.createElement('div');
        div.className = `msg ${sender}`;
        
        if (sender === 'bot' && typeof marked !== 'undefined') {
            const fixedText = fixIncompleteTables(text);
            div.innerHTML = marked.parse(fixedText);
            enhanceTables(div);
        } else if (sender === 'bot') {
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

    function enhanceTables(container) {
        const tables = container.querySelectorAll('table');
        tables.forEach(table => {
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.style.marginTop = '10px';
            table.style.marginBottom = '10px';
            table.style.fontSize = '0.95em';
            
            table.querySelectorAll('th, td').forEach(cell => {
                cell.style.border = '1px solid rgba(34, 211, 238, 0.3)';
                cell.style.padding = '10px';
            });
            table.querySelectorAll('th').forEach(th => {
                th.style.background = 'rgba(34, 211, 238, 0.15)';
                th.style.color = 'var(--cyan, #22d3ee)';
            });

            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.overflowX = 'auto';
            wrapper.style.marginBottom = '15px';
            wrapper.style.border = '1px solid rgba(34, 211, 238, 0.2)';
            wrapper.style.borderRadius = '8px';
            wrapper.style.padding = '15px';
            wrapper.style.background = 'rgba(0,0,0,0.3)';
            
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);

            const btnExport = document.createElement('button');
            btnExport.innerHTML = '📥 Exportar a CSV (Excel)';
            btnExport.title = "Descargar tabla en formato CSV";
            btnExport.style.cssText = "display:inline-block; margin-top:10px; background:var(--grad-main, linear-gradient(90deg, #22d3ee, #a855f7)); color:#000; border:none; padding:8px 16px; border-radius:5px; cursor:pointer; font-weight:bold; font-size:0.9rem; transition: transform 0.2s;";
            btnExport.onmouseover = () => btnExport.style.transform = 'scale(1.05)';
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
                let data = cols[j].innerText.replace(/"/g, '""');
                row.push('"' + data + '"');
            }
            csv.push(row.join(","));
        }
        const csvFile = new Blob(["\uFEFF" + csv.join("\n")], { type: "text/csv;charset=utf-8;" });
        const downloadLink = document.createElement("a");
        downloadLink.download = "datos_zenix_cibernucleo.csv";
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    // ==================== ENVÍO AL WORKER ====================
    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;
        chatInput.value = '';

        if (!currentChatId) createNewChat();
        const act = chats.find(c => c.id === currentChatId);
        
        if (act.messages.length === 0) {
            act.title = text.substring(0, 25);
            renderHistory();
        }

        act.messages.push({ sender: 'user', text });
        renderActiveChat();
        save();

        const typing = document.createElement('div');
        typing.className = 'msg bot';
        typing.innerText = 'Zenix está procesando...';
        chatBody.appendChild(typing);
        chatBody.scrollTop = chatBody.scrollHeight;

        try {
            const res = await fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            const data = await res.json();
            typing.remove();

            if (res.ok) {
                const botReply = data.reply || "Respuesta vacía.";
                act.messages.push({ sender: 'bot', text: botReply });
                renderActiveChat();
                save();
                if (isSpeakerEnabled) speak(botReply);
            } else {
                const errorMsg = data.reply || "Error: El Worker respondió con un error técnico.";
                addMsgUI(errorMsg, 'bot');
            }
        } catch (e) {
            if (typing) typing.remove();
            console.error("Connection Error:", e);
            addMsgUI("Error de conexión neuronal con el Ciber-Núcleo.", 'bot');
        }
    }

    function speak(t) {
        // Limpiar markdown antes de hablar
        const cleanText = t.replace(/[*#`_]/g, '');
        const u = new SpeechSynthesisUtterance(cleanText);
        u.lang = 'es-ES';
        window.speechSynthesis.speak(u);
    }

    // ==================== EVENTOS FINAL ====================
    if(chatSend) chatSend.addEventListener('click', sendMessage);
    if(chatInput) chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
    if(newChatBtn) newChatBtn.addEventListener('click', createNewChat);
    if(btnMic) btnMic.addEventListener('click', () => { if (recognition) isRecording ? recognition.stop() : recognition.start(); });
    if(btnSpeaker) btnSpeaker.addEventListener('click', () => {
        isSpeakerEnabled = !isSpeakerEnabled;
        btnSpeaker.innerText = isSpeakerEnabled ? "🔊" : "🔈";
        btnSpeaker.style.color = isSpeakerEnabled ? "var(--cyan)" : "#fff";
    });

    // Iniciar con un chat nuevo o cargar el historial
    setTimeout(() => {
        if (chats.length > 0) {
            currentChatId = chats[0].id;
            renderHistory();
            renderActiveChat();
        } else {
            createNewChat();
        }
    }, 100);
});