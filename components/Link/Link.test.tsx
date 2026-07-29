import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { expectNoAccessibilityViolations } from '../../test/accessibility';
import { Link } from './Link';

afterEach(cleanup);

describe('Link', () => {
  it.each(['inline', 'standalone', 'navigation', 'inverse'] as const)(
    'renders the %s variant as a native link without accessibility violations',
    async (variant) => {
      const { container } = render(
        <Link href="#evidence" variant={variant}>
          Review evidence
        </Link>,
      );

      const link = screen.getByRole('link', { name: 'Review evidence' });
      expect(link).toHaveClass('rf-link', `rf-link--${variant}`);
      await expectNoAccessibilityViolations(container);
    },
  );

  it('forwards native anchor props without preventing navigation', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.defaultPrevented);

    render(
      <Link
        aria-describedby="link-description"
        data-destination="research"
        download="research-summary.pdf"
        href="#research"
        onClick={onClick}
      >
        Read the research summary
      </Link>,
    );

    const link = screen.getByRole('link', { name: 'Read the research summary' });
    await user.click(link);

    expect(link).toHaveAttribute('href', '#research');
    expect(link).toHaveAttribute('aria-describedby', 'link-description');
    expect(link).toHaveAttribute('data-destination', 'research');
    expect(link).toHaveAttribute('download', 'research-summary.pdf');
    expect(onClick).toHaveBeenCalledOnce();
    expect(onClick).toHaveReturnedWith(false);
  });

  it('marks the current page with aria-current', () => {
    render(
      <Link current href="#approach" variant="navigation">
        Our approach
      </Link>,
    );

    const link = screen.getByRole('link', { name: 'Our approach' });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveClass('rf-link--current');
  });

  it('opens a new context only when explicitly requested', () => {
    const { rerender } = render(<Link href="https://example.com">External research</Link>);

    const ordinaryLink = screen.getByRole('link', { name: 'External research' });
    expect(ordinaryLink).not.toHaveAttribute('target');
    expect(ordinaryLink).not.toHaveAttribute('rel');
    expect(ordinaryLink.querySelector('.rf-link__external-icon')).toBeNull();

    rerender(
      <Link href="https://example.com" newContext>
        External research
      </Link>,
    );

    const newContextLink = screen.getByRole('link', {
      name: /External research\s*\(opens in a new tab\)/,
    });
    expect(newContextLink).toHaveAttribute('target', '_blank');
    expect(newContextLink).toHaveAttribute('rel', 'noreferrer');
    expect(newContextLink.querySelector('.rf-link__external-icon')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(newContextLink.querySelector('.rf-link__new-context')).toHaveTextContent(
      '(opens in a new tab)',
    );
  });

  it('receives keyboard focus in light and inverse contexts', async () => {
    const user = userEvent.setup();

    render(
      <>
        <Link href="#diagnosis">Diagnosis</Link>
        <Link href="#inverse" variant="inverse">
          Inverse link
        </Link>
      </>,
    );

    await user.tab();
    expect(screen.getByRole('link', { name: 'Diagnosis' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('link', { name: 'Inverse link' })).toHaveFocus();
  });
});
