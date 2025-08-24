import { Users } from 'lucide-react';

export default async function UsersPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-3">
      <div className="flex items-center gap-3 text-xl font-semibold">
        <Users />

        <h3>Usuários</h3>
      </div>
    </div>
  );
}
