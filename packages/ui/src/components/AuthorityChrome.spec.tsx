import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthorityChrome } from './AuthorityChrome';

describe('AuthorityChrome', () => {
  it('wraps content with the authority chrome surfaces', () => {
    const { container, getByText } = render(
      <AuthorityChrome>
        <p>Payload</p>
      </AuthorityChrome>,
    );

    expect(getByText('Payload')).toBeInTheDocument();
    expect(container.querySelector('[class*="radial-gradient"]')).toBeTruthy();
  });
});
