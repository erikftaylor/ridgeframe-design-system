import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { expectNoAccessibilityViolations } from '../../test/accessibility';
import { SectionShell } from './SectionShell';

afterEach(cleanup);

describe('SectionShell', () => {
  it('renders a section by default with a stable inner container', () => {
    const { container } = render(<SectionShell>Section content</SectionShell>);

    const section = screen.getByText('Section content').closest('section');

    expect(section).toHaveClass('rf-section-shell');
    expect(container.querySelector('.rf-section-shell__container')).toContainElement(
      screen.getByText('Section content'),
    );
  });

  it('associates a supplied heading with its section and has no accessibility violations', async () => {
    const { container } = render(
      <SectionShell heading="How we work">
        <p>We keep the evidence and the recommendation together.</p>
      </SectionShell>,
    );

    const section = screen.getByRole('region', { name: 'How we work' });
    const heading = screen.getByRole('heading', { name: 'How we work' });

    expect(section).toHaveAttribute('aria-labelledby', heading.id);
    await expectNoAccessibilityViolations(container);
  });

  it('uses an explicit accessible label when no heading is supplied', () => {
    render(<SectionShell label="Supporting evidence">Evidence content</SectionShell>);

    expect(screen.getByRole('region', { name: 'Supporting evidence' })).toHaveAttribute(
      'aria-label',
      'Supporting evidence',
    );
  });

  it('preserves a caller-provided heading association when it does not render a heading', () => {
    render(
      <>
        <h2 id="evidence-heading">Supporting evidence</h2>
        <SectionShell aria-labelledby="evidence-heading">Evidence content</SectionShell>
      </>,
    );

    expect(screen.getByRole('region', { name: 'Supporting evidence' })).toHaveAttribute(
      'aria-labelledby',
      'evidence-heading',
    );
  });

  it.each([
    ['main', 'main'],
    ['nav', 'navigation'],
    ['aside', 'complementary'],
  ] as const)('allows the approved %s landmark override', (as, role) => {
      render(<SectionShell as={as} label={`${as} content`}>Landmark content</SectionShell>);

      expect(screen.getByRole(role, { name: `${as} content` })).toHaveTextContent('Landmark content');
    });

  it.each(['nav', 'aside'] as const)('rejects an unnamed %s landmark', (as) => {
    expect(() => render(<SectionShell as={as}>Landmark content</SectionShell>)).toThrow(
      'SectionShell requires an accessible name when rendered as nav or aside.',
    );
  });

  it.each([
    ['section', 'section'],
    ['main', 'main'],
  ] as const)('permits an unnamed %s', (as, element) => {
    const { container } = render(<SectionShell as={as}>Ordinary content</SectionShell>);

    expect(container.querySelector(element)).toHaveTextContent('Ordinary content');
  });

  it.each(['standard', 'reading', 'maximum', 'full-bleed'] as const)(
    'applies the approved %s width to the inner container',
    (width) => {
      const { container } = render(<SectionShell width={width}>Width content</SectionShell>);

      expect(container.querySelector('.rf-section-shell__container')).toHaveClass(
        `rf-section-shell__container--${width}`,
      );
    },
  );

  it('keeps an unframed section free of framing and adds it only when requested', () => {
    const { rerender } = render(<SectionShell>Unframed content</SectionShell>);

    expect(screen.getByText('Unframed content').closest('section')).not.toHaveClass(
      'rf-section-shell--framed',
    );

    rerender(<SectionShell framed>Framed content</SectionShell>);

    expect(screen.getByText('Framed content').closest('section')).toHaveClass(
      'rf-section-shell--framed',
    );
  });

  it.each(['default', 'raised', 'subtle-emphasis', 'inverse'] as const)(
    'applies the %s surface tone without accessibility violations',
    async (surface) => {
      const { container } = render(
        <SectionShell heading={`${surface} section`} surface={surface}>
          Surface content
        </SectionShell>,
      );

      expect(screen.getByRole('region', { name: `${surface} section` })).toHaveClass(
        `rf-section-shell--surface-${surface}`,
      );
      await expectNoAccessibilityViolations(container);
    },
  );

});
