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
  titleLevel?: 3 | 4;
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

export function PriorityMap({ items, surface = 'default', title, titleLevel = 3 }: PriorityMapProps) {
  const descriptionId = useId();
  const TitleHeading = titleLevel === 4 ? 'h4' : 'h3';

  return (
    <Card
      as="article"
      className="rf-priority-map"
      data-gallery-composition="priority-map"
      data-gallery-surface={surface}
      data-teal-signal={surface === 'subtle-emphasis' ? 'persistent' : undefined}
      padding="spacious"
      surface={surface}
    >
      <TitleHeading>{title}</TitleHeading>
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
      <ol
        aria-label="Linear priority reading order"
        className="rf-priority-map__linear"
        data-visual-fallback="always-visible"
      >
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
