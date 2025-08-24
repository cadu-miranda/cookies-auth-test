import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 items-start justify-center min-h-screen px-4">
      <h1 className="text-2xl font-semibold">Demo - Login & Sessões</h1>

      <p>Exemplo simples usando cookies HttpOnly vindos do back-end NestJS.</p>

      <div className="flex gap-3">
        <Link className="underline" href="/login">
          Ir para Login
        </Link>
      </div>
    </div>
  );
};

export default HomePage;

