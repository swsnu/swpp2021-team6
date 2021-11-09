import { ExerciseType, ExpectedLevelType } from './type';

export interface PostEntity {
  // hostId: number;
  exercise: ExerciseType;
  expected_level: ExpectedLevelType;
  title: string;
  description: string;
  meet_at: string;
  place_name: string;
  latitude: number;
  logitude: number;
  min_capacity: number;
  max_capacity: number;
  status: string;
  kakaotalk_link: string;
}

export interface CreatePostEntity {
  exercise: ExerciseType | string;
  expected_level: ExpectedLevelType | string;
  title: string;
  description: string;
  meet_at: string;
  min_capacity: number;
  max_capacity: number;
  kakaotalk_link: string;
  place_name: string;
  latitude: number;
  longitude: number;
}
