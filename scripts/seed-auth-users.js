require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// IMPORTANT: Replace with your actual Supabase URL and service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAuthUsers() {
  console.log('Fetching users from public.users table...');
  const { data: users, error: fetchError } = await supabase
    .from('users')
    .select('*');

  if (fetchError) {
    console.error('Error fetching users:', fetchError.message);
    return;
  }

  if (!users || users.length === 0) {
    console.log('No users found in public.users to seed into auth.users.');
    return;
  }

  console.log(`Found ${users.length} users to create in auth.users.`);

  for (const user of users) {
    console.log(`Creating user: ${user.email}`);
    const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: 'password', // Set a default password
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      }
    });

    if (createError) {
      // Check if the user already exists
      if (createError.message.includes('Email address already registered')) {
        console.warn(`User ${user.email} already exists in auth.users.`);
      } else {
        console.error(`Error creating user ${user.email}:`, createError.message);
      }
    } else {
      console.log(`Successfully created user: ${authUser.user.email}`);
      // Link the auth.users record to the public.users record
      const { error: updateError } = await supabase
        .from('users')
        .update({ id: authUser.user.id })
        .eq('email', user.email);

      if (updateError) {
        console.error(`Error updating user ${user.email} with auth ID:`, updateError.message);
      }
    }
  }

  console.log('Finished seeding auth users.');
}

createAuthUsers();
