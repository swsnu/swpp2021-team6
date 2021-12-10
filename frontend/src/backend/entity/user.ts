import { ExerciseAndSkill, SkillLevelType } from './exercise';

export type GenderType = '남성' | '여성' | '미선택';

/* SIGN IN */
export interface SignInDTO {
  username: string;
  password: string;
}

/* SIGN UP */
export interface SignUpDTO {
  username: string;
  password: string;
}

// TODO: Remove
// export interface UserProfileInfo {
//   userId: number;
//   nickname: string;
//   latitude: number;
//   longitude: number;
// }
export interface UserIdEntity {
  userId: number;
}

export interface UserProfileDTO {
  latitude: number;
  longitude: number;
  gu: string;
  dong: string;
  gender: GenderType | string;
  nickname: string;
  introduction: string;
  preferredExercise: ExerciseAndSkill[];
}

// TODO: Move to entity/post.ts
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
  latitude: number;
  longitude: number;
  gu: string;
  dong: string;
  gender: GenderType;
  introduction: string;
  preferredExercise: ExerciseAndSkill[];
  participatingPost: UserPostEntity[] | null;
  hostingPost: UserPostEntity[] | null;
}

/* PROFILE EDIT */
export interface UpdateProfileDTO {
  nickname?: string;
  gu?: string;
  dong?: string;
  introduction?: string;
  preferredExercise?: ExerciseAndSkill[];
}
