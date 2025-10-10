import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { type BookingRequest } from '@/core/types'; // Assuming types are defined here
import SitterLayout from './_layout';
import { AlertTriangle, Inbox, Loader } from 'lucide-react';

// Extend the type to include customer name if we can join it
type BookingRequestWithCustomer = BookingRequest & {
    customers: {
        name: string;
    } | null;
};

export default function SitterDashboard() {
    const [requests, setRequests] = useState<BookingRequestWithCustomer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchRequests = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                setError("You must be logged in to view requests.");
                return;
            }

            try {
                const { data: sitterProfile, error: sitterError } = await supabase
                    .from('sitters')
                    .select('id')
                    .eq('user_id', user.id)
                    .single();

                if (sitterError || !sitterProfile) {
                    throw new Error("Could not find sitter profile.");
                }

                // First, get the booking IDs the sitter has been notified for.
                const { data: recipientData, error: recipientError } = await supabase
                    .from('booking_sitter_recipients')
                    .select('booking_request_id')
                    .eq('sitter_id', sitterProfile.id)
                    .eq('status', 'NOTIFIED');

                if (recipientError) throw recipientError;

                const requestIds = recipientData.map(r => r.booking_request_id);

                if (requestIds.length === 0) {
                    setRequests([]);
                    setLoading(false);
                    return;
                }

                // Now, fetch the actual booking requests that are pending
                const { data: requestData, error: requestError } = await supabase
                    .from('booking_requests')
                    .select(`
                        *,
                        customers ( name )
                    `)
                    .in('id', requestIds)
                    .eq('status', 'PENDING_SITTER_ACCEPTANCE');

                if (requestError) throw requestError;

                setRequests(requestData as BookingRequestWithCustomer[]);
            } catch (e: any) {
                setError("Failed to fetch booking requests.");
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();

        const channel = supabase
            .channel('booking-sitter-recipients-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'booking_sitter_recipients',
                },
                (payload) => {
                    console.log('Change received!', payload);
                    fetchRequests();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    const BookingRequestCard = ({ request }: { request: BookingRequestWithCustomer }) => (
        <Link href={`/sitter/bookings/${request.id}`} className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-800">{request.customers?.name || 'New Customer'}</h3>
                <span className="text-sm text-gray-500">{request.county}</span>
            </div>
            <div className="mt-2 text-gray-600">
                <p><span className="font-medium">Dates:</span> {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}</p>
                {/* We would need another join to get pet names, keeping it simple for now */}
            </div>
            <div className="mt-4 text-right">
                <span className="text-sm font-semibold text-[#1A9CB0]">View Details &rarr;</span>
            </div>
        </Link>
    );

    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center p-10">
                    <Loader className="mx-auto animate-spin text-[#F28C38]" size={48} />
                    <p className="mt-4 text-gray-500">Loading new requests...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center p-10 bg-red-50 rounded-lg">
                    <AlertTriangle className="mx-auto text-red-500" size={48} />
                    <p className="mt-4 font-semibold text-red-700">Could not load requests</p>
                    <p className="text-red-600">{error}</p>
                </div>
            );
        }

        if (requests.length === 0) {
            return (
                <div className="text-center p-10 bg-gray-100 rounded-lg">
                    <Inbox className="mx-auto text-gray-400" size={48} />
                    <p className="mt-4 font-semibold text-gray-600">No new booking requests</p>
                    <p className="text-gray-500">We'll notify you when a new request comes in.</p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {requests.map(req => <BookingRequestCard key={req.id} request={req} />)}
            </div>
        );
    };

    return (
        <SitterLayout>
            <div className="container mx-auto p-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-500">You have {requests.length} new booking request{requests.length !== 1 && 's'}.</p>
                </div>
                {renderContent()}
            </div>
        </SitterLayout>
    );
}
