import { NextRequest, NextResponse } from 'next/server';

import { addRandomTask, ITaskListQueryParams, listTasks } from './_lib/tasksStore';

export const dynamic = 'force-dynamic';

const QUERY_PARAM_KEYS: (keyof ITaskListQueryParams)[] = [
  'customerName_like',
  'serviceType',
  'status',
  'createdAt_gte',
  'createdAt_lte',
];

const parseListQuery = (searchParams: URLSearchParams): ITaskListQueryParams => {
  const query: ITaskListQueryParams = {};

  for (const key of QUERY_PARAM_KEYS) {
    const value = searchParams.get(key);

    if (value) {
      query[key] = value;
    }
  }

  return query;
};

export const GET = (request: NextRequest) => {
  const query = parseListQuery(request.nextUrl.searchParams);

  return NextResponse.json(listTasks(query), { headers: { 'Cache-Control': 'no-store' } });
};

export const POST = () => {
  if (process.env.NEXT_PUBLIC_ENABLE_DEV_API_CONTROLS !== 'true') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(addRandomTask(), { status: 201, headers: { 'Cache-Control': 'no-store' } });
};
