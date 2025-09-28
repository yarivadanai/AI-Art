import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SessionTimer } from './SessionTimer';

describe('SessionTimer', () => {
  it('counts down once per second', () => {
    vi.useFakeTimers();
    const handler = vi.fn();

    render(<SessionTimer durationSeconds={3} onTick={handler} />);
    expect(screen.getByText('00:03')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(handler).toHaveBeenCalledWith(2);
    expect(screen.getByText('00:02')).toBeInTheDocument();

    vi.useRealTimers();
  });
});
