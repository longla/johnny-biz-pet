-- ### Users & Authentication ###

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(50),
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'SITTER')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ### Sitters & Services ###

CREATE TABLE sitters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    county VARCHAR(100) NOT NULL,
    base_rate_cents INT NOT NULL, -- Store currency in cents to avoid floating point issues
    signature_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ### Customers & Pets ###

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    breed VARCHAR(100),
    age INT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE signed_waivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    sitter_id UUID REFERENCES sitters(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    signed_at TIMESTAMPTZ DEFAULT now()
);


CREATE TABLE sitter_addons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sitter_id UUID REFERENCES sitters(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price_cents INT NOT NULL, -- Store currency in cents
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE sitter_discounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sitter_id UUID REFERENCES sitters(id) ON DELETE CASCADE,
    min_days INT NOT NULL,
    percentage INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (sitter_id, min_days)
);

-- ### Bookings ###

CREATE TABLE booking_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    county VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_SITTER_ACCEPTANCE' CHECK (status IN (
        'PENDING_SITTER_ACCEPTANCE',
        'ACCEPTED',
        'DECLINED',
        'EXPIRED_UNCLAIMED',
        'CANCELED_BY_ADMIN',
        'COMPLETED'
    )),
    assigned_sitter_id UUID REFERENCES sitters(id),

    -- Financial Snapshot
    total_cost_cents INT,
    base_rate_at_booking_cents INT,
    discount_applied_cents INT,
    addons_total_cost_cents INT,

    -- Payment Tracking
    payment_status VARCHAR(50) DEFAULT 'UNPAID' CHECK (payment_status IN ('UNPAID', 'PAID', 'REFUNDED')),
    amount_paid_cents INT DEFAULT 0,
    payment_method VARCHAR(100),
    paid_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT now()
);

-- ### Junction Tables ###

-- Junction table to track which sitters were notified for a booking request
CREATE TABLE booking_sitter_recipients (
    booking_request_id UUID REFERENCES booking_requests(id) ON DELETE CASCADE,
    sitter_id UUID REFERENCES sitters(id) ON DELETE CASCADE,
    PRIMARY KEY (booking_request_id, sitter_id)
);

-- Junction table to link pets to a booking request
CREATE TABLE booking_pets (
    booking_request_id UUID REFERENCES booking_requests(id) ON DELETE CASCADE,
    pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
    PRIMARY KEY (booking_request_id, pet_id)
);

-- Junction table to link selected add-ons to a booking request
CREATE TABLE booking_addons (
    booking_request_id UUID REFERENCES booking_requests(id) ON DELETE CASCADE,
    sitter_addon_id UUID REFERENCES sitter_addons(id) ON DELETE CASCADE,
    PRIMARY KEY (booking_request_id, sitter_addon_id)
);