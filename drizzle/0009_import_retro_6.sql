-- Import Retro #6
-- Date: 2024-01-27 | 39 cards | Anonymous authors with AI guesses
-- Source: Retro_6_2024-1-27.csv

-- Ensure Anonymous user exists
INSERT INTO users (id, name, email, color, locale, ui_theme)
VALUES ('00000000-0000-4000-8000-000000000000', 'Anonymous', 'anonymous@rekapka.local', '#9CA3AF', 'cs', 'default')
ON CONFLICT (email) DO NOTHING;
--> statement-breakpoint

INSERT INTO retros (id, title, status, date, location, created_by, started_at, completed_at, total_duration_sec)
VALUES (
  'a0000006-0000-4000-8000-000000000006',
  'Retro #6',
  'completed',
  '2024-01-27',
  NULL,
  (SELECT id FROM users WHERE email = 'salay14@gmail.com'),
  '2024-01-27 17:00:00+00',
  '2024-01-27 21:30:00+00',
  16200
)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO categories (id, retro_id, name, icon, color, sort_order)
VALUES
  ('ca000006-0001-4000-8000-000000000006', 'a0000006-0000-4000-8000-000000000006', 'Mad', '😡', '#EF4444', 0),
  ('ca000006-0002-4000-8000-000000000006', 'a0000006-0000-4000-8000-000000000006', 'Sad', '😢', '#3B82F6', 1),
  ('ca000006-0003-4000-8000-000000000006', 'a0000006-0000-4000-8000-000000000006', 'Glad', '😊', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000001', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Je profesionální, když vám bývalý šéf volá aby se zeptal, kolik berete, aby věděl kolik platit svým lidem? Jak to sedí s tím, že se "prý" zná se všemi a ví jak je na tom trh? Anebo to celé bylo jinak? 🤔',
  'Dušan Salay',
  true, false, 1)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000002', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Svatebka 💐 - už to začíná? 😏',
  'Petr Weissar',
  true, false, 2)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000003', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Na FIMce se otevřel nový obor ohledně kyberbezpečnosti. Když někteří z nás nemají Ing, což takhle zkusit Bc. et Bc.? 🙏',
  NULL,
  true, false, 3)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000004', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'No, chlapi? Jak to vypadá s těma AI projektama? A skutečně nám AI vzalo práci? 🧠',
  'Matěj Daníček',
  true, false, 4)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000005', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Jak vám jde spolubydlení s partnerkami / ženami / sami se sebou? Výhody? Nevýhody?',
  NULL,
  true, false, 5)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000006', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Jak je na tom mobilní matchreply? IPO kdy?',
  NULL,
  true, false, 6)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000007', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Smí policista-upír vstoupit do mého domu, pokud má povolení k prohlídce?',
  NULL,
  true, false, 7)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000008', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  E'Byli jsme na UPCE: FES u děkana s Univerzitou 😂\n\nCo se tam asi tak stalo?\n\n- chyba BE?\n\n- chyba iOS?\n\n- leaknutý děkanův token?',
  'Petr Weissar',
  true, false, 8)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000009', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Snaží se EU nás zlikvidovat tím,že dále bude tlačit EVs? A posilovat tím Čínu?',
  NULL,
  true, false, 9)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000010', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Trump a jeho popularita mezi voliči síly. Proti kandidát bude evidentně Biden. Komu byste to hodili?',
  NULL,
  true, false, 10)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000011', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  E'Přes aplikaci pro hluchý a slepí na Androidu (accesibility API) se útočníci dostali do telefonů těchto lidí, přečetli si hesla když se přihlašovali do myAir appky a v noci poslali pushku aby se rozsvítil telefon, odmekli si ho, otevřeli myAir appku, přihlásili se již známým heslem a odeslali si love k sobě 😱\n\nDěsivý - proti tomu můžeš max udělat to, že vyndáš baterku.\n\nKdyž se otevřel store nebo detail tý appky co byla škodlivá, tak ho ta appka hned zavřela, aby ani nešla odinstalovat 😂',
  NULL,
  true, false, 11)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000012', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Imigranti z dalekoho východu? Jste s tím ok nebo ne?',
  NULL,
  true, false, 12)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000013', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Po brčkách papírové víčka, aneb další lepidla do našich drinků?',
  NULL,
  true, false, 13)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000014', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Lipton zero tea zero zamrzl ale Lipton zero peach tea ne. Přidávají nemrznouci směs do broskve?',
  NULL,
  true, false, 14)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000015', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Vyrostl Matěj z anarchokapitalismu? Bude anarchokapitalistou za 10 let? Hlasujme.',
  NULL,
  true, false, 15)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000016', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Bereš léky na svoji nemocnou palici a kupuješ desítky zbraní aneb k čemu nám je všudypřítomný stát, když nedokáže hlídat své ovečky?',
  'Matěj Daníček',
  true, false, 16)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000017', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'ČR je stále Rusko z hlediska dopravní kultury, change my mind',
  'Dušan Salay',
  true, false, 17)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000018', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Lidl proteinové pudinky s acesulfámkem a nutri score A, znáte? papáte?',
  'Dušan Salay',
  true, false, 18)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000019', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Serte na RFP a pojďte běhat, 1/2 maraton v Olomouci 15. 6. 2024. Kdo má víc jak 17 % tuku, má to povinně.',
  'Petr Weissar',
  true, false, 19)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000020', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  E'Macbook Pro 14".. podle Dušana a Kuby už s tímto devicem není žádný problém (Nemá v sobě slovíčko "air") tedy očekávám dokotop funkčnost.. \n\nStalo se tak skutečně? 🤔',
  NULL,
  true, false, 20)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000021', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Univerzita 🎓 - měli jsme to zaříznout, dokud byl čas? 🤔',
  'Petr Weissar',
  true, false, 21)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000022', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Kellerovy narozeniny.. 🍰 byli jsme pozváni 🤮 Dafak.. A co se stalo?',
  NULL,
  true, false, 22)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000023', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'eDokladovka yay or nay?',
  NULL,
  true, false, 23)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000024', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  E'MS se pry dari skvele a AppBlock jede jak zmrd. \n\n\n\n\n"Nechapu, jak si to ty agošky můžou dovolit. To asi jde jen na těchhle velkých projektech."',
  NULL,
  true, false, 24)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000025', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Musíme vybrat nejlepší zemi na světě, každý říká svého kandidáta a zároveň může hlasovat ještě pro jeden cizí návrh',
  NULL,
  true, false, 25)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000026', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Londýn bylo vždycky multikulturní město nebo ne?',
  NULL,
  true, false, 26)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000027', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  '9k/MD good enough nebo Libeň level?',
  NULL,
  true, false, 27)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000028', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Mluvil jsem s Černým M. a vyprávěl mi o tom, že do STRV nakonec nešel protože měli plno a málo projektů 🥺 (a ne protože bylo jeho ukázkové dílo ošklivé)',
  'Jakub Minarik',
  true, false, 28)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000029', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  E'Jaký byly Kanáry? 🇮🇨 \n\n(Kromě toho, že se Dušan vrátil nemocnej)',
  NULL,
  true, false, 29)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000030', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Zbrojní průkaz a zbraň pro sebeobranu - nastal čas?',
  NULL,
  true, false, 30)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000031', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Když byste někdy šli sedět, za co to bude?',
  NULL,
  true, false, 31)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000032', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Jaké to je v českých věznicích? Dokázali byste přežít? Dojmy z exkurze v Jiřicích',
  NULL,
  true, false, 32)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000033', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  E'Stojíme na MHD v Pce.. \n\n\n\n\nna lavičce sedí ožrale vypadající člověk v obleku a vedle něho stojí jeho paní (asi šli z divadla) a týpek mele: Grand je zavřenej! \n\nPaní: aspoň že husa a lékárna zůstala otevřená. \n\nPán: To je neskutečný do tady stihli postavit a zkurvit za těch 30 let. \n\nPaní: 34! \n\n\n\n\nPičo kurva vole mrdky hned bych ty hlavy starý vymáchal v bahně za kecy.. fakt mě to nasralo jak piča kurva. Oba v kapitalistických hadrech jeli kapitalistickým MHDčkem do svého kapitalistického domu na Svítkov. Svině komunistický vylízaný.\n\n\n\n\nPardon.',
  'Petr Weissar',
  true, false, 33)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000034', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Proč už kurva nevedou koleje na letiště? Pan Kotula říkal, že to je easy',
  NULL,
  true, false, 34)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000035', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Jak moc velká socka musíš být, abys u Ryanairu ušetřil 8 Euro za booknutí sedadla a pak sral lidi tím, že si přesedáš? během letu? A proč mě nepřekvapuje, že to dělají zrovna Češi?',
  'Petr Weissar',
  true, false, 35)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000036', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  E'Update Sonoma 14.2 a přestal fungovat externí monitor, internet jede rychlostí 1% a další issues. \n\nKdyž si udělám hotspot přes Pixel, který sosá z domácí Wi-Fi tak to funguje mnohem rychleji, ale stejně to není plynulý. WTF.\n\nJak se tohle applu může stát? 😡 Člověk který si tohle hovno koupí z vlastních peněz musí být leda megakok a je mi ho líto. Obhajovat Mac v tuto chvíli není třeba. Tohle je ostuda jako prase - to se neděje ani ve Windows dopiči.',
  'Dušan Salay',
  true, false, 36)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000037', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Mobilesoft i Dami se rozpadají - jak bylo předpovězeno. Dami finančně, Mobilesoft hnije zevnitř. 😞 "My jsme vám to říkali"',
  NULL,
  true, false, 37)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000038', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  'Keller už není CTO a nesedí s Mírou v kanclu 😔',
  'Jakub Minarik',
  true, false, 38)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

INSERT INTO cards (id, retro_id, category_id, author_id, text, guessed_author, is_discussed, is_skipped, sort_order)
VALUES ('cd000006-0000-4000-8000-000000000039', 'a0000006-0000-4000-8000-000000000006', 'ca000006-0003-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000000',
  E'Vašek 🐴 má jen poloviční úvazek a v Dami se prý hádají jestli by tam měl nebo neměl zůstat 😂\n\nDle mého názoru ho za jeho vypočítavosti dohnala karma..\n\nNa druhou stranu by opustil potápějící se loď 💁\n\n\n\n\nDostaneme za výuku UHK vůbec od Dami zaplaceno?',
  'Petr Weissar',
  true, false, 39)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

