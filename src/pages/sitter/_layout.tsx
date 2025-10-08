import { useEffect, useState, type PropsWithChildren } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/router';
import { type User } from '@supabase/supabase-js';
import { Home, Book, User as UserIcon } from 'lucide-react';
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
        router.push('/admin/login'); // Or a generic login page
        return;
      }

      // Check for sitter role in the public users table
      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || userData?.role !== 'SITTER') {
        // If not a sitter, redirect away. Maybe to a generic error page or home.
        router.push('/'); 
        return;
      }

      setUser(user);
      setIsLoading(false);
    };

    checkUser();
  }, [router, supabase]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading Sitter Portal...</p>
      </div>
    );
  }

  const NavLink = ({ href, icon: Icon, label }) => {
    const isActive = router.pathname === href;
    return (
      <Link href={href} className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${isActive ? 'text-[#F28C38]' : 'text-gray-500 hover:text-[#F28C38]'}`}>
        <Icon className="w-6 h-6 mb-1" />
        <span className="text-xs font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main>{children}</main>
      
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 shadow-t-md flex justify-around items-center md:hidden">
        <NavLink href="/sitter" icon={Home} label="Dashboard" />
        <NavLink href="/sitter/my-bookings" icon={Book} label="My Bookings" />
        <NavLink href="/sitter/profile" icon={UserIcon} label="Profile" />
      </div>
    </div>
  );
}
