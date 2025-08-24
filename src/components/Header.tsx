'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, Users } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const Header = () => {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard/sessions', label: 'Sessões', icon: Users },
  ];

  return (
    <header className="flex h-14 items-center justify-between px-4">
      {/* Menu (abre páginas do dashboard) */}

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Abrir menu">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle>Next.js + Auth.js</SheetTitle>
          </SheetHeader>

          <nav className="mt-6 space-y-1">
            {links.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Título */}

      <div className="text-sm font-medium">Next.js + Auth.js</div>

      {/* Theme toggle (mobile) */}

      <ThemeToggle />
    </header>
  );
};

export { Header };
