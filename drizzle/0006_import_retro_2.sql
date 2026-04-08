-- Import Retro #2 - Navazujeme na předchozí Lysé roastěníčko 😏
-- Date: 2023-08-30 | 44 cards | Anonymous authors with AI guesses
-- Source: Retro_2_Navazujeme na předchozí Lysé roastěníčko 😏_2023-8-30.csv

-- Ensure Anonymous user exists
INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES ('00000000-0000-4000-8000-000000000000', 'Anonymous', 'anonymous@rekapka.local', '#9CA3AF', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000002-0000-4000-8000-000000000002',
  'Retro #2',
  'completed',
  '2023-08-30',
  NULL,
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2023-08-30 17:00:00+00',
  '2023-08-30 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000002-0001-4000-8000-000000000002', 'a0000002-0000-4000-8000-000000000002', 'Mad', '😡', '#EF4444', 0),
  ('ca000002-0002-4000-8000-000000000002', 'a0000002-0000-4000-8000-000000000002', 'Sad', '😢', '#3B82F6', 1),
  ('ca000002-0003-4000-8000-000000000002', 'a0000002-0000-4000-8000-000000000002', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000001', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Proč FIMka láká lidi na školu s fotkou lidí v cyklodresech? Pak se diví že tam nikdo nechce :/ https://www.facebook.com/100058108403529/posts/768813895065550/?sfnsn=mo',
  'Petr Weissar',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000002', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0001-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Snižování důvěryhodnosti dopravního značení. Kolik značek je moc značek? Je možné guerillové řešení tohoto problému?',
  'Vladimír Tichý',
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000003', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Jel by někdo z vás na dovolenou s manželi (muž a žena) dělat třetí kolo u vozu na pár týdnů do Itálie? 🤔 Myslím, že nikdo z nás.. ale přeci se někdo takový našel 🐴',
  'Matěj Daníček',
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000004', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0001-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  E'Vzpomeňme si na fakt, že byl někdo z nás otevíračem dárků jako kůň nařčen z toho, že si řekl o 200Kč korun na benzín víc na teambuildingu ze zneužívání společnosti 🤔\n\n\n\n\nHehe.. fair enough? (Nemyslím si)\n\n\n\n\nAnyways - je podle vás ok, že tento koňomrd přitáhne Koprdu v 10 večer do práce, aby mu nafotil novou profilovou fotku do nějaké DJ soutěže a nechá to celé Koprdu včetně úprav vytrackovat na Dami práce kancl? 😬\n\n\n\n\nJe to pokrytecké? Alibistické? Oxymorónské? Můžeme prosím tu tlustou svini potopit jak jen hluboko to půjde? 🙏',
  NULL,
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000005', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0001-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Transgender mrtki ve sportech',
  'Dušan Salay',
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000006', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0003-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Vyjednávací schopnosti a velký biceps? Jsme zatím 50 na 50, kdy se hodí mít velké bicepsy. Co k tomu může říct Kuba a jak si Dušan pumpnul hodinovku? 🤔 💪',
  NULL,
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000007', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Jsem rasista, když nenávidím úplně všechny nehledě na barvu a orientaci? 🧠',
  NULL,
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000008', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0003-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Vegani hubi sami sebe na horach',
  NULL,
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000009', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0003-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Dami Gaze',
  'Matěj Daníček',
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000010', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0003-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  E'Pojďme si společně prokliknout tento odkaz ♥️\n\n\n\n\nhttps://www.timeanddate.com/countdown/taxday?iso=20230801T08&p0=204&msg=Mat%C4%9Bj+v+Pardubic%C3%ADch+%F0%9F%8E%89&font=sanserif&csz=1',
  NULL,
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000011', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Pokud potkám tlustého nebo jinak nechutného jedince: je to s vysokou pravděpodobností volič Babiše? 🤗',
  NULL,
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000012', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0001-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Chybí mi tu sloupeček Gay.. tam by se vešla spousta informací. Je lepší RFP nebo kolo? 🏳️‍🌈',
  'Vladimír Tichý',
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000013', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Jsou mezi námi tací, kteří za primární dopravní prostředek označili onewheel. Následně si však koupili jízdní kolo.',
  NULL,
  true, false, 13)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000014', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0001-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  E'Proč kurva když na Macu vyberu jednoho z nabídky smajlíků se ihned nabídka zavře a nemůžu přidávat další? ❓\n\nJak vůbec někdo může hájit MacOS co se týče UX/UI? Hnusná zastaralá gradientí grafika, špatně rozmístěné ikonky, naprosto nulový window manager, zbytečné otravné notifikace na které se nedá kliknout na pidi křížek a mnohé další, co tento systém svým uživatelům dopřává. Proč to prostě neudělají lépe? To se tak moc straní použití funkčních věcí z Linux a Windows, aby je někdo nepomluvil, že kopírují? ⛏️',
  NULL,
  true, false, 14)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000015', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0003-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  E'Volvo EX30 - nejmenší, nejrychlejší, nejekologičtější, nejrozumnější elektrické SUV s dojezdem téměř 500km.\n\nJe to allCarYouNeed jako byla označena nová Fabia? 🚙',
  NULL,
  true, false, 15)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000016', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0001-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  E'Proč se smějeme českým dezolé hovnům a pak přijedou civilizováni západští fanoušci WestHamu a zasypou Staromák odpadkama. Není přeci jen Rusko lepší cestou? ☠️\n\n(Debata s 10 vteřinama pro každého člena na vyjádření svého názoru)',
  'Jakub Minarik',
  true, false, 16)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000017', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0003-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  E'Půjde Kuba i Dušan do Airbank? 💵\n\nA zařídí Kuba Petrovi ČSOB "full-time" za 2 hodiny týdně na dobré živobytíčko?',
  'Petr Weissar',
  true, false, 17)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000018', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0003-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Dovolím si ještě jeden bodík k Matějově nové práci, abychom si ukázali groupování kartiček v parabolu 🧠 - Jak dopadle MD rate pro Matěje?',
  'Matěj Daníček',
  true, false, 18)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000019', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0003-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Z hlaváku do Dejvic rychleji na one wheelu 👩‍🦽 než metrem? Za kolik jízd se taková investice vrátí?',
  NULL,
  true, false, 19)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000020', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Na meetingu, kde jsem měl otevřený svůj neoblíbený Mac Air jsem byl označen za příznivce applu 🤔 a přiznám se, že mi to trochu zavadilo. Jak používat korporátní device aniž by se mi lidi smáli?',
  NULL,
  true, false, 20)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000021', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0001-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  E'Pět týdnů v pražském Metru na nejfrekventovanější přestupní stanici Muzeum: \n\nStále nejsou fixlé 2 eskalátory. Byznys plán? 🥺\n\nJe to opravdu tak těžké opravit fakin eskalátor? Když je to dopíči takový pain, proč se nevymyslí něco lepšího?',
  NULL,
  true, false, 21)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000022', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Chtěl bych něco jako sluchátka s active smrad cancellation.. v pražském metru po slabém dešti by se to teda hodilo 🥺',
  NULL,
  true, false, 22)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000023', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0003-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Co Matěj a nová práce? 😍',
  NULL,
  true, false, 23)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000024', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0001-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Kdy začal VW vyrábět auta co zreznou za 13 let... aneb vyplatí se nechat si vyvoskovat karoserii hned po nákupu vozu?',
  NULL,
  true, false, 24)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000025', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0003-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Pivovarské domy mají jen ve středu a od 6. We are lucky bastards',
  NULL,
  true, false, 25)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000026', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Jaký je život jako ženich?',
  NULL,
  true, false, 26)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000027', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0003-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'kdo si s náma zítra jde do MS pro dort?',
  NULL,
  true, false, 27)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000028', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0001-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Je potřeba nebezpečných mostů na D11?',
  'Vladimír Tichý',
  true, false, 28)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000029', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'může být dobrý dort s aspartamem?',
  'Vladimír Tichý',
  true, false, 29)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000030', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'nic si nekupuju a přesto utratím 100k měsíčně (byl ten oblek potřeba?)',
  'Dušan Salay',
  true, false, 30)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000031', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'šikanování minorit',
  'Petr Weissar',
  true, false, 31)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000032', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'patříme na východ?',
  'Petr Weissar',
  true, false, 32)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000033', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0001-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Javascript je na hovno, ale typescript to všechno řeší... they said',
  'Vladimír Tichý',
  true, false, 33)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000034', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0003-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Osm měsíců práce v bance. Je to top job nebo je to ještě lepší? 🤔',
  'Petr Weissar',
  true, false, 34)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000035', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0003-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'kdyby pajule a kotula měli dítě, bude to Kojule, nebo Patula?',
  'Vladimír Tichý',
  true, false, 35)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000036', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0001-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'nebaví mě cvičení ani život (mám málo tesťáku?)',
  'Petr Weissar',
  true, false, 36)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000037', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0001-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'pochody gejů',
  'Petr Weissar',
  true, false, 37)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000038', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Retrospektivy by se měly dělat každé max 3 týdny a ne 3 měsíce, jako to předvádíme nyní 🤔',
  'Petr Weissar',
  true, false, 38)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000039', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'cikáni vs Ukrajinci',
  NULL,
  true, false, 39)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000040', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0003-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Máme konec července a na Vencu dopadají boží mlýny? Lidi odchází, všichni vidí to samé co já.. (Škoda že až teď) 🥰',
  NULL,
  true, false, 40)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000041', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0003-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Lidi v MS dostávají dorty při odchodu 🥰 a Míra si nedokáže představit, že by to někdy bylo jinak. Co si z toho odnést? 🥺 Měl by majitel společnosti na sítích otevřeně lhát?',
  NULL,
  true, false, 41)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000042', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Pustit patula a kojuli',
  NULL,
  true, false, 42)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000043', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Ne',
  NULL,
  true, false, 43)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000002-0000-4000-8000-000000000044', 'a0000002-0000-4000-8000-000000000002', 'ca000002-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Probrat později',
  NULL,
  true, false, 44)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

