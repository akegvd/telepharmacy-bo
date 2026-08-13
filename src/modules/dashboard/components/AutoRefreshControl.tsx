'use client';

import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RefreshIcon from '@mui/icons-material/Refresh';
import { IconButton, Stack, styled, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

interface IAutoRefreshControlProps {
  isPaused: boolean;
  isRefreshing: boolean;
  dataUpdatedAt: number;
  intervalMs: number;
  onTogglePause: () => void;
  onRefreshNow: () => void;
}

const Root = styled(Stack)({
  alignItems: 'center',
});

const getSecondsUntilRefresh = (dataUpdatedAt: number, intervalMs: number) =>
  Math.max(0, Math.ceil((dataUpdatedAt + intervalMs - Date.now()) / 1000));

const AutoRefreshControl = ({
  isPaused,
  isRefreshing,
  dataUpdatedAt,
  intervalMs,
  onTogglePause,
  onRefreshNow,
}: IAutoRefreshControlProps) => {
  // Ticks once a second to force a re-render; the countdown itself is derived from
  // dataUpdatedAt/intervalMs below rather than stored, so it never drifts out of sync.
  const [, tick] = useState(0);
  const secondsUntilRefresh = getSecondsUntilRefresh(dataUpdatedAt, intervalMs);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const timer = setInterval(() => tick((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <Root direction="row" spacing={0.5}>
      <Typography variant="caption" color="text.secondary">
        {isPaused ? 'Auto-refresh paused' : `Refreshing in ${secondsUntilRefresh}s`}
      </Typography>
      <Tooltip title={isPaused ? 'Resume auto-refresh' : 'Pause auto-refresh'}>
        <IconButton
          size="small"
          aria-label={isPaused ? 'Resume auto-refresh' : 'Pause auto-refresh'}
          onClick={onTogglePause}
        >
          {isPaused ? <PlayArrowIcon fontSize="small" /> : <PauseIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Refresh now">
        <span>
          <IconButton size="small" aria-label="Refresh now" onClick={onRefreshNow} disabled={isRefreshing}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Root>
  );
};

export default AutoRefreshControl;
