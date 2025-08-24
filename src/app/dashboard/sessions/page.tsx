import { cookies, headers } from 'next/headers';
import { LogoutButton } from '../../../../components/LogoutButton';
import { SessionsTable } from '../../../../components/SessionsTable';

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
    <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Sessões ativas</h1>

      <p>Veja todas as sessões ativas da sua conta.</p>

      <SessionsTable items={items} meta={meta} />

      <div className="w-full">
        <LogoutButton />
      </div>
    </div>
  );
}
