import { act, renderHook } from '@testing-library/react';
import { createElement, ReactNode } from 'react';

import { LoadingProvider } from '../contexts/LoadingContext';

import { useLoading } from './useLoading';

describe('useLoading', () => {
  const wrapper = ({ children }: { children: ReactNode }) => createElement(LoadingProvider, null, children);

  it('throws when used outside of a LoadingProvider', () => {
    expect(() => renderHook(() => useLoading())).toThrow('useLoading must be used within a LoadingProvider');
  });

  it('returns the loading context value when used within a LoadingProvider', () => {
    const { result } = renderHook(() => useLoading(), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(typeof result.current.show).toBe('function');
    expect(typeof result.current.hide).toBe('function');
  });

  it('sets isLoading to true when show is called', () => {
    const { result } = renderHook(() => useLoading(), { wrapper });

    act(() => {
      result.current.show();
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('sets isLoading back to false when hide is called after show', () => {
    const { result } = renderHook(() => useLoading(), { wrapper });

    act(() => {
      result.current.show();
    });
    act(() => {
      result.current.hide();
    });

    expect(result.current.isLoading).toBe(false);
  });
});
