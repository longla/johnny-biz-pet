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

  const { userId, firstName, lastName, phone, address, county } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // 1. Update the users table
    const { error: userError } = await supabaseAdmin
      .from('users')
      .update({ 
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
      })
      .eq('id', userId);

    if (userError) throw new Error(`User update error: ${userError.message}`);

    // 2. Update the sitters table
    const { error: sitterError } = await supabaseAdmin
      .from('sitters')
      .update({ 
        address,
        county,
      })
      .eq('user_id', userId);

    if (sitterError) throw new Error(`Sitter update error: ${sitterError.message}`);

    res.status(200).json({ message: 'Sitter updated successfully.' });

  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
}
