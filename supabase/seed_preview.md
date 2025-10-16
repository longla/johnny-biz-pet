# Supabase Seed Data Preview

This document provides a preview of the data seeded by the `supabase/seed.sql` script. It is designed to give an overview of the test data available for development and testing.

---

## Sitter Pricing and Services

### Sitter 1 (`sitter1@mailinator.com`)

*   **Base Rate:** $50.00 per night (5000 cents)
*   **Add-ons:**
    *   **Daily Walk:** $10.00 (1000 cents)
    *   **Grooming:** $25.00 (2500 cents)
*   **Discounts:**
    *   10% off for stays longer than 7 days (8+ days)
    *   20% off for stays longer than 14 days (15+ days)

### Sitter 2 (`sitter2@mailinator.com`)

*   **Base Rate:** $60.00 per night (6000 cents)
*   **Add-ons:**
    *   **Medication Administration:** $5.00 (500 cents)
    *   **Special Diet Fee:** $10.00 (1000 cents)
*   **Discounts:**
    *   5% off for stays longer than 5 days (6+ days)
    *   15% off for stays longer than 10 days (11+ days)

---

## Test Booking Scenarios

The following booking requests have been created to test various pricing and discount scenarios:

### For Sitter 1 (County One)

*   **Booking 1 (5 nights):**
    *   **Purpose:** Test a standard booking with no discount.
    *   **Add-ons:** Daily Walk.
    *   **Expected Discount:** 0%

*   **Booking 2 (8 nights):**
    *   **Purpose:** Test the first discount tier (10%).
    *   **Add-ons:** Daily Walk, Grooming.
    *   **Expected Discount:** 10%

*   **Booking 3 (16 nights):**
    *   **Purpose:** Test the second discount tier (20%).
    *   **Add-ons:** Grooming.
    *   **Expected Discount:** 20%

### For Sitter 2 (County Two)

*   **Booking 4 (4 nights):**
    *   **Purpose:** Test a standard booking with no discount.
    *   **Add-ons:** Medication Administration.
    *   **Expected Discount:** 0%
    *   **Note:** This booking is also assigned to Sitter 1 to test multiple sitters for a single request.

*   **Booking 5 (7 nights):**
    *   **Purpose:** Test the first discount tier (5%).
    *   **Add-ons:** Special Diet Fee.
    *   **Expected Discount:** 5%
