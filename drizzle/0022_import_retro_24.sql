-- Import Retro #24
-- Date: 2025-07-25 | 20 cards | Anonymous authors with AI guesses
-- Source: Retro_24_2025-7-25.csv

-- Ensure Anonymous user exists
INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES ('00000000-0000-4000-8000-000000000000', 'Anonymous', 'anonymous@rekapka.local', '#9CA3AF', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000024-0000-4000-8000-000000000024',
  'Retro #24',
  'completed',
  '2025-07-25',
  NULL,
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2025-07-25 17:00:00+00',
  '2025-07-25 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000024-0001-4000-8000-000000000024', 'a0000024-0000-4000-8000-000000000024', 'Mad', '😡', '#EF4444', 0),
  ('ca000024-0002-4000-8000-000000000024', 'a0000024-0000-4000-8000-000000000024', 'Sad', '😢', '#3B82F6', 1),
  ('ca000024-0003-4000-8000-000000000024', 'a0000024-0000-4000-8000-000000000024', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000024-0000-4000-8000-000000000001', 'a0000024-0000-4000-8000-000000000024', 'ca000024-0003-4000-8000-000000000024',
  '00000000-0000-4000-8000-000000000000',
  'Kuba a jeho nové prciny?',
  'Jakub Minarik',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000024-0000-4000-8000-000000000002', 'a0000024-0000-4000-8000-000000000024', 'ca000024-0003-4000-8000-000000000024',
  '00000000-0000-4000-8000-000000000000',
  'Nějak mi pořád leží v hlavě, že mě Matěj nazval homofobem. Jsem tak spatnej?',
  'Matěj Daníček',
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000024-0000-4000-8000-000000000003', 'a0000024-0000-4000-8000-000000000024', 'ca000024-0003-4000-8000-000000000024',
  '00000000-0000-4000-8000-000000000000',
  'doporučuji nechodit k doktorům',
  NULL,
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000024-0000-4000-8000-000000000004', 'a0000024-0000-4000-8000-000000000024', 'ca000024-0003-4000-8000-000000000024',
  '00000000-0000-4000-8000-000000000000',
  'Proč nosit hotovost - aneb cvakem si při blackoutu pivo ve večerce nekoupíš',
  'Dušan Salay',
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000024-0000-4000-8000-000000000005', 'a0000024-0000-4000-8000-000000000024', 'ca000024-0003-4000-8000-000000000024',
  '00000000-0000-4000-8000-000000000000',
  'Jak mi Java dala artrózu 💀',
  'Petr Weissar',
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000024-0000-4000-8000-000000000006', 'a0000024-0000-4000-8000-000000000024', 'ca000024-0003-4000-8000-000000000024',
  '00000000-0000-4000-8000-000000000000',
  'Když budete používat AI příliš často, zakrní vám mozek. Schopnost hledat řešení se prokazatelně vytrácí. Tak možná občas zkuste zase programovat sami abyste potrénovali myslítko 🥰',
  'Dušan Salay',
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000024-0000-4000-8000-000000000007', 'a0000024-0000-4000-8000-000000000024', 'ca000024-0003-4000-8000-000000000024',
  '00000000-0000-4000-8000-000000000000',
  E'Další nesmyslné nařízení EU s povinnými cabin zavazadly.\n\nAkorát nám to zdraží letenky ve výsledku. A i nařízené velikosti jsou menší než průměrně byly.',
  'Petr Weissar',
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000024-0000-4000-8000-000000000008', 'a0000024-0000-4000-8000-000000000024', 'ca000024-0003-4000-8000-000000000024',
  '00000000-0000-4000-8000-000000000000',
  'Vadí Kubovi, že jsme často 3 s Pajulí, když ji všude tahám s sebou?',
  'Matěj Daníček',
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000024-0000-4000-8000-000000000009', 'a0000024-0000-4000-8000-000000000024', 'ca000024-0003-4000-8000-000000000024',
  '00000000-0000-4000-8000-000000000000',
  'Co se děje s Univerzita.app? 😱',
  NULL,
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000024-0000-4000-8000-000000000010', 'a0000024-0000-4000-8000-000000000024', 'ca000024-0003-4000-8000-000000000024',
  '00000000-0000-4000-8000-000000000000',
  'Middle income trap nepostihuje jen celé státy',
  'Vladimír Tichý',
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000024-0000-4000-8000-000000000011', 'a0000024-0000-4000-8000-000000000024', 'ca000024-0003-4000-8000-000000000024',
  '00000000-0000-4000-8000-000000000000',
  'Jel jsem MHD. Za 15 minut jízdy jsem se zpotil jak v sauně. Jak to má teda člověk používat?',
  'Jakub Minarik',
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000024-0000-4000-8000-000000000012', 'a0000024-0000-4000-8000-000000000024', 'ca000024-0003-4000-8000-000000000024',
  '00000000-0000-4000-8000-000000000000',
  'Dneska HR banky v All hands prezentaci vyzdvihovala, že poměr žen k mužům je 60:40. Už chápu proč tam děláte 😏',
  'Vladimír Tichý',
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000024-0000-4000-8000-000000000013', 'a0000024-0000-4000-8000-000000000024', 'ca000024-0003-4000-8000-000000000024',
  '00000000-0000-4000-8000-000000000000',
  E'Neházejte BIO odpad do směsi. Je to větší problém, než si myslíme.\nÚnik metanu ze skládek do atmosféry je nejen mrhání energií, ale hlavně otepluje atmosféru jako skleníkový plyn. ⚠️',
  'Matěj Daníček',
  true, false, 13)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000024-0000-4000-8000-000000000014', 'a0000024-0000-4000-8000-000000000024', 'ca000024-0003-4000-8000-000000000024',
  '00000000-0000-4000-8000-000000000000',
  'Nejposlednější podvod, který jsem zažil na Bazoši. Napsal jsem útočníkovi, že to je fakt dobrý ❤️',
  'Petr Weissar',
  true, false, 14)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000024-0000-4000-8000-000000000015', 'a0000024-0000-4000-8000-000000000024', 'ca000024-0003-4000-8000-000000000024',
  '00000000-0000-4000-8000-000000000000',
  'Jak proběhla žádost o 1 070 000,- od státu? 🤔',
  'Dušan Salay',
  true, false, 15)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000024-0000-4000-8000-000000000016', 'a0000024-0000-4000-8000-000000000024', 'ca000024-0003-4000-8000-000000000024',
  '00000000-0000-4000-8000-000000000000',
  'Konsolidace půjček v AirBank. Super věc. Auto už je moje ❤️ a navíc 800k na rekonstrukci. Splátka je přitom stejná jako byla 🤗 😂',
  'Petr Weissar',
  true, false, 16)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000024-0000-4000-8000-000000000017', 'a0000024-0000-4000-8000-000000000024', 'ca000024-0003-4000-8000-000000000024',
  '00000000-0000-4000-8000-000000000000',
  'Na internetu videa sestřih jak gudas vloni škrtil usa hráče. Popisek letos chyběl gudy. Češi v komentáři: yess haha jono dokotop.. dopiče co je tak super na tom že se někdo chová násilně. To se vztahuje i na MMA. Dafak se to někomu líbí? Zvrácenost',
  'Vladimír Tichý',
  true, false, 17)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000024-0000-4000-8000-000000000018', 'a0000024-0000-4000-8000-000000000024', 'ca000024-0003-4000-8000-000000000024',
  '00000000-0000-4000-8000-000000000000',
  'Už si pls s apokalyps AI kecama vytřete prdel.. jste fanatici.',
  'Dušan Salay',
  true, false, 18)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000024-0000-4000-8000-000000000019', 'a0000024-0000-4000-8000-000000000024', 'ca000024-0003-4000-8000-000000000024',
  '00000000-0000-4000-8000-000000000000',
  'Jak myslíte, že bude stát přidělovat povolení k pobytu Ukrajincům po válce?',
  'Vladimír Tichý',
  true, false, 19)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000024-0000-4000-8000-000000000020', 'a0000024-0000-4000-8000-000000000024', 'ca000024-0003-4000-8000-000000000024',
  '00000000-0000-4000-8000-000000000000',
  'Jaké je bydlení u tchána a tchyně? 🤔',
  NULL,
  true, false, 20)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

