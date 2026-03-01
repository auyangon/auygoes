import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Seafoam green gradient
const seafoamGradient = 'bg-gradient-to-br from-[#2E8B57] via-[#3CB371] to-[#66CDAA]';
const seafoamLight = 'bg-gradient-to-br from-[#98FB98] to-[#90EE90]';

// Premium glass effect
const glassBase = 'backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl';
const glassHover = 'hover:bg-white/20 hover:border-white/30 hover:shadow-3xl transition-all duration-300';

// ============================================
// CARD – Premium glass with seafoam accent
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
          gradient && seafoamGradient + ' bg-opacity-20',
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
// STAT CARD – Seafoam gradient icon background
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
          'rounded-2xl p-6',
          glassBase,
          glassHover,
          className
        )
      )}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#2E8B57] to-[#66CDAA] text-white shadow-lg">
          {icon}
        </div>
        <div>
          <div className="text-2xl font-light text-white">{value}</div>
          <div className="text-xs font-light text-white/70">{label}</div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SECTION TITLE – Seafoam icon
// ============================================
interface SectionTitleProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children, icon, className }) => {
  return (
    <div className="flex items-center gap-2 mb-6">
      {icon && <span className="text-[#66CDAA]">{icon}</span>}
      <h2 className={twMerge(clsx('text-lg font-light text-white', className))}>
        {children}
      </h2>
    </div>
  );
};

// ============================================
// BADGE – Seafoam variants
// ============================================
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  const variants = {
    default: 'bg-white/20 text-white backdrop-blur-sm',
    primary: 'bg-gradient-to-r from-[#2E8B57] to-[#66CDAA] text-white',
    success: 'bg-green-500/80 text-white backdrop-blur-sm',
    warning: 'bg-yellow-500/80 text-white backdrop-blur-sm',
    danger: 'bg-red-500/80 text-white backdrop-blur-sm',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'px-3 py-1 rounded-full text-xs font-light',
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
// PROGRESS BAR – Seafoam green fill
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
    <div className={twMerge(clsx('w-full h-1.5 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden', className))}>
      <div
        className={twMerge(clsx('h-full bg-gradient-to-r from-[#2E8B57] to-[#66CDAA] rounded-full transition-all duration-300', barClassName))}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// ============================================
// BUTTON – Seafoam gradient
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
    primary: 'bg-gradient-to-r from-[#2E8B57] to-[#66CDAA] text-white hover:from-[#3CB371] hover:to-[#7CFC00]',
    secondary: 'backdrop-blur-xl bg-white/20 border border-white/30 text-white hover:bg-white/30',
    outline: 'border border-[#66CDAA] text-[#66CDAA] hover:bg-[#66CDAA]/20',
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
          'rounded-xl font-light transition-all duration-300 disabled:opacity-50',
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
// AVATAR – For profile picture
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
    <div className={twMerge(clsx('rounded-full overflow-hidden border-4 border-[#66CDAA]/30 shadow-xl', sizeClasses[size], className))}>
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
// LOADING SPINNER – Seafoam green
// ============================================
export const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={twMerge(clsx('flex justify-center items-center', className))}>
      <div className="w-6 h-6 border-2 border-white/30 border-t-[#66CDAA] rounded-full animate-spin" />
    </div>
  );
};
