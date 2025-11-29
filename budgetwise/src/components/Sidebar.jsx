"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Upload, 
  FileText, 
  DollarSign, 
  Tags, 
  PieChart, 
  Bot, 
  LogOut,
  User
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/statements", label: "Statements", icon: FileText },
  { href: "/transactions", label: "Transactions", icon: DollarSign },
  { href: "/categories", label: "Categories", icon: Tags },
  { href: "/budgets", label: "Budgets", icon: PieChart },
  { href: "/ai", label: "AI Assistant", icon: Bot },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Get user initial
  const initial = user?.email?.[0]?.toUpperCase() || "U";
  const name = user?.user_metadata?.display_name || user?.email?.split('@')[0] || "User";

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[var(--card-bg)] border-r border-[var(--color-border)] flex flex-col z-50 backdrop-blur-xl bg-opacity-95 shadow-xl">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-[var(--buttoncolor1)] rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
          <DollarSign size={20} />
        </div>
        <span className="font-bold text-xl tracking-tight text-[var(--color-text)]">BudgetWise</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? "bg-[var(--buttoncolor1)] text-white shadow-lg shadow-indigo-500/20 translate-x-1" 
                  : "text-[var(--color-text-muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--color-text)] hover:translate-x-1"
              }`}
            >
              <Icon size={20} className={isActive ? "text-white" : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors"} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-[var(--color-border)] bg-[var(--surface-raised)]/30">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--buttoncolor1)] to-purple-600 flex items-center justify-center text-white font-semibold shadow-md border border-white/10">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-[var(--color-text)]">{name}</p>
            <p className="text-xs text-[var(--color-text-muted)] truncate">{user?.email}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Link 
            href="/profile"
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-[var(--card-bg)] border border-[var(--color-border)] hover:bg-[var(--surface-raised)] transition-colors text-xs font-medium text-[var(--color-text)]"
          >
            <User size={14} />
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 transition-colors text-xs font-medium"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
