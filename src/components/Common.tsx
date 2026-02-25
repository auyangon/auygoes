import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  seafoam?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  seafoam = false,
  ...props 
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white/70 backdrop-blur-md rounded-2xl shadow-lg transition-all duration-300',
          'border',
          seafoam 
            ? 'border-seafoam-soft/30 hover:border-seafoam-light/50' 
            : 'border-gray-200/50 hover:border-gray-300/50',
          'hover:shadow-xl hover:-translate-y-1',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const SectionTitle: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  seafoam?: boolean;
}> = ({
  children,
  className,
  seafoam = true,
}) => {
  return (
    <h3 className={twMerge(
      clsx(
        'text-2xl font-semibold',
        seafoam ? 'text-seafoam-dark' : 'text-gray-800',
        className
      )
    )}>
      {children}
    </h3>
  );
};

interface GlassBadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
  seafoam?: boolean;
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({ 
  children, 
  color, 
  className,
  seafoam = true,
}) => {
  const defaultColor = seafoam 
    ? 'bg-seafoam-soft/30 text-seafoam-dark border-seafoam-light/30'
    : 'bg-gray-100 text-gray-700 border-gray-200';
    
  return (
    <span
      className={twMerge(
        clsx(
          'px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm',
          color || defaultColor,
          className
        )
      )}
    >
      {children}
    </span>
  );
};