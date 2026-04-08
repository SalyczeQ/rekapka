-- Import Retro #10
-- Date: May 11, 2024 | 13 cards | 3 Participants: Jakub, Petr, Vladimír
-- Anonymous authors with AI guesses

INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES ('00000000-0000-4000-8000-000000000000', 'Anonymous', 'anonymous@rekapka.local', '#9CA3AF', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000010-0000-4000-8000-000000000010',
  'Retro #10',
  'completed',
  '2024-05-11',
  NULL,
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2024-05-11 17:00:00+00',
  '2024-05-11 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000010-0001-4000-8000-000000000001', 'a0000010-0000-4000-8000-000000000010', 'Mad', '😡', '#EF4444', 0),
  ('ca000010-0002-4000-8000-000000000002', 'a0000010-0000-4000-8000-000000000010', 'Sad', '😢', '#3B82F6', 1),
  ('ca000010-0003-4000-8000-000000000003', 'a0000010-0000-4000-8000-000000000010', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 1: Glad - Petr (long rant, emoji heavy, vulgar, personal story about pub)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000010-0000-4000-8000-000000000001', 'a0000010-0000-4000-8000-000000000010', 'ca000010-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  E'Na čarodky jsem si zalezl do polabinský Tankovny na Viléma. Hospoda byla prázdná až na jeden stůl, kde byli lidé s IQ 90 - 95. Kecy o chrápání, prcání, proč mi nekoupíš auto? a dalších hovnech.. 😬 Třeba o tom jak vsázejí na Spartu a že občas vyhrajou a pak to nechali na veterině.. a šťastných 10 všichni jedou.. a tak no.. doprdele.. Chlapi šovinistický piče a ženy je milují a ještě si dělají prdel z toho jak jsou k ničemu... Potřebujeme řešení.. tohle je fakt trash 😞',
  'Petr Weissar',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 2: Sad - Petr (business/accounting frustration, vulgar, references Unisport)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000010-0000-4000-8000-000000000002', 'a0000010-0000-4000-8000-000000000010', 'ca000010-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  E'Red Flag podruhé 🟥\nPan C(m)unt účetní Unisport psal - že to bude stát finálně 5,8k.. načež přišla faktura na 7,5k 😄\nTak se ptám wtf - a prý to je standardní přirážka, co se účtuje lidem každý měsíc a my máme výjimku, že je jednorázově.\nJsou to mega kurvičky. A pak si s takovejma lidma dělej byznys dopiči.',
  'Petr Weissar',
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 3: Sad - Petr (about Kuba, work topic, references banks)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000010-0000-4000-8000-000000000003', 'a0000010-0000-4000-8000-000000000010', 'ca000010-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  E'Kuba musel začít chodit fyzicky do kanclu.\nNení čas na změnu práce? Moneta? Raiffka? PPF banka? 🤔',
  'Petr Weissar',
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 4: Sad - Petr (AppParade, opinionated, emoji, hashtag)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000010-0000-4000-8000-000000000004', 'a0000010-0000-4000-8000-000000000010', 'ca000010-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  E'Vráťa Zima: "No chlapi, v Česku klesáme v podporách startupů, proto je tady app parade."\nJoo, ale vyhraje státní eDoklady a IKEM aplikace pro existující nemocnici a její klienty. Jo, byly to dobrý appky ale proč ty kecy o startupech. 😠\n#brekotPoAppParade',
  'Petr Weissar',
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 5: Sad - Petr (AppParade followup)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000010-0000-4000-8000-000000000005', 'a0000010-0000-4000-8000-000000000010', 'ca000010-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  E'Shrnutí AppParade - jak to dopadlo? Bude z toho něco? 😔\n#brekotPoAppParade',
  'Petr Weissar',
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 6: Glad - Petr (electric cars, references Dušan, emoji)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000010-0000-4000-8000-000000000006', 'a0000010-0000-4000-8000-000000000010', 'ca000010-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  E'Elektro auto - jonebone.. Dušan už připustil hybrida, takže jsme na dobré cestě a fosyl může zmizet.\nJonebone? Je moc brzy? 🦕',
  'Petr Weissar',
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 7: Sad - Petr (cars/taxes, opinionated, provocative)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000010-0000-4000-8000-000000000007', 'a0000010-0000-4000-8000-000000000010', 'ca000010-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Doplněk k minulé konverzaci k autům.. V HK na Majálesu byla kolona na 3 hodiny, protože všichni přijeli na Majáles autem. Pořád vám přijde, že by se auta neměly víc danit aby na ně nedosáhlo tolik lidí? Je tento názor z elitářství?',
  'Petr Weissar',
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 8: Glad - uncertain (short, generic)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000010-0000-4000-8000-000000000008', 'a0000010-0000-4000-8000-000000000010', 'ca000010-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Flex nad ostatními, peníze, dovolené, auta, posilka?',
  NULL,
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 9: Glad - Petr (about Vláďa, references previous retro)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000010-0000-4000-8000-000000000009', 'a0000010-0000-4000-8000-000000000010', 'ca000010-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Koupil si Vláďa standing desk? 🧍‍♂️',
  'Petr Weissar',
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 10: Glad - Jakub (web/tech, practical)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000010-0000-4000-8000-000000000010', 'a0000010-0000-4000-8000-000000000010', 'ca000010-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Svatebka musí být primárně na webu.',
  'Jakub Minarik',
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 11: Sad - Petr (AppParade, advice, emoji, hashtag)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000010-0000-4000-8000-000000000011', 'a0000010-0000-4000-8000-000000000010', 'ca000010-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  E'Nedělejte chlapi švýcarský nože, co dělají všechno. Udělejte appku jen na to jedno a pořádně. (Pětivoký appparade) 😞\n#brekotPoAppParade',
  'Petr Weissar',
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 12: Glad - Petr (personal, provocative humor)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000010-0000-4000-8000-000000000012', 'a0000010-0000-4000-8000-000000000010', 'ca000010-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Byl jsem na atletických závodech starších žákyň a dorostenek. Chlapi, to je hrozný.. ty holky všechny vypadají na 18 a ještě jsou to atletky.. peklo..',
  'Petr Weissar',
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 13: Glad - uncertain (incomplete card from export)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000010-0000-4000-8000-000000000013', 'a0000010-0000-4000-8000-000000000010', 'ca000010-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Našel jste někdo nějaký',
  NULL,
  true, false, 13)
ON CONFLICT (id) DO NOTHING;
