import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';
import TASK_STATUS from '@/shared/enums/api/tasks/status';

import { ITaskRecord } from './taskRecord';

export interface IRandomTaskRecord extends ITaskRecord {
  id: string;
  customerName: string;
  serviceType: SERVICE_TYPE;
  symptom: string;
  status: TASK_STATUS;
  createdAt: string;
}

const customerNameList = [
  'Areeya Suksan',
  'Ben Halloran',
  'Chalermchai Nont',
  'Daniela Rossi',
  'Ekkarat Phumin',
  'Grace Okafor',
  'Hiroshi Tanaka',
  'Isabel Moreno',
  'Kamon Tepsuwan',
  'Liam O’Sullivan',
  'Malee Chanthara',
  'Nadia Haddad',
  'Peerapat Wongsa',
  'Rachel Lindqvist',
  'Siriporn Anan',
  'Tomasz Nowak',
];

const symptomList = [
  'Recurring headache since the weekend',
  'Rash spreading on both forearms',
  'Needs a refill for thyroid medication',
  'Persistent heartburn after meals',
  'Asking whether two prescriptions can be combined',
  'Lightheaded when standing up quickly',
  'Sore throat with mild fever for two days',
  'Follow-up on antibiotic course finishing today',
  'Numbness in fingers overnight',
  'Wants advice on motion sickness before a flight',
];

// Only known enum values, so a generated task never trips the dashboard's data-issue flags.
const serviceTypeList = Object.values(SERVICE_TYPE);
const statusList = Object.values(TASK_STATUS);

const pickRandom = <T>(list: readonly T[]): T => {
  return list[Math.floor(Math.random() * list.length)];
};

export const createRandomTaskRecord = (id: string): IRandomTaskRecord => {
  return {
    id,
    customerName: pickRandom(customerNameList),
    serviceType: pickRandom(serviceTypeList),
    symptom: pickRandom(symptomList),
    status: pickRandom(statusList),
    createdAt: new Date().toISOString(),
  };
};
