CREATE TABLE booking_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_request_id UUID REFERENCES booking_requests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);