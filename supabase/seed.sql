-- 1. Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Set the search path to include the extensions schema
SET search_path = public, extensions;

-- 2. Create a function to create users
CREATE OR REPLACE FUNCTION create_user(email text, password text, role text)
RETURNS uuid AS $$
DECLARE
  user_id uuid;
  encrypted_pw text;
BEGIN
  -- Generate a random UUID for the user
  user_id := gen_random_uuid();

  -- Encrypt the password using bcrypt
  encrypted_pw := crypt(password, extensions.gen_salt('bf'));

  -- Insert into auth.users
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', user_id, 'authenticated', 'authenticated', email, encrypted_pw, now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');

  -- Insert into auth.identities
  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES (gen_random_uuid(), user_id, user_id::text, format('{"sub":"%s","email":"%s"}', user_id::text, email)::jsonb, 'email', now(), now(), now());

  -- Insert into public.users
  INSERT INTO public.users (id, email, role)
  VALUES (user_id, email, role);

  RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Clear existing data
TRUNCATE TABLE public.users, public.sitters, public.customers, public.pets, public.signed_waivers, public.sitter_addons, public.sitter_discounts, public.booking_requests, public.booking_sitter_recipients, public.booking_pets, public.booking_addons RESTART IDENTITY CASCADE;

-- 4. Seed data
DO $$
DECLARE
  admin_id uuid;
  sitter1_id uuid;
  sitter2_id uuid;
  sitter_profile1_id uuid;
  sitter_profile2_id uuid;
  customer1_id uuid;
  customer2_id uuid;
  customer3_id uuid;
  customer4_id uuid;
  customer5_id uuid;
  customer6_id uuid;
  customer7_id uuid;
  customer8_id uuid;
  customer9_id uuid;
  customer10_id uuid;
  pet1_id uuid;
  pet2_id uuid;
  addon1_id uuid;
  addon2_id uuid;
  booking_request1_id uuid;
  booking_request2_id uuid;
  booking_request3_id uuid;
  booking_request4_id uuid;
  booking_request5_id uuid;
  booking_request6_id uuid;
  booking_request7_id uuid;
  booking_request8_id uuid;
  booking_request9_id uuid;
  booking_request10_id uuid;
