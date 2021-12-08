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
