import { renderHook } from '@testing-library/react';
import { useSnackbar } from 'notistack';

import { useToast } from './useToast';

jest.mock('notistack', () => ({
  useSnackbar: jest.fn(),
}));

const mockUseSnackbar = jest.mocked(useSnackbar);
const mockEnqueueSnackbar = jest.fn();
const mockCloseSnackbar = jest.fn();

describe('useToast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSnackbar.mockReturnValue({
      enqueueSnackbar: mockEnqueueSnackbar,
      closeSnackbar: mockCloseSnackbar,
    } as unknown as ReturnType<typeof useSnackbar>);
  });

  it('returns showToast and closeToast functions', () => {
    const { result } = renderHook(() => useToast());

    expect(typeof result.current.showToast).toBe('function');
    expect(typeof result.current.closeToast).toBe('function');
  });

  it('delegates showToast to notistack enqueueSnackbar', () => {
    const { result } = renderHook(() => useToast());

    result.current.showToast('Advanced to In progress.', { variant: 'success' });

    expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Advanced to In progress.', { variant: 'success' });
  });

  it('delegates closeToast to notistack closeSnackbar', () => {
    const { result } = renderHook(() => useToast());

    result.current.closeToast('toast-1');

    expect(mockCloseSnackbar).toHaveBeenCalledWith('toast-1');
  });

  it('keeps a stable reference for showToast across renders', () => {
    const { result, rerender } = renderHook(() => useToast());
    const firstShowToast = result.current.showToast;

    rerender();

    expect(result.current.showToast).toBe(firstShowToast);
  });
});
