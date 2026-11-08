import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, color, trend }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card p-5 relative overflow-hidden"
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${color} opacity-10 blur-2xl`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</p>
          <p className="text-2xl md:text-3xl font-bold mt-2">{value}</p>
          {trend && <p className="text-xs text-green-500 mt-2 font-medium">{trend}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
