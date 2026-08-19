'use client';

import SendIcon from '@mui/icons-material/Send';
import { Alert, Box, IconButton, Stack, TextField, Typography } from '@mui/material';
import { FormEvent, useRef, useState } from 'react';

import { useSendChatMessageMutation } from '../hooks/useSendChatMessageMutation';
import { IChatMessage } from '../types/chatMessage';

import { ChatMessage } from './ChatMessage';

export const ChatPanel = () => {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const nextIdRef = useRef(0);
  const { mutate, isPending, isError } = useSendChatMessageMutation();

  const createMessageId = () => {
    nextIdRef.current += 1;

    return `msg-${nextIdRef.current}`;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const content = draft.trim();
    if (!content || isPending) {
      return;
    }

    setMessages((prev) => [...prev, { id: createMessageId(), role: 'user', content }]);
    setDraft('');

    mutate(content, {
      onSuccess: (response) => {
        setMessages((prev) => [...prev, { id: createMessageId(), role: 'assistant', content: response.answer }]);
      },
    });
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Typography variant="h6" component="h2">
        Ask about your data
      </Typography>

      <Stack spacing={1} sx={{ maxHeight: 320, minHeight: 120, overflowY: 'auto' }}>
        {messages.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            Ask a question about the tasks in the dashboard, e.g. &quot;How many tasks are still pending?&quot;
          </Typography>
        )}
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </Stack>

      {isError && <Alert severity="error">Something went wrong. Please try again.</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Ask a question about your data..."
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          disabled={isPending}
        />
        <IconButton type="submit" color="primary" disabled={isPending || !draft.trim()} aria-label="Send message">
          <SendIcon />
        </IconButton>
      </Box>
    </Stack>
  );
};
