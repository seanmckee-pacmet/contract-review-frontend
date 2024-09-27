import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavbarProvider } from '@/contexts/NavbarContext';
import Navbar from '@/components/Navbar';
import MainContent from '@/components/MainContent';

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
          <Navbar />
          <MainContent>{children}</MainContent>
        </NavbarProvider>
      </body>
    </html>
  );
}
