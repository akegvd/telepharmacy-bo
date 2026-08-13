import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AutoRefreshControl from './AutoRefreshControl';

const INTERVAL_MS = 15_000;

describe('AutoRefreshControl', () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: new Date('2026-08-09T09:00:00.000Z') });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('counts down the seconds until the next auto-refresh', () => {
    render(
      <AutoRefreshControl
        isPaused={false}
        isRefreshing={false}
        dataUpdatedAt={Date.now()}
        intervalMs={INTERVAL_MS}
        onTogglePause={jest.fn()}
        onRefreshNow={jest.fn()}
      />
    );

    expect(screen.getByText('Refreshing in 15s')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(5_000);
    });

    expect(screen.getByText('Refreshing in 10s')).toBeInTheDocument();
  });

  it('shows a paused message and stops counting down when paused', () => {
    render(
      <AutoRefreshControl
        isPaused
        isRefreshing={false}
        dataUpdatedAt={Date.now()}
        intervalMs={INTERVAL_MS}
        onTogglePause={jest.fn()}
        onRefreshNow={jest.fn()}
      />
    );

    expect(screen.getByText('Auto-refresh paused')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(5_000);
    });

    expect(screen.getByText('Auto-refresh paused')).toBeInTheDocument();
  });

  it('calls onTogglePause when the pause/resume button is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onTogglePause = jest.fn();

    render(
      <AutoRefreshControl
        isPaused={false}
        isRefreshing={false}
        dataUpdatedAt={Date.now()}
        intervalMs={INTERVAL_MS}
        onTogglePause={onTogglePause}
        onRefreshNow={jest.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Pause auto-refresh' }));

    expect(onTogglePause).toHaveBeenCalledTimes(1);
  });

  it('shows a resume affordance once paused', () => {
    render(
      <AutoRefreshControl
        isPaused
        isRefreshing={false}
        dataUpdatedAt={Date.now()}
        intervalMs={INTERVAL_MS}
        onTogglePause={jest.fn()}
        onRefreshNow={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Resume auto-refresh' })).toBeInTheDocument();
  });

  it('calls onRefreshNow when the refresh button is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onRefreshNow = jest.fn();

    render(
      <AutoRefreshControl
        isPaused={false}
        isRefreshing={false}
        dataUpdatedAt={Date.now()}
        intervalMs={INTERVAL_MS}
        onTogglePause={jest.fn()}
        onRefreshNow={onRefreshNow}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Refresh now' }));

    expect(onRefreshNow).toHaveBeenCalledTimes(1);
  });

  it('disables the refresh button while a refresh is in flight', () => {
    render(
      <AutoRefreshControl
        isPaused={false}
        isRefreshing
        dataUpdatedAt={Date.now()}
        intervalMs={INTERVAL_MS}
        onTogglePause={jest.fn()}
        onRefreshNow={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Refresh now' })).toBeDisabled();
  });
});
