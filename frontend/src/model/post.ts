import { exerciseType, expectedLevelType } from './type';

export interface PostEntity {
  exerciseType: exerciseType;
  expectedLevel: expectedLevelType;
  meetAt: string;
  title: string;
  description: string;
  minCapacity: number;
  maxCapacity: number;
  kakaotalkLink: string;
  status: string;
  latitude: number;
  logitude: number;
  place: string;
}

export interface PostInputDTO {
  exerciseType: exerciseType | string;
  expectedLevel: expectedLevelType;
  meetAt: string;
  title: string;
  description: string;
  minCapacity: number;
  maxCapacity: number;
  kakaotalkLink: string;
  latitude: number;
  longitude: number;
  place: string;
}
