import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUpload, FiTrash2, FiEdit } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../utils/api';
import NoteCard from '../components/notes/NoteCard';
import SkeletonCard from '../components/common/SkeletonCard';

export default function MyUploads() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    try {
      const { data } = await api.get('/notes/user/my-notes');
      setNotes(data.notes || []);
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure? This will permanently remove the note.')) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter((n) => n._id !== id));
      toast.success('Note deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">My Uploads</h1>
          <p className="text-gray-500 mt-1">Manage all the notes you've shared</p>
        </div>
        <Link to="/upload" className="btn-primary flex items-center gap-2">
          <FiUpload /> New Upload
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
        ) : notes.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div className="text-6xl mb-4">📤</div>
            <h3 className="text-lg font-semibold">No uploads yet</h3>
            <p className="text-gray-500 text-sm mt-1 mb-4">Start contributing by uploading your first note</p>
            <Link to="/upload" className="btn-primary inline-flex items-center gap-2">
              <FiUpload /> Upload Now
            </Link>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="relative group">
              <NoteCard note={note} />
              <button
                onClick={() => handleDelete(note._id)}
                className="absolute top-2 right-2 z-10 p-2 rounded-lg bg-red-500/90 text-white opacity-0 group-hover:opacity-100 hover:scale-105 transition-all"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
