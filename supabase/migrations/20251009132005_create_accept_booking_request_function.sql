CREATE OR REPLACE FUNCTION accept_booking_request(booking_id uuid, sitter_user_id uuid)
RETURNS void AS $$
DECLARE
  sitter_profile_id uuid;
  booking_status text;
BEGIN
  -- Get the sitter's profile ID
  SELECT id INTO sitter_profile_id FROM sitters WHERE user_id = sitter_user_id;

  -- Check if the booking is still pending
  SELECT status INTO booking_status FROM booking_requests WHERE id = booking_id;
  IF booking_status != 'PENDING_SITTER_ACCEPTANCE' THEN
    RAISE EXCEPTION 'Booking has already been taken';
  END IF;

  -- Update the booking request
  UPDATE booking_requests
  SET
    status = 'ACCEPTED',
    assigned_sitter_id = sitter_profile_id
  WHERE id = booking_id;

  -- Update the booking_sitter_recipients table
  UPDATE booking_sitter_recipients
  SET status = 'accepted'
  WHERE booking_request_id = booking_id AND sitter_id = sitter_profile_id;

  UPDATE booking_sitter_recipients
  SET status = 'unavailable'
  WHERE booking_request_id = booking_id AND sitter_id != sitter_profile_id;
END;
$$ LANGUAGE plpgsql;