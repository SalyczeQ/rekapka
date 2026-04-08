import OpenAI from "openai";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

interface CardForGrouping {
  id: string;
  text: string;
}

interface GroupResult {
  cardId: string;
  groupLabel: string;
}

export async function groupCardsByTheme(
  cards: CardForGrouping[]
): Promise<GroupResult[]> {
  if (cards.length === 0) return [];

  try {
    const cardList = cards
      .map((c, i) => `${i + 1}. [${c.id}] ${c.text}`)
      .join("\n");

    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are a retrospective facilitator. Group these cards by similar themes. Return a JSON array of objects with cardId and groupLabel fields. Keep group labels short (2-4 words). If a card is unique, give it a descriptive label. Respond ONLY with valid JSON.",
        },
        {
          role: "user",
          content: `Group these retrospective cards by theme:\n\n${cardList}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) return cards.map((c) => ({ cardId: c.id, groupLabel: "" }));

    // Parse JSON from response (handle markdown code blocks)
    const jsonStr = content.replace(/```json?\s*/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(jsonStr) as GroupResult[];

    return parsed;
  } catch (error) {
    console.error("AI grouping failed:", error);
    // Fallback: no grouping
    return cards.map((c) => ({ cardId: c.id, groupLabel: "" }));
  }
}
