import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
        'bg-white rounded-lg p-4 border border-gray-100 shadow-sm',
        className
      )
    )}>
      <div className="flex items-center gap-3">
        <div className="text-[#0B4F3A]">
          {icon}
        </div>
        <div>
          <div className="text-xl text-gray-800">{value}</div>
          <div className="text-xs text-gray-500">{label}</div>
        </div>
      </div>
    </div>
  );
};

interface SectionTitleProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children, icon, className }) => {
  return (
    <div className="flex items-center gap-2 mb-3">
      {icon && <span className="text-[#0B4F3A]">{icon}</span>}
      <h3 className={twMerge(clsx('text-gray-700 text-base', className))}>
        {children}
      </h3>
    </div>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'primary';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-[#0B4F3A] text-white',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'px-2 py-0.5 rounded text-xs',
          variants[variant],
          className
        )
      )}
    >
      {children}
    </span>
  );
};

export const ProgressBar: React.FC<{ value: number; className?: string }> = ({ value, className }) => {
  return (
    <div className={twMerge(clsx('w-full h-1 bg-gray-100 rounded-full overflow-hidden', className))}>
      <div 
        className="h-full bg-[#0B4F3A] rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

// ADD THE MISSING BUTTON COMPONENT
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
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
          'rounded-lg font-normal transition-colors',
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
