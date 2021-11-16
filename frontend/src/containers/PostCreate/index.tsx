import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DatePicker, TimePicker } from 'antd';
import moment, { Moment } from 'moment';
import { CreatePostEntity } from '../../types/post';
import 'antd/dist/antd.css';
import profile from '../../mocks/profile.json';
import * as actionCreators from '../../store/actions';
import { kakao } from '../../App';
import getGuDong from '../../utils/getGuDong';

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

const PostCreate = () => {
  const [post, setPost] = useState<CreatePostEntity>(initialPostState);
  const [date, setDate] = useState<Moment | null>(moment());
  const [time, setTime] = useState<Moment | null>(moment('7:00', 'h:mm a'));

  // 지도 검색 관련 state
  const [searchInput, setSearchInput] = useState<string>();
  const [keyword, setKeyword] = useState<string>();
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [center, setCenter] = useState({
    La: profile.longitude,
    Ma: profile.latitude,
  });
  const [searchCount, setSearchCount] = useState<number>(0);

  const dispatch = useDispatch();

  useEffect(() => {
    const container = document.getElementById('map');
    // 유저 프로필에 저장된 동네 정보를 기반으로 지도 생성
    const options = {
      center: new window.kakao.maps.LatLng(profile.latitude, profile.longitude),
      level: 3,
    };

    const map = new window.kakao.maps.Map(container, options);

    // 지도를 드래그하면 지도 중심부 위치를 저장
    kakao.maps.event.addListener(map, 'dragend', () => {
      setCenter(map.getCenter());
    });
  }, []);

  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new window.kakao.maps.LatLng(center.Ma, center.La),
      level: 3,
    };
    const map = new window.kakao.maps.Map(container, options);

    // 지도를 드래그하면 지도 중심부 위치를 저장
    kakao.maps.event.addListener(map, 'dragend', () => {
      setCenter(map.getCenter());
    });

    // 마커를 클릭하면 장소명을 표출할 인포윈도우
    const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
    function displayMarker(result: any) {
      // 마커를 생성하고 지도에 표시
      const marker = new kakao.maps.Marker({
        map,
        position: new kakao.maps.LatLng(result.y, result.x),
      });

      // 마커에 클릭 이벤트를 등록
      kakao.maps.event.addListener(marker, 'click', () => {
        // TODO: 선택된 장소 정보를 확인하는 창과 확인 버튼 구현
        setSelectedPlace(result);

        // 마커를 클릭하면 장소명이 인포윈도우에 표시
        infowindow.setContent(
          `<div style="padding:5px;font-size:12px;">${result.place_name}</div>`,
        );
        infowindow.open(map, marker);
      });
    }

    // 키워드 검색 완료 시 호출되는 콜백함수
    function placesSearchCB(data: any, status: any, pagination: any) {
      if (status === kakao.maps.services.Status.OK) {
        const bounds = new kakao.maps.LatLngBounds();
        for (let i = 0; i < data.length; i++) {
          displayMarker(data[i]);
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정
        map.setBounds(bounds);
      }
    }

    // 새로운 장소 검색 개체 생성
    const ps = new kakao.maps.services.Places();
    // 키워드로 장소를 검색합니다
    ps.keywordSearch(keyword, placesSearchCB, {
      x: center.La,
      y: center.Ma,
      radius: 5000,
      sort: 'distance',
    });
  }, [keyword, searchCount]);

  useEffect(() => {
    if (date && time) {
      setPost({
        ...post,
        meetAt: `${date?.format('YYYY-MM-DD')} ${time?.format('HH:mm')}`,
      });
    }
  }, [date, time]);

  const onChangeExerciseType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPost({ ...post, exerciseName: e.target.value });
  };
  const onChangeExpectedLevel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPost({ ...post, expectedLevel: e.target.value });
  };

  const onChangeTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPost({ ...post, title: e.target.value });
  };

  const onChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPost({ ...post, description: e.target.value });
  };

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

  const onChangeKakaotalkLink = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPost({ ...post, kakaotalkLink: e.target.value });
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
    setKeyword(searchInput);
    setSearchCount(searchCount + 1);
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
          onChange={(e) => onChangeExerciseType(e)}
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
          onChange={(e) => onChangeExpectedLevel(e)}
        >
          <option value="상">상</option>
          <option value="중">중</option>
          <option value="하">하</option>
          <option value="상관 없음">상관 없음</option>
        </select>
      </div>

      <input placeholder="제목" onChange={(e) => onChangeTitleInput(e)} />
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
      <textarea placeholder="설명" onChange={(e) => onChangeDescription(e)} />
      <label>카카오톡 오픈채팅 : </label>
      <input
        placeholder="초대 링크를 입력해주세요"
        onChange={(e) => onChangeKakaotalkLink(e)}
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
              onChange={(e) => setSearchInput(e.target.value)}
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
