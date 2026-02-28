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
          'uni-card',
          hover && 'hover:shadow-md',
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
    <div className={twMerge(clsx('uni-stat', className))}>
      <div className="uni-stat-icon">{icon}</div>
      <div className="uni-stat-value">{value}</div>
      <div className="uni-stat-label">{label}</div>
    </div>
  );
};

export const SectionTitle: React.FC<{ children: React.ReactNode; className?: string; icon?: React.ReactNode }> = ({
  children,
  className,
  icon
}) => {
  return (
    <div className="uni-card-header">
      <h3 className={twMerge(clsx('uni-card-title', className))}>
        {icon && <span className="uni-card-title-icon">{icon}</span>}
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
    default: 'uni-badge',
    primary: 'uni-badge uni-badge-primary',
    success: 'uni-badge bg-green-50 text-green-700 border-green-100',
    warning: 'uni-badge bg-amber-50 text-amber-700 border-amber-100',
  };

  return (
    <span
      className={twMerge(
        clsx(
          variants[variant],
          className
        )
      )}
    >
      {children}
    </span>
  );
};

interface CourseItemProps {
  icon?: React.ReactNode;
  name: string;
  code: string;
  credits: number;
  grade?: string;
  className?: string;
}

export const CourseItem: React.FC<CourseItemProps> = ({ icon, name, code, credits, grade, className }) => {
  return (
    <div className={twMerge(clsx('uni-course-item', className))}>
      <div className="uni-course-icon">
        {icon || <BookOpen size={20} />}
      </div>
      <div className="uni-course-info">
        <h4>{name}</h4>
        <p>{code}  {credits} Credits</p>
      </div>
      {grade && <div className="uni-course-grade">{grade}</div>}
    </div>
  );
};

export const ProgressBar: React.FC<{ value: number; className?: string }> = ({ value, className }) => {
  return (
    <div className={twMerge(clsx('uni-progress', className))}>
      <div className="uni-progress-bar" style={{ width: `${value}%` }} />
    </div>
  );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }> = ({
  children,
  className,
  variant = 'primary',
  ...props
}) => {
  return (
    <button
      className={twMerge(
        clsx(
          'uni-btn',
          variant === 'primary' ? 'uni-btn-primary' : 'uni-btn-secondary',
          className
        )
      )}
      {...props}
    >
      {children}
    </button>
  );
};
