import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import { isAdmin } from '@/utils/api/is-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isAdminUser = await isAdmin(req, res);
  if (!isAdminUser) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: 'user_id is required' });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  const { error } = await supabaseAdmin.rpc('delete_sitter', { user_id });

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.status(200).json({ message: 'Sitter deleted successfully' });
}