import { cn } from '@/lib/utils';
import type { Status, Severity, OverallResult, RiskLevel, Decision } from '@/data/reportData';

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

export function OverallResultBadge({ result, className }: { result: OverallResult; className?: string }) {
  const config = {
    'APPROVED': { classes: 'bg-success text-success-foreground', icon: '✓' },
    'APPROVED WITH RESERVATIONS': { classes: 'bg-warning text-warning-foreground', icon: '⚠' },
    'REJECTED': { classes: 'bg-danger text-danger-foreground', icon: '✕' },
  };
  const { classes, icon } = config[result];
  return (
    <span className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider', classes, className)}>
      <span>{icon}</span> {result}
    </span>
  );
}

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  const config = {
    low: 'bg-success/10 text-success border border-success/20',
    medium: 'bg-warning/10 text-warning border border-warning/20',
    high: 'bg-danger/10 text-danger border border-danger/20',
  };
  return (
    <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide', config[level], className)}>
      {level} risk
    </span>
  );
}

export function DecisionBadge({ decision, className }: { decision: Decision; className?: string }) {
  const config = {
    'ship': { label: 'Ship', classes: 'bg-success text-success-foreground', icon: '✓' },
    'ship-with-corrections': { label: 'Ship with Corrections', classes: 'bg-warning text-warning-foreground', icon: '⚠' },
    'do-not-ship': { label: 'Do Not Ship', classes: 'bg-danger text-danger-foreground', icon: '✕' },
  };
  const { label, classes, icon } = config[decision];
  return (
    <span className={cn('inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider', classes, className)}>
      <span className="text-base">{icon}</span> {label}
    </span>
  );
}
