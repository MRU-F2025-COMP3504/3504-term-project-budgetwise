import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
            <a href="/" className="font-semibold">BudgetWise</a>
            <div className="flex gap-4 text-sm">
              <a href="/statements" className="hover:underline">Statements</a>
              <a href="/transactions" className="hover:underline">Transactions</a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
