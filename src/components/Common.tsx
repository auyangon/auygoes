import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BookOpen } from 'lucide-react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = true, glass = true, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-xl transition-all',
          glass && 'bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl',
          !glass && 'bg-white shadow-md',
          hover && 'hover:shadow-2xl hover:-translate-y-0.5 hover:bg-white/80',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  className?: string;
  glass?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, value, label, className, glass = true }) => {
  return (
    <div className={twMerge(
      clsx(
        'rounded-xl p-6 transition-all',
        glass && 'bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl',
        !glass && 'bg-white shadow-md',
        'hover:shadow-2xl hover:-translate-y-0.5 hover:bg-white/80',
        className
      )
    )}>
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-[#0B4F3A] text-white shadow-md">
          {icon}
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-800">{value}</div>
          <div className="text-sm font-medium text-gray-600">{label}</div>
        </div>
      </div>
    </div>
  );
};

export const SectionTitle: React.FC<{ children: React.ReactNode; className?: string; icon?: React.ReactNode }> = ({
  children,
  className,
  icon
}) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      {icon && <span className="text-[#0B4F3A]">{icon}</span>}
      <h3 className={twMerge(clsx('text-lg font-semibold text-gray-800 drop-shadow-sm', className))}>
        {children}
      </h3>
    </div>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'holiday';
}

export const Badge: React.FC<BadgeProps> = ({ children, className, variant = 'default' }) => {
  const variants = {
    default: 'bg-white/50 backdrop-blur-sm text-gray-600 border border-gray-200',
    primary: 'bg-[#0B4F3A]/90 text-white border border-[#0B4F3A]/30',
    success: 'bg-green-100/90 text-green-700 border border-green-200',
    warning: 'bg-amber-100/90 text-amber-700 border border-amber-200',
    holiday: 'bg-amber-500/90 text-white border border-amber-600/30',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm',
          variants[variant],
          className
        )
      )}
    >
      {children}
    </span>
  );
};

export const ProgressBar: React.FC<{ value: number; className?: string }> = ({ 
  value, 
  className 
}) => {
  return (
    <div className={twMerge(clsx('w-full h-2 bg-white/50 backdrop-blur-sm rounded-full overflow-hidden', className))}>
      <div 
        className="h-full bg-[#0B4F3A] rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' | 'glass'
}> = ({
  children,
  className,
  variant = 'primary',
  ...props
}) => {
  const variants = {
    primary: 'bg-[#0B4F3A] text-white hover:bg-[#0d5f45] hover:shadow-xl hover:-translate-y-0.5',
    secondary: 'bg-white/50 backdrop-blur-sm text-gray-700 border border-white/30 hover:bg-white/70 hover:shadow-lg',
    glass: 'bg-white/30 backdrop-blur-md text-gray-800 border border-white/40 hover:bg-white/40 hover:shadow-lg',
  };

  return (
    <button
      className={twMerge(
        clsx(
          'px-4 py-2 rounded-xl font-medium transition-all',
          variants[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </button>
  );
};
