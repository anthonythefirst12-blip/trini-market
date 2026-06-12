-- ============================================================
-- TriniMarket Database Schema + Seed
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- TABLES

CREATE TABLE IF NOT EXISTS sellers (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  avatar        TEXT,
  joined_date   DATE,
  rating        NUMERIC(3,1) DEFAULT 0,
  review_count  INT DEFAULT 0,
  location      TEXT,
  verified      BOOLEAN DEFAULT false,
  is_pro        BOOLEAN DEFAULT false,
  business_name TEXT,
  bio           TEXT,
  banner        TEXT,
  listing_count INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS listings (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT,
  price         NUMERIC NOT NULL,
  currency      TEXT DEFAULT 'TTD',
  category      TEXT,
  condition     TEXT,
  location      TEXT,
  images        TEXT[] DEFAULT '{}',
  seller_id     TEXT REFERENCES sellers(id) ON DELETE CASCADE,
  created_at    DATE DEFAULT CURRENT_DATE,
  featured      BOOLEAN DEFAULT false,
  tier          TEXT DEFAULT 'free' CHECK (tier IN ('free','featured','premium')),
  tags          TEXT[] DEFAULT '{}',
  negotiable    BOOLEAN DEFAULT false,
  comment_count INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS comments (
  id            TEXT PRIMARY KEY,
  listing_id    TEXT REFERENCES listings(id) ON DELETE CASCADE,
  author_name   TEXT NOT NULL,
  author_avatar TEXT,
  text          TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comment_replies (
  id            TEXT PRIMARY KEY,
  comment_id    TEXT REFERENCES comments(id) ON DELETE CASCADE,
  author_name   TEXT NOT NULL,
  author_avatar TEXT,
  text          TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ROW LEVEL SECURITY (public read)

ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read sellers" ON sellers FOR SELECT USING (true);
CREATE POLICY "Public read listings" ON listings FOR SELECT USING (true);
CREATE POLICY "Public read comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Public read replies" ON comment_replies FOR SELECT USING (true);

-- ============================================================
-- SEED: SELLERS
-- ============================================================

INSERT INTO sellers (id,name,avatar,joined_date,rating,review_count,location,verified,is_pro,business_name,bio,banner,listing_count) VALUES
(
  's1','Marcus Phillip','https://i.pravatar.cc/80?img=11','2022-03-14',4.8,23,'Port of Spain',true,false,null,null,null,0
),
(
  's2','Priya Ramlal','https://i.pravatar.cc/80?img=5','2021-09-02',5.0,41,'San Fernando',true,true,
  'Priya Tech Deals',
  'Certified Apple reseller and tech enthusiast. All items verified, tested, and honestly described.',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',12
),
(
  's3','Anita Mohammed','https://i.pravatar.cc/80?img=47','2020-01-15',4.6,17,'Chaguanas',true,true,
  'Anita Real Estate',
  'Licensed real estate agent covering Central Trinidad. Residential and commercial properties.',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',8
),
(
  's4','Cheryl James','https://i.pravatar.cc/80?img=32','2023-06-10',4.9,88,'Arima',false,false,null,null,null,0
),
(
  's5','Kevin Sookdeo','https://i.pravatar.cc/80?img=15','2019-11-20',4.7,134,'Tunapuna',true,true,
  'KoolAir Services',
  'Trusted HVAC contractor since 2010. Serving all of Trinidad with same-day availability.',
  'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=80',5
),
(
  's6','Devika Singh','https://i.pravatar.cc/80?img=49','2024-01-05',4.4,9,'Couva',false,false,null,null,null,0
),
(
  's7','Tariq Ali','https://i.pravatar.cc/80?img=12','2022-08-30',4.5,6,'Debe',false,false,null,null,null,0
),
(
  's8','Simone Charles','https://i.pravatar.cc/80?img=44','2023-02-14',4.8,29,'Diego Martin',true,false,null,null,null,0
),
(
  's9','Gregory Hosein','https://i.pravatar.cc/80?img=22','2021-04-07',4.3,11,'Fyzabad',false,false,null,null,null,0
),
(
  's10','Nadia Persad','https://i.pravatar.cc/80?img=36','2023-09-01',4.9,52,'Port of Spain',true,true,
  'Nadia Digital Studio',
  'Full-stack developer and designer helping T&T businesses get online. Portfolio: nadiadigital.tt',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',3
),
(
  's11','Ryan Mohammed','https://i.pravatar.cc/80?img=13','2018-04-01',4.9,210,'Chaguanas',true,true,
  'Caribbean Auto Sales',
  'Trinidad''s largest authorised Honda & Toyota dealership. Over 500 vehicles in stock. Finance, insurance, and trade-in available.',
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80',24
),
(
  's12','Sandra Ferreira','https://i.pravatar.cc/80?img=46','2015-07-12',4.8,97,'Port of Spain',true,true,
  'Prime Properties T&T',
  'Award-winning real estate brokerage specialising in luxury residential and commercial properties across Trinidad & Tobago since 2010.',
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',18
),
(
  's13','Damien Jackman','https://i.pravatar.cc/80?img=17','2017-03-22',4.7,163,'San Fernando',true,true,
  'AutoShine Pro T&T',
  'Trinidad''s leading corporate fleet detailing and vehicle maintenance company. ISO-certified. Serving over 80 corporate clients island-wide.',
  'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1200&q=80',6
),
(
  's14','Graphic House Ltd','/graphic-house-logo.png','2018-06-01',4.9,312,'Port of Spain',true,true,
  'Graphic House',
  'Trinidad & Tobago''s leading print and promotional products company since 1977. From business cards to full corporate campaigns — we bring your brand to life.',
  '/graphic-house-logo.png',3
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED: LISTINGS
-- ============================================================

INSERT INTO listings (id,title,description,price,currency,category,condition,location,images,seller_id,created_at,featured,tier,tags,negotiable,comment_count) VALUES
(
  '1',
  '2019 Toyota Corolla – Low Mileage',
  'Well-maintained 2019 Toyota Corolla in excellent condition. Single owner, full service history, factory tint, push-start, reverse camera. Never in an accident. Registered and insured. Available for viewing in Maraval.',
  185000,'TTD','Vehicles','Like New','Maraval, Port of Spain',
  ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80','https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80'],
  's1','2026-05-28',true,'featured',
  ARRAY['toyota','sedan','automatic','fuel-efficient'],
  true,4
),
(
  '2',
  'MacBook Pro 14" M3 – Space Grey',
  'Barely used MacBook Pro 14-inch with M3 chip, 16GB RAM, 512GB SSD. Purchased 4 months ago, still under Apple warranty. Comes with original box, charger, and AppleCare+. No scratches.',
  9800,'TTD','Electronics','Like New','San Fernando',
  ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80','https://images.unsplash.com/photo-1611186871525-9c7d31db1359?w=800&q=80'],
  's2','2026-06-01',true,'premium',
  ARRAY['apple','laptop','m3','programming'],
  false,7
),
(
  '3',
  '3-Bedroom House for Rent – Chaguanas',
  'Spacious 3-bedroom, 2-bathroom house in a quiet residential area of Chaguanas. Fully tiled, security grilles on all windows, covered parking for 2 cars. Close to schools and shopping centres. Available August 1st.',
  5500,'TTD','Real Estate','New','Chaguanas',
  ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80','https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'],
  's3','2026-05-20',true,'premium',
  ARRAY['rental','house','chaguanas','family'],
  true,2
),
(
  '4',
  'Homemade Black Cake – Order for Events',
  'Traditional Trinidad black cake made with dried fruits soaked in rum and cherry brandy. Perfect for weddings, christenings, and the holiday season. Customisable sizes. Order minimum 2 weeks in advance.',
  350,'TTD','Food & Beverage','New','Arima',
  ARRAY['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80'],
  's4','2026-06-05',false,'free',
  ARRAY['cake','baking','events','traditional'],
  false,11
),
(
  '5',
  'Professional AC Installation & Repair',
  'Certified HVAC technician with 12 years experience. We install, service, and repair all brands of split-unit and window ACs. Same-day service available across Trinidad. Free quote on WhatsApp.',
  600,'TTD','Services','New','Tunapuna',
  ARRAY['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80'],
  's5','2026-04-18',false,'featured',
  ARRAY['ac','hvac','repair','installation'],
  true,3
),
(
  '6',
  'iPhone 15 Pro – 256GB Natural Titanium',
  'iPhone 15 Pro, 256GB in Natural Titanium. Local carrier unlocked. Screen in perfect condition, no scratches. Comes with original box and one Apple USB-C cable. Battery health 98%.',
  5200,'TTD','Electronics','Good','Couva',
  ARRAY['https://images.unsplash.com/photo-1695048133142-1a20484429be?w=800&q=80'],
  's6','2026-06-08',true,'featured',
  ARRAY['iphone','apple','smartphone','unlocked'],
  true,5
),
(
  '7',
  'Kayak + Paddle Set – Barely Used',
  '10-foot sit-on-top kayak with adjustable footrests and dry storage compartment. Comes with one paddle and a life vest. Ideal for Caroni, Nariva, or coastal paddling. Selling because we''re relocating.',
  2800,'TTD','Sports & Outdoors','Like New','Debe',
  ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80'],
  's7','2026-05-15',false,'free',
  ARRAY['kayak','outdoor','water sports','paddle'],
  true,1
),
(
  '8',
  'Designer Wrap Dress – Local Brand',
  'Hand-sewn wrap dress by Trinidadian designer Sasha Creations. Size M. Cotton/linen blend, perfect for fetes, beach limes, and corporate casual. Washed once, excellent condition. Original price $780 TTD.',
  450,'TTD','Fashion','Like New','Diego Martin',
  ARRAY['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80'],
  's8','2026-06-03',false,'free',
  ARRAY['dress','fashion','local','women'],
  false,0
),
(
  '9',
  'Garden Set – 4-Seater with Umbrella',
  'Powder-coated steel outdoor dining set. 4 chairs and one round table with parasol stand (umbrella included). Weather-resistant cushions. Slight surface rust on one chair leg, easily touched up. Moving sale.',
  1800,'TTD','Home & Garden','Good','Fyzabad',
  ARRAY['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80'],
  's9','2026-05-30',false,'free',
  ARRAY['garden','furniture','outdoor','patio'],
  true,0
),
(
  '10',
  'Freelance Web Design & Development',
  'Professional web design and full-stack development for small businesses, restaurants, and freelancers. Next.js, WordPress, and e-commerce (Shopify) specialist. Portfolio available. Response within 24 hours.',
  2500,'TTD','Services','New','Port of Spain',
  ARRAY['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80'],
  's10','2026-06-10',true,'premium',
  ARRAY['web','design','freelance','nextjs'],
  true,9
),
(
  '11',
  '2023 Honda CR-V Turbo – Showroom Condition',
  'Brand new 2023 Honda CR-V 1.5T EX-L. Fully loaded — panoramic sunroof, leather seats, Honda Sensing suite, wireless CarPlay. Available in Pearl White and Lunar Silver. Finance options available. Test drives by appointment.',
  320000,'TTD','Vehicles','New','Chaguanas',
  ARRAY['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80','https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=800&q=80'],
  's11','2026-06-09',true,'premium',
  ARRAY['honda','suv','new','finance'],
  false,3
),
(
  '12',
  '2022 Toyota Hilux SR5 – Double Cab',
  '2022 Toyota Hilux SR5 double cab, 2.8L diesel automatic. Bull bar, tow bar, bed liner. Low mileage fleet vehicle. Ideal for business or heavy-duty use. Service history available. Finance from 4.9% APR.',
  295000,'TTD','Vehicles','Like New','Chaguanas',
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
  's11','2026-06-07',true,'premium',
  ARRAY['toyota','hilux','diesel','pickup'],
  false,1
),
(
  '13',
  'Luxury 4-Bedroom Penthouse – St. Clair',
  'Exceptional penthouse on the 12th floor in the heart of St. Clair. 4 bedrooms, 4.5 bathrooms, chef''s kitchen, private rooftop terrace, 2 covered parking spaces. 24-hour security and concierge. Available for sale or long-term lease.',
  4500000,'TTD','Real Estate','New','St. Clair, Port of Spain',
  ARRAY['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80','https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80'],
  's12','2026-06-05',true,'premium',
  ARRAY['penthouse','luxury','st. clair','sale'],
  true,5
),
(
  '14',
  'Commercial Office Space – Port of Spain CBD',
  '2,400 sq ft open-plan office on the 6th floor of a modern building on Independence Square. Air-conditioned, high-speed fibre, backup generator, 8 dedicated parking spaces. Ideal for law firms, financial services, or tech companies.',
  22000,'TTD','Real Estate','New','Independence Square, Port of Spain',
  ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'],
  's12','2026-06-03',true,'premium',
  ARRAY['office','commercial','port of spain','lease'],
  true,2
),
(
  '15',
  'Corporate Fleet Cleaning & Maintenance',
  'Full-service vehicle detailing and fleet maintenance for corporate clients. We handle everything from weekly washes to full paint correction, ceramic coating, and scheduled servicing. Contracts available for 5+ vehicles. Serving Port of Spain, San Fernando, and Chaguanas.',
  8500,'TTD','Services','New','San Fernando',
  ARRAY['https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=80'],
  's13','2026-06-08',true,'premium',
  ARRAY['fleet','cleaning','corporate','detailing'],
  true,4
),
(
  '16',
  'Commercial Security & Surveillance Installation',
  'Full CCTV, access control, and alarm system installation for offices, warehouses, and retail locations. We supply, install, and maintain Hikvision and Dahua systems. 24/7 monitoring packages available. Over 300 commercial installations across T&T.',
  15000,'TTD','Services','New','Port of Spain',
  ARRAY['https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&q=80'],
  's13','2026-06-06',false,'featured',
  ARRAY['cctv','security','surveillance','commercial'],
  true,0
),
(
  '17',
  'Commercial Printing Services – Brochures, Flyers & Business Cards',
  'Full-service commercial printing for businesses across Trinidad & Tobago. We produce high-quality brochures, flyers, business cards, catalogues, pull-up banners, and stationery. Offset and digital printing available. Fast turnaround — 24-hour rush service on most products. Corporate accounts and bulk pricing available. Serving T&T since 1977.',
  500,'TTD','Services','New','Port of Spain',
  ARRAY['/graphic-house-logo.png','/gh-client-churchs.jpg'],
  's14','2026-06-10',true,'premium',
  ARRAY['printing','brochures','business cards','flyers','corporate'],
  false,6
),
(
  '18',
  'Promotional Merchandise & Branded Corporate Gifts',
  'Elevate your brand with custom promotional merchandise from Graphic House. We supply and brand pens, mugs, USB drives, tote bags, notebooks, apparel, and hundreds of other corporate gift items. Ideal for trade shows, staff gifts, client appreciation, and event giveaways. Minimum orders apply. Samples available on request.',
  1200,'TTD','Services','New','Port of Spain',
  ARRAY['/gh-client-happyplanet.jpg','/gh-client-bmobile.jpg'],
  's14','2026-06-09',true,'premium',
  ARRAY['promotional','merchandise','branded','corporate gifts','apparel'],
  false,3
),
(
  '19',
  'Signage, Large Format & Exhibition Display Printing',
  'Custom signage and large format printing for retail, corporate, and exhibition environments. We produce vinyl banners, acrylic signs, foam board displays, vehicle wraps, window graphics, outdoor billboards, and full exhibition stand systems. Weather-resistant inks and premium substrates. Installation service available island-wide.',
  2500,'TTD','Services','New','Port of Spain',
  ARRAY['/gh-client-bmobile.jpg','/gh-client-churchs.jpg','/gh-client-happyplanet.jpg'],
  's14','2026-06-08',true,'premium',
  ARRAY['signage','banners','exhibition','large format','vehicle wrap'],
  true,2
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED: COMMENTS + REPLIES
-- ============================================================

INSERT INTO comments (id, listing_id, author_name, author_avatar, text, created_at) VALUES
('c1','1','Jason Williams','https://i.pravatar.cc/80?img=3','Is this still available? Looks in great condition.','2026-06-08T10:22:00Z'),
('c2','1','Tricia Ramsaran','https://i.pravatar.cc/80?img=29','What''s the mileage on it? And has it ever been in an accident?','2026-06-09T14:30:00Z'),
('c3','1','Kevin Sookdeo','https://i.pravatar.cc/80?img=15','Very reasonable price for a 2019 Corolla. These run forever.','2026-06-10T08:00:00Z'),
('c4','1','Sandra Ali','https://i.pravatar.cc/80?img=9','Does it have the original floor mats? Also, are the tints legal?','2026-06-11T09:45:00Z'),
('c5','2','Rohan Maharaj','https://i.pravatar.cc/80?img=7','Which exact M3 variant — base, Pro or Max chip?','2026-06-02T12:00:00Z'),
('c6','10','Anil Seepersad','https://i.pravatar.cc/80?img=20','Do you do e-commerce sites for small restaurants? Looking for something with online ordering.','2026-06-11T10:00:00Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO comment_replies (id, comment_id, author_name, author_avatar, text, created_at) VALUES
('r1','c1','Marcus Phillip','https://i.pravatar.cc/80?img=11','Yes still available! Feel free to WhatsApp me to arrange a viewing.','2026-06-08T11:05:00Z'),
('r2','c2','Marcus Phillip','https://i.pravatar.cc/80?img=11','63,000 km and no accidents. Full service history available.','2026-06-09T15:10:00Z'),
('r3','c5','Priya Ramlal','https://i.pravatar.cc/80?img=5','Base M3 chip, 16GB unified memory, 512GB SSD. Not Pro or Max.','2026-06-02T12:45:00Z'),
('r4','c6','Nadia Persad','https://i.pravatar.cc/80?img=36','Absolutely! I specialize in restaurant sites with online ordering. Send me a message and we can discuss your needs.','2026-06-11T10:30:00Z')
ON CONFLICT (id) DO NOTHING;
