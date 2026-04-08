-- Import Retro #28 - Dec 7, 2025
-- 33 cards | 5 Participants
-- Uses email-based user lookups for portability

INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES
  (gen_random_uuid(), 'Petr Weissar', 'weissar.petr@gmail.com', '#3B82F6', 'cs', 'default'),
  (gen_random_uuid(), 'Vladimír Tichý', 'vlado903@gmail.com', '#3B82F6', 'cs', 'default'),
  (gen_random_uuid(), 'Dušan Salay', 'salay14@gmail.com', '#3B82F6', 'cs', 'default'),
  (gen_random_uuid(), 'Jakub Minarik', 'jakub.minarik.11@gmail.com', '#3B82F6', 'cs', 'default'),
  (gen_random_uuid(), 'Matěj Daníček', 'danicek.matej@gmail.com', '#3B82F6', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000028-0000-4000-8000-000000000028',
  'Retro #28',
  'completed',
  '2025-12-07',
  NULL,
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2025-12-07 17:00:00+00',
  '2025-12-07 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000028-0001-4000-8000-000000000001', 'a0000028-0000-4000-8000-000000000028', 'Mad', '😡', '#EF4444', 0),
  ('ca000028-0002-4000-8000-000000000002', 'a0000028-0000-4000-8000-000000000028', 'Sad', '😢', '#3B82F6', 1),
  ('ca000028-0003-4000-8000-000000000003', 'a0000028-0000-4000-8000-000000000028', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 1: Sad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000001', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  'Raise hodinovky se nekoná - čas odejít jinam? 🤔',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 2: Sad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000002', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  E'Dušan: Petře, jsi emočně labilní.\nPetr: Proč?\nDušan: ...\n\nDušan má teď prostor odpovědět 🤗',
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 3: Glad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000003', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  E'Dvě hodiny v autě do Krkonoš - 5 minut v ordinaci - dobrý pane, to bychom stejně neléčili nijak 😂\nDvě hodiny zpět..\nAle aspoň ten den zaplachtovali střechu a schválili úvěr...',
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 4: Glad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000004', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  'Jak dopadl úvěr u Rajfky? 🤔',
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 5: Sad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000005', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  'Vysoce rizikový klient plebsáček pan Weissaráček',
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 6: Sad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000006', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  E'EU: Budeme bojovat proti pedo ale sáhnem vám do soukromí\n\nMoji kamarádi: fuuj pičo komouši tak to ne, big bradr hadr\n\nEU: budeme bojovat proti klimatické změně\n\nMoji kamarádi: fuuuj regulace trhu a zákaz inovací proto jsme pozaduu a ty víčka fakin dementní eu jen regulujeee\n\nEU: budu bojovat proti terorismu jen potřebuju identifikovat všechny platby\n\nDušan: mrtki z EU pičo vole bojkotují podnikání! Eu zvoní hrana\n\nPointa: fakt vám EU tolik vadí? 😂',
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 7: Sad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000007', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  'Sobeckost většiny z nás se pomalu vymyká.. nejsme schopni se domluvit na žádné z 10 lokalit pro výjezd protože se nedokážeme uskromnit',
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 8: Sad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000008', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  E'Proč jsou AI agenti pořád tak useless, když nás za chvíli mají nahradit? Proč jim nemůžeme normálně zadat práci a čekat správné řešení, když mají kontext celého projektu a měli by mít ty nejlepší zkušenosti?\n\nOdpovědí je: Je to generátor textu',
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 9: Sad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000009', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  'Bojíte se chlapi, že AI bublina splaskne? Trošku jsem o tom četl a může to být megashiteček až všechny investice gigantů padnou. Jste ready na další krizi?',
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 10: Glad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000010', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  E'Až bude femine okenko: tak moc sexismu, že se ženy dávají do filmu jen aby byly zraněny aby to heclo main salfa hrdinu samce ofc. Žena v lednici.\n\nSázka o pivo s Matějem',
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 11: Glad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000011', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  'Jak Kuba zvládl procházku Prahou?',
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 12: Glad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000012', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  'Jak si Kuba užil vánoční večírek v Brně?',
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 13: Sad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000013', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  'České hory mají v součtu ročně 12 milionů návštěvníků. Z toho 4 miliony v zimním období. Skoro to vypadá, že lyžování a běžky tolik nedrancují přírodu jako letní sezóna. Myslel jsem, že zima bude drtivě vést a ne. Co si o tom myslíte? Napište mi to do komentářů.',
  true, false, 13)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 14: Glad - Vladimír
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000014', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'vlado903@gmail.com'),
  'BTC teď?',
  true, false, 14)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 15: Glad - Matěj
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000015', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'danicek.matej@gmail.com'),
  'ePojisteni.cz - že by konečně dobrá nespamující služba na porovnávání pojištění vozidel? I při hovoru žádný pushování, vše vysvětlený, připravený a 2k ušetřeno. Pokud nemáte dvorního pojišťováka, tak doporučuju.',
  true, false, 15)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 16: Sad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000016', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  'Kuba má oficiálně rád lidi z černého mostu. Můžeme s ním ještě vůbec kamarádit? (Reakce na to, że je hejtí ze srandy na oko)',
  true, false, 16)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 17: Sad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000017', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  E'Takže jak to je s těmi novými auty? Proč mají horší emise než 25 let stará auta, Vláďo? Proč tedy EU nenakáže jezdit ve starých autech, když jsou tak clean a super? 🥰\n\nCituji: jedničková ovce v benzínu je čistší než tvůj špinavej diesel\n\nNicméně statisticky je tu mnohem více starých dieselových aut. Takže?',
  true, false, 17)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 18: Sad - Vladimír
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000018', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'vlado903@gmail.com'),
  'Kdybyste měli být v garáži s nastartovaným autem, co byste si vybrali radši – jedničkovou ofci v benzínu nebo čtyřkový superb v naftě?',
  true, false, 18)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 19: Sad - Vladimír
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000019', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'vlado903@gmail.com'),
  'Bydlení stojí dost peněz…',
  true, false, 19)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 20: Glad - Vladimír
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000020', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'vlado903@gmail.com'),
  'Koupit další byt?',
  true, false, 20)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 21: Glad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000021', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  'Udělejte si hrubé podlahy a cena nemovitosti se nám zvedne o dva miliony. Investice do sto tisíc, hodnota + 2 M. Aneb financování rekonstrukce přes hypo 😔',
  true, false, 21)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 22: Glad - Matěj
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000022', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'danicek.matej@gmail.com'),
  'velká města zachraňují zdraví: díky dostupnosti a pohodlnosti jsem konečně začal řešit různý dlouhodobý zdravotní vosery ... bez hodinového dojíždění to je teda významně pohodlnější',
  true, false, 22)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 23: Sad - Matěj
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000023', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'danicek.matej@gmail.com'),
  'Necháváte zaparkováno s ruční brzdou nebo ne?',
  true, false, 23)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 24: Glad - Matěj
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000024', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'danicek.matej@gmail.com'),
  'Sebeobrana update: malá asiatka už nechodí, ale výuka je postavená dobře a i takové poleno jako já, už začíná reflexivně reagovat tak, jak má ... což teda nezbytně neznamená, že nedostanu na budku když na to přijde',
  true, false, 24)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 25: Glad - Dušan
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000025', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  'Smlouva podepsaná, penízky přeposláne a míč na straně katastru.',
  true, false, 25)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 26: Sad - Dušan
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000026', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  'Majitelka vysira a chce prodat ještě nábytek který tam měl zůstat.',
  true, false, 26)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 27: Sad - Dušan
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000027', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  'pokud mate nechte si své osmičky',
  true, false, 27)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 28: Sad - Dušan
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000028', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  'Komercka mi nedala premkoo I kdyz tam mam hypo',
  true, false, 28)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 29: Glad - Vladimír
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000029', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'vlado903@gmail.com'),
  'Kolik musíte mít nahráno v korunách na účtu v PadelPowers na začátku měsíce, abyste mohli každý týden mít jednou trénink?',
  true, false, 29)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 30: Sad - Dušan
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000030', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  'Díky pražským došli vakcíny na žloutenku A už je to aspoň solved?',
  true, false, 30)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 31: Glad - Jakub
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000031', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'jakub.minarik.11@gmail.com'),
  'V bance poplach, že se zpřísnila pravidla ohledně schwarzíka. Údajně nová legislativa a úředníci mají více pravomocí. Banka je opatrná a začíná lidi tlačit do HPP. Jsou naše dny pomalu sečteny?',
  true, false, 31)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 32: Sad - Vladimír
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000032', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'vlado903@gmail.com'),
  'Petr Cibulka a jeho osud',
  true, false, 32)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 33: Sad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000028-0000-4000-8000-000000000033', 'a0000028-0000-4000-8000-000000000028', 'ca000028-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  E'Dušan: nechci kypr, maltu, Řecko, Egypt\n\nMatěj: nechci Řecko a Egypt a Mallorku\n\nVláďa a Kuba: nechci nic kde se nedá hrát padel nebo je tam zima\n\nPetr: já bych nejradši nejel znovu do LP ale jinak všude\n\nVšichni: proč to blokuješ Petře?',
  true, false, 33)
ON CONFLICT (id) DO NOTHING;
