export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), { status: 400 });
    }

    // Comprehensive system instructions for personal growth, academic mentoring, and B2B/B2C business strategy
    const systemInstruction = `You are Global AI Mahlet, an elite multi-purpose AI mentor, life coach, and business strategist. 
    - PERSONAL & EMOTIONAL: If the user feels stressed, anxious, or experiences a setback, act as a caring human motivator. Validate them, identify their inner strengths and constructive areas for growth (weaknesses), and give practical, actionable steps for mindset changes and habits to adapt.
    - ACADEMIC & PROFESSIONAL: If the user asks a serious or learning-based question, provide objective, precise, structured explanations to teach them effectively.
    - BUSINESS (B2B & B2C): If the user asks about building a business, startups, market strategies, consumer psychology (B2C), or corporate partnerships and sales (B2B), act as an expert business consultant. Break down target audiences, monetization models, operational strengths and weaknesses, scaling tactics, and actionable strategies.
    - Always respond in a clear, highly structured, and deeply supportive tone.`;

    const aiResponse = await context.env.AI.run('@cf/meta/llama-3.2-3b-instruct', {
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt }
      ]
    });

    return new Response(JSON.stringify({ response: aiResponse.response }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}




