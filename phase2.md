# Phase 2 Implementation Plan

## Goal

The goal of Phase 2 is to create a web application for internal use by sitters and administrators at Ruh Roh Retreat. This application will streamline operations, manage schedules, and provide a centralized platform for all internal activities.

## Discovery Questions

To architect the solution and create a detailed project plan, we need to answer the following questions.

### User Roles & Permissions

*   **Question:** What are the specific roles needed for the application? (e.g., Admin, Sitter)
    **Answer:** We need 2 roles:
    1.  **Admin:** The business owner (Johnny).
    2.  **Sitter:** There will be multiple sitters, and each sitter should be associated with a County (location).
*   **Question:** What are the responsibilities of an Admin? What actions can they perform?
    **Answer:** Based on the process description, the Admin's responsibilities are:
    1.  **Oversee the entire booking process:**
        *   View new booking requests from the landing page.
        *   Monitor notifications sent to sitters.
        *   Track whether sitters accept or reject requests.
    2.  **Manage sitter rates:**
        *   View and manage the rates for each sitter.
*   **Question:** What are the responsibilities of a Sitter? What actions can they perform?
    **Answer:** A sitter's responsibilities are:
    1.  Receive booking requests for the county they are associated with.
    2.  Respond to booking requests by either accepting or rejecting them.
*   **Question:** Will there be a "Super Admin" role with unrestricted access?
    **Answer:** No, a "Super Admin" role is not necessary for now. The "Admin" role will have the highest level of access.
*   **Question:** How are users created and managed?
    **Answer:** Users will be managed using Supabase authentication. This will handle user creation, login, and role management.

### Core Features

*   **Question:** What information should be visible on the main dashboard for each role?
    **Answer:**
    *   **Admin Dashboard:**
        1.  View all booking requests.
        2.  See the current status of each request (e.g., pending, accepted, rejected).
        3.  Monitor booking notifications sent to sitters.
        4.  Track which sitters have accepted or rejected a request.
        5.  Manage sitter rates.
    *   **Sitter Dashboard:**
        1.  View pending booking requests assigned to them.
        2.  See a list of their accepted requests.
*   **Client Management:**
    *   How will client information be managed? (create, read, update, delete)
    *   What specific information needs to be stored for each client? (e.g., name, contact info, address)
*   **Pet Management:**
    *   How will pet information be managed?
    *   What specific information needs to be stored for each pet? (e.g., name, breed, age, medical notes, feeding instructions, vet info)
*   **Scheduling & Bookings:**
    *   How will sitters manage their availability?
    *   How will admins create and assign bookings to sitters?
    *   What information is needed for a booking? (e.g., client, pet(s), dates, services, notes)
    *   Should the system handle recurring bookings?
*   **Reporting & Analytics:**
    *   What kind of reports are needed? (e.g., financial reports, booking history, sitter performance)
    *   What key metrics should be tracked?

### Technical & Infrastructure

*   Given the main website is a Next.js app, should this internal app be part of the same project or a separate one?
*   How will users authenticate? (e.g., email/password, Google)
*   Will there be a need for email notifications? (e.g., new booking, booking reminder)

### Milestones & Timeline

*   What is the desired timeline for this project?
*   What are the major milestones we should aim for? (e.g., MVP, full launch)
*   What features are essential for the Minimum Viable Product (MVP)?
