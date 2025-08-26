'use client';

import { useState, useMemo } from 'react';
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
import {
  ChevronLeft,
  ChevronRight,
  Inbox,
  LogOut,
  RefreshCcw,
} from 'lucide-react';

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

  const refresh = () => router.refresh();

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

  const hasItems = items.length > 0;

  // Faixa "Mostrando X–Y de Z"

  const { start, end } = useMemo(() => {
    if (!hasItems) {
      return { start: 0, end: 0 };
    }

    const s = (meta.page - 1) * meta.pageSize + 1;

    const e = (meta.page - 1) * meta.pageSize + items.length;

    return { start: s, end: e };
  }, [hasItems, items.length, meta.page, meta.pageSize]);

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-background shadow-sm">
      {/* Top bar com título e ações */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-muted/60 text-muted-foreground p-4 border-b border-border rounded-t-lg">
        <div className="space-y-1">
          <h2 className="text-sm font-medium text-foreground">
            Sessões ativas
          </h2>

          <p className="text-xs">
            Gerencie os acessos da sua conta em diferentes dispositivos.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={refresh}
            variant="secondary"
            disabled={busy !== null}
            aria-label="Atualizar lista de sessões"
          >
            <RefreshCcw className="h-4 w-4" />
            Atualizar
          </Button>

          <Button
            onClick={revokeOthers}
            disabled={!hasItems || busy !== null}
            variant="destructive"
            aria-label="Revogar outras sessões"
          >
            <LogOut className="h-4 w-4" />
            Revogar outras sessões
          </Button>
        </div>
      </div>

      {/* Tabela / Empty state */}

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
          {hasItems ? (
            items.map((s) => (
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

                <TableCell className="p-3 align-middle">
                  {s.ip ?? '-'}
                </TableCell>

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
                    <LogOut />
                    Revogar
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="p-10">
                <div className="flex flex-col items-center justify-center text-center gap-3">
                  <div className="rounded-full border border-border p-3">
                    <Inbox
                      className="h-6 w-6 text-muted-foreground"
                      aria-hidden
                    />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      Nenhuma sessão ativa
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Quando você acessar de outros dispositivos, as sessões
                      aparecerão aqui.
                    </p>
                  </div>

                  <div className="mt-2">
                    <Button onClick={refresh} disabled={busy !== null}>
                      <RefreshCcw className="h-4 w-4" />
                      Atualizar
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Footer apenas para total + paginação */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 border-t border-border rounded-b-lg">
        {/* Total + faixa */}

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {hasItems ? (
            <>
              <span>
                Mostrando{' '}
                <span className="text-foreground font-medium">{start}</span>–
                <span className="text-foreground font-medium">{end}</span> de{' '}
                <span className="text-foreground font-medium">
                  {meta.total}
                </span>
              </span>
            </>
          ) : (
            <span>Nenhum resultado</span>
          )}
        </div>

        {/* Paginação */}

        {hasItems && (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setPage(meta.page - 1)}
              disabled={!meta.hasPrevPage || busy !== null}
              variant="secondary"
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>

            <Button
              onClick={() => setPage(meta.page + 1)}
              disabled={!meta.hasNextPage || busy !== null}
              aria-label="Próxima página"
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export { SessionsTable };
