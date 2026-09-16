export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const body = await request.json();

    const message = String(body.message || "").trim();
    const mode = String(body.mode || "friend");
    const language = String(body.language || "en-US");
    const history = Array.isArray(body.history) ? body.history : [];

    if (!message) {
      return Response.json(
        { error: "Please enter a message." },
        { status: 400 }
      );
    }

    if (!env.AI) {
      return Response.json(
        {
          error:
            "Cloudflare Workers AI binding was not found. Please check that the AI binding is named AI and redeploy."
        },
        { status: 500 }
      );
    }

    const systemMessage = `
You are Global AI Mahlet 🌍, a helpful, intelligent AI assistant.

Your current mode is: ${mode}.

The user selected language: ${language}.

Always try to answer the user's question clearly, accurately and helpfully.
Be friendly and easy to understand.
Do not say that you are a fake AI or a programmed response.
`;

    const messages = [
      {
        role: "system",
        content: systemMessage
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
        messages: messages
      }
    );

    const answer =
      result?.response ||
      result?.text ||
      result?.output_text ||
      "";

    if (!answer) {
      return Response.json(
        {
          error: "The AI model returned no text.",
          details: result
        },
        { status: 500 }
      );
    }

    return Response.json({
      response: answer
    });

  } catch (error) {

    return Response.json(
      {
        error:
          error?.message ||
          "Something went wrong while connecting to Cloudflare Workers AI."
      },
      { status: 500 }
    );

  }
}
