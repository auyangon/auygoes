import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, hover = true, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'card',
          hover && 'hover:shadow-medium',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const SectionTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <h3 className={twMerge(
      clsx(
        'text-lg font-medium text-seafoam-deep',
        className
      )
    )}>
      {children}
    </h3>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  color?: 'default' | 'success' | 'warning' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({ children, className, color = 'default' }) => {
  const colors = {
    default: 'badge',
    success: 'bg-green-100/80 text-green-700 border-green-200',
    warning: 'bg-amber-100/80 text-amber-700 border-amber-200',
    info: 'bg-blue-100/80 text-blue-700 border-blue-200',
  };

  return (
    <span
      className={twMerge(
        clsx(
          colors[color],
          className
        )
      )}
    >
      {children}
    </span>
  );
};
