import * as React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: number; // Percentual de tendência
  trendLabel?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const KpiCard = React.memo(function KpiCard({ title, value, description, trend, trendLabel, icon, className }: KpiCardProps) {
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;

  return (
    <Card className={cn('p-6 flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="text-muted-foreground/50">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
      </div>
      
      {(trend !== undefined || description) && (
        <div className="mt-2 text-sm flex items-center gap-2">
          {trend !== undefined && (
            <span
              className={cn(
                'flex items-center font-medium',
                isPositive ? 'text-success-foreground bg-success/20 px-1 rounded' : '',
                isNegative ? 'text-destructive-foreground bg-destructive/20 px-1 rounded' : '',
                !isPositive && !isNegative ? 'text-muted-foreground' : ''
              )}
            >
              {isPositive ? <ArrowUpIcon className="w-3 h-3 mr-1" /> : null}
              {isNegative ? <ArrowDownIcon className="w-3 h-3 mr-1" /> : null}
              {Math.abs(trend)}%
            </span>
          )}
          {(trendLabel || description) && (
            <span className="text-muted-foreground">{trendLabel || description}</span>
          )}
        </div>
      )}
    </Card>
  );
});
