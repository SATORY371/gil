// knowledge-base.js - Base de conocimientos offline para SDK FINIX
const knowledgeBase = [
    // ====================== MÓVILES ======================
    { keywords: ["pantalla rota", "cambiar pantalla", "lcd", "touch", "display", "vidrio roto"], answer: "Para cambiar pantalla: Calienta los bordes 1-2 min con pistola de calor. Usa púas de plástico. Desconecta la batería primero. Precio: S/. 120 - S/. 450 según el modelo." },
    { keywords: ["no enciende", "muerto", "no prende", "black screen", "pantalla negra"], answer: "Si no enciende: 1) Carga 1 hora con cable original. 2) Forzar reinicio (Power + Vol Down 15 seg). 3) Revisa el puerto de carga. 4) Trae el equipo para diagnóstico de placa." },
    { keywords: ["batería", "se descarga", "drena rápido", "battery drain", "bateria hinchada"], answer: "Batería degradada: Si tiene más de 2 años, cámbiala. Evita cargadores genéricos. En SDK FINIX usamos baterías certificadas con garantía." },
    { keywords: ["no carga", "puerto de carga", "pin de carga", "suelto"], answer: "Si no carga: Limpia el puerto con un cepillo seco. Si el cable baila, el puerto interno está dañado. Reparación en 1 hora en nuestro laboratorio." },
    { keywords: ["sobrecalienta", "calienta mucho", "calor", "quema"], answer: "Calentamiento: Puede ser una app consumiendo recursos o fallo en el IC de carga. No lo uses mientras carga. Recomiendo revisión técnica." },
    { keywords: ["mojado", "agua", "piscina", "mar", "caida agua"], answer: "¡APÁGALO YA! No lo pongas en arroz (es un mito). Tráelo para limpieza por ultrasonido y evitar corrosión interna inmediata." },

    // ====================== LAPTOPS ======================
    { keywords: ["laptop no enciende", "notebook no prende", "muerta"], answer: "Prueba quitar el cargador y la batería, mantén presionado Power 40 seg, luego conecta solo el cargador. Si no arranca, puede ser fallo en la etapa de potencia." },
    { keywords: ["lenta", "lento", "optimizar", "formatear", "windows lento"], answer: "Optimización Pro: Instalamos SSD (10 veces más rápido que un disco normal) + aumento de RAM. Quedará como nueva. S/. 180 aprox (incluye SSD)." },
    { keywords: ["se apaga sola", "calentamiento", "ruido ventilador", "fan"], answer: "Mantenimiento Preventivo: Necesita limpieza interna y cambio de pasta térmica (Arctic MX-6). Si no se hace, el procesador puede quemarse." },
    { keywords: ["teclado", "teclas no funcionan", "derramé cafe"], answer: "Si derramaste líquido, apágala. El teclado suele ser una pieza única que se reemplaza. Tenemos repuestos para HP, Dell, Lenovo, Asus." },
    { keywords: ["wifi no conecta", "sin internet", "red"], answer: "WiFi: Revisa si el switch físico está activo. Si no, reinstalamos drivers originales. En casos extremos, cambiamos la tarjeta interna M.2." },

    // ====================== IMPRESORAS ======================
    { keywords: ["papel atascado", "atascada", "error de papel"], answer: "Atasco: Retira el papel siempre en el sentido de la impresión, nunca hacia atrás. Limpia los rodillos con un paño húmedo." },
    { keywords: ["no imprime", "no sale tinta", "colores feos", "rayas"], answer: "Limpieza de Cabezales: Desde el software de la impresora haz 2 ciclos de limpieza. Si sigue fallando, hacemos purgado manual del sistema continuo." },
    { keywords: ["almohadillas", "vida util", "error e-11", "reseteo"], answer: "Reset de Almohadillas: Tu impresora se bloqueó por seguridad. Hacemos el reset por software y limpieza física de las esponjas internas." },
    { keywords: ["luz naranja", "luces parpadean", "error general"], answer: "Error Crítico: Suele ser un sensor sucio o un objeto extraño dentro. No la fuerces. Tráela para diagnóstico gratuito." },

    // ====================== DESARROLLO WEB / SOFTWARE ======================
    { keywords: ["paginas web", "crear sitio", "e-commerce", "tienda online"], answer: "Desarrollo Premium: Creamos sitios modernos, rápidos y autogestionables. Desde landing pages hasta sistemas complejos. Consulta por nuestros planes." },
    { keywords: ["zenix", "ia", "chatbot", "inteligencia artificial"], answer: "Zenix IA es nuestra creación propia. Podemos integrar sistemas similares en tu empresa para automatizar ventas y soporte 24/7." },

    // ====================== GENERAL ======================
    { keywords: ["precio", "costo", "cuanto vale", "tarifa"], answer: "El diagnóstico básico es gratuito si realizas la reparación. Los precios varían según el repuesto. Escríbenos al WhatsApp 904818986 para un presupuesto." },
    { keywords: ["horario", "atencion", "abierto"], answer: "Atendemos de Lunes a Sábado de 9:00 AM a 7:00 PM. Ubícanos en Ayacucho, Perú." },
    { keywords: ["contacto", "whatsapp", "telefono", "celular"], answer: "Contacto directo: WhatsApp +51 904818986. Email: sdkfinix@gmail.com." }
];

function findBestResponse(userMessage) {
    const msg = userMessage.toLowerCase().trim();
    let bestMatch = null;
    let maxScore = 0;

    for (let entry of knowledgeBase) {
        let score = 0;
        for (let keyword of entry.keywords) {
            if (msg.includes(keyword.toLowerCase())) {
                score += keyword.length > 5 ? 3 : 2;
            }
        }
        if (score > maxScore) {
            maxScore = score;
            bestMatch = entry.answer;
        }
    }

    if (maxScore < 2) {
        return null; // Devolver null para que el chatbot use la API online si hay internet
    }

    return bestMatch;
}

// Exportar para chatbot.js
window.knowledgeBase = knowledgeBase;
window.findBestResponse = findBestResponse;

console.log(`✅ Base de Conocimientos SDK cargada (${knowledgeBase.length} categorías).`);