import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';
import TASK_STATUS from '@/shared/enums/api/tasks/status';
import { ITaskItemResponse } from '@/shared/types/api/tasks';

import { mapDisplayStatusColorByStatus } from '../../constants/mapDisplayStatusColorByStatus';
import DATA_ISSUE from '../../enums/dataIssue';
import { makeTask } from '../../mocks/taskFixtures';
import { ITransformTaskItemResponse } from '../../types/utils/transforms/transformTaskListResponse';
import { formatTaskDate } from '../taskDisplay';

import {
  buildTaskListSummary,
  transformTaskItemResponse,
  transformTaskListResponse,
} from './transformTaskListResponse';

describe('transformTaskItemResponse', () => {
  it('passes clean data through with display fields and no issues', () => {
    const result = transformTaskItemResponse({
      id: '1',
      customerName: 'Somchai P.',
      serviceType: SERVICE_TYPE.VIDEO_CALL,
      symptom: 'Persistent dry cough',
      status: TASK_STATUS.NEW,
      createdAt: '2026-08-09T09:12:00.000Z',
    });

    expect(result).toMatchObject({
      id: '1',
      customerName: 'Somchai P.',
      displayCustomerName: 'Somchai P.',
      serviceType: 'video_call',
      displayServiceType: 'Video call',
      status: 'new',
      displayStatus: 'New',
      displayStatusColor: 'info',
      symptom: 'Persistent dry cough',
      displaySymptom: 'Persistent dry cough',
      displayCreatedAt: formatTaskDate('2026-08-09T09:12:00.000Z'),
      nextStatus: TASK_STATUS.IN_PROGRESS,
      displayNextStatus: 'In progress',
      displayNextStatusColor: mapDisplayStatusColorByStatus[TASK_STATUS.IN_PROGRESS],
      issues: [],
    });
  });

  it('shows a missing customerName as blank instead of rendering null/undefined, and flags it', () => {
    const result = transformTaskItemResponse({
      id: '7',
      customerName: null,
      serviceType: SERVICE_TYPE.VOICE_CALL,
      symptom: 'Headache',
      status: TASK_STATUS.NEW,
      createdAt: '2026-08-09T11:18:00.000Z',
    });

    expect(result?.customerName).toBeNull();
    expect(result?.displayCustomerName).toBe('');
    expect(result?.issues).toContain('missing_name');
    expect(result?.nextStatus).toBeNull();
  });

  it('flags an unrecognized serviceType but keeps showing the raw value from the source data', () => {
    const result = transformTaskItemResponse({
      id: '8',
      customerName: 'Niran D.',
      serviceType: 'phone_call',
      symptom: 'Fever',
      status: TASK_STATUS.NEW,
      createdAt: '2026-08-09T06:47:00.000Z',
    } as unknown as ITaskItemResponse);

    expect(result?.serviceType).toBe('phone_call');
    expect(result?.displayServiceType).toBe('phone_call');
    expect(result?.issues).toContain('unknown_service_type');
    expect(result?.nextStatus).toBeNull();
  });

  it('flags an unrecognized status but keeps showing the raw value, without coercing it into the workflow', () => {
    const result = transformTaskItemResponse({
      id: '9',
      customerName: 'Suda R.',
      serviceType: SERVICE_TYPE.VIDEO_CALL,
      symptom: 'Follow-up',
      status: 'pending_review',
      createdAt: '2026-08-08T09:00:00.000Z',
    } as unknown as ITaskItemResponse);

    expect(result?.status).toBe('pending_review');
    expect(result?.displayStatus).toBe('pending_review');
    expect(result?.displayStatusColor).toBeNull();
    expect(result?.issues).toContain('unknown_status');
    expect(result?.nextStatus).toBeNull();
  });

  it('flags a blank symptom but keeps it blank instead of substituting placeholder text', () => {
    const result = transformTaskItemResponse({
      id: '10',
      customerName: 'Boonmee L.',
      serviceType: SERVICE_TYPE.CHAT,
      symptom: '',
      status: TASK_STATUS.NEW,
      createdAt: '2026-08-09T12:41:00.000Z',
    });

    expect(result?.displaySymptom).toBe('');
    expect(result?.issues).toContain('missing_symptom');
    expect(result?.nextStatus).toBeNull();
  });

  it('turns an unparseable createdAt into a blank display value, and flags it', () => {
    const result = transformTaskItemResponse({
      id: '11',
      customerName: 'Kanya H.',
      serviceType: SERVICE_TYPE.VOICE_CALL,
      symptom: 'Nausea',
      status: TASK_STATUS.IN_PROGRESS,
      createdAt: 'not-a-real-date',
    });

    expect(result?.displayCreatedAt).toBe('');
    expect(result?.issues).toContain('invalid_date');
    expect(result?.nextStatus).toBeNull();
  });

  it('turns a missing createdAt field into a blank display value, and flags it', () => {
    const result = transformTaskItemResponse({
      id: '13',
      customerName: 'Areeya B.',
      serviceType: SERVICE_TYPE.CHAT,
      symptom: 'Question about missed dose',
      status: TASK_STATUS.NEW,
    } as unknown as ITaskItemResponse);

    expect(result?.displayCreatedAt).toBe('');
    expect(result?.issues).toContain('invalid_date');
  });

  it('returns null for a record with no usable id', () => {
    expect(transformTaskItemResponse({ customerName: 'No id' })).toBeNull();
  });
});

