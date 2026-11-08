import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBookOpen } from 'react-icons/fi';
import ThemeToggle from '../components/common/ThemeToggle';
import { useAuth } from '../context/AuthContext';

export default function PublicLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-mesh">
      <nav className="glass-nav sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30"
              >
                <FiBookOpen className="w-5 h-5 text-white" />
              </motion.div>
              <span className="font-display font-bold text-lg gradient-text">Smart Notes</span>
            </Link>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              {user ? (
                <Link to="/dashboard" className="btn-primary text-sm py-2 px-4">
                  Go to Dashboard
                </Link>
              ) : (
                !isAuthPage && (
                  <>
                    <Link to="/login" className="btn-ghost text-sm">
                      Sign in
                    </Link>
                    <Link to="/signup" className="btn-primary text-sm py-2 px-4">
                      Get Started
                    </Link>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
