import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('test harness', () => {
  it('renders React in jsdom', () => {
    render(<button type="button">Ready</button>);
    expect(screen.getByRole('button', { name: 'Ready' })).toBeInTheDocument();
  });
});
