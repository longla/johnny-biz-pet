# Booking Workflow Improvement Plan

This document outlines the plan to improve the booking request workflow for both admins and sitters.

## Git Workflow

We will use a feature-branch workflow with a main integration branch for this project.

1.  **`main` branch:** Production-ready code.
2.  **`develop` branch:** Main development branch.
3.  **`feature/booking-workflow` branch:** The main integration branch for this feature. All individual task branches will be merged into this branch.
4.  **Individual Task Branches:**
    *   **Naming Convention:** `feature/<task-name>` for Gemini's tasks, and `jules/<task-name>` for Jules' tasks.
    *   All task branches will be created from the `develop` branch.

### Merging Strategy

1.  When a task is complete, the owner will create a pull request (PR) to merge their branch into the `feature/booking-workflow` branch.
2.  The user will review and approve all PRs.
3.  Once all tasks are complete and merged into `feature/booking-workflow`, the user will merge this branch into `develop`.

## Phases and Tasks

### Phase 1: Database Schema Changes (Owner: Gemini)

1.  **Modify `booking_sitter_recipients` Table:**
    *   **Action:** Add a `status` column of type `VARCHAR(50)` with a default value of `'notified'`.
    *   **Allowed Statuses:** `notified`, `accepted`, `declined`, `unavailable`.

2.  **Create `booking_notes` Table:**
    *   **Action:** Create a new table to store notes related to a booking.
    *   **Columns:**
        *   `id` (UUID, primary key)
        *   `booking_request_id` (UUID, foreign key to `booking_requests.id`)
        *   `user_id` (UUID, foreign key to `users.id`)
        *   `note` (TEXT)
        *   `created_at` (TIMESTAMPTZ)

### Phase 2: Backend (API Routes & Real-time) (Owner: Gemini)

1.  **Refactor `accept-booking` API Route:**
    *   **Action:** Modify the `src/pages/api/sitter/accept-booking.ts` API route to handle the "first come, first served" logic and prevent race conditions.

2.  **Enable Real-time on `booking_requests` Table:**
    *   **Action:** Investigate and enable Supabase's real-time capabilities for the `booking_requests` table.

3.  **Create API Route for Booking Notes:**
    *   **Action:** Create a new API route `src/pages/api/bookings/[id]/notes.ts` to handle creating and fetching notes for a booking.

### Phase 3: Frontend (UI)

1.  **Unified Booking Details Page (Owner: Gemini)**
    *   **Action:** Create a new page under `src/pages/bookings/[id].tsx`.
    *   **Features:**
        *   Fetch and display booking details.
        *   Implement role-based access control.
        *   Display a real-time status indicator.

2.  **Booking Notes UI (Owner: Jules)**
    *   **Action:** Create the UI for the booking notes section on the new details page.
    *   **Task ID:** (To be created)

3.  **Sitter Dashboard (Owner: Gemini)**
    *   **Action:** Modify the sitter dashboard at `src/pages/sitter/index.tsx` to use Supabase real-time for the list of new booking requests.

4.  **Sitter "My Bookings" Page (Owner: Jules)**
    *   **Action:** Update the `src/pages/sitter/my-bookings.tsx` page to show "Upcoming" and "Past" bookings.
    *   **Task ID:** (To be created)

5.  **Admin Dashboard (Owner: Gemini & Jules)**
    *   **Action (Gemini):** Update the admin dashboard UI to display more detailed booking information.
    *   **Action (Jules):** Add a new column to the booking requests table to show the number of notified sitters.
    *   **Task ID (Jules):** (To be created)
