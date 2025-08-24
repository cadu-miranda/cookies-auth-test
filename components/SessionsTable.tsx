'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Item = {
  id: string;
  createdAt: string;
  lastUsedAt: string | null;
  expiresAt: string;
  ip: string | null;
  userAgent: string | null;
  familyId: string | null;
  current?: boolean;
};

type Meta = {
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

const SessionsTable = ({ items, meta }: { items: Item[]; meta: Meta }) => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [busy, setBusy] = useState<string | null>(null);

  const revoke = async (sessionId: string) => {
    setBusy(sessionId);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/revoke-session`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ sessionId }),
        },
      );

      if (!response.ok) {
        throw new Error('Falha ao revogar');
      }

      router.refresh();
    } finally {
      setBusy(null);
    }
  };

  const revokeOthers = async () => {
    setBusy('others');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/revoke-others`,
        { method: 'POST', credentials: 'include' },
      );

      if (!response.ok) {
        throw new Error('Falha ao revogar outras');
      }

      router.refresh();
    } finally {
      setBusy(null);
    }
  };

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('page', String(page));

    router.push(`/dashboard/sessions?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 p-4 rounded-t-lg shadow-sm">
        <div className="text-sm text-gray-600">
          Total: <span className="font-medium">{meta.total}</span> • Página{' '}
          <span className="font-medium">{meta.page}</span> de{' '}
          <span className="font-medium">{meta.pageCount}</span>
        </div>

        <Button onClick={revokeOthers} disabled={busy !== null}>
          Revogar outras sessões
        </Button>
      </div>

      <div className="overflow-x-auto shadow rounded-b-lg border border-gray-200">
        <Table className="min-w-full text-sm">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="p-3 text-left font-medium text-gray-700">
                Atual
              </TableHead>

              <TableHead className="p-3 text-left font-medium text-gray-700">
                Último uso
              </TableHead>

              <TableHead className="p-3 text-left font-medium text-gray-700">
                IP
              </TableHead>

              <TableHead className="p-3 text-left font-medium text-gray-700">
                User-Agent
              </TableHead>

              <TableHead className="p-3 text-center font-medium text-gray-700">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="bg-white divide-y divide-gray-200">
            {items.map((s) => (
              <TableRow key={s.id} className="hover:bg-gray-50 transition">
                <TableCell className="p-3">{s.current ? '✅' : ''}</TableCell>

                <TableCell className="p-3">
                  {s.lastUsedAt ? new Date(s.lastUsedAt).toLocaleString() : '-'}
                </TableCell>

                <TableCell className="p-3">{s.ip ?? '-'}</TableCell>

                <TableCell
                  className="p-3 truncate max-w-[240px]"
                  title={s.userAgent ?? ''}
                >
                  {s.userAgent ?? '-'}
                </TableCell>

                <TableCell className="p-3 text-center">
                  <Button
                    onClick={() => revoke(s.id)}
                    disabled={s.current || busy !== null}
                    variant="destructive"
                  >
                    Revogar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end gap-4">
        <Button
          onClick={() => setPage(meta.page - 1)}
          disabled={!meta.hasPrevPage || busy !== null}
        >
          Anterior
        </Button>

        <Button
          onClick={() => setPage(meta.page + 1)}
          disabled={!meta.hasNextPage || busy !== null}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
};

export { SessionsTable };
