-- Import Retro #19 - Olmidylqo_v2
-- Date: 2025-01-02 | 54 cards | Anonymous authors with AI guesses
-- Source: Retro_19_Olmidylqo_v2_2025-1-2.csv

-- Ensure Anonymous user exists
INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES ('00000000-0000-4000-8000-000000000000', 'Anonymous', 'anonymous@rekapka.local', '#9CA3AF', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000019-0000-4000-8000-000000000019',
  'Retro #19',
  'completed',
  '2025-01-02',
  NULL,
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2025-01-02 17:00:00+00',
  '2025-01-02 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000019-0001-4000-8000-000000000019', 'a0000019-0000-4000-8000-000000000019', 'Mad', '😡', '#EF4444', 0),
  ('ca000019-0002-4000-8000-000000000019', 'a0000019-0000-4000-8000-000000000019', 'Sad', '😢', '#3B82F6', 1),
  ('ca000019-0003-4000-8000-000000000019', 'a0000019-0000-4000-8000-000000000019', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000001', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Vláďa mi zařídil Multisport. Už zase můžu žít naplno ♥️',
  'Petr Weissar',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000002', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'vlado: Ve všech životních fázích jsem měl dostatek peněz. Ať už jako malý capart z kapesného, nebo jako brigádník, či čerstvý pracant v IT.',
  'Vladimír Tichý',
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000003', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'vlado: jsem fakt rád, že jsme to dali až do Olmíku',
  'Vladimír Tichý',
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000004', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Dušan: Víte jak vznikl název pro blue tooth?',
  'Dušan Salay',
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000005', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'vlado: fedora 41 je nejlepší systém there is, change my mind',
  'Dušan Salay',
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000006', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'KUBA: Palec hore pro smartwings: držák na telefon.',
  'Jakub Minarik',
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000007', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Naobordovali jsme Matěje správně na instagram ?',
  NULL,
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000008', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'je kubova pohodlnost už omezující?',
  NULL,
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000009', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Jak je na tom Kuba s AirBankou? Jiz plne onboarded?',
  'Dušan Salay',
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000010', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Jaké máte náklady, kolik ročně ušetříte peněz? Bude to stačit na hypo bez změny životního stylu?',
  NULL,
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000011', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Míra stále nezvládá můj odchod do Dami',
  NULL,
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000012', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Kůň vyprávěl o tom jak se za nás pral u Káćka. Přitom mu vždycky lezl do prdýlky 😔',
  NULL,
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000013', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Točící se laser za 2 mega = zaměření baráku za 40minut a 25k',
  NULL,
  true, false, 13)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000014', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Cestovatelské retro se koná 👍 ale příště třeba v potaz vzít vánoční akce',
  NULL,
  true, false, 14)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000015', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Research: Jaké jsou tři redflags které u holek nedáváte?',
  NULL,
  true, false, 15)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000016', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'V klubu na vetsi akci bez kapky alkoholu. Jak to slo? Ma něco takového smysl nebo společenská sebevražda?',
  NULL,
  true, false, 16)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000017', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'TSLA za 400$+, prodáno v dubnu za 180$ 😢 proč Tesla roste, když její auta už nejsou tak výjimečná?',
  NULL,
  true, false, 17)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000018', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Inteligentní systém semaforů v HK získal ocenění v kategorii stavba roku. Zrychlují průjezd záchranek, hasičů nebo MHD. Obecně zvažuje propustnost o desítky procent. Lidé v komentářích se však zmiňují o systému po lobotomii, nepouštěči ze všech směrů apod. Čím to je, že jsou lidé tohoto názoru?',
  NULL,
  true, false, 18)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000019', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'to si takhle zaparkuješ u mekíska',
  NULL,
  true, false, 19)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000020', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Marihuana by se měla zakázat a uživatele trestně stíhat. Když vlezu do MHD a smrdí to tam tou mrdkou před kterou není úniku, tak je to fakt na piču. Konec brečkání..',
  NULL,
  true, false, 20)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000021', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  E'Karoq vs. Elroq\n\n\n\n\nElroq výhody - manévrovatelnost díky platformě, provoz na km je 1/3 ceny, větší zrychlení i odpich.\n\n\n\n\nKaroq výhody - delší dojezd o 300 km, větší max rychlost (nemá omezovač zatím)\n\n\n\n\nCenově stejné.\n\nProč by si vůbec někdo kupoval Karoq?',
  NULL,
  true, false, 21)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000022', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  E'Jak dlouho bude ještě společnost nastavená tak, že mužství = benzínový 5l, motorka nebo zarytý odmítač LGBTQ?\n\n\n\n\nKdy společnost začne uznávat to, že si jako muž zvládneš poradit, obhospodaříš rodinu nebo lidi na kterých ti záleží, zachráníš ročně 10 želv a budeš inspirovat ostatní?\n\n\n\n\nDoufám, že tohle vymře s naší generací a mladí už nebudou takoví zabedněnci povrchní 👏',
  NULL,
  true, false, 22)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000023', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  E'Vy vyznavači a milovníci hlavního města Prahy. Už jsme si vyjasnili, že tam nemáte trvalé bydliště, protože je to špatný město a v hloubi duše víte, že tam nechcete umřít.\n\nDalší otázka je: máte tam praktika? zubaře? Nebo se přeci jen na Prahu nechcete tolik vázat?\n\n\n\n\nProč vlastně stále přesvědčujete některé z nás, aby se do toho molochu nastěhovali a nevyužívali jen jeho občasné pohostinosti a peněz?',
  NULL,
  true, false, 23)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000024', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  E'Jsem v právu nasraný, když Pajule nechce vůbec tu situaci mezi náma řešit, ani se nějak final sejít a uzavřít.\n\nBe honest, u are my bros 🏩',
  NULL,
  true, false, 24)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000025', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Delal jsem upravy do Python backend service a Angular FE. A musim rict, ze ve frameworkach a jazycich, ktere nejsou uplne moje native, tak sila Copilot assistenta je mnohem vyssi.',
  NULL,
  true, false, 25)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000026', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Jezdit sam v 🐻, is ok nebo prebytecny rozmach? Masaze jsou super, spotreba uz tolik ne.',
  'Vladimír Tichý',
  true, false, 26)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000027', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Poprali jsme všichni Vladovi?',
  'Vladimír Tichý',
  true, false, 27)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000028', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Tak už klíče zacinkaly..',
  'Vladimír Tichý',
  true, false, 28)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000029', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Prodal jsem BTC, když byl za 97k USD, jsem dement?',
  'Vladimír Tichý',
  true, false, 29)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000030', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Prodal jsem BTC den předtím než poslanci zavedli časový test?',
  'Dušan Salay',
  true, false, 30)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000031', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  E'Vadí vám někomu WOKE?\n\n\n\n\nPokud ano, čeho přesně se bojíte nebo vám vadí? Proč to v jiných zemích funguje?\n\n\n\n\nNení pokrytecký odsuzovat Islámský režim se zahalováním žen a legálním minimálním věku pro svatbu se ženou 13 let a AT the same time být proti lgbt? 🤔',
  'Jakub Minarik',
  true, false, 31)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000032', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'filozofická: Jaký je váš nejbližší ale velký cíl Za kterým jdete?',
  'Vladimír Tichý',
  true, false, 32)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000033', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'PS5 pro je venku. Ale bez mechaniky a za 21K . Vyplatí se to?',
  'Vladimír Tichý',
  true, false, 33)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000034', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Rozšiřují se občas vaše kruhy o nové lidi? Nebo se pohybujete pořád ve stejné bublině lidí Či se ten okruh dokonce zmenšuje.',
  'Petr Weissar',
  true, false, 34)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000035', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  E'Proč je v Česku stále takový problém pro lidi pochopit to, když někdo o znásilnění promluví až po několika letech? 🤔\n\nTi, co se do toho nedokáží vcítit by si měli pustit mini seriál Pět let na iVysílání. Je to hezky přiblížený a makes sense 👏',
  'Vladimír Tichý',
  true, false, 35)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000036', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  E'S Vláďou jsem řešil, že jsem neměl trávu 8 let a nechybí mi. Načež přijedu domů a předávkuju se THC 😂\n\n\n\n\nJsem v programu se zádama, kdy dávkuju denně kapky s canabis s tím, že nevím jestli to je nebo není placebo. No, trochu jsem doháněl missnuté dávky z anglie a nevyšlo to.\n\n\n\n\nOpět stejné stavy, kdy jsem málem zdechnul panikou a ztrátou focusu. Fakt mi ta věc nedělá dobře 😠',
  'Matěj Daníček',
  true, false, 36)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000037', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Poslouchal jsem podcast o neutrální uhlíkové stopě - meeting OSN co se koná každý rok. Je to super, že se s tím státy snaží něco dělat i když to pro mnohé znamená ztrátu příjmu - státy co žijí z ropy. Čína začala vyrábět větrné elektrárny a soláry levně. Letos půl aut co si prodalo bylo elektro, čímž v eko přístupu brzy nechtěně předběhne evropu. Zmiňuju to proto, protože se stále najdou lidi, kteří absolutně nechápou rozsah aktuálního oteplování v důsledku emisí a tvrdí, že elektro nemá co diktovat Brusel ale trh. Tahle věc je mnohem větší než nějaké umělé systémy jako je ekonomika a trh. Lidi nemají pokoru. Pojďme to změnit a lidem co to nechápou to vysvětleme. Je to pro nás to nejlepší a nikomu to neubližije. Jak k tomu přispějete vy?',
  'Petr Weissar',
  true, false, 37)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000038', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'V dnešní době pořád nemůžeš nic plánovat. Jedu vlakem z Pha a mám mít v PCE 5 minut na přestup na mhd, jinak budu čekat další půl hodinu. Vlak však během hodiny nabere 7 minut zpoždění. Jak se to vůbec může stát, když na trase není výluka? Proč to v Japonsku jde a tady ne. Myslím že by EU měla stanovit maximální zpoždění vlaků jinak dráhy platí pokuty.',
  'Petr Weissar',
  true, false, 38)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000039', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  E'0-4 roky trvalo dostat se na 30 tisíc Kč na brigádách měsíčně.\n\nTři roky full-time jsem dřel abych se dostal na 50k fakturu a marně. Musel jsem kvůli té hranici do jiné práce. \n\nZdvojnásobit částku trvalo další 3 roky. V průběhu dalšího 3. roku se to opět znásobí.\n\n\n\n\nOtázka: Má cenu to ještě pushovat na další 3 roky v jiné firmě, nebo je to už strop? 🤔\n\n\n\n\nCo byste řekli svému mladšímu já když byste si mohli něco předat 10 let zpět?',
  'Vladimír Tichý',
  true, false, 39)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000040', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  E'Musk chce zakázat remote office. Logický tah pro muže, který žije prodejem prostředků, který přesouvá lidi z domu do práce. \n\nKdyž by Musk vlastnil ZOOM, Teamsy a žil z toho, tak by nic takového nechtěl.\n\nChange my mind, že je to zaujatá pička.',
  'Vladimír Tichý',
  true, false, 40)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000041', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  E'Svět je pro mladé plné dokonalostí na sítích - kariéra, vzhled, sex.. Kdo by pak chtěl žít nudný život plný nedokonalostí? \n\n\n\n\nCo si o tom myslíte? Měly by se regulovat telefony a sítě pro děti do 15 let?',
  'Dušan Salay',
  true, false, 41)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000042', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'AirBank má omezený budget na příští rok co se týče peněz pro kontraktory. Je konec žní? 🌽 ("Museli jsme to tam trochu přeskládat")',
  'Dušan Salay',
  true, false, 42)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000043', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  '22 kandidátů, z toho 15 dobrých. Jak tohle dopadne? ANEB Co Kuba řekl v 1. kole pohovoru v Airbank? Proč nejprve všichni říkali, že je dobrej a do 2. kola půjde a pak najednou že ne?',
  'Petr Weissar',
  true, false, 43)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000044', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Psáno 13. 11. ve vlaku z Prahy do Pce, když mi krysy poslali společnou fotku z gymu. 4 hodiny potom, co jsem psal jak je listopad depresivní a že jsem nešťastnej. Děkuju za endorfíny, které jsem cvičením s kamarády dostal - akorát že vůbec.',
  'Jakub Minarik',
  true, false, 44)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000045', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Manželství stejnopohlavních párů. Co je komu co do toho, kdo koho kam mrdá a kdo s kým kde jak žije. Proč to holanďani pochopili a uznali už v roce 2001 a my to stále neuznáváme? 👦 👦',
  'Petr Weissar',
  true, false, 45)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000046', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Jaký je to život, když musíš ve 30 každý rok dva na FB repostnout fotky ze střední s tím, jak to bylo super skvělý. Když pomynu fakt, že to skvělý nebylo, tak vám přijde ok at nad tím pořád rozplývat? A ano, příspěvek publikovala nejtlustší holka ze třídy žijící v Broumově. 🧈',
  'Petr Weissar',
  true, false, 46)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000047', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Listopad je nejhorší měsíc. Je zima a vlhko, hnusný barvy, smrad tlejícího listí, tma, bez sněhu.. Myslím že už vloni jsem to do retra dával a stále to platí. Pls make listopad end. ✅',
  'Matěj Daníček',
  true, false, 47)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000048', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'vlado: Příjmy (vs. výdaje) 2024, jak jste na tom?',
  'Matěj Daníček',
  true, false, 48)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000049', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'VLADO: gymísek je fakt dobrá věc',
  'Vladimír Tichý',
  true, false, 49)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000050', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Nastoupí Kuba do AirBank? 🤔',
  'Vladimír Tichý',
  true, false, 50)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000051', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  E'Fiala spustil s ODS a celkově SPOLU web a rozhovory a kampaně na to, že jsou nejlepší vláda co tu byla od 89.\n\nMyslím si, že je to výherní strategie - Babiško a ostatní dělají to samé a lidi tomu věří. Dokáže SPOLU přitáhnout nové voliče od Babiška? 🙏\n\nMoc bych si to přál jen kvůli tomu, aby se ukázalo, že lidi jsou tupí a jen hloupě naslouchají.',
  'Jakub Minarik',
  true, false, 51)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000052', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Druhý den po obstřiku bederní páteře. Až když člověk přestane cítit bolest, uvědomí si, jak moc špatný to je. Dá se na tom udělat závislost?',
  'Petr Weissar',
  true, false, 52)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000053', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Vláďa mi zařídil Multisport. Už zase můžu žít naplno ♥️',
  'Dušan Salay',
  true, false, 53)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000019-0000-4000-8000-000000000054', 'a0000019-0000-4000-8000-000000000019', 'ca000019-0003-4000-8000-000000000019',
  '00000000-0000-4000-8000-000000000000',
  'Takže jak to je s těmi společnými výlety? Jet v listopadu s lidma z práce na kanáry a pak znovu na silvestra je ok, ale jet tam znovu za 2 měsíce je problém? 🤔 Takže kdo jsou ti praví kamarádi?',
  'Petr Weissar',
  true, false, 54)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

