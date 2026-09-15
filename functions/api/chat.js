export async function onRequestPost(context) {
  try {
    const { messages, mode, language, image } = await context.request.json();
    
    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), { status: 400 });
    }

    let roleInstruction = "You are Global AI Mahlet, a helpful AI assistant.";
    if (mode === "coach") {
      roleInstruction = "You are Global AI Mahlet, a deeply supportive, empathetic personal coach and stress motivator. Validate feelings, identify inner strengths, and offer positive habits.";
    } else if (mode === "mentor") {
      roleInstruction = "You are Global AI Mahlet, an expert academic and technical mentor. Provide structured, accurate, and precise educational guidance.";
    } else if (mode === "business") {
      roleInstruction = "You are Global AI Mahlet, an elite business strategist specializing in B2B and B2C scaling, market strategies, and consumer insight.";
    }

    const systemInstruction = `${roleInstruction} CRITICAL REQUIREMENT: You must respond entirely in the following language: ${language || "English"}. Ensure natural phrasing and correct style for this language.`;

    let formattedMessages = [
      { role: 'system', content: systemInstruction },
      ...messages
    ];

    if (image && formattedMessages.length > 0) {
      const lastUserMsgIndex = formattedMessages.length - 1;
      formattedMessages[lastUserMsgIndex].content = [
        { type: "text", text: formattedMessages[lastUserMsgIndex].content },
        { type: "image_url", image_url: image }
      ];
    }

    const aiResponse = await context.env.AI.run('@cf/meta/llama-3.2-3b-instruct', {
      messages: formattedMessages
    });

    return new Response(JSON.stringify({ response: aiResponse.response }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
