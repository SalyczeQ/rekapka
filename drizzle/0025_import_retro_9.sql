-- Import Retro #9
-- Date: Mar 22, 2024 | 25 cards | 3 Participants: Jakub, Petr, Vladimír
-- Anonymous authors with AI guesses

INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES ('00000000-0000-4000-8000-000000000000', 'Anonymous', 'anonymous@rekapka.local', '#9CA3AF', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000009-0000-4000-8000-000000000009',
  'Retro #9',
  'completed',
  '2024-03-22',
  NULL,
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2024-03-22 17:00:00+00',
  '2024-03-22 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000009-0001-4000-8000-000000000001', 'a0000009-0000-4000-8000-000000000009', 'Mad', '😡', '#EF4444', 0),
  ('ca000009-0002-4000-8000-000000000002', 'a0000009-0000-4000-8000-000000000009', 'Sad', '😢', '#3B82F6', 1),
  ('ca000009-0003-4000-8000-000000000003', 'a0000009-0000-4000-8000-000000000009', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 1: Sad - Petr (banking/money topic, self-deprecating)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000009-0000-4000-8000-000000000001', 'a0000009-0000-4000-8000-000000000009', 'ca000009-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'tak už je to oficiální, volali mi z banky, že jsem chudej',
  'Petr Weissar',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 2: Glad - Petr (tech/hardware)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000009-0000-4000-8000-000000000002', 'a0000009-0000-4000-8000-000000000009', 'ca000009-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'PC notebooky aneb co si sám nepřepastuješ, to se ti uvaří',
  'Petr Weissar',
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 3: Glad - Vladimír (short, wine/politics)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000009-0000-4000-8000-000000000003', 'a0000009-0000-4000-8000-000000000009', 'ca000009-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Spotřební daň na víno, je to fér?',
  'Vladimír Tichý',
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 4: Glad - Jakub (banking/finance, practical)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000009-0000-4000-8000-000000000004', 'a0000009-0000-4000-8000-000000000009', 'ca000009-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Prachy na Revolutu jsou pojisteny jen do 22k Euro. Ma vyznam to resit?',
  'Jakub Minarik',
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 5: Sad - Petr (business/accounting frustration, emoji)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000009-0000-4000-8000-000000000005', 'a0000009-0000-4000-8000-000000000009', 'ca000009-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Univerzita - Univision a účetnictví s Unisportem - aneb jak jsme založili novou firmu, protože chtěli a teď chtějí many za účto 😠',
  'Petr Weissar',
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 6: Glad - Jakub (dev process, work topic)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000009-0000-4000-8000-000000000006', 'a0000009-0000-4000-8000-000000000009', 'ca000009-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Vývojový proces u vás, kolik repo, PRs',
  'Jakub Minarik',
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 7: Sad - Vladimír (very short, laconic)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000009-0000-4000-8000-000000000007', 'a0000009-0000-4000-8000-000000000009', 'ca000009-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Jihlava',
  'Vladimír Tichý',
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 8: Glad - Jakub (work/company question)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000009-0000-4000-8000-000000000008', 'a0000009-0000-4000-8000-000000000009', 'ca000009-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Pracuje Keller ještě v MS? Máme nějaké nové info o této firmě?',
  'Jakub Minarik',
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 9: Glad - Petr (long, personal story, emoji heavy, references Dušan)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000009-0000-4000-8000-000000000009', 'a0000009-0000-4000-8000-000000000009', 'ca000009-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  E'Pardubická vinařská 10km 🏃\nŠlo to fajn.. ale co je funny 😂, že 99% na začátku závodu pouští hodinky a vznikají z toho mega weird fotky.\nViz konverzace s Dušanem na Telegramu předvést 🖼️',
  'Petr Weissar',
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 10: Glad - Petr (long, travel idea, emoji, geopolitics)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000009-0000-4000-8000-000000000010', 'a0000009-0000-4000-8000-000000000009', 'ca000009-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  E'Zaletět si do Litvy, půjčit si Teslu a projet si to tam s Lotyšskem i Estonskem? 🗯️\nJo nebo ne? Je to dobrý nápad tyto země navštívit, než je zabere Putin? 🐻',
  'Petr Weissar',
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 11: Sad - Petr (politics, Slovakia, emoji, rhetorical)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000009-0000-4000-8000-000000000011', 'a0000009-0000-4000-8000-000000000009', 'ca000009-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  E'Slovenské volby.. 🇸🇰\nChlapi, Slováci měli malý záchvěv inteligence s minulou vládou a Čaputovou - nicméně víme jak to celé dopadlo..\nČeká nás to samé i zde za 2-4 roky? 😬',
  'Petr Weissar',
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 12: Glad - uncertain (short, joke)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000009-0000-4000-8000-000000000012', 'a0000009-0000-4000-8000-000000000009', 'ca000009-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Asio od Bena je od Asie',
  NULL,
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 13: Glad - Vladimír (very short, laconic)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000009-0000-4000-8000-000000000013', 'a0000009-0000-4000-8000-000000000009', 'ca000009-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Znojmo',
  'Vladimír Tichý',
  true, false, 13)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 14: Sad - Petr (car insurance, sarcastic)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000009-0000-4000-8000-000000000014', 'a0000009-0000-4000-8000-000000000009', 'ca000009-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'tak platíme povinné ručení, paráda... takže asi můžeme na silnici, že?',
  'Petr Weissar',
  true, false, 14)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 15: Sad - Petr (long personal health story, emoji, doctor visit)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000009-0000-4000-8000-000000000015', 'a0000009-0000-4000-8000-000000000009', 'ca000009-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  E'Paní revmatoložka mi čekovala jak jsem ohebný v bedrech a nestačily ji na to prsty.. tak říkala jak mi nestačí prsty je to 17cm.. a to už je moc.. 😔 V momentě kdy se mi snažila namluvit že mám Bechtěreva i když tomu nic nenasvědčuje.. Přišel jsem a říkala než jsem si sedl: No jak vás tak vidím tak to bude pořád dvojka co? Máte s tím nárok na lázně.. ANEB ani když zaplatíš na soukromé klinice tak nemáš záruku že všichni doktoři budou v pohodě.. zatím je to 1 dobrý, 1 piča',
  'Petr Weissar',
  true, false, 15)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 16: Glad - Petr (digitalization, practical)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000009-0000-4000-8000-000000000016', 'a0000009-0000-4000-8000-000000000009', 'ca000009-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Digitalizace šlape a v autě už jen s občankou v mobilu',
  'Petr Weissar',
  true, false, 16)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 17: Glad - uncertain (short question)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000009-0000-4000-8000-000000000017', 'a0000009-0000-4000-8000-000000000009', 'ca000009-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'standing desk, jonebone?',
  NULL,
  true, false, 17)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 18: Glad - Petr (long, skiing, opinionated, emoji)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000009-0000-4000-8000-000000000018', 'a0000009-0000-4000-8000-000000000009', 'ca000009-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  E'Lyžování v Itálii vs. Lyžování ve Francii 🤜\nCo je lepší / horší?\nVýhledy, cena, luxus, lanovky, jídlo, lidský přístup.. 🤔\nAneb, proč jsou pořád všichni tak vycákaný z Francie, když je to předražený černý trash 🙄',
  'Petr Weissar',
  true, false, 18)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 19: Sad - Petr (drinking habits, group question)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000009-0000-4000-8000-000000000019', 'a0000009-0000-4000-8000-000000000009', 'ca000009-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  E'No, chlapi? Tak jak to vyřešíme s tím pitím v týdnu? 🤔\nJaký je ten pravý důvod toho, že s námi to nejde a bez nás to jde? 😱',
  'Petr Weissar',
  true, false, 19)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 20: Glad - Petr (long, about Vláďa moving, emoji heavy, positive)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000009-0000-4000-8000-000000000020', 'a0000009-0000-4000-8000-000000000009', 'ca000009-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  E'Vláďa se přestěhuje do Hradce, když tam má práci? ❤️\nLevnější město, příroda a hory blíž než v Praze, kousek do rodného Náchoda. Kousek od Pardubic 🚅 ♥️\nVidím v tom jen samá pozitiva - otázka teda není jestli, ale kdy? ⏲️',
  'Petr Weissar',
  true, false, 20)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 21: Sad - Petr (references Matěj, gossip, emoji)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000009-0000-4000-8000-000000000021', 'a0000009-0000-4000-8000-000000000009', 'ca000009-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  E'Když by náhodou Matěj zapomněl 🤔\nNedomlouval si náhodou Dan Pichl spolupráci s Mírou jako externista?\nJak to dopadlo? 🔥',
  'Petr Weissar',
  true, false, 21)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 22: Glad - Petr (karma/schadenfreude, emoji)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000009-0000-4000-8000-000000000022', 'a0000009-0000-4000-8000-000000000009', 'ca000009-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Vzpomínáte jak jsem přál Vaškovi jen to nejhorší? Už byl vyhozen z Dami.\nKarma? Nebo to nakonec vyhrál? 🤔',
  'Petr Weissar',
  true, false, 22)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 23: Glad - Vladimír (very short, car topic)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000009-0000-4000-8000-000000000023', 'a0000009-0000-4000-8000-000000000009', 'ca000009-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Klepe Mondeo?',
  'Vladimír Tichý',
  true, false, 23)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 24: Glad - Vladimír (real estate, short question)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000009-0000-4000-8000-000000000024', 'a0000009-0000-4000-8000-000000000009', 'ca000009-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Kam až vyšplhají ceny nemovitostí?',
  'Vladimír Tichý',
  true, false, 24)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 25: Glad - Petr (geopolitics, strong opinion, vulgar)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000009-0000-4000-8000-000000000025', 'a0000009-0000-4000-8000-000000000009', 'ca000009-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  '4 zmrdi vystrileli 137 Rusaku vcetne deti. O par hodin pozdeji je chytli a dalsi den byli u soudu. 1 v komatu, 1 bez ucha, vsichni zmlaceni do sracek. Je to spatne?',
  'Petr Weissar',
  true, false, 25)
ON CONFLICT (id) DO NOTHING;
