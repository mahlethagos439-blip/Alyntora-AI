export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const token = env.CF_API_TOKEN;
    const accountId = env.CF_ACCOUNT_ID;

    if (!token) {
      return Response.json(
        { error: "CF_API_TOKEN is missing." },
        { status: 500 }
      );
    }

    if (!accountId) {
      return Response.json(
        { error: "CF_ACCOUNT_ID is missing." },
        { status: 500 }
      );
    }

    const body = await request.json();

    const message = String(body.message || "").trim();

    if (!message) {
      return Response.json(
        { error: "Message is empty." },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
      {
        method: "POST",

        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are Global AI Mahlet, a helpful AI assistant. " +
                "Answer clearly, accurately and naturally."
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return Response.json(
        {
          error:
            result?.errors?.[0]?.message ||
            "Cloudflare AI request failed."
        },
        { status: 500 }
      );
    }

    return Response.json({
      response: result.result?.response || "No AI response."
    });

  } catch (error) {

    return Response.json(
      {
        error: error?.message || "Server error."
      },
      { status: 500 }
    );

  }
}
