-- Import Retro #20
-- Date: 2025-01-26 | 40 cards | Anonymous authors with AI guesses
-- Source: Retro_20_2025-1-26.csv

-- Ensure Anonymous user exists
INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES ('00000000-0000-4000-8000-000000000000', 'Anonymous', 'anonymous@rekapka.local', '#9CA3AF', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000020-0000-4000-8000-000000000020',
  'Retro #20',
  'completed',
  '2025-01-26',
  NULL,
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2025-01-26 17:00:00+00',
  '2025-01-26 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000020-0001-4000-8000-000000000020', 'a0000020-0000-4000-8000-000000000020', 'Mad', '😡', '#EF4444', 0),
  ('ca000020-0002-4000-8000-000000000020', 'a0000020-0000-4000-8000-000000000020', 'Sad', '😢', '#3B82F6', 1),
  ('ca000020-0003-4000-8000-000000000020', 'a0000020-0000-4000-8000-000000000020', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000001', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'Další důvod nejezdil na fosyl: přes 50% ropy dovážené do ČR je z Ruska.',
  'Vladimír Tichý',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000002', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'Jednou si necháš udělat tažný a odteď kdykoliv jedu na garanční servis zdarma, tak mi vyčistí auto. K tomu jsem dostal osobního poradce. Jak snadno lze postoupit v kastě.',
  'Petr Weissar',
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000003', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  E'Nový Enyaq. Top design, dojezd téměř 600km. Luxusní záležitost. Z 0na100 6 vteřin. Nejaerodynamičtější škodovka ever. Recyklované plasty.\n\nUž jste si ho objednali? 🤔',
  'Vladimír Tichý',
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000004', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'Dostal jsem poukaz na zážitky. Nějaký nápad? Respektive slyšeli jste o něčem zajímavém v poslední době? Já přemýšlím o nějakém super sportu.',
  'Matěj Daníček',
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000005', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'Výrobna hurikánů',
  NULL,
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000006', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'Dino na baru a na kurtu',
  NULL,
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000007', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'Kuba dostal zcákáno',
  'Dušan Salay',
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000008', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'Dušan v Praze.. kde je problém?',
  'Dušan Salay',
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000009', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'Rekonstrukce bytu jonebone?',
  'Dušan Salay',
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000010', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'Je adekvátní kupovat něco co není ani na mapě?',
  'Petr Weissar',
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000011', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'Šli by jste za svou zemi na frontu? A proč ano Petře?',
  NULL,
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000012', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'Wtf is Moira? Polish brand?',
  'Petr Weissar',
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000013', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'Dost často se konfrontujeme kvůli politice. Proč vůbec se o politice bavíme? A proč to je nebo není potřeba?',
  'Matěj Daníček',
  true, false, 13)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000014', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  E'Byli jsme na Kanárech a opět to byl super recharge a vypnutí od české zimy a inverze. Přidá se příští Silvestr i další členi retra?\n\nPS: prosím Matěji co si dělal na Silvestra?',
  'Petr Weissar',
  true, false, 14)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000015', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'škvrně na cestě, druhá hypotéka, rekonstrukce baráku. Je k diskuzi jestli je zdravé naordinovat si takový zápřah. A proč právě není, Petře?',
  'Dušan Salay',
  true, false, 15)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000016', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  E'Jak jde Petre rekonstrukce? Uz ses to rozhodl zbourat a postavit dal od silnice?\n\nBudes jeste nekdy normalne cvicit?',
  'Dušan Salay',
  true, false, 16)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000017', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'Situace na trhu s vývojáři není dobrá a asi bude hůř. Je čas si otevřít offline byznys? Co třeba nějaké sportoviště?',
  'Dušan Salay',
  true, false, 17)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000018', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'Sdílíme málo?',
  NULL,
  true, false, 18)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000019', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'Kubík už s Copilotem tak zlenivěl, že už mi odepisuje Suggested zprávama na Teamsech. Je to ok? 😄',
  'Jakub Minarik',
  true, false, 19)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000020', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'EPILOG: Rozdělení česka a slovenska je jedna z věcí, které Klaus neposral.',
  NULL,
  true, false, 20)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000021', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'Píchat kolegyně jonebone?',
  NULL,
  true, false, 21)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000022', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'Vykricnik, nebo .not()?',
  NULL,
  true, false, 22)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000023', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'Jsme live, je to k něčemu?',
  NULL,
  true, false, 23)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000024', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'Revolut vs Trading212 karta',
  NULL,
  true, false, 24)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000025', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'Má dušan a kuba problém s úrovní testosteronu po padelovém soustředění?',
  NULL,
  true, false, 25)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000026', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'Zásilkovna appreciation post',
  NULL,
  true, false, 26)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000027', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'Převedení hypotéky. Má to smysl?',
  'Matěj Daníček',
  true, false, 27)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000028', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  E'Spolupracovat s lidma 50+ na baráku je jakože:\n\nnedělej si druhý patro, budeš toho litovat.. na co potřebuješ 200m na bydlení.. k čemu ti je 1700m zahrada, rozděl to na 2 stavební parcely a jednu prodej.. \n\nmají pravdu? nebo ok boomer?',
  'Jakub Minarik',
  true, false, 28)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000029', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  E'Jak se Kubovi líbilo, že první task v Airbance byl v Javě? 😄\nA je práce na MyAir opravdu takový chill jak si všichni myslíte? 🤔',
  'Petr Weissar',
  true, false, 29)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000030', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'Posledních pár měsíců se nám ve skupině vytrácí objektivní myšlení a na všechno posíláme jen hejty. Bohužel true hejty a ne trashtalk. Co se stalo? Jsme tak moc frustrovaní?',
  'Petr Weissar',
  true, false, 30)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000031', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  E'Cituji: "Škodovka je shit" - konec citace.\n\nProsím pražského autora o vysvětlení proč tomu tak je, a jak je tedy možné, že automobilka trhá prodejní rekody a daří se ji více než mateřské společnosti.',
  'Dušan Salay',
  true, false, 31)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000032', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  E'Objektivně: moji rodiče koupili dům s pozemkem za 30k a za dalších 800k ho postavili znovu. Na dnešní ceny kolem 8-10 milionů. Za to už se dnes dá koupit jenom ta ruina na zbourání.\n\nhttps://shorturl.at/22DTy\n\nPřípadně telegram saved',
  'Petr Weissar',
  true, false, 32)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000033', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'Citace: sjezdovky jsou fakt špatný, nejmíň eko friendly sport, lidi, co vůbec nemají v horách být, tam jezdí v hejnech...... By šlo krásně dát na: lidi co nemají být na Kanárech jezdí v hejnech, lidi co potřebují halu na squash a padel by taky neměli co hrát. Co si z toho odnese autor citace?',
  'Dušan Salay',
  true, false, 33)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000034', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'Inženýří toxicita - no joke real issue ... člověk navrhne lyže a rozjedou se zbytečný ad hominem útoky, které nejsou a lá "tvoje máma" ve vší počestnosti a humoru ... kde je ten problém? ovlivňují naše politické názory naši skupinu na osobní úrovni? nejsme schopni uznat, že někdy má druhý názor, se kterým nesouhlasíme a nechat to tak prostě být? samozřejmě pokud se nejedná o názor na rasové a náboženské čistky - tam se snad všichni shodneme!',
  'Vladimír Tichý',
  true, false, 34)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000035', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  'Krásně v klidu se s Matějem domlouváme na lyže a Matěj: že prý bychom měli říci i ostatním. Výsledek: milion hoven keců o tom jak jsou sjezdovky na nic, přičemž argumenty hodný zametení před vlastním prahem. Jsou věci které nemají společně.',
  'Matěj Daníček',
  true, false, 35)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000036', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  E'Netflix: vydá nový film o černoškách ve 2. sv. válce.\n\n\n\n\nLidi: zasraný netflix nás krmí feminismem, rasismem a mnoho pohlavími!!!\n\n\n\n\nNikdo nikoho nenutí se na to dívat. Je samozřejmě potřeba tyhle témata brát v potaz a mít k tomu respekt. Dělat to správně. Ptám se, kde je kurva problém 😂',
  'Matěj Daníček',
  true, false, 36)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000037', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  E'70 pohlaví řeší jen lidi, kteří se proti tomu vymezují - jinak je to všem úplně jedno.\n\n\n\n\nProč si nemůžeme každý hledět svého? 🤔\n\n\n\n\nTo je věc, která se nedotýká nikoho z nás jako třeba politika. Nemáme právo se k tomu vůbec vyjadřovat.',
  NULL,
  true, false, 37)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000038', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  E'V U.S.A. se neustále zdražuje zdravotní péče a jsou třeba 3x dražší než další státy v pořadí.\n\nJe to rejžování na lidech, nebo je v USA tolik obézních a nemocných lidí, že se to jinak dělat nedá?',
  NULL,
  true, false, 38)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000039', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  E'Nenávist vůči africkým migrantům některých z nás začíná být tristní.\n\n\n\n\nNechť se obhájí ti, kteří jsou rádi, že ve středozemním moři umírají lidé na svých plavidlech 🖐️\n\n\n\n\nNavíc se ty nasdílené věci z reels nikdy nestaly v německu během vánočních trhů.',
  NULL,
  true, false, 39)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000020-0000-4000-8000-000000000040', 'a0000020-0000-4000-8000-000000000020', 'ca000020-0003-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000000',
  E'Konečně máme jediný argument proč je Praha tak super.\n\n\n\n\nJe tam hodně lidí.\n\n\n\n\nCož z ní zároveň dělá místo, proč to není vůbec super: - vysoké ceny, splodiny, spodiny, kriminalita, nedostupné bydlení, bydlí tam Tomio Okamura.\n\nChange my mind again. 😞',
  NULL,
  true, false, 40)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

