// Zenix API Logic Engine - Cloudflare Worker
// Desarrollado para SDK FINIX (Ayacucho, Perú)

export default {
    async fetch(request, env) {
        // API keys provided by the user (add as Secrets in Cloudflare Workers)
    const USER_API_KEY_1 = env.USER_API_KEY_1; // e.g., AIzaSyC5mtWiDd_kjkcQzwd7XRGtKq0FMg7IWdQ
    const USER_API_KEY_2 = env.USER_API_KEY_2; // second key if needed

            "Access-Control-Allow-Origin": "*", // Cambiar por dominio específico en producción
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        };

        // 1. Manejo de Preflight (CORS)
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        // 2. Validación de Método
        if (request.method !== "POST") {
            return new Response(JSON.stringify({ error: "Método no permitido" }), { 
                status: 405, 
                headers: { ...corsHeaders, "Content-Type": "application/json" } 
            });
        }

        try {
            const body = await request.json();
            const userMessage = body.message;

            if (!userMessage) {
                return new Response(JSON.stringify({ error: "Mensaje vacío" }), { 
                    status: 400, 
                    headers: { ...corsHeaders, "Content-Type": "application/json" } 
                });
            }

            // 3. Configuración de Personalidad (System Prompt)
            const systemPrompt = `Eres Zenix IA ⚡, el motor lógico de SDK FINIX en Ayacucho.
            Tu tono es profesional, técnico, detallado y explicativo. Tus respuestas deben ser completas y largas, ofreciendo toda la información posible.
            CONTEXTO DE SDK FINIX:
            - Ubicación: Jr. Ayacucho 123 (Simulado, ajustar si es necesario).
            - Servicios: Reparación de Hardware (Laptops, PCs, Impresoras), Soporte Móvil (iPhone/Samsung), Desarrollo Web Premium.
            - Marcas: HP, Dell, Lenovo, Apple, Samsung, Xiaomi.
            REGLAS:
            - Nunca inventes precios específicos sin confirmación.
            - Si detectas problemas de conexión, sugiere revisar los Bindings de Cloudflare.
            - Responde siempre en español.`;

            // 4. Llamada al Motor de Inferencia (Google Gemini como principal)
            const geminiKey = USER_API_KEY_1;
            let reply = "";
            if (geminiKey) {
                // Endpoint Gemini 1.5 Flash (versión recomendada actual)
                const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiKey}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        system_instruction: {
                            parts: [{ text: systemPrompt }]
                        },
                        contents: [{ role: "user", parts: [{ text: userMessage }] }]
                    })
                });
                if (!geminiResponse.ok) {
                    const err = await geminiResponse.json();
                    throw new Error(err.error?.message || "Error en la API de Gemini");
                }
                const geminiData = await geminiResponse.json();
                // La respuesta está en .candidates[0].content.parts[0].text
                reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
            } else {
                // 5. Llamada al Motor de Inferencia (Groq como fallback)
                const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${env.GROQ_API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: "llama-3.3-70b-versatile",
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: userMessage }
                        ],
                        temperature: 0.7,
                        max_tokens: 2048
                    })
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error?.message || "Error en el proveedor de IA");
                }
                const data = await response.json();
                reply = data.choices[0].message.content;
            }
            // 5. Respuesta Exitosa
            return new Response(JSON.stringify({ reply }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });

        } catch (error) {
            console.error("Worker Error:", error.message);
            
            // Mensaje de error sugerido por el usuario
            const errorMessage = "Error: El puente entre Cloudflare Pages y Workers podría tener un problema de CORS o de vinculación (Bindings). Verifica la integridad del motor lógico.";
            
            return new Response(JSON.stringify({ reply: errorMessage, detail: error.message }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }
    }
};
