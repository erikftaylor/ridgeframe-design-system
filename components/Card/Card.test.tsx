import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { expectNoAccessibilityViolations } from '../../test/accessibility';
import { Card } from './Card';

afterEach(cleanup);

describe('Card', () => {
  it('uses a div by default and an article only when explicitly selected', () => {
    const { rerender } = render(<Card>Shared supporting content</Card>);

    expect(screen.getByText('Shared supporting content').tagName).toBe('DIV');

    rerender(<Card as="article">Independent finding</Card>);

    expect(screen.getByText('Independent finding').tagName).toBe('ARTICLE');
  });

  it.each(['default', 'raised', 'subtle-emphasis', 'inverse'] as const)(
    'renders the %s surface variant without accessibility violations',
    async (surface) => {
      const { container } = render(
        <Card surface={surface}>
          <h2>{surface} finding</h2>
          <p>Evidence remains readable in this structural surface.</p>
        </Card>,
      );

      expect(screen.getByText(`${surface} finding`).parentElement).toHaveClass(
        'rf-card',
        `rf-card--surface-${surface}`,
      );
      await expectNoAccessibilityViolations(container);
    },
  );

  it.each(['none', 'compact', 'default', 'spacious'] as const)(
    'applies the %s padding treatment',
    (padding) => {
      render(<Card padding={padding}>Card content</Card>);

      expect(screen.getByText('Card content')).toHaveClass(`rf-card--padding-${padding}`);
    },
  );

  it.each(['none', 'structural', 'control'] as const)(
    'applies the %s border treatment',
    (border) => {
      render(<Card border={border}>Card content</Card>);

      expect(screen.getByText('Card content')).toHaveClass(`rf-card--border-${border}`);
    },
  );

  it('offers interactive presentation without adding fake button semantics', () => {
    render(<Card interactive>Visual link grouping</Card>);

    const card = screen.getByText('Visual link grouping');
    expect(card).toHaveClass('rf-card--interactive');
    expect(card).not.toHaveAttribute('role');
    expect(card).not.toHaveAttribute('tabindex');
    expect(screen.queryByRole('button', { name: 'Visual link grouping' })).toBeNull();
  });

  it('forwards native HTML attributes to its selected element', () => {
    render(
      <Card
        aria-describedby="finding-context"
        as="article"
        data-finding-id="42"
        id="finding-42"
        title="Read the complete finding"
      >
        Finding
      </Card>,
    );

    const card = screen.getByText('Finding');
    expect(card).toHaveAttribute('id', 'finding-42');
    expect(card).toHaveAttribute('title', 'Read the complete finding');
    expect(card).toHaveAttribute('aria-describedby', 'finding-context');
    expect(card).toHaveAttribute('data-finding-id', '42');
  });
});
