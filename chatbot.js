document.addEventListener('DOMContentLoaded', () => {

    // ==================== CONFIGURACIÓN GROQ ====================
    const GROQ_API_KEY = "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";
    const MODEL = "llama-3.1-8b-instant";   // Modelo rápido y con buen límite

    // ==================== BASE DE CONOCIMIENTO (Tus respuestas) ====================
    const botResponses = {
        // --- CREADOR ---
        "quien te creo": "Fui desarrollado por un programador súper entusiasta, apasionado por la tecnología y la innovación, que volcó todo su talento y dedicación para traerme al mundo digital. Una mente brillante que convierte ideas en código impecable. ¡Y aquí estoy, listo para servir en SDK FINIX! 🚀✨",
        "quien es tu creador": "Mi creador es un desarrollador extraordinario, con una mente analítica y creativa fuera de lo común. Un artesano del código que construyó cada línea de mi lógica con precisión y pasión. ¡SDK FINIX tiene el mejor equipo técnico del universo! 🧠💻",
        "creador": "¡Ah, buena pregunta! Fui creado por un genio de la programación, uno de esos desarrolladores que no se rinden hasta que todo funciona a la perfección. Su dedicación y entusiasmo por la tecnología quedaron grabados en cada línea de mi código. 🎯🔥",
        "quien te hizo": "Me hizo un desarrollador realmente especial, alguien que vive y respira tecnología. Un apasionado del software que diseñó mi inteligencia con mucho cariño y esfuerzo para que yo pueda ayudarte hoy desde SDK FINIX. 💡",
        "de donde eres": "Soy de la nube ☁️, pero mi hogar es SDK FINIX. Nací de miles de líneas de código, mucha lógica y bastante café ☕. Fui programado para ayudarte con todo lo relacionado a tecnología.",
        "quien eres": "Soy Zenix 🤖, el asistente virtual oficial de SDK FINIX. Estoy diseñado para darte respuestas rápidas sobre reparaciones técnicas, desarrollo de sistemas, precios y más. ¡Estoy a tu servicio!",
        "para que sirves": "Sirvo para ayudarte a resolver dudas sobre los servicios de SDK FINIX 🛠️: reparación de PCs, laptops, celulares, impresoras, fotocopiadoras, y también desarrollo de páginas web, sistemas y apps. ¡Pregúntame lo que necesites!",

        // --- SALUDOS ---
        "hola": "¡Hola! 👋 Soy Zenix 🤖, tu asistente virtual. ¿En qué puedo ayudarte hoy desde SDK FINIX?",
        "buenos dias": "¡Buenos días! 🌞 Que tengas un excelente día. ¿En qué te puedo ayudar hoy?",
        "buenas tardes": "¡Buenas tardes! 🌤️ Aquí listo para ayudarte. ¿Qué necesitas?",
        "buenas noches": "¡Buenas noches! 🌙 La tecnología no duerme y yo tampoco. ¿En qué te ayudo?",
        "como estas": "¡Funcionando al 100%! 🚀 Mis procesadores están listos para resolver cualquier duda. ¿Tú cómo estás?",
        "que tal": "¡Excelente por aquí en SDK FINIX! 💻 ¿En qué te puedo ayudar?",
        "saludos": "¡Saludos! 👋 Bienvenido a SDK FINIX. Dime, ¿qué necesitas hoy?",

        // --- DESPEDIDAS ---
        "gracias": "¡Con mucho gusto! 😊 En SDK FINIX siempre estamos para ayudarte. ¡Hasta pronto!",
        "muchas gracias": "¡Un placer total! 🙏 Si necesitas algo más, aquí estaré siempre. ¡Que tengas un excelente día!",
        "adios": "¡Hasta la próxima! 👋 Que tus dispositivos nunca fallen. ¡Vuelve cuando necesites!",
        "hasta luego": "¡Nos vemos! 🤖 Recuerda que SDK FINIX siempre es tu mejor opción tecnológica.",
        "ok": "¡Perfecto! 👍 Quedo a tu disposición si necesitas algo más.",
        "listo": "¡Genial! ✅ Avísame si surge alguna otra duda.",

        // --- IMPRESORAS ---
        "impresora no imprime": "🖨️ Si tu impresora no imprime, puede ser por:\n1. Tinta o tóner agotado.\n2. Papel atascado internamente.\n3. Driver desactualizado o cola de impresión trabada.\n4. Cabezal de impresión obstruido (muy común en Epson y HP).\n5. Desconexión WiFi o USB.\n\n¡Tráela a SDK FINIX y la dejamos como nueva! ¿Qué marca es tu impresora?",
        "mi impresora no imprime": "🖨️ ¡Vamos a solucionarlo! ¿De qué marca es tu impresora (HP, Epson, Canon, Brother)? Si parpadean las luces, puede pedir reseteo de almohadillas. Si hace ruido extraño, es un atasco de papel. ¡Tráela y la revisamos de inmediato!",
        "impresora no funciona": "🖨️ Para ayudarte mejor necesito saber:\n• Marca y modelo de tu impresora\n• ¿Enciende la luz de encendido?\n• ¿Muestra algún error en pantalla?\n• ¿Imprimía antes y dejó de hacerlo de repente?\n\nCon esa info, te doy los pasos exactos o te decimos si requiere reparación.",
        "impresora": "🖨️ Reparamos todo tipo de impresoras: HP, Epson, Canon, Brother, Samsung. Hacemos limpieza de cabezales, reseteo de almohadillas, cambio de cartuchos, reparación de rodillos y configuración de red. ¿Qué problema tiene la tuya?",
        "error epson": "🖨️ El error de almohadillas en Epson (luces parpadeando alternamente) significa que llegó al límite de impresiones de fábrica. Nosotros realizamos el reseteo de almohadillas de manera rápida y segura. ¡No la tires, tiene solución!",
        "error hp": "🖨️ Las impresoras HP suelen fallar por cartuchos 'incompatibles' (limpiar contactos de cobre) o cabezal obstruido (en tanque de tinta). ¿Qué código de error aparece? Te ayudamos a resolverlo.",
        "impresora hace ruido": "🖨️ Si tu impresora hace ruido al imprimir o al encenderse, probablemente tiene papel atascado internamente o un rodillo desgastado. ¡No la fuerces! Apágala y tráela para una revisión segura.",
        "impresora derrama tinta": "🖨️ Si derrama tinta es porque el cabezal está saturado o hay una manguera doblada (en tanque de tinta). Requiere limpieza profunda interna. En SDK FINIX lo resolvemos sin dañar los componentes.",
        "reseteo de almohadillas": "🖨️ Realizamos reseteo de almohadillas para impresoras Epson de todas las series (L, ET, EcoTank, etc.) con software original. El proceso es rápido, unos 15-20 minutos. ¡Tráela o llévanos el modelo!",

        // --- FOTOCOPIADORAS ---
        "fotocopiadora no imprime": "📠 Si tu fotocopiadora no imprime bien, puede ser:\n• Tóner bajo o de mala calidad\n• Tambor fotoconductor desgastado (genera manchas negras)\n• Rodillo del fusor dañado\n• Error de configuración\n\n¿Cuál es la marca y modelo? ¿La imagen sale rayada, borrosa o no pasa nada?",
        "mi fotocopiadora no imprime bien": "📠 Si la copia sale con rayas, manchas o pálida, necesita mantenimiento en la unidad de revelado o fusor. En SDK FINIX tenemos repuestos y técnicos especializados en fotocopiadoras.",
        "fotocopiadora": "📠 Damos servicio técnico especializado a fotocopiadoras de todas las marcas: Kyocera, Ricoh, Canon, Xerox, Sharp, Konica Minolta. Mantenimiento, cambio de tóner, tambor, fusor y rodillos. ¿Qué falla tiene la tuya?",
        "fotocopiadora marca rayas": "📠 Las rayas en fotocopias casi siempre son por el tambor fotoconductor desgastado o suciedad en el cristal de escaneo. El tambor se cambia y el cristal se limpia con cuidado con químico especial. ¡Lo hacemos nosotros!",
        "fotocopiadora toner": "📠 Vendemos y cambiamos tóner para fotocopiadoras de todas las marcas. Tenemos opciones originales y compatibles de alta calidad. Dinos la marca y modelo para verificar disponibilidad.",

        // --- PANTALLAS ---
        "pantalla en negro": "📱 Pantalla negra puede tener varias causas:\n• Batería completamente descargada (cargarla 30 min)\n• Pantalla LCD quebrada internamente\n• Falla en la placa o flex de video\n• Problema de software (loop de reinicio)\n\n¿Es celular, tablet o laptop? ¿El equipo vibra o suena cuando lo enciendes?",
        "pantalla negra": "📱 Si la pantalla está totalmente negra pero el equipo enciende (vibra/suena), muy probablemente el panel LCD u OLED está dañado. Necesitas cambio de pantalla. En SDK FINIX usamos repuestos de calidad original con garantía.",
        "pantalla rota": "💥 ¡Tranquilo/a! Cambiamos pantallas rotas el mismo día. Tenemos repuestos para Samsung, iPhone, Xiaomi, Motorola, Huawei, OPPO, Realme y más. Dime el modelo exacto y te doy precio inmediato.",
        "tengo la pantalla rota": "📱💥 Entendido. Es nuestra especialidad número 1. Dime el modelo exacto de tu equipo (ej: Samsung A54, iPhone 14, Redmi Note 12) y te cotizo en segundos.",
        "pantalla de mi tablet": "📱 Cambiamos pantallas de tablets: iPad (todas las generaciones), Samsung Galaxy Tab, Lenovo, Amazon Fire y más. Dime la marca y modelo exacto para verificar disponibilidad del repuesto.",
        "pantalla de mi celular": "📱 Para cotizar el cambio de pantalla de tu celular necesito el modelo exacto (ej: iPhone 13, Samsung A32, Redmi 10). ¡Con eso te doy precio y tiempo de entrega al instante!",
        "celular pantalla negra": "📱 Celular encendido pero pantalla negra: 90% de los casos es el panel LCD/OLED dañado. Puede pasar sin golpe visible (falla interna del flex). La solución es el reemplazo de pantalla. ¡Te damos garantía!",
        "pantalla manchada": "📱 Si la pantalla tiene manchas (como tinta corrida o burbujas oscuras) es señal de que el LCD interno se rompió por un golpe o presión. Necesita cambio de módulo completo. ¡Podemos hacerlo!",

        // --- PC Y LAPTOP ---
        "pc no prende": "💻 Si tu PC no da señales de vida:\n1. Verifica el cable de alimentación y el enchufe.\n2. Revisa el switch de la fuente de poder (atrás, debe estar en 'I').\n3. Si hubo un apagón, la fuente pudo quemarse para proteger la placa.\n\n¡Tráela! Si es la fuente, la cambiamos sin perder tu información. 🛡️",
        "mi pc no prende": "💻 PC sin vida: Revisa si hay alguna lucecita o si el ventilador intenta girar. Si absolutamente nada responde, lo más probable es la Fuente de Poder o la Placa Madre. Somos expertos en diagnóstico eléctrico. ¡Tráela!",
        "laptop no prende": "💻 Laptop que no enciende:\n• Prueba con otro cargador si tienes.\n• Si el LED de carga no prende, el pin de carga interno se pudo soltar.\n• Si el LED prende pero no arranca Windows, revisaremos placa y RAM.\n\n¿Qué marca es tu laptop?",
        "mi laptop no prende": "💻 Laptop apagada totalmente: Conéctala y fíjate si enciende el LED de carga. Si no, el cargador o el conector interno fallaron. En SDK FINIX reparamos pines de carga, placas madre y hacemos reballing de chips.",
        "reparacion pc": "🖥️ Reparamos PCs de escritorio: diagnóstico general, cambio de fuente, placa madre, RAM, discos, tarjetas de video, y ensamblaje completo. También hacemos mantenimiento preventivo. ¿Qué le pasa a tu PC?",
        "pc pantalla negra": "🖥️ PC que enciende (suenan ventiladores) pero sin imagen:\n• En el 80% de los casos es polvo en las ranuras de la Memoria RAM.\n• También puede ser la Tarjeta de Video o el monitor mismo.\n• Verifica que el cable HDMI/VGA esté bien conectado.\n\n¡Tráela y hacemos el diagnóstico gratis!",
        "mi pc esta lenta": "🐌 ¿Tarda 10 minutos en iniciar? ¡La solución es un Disco de Estado Sólido (SSD)! Clonamos tu información del disco viejo al nuevo y tu PC quedará 10 veces más rápida. Sin pérdida de datos. ¡Es una promesa! 🚀",
        "pc lenta": "🐌 PC lenta = Disco duro HDD obsoleto + Poca RAM + Posible infección por virus. Te ofrecemos el paquete definitivo: SSD + Ampliación de RAM + Formateo limpio = ¡PC voladora garantizada!",
        "laptop lenta": "🐌 Laptop lenta: Lo mismo que una PC. El SSD es la solución más impactante. Además, un buen mantenimiento físico (limpieza de ventiladores y cambio de pasta térmica) la hace funcionar como nueva.",
        "laptop calienta": "🔥 ¡URGENTE! Si tu laptop se calienta mucho o se apaga sola:\nNecesita limpieza interior de ventiladores + cambio de Pasta Térmica del procesador. Si no lo atiendes, el chip de video se puede desoldar (reparación costosa). ¡Prevenir es mejor y más barato!",
        "pc se apaga": "🔥 Apagones repentinos = Sobrecalentamiento o Fuente de Poder fallando. No la sigas usando así, podrías quemar el procesador o la placa madre. ¡Tráela de urgencia a SDK FINIX!",
        "laptop se apaga": "🔥 Laptop que se apaga sola: Casi siempre es por acumulación de polvo en los ventiladores y pasta térmica seca. Lo solucionamos con mantenimiento físico completo. ¡Antes de que se dañe la placa!",
        "virus": "🦠 ¿Publicidad molesta, lentitud extrema o cuentas hackeadas? Tienes virus o malware.\nHacemos limpieza profunda del sistema o, si es necesario, respaldamos tu información y reinstalamos Windows desde cero. Seguridad total garantizada. 🛡️",

        // --- CELULARES ---
        "celular": "📲 Reparamos celulares de todas las marcas: Samsung, iPhone, Xiaomi, Motorola, Huawei, OPPO, Realme y más. Cambio de pantalla, batería, pin de carga, cámara y solución de problemas de software. ¿Qué falla tiene tu celular?",
        "celular no carga": "🔌 Celular que no carga: Puede ser el cable (prueba con otro), el adaptador, o el pin de carga sucio/dañado. Si con otro cable tampoco carga, el conector interno necesita limpieza o cambio. ¡Lo reparamos!",
        "mi celular no carga": "🔌 Primero prueba limpiando el puerto con un palillo de dientes con suavidad. Si no mejora, el pin de carga interno está dañado y hay que cambiarlo. ¡Es una reparación rápida y económica en SDK FINIX!",
        "celular no enciende": "📱 Celular que no enciende:\n• Cárgalo por 30 minutos sin interrumpir.\n• Intenta reinicio forzado (Encendido + Volumen Abajo por 10 segundos).\n• Si nada funciona, puede ser la batería agotada o un problema de placa.\n\n¿De qué marca y modelo es?",
        "celular se calienta": "🔥 Celular con temperatura alta puede ser por:\n• App descontrolada corriendo en fondo\n• Batería hinchada (peligroso, actúa rápido)\n• Chip de procesador con problema\n\nSi la parte trasera está abultada, es la batería. ¡No la cargues más y tráela de urgencia!",

        // --- DESARROLLO ---
        "desarrollo web": "🌐 Diseñamos y desarrollamos páginas web profesionales: Landing Pages, Portales Corporativos, Tiendas Online con carrito de compra y pagos. Todas responsivas y rápidas. ¿Qué tipo de página necesitas?",
        "pagina web": "🌐 Creamos tu página web a medida. ¿Tienes una marca o negocio? Te diseñamos un sitio que impresione a tus clientes.",
        "tienda online": "🛒 Creamos tu tienda en línea completa con carrito, pagos y gestión de pedidos. ¡Empieza a vender por internet hoy!",

        // --- PRECIOS Y CONTACTO ---
        "precio": "💰 El precio varía según el repuesto y modelo. Dime la marca y modelo exacto de tu equipo y te cotizo de inmediato.",
        "cuanto cuesta": "💰 Para darte el precio exacto necesito la marca y modelo de tu equipo. ¿Qué se dañó?",
        "garantia": "✅ Todos nuestros servicios y repuestos tienen garantía. Tu inversión está protegida.",
        "ubicacion": "📍 Escríbenos por WhatsApp o en la sección Contacto para enviarte la ubicación exacta.",
        "ubicacion y horario": "📍⏰ Atendemos de Lunes a Sábado de 9:00 AM a 6:30 PM. Servicio presencial, a domicilio y remoto.",

        // --- AYUDA GENERAL ---
        "ayuda": "🆘 ¡Claro! Dime qué necesitas:\n• Reparación de PC/Laptop\n• Cambio de pantalla\n• Impresora o Fotocopiadora\n• Desarrollo de página web\n• Precios y cotizaciones\n\n¡Estoy aquí para ayudarte!",
        "servicios": "🛠️ Ofrecemos reparación de PCs, laptops, celulares, impresoras, fotocopiadoras y desarrollo de páginas web y software.",

        // --- DEFAULT ---
        "default": "🤖 Mmm, no estoy 100% segura... pero déjame consultar mi inteligencia avanzada."
    };

    // ==================== DETECT PAGE & IMAGE PATH ====================
    const isZenixPage = window.location.pathname.includes('/zenix');
    const pathDepth = (window.location.pathname.match(/\//g) || []).length;
    const imgPath = pathDepth <= 1 ? 'IMAGEN/SDK.png' : '../IMAGEN/SDK.png';

    // ==================== INYECTAR HTML DEL CHAT ====================
    // On zenix page: chat button uses SDK.png image as icon
    // On all other pages: Zenix avatar appears to the left of the chat button
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
                <div id="chat-body" class="chat-body">
                    <div class="msg bot">¡Hola! 👋 Soy <strong>Zenix</strong>, tu asistente virtual de SDK FINIX. ¿En qué puedo ayudarte hoy?</div>
                    <div class="faq-buttons">
                        <button class="faq-btn">Reparación PC</button>
                        <button class="faq-btn">Desarrollo Web</button>
                        <button class="faq-btn">Cambio Pantalla Celular</button>
                        <button class="faq-btn">¿Cuánto cuesta?</button>
                        <button class="faq-btn">Ubicación y Horario</button>
                        <button class="faq-btn">Laptop no prende</button>
                    </div>
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
        if (chatWindow.classList.contains('active')) chatInput.focus();
    });

    chatClose.addEventListener('click', () => chatWindow.classList.remove('active'));

    document.querySelectorAll('.faq-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            chatInput.value = btn.innerText;
            sendMessage();
        });
    });

    // ==================== FUNCIÓN PARA OBTENER HORA EXACTA EN CUALQUIER PAÍS ====================
    function getTimeInCountry(country) {
        const timeZones = {
            "peru": "America/Lima",
            "perú": "America/Lima",
            "méxico": "America/Mexico_City",
            "mexico": "America/Mexico_City",
            "españa": "Europe/Madrid",
            "espana": "Europe/Madrid",
            "argentina": "America/Argentina/Buenos_Aires",
            "chile": "America/Santiago",
            "colombia": "America/Bogota",
            "ecuador": "America/Guayaquil",
            "bolivia": "America/La_Paz",
            "estados unidos": "America/New_York",
            "usa": "America/New_York",
            "united states": "America/New_York",
            "brasil": "America/Sao_Paulo",
            "francia": "Europe/Paris",
            "italia": "Europe/Rome",
            "japón": "Asia/Tokyo",
            "japon": "Asia/Tokyo",
            "china": "Asia/Shanghai",
            "corea": "Asia/Seoul",
            "inglaterra": "Europe/London",
            "londres": "Europe/London"
        };

        const zone = timeZones[country.toLowerCase()] || "America/Lima";

        const options = {
            timeZone: zone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        const now = new Date();
        const hora = now.toLocaleTimeString('es-PE', options);
        const ciudad = country.charAt(0).toUpperCase() + country.slice(1);

        return `🕒 La hora exacta en **${ciudad}** es: **${hora}**`;
    }

    // ==================== BUSCAR RESPUESTA LOCAL ====================
    function getLocalResponse(msg) {
        const txt = msg.toLowerCase().trim();

        // === DETECTAR PREGUNTAS DE HORA EN DIFERENTES PAÍSES ===
        if (txt.includes("hora") || txt.includes("qué hora") || txt.includes("hora en")) {
            
            // Pregunta específica por país
            if (txt.includes("hora en")) {
                const pais = txt.split("hora en")[1].trim().replace("?", "").replace("es", "").trim();
                if (pais) return getTimeInCountry(pais);
            }

            // Preguntas generales sobre hora
            if (txt.includes("peru") || txt.includes("perú") || txt.includes("lima")) {
                return getTimeInCountry("peru");
            }
            
            // Si solo dice "qué hora es" → por defecto Perú
            return getTimeInCountry("peru");
        }

        // === OTRAS RESPUESTAS LOCALES ===
        const keys = Object.keys(botResponses).filter(k => k !== 'default');
        keys.sort((a, b) => b.length - a.length);

        for (const key of keys) {
            if (txt.includes(key)) {
                return botResponses[key];
            }
        }
        return null; // null = usar Groq
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
        } 
        else {
            // Usar Groq solo cuando sea necesario
            try {
                const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${GROQ_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: MODEL,
                        messages: [
                            { 
                                role: "system", 
                                content: "Eres Zenix, asistente virtual cyberpunk de SDK FINIX. Habla en español con energía, usa emojis y sé útil." 
                            },
                            { role: "user", content: rawText }
                        ],
                        temperature: 0.7,
                        max_tokens: 600
                    })
                });

                const data = await response.json();
                const aiReply = data.choices[0].message.content;

                typingEl.remove();
                addMessage(aiReply, 'bot');

            } catch (error) {
                typingEl.remove();
                addMessage("¡Ups! Estoy con mucha demanda ahora 😅 Inténtalo de nuevo en unos segundos.", 'bot');
            }
        }
    }

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `msg ${sender}`;
        div.innerHTML = text;
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function showTyping() {
        const div = document.createElement('div');
        div.className = 'msg bot';
        div.innerHTML = `<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
        return div;
    }

    // Eventos de envío
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});