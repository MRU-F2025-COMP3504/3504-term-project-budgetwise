"use client";

import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Menu } from "@headlessui/react";
import { useState } from "react";
import { signedInNavLinks } from "@/components/config/navLinks";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Get first letter of user's email or name
  const getUserInitial = () => {
    if (!user) return "?";
    const email = user.email || "";
    return email.charAt(0).toUpperCase();
  };

  return (
    <nav className="sticky top-4 z-40 mx-auto max-w-[1100px] rounded-2xl glass-panel mb-6 transition-all duration-300">
      <div className="flex items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="font-semibold hover:opacity-80 transition-opacity"
        >
          <img
            src="/BudgetWiseLogo.png"
            alt="BudgetWise Logo"
            className="h-10 w-auto"
          />
        </Link>
        <div className="flex gap-4 text-m flex-wrap items-center">
          {loading ? (
            // Show loading state while checking auth
            <div className="text-sm text-[var(--color-text-muted)] animate-pulse">
              Loading...
            </div>
          ) : user ? (
            <>
              {/* Show nav links when signed in */}
              {signedInNavLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                  {l.label}
                </Link>
              ))}

              {/* Profile icon dropdown */}
              <Menu as="div" className="relative inline-block">
                <Menu.Button
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[var(--buttoncolor1)] to-purple-600 text-white font-semibold shadow-md hover:shadow-lg transition-all border border-white/10"
                  title="Profile"
                >
                  {getUserInitial()}
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 glass-panel overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/profile"
                          className={`${
                            active ? "bg-[var(--surface-raised)]" : ""
                          } block px-4 py-2 text-sm rounded-lg transition-colors`}
                          style={{ color: "var(--textcolor1)" }}
                        >
                          Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active
                              ? "bg-red-500/10 text-red-400"
                              : "text-[var(--textcolor1)]"
                          } block w-full text-left px-4 py-2 text-sm rounded-lg transition-colors`}
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
              {/* Links removed to avoid redundancy with Hero section */}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
