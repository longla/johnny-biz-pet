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
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { bookingId } = req.body;
        if (!bookingId) throw new Error('Booking ID is required');

        // This is a simplified implementation.
        // A robust solution would use a database function (RPC) to perform this check
        // and potentially update the booking_requests status to 'DECLINED' if this
        // was the last sitter to decline.

        const { error } = await supabase
            .from('booking_sitter_recipients')
            .delete()
            .eq('booking_request_id', bookingId)
            .eq('sitter_id', user.id);

        if (error) throw error;

        res.status(200).json({ message: 'Booking declined successfully.' });

    } catch (e: any) {
        res.status(500).json({ message: e.message });
    }
}
