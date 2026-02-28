import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BookOpen } from 'lucide-react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = true, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white rounded-xl transition-all shadow-md border border-gray-100',
          hover && 'hover:shadow-lg hover:-translate-y-0.5',
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
}

export const StatCard: React.FC<StatCardProps> = ({ icon, value, label, className }) => {
  return (
    <div className={twMerge(
      clsx(
        'bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all',
        className
      )
    )}>
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-[#0B4F3A] text-white shadow-md">
          {icon}
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-800">{value}</div>
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
      {icon && <span className="text-[#0B4F3A]">{icon}</span>}
      <h3 className={twMerge(clsx('text-lg font-semibold text-gray-700', className))}>
        {children}
      </h3>
    </div>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

export const Badge: React.FC<BadgeProps> = ({ children, className, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-600 border border-gray-200',
    primary: 'bg-[#0B4F3A] text-white border border-[#0B4F3A]',
    success: 'bg-green-100 text-green-700 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'px-3 py-1 rounded-full text-sm font-medium',
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
    <div className={twMerge(clsx('w-full h-2 bg-gray-100 rounded-full overflow-hidden', className))}>
      <div 
        className="h-full bg-[#0B4F3A] rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' 
}> = ({
  children,
  className,
  variant = 'primary',
  ...props
}) => {
  const variants = {
    primary: 'bg-[#0B4F3A] text-white hover:bg-[#0d5f45] hover:shadow-md',
    secondary: 'bg-white text-gray-600 border border-gray-200 hover:bg-[#e0f2fe] hover:text-[#0B4F3A] hover:border-[#0B4F3A]',
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
