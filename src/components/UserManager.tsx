import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Profile = {
  id: string;
  role: string | null;
};

export function UserManager() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role')
        .order('role');

      if (error) {
        console.error('Failed to load users:', error);
      } else {
        setUsers(data || []);
      }

      setLoading(false);
    };

    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border p-6">
        <h2 className="text-xl font-semibold">User Manager</h2>
        <p className="mt-2 text-neutral-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">User Manager</h2>
        <p className="mt-1 text-neutral-500">
          Users currently stored in the EmployerRules profiles table.
        </p>
      </div>

      {users.length === 0 ? (
        <p className="text-neutral-500">No users found.</p>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800"
            >
              <div>
                <p className="font-medium">User ID</p>
                <p className="mt-1 break-all text-sm text-neutral-500">
                  {user.id}
                </p>
              </div>

              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                {user.role || 'user'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}