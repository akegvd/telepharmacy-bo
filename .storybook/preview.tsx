import { SnackbarProvider } from '../src/shared/components/SnackbarProvider';
import { LoadingProvider } from '../src/shared/contexts/LoadingContext';
import { AppThemeProvider } from '../src/theme';

import type { Preview } from '@storybook/nextjs-vite';

const preview: Preview = {
  decorators: [
    (Story) => (
      <AppThemeProvider>
        <LoadingProvider>
          <SnackbarProvider>
            <Story />
          </SnackbarProvider>
        </LoadingProvider>
      </AppThemeProvider>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
