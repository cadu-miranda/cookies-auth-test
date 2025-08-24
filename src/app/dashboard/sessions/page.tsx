import { cookies, headers } from 'next/headers';
import { SessionsTable } from '../../../components/dashboard/SessionsTable';
import { Shield } from 'lucide-react';

type SearchParams = { [k: string]: string | string[] | undefined };

async function getSessions({ page = '1', pageSize = '10' } = {}) {
  const h = await headers();

  const host = h.get('x-forwarded-host') ?? h.get('host');

  const proto = h.get('x-forwarded-proto') ?? 'http';

  const base = `${proto}://${host}`;

  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
    .join('; ');

  const response = await fetch(
    `${base}/api/auth/sessions?page=${page}&pageSize=${pageSize}`,
    {
      cache: 'no-store',
      headers: { Cookie: cookieHeader },
    },
  );

  if (!response.ok) {
    return {
      items: [],
      meta: {
        total: 0,
        page: 1,
        pageSize: 10,
        pageCount: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }

  return response.json();
}

export default async function SessionsPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;

  const { items, meta } = await getSessions({
    page: typeof searchParams.page === 'string' ? searchParams.page : undefined,
    pageSize:
      typeof searchParams.pageSize === 'string'
        ? searchParams.pageSize
        : undefined,
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-3">
      <div className="flex items-center gap-3 text-xl font-semibold">
        <Shield />

        <h3>Sessões</h3>
      </div>

      <SessionsTable items={items} meta={meta} />
    </div>
  );
}
