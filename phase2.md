# MVP2: Sitter Network and Booking Management

## 1.0 Overview

The goal of MVP2 is to extend the existing web application into a multi-sitter platform. This will enable the business owner (Admin) to manage a network of pet sitters, and for those sitters to receive and manage booking requests directly through the application.

## 2.0 User Roles & Permissions

The application will support two primary user roles with distinct permissions:

- **Admin (Business Owner):** Has complete oversight of the system. Manages sitters, rates, and all booking requests. This role is for the business owner.
- **Sitter:** A member of the sitter network, associated with a specific geographical area (County). They can receive and respond to booking requests within their county.

## 3.0 Functional Requirements

### 3.1 Sitter Onboarding & Management (Admin)

- **Onboarding Workflow:** The Admin initiates sitter onboarding by creating an account with all required information (e.g., name, email, phone number, county) and setting a temporary password. The system then automatically sends an email to the sitter, prompting them to log in and set their permanent password. For now, this temporary password/link does not need to expire.
- **Profile Management:** Admins are responsible for managing all aspects of a sitter's profile information. Sitters will not have the ability to edit their own profiles in this version.
- **Sitter Deactivation:** Admins can deactivate a sitter's account via an `is_active` flag. Deactivated sitters cannot log in or receive new booking requests, but their historical data remains in the system.
- **Rate Control:** Admins can set and update a base per-night fee for each sitter.
- **Add-on Management:** Admins can define and manage a list of custom add-on services (e.g., 'Administer Medication', 'Grooming') and their prices for each individual sitter.
- **Discount Management:** Admins can define and manage long-term stay discounts for each sitter using a rule-based system (e.g., X% off for stays longer than Y days).

### 3.2 Booking & Request Workflow

1.  **Request Initiation:** A customer submits a booking request through the public-facing website.
2.  **Notification:** The customer selects one or several sitters within the county for their booking request. The system then sends an **SMS notification** to the selected sitters.
3.  **Sitter Action & Status Changes:**
    - Sitters log into their dashboard to view the full request details.
    - **Accept:** The first sitter to accept is assigned the booking. The request status changes to `ACCEPTED`.
    - **Decline:** If a sitter declines, the system checks if there are other pending sitters for that request. The status changes to `DECLINED` only after _every_ notified sitter has declined.
    - **Expiration:** If no sitter accepts the request within a configurable time limit (defaulting to 12 hours), the status automatically changes to `EXPIRED_UNCLAIMED`.
4.  **Status Tracking & Intervention (Admin):**
    - The Admin dashboard will display all booking requests and their current status.
    - The dashboard will provide a specific view to highlight `DECLINED` and `EXPIRED_UNCLAIMED` requests, allowing the Admin to intervene manually.
5.  **Sitter Dashboard:** Sitters will have a dashboard to manage their work. This will include separate views for:
    - New incoming requests.
    - Upcoming, accepted bookings.
    - A history of their past (completed) bookings.

6.  **Post-Acceptance & Confirmation Workflow:**
    - **Notification to Other Sitters:** Once a request is `ACCEPTED`, the system will automatically notify all other sitters who received the initial request that the booking is no longer available.
    - **Manual Customer Follow-up:** After a booking is accepted, the assigned sitter or the Admin will manually contact the customer. If it is a new customer, they will be sent a link to the waiver to sign. All payment and finalization steps are handled manually outside of the system.

7.  **Unsuccessful Booking Workflow:**
    - **Admin Notification:** If a request's status becomes `DECLINED` or `EXPIRED_UNCLAIMED`, the Admin will be notified. The Admin is then responsible for manually contacting the customer.

8.  **Cancellation:**
    - All cancellations are handled by the Admin. If a customer or a sitter needs to cancel a booking, they must contact the Admin, who will then update the booking status to `CANCELED_BY_ADMIN`. If the booking was already `ACCEPTED`, the Admin is responsible for notifying the other party.

### 3.3 Pet Profile Management

- When a customer submits a booking request, they will provide their pet's information.
- This information will be used to create and store a persistent pet profile associated with the customer.

### 3.4 Waiver System Extension

- **Waiver Generation:** Each sitter will have a unique, shareable link to the waiver form, which dynamically includes their information. Sitter signatures will be uploaded by the Admin and stored in Supabase Storage.
- **Customer Onboarding via Waiver:** When a customer fills out and signs a waiver:
    - The customer's information (name, email, etc.) will be used to create or update their profile in the `customers` table.
    - The final, signed PDF of the waiver will be stored in Supabase Storage.
- **Waiver Record:** A record of the signed waiver will be created, linking the customer, the sitter, and the path to the signed PDF file in Supabase Storage.

### 3.5 Technical Considerations

- **SMS Notifications:** Will be implemented using a third-party service, with **Twilio** as the initial choice.
- **Expiration Time Limit:** The time limit for a request to expire will be a configurable value in the application settings.
- **Authentication:** User authentication for Admins and Sitters will be handled by the Supabase Authentication service. This provides a secure and robust solution for user management and login workflows.
- **Database and Storage:** The project will use Supabase for its PostgreSQL database and Supabase Storage for file management (e.g., signed waivers, sitter signatures).

### 3.6 Financials & Payment Tracking

- **Cost Calculation:** The total cost of a booking will be calculated based on the sitter's base rate, the duration of the stay, any applicable long-term discounts, and selected add-on services.
- **Price Freezing:** To ensure historical accuracy, the calculated total cost and its components (base rate, discount, add-on costs) will be stored with the booking record at the time of confirmation.
- **Payment Status:** The system will track the payment status of each booking (e.g., `UNPAID`, `PAID`, `REFUNDED`). For MVP2, updating the payment status will be a manual action performed by the Admin.

## 4.0 Initial Data Model

The database schema for this project is defined in the [database_schema.sql](database_schema.sql) file.