describe('transformTaskListResponse', () => {
  it('keeps every row, including duplicate ids, without flagging them', () => {
    const { taskList } = transformTaskListResponse([
      {
        id: '1',
        customerName: 'First',
        serviceType: SERVICE_TYPE.CHAT,
        symptom: 'a',
        status: TASK_STATUS.NEW,
        createdAt: '2026-08-09T09:00:00.000Z',
      },
      {
        id: '1',
        customerName: 'Duplicate',
        serviceType: SERVICE_TYPE.CHAT,
        symptom: 'b',
        status: TASK_STATUS.NEW,
        createdAt: '2026-08-09T10:00:00.000Z',
      },
      {
        id: '2',
        customerName: 'Unrelated',
        serviceType: SERVICE_TYPE.CHAT,
        symptom: 'c',
        status: TASK_STATUS.NEW,
        createdAt: '2026-08-09T10:00:00.000Z',
      },
    ]);

    expect(taskList).toHaveLength(3);
    expect(taskList[0].customerName).toBe('First');
    expect(taskList[1].customerName).toBe('Duplicate');
  });

  it('includes a summary alongside the task list', () => {
    const { summary } = transformTaskListResponse([
      {
        id: '1',
        customerName: 'First',
        serviceType: SERVICE_TYPE.CHAT,
        symptom: 'a',
        status: TASK_STATUS.NEW,
        createdAt: '2026-08-09T09:00:00.000Z',
      },
    ]);

    expect(summary).toEqual({
      total: 1,
      flaggedCount: 0,
      statusCounts: { [TASK_STATUS.NEW]: 1, [TASK_STATUS.IN_PROGRESS]: 0, [TASK_STATUS.COMPLETED]: 0 },
    });
  });

  it("throws instead of silently dropping entries that can't be transformed into a task", () => {
    expect(() => transformTaskListResponse([null, 'not a task', 42] as unknown as ITaskItemResponse[])).toThrow();
  });
});

describe('buildTaskListSummary', () => {
  it('counts tasks per status and totals', () => {
    const summary = buildTaskListSummary([
      makeTask({ id: '1', status: TASK_STATUS.NEW }),
      makeTask({ id: '2', status: TASK_STATUS.NEW }),
      makeTask({ id: '3', status: TASK_STATUS.IN_PROGRESS }),
    ]);

    expect(summary).toEqual({
      total: 3,
      flaggedCount: 0,
      statusCounts: { [TASK_STATUS.NEW]: 2, [TASK_STATUS.IN_PROGRESS]: 1, [TASK_STATUS.COMPLETED]: 0 },
    });
  });

  it('counts flagged tasks and ignores unrecognized statuses in statusCounts', () => {
    const summary = buildTaskListSummary([
      makeTask({
        id: '1',
        status: 'pending_review' as ITransformTaskItemResponse['status'],
        issues: [DATA_ISSUE.UNKNOWN_STATUS],
      }),
      makeTask({ id: '2', status: TASK_STATUS.NEW, issues: [DATA_ISSUE.MISSING_NAME] }),
    ]);

    expect(summary.total).toBe(2);
    expect(summary.flaggedCount).toBe(2);
    expect(summary.statusCounts[TASK_STATUS.NEW]).toBe(1);
  });
});
