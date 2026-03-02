import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================
// CARD – White with 90% opacity
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
          'rounded-xl bg-white bg-opacity-90 border border-gray-200 shadow-sm p-6',
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
// STAT CARD – Tiffany icon
// ============================================
interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, value, label, className }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-xl p-6 bg-white bg-opacity-90 border border-gray-200 shadow-sm',
          className
        )
      )}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-[#2E8B57] bg-opacity-90 text-white shadow-sm">
          {icon}
        </div>
        <div>
          <div className="text-2xl font-semibold text-gray-800">{value}</div>
          <div className="text-sm text-gray-600">{label}</div>
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
      {icon && <span className="text-[#2E8B57]">{icon}</span>}
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
    default: 'bg-gray-100 bg-opacity-90 text-gray-700',
    primary: 'bg-[#2E8B57] bg-opacity-90 text-white',
    success: 'bg-green-100 bg-opacity-90 text-green-700',
    warning: 'bg-yellow-100 bg-opacity-90 text-yellow-700',
    danger: 'bg-red-100 bg-opacity-90 text-red-700',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'px-2 py-1 rounded text-xs font-medium',
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
    <div className={twMerge(clsx('w-full h-2 bg-gray-200 bg-opacity-90 rounded-full overflow-hidden', className))}>
      <div
        className={twMerge(clsx('h-full bg-[#2E8B57] bg-opacity-90 rounded-full transition-all duration-300', barClassName))}
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
    primary: 'bg-[#2E8B57] bg-opacity-90 text-white hover:bg-opacity-100',
    secondary: 'bg-gray-100 bg-opacity-90 text-gray-700 hover:bg-opacity-100',
    outline: 'border border-[#2E8B57] text-[#2E8B57] hover:bg-[#2E8B57] hover:bg-opacity-10',
    danger: 'bg-red-600 bg-opacity-90 text-white hover:bg-opacity-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={twMerge(
        clsx(
          'rounded-lg font-medium transition-all duration-300 disabled:opacity-50',
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
// AVATAR
// ============================================
interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt = '', size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };
  return (
    <div className={twMerge(clsx('rounded-full overflow-hidden border-4 border-white shadow-xl', sizeClasses[size], className))}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-[#2E8B57] bg-opacity-90 flex items-center justify-center text-white text-2xl">
          {alt?.charAt(0)?.toUpperCase() || '?'}
        </div>
      )}
    </div>
  );
};

// ============================================
// LOADING SPINNER
// ============================================
export const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={twMerge(clsx('flex justify-center items-center', className))}>
      <div className="w-6 h-6 border-2 border-gray-200 border-t-[#2E8B57] rounded-full animate-spin" />
    </div>
  );
};
