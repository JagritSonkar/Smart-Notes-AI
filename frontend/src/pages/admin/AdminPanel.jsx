import { Routes, Route, NavLink } from 'react-router-dom';
import { FiBarChart2, FiUsers, FiFileText } from 'react-icons/fi';
import AdminOverview from './AdminOverview';
import AdminUsers from './AdminUsers';
import AdminNotes from './AdminNotes';

const tabs = [
  { to: '/admin', label: 'Overview', icon: FiBarChart2, end: true },
  { to: '/admin/users', label: 'Users', icon: FiUsers },
  { to: '/admin/notes', label: 'Notes', icon: FiFileText },
];

export default function AdminPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Admin Panel 🛡️</h1>
        <p className="text-gray-500 mt-1">Manage users, content and analytics</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-dark-border overflow-x-auto">
        {tabs.map((t) => (
          <NavLink
            key={t.to} to={t.to} end={t.end}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                isActive ? 'border-primary-500 text-primary-500' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`
            }
          >
            <t.icon /> {t.label}
          </NavLink>
        ))}
      </div>

      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="notes" element={<AdminNotes />} />
      </Routes>
    </div>
  );
}
