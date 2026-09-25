-- ============================================================================
-- Bar Utopia — seed data
-- Run AFTER schema.sql. This is the exact content that used to live in
-- src/data/*.ts, so the site looks identical the moment it points at Supabase.
--
-- Each block is skipped if the table already has rows, so re-running this will
-- never duplicate or clobber content the client has since edited.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Menu
-- ---------------------------------------------------------------------------
insert into public.menu_items (name, description, category, image, price, sort_order)
select * from (values
  ('Beachside Burger', 'Char-grilled patty, island slaw, smoked chilli mayo, brioche bun.', 'Food', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=80', '$14', 1),
  ('Sunset Chicken Skewers', 'Lemongrass marinated chicken, charred peppers, tamarind glaze.', 'Food', 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1000&q=80', '$13', 2),
  ('Grilled Catch of the Day', 'Whole reef fish, lime butter, coconut sambol, charred lemon.', 'Seafood', 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1000&q=80', '$22', 3),
  ('Ocean Prawn Curry', 'Wild-caught prawns, coconut milk, curry leaf, steamed rice.', 'Seafood', 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&w=1000&q=80', '$19', 4),
  ('Chargrilled Calamari', 'Lime chilli marinade, herb oil, toasted sourdough.', 'Seafood', 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=1000&q=80', '$16', 5),
  ('Coconut Jackfruit Bowl', 'Pulled jackfruit, coconut rice, pickled papaya, chilli oil.', 'Vegan', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80', '$15', 6),
  ('Tropical Buddha Bowl', 'Quinoa, mango, avocado, edamame, tahini lime dressing.', 'Vegan', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=80', '$14', 7),
  ('Grilled Halloumi Salad', 'Charred halloumi, watermelon, mint, toasted seeds.', 'Vegetarian', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80', '$13', 8),
  ('Wood-Fired Veggie Flatbread', 'Roasted vegetables, whipped feta, basil, chilli honey.', 'Vegetarian', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80', '$15', 9),
  ('Utopia Sunset', 'Spiced rum, passionfruit, lime, ginger beer float.', 'Cocktails', 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=1000&q=80', '$12', 10),
  ('Salted Coconut Margarita', 'Tequila, coconut cream, lime, toasted salt rim.', 'Cocktails', 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=1000&q=80', '$13', 11),
  ('Tropical Reef Cooler', 'Mango, lime, mint, soda, a splash of grenadine.', 'Mocktails', 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1000&q=80', '$8', 12),
  ('Passionfruit Spritz (Mocktail)', 'Passionfruit, elderflower, soda, fresh mint.', 'Mocktails', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1000&q=80', '$8', 13),
  ('Spiced Chai', 'Slow-brewed black tea, cardamom, cinnamon, steamed milk.', 'Hot Drinks', 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=1000&q=80', '$6', 14),
  ('Ginger Turmeric Tea', 'Fresh ginger, turmeric, lemon, wild honey.', 'Hot Drinks', 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=1000&q=80', '$6', 15),
  ('Iced Hibiscus Cooler', 'Hibiscus infusion, lime, honey, crushed ice.', 'Cold Drinks', 'https://images.unsplash.com/photo-1497534547324-0ebb3f052e88?auto=format&fit=crop&w=1000&q=80', '$7', 16),
  ('Fresh King Coconut', 'Chilled straight from the shell, served with a straw.', 'Cold Drinks', 'https://images.unsplash.com/photo-1520950237264-5ac2f57a4d3f?auto=format&fit=crop&w=1000&q=80', '$6', 17),
  ('Beachside Cold Brew', 'Slow-steeped 18 hours, served over ice.', 'Coffee', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1000&q=80', '$5', 18),
  ('Coconut Flat White', 'Double espresso, steamed coconut milk.', 'Coffee', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80', '$5', 19)
) as v(name, description, category, image, price, sort_order)
where not exists (select 1 from public.menu_items);

-- ---------------------------------------------------------------------------
-- Surf packages
-- ---------------------------------------------------------------------------
insert into public.surf_packages (name, price, price_note, includes, excludes, cta, highlighted, sort_order)
select * from (values
  ('Beginner Package', 'Rs. 5,000', null, array['Surfing lessons','Surfboard'], array[]::text[], 'Choose Beginner', false, 1),
  ('Intermediate Package', 'Rs. 7,000', null, array['Surfing lessons','Surfboard'], array[]::text[], 'Choose Intermediate', true, 2),
  ('Surfboard Only', 'Rs. 1,000', '/ hour', array['Surfboard rental'], array['No teacher included'], 'Rent a Surfboard', false, 3)
) as v(name, price, price_note, includes, excludes, cta, highlighted, sort_order)
where not exists (select 1 from public.surf_packages);

-- ---------------------------------------------------------------------------
-- Gallery
-- ---------------------------------------------------------------------------
insert into public.gallery_images (src, alt, category, sort_order)
select * from (values
  ('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', 'Turquoise ocean waves rolling onto a sandy beach', 'Beach', 1),
  ('https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', 'Aerial view of a tropical beach coastline', 'Beach', 2),
  ('https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80', 'Beachfront restaurant seating at sunset', 'Restaurant', 3),
  ('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80', 'Open-air restaurant dining tables by the sea', 'Restaurant', 4),
  ('https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80', 'Grilled whole fish plated with lime and herbs', 'Food', 5),
  ('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80', 'Fresh tropical vegan bowl with mango and avocado', 'Food', 6),
  ('https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=1200&q=80', 'Tropical cocktail garnished with lime and mint', 'Drinks', 7),
  ('https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=80', 'Refreshing fruit mocktail on a beach bar counter', 'Drinks', 8),
  ('https://images.unsplash.com/photo-1502933691298-84fc14542831?auto=format&fit=crop&w=1200&q=80', 'Surfer paddling out into the waves', 'Surfing', 9),
  ('https://images.unsplash.com/photo-1455729552865-3658a5d39692?auto=format&fit=crop&w=1200&q=80', 'Surfboards lined up on the sand', 'Surfing', 10),
  ('https://images.unsplash.com/photo-1531722569936-825d3dd91b15?auto=format&fit=crop&w=1200&q=80', 'Surfer riding a breaking wave', 'Surfing', 11),
  ('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80', 'Rows of sunbeds facing the ocean', 'Sunbeds', 12),
  ('https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=80', 'Sunbeds and umbrellas on a quiet beach', 'Sunbeds', 13),
  ('https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80', 'Villa swimming pool surrounded by palm trees', 'Accommodation', 14),
  ('https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80', 'Bright tropical villa bedroom interior', 'Accommodation', 15)
) as v(src, alt, category, sort_order)
where not exists (select 1 from public.gallery_images);

-- ---------------------------------------------------------------------------
-- Site settings (single row)
-- ---------------------------------------------------------------------------
insert into public.site_settings (
  id, instagram_url, facebook_url, tripadvisor_url, booking_url,
  contact_address, contact_phone, contact_email, contact_hours, map_embed_url
)
values (
  1,
  'https://www.instagram.com/barutopia_hiriketiya/',
  'https://www.facebook.com/profile.php?id=61551360549958',
  '#',
  'https://www.booking.com/hotel/lk/parrot-perch-villa-dickwella.html?label=gen173nr-10CBkoggI46AdIM1gEaIUBiAEBmAEzuAEHyAEM2AED6AEB-AEBiAIBqAIBuAKkvbvTBsACAdICJDZkM2JlNDc3LTRkOGItNGE0Mi05ODBmLWJkZTkyNmVhOWQ5ZdgCAeACAQ&sid=3ea5fa98349e3e7c6c35a9b64f4e3537',
  'Beach Road, Ahangama, Sri Lanka',
  '+94 76 322 3878',
  'info@barutopia.com',
  'Open daily · 8:00 AM – 11:00 PM',
  'https://www.google.com/maps?q=Ahangama+Sri+Lanka&output=embed'
)
on conflict (id) do nothing;
