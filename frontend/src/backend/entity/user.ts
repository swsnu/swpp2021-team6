import { ExerciseAndSkill, SkillLevelType } from './exercise';

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

export interface UserPostEntity {
  hostName: string;
  postId: number;
  exerciseName: string;
  title: string;
  meetAt: string;
  placeName: string;
  status: string;
}

export interface UserInfoEntity {
  userId: number;
  nickname: string;
  gu: string;
  dong: string;
  gender: GenderType;
  introduction: string;
  userExercise: ExerciseAndSkill[];
  participatingPost: UserPostEntity[] | null;
  hostingPost: UserPostEntity[] | null;
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

export interface UpdateProfileEntity {
  nickname: string | undefined;
  gu: string | undefined;
  dong: string | undefined;
  introduction: string | undefined;
  userExercise: ExerciseAndSkill[] | undefined;
}
