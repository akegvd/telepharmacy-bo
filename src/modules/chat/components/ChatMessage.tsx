import { Box, Paper, Typography } from '@mui/material';

import { IChatMessage } from '../types/chatMessage';

interface IChatMessageProps {
  message: IChatMessage;
}

export const ChatMessage = ({ message }: IChatMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <Box sx={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <Paper
        variant={isUser ? 'elevation' : 'outlined'}
        elevation={isUser ? 2 : 0}
        sx={{
          px: 1.5,
          py: 1,
          maxWidth: '80%',
          bgcolor: isUser ? 'primary.main' : 'background.paper',
          color: isUser ? 'primary.contrastText' : 'text.primary',
        }}
      >
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
          {message.content}
        </Typography>
      </Paper>
    </Box>
  );
};
