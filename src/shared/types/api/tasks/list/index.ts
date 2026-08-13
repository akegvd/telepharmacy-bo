import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';
import TASK_STATUS from '@/shared/enums/api/tasks/status';

export interface ITaskListRequestParams {
  customerName_like?: string;
  serviceType?: SERVICE_TYPE;
  status?: TASK_STATUS;
  createdAt_gte?: string;
  createdAt_lte?: string;
}
