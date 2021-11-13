import { useDispatch } from 'react-redux';
import './index.scss';

const Filter = () => (
  // const dispatch = useDispatch();

  <div className="filter">
    <h2>정렬</h2>
    <select className="sort-select">
      <option>날짜 순</option>
      <option>거리 순</option>
    </select>
    <h2>필터</h2>
    <select className="filter-select">
      <option disabled selected hidden>
        종목
      </option>
      <option>축구</option>
      <option>농구</option>
      <option>배드민턴</option>
      <option>테니스</option>
      <option>탁구</option>
      <option>러닝</option>
      <option>라이딩</option>
    </select>
    <select>
      <option disabled selected hidden>
        기대 실력
      </option>
      <option>상</option>
      <option>중</option>
      <option>하</option>
      <option>상관 없음</option>
    </select>
    {/* <button>
        <CloseCircleFilled />
      </button> */}
  </div>
);
export default Filter;
