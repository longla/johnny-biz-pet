# Phase 2: Project Plan & Breakdown

## 1.0 Overview

The goal of Phase 2 is to transform the website into a multi-sitter booking platform. This involves creating two new, secure portals (sections within the single application) for the **Admin** and for **Sitters**.

The Admin portal will be for managing the entire business (sitters, rates, bookings), while the Sitter portal will be for sitters to manage the booking requests they receive.

This project will use Supabase for the PostgreSQL database, user authentication, and file storage, and will integrate Twilio for SMS notifications.

The project plan is designed to build the backend and internal portals first, leaving the refactoring of the public-facing landing page for the final milestone to minimize disruption to the current live site.

---

## 2.0 UI/UX & Technical Requirements

This section outlines the key design principles and technical requirements for the new Admin and Sitter portals.

- **Design System:** The portals will be built with a **clean, modern, and responsive** design aesthetic.
- **CSS Framework:** **Tailwind CSS** will be used for styling, consistent with the existing project.
- **State Handling:** All user-facing components must gracefully handle intermediate states, including:
  - **Loading States:** Displaying spinners or skeletons while data is being fetched.
  - **Error States:** Showing user-friendly error messages if an API call or action fails.
  - **Empty States:** Clearly indicating when a list or table has no data to show (e.g., "No new bookings found.").

---

## 3.0 Proposed Project Breakdown

### Milestone 1: Foundational Backend Setup

This milestone focuses on setting up the core infrastructure. All work is on the backend and has no impact on the current site.

- [x] **Implement Database:** Create all the tables (`users`, `sitters`, `booking_requests`, etc.) in Supabase as defined in the `database_schema.sql` file.
- [x] **Configure Authentication:** Set up Supabase Auth and establish the rules and triggers needed to link the authentication service with our public `users` table.
- [x] **Create Admin User:** Manually create the first `ADMIN` user directly in Supabase to enable access for developing the Admin Portal.

### Milestone 2: Build the Admin Portal

This involves creating the secure dashboard for the business owner to manage the platform. This portal will be a section of the application accessible only to users with the `ADMIN` role.

- [x] **Build Admin UI:** Create the login page and the main dashboard layout for the admin section.
- [x] **Implement Sitter Management:**
  - [x] Build the interface for the Admin to create, view, and edit sitter profiles.
  - [x] Implement the sitter onboarding workflow (creating the user, sending the invite email).
  - [x] Build the tools for managing each sitter's rates, add-ons, and discounts.
- [x] **Build Booking Management:** Create the main dashboard view where the Admin can see all booking requests, their current status, and financial details. Allow the Admin to manually update payment status or cancel a booking.

### Milestone 3: Build the Sitter Portal (Mobile-First)

This involves creating the secure dashboard for sitters to manage their jobs. This portal will be a section of the application accessible only to users with the `SITTER` role. The UI will be designed with a mobile-first approach.

- [ ] **Implement Sitter Login:** Allow sitters to log in for the first time using the link from their invitation email to set their password.
- [ ] **Build Sitter UI:** Create the dashboard layout for the Sitter portal, ensuring it is responsive and mobile-friendly.
- [ ] **Develop Request Management:**
  - [ ] Display a list of new, pending booking requests assigned to the logged-in sitter in a mobile-friendly way.
  - [ ] Implement the "Accept" and "Decline" buttons and the backend logic that follows (e.g., updating status, notifying other sitters).
- [ ] **Develop "My Bookings" View:** Create the views where a sitter can see their upcoming, confirmed bookings as well as a history of their past, completed bookings, optimized for mobile.

### Milestone 4: Refactor the Public Booking & Waiver System

This is the final milestone where we connect the new backend to the public-facing website.

- [ ] **Update Booking Form:**
  - [ ] Redesign the form to allow customers to select a county, view available sitters, and choose one or more.
  - [ ] Display the selected sitter's specific add-ons for the customer to choose.
  - [ ] Update the form submission logic to create all the necessary records in the new database tables (`customers`, `pets`, `booking_requests`, etc.).
- [ ] **Integrate Notifications:** Connect the form submission to a backend function that triggers the Twilio SMS notifications to sitters.
- [ ] **Update Waiver System:**
  - [ ] Build the dynamic waiver page that pulls in sitter information.
  - [ ] Implement the waiver submission logic to save the customer's data, upload the signed PDF to Supabase Storage, and create the `signed_waivers` record.

### Milestone 5: Admin Portal 2.0 (Mobile-First Redesign)

This milestone focuses on redesigning and rebuilding the Admin Portal with a mobile-first approach to ensure a seamless experience on all devices.

- **Admin Dashboard:**
  - [ ] Design and implement a responsive layout for the dashboard that prioritizes mobile usability.
  - [ ] Ensure key metrics (e.g., total bookings, revenue, new sitters) are displayed clearly on small screens.
  - [ ] Redesign dashboard components (charts, tables, etc.) to be responsive and touch-friendly.
  - [ ] Re-implement loading, error, and empty states for all data visualisations.
- **Sitters Management:**
  - [ ] Design and implement a mobile-friendly list or card view for sitters that is easy to navigate on a small screen.
  - [ ] Create a new, responsive page for viewing sitter details.
  - [ ] Redesign the "Add Sitter" and "Edit Sitter" forms to be fully responsive and easy to use on mobile devices.
  - [ ] Implement a mobile-friendly search and filtering solution for the sitters list.
  - [ ] Ensure all actions (e.g., adding, editing, deleting a sitter) use responsive modals or confirmation dialogs.
  - [ ] Re-implement loading, error, and empty states for the sitters list and details pages.
