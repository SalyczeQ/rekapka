import OpenAI from "openai";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

interface CardForStats {
  id: string;
  text: string;
  categoryName: string;
  authorName: string;
  isDiscussed: boolean;
  isSkipped: boolean;
  discussionDurationSec: number | null;
}

export interface RetroStats {
  summary: string;
  themes: string[];
  sentiment: { positive: number; negative: number; neutral: number };
  longestDiscussedCard: { text: string; authorName: string; durationSec: number } | null;
  mostCardsByUser: { name: string; count: number } | null;
  totalDurationSec: number;
  mostVerboseUser: { name: string; totalChars: number } | null;
  longestCardText: { text: string; authorName: string; length: number } | null;
  mostDiscussedCategory: { name: string; totalDurationSec: number } | null;
  totalCards: number;
  discussedCards: number;
  skippedCards: number;
  avgDiscussionSec: number;
  avgCardWords: number;
  actionItemCount: number;
  cardsByCategory: { name: string; count: number }[];
  discussionDistribution: { under1: number; oneToThree: number; threeToFive: number; overFive: number };
}

export async function generateRetroStats(
  cards: CardForStats[],
  totalDurationSec: number,
  actionItemCount: number = 0
): Promise<RetroStats> {
  // Compute local stats first
  const discussed = cards.filter((c) => c.isDiscussed);
  const skipped = cards.filter((c) => c.isSkipped && !c.isDiscussed);

  const discussionTimes = discussed
    .map((c) => c.discussionDurationSec ?? 0)
    .filter((t) => t > 0);

  const longestDiscussedCard = cards
    .filter((c) => c.discussionDurationSec != null)
    .sort((a, b) => (b.discussionDurationSec ?? 0) - (a.discussionDurationSec ?? 0))[0];

  const cardsByUser = cards.reduce((acc, c) => {
    acc[c.authorName] = (acc[c.authorName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCardsByUser = Object.entries(cardsByUser).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const charsByUser = cards.reduce((acc, c) => {
    acc[c.authorName] = (acc[c.authorName] || 0) + c.text.length;
    return acc;
  }, {} as Record<string, number>);

  const mostVerboseUser = Object.entries(charsByUser).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const longestCard = [...cards].sort((a, b) => b.text.length - a.text.length)[0];

  const durationByCategory = cards.reduce((acc, c) => {
    if (c.discussionDurationSec) {
      acc[c.categoryName] = (acc[c.categoryName] || 0) + c.discussionDurationSec;
    }
    return acc;
  }, {} as Record<string, number>);

  const mostDiscussedCategory = Object.entries(durationByCategory).sort(
    (a, b) => b[1] - a[1]
  )[0];

  // Avg / Median discussion time
  const avgDiscussionSec = discussionTimes.length > 0
    ? Math.round(discussionTimes.reduce((a, b) => a + b, 0) / discussionTimes.length)
    : 0;
  // Avg card length in words
  const totalWords = cards.reduce((sum, c) => sum + c.text.split(/\s+/).filter(Boolean).length, 0);
  const avgCardWords = cards.length > 0 ? Math.round(totalWords / cards.length) : 0;

  // Cards by category
  const categoryCountMap = cards.reduce((acc, c) => {
    acc[c.categoryName] = (acc[c.categoryName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const cardsByCategory = Object.entries(categoryCountMap).map(([name, count]) => ({ name, count }));

  // Discussion time distribution
  const distribution = { under1: 0, oneToThree: 0, threeToFive: 0, overFive: 0 };
  for (const t of discussionTimes) {
    if (t < 60) distribution.under1++;
    else if (t < 180) distribution.oneToThree++;
    else if (t < 300) distribution.threeToFive++;
    else distribution.overFive++;
  }

  // Generate LLM summary
  let summary = "";
  let themes: string[] = [];
  let sentiment = { positive: 0, negative: 0, neutral: 0 };

  try {
    const cardTexts = cards.map((c) => `[${c.categoryName}] ${c.text}`).join("\n");

    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content:
            'You are a retrospective facilitator. Analyze these retro cards and provide: 1) A brief summary (2-3 sentences), 2) Key themes (list of 3-5 short phrases), 3) Sentiment breakdown (positive/negative/neutral percentages that sum to 100). Respond in JSON: {"summary": "...", "themes": [...], "sentiment": {"positive": N, "negative": N, "neutral": N}}',
        },
        {
          role: "user",
          content: `Analyze these retrospective cards:\n\n${cardTexts}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (content) {
      const jsonStr = content.replace(/```json?\s*/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(jsonStr);
      summary = parsed.summary || "";
      themes = parsed.themes || [];
      sentiment = parsed.sentiment || { positive: 0, negative: 0, neutral: 0 };
    }
  } catch (error) {
    console.error("AI stats generation failed:", error);
    summary = `Retro completed with ${cards.length} cards discussed.`;
  }

  return {
    summary,
    themes,
    sentiment,
    longestDiscussedCard: longestDiscussedCard
      ? {
          text: longestDiscussedCard.text,
          authorName: longestDiscussedCard.authorName,
          durationSec: longestDiscussedCard.discussionDurationSec ?? 0,
        }
      : null,
    mostCardsByUser: mostCardsByUser
      ? { name: mostCardsByUser[0], count: mostCardsByUser[1] }
      : null,
    totalDurationSec,
    mostVerboseUser: mostVerboseUser
      ? { name: mostVerboseUser[0], totalChars: mostVerboseUser[1] }
      : null,
    longestCardText: longestCard
      ? {
          text: longestCard.text,
          authorName: longestCard.authorName,
          length: longestCard.text.length,
        }
      : null,
    mostDiscussedCategory: mostDiscussedCategory
      ? { name: mostDiscussedCategory[0], totalDurationSec: mostDiscussedCategory[1] }
      : null,
    totalCards: cards.length,
    discussedCards: discussed.length,
    skippedCards: skipped.length,
    avgDiscussionSec,
    avgCardWords,
    actionItemCount,
    cardsByCategory,
    discussionDistribution: distribution,
  };
}
