
import React from 'react';
import { cn } from '@/lib/utils';

interface BlurCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const BlurCard: React.FC<BlurCardProps> = ({ children, className, ...props }) => {
  return (
    <div 
      className={cn(
        "blur-card p-6 animate-fade-in", 
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default BlurCard;
