import { GetServerSideProps } from 'next';
import { createClient } from '@/utils/supabase/server-props';
import { type BookingRequest, type Customer, type Pet, type BookingNote, type Sitter } from '@/core/types';
import AdminLayout from '@/pages/admin/_layout';
import SitterLayout from '@/pages/sitter/_layout';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { createClient as createClientComponent } from '@/utils/supabase/client';
import BookingNotes from '@/components/booking-notes';

interface NotifiedSitter {
    status: string;
    sitters: {
        id: string;
        users: {
            first_name: string;
            last_name: string;
        } | null
    } | null;
}

interface FullBookingRequest extends BookingRequest {
    customers: Customer | null;
    pets: Pet[];
    booking_notes: BookingNote[];
    booking_sitter_recipients: NotifiedSitter[];
}

interface BookingDetailsPageProps {
    user: User;
    booking: FullBookingRequest;
    userDetails: {
        role: string;
    } | null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createClient(context);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { redirect: { destination: '/', permanent: false } };
    }

    const { id } = context.params!;

    const { data: booking, error } = await supabase
        .from('booking_requests')
        .select('*, customers(*), pets(*), booking_notes(*, user:users(first_name, last_name)), booking_sitter_recipients(*, sitters(*, users(first_name, last_name)))')
        .eq('id', id)
        .single();

    if (error || !booking) {
        return { notFound: true };
    }

    const { data: userDetails } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (userDetails?.role !== 'ADMIN') {
        if (booking.assigned_sitter_id) {
            const { data: sitterProfile, error: sitterError } = await supabase
                .from('sitters')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (sitterError || !sitterProfile || sitterProfile.id !== booking.assigned_sitter_id) {
                return { notFound: true };
            }
        } else {
            return { notFound: true };
        }
    }

    return { props: { user, booking, userDetails } };
};

export default function BookingDetailsPage({ user, booking: initialBooking, userDetails }: BookingDetailsPageProps) {
    const [booking, setBooking] = useState(initialBooking);
    const supabase = createClientComponent();
    const isAdmin = userDetails?.role === 'ADMIN';

    useEffect(() => {
        const channel = supabase
            .channel(`booking-details-${booking.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'booking_requests',
                    filter: `id=eq.${booking.id}`,
                },
                (payload) => {
                    setBooking(prev => ({ ...prev, ...payload.new as BookingRequest }));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, booking.id]);

    const Layout = isAdmin ? AdminLayout : SitterLayout;

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Booking Details</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <div className="bg-white p-6 rounded-lg shadow mb-6">
                            <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Customer Information</h2>
                            <p><strong>Name:</strong> {booking.customers?.name}</p>
                            <p><strong>Email:</strong> {booking.customers?.email}</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow mb-6">
                            <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Booking Information</h2>
                            <p><strong>Status:</strong> {booking.status}</p>
                            <p><strong>Dates:</strong> {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}</p>
                            <p><strong>County:</strong> {booking.county}</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow mb-6">
                            <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Pet Information</h2>
                            <ul>
                                {booking.pets.map(pet => (
                                    <li key={pet.id}>{pet.name} ({pet.breed})</li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow mb-6">
                            <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Booking Notes</h2>
                            <BookingNotes bookingId={booking.id} notes={booking.booking_notes} user={user} />
                        </div>
                    </div>

                    {isAdmin && (
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Notified Sitters</h2>
                            <ul>
                                {booking.booking_sitter_recipients.map(recipient => (
                                    <li key={recipient.sitters?.id}>
                                        {recipient.sitters?.users?.first_name} {recipient.sitters?.users?.last_name} - {recipient.status}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
