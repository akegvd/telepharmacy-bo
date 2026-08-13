import { NextResponse } from 'next/server';

import { listTasks } from './_lib/tasksStore';

export const dynamic = 'force-dynamic';

export const GET = () => {
  return NextResponse.json(listTasks(), { headers: { 'Cache-Control': 'no-store' } });
};
