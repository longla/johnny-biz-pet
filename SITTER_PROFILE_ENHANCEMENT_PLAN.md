### **Sitter Profile Enhancement Plan**

**Objective:** Enhance the sitter profile to include first name, last name, and address, and update the Admin Portal to allow management of this new information.

---

#### **Phase 1: Database Schema Update**

1.  **Create Migration:** Generate a new Supabase migration file.
2.  **Modify `users` table:** Add two new columns:
    *   `first_name` (TEXT, NOT NULL)
    *   `last_name` (TEXT, NOT NULL)
3.  **Modify `sitters` table:** Add one new column:
    *   `address` (TEXT, NULLABLE)

---

#### **Phase 2: Admin Portal UI & Backend Update**

1.  **Update "New Sitter" Form (`/admin/sitters/new.tsx`):**
    *   Add input fields for `First Name` and `Last Name`.
    *   Make `First Name`, `Last Name`, and `Email` required for form submission.
    *   Update the corresponding API route (`/api/admin/invite-sitter.ts`) to handle these new fields.

2.  **Update "Edit Sitter" Form (`/admin/sitters/[id]/edit.tsx`):**
    *   Add input fields for `First Name`, `Last Name`, `Phone Number`, `Address`, and `County`.
    *   Pre-populate the fields with the existing sitter data.
    *   Create a new API route (`/api/admin/update-sitter.ts`) to handle the submission of all updatable fields.
