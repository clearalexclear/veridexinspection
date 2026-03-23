import { cn } from '@/lib/utils';
import type { Status, Severity } from '@/data/reportData';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    pass: { label: 'PASS', classes: 'status-pass' },
    fail: { label: 'FAIL', classes: 'status-fail' },
    warning: { label: 'WARNING', classes: 'status-warning' },
    na: { label: 'N/A', classes: 'status-na' },
  };
  const { label, classes } = config[status];
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase', classes, className)}>
      {label}
    </span>
  );
}

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  const config = {
    critical: { label: 'Critical', classes: 'bg-danger text-danger-foreground' },
    major: { label: 'Major', classes: 'bg-warning text-warning-foreground' },
    minor: { label: 'Minor', classes: 'bg-muted text-muted-foreground' },
  };
  const { label, classes } = config[severity];
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide', classes, className)}>
      {label}
    </span>
  );
}
