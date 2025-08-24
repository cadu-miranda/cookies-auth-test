import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from 'axios';
import { cookies, headers } from 'next/headers';

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// --------- CLIENT (browser) ---------

function createBrowserAxios(): AxiosInstance {
  const api = axios.create({ baseURL: '/api', withCredentials: true });

  api.interceptors.response.use(
    (r) => r,
    async (err: AxiosError): Promise<AxiosResponse | never> => {
      const cfg = err.config as RetryConfig | undefined;

      if (err.response?.status === 401 && cfg && !cfg._retry) {
        cfg._retry = true;

        try {
          await axios.post('/api/auth/refresh', null, {
            withCredentials: true,
          });

          return api(cfg);
        } catch {
          // opcional: redirecionar p/ login
        }
      }

      return Promise.reject(err);
    },
  );

  return api;
}

// --------- SERVER (SSR/Route Handlers) ---------

async function buildCookieHeaderFromRequest(): Promise<string> {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
    .join('; ');
}

async function getAbsoluteBaseFromRequest(): Promise<string> {
  const h = await headers();

  const host = h.get('x-forwarded-host') ?? h.get('host');

  const proto = h.get('x-forwarded-proto') ?? 'http';

  return `${proto}://${host}`;
}

// Axios para chamar rotas internas /api/* (proxy) no server

async function createServerAxiosInternal(): Promise<AxiosInstance> {
  const cookieHeader = await buildCookieHeaderFromRequest();

  const base = await getAbsoluteBaseFromRequest();

  const api = axios.create({
    baseURL: `${base}/api`,
    headers: new AxiosHeaders({ cookie: cookieHeader }), // 👈 aqui
  });

  api.interceptors.response.use(
    (r) => r,
    async (err: AxiosError): Promise<AxiosResponse | never> => {
      const cfg = err.config as RetryConfig | undefined;

      if (err.response?.status === 401 && cfg && !cfg._retry) {
        cfg._retry = true;

        await axios.post(`${base}/api/auth/refresh`, null, {
          headers: new AxiosHeaders({ cookie: cookieHeader }),
        });

        const refreshed = await buildCookieHeaderFromRequest();

        cfg.headers = new AxiosHeaders(cfg.headers);

        cfg.headers.set('cookie', refreshed);

        return api(cfg);
      }

      return Promise.reject(err);
    },
  );

  return api;
}

// Axios para chamar o NEST direto do server (pula /api)

async function createServerAxiosToNest(): Promise<AxiosInstance> {
  const cookieHeader = await buildCookieHeaderFromRequest();

  const api = axios.create({
    baseURL: process.env.API_URL,
    headers: new AxiosHeaders({ cookie: cookieHeader }),
  });

  api.interceptors.response.use(
    (r) => r,
    async (err: AxiosError): Promise<AxiosResponse | never> => {
      const cfg = err.config as RetryConfig | undefined;

      if (err.response?.status === 401 && cfg && !cfg._retry) {
        cfg._retry = true;

        const base = await getAbsoluteBaseFromRequest();

        await axios.post(`${base}/api/auth/refresh`, null, {
          headers: new AxiosHeaders({ cookie: cookieHeader }),
        });

        const refreshed = await buildCookieHeaderFromRequest();

        cfg.headers = new AxiosHeaders(cfg.headers);

        cfg.headers.set('cookie', refreshed);

        return api(cfg);
      }

      return Promise.reject(err);
    },
  );

  return api;
}

export {
  createBrowserAxios,
  createServerAxiosInternal,
  createServerAxiosToNest,
};
