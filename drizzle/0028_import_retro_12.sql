-- Import Retro #12
-- Date: May 30, 2024 | 31 cards | 4 Participants: Jakub, Matěj, Petr, Vladimír
-- Anonymous authors with AI guesses

INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES ('00000000-0000-4000-8000-000000000000', 'Anonymous', 'anonymous@rekapka.local', '#9CA3AF', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000012-0000-4000-8000-000000000012',
  'Retro #12',
  'completed',
  '2024-05-30',
  NULL,
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2024-05-30 17:00:00+00',
  '2024-05-30 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000012-0001-4000-8000-000000000001', 'a0000012-0000-4000-8000-000000000012', 'Mad', '😡', '#EF4444', 0),
  ('ca000012-0002-4000-8000-000000000002', 'a0000012-0000-4000-8000-000000000012', 'Sad', '😢', '#3B82F6', 1),
  ('ca000012-0003-4000-8000-000000000003', 'a0000012-0000-4000-8000-000000000012', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 1: Glad - Vladimír (short, cola opinion, "change my mind")
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000001', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'freeway zero količka je lepší než originál... change my mind',
  'Vladimír Tichý',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 2: Sad - Vladimír (one word, laconic)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000002', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'toxicita',
  'Vladimír Tichý',
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 3: Glad - Matěj (festival, lifestyle)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000003', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'festival může být příjemnou záležitostí pro lidi po třicítce',
  'Matěj Daníček',
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 4: Sad - Petr (about Matěj, tech/Mac)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000004', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Matěj prohrál svůj boj s XCodem. Jakého Maca si má pořídit?',
  'Petr Weissar',
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 5: Glad - Jakub (Svatebka, emoji)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000005', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Svatebka má první klienty 😍',
  'Jakub Minarik',
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 6: Sad - Petr (about Vláďa, commuting)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000006', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Vláďa není spokojen v Praze? Dojíždí za prací do Hradce Králové a ani nedá vědět.',
  'Petr Weissar',
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 7: Glad - Petr (contractor/tax optimization, emoji)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000007', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Máte někdo volného osvč v paušálním režimu, který by mohl ročně fakturovat navíc něco přes půl milionu a zůstal by v limitu 1,5 mil.? Vypadá to, že Principal je ok s multifakturami 😍',
  'Petr Weissar',
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 8: Glad - Petr (food, personal, provocative)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000008', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Měl jsem svůj první smažák v životě. A je to hrozně overrated jídlo mi přijde. Přitom si ho člověk může dát kdekoliv. Jak jste na tom vy se smažákem?',
  'Petr Weissar',
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 9: Sad - Vladimír (very short)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000009', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'oficiálně pussy',
  'Vladimír Tichý',
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 10: Sad - Jakub (long, AirBank/PPF, moral dilemma about employer)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000010', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  E'PPF a TV Markíza. Našel jsem si naše ofiko vyjádření a pochybil prý moderátor a vše je v naprostém pořádku.\nReálně jsem teď na vážkách. Je to pro mě asi takový jako kdybych měl top placenou a dobrou práci, ale byla u Agrofertu.\nMyslíte, že je načase Airbanku opustit?',
  'Jakub Minarik',
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 11: Glad - uncertain (quote from social media)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000011', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'kotula.daniel 6h Author @matej.kohout.965 každý v Praze kdo pracuje má příjem 40plus. Pokud ne, muže to mít dva důvody, budto z vlastního rozhodnutí je na půl úvazku, a nebo peníze nepotřebuje.',
  NULL,
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 12: Glad - Petr (Apple WWDC, tech opinion)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000012', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Apple konečně umí uspořádat custom ikony a obarvit je to nějaké barvičky. Narozdíl od googlu to ale lidi můžou udělat nechutný. Viděli jste WWDC? Líbilo?',
  'Petr Weissar',
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 13: Sad - Petr (EV politics, references Dušan)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000013', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Jak jsme se smáli Dušanovi za tu nenávist k elektroautům (a stejně tak lidem na webu sauto.cz) no a teď to rozhodlo o tom, že přísaha a motoristé získali 2 křesle v EU parlamentu. Top..',
  'Petr Weissar',
  true, false, 13)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 14: Glad - Vladimír (short, car flex)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000014', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  E'⚠️ flex alert ⚠️ ..... rangeroverísek',
  'Vladimír Tichý',
  true, false, 14)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 15: Sad - Vladimír (short, car, laconic)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000015', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'kult mondeo je mrtev',
  'Vladimír Tichý',
  true, false, 15)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 16: Glad - uncertain (political, short)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000016', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'jsme tak bohatí, že můžeme volit levicově zaměřené strany',
  NULL,
  true, false, 16)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 17: Sad - Matěj (age/life reflection, emoji)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000017', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Cítíte nějakou frustraci okolo 30. roku života? Ať už fyzickou, finanční, motivační nebo cokoliv v tomto smyslu? 🤔 Nebo připadá vám někdy, že vám s něčím ujel vlak?',
  'Matěj Daníček',
  true, false, 17)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 18: Sad - Petr (EU elections, long, political)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000018', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Strach z elektroaut a greendealu je natolik velký, že 10% Čechů zvolilo nácka a fízla do europarlamentu. Komunisti 7%. Wow.. Čí je to chyba? Vláda neumí komunikovat? Dezinformace? Co se s tím dá dělat? Jste s tím spokojeni?',
  'Petr Weissar',
  true, false, 18)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 19: Sad - Petr (about Matěj not voting, confrontational)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000019', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Matěj odmítá řadu let chodit k volbám a posledně se to snažil ospravedlnit v chatu nějakými bláboly o modle a aktu voleb. Prosím o vysvětlení toho, jak si můžeš v současném systému a nabídce nevybrat nic, co by ti zlepšilo život nebo ti ho méně ničilo?',
  'Petr Weissar',
  true, false, 19)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 20: Glad - Petr (long, HK, toilet story, emoji, prank idea)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000020', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  E'Odjížděl jsem z HK a přišlo na mě velký špatný 💩\nNebyl jsem si jistej, že shellka za HK bude mít neobsazený záchod a tak jsem se stavil v Bavlně 😂\nPřipojil jsem se na WiFi a hodně moc zvažoval, že do všech google homu něco broadcastnu nebo jim pustím motorovou pilu.. Co si o tom myslíte? Měl bych to realizovat?',
  'Petr Weissar',
  true, false, 20)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 21: Glad - Petr (about Mac virtualization, humor)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000021', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Kdyby určití členové naší skupiny místo snahy o virtualizaci Meku pracovali, vydělali by si na fyzický Mek?',
  'Petr Weissar',
  true, false, 21)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 22: Sad - Jakub (AirBank work, bug stats, personal achievement)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000022', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  E'Platby na kontakt.\nVěc, která mě stresovala listopad/prosinec 2023 a díky ni mám celkem 280 vyřešených bugů za posledních 356 dní. Další za mnou je nějaký se 150.\nTak AirBank má 1 milion klientů plus. Všichni využívají mobilní aplikaci.\nPočet lidí, kteří měsíčně použijí platbu na kontakt? = 150 lidí\nWow..',
  'Jakub Minarik',
  true, false, 22)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 23: Glad - Jakub (banking incident, technical)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000023', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Když zapomeneš dát delete práva na serveru a banka pošle omylem platby za 2 miliardy.',
  'Jakub Minarik',
  true, false, 23)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 24: Glad - Petr (tax optimization, long, OSVČ scheme)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000024', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  E'Řešení na částky přes 2 miliony?\nOd 2 mega nejen, že člověk musí být plátce, ale zároveň nelze uplatňovat 60% výdaje. Tedy je nutno, těch 60% výdajů vytvořit nějako jinak a ideální by bylo sehnat další OSVČ, který bude fakturovat nám za konzultace a práce na projektu. Aka najmu někoho na vývoj Svatebky za kilo měsíčně a všechno je solved? 🤔\nZároveň ten člověk bude do 1,5 milionu jako vývojář, takže soc, zp a daně budou celkem 80k ročně. Dokotop.',
  'Petr Weissar',
  true, false, 24)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 25: Glad - Petr (about Vláďa, Kotlin, tech)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000025', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Vláďa říkal, že Kotlin zmizí z Androidu. Zajímají mě argumenty, proč a jak ho to vůbec napadlo 😱',
  'Petr Weissar',
  true, false, 25)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 26: Glad - Petr (train pass, IN100, practical calc)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000026', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  'Sdílená jízdenka IN100 pro až 4 osoby za 30k ročně. Možnost doplatit 1.třídu ofc. Šel by do toho někdo? Podle mě to smysl dává. Ojebem ČD trošku a to se vyplatí. Aktuálně jezdím 40x ročně za 300 což je 12 tisíc takže ještě dva lidi a vyplatí se.',
  'Petr Weissar',
  true, false, 26)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 27: Sad - Petr (long, pub story, social observation, emoji)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000027', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Jsem u vietnamce a je tam pár dezolátů. Týpek vypadal, že mu ještě dojíždí toluen a bavili se jaký pivo koupit když jim zbylo 27 korun. A shodli se že Plzeň ne 😂 a holka říká: Plzeň mi teď koupil Marek na benzínce za 80 korun a to jsem teda těžce nedávala, ty seš teda taky dobrej jsem mu řekla.... Nevím co si z toho odnést? Ale ovlivnilo to mou náladu',
  'Petr Weissar',
  true, false, 27)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 28: Sad - Petr (colleague interaction, income, emoji)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000028', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  E'Ptal jsem se kolegy co je plátce kolik platí na dph a daně a tak..\n\nA řekl mi na dotaz jestli je plátce:\n\nJá ano, protože jsem musel. Ale ty už jsi asi nemusel, ne? Nedávno se posouval obrat na 2M za rok. Nechci tě podceňovat, ale předpokládám, že jsi pod ním.\n\nUff 🤔 to mě teda nasralo 😂\nJakoby na jednu stranu je cool, že lidi myslí, že vyděláváš málo, ale ten člověk mi doslova napsal, že přeci nemůžu bejt tak dobrej 😂',
  'Petr Weissar',
  true, false, 28)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 29: Glad - Petr (Prague future, real estate, emoji, philosophical)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000029', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0003-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000000',
  E'Pan Kotula říkal, že Praha bude mít za 30 let 3,5 milionu lidí.\nFakt pořád není čas koupit byt? Chcete za 30 let v takovém městě stále žít? 🤔\n\nKde se vidíte v 50 letech? Je to jiné než současná pozice? A proč právě Pardubice? 🤎',
  'Petr Weissar',
  true, false, 29)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 30: Sad - Petr (EV advantage, humor, food)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000030', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  E'Další výhoda EV: Lidi do aut už nebudou moct lejt vyjetej olej, takže kolem tebe nebude 2x denně jezdit KFCčko..\nPak na to má člověk akorát chuť a ještě z toho přibere 🐔',
  'Petr Weissar',
  true, false, 30)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Card 31: Sad - Petr (EV rant, diesel hate, vulgar, passionate)
INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000012-0000-4000-8000-000000000031', 'a0000012-0000-4000-8000-000000000012', 'ca000012-0002-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000000',
  'Obrovské plus EVček je to, že nesmrdí.. po dlouhé době jsem teď jel ve městě v ranní špičce ze sídliště, kde potkáš nejvíc 1.9TDi na metr čtverečný.. chtěl jsem jet s otevřenýma oknama ale to prostě nešlo kurva. Debilní starý nafty - fosil spálit, zničit, ubodat a nahradit lahodnou elektřinou 📸',
  'Petr Weissar',
  true, false, 31)
ON CONFLICT (id) DO NOTHING;
