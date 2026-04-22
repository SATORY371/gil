document.addEventListener('DOMContentLoaded', () => {

    // ==================== CONFIGURACIÓN GEMINI (ROTACIÓN) ====================
   const WORKER_URL = "https://api.satory.nl/zenix"; // Usa tu dominio de Cloudflare

    // ==================== LOCAL STORAGE ====================
    const STORAGE_KEY = 'zenix_chats';
    let chats = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    let currentChatId = null;

    // ==================== ELEMENTOS ====================
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const historyList = document.getElementById('chat-history-list');
    const newChatBtn = document.getElementById('new-chat-btn');
    const btnSpeaker = document.getElementById('btn-speaker');
    const btnMic = document.getElementById('btn-mic');

    // ==================== ESTADO DE VOZ ====================
    let isSpeakerEnabled = false;
    let recognition;
    let isRecording = false;

    // Inicializar Speech Recognition si está soportado
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'es-ES'; // O es-MX según preferencia
        recognition.interimResults = false; // Solo resultados finales
        recognition.continuous = false; // Se detiene al terminar la frase corta

        recognition.onstart = () => {
            isRecording = true;
            btnMic.classList.add('recording');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatInput.value = transcript;
            // Opcional: auto-enviar mensaje tras dictar con un pequeño delay
            setTimeout(() => sendMessage(), 500);
        };

        recognition.onerror = (event) => {
            console.error("Error en micrófono:", event.error);
            isRecording = false;
            btnMic.classList.remove('recording');
        };

        recognition.onend = () => {
            isRecording = false;
            btnMic.classList.remove('recording');
        };
    } else {
        console.warn("Speech Recognition no está soportado en este navegador.");
        if (btnMic) btnMic.style.display = 'none';
    }

    // Función para reproducir texto
    function speakText(text) {
        if (!isSpeakerEnabled || !('speechSynthesis' in window)) return;
        
        // Cortamos caracteres raros y formato markdown para que suene natural
        const cleanText = text.replace(/[*_#`~]+/g, '').replace(/---/g, '');
        
        // Dividir oraciones simplemente por punto y seguido o saltos de línea para mejor compatibilidad
        const chunks = cleanText.split(/[\n.]+/);

        const voices = speechSynthesis.getVoices();
        let selectedVoice = voices.find(voice => voice.lang.startsWith('es') && (voice.name.includes('Female') || voice.name.includes('Mujer') || voice.name.includes('Google español') || voice.name.includes('Sabina')));
        if (!selectedVoice) {
            selectedVoice = voices.find(voice => voice.lang.startsWith('es'));
        }

        chunks.forEach(chunk => {
            const textToSpeak = chunk.trim();
            if (textToSpeak.length > 0) {
                const utterance = new SpeechSynthesisUtterance(textToSpeak);
                utterance.lang = 'es-MX';
                if (selectedVoice) utterance.voice = selectedVoice;
                speechSynthesis.speak(utterance);
            }
        });
    }

    // ==================== FUNCIONES LOCAL STORAGE ====================
    function saveChats() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    }

    function createNewChat() {
        const newChat = {
            id: Date.now().toString(),
            title: "Nuevo Chat...",
            messages: []
        };
        chats.unshift(newChat); // Agregar al inicio
        saveChats();
        currentChatId = newChat.id;
        renderHistory();
        renderActiveChat();
    }

    // ==================== RENDERIZADO ====================
    function renderHistory() {
        historyList.innerHTML = '';
        chats.forEach((chat, index) => {
            const div = document.createElement('div');
            div.className = `chat-item ${chat.id === currentChatId ? 'active' : ''}`;
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';
            div.style.alignItems = 'center';

            const titleSpan = document.createElement('span');
            titleSpan.innerText = chat.title;
            titleSpan.style.whiteSpace = 'nowrap';
            titleSpan.style.overflow = 'hidden';
            titleSpan.style.textOverflow = 'ellipsis';
            titleSpan.style.flex = '1';

            const delBtn = document.createElement('span');
            delBtn.innerText = '✖';
            delBtn.title = 'Borrar chat completo';
            delBtn.style.cursor = 'pointer';
            delBtn.style.marginLeft = '10px';
            delBtn.style.padding = '0 5px';
            delBtn.style.color = '#ef4444';
            delBtn.style.fontWeight = 'bold';

            delBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar que se seleccione el chat al borrarlo
                chats.splice(index, 1);
                saveChats();
                
                // Si borramos el chat que estábamos viendo, saltar a otro o vaciar la vista
                if (currentChatId === chat.id) {
                    currentChatId = chats.length > 0 ? chats[0].id : null;
                }
                
                renderHistory();
                renderActiveChat();
            });

            div.appendChild(titleSpan);
            div.appendChild(delBtn);

            div.addEventListener('click', () => {
                currentChatId = chat.id;
                renderHistory();
                renderActiveChat();
            });
            historyList.appendChild(div);
        });
    }

    function formatText(text) {
        return text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }



    function renderActiveChat() {
        // Limpiar el chat actual
        chatBody.innerHTML = '';
        
        const actChat = chats.find(c => c.id === currentChatId);
        if (!actChat || actChat.messages.length === 0) {
            // Pantalla vacía o bienvenida
            const div = document.createElement('div');
            div.className = 'msg bot';
            div.innerHTML = "¡Ey, netrunner! ⚡ Has entrado a mi Ciber-Núcleo. Inicia nuestra conversación aquí mismo. ¿En qué trabajamos hoy?";
            chatBody.appendChild(div);
            bindFaqButtons();
            return;
        }

        // Renderizar todos los mensajes
        actChat.messages.forEach((msg, index) => {
            const div = document.createElement('div');
            div.className = `msg ${msg.sender}`;
            
            if (msg.sender === 'bot') {
                div.innerHTML = `
                    <div class="msg-content">${formatText(msg.text)}</div>
                    <div class="msg-controls">
                        <button class="msg-btn play-btn" title="Reproducir audio">▶️ Audio</button>
                    </div>
                `;
                
                // Botón Play manual
                div.querySelector('.play-btn').addEventListener('click', () => {
                    const temp = isSpeakerEnabled;
                    isSpeakerEnabled = true; // forzar encendido momentáneo
                    speakText(msg.text);
                    isSpeakerEnabled = temp; // restaurar
                });
            } else {
                div.innerHTML = formatText(msg.text);
            }

            chatBody.appendChild(div);
        });

        bindFaqButtons();
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function bindFaqButtons() {
        const faqBtns = chatBody.querySelectorAll('.faq-btn');
        faqBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                chatInput.value = e.target.innerText;
                sendMessage();
            });
        });
    }

    function clearTyping() {
        const t = chatBody.querySelector('.typing-indicator')?.parentElement;
        if (t) t.remove();
    }

    function addTyping() {
        const div = document.createElement('div');
        div.className = 'msg bot';
        div.innerHTML = `<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // ==================== LÓGICA DE API (CONMEMORIA Y ROTACIÓN) ====================
    // ==================== LÓGICA DE API SEGURA (WORKER) ====================
    async function sendMessage() {
        const rawText = chatInput.value.trim();
        if (!rawText) return;
        chatInput.value = '';

        // Detener micrófono si estaba escuchando
        if (isRecording && recognition) recognition.stop();

        // Si no hay chat seleccionado, crea uno nuevo
        if (!currentChatId || chats.length === 0) {
            createNewChat();
        }

        const actChat = chats.find(c => c.id === currentChatId);

        // Actualizar el título del chat si es el primer mensaje
        if (actChat.messages.length === 0) {
            actChat.title = rawText.length > 25 ? rawText.substring(0, 25) + '...' : rawText;
            renderHistory();
        }

        // Añadir el mensaje del usuario al historial local
        actChat.messages.push({ sender: 'user', text: rawText });
        saveChats();
        renderActiveChat();
        addTyping();

        // --- LLAMADA AL WORKER SEGURO ---
        const WORKER_URL = "https://api.satory.nl/zenix"; 

        try {
            const response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: rawText,
                    context: actChat.messages.slice(-5) // Opcional: envía los últimos 5 mensajes para dar memoria a la IA
                })
            });

            clearTyping();

            if (response.ok) {
                const data = await response.json();
                const aiReply = data.reply;

                // Guardar respuesta del bot
                actChat.messages.push({ sender: 'bot', text: aiReply });
                saveChats();
                renderActiveChat(); 
                speakText(aiReply); // Función de voz de agent.js
            } else {
                throw new Error("Error en la respuesta del Worker");
            }
        } catch (error) {
            console.error("Fallo de conexión con Zenix:", error);
            clearTyping();
            const errorMsg = "¡Ups! Mi enlace neuronal está fallando. Inténtalo de nuevo, netrunner. ⚡";
            
            actChat.messages.push({ sender: 'bot', text: errorMsg });
            saveChats();
            renderActiveChat();
            speakText(errorMsg);
        }
    }

    // ==================== EVENTOS ====================
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    newChatBtn.addEventListener('click', createNewChat);

    btnMic.addEventListener('click', () => {
        if (!recognition) return alert("Tu navegador no soporta dictado por voz (prueba en Chrome o Edge).");
        if (isRecording) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });

    btnSpeaker.addEventListener('click', () => {
        isSpeakerEnabled = !isSpeakerEnabled;
        if (isSpeakerEnabled) {
            btnSpeaker.style.borderColor = "var(--cyan)";
            btnSpeaker.style.color = "var(--cyan)";
            btnSpeaker.innerText = "🔊"; // Altavoz encendido
            
            // Cargar las voces por adelantado en algunos navegadores
            speechSynthesis.getVoices(); 
        } else {
            btnSpeaker.style.borderColor = "var(--border)";
            btnSpeaker.style.color = "#fff";
            btnSpeaker.innerText = "🔈"; // Altavoz apagado
            speechSynthesis.cancel(); // Detener cualquier audios si se apaga en medio
        }
    });

    // ==================== INICIO ====================
    if (chats.length > 0) {
        currentChatId = chats[0].id;
    } else {
        createNewChat();
    }
    renderHistory();
    renderActiveChat();

});
