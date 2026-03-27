document.addEventListener('DOMContentLoaded', () => {
    // Inject chatbot HTML into body
    const chatHTML = `
        <div id="chatbot-container">
            <button id="chat-btn">💬</button>
            <div id="chat-window">
                <div id="chat-header">
                    <h3>Zenix - SDK FINIX</h3>
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
        if (chatWindow.classList.contains('active')) {
            chatInput.focus();
        }
    });

    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    // Handle FAQ buttons
    document.querySelectorAll('.faq-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const text = e.target.innerText;
            chatInput.value = text;
            sendMessage();
        });
    });

    // ============================================================
    //   BASE DE CONOCIMIENTO DEL BOT - SDK FINIX
    // ============================================================
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

        // --- PANTALLAS (CELULAR/TABLET/LAPTOP) ---
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
        "pantalla negra pc": "🖥️ PC prendida, monitor negro: Primero revisa que el cable del monitor esté bien apretado. Si ese no es el problema, requiere diagnóstico avanzado. En SDK FINIX aplicamos limpieza de contactos y revisión de componentes.",
        "mi pc esta lenta": "🐌 ¿Tarda 10 minutos en iniciar? ¡La solución es un Disco de Estado Sólido (SSD)! Clonamos tu información del disco viejo al nuevo y tu PC quedará 10 veces más rápida. Sin pérdida de datos. ¡Es una promesa! 🚀",
        "pc lenta": "🐌 PC lenta = Disco duro HDD obsoleto + Poca RAM + Posible infección por virus. Te ofrecemos el paquete definitivo: SSD + Ampliación de RAM + Formateo limpio = ¡PC voladora garantizada!",
        "laptop lenta": "🐌 Laptop lenta: Lo mismo que una PC. El SSD es la solución más impactante. Además, un buen mantenimiento físico (limpieza de ventiladores y cambio de pasta térmica) la hace funcionar como nueva.",
        "laptop calienta": "🔥 ¡URGENTE! Si tu laptop se calienta mucho o se apaga sola:\nNecesita limpieza interior de ventiladores + cambio de Pasta Térmica del procesador. Si no lo atiendes, el chip de video se puede desoldar (reparación costosa). ¡Prevenir es mejor y más barato!",
        "pc se apaga": "🔥 Apagones repentinos = Sobrecalentamiento o Fuente de Poder fallando. No la sigas usando así, podrías quemar el procesador o la placa madre. ¡Tráela de urgencia a SDK FINIX!",
        "laptop se apaga": "🔥 Laptop que se apaga sola: Casi siempre es por acumulación de polvo en los ventiladores y pasta térmica seca. Lo solucionamos con mantenimiento físico completo. ¡Antes de que se dañe la placa!",
        "virus": "🦠 ¿Publicidad molesta, lentitud extrema o cuentas hackeadas? Tienes virus o malware.\nHacemos limpieza profunda del sistema o, si es necesario, respaldamos tu información y reinstalamos Windows desde cero. Seguridad total garantizada. 🛡️",
        "windows": "🪟 Instalamos Windows 10 u 11 con activación, todos los drivers del equipo, Office, PDF y antivirus. Todo listo para trabajar desde el primer minuto. ¿Necesitas formateo también?",
        "formateo": "🪟 Realizamos formateo completo: respaldo de datos, reinstalación de Windows 10/11, drivers, Office y programas básicos. Tu equipo queda como nuevo. ¿Para PC o Laptop?",
        "memoria ram": "💾 Ampliamos la memoria RAM de tu laptop o PC. Más RAM = más fluidez al trabajar con muchos programas a la vez. Dime el modelo de tu equipo para verificar compatibilidad y precio.",
        "disco duro": "💿 Cambiamos discos duros HDD por unidades de estado sólido SSD. También recuperamos información de discos dañados. ¡No pierdas tus fotos y documentos! Traenos el disco.",
        "ssd": "💿 Instalamos discos SSD en laptops y PCs de cualquier marca. El cambio de HDD a SSD es la mejora #1 que puedes hacerle a tu equipo. Velocidad de inicio: de 3 minutos a 10 segundos. ¡Increíble diferencia!",
        "teclado laptop": "⌨️ Cambiamos teclados de laptops rotos o con teclas que no responden. Tenemos repuestos para casi todas las marcas (HP, Dell, Lenovo, Asus, Acer). Dime la marca y modelo.",
        "bisagra laptop": "🔧 Reparamos y reforzamos bisagras rotas de laptops. Una bisagra dañada puede romper el chasis si no se atiende a tiempo. ¡Lo soldamos o reinstalamos el soporte correctamente!",
        "bateria laptop": "🔋 Cambiamos baterías de laptops que ya no duran o no cargan. Tenemos baterías originales y de alta capacidad. Dinos la marca y modelo de tu laptop.",

        // --- CELULARES ---
        "celular": "📲 Reparamos celulares de todas las marcas: Samsung, iPhone, Xiaomi, Motorola, Huawei, OPPO, Realme y más. Cambio de pantalla, batería, pin de carga, cámara y solución de problemas de software. ¿Qué falla tiene tu celular?",
        "celular no carga": "🔌 Celular que no carga: Puede ser el cable (prueba con otro), el adaptador, o el pin de carga sucio/dañado. Si con otro cable tampoco carga, el conector interno necesita limpieza o cambio. ¡Lo reparamos!",
        "mi celular no carga": "🔌 Primero prueba limpiando el puerto con un palillo de dientes con suavidad. Si no mejora, el pin de carga interno está dañado y hay que cambiarlo. ¡Es una reparación rápida y económica en SDK FINIX!",
        "celular no enciende": "📱 Celular que no enciende:\n• Cárgalo por 30 minutos sin interrumpir.\n• Intenta reinicio forzado (Encendido + Volumen Abajo por 10 segundos).\n• Si nada funciona, puede ser la batería agotada o un problema de placa.\n\n¿De qué marca y modelo es?",
        "mi celular no enciende": "📱 Si no enciende para nada ni responde al cargador, puede ser: batería muerta, pin de carga roto, o un corto en la placa. Tráelo y hacemos diagnóstico gratuito para saber exactamente qué tiene.",
        "celular se calienta": "🔥 Celular con temperatura alta puede ser por:\n• App descontrolada corriendo en fondo\n• Batería hinchada (peligroso, actúa rápido)\n• Chip de procesador con problema\n\nSi la parte trasera está abultada, es la batería. ¡No la cargues más y tráela de urgencia!",
        "bateria celular": "🔋 Cambiamos baterías de celulares de todas las marcas (Samsung, iPhone, Xiaomi, etc.). Si tu celular dura menos de 2 horas o se apaga con batería restante, necesita batería nueva. ¿Qué modelo tienes?",
        "camara celular": "📷 Reparamos cámaras de celulares: lentes rotos, cámara que no enfoca, imagen borrosa o cámara que no abre. Dinos la marca y modelo para darte más detalles.",
        "celular mojado": "💧 Celular mojado: ¡Apágalo YA y no lo cargues! Colócalo en arroz seco por 24-48 horas. Si no enciende después, tráelo para limpieza ultrasónica interna de los componentes. ¡No esperes más tiempo!",
        "iphone": "🍎 Reparamos iPhones de todas las generaciones: cambio de pantalla, batería, botones, cámara y problemas de software. ¿Qué modelo de iPhone tienes y qué le pasa?",
        "samsung": "📱 Reparamos Samsung de toda la gama: S, A, M, Note, Galaxy. Pantallas OLED y LCD, baterías, pines de carga y placas. ¿Qué modelo Samsung tienes?",
        "xiaomi": "📱 Reparamos Xiaomi, Redmi y POCO. Cambio de pantallas, baterías, pines y más. ¿Qué modelo tienes?",

        // --- TABLET ---
        "tablet": "📱 Reparamos tablets: iPad, Samsung Galaxy Tab, Lenovo, Amazon Fire, Huawei MatePad. Cambio de pantallas, conectores de carga, baterías y desbloqueo de software. ¿Que problema tiene tu tablet?",
        "tablet no carga": "🔌 Si la tablet no carga, primero prueba con otro cable y adaptador. Si tiene polvo en el puerto, límpialo suavemente. Si sigue sin cargar, el conector interno necesita reemplazo. ¡Lo reparamos!",
        "ipad": "🍎 Reparamos iPads: mini, Air, Pro y generaciones estándar. Cambio de pantalla, batería, botones y más. ¿Qué modelo de iPad es y qué le pasa?",

        // --- REDES E INTERNET ---
        "no hay internet": "🌐 Si tu PC no tiene internet pero el celular sí:\n• Revisar que el cable de red esté bien conectado.\n• Reiniciar el módem y el router.\n• Si es por WiFi, instalar o actualizar el driver de la tarjeta de red.\n\n¡Te ayudamos a diagnosticarlo!",
        "wifi no conecta": "📡 Si el WiFi no conecta en tu laptop:\n• Verifica que el WiFi esté activado (muchas laptops tienen tecla Fn+F2).\n• Si otras redes tampoco aparecen, la tarjeta de red interna falla.\n• Solución rápida: adaptador USB WiFi (económico y efectivo).",
        "cable de red": "🔌 Fabricamos cables de red (Cat 5e, Cat 6) a la medida exacta que necesitas, con conectores RJ45 que garantizan la mejor velocidad. ¡Dinos cuántos metros necesitas!",
        "internet lento": "🌐 Internet lento en la PC puede ser por el cable, el adaptador WiFi, configuración del DNS o virus. Lo diagnosticamos y aplicamos la solución más rápida. ¿Es por cable o WiFi?",

        // --- DESARROLLO WEB Y SOFTWARE ---
        "desarrollo web": "🌐 Diseñamos y desarrollamos páginas web profesionales: Landing Pages, Portales Corporativos, Tiendas Online (E-commerce) con carrito de compra y pagos. Todas Responsivas, rápidas y con SEO. ¡Haz que el mundo te encuentre!",
        "pagina web": "🌐 Creamos tu página web a medida. ¿Tienes una marca, empresa o negocio? Te diseñamos un sitio web que impresione a tus clientes. ¿Qué tipo de página necesitas?",
        "tienda online": "🛒 Creamos tu tienda en línea (E-commerce) con catálogo de productos, carrito de compras, pagos en línea y gestión de pedidos. ¡Empieza a vender por internet hoy mismo!",
        "sistema de ventas": "🛒 Desarrollamos Sistemas de Punto de Venta (POS) completos: control de inventario, facturación, caja, reportes de ganancias y gestión de empleados. ¡Perfecto para tiendas, restaurantes y negocios!",
        "aplicacion movil": "📱 Programamos Apps Móviles para Android e iOS. Si tienes una idea de negocio o necesitas una aplicación para tu empresa, la desarrollamos desde cero con tecnología moderna.",
        "app movil": "📱 Desarrollamos aplicaciones móviles nativas e híbridas. Desde apps de delivery, reservas, catálogos hasta sistemas completos de gestión empresarial para tu celular.",
        "software a medida": "⚙️ Construimos software de escritorio o web exactamente como lo necesitas: sistemas de inventario, control de personal, facturación, clínicas, ferreterías, restaurantes y más. ¡Cuéntanos tu idea!",
        "desarrollo": "💻 En SDK FINIX desarrollamos tecnología a medida: páginas web, sistemas de ventas, apps móviles y software de escritorio. ¡Automatiza tu negocio con nosotros!",
        "sistema inventario": "⚙️ Desarrollamos sistemas de inventario personalizados para controlar tu stock, entradas, salidas y alertas de reabastecimiento. ¡Nada se pierde ni se descontrola con nuestro sistema!",

        // --- PRECIOS Y COTIZACIONES ---
        "precio": "💰 El precio varía según el repuesto y la marca del equipo. Dinos la marca y modelo exacto de tu dispositivo y te damos la cotización en minutos. También puedes escribirnos por WhatsApp.",
        "cuanto cuesta": "💰 Para darte el precio exacto necesito saber: ¿Qué es lo que se dañó? y ¿Cuál es la marca y modelo de tu equipo? Con eso te cotizo de inmediato, sin costos ocultos.",
        "es caro": "💰 En SDK FINIX manejamos precios justos y competitivos. Siempre te ofrecemos opciones: repuesto original y repuesto genérico de buena calidad, para que elijas según tu presupuesto. ¡Sin sorpresas!",
        "tienen garantia": "✅ ¡Sí! Todos nuestros servicios y repuestos tienen garantía. Tu inversión está protegida con nosotros. La garantía varía según el tipo de servicio.",
        "garantia": "✅ ¡Claro que sí! En SDK FINIX damos garantía en todos nuestros servicios de reparación y en los desarrollos de software. Trabajamos con responsabilidad y compromiso.",

        // --- UBICACIÓN, HORARIO Y CONTACTO ---
        "ubicacion": "📍 Contamos con servicio presencial, a domicilio y también atención remota para problemas de software. Escríbenos por WhatsApp o el formulario de contacto y te enviamos la ubicación exacta.",
        "ubicacion y horario": "📍⏰ Atendemos de Lunes a Sábado de 9:00 AM a 6:30 PM. Tenemos servicio presencial, a domicilio y remoto. ¡Escríbenos y coordinamos!",
        "donde estan": "📍 Estamos disponibles en línea y en físico. Para la dirección exacta, escríbenos al WhatsApp o en la sección de Contacto del sitio y te la enviamos de inmediato.",
        "horario": "⏰ Trabajamos de Lunes a Sábado, 9:00 AM a 6:30 PM. Para emergencias técnicas urgentes, contáctanos de todas formas y buscamos la manera de ayudarte.",
        "whatsapp": "📱 Puedes contactarnos directamente por WhatsApp para cotizaciones, consultas y coordinar la entrega de tu equipo. ¡Ve a la sección de Contacto para el número!",
        "contacto": "📞 Para contactarnos, visita la sección de Contacto en nuestra página web. Puedes enviarnos un mensaje por el formulario o por WhatsApp y te responderemos a la brevedad.",

        // --- AYUDA GENERAL ---
        "ayuda": "🆘 ¡Claro! Dime qué necesitas:\n• Reparación de PC/Laptop\n• Cambio de pantalla (celular/tablet/laptop)\n• Impresora o Fotocopiadora\n• Desarrollo de página web o software\n• Precios y cotizaciones\n\n¡Estoy listo para ayudarte!",
        "servicios": "🛠️ En SDK FINIX ofrecemos:\n💻 Reparación de PCs, Laptops, Celulares y Tablets\n🖨️ Servicio técnico de Impresoras y Fotocopiadoras\n🌐 Desarrollo de Páginas Web y Software\n📱 Apps Móviles\n\n¿Cuál te interesa?",

        // --- DEFAULT ---
        "default": "🤖 Mmm, no estoy seguro de entender exactamente tu consulta. ¡Pero no te preocupes!\n\nEn SDK FINIX atendemos:\n🔧 Reparación de PCs, Laptops, Celulares, Impresoras\n🌐 Desarrollo Web y Software a Medida\n\nPrueba preguntando algo como:\n• \"Mi pantalla está negra\"\n• \"Mi laptop no prende\"\n• \"Quiero una página web\"\n• \"Cuánto cuesta cambiar la pantalla\"\n\n¡Te respondo de inmediato! 😊"
    };

    // ============================================================
    //   EVALUADOR MATEMATICO
    // ============================================================
    function evaluateMath(expression) {
        const match = expression.match(/([0-9]+(?:\.[0-9]+)?)\s*([+\-*/xX])\s*([0-9]+(?:\.[0-9]+)?)/);
        if (!match) return null;
        const a = parseFloat(match[1]);
        const op = match[2].toLowerCase();
        const b = parseFloat(match[3]);
        let res = 0;
        switch (op) {
            case '+': res = a + b; break;
            case '-': res = a - b; break;
            case '*': case 'x': res = a * b; break;
            case '/': res = b !== 0 ? a / b : 'Error (div / 0)'; break;
        }
        if (typeof res === 'number' && !Number.isInteger(res)) {
            res = parseFloat(res.toFixed(4));
        }
        return res;
    }

    // ============================================================
    //   PROCESADOR DE MENSAJES
    // ============================================================
    function processMessage(msg) {
        let txt = msg.toLowerCase().trim();

        // 1. Evaluar matematica
        const mathResult = evaluateMath(txt);
        if (mathResult !== null) {
            return `🔢 El resultado es: ${mathResult}`;
        }

        // 2. Combinaciones especiales
        if (txt.includes("celular") && txt.includes("pantalla")) {
            return "📱 Realizamos reemplazo de pantalla para celulares de todas las marcas. Usamos repuestos originales y premium con garantía. ¿Cuál es la marca y modelo exacto de tu celular?";
        }
        if (txt.includes("laptop") && txt.includes("pantalla")) {
            return "💻 Cambiamos pantallas de laptops de todas las marcas. Dinos la marca y modelo exacto (ej: HP 15-da, Dell Inspiron 15, Lenovo IdeaPad 3) para cotizarte.";
        }
        if (txt.includes("tablet") && txt.includes("pantalla")) {
            return "📱 Cambiamos pantallas de tablets. Dinos la marca y modelo exacto (iPad Air 4, Galaxy Tab A8, Lenovo M10) para cotizarte.";
        }

        // 3. Busqueda por palabras clave (de mas especificas a mas generales)
        // Ordenar las keys por longitud descendente para preferir coincidencias mas largas
        const keys = Object.keys(botResponses).filter(k => k !== 'default');
        keys.sort((a, b) => b.length - a.length);

        for (const key of keys) {
            if (txt.includes(key)) {
                return botResponses[key];
            }
        }

        return botResponses["default"];
    }

    // ============================================================
    //   FUNCIONES DE CHAT
    // ============================================================
    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `msg ${sender}`;
        div.innerText = text;
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

    function sendMessage() {
        const rawText = chatInput.value;
        if (rawText.trim() === "") return;

        addMessage(rawText, 'user');
        chatInput.value = '';

        const typingEl = showTyping();

        // Retardo realista segun longitud del mensaje
        let delay = 1000 + Math.random() * 1000;
        if (rawText.length > 25) delay = 2000 + Math.random() * 2000;
        if (rawText.length > 60) delay = 3000 + Math.random() * 4000;

        setTimeout(() => {
            typingEl.remove();
            const reply = processMessage(rawText);
            addMessage(reply, 'bot');
        }, delay);
    }

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});
