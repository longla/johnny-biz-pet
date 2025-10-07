import { GetServerSideProps } from 'next';
import { createClient } from '@/utils/supabase/server-props';
import AdminLayout from '../_layout';
import { createClient as createBrowserClient } from '@/utils/supabase/client';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface BookingRequest {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
  total_cost_cents: number;
  payment_status: string;
  customer: {
    name: string;
    email: string;
  };
  sitter: {
    user: {
      email: string;
    };
  };
  pets: {
    pet: {
      id: string;
      name: string;
      breed: string;
    };
  }[];
  addons: {
    addon: {
      id: string;
      name: string;
      price_cents: number;
    };
  }[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createClient(context);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  const { data: userDetails } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userDetails?.role !== 'ADMIN') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const { id } = context.params || {};
  if (typeof id !== 'string') {
    return {
      notFound: true,
    };
  }

  const { data: bookingRequest } = await supabase
    .from('booking_requests')
    .select(`
      *,
      customer:customers (*),
      sitter:sitters (
        user:users (
          email
        )
      ),
      pets:booking_pets (
        pet:pets (*)
      ),
      addons:booking_addons (
        addon:sitter_addons (*)
      )
    `)
    .eq('id', id)
    .single();

  return {
    props: { bookingRequest },
  };
};

function BookingDetailsPage({ bookingRequest }: { bookingRequest: BookingRequest }) {
  const supabase = createBrowserClient();
  const router = useRouter();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
              <p><strong>Name:</strong> {bookingRequest.customer.name}</p>
              <p><strong>Email:</strong> {bookingRequest.customer.email}</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Sitter</h2>
              <p><strong>Email:</strong> {bookingRequest.sitter?.user?.email || 'N/A'}</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Booking</h2>
              <p><strong>Dates:</strong> {bookingRequest.start_date} to {bookingRequest.end_date}</p>
              <p><strong>Status:</strong> {bookingRequest.status}</p>
              <p><strong>Total Cost:</strong> ${bookingRequest.total_cost_cents / 100}</p>
              <p><strong>Payment Status:</strong> {bookingRequest.payment_status}</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Pets</h2>
              <ul>
                {bookingRequest.pets.map(({ pet }) => (
                  <li key={pet.id}>{pet.name} ({pet.breed})</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Add-ons</h2>
              <ul>
                {bookingRequest.addons.map(({ addon }) => (
                  <li key={addon.id}>{addon.name} (${addon.price_cents / 100})</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 flex space-x-4">
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
    </AdminLayout>
  );
}

export default BookingDetailsPage;
