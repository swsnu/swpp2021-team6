/* eslint-disable react/no-array-index-key */
import { ReactNode, useState } from 'react';
import { History } from 'history';
import './index.scss';

const Filter = () => {
  const exercises = [
    '축구',
    '농구',
    '배드민턴',
    '테니스',
    '탁구',
    '러닝',
    '라이딩',
  ];

  const [exerciseCheckbox, setExerciseCheckbox] = useState<any[]>([]);

  const renderExerciseCheckBoxLists: ReactNode = () => {
    exercises.map((value, index) => (
      <div key={index}>
        <span>{value}</span>
        <input
          type="checkbox"
          onChange={() => handleExerciseToggle(value)}
          checked={exerciseCheckbox.indexOf(value) !== -1}
          value={value}
        />
      </div>
    ));
  };
  const handleExerciseToggle = (value: any) => {
    const currentIndex = exerciseCheckbox.indexOf(value);
    const newChecked = [...exerciseCheckbox];
    if (newChecked.length >= 1) {
      if (currentIndex === -1) {
        console.log(newChecked);
        alert('운동은 하나만 선택해주세요.');
        return;
      }
    }
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setExerciseCheckbox(newChecked);
    console.log(newChecked);
    // props.handleFilters(newChecked);
  };

  const onClickFilter = () => {
    console.log('hi');
  };

  return (
    <div className="filter-box">
      <div>
        {exercises.map((value, index) => (
          <div key={index}>
            <span>{value}</span>
            <input
              type="checkbox"
              onChange={() => handleExerciseToggle(value)}
              checked={exerciseCheckbox.indexOf(value) !== -1}
              value={value}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;
