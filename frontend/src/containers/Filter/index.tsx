import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import './index.scss';
import {
  skillLevelNameType,
  checkExerciseType,
  exerciseNameType,
  FilterInputDTO,
} from '../../backend/entity/exercise';

const exerciseNameAndValue = [
  {
    name: '축구',
    value: 'soccer',
  },
  {
    name: '농구',
    value: 'basketball',
  },
  {
    name: '테니스',
    value: 'tennis',
  },
  {
    name: '배드민턴',
    value: 'badminton',
  },
  {
    name: '탁구',
    value: 'tabletennis',
  },
  {
    name: '러닝',
    value: 'running',
  },
  {
    name: '라이딩',
    value: 'riding',
  },
];

const skillLevelNameAndValue = [
  {
    name: '상',
    value: 'high',
  },
  {
    name: '중',
    value: 'middle',
  },
  {
    name: '하',
    value: 'low',
  },
  {
    name: '상관 없음',
    value: 'any',
  },
];

const exerciseNameObj: exerciseNameType = {
  soccer: '축구',
  basketball: '농구',
  tennis: '테니스',
  tabletennis: '탁구',
  badminton: '배드민턴',
  running: '러닝',
  riding: '라이딩',
};

const skillLevelNameObj: skillLevelNameType = {
  high: '상',
  middle: '중',
  low: '하',
  any: '상관 없음',
};

interface Props {
  filterArray: FilterInputDTO[];
  setFilterArray: Dispatch<SetStateAction<FilterInputDTO[]>>;
}

const Filter: React.FC<Props> = ({
  filterArray = [],
  setFilterArray,
}: Props) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterInputDTO>({
    exerciseName: '종목',
    skillLevel: '기대 실력',
  });
  const [checkExercise, setCheckExercise] = useState<checkExerciseType>({
    soccer: false,
    basketball: false,
    tennis: false,
    badminton: false,
    tabletennis: false,
    running: false,
    riding: false,
  });

  useEffect(() => {
    if (
      selectedFilter.exerciseName !== '종목' &&
      selectedFilter.skillLevel !== '기대 실력'
    ) {
      setFilterArray([...filterArray, selectedFilter]);
      const newCheckExercise = checkExercise;
      newCheckExercise[selectedFilter.exerciseName] = true;
      setCheckExercise(newCheckExercise);
      setSelectedFilter({ exerciseName: '종목', skillLevel: '기대 실력' });
    }
  }, [selectedFilter]);

  const newSelect = (
    <>
      <select
        className="filter-select"
        defaultValue="종목"
        onChange={(e) =>
          setSelectedFilter({ ...selectedFilter, exerciseName: e.target.value })
        }
      >
        <option value="종목" disabled hidden>
          종목
        </option>
        {exerciseNameAndValue.map((elem) => (
          <option
            key={elem.name}
            value={elem.value}
            disabled={checkExercise[elem.value]}
          >
            {elem.name}
          </option>
        ))}
      </select>
      <select
        defaultValue="기대 실력"
        onChange={(e) =>
          setSelectedFilter({ ...selectedFilter, skillLevel: e.target.value })
        }
      >
        <option value="기대 실력" disabled hidden>
          기대 실력
        </option>
        {skillLevelNameAndValue.map((elem) => (
          <option key={elem.name} value={elem.value}>
            {elem.name}
          </option>
        ))}
      </select>
    </>
  );

  return (
    <div className="filter">
      <h2>정렬</h2>
      <select className="sort-select">
        <option>날짜 순</option>
        <option>거리 순</option>
      </select>
      <h2>필터</h2>
      <div className="filter-container">
        {filterArray.map((filter) => (
          <span className="filter-content" key={filter.exerciseName}>
            {exerciseNameObj[filter.exerciseName]},{' '}
            {skillLevelNameObj[filter.skillLevel]} <button>x</button>
          </span>
        ))}
      </div>
      {newSelect}
      <button>필터 적용</button>
    </div>
  );
};
export default Filter;
