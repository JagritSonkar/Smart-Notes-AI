import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiDownload, FiHeart, FiBookmark, FiShare2, FiStar, FiEye, FiZap, FiHelpCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import NoteCard from '../components/notes/NoteCard';
import CommentSection from '../components/notes/CommentSection';
import PdfPreview from '../components/notes/PdfPreview';
import AiPanel from '../components/notes/AiPanel';

export default function NoteDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [note, setNote] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    Promise.all([
      api.get(`/notes/${id}`).then((r) => {
        setNote(r.data.note);
        const existing = r.data.note.ratings?.find((r) => r.user === user?.id);
        if (existing) setUserRating(existing.rating);
      }),
      api.get(`/notes/${id}/related`).then((r) => setRelated(r.data.notes || [])),
    ]).finally(() => setLoading(false));
  }, [id, user?.id]);

  const handleDownload = async () => {
    try {
      const { data } = await api.get(`/notes/${id}/download`);
      window.open(data.downloadUrl, '_blank');
      toast.success('Download started');
    } catch {
      toast.error('Download failed');
    }
  };

  const handleLike = async () => {
    const { data } = await api.put(`/notes/${id}/like`);
    setNote((n) => ({ ...n, likes: data.liked ? [...n.likes, user.id] : n.likes.filter((u) => u !== user.id) }));
  };

  const handleBookmark = async () => {
    const { data } = await api.put(`/notes/${id}/bookmark`);
    toast.success(data.bookmarked ? 'Bookmarked!' : 'Removed from bookmarks');
  };

  const handleRate = async (rating) => {
    setUserRating(rating);
    const { data } = await api.post(`/notes/${id}/rate`, { rating });
    setNote((n) => ({ ...n, averageRating: data.averageRating }));
    toast.success('Thanks for rating!');
  };

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: note.title, url: window.location.href });
    else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };

  if (loading) return <div className="space-y-4"><div className="skeleton h-64" /><div className="skeleton h-32" /></div>;
  if (!note) return <p className="text-center py-20">Note not found</p>;

  const liked = note.likes?.includes(user?.id);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex gap-2 mb-2 flex-wrap">
              <span className="badge bg-primary-500/10 text-primary-600 dark:text-primary-300">{note.category}</span>
              <span className="badge bg-accent-500/10 text-accent-600 dark:text-accent-300">{note.branch}</span>
              <span className="badge bg-pink-500/10 text-pink-600 dark:text-pink-300">Sem {note.semester}</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">{note.title}</h1>
            <p className="text-gray-500 mt-1">{note.subject}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={handleLike} className={`btn-secondary flex items-center gap-2 ${liked ? 'text-red-500' : ''}`}>
              <FiHeart className={liked ? 'fill-current' : ''} /> {note.likes?.length || 0}
            </button>
            <button onClick={handleBookmark} className="btn-secondary"><FiBookmark /></button>
            <button onClick={handleShare} className="btn-secondary"><FiShare2 /></button>
            <button onClick={handleDownload} className="btn-primary flex items-center gap-2"><FiDownload /> Download</button>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{note.description}</p>

        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
          <span className="flex items-center gap-1"><FiEye /> {note.views} views</span>
          <span className="flex items-center gap-1"><FiDownload /> {note.downloads} downloads</span>
          <span className="flex items-center gap-1">
            <FiStar className="fill-yellow-400 text-yellow-400" /> {note.averageRating || '—'} ({note.ratings?.length || 0})
          </span>
        </div>

        {/* Rate */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-border">
          <p className="text-sm font-medium mb-2">Rate this note:</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => handleRate(n)}>
                <FiStar className={`w-6 h-6 ${n <= userRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} hover:scale-110 transition-transform`} />
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* PDF Preview */}
      {note.file?.url && note.file.format === 'pdf' && <PdfPreview url={note.file.url} />}

      {/* AI Panel */}
      <AiPanel note={note} onUpdate={setNote} />

      {/* Comments */}
      <CommentSection noteId={id} />

      {/* Related */}
      {related.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-bold mb-4">Related Notes</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((n) => <NoteCard key={n._id} note={n} />)}
          </div>
        </section>
      )}
    </div>
  );
}
