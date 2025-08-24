'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, Shield } from 'lucide-react';
import { QuickActions } from '@/components/QuickActions';

const Header = () => {
  const pathname = usePathname();

  const router = useRouter();

  const [busy, setBusy] = useState(false);

  const links = [
    { href: '/dashboard/sessions', label: 'Sessões', icon: Shield },
  ];

  const onLogout = async () => {
    setBusy(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/sign-out`,
        { method: 'POST', credentials: 'include' },
      );

      if (!response.ok) {
        throw new Error('Falha ao sair');
      }

      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <header className="flex h-14 items-center px-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Abrir menu">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-72 border-r border-border bg-background focus-visible:outline-none data-[state=open]:outline-none"
        >
          <SheetHeader>
            <SheetTitle>Next.js + Auth.js</SheetTitle>
          </SheetHeader>

          <div className="mt-6 flex h-[calc(100%-3rem)] flex-col">
            <nav className="space-y-1 px-3">
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

            {/* Footer do Sheet: ações unificadas */}

            <div className="mt-auto sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-3 pt-4 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] border-t border-border">
              <QuickActions onLogout={onLogout} busy={busy} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export { Header };
