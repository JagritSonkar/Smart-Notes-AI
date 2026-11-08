import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiFileText, FiDownload, FiEye } from 'react-icons/fi';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import api from '../../utils/api';
import StatCard from '../../components/dashboard/StatCard';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#84cc16'];

export default function AdminOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/overview').then((r) => setData(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32" />)}</div>;

  const { overview, topSubjects, notesByBranch, notesByCategory, uploadsOverTime, usersOverTime } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={FiUsers} label="Total Users" value={overview.totalUsers} color="from-primary-500 to-primary-600" trend={`${overview.activeUsers} active`} />
        <StatCard icon={FiFileText} label="Total Notes" value={overview.totalNotes} color="from-accent-500 to-accent-600" />
        <StatCard icon={FiDownload} label="Downloads" value={overview.totalDownloads} color="from-pink-500 to-pink-600" />
        <StatCard icon={FiEye} label="Views" value={overview.totalViews} color="from-amber-500 to-orange-500" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
          <h3 className="font-semibold mb-1">Uploads Over Time</h3>
          <p className="text-xs text-gray-500 mb-4">Last 30 days</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={uploadsOverTime.map(d => ({ date: d._id.slice(5), count: d.count }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'rgba(20,20,30,0.95)', border: '1px solid #2a2a3a', borderRadius: 12 }} />
              <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
          <h3 className="font-semibold mb-1">New Users</h3>
          <p className="text-xs text-gray-500 mb-4">Last 30 days</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={usersOverTime.map(d => ({ date: d._id.slice(5), count: d.count }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'rgba(20,20,30,0.95)', border: '1px solid #2a2a3a', borderRadius: 12 }} />
              <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <h3 className="font-semibold mb-4">Top Subjects</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topSubjects.map(s => ({ name: s._id, downloads: s.downloads }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'rgba(20,20,30,0.95)', border: '1px solid #2a2a3a', borderRadius: 12 }} />
              <Bar dataKey="downloads" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold mb-4">By Branch</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={notesByBranch.map(b => ({ name: b._id, value: b.count }))} dataKey="value" nameKey="name" outerRadius={90}>
                {notesByBranch.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'rgba(20,20,30,0.95)', border: '1px solid #2a2a3a', borderRadius: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
