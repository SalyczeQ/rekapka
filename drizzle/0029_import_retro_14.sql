-- Import Retro #14
-- Date: Jul 23, 2024 | 12 cards | 4 Participants: Jakub, Matěj, Petr, Vladimír
-- Anonymous authors with AI guesses

INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES ('00000000-0000-4000-8000-000000000000', 'Anonymous', 'anonymous@rekapka.local', '#9CA3AF', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000014-0000-4000-8000-000000000014',
  'Retro #14',
  'completed',
  '2024-07-23',
  NULL,
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2024-07-23 17:00:00+00',
  '2024-07-23 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000014-0001-4000-8000-000000000001', 'a0000014-0000-4000-8000-000000000014', 'Mad', '😡', '#EF4444', 0),
  ('ca000014-0002-4000-8000-000000000002', 'a0000014-0000-4000-8000-000000000014', 'Sad', '😢', '#3B82F6', 1),
  ('ca000014-0003-4000-8000-000000000003', 'a0000014-0000-4000-8000-000000000014', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 1: Glad - Matěj (language/culture observation, concise)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000014-0000-4000-8000-000000000001', 'a0000014-0000-4000-8000-000000000014', 'ca000014-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Pochopí někdy Češi, že actual neznamená aktuální?',
  'Matěj Daníček',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 2: Glad - Petr (health/back pain, age topic)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000014-0000-4000-8000-000000000002', 'a0000014-0000-4000-8000-000000000014', 'ca000014-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Bolest zad po třicítce. Je to prostě už součást života?',
  'Petr Weissar',
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 3: Sad - Petr (Prague vs other cities, real estate, emoji)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000014-0000-4000-8000-000000000003', 'a0000014-0000-4000-8000-000000000014', 'ca000014-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Pojďme si jednou provždy shrnout věci, které má jen Praha a ve stotisícovém městě nejsou k dispozici a zkusme vyvrátit hypotézu, že Praha je zbytečně předražená a nahajpovaná 💸',
  'Petr Weissar',
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 4: Glad - Petr (height observation, quirky, emoji)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000014-0000-4000-8000-000000000004', 'a0000014-0000-4000-8000-000000000014', 'ca000014-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Vysocí lidé nemají v dnešním světě žádnou výhodu. Všude mají málo místa, vráží hlavou do stropů. K čemu jinému je výśka krom sociálního statusu? 📐',
  'Petr Weissar',
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 5: Glad - Petr (about Matěj, health humor)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000014-0000-4000-8000-000000000005', 'a0000014-0000-4000-8000-000000000014', 'ca000014-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Matějova hluchometrie aneb poznej jestli je to tón ze sluchátek nebo proudící krev v hlavě',
  'Petr Weissar',
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 6: Glad - Petr (long, mountains vs sea debate, emoji, FB reference)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000014-0000-4000-8000-000000000006', 'a0000014-0000-4000-8000-000000000014', 'ca000014-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  E'Hory nebo Moře. V kdejaké kavárně jsou na dyška právě tyto 2 skleničky. Prodává se merch od spousty značek. Společnost je tím rozpolcená. Všiml jsem si toho na FB v jedné diskuzi - lidi jsou fakt nasraný, když někdo shazuje jejich variantu 😂\nNikdo třeba nebere v potaz město a to mi taky přijde zajímavý na odpočinek.\nJak to máte vy? Jste vyhranění na jednu z těchto variant? 🤔',
  'Petr Weissar',
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 7: Sad - Jakub (wedding music, practical)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000014-0000-4000-8000-000000000007', 'a0000014-0000-4000-8000-000000000014', 'ca000014-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Hudba na svatební obřad - co vymyslet neklišovatého, pokud nejste fanoušek metalu?',
  'Jakub Minarik',
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 8: Glad - Matěj (ThinkPad vs Mac, tech comparison, detailed)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000014-0000-4000-8000-000000000008', 'a0000014-0000-4000-8000-000000000014', 'ca000014-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'ThinkPad water resistance - dostal tak 3 decky krásně z boku takže na klavisnici i na spodní průduchy a úplně bez problémů.... no hate: jak je na tom Mac v tomhle ohledu? ... a bit of hate: jak rychle rozeberete maca vy abyste odpojili baterku?',
  'Matěj Daníček',
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 9: Sad - Petr (group dynamics, fairness, emoji)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000014-0000-4000-8000-000000000009', 'a0000014-0000-4000-8000-000000000014', 'ca000014-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Objevil se tu názor od člověka, že bychom neměli dělit partu a vše domlouvat společně i přestože náplň se některých nemusí týkat. Stejný člověk si však domluvil sólo talk ohledně investic a nikoho dalšího nepozval. Je to fér? 😱',
  'Petr Weissar',
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 10: Sad - Petr (about Dušan, travel/CO2, emoji, sarcastic)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000014-0000-4000-8000-000000000010', 'a0000014-0000-4000-8000-000000000014', 'ca000014-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Dušan konečně přestal zanechávat tuny CO2 a tak zase odletěl na Kanáry. Má ze sebe dobrý pocit? 🤑',
  'Petr Weissar',
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 11: Glad - Petr (gym, Pardubice vs Praha, emoji)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000014-0000-4000-8000-000000000011', 'a0000014-0000-4000-8000-000000000014', 'ca000014-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  '"Nejlepší fitko v ČR" už není v Hradci, ale v Pardubicích. Je čas zvednout kotvy a užívat si menší město se stejnými výhodami jako Praha? 🚢',
  'Petr Weissar',
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 12: Glad - Petr (health, spinal injection, personal)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000014-0000-4000-8000-000000000012', 'a0000014-0000-4000-8000-000000000014', 'ca000014-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  E'Kaudální blok - aka 10cm injekce od kostrče až po pátý obratel 🩸\nPomohlo k fixu vyhřezlé plotýnky?',
  'Petr Weissar',
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
