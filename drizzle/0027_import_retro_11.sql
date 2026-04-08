-- Import Retro #11
-- Date: May 28, 2024 | 13 cards | 4 Participants: Jakub, Matěj, Petr, Vladimír
-- Anonymous authors with AI guesses

INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES ('00000000-0000-4000-8000-000000000000', 'Anonymous', 'anonymous@rekapka.local', '#9CA3AF', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000011-0000-4000-8000-000000000011',
  'Retro #11',
  'completed',
  '2024-05-28',
  NULL,
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2024-05-28 17:00:00+00',
  '2024-05-28 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000011-0001-4000-8000-000000000001', 'a0000011-0000-4000-8000-000000000011', 'Mad', '😡', '#EF4444', 0),
  ('ca000011-0002-4000-8000-000000000002', 'a0000011-0000-4000-8000-000000000011', 'Sad', '😢', '#3B82F6', 1),
  ('ca000011-0003-4000-8000-000000000003', 'a0000011-0000-4000-8000-000000000011', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 1: Sad - Petr (long rant, public transport frustration, vulgar)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000011-0000-4000-8000-000000000001', 'a0000011-0000-4000-8000-000000000011', 'ca000011-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Vystupuješ z metra, podíváš se na mapy.cz - jo, chci jít východem E8, žádný problém... Akorát že vůbec... protože ty feťáci nejsou schopný dát čísla východů na navigační tabule.',
  'Petr Weissar',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 2: Sad - Petr (long, Polabiny/Pardubice, hockey, provocative)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000011-0000-4000-8000-000000000002', 'a0000011-0000-4000-8000-000000000011', 'ca000011-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'V Polabinách je v jedné části Lidl do kterého chodí nejvíc divnolidí a plebsu. Podle mě tam nikdy není nikdo normální. Ve třetí třetině cz-swe jsem šel koupit vrtačku. Lidl byl zcela prázdný. Je hokej pro plebs, protože je to agresivní pičovina?',
  'Petr Weissar',
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 3: Sad - Petr (long, references Kuba, YT business idea, emoji)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000011-0000-4000-8000-000000000003', 'a0000011-0000-4000-8000-000000000011', 'ca000011-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  E'Nabídl jsem Kubovi založit channel "Ugly Composers", kde bychom po vzoru Phillippa Lacknera sdíleli hacky a hezkosti na Compose (ideálně asi multiplatform, protože je to budoucnost)..\nNo a Kuba mě odmítl, že je cílovka malá i přestože Filip má 166 tisíc odběratelů.\n\nTakže YT money + možnost získávat prachy z appky, kde ty nej věci budou za dollar mi přišlo dobrý, ale Kuba nesouhlasí.\n\nTakže Kuba si asi nechce kupovat byt v Bubnech to vypadá.. 🤔',
  'Petr Weissar',
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 4: Glad - Jakub (short, tech/Google, dev slang)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000011-0000-4000-8000-000000000004', 'a0000011-0000-4000-8000-000000000011', 'ca000011-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Vymrdaný špičky z Gůglu',
  'Jakub Minarik',
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 5: Sad - Petr (hockey, politics, social bubble, emoji)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000011-0000-4000-8000-000000000005', 'a0000011-0000-4000-8000-000000000011', 'ca000011-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Koukali jsme na hokej Cze x Usa a na chvíli tam ukázali Fialu, Pekarovou a Rakušana.. sociální bublina praskla 😂 ale nutno říct, že bučela půlka hospody jen',
  'Petr Weissar',
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 6: Sad - Petr (about Kuba, personal/finance joke)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000011-0000-4000-8000-000000000006', 'a0000011-0000-4000-8000-000000000011', 'ca000011-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Kuba by potřeboval finančního poradce aka přítelkyni',
  'Petr Weissar',
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 7: Glad - Petr (geopolitics, Israel/Palestine, long analysis)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000011-0000-4000-8000-000000000007', 'a0000011-0000-4000-8000-000000000011', 'ca000011-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Izrael šanci dostal a za dlouhou dobu nic nevyřešil.. Norsko, Španělsko a Irsko od úterý uznávají Palestinu stejně jako většina zemí světa. Stejné argumenty které vedly k uznání Kosova nyní neplatí pro uznání Palestiny. Bude přeci jen cesta jim území nechat? Munice se určitě bude víc hodit proti Rusku.',
  'Petr Weissar',
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 8: Glad - Vladimír (short, hockey)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000011-0000-4000-8000-000000000008', 'a0000011-0000-4000-8000-000000000011', 'ca000011-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'progress vztahu k hokeji',
  'Vladimír Tichý',
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 9: Glad - Matěj (investment tracking idea, structured)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000011-0000-4000-8000-000000000009', 'a0000011-0000-4000-8000-000000000011', 'ca000011-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Pánové, často se přeme co je nejlepší investice. Pojďme vytvořit nějakou tabulku, kam naboucháme svoje investice a na retru číslo 500 to vyhodnotíme, kdo měl pravdu. Pojďme zavést trošku vědecké metody do našeho mletí hoven!',
  'Matěj Daníček',
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 10: Glad - Vladimír (short, city comparison)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000011-0000-4000-8000-000000000010', 'a0000011-0000-4000-8000-000000000011', 'ca000011-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Praha vs PCE/HK objektivně',
  'Vladimír Tichý',
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 11: Glad - Vladimír (very short, cars)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000011-0000-4000-8000-000000000011', 'a0000011-0000-4000-8000-000000000011', 'ca000011-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'je ze mě dieselhead',
  'Vladimír Tichý',
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 12: Glad - Jakub (AI/work, concise)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000011-0000-4000-8000-000000000012', 'a0000011-0000-4000-8000-000000000011', 'ca000011-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Copilot jako firemni benefit, ktery te jednou nahradi.',
  'Jakub Minarik',
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 13: Glad - uncertain (incomplete/truncated card)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000011-0000-4000-8000-000000000013', 'a0000011-0000-4000-8000-000000000011', 'ca000011-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'dáme to na interní infra, to',
  NULL,
  true, false, 13)
ON CONFLICT (id) DO NOTHING;
