# Common Issues

## /admin redirects to landing page

**Cause:** The `users` table in the database does not have a record for the admin user. This can happen if the admin user was created through the Supabase auth interface but the corresponding record in the `users` table was not created.

**Solution:**

1.  Make sure you have a `.env.local` file with the following variables:
    ```
    NEXT_PUBLIC_SUPABASE_URL=...
    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    SUPABASE_SERVICE_ROLE_KEY=...
    ADMIN_EMAIL=...
    ADMIN_PASSWORD=...
    ```
2.  Run the `create_admin.js` script to create the admin user and the corresponding record in the `users` table:
    ```
    node create_admin.js
    ```
