interface RetroStatsInput {
  cards: { text: string; category_name: string; vote_count: number }[];
}

interface RetroStats {
  themes: string[];
  sentiment: { positive: number; negative: number; neutral: number };
  wordCloud: { word: string; count: number }[];
  summary: string;
}

/**
 * Generate retro statistics using OpenAI.
 * Falls back to basic local analysis if API unavailable.
 */
export async function generateRetroStats(
  input: RetroStatsInput
): Promise<RetroStats> {
  const apiKey = process.env.OPENAI_API_KEY;

  // Basic local word frequency
  const wordCounts = new Map<string, number>();
  for (const card of input.cards) {
    const words = card.text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 3);
    for (const word of words) {
      wordCounts.set(word, (wordCounts.get(word) ?? 0) + 1);
    }
  }

  const wordCloud = Array.from(wordCounts.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);

  if (!apiKey || input.cards.length === 0) {
    return {
      themes: [],
      sentiment: {
        positive: input.cards.filter((c) =>
          ["went well", "glad", "liked", "start", "continue"].some((k) =>
            c.category_name.toLowerCase().includes(k)
          )
        ).length,
        negative: input.cards.filter((c) =>
          ["improve", "mad", "sad", "stop", "lacked"].some((k) =>
            c.category_name.toLowerCase().includes(k)
          )
        ).length,
        neutral: input.cards.filter(
          (c) =>
            !["went well", "glad", "liked", "start", "continue", "improve", "mad", "sad", "stop", "lacked"].some(
              (k) => c.category_name.toLowerCase().includes(k)
            )
        ).length,
      },
      wordCloud,
      summary: `Retro with ${input.cards.length} cards across categories.`,
    };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              'Analyze this retrospective data and return JSON with: { "themes": ["theme1", ...], "sentiment": { "positive": N, "negative": N, "neutral": N }, "summary": "1-2 sentence summary" }',
          },
          {
            role: "user",
            content: JSON.stringify(
              input.cards.map((c) => ({
                text: c.text,
                category: c.category_name,
                votes: c.vote_count,
              }))
            ),
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "{}";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      themes: parsed.themes ?? [],
      sentiment: parsed.sentiment ?? { positive: 0, negative: 0, neutral: 0 },
      wordCloud,
      summary: parsed.summary ?? "",
    };
  } catch (error) {
    console.error("Failed to generate stats:", error);
    return {
      themes: [],
      sentiment: { positive: 0, negative: 0, neutral: input.cards.length },
      wordCloud,
      summary: `Retro with ${input.cards.length} cards. AI analysis unavailable.`,
    };
  }
}
