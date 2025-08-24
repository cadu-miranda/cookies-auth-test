import type { Metadata } from 'next';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'Demo | Dashboard',
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header (mobile) */}

      <div className="md:hidden sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Header />
      </div>

      {/* Grid principal */}

      <div className="mx-auto grid w-full grid-cols-1 md:grid-cols-[14rem_1fr]">
        {/* Sidebar (desktop) */}

        <div className="hidden md:block border-r border-border">
          <Sidebar />
        </div>

        {/* Conteúdo */}

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
