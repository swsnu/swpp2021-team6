import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker, TimePicker } from 'antd';
import moment, { Moment } from 'moment';
import { History } from 'history';
import { CreatePostEntity } from '../../types/post';
import 'antd/dist/antd.css';
import * as actionCreators from '../../store/actions';
import getGuDong from '../../utils/getGuDong';
import { AppState } from '../../store/store';
import { getKakaoMap } from '../../utils/getKakaoMap';

const initialPostState: CreatePostEntity = {
  exerciseName: '축구',
  expectedLevel: '상관 없음',
  title: '',
  description: '',
  meetAt: '',
  minCapacity: 1,
  maxCapacity: 10,
  place: {
    name: '',
    latitude: 0,
    longitude: 0,
    gu: '',
    dong: '',
    address: '',
    telephone: '',
  },
  kakaotalkLink: '',
};

interface Props {
  history: History;
}

const PostCreate = ({ history }: Props) => {
  const { user } = useSelector((state: AppState) => state.user);

  const [post, setPost] = useState<CreatePostEntity>(initialPostState);
  const [date, setDate] = useState<Moment | null>(moment());
  const [time, setTime] = useState<Moment | null>(moment('7:00', 'h:mm a'));

  // 지도 검색 관련 state
  const [keyword, setKeyword] = useState<string>();
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [center, setCenter] = useState({
    La: 126.952281,
    Ma: 37.480584,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (user === null) history.push('/signin');
    else {
      const container = document.getElementById('map');
      getKakaoMap(container, user.latitude, user.longitude, setCenter);
    }
  }, [user]);

  useEffect(() => {
    if (date && time) {
      setPost({
        ...post,
        meetAt: `${date?.format('YYYY-MM-DD')} ${time?.format('HH:mm')}`,
      });
    }
  }, [date, time]);

  const onChangeMinCapacity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const changedMinCapacity = Number(e.target.value);
    if (changedMinCapacity > post.maxCapacity) {
      alert('최대 모집 인원을 초과할 수 없습니다');
    } else {
      setPost({ ...post, minCapacity: changedMinCapacity });
    }
  };

  const onChangeMaxCapacity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const changedMaxCapacity = Number(e.target.value);
    if (changedMaxCapacity < post.minCapacity) {
      alert('최소 모집 인원 미만일 수 없습니다');
    } else {
      setPost({ ...post, maxCapacity: changedMaxCapacity });
    }
  };

  const onClickSetPlace = () => {
    const { place_name, x, y, road_address_name, phone } = selectedPlace;
    getGuDong(x, y).then((value) => {
      const { gu, dong } = value;
      setPost({
        ...post,
        place: {
          ...post.place,
          gu,
          dong,
          name: place_name,
          latitude: y,
          longitude: x,
          address: road_address_name,
          telephone: phone,
        },
      });
    });

    alert('장소 정보가 입력되었습니다');
  };

  const onClickSearch = () => {
    const container = document.getElementById('map');
    getKakaoMap(
      container,
      center.Ma,
      center.La,
      setCenter,
      setSelectedPlace,
      keyword,
    );
  };

  const onclickSubmit = () => {
    if (!post.title) {
      alert('제목을 입력해주세요');
    } else if (!post.description) {
      alert('설명을 입력해주세요');
    } else if (!post.kakaotalkLink) {
      alert('카카오톡 오픈채팅방 링크를 입력해주세요');
    } else if (!/[open.kakao.com]/.test(post.kakaotalkLink)) {
      alert('올바른 링크를 입력해주세요');
    } else if (
      !post.place.name ||
      !post.place.latitude ||
      !post.place.longitude
    ) {
      alert('운동 장소를 설정해주세요');
    } else {
      dispatch(actionCreators.createPost(post));
    }
  };

  return (
    <form>
      <h1>새 포스트 작성하기</h1>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="exerciseType">종목 : </label>
        <select
          name="exerciseType"
          id="exerciseType"
          value={post.exerciseName}
          onChange={(e) => setPost({ ...post, exerciseName: e.target.value })}
        >
          <option value="축구">축구</option>
          <option value="농구">농구</option>
          <option value="배드민턴">배드민턴</option>
          <option value="테니스">테니스</option>
          <option value="탁구">탁구</option>
          <option value="러닝">러닝</option>
          <option value="라이딩">라이딩</option>
        </select>
        <label htmlFor="expectedLevel">모집 실력 : </label>
        <select
          name="expectedLevel"
          id="expectedLevel"
          defaultValue={post.expectedLevel}
          onChange={(e) => setPost({ ...post, expectedLevel: e.target.value })}
        >
          <option value="상">상</option>
          <option value="중">중</option>
          <option value="하">하</option>
          <option value="상관 없음">상관 없음</option>
        </select>
      </div>

      <input
        placeholder="제목"
        onChange={(e) => setPost({ ...post, title: e.target.value })}
      />
      <div>
        <div>Date & Time</div>
        <DatePicker
          value={date}
          onChange={(e) => setDate(e)}
          allowClear={false}
        />
        <TimePicker
          format="h:mm a"
          minuteStep={10}
          defaultValue={moment('7:00', 'h:mm a')}
          allowClear={false}
          use12Hours
          onChange={(e) => setTime(e)}
        />
        <div>Num of People</div>
        <label htmlFor="min-capacity">모집 인원 : 최소 </label>
        <input
          id="min-capacity"
          type="number"
          min="1"
          max="10"
          value={post.minCapacity}
          onChange={(e) => onChangeMinCapacity(e)}
        />
        <label htmlFor="max-capacity"> 명 ~ 최대 </label>
        <input
          id="max-capacity"
          type="number"
          min="1"
          max="10"
          value={post.maxCapacity}
          onChange={(e) => onChangeMaxCapacity(e)}
        />
        <span> 명</span>
      </div>
      <textarea
        placeholder="설명"
        onChange={(e) => setPost({ ...post, description: e.target.value })}
      />
      <label>카카오톡 오픈채팅 : </label>
      <input
        placeholder="초대 링크를 입력해주세요"
        onChange={(e) => setPost({ ...post, kakaotalkLink: e.target.value })}
      />
      <div className="map-container" style={{ display: 'flex' }}>
        <div id="map" style={{ width: '500px', height: '350px' }} />
        <div
          className="map-container-right"
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <div>
            <input
              placeholder="검색어를 입력하세요"
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="button" onClick={onClickSearch}>
              검색
            </button>
          </div>
          {!selectedPlace && <div>검색어를 입력해 장소를 선택해주세요</div>}
          {selectedPlace && (
            <div>
              <p>{selectedPlace.place_name}</p>
              <p>{selectedPlace.road_address_name}</p>
              <p>{selectedPlace.phone}</p>
              <button type="button" onClick={onClickSetPlace}>
                확인
              </button>
            </div>
          )}
        </div>
      </div>
      <button type="button" onClick={onclickSubmit}>
        등록하기
      </button>
    </form>
  );
};

export default PostCreate;
