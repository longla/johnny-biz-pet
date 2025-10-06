# MVP2: Sitter Network and Booking Management

## 1.0 Overview

The goal of MVP2 is to extend the existing web application into a multi-sitter platform. This will enable the business owner (Admin) to manage a network of pet sitters, and for those sitters to receive and manage booking requests directly through the application.

## 2.0 User Roles & Permissions

The application will support two primary user roles with distinct permissions:

*   **Admin (Business Owner):** Has complete oversight of the system. Manages sitters, rates, and all booking requests. This role is for the business owner.
*   **Sitter:** A member of the sitter network, associated with a specific geographical area (County). They can receive and respond to booking requests within their county.

## 3.0 Functional Requirements

### 3.1 Sitter Onboarding & Management (Admin)

*   **Onboarding Workflow:** The Admin initiates sitter onboarding by creating an account with all required information (e.g., name, email, phone number, county) and setting a temporary password. The system then automatically sends an email to the sitter, prompting them to log in and set their permanent password. For now, this temporary password/link does not need to expire.
*   **Profile Management:** Admins are responsible for managing all aspects of a sitter's profile information. Sitters will not have the ability to edit their own profiles in this version.
*   **Sitter Deactivation:** Admins can deactivate a sitter's account via an `is_active` flag. Deactivated sitters cannot log in or receive new booking requests, but their historical data remains in the system.
*   **Rate Control:** Admins can set and update a base per-night fee for each sitter.
*   **Add-on Management:** Admins can define and manage a list of custom add-on services (e.g., 'Administer Medication', 'Grooming') and their prices for each individual sitter.
*   **Discount Management:** Admins can define and manage long-term stay discounts for each sitter using a rule-based system (e.g., X% off for stays longer than Y days).

### 3.2 Booking & Request Workflow

1.  **Request Initiation:** A customer submits a booking request through the public-facing website.
2.  **Notification:** The system identifies the `County` for the request and sends an **SMS notification** to all active sitters in that county.
3.  **Sitter Action & Status Changes:**
    *   Sitters log into their dashboard to view the full request details.
    *   **Accept:** The first sitter to accept is assigned the booking. The request status changes to `ACCEPTED`.
    *   **Decline:** If a sitter declines, the system checks if there are other pending sitters for that request. The status changes to `DECLINED` only after *every* notified sitter has declined.
    *   **Expiration:** If no sitter accepts the request within a configurable time limit (defaulting to 12 hours), the status automatically changes to `EXPIRED_UNCLAIMED`.
4.  **Status Tracking & Intervention (Admin):**
    *   The Admin dashboard will display all booking requests and their current status.
    *   The dashboard will provide a specific view to highlight `DECLINED` and `EXPIRED_UNCLAIMED` requests, allowing the Admin to intervene manually.
5.  **Sitter Dashboard:** Sitters have a dashboard to view new incoming requests and a separate view for their upcoming, accepted bookings.

### 3.3 Pet Profile Management

*   For MVP2, pet information will be kept simple.
*   When a customer submits a booking request, they will include all relevant pet information in a single "notes" or "details" field.

### 3.4 Waiver System Extension

*   Each sitter will have their own unique, shareable link to the waiver, which dynamically populates their information.
*   Each sitter will have their own signature, which is uploaded once by the Admin and stored in the system. This signature is then used to generate the waiver PDF for a customer to review and countersign.
*   For now, the signed waiver does not need to be stored in relation to a specific booking.

### 3.5 Technical Considerations

*   **SMS Notifications:** Will be implemented using a third-party service, with **Twilio** as the initial choice.
*   **Expiration Time Limit:** The time limit for a request to expire will be a configurable value in the application settings.

## 4.0 Initial Data Model Concepts

*   **users:** (Handles authentication)
    *   `id`, `email`, `phone_number` (for SMS), `role` (ADMIN or SITTER)
*   **sitters:** (Profile information for sitters)
    *   `id`, `user_id` (links to `users`), `county`, `base_rate`, `long_term_discount_rule`, `signature_url`, `is_active` (BOOLEAN, default: true)
*   **sitter_addons:** (Custom services for each sitter)
    *   `id`, `sitter_id` (links to `sitters`), `name`, `price`, `description`
*   **booking_requests:**
    *   `id`, `customer_name`, `customer_email`, `start_date`, `end_date`, `county`, `pet_details` (Text)
    *   `status` (ENUM: `PENDING_SITTER_ACCEPTANCE`, `ACCEPTED`, `DECLINED`, `EXPIRED_UNCLAIMED`, `CANCELED_BY_ADMIN`, `COMPLETED`)
    *   `assigned_sitter_id` (links to `sitters`, nullable)
*   **booking_addons_junction:** (Links selected add-ons to a booking)
    *   `booking_request_id`, `sitter_addon_id`

## 5.0 Questions for Clarification

We have two remaining high-level questions. Let's break down the "Admin Intervention" question to get more specific.

1.  **[PENDING FEEDBACK] Add-on Selection:** When does a customer choose add-ons? Are they selected during the initial booking request, or are they added later by the Admin or Sitter after the booking is accepted?
2.  **Admin Intervention Tools:** When an Admin is viewing a `DECLINED` or `EXPIRED_UNCLAIMED` request on their dashboard, what specific actions (tools) should be available to them? Please select all that apply:
    *   **a) Manual Assignment:** The ability to override the process and assign the request directly to a specific sitter (this could even be a sitter outside the original county).
    *   **b) Contact Customer:** A button to "Send Email to Customer" that could open a pre-filled email template (e.g., "We're sorry, we couldn't find a sitter for your requested dates...").
    *   **c) Cancel Request:** The ability to mark the request as `CANCELED_BY_ADMIN`, effectively closing it out.