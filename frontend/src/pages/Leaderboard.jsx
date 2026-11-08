import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiAward } from 'react-icons/fi';
import api from '../utils/api';

const medals = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/leaderboard').then((r) => setUsers(r.data.users || [])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold flex items-center justify-center gap-2">
          <FiAward className="text-yellow-500" /> Leaderboard
        </h1>
        <p className="text-gray-500 mt-1">Top contributors of Smart Notes</p>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          [...Array(5)].map((_, i) => <div key={i} className="p-4"><div className="skeleton h-12" /></div>)
        ) : users.length === 0 ? (
          <p className="text-center py-12 text-gray-500">No data yet</p>
        ) : (
          users.map((u, i) => (
            <motion.div
              key={u._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-4 p-4 border-b border-gray-100 dark:border-dark-border last:border-0 hover:bg-gray-50 dark:hover:bg-dark-hover ${
                i < 3 ? 'bg-gradient-to-r from-yellow-50/40 to-transparent dark:from-yellow-500/5' : ''
              }`}
            >
              <div className="text-2xl w-10 text-center font-bold text-gray-400">
                {medals[i] || `#${i + 1}`}
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                {u.avatar?.url ? (
                  <img src={u.avatar.url} alt={u.name} className="w-full h-full object-cover" />
                ) : u.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{u.name}</p>
                <p className="text-xs text-gray-500 truncate">{u.college || '—'}</p>
              </div>
              <div className="text-right">
                <p className="font-bold gradient-text text-lg">{u.points}</p>
                <p className="text-xs text-gray-500">{u.badges?.length || 0} badges</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
