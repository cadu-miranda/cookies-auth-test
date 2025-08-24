'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, Shield } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const Sidebar = () => {
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
    <aside className="h-full md:h-screen w-full md:w-56 bg-background border-border p-4">
      <div className="flex h-full flex-col">
        {/* Header */}

        <div className="mb-6">
          <span className="text-lg font-semibold text-foreground">
            Next.js + Auth.js
          </span>
        </div>

        {/* Navegação */}

        <nav className="space-y-1">
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

        {/* Footer fixo: Theme + Sair */}

        <div className="mt-auto space-y-3 pt-4 border-t border-border">
          {/* Theme (desktop) */}

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Tema</span>
            <ThemeToggle />
          </div>

          <Button
            onClick={onLogout}
            disabled={busy}
            aria-busy={busy}
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {busy ? 'Saindo...' : 'Sair'}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export { Sidebar };
