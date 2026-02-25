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
          'glass-card rounded-xl p-5',
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
        'text-lg font-normal text-jet',
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
          'px-2.5 py-1 rounded-full text-xs font-normal glass-card text-jet',
          className
        )
      )}
    >
      {children}
    </span>
  );
};
