-- Import Retro #4 - PceRetro (ale nevim jestli mi to vyjde, 50 na 50)
-- Date: 2023-10-28 | 49 cards | Anonymous authors with AI guesses
-- Source: Retro_4_PceRetro (ale nevim jestli mi to vyjde, 50 na 50)_2023-10-28.csv

-- Ensure Anonymous user exists
INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES ('00000000-0000-4000-8000-000000000000', 'Anonymous', 'anonymous@rekapka.local', '#9CA3AF', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000004-0000-4000-8000-000000000004',
  'Retro #4',
  'completed',
  '2023-10-28',
  NULL,
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2023-10-28 17:00:00+00',
  '2023-10-28 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000004-0001-4000-8000-000000000004', 'a0000004-0000-4000-8000-000000000004', 'Mad', '😡', '#EF4444', 0),
  ('ca000004-0002-4000-8000-000000000004', 'a0000004-0000-4000-8000-000000000004', 'Sad', '😢', '#3B82F6', 1),
  ('ca000004-0003-4000-8000-000000000004', 'a0000004-0000-4000-8000-000000000004', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000001', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Změna pohlaví nezletilých v USA',
  'Petr Weissar',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000002', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Univerzita... aneb když vám intuice říká - skonči - máte skončit...',
  'Petr Weissar',
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000003', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0003-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Máme nový coworking v HK 😏 A stojí zlomek toho co v PCE.',
  'Petr Weissar',
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000004', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Vážně svět spěje tolik do sraček, že Německo podporuje Izrael 🤔',
  'Vladimír Tichý',
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000005', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  E'Voláme si s Martinem Goldem na meetu a najednou mu zvoní telefon - iPhone vyzvánění 😱\n\nTak se ho ptám, jak je s tím spoko..\n\n"Ale jo, je to takový lepší Xiaomi a má to HW tlačítko na mute, takže docela dobrý" 👌\n\nNikdy jsem neslyšel lepší definici <3',
  'Petr Weissar',
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000006', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0003-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  '🐻 Kodiaq - je to ideální auto na chatu?',
  'Matěj Daníček',
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000007', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Koupím si hovězí zadní. Je to ze samice nebo samce? Udělá ze mě gaye to, že jím samčí maso?',
  'Dušan Salay',
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000008', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Co se to stalo v Nextappu na Matějově projektu a jak si s touto situací Matěj po 3 týdnech poradil? Vzal pracovní nabídku v Monetě?',
  'Petr Weissar',
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000009', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  E'Zahlasovat pro horskou chatu na silvestra a pak vzít něco jiného aniž by se třeba nezeptal organizátora jestli už nějakou chatu nebooknul? Přesně to by se asi dělat nemělo 👌\n\nNehledě na to, že někdo zaškrtnul, že doma bude brát drogy a pak tomuto přispěje s nabídkou surfování 🏄',
  'Dušan Salay',
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000010', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0003-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Chlapi.. už máte všichni objednanýho Pixela? 📵',
  'Petr Weissar',
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000011', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Co-working v Pardubicích - je to dobrá věc? Můžou zážitek z kanceláře zkazit finanční poradci? Proč jejich šéfa chtěl Petr umlátit cihlou? 🧱',
  'Petr Weissar',
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000012', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0003-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Neskutečně se stalo skutkem. Vašek 🐴 se mi po roce omluvil za svoje chování na začátku roku ohledně domlouvání výuky na UHK a další... 🤔',
  'Petr Weissar',
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000013', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  E'Platby na kontakt. Spící věc, co se najednou probudila a jako bruselská hydra likviduje všechno co je kolem svým ekoterorizmem.\n\nAneb první krize v AirBance, která mi připomněla práci na Brewee. 🤔\n\nJe čas se posunout dál?',
  'Dušan Salay',
  true, false, 13)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000014', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0003-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Vítáme mezi sebou milionáře Jakuba a Vladimíra aneb, jak se dá na tinderu vydělávat? 🤩',
  'Matěj Daníček',
  true, false, 14)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000015', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Semafory na rychlost, wtf is this maktošukajicí shit?',
  'Vladimír Tichý',
  true, false, 15)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000016', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0003-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Proč se z lidí za volantem stávají zvířata? Je to tím, že se koupí vozu zadlužili a snaží se si tuto "investici" ospravedlnit rychlou jízdou?',
  'Vladimír Tichý',
  true, false, 16)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000017', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0003-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'MatchReply je production-ready?',
  NULL,
  true, false, 17)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000018', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Spring schedulers and coroutines',
  NULL,
  true, false, 18)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000019', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'KMM',
  NULL,
  true, false, 19)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000020', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0003-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Montana na půl roku',
  NULL,
  true, false, 20)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000021', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'listek na VIP RfP za 14k',
  NULL,
  true, false, 21)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000022', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0003-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  E'Právě teď představují nový onewheel. Jdete do toho? \n\n\n\n\nhttps://www.youtube.com/watch?v=EFfDygh3miE',
  NULL,
  true, false, 22)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000023', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  E'Řezání hlav dětí Hamásem vs. Izraelští ortodoxní židé.\n\n\n\n\nJsou nábožní lidi dementní? Je to lidmi nebo náboženstvím? Cestování v tomto světě ano nebo ne?',
  NULL,
  true, false, 23)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000024', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0003-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'AI tooly jsou čím dál lepší a práce je zábavnější. Po prvotním šoku to vypadá, že to tak ještě chvíli bude. Jak dlouho nám zbývá?',
  NULL,
  true, false, 24)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000025', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0003-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  E'⚠️ DEEP TALK WARNING ⚠️\n\nDoporučuje se probrat až v pozdním průběhu večera\n\n\n\n\nHypotetická situace: Máte absolutní svobodu a můžete v životě dělat co chcete. Jak moc je to vzdálené vašemu momentálnímu žití a proč?',
  'Jakub Minarik',
  true, false, 25)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000026', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0003-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  E'Domací pohoda aneb je dobré mít holku, co umí vařit 🥣\n\n\n\n\nKonzervativní vs. moderní rodina, kdo dělá co a jak je to správně. 👪',
  'Dušan Salay',
  true, false, 26)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000027', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  E'Spadám do kategorie pracující žebrota, když dělám za stejné peníze od ledna 2022? \n\n\n\n\nKdy nastává zlomový bod pro stěhování do Libně?',
  'Dušan Salay',
  true, false, 27)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000028', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Elektrická auta jsou budoucnost a Evropa v tom nefiguruje, change my mind',
  'Petr Weissar',
  true, false, 28)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000029', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Je přetahování se o Netflix výrazem šetřivosti nebo žebroty?',
  'Dušan Salay',
  true, false, 29)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000030', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Nákupem Tesly přímo podporujeme lobotomilního rusofilckého Muska, proč neexistuje opensource elektrické auto, které dělá to co má?',
  'Petr Weissar',
  true, false, 30)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000031', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Retrospektiva - chceme kvalitu nebo kvantitu? 🤔',
  'Petr Weissar',
  true, false, 31)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000032', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0003-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Moje tričko ústav pro studium internetových idiotů poprvé přineslo své ovace. Pán v Hornbachu z toho nebyl moc nadšenej a moc se se mnou nebavil, když jsem potřeboval poradit s výběrem stolní desky. Můžu být rád, že mě nepřejel destou 😀',
  'Matěj Daníček',
  true, false, 32)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000033', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0003-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Matěj konečně v pražské firmě? Jak je na tom s hledáním?',
  NULL,
  true, false, 33)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000034', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0003-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Gaza strip by měl být ňůknut? Mají Palestinci nárok na to území co si narokuji? Proč se v médiích mluví jen o mrtvých izraelských dětech, když mrtvých Palestinců je mnohem víc?',
  NULL,
  true, false, 34)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000035', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0003-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Proč mi píše Šimon?',
  'Matěj Daníček',
  true, false, 35)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000036', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0003-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Jeden kamarád mě pasivně agresivně nutí pít a druhý mě aktivně agresivně nutí cvičit. Co mám dělat?',
  NULL,
  true, false, 36)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000037', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0003-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Silové tréninky u žen, chtějí nabírat svalový objem 💕 Mate radi svalnate zeny?',
  NULL,
  true, false, 37)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000038', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0003-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Kozy nebo zadek?',
  NULL,
  true, false, 38)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000039', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'musis byt buzik nebo mit nedostatek estrogenu, aby si chtel jezdit v elektroautu?',
  'Dušan Salay',
  true, false, 39)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000040', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  E'To si takhle nastoupíš do premka v leo.. očekáváš jako vždy práci v klídečku bez sluchátek na vlastních projektech s flatwhitem. A místo toho jsou tu 2 coury starý, (co sem nepatří) a píčují jak by si tu deku určitě nepůjčily a vybíraly telefon k vánocům, který bude kupovat její syn a řekla mu kolik minimálně musí stát.\n\nV sedačkách neuměly ani sedět, takže tu často nejezdí. Svině (pardon, to mi ujelo, ale hrozně mi to zničilo den) 😠',
  'Dušan Salay',
  true, false, 40)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000041', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Kolik procent HRistů je úplně k hovnu? Aneb "No já ještě ověřím u kolegů o jakou pozici se vlastně jedná, možná máte pravdu, že ten projekt obnáší něco úplně jiného než kvůli čemu vám volám."',
  'Dušan Salay',
  true, false, 41)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000042', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Tipovačka: Jsem na HPP a beru 100k hrubého. O kolik peněz za rok přijdu, pokud bych na té samé pozici byl na IČO? (Počítejme že na IČO pracuju jenom  měsíců, abych se reflektovala placená dovolená)',
  'Petr Weissar',
  true, false, 42)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000043', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Mobilesoft.. synonymem shnilosti. Co vše se objevilo po odkrytí informací ze zákulisí od paní Office managerky aneb. Proč je Míra, Dančák, Šimon (a trochu i Káťa) to nejhorší co MS potkalo 😱',
  'Jakub Minarik',
  true, false, 43)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000044', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0003-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'ANC ve sluchátkách jako zachránce před vraždou.. Že přehráním? Nikoliv. Aneb cesta z Pha do Pce dvojkou a z přelouče busem.. ještě že jsem stihl rychlovku 🥰',
  'Petr Weissar',
  true, false, 44)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000045', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Co se stalo s Lambem? https://www.idnes.cz/zpravy/domaci/ucetni-kradez-falesne-faktury-ncoz.A230713_100703_domaci_tty/foto/TTY567ee8cf14_ViewImage_3_.jpg',
  'Petr Weissar',
  true, false, 45)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000046', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Paní z UOL účetnictví (s exekucemi) potrápila Kubu a Dušana aneb proč je zapotřebí zvýšit daně 😔',
  NULL,
  true, false, 46)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000047', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Sraz se ZŠ po 14 letech..dopiči.. to chce vlastní retro more...Je tady pár lidí: - sestra ve vězení za drogy - stop řízení na 18 měsíců - stop řízení s podmínkou odnětí svobody - střídavá péče- ukrajinci zmrdi -(neboj se nacenit všechno jako v Praze, když jsi v hovnech je jedno kde děláš) (instalatéři humor) - všichni chtějí 5l auta (no eko) - všichni jedou cíčka, trávu.. - všichni někde dlužej',
  NULL,
  true, false, 47)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000048', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0003-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Jak je na tom projekt Svatebka? Je už hotovo? Už se to nabízí a cinká to? 🤔',
  NULL,
  true, false, 48)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000004-0000-4000-8000-000000000049', 'a0000004-0000-4000-8000-000000000004', 'ca000004-0002-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000000',
  'Agree',
  NULL,
  true, false, 49)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

