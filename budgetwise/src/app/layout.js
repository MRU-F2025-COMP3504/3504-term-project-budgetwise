import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BudgetWise",
  description: "Track and understand your spending",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav className="bw-border mb-6 mx-auto max-w-[1100px] mt-4">
          <div className="flex items-center justify-between px-4 py-3">
            <a href="/" className="font-semibold"><img src="/BudgetWiseLogo.png" alt="BudgetWise Logo" className="h-15 w-auto" /></a>
            <div className="flex gap-4 text-sm flex-wrap">
              <a href="/dashboard" className="hover:underline">Dashboard</a>
              <a href="/upload" className="hover:underline">Upload</a>
              <a href="/statements" className="hover:underline">Statements</a>
              <a href="/transactions" className="hover:underline">Transactions</a>
              <a href="/categories" className="hover:underline">Categories</a>
              <a href="/budgets" className="hover:underline">Budgets</a>
              <a href="/ai" className="hover:underline">AI</a>
              <a href="/quiz" className="hover:underline">Quiz</a>
              <a href="/profile" className="hover:underline">Profile</a>
              <a href="/login" className="hover:underline">Login</a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
