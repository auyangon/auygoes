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
          'rounded-2xl bg-white shadow-sm border border-gray-100 p-6',
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
    <div
      className={twMerge(
        clsx(
          'rounded-2xl p-6 bg-white shadow-sm border border-gray-100',
          className
        )
      )}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-r from-[#2E8B57] to-[#66CDAA] text-white shadow-md">
          {icon}
        </div>
        <div>
          <div className="text-2xl font-medium text-[#0a0a0a]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
            {value}
          </div>
          <div className="text-sm text-[#2a2a2a]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            {label}
          </div>
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
    <div className="flex items-center gap-2 mb-6">
      {icon && <span className="text-[#2E8B57]" style={{ textShadow: '0 1px 2px rgba(46,139,86,0.2)' }}>{icon}</span>}
      <h2 className={twMerge(clsx('text-lg font-medium', className))} style={{ color: '#0a0a0a', textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
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
    default: 'bg-gray-100 border border-gray-200',
    primary: 'bg-gradient-to-r from-[#2E8B57] to-[#66CDAA] text-white',
    success: 'bg-green-100 border border-green-200',
    warning: 'bg-yellow-100 border border-yellow-200',
    danger: 'bg-red-100 border border-red-200',
  };

  const textColors = {
    default: { color: '#1a1a1a', textShadow: '0 1px 2px rgba(0,0,0,0.03)' },
    primary: { color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.1)' },
    success: { color: '#1a1a1a', textShadow: '0 1px 2px rgba(0,0,0,0.03)' },
    warning: { color: '#1a1a1a', textShadow: '0 1px 2px rgba(0,0,0,0.03)' },
    danger: { color: '#1a1a1a', textShadow: '0 1px 2px rgba(0,0,0,0.03)' },
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
      style={textColors[variant]}
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
    <div className={twMerge(clsx('w-full h-2 bg-gray-200 rounded-full overflow-hidden', className))}>
      <div
        className={twMerge(clsx('h-full bg-gradient-to-r from-[#2E8B57] to-[#66CDAA] rounded-full transition-all duration-300', barClassName))}
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
    primary: 'bg-gradient-to-r from-[#2E8B57] to-[#66CDAA] hover:from-[#3CB371] hover:to-[#7CFC00] shadow-md',
    secondary: 'bg-gray-100 border border-gray-200 hover:bg-gray-200',
    outline: 'border border-[#2E8B57] hover:bg-[#2E8B57]/10',
    danger: 'bg-red-600 hover:bg-red-700 shadow-md',
  };

  const textStyles = {
    primary: { color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.1)' },
    secondary: { color: '#1a1a1a', textShadow: '0 1px 2px rgba(0,0,0,0.03)' },
    outline: { color: '#1a1a1a', textShadow: '0 1px 2px rgba(0,0,0,0.03)' },
    danger: { color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.1)' },
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
          'rounded-xl font-medium transition-all duration-300 disabled:opacity-50 border-0',
          variants[variant],
          sizes[size],
          className
        )
      )}
      style={textStyles[variant]}
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
        <div className="w-full h-full bg-gradient-to-r from-[#2E8B57] to-[#66CDAA] flex items-center justify-center text-white text-2xl" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
          {alt?.charAt(0) || '?'}
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
