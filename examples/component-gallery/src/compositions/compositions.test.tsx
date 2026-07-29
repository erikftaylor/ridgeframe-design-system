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
