export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    if (!env.AI) {
      return Response.json(
        {
          error: "Workers AI binding is not available. Check that your binding is named AI and redeploy."
        },
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

    const result = await env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct",
      {
        messages
      }
    );

    return Response.json({
      response:
        result.response ||
        result.text ||
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
