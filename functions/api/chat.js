export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const token = env.CF_API_TOKEN;
    const accountId = env.CF_ACCOUNT_ID;

    if (!token || !accountId) {
      return Response.json(
        { error: "Cloudflare AI settings are missing." },
        { status: 500 }
      );
    }

    const body = await request.json();

    const message = String(body.message || "").trim();
    const history = Array.isArray(body.history) ? body.history : [];

    if (!message) {
      return Response.json(
        { error: "Message is empty." },
        { status: 400 }
      );
    }

    const messages = [
      {
        role: "system",
        content:
          "You are Global AI Mahlet, a helpful and intelligent AI assistant. " +
          "Answer clearly, accurately, and naturally. " +
          "Help with learning, research, coding, business, writing, and general questions."
      }
    ];

    for (const item of history.slice(-10)) {
      if (
        item &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string"
      ) {
        messages.push({
          role: item.role,
          content: item.content
        });
      }
    }

    messages.push({
      role: "user",
      content: message
    });

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages })
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
      response:
        result.result?.response ||
        "The AI returned an empty response."
    });

  } catch (error) {
    return Response.json(
      {
        error: error?.message || "AI request failed."
      },
      { status: 500 }
    );
  }
}
