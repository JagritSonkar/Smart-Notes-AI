import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiUpload, FiDownload, FiEye, FiBookmark, FiAward, FiTrendingUp, FiFileText, FiArrowRight,
} from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/dashboard/StatCard';
import NoteCard from '../components/notes/NoteCard';
import SkeletonCard from '../components/common/SkeletonCard';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/users/dashboard-stats').then((r) => setStats(r.data.stats)),
      api.get('/users/recent').then((r) => setRecent((r.data.notes || []).slice(0, 4))),
      api.get('/notes?sort=popular&limit=4').then((r) => setPopular(r.data.notes || [])),
    ]).finally(() => setLoading(false));
  }, []);

  const subjectData = popular.slice(0, 5).map((n) => ({ name: n.subject, downloads: n.downloads }));
  const categoryData = [
    { name: 'Lecture', value: 35 }, { name: 'PYQ', value: 28 },
    { name: 'Lab', value: 15 }, { name: 'Assignment', value: 12 }, { name: 'Other', value: 10 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your notes today.</p>
        </div>
        <Link to="/upload" className="btn-primary flex items-center gap-2">
          <FiUpload /> Upload Note
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={FiFileText} label="My Uploads" value={stats?.uploads ?? '...'} color="from-primary-500 to-primary-600" trend="+12%" />
        <StatCard icon={FiDownload} label="Total Downloads" value={stats?.totalDownloads ?? '...'} color="from-accent-500 to-accent-600" trend="+24%" />
        <StatCard icon={FiEye} label="Total Views" value={stats?.totalViews ?? '...'} color="from-pink-500 to-pink-600" trend="+8%" />
        <StatCard icon={FiAward} label="Points" value={stats?.points ?? '...'} color="from-amber-500 to-orange-500" trend={`${stats?.badges || 0} badges`} />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-lg">Top Subjects by Downloads</h3>
              <p className="text-sm text-gray-500">Most popular content this month</p>
            </div>
            <FiTrendingUp className="w-5 h-5 text-primary-500" />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={subjectData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip contentStyle={{ background: 'rgba(20,20,30,0.95)', border: '1px solid #2a2a3a', borderRadius: 12 }} />
              <Bar dataKey="downloads" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
          <h3 className="font-semibold text-lg mb-1">By Category</h3>
          <p className="text-sm text-gray-500 mb-4">Distribution across categories</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={4}>
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'rgba(20,20,30,0.95)', border: '1px solid #2a2a3a', borderRadius: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recently viewed */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl font-bold">Recently Viewed</h2>
          <Link to="/notes" className="text-sm text-primary-500 flex items-center gap-1 hover:underline">
            View all <FiArrowRight />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            : recent.length === 0
            ? <p className="col-span-full text-gray-500 text-sm">No notes viewed yet. <Link to="/notes" className="text-primary-500 hover:underline">Browse notes</Link></p>
            : recent.map(({ note }) => note && <NoteCard key={note._id} note={note} />)}
        </div>
      </section>

      {/* Popular */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl font-bold">Trending Now 🔥</h2>
          <Link to="/notes?sort=popular" className="text-sm text-primary-500 flex items-center gap-1 hover:underline">
            View all <FiArrowRight />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            : popular.map((note) => <NoteCard key={note._id} note={note} />)}
        </div>
      </section>
    </div>
  );
}
