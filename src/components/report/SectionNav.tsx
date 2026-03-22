import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import {
  FileText, BarChart3, ClipboardList, Target, CheckSquare,
  AlertTriangle, Camera, Package, Zap, Ruler, Box, MessageSquare, Shield,
  Flame, ListChecks, Building2, Clock, ShoppingCart, Layers
} from 'lucide-react';

const sections = [
  { id: 'header', label: 'Report', icon: FileText },
  { id: 'decision', label: 'Assessment', icon: Shield },
  { id: 'key-issues', label: 'Issues', icon: Flame },
  { id: 'action-plan', label: 'Actions', icon: ListChecks },
  { id: 'summary', label: 'Summary', icon: BarChart3 },
  { id: 'supplier', label: 'Supplier', icon: Building2 },
  { id: 'overview', label: 'Overview', icon: ClipboardList },
  { id: 'items', label: 'Items', icon: Layers },
  { id: 'aql', label: 'AQL', icon: Target },
  { id: 'conformity', label: 'Conformity', icon: CheckSquare },
  { id: 'defects', label: 'Defects', icon: AlertTriangle },
  { id: 'photos', label: 'Photos', icon: Camera },
  { id: 'packaging', label: 'Packaging', icon: Package },
  { id: 'testing', label: 'Testing', icon: Zap },
  { id: 'measurements', label: 'Specs', icon: Ruler },
  { id: 'cartons', label: 'Cartons', icon: Box },
  { id: 'time-to-fix', label: 'Timeline', icon: Clock },
  { id: 'amazon-readiness', label: 'Amazon', icon: ShoppingCart },
  { id: 'comments', label: 'Comments', icon: MessageSquare },
  { id: 'recommendation', label: 'Final', icon: Shield },
];

export function SectionNav() {
  const [activeSection, setActiveSection] = useState('header');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0 }
    );

    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-0.5 overflow-x-auto py-2 scrollbar-hide">
          {sections.map(s => {
            const Icon = s.icon;
            const isActive = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200',
                  'hover:bg-secondary active:scale-[0.97]',
                  isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
