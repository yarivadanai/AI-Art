import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { GridPainter } from './GridPainter';

describe('GridPainter', () => {
  it('renders a grid and toggles values with keyboard', () => {
    const grid = [
      [0, 1],
      [1, 0],
    ];
    const handleChange = vi.fn();
    render(<GridPainter grid={grid} onChange={handleChange} />);

    const firstCell = screen.getAllByRole('gridcell')[0];
    firstCell.focus();
    fireEvent.keyDown(firstCell, { key: 'Enter' });

    expect(handleChange).toHaveBeenCalled();
    const nextGrid = handleChange.mock.calls[0][0] as number[][];
    expect(nextGrid[0][0]).toBe(1);
  });

  it('cycles focus with arrow keys', () => {
    const grid = [
      [0, 0],
      [0, 0],
    ];
    render(<GridPainter grid={grid} onChange={() => {}} />);

    const [firstCell, secondCell] = screen.getAllByRole('gridcell');
    firstCell.focus();
    fireEvent.keyDown(firstCell, { key: 'ArrowRight', preventDefault: () => {} });
    expect(secondCell).toHaveFocus();
  });
});
