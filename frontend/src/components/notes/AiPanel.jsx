import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiHelpCircle, FiList, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function AiPanel({ note, onUpdate }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [loading, setLoading] = useState(false);

  const generate = async (type) => {
    setLoading(true);
    try {
      const { data } = await api.post(`/ai/${type}/${note._id}`);
      const updated = { ...note };
      if (type === 'summary') updated.aiSummary = data.summary;
      if (type === 'quiz') updated.aiQuiz = data.quiz;
      if (type === 'important-questions') updated.importantQuestions = data.questions;
      onUpdate(updated);
      toast.success('AI content generated!');
    } catch {
      toast.error('Failed to generate AI content');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'summary', label: 'AI Summary', icon: FiZap, action: 'summary' },
    { key: 'quiz', label: 'Quiz', icon: FiHelpCircle, action: 'quiz' },
    { key: 'questions', label: 'Important Questions', icon: FiList, action: 'important-questions' },
  ];

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
          <FiZap className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-semibold">AI Tools</h3>
          <p className="text-xs text-gray-500">Powered by intelligent text analysis</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4 border-b border-gray-100 dark:border-dark-border overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === t.key
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-[120px]">
        {activeTab === 'summary' && (
          note.aiSummary ? (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{note.aiSummary}</p>
          ) : (
            <Empty onGenerate={() => generate('summary')} loading={loading} label="Generate AI Summary" />
          )
        )}

        {activeTab === 'quiz' && (
          note.aiQuiz?.length > 0 ? (
            <div className="space-y-4">
              {note.aiQuiz.map((q, i) => (
                <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-dark-hover">
                  <p className="font-medium mb-2">Q{i + 1}. {q.question}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((o, idx) => (
                      <div key={idx} className="px-3 py-2 rounded-lg bg-white dark:bg-dark-card text-sm">{o}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty onGenerate={() => generate('quiz')} loading={loading} label="Generate Quiz" />
          )
        )}

        {activeTab === 'questions' && (
          note.importantQuestions?.length > 0 ? (
            <ul className="space-y-2">
              {note.importantQuestions.map((q, i) => (
                <li key={i} className="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-hover">
                  <span className="text-primary-500 font-bold">{i + 1}.</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          ) : (
            <Empty onGenerate={() => generate('important-questions')} loading={loading} label="Extract Questions" />
          )
        )}
      </motion.div>
    </div>
  );
}

function Empty({ onGenerate, loading, label }) {
  return (
    <div className="text-center py-6">
      <p className="text-sm text-gray-500 mb-4">Nothing generated yet. Try it out!</p>
      <button onClick={onGenerate} disabled={loading} className="btn-primary inline-flex items-center gap-2">
        {loading ? <FiLoader className="animate-spin" /> : <FiZap />} {label}
      </button>
    </div>
  );
}
