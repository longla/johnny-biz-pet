import { createClient } from '@supabase/supabase-js';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { isAdmin } from '@/utils/api/is-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isAdminUser = await isAdmin(req, res);
  if (!isAdminUser) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, firstName, lastName } = req.body;

  if (!email || !firstName || !lastName) {
    return res.status(400).json({ message: 'Email, first name, and last name are required.' });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Create the auth user
  const { data: { user }, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true,
  });

  if (createUserError) {
    return res.status(500).json({ message: `Failed to create user: ${createUserError.message}` });
  }
  if (!user) {
    return res.status(500).json({ message: 'User not created' });
  }

  // 2. Update the public.users table with the name
  const { error: updateUserError } = await supabaseAdmin
    .from('users')
    .update({ 
      first_name: firstName,
      last_name: lastName,
      role: 'SITTER'
    })
    .eq('id', user.id);

  if (updateUserError) {
    await supabaseAdmin.auth.admin.deleteUser(user.id);
    return res.status(500).json({ message: `Failed to update user profile: ${updateUserError.message}` });
  }

  // 3. Create the corresponding row in the sitters table
  const { error: sitterError } = await supabaseAdmin
    .from('sitters')
    .insert({ user_id: user.id });

  if (sitterError) {
    await supabaseAdmin.auth.admin.deleteUser(user.id);
    return res.status(500).json({ message: `Failed to create sitter profile: ${sitterError.message}` });
  }

  // 4. Send the password setup email
  const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/set-password`,
  });

  if (resetError) {
    await supabaseAdmin.auth.admin.deleteUser(user.id);
    return res.status(500).json({ message: `Failed to send invite email: ${resetError.message}` });
  }

  res.status(200).json({ message: 'Sitter invited successfully' });
}
