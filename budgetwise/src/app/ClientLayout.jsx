'use client';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Navbar from './Navbar';
import Sidebar from '@/components/Sidebar';

function LayoutContent({ children }) {
  const { user, loading } = useAuth();
  
  // While loading auth state, show a minimal loading screen
  if (loading) {
    return <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-[var(--color-text-muted)]">Loading...</div>;
  }

  // If logged in, show Sidebar layout
  if (user) {
    return (
      <div className="flex min-h-screen bg-[var(--background)]">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 transition-all duration-300">
          {children}
        </main>
      </div>
    );
  }

  // If not logged in, show standard Navbar layout (Landing Page)
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      {children}
    </div>
  );
}

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
}
