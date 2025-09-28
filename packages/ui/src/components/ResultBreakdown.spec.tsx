import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ResultBreakdown, scoreToBand } from './ResultBreakdown';

describe('ResultBreakdown', () => {
  it('renders section scores and band', () => {
    render(
      <ResultBreakdown
        overall={0.72}
        sections={[
          { code: 'A', label: 'Language', score: 0.7 },
          { code: 'B', label: 'Math', score: 0.6 },
        ]}
      />,
    );

    expect(screen.getByText(/Overall Score/)).toBeInTheDocument();
    expect(screen.getByText('A — Language')).toBeInTheDocument();
    expect(screen.getByText(/Proficient/)).toBeInTheDocument();
  });
});

describe('scoreToBand', () => {
  it('maps scores to the right band', () => {
    expect(scoreToBand(0.9)).toBe('Elite');
    expect(scoreToBand(0.75)).toBe('Proficient');
    expect(scoreToBand(0.6)).toBe('Emerging');
    expect(scoreToBand(0.1)).toBe('Flagged');
  });
});
