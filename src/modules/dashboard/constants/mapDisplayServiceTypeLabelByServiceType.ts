import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';

export const mapDisplayServiceTypeLabelByServiceType: Record<SERVICE_TYPE, string> = {
  [SERVICE_TYPE.VIDEO_CALL]: 'Video call',
  [SERVICE_TYPE.VOICE_CALL]: 'Voice call',
  [SERVICE_TYPE.CHAT]: 'Chat',
};
