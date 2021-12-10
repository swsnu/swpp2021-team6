export const NotiType = {
  requestParticipation: 'request participation',
  requestApproved: 'request approved',
  requestDenied: 'request denied',
  comment: 'comment',
} as const;

export type NotificationType = typeof NotiType[keyof typeof NotiType];

export interface NotificationEntity {
  notiId: number;
  notiType: NotificationType;
  postId: number;
  postTitle: string;
  isRead: boolean;
  createdAt: string;
}
