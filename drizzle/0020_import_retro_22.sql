-- Import Retro #22
-- Date: 2025-04-30 | 33 cards | Anonymous authors with AI guesses
-- Source: Retro_22_2025-4-30.csv

-- Ensure Anonymous user exists
INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES ('00000000-0000-4000-8000-000000000000', 'Anonymous', 'anonymous@rekapka.local', '#9CA3AF', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000022-0000-4000-8000-000000000022',
  'Retro #22',
  'completed',
  '2025-04-30',
  NULL,
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2025-04-30 17:00:00+00',
  '2025-04-30 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000022-0001-4000-8000-000000000022', 'a0000022-0000-4000-8000-000000000022', 'Mad', '😡', '#EF4444', 0),
  ('ca000022-0002-4000-8000-000000000022', 'a0000022-0000-4000-8000-000000000022', 'Sad', '😢', '#3B82F6', 1),
  ('ca000022-0003-4000-8000-000000000022', 'a0000022-0000-4000-8000-000000000022', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000001', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'jak jsem za den 2 byty prodal',
  'Dušan Salay',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000002', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'Jak jsme na tom s bojkotem US značek? 🙏  Máte nějaký guilty pleasures, které zbývají?',
  'Petr Weissar',
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000003', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'Psáno v afektu: Proč mají někteří z nás pořád potřebu veřejně mluvit o investicích do nemovitostí, ale když jim někdo řekne že je Praha špatná a cesta je jinde, tak jen kopají kolem sebe 🤔',
  'Petr Weissar',
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000004', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'Domlouvání retra je čím dál tím složitější. Z 90% to blokuje Praha. Tedy měli bychom určit pražského správce, který to za tým Pha vykomunikuje a rovnou nabídne termíny pro ostatní.',
  'Petr Weissar',
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000005', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  E'Hypotéka u AirBank. Naslibují hory doly a nakonec je z toho skoro stejná částka, ale chtějí větší pojištění a doplatit část jistiny atd. atd. Takže se to vůbec nevyplatí 😞 Tedy hypo u Erste je v podstatě srovnatelné.\n\nEDIT: Psáno v afektu a věci se změnily 🤗',
  'Dušan Salay',
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000006', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'Kolik válek vyvolaly ženy? 🤔 Myslím, že je na čase se vzdát vedení a předat mužskou štafetu ženám. Change my mind.',
  NULL,
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000007', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'Siesta je dobrá věc.',
  NULL,
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000008', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'Nutno říct, že když v Inženýrech není ani trochu toxicity, tak je to nuda. Pojďme najít zlatý střed objektivního trashtalku 🙏',
  'Petr Weissar',
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000009', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'Co se to stalo od posledního retra ve světové politice? Jsem zděšen. 😱',
  'Dušan Salay',
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000010', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  '2,5 hodiny parkování v Karlíně za 450 🥹 Je to dobře nebo špatně? Jak se to líbí Dušanovi?',
  'Vladimír Tichý',
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000011', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  E'Nejlepší den na Kanárech byl ten, kde se dělo víc než jen jídlo a padel. Nechodit v tak hezký přírodě do hor je fakt škoda 😞 \n\nPříště až pojedem, tak jsou hory must have, jinak nemá smysl nikam jezdit 😂',
  'Dušan Salay',
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000012', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'Nákup nemovitostí na Floridě. Good choise?',
  'Matěj Daníček',
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000013', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'přecenil jsem svoji gym formu, nechcete někdo trika ve velikosti M z decathlonu? jednou vyprané',
  NULL,
  true, false, 13)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000014', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'Bylo by morálně správné být vegetariány?',
  'Vladimír Tichý',
  true, false, 14)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000015', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'Realitní shaker - Iva Birtova',
  'Petr Weissar',
  true, false, 15)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000016', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'Nákup nemovitostí v Mladé Boleslavi',
  'Dušan Salay',
  true, false, 16)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000017', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'Třídní sraz v Dolním Bousově',
  NULL,
  true, false, 17)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000018', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'Co nějaké nové zážitky? Nové věci co vyzkoušet? Nějaké kurzy? Co třeba první kurz první pomoci?',
  'Matěj Daníček',
  true, false, 18)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000019', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'Dušan vybíral zážitek - co nakonec vybral? A doporučil by?',
  'Dušan Salay',
  true, false, 19)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000020', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'Vířivka na zahradě - říkal jsem si, že to je píčovina, ale nakonec docela dobrá věc',
  NULL,
  true, false, 20)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000021', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'Páteřní cyklostezka zavřena, objízdná trasa neexistuje, Česko patří na východ',
  'Vladimír Tichý',
  true, false, 21)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000022', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'Jak to dopadlo s Garminem, kterému přišla zpráva ohledně private SDK ze soukromého Gmailu? 😂',
  'Jakub Minarik',
  true, false, 22)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000023', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'Měl bys přijít o papíry, když jezdíš 300 po silnicích? Chtěli byste někoho takového potkat? V těhlech rychlostech je řidič nepředvídatelný pro ostatní řidiče a nehoda se může stát jednoduše. Lepší zavřít dřív než někoho zabije?',
  'Petr Weissar',
  true, false, 23)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000024', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'Jak se Petr vyrovnava s poklesem testaku?',
  NULL,
  true, false, 24)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000025', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'Druhej fulltajm. Jak na to?',
  NULL,
  true, false, 25)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000026', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  E'PSA turnaj o $220k. Vstup zdarma. V publiku stejne skoro nikdo. \n\n\n\nExistuje mene divacky zajimavy sport nez squash?',
  NULL,
  true, false, 26)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000027', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'S BeReal to opět dopadlo špatně i na druhý pokus. Je chyba v Praze nebo v té aplikaci?',
  'Matěj Daníček',
  true, false, 27)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000028', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'zázračný lék? 💊',
  NULL,
  true, false, 28)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000029', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'pamatujete na Michala Jinocha?',
  NULL,
  true, false, 29)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000030', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'Hygienik ke stavbě a letišti. Zakázáno stavět, nutno filtrovat až 60 dB, nebo nutné povinné odvětrávání? Začíná mě stát srát',
  'Petr Weissar',
  true, false, 30)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000031', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'Konečně jsem se odhodlal a koupil balík Freeway koly zero. A je to bez rozdílu 😍',
  'Matěj Daníček',
  true, false, 31)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000032', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  'Rychlost do porodnice průměrné 92kmh',
  'Vladimír Tichý',
  true, false, 32)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000022-0000-4000-8000-000000000033', 'a0000022-0000-4000-8000-000000000022', 'ca000022-0003-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000000',
  E'Až se někdy zase dostaneme k tomu, že ženský mají stejný práva a nekouká se na ně jako na štětky...\n\nReklama mBank, kde týpek u pivka ukazuje na holku prsten, protože holkám manželé imponují, ale ono to nezafunuje.. Naštěstí je to platební prsten, čímž typka hned přijde a jde s ním na rande 👏 \n\nHolky jsou totiž jen zlatokopky ❤️  a chlapi mají prostě vždycky platit..\n\nZa mě bych rád, aby mBank krachla, děkuji',
  'Petr Weissar',
  true, false, 33)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

