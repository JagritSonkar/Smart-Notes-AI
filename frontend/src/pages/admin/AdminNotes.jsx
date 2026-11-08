import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiFlag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function AdminNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flaggedOnly, setFlaggedOnly] = useState(false);

  useEffect(() => { fetchNotes(); }, [flaggedOnly]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/notes${flaggedOnly ? '?flagged=true' : ''}`);
      setNotes(data.notes || []);
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this note?')) return;
    await api.delete(`/admin/notes/${id}`);
    setNotes(notes.filter((n) => n._id !== id));
    toast.success('Note deleted');
  };

  const handleFlag = async (id) => {
    const reason = prompt('Reason for flagging (optional):') || '';
    const { data } = await api.put(`/admin/notes/${id}/flag`, { reason });
    setNotes(notes.map((n) => (n._id === id ? data.note : n)));
    toast.success('Note flagged');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFlaggedOnly(false)}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${!flaggedOnly ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-dark-hover'}`}
        >
          All Notes
        </button>
        <button
          onClick={() => setFlaggedOnly(true)}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${flaggedOnly ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-dark-hover'}`}
        >
          Flagged Only
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-hover text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Author</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Subject</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-6"><div className="skeleton h-16" /></td></tr>
              ) : notes.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-sm text-gray-500">No notes found</td></tr>
              ) : notes.map((n) => (
                <tr key={n._id} className="border-t border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-hover">
                  <td className="px-4 py-3">
                    <Link to={`/notes/${n._id}`} className="font-medium text-sm hover:text-primary-500 line-clamp-1">{n.title}</Link>
                    <p className="text-xs text-gray-500">{n.branch} • Sem {n.semester}</p>
                  </td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">{n.uploadedBy?.name}</td>
                  <td className="px-4 py-3 text-sm hidden sm:table-cell">{n.subject}</td>
                  <td className="px-4 py-3">
                    {n.isFlagged ? (
                      <span className="badge bg-red-500/10 text-red-500">Flagged</span>
                    ) : (
                      <span className="badge bg-green-500/10 text-green-500">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button onClick={() => handleFlag(n._id)} className="p-2 rounded-lg hover:bg-amber-500/10 text-amber-500"><FiFlag /></button>
                      <button onClick={() => handleDelete(n._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500"><FiTrash2 /></button>
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
