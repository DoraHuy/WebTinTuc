'use client';

import { useState } from 'react';

interface User {
  id: number;
  tenNguoiDung: string;
  email: string;
  vaiTro: string;
  vaiTroIds: number[];
  soDu: number;
  purchasedCount: number;
  submissionsCount: number;
}

interface Role {
  id: number;
  tenVaiTro: string;
}

interface Props {
  users: User[];
  roles: Role[];
}

export default function UsersClient({ users, roles }: Props) {
  const [loading, setLoading] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpdateWallet = async (userId: number, soDu: number) => {
    setLoading(userId);
    setMessage(null);
    try {
      const res = await fetch('/api/manage/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, wallet: { soDu } }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Cập nhật ví thành công cho user #${userId}`);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setMessage(`❌ ${data.error || 'Lỗi cập nhật ví'}`);
      }
    } catch (e) {
      setMessage('❌ Lỗi kết nối');
    } finally {
      setLoading(null);
    }
  };

  const handleUpdateRoles = async (userId: number, roleIds: number[]) => {
    setLoading(userId);
    setMessage(null);
    try {
      const res = await fetch('/api/manage/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, roles: roleIds }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Cập nhật vai trò thành công cho user #${userId}`);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setMessage(`❌ ${data.error || 'Lỗi cập nhật vai trò'}`);
      }
    } catch (e) {
      setMessage('❌ Lỗi kết nối');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý người dùng</h1>
      {message && (
        <div className="mb-4 p-3 rounded-lg bg-muted border text-sm">
          {message}
        </div>
      )}
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Tên</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Vai trò</th>
              <th className="text-left p-3">Số dư ví</th>
              <th className="text-left p-3">Đã mua</th>
              <th className="text-left p-3">Đã gửi</th>
              <th className="text-left p-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <UserRow
                key={u.id}
                user={u}
                roles={roles}
                loading={loading === u.id}
                onUpdateWallet={handleUpdateWallet}
                onUpdateRoles={handleUpdateRoles}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserRow({
  user,
  roles,
  loading,
  onUpdateWallet,
  onUpdateRoles,
}: {
  user: User;
  roles: Role[];
  loading: boolean;
  onUpdateWallet: (userId: number, soDu: number) => void;
  onUpdateRoles: (userId: number, roleIds: number[]) => void;
}) {
  const [soDu, setSoDu] = useState(user.soDu);
  const [selectedRoles, setSelectedRoles] = useState<number[]>(user.vaiTroIds);

  return (
    <tr className="border-t">
      <td className="p-3">{user.id}</td>
      <td className="p-3">{user.tenNguoiDung}</td>
      <td className="p-3">{user.email}</td>
      <td className="p-3">{user.vaiTro}</td>
      <td className="p-3">{user.soDu.toLocaleString()}đ</td>
      <td className="p-3">{user.purchasedCount}</td>
      <td className="p-3">{user.submissionsCount}</td>
      <td className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="number"
            value={soDu}
            onChange={(e) => setSoDu(Number(e.target.value))}
            className="w-28 px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-700"
            disabled={loading}
          />
          <button
            onClick={() => onUpdateWallet(user.id, soDu)}
            disabled={loading}
            className="px-3 py-1 border rounded bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '...' : 'Cập nhật ví'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {roles.map((r) => (
            <label key={r.id} className="inline-flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                checked={selectedRoles.includes(r.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRoles([...selectedRoles, r.id]);
                  } else {
                    setSelectedRoles(selectedRoles.filter((id) => id !== r.id));
                  }
                }}
                disabled={loading}
              />
              <span>{r.tenVaiTro}</span>
            </label>
          ))}
        </div>
        <button
          onClick={() => onUpdateRoles(user.id, selectedRoles)}
          disabled={loading}
          className="px-3 py-1 border rounded bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '...' : 'Cập nhật vai trò'}
        </button>
      </td>
    </tr>
  );
}
