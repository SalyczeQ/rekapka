-- Import Retro #13 - (Lysý speciál s Dušanem)
-- Date: 2024-07-20 | 60 cards | Anonymous authors with AI guesses
-- Source: Retro_13_(Lysý speciál s Dušanem)_2024-7-20.csv

-- Ensure Anonymous user exists
INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES ('00000000-0000-4000-8000-000000000000', 'Anonymous', 'anonymous@rekapka.local', '#9CA3AF', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000013-0000-4000-8000-000000000013',
  'Retro #13',
  'completed',
  '2024-07-20',
  NULL,
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2024-07-20 17:00:00+00',
  '2024-07-20 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000013-0001-4000-8000-000000000013', 'a0000013-0000-4000-8000-000000000013', 'Mad', '😡', '#EF4444', 0),
  ('ca000013-0002-4000-8000-000000000013', 'a0000013-0000-4000-8000-000000000013', 'Sad', '😢', '#3B82F6', 1),
  ('ca000013-0003-4000-8000-000000000013', 'a0000013-0000-4000-8000-000000000013', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000001', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Řekové toho dali světu hodně: geomertie, kartografie, olympiáda... Ale taky si mohli od světa něco vzít. Třeba hajzl, do kterého jde spláchnout toaleťák aby koš nemusel být plný papírů od hoven 🤔 i ty blbý arabové mají alespoň sprchu na věnec',
  'Petr Weissar',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000002', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Nigiris neumí použít ani štětku u hajzlu. Je investice do jejich začlenění worth it?',
  'Dušan Salay',
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000003', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Podařilo se nám naplnit snížení toxicity v našich kanálech? ☑️',
  'Petr Weissar',
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000004', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Měli bychom si uvědomit jak máme v Česku krásné holky 👌☺️',
  'Petr Weissar',
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000005', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Když vás kamarád dojme darem.',
  NULL,
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000006', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Brodie Rise from 50k do 150k in one and half year. Jak se daří riskovat vám?',
  'Dušan Salay',
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000007', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'V USA vyloži checkin kufry na pás dříve než výstupis z letadla. V Německu čekáš přes hodinu. Kam se prodělala  německá preciznost?',
  'Dušan Salay',
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000008', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'V USA vlastně není stát který bo z přírodního hlediska zajišťoval klidné žití. V Evropě a hlavně Česko jsem fakt strašně lucky. Žije se vám dobře v Česku?',
  'Petr Weissar',
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000009', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Reverse hike a rangerka. Trošku nás po cestě dolů odsoudila protože jsem měl oplocené čelo😀. Ale prezili  jsme a místo 9-12 hodin jsme to dali za 5😎',
  'Dušan Salay',
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000010', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Zalévání trávníků za deště? V USA běžné. Dochází nám v Evropě základní resources?',
  NULL,
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000011', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Kolik Dušana stál tripíq do USA?',
  NULL,
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000012', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Výdaje USA',
  NULL,
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000013', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Las Vegas casino jsem obral o 10 mil.. Nope jen dolarů. Je pařba v Las Vegas vážně worth it? (Casinos, Death Valley, Grand Canyon, David Caprfield)',
  NULL,
  true, false, 13)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000014', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'V IHMC je nová budova pro biological research. Snaží se přijít na něco co by pálilo dobře tuky. Takže už to není jen security a robotics :)',
  NULL,
  true, false, 14)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000015', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'V LA jsme omylem obklicili jednoho černocha. Myslel si že ho chceme okrást. Beze srandy. Nebo jsme ho prostě měli oskubat o vše?',
  NULL,
  true, false, 15)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000016', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'V usa klasicky jsou hned všichni milý a snaží se pomoct. Proč na sebe musíme koukat v Evropě skrz prsty? Můžeme lidem důvěřovat? Každý nás přece nechce okrást nebo není vrah.',
  'Dušan Salay',
  true, false, 16)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000017', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'V AirBance z Android týmu odchází člověk. (Bohužel to není Uchytil). Nicméně se otevírají dveře někomu novému. Bude Kuba součástí týmu? 🤔',
  NULL,
  true, false, 17)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000018', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Od té doby, co Kuba nemá práci, tak je s ním větší sranda. Change my mind. 🧠',
  'Matěj Daníček',
  true, false, 18)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000019', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  E'Já vím, je to ostuda, ale Amsterdam jsem navštívil až teď. 😬\n\nNeměl jsem žádný očekávání.\n\nZávěr: To město je 10x lepší než Praha - hezčí, zajímavější, spousta mini podniků, dobře vypadající supermarkety, milí lidi co umí anglicky, na magistrále se dalo přejít bez přechodu, protože nejezdila auta 😱\n\nTohle je budoucnost, kterou bych chtěl jít.\n\nPS: ceny s Prahou srovnatelný, což je funny 😄',
  NULL,
  true, false, 19)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000020', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  '30 pod 30 🥰',
  NULL,
  true, false, 20)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000021', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Záchody kam se podíváš, zdarma a nesmrdi. V pralese, v poušti.. Proč to nejde i u nás?',
  NULL,
  true, false, 21)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000022', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Už se nesedí v restauracich ani kavárnách. Vše drive thru. Nebo jen osobní pickup a čus. prý to udělal hodně covid a amici si odvykli chodit dovnitř podniku.',
  NULL,
  true, false, 22)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000023', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Neplatí se za vodu v restauraci. Trochu to byl nezvyk. Proč si myslíte že to není i u nás?',
  NULL,
  true, false, 23)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000024', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Bordely v autě, odpadky až po střechu. To samé u baráku. Občas u baráku to vypadalo jak u nás u cikánu. 😭 je to normální a my Češi jsme jen velcí kutilové?',
  NULL,
  true, false, 24)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000025', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Ani v nejlepší zemi na světě  Taky neumí zipove řazení. Obecně, řidiči tam jsou o dost opatrnější a ohleduplnejsi. Proč u nás tolik na silnici spěcháme a jsme za volantem agresivní? Petře?',
  NULL,
  true, false, 25)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000026', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'RegioJet: jeli jsme novým autobusem a vše se zdálo dobrý, ale po čase došel hajzl papír, vypnuli automat na kafe a lidi si pouštěli nahlas filmy (nemluvě o tureckým brečícím děcku).. tak jsem šel na zastávce copilota se zeptat jestli by automat na kafe zapli: "To se nedá zapnout teď" 😂 .. evidentně by měl RegioJet zcela zaniknout. EDIT: o 100km později to doplnili',
  NULL,
  true, false, 26)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000027', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Na dálnici hotpursuit  nisan gtr a Ferrari',
  NULL,
  true, false, 27)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000028', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Evok je top a dá se v něm spát',
  NULL,
  true, false, 28)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000029', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Přijel už Dušan Kodiaqem? Bude mu to stačit po zkušenosti z USA? Vrátí se ještě někdy ke Scaličce?',
  'Vladimír Tichý',
  true, false, 29)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000030', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Vláďův Evoque stále jezdí? Bylo zapotřebí zainvestovat nějaké statisíce navíc? 🤔',
  'Matěj Daníček',
  true, false, 30)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000031', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Kdyz cvicis, tak nespalis vic kalorii.',
  'Vladimír Tichý',
  true, false, 31)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000032', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Malá filozofická : Jste Češi nebo Evropani?',
  'Petr Weissar',
  true, false, 32)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000033', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Ze zákulisí Dami: Dušanův kolega Lukáš: No, budu si teď muset najít něco jinýho 😀 Dúša ti poví určitě víc.',
  'Petr Weissar',
  true, false, 33)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000034', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Regionální manažer Lidlu 91k hrubého. Wow. Prodavači už nás dotahují. Je na čase zvednout hodinovky? 😂',
  NULL,
  true, false, 34)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000035', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'DAMI, je v něm ještě nějaká práce?',
  'Dušan Salay',
  true, false, 35)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000036', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Harmonelo projekt v DAMI skončil. Bylo to jen kvůli egu CEO?',
  NULL,
  true, false, 36)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000037', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Dušan je zpět <3 a já můžu zase převzít míň konzervativní pozici v diskuzích, aneb migranty mlátit, ale ne upalovat',
  NULL,
  true, false, 37)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000038', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  E'Nvidia revealed that the Las Vegas Hype Sphere is powered by 150 RTX A6000 GPUs.\n\nEach of them has 48GB of video memory - that''s a total of 7200GB of memory. All this hardware is needed to drive 1.2 million LED panels outside and 16000x16000 screens inside.\n\nThe total cost of the GPUs is over $1m.Sledujete LLM svet?',
  NULL,
  true, false, 38)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000039', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Deset minut čekání v Dejvicích na kulaťáku na bus: 2x policajti, 1x sanitka.. po příjezdu do Jinonic 2x hasiči, 1x sanitka.. Aneb, Praha už je moc lidnatá a byzy pro kvalitní život. Nejlepší město pro život je mezi 100-200k lidmi. Change my mind.',
  'Matěj Daníček',
  true, false, 39)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000040', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Ekonomický deník sdílel příspěvek o tom, že se bude dělat nový Václavák za 1mld s tramvajemi. Místo toho aby lidi měli radost tak jen hejtivali Fialu, Hřiba, Piráty, že tam je metro tak na co tramvaj, proč radši nevyhodí bezďáky apod. Může se v této zemi ještě někdy někomu něčím zavděčit? Jak jste na tom s názorem na tuhle věc? Rekonstrukce nebo ne?',
  NULL,
  true, false, 40)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000041', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Po roce doktorů, masáží a pičovin mi konečně našli vyhřezlou plotýnku na rezinanci kterou jsem si vybrečel. Jak se tohle vůbec může stát?',
  'Jakub Minarik',
  true, false, 41)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000042', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Dobrý pracovník =/= Dobrý manažer',
  NULL,
  true, false, 42)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000043', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'To si takhle jednou přijdete po obědě do práce a musíte kolegyni oznámit, že ten člověk, s kterým volá, není pracovník banky, a že těch 300k, který poslala na "pojišťovací" účet, už nikdy neuvidí',
  NULL,
  true, false, 43)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000044', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Montana komplex malého státu? Já se tu narodil, já tu vyrůstal, já tu mám rodinu. Já vás spasim, všichni v okolí jsou špatní. Sami si to uděláme nejlépe. Nepřijde vám to podvědomé?',
  NULL,
  true, false, 44)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000045', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Je Montana Trump land? Je tomu vážně tak?  Rozhovor v krámě : I don''t give shit',
  NULL,
  true, false, 45)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000046', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Příroda (alespoň v Montaně) first. I přesto, že tu jsou velká města, tak zvířata z hor nebo lesů dojdou až do města. (Moose, BEAR, Mountain lion) A lidi se přizpůsobí. Kdyby vás něco sežralo, tak vás stejně nikdo nenajde.  V Česku vlastně žádnou dvou zvěř už nemáme. Vše jsme vystříleli. Je to lepší nebo jsme s nimi měli spoluzit?',
  NULL,
  true, false, 46)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000047', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'kdo další se vydá na dlouho někam pryč, abysme za ním stejně jako teď nevyrazili?',
  NULL,
  true, false, 47)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000048', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Hodně kecáme a málo realizujeme. Aneb jak si zatím užíváme cestovatelská retra a jiné akce?',
  NULL,
  true, false, 48)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000049', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Lysá je super, ale cestovatelský retro bysme jedno/dvě ročně dát mohli',
  'Dušan Salay',
  true, false, 49)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000050', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Poslední dobou se na internetech traduje, že Evropa je stará, neinovativní a že zanikne. Zvlášť se do ni naváží tech guys ze Silicone valley. Je v pořádku, že lidi cucající slámu, volicí Trumpa mají kecy na Evropu? Je to pravda nebo jsou amíci zabedněnci?',
  'Dušan Salay',
  true, false, 50)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000051', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Letenky jsou moc levný. Tuny lidí lítají zbytečně za pár stovek. Change my mind.',
  'Matěj Daníček',
  true, false, 51)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000052', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Jeli jsme na zmrzlinu na kole a objeli Pardubice dokola. Hodinu na kole. 300 kCal. Takže jestli tohle není důkaz, že kolo je teplej sport tak už nevím.',
  NULL,
  true, false, 52)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000053', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  '⚠️ DEEP TALK WARNING ⚠️',
  NULL,
  true, false, 53)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000054', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'DEEP téma',
  NULL,
  true, false, 54)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000055', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0003-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  E'iOS 18 - nejlepší update OS je - chvilka napětí - kalkulačka..\n\nApple ovečky jsou nadšení ze skenování a psaní formulí, které appka rovnou vypočítá.. \n\nWOW - (to co uměla appka Xmath na windows phone před 10 lety)\n\nTleskám, že je zapotřebí update appky tlačit do updatu iOS když už nemá co nabídnout.',
  NULL,
  true, false, 55)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000056', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0002-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Nutno probrat',
  NULL,
  true, false, 56)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000057', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0002-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Nutno probrat',
  NULL,
  true, false, 57)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000058', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0002-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Nutno probrat',
  NULL,
  true, false, 58)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000059', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0002-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Nutno probrat',
  NULL,
  true, false, 59)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000013-0000-4000-8000-000000000060', 'a0000013-0000-4000-8000-000000000013', 'ca000013-0002-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000000',
  'Nutno probrat',
  NULL,
  true, false, 60)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

