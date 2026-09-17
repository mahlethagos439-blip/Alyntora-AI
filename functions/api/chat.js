export async function onRequestPost(context) {
    try {
        const body = await context.request.json();
        const userMessage = body.message || "Hello";
        
        // Read secrets safely from Cloudflare environment variables
        const ACCOUNT_ID = context.env.CF_ACCOUNT_ID;
        const API_TOKEN = context.env.CF_API_TOKEN;

        const aiResponse = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/meta/llama-3-8b-instruct`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: "You are a helpful, professional, and slang-free assistant named Global AI Mahlet." },
                        { role: "user", content: userMessage }
                    ]
                })
            }
        );

        const data = await aiResponse.json();
        
        let reply = "I am here to assist you.";
        if (data.result && data.result.response) {
            reply = data.result.response;
        }

        return new Response(JSON.stringify({ reply: reply }), {
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    } catch (err) {
        return new Response(JSON.stringify({ reply: "I am connected, but encountered a minor processing error." }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    }
}

