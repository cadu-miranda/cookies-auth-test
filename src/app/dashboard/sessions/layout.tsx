import { Fragment } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Demo | Sessões',
};

export default function DashboardSessionsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Fragment>{children}</Fragment>;
}
