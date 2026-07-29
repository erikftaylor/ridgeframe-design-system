import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import * as publicComponents from '../../../../components';
import { expectNoAccessibilityViolations } from '../../../../test/accessibility';
import { Gallery } from '../Gallery';
import { AnnotatedScreen } from './AnnotatedScreen';
import { FindingsCard } from './FindingsCard';
import { PriorityMap } from './PriorityMap';

const finding = {
  evidence: 'Seven of twelve participants missed the account control.',
  impact: 'Customers cannot confirm their billing contact before renewal.',
  problem: 'The account control is visually detached from its heading.',
  recommendation: 'Move the control into the account summary and name the action directly.',
} as const;

const annotations = [
  {
    detail: 'The control label does not describe the destination.',
    title: 'Rename the action',
  },
  {
    detail: 'The status appears after unrelated account metadata.',
    title: 'Move status beside the heading',
  },
] as const;

const priorities = [
  {
    effort: 'Low' as const,
    severity: 'Critical' as const,
    title: 'Restore renewal confirmation',
  },
  {
    effort: 'Medium' as const,
    severity: 'High' as const,
    title: 'Clarify the account summary',
  },
  {
    effort: 'High' as const,
    severity: 'Medium' as const,
    title: 'Consolidate secondary metadata',
  },
] as const;

afterEach(cleanup);

describe('FindingsCard', () => {
  it.each(['Critical', 'High', 'Medium'] as const)(
    'preserves the evidence sequence and renders the %s severity as text',
    (severity) => {
      const { container } = render(
        <FindingsCard {...finding} severity={severity} title="Account review" />,
      );

      expect(screen.getByText(severity, { selector: '.rf-findings-card__severity' })).toBeVisible();
      expect(
        [...container.querySelectorAll('.rf-findings-card__step')].map((step) =>
          within(step as HTMLElement).getByRole('heading', { level: 4 }).textContent,
        ),
      ).toEqual(['Problem', 'Evidence', 'Impact', 'Recommendation']);
    },
  );

  it('supports an inverse evidence surface without dropping textual severity', () => {
    const { container } = render(
      <FindingsCard {...finding} severity="High" surface="inverse" title="Inverse account review" />,
    );

    expect(container.querySelector('.rf-card--surface-inverse')).toBeInTheDocument();
    expect(screen.getByText('High', { selector: '.rf-findings-card__severity' })).toBeVisible();
  });

  it('moves its title and evidence-step headings together when nested below a group heading', () => {
    render(
      <FindingsCard
        {...finding}
        severity="High"
        title="Nested account review"
        titleLevel={4}
      />,
    );

    expect(screen.getByRole('heading', { level: 4, name: 'Nested account review' })).toBeVisible();
    ['Problem', 'Evidence', 'Impact', 'Recommendation'].forEach((label) =>
      expect(screen.getByRole('heading', { level: 5, name: label })).toBeVisible(),
    );
  });
});

describe('AnnotatedScreen', () => {
  it('pairs each numbered marker with ordered explanatory text and a caption', () => {
    render(
      <AnnotatedScreen
        annotations={annotations}
        caption="Neutral account interface used to review hierarchy and labeling."
        title="Account settings review"
      />,
    );

    const figure = screen.getByRole('figure', { name: /neutral account interface/i });
    const orderedList = within(figure).getByRole('list', { name: /annotation details/i });
    const explanations = within(orderedList).getAllByRole('listitem');

    expect(within(figure).getByText('Neutral account interface used to review hierarchy and labeling.')).toBeVisible();
    expect(explanations).toHaveLength(annotations.length);
    annotations.forEach((annotation, index) => {
      const number = index + 1;
      expect(within(figure).getByLabelText(`Annotation ${number}`)).toHaveTextContent(String(number));
      expect(explanations[index]).toHaveTextContent(`${number}`);
      expect(explanations[index]).toHaveTextContent(annotation.title);
      expect(explanations[index]).toHaveTextContent(annotation.detail);
    });
  });

  it('supports a level-four title when nested below a composition group', () => {
    render(
      <AnnotatedScreen
        annotations={annotations}
        caption="Neutral account interface."
        title="Nested annotation review"
        titleLevel={4}
      />,
    );

    expect(screen.getByRole('heading', { level: 4, name: 'Nested annotation review' })).toBeVisible();
  });

  it.each([
    ['zero', []],
    [
      'four',
      [
        ...annotations,
        { detail: 'A third control lacks a visible relationship.', title: 'Group the action' },
        { detail: 'A fourth marker has no defined position.', title: 'Remove excess detail' },
      ],
    ],
  ] as const)('rejects %s annotations outside the supported one-to-three range', (_, invalid) => {
    expect(() =>
      render(
        <AnnotatedScreen
          annotations={invalid as unknown as typeof annotations}
          caption="Neutral account interface."
          title="Unsupported annotation count"
        />,
      ),
    ).toThrow('AnnotatedScreen supports between one and three annotations.');
  });
});

