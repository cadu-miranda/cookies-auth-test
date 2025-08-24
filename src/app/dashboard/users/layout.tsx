import { Fragment } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Demo | Usuários',
};

export default function DashboardUsersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Fragment>{children}</Fragment>;
}
