-- Import Retro #23
-- Date: 2025-06-06 | 40 cards | Anonymous authors with AI guesses
-- Source: Retro_23_2025-6-6.csv

-- Ensure Anonymous user exists
INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES ('00000000-0000-4000-8000-000000000000', 'Anonymous', 'anonymous@rekapka.local', '#9CA3AF', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000023-0000-4000-8000-000000000023',
  'Retro #23',
  'completed',
  '2025-06-06',
  NULL,
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2025-06-06 17:00:00+00',
  '2025-06-06 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000023-0001-4000-8000-000000000023', 'a0000023-0000-4000-8000-000000000023', 'Mad', '😡', '#EF4444', 0),
  ('ca000023-0002-4000-8000-000000000023', 'a0000023-0000-4000-8000-000000000023', 'Sad', '😢', '#3B82F6', 1),
  ('ca000023-0003-4000-8000-000000000023', 'a0000023-0000-4000-8000-000000000023', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000001', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  'Withings váha po půl roce chození třikrát týdně do posilky: získal jste 0.3kg svalů. Je to celé fucking guesswork nebo je Matěj akorát hovno?',
  'Matěj Daníček',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000002', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  'Očkování. Poprvé jsem pochopil proč někdo vůbec přemýšlí že to nechce.',
  'null',
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000003', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  'Co Kubovo koleno? Jak šla operace a jaké jsou výhledy na rekonvalescenci?',
  'Petr Weissar',
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000004', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  'Jak se měl Dušan na Maltě? Je pravda, že celý ostrov smrdí po chcankách?',
  'Dušan Salay',
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000005', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  'IT konference: pokud člověk nechce dělat networking, tak mají smysl maximálně tak za firemní peníze, protože se tam člověk nic moc úžasného nedozví ... někdo jiné zkušenosti?',
  'Petr Weissar',
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000006', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  'Kterak mě dvě černotyb vyléčily z astmatu...',
  'Petr Weissar',
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000007', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  E'Petr:\n\nAž se někdy zase dostaneme k tomu, že ženský mají stejný práva a nekouká se na ně jako na štětky...\n\n\n\nReklama mBank, kde týpek u pivka ukazuje na holku prsten, protože holkám manželé imponují, ale ono to nezafunuje.. Naštěstí je to platební prsten, čímž typka hned přijde a jde s ním na rande 👏 \n\n\n\nHolky jsou totiž jen zlatokopky ❤️  a chlapi mají prostě vždycky platit..\n\n\n\nZa mě bych rád, aby mBank krachla, děkuji',
  'Petr Weissar',
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000008', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  E'Petr:\n\nRychlost do porodnice průměrné 92kmh',
  'Dušan Salay',
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000009', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  'Aby byla diskuze fér: 2 trigger pointy - alence bychom měli být vděčni, - jak sis rád vzal penízky za covidu pro osvč',
  'Dušan Salay',
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000010', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  'Jak je na tom Dušanovo stěhování do Prahy? A do jaké části Prahy by se měl mladý, nezadaný vývojář v dnešní době stěhovat? A proč zrovna Holešovice?',
  'Vladimír Tichý',
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000011', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  'Už víme, že nedostatek peněz kazí charakter. Tudíž nadbytek peněz ho vylepšuje? A co charakterem naopak dělá přemíra zadlužení?',
  'Vladimír Tichý',
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000012', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  E'Vlado:\n\npamatujete na Michala Jinocha?',
  'Jakub Minarik',
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000013', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  'Dušan nemůže na rfp protože letí na Madeiru. Letí tam v sobotu. Rfp končí v sobotu.',
  'Dušan Salay',
  true, false, 13)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000014', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  E'Kuba:\n\nPSA turnaj o $220k. Vstup zdarma. V publiku stejne skoro nikdo. \n\n\n\n\n\n\n\nExistuje mene divacky zajimavy sport nez squash?',
  'Jakub Minarik',
  true, false, 14)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000015', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  E'Jakub:\n\nDruhej fulltajm. Jak na to?',
  'Jakub Minarik',
  true, false, 15)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000016', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  'Jak je to tedy s tou propagandou, Čínou a influencerama? Není jakákoliv reklama propagandou? Naštval by nás cestopis po USA, kde by se nezmiňovalo vyvražďování indiánů stejně? Kde je ten rozdíl?',
  'null',
  true, false, 16)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000017', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  'Proč pořád řešíme kdo někam lítá a kdo ne? Vždyť je to buřt ne?',
  'null',
  true, false, 17)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000018', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  'Zamotaný románek, se mi vyřešil sám .',
  'null',
  true, false, 18)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000019', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  '160 na dřep mezitím co sajete dýmky.',
  'null',
  true, false, 19)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000020', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  'Pořídil jsem si surf skate. Mega zábava. Doporučuji. Ale s chrániči.',
  'null',
  true, false, 20)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000021', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  'měli bysme upravit naši zdravici',
  'null',
  true, false, 21)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000022', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  'nadešel čas se odstěhovat tam, kam patříme?',
  'null',
  true, false, 22)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000023', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  'tramvaje v čr',
  'null',
  true, false, 23)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000024', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  'Homo svatba',
  'null',
  true, false, 24)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000025', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  'Konečně pořádná droní akcička',
  'null',
  true, false, 25)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000026', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  'Souhlasíte s tím, že jsme teď na peaku a žijeme si svůj prime time? A jak si užíváte svůj prime time?',
  'null',
  true, false, 26)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000027', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  'AirBank, jediná banka, která umožní 6 hodin v pracovní době čekat v nemocnici /nice (gify nefungují)',
  'null',
  true, false, 27)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000028', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  'Matěj si naše rady nevzal k srdci.. pořád jen pracuje..',
  'null',
  true, false, 28)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000029', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  'Už si pls s apokalyps AI kecama vytřete prdel.. jste fanatici.',
  'Petr Weissar',
  true, false, 29)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000030', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  'Na internetu videa sestřih jak gudas vloni škrtil usa hráče. Popisek letos chyběl gudy. Češi v komentáři: yess haha jono dokotop.. dopiče co je tak super na tom že se někdo chová násilně. To se vztahuje i na MMA. Dafak se to někomu líbí? Zvrácenost',
  'Petr Weissar',
  true, false, 30)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000031', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  'Konsolidace půjček v AirBank. Super věc. Auto už je moje ❤️  a navíc 800k na rekonstrukci. Splátka je přitom stejná jako byla 🤗  😂',
  'Vladimír Tichý',
  true, false, 31)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000032', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  E'Petr:\n\nHygienik ke stavbě a letišti. Zakázáno stavět, nutno filtrovat až 60 dB, nebo nutné povinné odvětrávání? Začíná mě stát srát',
  'Petr Weissar',
  true, false, 32)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000033', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  E'Vlado:\n\nzázračný lék? 💊',
  'Petr Weissar',
  true, false, 33)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000034', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  E'Petr:\n\nMěl bys přijít o papíry, když jezdíš 300 po silnicích? Chtěli byste někoho takového potkat? V těhlech rychlostech je řidič nepředvídatelný pro ostatní řidiče a nehoda se může stát jednoduše. Lepší zavřít dřív než někoho zabije?',
  'Vladimír Tichý',
  true, false, 34)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000035', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  E'Petr:\n\nJak to dopadlo s Garminem, kterému přišla zpráva ohledně private SDK ze soukromého Gmailu? 😂',
  'Matěj Daníček',
  true, false, 35)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000036', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  E'Vlado:\n\nPáteřní cyklostezka zavřena, objízdná trasa neexistuje, Česko patří na východ',
  'Matěj Daníček',
  true, false, 36)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000037', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  E'Matěj:\n\nVířivka na zahradě - říkal jsem si, že to je píčovina, ale nakonec docela dobrá věc',
  'Vladimír Tichý',
  true, false, 37)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000038', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  E'Matěj:\n\nDušan vybíral zážitek - co nakonec vybral? A doporučil by?',
  NULL,
  true, false, 38)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000039', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  E'Vlado:\n\npřecenil jsem svoji gym formu, nechcete někdo trika ve velikosti M z decathlonu? jednou vyprané',
  NULL,
  true, false, 39)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000023-0000-4000-8000-000000000040', 'a0000023-0000-4000-8000-000000000023', 'ca000023-0003-4000-8000-000000000023',
  '00000000-0000-4000-8000-000000000000',
  'Proč si lidi kupují velká auta? Protože mají malé péro, nebo aby s ním mohli dělat škodu při parkování na jiných autech 😠',
  NULL,
  true, false, 40)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

