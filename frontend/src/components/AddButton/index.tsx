import { History } from 'history';
import imgSrc from '../../assets/icon/addButton.png';
import './index.scss';

interface Props {
  history: History;
}

const AddButton = ({ history }: Props) => {
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
