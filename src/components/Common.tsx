import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Seafoam green gradient (lighter version)
const seafoamGradient = 'bg-gradient-to-br from-[#2E8B57] to-[#66CDAA]';
const seafoamLight = 'bg-gradient-to-br from-[#98FB98] to-[#90EE90]';

// Light glass effect for better contrast
const glassBase = 'backdrop-blur-md bg-white/80 border border-gray-200/50 shadow-md';
const glassHover = 'hover:bg-white/90 hover:border-gray-300/50 hover:shadow-lg transition-all duration-300';

// ============================================
// CARD – Light glass with good contrast
// ============================================
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, gradient = false, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-2xl',
          glassBase,
          glassHover,
          gradient && 'bg-white',
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
// STAT CARD – Light background, seafoam icon
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
          'rounded-2xl p-6 bg-white shadow-sm border border-gray-100',
          className
        )
      )}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#2E8B57] to-[#66CDAA] text-white shadow-md">
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
// SECTION TITLE – Dark text for contrast
// ============================================
interface SectionTitleProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children, icon, className }) => {
  return (
    <div className="flex items-center gap-2 mb-6">
      {icon && <span className="text-[#2E8B57]">{icon}</span>}
      <h2 className={twMerge(clsx('text-lg font-medium text-gray-700', className))}>
        {children}
      </h2>
    </div>
  );
};

// ============================================
// BADGE – Good contrast variants
// ============================================
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700 border border-gray-200',
    primary: 'bg-gradient-to-r from-[#2E8B57] to-[#66CDAA] text-white',
    success: 'bg-green-100 text-green-700 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    danger: 'bg-red-100 text-red-700 border border-red-200',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'px-3 py-1 rounded-full text-xs font-medium',
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
// PROGRESS BAR – Seafoam fill
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
    <div className={twMerge(clsx('w-full h-2 bg-gray-200 rounded-full overflow-hidden', className))}>
      <div
        className={twMerge(clsx('h-full bg-gradient-to-r from-[#2E8B57] to-[#66CDAA] rounded-full transition-all duration-300', barClassName))}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// ============================================
// BUTTON – Clear contrast
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
    primary: 'bg-gradient-to-r from-[#2E8B57] to-[#66CDAA] text-white hover:from-[#3CB371] hover:to-[#7CFC00] shadow-md',
    secondary: 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200',
    outline: 'border border-[#2E8B57] text-[#2E8B57] hover:bg-[#2E8B57]/10',
    danger: 'bg-red-600 text-white hover:bg-red-700',
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
          'rounded-xl font-medium transition-all duration-300 disabled:opacity-50',
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
// AVATAR – Clean design
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
        <div className="w-full h-full bg-gradient-to-br from-[#2E8B57] to-[#66CDAA] flex items-center justify-center text-white text-2xl">
          {alt?.charAt(0) || '?'}
        </div>
      )}
    </div>
  );
};

// ============================================
// LOADING SPINNER – Seafoam
// ============================================
export const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={twMerge(clsx('flex justify-center items-center', className))}>
      <div className="w-6 h-6 border-2 border-gray-200 border-t-[#2E8B57] rounded-full animate-spin" />
    </div>
  );
};
