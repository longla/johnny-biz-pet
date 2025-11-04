require('dotenv').config({ path: '.env.local' });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!supabaseUrl || !supabaseKey || !adminEmail || !adminPassword) {
  console.error(
    "Error: SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_EMAIL, and ADMIN_PASSWORD environment variables are required."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function signUpAdmin() {
  const { data, error } = await supabase.auth.signUp({
    email: adminEmail,
    password: adminPassword,
  });

  if (error) {
    console.error("Error signing up:", error.message);
    process.exit(1);
  } else {
    if (data.user) {
      console.log("User created. Updating role to ADMIN...");
      const supabaseAdmin = createClient(
        supabaseUrl,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      const { error: updateError } = await supabaseAdmin
        .from("users")
        .update({ role: "ADMIN" })
        .eq("id", data.user.id);

      if (updateError) {
        console.error("Error updating user role:", updateError.message);
        process.exit(1);
      } else {
        console.log("Admin user created successfully!");
      }
    }
  }
}

signUpAdmin();
