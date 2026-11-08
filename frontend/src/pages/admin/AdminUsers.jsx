import { useEffect, useState } from 'react';
import { FiSearch, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async (q = '') => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/users${q ? `?search=${q}` : ''}`);
      setUsers(data.users || []);
    } finally { setLoading(false); }
  };

  const toggleActive = async (id) => {
    const { data } = await api.put(`/admin/users/${id}/toggle-active`);
    setUsers(users.map((u) => (u._id === id ? data.user : u)));
    toast.success('User status updated');
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this user and all their content?')) return;
    await api.delete(`/admin/users/${id}`);
    setUsers(users.filter((u) => u._id !== id));
    toast.success('User deleted');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search users..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchUsers(search)}
            className="input-field pl-12"
          />
        </div>
        <button onClick={() => fetchUsers(search)} className="btn-primary">Search</button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-hover text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Role</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Points</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-6"><div className="skeleton h-16" /></td></tr>
              ) : users.map((u) => (
                <tr key={u._id} className="border-t border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-hover">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                        {u.avatar?.url ? <img src={u.avatar.url} alt="" className="w-9 h-9 rounded-full" /> : u.name?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-sm">
                    <span className={`badge ${u.role === 'admin' ? 'bg-pink-500/10 text-pink-500' : 'bg-primary-500/10 text-primary-500'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-sm">{u.points}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${u.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {u.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button onClick={() => toggleActive(u._id)} className="p-2 rounded-lg hover:bg-primary-500/10 text-primary-500">
                        {u.isActive ? <FiToggleRight /> : <FiToggleLeft />}
                      </button>
                      <button onClick={() => handleDelete(u._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
