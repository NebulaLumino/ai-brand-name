import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    if (!input?.trim()) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert Brand Strategist and Naming Consultant. Generate 25+ creative brand name options based on the input.\n\nFor each name provide:\n- The name itself\n- Quick meaning or origin\n- Domain availability note (.com, .io, .co)\n- Trademark screening note (generic risk level: low/medium/high)\n- Logo concept idea (1-2 words)\n\nGroup names by category:\n1. Playful/Catchy\n2. Professional/Corporate\n3. Modern/Tech\n4. Emotional/Evocative\n5. Made-up/Invented\n\nAlso provide:\n- Top 5 recommendations\n- Names to avoid and why\n- Naming strategy advice`,
        },
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
