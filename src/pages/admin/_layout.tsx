import Link from 'next/link';
import { useRouter } from 'next/router';
import { createClient } from '@/utils/supabase/client';
import { useState, ReactNode, ElementType } from 'react';
import { Home, Users, LogOut, type LucideProps } from 'lucide-react';

interface NavLinkProps {
  href: string;
  icon: ElementType<LucideProps>;
  label: string;
}

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const MobileNavLink = ({ href, icon: Icon, label }: NavLinkProps) => {
    const isActive = router.pathname === href;
    return (
      <Link href={href} className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}>
        <Icon className="w-6 h-6 mb-1" />
        <span className="text-xs font-medium">{label}</span>
      </Link>
    );
  };

  const DesktopNavLink = ({ href, icon: Icon, label }: NavLinkProps) => {
    const isActive = router.pathname === href;
    return (
      <Link href={href} className={`flex items-center px-4 py-3 text-gray-200 rounded-lg transition-colors duration-200 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
        <Icon className="w-5 h-5" />
        <span className="ml-4 font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 md:bg-gray-800 text-white">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-2xl font-bold">Admin</h1>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-2">
            <DesktopNavLink href="/admin" icon={Home} label="Dashboard" />
            <DesktopNavLink href="/admin/sitters" icon={Users} label="Sitters" />
          </nav>
          <div className="flex-shrink-0 px-2 py-4 border-t border-gray-700">
             <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-gray-200 rounded-lg hover:bg-gray-700">
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
        <MobileNavLink href="/admin" icon={Home} label="Dashboard" />
        <MobileNavLink href="/admin/sitters" icon={Users} label="Sitters" />
        <button onClick={handleLogout} className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-indigo-600">
            <LogOut className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminLayout;
