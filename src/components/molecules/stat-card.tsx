import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Stat } from '@/data/stats';

interface StatCardProps {
  stat: Stat;
  className?: string;
  highlightValue?: boolean;
}

export function StatCard({ stat, className, highlightValue = false }: StatCardProps) {
  return (
    <Card className={cn('overflow-hidden border-2 ', className)}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <span
            className={cn(
              'text-3xl font-bold md:text-4xl',
              highlightValue &&
                'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'
            )}
          >
            {stat.value}
          </span>
          <span className="mt-1 text-sm font-medium uppercase tracking-wider text-muted-foreground md:text-base">
            {stat.label}
          </span>
          {stat.description && (
            <p className="mt-2 text-xs text-muted-foreground md:text-sm">{stat.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default StatCard;
