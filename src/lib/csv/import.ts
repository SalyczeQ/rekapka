interface ImportedCard {
  category: string;
  text: string;
}

export function importCardsFromCsv(csv: string): ImportedCard[] {
  const lines = csv.split("\n").filter((l) => l.trim());
  if (lines.length < 2) return [];

  // Skip header row
  const dataLines = lines.slice(1);
  const results: ImportedCard[] = [];

  for (const line of dataLines) {
    const fields = parseCsvLine(line);
    if (fields.length >= 2) {
      results.push({
        category: fields[0].trim(),
        text: fields[1].trim(),
      });
    }
  }

  return results;
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        fields.push(current);
        current = "";
      } else {
        current += char;
      }
    }
  }

  fields.push(current);
  return fields;
}
