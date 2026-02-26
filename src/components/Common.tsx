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
          'bg-white rounded-xl shadow-md p-5 border border-pastel-peach hover:shadow-lg transition-shadow',
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
        'text-lg font-medium text-gray-700',
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
  color?: string;
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({ children, className, color }) => {
  return (
    <span
      className={twMerge(
        clsx(
          'px-2.5 py-1 rounded-full text-xs font-medium',
          color || 'bg-pastel-yellow text-gray-700',
          className
        )
      )}
    >
      {children}
    </span>
  );
};
