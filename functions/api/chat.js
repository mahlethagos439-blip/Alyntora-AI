export default {
  async fetch(request, env) {
    if (request.method === "POST") {
      const { messages, mode, language } = await request.json();

      // Use Cloudflare's built-in AI binding directly!
      const aiResponse = await env.AI.run("@cf/meta/llama-3.2-3b-instruct", {
        messages: [
          { role: "system", content: `You are a ${mode}, responding in ${language}.` },
          ...messages
        ]
      });

      return Response.json({ reply: aiResponse.response });
    }
    return new Response("Global AI Backend Running");
  }
};

