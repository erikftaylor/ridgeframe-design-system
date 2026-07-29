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
};

export function FindingsCard({
  evidence,
  impact,
  problem,
  recommendation,
  severity,
  surface = 'default',
  title,
}: FindingsCardProps) {
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
        <h3>{title}</h3>
      </header>
      <div className="rf-findings-card__steps">
        {steps.map(([label, value]) => (
          <section className="rf-findings-card__step" key={label}>
            <h4>{label}</h4>
            <p>{value}</p>
          </section>
        ))}
      </div>
    </Card>
  );
}
