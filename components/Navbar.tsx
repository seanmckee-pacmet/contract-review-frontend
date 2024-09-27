"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { File, TableOfContents, MessageSquare, Brain, PanelLeftOpen, PanelRightOpen } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavbar } from '@/contexts/NavbarContext';

const Navbar = () => {
  const pathname = usePathname();
  const { isExpanded, setIsExpanded } = useNavbar();

  const navItems = [
    { name: 'Manage Docs', href: '/', icon: File },
    { name: 'Review', href: '/review', icon: TableOfContents },
    { name: 'Chat', href: '/chat', icon: MessageSquare },
    { name: 'Analyze PO', href: '/AnalyzePO', icon: Brain },
  ];

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <nav className={cn(
      "bg-background border-r h-screen fixed left-0 top-0 flex flex-col transition-all duration-300 overflow-hidden",
      isExpanded ? "w-64" : "w-16"
    )}>
      <div className="flex items-center justify-between p-4 h-16 relative">
        <div className={cn("text-2xl font-bold text-primary whitespace-nowrap transition-all duration-300",
          isExpanded ? "opacity-100" : "opacity-0 -translate-x-full"
        )}>
          Contract AI
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleNavbar}
          className={cn("transition-all duration-300 absolute", 
            isExpanded ? "right-4" : "right-1/2 translate-x-1/2")}
        >
          {isExpanded ? <PanelLeftOpen className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
        </Button>
      </div>
      <ul className="space-y-2 mt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.name}>
              <Button
                asChild
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-secondary",
                  isExpanded ? "px-4" : "px-0"
                )}
              >
                <Link href={item.href} className="flex items-center">
                  <div className={cn("flex items-center justify-center", isExpanded ? "w-6" : "w-16")}>
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                  </div>
                  {isExpanded && (
                    <span className="ml-2 transition-all duration-300">
                      {item.name}
                    </span>
                  )}
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