import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiSearch, FiBell } from 'react-icons/fi';
import ThemeToggle from '../common/ThemeToggle';
import NotificationsDropdown from './NotificationsDropdown';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    fetchUnread();
    const id = setInterval(fetchUnread, 30000);
    return () => clearInterval(id);
  }, []);

  const fetchUnread = async () => {
    try {
      const { data } = await api.get('/notifications');
      setUnread(data.unreadCount || 0);
    } catch {}
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/notes?search=${encodeURIComponent(search)}`);
  };

  return (
    <header className="sticky top-0 z-30 glass-nav h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
      <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover">
        <FiMenu className="w-6 h-6" />
      </button>

      <form onSubmit={onSubmit} className="hidden sm:flex flex-1 max-w-md relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes, subjects..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-dark-hover border border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-dark-card outline-none text-sm transition-all"
        />
      </form>

      <div className="flex items-center gap-2 ml-auto">
        <ThemeToggle />
        <div className="relative">
          <button
            onClick={() => setShowNotifs((v) => !v)}
            className="relative w-10 h-10 rounded-xl bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border flex items-center justify-center hover:border-primary-500/50"
          >
            <FiBell className="w-5 h-5" />
            {unread > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
              >
                {unread > 9 ? '9+' : unread}
              </motion.span>
            )}
          </button>
          <AnimatePresence>
            {showNotifs && (
              <NotificationsDropdown onClose={() => setShowNotifs(false)} onRead={fetchUnread} />
            )}
          </AnimatePresence>
        </div>

        <Link to="/profile" className="hidden sm:block">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold overflow-hidden">
            {user?.avatar?.url ? (
              <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.[0]?.toUpperCase()
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}
