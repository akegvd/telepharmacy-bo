import { ChatLlmConfigError, getChatCompletion } from './llmClient';

describe('getChatCompletion', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, CHAT_LLM_API_KEY: 'test-key' };
    global.fetch = jest.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it('throws ChatLlmConfigError when the API key is missing', async () => {
    delete process.env.CHAT_LLM_API_KEY;

    await expect(getChatCompletion([{ role: 'user', content: 'hi' }])).rejects.toBeInstanceOf(ChatLlmConfigError);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns the assistant message content on success', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'There are 3 pending tasks.' } }] }),
    });

    const answer = await getChatCompletion([{ role: 'user', content: 'How many tasks are pending?' }]);

    expect(answer).toBe('There are 3 pending tasks.');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.groq.com/openai/v1/chat/completions',
      expect.objectContaining({ method: 'POST', headers: expect.objectContaining({ Authorization: 'Bearer test-key' }) })
    );
  });

  it('throws when the HTTP response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 });

    await expect(getChatCompletion([{ role: 'user', content: 'hi' }])).rejects.toThrow('Chat LLM request failed (500)');
  });

  it('throws when the response has no message content', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ choices: [] }) });

    await expect(getChatCompletion([{ role: 'user', content: 'hi' }])).rejects.toThrow(
      'Chat LLM returned an empty response.'
    );
  });
});
