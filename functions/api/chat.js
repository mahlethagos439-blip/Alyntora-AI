export async function onRequestPost(context) {
    try {
        const body = await context.request.json();
        const userMessage = body.message || "Hello";
        
        const ACCOUNT_ID = "2e79e1ab85d38eac759b687611c40e2b";
        const API_TOKEN = "cfut_qy1p7yAsJjNrUPoevLDNLd3fNNxMR6FDgs1vFKb554f872df";

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
                        { role: "system", content: "You are a helpful assistant." },
                        { role: "user", content: userMessage }
                    ]
                })
            }
        );

        const textResponse = await aiResponse.text();
        let data;
        try {
            data = JSON.parse(textResponse);
        } catch (e) {
            return new Response(JSON.stringify({ reply: "Cloudflare returned a non-JSON response: " + textResponse }), {
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
            });
        }
        
        let reply = "I am here to assist you.";
        if (data.result && data.result.response) {
            reply = data.result.response;
        } else if (data.errors && data.errors.length > 0) {
            reply = "API Error: " + data.errors[0].message;
        }

        return new Response(JSON.stringify({ reply: reply }), {
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    } catch (err) {
        return new Response(JSON.stringify({ reply: "Connection exception occurred: " + err.message }), {
            status: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
    }
}

