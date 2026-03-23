import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaEnvelope, FaPaperPlane, FaClock, FaCheckCircle, 
  FaTimesCircle, FaSpinner, FaPlus, FaFileAlt,
  FaUserGraduate, FaBook, FaBuilding, FaQuestionCircle,
  FaFilter, FaSearch, FaCommentDots
} from 'react-icons/fa';
import { useStudentContext } from '../../context/StudentContext';
import { staggerContainer, fadeInUp, scaleIn } from '../../utils/animations';

const Requests: React.FC = () => {
  const { requests, addRequest } = useStudentContext();
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newRequest, setNewRequest] = useState({
    type: 'Transcript',
    subject: '',
    description: ''
  });

  const requestTypes = [
    { id: 'Transcript', icon: FaFileAlt, label: 'Transcript Request', color: '#66c3b7' },
    { id: 'Enrollment', icon: FaBook, label: 'Course Enrollment', color: '#8b5cf6' },
    { id: 'Leave', icon: FaUserGraduate, label: 'Leave Application', color: '#f59e0b' },
    { id: 'Facility', icon: FaBuilding, label: 'Facility Booking', color: '#ef4444' },
    { id: 'General', icon: FaQuestionCircle, label: 'General Inquiry', color: '#06b6d4' },
  ];

  const filteredRequests = requests.filter(r => 
    filterStatus === 'all' || r.status === filterStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'reviewing': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'approved': return 'from-[#10b981]/30 to-[#059669]/30';
      case 'rejected': return 'from-[#ef4444]/30 to-[#dc2626]/30';
      case 'reviewing': return 'from-[#f59e0b]/30 to-[#d97706]/30';
      default: return 'from-gray-500/30 to-gray-600/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return FaCheckCircle;
      case 'rejected': return FaTimesCircle;
      case 'reviewing': return FaSpinner;
      default: return FaClock;
    }
  };

  const handleSubmit = () => {
    if (newRequest.subject && newRequest.description) {
      addRequest(newRequest);
      setNewRequest({ type: 'Transcript', subject: '', description: '' });
      setShowModal(false);
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
            <span className="p-3 bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] rounded-2xl">
              <FaEnvelope className="text-white text-2xl" />
            </span>
            Request Center
          </h1>
          <p className="text-white/60 mt-2">Submit and track your academic requests</p>
        </div>
        <motion.button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#66c3b7] to-[#2d9a8a] rounded-xl text-white font-semibold shadow-lg shadow-[#66c3b7]/30 hover:shadow-xl hover:shadow-[#66c3b7]/40 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus />
          New Request
        </motion.button>
      </motion.div>

      {/* Quick Actions */}
      <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {requestTypes.map((type, index) => (
          <motion.div
            key={type.id}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 cursor-pointer hover:border-[#66c3b7]/40 transition-all text-center group"
            onClick={() => {
              setNewRequest(prev => ({ ...prev, type: type.id }));
              setShowModal(true);
            }}
          >
            <div 
              className="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{ backgroundColor: `${type.color}30` }}
            >
              <type.icon className="text-2xl" style={{ color: type.color }} />
            </div>
            <p className="text-white font-medium text-sm">{type.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FaFilter className="text-white/60" />
          {['all', 'pending', 'reviewing', 'approved', 'rejected'].map((status) => (
            <motion.button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterStatus === status
                  ? 'bg-[#66c3b7] text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </motion.button>
          ))}
        </div>
        <div className="text-white/60 text-sm">
          Showing <span className="text-[#66c3b7] font-bold">{filteredRequests.length}</span> requests
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request, index) => {
          const StatusIcon = getStatusIcon(request.status);
          const selectedType = requestTypes.find(t => t.id === request.type);
          
          return (
            <motion.div
              key={request.id}
              {...fadeInUp}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 5 }}
              className={`bg-gradient-to-r ${getStatusBg(request.status)} backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:border-[#66c3b7]/40 transition-all`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Icon Section */}
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${selectedType?.color || '#66c3b7'}30` }}
                  >
                    {selectedType ? <selectedType.icon style={{ color: selectedType.color }} /> : <FaEnvelope className="text-[#66c3b7]" />}
                  </div>
                  <div className="hidden md:block">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${getStatusColor(request.status)}30` }}
                    >
                      <StatusIcon className="text-xl" style={{ color: getStatusColor(request.status) }} />
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-white/10 rounded-lg text-white/60 text-xs">
                      {request.type}
                    </span>
                    <span 
                      className="px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5"
                      style={{ backgroundColor: `${getStatusColor(request.status)}30`, color: getStatusColor(request.status) }}
                    >
                      <StatusIcon className="text-xs" />
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">{request.subject}</h3>
                  <p className="text-white/60 text-sm line-clamp-2">{request.description}</p>
                </div>

                {/* Timeline Section */}
                <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-2">
                  <div className="text-right">
                    <p className="text-white/40 text-xs">Submitted</p>
                    <p className="text-white/70 text-sm font-medium">{request.createdAt}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/40 text-xs">Last Update</p>
                    <p className="text-white/70 text-sm font-medium">{request.updatedAt}</p>
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  {['Submitted', 'Under Review', 'In Progress', 'Resolved'].map((step, idx) => {
                    const stepIndex = ['pending', 'reviewing', 'approved'].indexOf(request.status);
                    const isCompleted = stepIndex >= idx || request.status === 'approved';
                    
                    return (
                      <div key={step} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                              isCompleted 
                                ? 'bg-[#66c3b7] border-[#66c3b7] text-white' 
                                : 'bg-transparent border-white/30 text-white/40'
                            }`}
                          >
                            {isCompleted ? <FaCheckCircle /> : idx + 1}
                          </div>
                          <p className={`mt-2 text-xs font-medium ${
                            isCompleted ? 'text-[#66c3b7]' : 'text-white/40'
                          }`}>
                            {step}
                          </p>
                        </div>
                        {idx < 3 && (
                          <div 
                            className={`w-16 md:w-24 h-1 mx-2 rounded-full transition-all duration-500 ${
                              isCompleted ? 'bg-[#66c3b7]' : 'bg-white/10'
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Comments Section */}
              {request.comments && (
                <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#66c3b7]/30 flex items-center justify-center flex-shrink-0">
                      <FaCommentDots className="text-[#66c3b7]" />
                    </div>
                    <div>
                      <p className="text-white/60 text-xs mb-1">Admin Comments</p>
                      <p className="text-white/80 text-sm">{request.comments}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* New Request Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-gradient-to-br from-[#1b5f56] to-[#0a2e28] rounded-3xl p-8 max-w-lg w-full border border-[#66c3b7]/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FaPlus className="text-[#66c3b7]" />
                New Request
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-xl bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all"
              >
                ✕
              </button>
            </div>

            {/* Type Selection */}
            <div className="mb-6">
              <label className="text-white/70 text-sm mb-3 block">Request Type</label>
              <div className="grid grid-cols-3 gap-3">
                {requestTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setNewRequest(prev => ({ ...prev, type: type.id }))}
                    className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      newRequest.type === type.id
                        ? 'border-[#66c3b7] bg-[#66c3b7]/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    <type.icon className="text-xl" style={{ color: newRequest.type === type.id ? type.color : '#9ca3af' }} />
                    <span className="text-xs text-white/70">{type.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Input */}
            <div className="mb-5">
              <label className="text-white/70 text-sm mb-2 block">Subject</label>
              <input
                type="text"
                value={newRequest.subject}
                onChange={(e) => setNewRequest(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Enter request subject..."
                className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#66c3b7]/50 transition-all"
              />
            </div>

            {/* Description Input */}
            <div className="mb-6">
              <label className="text-white/70 text-sm mb-2 block">Description</label>
              <textarea
                value={newRequest.description}
                onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your request in detail..."
                rows={4}
                className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#66c3b7]/50 transition-all resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3.5 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 transition-all font-medium"
              >
                Cancel
              </button>
              <motion.button
                onClick={handleSubmit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-[#66c3b7] to-[#2d9a8a] rounded-xl text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#66c3b7]/30"
              >
                <FaPaperPlane />
                Submit Request
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Requests;
