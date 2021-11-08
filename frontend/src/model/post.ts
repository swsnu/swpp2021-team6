import { ExerciseType, ExpectedLevelType } from './type';

export interface PostEntity {
  // hostId: number;
  exercise: ExerciseType;
  expectedLevel: ExpectedLevelType;
  title: string;
  description: string;
  meetAt: string;
  placeName: string;
  latitude: number;
  logitude: number;
  minCapacity: number;
  maxCapacity: number;
  status: string;
  kakaotalkLink: string;
}

export interface CreatePostEntity {
  exerciseType: ExerciseType | string;
  expectedLevel: ExpectedLevelType | string;
  title: string;
  description: string;
  meetAt: string;
  minCapacity: number;
  maxCapacity: number;
  kakaotalkLink: string;
  placeName: string;
  latitude: number;
  longitude: number;
}
