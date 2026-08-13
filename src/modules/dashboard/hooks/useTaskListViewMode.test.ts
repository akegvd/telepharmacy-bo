import { act, renderHook } from '@testing-library/react';

import { useTaskListViewMode } from './useTaskListViewMode';

describe('useTaskListViewMode', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('hydrates from localStorage after mount', async () => {
    window.localStorage.setItem('dashboard:taskListViewMode', JSON.stringify('grid'));

    const { result } = renderHook(() => useTaskListViewMode());

    await act(async () => {});

    expect(result.current[0]).toBe('grid');
  });

  it('defaults to table view when nothing is stored', async () => {
    const { result } = renderHook(() => useTaskListViewMode());

    await act(async () => {});

    expect(result.current[0]).toBe('table');
  });

  it('updates state and persists the choice when changed', async () => {
    const { result } = renderHook(() => useTaskListViewMode());

    await act(async () => {});
    act(() => {
      result.current[1]('grid');
    });

    expect(result.current[0]).toBe('grid');
    expect(window.localStorage.getItem('dashboard:taskListViewMode')).toBe(JSON.stringify('grid'));
  });
});
