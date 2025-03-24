
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SubscriptionStatusBadgeProps {
  status: string;
  type?: string;
  daysRemaining?: number;
  sessionsRemaining?: number;
  className?: string;
}

const SubscriptionStatusBadge: React.FC<SubscriptionStatusBadgeProps> = ({
  status,
  type,
  daysRemaining,
  sessionsRemaining,
  className
}) => {
  const getStatusDetails = () => {
    switch (status) {
      case 'expired':
        return {
          label: 'منتهي',
          variant: 'destructive' as const
        };
      case 'warning':
        return {
          label: type === 'per_session' 
            ? `متبقي ${sessionsRemaining} جلسات` 
            : `متبقي ${daysRemaining} يوم`,
          className: 'bg-amber-100 text-amber-800 hover:bg-amber-100'
        };
      case 'active':
        return {
          label: 'نشط',
          className: 'bg-green-100 text-green-800 hover:bg-green-100'
        };
      default:
        return {
          label: 'غير معروف',
          variant: 'outline' as const
        };
    }
  };

  const details = getStatusDetails();

  return (
    <Badge 
      variant={details.variant || 'outline'} 
      className={cn(details.className, className)}
    >
      {details.label}
    </Badge>
  );
};

export default SubscriptionStatusBadge;
