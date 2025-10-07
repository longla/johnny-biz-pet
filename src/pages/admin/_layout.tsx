import Link from 'next/link';
import { useRouter } from 'next/router';
import { createClient } from '@/utils/supabase/client';

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 text-2xl font-bold">Admin</div>
        <nav className="mt-8">
          <Link href="/admin" className="block px-4 py-2 hover:bg-gray-700">
            Dashboard
          </Link>
          <Link href="/admin/sitters" className="block px-4 py-2 hover:bg-gray-700">
            Sitters
          </Link>
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex-1 p-8 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
