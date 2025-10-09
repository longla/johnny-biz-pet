import { useEffect, useState, type ElementType } from 'react';
import { createClient } from '@/utils/supabase/client';
import SitterLayout from './_layout';
import { type BookingRequest } from '@/core/types';
import { Loader, AlertTriangle, BookOpen, History, type LucideProps } from 'lucide-react';
import Link from 'next/link';

type BookingWithCustomer = BookingRequest & { 
    customers: { name: string } | null; 
    booking_pets: { pets: Pet }[];
    booking_addons: { sitter_addons: { id: string; name: string; price_cents: number; } }[];
};
type View = 'upcoming' | 'past';

interface TabButtonProps {
    tabName: View;
    label: string;
    icon: ElementType<LucideProps>;
}

export default function MyBookingsPage() {
    const [view, setView] = useState<View>('upcoming');
    const [bookings, setBookings] = useState<BookingWithCustomer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            setError(null);

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setError("You must be logged in.");
                setLoading(false);
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

                const status = view === 'upcoming' ? 'ACCEPTED' : 'COMPLETED';

                const { data, error } = await supabase
                    .from('booking_requests')
                    .select(`*, customers (name), booking_pets(pets(*)), booking_addons(sitter_addons(*))`)
                    .eq('assigned_sitter_id', sitterProfile.id)
                    .eq('status', status)
                    .order('start_date', { ascending: view === 'upcoming' });

                if (error) throw error;
                setBookings(data as BookingWithCustomer[]);

            } catch (e: any) {
                setError("Failed to fetch bookings.");
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [view, supabase]);

    const BookingCard = ({ booking }: { booking: BookingWithCustomer }) => (
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-gray-800">{booking.customers?.name || 'Customer'}</h3>
            <p className="text-sm text-gray-500">{new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}</p>
            <p className="text-sm text-gray-500 mt-1">Status: <span className="font-medium">{booking.status}</span></p>
            <div className="mt-2">
                <h4 className="font-semibold">Pets:</h4>
                <ul>
                    {booking.booking_pets?.map(({ pets }) => (
                        <li key={pets.id}>{pets.name} ({pets.breed})</li>
                    ))}
                </ul>
            </div>
            <div className="mt-2">
                <h4 className="font-semibold">Add-ons:</h4>
                <ul>
                    {booking.booking_addons?.map(({ sitter_addons }) => (
                        <li key={sitter_addons.id}>{sitter_addons.name}</li>
                    ))}
                </ul>
            </div>
            <div className="mt-4">
                <Link href={`/sitter/bookings/${booking.id}`} className="text-indigo-600 hover:text-indigo-800 font-semibold">
                    View Detail
                </Link>
            </div>
        </div>
    );

    const renderContent = () => {
        if (loading) {
            return <div className="text-center p-10"><Loader className="mx-auto animate-spin text-[#F28C38]" size={48} /></div>;
        }
        if (error) {
            return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg"><AlertTriangle className="mx-auto"/> <p>{error}</p></div>;
        }
        if (bookings.length === 0) {
            return <div className="text-center p-10 bg-gray-100 rounded-lg"><p className="font-semibold">No {view} bookings found.</p></div>;
        }
        return (
            <div className="space-y-4">
                {bookings.map(b => <BookingCard booking={b} key={b.id} />)}
            </div>
        );
    };

    const TabButton = ({ tabName, label, icon: Icon }: TabButtonProps) => (
        <button 
            onClick={() => setView(tabName)}
            className={`flex-1 py-3 px-2 text-center font-medium border-b-4 transition-colors duration-200 flex items-center justify-center gap-2 
                ${view === tabName ? 'border-[#F28C38] text-[#F28C38]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
            <Icon size={18}/> {label}
        </button>
    );

    return (
        <SitterLayout>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">My Bookings</h1>
                
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="flex border-b">
                        <TabButton tabName="upcoming" label="Upcoming" icon={BookOpen} />
                        <TabButton tabName="past" label="Past" icon={History} />
                    </div>
                    <div className="p-4">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </SitterLayout>
    );
}