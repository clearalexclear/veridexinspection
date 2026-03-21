import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

type Level = 'high' | 'medium' | 'low';

const config: Record<Level, { icon: typeof CheckCircle; classes: string; label: string }> = {
  high: { icon: CheckCircle, classes: 'bg-success/10 text-success border-success/20', label: 'High confidence' },
  medium: { icon: HelpCircle, classes: 'bg-warning/10 text-warning border-warning/20', label: 'Medium confidence' },
  low: { icon: AlertTriangle, classes: 'bg-danger/10 text-danger border-danger/20 animate-pulse', label: 'Low — verify' },
};

export default function ConfidenceBadge({ level }: { level?: string }) {
  const l = (level as Level) || 'medium';
  const c = config[l] || config.medium;
  const Icon = c.icon;

  return (
    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 gap-1 ${c.classes}`}>
      <Icon className="w-3 h-3" />
      {c.label}
    </Badge>
  );
}
