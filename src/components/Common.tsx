import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================
// CARD COMPONENT
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
// STAT CARD COMPONENT
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
        <div className="p-3 bg-[#0B4F3A] bg-opacity-10 rounded-lg">
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
// SECTION TITLE COMPONENT
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
// BADGE COMPONENT
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
// PROGRESS BAR COMPONENT (FIXES THE CURRENT ERROR)
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
// BUTTON COMPONENT
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
// INPUT COMPONENT
// ============================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={twMerge(
          clsx(
            'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4F3A] focus:border-transparent',
            error && 'border-red-500',
            className
          )
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// ============================================
// SELECT COMPONENT
// ============================================
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className, ...props }) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        className={twMerge(
          clsx(
            'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4F3A] focus:border-transparent',
            className
          )
        )}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// ============================================
// MODAL COMPONENT
// ============================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {title && (
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {title}
            </h3>
          )}
          {children}
        </div>
      </div>
    </div>
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

// ============================================
// EMPTY STATE
// ============================================
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description }) => {
  return (
    <div className="text-center py-12">
      {icon && <div className="mx-auto mb-4 text-gray-300">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
};
