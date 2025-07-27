import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/lib/types';
import { navLinks } from '@/lib/navLinks';

export default function DashboardNav() {
  const { user, logout } = useAuth();

  if (!user) return null;

  // Make sure user.role matches your UserRole union values
  const links = navLinks[user.role as UserRole] || [];

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white font-bold">Adwita Agros</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-white text-sm mr-4">Welcome back, {user.username}</div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
