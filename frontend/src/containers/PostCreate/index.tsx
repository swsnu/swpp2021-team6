import { useEffect, useState } from 'react';
import { DatePicker, TimePicker } from 'antd';
import moment, { Moment } from 'moment';
import { PostInputDTO } from '../../model/post';
import { kakao } from '../../utils/getKakaoMap';
import 'antd/dist/antd.css';
import profile from '../../mocks/profile.json';

const PostCreate = () => {
  const initialState: PostInputDTO = {
    exerciseType: '축구',
    expectedLevel: '상관 없음',
    meetAt: '',
    title: '',
    description: '',
    minCapacity: 1,
    maxCapacity: 10,
    kakaotalkLink: '',
    latitude: 0,
    longitude: 0,
    place: '',
  };
  const [newPost, setNewPost] = useState<PostInputDTO>(initialState);
  const [date, setDate] = useState<Moment | null>(moment());
  const [time, setTime] = useState<Moment | null>(moment('7:00', 'h:mm a'));
  const [searchInput, setSearchInput] = useState<string>();
  const [keyword, setKeyword] = useState<string>();
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [center, setCenter] = useState({
    La: profile.longitude,
    Ma: profile.latitude,
  });
  const [searchCount, setSearchCount] = useState<number>(0);

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
    function displayMarker(place: any) {
      // 마커를 생성하고 지도에 표시
      const marker = new kakao.maps.Marker({
        map,
        position: new kakao.maps.LatLng(place.y, place.x),
      });

      // 마커에 클릭 이벤트를 등록
      kakao.maps.event.addListener(marker, 'click', () => {
        // TODO: 선택된 장소 정보를 확인하는 창과 확인 버튼 구현
        setSelectedPlace(place);

        // 마커를 클릭하면 장소명이 인포윈도우에 표시
        infowindow.setContent(
          `<div style="padding:5px;font-size:12px;">${place.place_name}</div>`,
        );
        infowindow.open(map, marker);
      });
    }

    // 키워드 검색 완료 시 호출되는 콜백함수
    function placesSearchCB(data: any, status: any, pagination: any) {
      if (status === kakao.maps.services.Status.OK) {
        console.log(data);

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
    let appointmentTime;
    if (date && time) {
      appointmentTime = `${date?.format('YYYY-MM-DD')} ${time?.format(
        'HH:mm',
      )}`;
      setNewPost({ ...newPost, meetAt: appointmentTime });
    }
  }, [date, time]);

  const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewPost({ ...newPost, exerciseType: e.target.value });
  };

  const onChangeTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPost({ ...newPost, title: e.target.value });
  };

  const onChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewPost({ ...newPost, description: e.target.value });
  };

  const onChangeMinCapacity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const changedMinCapacity = Number(e.target.value);
    if (changedMinCapacity > newPost.maxCapacity) {
      alert('최대 모집 인원을 초과할 수 없습니다');
    } else {
      setNewPost({ ...newPost, minCapacity: changedMinCapacity });
    }
  };

  const onChangeMaxCapacity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const changedMaxCapacity = Number(e.target.value);
    if (changedMaxCapacity < newPost.minCapacity) {
      alert('최소 모집 인원 미만일 수 없습니다');
    } else {
      setNewPost({ ...newPost, maxCapacity: Number(e.target.value) });
    }
  };

  const onChangeKakaotalkLink = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPost({ ...newPost, kakaotalkLink: e.target.value });
  };

  const onClickSearch = () => {
    setKeyword(searchInput);
    setSearchCount(searchCount + 1);
  };

  const onClickSetPlace = () => {
    setNewPost({
      ...newPost,
      place: selectedPlace.place_name,
      latitude: selectedPlace.x,
      longitude: selectedPlace.y,
    });

    alert('장소 정보가 입력되었습니다');
  };

  const onclickSubmit = () => {
    if (!newPost.title) {
      alert('제목을 입력해주세요');
    } else if (!newPost.description) {
      alert('설명을 입력해주세요');
    } else if (!newPost.kakaotalkLink) {
      alert('카카오톡 오픈채팅방 링크를 입력해주세요');
    } else if (!/[open.kakao.com]/.test(newPost.kakaotalkLink)) {
      alert('올바른 링크를 입력해주세요');
    } else {
      alert('submitted');
      // 기능 구현 후 button type 삭제하기
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
          value={newPost.exerciseType}
          onChange={(e) => onChangeSelect(e)}
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
          defaultValue={newPost.expectedLevel}
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
          value={newPost.minCapacity}
          onChange={(e) => onChangeMinCapacity(e)}
        />
        <label htmlFor="max-capacity"> 명 ~ 최대 </label>
        <input
          id="max-capacity"
          type="number"
          min="1"
          max="10"
          value={newPost.maxCapacity}
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