import { GetServerSideProps } from 'next';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import AdminLayout from '../_layout';
import { createClient as createBrowserClient } from '@/utils/supabase/client';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import BookingNotes from '@/components/booking-notes';
import { type BookingRequest, type Customer, type Pet, type BookingNote, type Sitter } from '@/core/types';
import { User } from '@supabase/supabase-js';

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
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return context.req.cookies[name]
        },
        set(name: string, value: string, options: CookieOptions) {
        },
        remove(name: string, options: CookieOptions) {
        },
      },
    }
  )
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { redirect: { destination: '/admin/login', permanent: false } };
    }

    const { id } = context.params!;

    const { data: booking, error } = await supabase
        .from('booking_requests')
    .select('*, customers(*), booking_pets(pets(*)), booking_addons(sitter_addons(*)), booking_notes(*, user:users(first_name, last_name)), booking_sitter_recipients(*, sitters(*, users(first_name, last_name))), assigned_sitter:sitters!booking_requests_assigned_sitter_id_fkey(*, user:users(*)))')
        .eq('id', id)
        .single();

    if (error || !booking) {
        return { notFound: true };
    }

    return { props: { user, booking } };
};

function BookingDetailsPage({ user, booking: initialBooking }: BookingDetailsPageProps) {
    const [bookingRequest, setBookingRequest] = useState(initialBooking);
    const supabase = createBrowserClient();
    const router = useRouter();
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedBooking, setEditedBooking] = useState<Partial<FullBookingRequest>>(initialBooking);

    useEffect(() => {
        const channel = supabase
            .channel(`booking-details-${bookingRequest.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'booking_requests',
                    filter: `id=eq.${bookingRequest.id}`,
                },
                (payload) => {
                    setBookingRequest(prev => ({ ...prev, ...payload.new as BookingRequest }));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, bookingRequest.id]);

    const handleSave = async () => {
        setError('');
        setIsSubmitting(true);

        const updateData = { ...bookingRequest, ...editedBooking };

        const response = await fetch('/api/admin/update-booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });

        if (response.ok) {
            const updatedBooking = await response.json();
            setBookingRequest(updatedBooking.data);
            setIsEditing(false);
        } else {
            const errorData = await response.json();
            setError(errorData.message || 'Failed to update booking');
        }

        setIsSubmitting(false);
    };

    const handleUpdatePaymentStatus = async () => {
        setError('');
        setIsSubmitting(true);
        const { error } = await supabase
            .from('booking_requests')
            .update({ payment_status: 'PAID' })
            .eq('id', bookingRequest.id);

        if (error) {
            setError(error.message);
        } else {
            router.replace(router.asPath);
        }
        setIsSubmitting(false);
    };

    const handleCancelBooking = async () => {
        setError('');
        setIsSubmitting(true);
        const { error } = await supabase
            .from('booking_requests')
            .update({ status: 'CANCELED_BY_ADMIN' })
            .eq('id', bookingRequest.id);

        if (error) {
            setError(error.message);
        } else {
            router.replace(router.asPath);
        }
        setIsSubmitting(false);
    };


    if (!bookingRequest) {
        return <div>Loading...</div>;
    }

    return (
        <AdminLayout>
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-8">Booking Details</h1>
                <div className="bg-white rounded-lg shadow p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Customer</h2>
                            <p><strong>Name:</strong> {bookingRequest.customers?.name}</p>
                            <p><strong>Email:</strong> {bookingRequest.customers?.email}</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Sitter</h2>
                            <p><strong>Name:</strong> {bookingRequest.assigned_sitter?.user?.first_name} {bookingRequest.assigned_sitter?.user?.last_name}</p>
              <p><strong>Email:</strong> {bookingRequest.assigned_sitter?.user?.email || 'N/A'}</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Booking</h2>
                            <p><strong>Dates:</strong> {bookingRequest.start_date} to {bookingRequest.end_date}</p>
                            <p><strong>Status:</strong> {bookingRequest.status}</p>
                            <p><strong>Total Cost:</strong> ${bookingRequest.total_cost_cents ? bookingRequest.total_cost_cents / 100 : 'N/A'}</p>
                            <p><strong>Payment Status:</strong> {bookingRequest.payment_status}</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Pets</h2>
                            <ul>
                                {bookingRequest.booking_pets?.map(({ pets }) => (
                                    <li key={pets.id}>{pets.name} ({pets.breed})</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Add-ons</h2>
                            <ul>
                                {bookingRequest.booking_addons?.map(({ sitter_addons }) => (
                                    <li key={sitter_addons.id}>{sitter_addons.name} (${sitter_addons.price_cents / 100})</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Notified Sitters</h2>
                            <ul>
                                {bookingRequest.booking_sitter_recipients?.map(recipient => (
                                    <li key={recipient.sitters?.id}>
                                        {recipient.sitters?.users?.first_name} {recipient.sitters?.users?.last_name} - {recipient.status}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Booking Notes</h2>
                            <BookingNotes bookingId={bookingRequest.id} notes={bookingRequest.booking_notes || []} user={user} />
                        </div>
                    </div>
                    <div className="mt-8 flex space-x-4">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleUpdatePaymentStatus}
                            disabled={isSubmitting || bookingRequest.payment_status === 'PAID'}
                            className="px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400"
                        >
                            Mark as Paid
                        </button>
                        <button
                            onClick={handleCancelBooking}
                            disabled={isSubmitting || bookingRequest.status === 'CANCELED_BY_ADMIN'}
                            className="px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-400"
                        >
                            Cancel Booking
                        </button>
                    </div>
                    {error && (
                        <div className="mt-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                            {error}
                        </div>
                    )}
                </div>
            </div>
            {isEditing && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-1/2 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Booking</h3>
                            <div className="mt-2 px-7 py-3">
                                <form className="text-left">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                            <input
                                                type="date"
                                                value={editedBooking.start_date}
                                                onChange={(e) => setEditedBooking({ ...editedBooking, start_date: e.target.value })}
                                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                                            <input
                                                type="date"
                                                value={editedBooking.end_date}
                                                onChange={(e) => setEditedBooking({ ...editedBooking, end_date: e.target.value })}
                                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Status</label>
                                            <select
                                                value={editedBooking.status}
                                                onChange={(e) => setEditedBooking({ ...editedBooking, status: e.target.value as any })}
                                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            >
                                                <option value="PENDING_SITTER_ACCEPTANCE">PENDING_SITTER_ACCEPTANCE</option>
                                                <option value="ACCEPTED">ACCEPTED</option>
                                                <option value="DECLINED">DECLINED</option>
                                                <option value="EXPIRED_UNCLAIMED">EXPIRED_UNCLAIMED</option>
                                                <option value="CANCELED_BY_ADMIN">CANCELED_BY_ADMIN</option>
                                                <option value="COMPLETED">COMPLETED</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                                            <select
                                                value={editedBooking.payment_status}
                                                onChange={(e) => setEditedBooking({ ...editedBooking, payment_status: e.target.value as any })}
                                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            >
                                                <option value="UNPAID">UNPAID</option>
                                                <option value="PAID">PAID</option>
                                                <option value="REFUNDED">REFUNDED</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Total Cost (Cents)</label>
                                            <input
                                                type="number"
                                                value={editedBooking.total_cost_cents || ''}
                                                onChange={(e) => setEditedBooking({ ...editedBooking, total_cost_cents: parseInt(e.target.value) })}
                                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-auto shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-green-600 text-white text-base font-medium rounded-md w-auto shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 ml-4"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export default BookingDetailsPage;