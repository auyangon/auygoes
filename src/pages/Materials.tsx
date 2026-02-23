import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { FolderOpen, Upload, FileText, BookOpen } from 'lucide-react';
import { GlassCard, SectionTitle } from '../components/Common';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function Materials() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      className="space-y-6"
    >
      <motion.div variants={fadeUp}>
        <SectionTitle subtitle="Access your course materials">Study Materials</SectionTitle>
      </motion.div>

      <motion.div variants={fadeUp}>
        <GlassCard className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mb-6">
            <FolderOpen className="w-10 h-10 text-emerald-400/60" />
          </div>
          <h3 className="text-lg font-semibold text-white/80 mb-2">No Materials Yet</h3>
          <p className="text-sm text-white/40 max-w-md leading-relaxed">
            Study materials will appear here once uploaded by your instructors.
            Check back soon or visit your Google Classroom links for the latest resources.
          </p>
        </GlassCard>
      </motion.div>

      {/* Quick links */}
      <motion.div variants={fadeUp}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: FileText, label: 'Lecture Notes', desc: 'Coming soon' },
            { icon: BookOpen, label: 'Textbooks', desc: 'Coming soon' },
            { icon: Upload, label: 'Assignments', desc: 'Coming soon' },
          ].map((item) => (
            <GlassCard key={item.label} className="p-5 flex items-center gap-4 opacity-50" hover={false}>
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-white/40" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/60">{item.label}</p>
                <p className="text-xs text-white/30">{item.desc}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
