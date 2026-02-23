import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../utils/cn';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = false, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        'backdrop-blur-xl bg-white/[0.07] rounded-3xl border border-white/[0.12] shadow-2xl',
        hover && 'transition-transform duration-300 hover:scale-[1.02] hover:bg-white/[0.1] hover:border-white/[0.2]',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface GlassBadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const badgeVariants = {
  default: 'bg-white/10 text-white/80',
  success: 'bg-emerald-500/20 text-emerald-300',
  warning: 'bg-amber-500/20 text-amber-300',
  danger: 'bg-red-500/20 text-red-300',
  info: 'bg-blue-500/20 text-blue-300',
};

export function GlassBadge({ children, className, variant = 'default' }: GlassBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm',
        badgeVariants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

interface SectionTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({ children, subtitle, className }: SectionTitleProps) {
  return (
    <div className={cn('mb-6', className)}>
      <h2 className="text-2xl font-bold text-white/90 tracking-tight">{children}</h2>
      {subtitle && <p className="text-sm text-white/40 mt-1">{subtitle}</p>}
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
      <div
        className={cn(
          'rounded-full animate-spin border-emerald-500/20 border-t-emerald-400',
          sizeClasses[size]
        )}
      />
    </div>
  );
}

export function FullPageSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-950 flex items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="text-white/40 mt-4 text-sm font-medium tracking-wide">Loading AUY Portal…</p>
      </div>
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
