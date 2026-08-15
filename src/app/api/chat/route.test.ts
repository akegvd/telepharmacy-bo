import { NextRequest } from 'next/server';

import { buildTaskContext, IChatTaskContext } from './_lib/buildTaskContext';
import { ChatLlmConfigError, getChatCompletion } from './_lib/llmClient';
import { POST } from './route';

jest.mock('./_lib/buildTaskContext');
jest.mock('./_lib/llmClient');

const mockBuildTaskContext = buildTaskContext as jest.MockedFunction<typeof buildTaskContext>;
const mockGetChatCompletion = getChatCompletion as jest.MockedFunction<typeof getChatCompletion>;

const emptyContext: IChatTaskContext = { total: 0, flaggedCount: 0, statusCounts: {}, tasks: [] };

const makeRequest = (body: unknown) =>
  new NextRequest('http://localhost/api/chat', { method: 'POST', body: JSON.stringify(body) });

describe('POST /api/chat', () => {
  beforeEach(() => {
    mockBuildTaskContext.mockReset().mockReturnValue(emptyContext);
    mockGetChatCompletion.mockReset();
  });

  it('returns 400 when the message is missing', async () => {
    const response = await POST(makeRequest({}));

    expect(response.status).toBe(400);
    expect(mockGetChatCompletion).not.toHaveBeenCalled();
  });

  it('returns 400 when the message is blank', async () => {
    const response = await POST(makeRequest({ message: '   ' }));

    expect(response.status).toBe(400);
  });

  it('returns the answer from the LLM client', async () => {
    mockGetChatCompletion.mockResolvedValue('There are no tasks.');

    const response = await POST(makeRequest({ message: 'How many tasks are pending?' }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ answer: 'There are no tasks.' });
  });

  it('returns 503 when the LLM is not configured', async () => {
    mockGetChatCompletion.mockRejectedValue(new ChatLlmConfigError('CHAT_LLM_API_KEY is not set.'));

    const response = await POST(makeRequest({ message: 'hi' }));

    expect(response.status).toBe(503);
  });

  it('returns 502 when the LLM request fails', async () => {
    mockGetChatCompletion.mockRejectedValue(new Error('boom'));

    const response = await POST(makeRequest({ message: 'hi' }));

    expect(response.status).toBe(502);
  });
});
