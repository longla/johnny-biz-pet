import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import SitterLayout from './_layout';
import { type BookingRequest } from '@/core/types';

export default function SitterDashboard() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [activeTab, setActiveTab] = useState('new-requests');

  useEffect(() => {
    const fetchUserAndBookings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: sitter, error: sitterError } = await supabase
          .from('sitters')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (sitterError || !sitter) {
          console.error('Error fetching sitter:', sitterError);
          return;
        }

        const { data: assignedBookings, error: assignedError } = await supabase
          .from('booking_requests')
          .select('*, customers(name)')
          .eq('assigned_sitter_id', sitter.id)
          .eq('status', 'ACCEPTED')
          .eq('payment_status', 'UNPAID');

        const { data: recipientBookingIds, error: recipientError } = await supabase
          .from('booking_sitter_recipients')
          .select('booking_request_id')
          .eq('sitter_id', sitter.id);

        if (recipientError) {
          console.error('Error fetching recipient bookings:', recipientError);
          return;
        }

        const bookingIds = recipientBookingIds.map(r => r.booking_request_id);

        const { data: recipientBookings, error: recipientBookingsError } = await supabase
          .from('booking_requests')
          .select('*, customers(name)')
          .in('id', bookingIds)
          .eq('status', 'PENDING_SITTER_ACCEPTANCE');

        if (assignedError || recipientBookingsError) {
          console.error('Error fetching bookings:', assignedError || recipientBookingsError);
        } else {
          const allBookings = [...(assignedBookings || []), ...(recipientBookings || [])];
          const uniqueBookings = Array.from(new Map(allBookings.map(item => [item.id, item])).values());
          // @ts-ignore
          setBookings(uniqueBookings);
        }
      }
    };
    fetchUserAndBookings();
  }, [supabase]);

  const newRequests = bookings.filter(b => b.status === 'PENDING_SITTER_ACCEPTANCE');
  const pendingBookings = bookings.filter(b => b.status === 'ACCEPTED' && b.payment_status === 'UNPAID');

  return (
    <SitterLayout>
      <div className="p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-8">Sitter Dashboard</h1>
        <div className="flex border-b">
          <button
            className={`py-2 px-4 ${activeTab === 'new-requests' ? 'border-b-2 border-indigo-600' : ''}`}
            onClick={() => setActiveTab('new-requests')}
          >
            New Requests ({newRequests.length})
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'pending-bookings' ? 'border-b-2 border-indigo-600' : ''}`}
            onClick={() => setActiveTab('pending-bookings')}
          >
            Pending Bookings ({pendingBookings.length})
          </button>
        </div>
        <div className="py-4">
          {activeTab === 'new-requests' && (
            <div>
              {newRequests.map(booking => (
                <div key={booking.id} className="bg-white p-4 rounded-lg shadow mb-4">
                  <p><strong>Customer:</strong> {booking.customers?.name}</p>
                  <p><strong>Dates:</strong> {booking.start_date} to {booking.end_date}</p>
                  <button onClick={() => router.push(`/sitter/bookings/${booking.id}`)} className="text-indigo-600">View Details</button>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'pending-bookings' && (
            <div>
              {pendingBookings.map(booking => (
                <div key={booking.id} className="bg-white p-4 rounded-lg shadow mb-4">
                  <p><strong>Customer:</strong> {booking.customers?.name}</p>
                  <p><strong>Dates:</strong> {booking.start_date} to {booking.end_date}</p>
                  <button onClick={() => router.push(`/sitter/bookings/${booking.id}`)} className="text-indigo-600">View Details</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SitterLayout>
  );
}
