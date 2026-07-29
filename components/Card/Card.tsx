import { forwardRef, type HTMLAttributes, type Ref } from 'react';

import './Card.css';

export type CardProps = HTMLAttributes<HTMLElement> & {
  as?: 'article' | 'div';
  border?: 'none' | 'structural' | 'control';
  interactive?: boolean;
  padding?: 'none' | 'compact' | 'default' | 'spacious';
  surface?: 'default' | 'raised' | 'subtle-emphasis' | 'inverse';
};

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  {
    as = 'div',
    border = 'structural',
    children,
    className,
    interactive = false,
    padding = 'default',
    surface = 'default',
    ...cardProps
  },
  ref,
) {
  const classes = [
    'rf-card',
    `rf-card--surface-${surface}`,
    `rf-card--padding-${padding}`,
    `rf-card--border-${border}`,
    interactive ? 'rf-card--interactive' : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (as === 'article') {
    return (
      <article {...cardProps} className={classes} ref={ref}>
        {children}
      </article>
    );
  }

  return (
    <div {...cardProps} className={classes} ref={ref as Ref<HTMLDivElement>}>
      {children}
    </div>
  );
});
