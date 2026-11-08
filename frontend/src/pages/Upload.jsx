import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiFile, FiX, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { BRANCHES, SEMESTERS, CATEGORIES } from '../utils/constants';

export default function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', subject: '', branch: 'CSE', semester: 1, category: 'Lecture Notes', tags: '',
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    onDrop: (accepted) => accepted[0] && setFile(accepted[0]),
    onDropRejected: () => toast.error('Invalid file. Max 10MB, PDF/DOC/Image only.'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a file');

    setLoading(true);
    const data = new FormData();
    data.append('file', file);
    Object.entries(form).forEach(([k, v]) => data.append(k, v));

    try {
      const { data: res } = await api.post('/notes', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Note uploaded successfully! 🎉');
      navigate(`/notes/${res.note._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Upload Note</h1>
        <p className="text-gray-500 mt-1">Share your knowledge with the community</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
            isDragActive ? 'border-primary-500 bg-primary-500/5' : 'border-gray-300 dark:border-dark-border hover:border-primary-500/50'
          }`}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FiFile className="w-10 h-10 text-primary-500" />
              <div className="text-left">
                <p className="font-medium">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="ml-2 p-2 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg">
                <FiX />
              </button>
            </div>
          ) : (
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <FiUploadCloud className="w-12 h-12 text-primary-500 mx-auto mb-3" />
              <p className="font-semibold">Drag & drop your file here</p>
              <p className="text-sm text-gray-500 mt-1">or click to browse (PDF, DOC, Image — max 10MB)</p>
            </motion.div>
          )}
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1.5">Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Data Structures Complete Notes"
              className="input-field"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1.5">Description *</label>
            <textarea
              required rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe what's covered in your notes..."
              className="input-field resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Subject *</label>
            <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. DBMS" className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Branch *</label>
            <select value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} className="input-field">
              {BRANCHES.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Semester *</label>
            <select value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} className="input-field">
              {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Category *</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1.5">Tags (comma separated)</label>
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="algorithms, sorting, trees" className="input-field" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
          {loading && <FiLoader className="animate-spin" />} Upload Note
        </button>
      </form>
    </div>
  );
}
