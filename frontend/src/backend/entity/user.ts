import { ExerciseAndSkill } from './exercise';

export type GenderType = '남성' | '여성' | '미선택';

export interface UserEntity {
  id: number;
  nickname: string;
  latitude: number;
  longitude: number;
  gu: string;
  dong: string;
  gender: GenderType;
}

export interface UserSignInInputDTO {
  username: string;
  password: string;
}

export interface UserProfileInfo {
  userId: number;
  nickname: string;
  latitude: number;
  longitude: number;
}

export interface SignUpDTO {
  username: string;
  password: string;
}

export interface SignupInfo {
  userId: number;
}

export interface ProfileDTO {
  latitude: number;
  longitude: number;
  gu: string;
  dong: string;
  gender: GenderType | string;
  nickname: string;
  introduction: string;
  preferredExercise: ExerciseAndSkill[];
}
