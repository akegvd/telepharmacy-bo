import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';
import TASK_STATUS from '@/shared/enums/api/tasks/status';

export interface ITaskItemResponse {
  id?: string | number;
  customerName?: string | null;
  serviceType?: SERVICE_TYPE;
  symptom?: string;
  status?: TASK_STATUS;
  createdAt?: string;
}
