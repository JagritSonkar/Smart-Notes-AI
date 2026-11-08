import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiDownload, FiStar, FiEye, FiFileText } from 'react-icons/fi';

export default function NoteCard({ note }) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.2 }}>
      <Link to={`/notes/${note._id}`} className="block card overflow-hidden group">
        <div className="aspect-[4/3] bg-gradient-to-br from-primary-500/20 via-accent-500/20 to-pink-500/20 relative flex items-center justify-center">
          <FiFileText className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform" />
          <span className="absolute top-3 right-3 badge bg-black/40 backdrop-blur-sm text-white border border-white/20">
            {note.category}
          </span>
          <span className="absolute top-3 left-3 badge bg-white/10 backdrop-blur-sm text-white border border-white/20">
            {note.branch}
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary-500 transition-colors">{note.title}</h3>
          <p className="text-xs text-gray-500 mt-1">{note.subject} • Sem {note.semester}</p>

          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><FiDownload className="w-3 h-3" /> {note.downloads || 0}</span>
              <span className="flex items-center gap-1"><FiEye className="w-3 h-3" /> {note.views || 0}</span>
            </div>
            <span className="flex items-center gap-1">
              <FiStar className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {note.averageRating || '—'}
            </span>
          </div>

          {note.uploadedBy && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-dark-border">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                {note.uploadedBy.avatar?.url ? (
                  <img src={note.uploadedBy.avatar.url} alt="" className="w-6 h-6 rounded-full" />
                ) : (
                  note.uploadedBy.name?.[0]
                )}
              </div>
              <span className="text-xs text-gray-500 truncate">{note.uploadedBy.name}</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
