import { describe, it, expect } from 'vitest';
import { useDebounce } from '../hooks/useDebounce';
import { renderHook, act } from '@testing-library/react';

describe('useDebounce', () => {
  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 100 },
      }
    );

    expect(result.current).toBe('initial');

    // Update value
    rerender({ value: 'updated', delay: 100 });
    expect(result.current).toBe('initial'); // Should still be initial

    // Wait for debounce
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150));
    });

    expect(result.current).toBe('updated');
  });
});
