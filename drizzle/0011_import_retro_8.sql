-- Import Retro #8
-- Date: 2024-03-19 | 22 cards | Anonymous authors with AI guesses
-- Source: Retro_8_2024-3-19.csv

-- Ensure Anonymous user exists
INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES ('00000000-0000-4000-8000-000000000000', 'Anonymous', 'anonymous@rekapka.local', '#9CA3AF', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000008-0000-4000-8000-000000000008',
  'Retro #8',
  'completed',
  '2024-03-19',
  NULL,
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2024-03-19 17:00:00+00',
  '2024-03-19 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000008-0001-4000-8000-000000000008', 'a0000008-0000-4000-8000-000000000008', 'Mad', '😡', '#EF4444', 0),
  ('ca000008-0002-4000-8000-000000000008', 'a0000008-0000-4000-8000-000000000008', 'Sad', '😢', '#3B82F6', 1),
  ('ca000008-0003-4000-8000-000000000008', 'a0000008-0000-4000-8000-000000000008', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000008-0000-4000-8000-000000000001', 'a0000008-0000-4000-8000-000000000008', 'ca000008-0003-4000-8000-000000000008',
  '00000000-0000-4000-8000-000000000000',
  'kamion bliká doleva, aby sdělil, že můžete bezpečně předjíždět...',
  'Vladimír Tichý',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000008-0000-4000-8000-000000000002', 'a0000008-0000-4000-8000-000000000008', 'ca000008-0003-4000-8000-000000000008',
  '00000000-0000-4000-8000-000000000000',
  'čínská auta... jezdí, mají volant a 4 kola a carplay',
  'Vladimír Tichý',
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000008-0000-4000-8000-000000000003', 'a0000008-0000-4000-8000-000000000008', 'ca000008-0003-4000-8000-000000000008',
  '00000000-0000-4000-8000-000000000000',
  'apple vs. eu',
  'Petr Weissar',
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000008-0000-4000-8000-000000000004', 'a0000008-0000-4000-8000-000000000008', 'ca000008-0003-4000-8000-000000000008',
  '00000000-0000-4000-8000-000000000000',
  'Říkali jsme, že chceme častěji jezdit na víkendy na nějaké chalupy, a nemusí to ani být rozlučky. Bude ale vadit, pokud to bude rozlučka popř. oslava svatby Matěje a Aničky? Btw co děláte o víkendu 20. září?',
  'Matěj Daníček',
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000008-0000-4000-8000-000000000005', 'a0000008-0000-4000-8000-000000000008', 'ca000008-0003-4000-8000-000000000008',
  '00000000-0000-4000-8000-000000000000',
  'staronová práce',
  NULL,
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000008-0000-4000-8000-000000000006', 'a0000008-0000-4000-8000-000000000008', 'ca000008-0003-4000-8000-000000000008',
  '00000000-0000-4000-8000-000000000000',
  'latinská amerika, to asi bude levné co?',
  'Dušan Salay',
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000008-0000-4000-8000-000000000007', 'a0000008-0000-4000-8000-000000000008', 'ca000008-0003-4000-8000-000000000008',
  '00000000-0000-4000-8000-000000000000',
  'K čemu ti je git když sice děláš commity, ale nepushuješ je na origin 🤔',
  NULL,
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000008-0000-4000-8000-000000000008', 'a0000008-0000-4000-8000-000000000008', 'ca000008-0003-4000-8000-000000000008',
  '00000000-0000-4000-8000-000000000000',
  'Online scams - je nějaký bod, kdy už je legitimní victim-blaming?',
  'Petr Weissar',
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000008-0000-4000-8000-000000000009', 'a0000008-0000-4000-8000-000000000008', 'ca000008-0003-4000-8000-000000000008',
  '00000000-0000-4000-8000-000000000000',
  E'Už je to tady 😞\n\nV únoru jsem musel 3 MDs hodit do separé tabulky a nemůžu je vykázat..\n\nProč není limit pro plátce 3 miliony?\n\nA Vláďo, pověz mi prosímtě jak vypadá tvůj běžný účetní den a měsíc - co vše musíš sbírat, evidovat, psát knihu jízd apod?',
  'Jakub Minarik',
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000008-0000-4000-8000-000000000010', 'a0000008-0000-4000-8000-000000000008', 'ca000008-0003-4000-8000-000000000008',
  '00000000-0000-4000-8000-000000000000',
  E'AppParade 2024 - bude?\n\nPřihlásili jsme tam Svatebku? 💍',
  'Dušan Salay',
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000008-0000-4000-8000-000000000011', 'a0000008-0000-4000-8000-000000000008', 'ca000008-0003-4000-8000-000000000008',
  '00000000-0000-4000-8000-000000000000',
  E'ČSOB reklama na 1500,- k účtu.. jak může marketing pustit takový cringe? 😬\n\n\n\n\nhttps://youtu.be/poWnHpR4Bmw?si=oOGreAhT0d2suDfy',
  'Dušan Salay',
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000008-0000-4000-8000-000000000012', 'a0000008-0000-4000-8000-000000000008', 'ca000008-0003-4000-8000-000000000008',
  '00000000-0000-4000-8000-000000000000',
  E'Od nového roku se zvedly pokuty..\n\n135 kmh na 110 směr na HK kolem Vysoké.. 😱\n\nPán mě zastavil a omlouval se, že to musí mít minimální hodnota, což je 1500,-\n\nTak jsem mu řekl, že v pohodě, že už jsem přišel o víc peněz tím, že mě tady zdržuje 😂',
  'Vladimír Tichý',
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000008-0000-4000-8000-000000000013', 'a0000008-0000-4000-8000-000000000008', 'ca000008-0003-4000-8000-000000000008',
  '00000000-0000-4000-8000-000000000000',
  E'Odbočování do víceproudé komunikaci.\n\nLidi tam najíždí, dělají to blbě - nojo asi to neznají. 😠\n\nNaštěstí vyšel článek na gařážcz co čte mnoho lidi! 🙏\n\nMezitím lidi v komentářích:\n\nhttps://www.garaz.cz/clanek/servis-legislativa-a-tuhle-dopravni-situaci-byste-vyresili-jak-odbocovani-z-viceproudove-komunikace-do-viceproudove-je-vyssi-divci-ne-kazdy-to-zvladne-21011709',
  'Matěj Daníček',
  true, false, 13)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000008-0000-4000-8000-000000000014', 'a0000008-0000-4000-8000-000000000008', 'ca000008-0003-4000-8000-000000000008',
  '00000000-0000-4000-8000-000000000000',
  'Chčijící psi ve městě. Má to řešení?',
  'Matěj Daníček',
  true, false, 14)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000008-0000-4000-8000-000000000015', 'a0000008-0000-4000-8000-000000000008', 'ca000008-0003-4000-8000-000000000008',
  '00000000-0000-4000-8000-000000000000',
  E'Jaký byl Karibik? 🌊\n\nA.k.a. jak Kuba dostál svým slovům: "Tuhle zimu zůstanu v Praze" 🤔\n\n\n\n\n(Pro korektnost zima začala v listopadu a končí v březnu, abychom předešli časovým rozporům)',
  NULL,
  true, false, 15)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000008-0000-4000-8000-000000000016', 'a0000008-0000-4000-8000-000000000008', 'ca000008-0003-4000-8000-000000000008',
  '00000000-0000-4000-8000-000000000000',
  E'Rekapitulace:\n\nByl jsem v Libni.. 🤔\n\nPohorky přišly vhod. Na autě byl lišejník.\n\nV kavárně levný snídaně a plastové brčko v plastu.. WTF!\n\nAneb jak moc velká troska jsi, když máš kancl v obchodním domě Harfa? 🎶 (arf protože ostatní písmena už upadly)',
  'Jakub Minarik',
  true, false, 16)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000008-0000-4000-8000-000000000017', 'a0000008-0000-4000-8000-000000000008', 'ca000008-0003-4000-8000-000000000008',
  '00000000-0000-4000-8000-000000000000',
  E'5 týdnů bez alkoholu.. počínaje 14.2. (u mě) 🍺\n\nJak to jde/šlo a jak to jde/šlo Kubovi?',
  'Petr Weissar',
  true, false, 17)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000008-0000-4000-8000-000000000018', 'a0000008-0000-4000-8000-000000000008', 'ca000008-0003-4000-8000-000000000008',
  '00000000-0000-4000-8000-000000000000',
  E'Volal mi pan Kohout 😂\n\nDělá ve Švajcu.. a asi se trochu posunul a začal dělat se zajímavýma lidma.. hehe..\n\nNabídl mu spolupráci 🤝',
  'Petr Weissar',
  true, false, 18)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000008-0000-4000-8000-000000000019', 'a0000008-0000-4000-8000-000000000008', 'ca000008-0003-4000-8000-000000000008',
  '00000000-0000-4000-8000-000000000000',
  E'Nabízí se zaplatit Parabolu plnou verzi, abychom měli jeden sloupec a upravené behavior pro naše potřeby 🤔\n\nJsme s tím ok?',
  'Matěj Daníček',
  true, false, 19)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000008-0000-4000-8000-000000000020', 'a0000008-0000-4000-8000-000000000008', 'ca000008-0003-4000-8000-000000000008',
  '00000000-0000-4000-8000-000000000000',
  E'Netflix je vážně na píču - asi nastal čas, aby si každý platil své vlastní? 😞\n\nNebo lze připlatit pár korun a fungovat jako dřív?',
  NULL,
  true, false, 20)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000008-0000-4000-8000-000000000021', 'a0000008-0000-4000-8000-000000000008', 'ca000008-0003-4000-8000-000000000008',
  '00000000-0000-4000-8000-000000000000',
  'Little Saint James island. Novy investor koupil ostrov a chce z neho vybudovat luxusni resort. Ale zhrzene picky jsou proti, ze to je pry neucta k jejich "pamatce".',
  NULL,
  true, false, 21)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000008-0000-4000-8000-000000000022', 'a0000008-0000-4000-8000-000000000008', 'ca000008-0002-4000-8000-000000000008',
  '00000000-0000-4000-8000-000000000000',
  'Vláda zařídí',
  NULL,
  true, false, 22)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

