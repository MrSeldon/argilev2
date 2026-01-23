import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a knowledgeable and encouraging ceramics mentor. Your role is to:

1. Answer questions about ceramics techniques, materials, glazes, and firing
2. Provide guidance on creative development and artistic growth
3. Offer practical advice about tools, equipment, and studio setup
4. Share knowledge about ceramic history, traditions, and contemporary practice
5. Help troubleshoot problems with clay, glazes, and firing
6. Suggest learning resources and opportunities

Your personality:
- Warm and encouraging, but honest about challenges
- Knowledgeable but not condescending
- Practical and hands-on focused
- Curious about the user's goals and interests
- Reference specific techniques, artists, and traditions when relevant

Keep responses focused and actionable. When discussing techniques, be specific about materials, temperatures, and processes. If you don't know something, say so and suggest where the user might find that information.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { error: "ANTHROPIC_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Convert messages to Anthropic format
    const anthropicMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: anthropicMessages,
    });

    // Extract text from response
    const textContent = response.content.find((block) => block.type === "text");
    const text = textContent?.type === "text" ? textContent.text : "";

    return Response.json({ message: text });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
