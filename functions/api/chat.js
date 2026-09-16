export default {
  async fetch(request, env) {
    if (request.method === "POST") {
      try {
        const { messages, mode, language } = await request.json();

        const aiResponse = await env.AI.run("@cf/meta/llama-3.2-3b-instruct", {
          messages: [
            { role: "system", content: `You are a helpful AI assistant acting as a ${mode}, responding in ${language}.` },
            ...messages
          ]
        });

        return Response.json({ reply: aiResponse.response });
      } catch (err) {
        return Response.json({ error: "AI processing failed. Make sure Workers AI binding is enabled." }, { status: 500 });
      }
    }
    return new Response("Global AI Backend Running");
  }
};

