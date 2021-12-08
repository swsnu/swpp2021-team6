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

export const exercises = {
  soccer: {
    name: '축구',
    value: 'soccer',
  },
  basketball: {
    name: '농구',
    value: 'basketball',
  },
  badminton: {
    name: '배드민턴',
    value: 'badminton',
  },
  tennis: {
    name: '테니스',
    value: 'tennis',
  },
  tabletennis: {
    name: '탁구',
    value: 'tabletennis',
  },
  running: {
    name: '러닝',
    value: 'running',
  },
  riding: {
    name: '라이딩',
    value: 'riding',
  },
};
