import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import OpenAI from "openai";

const EXPORT_DIR = path.join(process.cwd(), "export");
const DRIZZLE_DIR = path.join(process.cwd(), "drizzle");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Known author patterns from retros #28-30
const AUTHOR_PROFILES = {
  "Petr Weissar": "Writes long detailed stories, uses 😂🥰🤔 emojis heavily, references EU politics, real estate, AI in banking, mentions colleagues by name, uses Czech slang, self-deprecating humor, often asks group for opinions ('Co si o tom myslíte?'), mentions Terka/Max (family), talks about PR reviews and code quality, references LP (Las Palmas), writes the most cards",
  "Dušan Salay": "Shorter direct cards, mentions AI/software engineering, asks practical questions about money/investing, mentions TruU (employer), talks about colleagues being conservative, uses 'change my mind' style, mentions buying apartment/katastr, asks about travel destinations",
  "Vladimír Tichý": "Very short cards (1-5 words often), topics: BTC, padel, bydlení/real estate, ecology, cars/emissions, asks philosophical questions, mentions Las Palmas, laconic style",
  "Matěj Daníček": "Medium length, mentions Tinder/dating, self-defense classes, health topics, city life benefits, insurance comparisons, pop culture references, practical life tips",
  "Jakub Minarik": "Fewest cards, banking/finance topics (works at bank), mentions Claude/AI at work, appreciates group togetherness, mentions schwarzík (contractor work)",
};

function parseRetroFile(filename) {
  const match = filename.match(/Retro_(\d+)(?:_(.+?))?_(\d{4}-\d{1,2}-\d{1,2})\.csv$/);
  if (!match) return null;

  const num = parseInt(match[1]);
  const subtitle = match[2] || null;
  const dateStr = match[3];
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  let title = `Retro #${num}`;

  return { num, title, subtitle, date, filename };
}

function mapCategory(prompt, content) {
  const p = (prompt || "").toLowerCase();
  if (p.includes("go well") || p.includes("went well") || p.includes("success") || p === "glad" || p.includes("😄")) return "Glad";
  if (p.includes("didn't go") || p.includes("not go") || p.includes("failure") || p === "sad" || p.includes("😞")) return "Sad";
  if (p === "mad" || p.includes("😡")) return "Mad";

  // Guess from content sentiment
  const c = (content || "").toLowerCase();
  if (c.includes("😂") || c.includes("❤") || c.includes("🥰") || c.includes("doporučuj") || c.includes("super") || c.includes("skvěl")) return "Glad";
  if (c.includes("😞") || c.includes("bohužel") || c.includes("škoda") || c.includes("problém")) return "Sad";

  return "Sad"; // default
}

function escapeSQL(str) {
  return str.replace(/'/g, "''").replace(/\\/g, "\\\\");
}

async function guessAuthors(cards) {
  // Batch cards and ask GPT to guess authors
  const cardTexts = cards.map((c, i) => `[${i}] ${c.text.substring(0, 150)}`).join("\n");

  const prompt = `Given these 5 known authors and their writing styles:

${Object.entries(AUTHOR_PROFILES).map(([name, desc]) => `- ${name}: ${desc}`).join("\n")}

Guess the most likely author for each anonymous retro card below. Return a JSON array of author names (one per card, in order). If truly uncertain, use null.

Cards:
${cardTexts}

Return ONLY a JSON array like: ["Petr Weissar", "Dušan Salay", null, ...]`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: "You are matching anonymous retro cards to known authors based on writing style, topics, and patterns. Be conservative — only guess when you're fairly confident." },
        { role: "user", content: prompt },
      ],
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (content) {
      const jsonStr = content.replace(/```json?\s*/g, "").replace(/```/g, "").trim();
      return JSON.parse(jsonStr);
    }
  } catch (e) {
    console.error("GPT guess failed:", e.message);
  }
  return cards.map(() => null);
}

