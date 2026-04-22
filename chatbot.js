document.addEventListener('DOMContentLoaded', () => {

    // ==================== CONFIGURACIÓN GEMINI (ROTACIÓN) ====================
   const WORKER_URL = "https://zenix-api.vegaquispeelvis.workers.dev"; // O la URL que te dio Cloudflare
    let currentKeyIndex = 0;

    // ==================== BASE DE CONOCIMIENTO (Respuestas largas) ====================
    const botResponses = {
        // --- CREADOR ---
        "quien te creo": "¡Jajaja, buena pregunta! 🔥 Fui creado por un programador apasionado y un poco loco por la tecnología... ¿Quieres que te cuente más sobre cómo nací?",
        "quien es tu creador": "Mi creador es un genio de la programación... ¿Y tú, en qué andas metido hoy?",
        "creador": "¡Mi creador es un desarrollador de élite!... Dime, ¿qué te trae por aquí hoy?",
        
        "quien te hizo": "Me programó un desarrollador súper talentoso... ¿Quieres saber más o prefieres ayuda técnica?",
        "de donde eres": "Soy de la nube, pero mi hogar es SDK FINIX 💻... ¿En qué te puedo echar una mano hoy?",
        "quien eres": "¡Soy Zenix 🤖! El asistente virtual oficial de SDK FINIX... ¿Qué necesitas, netrunner?",

        // --- SALUDOS ---
        "hola": "¡Holaaa! 👋 ¡Qué gusto verte! Soy Zenix de SDK FINIX. ¿Cómo estás hoy? ¿Problema con algún equipo?",
        "buenos dias": "¡Buenos días! 🌞 Estoy listo al 100%. ¿Qué necesitas hoy?",
        "buenas tardes": "¡Buenas tardes! 🌤️ ¿Cómo va tu día? Dime en qué te ayudo.",
        "buenas noches": "¡Buenas noches! 🌙 ¿Qué te trae por aquí? ¿Equipo urgente o solo charlar?",

        // --- DESPEDIDAS ---
        "gracias": "¡De nada! 😊 Si necesitas algo más, aquí estoy. ¿Quieres que te recuerde algo?",
        "muchas gracias": "¡Un placer enorme! 🙏 ¿Quieres la ubicación o algo más?",
        "adios": "¡Hasta la próxima, netrunner! 👋 Vuelve cuando quieras.",

        // --- IMPRESORAS ---
        "impresora no imprime": "🖨️ ¡Vamos a resolverlo! Suele ser tinta agotada, papel atascado, drivers o cabezal tapado. ¿Qué marca es tu impresora? ¿Parpadean luces? Cuéntame más y te guío.",
        "error epson": "🖨️ Error de almohadillas en Epson se resuelve con reseteo. Lo hacemos en 15-20 minutos. ¿Qué modelo tienes?",
        "impresora hace ruido": "🖨️ Probablemente papel atascado o rodillos desgastados. No la fuerces. ¿De qué marca es?",

        // --- PC Y LAPTOP ---
        "pc no prende": "💻 Revisa cable, enchufe y fuente. ¿Se enciende alguna luz? Cuéntame más detalles.",
        "laptop no prende": "💻 ¿El LED de carga enciende? ¿De qué marca y modelo es? Te doy pasos precisos.",
        "mi pc esta lenta": "🐌 La solución estrella es ponerle un SSD + más RAM. ¿Quieres que te explique el proceso?",
        "laptop calienta": "🔥 Necesita limpieza de ventiladores y cambio de pasta térmica urgente. ¿Se apaga sola?",

        // --- CELULARES ---
        "celular no carga": "🔌 Prueba con otro cable. Si no carga, el pin interno puede estar dañado. ¿Qué marca y modelo?",
        "celular se calienta": "🔥 Puede ser batería hinchada o app descontrolada. No lo cargues si está abultado. ¿Modelo?",

        // --- PANTALLAS ---
        "pantalla rota": "💥 Cambiamos pantallas con garantía. Dime el modelo exacto (ej: Samsung A54, iPhone 14) y te cotizo ya.",

        // --- DEFAULT ---
        "default": "🤖 ¡Ey, netrunner! No capté bien el mensaje. ¿Es sobre PC, laptop, celular, impresora, o quieres hablar de procesadores Intel Core Ultra? Dame más detalles."
    };

    // ==================== DETECT PAGE & IMAGE PATH ====================
    const isZenixPage = window.location.pathname.includes('/zenix');
    const pathDepth = (window.location.pathname.match(/\//g) || []).length;
    const imgPath = pathDepth <= 1 ? 'IMAGEN/SDK.png' : '../IMAGEN/SDK.png';

    // ==================== INYECTAR HTML DEL CHAT ====================
    const chatBtnContent = isZenixPage
        ? `<img src="${imgPath}" alt="Zenix IA">`
        : `💬`;

    const zenixAvatarHTML = !isZenixPage
        ? `<div id="zenix-side-avatar" title="Zenix IA — Asistente Virtual">
                <img src="${imgPath}" alt="Zenix IA">
           </div>`
        : '';

    const chatHTML = `
        <div id="chatbot-container">
            ${zenixAvatarHTML}
            <button id="chat-btn" class="${isZenixPage ? 'chat-btn-zenix' : ''}" title="${isZenixPage ? 'Chatear con Zenix' : 'Abrir chat'}">
                ${chatBtnContent}
            </button>
            <div id="chat-window">
                <div id="chat-header">
                    <h3>✦ Zenix — SDK FINIX</h3>
                    <button id="chat-close">✖</button>
                </div>
                <div id="chat-body" class="chat-body" style="background-image: url('${imgPath}'); background-size: contain; background-position: center; background-repeat: no-repeat; position: relative;">
                    <div style="position: absolute; inset: 0; background: rgba(13,13,15,0.85); z-index: 0; pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1; display: flex; flex-direction: column; gap: 0.75rem; width: 100%;">
                        <div class="msg bot">¡Ey, netrunner! ⚡ Soy <strong>Zenix</strong>, tu asistente de SDK FINIX. ¿En qué te ayudo hoy?</div>
                        <div class="faq-buttons">
                            <button class="faq-btn">Reparación PC</button>
                            <button class="faq-btn">Desarrollo Web</button>
                            <button class="faq-btn">Cambio Pantalla Celular</button>
                            <button class="faq-btn">¿Cuánto cuesta?</button>
                            <button class="faq-btn">Ubicación y Horario</button>
                            <button class="faq-btn">Laptop no prende</button>
                        </div>
                    </div>
                </div>
                <div id="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Escribe un mensaje..." />
                    <button id="chat-send">▶</button>
                </div>
            </div>
        </div>
    `;
    // Detectar si estamos en la app a pantalla completa
    const isZenixAppPage = path.includes('/agente-zenix');

    // Si NO estamos en la página de Zenix App completa, inyectamos el flotante
    if (!isZenixAppPage) {
        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    // Elementos del DOM (buscamos en el documento si ya existen)
    const chatBtn = document.getElementById('chat-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatBody = document.getElementById('chat-body');

    if (chatBtn && chatWindow) {
        chatBtn.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
            if (chatWindow.classList.contains('active')) chatInput.focus();
        });
    }

    if (chatClose) {
        chatClose.addEventListener('click', () => chatWindow.classList.remove('active'));
    }

    document.querySelectorAll('.faq-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            chatInput.value = btn.innerText;
            sendMessage();
        });
    });

    // ==================== FUNCIÓN HORA ====================
    function getTimeInCountry(country) {
        const timeZones = {
            "peru": "America/Lima", "perú": "America/Lima",
            "méxico": "America/Mexico_City", "mexico": "America/Mexico_City",
            "españa": "Europe/Madrid", "espana": "Europe/Madrid"
            // Puedes agregar más países aquí
        };

        const zone = timeZones[country.toLowerCase()] || "America/Lima";
        const options = { timeZone: zone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const now = new Date();
        const hora = now.toLocaleTimeString('es-PE', options);
        const ciudad = country.charAt(0).toUpperCase() + country.slice(1);
        return `🕒 La hora exacta en **${ciudad}** es: **${hora}**`;
    }

    // ==================== BUSCAR RESPUESTA LOCAL ====================
    function getLocalResponse(msg) {
        const txt = msg.toLowerCase().trim();

        if (txt.includes("hora") || txt.includes("qué hora") || txt.includes("hora en")) {
            if (txt.includes("hora en")) {
                const pais = txt.split("hora en")[1].trim().replace(/[?¿]/g, "").trim();
                if (pais) return getTimeInCountry(pais);
            }
            return getTimeInCountry("peru");
        }

        const keys = Object.keys(botResponses).filter(k => k !== 'default');
        keys.sort((a, b) => b.length - a.length);

        for (const key of keys) {
            if (txt.includes(key)) {
                return botResponses[key];
            }
        }
        return null;
    }

    // ==================== ENVIAR MENSAJE ====================
    async function sendMessage() {
        const rawText = chatInput.value.trim();
        if (!rawText) return;

        addMessage(rawText, 'user');
        chatInput.value = '';

        const typingEl = showTyping();

        const localReply = getLocalResponse(rawText);

        if (localReply) {
            typingEl.remove();
            addMessage(localReply, 'bot');
        } else {
            // === LLAMADA AL WORKER SEGURO (Proxy de IA) ===
            const WORKER_URL = "https://zenix-api.vegaquispeelvis.workers.dev"; // Asegúrate de que esta sea tu URL de Cloudflare

            try {
                const response = await fetch(WORKER_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        message: rawText,
                        provider: "grok" // Cambia a "gemini" si prefieres usar la otra API
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    let aiReply = data.reply || "No pude procesar una respuesta.";

                    // Formateo de texto: saltos de línea y negritas
                    aiReply = aiReply.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    
                    typingEl.remove();
                    addMessage(aiReply, 'bot');
                } else {
                    throw new Error("Error en la respuesta del Worker");
                }
            } catch (error) {
                console.error("Error de conexión con Zenix:", error);
                typingEl.remove();
                addMessage("¡Ups! Mi enlace neuronal está fallando. Inténtalo de nuevo, netrunner. ⚡", 'bot');
            }
        }
    }

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `msg ${sender}`;
        div.innerHTML = text;
        const contentContainer = chatBody.querySelector('div[style*="position: relative"]') || chatBody;
        contentContainer.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function showTyping() {
        const div = document.createElement('div');
        div.className = 'msg bot';
        div.innerHTML = `<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
        const contentContainer = chatBody.querySelector('div[style*="position: relative"]') || chatBody;
        contentContainer.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
        return div;
    }

    // ==================== EVENTOS ====================
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});