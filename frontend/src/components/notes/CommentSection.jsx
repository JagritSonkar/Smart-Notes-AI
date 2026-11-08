import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiMessageCircle, FiHeart, FiTrash2 } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function CommentSection({ noteId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchComments(); }, [noteId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/comments/note/${noteId}`);
      setComments(data.comments || []);
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const { data } = await api.post(`/comments/note/${noteId}`, { text });
      setComments([data.comment, ...comments]);
      setText('');
      toast.success('Comment posted');
    } catch {
      toast.error('Failed to post comment');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this comment?')) return;
    await api.delete(`/comments/${id}`);
    setComments(comments.filter((c) => c._id !== id));
  };

  const handleLike = async (id) => {
    const { data } = await api.put(`/comments/${id}/like`);
    setComments(comments.map((c) => c._id === id ? { ...c, likes: Array(data.likes).fill(0) } : c));
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-6">
        <FiMessageCircle className="w-5 h-5 text-primary-500" />
        <h3 className="font-semibold text-lg">Comments ({comments.length})</h3>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="input-field flex-1"
        />
        <button type="submit" className="btn-primary px-4"><FiSend /></button>
      </form>

      <div className="space-y-4">
        {loading ? (
          [...Array(2)].map((_, i) => <div key={i} className="skeleton h-20" />)
        ) : comments.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-8">No comments yet. Be the first!</p>
        ) : (
          comments.map((c) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 p-4 rounded-xl bg-gray-50 dark:bg-dark-hover"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {c.user?.avatar?.url ? (
                  <img src={c.user.avatar.url} alt="" className="w-9 h-9 rounded-full" />
                ) : c.user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-sm">{c.user?.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  {c.user?._id === user?.id && (
                    <button onClick={() => handleDelete(c._id)} className="text-gray-400 hover:text-red-500">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{c.text}</p>
                <button onClick={() => handleLike(c._id)} className="mt-2 flex items-center gap-1 text-xs text-gray-500 hover:text-red-500">
                  <FiHeart className="w-3.5 h-3.5" /> {c.likes?.length || 0}
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
