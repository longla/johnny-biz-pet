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

        // TODO: This logic should be moved to a Postgres function (RPC) for atomicity 
        // to prevent race conditions where two sitters accept at the same time.

        // 1. Check if the booking is still pending
        const { data: booking, error: fetchError } = await supabase
            .from('booking_requests')
            .select('status')
            .eq('id', bookingId)
            .single();

        if (fetchError || !booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        if (booking.status !== 'PENDING_SITTER_ACCEPTANCE') {
            return res.status(409).json({ message: 'This booking has already been taken.' });
        }

        // 2. Update the booking
        const { error: updateError } = await supabase
            .from('booking_requests')
            .update({
                status: 'ACCEPTED',
                assigned_sitter_id: user.id,
            })
            .eq('id', bookingId);

        if (updateError) throw updateError;

        // A real implementation would also trigger notifications to other sitters here.

        res.status(200).json({ message: 'Booking accepted successfully!' });

    } catch (e: any) {
        res.status(500).json({ message: e.message });
    }
}