'use client';

import ChatIcon from '@mui/icons-material/ChatBubbleOutline';
import { Fab, styled } from '@mui/material';
import { useState } from 'react';

import { Modal } from '@/shared/components/Modal';

import { ChatPanel } from './ChatPanel';

const LauncherFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  right: theme.spacing(3),
  bottom: theme.spacing(3),
}));

export const ChatLauncherButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <LauncherFab color="primary" aria-label="Ask AI about your data" onClick={() => setIsOpen(true)}>
        <ChatIcon />
      </LauncherFab>

      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <ChatPanel />
      </Modal>
    </>
  );
};
