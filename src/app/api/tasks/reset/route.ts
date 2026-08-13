import { NextResponse } from 'next/server';

import { resetTasks } from '../_lib/tasksStore';

export const dynamic = 'force-dynamic';

// Static segment, so it takes precedence over /api/tasks/[id] rather than reading as an id.
export const POST = () => {
  if (process.env.NEXT_PUBLIC_ENABLE_DEV_API_CONTROLS !== 'true') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(resetTasks(), { headers: { 'Cache-Control': 'no-store' } });
};
