import React from 'react';
import { GlassCard } from '../components/Common';
import { FileText } from 'lucide-react';

export const Materials: React.FC = () => {
  return (
    <div className="space-y-8">
      <header className="mb-10">
        <h2 className="text-4xl font-bold text-white mb-2">Course Materials</h2>
        <p className="text-white/60">Access your lecture notes and resources</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <FileText className="text-emerald-400" size={32} />
            <div>
              <h3 className="text-white font-semibold">Sample Material</h3>
              <p className="text-white/40 text-sm">Coming soon</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
