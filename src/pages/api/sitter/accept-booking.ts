import { createServerClient } from '@supabase/ssr';
import { type NextApiRequest, type NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { cookies: { get: (name) => req.cookies[name] } }
    );

    try {
        const token = req.headers.authorization?.split(' ')[1];
        const { data: { user } } = token ? await supabase.auth.getUser(token) : await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { bookingId } = req.body;
        if (!bookingId) throw new Error('Booking ID is required');

        const { error } = await supabase.rpc('accept_booking_request', {
            booking_id: bookingId,
            sitter_user_id: user.id,
        });

        if (error) throw error;

        res.status(200).json({ message: 'Booking accepted successfully!' });

    } catch (e: any) {
        res.status(500).json({ message: e.message });
    }
}