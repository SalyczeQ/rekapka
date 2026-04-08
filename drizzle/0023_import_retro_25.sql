-- Import Retro #25
-- Date: 2025-07-26 | 16 cards | Anonymous authors with AI guesses
-- Source: Retro_25_2025-7-26.csv

-- Ensure Anonymous user exists
INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES ('00000000-0000-4000-8000-000000000000', 'Anonymous', 'anonymous@rekapka.local', '#9CA3AF', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000025-0000-4000-8000-000000000025',
  'Retro #25',
  'completed',
  '2025-07-26',
  NULL,
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2025-07-26 17:00:00+00',
  '2025-07-26 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000025-0001-4000-8000-000000000025', 'a0000025-0000-4000-8000-000000000025', 'Mad', '😡', '#EF4444', 0),
  ('ca000025-0002-4000-8000-000000000025', 'a0000025-0000-4000-8000-000000000025', 'Sad', '😢', '#3B82F6', 1),
  ('ca000025-0003-4000-8000-000000000025', 'a0000025-0000-4000-8000-000000000025', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000025-0000-4000-8000-000000000001', 'a0000025-0000-4000-8000-000000000025', 'ca000025-0003-4000-8000-000000000025',
  '00000000-0000-4000-8000-000000000000',
  'proč jsou holky tak ujetý?',
  'Matěj Daníček',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000025-0000-4000-8000-000000000002', 'a0000025-0000-4000-8000-000000000025', 'ca000025-0003-4000-8000-000000000025',
  '00000000-0000-4000-8000-000000000000',
  '"Neboj, řidič nezruší jízdu ani auto - Liftago" - proč není tento reklamní slogan moudrý?',
  'Dušan Salay',
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000025-0000-4000-8000-000000000003', 'a0000025-0000-4000-8000-000000000025', 'ca000025-0003-4000-8000-000000000025',
  '00000000-0000-4000-8000-000000000000',
  'tak jsem zjistil bonitu',
  'Jakub Minarik',
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000025-0000-4000-8000-000000000004', 'a0000025-0000-4000-8000-000000000025', 'ca000025-0003-4000-8000-000000000025',
  '00000000-0000-4000-8000-000000000000',
  'byteček nevyšel, malý rozpočet',
  'Dušan Salay',
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000025-0000-4000-8000-000000000005', 'a0000025-0000-4000-8000-000000000025', 'ca000025-0003-4000-8000-000000000025',
  '00000000-0000-4000-8000-000000000000',
  'Středozemní moře je k ničemu. Teple a bez vln. Change my mind .',
  'Dušan Salay',
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000025-0000-4000-8000-000000000006', 'a0000025-0000-4000-8000-000000000025', 'ca000025-0003-4000-8000-000000000025',
  '00000000-0000-4000-8000-000000000000',
  'Vláďa: pamatujete, jak se Matěj bránil změně k lepšímu? A proč je Dušan stále V Hradci?',
  NULL,
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000025-0000-4000-8000-000000000007', 'a0000025-0000-4000-8000-000000000025', 'ca000025-0003-4000-8000-000000000025',
  '00000000-0000-4000-8000-000000000000',
  'nejsem rasista, ale jsem',
  NULL,
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000025-0000-4000-8000-000000000008', 'a0000025-0000-4000-8000-000000000025', 'ca000025-0003-4000-8000-000000000025',
  '00000000-0000-4000-8000-000000000000',
  'Liquid Glass aneb jak udělat co nejhorší UI?',
  'Petr Weissar',
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000025-0000-4000-8000-000000000009', 'a0000025-0000-4000-8000-000000000025', 'ca000025-0003-4000-8000-000000000025',
  '00000000-0000-4000-8000-000000000000',
  'Superb pokračování: magistrát uznal, že mi mají fixnout auto na účet viníka 🎉  Takže začátkem srpna jde autíčko na generálku ❤️ (Náhradní vozidlo v ceně pojistky, ale bohužel jen Octavia v automatu) 😞',
  'Petr Weissar',
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000025-0000-4000-8000-000000000010', 'a0000025-0000-4000-8000-000000000025', 'ca000025-0003-4000-8000-000000000025',
  '00000000-0000-4000-8000-000000000000',
  E'Až vás začne můj nátlak na vaši pomoc na baráku srát tak mi to pls řekněte včas, ať se zbytečně nerozkmotřujeme 😂 \nSnažím se to teď pushovat jak jen to jde 🙏',
  'Petr Weissar',
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000025-0000-4000-8000-000000000011', 'a0000025-0000-4000-8000-000000000025', 'ca000025-0003-4000-8000-000000000025',
  '00000000-0000-4000-8000-000000000000',
  E'1 280 000 Kč na rekonstrukci domu a fotovoltaiku.. ❤️ \nTo za ty nervy a práci s rekonstrukcí určitě stálo',
  'Petr Weissar',
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000025-0000-4000-8000-000000000012', 'a0000025-0000-4000-8000-000000000025', 'ca000025-0003-4000-8000-000000000025',
  '00000000-0000-4000-8000-000000000000',
  'Kubík vyhrál, aniž bychom se zbavili Puchytila 👏  Aneb, kdo další chce do AirBank?',
  'Petr Weissar',
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000025-0000-4000-8000-000000000013', 'a0000025-0000-4000-8000-000000000025', 'ca000025-0003-4000-8000-000000000025',
  '00000000-0000-4000-8000-000000000000',
  'Nezlvádl jsem odhadnout svůj čas a dobu rekonstrukce a smrdí to tím, že střecha nebude, pokud v příštím týdnu firma neřekne OK. 😞',
  'Petr Weissar',
  true, false, 13)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000025-0000-4000-8000-000000000014', 'a0000025-0000-4000-8000-000000000025', 'ca000025-0003-4000-8000-000000000025',
  '00000000-0000-4000-8000-000000000000',
  'Pánové, velké díky za veškerý support, zájem a pomoc s mojí situací. Neříkáme si tyhle věci moc často, ale fakt si toho vážím a je to super. A jsem fakt rád, že jsme tehdá začali dělat tyhle retra. P.S.: ne, nemám v plánu se v dohledné době jít střelit',
  'Petr Weissar',
  true, false, 14)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000025-0000-4000-8000-000000000015', 'a0000025-0000-4000-8000-000000000025', 'ca000025-0003-4000-8000-000000000025',
  '00000000-0000-4000-8000-000000000000',
  'Realitní makléř - jediný jejich účel je, že ti při prodeji/pronájmu odfiltrují chudý lidi, který nemaj na to aby zaplatili jeho, nebo její (!), provizi... protože přesvědčovat se, že když v bytě není místo na sušičku, tak že ji vlastně nepotřebuju zvládnu klidně sám a nepotřebuju k tomu žádnou paní',
  'Petr Weissar',
  true, false, 15)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000025-0000-4000-8000-000000000016', 'a0000025-0000-4000-8000-000000000025', 'ca000025-0003-4000-8000-000000000025',
  '00000000-0000-4000-8000-000000000000',
  'Nejsme už ani schopni dokončit retro.. Asi budeme muset groupovat to vypadá. A probírat celá témata naráz místo bodů.',
  NULL,
  true, false, 16)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

