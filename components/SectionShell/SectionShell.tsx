import { forwardRef, useId, type HTMLAttributes, type Ref } from 'react';

import './SectionShell.css';

type SectionShellElement = 'section' | 'main' | 'nav' | 'aside';

export type SectionShellProps = HTMLAttributes<HTMLElement> & {
  as?: SectionShellElement;
  framed?: boolean;
  heading?: string;
  label?: string;
  surface?: 'default' | 'raised' | 'subtle-emphasis' | 'inverse';
  width?: 'standard' | 'reading' | 'maximum' | 'full-bleed';
};

export const SectionShell = forwardRef<HTMLElement, SectionShellProps>(function SectionShell(
  {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    as = 'section',
    children,
    className,
    framed = false,
    heading,
    label,
    surface = 'default',
    width = 'standard',
    ...sectionProps
  },
  ref,
) {
  const headingId = useId();
  const classes = [
    'rf-section-shell',
    `rf-section-shell--surface-${surface}`,
    framed ? 'rf-section-shell--framed' : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const accessibleLabel = label ?? ariaLabel;
  const hasAccessibleName = [heading, accessibleLabel, ariaLabelledBy].some((value) =>
    Boolean(value?.trim()),
  );

  if ((as === 'nav' || as === 'aside') && !hasAccessibleName) {
    throw new Error('SectionShell requires an accessible name when rendered as nav or aside.');
  }

  const sectionAttributes = {
    ...sectionProps,
    'aria-label': heading ? undefined : accessibleLabel,
    'aria-labelledby': heading ? headingId : ariaLabelledBy,
    className: classes,
    ref: ref as Ref<HTMLElement>,
  };
  const content = (
    <div className={`rf-section-shell__container rf-section-shell__container--${width}`}>
      {heading ? (
        <h2 className="rf-section-shell__heading" id={headingId}>
          {heading}
        </h2>
      ) : null}
      {children}
    </div>
  );

  if (as === 'main') {
    return <main {...sectionAttributes}>{content}</main>;
  }

  if (as === 'nav') {
    return <nav {...sectionAttributes}>{content}</nav>;
  }

  if (as === 'aside') {
    return <aside {...sectionAttributes}>{content}</aside>;
  }

  return <section {...sectionAttributes}>{content}</section>;
});
