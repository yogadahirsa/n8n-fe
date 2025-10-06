import { getUsers } from '@/app/lib/action';
import Table from '@/app/ui/user/table';

export default async function User() {
  const users = await getUsers();

  if (!users || users.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return (
    <main>
      <h1 className="mb-2">Users</h1>
      <Table data={users} />
    </main>
  );
}
