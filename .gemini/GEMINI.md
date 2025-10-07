# Gemini CLI Context for Ruh Roh Retreat

This document provides context for the Gemini CLI to understand the Ruh Roh Retreat project.

## Project Overview

Ruh Roh Retreat is a Next.js application for a boutique dog care service. The project is currently being extended into a multi-sitter booking platform (Phase 2), allowing the business owner to manage a network of sitters who can accept and manage booking requests.

## Technical Stack

-   **Framework:** Next.js with TypeScript
-   **Styling:** Tailwind CSS
-   **Database:** Supabase (PostgreSQL)
-   **Authentication:** Supabase Auth
-   **File Storage:** Supabase Storage
-   **SMS Notifications:** Twilio

## Project Management & Planning

-   **Phase 2 Requirements:** The detailed functional and technical requirements for the current project phase (Phase 2) are documented in `phase2.md`.
-   **Task Tracking:** The breakdown of work into milestones and trackable tasks is located in `phase2_plan.md`. This file serves as the project's to-do list.
-   **UI/UX Requirements:** The plan (`phase2_plan.md`) specifies that all new portals must have a **clean, modern, and responsive** design using **Tailwind CSS**. It also mandates robust handling of **loading, error, and empty states**.

## Local Memory

This project uses a `.gemini/config` file to store local memory for the Gemini CLI. The following keys are available:

-   `business_email`: The primary email address for the business (`hello@ruhrohretreat.com`).
-   `github_project`: The name of the associated GitHub project (`Ruh Roh Retreat`).

## Custom Commands

The following custom commands are available for this project:

### issue add

-   **Description:** Creates a GitHub issue from a plan discussed in the chat. It first saves the plan to a temporary `plan.md` file and then uses the `gh` CLI to create an issue, assigning it to the project defined in the `github_project` memory variable.
-   **Source File:** `.gemini/commands/issue/add.toml`

## Database Access

-   **Development Database:** `supabase_rrr_dev`
    -   Accessed via MCP.
    -   **Rule:** All database modifications must be performed via migration scripts. Direct updates are not permitted.
-   **Production Database:** `supabase_rrr_prod`
    -   **Rule:** Access is strictly read-only.
