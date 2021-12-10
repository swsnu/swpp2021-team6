export type NotificationType =
  | 'request participation'
  | 'request approved'
  | 'request denied'
  | 'comment';

export interface NotificationEntity {
  notiId: number;
  notiType: NotificationType;
  postId: number;
  postTitle: string;
  isRead: boolean;
  createdAt: string;
}
