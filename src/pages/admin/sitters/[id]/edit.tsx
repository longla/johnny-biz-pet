import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { createClient as createServerClient } from '@/utils/supabase/server-props';
import AdminLayout from '../../_layout';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createServerClient(context);
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

  const { id } = context.params;
  const { data: sitter } = await supabase
    .from('sitters')
    .select(`
      id,
      county,
      base_rate_cents,
      is_active,
      user:users (
        email
      )
    `)
    .eq('id', id)
    .single();

  return {
    props: { sitter },
  };
};

function EditSitterPage({ sitter }) {
  const [county, setCounty] = useState('');
  const [baseRate, setBaseRate] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (sitter) {
      setCounty(sitter.county);
      setBaseRate((sitter.base_rate_cents / 100).toString());
      setIsActive(sitter.is_active);
    }
  }, [sitter]);

  const handleUpdateSitter = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const { error: sitterError } = await supabase
      .from('sitters')
      .update({
        county,
        base_rate_cents: parseInt(baseRate) * 100,
        is_active: isActive,
      })
      .eq('id', sitter.id);

    if (sitterError) {
      setError(sitterError.message);
    } else {
      router.push('/admin/sitters');
    }
    setIsSubmitting(false);
  };

  if (!sitter) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-4 md:mb-8">Edit Sitter: {sitter.user.email}</h1>
        <div className="max-w-md">
          <form onSubmit={handleUpdateSitter} className="space-y-6">
            <div>
              <label htmlFor="county" className="block text-sm font-medium text-gray-700">
                County
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="county"
                  id="county"
                  required
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="baseRate" className="block text-sm font-medium text-gray-700">
                Base Rate (in dollars)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="baseRate"
                  id="baseRate"
                  required
                  value={baseRate}
                  onChange={(e) => setBaseRate(e.target.value)}
                  className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm-text-sm"
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="isActive" className="block ml-2 text-sm text-gray-900">
                Active
              </label>
            </div>

            {error && (
              <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
              >
                {isSubmitting ? 'Updating...' : 'Update Sitter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

export default EditSitterPage;
