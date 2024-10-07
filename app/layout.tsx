import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavbarProvider } from '@/contexts/NavbarContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Contract AI",
  description: "AI-powered contract management and analysis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavbarProvider>
          {children}
        </NavbarProvider>
      </body>
    </html>
  );
}
