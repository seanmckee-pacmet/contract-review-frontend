"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { File, TableOfContents, MessageSquare, PanelLeftOpen, PanelRightOpen, LogOut } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavbar } from '@/contexts/NavbarContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  const { isExpanded, setIsExpanded } = useNavbar();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const navItems = [
    { name: 'Manage Docs', href: '/private/document-manager', icon: File },
    { name: 'Review', href: '/private/review', icon: TableOfContents },
    { name: 'Chat', href: '/private/chat', icon: MessageSquare },
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
      <ul className="space-y-2 mt-2 flex-grow">
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
      <div className="mt-auto mb-4">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className={cn(
            "w-full justify-start",
            isExpanded ? "px-4" : "px-0"
          )}
        >
          <div className={cn("flex items-center justify-center", isExpanded ? "w-6" : "w-16")}>
            <LogOut className="h-4 w-4 flex-shrink-0" />
          </div>
          {isExpanded && (
            <span className="ml-2 transition-all duration-300">
              Logout
            </span>
          )}
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;