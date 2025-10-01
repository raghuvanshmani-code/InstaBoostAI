
'use client';

import { BarChart, CheckCircle, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type StrategyPoint = {
  point: string;
  source: string;
};

type HashtagStrategy = {
  title: string;
  description: string;
  estimatedReach: number;
  points: StrategyPoint[];
};

export type HashtagReasoningData = {
  highVolume: HashtagStrategy;
  niche: HashtagStrategy;
  trending: HashtagStrategy;
};

type HashtagReasoningProps = {
  reasoning: HashtagReasoningData;
};

const StrategyCard = ({
  strategy,
  icon,
}: {
  strategy: HashtagStrategy;
  icon: React.ReactNode;
}) => (
  <Card className="bg-background/70">
    <CardHeader>
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 text-primary p-3 rounded-lg">{icon}</div>
        <div className="flex-grow">
          <CardTitle className="text-lg">{strategy.title}</CardTitle>
          <CardDescription>{strategy.description}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-muted-foreground">
            Est. Reach
          </span>
          <span className="text-sm font-bold text-primary">
            +{strategy.estimatedReach}%
          </span>
        </div>
        <Progress value={strategy.estimatedReach} className="h-2" />
      </div>
      <ul className="space-y-3 text-sm text-muted-foreground">
        {strategy.points.map((p, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
            <span>
              {p.point}{' '}
              <span className="text-xs opacity-70">({p.source})</span>
            </span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export function HashtagReasoning({ reasoning }: HashtagReasoningProps) {
  return (
    <div className="space-y-6">
      <StrategyCard
        strategy={reasoning.highVolume}
        icon={<BarChart className="h-6 w-6" />}
      />
      <StrategyCard
        strategy={reasoning.niche}
        icon={<CheckCircle className="h-6 w-6" />}
      />
      <StrategyCard
        strategy={reasoning.trending}
        icon={<TrendingUp className="h-6 w-6" />}
      />
    </div>
  );
}
