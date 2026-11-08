import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiLoader, FiBookOpen } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { BRANCHES, SEMESTERS } from '../../utils/constants';

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', college: '', branch: 'CSE', semester: 1,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch {} finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8 rounded-3xl"
      >
        <div className="text-center mb-6">
          <h1 className="font-display text-3xl font-bold mb-2">Create your account ✨</h1>
          <p className="text-sm text-gray-500">Join thousands of students learning smarter</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input name="name" type="text" placeholder="Full name" required value={form.name} onChange={handleChange} className="input-field pl-12" />
          </div>

          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input name="email" type="email" placeholder="Email address" required value={form.email} onChange={handleChange} className="input-field pl-12" />
          </div>

          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input name="password" type="password" placeholder="Password (min 6 chars)" required minLength={6} value={form.password} onChange={handleChange} className="input-field pl-12" />
          </div>

          <div className="relative">
            <FiBookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input name="college" type="text" placeholder="College name" value={form.college} onChange={handleChange} className="input-field pl-12" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select name="branch" value={form.branch} onChange={handleChange} className="input-field">
              {BRANCHES.map((b) => <option key={b}>{b}</option>)}
            </select>
            <select name="semester" value={form.semester} onChange={handleChange} className="input-field">
              {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
            {loading && <FiLoader className="animate-spin" />} Create Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-500 font-semibold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
