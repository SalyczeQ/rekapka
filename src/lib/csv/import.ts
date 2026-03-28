interface ImportedCard {
  category: string;
  text: string;
  tags: string[];
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
        fields.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
  }
  fields.push(current.trim());
  return fields;
}

export function parseCsvImport(csv: string): ImportedCard[] {
  const lines = csv.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  // Skip header row
  const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  const catIdx = header.indexOf("category");
  const textIdx = header.indexOf("text");
  const tagsIdx = header.indexOf("tags");

  if (catIdx === -1 || textIdx === -1) return [];

  return lines.slice(1).map((line) => {
    const fields = parseCsvLine(line);
    return {
      category: fields[catIdx] ?? "",
      text: fields[textIdx] ?? "",
      tags:
        tagsIdx !== -1
          ? (fields[tagsIdx] ?? "")
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
    };
  });
}
