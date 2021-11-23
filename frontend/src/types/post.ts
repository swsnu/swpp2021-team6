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

export interface PostEntity {
  postId: number;
  hostId: number;
  exerciseName: ExerciseType | string;
  expectedLevel: SkillLevelType | string;
  title: string;
  description: string;
  meetAt: string;
  minCapacity: number;
  maxCapacity: number;
  memberCount: number;
  place: PlaceType;
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
