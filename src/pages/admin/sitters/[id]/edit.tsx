import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { type GetServerSideProps } from 'next';
import { createClient as createServerClient } from '@/utils/supabase/server-props';
import AdminLayout from '../../_layout';
import { type User } from '@supabase/supabase-js';

// Define a more complete Sitter type
interface SitterProfile {
  id: string; // user id
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  sitter_profile: {
    address: string;
    county: string;
  } | null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createServerClient(context);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { redirect: { destination: '/admin/login', permanent: false } };
  }

  const { data: adminUser } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (adminUser?.role !== 'ADMIN') {
    return { redirect: { destination: '/', permanent: false } };
  }

  const { id } = context.params || {};
  if (typeof id !== 'string') {
    return { notFound: true };
  }

  // Correctly fetch user and their related sitter profile
  const { data: sitter, error } = await supabase
    .from('users')
    .select(`
      id,
      first_name,
      last_name,
      email,
      phone_number,
      sitter_profile:sitters!user_id (
        address,
        county
      )
    `)
    .eq('id', id)
    .single();

  if (error || !sitter) {
    return { notFound: true };
  }

  return { props: { sitter } };
};

export default function EditSitterPage({ sitter }: { sitter: SitterProfile }) {
  const [formData, setFormData] = useState({
    firstName: sitter.first_name || '',
    lastName: sitter.last_name || '',
    phone: sitter.phone_number || '',
    address: sitter.sitter_profile?.address || '',
    county: sitter.sitter_profile?.county || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateSitter = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
        const response = await fetch('/api/admin/update-sitter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: sitter.id, ...formData }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        setSuccess('Sitter profile updated successfully!');
        // Optionally, refresh data or redirect
        router.replace(router.asPath); // Refreshes server-side props

    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-2">Edit Sitter</h1>
      <p className="text-gray-600 mb-6">Editing profile for <span className="font-medium">{sitter.email}</span></p>
      
      <div className="max-w-2xl bg-white p-8 rounded-lg shadow">
        <form onSubmit={handleUpdateSitter} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
                <label htmlFor="county" className="block text-sm font-medium text-gray-700">County</label>
                <input type="text" id="county" name="county" value={formData.county} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>

          {error && <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
          {success && <div className="p-4 text-sm text-green-700 bg-green-100 rounded-lg">{success}</div>}

          <div>
            <button type="submit" disabled={isSubmitting} className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}