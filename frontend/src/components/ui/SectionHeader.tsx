import type { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function SectionHeader({ title, subtitle, icon, action }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div>
        <div className="flex items-center gap-3 mb-2">
          {icon}
          <h2 className="heading-section">{title}</h2>
        </div>
        {subtitle && <p className="text-muted max-w-xl">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
