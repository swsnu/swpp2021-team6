export type ExerciseType =
  | '축구'
  | '농구'
  | '배드민턴'
  | '테니스'
  | '탁구'
  | '러닝'
  | '라이딩';

export type ExpectedLevelType = '상' | '중' | '하' | '상관 없음';

export type PlaceType = {
  name: string;
  latitude: number;
  longitude: number;
  gu: string;
  dong: string;
  address: string | null;
  telephone: string | null;
};

export interface PostEntity {
  postId: number;
  hostId: number;
  exerciseName: ExerciseType | string;
  expectedLevel: ExpectedLevelType | string;
  title: string;
  description: string;
  meetAt: string;
  minCapacity: number;
  maxCapacity: number;
  memberCount: number;
  place: PlaceType;
  kakaotalkLink: string;
  status: string;
  keywords: string[];
}

export interface CreatePostEntity {
  exerciseName: ExerciseType | string;
  expectedLevel: ExpectedLevelType | string;
  title: string;
  description: string;
  meetAt: string;
  minCapacity: number;
  maxCapacity: number;
  place: PlaceType;
  kakaotalkLink: string;
}

export interface UpdatePostEntity {
  title?: string;
  description?: string;
}
