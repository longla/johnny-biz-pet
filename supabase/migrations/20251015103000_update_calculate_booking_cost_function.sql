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