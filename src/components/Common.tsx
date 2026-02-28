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
          glass && 'bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg',
          !glass && 'bg-white shadow-md',
          hover && 'hover:shadow-xl hover:-translate-y-0.5 hover:bg-white/90',
          className
        )
      )}
      style={{
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)'
      }}
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
  gradient?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, value, label, className, gradient = 'from-pink-400 to-purple-400' }) => {
  return (
    <div className={twMerge(
      clsx(
        'rounded-xl p-6 transition-all bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg',
        'hover:shadow-xl hover:-translate-y-0.5 hover:bg-white/90',
        className
      )
    )}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} text-white shadow-md`}>
          {icon}
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-800 drop-shadow-sm">{value}</div>
          <div className="text-sm font-medium text-gray-500">{label}</div>
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
      {icon && <span className="text-gray-500">{icon}</span>}
      <h3 className={twMerge(clsx('text-lg font-semibold text-gray-700 drop-shadow-sm', className))}>
        {children}
      </h3>
    </div>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'pastel';
}

export const Badge: React.FC<BadgeProps> = ({ children, className, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-600 border border-gray-200',
    primary: 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border border-purple-200',
    success: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200',
    warning: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border border-yellow-200',
    pastel: 'bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 border border-pink-200',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'px-3 py-1 rounded-full text-sm font-medium shadow-sm',
          variants[variant],
          className
        )
      )}
    >
      {children}
    </span>
  );
};

export const ProgressBar: React.FC<{ value: number; className?: string; gradient?: string }> = ({ 
  value, 
  className,
  gradient = 'from-pink-400 to-purple-400' 
}) => {
  return (
    <div className={twMerge(clsx('w-full h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner', className))}>
      <div 
        className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all shadow-md`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' | 'pastel' 
}> = ({
  children,
  className,
  variant = 'primary',
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg hover:-translate-y-0.5',
    secondary: 'bg-white/80 backdrop-blur-sm text-gray-600 border border-gray-200 hover:bg-white hover:shadow-md',
    pastel: 'bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 hover:from-pink-200 hover:to-purple-200 hover:shadow-md',
  };

  return (
    <button
      className={twMerge(
        clsx(
          'px-4 py-2 rounded-xl font-medium transition-all shadow-sm',
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
