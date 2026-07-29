import { Card, type CardProps } from '../../../../components';

export type FindingSeverity = 'Critical' | 'High' | 'Medium';

export type FindingsCardProps = {
  evidence: string;
  impact: string;
  problem: string;
  recommendation: string;
  severity: FindingSeverity;
  surface?: CardProps['surface'];
  title: string;
  titleLevel?: 3 | 4;
};

export function FindingsCard({
  evidence,
  impact,
  problem,
  recommendation,
  severity,
  surface = 'default',
  title,
  titleLevel = 3,
}: FindingsCardProps) {
  const StepHeading = titleLevel === 4 ? 'h5' : 'h4';
  const TitleHeading = titleLevel === 4 ? 'h4' : 'h3';
  const steps = [
    ['Problem', problem],
    ['Evidence', evidence],
    ['Impact', impact],
    ['Recommendation', recommendation],
  ] as const;

  return (
    <Card
      as="article"
      className="rf-findings-card"
      data-gallery-composition="findings-card"
      data-gallery-surface={surface}
      data-teal-signal={surface === 'subtle-emphasis' ? 'persistent' : undefined}
      padding="spacious"
      surface={surface}
    >
      <header className="rf-findings-card__header">
        <p
          className={`rf-findings-card__severity rf-findings-card__severity--${severity.toLowerCase()}`}
          data-teal-signal={severity === 'High' && surface === 'default' ? 'persistent' : undefined}
        >
          {severity}
        </p>
        <TitleHeading>{title}</TitleHeading>
      </header>
      <div className="rf-findings-card__steps">
        {steps.map(([label, value]) => (
          <section className="rf-findings-card__step" key={label}>
            <StepHeading>{label}</StepHeading>
            <p>{value}</p>
          </section>
        ))}
      </div>
    </Card>
  );
}
