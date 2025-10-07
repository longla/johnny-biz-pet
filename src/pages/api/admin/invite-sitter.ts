import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, county, base_rate_cents } = req.body;

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  const { data: { user }, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/set-password`,
  });

  if (inviteError) {
    return res.status(500).json({ message: inviteError.message });
  }

  if (user) {
    const { error: sitterError } = await supabaseAdmin.from('sitters').insert({
      user_id: user.id,
      county,
      base_rate_cents,
    });

    if (sitterError) {
      return res.status(500).json({ message: sitterError.message });
    }
  }

  res.status(200).json({ message: 'Sitter invited successfully' });
}
