import { createClient } from '@/utils/supabase/server-props';
import { GetServerSideProps } from 'next';
import AdminLayout from './_layout';

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

  const { data: bookingRequests } = await supabase
    .from('booking_requests')
    .select(`
      id,
      start_date,
      end_date,
      status,
      total_cost_cents,
      payment_status,
      customer:customers (
        name
      ),
      sitter:sitters (
        user:users (
          email
        )
      )
    `);

  return {
    props: { user, bookingRequests: bookingRequests || [] },
  };
};

function AdminDashboard({ user, bookingRequests }) {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Sitter</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Dates</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Total Cost</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Payment Status</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookingRequests.map((request) => (
              <tr key={request.id}>
                <td className="px-6 py-4 whitespace-nowrap">{request.customer?.name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{request.sitter?.user?.email || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{request.start_date} to {request.end_date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{request.status}</td>
                <td className="px-6 py-4 whitespace-nowrap">{request.total_cost_cents / 100}</td>
                <td className="px-6 py-4 whitespace-nowrap">{request.payment_status}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-4">
                  <Link href={`/admin/bookings/${request.id}`} className="text-indigo-600 hover:text-indigo-900">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
