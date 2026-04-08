interface ExportCard {
  text: string;
  categoryName: string;
  authorName: string;
  groupLabel: string | null;
  isDiscussed: boolean;
  discussionDurationSec: number | null;
  tags: string[];
}

export function exportCardsToCsv(cards: ExportCard[]): string {
  const headers = [
    "Category",
    "Text",
    "Author",
    "Group",
    "Discussed",
    "Discussion Time (sec)",
    "Tags",
  ];

  const rows = cards.map((card) => [
    escapeCsv(card.categoryName),
    escapeCsv(card.text),
    escapeCsv(card.authorName),
    escapeCsv(card.groupLabel ?? ""),
    card.isDiscussed ? "Yes" : "No",
    card.discussionDurationSec?.toString() ?? "",
    escapeCsv(card.tags.join(", ")),
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
