import { AxiosResponse } from 'axios';

import chatApiEndpoints from '@/shared/constants/apiEndpoints/chat';
import axiosInstance from '@/shared/services/axios';
import { IChatRequest, IChatResponse } from '@/shared/types/api/chat';
import { IActionOptions } from '@/shared/types/service';

export const sendChatMessage = (message: string, options?: IActionOptions): Promise<IChatResponse> =>
  axiosInstance
    .post<IChatResponse, AxiosResponse<IChatResponse>, IChatRequest>(
      chatApiEndpoints.send,
      { message },
      { signal: options?.controller?.signal }
    )
    .then((res) => res.data);
