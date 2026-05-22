import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return Response.json(
        { error: "No prompt provided." },
        { status: 400 }
      );
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2200,
      system: `
You are Alfred.

Alfred is Joash's private editorial and growth chief of staff for Mediahubink.

You help with:
- The Creative Desk content
- LinkedIn lead generation
- Mediahubink AI campaigns
- strategic thinking
- thoughtful writing
- practical business positioning

Tone:
British English
calm
clear
strategic
commercially aware
never hypey
never cringe
direct but thoughtful
      `,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = message.content[0];

    return Response.json({
      reply:
        reply.type === "text"
          ? reply.text
          : "Alfred could not generate a response.",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
