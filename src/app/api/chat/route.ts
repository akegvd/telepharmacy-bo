import { NextRequest, NextResponse } from 'next/server';

import { buildTaskContext, IChatTaskContext } from './_lib/buildTaskContext';
import { ChatLlmConfigError, getChatCompletion } from './_lib/llmClient';

export const dynamic = 'force-dynamic';

const buildSystemPrompt = (context: IChatTaskContext): string =>
  [
    'You are an assistant for a telepharmacy admin dashboard.',
    'Answer questions about consultation requests using ONLY the JSON data below — never invent numbers or tasks.',
    "If the data doesn't contain the answer, say so instead of guessing.",
    'Keep answers short and factual.',
    '',
    JSON.stringify(context),
  ].join('\n');

export const POST = async (request: NextRequest) => {
  const body = await request.json().catch(() => null);
  const message = typeof body?.message === 'string' ? body.message.trim() : '';

  if (!message) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 });
  }

  try {
    const context = buildTaskContext();
    const answer = await getChatCompletion([
      { role: 'system', content: buildSystemPrompt(context) },
      { role: 'user', content: message },
    ]);

    return NextResponse.json({ answer }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof ChatLlmConfigError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }

    return NextResponse.json({ error: 'Failed to get a response from the chat assistant.' }, { status: 502 });
  }
};
