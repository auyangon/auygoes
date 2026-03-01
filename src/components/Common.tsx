// src/components/Common.tsx
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================
// CARD
// ============================================
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white rounded-lg border border-gray-100 shadow-sm',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// ============================================
// STAT CARD
// ============================================
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
        'bg-white rounded-lg p-6 border border-gray-100 shadow-sm',
        className
      )
    )}>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-[#0B4F3A] bg-opacity-10 rounded-lg text-[#0B4F3A]">
          {icon}
        </div>
        <div>
          <div className="text-2xl font-semibold text-gray-800">{value}</div>
          <div className="text-sm text-gray-500">{label}</div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SECTION TITLE
// ============================================
interface SectionTitleProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children, icon, className }) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      {icon && <span className="text-[#0B4F3A]">{icon}</span>}
      <h2 className={twMerge(clsx('text-lg font-medium text-gray-800', className))}>
        {children}
      </h2>
    </div>
  );
};

// ============================================
// BADGE
// ============================================
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-[#0B4F3A] text-white',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'px-2 py-0.5 rounded text-xs font-medium',
          variants[variant],
          className
        )
      )}
    >
      {children}
    </span>
  );
};

// ============================================
// PROGRESS BAR
// ============================================
interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max = 100, 
  className,
  barClassName 
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className={twMerge(clsx('w-full h-2 bg-gray-100 rounded-full overflow-hidden', className))}>
      <div 
        className={twMerge(clsx('h-full bg-[#0B4F3A] rounded-full transition-all duration-300', barClassName))}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// ============================================
// BUTTON
// ============================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  ...props 
}) => {
  const variants = {
    primary: 'bg-[#0B4F3A] text-white hover:bg-[#0d5f45]',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={twMerge(
        clsx(
          'rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// ============================================
// LOADING SPINNER
// ============================================
export const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={twMerge(clsx('flex justify-center items-center', className))}>
      <div className="w-8 h-8 border-3 border-[#0B4F3A] border-t-transparent rounded-full animate-spin" />
    </div>
  );
};
