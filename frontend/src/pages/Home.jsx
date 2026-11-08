import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiZap,
  FiCloud,
  FiUsers,
  FiShield,
  FiTrendingUp,
  FiAward,
  FiArrowRight,
  FiStar,
} from 'react-icons/fi';

const features = [
  { icon: FiCloud, title: 'Smart Cloud Storage', desc: 'Upload and organize PDFs, DOCs and images with one click. Always available, anywhere.' },
  { icon: FiZap, title: 'AI Summaries', desc: 'Generate concise AI summaries, quizzes and important questions from any note.' },
  { icon: FiUsers, title: 'Community Driven', desc: 'Learn together — rate, comment and collaborate with thousands of students.' },
  { icon: FiShield, title: 'Verified Content', desc: 'Admin-moderated platform keeps notes high quality and spam free.' },
  { icon: FiTrendingUp, title: 'Smart Discovery', desc: 'Powerful search and filters by subject, semester, branch, and category.' },
  { icon: FiAward, title: 'Earn Rewards', desc: 'Badges, points and leaderboard for top contributors. Show off your impact.' },
];

const testimonials = [
  { name: 'Jagriti Yadav', role: 'CSE, 8th Sem', text: 'Best place to find quality notes. The AI summary saves me hours before exams!' },
  { name: 'Jyoti Parmar', role: 'CSE, 8th Sem', text: 'Love the clean UI and how easy it is to find branch-specific PYQs.' },
  { name: 'Garima Namdev', role: 'CSE, 8th Sem', text: 'The leaderboard motivates me to upload more. Got 5 badges already!' },
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative pt-20 pb-32 px-4">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-500/20 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent-500/20 blur-3xl"
          />
        </div>

        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge bg-primary-500/10 text-primary-600 dark:text-primary-300 border border-primary-500/20 mb-6">
              ✨ AI-Powered Learning Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight tracking-tight"
          >
            Share. Discover. <br />
            <span className="gradient-text animate-gradient">Ace your exams.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            The modern hub for students to share exam notes, get AI summaries, and learn faster than ever.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/signup" className="btn-primary flex items-center justify-center gap-2 group">
              Start for Free <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/notes" className="btn-secondary">Explore Notes</Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 grid grid-cols-3 gap-4 max-w-2xl mx-auto"
          >
            {[['10K+', 'Notes'], ['5K+', 'Students'], ['50K+', 'Downloads']].map(([n, l]) => (
              <div key={l} className="glass-card rounded-2xl p-4">
                <p className="text-2xl md:text-3xl font-bold gradient-text">{n}</p>
                <p className="text-xs md:text-sm text-gray-500 mt-1">{l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-4 bg-gray-50/50 dark:bg-dark-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold">Everything you need to excel</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features designed by students, for students.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -6 }}
                className="glass-card p-6 rounded-2xl"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-4 shadow-lg shadow-primary-500/20">
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-center mb-12">Loved by students worldwide</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 rounded-2xl"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, idx) => <FiStar key={idx} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto glass-card rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Ready to ace your exams?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
              Join thousands of students already learning smarter with AI-powered notes.
            </p>
            <Link to="/signup" className="btn-primary inline-flex items-center gap-2 group">
              Get Started Free <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
