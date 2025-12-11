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
    <div className="p-8 bg-white text-black">
      <h1 className="text-5xl font-bold mb-6 border-b pb-4 text-black">Quản lý người dùng</h1>
      {message && (
        <div className="mb-6 p-5 rounded-xl bg-blue-50 border-2 border-blue-200 text-lg font-bold text-black">
          {message}
        </div>
      )}
      <div className="rounded-xl border-2 border-gray-300 overflow-hidden shadow-lg bg-white">
        <table className="w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-5 font-bold text-lg text-black">ID</th>
              <th className="text-left p-5 font-bold text-lg text-black">Tên</th>
              <th className="text-left p-5 font-bold text-lg text-black">Email</th>
              <th className="text-left p-5 font-bold text-lg text-black">Vai trò</th>
              <th className="text-left p-5 font-bold text-lg text-black">Số dư ví</th>
              <th className="text-left p-5 font-bold text-lg text-black">Đã mua</th>
              <th className="text-left p-5 font-bold text-lg text-black">Đã gửi</th>
              <th className="text-left p-5 font-bold text-lg text-black">Hành động</th>
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
    <tr className="border-t border-gray-200 hover:bg-gray-50 transition-all bg-white">
      <td className="p-5 font-bold text-lg text-black">{user.id}</td>
      <td className="p-5 font-bold text-lg text-black">{user.tenNguoiDung}</td>
      <td className="p-5 text-lg text-black">{user.email}</td>
      <td className="p-5 text-lg text-black">{user.vaiTro}</td>
      <td className="p-5 font-bold text-lg text-green-600">{user.soDu.toLocaleString()}đ</td>
      <td className="p-5 text-lg font-bold text-black">{user.purchasedCount}</td>
      <td className="p-5 text-lg font-bold text-black">{user.submissionsCount}</td>
      <td className="p-5">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={soDu}
              onChange={(e) => setSoDu(Number(e.target.value))}
              className="w-40 px-4 py-3 text-lg font-bold border-2 border-gray-300 rounded-lg bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              disabled={loading}
            />
            <button
              onClick={() => onUpdateWallet(user.id, soDu)}
              disabled={loading}
              className="px-6 py-3 text-lg font-bold border-2 border-blue-600 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {loading ? 'Loading...' : 'Cập nhật ví'}
            </button>
          </div>
          <div className="flex flex-wrap gap-3 p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
            {roles.map((r) => (
              <label key={r.id} className="inline-flex items-center gap-2 text-lg font-bold cursor-pointer hover:text-blue-600 transition-colors text-black">
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
                  className="w-5 h-5 cursor-pointer"
                />
                <span>{r.tenVaiTro}</span>
              </label>
            ))}
          </div>
          <button
            onClick={() => onUpdateRoles(user.id, selectedRoles)}
            disabled={loading}
            className="px-6 py-3 text-lg font-bold border-2 border-blue-600 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {loading ? 'Loading...' : 'Cập nhật vai trò'}
          </button>
        </div>
      </td>
    </tr>
  );
}
