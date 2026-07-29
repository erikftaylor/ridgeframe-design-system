import axe from 'axe-core';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { expectNoAccessibilityViolations } from './accessibility';

describe('expectNoAccessibilityViolations', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it('disables only axe color-contrast in jsdom', async () => {
    const run = vi.spyOn(axe, 'run');
    const context = document.createElement('main');
    context.innerHTML = '<button type="button">Save</button>';
    document.body.append(context);

    await expectNoAccessibilityViolations(context);

    expect(run).toHaveBeenCalledWith(context, {
      rules: {
        'color-contrast': { enabled: false },
      },
    });
  });
});
