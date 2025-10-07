import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId, adminPassword } = req.body;

  if (!userId || !adminPassword) {
    return res.status(400).json({ message: 'User ID and admin password are required' });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  // Verify admin password
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: process.env.ADMIN_EMAIL || '',
    password: adminPassword,
  });

  if (authError) {
    return res.status(401).json({ message: 'Invalid admin password' });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.status(200).json({ message: 'Sitter deleted successfully' });
}
