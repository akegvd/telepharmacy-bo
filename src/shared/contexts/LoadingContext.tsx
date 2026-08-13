'use client';

import { createContext, useCallback, useMemo, useState } from 'react';

import { LoadingScreen } from '../components/LoadingScreen';

export interface ILoadingContextValue {
  isLoading: boolean;
  show: () => void;
  hide: () => void;
}

export const LoadingContext = createContext<ILoadingContextValue | null>(null);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const show = useCallback(() => setIsLoading(true), []);
  const hide = useCallback(() => setIsLoading(false), []);

  const value = useMemo(() => ({ isLoading, show, hide }), [isLoading, show, hide]);

  return (
    <LoadingContext.Provider value={value}>
      {isLoading && <LoadingScreen />}
      {children}
    </LoadingContext.Provider>
  );
}
