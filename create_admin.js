require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!supabaseUrl || !supabaseKey || !adminEmail || !adminPassword) {
  console.error('Error: SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_EMAIL, and ADMIN_PASSWORD environment variables are required.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function signUpAdmin() {
  const { data, error } = await supabase.auth.signUp({
    email: adminEmail,
    password: adminPassword,
  });

  if (error) {
    console.error('Error signing up:', error.message);
    process.exit(1);
  } else {
    console.log('Admin user signed up successfully. Please check your email for confirmation.');
    // The trigger will create a user with the 'SITTER' role.
    // The role will be updated to 'ADMIN' in the next step.
  }
}

signUpAdmin();