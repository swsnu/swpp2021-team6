export type ExerciseType =
  | '축구'
  | '농구'
  | '배드민턴'
  | '테니스'
  | '탁구'
  | '러닝'
  | '라이딩';

export type SkillLevelType = '상' | '중' | '하' | '상관 없음';

export interface ExerciseAndSkill {
  exerciseName: ExerciseType | string;
  skillLevel: Omit<SkillLevelType, '상관 없음'>;
}

export interface FilterInputDTO {
  exerciseName: ExerciseType | string;
  skillLevel: SkillLevelType | string;
}

export type checkExerciseType = {
  [index: string]: boolean;
  soccer: boolean;
  basketball: boolean;
  tennis: boolean;
  badminton: boolean;
  tabletennis: boolean;
  running: boolean;
  riding: boolean;
};

export type exerciseNameType = {
  [index: string]: string;
  soccer: string;
  basketball: string;
  tennis: string;
  badminton: string;
  tabletennis: string;
  running: string;
  riding: string;
};

export type skillLevelNameType = {
  [index: string]: string;
  high: string;
  middle: string;
  low: string;
  any: string;
};
