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
    <div className="overflow-x-auto rounded-lg border border-border bg-background shadow-sm">
      {/* Top bar */}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-muted/60 text-muted-foreground p-4 border-b border-border rounded-t-lg">
        <div className="text-sm">
          Total:{' '}
          <span className="font-medium text-foreground">{meta.total}</span> •
          Página{' '}
          <span className="font-medium text-foreground">{meta.page}</span> de{' '}
          <span className="font-medium text-foreground">{meta.pageCount}</span>
        </div>

        <Button onClick={revokeOthers} disabled={busy !== null}>
          Revogar outras sessões
        </Button>
      </div>

      {/* Tabela “flat” + separadores sutis */}

      <Table className="min-w-full text-sm border-0 [&_th]:border-0 [&_td]:border-0">
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-border">
            <TableHead className="p-3 text-left font-medium">Atual</TableHead>

            <TableHead className="p-3 text-left font-medium">
              Último uso
            </TableHead>

            <TableHead className="p-3 text-left font-medium">IP</TableHead>

            <TableHead className="p-3 text-left font-medium">
              User-Agent
            </TableHead>

            <TableHead className="p-3 text-center font-medium">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((s) => (
            <TableRow
              key={s.id}
              className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
            >
              <TableCell className="p-3 align-middle">
                {s.current ? '✅' : ''}
              </TableCell>

              <TableCell className="p-3 align-middle">
                {s.lastUsedAt ? new Date(s.lastUsedAt).toLocaleString() : '-'}
              </TableCell>

              <TableCell className="p-3 align-middle">{s.ip ?? '-'}</TableCell>

              <TableCell
                className="p-3 align-middle max-w-[320px]"
                title={s.userAgent ?? ''}
              >
                <span className="line-clamp-1 break-words text-foreground/90">
                  {s.userAgent ?? '-'}
                </span>
              </TableCell>

              <TableCell className="p-3 text-center align-middle">
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

      {/* Footer (paginação) */}

      <div className="flex items-center justify-end gap-2 p-3 border-t border-border rounded-b-lg">
        <Button
          onClick={() => setPage(meta.page - 1)}
          disabled={!meta.hasPrevPage || busy !== null}
          variant="secondary"
          aria-label="Página anterior"
        >
          Anterior
        </Button>

        <Button
          onClick={() => setPage(meta.page + 1)}
          disabled={!meta.hasNextPage || busy !== null}
          aria-label="Próxima página"
        >
          Próxima
        </Button>
      </div>
    </div>
  );
};

export { SessionsTable };
