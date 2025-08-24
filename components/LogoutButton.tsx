'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LogoutButton = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const onLogout = async () => {
    setLoading(true);

    try {
      const resp = await fetch('http://localhost:3000/api/auth/sign-out', {
        method: 'POST',
        credentials: 'include',
      });

      if (!resp.ok) {
        throw new Error('Falha ao sair');
      }

      router.replace('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={onLogout} disabled={loading}>
      Sair
    </Button>
  );
};

export { LogoutButton };
