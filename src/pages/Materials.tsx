import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiDownload, HiPlay, HiDocument, HiPresentationChartBar,
  HiClipboardList, HiExternalLink, HiSearch, HiCollection,
} from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { useData } from '../context/DataContext';
import type { Material } from '../context/DataContext';

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };
const stagger = { animate: { transition: { staggerChildren: 0.05 } } };

const TYPE_CONFIG = {
  PDF:        { icon: HiDocument,             color: '#ef4444', bg: 'rgba(239,68,68,0.10)',   label: 'PDF' },
  Video:      { icon: HiPlay,                 color: '#0891b2', bg: 'rgba(8,145,178,0.10)',   label: 'Video' },
  Slides:     { icon: HiPresentationChartBar, color: '#0d9488', bg: 'rgba(13,148,136,0.10)', label: 'Slides' },
  Assignment: { icon: HiClipboardList,        color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', label: 'Assignment' },
  Link:       { icon: HiExternalLink,         color: '#10b981', bg: 'rgba(16,185,129,0.10)', label: 'Link' },
};

function MaterialCard({ material, delay }: { material: Material; delay: number }) {
  const cfg = TYPE_CONFIG[material.type];
  const Icon = cfg.icon;

  const handleDownload = () => {
    toast.success(`Downloading "${material.title}"`, { icon: '⬇️' });
  };

  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay, duration: 0.35 }}
      whileHover={{ y: -2 }}
      className="glass-card rounded-2xl p-4 flex items-center gap-4 cursor-default"
    >
      {/* Type icon */}
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: cfg.bg, border: `1px solid ${cfg.color}25` }}>
        <Icon className="text-xl" style={{ color: cfg.color } as React.CSSProperties} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate mb-0.5" style={{ color: '#1a2e2a' }}>{material.title}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
            style={{ background: 'rgba(20,184,166,0.09)', color: '#0d9488' }}>
            {material.courseName.split(' ').slice(0, 2).join(' ')}
          </span>
          <span className="text-xs" style={{ color: '#d1d5db' }}>·</span>
          <span className="text-xs" style={{ color: '#9ca3af' }}>{material.instructor}</span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex-shrink-0 flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end gap-0.5">
          <span className="text-xs px-2.5 py-1 rounded-lg font-semibold"
            style={{ background: cfg.bg, color: cfg.color }}>
            {cfg.label}
          </span>
          <span className="text-[10px]" style={{ color: '#d1d5db' }}>{material.size}</span>
          <span className="text-[10px]" style={{ color: '#d1d5db' }}>{material.uploadedAt}</span>
        </div>
        <motion.button
          onClick={handleDownload}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-xl transition-colors hover:scale-105"
          style={{ background: 'rgba(20,184,166,0.09)', color: '#0d9488' }}
        >
          {material.type === 'Link' ? <HiExternalLink className="text-base" /> : <HiDownload className="text-base" />}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function Materials() {
  const { materials, isLoading } = useData();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<Material['type'] | 'all'>('all');

  const filtered = materials.filter(m => {
    const matchType = typeFilter === 'all' || m.type === typeFilter;
    const matchSearch = !search || m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.courseName.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  // Group by course
  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, m) => {
    if (!acc[m.courseName]) acc[m.courseName] = [];
    acc[m.courseName].push(m);
    return acc;
  }, {});

  const types: (Material['type'] | 'all')[] = ['all', 'PDF', 'Video', 'Slides', 'Assignment', 'Link'];

  return (
    <motion.div
      initial="initial" animate="animate" variants={stagger}
      className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="glass-card rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[60px] pointer-events-none"
          style={{ background: 'rgba(167,243,208,0.40)' }} />
        <div className="relative flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(236,72,153,0.12)' }}>
                <HiCollection className="text-base" style={{ color: '#ec4899' }} />
              </div>
            </div>
            <h1 className="font-bold text-2xl mb-1" style={{ color: '#1a2e2a' }}>Course Materials</h1>
            <p className="text-sm" style={{ color: '#9ca3af' }}>{materials.length} files across all courses</p>
          </div>
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
              style={{ color: '#5eead4' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search materials…"
              className="input-glass w-full pl-9 pr-4 py-2.5 rounded-2xl text-sm"
            />
          </div>
        </div>
      </motion.div>

      {/* Type filter */}
      <motion.div variants={fadeUp} className="flex items-center gap-2 flex-wrap">
        {types.map(t => (
          <motion.button
            key={t}
            onClick={() => setTypeFilter(t)}
            whileTap={{ scale: 0.97 }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200"
            style={
              typeFilter === t
                ? { background: 'linear-gradient(135deg,#14b8a6,#0d9488)', color: '#fff', boxShadow: '0 4px 16px rgba(20,184,166,0.28)' }
                : { background: 'rgba(255,255,255,0.78)', color: '#6b7280', border: '1px solid rgba(20,184,166,0.12)' }
            }
          >
            {t === 'all' ? 'All Types' : t}
          </motion.button>
        ))}
        <span className="ml-auto text-xs" style={{ color: '#5eead4' }}>{filtered.length} files</span>
      </motion.div>

      {/* Grouped list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array(8).fill(0).map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="glass-card rounded-3xl p-10 text-center">
          <HiSearch className="text-4xl mx-auto mb-3" style={{ color: '#5eead4' }} />
          <p className="font-semibold" style={{ color: '#9ca3af' }}>No materials match your search.</p>
        </div>
      ) : (
        <motion.div variants={stagger} className="space-y-6">
          {Object.entries(grouped).map(([course, items], gi) => (
            <motion.div key={course} variants={fadeUp}>
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="flex-1 h-px" style={{ background: 'rgba(20,184,166,0.10)' }} />
                <span className="text-[11px] font-semibold px-3" style={{ color: '#14b8a6' }}>{course}</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(20,184,166,0.10)' }} />
              </div>
              <div className="space-y-2.5">
                {items.map((m, i) => (
                  <MaterialCard key={m.id} material={m} delay={gi * 0.05 + i * 0.04} />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
