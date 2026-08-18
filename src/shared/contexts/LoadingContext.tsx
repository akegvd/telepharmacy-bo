'use client';

import { createContext, useState } from 'react';

import { LoadingScreen } from '../components/LoadingScreen';

export interface ILoadingContextValue {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

export const LoadingContext = createContext<ILoadingContextValue | null>(null);

interface ILoadingProviderProps {
  children: React.ReactNode;
}

export const LoadingProvider = ({ children }: ILoadingProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  const value = { isLoading, showLoading, hideLoading };

  return (
    <LoadingContext.Provider value={value}>
      {isLoading && <LoadingScreen />}
      {children}
    </LoadingContext.Provider>
  );
};
