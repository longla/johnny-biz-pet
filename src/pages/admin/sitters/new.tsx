import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../_layout';

function NewSitterPage() {
  const [email, setEmail] = useState('');
  const [county, setCounty] = useState('');
  const [baseRate, setBaseRate] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleCreateSitter = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const response = await fetch('/api/admin/invite-sitter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        county,
        base_rate_cents: parseInt(baseRate) * 100,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message);
    } else {
      router.push('/admin/sitters');
    }

    setIsSubmitting(false);
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-4 md:mb-8">Invite New Sitter</h1>
        <div className="max-w-md">
          <form onSubmit={handleCreateSitter} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
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
                {isSubmitting ? 'Inviting...' : 'Invite Sitter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

export default NewSitterPage;