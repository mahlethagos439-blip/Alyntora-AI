export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        const body = await request.json();
        const { messages, mode, language } = body;

        // Extract the latest user prompt
        const latestMessage = messages[messages.length - 1]?.content || "Hello";

        // Call your AI provider API here (Example structure using an environment API key)
        // If you are using Google Gemini or OpenAI, put your fetch call to their API here.
        
        // For testing connection immediately, this fallback returns a live response:
        const aiReply = `Hello! I am your ${mode} AI. You said: "${latestMessage}". (Connected successfully!)`;

        return new Response(JSON.stringify({ response: aiReply }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: "Server error processing chat." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

