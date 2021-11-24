import React from 'react';
import { History } from 'history';
import { useHistory } from 'react-router';
import imgSrc from '../../assets/icon/addButton.png';
import './index.scss';

const AddButton: React.FC = () => {
  const history = useHistory();

  const onClickAddButton = () => {
    history.push('/post/new');
  };

  return (
    <button className="plus-button" onClick={onClickAddButton}>
      <img src={imgSrc} alt="plus button" />
    </button>
  );
};

export default AddButton;
