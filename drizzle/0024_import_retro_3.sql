-- Import Retro #3 - "Konečně taky trocha práce. A ještě ke všemu rukama."
-- Date: Sep 24, 2023 | 13 cards | 3 Participants: Matěj, Petr, Vladimír
-- Anonymous authors with AI guesses

INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES
  (gen_random_uuid(), 'Petr Weissar', 'weissar.petr@gmail.com', '#3B82F6', 'cs', 'default'),
  (gen_random_uuid(), 'Vladimír Tichý', 'vlado903@gmail.com', '#3B82F6', 'cs', 'default'),
  (gen_random_uuid(), 'Dušan Salay', 'salay14@gmail.com', '#3B82F6', 'cs', 'default'),
  (gen_random_uuid(), 'Jakub Minarik', 'jakub.minarik.11@gmail.com', '#3B82F6', 'cs', 'default'),
  (gen_random_uuid(), 'Matěj Daníček', 'danicek.matej@gmail.com', '#3B82F6', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES ('00000000-0000-4000-8000-000000000000', 'Anonymous', 'anonymous@rekapka.local', '#9CA3AF', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000003-0000-4000-8000-000000000003',
  'Retro #3 - Konečně taky trocha práce. A ještě ke všemu rukama.',
  'completed',
  '2023-09-24',
  NULL,
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2023-09-24 17:00:00+00',
  '2023-09-24 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000003-0001-4000-8000-000000000001', 'a0000003-0000-4000-8000-000000000003', 'Mad', '😡', '#EF4444', 0),
  ('ca000003-0002-4000-8000-000000000002', 'a0000003-0000-4000-8000-000000000003', 'Sad', '😢', '#3B82F6', 1),
  ('ca000003-0003-4000-8000-000000000003', 'a0000003-0000-4000-8000-000000000003', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 1: Glad - guessed Vladimír (real estate topic, short question style)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000003-0000-4000-8000-000000000001', 'a0000003-0000-4000-8000-000000000003', 'ca000003-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'je čas na nákup nemovitosti? a pokud ano, kde a proč je to zrovna Praha?',
  'Vladimír Tichý',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 2: Sad - guessed Petr (banking topic, "change my mind" borrowed from Dušan but Petr also uses it, banking context fits Petr)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000003-0000-4000-8000-000000000002', 'a0000003-0000-4000-8000-000000000003', 'ca000003-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'české banky jsou banda amatérů, change my mind',
  'Dušan Salay',
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 3: Glad - guessed Petr (construction/house topic)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000003-0000-4000-8000-000000000003', 'a0000003-0000-4000-8000-000000000003', 'ca000003-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Stavba plotu (?)',
  'Petr Weissar',
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 4: Sad - guessed Petr (long opinionated, emoji, politics)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000003-0000-4000-8000-000000000004', 'a0000003-0000-4000-8000-000000000003', 'ca000003-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  E'Internet pro lůzu je blbý nápad. Zpoplatnil bych ho. Jeden blázen nic nezmůže, ale když jich je relativně mnoho, tak přesvědčí další slabší jedince 😞 aneb co si myslíte o Rajchlovi?',
  'Petr Weissar',
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 5: Sad - guessed Dušan (AI/programming topic, practical)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000003-0000-4000-8000-000000000005', 'a0000003-0000-4000-8000-000000000003', 'ca000003-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'ChatGPT za nás pořád neprogramuje. Máme tedy ještě čas rejžovat? 😍',
  'Dušan Salay',
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 6: Sad - guessed Matěj (work/digitalization topic)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000003-0000-4000-8000-000000000006', 'a0000003-0000-4000-8000-000000000003', 'ca000003-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  E'Stormmíček 5 let poté: okénko do procesu digitalizace ve skupině M&M',
  'Matěj Daníček',
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 7: Sad - guessed Petr (long, opinionated about Apple, emoji, rhetorical question)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000003-0000-4000-8000-000000000007', 'a0000003-0000-4000-8000-000000000003', 'ca000003-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  E'Apple představil nový iOS, který nemá nic nového oproti konkurenci. Ovečky to ale beztak baští. Čím to je, že lidstvo není v této věci objektivní? 🤔\nNová klávesnice.. ale stále ani nemá swipe.. v podstatě jen opravili bugy. Achjo.',
  'Petr Weissar',
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 8: Glad - guessed Petr (meta about retro frequency, emoji)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000003-0000-4000-8000-000000000008', 'a0000003-0000-4000-8000-000000000003', 'ca000003-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Tentokrát máme retro po 3 týdnech. Neskutečné zlepšení. 🌻',
  'Vladimír Tichý',
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 9: Sad - guessed Petr (provocative, "change my mind" style)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000003-0000-4000-8000-000000000009', 'a0000003-0000-4000-8000-000000000003', 'ca000003-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  E'Ribejskaři jsou horší než pejskaři.\nChange my mind.',
  'Petr Weissar',
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 10: Sad - guessed Petr (construction topic, duplicate of card 3)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000003-0000-4000-8000-000000000010', 'a0000003-0000-4000-8000-000000000003', 'ca000003-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Stavba plotu (?)',
  'Petr Weissar',
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 11: Glad - guessed Matěj (business plans, practical)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000003-0000-4000-8000-000000000011', 'a0000003-0000-4000-8000-000000000003', 'ca000003-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Jak jsou na tom byznys plány? 🤔',
  'Matěj Daníček',
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 12: Sad - guessed Petr (finance, warning style)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000003-0000-4000-8000-000000000012', 'a0000003-0000-4000-8000-000000000003', 'ca000003-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'bacha na naklikání úvěrů ve formulářích, aneb jak si zničit bonitu 101',
  'Petr Weissar',
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 13: Glad - guessed Petr (long reflective, personal, emoji heavy, nostalgic)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000003-0000-4000-8000-000000000013', 'a0000003-0000-4000-8000-000000000003', 'ca000003-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Už deset let se živím programováním 🥲 To je doba kterou můj otec strávil skoro v každé práci a já už vystřídal za jednu jeho etapu asi 5 pozic a přijde mi to jako věčnost. Jsme stále mladí, přátelé 🥰',
  'Petr Weissar',
  true, false, 13)
ON CONFLICT (id) DO NOTHING;
