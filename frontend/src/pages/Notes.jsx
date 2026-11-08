import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import api from '../utils/api';
import NoteCard from '../components/notes/NoteCard';
import SkeletonCard from '../components/common/SkeletonCard';
import { BRANCHES, SEMESTERS, CATEGORIES, SORT_OPTIONS } from '../utils/constants';

export default function Notes() {
  const [params, setParams] = useSearchParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState(params.get('search') || '');
  const [filters, setFilters] = useState({
    branch: params.get('branch') || '',
    semester: params.get('semester') || '',
    category: params.get('category') || '',
    sort: params.get('sort') || 'latest',
  });

  useEffect(() => {
    fetchNotes();
  }, [params]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (params.get('search')) query.set('search', params.get('search'));
      ['branch', 'semester', 'category', 'sort'].forEach((k) => {
        if (params.get(k)) query.set(k, params.get(k));
      });
      const { data } = await api.get(`/notes?${query.toString()}`);
      setNotes(data.notes || []);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const newParams = {};
    if (search) newParams.search = search;
    Object.entries(filters).forEach(([k, v]) => { if (v) newParams[k] = v; });
    setParams(newParams);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSearch('');
    setFilters({ branch: '', semester: '', category: '', sort: 'latest' });
    setParams({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Browse Notes</h1>
        <p className="text-gray-500 mt-1">Discover quality notes shared by students worldwide</p>
      </div>

      {/* Search bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            placeholder="Search by title, subject, tags..."
            className="input-field pl-12"
          />
        </div>
        <button onClick={() => setShowFilters((v) => !v)} className="btn-secondary flex items-center gap-2">
          <FiFilter /> <span className="hidden sm:inline">Filters</span>
        </button>
        <button onClick={applyFilters} className="btn-primary">Search</button>
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="card p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <select value={filters.branch} onChange={(e) => setFilters({ ...filters, branch: e.target.value })} className="input-field">
              <option value="">All Branches</option>
              {BRANCHES.map((b) => <option key={b}>{b}</option>)}
            </select>
            <select value={filters.semester} onChange={(e) => setFilters({ ...filters, semester: e.target.value })} className="input-field">
              <option value="">All Semesters</option>
              {SEMESTERS.map((s) => <option key={s} value={s}>Sem {s}</option>)}
            </select>
            <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="input-field">
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })} className="input-field">
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={clearFilters} className="btn-ghost text-sm flex items-center gap-1">
              <FiX /> Clear all
            </button>
            <button onClick={applyFilters} className="btn-primary text-sm py-2 px-4">Apply</button>
          </div>
        </motion.div>
      )}

      {/* Results */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
        ) : notes.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-semibold">No notes found</h3>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or search query</p>
          </div>
        ) : (
          notes.map((note) => <NoteCard key={note._id} note={note} />)
        )}
      </div>
    </div>
  );
}
