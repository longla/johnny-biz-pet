import { useEffect, useState, type PropsWithChildren } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/router';
import { type User } from '@supabase/supabase-js';
import { Home, Book, User as UserIcon, LogOut } from 'lucide-react';
import Link from 'next/link';

type SitterLayoutProps = PropsWithChildren;

export default function SitterLayout({ children }: SitterLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/admin/login');
        return;
      }
      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      if (error || userData?.role !== 'SITTER') {
        router.push('/');
        return;
      }
      setUser(user);
      setIsLoading(false);
    };
    checkUser();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading Sitter Portal...</p>
      </div>
    );
  }

  const MobileNavLink = ({ href, icon: Icon, label }) => {
    const isActive = router.pathname === href;
    return (
      <Link href={href} className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${isActive ? 'text-[#F28C38]' : 'text-gray-500 hover:text-[#F28C38]'}`}>
        <Icon className="w-6 h-6 mb-1" />
        <span className="text-xs font-medium">{label}</span>
      </Link>
    );
  };

  const DesktopNavLink = ({ href, icon: Icon, label }) => {
    const isActive = router.pathname === href;
    return (
      <Link href={href} className={`flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 ${isActive ? 'bg-[#F28C38] text-white shadow-sm' : 'hover:bg-gray-100'}`}>
        <Icon className="w-5 h-5" />
        <span className="ml-4 font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 md:bg-white md:border-r md:border-gray-200">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-2xl font-bold text-gray-800">Sitter Portal</h1>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-2">
            <DesktopNavLink href="/sitter" icon={Home} label="Dashboard" />
            <DesktopNavLink href="/sitter/my-bookings" icon={Book} label="My Bookings" />
            <DesktopNavLink href="/sitter/profile" icon={UserIcon} label="Profile" />
          </nav>
          <div className="flex-shrink-0 px-2 py-4 border-t">
             <div className="px-4 py-3 text-sm text-gray-500 truncate">
                <p>Signed in as</p>
                <p className="font-medium text-gray-700">{user?.email}</p>
             </div>
             <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
                <LogOut className="w-5 h-5" />
                <span className="ml-4 font-medium">Logout</span>
             </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-around items-center md:hidden">
        <MobileNavLink href="/sitter" icon={Home} label="Dashboard" />
        <MobileNavLink href="/sitter/my-bookings" icon={Book} label="My Bookings" />
        <MobileNavLink href="/sitter/profile" icon={UserIcon} label="Profile" />
      </div>
    </div>
  );
}