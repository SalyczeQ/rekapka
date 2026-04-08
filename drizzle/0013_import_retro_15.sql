-- Import Retro #15
-- Date: 2024-08-31 | 28 cards | Anonymous authors with AI guesses
-- Source: Retro_15_2024-8-31.csv

-- Ensure Anonymous user exists
INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES ('00000000-0000-4000-8000-000000000000', 'Anonymous', 'anonymous@rekapka.local', '#9CA3AF', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000015-0000-4000-8000-000000000015',
  'Retro #15',
  'completed',
  '2024-08-31',
  NULL,
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2024-08-31 17:00:00+00',
  '2024-08-31 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000015-0001-4000-8000-000000000015', 'a0000015-0000-4000-8000-000000000015', 'Mad', '😡', '#EF4444', 0),
  ('ca000015-0002-4000-8000-000000000015', 'a0000015-0000-4000-8000-000000000015', 'Sad', '😢', '#3B82F6', 1),
  ('ca000015-0003-4000-8000-000000000015', 'a0000015-0000-4000-8000-000000000015', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000001', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  'Není lepší být lopata?',
  'Vladimír Tichý',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000002', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  'Je Telegram zlo?',
  'Vladimír Tichý',
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000003', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  '⚠️ DEEP TALK WARNING ⚠️',
  NULL,
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000004', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  'Latta.ai Ai hledač bugů. Ale vezme si váš code base. Šli by jste do toho?',
  'Petr Weissar',
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000005', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  'Dan se vrací do Čech, možná do Prahy, možná do Brna',
  NULL,
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000006', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  'Je 5€/hod nebo 15€ za den už moc za parkování v Tatrách? Nebo 8€ za psa na lanovku když dospělý stoji 16€ a dítě je zadarmo? Nemám problém zaplatit ale vemínko mě být úplně nebaví',
  'Dušan Salay',
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000007', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  'IGL v Rakousku. Pokuty v řádu 1000 eur. Je to moderní eko fašismus? Co si o tom myslíte?',
  'Petr Weissar',
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000008', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  'Neoptimalizuje Petr hodinovku moc? Neměl by více pracovat aby neměl tolik času koukat na parabol a posílat běžce stepní? 🤔',
  NULL,
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000009', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  'Když si koupíš Enyaqa, ale pak musíš šetřit baterku tím, že nepouštíš klimu.',
  NULL,
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000010', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  'Zatkli šéfa telegramu za to, že málo cenzuruje.',
  NULL,
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000011', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  'Dnes paní na benzině už věděla jakou omáčku chci do párečku. Proč tomu tak je? Chodím tam moc často, nebo se k lidem chovám hezky, čímž jsem výjimka a proto si mě pamatuji?',
  NULL,
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000012', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  'Little bit DEEPer: (not your mom) Jste stastni?',
  NULL,
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000013', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  'Plavba na jachtě na moři je vážně super. Přemýšlím o kapitánských zkouškách. Dali by jste si taky?',
  'Matěj Daníček',
  true, false, 13)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000014', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  'Byli jste někdy v Dolomitech? Já myslel, že to je strašně fancy drahej mainstream shit, ale bomba. Vyrazilo mi to dech. Ferraty super. Doporučuji.',
  NULL,
  true, false, 14)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000015', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  'Co říkáme na Liberec so far? 🤯 Jsem pojedeme příště?',
  NULL,
  true, false, 15)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000016', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  'Jak si Matěj vedl s úkoly v appce? Jak moc kazila spirit post rozlučky? 😂',
  'Petr Weissar',
  true, false, 16)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000017', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  E'Michal Černý opět využívá kontaktů a situací, ke kterým přišel jak slepý k houslím a propojil Míru s Fraňkem od Mikýře. Takže se možná AppBlock objeví v dalším z Mikýřových videí jako reklama 😂\n\nVlastně ta zpráva není nijak disturbing, ale přišlo mi to hrozně Michalovský a Mírovský a tak jsem to tady chtěl nadhodit, jestli si do toho můžeme rýpnout nebo ne. 🤔',
  NULL,
  true, false, 17)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000018', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  'Dovolená skončila. V Airbance už je potřeba pracovat. Půl appky se bude upravovat kvůli novému chytrému přehledu. Zvažte to, jestli byste v takové firmě chtěli pracovat. Jo a ještě mi srazí plat na 4K / MD. 😞',
  'Jakub Minarik',
  true, false, 18)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000019', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  'Bend 😊 nejlepší appka za kterou jsem kdy utratil peníze. Stretčink: výběr dle oblasti, času, úrovně. Už po týdnu jsem vyřešil občas se vracející issuesky s ramenem a trapézy.',
  'Petr Weissar',
  true, false, 19)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000020', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  'S Vladaname byla vetsi zabava kdyz nepracoval.',
  NULL,
  true, false, 20)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000021', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  'Kdy dát podniku špatnou recenzi? Není srabáctví nic neříct ale psát to pak na internet?',
  'Matěj Daníček',
  true, false, 21)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000022', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  'Podprsenky s kosticemi jsou pro boomery. Mladí chodí na Evu od pasu nahoru. Jak to vnímáte? Za mě dobrý, ale je tam velké ALE protože teď chodí bez podprsenky i ženy, které by neměly. Jo, je to blbý to takhle říct, ale taky nechodím v croptopu když nemám formu, ne?',
  NULL,
  true, false, 22)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000023', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  'Jak se Dušanovi líbilo na plánu A s koněm na plachetnici na plavbě snů?',
  NULL,
  true, false, 23)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000024', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  'Jak si Kuba užívá standing desk? 😍',
  NULL,
  true, false, 24)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000025', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  'Tlak na úspěch. Nemoc dnešní doby. Ovlivňuje všechny v dobrém i špatném slova smyslu. Mnoho lidí to neunesou a mají depresi. Jak to máte vy? 😔',
  'Matěj Daníček',
  true, false, 25)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000026', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  'Matěj už není svobodný. Musí přijít standartní otázka: tak jaký to je být ženatý? 😂',
  NULL,
  true, false, 26)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000027', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0003-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  'V Dami napsali článek na téma: jak získat dotace na digitalizaci podniku. Je to návrh pro klienty aby pro Dami měli prachy nebo samo Dami jako IT firma potřebovala digitalizaci aka nejsou klienti, sežeň dotaci? ⛔',
  NULL,
  true, false, 27)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000015-0000-4000-8000-000000000028', 'a0000015-0000-4000-8000-000000000015', 'ca000015-0002-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000000',
  'Ne',
  NULL,
  true, false, 28)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

