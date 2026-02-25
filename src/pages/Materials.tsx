import React from 'react';
import { GlassCard } from '../components/Common';
import { FileText } from 'lucide-react';

export const Materials: React.FC = () => {
  return (
    <div className="space-y-8">
      <header className="mb-10">
        <h2 className="text-3xl font-normal text-jet mb-2">Course Materials</h2>
        <p className="text-jet/70">Access your lecture notes and resources</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <FileText className="text-jet" size={32} />
            <div>
              <h3 className="text-jet font-normal">Sample Material</h3>
              <p className="text-jet/70 text-sm">Coming soon</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

