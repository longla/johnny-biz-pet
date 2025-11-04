-- Update existing data to use uppercase statuses
UPDATE booking_sitter_recipients SET status = UPPER(status);

-- Update the accept_booking_request function to use uppercase statuses
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
BEGIN
  -- Get the sitter's profile ID and base rate
  SELECT id, base_rate_cents INTO sitter_profile_id, sitter_base_rate_cents FROM sitters WHERE user_id = sitter_user_id;

  -- Check if the booking is still pending
  SELECT status, end_date - start_date INTO booking_status, num_days FROM booking_requests WHERE id = booking_id;
  IF booking_status != 'PENDING_SITTER_ACCEPTANCE' THEN
    RAISE EXCEPTION 'Booking has already been taken';
  END IF;

  -- Calculate base cost
  base_cost_cents := sitter_base_rate_cents * num_days;

  -- Calculate addons cost
  SELECT COALESCE(SUM(sa.price_cents), 0) INTO addons_cost_cents
  FROM booking_addons ba
  JOIN sitter_addons sa ON ba.sitter_addon_id = sa.id
  WHERE ba.booking_request_id = booking_id;

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

-- Create the decline_booking_request function
CREATE OR REPLACE FUNCTION decline_booking_request(
  p_booking_id uuid,
  p_sitter_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_sitter_id uuid;
BEGIN
  -- Get the sitter's profile ID from the user ID
  SELECT id INTO v_sitter_id FROM sitters WHERE user_id = p_sitter_user_id;

  -- Update the status of the specific sitter to 'DECLINED'
  UPDATE booking_sitter_recipients
  SET status = 'DECLINED'
  WHERE booking_request_id = p_booking_id AND sitter_id = v_sitter_id;

  -- Check if there are any other sitters for this booking who are still 'NOTIFIED'
  IF NOT EXISTS (
    SELECT 1
    FROM booking_sitter_recipients
    WHERE booking_request_id = p_booking_id AND status = 'NOTIFIED'
  ) THEN
    -- If no other sitters are notified, update the main booking request status to 'DECLINED'
    UPDATE booking_requests
    SET status = 'DECLINED'
    WHERE id = p_booking_id;
  END IF;
END;
$$;

-- Add a check constraint to the status column in booking_sitter_recipients
ALTER TABLE booking_sitter_recipients
ADD CONSTRAINT booking_sitter_recipients_status_check
CHECK (status IN ('NOTIFIED', 'ACCEPTED', 'DECLINED', 'UNAVAILABLE'));

-- Alter the default value for the status column
ALTER TABLE booking_sitter_recipients
ALTER COLUMN status SET DEFAULT 'NOTIFIED';
