import { Fragment } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Demo | Dashboard',
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Fragment>{children}</Fragment>;
}
