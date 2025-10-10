import { createServerClient } from '@supabase/ssr';
import { type NextApiRequest, type NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { cookies: { get: (name) => req.cookies[name] } }
    );

    try {
        const { id: bookingId, sitterId } = req.query;

        if (!bookingId || !sitterId) {
            return res.status(400).json({ message: 'Booking ID and Sitter ID are required' });
        }

        const { data, error } = await supabase.rpc('calculate_booking_cost', {
            booking_id: bookingId as string,
            sitter_profile_id: sitterId as string,
        });

        if (error) throw error;

        res.status(200).json(data);

    } catch (e: any) {
        res.status(500).json({ message: e.message });
    }
}
