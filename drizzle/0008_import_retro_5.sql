-- Import Retro #5
-- Date: 2023-12-10 | 37 cards | Anonymous authors with AI guesses
-- Source: Retro_5_2023-12-10.csv

-- Ensure Anonymous user exists
INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES ('00000000-0000-4000-8000-000000000000', 'Anonymous', 'anonymous@rekapka.local', '#9CA3AF', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000005-0000-4000-8000-000000000005',
  'Retro #5',
  'completed',
  '2023-12-10',
  NULL,
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2023-12-10 17:00:00+00',
  '2023-12-10 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000005-0001-4000-8000-000000000005', 'a0000005-0000-4000-8000-000000000005', 'Mad', '😡', '#EF4444', 0),
  ('ca000005-0002-4000-8000-000000000005', 'a0000005-0000-4000-8000-000000000005', 'Sad', '😢', '#3B82F6', 1),
  ('ca000005-0003-4000-8000-000000000005', 'a0000005-0000-4000-8000-000000000005', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000001', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Videli jste GTA6 trailer? Tesite se? bude az v 2025 :O',
  'Matěj Daníček',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000002', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Chill na stadionu Slavie. Doporucuji. Byli jste nekde takhle?',
  'Petr Weissar',
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000003', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Dezerty. Jak se stavíte k tomu, že mnoho lidí nezvládne sníst hlavní jídlo a něco na talíři i nechá, nicméně záhy přijde dezert a jsou schopni sníst palačinku nebo wafli 😱',
  NULL,
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000004', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Cesta EC na Mnichov. Německý dopravce Alex. Staré vlaky (podobné těm českým), ale v první třídě úplně top sedačky - nastavitelné opěrky, područky, měkoučko everywhere. Proč to v ČR ještě pořád nejde? (peněz to stálo stejně jako v čr) 🤔',
  NULL,
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000005', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Týpek mě v Egyptě veze na hotel. Cesta je fakt punk.. žádný pruhy, přejíždění zleva zprava, místo blinkrů troubení. Ale. Furt to tak nějak jde. 😞 A najednou už je jen jeden pruh na směr a týpek předjel auto ale už se nazařadil do pravého pruhu a je-li jsme jsme asi 3km v protisměru a ještě si u toho vyřídil telefonát 😂 Tak už jsem mu teda řekl že by se mi líbilo když by jel vpravo a ty horizonty v protisměru nepokoušel a on se zařadil, ukázal před sebe a řekl "nou cars" 😂',
  'Petr Weissar',
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000006', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  E'Najednou mi píše Káčko na Slack.. Ahoj mám na tebe prosbu - můžeš pls hodit všechny faktury za rok 21,22,23 do zipu a poslat.\n\nEhmm "Děláme pro jistotu křížovou kontrolu všech nákladů včetně kontraktorů" hehe 😓 he. he..\n\nJestlipak to spíš nesouvisí s Lambidýlqem ???',
  NULL,
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000007', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Souvisí Petrova deprese s manželstvím?',
  NULL,
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000008', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  E'Cesta do Brna vlakem.. hezký prostředí, všechno by bylo fajn jakoby.. hehe\n\nAle ne, když chce člověk pracovat protože imrwere stále vypadává internet, což odhlašuje VPN a je nutno se na ni stále přihlašovat a ještě na tom kluzkém stolku všechno jezdí sem a tam a padají věci. \n\nVymrdaný český operátoři, který berou peněz jak svině a nejsou schopni udělat 100% pokrytí 5G po celé zemi dopíči 😠',
  'Dušan Salay',
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000009', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Java: Structured Concurrency zatím Preview, ale ve světě JVM nebude mít coroutines žádný smysl',
  NULL,
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000010', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Bouchá... a jsem 12k mínus :D',
  NULL,
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000011', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Mlhovky edukační info. Víte jak se správně používaji?',
  NULL,
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000012', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'VÍTE ŽE : Google mapy zobrazuji live pozici metra 😳',
  NULL,
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000013', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'trosicku DARK story.. uz se vam stalo ze nekdo uspesnej, bohatej, zakladatel projektu a koho jste znali byl odejit? Nadobro? Ze sveta? Treba oknem?',
  'Dušan Salay',
  true, false, 13)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000014', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Mám platit 30k za byt?',
  'Dušan Salay',
  true, false, 14)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000015', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  E'Listopad. Je to nejhorší měsíc.\n\nNejvíc se ztmívá brzy, nejvíc všechno z barev zešedné, zhnědne a udělá se fakin zima, která je ale ještě k hovnu - žádný lyžovačky nic.. Prostě jen zima, tma a sračky.\n\nUznávám tímto tedy, že je fajn na listopad opustit ČR. 🙏',
  NULL,
  true, false, 15)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000016', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  E'Jsou tu jedinci, kteří brečkají, že nechtějí chlastat v týdnu - dokonce se i snaží posunout X týdnů domluvené retro a pak si jdou vylejt hubu na Kotlin meetup jen tak v úterý večer 😂\n\nTak jak je to teda?',
  'Petr Weissar',
  true, false, 16)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000017', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Egypt. Zajímavá země. Vybagruješ kus moře a uděláš tam letovisko. Boostuje to ekonomiku, nedrancuješ přírodu (tady se na 1000km pobřeží 1km resortů ztratí), lidi tady dostali práci, všichni jsou happy. Dokonce jsou hotely i zelený a nezanechávají za sebou stopu. Nicméně země je to taky taková, že v celém hotelu nepracuje jediná egypťanka. Podporují tu halal a vaří vepřové a dávají alkohol. Watafak... 🥍',
  NULL,
  true, false, 17)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000018', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Třináctipalcový notebook na práci? Jak to může někdo používat?',
  NULL,
  true, false, 18)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000019', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Bouchá Mondeo?',
  NULL,
  true, false, 19)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000020', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'DAMI šetří, moc to nešlape. Dušan k tomu bude mít víc info?',
  NULL,
  true, false, 20)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000021', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Java Project Loom utočí na smazání Coroutines z povrchu zemského',
  NULL,
  true, false, 21)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000022', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Umělý věci na holkach (nehty, řasy, botox, kozy,... )... kdo je cílovka?',
  NULL,
  true, false, 22)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000023', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Nový tool namísto Parabolu není. V čem je parabol špatný vlastně? 🤔 Aneb proč nikdo nezvládl najít nic lepšího? Není to tím že je tahle věc přeci jen ok?',
  NULL,
  true, false, 23)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000024', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  E'Být ve firmě, o které vím, že dělá špatné věci (křivé, záludné, lživé) nebo je tam pár zkažených článků, které něco takového vědomě dělají. 🤔\n\nMěl bych v takové firmě zůstat nebo odejít stejně jako z takových odešel Petr?',
  'Jakub Minarik',
  true, false, 24)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000025', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Jak je na tom Dušan s hledáním práce? 🙏',
  NULL,
  true, false, 25)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000026', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'MatchReply konecne v produkci?',
  NULL,
  true, false, 26)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000027', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Dusan nebude na RfP? Ma cenu tam chodit bez nej?',
  NULL,
  true, false, 27)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000028', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Kde pracuje Matej?',
  NULL,
  true, false, 28)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000029', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Kubovi konci obdobi pasivniho prijmu. Jak se s tim smiruje? Dalo to do nej hodne nervi? Kolik dveri rozbil?',
  NULL,
  true, false, 29)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000030', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Musím si na appky dávat časomíry, abych zůstal produktivní? Aneb jak moc adhd člověk je a měl by s tím něco dělat? 🛑',
  NULL,
  true, false, 30)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000031', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Že by Enyaq nebyl tak špatný? Nejprodávanější elektroauto v Německu',
  NULL,
  true, false, 31)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000032', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Věděli jste, že když začnete větu písmenem ''ž'', tak Parabol spadne?',
  NULL,
  true, false, 32)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000033', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Najít termín na sraz? Dříve stačilo se vyjádřit nahlas v místnosti a všichni jsme se sešli v pivovarských domech. Dnes má jeden večírek, druhý nerad opouští prahu, třetí na ráno padel nebo snídani s polovičkou. Co s tím? Kdo to blokuje nejvíce? Je to jedinec nebo Praha? Vyřešíte to do příště nebo už retra dělat nebudeme?',
  NULL,
  true, false, 33)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000034', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Musíme to stáhnout nebo jdi. Aneb co když zaměstnavatel utáhne hodinky. Je to stále výhodné? Je méně zároveň více?',
  'Vladimír Tichý',
  true, false, 34)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000035', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Tipping culture, uber/bolt, self-checkouty',
  NULL,
  true, false, 35)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000036', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0003-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'Od kdy se reálně vyplatí jít na plátce DPH? Když vyděláš třeba 2,1 nebo 2,2 milionu, je to totálně k hovnu 😠',
  'Petr Weissar',
  true, false, 36)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000005-0000-4000-8000-000000000037', 'a0000005-0000-4000-8000-000000000005', 'ca000005-0002-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000000000',
  'ž',
  'Dušan Salay',
  true, false, 37)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

