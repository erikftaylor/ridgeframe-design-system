import axe from 'axe-core';
import { expect } from 'vitest';

export async function expectNoAccessibilityViolations(
  context: Element | Document = document
): Promise<void> {
  const results = await axe.run(context, {
    rules: {
      'color-contrast': { enabled: false },
    },
  });
  expect(results.violations).toEqual([]);
}
