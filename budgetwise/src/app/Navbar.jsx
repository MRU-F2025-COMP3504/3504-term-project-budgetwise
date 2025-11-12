'use client';

import { useAuth } from '../FrontEnd/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Menu } from '@headlessui/react';

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Get first letter of user's email or name
  const getUserInitial = () => {
    if (!user) return '?';
    const email = user.email || '';
    return email.charAt(0).toUpperCase();
  };

  return (
    <nav className="bw-border mb-6 mx-auto max-w-[1100px] mt-4">
      <div className="flex items-center justify-between px-4 py-3">
        <a href="/" className="font-semibold">
          <img src="/BudgetWiseLogo.png" alt="BudgetWise Logo" className="h-15 w-auto" />
        </a>
        <div className="flex gap-4 text-m flex-wrap items-center">
          {loading ? (
            // Show loading state while checking auth
            <div className="text-sm text-gray-500">Loading...</div>
          ) : user ? (
            <>
              {/* Show nav links when signed in */}
              <a href="/dashboard" className="hover:underline">Dashboard</a>
              <a href="/upload" className="hover:underline">Upload</a>
              <a href="/statements" className="hover:underline">Statements</a>
              <a href="/transactions" className="hover:underline">Transactions</a>
              <a href="/categories" className="hover:underline">Categories</a>
              <a href="/budgets" className="hover:underline">Budgets</a>
              <a href="/ai" className="hover:underline">AI</a>
              
              {/* Profile icon dropdown */}
              <Menu as="div" className="relative inline-block">
                <Menu.Button className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--buttoncolor1)] text-white font-semibold hover:bg-[var(--hovercolor1)] transition-colors" title="Profile">
                  {getUserInitial()}
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="/profile"
                          className={`${
                            active ? 'bg-[var(--surface-raised)]' : ''
                          } block px-4 py-2 text-sm`}
                          style={{ color: 'var(--textcolor1)' }}
                        >
                          Profile
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-[var(--surface-raised)]' : ''
                          } block w-full text-left px-4 py-2 text-sm`}
                          style={{ color: 'var(--textcolor1)' }}
                        >
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>
            </>
          ) : (
            <>
              {/* Show only Login and Register when not signed in */}
              <a href="/login" className="hover:underline">Login</a>
              <a href="/register" className="hover:underline">Register</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