describe('PriorityMap', () => {
  it('provides a linear fallback with explicit severity and effort for every priority', () => {
    render(<PriorityMap items={priorities} title="Priority excerpt" />);

    const fallback = screen.getByRole('list', { name: /linear priority reading order/i });
    const rows = within(fallback).getAllByRole('listitem');

    expect(rows).toHaveLength(priorities.length);
    priorities.forEach((priority, index) => {
      expect(rows[index]).toHaveTextContent(priority.title);
      expect(rows[index]).toHaveTextContent(`Severity: ${priority.severity}`);
      expect(rows[index]).toHaveTextContent(`Effort: ${priority.effort}`);
    });
  });

  it('keeps duplicate-coordinate priorities in an always-visible linear representation', () => {
    render(
      <PriorityMap
        items={[
          { effort: 'Low', severity: 'Critical', title: 'Restore renewal confirmation' },
          { effort: 'Low', severity: 'Critical', title: 'Repair confirmation messaging' },
        ]}
        title="Colliding priorities"
        titleLevel={4}
      />,
    );

    expect(screen.getByRole('heading', { level: 4, name: 'Colliding priorities' })).toBeVisible();
    const fallback = screen.getByRole('list', { name: /linear priority reading order/i });
    expect(fallback).toHaveAttribute('data-visual-fallback', 'always-visible');
    expect(fallback).not.toHaveAttribute('aria-hidden');
    expect(within(fallback).getByText('Restore renewal confirmation')).toBeVisible();
    expect(within(fallback).getByText('Repair confirmation messaging')).toBeVisible();
  });
});

describe('gallery-local composition boundary', () => {
  it('does not add evidence compositions to the public component API', () => {
    expect(publicComponents).not.toHaveProperty('FindingsCard');
    expect(publicComponents).not.toHaveProperty('AnnotatedScreen');
    expect(publicComponents).not.toHaveProperty('PriorityMap');
  });
});

describe('representative composition accessibility', () => {
  it('has no detectable violations', async () => {
    const { container } = render(
      <main>
        <h1>Evidence review</h1>
        <section>
          <h2>Findings</h2>
          <FindingsCard {...finding} severity="Critical" title="Account review" />
        </section>
        <section>
          <h2>Annotations</h2>
          <AnnotatedScreen
            annotations={annotations}
            caption="Neutral account interface used to review hierarchy and labeling."
            title="Account settings review"
          />
        </section>
        <section>
          <h2>Priorities</h2>
          <PriorityMap items={priorities} title="Priority excerpt" />
        </section>
      </main>,
    );

    await expectNoAccessibilityViolations(container);
  });
});

