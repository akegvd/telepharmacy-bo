import { NextRequest, NextResponse } from 'next/server';

import { findTask, patchTask } from '../_lib/tasksStore';

export const dynamic = 'force-dynamic';

export const GET = async (_request: NextRequest, { params }: RouteContext<'/api/tasks/[id]'>) => {
  const { id } = await params;
  const task = findTask(id);

  if (!task) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(task, { headers: { 'Cache-Control': 'no-store' } });
};

export const PATCH = async (request: NextRequest, { params }: RouteContext<'/api/tasks/[id]'>) => {
  const { id } = await params;
  const patch = await request.json();
  const task = patchTask(id, patch);

  if (!task) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(task, { headers: { 'Cache-Control': 'no-store' } });
};
