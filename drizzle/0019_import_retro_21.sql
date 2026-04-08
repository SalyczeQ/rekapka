-- Import Retro #21
-- Date: 2025-02-23 | 28 cards | Anonymous authors with AI guesses
-- Source: Retro_21_2025-2-23.csv

-- Ensure Anonymous user exists
INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES ('00000000-0000-4000-8000-000000000000', 'Anonymous', 'anonymous@rekapka.local', '#9CA3AF', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000021-0000-4000-8000-000000000021',
  'Retro #21',
  'completed',
  '2025-02-23',
  NULL,
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2025-02-23 17:00:00+00',
  '2025-02-23 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000021-0001-4000-8000-000000000021', 'a0000021-0000-4000-8000-000000000021', 'Mad', '😡', '#EF4444', 0),
  ('ca000021-0002-4000-8000-000000000021', 'a0000021-0000-4000-8000-000000000021', 'Sad', '😢', '#3B82F6', 1),
  ('ca000021-0003-4000-8000-000000000021', 'a0000021-0000-4000-8000-000000000021', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000001', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  'Jak se zbavit puchytila?',
  'Matěj Daníček',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000002', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  'Jaka je budoucnost Evropy? Proč jsme bezvýznamní v podstatě v každém odvětví? Nemáme obranu, nemáme export, nemáme jednotu. Ale hlavně že máme regulace a byrokracii. Nebyla ta facka od Ameriky už vlastně potřeba?',
  'Petr Weissar',
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000003', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  'Kajty se Štěpánem jonebone',
  NULL,
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000004', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  'Tak jak to je chlapi s těma fotkama a videama?',
  NULL,
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000005', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  'Padelový byznys aneb dvě a půl hodiny v Karlíně.',
  'Vladimír Tichý',
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000006', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  E'Školy jsou k ničemu nahradí je LLM. Change my mind.\n\nNeměli bychom chodit na VŠ, ale zkusit podnikat a trhnout to.',
  'Dušan Salay',
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000007', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  E'The economist vyhlásil Španělsko jako nejzajímavější ekonomiku 2024.\n\nNezaměstnanost mladých z 50 procent na 30, nove start up zákony. \n\n(zdroj: ceska startup asociace)',
  NULL,
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000008', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  E'Harassment test v TruU.\n\nNeznam tolik historii spolecnosti, ale CEO nekolikrat uz upozornoval na to ze nebude tolerovat zadny dehonestaci smerem k zenam.',
  'Dušan Salay',
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000009', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  'evropský startup?',
  'Petr Weissar',
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000010', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  'Evropa je kurva dobrá, nejlepší kultura, lidi, místo k životu, amerika nesahá ani po kotníky, přesto si vyskakuje, je na čase přestat dotovat americký hovnofirmy, který podlézaj diktátorům a přejmenují klidně i mexický záliv, je mi z toho zle',
  NULL,
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000011', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  'Rock for people na Valentýna dal fotku lidí s LGBT vlajkou s spustila se vlna nenávisti.. neměli by stejně hejtit gay people fotky, kde se vykusujou heteráci? Proč homofobním lidem nedochází, že jsou homofobní a že to není správná cesta? 😂',
  NULL,
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000012', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  E'Měl jsem v dami zmražených 1500 v monitoru, který jsem si nemohl odkoupit. Stačilo aby se Dami v HK rozpadlo a začali rozprodávat elektroniku, takže jsem za dalších 3K koupil monitor v hodně 15k ❤️ \n\nSatisfakce..',
  NULL,
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000013', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  'Co kdybyste se dozvěděli, že všechny peníze, které si u zaměstnavatele vyděláte je jen pračka špinavých peněz? Opustili byste své teplé místečko s hromadou peněz, když by to bylo too much shady? 🤔',
  'Jakub Minarik',
  true, false, 13)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000014', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  'Čas od času se ve skupině objeví něco, v čem se neshodnem a nemusí to být úplně objektivní. Často se pak děje, že to druhá strana paroduje a je z toho další zle. Kde je ta hranice? Nepotřebujeme už nějaký safe word? 🤔',
  NULL,
  true, false, 14)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000015', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  'Jak si čistíte uši?',
  NULL,
  true, false, 15)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000016', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  'Putin, Trump, Si Tin Pching budou rozšiřovat svá území. Myslíte si, že si to u příštích voleb američané rozmyslí?',
  'Petr Weissar',
  true, false, 16)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000017', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  'Tak jak je to s těmi sjezdovkami? Je to fay sport nebo v pořádku? 😂',
  NULL,
  true, false, 17)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000018', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  E'Gen Alpha - vyrůstající s telefony od školního věku.\n\nNejen, že jsou pod tlakem sociálních sítí a masáže influencerů a dokonalých věcí, ale ještě si při škole prošli pandemií a válkou (a to vše v době, kdy mozek stále nejvíc roste a sílí).\n\nNení divu, že se u nich vyskytují psychické problémy.\n\n\n\nBod jsem dal, protože to Vláďu zajímalo - pojďme diskutovat :D',
  NULL,
  true, false, 18)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000019', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  'Budu mít nové sousedy? Dušana nebo Vládíka s Pajulí?',
  'Dušan Salay',
  true, false, 19)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000020', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  'Dal jsem Kubovi a Vláďovi možnost být hetero a jít místo squashe do gymu. Vláda chtěl.. Kuba udělal menší dámskou scénu a rozhodl se být gayem 😔 Vlezly mu Holešovice do teploměru nebo byl vždycky takový? #prayForKuba',
  'Petr Weissar',
  true, false, 20)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000021', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  'Dušan se stěhuje do Prahy, o tom není pochyb... je to přeci v procesu a hledá jen vhodný byteček... anebo je všechno jinak a někdo na nás hraje špinavé mind games?',
  NULL,
  true, false, 21)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000022', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  'Trump sazi jedno kontroverzni opatreni za druhym. Na druhou stranu mu to zatim bohuzel funguje a jsou videt vysledky.',
  'Petr Weissar',
  true, false, 22)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000023', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  E'Proc tady hrajeme stale treti housle v EU? Vnimate to nestve vas to? Uz jsme prohrali vuci US a CN v elektroautech. Ted to vypada i na analogii v AI. \n\n\n\nPomaha tahle situace i populistum v ramci politiky?',
  NULL,
  true, false, 23)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000024', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  'Jsme tady vlastne vsichni krestani?',
  NULL,
  true, false, 24)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000025', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  'Ministr dopravy Kupka je člověk že jehož úřadu se postavilo nejvíc silnic, dálnic, kolejí. Nemá žádné skandály, mluví dobře a rozumně a přesto v čemkoliv co napíše dostává jen a jen hejty. Často z trolích farem snad. Na tohle bych neměl. Ty peníze co mají si opravdu zaslouží a měli by dostávat i víc.',
  NULL,
  true, false, 25)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000026', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  'Matěj si stále nechce přiznat, že je příživník sociálního a zdravotního systému ČR :(',
  NULL,
  true, false, 26)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000027', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  'Je potřeba státu přiznat i pozitivní věci, přestože tady ve skupině to moc lidí nedělá. Přiznání k dani z nemovitostí prakticky bez starostí.',
  NULL,
  true, false, 27)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000021-0000-4000-8000-000000000028', 'a0000021-0000-4000-8000-000000000021', 'ca000021-0003-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000000',
  'Lidi co nakupují v Penny jsou trosky, hovna, nuly, chcanky. Nebojím se generalizace - je to výběr, jestli se tam s těma sračkama chceš zahazovat.',
  NULL,
  true, false, 28)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

