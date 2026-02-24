import { cn } from '../utils/cn';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        'backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl',
        hover && 'transition-transform duration-300 hover:scale-[1.02] hover:bg-white/15 hover:border-white/30',
        className
      )}
    >
      {children}
    </div>
  );
}

export function Spinner({ size = 'lg' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };
  return (
    <div className="flex items-center justify-center">
      <div className={cn('rounded-full animate-spin border-emerald-500/20 border-t-emerald-400', sizeClasses[size])} />
    </div>
  );
}

export function SectionTitle({ children, subtitle, className }: { children: React.ReactNode; subtitle?: string; className?: string }) {
  return (
    <div className={cn('mb-6', className)}>
      <h2 className="text-2xl font-bold text-white/90 tracking-tight">{children}</h2>
      {subtitle && <p className="text-sm text-white/40 mt-1">{subtitle}</p>}
    </div>
  );
}

export function GradeColor({ grade }: { grade: string }) {
  const colorMap: Record<string, string> = {
    'A+': 'text-emerald-300',
    'A': 'text-emerald-300',
    'A-': 'text-emerald-400',
    'B+': 'text-blue-300',
    'B': 'text-blue-300',
    'B-': 'text-blue-400',
    'C+': 'text-yellow-300',
    'C': 'text-yellow-300',
    'C-': 'text-yellow-400',
    'D+': 'text-orange-300',
    'D': 'text-orange-300',
    'F': 'text-red-400',
  };
  return (
    <span className={cn('font-bold', colorMap[grade] ?? 'text-white/60')}>
      {grade || '—'}
    </span>
  );
}