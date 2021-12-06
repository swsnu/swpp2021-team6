import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import {
  skillLevelNameType,
  exerciseNameType,
  FilterInputDTO,
  ExerciseType,
} from '../../backend/entity/exercise';
import './index.scss';
import greenHeart from '../../assets/image/icon/filled-heart.svg';
import sort from '../../assets/image/icon/sort.svg';
import exercise from '../../assets/image/icon/exercise.svg';
import greenCircle from '../../assets/image/icon/green-circle.svg';
import filterDelete from '../../assets/image/icon/filter-delete-button.svg';
import level from '../../assets/image/icon/level.svg';
import search from '../../assets/image/icon/search.svg';

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
  onClickApplyFilter: () => void;
}

const Filter: React.FC<Props> = ({
  filterArray = [],
  setFilterArray,
  onClickApplyFilter,
}: Props) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterInputDTO>({
    exerciseName: '종목',
    skillLevel: '기대 실력',
  });
  const [distance, setDistance] = useState('1');

  useEffect(() => {
    if (
      selectedFilter.exerciseName !== '종목' &&
      selectedFilter.skillLevel !== '기대 실력'
    ) {
      let isDuplicate = false;

      /* Check if there is duplicated filter in filter array */
      for (let i = 0; i < filterArray.length; i++) {
        if (
          filterArray[i].exerciseName === selectedFilter.exerciseName &&
          filterArray[i].skillLevel === selectedFilter.skillLevel
        ) {
          isDuplicate = true;
        }
      }

      if (!isDuplicate) {
        setFilterArray([...filterArray, selectedFilter]);
      }
      setSelectedFilter({ exerciseName: '종목', skillLevel: '기대 실력' });
    }
  }, [selectedFilter]);

  const onClickDeleteFilterContent = (idx: number) => {
    const copiedFilterArray = [...filterArray];
    copiedFilterArray.splice(idx, 1);
    setFilterArray(copiedFilterArray);
  };

  return (
    <div className="filter">
      <div className="filter-header">
        <img src={greenHeart} alt="green heart icon" />
        <span>나의 운동 모임 검색 조건</span>
      </div>
      <div className="filter-body">
        <img src={sort} alt="sort icon" />
        <select id="sort-select">
          <option>가까운 날짜 순</option>
          <option>가까운 거리 순</option>
        </select>
        <img src={exercise} alt="exercise icon" />
        <select
          id="exercise-select"
          value={selectedFilter.exerciseName}
          onChange={(e) =>
            setSelectedFilter({
              ...selectedFilter,
              exerciseName: e.target.value,
            })
          }
        >
          <option id="exercise-default" value="종목" disabled hidden>
            종목
          </option>
          {exerciseNameAndValue.map((elem) => (
            <option key={elem.name} value={elem.value}>
              {elem.name}
            </option>
          ))}
        </select>
        <img src={level} alt="level" />
        <select
          className="level-select"
          value={selectedFilter.skillLevel}
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
      </div>
      <div className="filter-array">
        {filterArray.map((filter, idx) => {
          const filterString = `${
            exerciseNameObj[filter.exerciseName]
          } · 실력 ${skillLevelNameObj[filter.skillLevel]}`;

          return (
            <div className="filter-content" key={filter.exerciseName}>
              <div>
                <img src={greenCircle} alt="green circle" />
                {filterString}
              </div>
              <button onClick={() => onClickDeleteFilterContent(idx)}>
                <img src={filterDelete} alt="filter delete button" />
              </button>
            </div>
          );
        })}
      </div>
      <div className="filter-distance">
        <div className="distance-label">
          <span id="label-text">거리 조정</span>
          <div>
            <span id="label-number" className="green">
              {distance}
            </span>
            <span id="label-metric" className="green">
              km
            </span>
          </div>
        </div>
        <div id="range-container">
          <div id="range-label">
            <span>1km</span>
            <span>3km</span>
            <span>5km</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            step="2"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
        </div>
      </div>
      <button id="filter-apply-btn" type="button" onClick={onClickApplyFilter}>
        <img src={search} alt="search" />
        검색 필터 적용
      </button>
    </div>
  );
};
export default Filter;
