import { useMutation } from '@tanstack/react-query';

import { sendChatMessage } from '@/shared/services/api/chat';

export const useSendChatMessageMutation = () =>
  useMutation({
    mutationFn: (message: string) => sendChatMessage(message),
  });
