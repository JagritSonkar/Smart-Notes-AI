import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiFileText,
  FiUpload,
  FiBookmark,
  FiUser,
  FiAward,
  FiX,
  FiBookOpen,
  FiLayers,
  FiShield,
  FiLogOut,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/notes', label: 'Browse Notes', icon: FiFileText },
  { to: '/upload', label: 'Upload', icon: FiUpload },
  { to: '/my-uploads', label: 'My Uploads', icon: FiLayers },
  { to: '/saved', label: 'Saved', icon: FiBookmark },
  { to: '/leaderboard', label: 'Leaderboard', icon: FiAward },
  { to: '/profile', label: 'Profile', icon: FiUser },
];

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-gray-200 dark:border-dark-border">
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30"
          >
            <FiBookOpen className="w-5 h-5 text-white" />
          </motion.div>
          <span className="font-display font-bold text-base gradient-text">Smart Notes</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover">
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <>
            <div className="mt-6 mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Admin
            </div>
            <NavLink
              to="/admin"
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <FiShield className="w-5 h-5" />
              <span>Admin Panel</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200 dark:border-dark-border">
        <div className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-hover">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold flex-shrink-0">
            {user?.avatar?.url ? (
              <img src={user.avatar.url} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              user?.name?.[0]?.toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.points || 0} points</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-sm font-medium"
        >
          <FiLogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
