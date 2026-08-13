'use client';

import { createContext, useCallback, useMemo, useState } from 'react';

import LoadingScreen from '../components/LoadingScreen';

export interface ILoadingContextValue {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

export const LoadingContext = createContext<ILoadingContextValue | null>(null);

interface ILoadingProviderProps {
  children: React.ReactNode;
}

const LoadingProvider = ({ children }: ILoadingProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = useCallback(() => setIsLoading(true), []);
  const hideLoading = useCallback(() => setIsLoading(false), []);

  const value = useMemo(() => ({ isLoading, showLoading, hideLoading }), [isLoading, showLoading, hideLoading]);

  return (
    <LoadingContext.Provider value={value}>
      {isLoading && <LoadingScreen />}
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
