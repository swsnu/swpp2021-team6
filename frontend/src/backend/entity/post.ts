import { ExerciseType, SkillLevelType } from './exercise';

export type PlaceType = {
  name: string;
  latitude: number;
  longitude: number;
  gu: string;
  dong: string;
  address: string | null;
  telephone: string | null;
};

export type ParticipantType = {
  userId: number;
  userName: string;
  status: string;
};

export interface PostEntity {
  postId: number;
  hostId: number;
  hostName: string;
  exerciseName: ExerciseType | string;
  expectedLevel: SkillLevelType | string;
  title: string;
  description: string;
  meetAt: string;
  minCapacity: number;
  maxCapacity: number;
  memberCount: number;
  place: PlaceType;
  participants: ParticipantType[];
  kakaotalkLink: string;
  status: string;
  keywords: string[];
}

export interface CreatePostEntity {
  exerciseName: ExerciseType | string;
  expectedLevel: SkillLevelType | string;
  title: string;
  description: string;
  meetAt: string;
  minCapacity: number;
  maxCapacity: number;
  place: PlaceType;
  kakaotalkLink: string;
}

export interface UpdatePostDTO {
  title?: string;
  description?: string;
}

export const ApplyStatus = {
  PENDING: '승인 대기 중',
  ACCEPTED: '승인됨',
  DECLINED: '거절됨',
} as const;

export type StatusType = typeof ApplyStatus[keyof typeof ApplyStatus];

export interface UpdateKeywordDTO {
  keyword1: string | null;
  keyword2: string | null;
  keyword3: string | null;
}
