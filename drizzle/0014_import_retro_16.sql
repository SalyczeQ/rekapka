-- Import Retro #16
-- Date: 2024-10-13 | 33 cards | Anonymous authors with AI guesses
-- Source: Retro_16_2024-10-13.csv

-- Ensure Anonymous user exists
INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES ('00000000-0000-4000-8000-000000000000', 'Anonymous', 'anonymous@rekapka.local', '#9CA3AF', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000016-0000-4000-8000-000000000016',
  'Retro #16',
  'completed',
  '2024-10-13',
  NULL,
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2024-10-13 17:00:00+00',
  '2024-10-13 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000016-0001-4000-8000-000000000016', 'a0000016-0000-4000-8000-000000000016', 'Mad', '😡', '#EF4444', 0),
  ('ca000016-0002-4000-8000-000000000016', 'a0000016-0000-4000-8000-000000000016', 'Sad', '😢', '#3B82F6', 1),
  ('ca000016-0003-4000-8000-000000000016', 'a0000016-0000-4000-8000-000000000016', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000001', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  E'Google play console. Nový rekord v počtu dní na kontrole appky. Tohle píšu 4. den, tak jsem zvědav za jak dlouho mi vydají appku ven.\n\nIronie je, že jsem čekal 3 týdny než Michal konečně vydá iOS abychom to poslali společně. Přičemž tímto iOS vyšlo dřív protože to bylo na review 3 dny 😂',
  'Petr Weissar',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000002', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  E'Několik desítek procent věří v to, že bůh zachránil Trumpa před úmrtím protože je spasitelem Ameriky. Propaganda se v tomto duchu rozjela natolik, že strhává další a další lidi.\n\nMěli bychom si brát USA jako příklad, když to jsou stále pánbíčkáři? 🤔',
  NULL,
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000003', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  'nový projekt, srdcovka',
  NULL,
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000004', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  'Cítíte se v Evropě bezpečně? Může se zopakovat 2sv válka? v Německu i Francii se daří už taky populistum ve volbách',
  'Petr Weissar',
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000005', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  'Fízlové mají málo peněz, tak dávají pěšákům málo peněz, tak to nikdo nechce dělat, takže snižují podmínky pro vstup, takže tam může dělat člověk bez maturity , takže na školení ani nezvládne na PC zadat adresu do adresního řádku ... A tohle má mít zbroják a respektovat nějaká základní práva lidi 👍',
  NULL,
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000006', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  'Je nedostatek dětských psychologů. Teenageři mají deprese a páchají sebevraždy. Mimo ty hlavní aspekty tahle generace poslouchá Český rap, který když v posilce hraje, chci si vzít život taky. Tahle hudba jim nepomáhá. Change my mind. Konkrétně: Calin - Safír. Na podporu mého argumentu když vznikl hiphop, tak negři začali dělat problém v NYC. The great blackout 2.',
  NULL,
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000007', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  'výhoda stárnutí: na běžné pozice se dostávají lidi našeho věku a boomeři odchází... najednou není problém mít k doktorovi/účetní/we rezervaci a zaplatit online ... anebo normálně komunikovat jako lidi',
  NULL,
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000008', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  E'Lean october. Spálené kalorie ponechány fitbitu. Jak jsem skutečně jedl, jaký byl reálný deficit?\n\n\n\n\nPřidává fitbit nějaké kalorie navíc?\n\nKolik jsem ušetřil peněz bez kupování monstrů, alkoholů a píčovin?\n\nO kolik klesla tepovka a zlepšil se spánek?\n\nZhubl jsem i přestože jsem v dietce měl párečky k snídani? 🌭',
  NULL,
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000009', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  'Nějaké realistické zkušenosti se smart homy? Jaké jsou možnosti? Stojí to za to? Nějaká rozumná open source řešení? Co bezpečnost?',
  NULL,
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000010', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  'Víte proč místo "monkey pox" v BBC říkají "m-pox"? Že by souvis s kontinentem, kde se opičí neštovice vyskytují nejvíc? 🤔',
  NULL,
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000011', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  'Je pravda, že když na tříproudé dálnici v osobním autě vjedete do pravého pruhu tak dostanete instantně rakovinu? Protože očividně si to mnoho řidičů myslí...',
  NULL,
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000012', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  'Měli bysme sepsat historii, jak vzniklo retro. Jednou to bude velmi nostalgický materiál.',
  NULL,
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000013', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  E'Poslední dny bylo hodně ježdění autem - cesta Rakouskem a Itálií. Všude jsem si dával bacha na pokuty. A najednou jsem v horách a volá mi pošťák a kde sem dopiči. A že mi to teda nechá na poště 😱\n\nTo mě teda nenechalo klidným, protože mi v mezidobě asi 5 lidí říkalo o pokutách z Rakouska a Itálie. No a teď se mi to úplně nehodí.\n\nNa poště byl balíček z aliexpres 😂 Náramek na hodinky za 20 korun mě vyděsil mega moc.',
  NULL,
  true, false, 13)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000014', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  'Byl Steve Ballmer na kokainu? https://youtu.be/_WW2JWIv6G8?si=dTqA-hHMZZgtV5Si',
  NULL,
  true, false, 14)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000015', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  E'TrenMaya. Vlaky na východě Mexika, které ušetří 2/3 času při cestování po památkách. Je to kontroverzní projekt, ale co je kontroverznější je to, že některé z linek/vlaků jsou dieselové 😀\n\nMá to smysl?',
  NULL,
  true, false, 15)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000016', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  'Dve entity, TrueU a Broker consulting. Popisu vám je. A rád bych si vyslechl co je podle vás lepší deal.',
  'Dušan Salay',
  true, false, 16)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000017', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  'Duolingo funguje.',
  NULL,
  true, false, 17)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000018', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  'Plavky zařízlý do anusu. Je to dostatečná kompenzace za plandavý kalhoty?',
  NULL,
  true, false, 18)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000019', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  'Blikání na kruhaku doleva. Možná jsem změnil názor.',
  NULL,
  true, false, 19)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000020', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  'Nové auto s manuálem a neadaptivnim tempomatem? Proč to existuje?',
  NULL,
  true, false, 20)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000021', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  'Kuba místo toho aby podporoval komunisty a Babiše radši letěl ze Španělska a zabíjel želvy. Ok nebo not ok?',
  'Jakub Minarik',
  true, false, 21)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000022', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  'Sejde se parta úředníků a rozdělí si posty v evropské komisi... a co že dostaneš jiný místo? však na každého něco zbyde, kdepak nějaká odbornost, s tím na Uršulu nechoď',
  NULL,
  true, false, 22)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000023', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  'Máš příjmy minus výdaje v plus 100 000 Kč? Tak to ti hypo na 8 mega nedáme. Máte tady totiž auto na sebe, ale kdyby bylo na IČO a odepisoval jste si ho, tak by to šlo. Aha, no ale ve smlouvě je moje IČO a neodepisuju si ho. Omg najs tak to vám 8 mega dáme 🥰 ANEB wtf! Hypotéky a OSVČ nejdou dohromady.',
  NULL,
  true, false, 23)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000024', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  'Pár dní prší a naprosto všichni jezdí autem i když MHD funguje. A nutno uznat že vlastně i busy jsou plný školáků. Takže když PCE přestane jezdit na kole, tak jsou silnice celý den total ucpaný. Nemělo by se kolo nebo chůze povinně nakázat všem?',
  NULL,
  true, false, 24)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000025', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  E'GLOSA: Lidi mají moc peněz a služby stále nestíhají. Jaktože česká ekonomika nejede tolik jako U.S.A. když si taky hrabem jen na vlastním písečku s minimem exportu?\n\nNebo USA drží nad vodou export IT technologií a zbraní? 🤔',
  'Dušan Salay',
  true, false, 25)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000026', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  E'8 milionů za 1000m pozemku a domem na menší rekonstrukci?\n\nKoupil jsem to? 🤔',
  NULL,
  true, false, 26)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000027', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  E'Zbavit se fosilních paliv a plynu co nejdřív je potřeba, abychom se zbavili závislosti na Rusku a Saudské Arábii. Bude to dobře pro nás a zároveň tyhle velmoci, které fungují jen díky prodeji svých zdrojů půjdou konečně do prdele.\n\nPro Evropu je green deal mnohem důležitější, než vidí lidé co si dohlédnou jen na konec vlastního pozemku.\n\nChange my mind 🤔',
  NULL,
  true, false, 27)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000028', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  E'Prodával jsem hodinky a telefon.\n\nPixel 7 Pro za 4K (nový stojí 7,5k) s výpisem vad a fotkami. Ozval se týpek z Vysokého Mýta (to byl první red flag).\n\nNejdřív ať přijedu (říkám, že nemám auto), že dá peníze na vlak (odmítám) a nakonec přijel.\n\nVyskočil s dalšími dvěma cikány z auta v maskáčích. Všechno si zkoušel a našel šrám na displeji, který na fotce vidět jakože nebyl. Že prý nějaká slevička?\n\nDal jsem ho za 3,5k ať drží hubu a vypadne.\n\nDruhý den sms, že chrčí repráček a oprava za 1300 (prý co s tím udělám) 😆\n\nŽe ho vrátí nebo ať zaplatím celou opravu. Říkám mu ať mě nesere, že už mě stáhl o pět set, tak jsem mu nabídl, že mu pošlu 500 a ať drží hubu. Vzal to. Tedy telefon za 3K, což je za prasklý 2 roky starý pixel víc než dobrý 😆 ALE za jakou cenu kurva. Nesnáším prodávání.',
  NULL,
  true, false, 28)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000029', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  'Matějova rozlučka appreciation post',
  NULL,
  true, false, 29)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000030', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  'deadliny vs sprinty pro motivaci',
  NULL,
  true, false, 30)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000031', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  'krásná benzínka, fresh corner, vzduch u stojanů, jen ty internety nešlapou',
  NULL,
  true, false, 31)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000032', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0003-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  'Německo ve třicátých letech 21. století bude v piči. Máme se toho bát? Nebo se přirozeně najde jiný zdroj příjmů a burstu ekonomiky? 🤔',
  'Matěj Daníček',
  true, false, 32)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000016-0000-4000-8000-000000000033', 'a0000016-0000-4000-8000-000000000016', 'ca000016-0002-4000-8000-000000000016',
  '00000000-0000-4000-8000-000000000000',
  'Přesunout',
  NULL,
  true, false, 33)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

