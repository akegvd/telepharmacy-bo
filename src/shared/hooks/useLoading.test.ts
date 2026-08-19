import { act, renderHook } from '@testing-library/react';
import { createElement, ReactNode } from 'react';

import LoadingProvider from '../contexts/LoadingContext';

import { useLoading } from './useLoading';

interface IWrapperProps {
  children: ReactNode;
}

describe('useLoading', () => {
  const wrapper = ({ children }: IWrapperProps) => createElement(LoadingProvider, null, children);

  it('throws when used outside of a LoadingProvider', () => {
    expect(() => renderHook(() => useLoading())).toThrow('useLoading must be used within a LoadingProvider');
  });

  it('returns the loading context value when used within a LoadingProvider', () => {
    const { result } = renderHook(() => useLoading(), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(typeof result.current.showLoading).toBe('function');
    expect(typeof result.current.hideLoading).toBe('function');
  });

  it('sets isLoading to true when showLoading is called', () => {
    const { result } = renderHook(() => useLoading(), { wrapper });

    act(() => {
      result.current.showLoading();
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('sets isLoading back to false when hideLoading is called after showLoading', () => {
    const { result } = renderHook(() => useLoading(), { wrapper });

    act(() => {
      result.current.showLoading();
    });
    act(() => {
      result.current.hideLoading();
    });

    expect(result.current.isLoading).toBe(false);
  });
});
