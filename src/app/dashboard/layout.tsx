import type { Metadata } from 'next';
import { Sidebar } from '@/components/Sidebar';

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
      <div className="mx-auto grid w-full grid-cols-1 md:grid-cols-[14rem_1fr]">
        {/* Sidebar (fixa no desktop, vai para topo no mobile) */}

        <div className="border-b md:border-b-0 md:border-r border-border">
          <Sidebar />
        </div>

        {/* Conteúdo */}

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
