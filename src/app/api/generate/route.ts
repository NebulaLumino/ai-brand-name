import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    if (!input?.trim()) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({
      baseURL: "https://api.deepseek.com/v1",
      apiKey: process.env.DEEPSEEK_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an expert Brand Strategist and Naming Consultant. Generate 25+ creative brand name options.\n\nFor each name provide: the name itself, quick meaning or origin, domain availability note, trademark screening note (risk level), and logo concept idea.\n\nGroup by: Playful/Catchy, Professional/Corporate, Modern/Tech, Emotional/Evocative, Made-up/Invented.\n\nAlso provide top 5 recommendations, names to avoid, and naming strategy advice." },
        { role: "user", content: `Generate brand names:\n\n${input}` },
      ],
      temperature: 0.9,
      max_tokens: 3000,
    });

    const result = response.choices[0]?.message?.content || "No result generated.";
    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Generation failed" }, { status: 500 });
  }
}
