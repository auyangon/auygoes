import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTrophy, FaStar, FaLock, FaCheckCircle, 
  FaClock, FaFire, FaArrowUp, FaSearch,
  FaFilter, FaPlay, FaGem
} from 'react-icons/fa';
import { useStudentContext } from '../../context/StudentContext';
import { staggerContainer, fadeInUp, badgeAnimation } from '../../utils/animations';

const Quests: React.FC = () => {
  const { quests, stats, updateQuestProgress } = useStudentContext();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['all', 'Academic', 'Event', 'Project', 'Collaboration', 'Exam'];

  const filteredQuests = quests.filter(quest => {
    const matchesCategory = selectedCategory === 'all' || quest.category === selectedCategory;
    const matchesSearch = quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          quest.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#f59e0b';
      case 'available': return '#66c3b7';
      default: return '#6b7280';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'completed': return 'from-[#10b981]/30 to-[#059669]/30';
      case 'in-progress': return 'from-[#f59e0b]/30 to-[#ef4444]/30';
      case 'available': return 'from-[#66c3b7]/30 to-[#2d9a8a]/30';
      default: return 'from-gray-500/30 to-gray-600/30';
    }
  };

  return (
    <motion.div
      {...staggerContainer}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="p-3 bg-gradient-to-br from-[#f59e0b] to-[#ef4444] rounded-2xl">
              <FaTrophy className="text-white text-2xl" />
            </span>
            Quest Center
          </h1>
          <p className="text-white/60 mt-2">Complete quests to earn XP and unlock achievements</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search quests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#66c3b7]/50 transition-all w-64"
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#f59e0b]/30 to-[#ef4444]/30 rounded-2xl p-5 border border-[#f59e0b]/30"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#f59e0b]/30 flex items-center justify-center">
              <FaStar className="text-[#f59e0b] text-xl" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{stats.xp.toLocaleString()}</p>
              <p className="text-white/60 text-sm">Total XP</p>
            </div>
          </div>
        </motion.div>
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-[#66c3b7]/30 to-[#2d9a8a]/30 rounded-2xl p-5 border border-[#66c3b7]/30"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#66c3b7]/30 flex items-center justify-center">
              <FaCheckCircle className="text-[#66c3b7] text-xl" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{stats.completedQuests}</p>
              <p className="text-white/60 text-sm">Quests Done</p>
            </div>
          </div>
        </motion.div>
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#8b5cf6]/30 to-[#6366f1]/30 rounded-2xl p-5 border border-[#8b5cf6]/30"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#8b5cf6]/30 flex items-center justify-center">
              <FaFire className="text-[#8b5cf6] text-xl" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{quests.filter(q => q.status === 'in-progress').length}</p>
              <p className="text-white/60 text-sm">In Progress</p>
            </div>
          </div>
        </motion.div>
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.25 }}
          className="bg-gradient-to-br from-[#06b6d4]/30 to-[#0891b2]/30 rounded-2xl p-5 border border-[#06b6d4]/30"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#06b6d4]/30 flex items-center justify-center">
              <FaArrowUp className="text-[#06b6d4] text-xl" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">Level {stats.level}</p>
              <p className="text-white/60 text-sm">Current Level</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category Filter */}
      <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="flex flex-wrap items-center gap-3">
        <FaFilter className="text-white/60 text-lg" />
        {categories.map((category, index) => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-[#66c3b7] to-[#2d9a8a] text-white shadow-lg shadow-[#66c3b7]/30'
                : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category === 'all' ? '🌟 All Quests' : category}
          </motion.button>
        ))}
      </motion.div>

      {/* XP Progress Bar */}
      <motion.div {...fadeInUp} transition={{ delay: 0.35 }} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <FaGem className="text-[#f59e0b]" />
              XP Progress to Next Level
            </h3>
            <p className="text-white/60 text-sm mt-1">Keep completing quests to level up!</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#66c3b7]">{stats.xp.toLocaleString()} / {(stats.level * 300).toLocaleString()} XP</p>
            <p className="text-white/60 text-sm">Level {stats.level} → Level {stats.level + 1}</p>
          </div>
        </div>
        <div className="h-4 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full rounded-full bg-gradient-to-r from-[#f59e0b] via-[#66c3b7] to-[#2d9a8a]"
            initial={{ width: '0%' }}
            animate={{ width: `${Math.min((stats.xp / (stats.level * 300)) * 100, 100)}%` }}
            transition={{ duration: 2 }}
          />
        </div>
      </motion.div>

      {/* Quests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredQuests.map((quest, index) => (
          <motion.div
            key={quest.id}
            {...fadeInUp}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-500 ${
              quest.status === 'locked' 
                ? 'bg-gray-800/50 border-gray-700/50 opacity-70' 
                : `bg-gradient-to-br ${getStatusBg(quest.status)} backdrop-blur-xl border-white/20 hover:border-[#66c3b7]/50`
            }`}
          >
            {/* Glow Effect */}
            <div 
              className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30"
              style={{ backgroundColor: getStatusColor(quest.status) }}
            />

            {/* Status Badge */}
            <div className="absolute top-4 right-4 z-10">
              <motion.span
                {...badgeAnimation}
                className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  quest.status === 'completed' 
                    ? 'bg-[#10b981] text-white' 
                    : quest.status === 'in-progress' 
                    ? 'bg-[#f59e0b] text-white' 
                    : quest.status === 'available' 
                    ? 'bg-[#66c3b7] text-white' 
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {quest.status === 'completed' && <FaCheckCircle />}
                {quest.status === 'in-progress' && <FaPlay />}
                {quest.status === 'available' && <FaStar />}
                {quest.status === 'locked' && <FaLock />}
                {quest.status.charAt(0).toUpperCase() + quest.status.slice(1)}
              </motion.span>
            </div>

            <div className="p-6">
              {/* Icon & Title */}
              <div className="flex items-start gap-4 mb-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg flex-shrink-0"
                  style={{ backgroundColor: `${getStatusColor(quest.status)}30` }}
                >
                  {quest.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-lg mb-1 truncate">{quest.title}</h3>
                  <span 
                    className="inline-block px-3 py-1 rounded-lg text-xs font-medium"
                    style={{ backgroundColor: `${getStatusColor(quest.status)}30`, color: getStatusColor(quest.status) }}
                  >
                    {quest.category}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-white/70 text-sm mb-5 line-clamp-2">
                {quest.description}
              </p>

              {/* Details */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 text-white/60">
                  <FaClock className="text-[#66c3b7]" />
                  <span className="text-xs">Due: {quest.deadline}</span>
                </div>
                <div className="flex items-center gap-2 bg-[#f59e0b]/20 px-3 py-1.5 rounded-xl">
                  <FaStar className="text-[#f59e0b]" />
                  <span className="text-[#f59e0b] font-bold text-sm">+{quest.xp} XP</span>
                </div>
              </div>

              {/* Progress Bar for in-progress */}
              {quest.status === 'in-progress' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-xs">Progress</span>
                    <span className="text-[#66c3b7] text-xs font-bold">65%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full rounded-full bg-gradient-to-r from-[#f59e0b] to-[#ef4444]"
                      initial={{ width: '0%' }}
                      animate={{ width: '65%' }}
                      transition={{ duration: 1.5 }}
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={quest.status === 'locked'}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  quest.status === 'locked'
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : quest.status === 'completed'
                    ? 'bg-[#10b981]/30 text-[#10b981] border border-[#10b981]/50'
                    : 'bg-gradient-to-r from-[#66c3b7] to-[#2d9a8a] text-white shadow-lg hover:shadow-[#66c3b7]/30'
                }`}
                onClick={() => quest.status === 'available' && updateQuestProgress(quest.id, 50)}
              >
                {quest.status === 'locked' && <FaLock />}
                {quest.status === 'completed' && <FaCheckCircle />}
                {quest.status === 'in-progress' && <FaPlay />}
                {quest.status === 'available' && <FaStar />}
                {quest.status === 'locked' ? 'Locked' : quest.status === 'completed' ? 'Completed!' : quest.status === 'in-progress' ? 'Continue' : 'Start Quest'}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Quests;
