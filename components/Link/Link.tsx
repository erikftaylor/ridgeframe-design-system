import { ExternalLink } from 'lucide-react';
import { forwardRef, type AnchorHTMLAttributes } from 'react';

import './Link.css';

export type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'rel' | 'target'> & {
  current?: boolean;
  newContext?: boolean;
  variant?: 'inline' | 'standalone' | 'navigation' | 'inverse';
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    'aria-current': ariaCurrent,
    children,
    className,
    current = false,
    newContext = false,
    variant = 'inline',
    ...anchorProps
  },
  ref,
) {
  const classes = ['rf-link', `rf-link--${variant}`, current ? 'rf-link--current' : undefined, className]
    .filter(Boolean)
    .join(' ');

  return (
    <a
      {...anchorProps}
      aria-current={current ? 'page' : ariaCurrent}
      className={classes}
      ref={ref}
      rel={newContext ? 'noreferrer' : undefined}
      target={newContext ? '_blank' : undefined}
    >
      {children}
      {newContext ? (
        <>
          <ExternalLink aria-hidden="true" className="rf-link__external-icon" />
          <span className="rf-link__new-context"> (opens in a new tab)</span>
        </>
      ) : null}
    </a>
  );
});