BEGIN
  -- Create users and get their IDs
  admin_id := create_user('admin@mailinator.com', 'password', 'ADMIN');
  sitter1_id := create_user('sitter1@mailinator.com', 'password', 'SITTER');
  sitter2_id := create_user('sitter2@mailinator.com', 'password', 'SITTER');

  -- Update users with first and last names
  UPDATE public.users SET first_name = 'Admin', last_name = 'User' WHERE id = admin_id;
  UPDATE public.users SET first_name = 'Sitter', last_name = 'One' WHERE id = sitter1_id;
  UPDATE public.users SET first_name = 'Sitter', last_name = 'Two' WHERE id = sitter2_id;

  -- Create sitters
  INSERT INTO sitters (user_id, address, county, base_rate_cents, signature_url, is_active)
  VALUES (sitter1_id, '123 Sitter Lane', 'County One', 5000, 'https://www.mailinator.com/signature1.png', true) RETURNING id INTO sitter_profile1_id;
  INSERT INTO sitters (user_id, address, county, base_rate_cents, signature_url, is_active)
  VALUES (sitter2_id, '456 Sitter Street', 'County Two', 6000, 'https://www.mailinator.com/signature2.png', true) RETURNING id INTO sitter_profile2_id;

  -- Create Sitter Add-ons
  INSERT INTO sitter_addons (sitter_id, name, price_cents, description)
  VALUES
  (sitter_profile1_id, 'Daily Walk', 1000, 'A 30-minute walk every day.') RETURNING id INTO addon1_id;
  INSERT INTO sitter_addons (sitter_id, name, price_cents, description)
  VALUES
  (sitter_profile1_id, 'Grooming', 2500, 'A full grooming session.') RETURNING id INTO addon2_id;
  INSERT INTO sitter_addons (sitter_id, name, price_cents, description)
  VALUES
  (sitter_profile2_id, 'Medication Administration', 500, 'Administer medication as required.');
  INSERT INTO sitter_addons (sitter_id, name, price_cents, description)
  VALUES
  (sitter_profile2_id, 'Special Diet Fee', 1000, 'Fee for preparing special meals.');

  -- Create Customers
  INSERT INTO customers (name, email) VALUES ('Customer One', 'customer1@mailinator.com') RETURNING id INTO customer1_id;
  INSERT INTO customers (name, email) VALUES ('Customer Two', 'customer2@mailinator.com') RETURNING id INTO customer2_id;
  INSERT INTO customers (name, email) VALUES ('Customer Three', 'customer3@mailinator.com') RETURNING id INTO customer3_id;
  INSERT INTO customers (name, email) VALUES ('Customer Four', 'customer4@mailinator.com') RETURNING id INTO customer4_id;
  INSERT INTO customers (name, email) VALUES ('Customer Five', 'customer5@mailinator.com') RETURNING id INTO customer5_id;
  INSERT INTO customers (name, email) VALUES ('Customer Six', 'customer6@mailinator.com') RETURNING id INTO customer6_id;
  INSERT INTO customers (name, email) VALUES ('Customer Seven', 'customer7@mailinator.com') RETURNING id INTO customer7_id;
  INSERT INTO customers (name, email) VALUES ('Customer Eight', 'customer8@mailinator.com') RETURNING id INTO customer8_id;
  INSERT INTO customers (name, email) VALUES ('Customer Nine', 'customer9@mailinator.com') RETURNING id INTO customer9_id;
  INSERT INTO customers (name, email) VALUES ('Customer Ten', 'customer10@mailinator.com') RETURNING id INTO customer10_id;

  -- Create Pets
  INSERT INTO pets (customer_id, name, breed, age, notes)
  VALUES
  (customer1_id, 'Buddy', 'Golden Retriever', 5, 'Loves to play fetch.') RETURNING id INTO pet1_id;
  INSERT INTO pets (customer_id, name, breed, age, notes)
  VALUES
  (customer2_id, 'Lucy', 'Beagle', 3, 'Eats everything.') RETURNING id INTO pet2_id;

  -- Create Booking Requests
  INSERT INTO booking_requests (customer_id, start_date, end_date, county, status, assigned_sitter_id, total_cost_cents, base_rate_at_booking_cents, discount_applied_cents, addons_total_cost_cents, payment_status, amount_paid_cents, payment_method, paid_at)
  VALUES
  (customer1_id, '2025-10-10', '2025-10-15', 'County One', 'PENDING_SITTER_ACCEPTANCE', NULL, 25000, 25000, 0, 0, 'UNPAID', 0, NULL, NULL) RETURNING id INTO booking_request1_id;
  INSERT INTO booking_requests (customer_id, start_date, end_date, county, status, assigned_sitter_id, total_cost_cents, base_rate_at_booking_cents, discount_applied_cents, addons_total_cost_cents, payment_status, amount_paid_cents, payment_method, paid_at)
  VALUES
  (customer2_id, '2025-10-12', '2025-10-17', 'County Two', 'PENDING_SITTER_ACCEPTANCE', NULL, 30000, 30000, 0, 0, 'UNPAID', 0, NULL, NULL) RETURNING id INTO booking_request2_id;
  INSERT INTO booking_requests (customer_id, start_date, end_date, county, status, assigned_sitter_id, total_cost_cents, base_rate_at_booking_cents, discount_applied_cents, addons_total_cost_cents, payment_status, amount_paid_cents, payment_method, paid_at)
  VALUES
  (customer3_id, '2025-10-15', '2025-10-20', 'County One', 'PENDING_SITTER_ACCEPTANCE', NULL, 25000, 25000, 0, 0, 'UNPAID', 0, NULL, NULL) RETURNING id INTO booking_request3_id;
  INSERT INTO booking_requests (customer_id, start_date, end_date, county, status, assigned_sitter_id, total_cost_cents, base_rate_at_booking_cents, discount_applied_cents, addons_total_cost_cents, payment_status, amount_paid_cents, payment_method, paid_at)
  VALUES
  (customer4_id, '2025-10-18', '2025-10-22', 'County Two', 'PENDING_SITTER_ACCEPTANCE', NULL, 24000, 24000, 0, 0, 'UNPAID', 0, NULL, NULL) RETURNING id INTO booking_request4_id;
  INSERT INTO booking_requests (customer_id, start_date, end_date, county, status, assigned_sitter_id, total_cost_cents, base_rate_at_booking_cents, discount_applied_cents, addons_total_cost_cents, payment_status, amount_paid_cents, payment_method, paid_at)
  VALUES
  (customer5_id, '2025-10-20', '2025-10-25', 'County One', 'PENDING_SITTER_ACCEPTANCE', NULL, 25000, 25000, 0, 0, 'UNPAID', 0, NULL, NULL) RETURNING id INTO booking_request5_id;
  INSERT INTO booking_requests (customer_id, start_date, end_date, county, status, assigned_sitter_id, total_cost_cents, base_rate_at_booking_cents, discount_applied_cents, addons_total_cost_cents, payment_status, amount_paid_cents, payment_method, paid_at)
  VALUES
  (customer6_id, '2025-10-22', '2025-10-28', 'County Two', 'PENDING_SITTER_ACCEPTANCE', NULL, 36000, 36000, 0, 0, 'UNPAID', 0, NULL, NULL) RETURNING id INTO booking_request6_id;
  INSERT INTO booking_requests (customer_id, start_date, end_date, county, status, assigned_sitter_id, total_cost_cents, base_rate_at_booking_cents, discount_applied_cents, addons_total_cost_cents, payment_status, amount_paid_cents, payment_method, paid_at)
  VALUES
  (customer7_id, '2025-10-25', '2025-10-30', 'County One', 'PENDING_SITTER_ACCEPTANCE', NULL, 25000, 25000, 0, 0, 'UNPAID', 0, NULL, NULL) RETURNING id INTO booking_request7_id;
  INSERT INTO booking_requests (customer_id, start_date, end_date, county, status, assigned_sitter_id, total_cost_cents, base_rate_at_booking_cents, discount_applied_cents, addons_total_cost_cents, payment_status, amount_paid_cents, payment_method, paid_at)
  VALUES
  (customer8_id, '2025-10-28', '2025-11-02', 'County Two', 'PENDING_SITTER_ACCEPTANCE', NULL, 30000, 30000, 0, 0, 'UNPAID', 0, NULL, NULL) RETURNING id INTO booking_request8_id;
  INSERT INTO booking_requests (customer_id, start_date, end_date, county, status, assigned_sitter_id, total_cost_cents, base_rate_at_booking_cents, discount_applied_cents, addons_total_cost_cents, payment_status, amount_paid_cents, payment_method, paid_at)
  VALUES
  (customer9_id, '2025-11-01', '2025-11-05', 'County One', 'PENDING_SITTER_ACCEPTANCE', NULL, 20000, 20000, 0, 0, 'UNPAID', 0, NULL, NULL) RETURNING id INTO booking_request9_id;
  INSERT INTO booking_requests (customer_id, start_date, end_date, county, status, assigned_sitter_id, total_cost_cents, base_rate_at_booking_cents, discount_applied_cents, addons_total_cost_cents, payment_status, amount_paid_cents, payment_method, paid_at)
  VALUES
  (customer10_id, '2025-11-05', '2025-11-10', 'County Two', 'PENDING_SITTER_ACCEPTANCE', NULL, 30000, 30000, 0, 0, 'UNPAID', 0, NULL, NULL) RETURNING id INTO booking_request10_id;

  -- Create booking_pets
  INSERT INTO booking_pets (booking_request_id, pet_id)
  VALUES
  (booking_request1_id, pet1_id),
  (booking_request2_id, pet2_id);

  -- Create booking_addons
  INSERT INTO booking_addons (booking_request_id, sitter_addon_id)
  VALUES
  (booking_request1_id, addon1_id),
  (booking_request2_id, addon2_id);
END $$;

-- 5. Seed booking_sitter_recipients
DO $$
DECLARE
  sitter1_profile_id uuid;
  sitter2_profile_id uuid;
  booking_id uuid;
BEGIN
  -- Get sitter profile ids
  SELECT id INTO sitter1_profile_id FROM sitters WHERE user_id = (SELECT id FROM users WHERE email = 'sitter1@mailinator.com');
  SELECT id INTO sitter2_profile_id FROM sitters WHERE user_id = (SELECT id FROM users WHERE email = 'sitter2@mailinator.com');

  -- Insert into booking_sitter_recipients for all booking requests for sitter1
  FOR booking_id IN SELECT id FROM booking_requests LOOP
    INSERT INTO booking_sitter_recipients (booking_request_id, sitter_id)
    VALUES (booking_id, sitter1_profile_id);
  END LOOP;

  -- Insert into booking_sitter_recipients for some booking requests for sitter2
  FOR booking_id IN SELECT id FROM booking_requests LIMIT 3 LOOP
    INSERT INTO booking_sitter_recipients (booking_request_id, sitter_id)
    VALUES (booking_id, sitter2_profile_id);
  END LOOP;
END $$;