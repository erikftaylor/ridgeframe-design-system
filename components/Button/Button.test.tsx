import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ArrowRight } from 'lucide-react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { expectNoAccessibilityViolations } from '../../test/accessibility';
import { Button } from './Button';

afterEach(cleanup);

describe('Button', () => {
  it('forwards native button props and defaults its type to button', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button aria-describedby="button-description" data-action="save" onClick={onClick}>
        Save changes
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save changes' });
    await user.click(button);

    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-describedby', 'button-description');
    expect(button).toHaveAttribute('data-action', 'save');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it.each(['primary', 'secondary', 'tertiary'] as const)(
    'renders the %s variant as a native button without accessibility violations',
    async (variant) => {
      const { container } = render(<Button variant={variant}>{variant} action</Button>);

      expect(screen.getByRole('button', { name: `${variant} action` })).toHaveClass(
        `rf-button--${variant}`,
      );
      await expectNoAccessibilityViolations(container);
    },
  );

  it('is disabled and cannot be activated when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Archive report
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Archive report' });
    await user.click(button);

    expect(button).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('preserves its accessible name and exposes a loading status while loading', () => {
    render(<Button loading>Save changes</Button>);

    const button = screen.getByRole('button', { name: 'Save changes' });

    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
  });

  it('keeps its label in the layout while showing a dimension-preserving loader', () => {
    const { container } = render(<Button loading>Save changes</Button>);

    expect(screen.getByText('Save changes')).toHaveClass('rf-button__label--loading');
    expect(container.querySelector('.rf-button__loader')).toHaveAttribute('aria-hidden', 'true');
  });

  it('places Lucide-compatible icons in leading and trailing slots', () => {
    const { rerender } = render(
      <Button icon={<ArrowRight data-testid="arrow" />} iconPosition="leading">
        Continue
      </Button>,
    );

    const leadingButton = screen.getByRole('button', { name: 'Continue' });
    expect(leadingButton.firstElementChild).toHaveClass('rf-button__icon--leading');
    expect(screen.getByTestId('arrow').closest('span')).toHaveAttribute('aria-hidden', 'true');

    rerender(
      <Button icon={<ArrowRight data-testid="arrow" />} iconPosition="trailing">
        Continue
      </Button>,
    );

    const trailingButton = screen.getByRole('button', { name: 'Continue' });
    expect(trailingButton.lastElementChild).toHaveClass('rf-button__icon--trailing');
  });

  it('receives keyboard focus while disabled buttons are skipped', async () => {
    const user = userEvent.setup();

    render(
      <>
        <Button>Continue</Button>
        <Button disabled>Unavailable</Button>
      </>,
    );

    await user.tab();
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Unavailable' })).not.toHaveFocus();
  });
});
