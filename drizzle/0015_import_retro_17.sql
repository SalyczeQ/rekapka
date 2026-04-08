-- Import Retro #17
-- Date: 2024-11-02 | 29 cards | Anonymous authors with AI guesses
-- Source: Retro_17_2024-11-2.csv

-- Ensure Anonymous user exists
INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES ('00000000-0000-4000-8000-000000000000', 'Anonymous', 'anonymous@rekapka.local', '#9CA3AF', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000017-0000-4000-8000-000000000017',
  'Retro #17',
  'completed',
  '2024-11-02',
  NULL,
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2024-11-02 17:00:00+00',
  '2024-11-02 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000017-0001-4000-8000-000000000017', 'a0000017-0000-4000-8000-000000000017', 'Mad', '😡', '#EF4444', 0),
  ('ca000017-0002-4000-8000-000000000017', 'a0000017-0000-4000-8000-000000000017', 'Sad', '😢', '#3B82F6', 1),
  ('ca000017-0003-4000-8000-000000000017', 'a0000017-0000-4000-8000-000000000017', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000001', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  E'Byl jsem na Prague Car festivalu. Seděl jsem ve Fordu F-150.\n\nKoupil bych si to auto, když se dá pořídit za 1,3 milionu? 😱',
  'Vladimír Tichý',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000002', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  'Německo ve třicátých letech 21. století bude v piči. Máme se toho bát? Nebo se přirozeně najde jiný zdroj příjmů a burstu ekonomiky? 🤔',
  'Petr Weissar',
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000003', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  E'Prodával jsem hodinky a telefon.\n\nPixel 7 Pro za 4K (nový stojí 7,5k) s výpisem vad a fotkami. Ozval se týpek z Vysokého Mýta (to byl první red flag).\n\nNejdřív ať přijedu (říkám, že nemám auto), že dá peníze na vlak (odmítám) a nakonec přijel.\n\nVyskočil s dalšími dvěma cikány z auta v maskáčích. Všechno si zkoušel a našel šrám na displeji, který na fotce vidět jakože nebyl. Že prý nějaká slevička?\n\nDal jsem ho za 3,5k ať drží hubu a vypadne.\n\nDruhý den sms, že chrčí repráček a oprava za 1300 (prý co s tím udělám) 😆\n\nŽe ho vrátí nebo ať zaplatím celou opravu. Říkám mu ať mě nesere, že už mě stáhl o pět set, tak jsem mu nabídl, že mu pošlu 500 a ať drží hubu. Vzal to. Tedy telefon za 3K, což je za prasklý 2 roky starý pixel víc než dobrý 😆 ALE za jakou cenu kurva. Nesnáším prodávání.',
  'Dušan Salay',
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000004', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  E'VLADO Z MINULE:\n\n \n\nMatějova rozlučka appreciation post',
  'Petr Weissar',
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000005', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  'Zbavit se fosilních paliv a plynu co nejdřív je potřeba, abychom se zbavili závislosti na Rusku a Saudské Arábii. Bude to dobře pro nás a zároveň tyhle velmoci, které fungují jen díky prodeji svých zdrojů půjdou konečně do prdele.',
  'Petr Weissar',
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000006', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  E'VLADO Z MINULE:\n\n\n\n\n \n\nkrásná benzínka, fresh corner, vzduch u stojanů, jen ty internety nešlapou',
  'Petr Weissar',
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000007', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  E'Terka se mě občas ptá, jestli si fakt neřekneme nic o sobě. Tak se vás ptám postupně. Matěji, Kubo, Dušane, Vláďo.\n\n\n\n\nCo holky/kluci? Co rodina? Co finance? A co zdravíčko - slouží?',
  'Petr Weissar',
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000008', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  'Jak je v práci pro vás důležitý pracovni kolektiv ? Musíte si s nimi rozumet , chodit sportovat nebo na drink, nebo vám staci ze jsou dodry skillem a budete se od nich učit Profesně?',
  'Matěj Daníček',
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000009', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  'Mood club, plný mladých štětek, jen se tam chlastá, tančí, a znova dokola. Je to celkem nuda. Jak nás to mohlo v minulosti bavit?',
  'Matěj Daníček',
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000010', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  'single život, je to ok? Nebo už mi cinkají játra?',
  'Jakub Minarik',
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000011', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  'DAMI se se všemi rozchazi na oko dobře, a pak jim hodí klacky pod nohy. respektive Jindrovi , večere s Káčkem',
  'Dušan Salay',
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000012', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  'notifikace, datova Vs normální ? Jak moc musíš být senior vývojář mobilek aby si věděl jak  fungují?',
  'Dušan Salay',
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000013', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  'Dami se měni. skončila react divize, skončí i Java divize. Mobilky nemají budoucnost. Bude to jen PHP firma',
  'Dušan Salay',
  true, false, 13)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000014', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  'Overeployment konece na scéně? Md rate 15K is enough?',
  'Dušan Salay',
  true, false, 14)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000015', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  'Černobílý/e-ink telefon.',
  'Petr Weissar',
  true, false, 15)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000016', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  'Dnes máme skvělé rozloučení z Hradcem. Tohle město nám dalo mnohé, ale je čas posunout se dál. Na západ za lepším. Kapitola se uzavírá. Tímto vítáme Dušana v pražském výběru a těšíme se na přesilu <3',
  'Matěj Daníček',
  true, false, 16)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000017', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  'Pokud žiju ve velkém městě, ale z 99% trávím čas ve své čtvrti, která má stejný počet obyvatel jako malé město.. Jsem maloměšťák? 🙏',
  'Matěj Daníček',
  true, false, 17)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000018', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  E'SUMMARY dietka s Fitbitem:\n\n\n\n\nFull výsledky mám v sheetu jestli chcete, ale TLDR shozeno za 5 týdnů: 2,5kg tuku tedy denní deficit byl necelých 600 kCal.\n\n\n\n\nFitbit mi ukazoval větší výdej a je v podstatě by mi díky tomu vycházel bazální metabolismus 1900 kCal.\n\nPodle mě mám tak 1700, což ukazuje na to, že Fitbit přidává pouze 200 kCal denně. Což je víc než uspokojivé. Zvednu tedy na listopad deficit z 600 na 900 a fixnu tím Fitbit přepal 👍',
  'Vladimír Tichý',
  true, false, 18)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000019', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  E'Pod Antarktidou je údaje 10x tolik ropy, co je aktuálně všude jinde po Zemi.\n\nDohoda o nezneužívání antakrtidy trvá do nějakého roku 2048 tuším. Ihned potom můžem očekávat, že se zde bude vše těžit.\n\n\n\n\nCo si z toho odnést? Bude ještě ropa za 20 let tak ceněná, aby se budovaly doly v místech, kde teplota klesá pod 90 stupňů? Bude se ropa pálit rovnou na místě a převádět na "čistou" energii pro elektro průmysl? 🤔',
  'Dušan Salay',
  true, false, 19)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000020', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  '"Na zkušenou" do AirBank?',
  'Dušan Salay',
  true, false, 20)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000021', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  'Vlak a bus do berlína',
  'Dušan Salay',
  true, false, 21)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000022', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  'Jsme východ i proti Berlínu, chování řidičů, chodců, množství aut + modelový příklad - zavřený cyklopruh',
  'Dušan Salay',
  true, false, 22)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000023', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  'MD rate, jak rozumně boostit?',
  'Dušan Salay',
  true, false, 23)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000024', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  'Hřib se pochlubil novou rekonstrukcí Dukelských hrdinů podle konceptu z devadesátek',
  'Dušan Salay',
  true, false, 24)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000025', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  'Dostali jsme slevu na hypotéku? 🤔',
  'Petr Weissar',
  true, false, 25)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000026', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  'Že množství spálených kalorií je více méně konstantní už máme potvrzené (ačkoliv někteří z nás to neustále zpochybňují na základě anekdotálních zkušeností a nepřesných dat). A já se ptám: není to podobné se štěstím a spokojeností? Není to taky jen hodnota, která se dá jen dočasně vychýlit, ale vždycky konverguje k nějaké konstantě nehledě na okolnosti?',
  'Petr Weissar',
  true, false, 26)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000027', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  'Thajsko v únoru budu muset asi leavnout. 😞 Banka chce moc našich peněz na hypotéku a asi lepší cihly než pláže v Thajsku, bohužel 😠',
  'Petr Weissar',
  true, false, 27)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000028', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  E'Otevírám bývalou otázku po nějakém čase. Jste aktuálně spokojeni se svým životem? 🤔\n\nMáte už i ti co neměli nastavené cíle, které chtějí zdolat?',
  'Petr Weissar',
  true, false, 28)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000017-0000-4000-8000-000000000029', 'a0000017-0000-4000-8000-000000000017', 'ca000017-0003-4000-8000-000000000017',
  '00000000-0000-4000-8000-000000000000',
  E'VLADO Z MINULE:\n\n\n\n\n \n\ndeadliny vs sprinty pro motivaci',
  'Petr Weissar',
  true, false, 29)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

