import { useEffect, useState } from 'react';
import { DatePicker, TimePicker } from 'antd';
import moment, { Moment } from 'moment';
import { PostInputDTO } from '../../model/post';
import { kakao } from '../../utils/map';
import 'antd/dist/antd.css';
import imageUrl from '../../assets/map/current-location-marker.png';

const PostCreate = () => {
  const initialState: PostInputDTO = {
    exerciseType: 1,
    expectedLevel: 'low',
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
  const [curLat, setCurLat] = useState<number>(37.450035);
  const [curLng, setCurLng] = useState<number>(126.95252);
  const [inputValue, setInputValue] = useState<string>();
  const [keyword, setKeyword] = useState<string>();
  const [changedLat, setChangedLat] = useState<string>('37.450035');
  const [changedLng, setChangedLng] = useState<string>('126.95252');

  // 현재 위치 가져오기
  useEffect(() => {
    if ('geolocation' in navigator) {
      console.log('Available');
    } else {
      console.log('Not Available');
    }

    navigator.geolocation.getCurrentPosition((position) => {
      setCurLat(position.coords.latitude);
      setCurLng(position.coords.longitude);
    });
  }, []);

  useEffect(() => {
    const container = document.getElementById('map');
    // 현재 위치를 중심으로 하는 지도 생성
    const currentLocation = new window.kakao.maps.LatLng(curLat, curLng);
    const options = {
      center: currentLocation,
      level: 3,
    };
    const map = new window.kakao.maps.Map(container, options);
    kakao.maps.event.addListener(map, 'dragend', () => {
      const position = map.getCenter();
      setChangedLat(position.Ma.toString());
      setChangedLng(position.La.toString());
    });

    // 커스텀 마커 이미지 세팅
    const imageSrc = imageUrl;
    const imageSize = new kakao.maps.Size(20, 20);
    const imageOption = { offset: new kakao.maps.Point(10, 10) };
    const markerImage = new kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imageOption,
    );

    const locationMarker = new window.kakao.maps.Marker({
      position: currentLocation,
      image: markerImage,
    });

    locationMarker.setMap(map);

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
        setNewPost({
          ...newPost,
          place: place.place_name,
          latitude: place.x,
          longitude: place.y,
        });
        // 마커를 클릭하면 장소명이 인포윈도우에 표시
        infowindow.setContent(
          `<div style="padding:5px;font-size:12px;">${place.place_name}</div>`,
        );
        infowindow.open(map, marker);
      });
    }

    // 키워드 검색 완료 시 호출되는 콜백함수 입니다
    function placesSearchCB(data: any, status: any, pagination: any) {
      if (status === kakao.maps.services.Status.OK) {
        console.log(data);
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        const bounds = new kakao.maps.LatLngBounds();

        for (let i = 0; i < data.length; i++) {
          displayMarker(data[i]);
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정
        map.setBounds(bounds);
      }
    }

    console.log(changedLat, changedLng);

    // 지도를 드래그해서 중심점이 변경된 경우 중심점을 기준으로 검색을 실행
    const ps = new kakao.maps.services.Places();
    // 키워드로 장소를 검색합니다
    ps.keywordSearch(keyword, placesSearchCB, {
      x: changedLat,
      y: changedLng,
      radius: 5000,
      sort: 'distance',
    });
  }, [curLat, curLng, keyword]);

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
    setNewPost({ ...newPost, exerciseType: Number(e.target.value) });
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

  const onclickSubmit = () => {
    if (!newPost.title) {
      alert('제목을 입력해주세요');
    } else if (!newPost.description) {
      alert('설명을 입력해주세요');
    } else if (!newPost.kakaotalkLink) {
      alert('카카오톡 오픈채팅방 링크를 입력해주세요');
      // } else if (newPost.kakaotalkLink) {
      // TODO: 카톡 링크 regex 확인
    } else {
      console.log('submitted');
      // 기능 구현 후 button type 삭제하기
    }
  };

  console.log(newPost);

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
          <option value={1}>축구</option>
          <option value={2}>농구</option>
          <option value={3}>배드민턴</option>
          <option value={4}>테니스</option>
          <option value={5}>탁구</option>
          <option value={6}>러닝</option>
          <option value={7}>자전거</option>
        </select>
        <label htmlFor="expectedLevel">모집 실력 : </label>
        <select name="expectedLevel" id="expectedLevel" defaultValue="low">
          <option value="high">상</option>
          <option value="average">중</option>
          <option value="low">하</option>
          <option value="low">상관 없음</option>
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
      <div>
        <span>Map API</span>
        <input
          placeholder="검색어를 입력하세요"
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="button" onClick={() => setKeyword(inputValue)}>
          검색
        </button>
        <div id="map" style={{ width: '400px', height: '400px' }} />
      </div>
      <button type="button" onClick={onclickSubmit}>
        등록하기
      </button>
    </form>
  );
};

export default PostCreate;