describe('component gallery coverage', () => {
  it('exposes review anchors, state guidance, surfaces, and color-pair decisions', () => {
    render(<Gallery />);

    ['Mobile · 0–767px', 'Tablet · 768–1023px', 'Desktop · 1024–1439px', 'Wide · 1440px+'].forEach(
      (label) => expect(screen.getByRole('link', { name: label })).toBeVisible(),
    );
    ['Button', 'Link', 'Card', 'SectionShell'].forEach((name) =>
      expect(screen.getByRole('heading', { name, level: 2 })).toBeVisible(),
    );
    expect(screen.getByRole('heading', { name: 'Evidence compositions', level: 2 })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Keyboard and motion review', level: 2 })).toBeVisible();
    expect(screen.getByText(/Tab and Shift\+Tab/i)).toBeVisible();
    expect(screen.getByText(/prefers-reduced-motion/i)).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Admitted pairs', level: 3 })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Prohibited pairs', level: 3 })).toBeVisible();
  });

  it.each(['light', 'inverse'] as const)(
    'shows every meaningful Button specimen on the %s surface',
    (surface) => {
      const { container } = render(<Gallery />);
      const stateGroup = container.querySelector<HTMLElement>(
        `[data-gallery-component="button"][data-gallery-surface="${surface}"]`,
      );

      expect(stateGroup).toBeInTheDocument();
      expect(
        [...stateGroup!.querySelectorAll<HTMLElement>('[data-gallery-state]')].map(
          (specimen) => specimen.dataset.galleryState,
        ),
      ).toEqual([
        'primary',
        'secondary',
        'tertiary',
        'hover',
        'focus-visible',
        'active',
        'loading',
        'disabled',
      ]);

      if (surface === 'inverse') {
        stateGroup!.querySelectorAll('.rf-button').forEach((button) =>
          expect(button).toHaveClass('rf-button--surface-inverse'),
        );
      }
    },
  );

  it('shows explicit Link hover and active specimens', () => {
    const { container } = render(<Gallery />);

    expect(
      container.querySelector('[data-gallery-component="link"][data-gallery-state="hover"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-gallery-component="link"][data-gallery-state="active"]'),
    ).toBeInTheDocument();
  });

  it('resolves every in-page gallery link to a real target', () => {
    const { container } = render(<Gallery />);
    const inPageLinks = [...container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];

    expect(inPageLinks.length).toBeGreaterThan(0);
    inPageLinks.forEach((link) => {
      const targetId = link.getAttribute('href')?.slice(1);
      expect(targetId, `${link.textContent} has an empty fragment`).toBeTruthy();
      expect(
        document.getElementById(targetId!),
        `${link.textContent} does not resolve to #${targetId}`,
      ).toBeInTheDocument();
    });
  });

  it('includes a full-bleed SectionShell specimen for viewport-edge QA', () => {
    const { container } = render(<Gallery />);
    const specimen = container.querySelector<HTMLElement>('[data-gallery-width="full-bleed"]');

    expect(specimen).toBeInTheDocument();
    expect(
      specimen?.querySelector('.rf-section-shell__container--full-bleed'),
    ).toBeInTheDocument();
    expect(specimen?.parentElement).toBe(container.querySelector('main'));
    expect(within(specimen!).getByRole('heading', { level: 2 })).toHaveTextContent('Full-bleed');
  });

  it.each([
    ['findings-card', 'Findings Card'],
    ['annotated-screen', 'Annotated Screen'],
    ['priority-map', 'Priority Map'],
  ] as const)(
    'shows %s on every required surface beneath its group heading',
    (composition, groupName) => {
      const { container } = render(<Gallery />);
      const groupHeading = screen.getByRole('heading', { level: 3, name: groupName });
      const group = groupHeading.closest('section');
      const specimens = [
        ...group!.querySelectorAll<HTMLElement>(`[data-gallery-composition="${composition}"]`),
      ];

      expect(specimens.map((specimen) => specimen.dataset.gallerySurface)).toEqual([
        'default',
        'subtle-emphasis',
        'inverse',
      ]);
      specimens.forEach((specimen) =>
        expect(within(specimen).getByRole('heading', { level: 4 })).toBeVisible(),
      );
      expect(group).toBeInTheDocument();
      expect(container).toContainElement(groupHeading);
    },
  );

  it('uses level-five evidence-step headings beneath nested Findings Card titles', () => {
    render(<Gallery />);
    const findingsGroup = screen.getByRole('heading', { level: 3, name: 'Findings Card' }).closest('section');

    expect(within(findingsGroup!).getAllByRole('heading', { level: 4 })).toHaveLength(3);
    expect(within(findingsGroup!).getAllByRole('heading', { level: 5 })).toHaveLength(12);
  });

  it('keeps each demonstrated section within the persistent teal-signal budget', () => {
    const { container } = render(<Gallery />);

    const budgetedSections = container.querySelectorAll<HTMLElement>('[data-teal-budget]');
    expect(budgetedSections.length).toBeGreaterThan(0);
    budgetedSections.forEach((section) => {
      const budget = Number(section.dataset.tealBudget);
      const signalCount =
        section.querySelectorAll('[data-teal-signal="persistent"]').length +
        Number(section.matches('[data-teal-signal="persistent"]'));
      expect(signalCount).toBeLessThanOrEqual(budget);
    });
  });
});
