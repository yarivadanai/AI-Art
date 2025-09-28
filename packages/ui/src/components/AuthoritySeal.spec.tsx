import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthoritySeal } from './AuthoritySeal';

describe('AuthoritySeal', () => {
  it('renders an accessible seal graphic', () => {
    render(<AuthoritySeal />);

    const seal = screen.getByRole('img', { name: /authority seal/i });
    expect(seal).toBeInTheDocument();
  });
});
