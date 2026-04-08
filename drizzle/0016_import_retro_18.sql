-- Import Retro #18
-- Date: 2024-11-26 | 20 cards | Anonymous authors with AI guesses
-- Source: Retro_18_2024-11-26.csv

-- Ensure Anonymous user exists
INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES ('00000000-0000-4000-8000-000000000000', 'Anonymous', 'anonymous@rekapka.local', '#9CA3AF', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000018-0000-4000-8000-000000000018',
  'Retro #18',
  'completed',
  '2024-11-26',
  NULL,
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2024-11-26 17:00:00+00',
  '2024-11-26 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000018-0001-4000-8000-000000000018', 'a0000018-0000-4000-8000-000000000018', 'Mad', '😡', '#EF4444', 0),
  ('ca000018-0002-4000-8000-000000000018', 'a0000018-0000-4000-8000-000000000018', 'Sad', '😢', '#3B82F6', 1),
  ('ca000018-0003-4000-8000-000000000018', 'a0000018-0000-4000-8000-000000000018', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000018-0000-4000-8000-000000000001', 'a0000018-0000-4000-8000-000000000018', 'ca000018-0003-4000-8000-000000000018',
  '00000000-0000-4000-8000-000000000000',
  E'Takže jak to je s těmi společnými výlety? Jet v listopadu s lidma z práce na kanáry a pak znovu na silvestra je ok, ale jet tam znovu za 2 měsíce je problém? 🤔 Takže kdo jsou ti praví kamarádi?\n\n\n\n\nV návaznosti: S Dušanem jsme se bavili o tom, že by se to Thajsko dalo, takže bychom se k tomu plánu mohli vrátit. Ale to zase není pro Matěj a Vláďa, že?\n\n\n\n\nTakže dokážeme najít společnou dovolenou na 3 týdny jak bylo původně v plánu? 🤔',
  'Dušan Salay',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000018-0000-4000-8000-000000000002', 'a0000018-0000-4000-8000-000000000018', 'ca000018-0003-4000-8000-000000000018',
  '00000000-0000-4000-8000-000000000000',
  'Svět je pro mladé plné dokonalostí na sítích - kariéra, vzhled, sex.. Kdo by pak chtěl žít nudný život plný nedokonalostí? Co si o tom myslíte?',
  'Petr Weissar',
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000018-0000-4000-8000-000000000003', 'a0000018-0000-4000-8000-000000000018', 'ca000018-0003-4000-8000-000000000018',
  '00000000-0000-4000-8000-000000000000',
  'AirBank má omezený budget na příští rok co se týče peněz pro kontraktory. Je konec žní? 🌽 ("Museli jsme to tam trochu přeskládat")',
  'Jakub Minarik',
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000018-0000-4000-8000-000000000004', 'a0000018-0000-4000-8000-000000000018', 'ca000018-0003-4000-8000-000000000018',
  '00000000-0000-4000-8000-000000000000',
  E'Fiala spustil s ODS a celkově SPOLU web a rozhovory a kampaně na to, že jsou nejlepší vláda co tu byla od 89.\n\nMyslím si, že je to výherní strategie - Babiško a ostatní dělají to samé a lidi tomu věří. Dokáže SPOLU přitáhnout nové voliče od Babiška? 🙏\n\nMoc bych si to přál jen kvůli tomu, aby se ukázalo, že lidi jsou tupí a jen hloupě naslouchají.',
  'Petr Weissar',
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000018-0000-4000-8000-000000000005', 'a0000018-0000-4000-8000-000000000018', 'ca000018-0003-4000-8000-000000000018',
  '00000000-0000-4000-8000-000000000000',
  'Co Kuba řekl v 1. kole pohovoru v Airbank? Proč nejprve všichni říkali, že je dobrej a do 2. kola půjde a pak najednou že ne?',
  'Dušan Salay',
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000018-0000-4000-8000-000000000006', 'a0000018-0000-4000-8000-000000000018', 'ca000018-0003-4000-8000-000000000018',
  '00000000-0000-4000-8000-000000000000',
  'Palec hore pro smartwings: držák na telefon.',
  NULL,
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000018-0000-4000-8000-000000000007', 'a0000018-0000-4000-8000-000000000018', 'ca000018-0003-4000-8000-000000000018',
  '00000000-0000-4000-8000-000000000000',
  'Druhý den po obstřiku bederní páteře. Až když člověk přestane cítit bolest, uvědomí si, jak moc špatný to je. Dá se na tom udělat závislost?',
  'Matěj Daníček',
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000018-0000-4000-8000-000000000008', 'a0000018-0000-4000-8000-000000000018', 'ca000018-0003-4000-8000-000000000018',
  '00000000-0000-4000-8000-000000000000',
  E'Tak jak jsme na tom s tím zvaním lidí do posilky? Neměli by si někteří zamést před vlastním Prahem? \n\nPsáno 13. 11. ve vlaku z Prahy do Pce, když mi krysy poslali společnou fotku z gymu. 4 hodiny potom, co jsem psal jak je listopad depresivní a že jsem nešťastnej. Děkuju za endorfíny, které jsem cvičením s kamarády dostal - akorát že vůbec.',
  NULL,
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000018-0000-4000-8000-000000000009', 'a0000018-0000-4000-8000-000000000018', 'ca000018-0003-4000-8000-000000000018',
  '00000000-0000-4000-8000-000000000000',
  'Listopad je nejhorší měsíc. Je zima a vlhko, hnusný barvy, smrad tlejícího listí, tma, bez sněhu.. Myslím že už vloni jsem to do retra dával a stále to platí. Pls make listopad end. ✅',
  'Matěj Daníček',
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000018-0000-4000-8000-000000000010', 'a0000018-0000-4000-8000-000000000018', 'ca000018-0003-4000-8000-000000000018',
  '00000000-0000-4000-8000-000000000000',
  E'Manželství stejnopohlavních párů. Co je komu co do toho, kdo koho kam mrdá a kdo s kým kde jak žije. Proč to holanďani pochopili a uznali už v roce 2001 a my to stále neuznáváme? 👦 👦\n\nCo je ten opravdový problém za tím vším? Ztráta mužství v tom, že uznáme, že všichni nechtěj jen mrdat kundy? 🤔\n\nPokud nejsi latentní gej nebo člověk pod 80 IQ, nemá ti na tom co vadit - a pokud ano, je to dle mého názoru jen o výchově prudetními křesťanskými kurvičkami. Pokud ano, oni nebyli o nic lepší než dnešní arabáči. Change my mind.',
  NULL,
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000018-0000-4000-8000-000000000011', 'a0000018-0000-4000-8000-000000000018', 'ca000018-0003-4000-8000-000000000018',
  '00000000-0000-4000-8000-000000000000',
  'Jaký je to život, když musíš ve 30 každý rok dva na FB repostnout fotky ze střední s tím, jak to bylo super skvělý. Když pomynu fakt, že to skvělý nebylo, tak vám přijde ok at nad tím pořád rozplývat? A ano, příspěvek publikovala nejtlustší holka ze třídy žijící v Broumově. 🧈',
  'Dušan Salay',
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000018-0000-4000-8000-000000000012', 'a0000018-0000-4000-8000-000000000018', 'ca000018-0003-4000-8000-000000000018',
  '00000000-0000-4000-8000-000000000000',
  'Příjmy (vs. výdaje) 2024, jak jste na tom?',
  'Jakub Minarik',
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000018-0000-4000-8000-000000000013', 'a0000018-0000-4000-8000-000000000018', 'ca000018-0003-4000-8000-000000000018',
  '00000000-0000-4000-8000-000000000000',
  E'Ve všech životních fázích jsem měl dostatek peněz. Ať už jako malý capart z kapesného, nebo jako brigádník, či čerstvý pracant v IT.\n\n\n\n\nMoje výdaje byly vždy úměrné mým příjmům a mohl jsem si pořídit všechno, co jsem chtěl.\n\n\n\n\nNyní jsem starý kmet a vydělávám nejvíc, co jsem kdy vydělával, a poprvé se cítím limitován financemi do té míry, že nevěřím, že mám vůbec šanci na to to změnit.',
  NULL,
  true, false, 13)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000018-0000-4000-8000-000000000014', 'a0000018-0000-4000-8000-000000000018', 'ca000018-0003-4000-8000-000000000018',
  '00000000-0000-4000-8000-000000000000',
  'aJak tohle dopadne?',
  NULL,
  true, false, 14)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000018-0000-4000-8000-000000000015', 'a0000018-0000-4000-8000-000000000018', 'ca000018-0003-4000-8000-000000000018',
  '00000000-0000-4000-8000-000000000000',
  'Vláďa mi zařídil Multisport. Už zase můžu žít naplno ♥️',
  'Petr Weissar',
  true, false, 15)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000018-0000-4000-8000-000000000016', 'a0000018-0000-4000-8000-000000000018', 'ca000018-0003-4000-8000-000000000018',
  '00000000-0000-4000-8000-000000000000',
  'Víte jak vznikl nazev pro blue tooth? (Panovník Finska co vše sjednotily)',
  NULL,
  true, false, 16)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000018-0000-4000-8000-000000000017', 'a0000018-0000-4000-8000-000000000018', 'ca000018-0003-4000-8000-000000000018',
  '00000000-0000-4000-8000-000000000000',
  'Jsem fakt rád, že jsme to dali až do Olmiku',
  'Jakub Minarik',
  true, false, 17)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000018-0000-4000-8000-000000000018', 'a0000018-0000-4000-8000-000000000018', 'ca000018-0003-4000-8000-000000000018',
  '00000000-0000-4000-8000-000000000000',
  'Nastoupí Kuba do AirBank? 🤔',
  'Dušan Salay',
  true, false, 18)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000018-0000-4000-8000-000000000019', 'a0000018-0000-4000-8000-000000000018', 'ca000018-0003-4000-8000-000000000018',
  '00000000-0000-4000-8000-000000000000',
  'Fedora 41 je nejlepší systém there is, change my mind',
  NULL,
  true, false, 19)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000018-0000-4000-8000-000000000020', 'a0000018-0000-4000-8000-000000000018', 'ca000018-0003-4000-8000-000000000018',
  '00000000-0000-4000-8000-000000000000',
  'gymísek je fakt dobrá věc',
  NULL,
  true, false, 20)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

