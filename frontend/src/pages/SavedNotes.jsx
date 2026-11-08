import { useEffect, useState } from 'react';
import api from '../utils/api';
import NoteCard from '../components/notes/NoteCard';
import SkeletonCard from '../components/common/SkeletonCard';

export default function SavedNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/saved').then((r) => setNotes(r.data.notes || [])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Saved Notes</h1>
        <p className="text-gray-500 mt-1">All the notes you've bookmarked for later</p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
        ) : notes.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div className="text-6xl mb-4">🔖</div>
            <h3 className="text-lg font-semibold">No bookmarks yet</h3>
            <p className="text-gray-500 text-sm mt-1">Save notes you want to read later</p>
          </div>
        ) : (
          notes.map((n) => <NoteCard key={n._id} note={n} />)
        )}
      </div>
    </div>
  );
}
