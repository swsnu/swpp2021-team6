import { useEffect, useState } from 'react';
import { DatePicker, TimePicker } from 'antd';
import moment, { Moment } from 'moment';
import { PostInputDTO } from '../../model/post';
import 'antd/dist/antd.css';

const PostNew = () => {
  const initialState: PostInputDTO = {
    exerciseType: 0,
    expectedLevel: 'high',
    meetAt: '',
    title: '',
    description: '',
    appointmentTime: '',
    minCapacity: 1,
    maxCapacity: 10,
    kakaotalkLink: '',
    status: null,
    latitude: 0,
    logitude: 0,
  };
  const [newPost, setNewPost] = useState<PostInputDTO>(initialState);
  const [date, setDate] = useState<Moment | null>(moment());
  const [time, setTime] = useState<Moment | null>(moment('7:00', 'h:mm a'));
  const [lat, setLat] = useState<number>();
  const [lng, setLng] = useState<number>();

  const { kakao } = window as any;

  // 현재 위치 가져오기
  useEffect(() => {
    if ('geolocation' in navigator) {
      console.log('Available');
    } else {
      console.log('Not Available');
    }

    navigator.geolocation.getCurrentPosition((position) => {
      setLat(position.coords.latitude);
      setLng(position.coords.longitude);
    });
  }, []);

  // Kakao Map 불러오기
  useEffect(() => {
    // 마커를 클릭하면 장소명을 표출할 인포윈도우
    const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
    const currentLatLng = new kakao.maps.LatLng(lat, lng);

    const container = document.getElementById('map');
    const options = {
      center: currentLatLng,
      level: 3,
    };
    // 지도 생성
    const map = new kakao.maps.Map(container, options);

    // 장소 검색 객체를 생성합니다
    const ps = new kakao.maps.services.Places();

    function displayMarker(place: any) {
      // 마커를 생성하고 지도에 표시합니다
      const marker = new kakao.maps.Marker({
        map,
        position: new kakao.maps.LatLng(place.y, place.x),
      });

      // 마커에 클릭이벤트를 등록합니다
      kakao.maps.event.addListener(marker, 'click', () => {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
        infowindow.setContent(
          `<div style="padding:5px;font-size:12px;">${place.place_name}</div>`,
        );
        infowindow.open(map, marker);
      });
    }

    // 키워드 검색 완료 시 호출되는 콜백함수 입니다
    function placesSearchCB(data: any, status: any, pagination: any) {
      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        const bounds = new kakao.maps.LatLngBounds();

        for (let i = 0; i < data.length; i++) {
          displayMarker(data[i]);
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds);
      }
    }

    // 키워드로 장소를 검색합니다
    ps.keywordSearch('화정체육관', placesSearchCB, {
      useMapCenter: true,
      radius: 5000,
    });

    // TODO: current location marker with custom icon
    // // 지도 중심좌표에 마커를 생성합니다
    // const marker = new kakao.maps.Marker({
    //   position: map.getCenter(),
    // });
    // // 지도에 마커를 표시합니다
    // marker.setMap(map);
  }, [lat, lng]);

  useEffect(() => {
    let appointmentTime;
    if (date && time) {
      appointmentTime = `${date?.format('YYYY-MM-DD')} ${time?.format(
        'HH:mm',
      )}`;
      setNewPost({ ...newPost, appointmentTime });
    }
  }, [date, time]);

  const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewPost({ ...newPost, exerciseType: Number(e.target.value) });
  };

  const onChangeTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPost({ ...newPost, title: e.target.value });
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

  const onclickSubmit = () => {
    // check if textarea is empty
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
      <textarea placeholder="20자 이상 설명" />
      <label>카카오톡 오픈채팅 : </label>
      <input placeholder="초대 링크를 입력해주세요" />
      <div>Map API</div>
      <div id="map" style={{ width: '400px', height: '400px' }} />
      <button>등록하기</button>
    </form>
  );
};

export default PostNew;
