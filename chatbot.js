document.addEventListener('DOMContentLoaded', () => {
    // Inject chatbot HTML into body
    const chatHTML = `
        <div id="chatbot-container">
            <button id="chat-btn">💬</button>
            <div id="chat-window">
                <div id="chat-header">
                    <h3>SDK FINIX Bot</h3>
                    <button id="chat-close">✖</button>
                </div>
                <div id="chat-body">
                    <div class="msg bot">¡Hola! Soy el asistente virtual de SDK FINIX. ¿En qué puedo ayudarte hoy? (ej. Reparación PC, Diseño Web, Celulares)</div>
                </div>
                <div id="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Escribe un mensaje..." />
                    <button id="chat-send">▶</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', chatHTML);

    const chatBtn = document.getElementById('chat-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatBody = document.getElementById('chat-body');

    chatBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        if(chatWindow.classList.contains('active')) {
            chatInput.focus();
        }
    });

    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    const botResponses = {
        "pc": "Ofrecemos mantenimiento preventivo y correctivo de PCs, actualización de hardware y reinstalación de SO. ¡Visita nuestra sección de Servicios!",
        "laptop": "Reparamos laptops: pantallas rotas, teclados, placas y problemas de temperatura. ¡Tenemos servicio rápido!",
        "celular": "Cambiamos pantallas, baterías, y solucionamos problemas de carga y software en celulares iOS y Android.",
        "impresora": "Hacemos limpieza y reparación de inyectores, reseteo de almohadillas y configuración para todo tipo de impresoras.",
        "fotocopiadora": "Servicio técnico especializado para fotocopiadoras de todas las marcas. Mantenimiento y partes.",
        "web": "Diseñamos páginas web modernas, responsivas y con SEO. Aumenta tus ventas con nosotros.",
        "escritorio": "Desarrollamos sistemas de inventario, punto de venta y programas de escritorio a medida Windows/Mac.",
        "movil": "Creamos aplicaciones móviles nativas o híbridas perfectamente adaptadas a la necesidad de tu negocio.",
        "precio": "Los precios varían según el servicio y repuestos necesarios. ¡Contáctanos a través del formulario o WhatsApp para una cotización exacta!",
        "ubicacion": "Estamos disponibles en línea y contamos con servicio de recojo y entrega. Mándanos un mensaje en la sección de contacto.",
        "default": "¡Gracias por tu mensaje! Puedes navegar por nuestra web para ver detalles, o escribirnos directamente en la sección de Contacto para atención personalizada."
    };

    function processMessage(msg) {
        let txt = msg.toLowerCase();
        for (const key in botResponses) {
            if(txt.includes(key) && key !== "default") {
                return botResponses[key];
            }
        }
        return botResponses["default"];
    }

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `msg ${sender}`;
        div.innerText = text;
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function sendMessage() {
        const text = chatInput.value.trim();
        if(text === "") return;
        addMessage(text, 'user');
        chatInput.value = '';
        
        setTimeout(() => {
            const reply = processMessage(text);
            addMessage(reply, 'bot');
        }, 600);
    }

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') sendMessage();
    });
});
