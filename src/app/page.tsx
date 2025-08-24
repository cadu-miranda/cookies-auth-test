'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/sign-in`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password, rememberMe }),
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));

        throw new Error(data?.message || 'Falha no login');
      }

      router.refresh();
    } catch (err) {
      setError((err as Error).message || 'Erro desconhecido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Faça seu login
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label className="block mb-2 font-medium" htmlFor="email">
              E-mail
            </Label>

            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <Label className="block mb-2 font-medium" htmlFor="password">
              Senha
            </Label>

            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="flex items-center">
            <Checkbox
              onCheckedChange={(checked) => setRememberMe(!!checked)}
              checked={rememberMe}
              className="mr-2"
            />

            <Label htmlFor="rememberMe">Lembre-se de mim</Label>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
