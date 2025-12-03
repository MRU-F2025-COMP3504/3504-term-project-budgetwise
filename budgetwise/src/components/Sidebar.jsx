"use client";
import { useState } from "react";
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
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  X,
  Settings as SettingsIcon,
} from "lucide-react";

// Navigation Items
// These are the links shown in the sidebar.
const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/transactions", label: "Transactions", icon: DollarSign },
  { href: "/budgets", label: "Budgets", icon: PieChart },
];

export default function Sidebar({
  isCollapsed,
  toggleSidebar,
  isMobileOpen,
  closeMobileSidebar,
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768 && closeMobileSidebar) {
      closeMobileSidebar();
    }
  };

  // Get user initial
  const initial = user?.email?.[0]?.toUpperCase() || "U";
  const name =
    user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User";

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={`
        fixed top-0 left-0 h-screen border-r border-[var(--color-border)] flex flex-col z-50 shadow-xl 
        transition-all duration-300 glass-panel
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        w-64 ${isCollapsed ? "md:w-20" : "md:w-64"}
      `}
      >
        {/* Mobile Close Button */}
        <button
          onClick={closeMobileSidebar}
          className="absolute top-4 right-4 md:hidden text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
        >
          <X size={24} />
        </button>

        {/* Desktop Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="hidden md:block absolute -right-3 top-10 bg-[var(--surface-raised)] border border-[var(--color-border)] rounded-full p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] shadow-md z-50 backdrop-blur-md"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Logo */}
        <Link
          href="/dashboard"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer ${isCollapsed ? "md:justify-center md:p-4" : "p-6"} p-6`}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-[var(--buttoncolor1)] to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/30 shrink-0">
            <DollarSign size={20} />
          </div>
          <span
            className={`font-bold text-xl tracking-tight text-[var(--color-text)] animate-in fade-in duration-200 ${isCollapsed ? "md:hidden" : "block"}`}
          >
            BudgetWise
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-1 overflow-y-auto py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                title={isCollapsed ? item.label : ""}
                className={`flex items-center gap-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isCollapsed ? "md:justify-center md:px-2" : "px-3"
                } px-3 ${
                  isActive
                    ? "bg-[var(--buttoncolor1)] text-white shadow-lg shadow-purple-500/25 border border-purple-500/20"
                    : "text-[var(--color-text-muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--color-text)] hover:translate-x-1"
                }`}
              >
                <Icon
                  size={20}
                  className={`shrink-0 ${isActive ? "text-white" : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors"}`}
                />
                <span
                  className={`font-medium text-sm animate-in fade-in duration-200 whitespace-nowrap ${isCollapsed ? "md:hidden" : "block"}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div
          className={`border-t border-[var(--color-border)] bg-[var(--surface-raised)]/30 ${isCollapsed ? "md:p-2" : "p-4"} p-4 relative`}
        >
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-3 w-full rounded-lg hover:bg-[var(--surface-raised)] transition-colors text-left ${isCollapsed ? "md:justify-center md:p-2" : "p-2"}`}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--buttoncolor1)] to-purple-600 flex items-center justify-center text-white font-semibold shadow-md border border-white/10 shrink-0">
              {initial}
            </div>
            <div
              className={`flex-1 min-w-0 animate-in fade-in duration-200 ${isCollapsed ? "md:hidden" : "block"}`}
            >
              <p className="text-sm font-medium truncate text-[var(--color-text)]">
                {name}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] truncate">
                {user?.email}
              </p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Backdrop to close on click outside */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsDropdownOpen(false)}
              />

              <div className="absolute bottom-full left-4 right-4 mb-2 bg-[var(--card-bg)] border border-[var(--color-border)] rounded-xl shadow-xl overflow-hidden z-50 animate-in slide-in-from-bottom-2 fade-in duration-200 min-w-[200px]">
                <div className="p-1">
                  <Link
                    href="/profile"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLinkClick();
                    }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-[var(--surface-raised)] text-sm text-[var(--color-text)] transition-colors"
                  >
                    <User
                      size={16}
                      className="text-[var(--color-text-muted)]"
                    />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLinkClick();
                    }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-[var(--surface-raised)] text-sm text-[var(--color-text)] transition-colors"
                  >
                    <SettingsIcon
                      size={16}
                      className="text-[var(--color-text-muted)]"
                    />
                    Settings
                  </Link>
                  <div className="h-px bg-[var(--color-border)] my-1" />
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-red-500/10 text-sm text-red-400 w-full text-left transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
