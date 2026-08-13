import { render, screen } from '@testing-library/react';
import { type ReactNode } from 'react';

import { SnackbarProvider } from './SnackbarProvider';
import { Toast } from './Toast';

const mockNotistackProviderProps: Record<string, unknown> = {};

jest.mock('notistack', () => ({
  SnackbarProvider: ({ children, ...props }: { children: ReactNode }) => {
    Object.assign(mockNotistackProviderProps, props);
    return <div data-testid="notistack-snackbar-provider">{children}</div>;
  },
}));

describe('SnackbarProvider', () => {
  beforeEach(() => {
    Object.keys(mockNotistackProviderProps).forEach((key) => {
      delete mockNotistackProviderProps[key];
    });
  });

  it('renders its children inside the notistack provider', () => {
    render(
      <SnackbarProvider>
        <div data-testid="child-content">children</div>
      </SnackbarProvider>
    );

    expect(screen.getByTestId('notistack-snackbar-provider')).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('passes the toast config to the notistack provider', () => {
    render(
      <SnackbarProvider>
        <div />
      </SnackbarProvider>
    );

    expect(mockNotistackProviderProps.maxSnack).toBe(1);
    expect(mockNotistackProviderProps.anchorOrigin).toEqual({ vertical: 'top', horizontal: 'right' });
    expect(mockNotistackProviderProps.autoHideDuration).toBe(4000);
  });

  it('renders Toast for every notistack variant', () => {
    render(
      <SnackbarProvider>
        <div />
      </SnackbarProvider>
    );

    const components = mockNotistackProviderProps.Components as Record<string, unknown>;
    expect(components.default).toBe(Toast);
    expect(components.success).toBe(Toast);
    expect(components.error).toBe(Toast);
    expect(components.warning).toBe(Toast);
    expect(components.info).toBe(Toast);
  });
});
