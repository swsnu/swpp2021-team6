import { ExerciseAndSkill } from './exercise';

export type GenderType = 'MALE' | 'FEMALE' | 'UNKNOWN';

export interface UserEntity {
  id: number;
  nickname: string;
  latitude: number;
  longitude: number;
  gu: string;
  dong: string;
  gender: string;
}

export interface UserSignInInputDTO {
  username: string;
  password: string;
}

export interface SignUpInputDTO {
  username: string;
  password: string;
  nickname: string;
  latitude: number;
  longitude: number;
  gu: string;
  dong: string;
  gender: GenderType;
  introduction: string;
  preferredExercise: ExerciseAndSkill[];
}
