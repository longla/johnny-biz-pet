CREATE OR REPLACE FUNCTION calculate_booking_cost(booking_id uuid, sitter_profile_id uuid)
RETURNS json AS $$
DECLARE
  sitter_base_rate_cents integer;
  num_days integer;
  addons_cost_cents integer;
  discount_percentage integer;
  base_cost_cents integer;
  discount_amount_cents integer;
  calculated_total_cost_cents integer;
BEGIN
  -- Get sitter's base rate
  SELECT base_rate_cents INTO sitter_base_rate_cents FROM sitters WHERE id = sitter_profile_id;

  -- Get booking duration
  SELECT end_date - start_date INTO num_days FROM booking_requests WHERE id = booking_id;

  -- Calculate base cost
  base_cost_cents := sitter_base_rate_cents * num_days;

  -- Calculate addons cost
  SELECT COALESCE(SUM(price_cents_at_booking), 0) INTO addons_cost_cents
  FROM booking_addons
  WHERE booking_request_id = booking_id;

  -- Calculate discount
  SELECT COALESCE(MAX(percentage), 0) INTO discount_percentage
  FROM sitter_discounts
  WHERE sitter_id = sitter_profile_id AND min_days <= num_days;

  discount_amount_cents := (base_cost_cents * discount_percentage) / 100;

  -- Calculate final total cost
  calculated_total_cost_cents := base_cost_cents - discount_amount_cents + addons_cost_cents;

  RETURN json_build_object(
    'total_cost_cents', calculated_total_cost_cents,
    'base_rate_at_booking_cents', sitter_base_rate_cents,
    'addons_total_cost_cents', addons_cost_cents,
    'discount_applied_cents', discount_amount_cents
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION accept_booking_request(booking_id uuid, sitter_user_id uuid)
RETURNS void AS $$
DECLARE
  sitter_profile_id uuid;
  sitter_base_rate_cents integer;
  booking_status text;
  num_days integer;
  addons_cost_cents integer;
  discount_percentage integer;
  base_cost_cents integer;
  discount_amount_cents integer;
  calculated_total_cost_cents integer;
  addon_record record;
BEGIN
  -- Get the sitter's profile ID and base rate
  SELECT id, base_rate_cents INTO sitter_profile_id, sitter_base_rate_cents FROM sitters WHERE user_id = sitter_user_id;

  -- Check if the booking is still pending
  SELECT status, end_date - start_date INTO booking_status, num_days FROM booking_requests WHERE id = booking_id;
  IF booking_status != 'PENDING_SITTER_ACCEPTANCE' THEN
    RAISE EXCEPTION 'Booking has already been taken';
  END IF;

  -- Update addon prices before calculating total
  FOR addon_record IN
    SELECT ba.sitter_addon_id, sa.price_cents
    FROM booking_addons ba
    JOIN sitter_addons sa ON ba.sitter_addon_id = sa.id
    WHERE ba.booking_request_id = booking_id
  LOOP
    UPDATE booking_addons
    SET price_cents_at_booking = addon_record.price_cents
    WHERE booking_request_id = booking_id AND sitter_addon_id = addon_record.sitter_addon_id;
  END LOOP;

  -- Calculate base cost
  base_cost_cents := sitter_base_rate_cents * num_days;

  -- Calculate addons cost from the now-updated prices
  SELECT COALESCE(SUM(price_cents_at_booking), 0) INTO addons_cost_cents
  FROM booking_addons
  WHERE booking_request_id = booking_id;

  -- Calculate discount
  SELECT COALESCE(MAX(percentage), 0) INTO discount_percentage
  FROM sitter_discounts
  WHERE sitter_id = sitter_profile_id AND min_days <= num_days;

  discount_amount_cents := (base_cost_cents * discount_percentage) / 100;

  -- Calculate final total cost
  calculated_total_cost_cents := base_cost_cents - discount_amount_cents + addons_cost_cents;

  -- Update the booking request
  UPDATE booking_requests
  SET
    status = 'ACCEPTED',
    assigned_sitter_id = sitter_profile_id,
    total_cost_cents = calculated_total_cost_cents,
    base_rate_at_booking_cents = sitter_base_rate_cents,
    addons_total_cost_cents = addons_cost_cents,
    discount_applied_cents = discount_amount_cents
  WHERE id = booking_id;

  -- Update the booking_sitter_recipients table
  UPDATE booking_sitter_recipients
  SET status = 'ACCEPTED'
  WHERE booking_request_id = booking_id AND sitter_id = sitter_profile_id;

  UPDATE booking_sitter_recipients
  SET status = 'UNAVAILABLE'
  WHERE booking_request_id = booking_id AND sitter_id != sitter_profile_id;
END;
$$ LANGUAGE plpgsql;