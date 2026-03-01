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
  variant?: 'default' | 'success' | 'warning';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
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
