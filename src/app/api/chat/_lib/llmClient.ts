/** Thrown when the server has no LLM credentials configured, so callers can surface a clear 503 instead of a generic failure. */
export class ChatLlmConfigError extends Error {}

export interface IChatCompletionMessage {
  role: 'system' | 'user';
  content: string;
}

interface IChatCompletionResponse {
  choices?: { message?: { content?: string } }[];
}

/**
 * Provider-agnostic client for any OpenAI-compatible `/chat/completions` endpoint (Groq,
 * OpenRouter, etc.) — swapping providers is a `CHAT_LLM_*` env change, not a code change.
 */
export const getChatCompletion = async (messages: IChatCompletionMessage[]): Promise<string> => {
  const apiKey = process.env.CHAT_LLM_API_KEY;
  const baseUrl = process.env.CHAT_LLM_BASE_URL ?? 'https://api.groq.com/openai/v1';
  const model = process.env.CHAT_LLM_MODEL ?? 'llama-3.3-70b-versatile';

  if (!apiKey) {
    throw new ChatLlmConfigError('CHAT_LLM_API_KEY is not set.');
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages, temperature: 0 }),
  });

  if (!response.ok) {
    throw new Error(`Chat LLM request failed (${response.status})`);
  }

  const data = (await response.json()) as IChatCompletionResponse;
  const answer = data.choices?.[0]?.message?.content;

  if (!answer) {
    throw new Error('Chat LLM returned an empty response.');
  }

  return answer;
};
