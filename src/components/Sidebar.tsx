'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Users, Shield } from 'lucide-react';
import { QuickActions } from '@/components/QuickActions';

const Sidebar = () => {
  const pathname = usePathname();

  const router = useRouter();

  const [busy, setBusy] = useState(false);

  const links = [
    { href: '/dashboard/users', label: 'Usuários', icon: Users },
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
    <aside className="h-full md:h-screen w-full md:w-56 bg-background p-4 md:border-r border-border">
      <div className="flex h-full flex-col">
        <div className="mb-6">
          <span className="text-lg font-semibold text-foreground">
            Placeholder
          </span>
        </div>

        <nav className="space-y-2">
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

        {/* Footer fixo: ações unificadas */}

        <div className="mt-auto pt-4 border-t border-border">
          <QuickActions onLogout={onLogout} busy={busy} />
        </div>
      </div>
    </aside>
  );
};

export { Sidebar };
