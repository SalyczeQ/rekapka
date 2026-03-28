interface ExportCard {
  category: string;
  text: string;
  author: string;
  votes: number;
  tags: string;
  discussed: boolean;
  group_label: string;
}

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function generateCsv(cards: ExportCard[]): string {
  const headers = [
    "Category",
    "Text",
    "Author",
    "Votes",
    "Tags",
    "Discussed",
    "Group",
  ];
  const rows = cards.map((card) =>
    [
      escapeCsv(card.category),
      escapeCsv(card.text),
      escapeCsv(card.author),
      String(card.votes),
      escapeCsv(card.tags),
      card.discussed ? "Yes" : "No",
      escapeCsv(card.group_label),
    ].join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}
