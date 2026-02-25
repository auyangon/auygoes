import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'glass-card rounded-2xl p-6',
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
        'text-2xl font-semibold text-jet',
        className
      )
    )}>
      {children}
    </h3>
  );
};

interface GlassBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({ children, className }) => {
  return (
    <span
      className={twMerge(
        clsx(
          'px-3 py-1 rounded-full text-xs font-medium glass-light text-jet',
          className
        )
      )}
    >
      {children}
    </span>
  );
};
