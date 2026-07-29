import { describe, expect, it } from 'vitest';
import * as components from './index';

describe('v0.1 public component contract', () => {
  it('exports exactly four primitives', () => {
    expect(Object.keys(components).sort()).toEqual(
      ['Button', 'Card', 'Link', 'SectionShell'].sort(),
    );
  });
});
