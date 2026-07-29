import { useId, type CSSProperties } from 'react';

import { Card, type CardProps } from '../../../../components';
import type { FindingSeverity } from './FindingsCard';

export type PriorityEffort = 'Low' | 'Medium' | 'High';

export type PriorityItem = {
  effort: PriorityEffort;
  severity: FindingSeverity;
  title: string;
};

export type PriorityMapProps = {
  items: readonly PriorityItem[];
  surface?: CardProps['surface'];
  title: string;
};

const severityRank: Record<FindingSeverity, number> = {
  Critical: 3,
  High: 2,
  Medium: 1,
};

const effortRank: Record<PriorityEffort, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

export function PriorityMap({ items, surface = 'default', title }: PriorityMapProps) {
  const descriptionId = useId();

  return (
    <Card
      as="article"
      className="rf-priority-map"
      data-teal-signal={surface === 'subtle-emphasis' ? 'persistent' : undefined}
      padding="spacious"
      surface={surface}
    >
      <h3>{title}</h3>
      <p id={descriptionId}>Severity and effort are written for every item; placement is a secondary cue.</p>
      <div aria-describedby={descriptionId} aria-hidden="true" className="rf-priority-map__plot">
        <span className="rf-priority-map__axis rf-priority-map__axis--severity">Severity increases upward</span>
        <span className="rf-priority-map__axis rf-priority-map__axis--effort">Effort increases rightward</span>
        {items.map((item) => (
          <div
            className={`rf-priority-map__point rf-priority-map__point--${item.severity.toLowerCase()}`}
            data-teal-signal={
              item.severity === 'High' && surface === 'default' ? 'persistent' : undefined
            }
            key={item.title}
            style={{
              '--rf-priority-effort': effortRank[item.effort],
              '--rf-priority-severity': severityRank[item.severity],
            } as CSSProperties}
          >
            <strong>{item.title}</strong>
            <span>Severity: {item.severity}</span>
            <span>Effort: {item.effort}</span>
          </div>
        ))}
      </div>
      <ol aria-label="Linear priority reading order" className="rf-priority-map__linear">
        {items.map((item) => (
          <li key={item.title}>
            <strong>{item.title}</strong>
            <span>Severity: {item.severity}</span>
            <span>Effort: {item.effort}</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
