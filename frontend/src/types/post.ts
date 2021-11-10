import { ExerciseType, ExpectedLevelType } from './exercise';

export interface PostEntity {
  id: number;
  // hostId: number;
  exercise: ExerciseType | string;
  expected_level: ExpectedLevelType | string;
  title: string;
  description: string;
  meet_at: string;
  place_name: string;
  gu: string;
  dong: string;
  latitude: number;
  longitude: number;
  member_count: number;
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
