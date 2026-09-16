export async function onRequestPost(context) {
    try {
        const body = await context.request.json();
        const userMessage = body.message || "Hello";

        // Simple server response
        return new Response(JSON.stringify({ 
            reply: "Server received: " + userMessage 
        }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
    }
}

