import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl',
          'hover:bg-white/10 transition-all duration-300',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const SectionTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <h3 className={twMerge(clsx('text-2xl font-bold text-white', className))}>
      {children}
    </h3>
  );
};

interface GlassBadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({ children, color = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', className }) => {
  return (
    <span
      className={twMerge(
        clsx(
          'px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm',
          color,
          className
        )
      )}
    >
      {children}
    </span>
  );
};
