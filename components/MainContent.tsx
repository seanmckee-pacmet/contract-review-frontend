"use client";

import { useNavbar } from '@/contexts/NavbarContext';
import { cn } from "@/lib/utils";

export default function MainContent({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useNavbar();
  
  return (
    <main className={cn(
      "transition-all duration-300",
      isExpanded ? "ml-64" : "ml-16"
    )}>
      {children}
    </main>
  );
}