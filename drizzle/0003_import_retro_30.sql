-- Import Retro #30 - "Malaga retrisko"
-- Source: Malaga_retrisko_export.csv
-- 25 cards | 5 Participants
-- Author mapping: DUsan/Dušan → salay14@gmail.com

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

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000030-0000-4000-8000-000000000030',
  'Retro #30',
  'completed',
  '2026-04-06',
  'Málaga',
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2026-04-06 17:00:00+00',
  '2026-04-06 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000030-0001-4000-8000-000000000001', 'a0000030-0000-4000-8000-000000000030', 'Mad', '😡', '#EF4444', 0),
  ('ca000030-0002-4000-8000-000000000002', 'a0000030-0000-4000-8000-000000000030', 'Sad', '😢', '#3B82F6', 1),
  ('ca000030-0003-4000-8000-000000000003', 'a0000030-0000-4000-8000-000000000030', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 1: Glad - DUsan
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000030-0000-4000-8000-000000000001', 'a0000030-0000-4000-8000-000000000030', 'ca000030-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  'Vzdělaný zubař může mít taky menší finanční gramotnost. Ale nechá si poradit a alespoň nakoupí knížku aby se dovzdělal',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 2: Sad - Matěj
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000030-0000-4000-8000-000000000002', 'a0000030-0000-4000-8000-000000000030', 'ca000030-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'danicek.matej@gmail.com'),
  'Aktuální situace pro holky na Tinderu: 80 % jsou AI napsané zprávy. Ti kluci jsou tak líný 🙄',
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 3: Mad - Vladimír
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000030-0000-4000-8000-000000000003', 'a0000030-0000-4000-8000-000000000030', 'ca000030-0001-4000-8000-000000000001',
  (SELECT id FROM users WHERE email = 'vlado903@gmail.com'),
  'hlučný soused',
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 4: Glad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000030-0000-4000-8000-000000000004', 'a0000030-0000-4000-8000-000000000030', 'ca000030-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  E'Dušan mi přijel pomoct na dům usadit trámy ❤️ a stačilo jen, abych mu řekl, že tam bude i moje máma. Velké kudos a díky veřejně 🙏',
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 5: Sad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000030-0000-4000-8000-000000000005', 'a0000030-0000-4000-8000-000000000030', 'ca000030-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  E'Měli jsme issue s jedním PRkem jednoho plešatého kolegy. (nebudu jmenovat)\n\nResult od šéfa byl takový: Nemáme na to pravidla, nemůžeme to vynucovat, je to věc vkusu.\n\nNačež jsem ta pravidla ihned implementoval do Lintu a začal je vynucovat 😂\n\nJe to dick move? Je tak špatné, že chci aby ten kód byl k přečtení a nevypadal jako když mrdaj opice?',
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 6: Sad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000030-0000-4000-8000-000000000006', 'a0000030-0000-4000-8000-000000000030', 'ca000030-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  E'Jak dopadla série losů za 200?\n\nPo 7 výhrách 200-500 Kč jsem koupil osmý co nevyhrál nic.\n\nKam teď investovat?',
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 7: Glad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000030-0000-4000-8000-000000000007', 'a0000030-0000-4000-8000-000000000030', 'ca000030-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  'Matěj je nejlepší Instagramer: téměř na všechno reaguje a těší se ze sdíleného obsahu 🥰',
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 8: Mad - DUsan
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000030-0000-4000-8000-000000000008', 'a0000030-0000-4000-8000-000000000030', 'ca000030-0001-4000-8000-000000000001',
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  'Mrznout v Málaze? Je to normální? Neexistují ve Španělsku jiná místa kde je tepleji? Jedeme příště do Las Palmas?',
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 9: Glad - Vladimír
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000030-0000-4000-8000-000000000009', 'a0000030-0000-4000-8000-000000000030', 'ca000030-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'vlado903@gmail.com'),
  'španělsko',
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 10: Glad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000030-0000-4000-8000-000000000010', 'a0000030-0000-4000-8000-000000000030', 'ca000030-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  'Přichází jaro! Teplo, klid, sukně, jarní vzduch, nemrzne v noci.. kurva hned je ten život lepší 🥰',
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 11: Mad - DUsan
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000030-0000-4000-8000-000000000011', 'a0000030-0000-4000-8000-000000000030', 'ca000030-0001-4000-8000-000000000001',
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  E'Moji kolegové jsou starší a hlavně jeden je totální konzerva a myslí si, že to co se dělalo před deseti lety je stále ok. Jak byste řešili? Ignor nebo začít na něj tlačit přes ostatní kolegy? Domluva 1 on 1 nepomáhá.',
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 12: Sad - DUsan
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000030-0000-4000-8000-000000000012', 'a0000030-0000-4000-8000-000000000030', 'ca000030-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  'Zvažovali jste někdy dát svůj cash do předčasné splátky hypotéky. Je to totální blbost nebo může dávat někdy smysl?',
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 13: Sad - DUsan
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000030-0000-4000-8000-000000000013', 'a0000030-0000-4000-8000-000000000030', 'ca000030-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  E'TruU už taky hlídá AI usage. Na našem BE týmu vyhodnotila, že nepoužíváme AI dostatečně a málo deliverujeme. Bude náš tým rozpuštěn?',
  true, false, 13)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 14: Glad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000030-0000-4000-8000-000000000014', 'a0000030-0000-4000-8000-000000000030', 'ca000030-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  'Jaký jsou AI progresy v bance? Už nás to nahradilo?',
  true, false, 14)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 15: Sad - Vladimír
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000030-0000-4000-8000-000000000015', 'a0000030-0000-4000-8000-000000000030', 'ca000030-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'vlado903@gmail.com'),
  'letištní příhoda',
  true, false, 15)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 16: Glad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000030-0000-4000-8000-000000000016', 'a0000030-0000-4000-8000-000000000030', 'ca000030-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  E'Chlapi je to weird.. hrozně nemám rád muslimy, jejich fakin gej latentnost a šovinismus a kamenování a mrdání koz..\n\nAle mám moc velkou radost z toho, když s mini drony zničil Irán U.S.A. majetek za miliardy dolarů.\n\nJe to ok nemít rád ani jednu stranu?',
  true, false, 16)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 17: Mad - Vladimír
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000030-0000-4000-8000-000000000017', 'a0000030-0000-4000-8000-000000000030', 'ca000030-0001-4000-8000-000000000001',
  (SELECT id FROM users WHERE email = 'vlado903@gmail.com'),
  'žena šéfová',
  true, false, 17)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 18: Glad - Vladimír
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000030-0000-4000-8000-000000000018', 'a0000030-0000-4000-8000-000000000030', 'ca000030-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'vlado903@gmail.com'),
  'jsem rád, že tu jste, pánové',
  true, false, 18)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 19: Sad - DUsan
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000030-0000-4000-8000-000000000019', 'a0000030-0000-4000-8000-000000000030', 'ca000030-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  'Řešíte AI s rodiči? Bojí se třeba o práci nebo jaký na to mají názor? Prarodiče to vidí třeba jako konec světa, ale jsou s tím v míru protože, to nějak doklepou už.',
  true, false, 19)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 20: Mad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000030-0000-4000-8000-000000000020', 'a0000030-0000-4000-8000-000000000030', 'ca000030-0001-4000-8000-000000000001',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  E'Našel jsem jednu nevýhodu práce s AI. Občas jsem z toho nadšenej na ticketech, který se mi nechce dělat. Ale jsou i hezký tickety jako nový obrazovky, optimalizace or whatever hezkýho.\n\nNo a mě nebaví napsat /auto JIRA ticket a čekat.. Navíc on chce furt součinnost na spouštění svých python hoven apod. Jsem v podstatě někdy jeho otrok.\n\nPráci to usnadňuje, ale moc z toho požitek nemám.\nŘešení je takový, že to používám jen občas a jen na něco.\n\nPak jsme měli generovat reporty pro CTO, který mě vyhlásil, že jen 55% ticketů dělám s Claudem. Přičemž rozptyl podílení se na ticketu je 20-90%.\nCituji: "Buď úkoly různé povahy nebo nekonzistentní využívání" 😂\n\nTak tam teď musím občas něco spustit jen tak, abych se zařadil do průměru a nevyčníval.\n\nCo si o tom myslíte? Napište mi to do komentářů.',
  true, false, 20)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 21: Sad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000030-0000-4000-8000-000000000021', 'a0000030-0000-4000-8000-000000000030', 'ca000030-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  E'Trash talk alert následovaný Epilogem. Prosím nepřerušovat.\n\nPetr: Chlapi prosím prosím přijedete mi pomoct?\n\nVláďa: Nebudeš nám Petře organizovat program, že ne? To chceš abychom tam byli každý víkend nebo jak Petře? Proč neřekneš svým vesnickým kamarádům Petře? Jsme programátoři Petře a my nepracujeme v zimě. Nemáme čas, protože musíme moc hrát padel nebo jezdit lyžovat Petře. 5x jsi nás prosil a čekáš že 5x přijedeme ne? Mohl bys nás přestat citově vydírat?\n\nAle ne - dovolte mi se k tomu vyjádřit naposled a tím to uzavřít:\nTo co se v diskuzi stalo je fakt nešťastný a mrzí mě, že to takhle daleko vůbec zašlo. Jakoby nestačilo, že už poníženě škemrám kamarády o pomoc a ještě jsem dostal přidáno za to, že otravuju. Už vím, že po tom od některých už pomoc nikdy nechci a měl bych jakýkoliv další pomoci odmítnout. Bohužel však tu pomoc neskutečně potřebuju, takže budu rád, když se na konci dubna ještě zastavíte. Jsem neskutečně zavázán, dlužníkem a všechno.\n\nAle tím to skupinově organizovaně končí a opakovat to už nikdy nebudu (ne takhle se všemi nebo s těmi, kteří opravdu nechtějí nebo mají svých věcí mnoho). Pojďme to už pak prosím neřešit a nikdy neotevírat.\n\nDISCLAIMER: Toto není citové vydírání.',
  true, false, 21)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 22: Glad - Petr
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000030-0000-4000-8000-000000000022', 'a0000030-0000-4000-8000-000000000030', 'ca000030-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'weissar.petr@gmail.com'),
  E'Zajímavé srovnání:\n\nBurj khalifa 1,5 mld dolarů (6 let stavby)\n\nGta 6 2 mld dolarů (7 let vývoje)\n\nNení to už je jeden program trochu moc?',
  true, false, 22)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 23: Glad - Jakub
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000030-0000-4000-8000-000000000023', 'a0000030-0000-4000-8000-000000000030', 'ca000030-0003-4000-8000-000000000003',
  (SELECT id FROM users WHERE email = 'jakub.minarik.11@gmail.com'),
  'cením, že se tady dokážeme sejít v plném počtu, přestože někteří z nás mají spoustu povinností 🥰',
  true, false, 23)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 24: Sad - DUsan
INSERT INTO cards (id, retro_id, category_id, author_id, text, is_discussed, is_skipped, sort_order)
VALUES ('cd000030-0000-4000-8000-000000000024', 'a0000030-0000-4000-8000-000000000030', 'ca000030-0002-4000-8000-000000000002',
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  'Chtěl jsem boostovat hodinovku, ale není to v aktuální AI vlně sebevražda?',
  true, false, 24)
ON CONFLICT (id) DO NOTHING;
