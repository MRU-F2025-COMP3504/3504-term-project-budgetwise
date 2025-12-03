'use client';

import { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import AICompanion from '@/components/AICompanion';
import { Menu } from 'lucide-react';

function LayoutContent({ children }) {
  const { user, loading } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // While loading auth state, show a minimal loading screen
  if (loading) {
    return <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-[var(--color-text-muted)]">Loading...</div>;
  }

  // If logged in, show Sidebar layout
  if (user) {
    return (
      <div className="flex min-h-screen bg-[var(--background)]">
        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[var(--card-bg)] border-b border-[var(--color-border)] flex items-center px-4 z-40">
            <button onClick={() => setIsMobileOpen(true)} className="p-2 text-[var(--color-text)] hover:bg-[var(--surface-raised)] rounded-md transition-colors">
                <Menu size={24} />
            </button>
            <span className="ml-4 font-bold text-xl text-[var(--color-text)]">BudgetWise</span>
        </div>

        <Sidebar 
            isCollapsed={isCollapsed} 
            toggleSidebar={() => setIsCollapsed(!isCollapsed)} 
            isMobileOpen={isMobileOpen}
            closeMobileSidebar={() => setIsMobileOpen(false)}
        />
        
        <main className={`flex-1 p-4 md:p-8 transition-all duration-300 pt-20 md:pt-8 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
          {children}
        </main>
        <AICompanion />
      </div>
    );
  }

  // If not logged in, show standard Navbar layout (Landing Page)
  return (
    <div className="min-h-screen bg-[var(--background)]">
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
