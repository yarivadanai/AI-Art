'use client';

import clsx from 'clsx';
import { useCallback, useMemo, useRef, useState } from 'react';

export interface GridPainterProps {
  grid: number[][];
  palette?: string[];
  ariaLabel?: string;
  onChange?: (next: number[][]) => void;
  className?: string;
  cellSize?: number;
  readOnly?: boolean;
}

const DEFAULT_PALETTE = ['#0f172a', '#38bdf8', '#f97316', '#22c55e', '#facc15', '#f472b6'];

export function GridPainter({
  grid,
  palette = DEFAULT_PALETTE,
  ariaLabel = 'Grid painter',
  onChange,
  className,
  cellSize = 28,
  readOnly = false,
}: GridPainterProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [focusCell, setFocusCell] = useState<{ row: number; col: number } | null>(null);
  const maxValue = palette.length - 1;

  const normalizedGrid = useMemo(() => grid.map((row) => [...row]), [grid]);

  const updateCell = useCallback(
    (row: number, col: number, nextValue: number) => {
      if (readOnly || !onChange) {
        return;
      }
      const clone = normalizedGrid.map((r, rIndex) =>
        r.map((value, cIndex) => (rIndex === row && cIndex === col ? nextValue : value)),
      );
      onChange(clone);
    },
    [normalizedGrid, onChange, readOnly],
  );

  const cycleCell = useCallback(
    (row: number, col: number) => {
      const current = normalizedGrid[row]?.[col] ?? 0;
      const next = current >= maxValue ? 0 : current + 1;
      updateCell(row, col, next);
    },
    [normalizedGrid, maxValue, updateCell],
  );

  const focus = useCallback((row: number, col: number) => {
    if (!containerRef.current) return;
    const button = containerRef.current.querySelector<HTMLElement>(
      `[data-row="${row}"][data-col="${col}"]`,
    );
    button?.focus();
    setFocusCell({ row, col });
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, row: number, col: number) => {
      if (!containerRef.current) return;

      const { key } = event;
      const rows = normalizedGrid.length;
      const cols = normalizedGrid[0]?.length ?? 0;

      if (key === ' ' || key === 'Enter') {
        event.preventDefault();
        cycleCell(row, col);
        return;
      }

      const focusMap: Record<string, () => void> = {
        ArrowUp: () => {
          const nextRow = row > 0 ? row - 1 : rows - 1;
          focus(nextRow, col);
        },
        ArrowDown: () => {
          const nextRow = row < rows - 1 ? row + 1 : 0;
          focus(nextRow, col);
        },
        ArrowLeft: () => {
          const nextCol = col > 0 ? col - 1 : cols - 1;
          focus(row, nextCol);
        },
        ArrowRight: () => {
          const nextCol = col < cols - 1 ? col + 1 : 0;
          focus(row, nextCol);
        },
      };

      if (focusMap[key]) {
        event.preventDefault();
        focusMap[key]!();
      }
    },
    [cycleCell, normalizedGrid, focus],
  );

  const handlePointer = useCallback(
    (row: number, col: number) => {
      cycleCell(row, col);
      setFocusCell({ row, col });
    },
    [cycleCell],
  );

  return (
    <div className={clsx('space-y-2 text-xs text-slate-400', className)}>
      <div
        ref={containerRef}
        role="grid"
        aria-label={ariaLabel}
        className="inline-grid gap-[1px] rounded-md border border-slate-700 bg-slate-900/60 p-[2px]"
        style={{
          gridTemplateColumns: `repeat(${normalizedGrid[0]?.length ?? 0}, ${cellSize}px)`,
        }}
      >
        {normalizedGrid.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const active = focusCell?.row === rowIndex && focusCell?.col === colIndex;
            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                type="button"
                role="gridcell"
                data-row={rowIndex}
                data-col={colIndex}
                tabIndex={rowIndex === 0 && colIndex === 0 ? 0 : -1}
                aria-label={`Row ${rowIndex + 1} Column ${colIndex + 1} value ${value}`}
                onKeyDown={(event) => handleKeyDown(event, rowIndex, colIndex)}
                onClick={() => handlePointer(rowIndex, colIndex)}
                className={clsx(
                  'h-full w-full rounded-sm border border-slate-800 outline-none transition-transform',
                  !readOnly && 'cursor-pointer active:scale-[0.96]',
                  active && 'ring-authority-500 ring-2 ring-offset-2 ring-offset-slate-950',
                )}
                style={{
                  backgroundColor: palette[value] ?? palette[0] ?? '#0f172a',
                  height: cellSize,
                  width: cellSize,
                }}
              />
            );
          }),
        )}
      </div>
      {!readOnly && (
        <p>
          <span className="font-semibold text-slate-200">Controls:</span> Arrow keys move focus;
          space or enter cycles cell colour.
        </p>
      )}
    </div>
  );
}
