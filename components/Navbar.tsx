"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { File, TableOfContents, MessageSquare, Brain } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Manage Docs', href: '/', icon: File },
    { name: 'Review', href: '/Review', icon: TableOfContents },
    { name: 'Chat', href: '/Chat', icon: MessageSquare },
    { name: 'Analyze PO', href: '/AnalyzePO', icon: Brain },
  ];

  return (
    <nav className="bg-background border-r h-screen w-64 fixed left-0 top-0 p-4 flex flex-col">
      <div className="text-2xl font-bold mb-8 text-primary">Contract AI</div>
      <ul className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.name}>
              <Button
                asChild
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-secondary"
                )}
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;