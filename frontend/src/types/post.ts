import { ExerciseType, ExpectedLevelType } from './exercise';

export type placeType = {
  name: string;
  latitude: number;
  longitude: number;
  gu: string;
  dong: string;
  address: string | null;
  telephone: string | null;
};

export interface PostEntity {
  post_id: number;
  host_id: number;
  exercise_name: ExerciseType | string;
  expected_level: ExpectedLevelType | string;
  title: string;
  description: string;
  meet_at: string;
  min_capacity: number;
  max_capacity: number;
  member_count: number;
  place: placeType;
  kakaotalk_link: string;
  status: string;
  keywords: string[];
}

export interface CreatePostEntity {
  exercise_name: ExerciseType | string;
  expected_level: ExpectedLevelType | string;
  title: string;
  description: string;
  meet_at: string;
  min_capacity: number;
  max_capacity: number;
  place: placeType;
  kakaotalk_link: string;
}
