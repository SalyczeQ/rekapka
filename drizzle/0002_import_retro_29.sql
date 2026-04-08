-- Import Retro #29 - "Ti co rádi grilují nejrůznější témata"
-- Date: Mar 4, 2026 | 24 cards | 5 Participants
-- Source: Legacy retro system export
-- Uses email-based user lookups so it works regardless of user UUIDs

-- Ensure users exist (idempotent)
INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES
  (gen_random_uuid(), 'Petr Weissar', 'weissar.petr@gmail.com', '#3B82F6', 'cs', 'default'),
  (gen_random_uuid(), 'Vladimír Tichý', 'vlado903@gmail.com', '#3B82F6', 'cs', 'default'),
  (gen_random_uuid(), 'Dušan Salay', 'salay14@gmail.com', '#3B82F6', 'cs', 'default'),
  (gen_random_uuid(), 'Jakub Minarik', 'jakub.minarik.11@gmail.com', '#3B82F6', 'cs', 'default'),
  (gen_random_uuid(), 'Matěj Daníček', 'danicek.matej@gmail.com', '#3B82F6', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

-- Create the retro
INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000029-0000-4000-8000-000000000029',
  'Retro #29',
  'completed',
  '2026-03-04',
  'restaurace U Holiše',
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2026-03-04 17:00:00+00',
  '2026-03-04 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Create categories
INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000029-0001-4000-8000-000000000001', 'a0000029-0000-4000-8000-000000000029', 'Mad', '😡', '#EF4444', 0),
  ('ca000029-0002-4000-8000-000000000002', 'a0000029-0000-4000-8000-000000000029', 'Sad', '😢', '#3B82F6', 1),
  ('ca000029-0003-4000-8000-000000000003', 'a0000029-0000-4000-8000-000000000029', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Cards: "What didn't go well 😞" → Sad, "What went well 😄" → Glad

INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000029-0000-4000-8000-000000000001', 'a0000029-0000-4000-8000-000000000029', 'ca000029-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  E'Cítím chlapi, že už s vámi nemůžu nesouhlasit, protože si jdete psát do jiné konverzace mimo inženýry 😂\n\n8.12. po střetu o šovinismu - hodinu po všichni střídavě online (často v jeden moment, bez reakce na mou zprávu) 😂\n\nAsi vám radši na oko odsouhlasím, že je chat control špatný, než rozdmýchávat diskuze, kde se akorát naštvete a nemluvíte se mnou pak',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000029-0000-4000-8000-000000000002', 'a0000029-0000-4000-8000-000000000029', 'ca000029-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  E'Petr: Zvu vás na vánoční pivečko\nVšichni ostatní:\n\nNevím chlapi no, takovýhle věci trošku mrzej, kór když jsem nebyl přizván ani na silvestra 😂\n\nKlidně to řekněte jestli už se chcete stýkat jen s těmi bez domů a dětí. Aspoň budu vědět na čem jsme, díky\n\nPLOT TWIST: Dorazili ❤️',
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000029-0000-4000-8000-000000000003', 'a0000029-0000-4000-8000-000000000029', 'ca000029-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  E'Je pátek 19.12. 8 hodin ráno. Zadávám 6 malých PRs s bugama. Release appky je v prvních lednových dnech a přes svátky moc lidí nepracuje. V 9 ráno ještě 3 PRs zbývají, tak zaurguju kolegu. Po osmi hodinách v 6 večer stále tři zbývají. 😂\n\nZaurguju kolegu, který řekne že moc tlačím na pilu.\n\nJe to moc chtít od lidí review na PRka? Jak dlouho by standardně čekáte na reviews? 🥰',
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000029-0000-4000-8000-000000000004', 'a0000029-0000-4000-8000-000000000029', 'ca000029-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  'Před novým rokem mi exly všechny asistenti v autě. Divný zase řídit analogový vůz. Moc to pípá. Uf. Jak tohle dopadne? 2.1. jdeme na check tak snad <3',
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000029-0000-4000-8000-000000000005', 'a0000029-0000-4000-8000-000000000029', 'ca000029-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  E'Vyrazili jsme si s Terkou na nový rok na rande, protože Max měl noční hlídání u tety.\nSauna, masáž, večeře.. všechno top, až na to, že jsem v Mexitě při příchodu zahlédl někoho, kdo vypadal hodně jako Nikča, ale tlustší.\nA seděla tam se starší paní a mladší holkou, což by odpovídalo na ex-tchyni a její sestřenku..\nHehe.. byly to vskutku ony 😂\nPozdravení teda neproběhlo, tak snad si taky nebyly jisty nebo nás neviděly, jinak trapásek.',
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000029-0000-4000-8000-000000000006', 'a0000029-0000-4000-8000-000000000029', 'ca000029-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  'Když pojedete v zimě do hor, tak si ověřte jak vysoko je hotel kam jedete a jestli řetězy sedí na vaše pneu.. aneb dvě hodiny zmaru a roztrhání řetězů ze Znojma',
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000029-0000-4000-8000-000000000007', 'a0000029-0000-4000-8000-000000000029', 'ca000029-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  'Indové jsou dno světové společnosti, change my mind.',
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000029-0000-4000-8000-000000000008', 'a0000029-0000-4000-8000-000000000029', 'ca000029-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  'Thajsko, nejlepší dovolenková země kam utéct před zimou?',
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000029-0000-4000-8000-000000000009', 'a0000029-0000-4000-8000-000000000029', 'ca000029-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  E'Ke konci ledna jsem byl na suché jehle. Čekačka 4 měsíce. Cena měla být kolem 3k za necelou hodinu 😂\nJak to celé dopadlo a jak to probíhalo? Můžu vám to doporučit?',
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000029-0000-4000-8000-000000000010', 'a0000029-0000-4000-8000-000000000029', 'ca000029-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  'Reklamuju pixelisko. Jak to dopadlo?',
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000029-0000-4000-8000-000000000011', 'a0000029-0000-4000-8000-000000000029', 'ca000029-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  'Jak to máte s rýmou pánové? Konzultoval jsem s několika ženami a divily se, že mě bolí zuby, uši, spánky.. že mám pocit pálení v na čele apod.. Není fakt něco na tom, že ženy mají rýmu slabší a my to máme jinak? Nejsme jen pussies ne?',
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000029-0000-4000-8000-000000000012', 'a0000029-0000-4000-8000-000000000029', 'ca000029-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  E'Vláďa 1.0: bydlí v Náchodě a sní o velké kariéře a bydlení v Praze.. zastává se menšin, cestuje po světě, miluje globální politiku a koná morální věci a činnosti..\n\nVláďa 2.0: bydlí v Praze, má dobrou kariéru ale nevychází z Holešek, netají se mírnou xenofobií, mírným šovinismem a jezdí téměř jen do LasPalmas, vyhrožování prezidentovi mu nepřijde tak hrozný a je to umělá kauza, staromák na demonstraci je daleko, naposledy byl když šlo o demokracii srsly ale neřekne už konkrétní důvod proč to tak tehdy bylo .. jsem zklamaný z nového Vládi? Ano. Skutečně ano\n\nAno, říkám to dramaticky, aby to mělo komický nádech v naší skupině, ale s čistým srdcem mojí říct, že mě Vláďa na vysoké inspiroval a vzhlížel jsem k jeho postojům a názorům.',
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000029-0000-4000-8000-000000000013', 'a0000029-0000-4000-8000-000000000029', 'ca000029-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'danicek.matej@gmail.com'),
  '"pop" goes the bubble - aneb kvíz-dating s fízlem a incelem v týmu',
  true, false, 13)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000029-0000-4000-8000-000000000014', 'a0000029-0000-4000-8000-000000000029', 'ca000029-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  'Místo politiky mám ve feedech na sockách profily, kde se řeší jak se staví silnice, domy, parky, cyklostezky apod. Je to dávka dopaminku, když vidíte, že se buduje a dělá se republika lepší a lepší pro život. Doporučuju.',
  true, false, 14)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000029-0000-4000-8000-000000000015', 'a0000029-0000-4000-8000-000000000029', 'ca000029-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  E'"Z Vás všech uznávám autority nejvíc" získal posměch vás všech 😂\n\nNaráželi jste na to, že protáhnu pár set K bokem přitom Dušan to přes mámu dělá už 5 let, Matěj používá dohody o provedení práce, Vláďa platí fiktivní poplatky Creative dock aby si na ně FÚ nedošlápl kvůli švarcáku a Kuba to teď řeší prvně, takže zatím stejně jako já dřív neplaceným volnem.\n\nJsme na tom s daněmi všichni stejně +-.. Jenže o tom moje vyjádření vůbec nebylo. Opakovaně shazujete všechny autority a jako čecháčkové víte všechno nejlíp a s oblibou se hrozíte téměř všeho co EU dělá za opatření. Tímto jsem se chtěl jen ospravedlnit, že by vám to úplně k smíchu být nemělo. Vyprošuji si to, děkuji.\n\nPeace.',
  true, false, 15)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000029-0000-4000-8000-000000000016', 'a0000029-0000-4000-8000-000000000029', 'ca000029-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'jakub.minarik.11@gmail.com'),
  'Je dobrý nápad ukazovat, jak Claude dokáže dělat naši práci na meetingu, kde je i člověk, který nás může všechny vyhodit?',
  true, false, 16)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000029-0000-4000-8000-000000000017', 'a0000029-0000-4000-8000-000000000029', 'ca000029-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'vlado903@gmail.com'),
  'RFP concerts a šatna za 60ks kus + staráč za 90',
  true, false, 17)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000029-0000-4000-8000-000000000018', 'a0000029-0000-4000-8000-000000000029', 'ca000029-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'vlado903@gmail.com'),
  'Frekvence retrospektiv v zimě má být vyšší, nikoliv nižší!',
  true, false, 18)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000029-0000-4000-8000-000000000019', 'a0000029-0000-4000-8000-000000000029', 'ca000029-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  E'Být pro-aktivní v korporátu? Vyplatí se to? Jonebone?\nZatím to tak moc nevypadalo až do doby, kdy se mě nadřízený zeptal, jestli nechci řešit s ním AI a to s sebou nese pozitiva:\n- placené tools bankou\n- zainteresovanost v AI (takže by mě nemuseli vyhodit jako prvního)\n- čas na hraní si s tím za firemní penízky\n\nKonečně se to teda v něčem vrátilo 😂 Doposud to spíš bylo k hovnu',
  true, false, 19)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000029-0000-4000-8000-000000000020', 'a0000029-0000-4000-8000-000000000029', 'ca000029-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  E'V Brně na Masaryčce vyhodili profesora za ponižování, narcisistní sklony.. skoro kolem sebe až vytvářel sektu aby ho lidé uctívali. No, konečně se ho v Brně zbavili.\n\nHádejte, na jakou univerzitu se chtěl dostat a přijali ho? 😂',
  true, false, 20)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000029-0000-4000-8000-000000000021', 'a0000029-0000-4000-8000-000000000029', 'ca000029-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'vlado903@gmail.com'),
  'proč že vlastně USA bojuje na druhé straně světa?',
  true, false, 21)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000029-0000-4000-8000-000000000022', 'a0000029-0000-4000-8000-000000000029', 'ca000029-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  'Software engineering končí letos jak ho známe. Máte backup plán?',
  true, false, 22)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000029-0000-4000-8000-000000000023', 'a0000029-0000-4000-8000-000000000029', 'ca000029-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'vlado903@gmail.com'),
  'Osobní rozhodnutí každého z nás mají vliv na ekologii',
  true, false, 23)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000029-0000-4000-8000-000000000024', 'a0000029-0000-4000-8000-000000000029', 'ca000029-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  'Regular check. Užíváte si život?:)',
  true, false, 24)
ON CONFLICT (id) DO NOTHING;
