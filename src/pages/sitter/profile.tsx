import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/router';
import SitterLayout from './_layout';

export default function ProfilePage() {
    const supabase = createClient();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/'); // Redirect to home page after logout
    };

    return (
        <SitterLayout>
            <div className="container mx-auto p-4">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>
                    <p className="text-gray-600 mb-6">Profile editing is not available in this version. Please contact an admin for any changes.</p>
                    <button 
                        onClick={handleLogout}
                        className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </SitterLayout>
    );
}
