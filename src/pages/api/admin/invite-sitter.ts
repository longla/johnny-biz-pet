import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, county, base_rate_cents } = req.body;

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  // Generate a temporary password
  const temporaryPassword = crypto.randomBytes(16).toString('hex');

  // Create the user
  const { data: { user }, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: temporaryPassword,
    email_confirm: true, // User will need to confirm their email
  });

  if (createUserError) {
    return res.status(500).json({ message: createUserError.message });
  }

  if (!user) {
    return res.status(500).json({ message: 'User not created' });
  }

  // Send password reset email
  const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/set-password`,
  });

  if (resetError) {
    // If sending the reset email fails, we should probably delete the user we just created
    await supabaseAdmin.auth.admin.deleteUser(user.id);
    return res.status(500).json({ message: resetError.message });
  }

  const { error: sitterError } = await supabaseAdmin.from('sitters').insert({
    user_id: user.id,
    county,
    base_rate_cents,
  });

  if (sitterError) {
    // If creating the sitter profile fails, we should probably delete the user we just created
    await supabaseAdmin.auth.admin.deleteUser(user.id);
    return res.status(500).json({ message: sitterError.message });
  }

  res.status(200).json({ message: 'Sitter invited successfully' });
}
