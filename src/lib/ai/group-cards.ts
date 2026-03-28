/**
 * Auto-group cards by theme using OpenAI API.
 * Falls back gracefully if API is unavailable.
 */
export async function groupCardsByTheme(
  cardTexts: string[]
): Promise<string[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || cardTexts.length === 0) {
    return cardTexts.map(() => "");
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
              "You are a retrospective facilitator. Group the following cards by theme. Return a JSON array of theme labels, one per card (same order as input). Use short labels (1-3 words). Cards with similar topics should share the same label. If a card doesn't fit any group, use an empty string.",
          },
          {
            role: "user",
            content: JSON.stringify(cardTexts),
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error:", response.status);
      return cardTexts.map(() => "");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "[]";

    // Extract JSON array from response (handle markdown code blocks)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return cardTexts.map(() => "");

    const labels: string[] = JSON.parse(jsonMatch[0]);

    // Ensure same length as input
    while (labels.length < cardTexts.length) labels.push("");
    return labels.slice(0, cardTexts.length);
  } catch (error) {
    console.error("Failed to group cards:", error);
    return cardTexts.map(() => "");
  }
}
