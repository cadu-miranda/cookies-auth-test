'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const links = [
    {
      href: '/dashboard/sessions',
      label: 'Sessões',
      icon: Shield,
    },
  ];

  return (
    <aside className="h-screen w-56 border-r border-border bg-background p-4">
      <div className="flex items-center justify-center mb-8">
        <span className="text-lg font-semibold text-foreground">
          Next.js + Auth.js
        </span>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;

          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon className="h-4 w-4" />

              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export { Sidebar };
