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
