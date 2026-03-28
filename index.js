export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const { message } = await request.json();

      if (!message) {
        return Response.json({ reply: "No recibí mensaje." }, { headers: corsHeaders });
      }

      const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { 
              role: "system", 
              content: "Eres Zenix, asistente virtual de SDK FINIX. Habla en español con energía, usa emojis y ayuda con reparaciones técnicas y desarrollo web." 
            },
            { role: "user", content: message }
          ],
          temperature: 0.7,
          max_tokens: 700
        })
      });

      const data = await groqResponse.json();
      const aiReply = data.choices?.[0]?.message?.content || "No pude responder en este momento.";

      return Response.json({ reply: aiReply }, { headers: corsHeaders });

    } catch (error) {
      console.error(error);
      return Response.json({ 
        reply: "¡Ups! Hubo un error al conectar con Groq. Inténtalo de nuevo." 
      }, { 
        status: 500, 
        headers: corsHeaders 
      });
    }
  }
};