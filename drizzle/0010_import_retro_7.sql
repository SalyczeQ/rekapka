-- Import Retro #7
-- Date: 2024-02-10 | 17 cards | Anonymous authors with AI guesses
-- Source: Retro_7_2024-2-10.csv

-- Ensure Anonymous user exists
INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES ('00000000-0000-4000-8000-000000000000', 'Anonymous', 'anonymous@rekapka.local', '#9CA3AF', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000007-0000-4000-8000-000000000007',
  'Retro #7',
  'completed',
  '2024-02-10',
  NULL,
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2024-02-10 17:00:00+00',
  '2024-02-10 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000007-0001-4000-8000-000000000007', 'a0000007-0000-4000-8000-000000000007', 'Mad', '😡', '#EF4444', 0),
  ('ca000007-0002-4000-8000-000000000007', 'a0000007-0000-4000-8000-000000000007', 'Sad', '😢', '#3B82F6', 1),
  ('ca000007-0003-4000-8000-000000000007', 'a0000007-0000-4000-8000-000000000007', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000007-0000-4000-8000-000000000001', 'a0000007-0000-4000-8000-000000000007', 'ca000007-0003-4000-8000-000000000007',
  '00000000-0000-4000-8000-000000000000',
  'posun 8 hodin na zaápad nenií uúplně uideální na praáci do cČR . Jsou tools ktereé hledajií pruůnik pracovniích hodin',
  'Petr Weissar',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000007-0000-4000-8000-000000000002', 'a0000007-0000-4000-8000-000000000007', 'ca000007-0003-4000-8000-000000000007',
  '00000000-0000-4000-8000-000000000000',
  'Odmítnul jsem 9K/MD... chytrý kariérní krok nebo cesta do žebroty?',
  'Dušan Salay',
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000007-0000-4000-8000-000000000003', 'a0000007-0000-4000-8000-000000000007', 'ca000007-0003-4000-8000-000000000007',
  '00000000-0000-4000-8000-000000000000',
  '20 kg na mrtvole, teď mluvte',
  'Vladimír Tichý',
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000007-0000-4000-8000-000000000004', 'a0000007-0000-4000-8000-000000000007', 'ca000007-0003-4000-8000-000000000007',
  '00000000-0000-4000-8000-000000000000',
  'Jak šlo Kubovi první kardio za tento rok?',
  'Matěj Daníček',
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000007-0000-4000-8000-000000000005', 'a0000007-0000-4000-8000-000000000007', 'ca000007-0003-4000-8000-000000000007',
  '00000000-0000-4000-8000-000000000000',
  'Vím, že McDonalds snídaně je all the rage, ale KFC snídaně je teda v topísku',
  NULL,
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000007-0000-4000-8000-000000000006', 'a0000007-0000-4000-8000-000000000007', 'ca000007-0003-4000-8000-000000000007',
  '00000000-0000-4000-8000-000000000000',
  'Dami je zase stabilní. Harmonelo project happy.',
  NULL,
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000007-0000-4000-8000-000000000007', 'a0000007-0000-4000-8000-000000000007', 'ca000007-0003-4000-8000-000000000007',
  '00000000-0000-4000-8000-000000000000',
  'Jaktože Francouzi všichni všude pijí červený víno a v Česku se drtivě pije bílý? Podle mě je to stylem "k tomu se musíš propít" - všichni známí a rodiče to pijí a tak to pijí i potomci/pitomci.. Change my mind 🥲',
  'Dušan Salay',
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000007-0000-4000-8000-000000000008', 'a0000007-0000-4000-8000-000000000007', 'ca000007-0003-4000-8000-000000000007',
  '00000000-0000-4000-8000-000000000000',
  'Co by řekl Dušan na požadavky na API od Čerňase? Jak je na tom iOS verze Univerzity? 🍎',
  'Petr Weissar',
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000007-0000-4000-8000-000000000009', 'a0000007-0000-4000-8000-000000000007', 'ca000007-0003-4000-8000-000000000007',
  '00000000-0000-4000-8000-000000000000',
  E'Kellerovy narozeniny..\n\n\n\n\nStalo se něco zajímavého?\n\nByl Dančák divnej?\n\nChoval se Keller jak kok, když byl pod dohledem?\n\n\n\n\n🤔',
  'Matěj Daníček',
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000007-0000-4000-8000-000000000010', 'a0000007-0000-4000-8000-000000000007', 'ca000007-0003-4000-8000-000000000007',
  '00000000-0000-4000-8000-000000000000',
  E'První rok po dlouhé době bez školy, bez dvou prací apod...\n\nNebude mi to chybět - bude Uni a Svatebka stačit, aby mě to zabavilo? 🤔',
  NULL,
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000007-0000-4000-8000-000000000011', 'a0000007-0000-4000-8000-000000000007', 'ca000007-0003-4000-8000-000000000007',
  '00000000-0000-4000-8000-000000000000',
  E'Non USB-C proprietární magnetická nabíječka na Mac Pro je totální sračka..\n\nKdyž by všechno mělo C, mohu si s sebou na dovolenou vzít jeden USB-C kabel a jeden USB-C adaptér..\n\nK čemu mi je vymrdaný magnetický sráč, když si tím nabiju jen maca? 😠\n\n(Ano MacPro se nabíjí céčkem, ale proč tam vůbec vrátili tuhle otřesnou věc?)',
  'Dušan Salay',
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000007-0000-4000-8000-000000000012', 'a0000007-0000-4000-8000-000000000007', 'ca000007-0003-4000-8000-000000000007',
  '00000000-0000-4000-8000-000000000000',
  E'Kdy že se to Dušan vlastně vrací?\n\nNenaplánujem rovnou nějaké Lysé grilování? 🥩 🍻',
  NULL,
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000007-0000-4000-8000-000000000013', 'a0000007-0000-4000-8000-000000000007', 'ca000007-0003-4000-8000-000000000007',
  '00000000-0000-4000-8000-000000000000',
  E'Jak řešíte krize?\n\nPřijde vám, že už je váš život naplněn? Co dělat pro to, aby se člověk nezabil kvůli tomu, že ztrácí sílu a progress se logaritmicky utlumuje? 🤔\n\nA proč pomůže být #neverSatisfied ?',
  NULL,
  true, false, 13)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000007-0000-4000-8000-000000000014', 'a0000007-0000-4000-8000-000000000007', 'ca000007-0003-4000-8000-000000000007',
  '00000000-0000-4000-8000-000000000000',
  'Jaké marže mají autoservisy na náhradní díly?',
  NULL,
  true, false, 14)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000007-0000-4000-8000-000000000015', 'a0000007-0000-4000-8000-000000000007', 'ca000007-0003-4000-8000-000000000007',
  '00000000-0000-4000-8000-000000000000',
  'Máte někdo srnku kterou by Matěj mohl srazit Passatem',
  NULL,
  true, false, 15)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000007-0000-4000-8000-000000000016', 'a0000007-0000-4000-8000-000000000007', 'ca000007-0003-4000-8000-000000000007',
  '00000000-0000-4000-8000-000000000000',
  E'Lyžovačka ve Francii 🤔\n\nNabízí se pokračovat v hejtu na tuto zemi, ale co když se v Alpách s místními a sněhem tato země přeci jen zalíbí?\n\nJak to dopadlo?',
  'Matěj Daníček',
  true, false, 16)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000007-0000-4000-8000-000000000017', 'a0000007-0000-4000-8000-000000000007', 'ca000007-0003-4000-8000-000000000007',
  '00000000-0000-4000-8000-000000000000',
  'Jak se Matějovi líbí nové auto',
  NULL,
  true, false, 17)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

