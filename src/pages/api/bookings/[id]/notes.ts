import { createServerClient } from '@supabase/ssr';
import { type NextApiRequest, type NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { cookies: { get: (name) => req.cookies[name] } }
    );

    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const { data, error } = await supabase
                .from('booking_notes')
                .select('*, user:users(first_name, last_name)')
                .eq('booking_request_id', id);

            if (error) throw error;

            res.status(200).json(data);
        } catch (e: any) {
            res.status(500).json({ message: e.message });
        }
    } else if (req.method === 'POST') {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { note } = req.body;
            if (!note) throw new Error('Note is required');

            const { data, error } = await supabase
                .from('booking_notes')
                .insert([
                    {
                        booking_request_id: id as string,
                        user_id: user.id,
                        note: note,
                    },
                ])
                .select('*, user:users(first_name, last_name)')
                .single();

            if (error) throw error;

            res.status(201).json(data);
        } catch (e: any) {
            res.status(500).json({ message: e.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}
