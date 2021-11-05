import { exerciseType, expectedLevelType } from './type';

export interface PostEntity {
  exerciseType: exerciseType;
  expectedLevel: expectedLevelType;
  meetAt: string;
  title: string;
  description: string;
  appointmentTime: string;
  minCapacity: number;
  maxCapacity: number;
  kakaotalkLink: string;
  status: string;
  latitude: number;
  logitude: number;
}

export interface PostInputDTO {
  exerciseType: number;
  expectedLevel: expectedLevelType;
  meetAt: string;
  title: string;
  description: string;
  appointmentTime: string;
  minCapacity: number;
  maxCapacity: number;
  kakaotalkLink: string;
  status: string | null;
  latitude: number;
  logitude: number;
}
