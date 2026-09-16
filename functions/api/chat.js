export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { messages } = body;
    
    // Extract the latest user prompt from the array
    const latestMessage = messages && messages.length > 0 ? messages[messages.length - 1].content : "";
    const text = latestMessage.toLowerCase();

    let aiReply = "I am listening and ready to help you with your projects!";

    // ChatGPT-style smart local logic rules
    if (text.includes('code') || text.includes('html') || text.includes('javascript') || text.includes('python')) {
      aiReply = "Here is how you can approach that coding problem:\n\n1. Break your logic into smaller functions.\n2. Check your browser's console for syntax or reference errors.\n3. Ensure all event listeners are correctly mapped to your DOM elements.\n\nLet me know if you want me to write a specific code snippet for this!";
    } else if (text.includes('math') || text.includes('solve') || text.includes('calculate')) {
      aiReply = "Let's break down this mathematical concept step by step:\n- Identify the known variables.\n- Apply the appropriate formula or rule.\n- Verify your calculation.\n\nWhat specific numbers or equation are you working with?";
    } else if (text.includes('write') || text.includes('essay') || text.includes('story')) {
      aiReply = "Here is a structured outline to help you write that:\n\n* **Introduction**: Hook the reader and state your core idea.\n* **Body Paragraphs**: Provide supporting details, arguments, or examples.\n* **Conclusion**: Summarize your main points effectively.\n\nTell me the topic and I can draft it for you!";
    } else if (text.includes('hi') || text.includes('hello')) {
      aiReply = "Hello! How can I assist you with your learning or research today?";
    }

    const response = { reply: aiReply };

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error processing request." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