async function processRetro(info) {
  const csvPath = path.join(EXPORT_DIR, info.filename);
  const raw = fs.readFileSync(csvPath, "utf-8").replace(/^\uFEFF/, ""); // strip BOM

  let records;
  try {
    records = parse(raw, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      relax_quotes: true,
    });
  } catch (e) {
    console.error(`Failed to parse ${info.filename}: ${e.message}`);
    return null;
  }

  const cards = records
    .filter((r) => r.type === "Reflection" || r.content)
    .map((r, i) => ({
      text: (r.content || "").trim(),
      category: mapCategory(r.prompt, r.content),
      sortOrder: i + 1,
    }))
    .filter((c) => c.text.length > 0);

  if (cards.length === 0) {
    console.log(`  Skipping ${info.filename} — no cards`);
    return null;
  }

  // Guess authors in batches of 30
  console.log(`  Guessing authors for ${cards.length} cards...`);
  const guesses = [];
  for (let i = 0; i < cards.length; i += 30) {
    const batch = cards.slice(i, i + 30);
    const batchGuesses = await guessAuthors(batch);
    guesses.push(...batchGuesses);
  }

  // Generate SQL
  const retroId = `a0000${String(info.num).padStart(3, "0")}-0000-4000-8000-000000000${String(info.num).padStart(3, "0")}`;
  const catIds = {
    Mad: `ca0000${String(info.num).padStart(2, "0")}-0001-4000-8000-0000000000${String(info.num).padStart(2, "0")}`,
    Sad: `ca0000${String(info.num).padStart(2, "0")}-0002-4000-8000-0000000000${String(info.num).padStart(2, "0")}`,
    Glad: `ca0000${String(info.num).padStart(2, "0")}-0003-4000-8000-0000000000${String(info.num).padStart(2, "0")}`,
  };

  let sql = `-- Import ${info.title}${info.subtitle ? ` - ${info.subtitle}` : ""}
-- Date: ${info.date} | ${cards.length} cards | Anonymous authors with AI guesses
-- Source: ${info.filename}

-- Ensure Anonymous user exists
INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES ('00000000-0000-4000-8000-000000000000', 'Anonymous', 'anonymous@rekapka.local', '#9CA3AF', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  '${retroId}',
  '${escapeSQL(info.title)}',
  'completed',
  '${info.date}',
  NULL,
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '${info.date} 17:00:00+00',
  '${info.date} 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('${catIds.Mad}', '${retroId}', 'Mad', '😡', '#EF4444', 0),
  ('${catIds.Sad}', '${retroId}', 'Sad', '😢', '#3B82F6', 1),
  ('${catIds.Glad}', '${retroId}', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

`;

  cards.forEach((card, i) => {
    const cardId = `cd0000${String(info.num).padStart(2, "0")}-0000-4000-8000-${String(i + 1).padStart(12, "0")}`;
    const catId = catIds[card.category];
    const guess = guesses[i];
    const guessSQL = guess ? `'${escapeSQL(guess)}'` : "NULL";
    const escapedText = escapeSQL(card.text);
    const needsE = escapedText.includes("\n");

    sql += `INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('${cardId}', '${retroId}', '${catId}',
  '00000000-0000-4000-8000-000000000000',
  ${needsE ? "E" : ""}'${escapedText.replace(/\n/g, "\\n")}',
  ${guessSQL},
  true, false, ${card.sortOrder})
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

`;
  });

  return { sql, cardCount: cards.length, retroId };
}

async function main() {
  const files = fs.readdirSync(EXPORT_DIR).filter((f) => f.startsWith("Retro_") && f.endsWith(".csv"));
  const retros = files.map(parseRetroFile).filter(Boolean).sort((a, b) => a.num - b.num);

  console.log(`Found ${retros.length} retro CSVs to import\n`);

  // Read existing journal
  const journalPath = path.join(DRIZZLE_DIR, "meta", "_journal.json");
  const journal = JSON.parse(fs.readFileSync(journalPath, "utf-8"));
  let nextIdx = journal.entries.length;

  // Find the next migration number (after 0005_puzzling_talisman)
  const existingFiles = fs.readdirSync(DRIZZLE_DIR).filter((f) => f.endsWith(".sql"));
  const maxNum = Math.max(...existingFiles.map((f) => parseInt(f.split("_")[0]) || 0));
  let migNum = maxNum + 1;

  for (const info of retros) {
    console.log(`Processing ${info.title} (${info.date})...`);
    const result = await processRetro(info);
    if (!result) continue;

    const migName = `${String(migNum).padStart(4, "0")}_import_retro_${info.num}`;
    const migPath = path.join(DRIZZLE_DIR, `${migName}.sql`);
    fs.writeFileSync(migPath, result.sql);

    journal.entries.push({
      idx: nextIdx++,
      version: "7",
      when: Date.now() + migNum * 1000,
      tag: migName,
      breakpoints: true,
    });

    console.log(`  ✓ ${migName}.sql — ${result.cardCount} cards\n`);
    migNum++;
  }

  fs.writeFileSync(journalPath, JSON.stringify(journal, null, 2));
  console.log(`\nDone! Generated ${retros.length} migration files.`);
  console.log(`Journal updated with ${retros.length} new entries.`);
}

main().catch(console.error);
