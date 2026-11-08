import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiCamera, FiEdit2, FiAward, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { BRANCHES, SEMESTERS } from '../utils/constants';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const fileRef = useRef();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    college: user?.college || '',
    branch: user?.branch || 'CSE',
    semester: user?.semester || 1,
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await api.put('/users/profile', form);
      updateUser(data.user);
      toast.success('Profile updated');
      setEditing(false);
    } catch {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('avatar', file);
    try {
      const { data } = await api.put('/users/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser({ avatar: data.avatar });
      toast.success('Avatar updated');
    } catch {
      toast.error('Failed to upload avatar');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-8 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-primary-500 via-accent-500 to-pink-500 opacity-80" />
        <div className="relative pt-16">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-white dark:border-dark-card overflow-hidden">
                {user?.avatar?.url ? (
                  <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.[0]?.toUpperCase()
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-primary-500 text-white shadow-lg hover:scale-110 transition-transform"
              >
                <FiCamera className="w-4 h-4" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            </div>

            <div className="flex-1 mt-2">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h1 className="font-display text-2xl font-bold">{user?.name}</h1>
                  <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>
                {!editing && (
                  <button onClick={() => setEditing(true)} className="btn-secondary text-sm flex items-center gap-1">
                    <FiEdit2 /> Edit
                  </button>
                )}
              </div>
              <div className="flex gap-3 mt-3 flex-wrap">
                <span className="badge bg-primary-500/10 text-primary-500"><FiAward /> {user?.points || 0} pts</span>
                <span className="badge bg-accent-500/10 text-accent-500">{user?.role}</span>
                {user?.college && <span className="badge bg-gray-100 dark:bg-dark-hover">{user.college}</span>}
              </div>
            </div>
          </div>

          {/* Form */}
          {editing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="input-field" />
              <input value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} placeholder="College" className="input-field" />
              <select value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} className="input-field">
                {BRANCHES.map((b) => <option key={b}>{b}</option>)}
              </select>
              <select value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} className="input-field">
                {SEMESTERS.map((s) => <option key={s} value={s}>Sem {s}</option>)}
              </select>
              <textarea
                value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Bio (optional)" rows={3} className="input-field sm:col-span-2 resize-none"
              />
              <div className="sm:col-span-2 flex gap-2 justify-end">
                <button onClick={() => setEditing(false)} className="btn-secondary text-sm">Cancel</button>
                <button onClick={handleSave} disabled={loading} className="btn-primary text-sm flex items-center gap-2">
                  {loading && <FiLoader className="animate-spin" />} Save Changes
                </button>
              </div>
            </div>
          ) : (
            user?.bio && <p className="mt-6 text-gray-600 dark:text-gray-300 leading-relaxed">{user.bio}</p>
          )}
        </div>
      </motion.div>

      {/* Badges */}
      <div className="card p-6">
        <h2 className="font-semibold text-lg mb-4">Badges & Achievements</h2>
        {user?.badges?.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {user.badges.map((b, i) => (
              <div key={i} className="text-center p-3 rounded-xl bg-gray-50 dark:bg-dark-hover hover:scale-105 transition-transform">
                <div className="text-3xl mb-1">{b.icon}</div>
                <p className="text-xs font-medium">{b.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No badges yet. Keep contributing to unlock them!</p>
        )}
      </div>
    </div>
  );
}
