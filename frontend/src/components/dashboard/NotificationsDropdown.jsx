import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import api from '../../utils/api';

export default function NotificationsDropdown({ onClose, onRead }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await api.get('/notifications');
      setItems(data.notifications || []);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    await api.put('/notifications/read-all');
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    onRead?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="absolute right-0 mt-2 w-80 max-h-[480px] glass-card rounded-2xl overflow-hidden z-50"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-border">
        <h3 className="font-semibold">Notifications</h3>
        <button onClick={markAllRead} className="text-xs text-primary-500 hover:underline flex items-center gap-1">
          <FiCheck className="w-3.5 h-3.5" /> Mark all read
        </button>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-16" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">No notifications yet</div>
        ) : (
          items.map((n) => (
            <Link
              key={n._id}
              to={n.link || '#'}
              onClick={onClose}
              className={`block px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-hover border-b border-gray-100 dark:border-dark-border ${!n.isRead ? 'bg-primary-50/40 dark:bg-primary-500/5' : ''}`}
            >
              <p className="text-sm">{n.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
              </p>
            </Link>
          ))
        )}
      </div>
    </motion.div>
  );
}
