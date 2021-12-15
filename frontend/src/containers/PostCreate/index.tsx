import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { DatePicker, TimePicker } from 'antd';
import moment, { Moment } from 'moment';
import { CreatePostEntity } from '../../backend/entity/post';
import getGuDong from '../../utils/getGuDong';
import { getKakaoMap } from '../../utils/getKakaoMap';
import { createPost, readUserInfo } from '../../backend/api/api';
import whiteExercise from '../../assets/image/icon/white-exercise.svg';
import whiteLevel from '../../assets/image/icon/white-level.svg';
import Divider from '../../components/Divider';
import searchIcon from '../../assets/image/icon/search.svg';
import participateIcon from '../../assets/image/icon/participate.svg';
import { UserInfoEntity } from '../../backend/entity/user';
import 'antd/dist/antd.css';
import './index.scss';

const initialPostState: CreatePostEntity = {
  exerciseName: '종목',
  expectedLevel: '기대 실력',
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

const PostCreate: React.FC = () => {
  const history = useHistory();
  const loginUserId = Number(localStorage.getItem('loginUser'));
  const [userInfo, setUserInfo] = useState<UserInfoEntity>();
  const [post, setPost] = useState<CreatePostEntity>(initialPostState);
  const [date, setDate] = useState<Moment | null>(moment());
  const [time, setTime] = useState<Moment | null>(moment('7:00', 'h:mm a'));

  /* KAKAOMAP */
  const [keyword, setKeyword] = useState<string>();
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [center, setCenter] = useState({
    La: 126.952281,
    Ma: 37.480584,
  });

  const fetchUserInfo = async () => {
    try {
      const fetcheduserInfo = (await readUserInfo({ id: loginUserId })).entity;
      setUserInfo(fetcheduserInfo);
    } catch {
      alert('유저 정보를 불러오는 중 문제가 발생했습니다.');
      history.push('/main');
    }
  };

  useEffect(() => {
    if (loginUserId === null) history.push('/signin');
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (loginUserId && userInfo) {
      const container = document.getElementById('map');
      getKakaoMap(container, userInfo.latitude, userInfo.longitude, setCenter);
    }
  }, [userInfo]);

  useEffect(() => {
    if (date && time) {
      setPost({
        ...post,
        meetAt: `${date?.format('YYYY-MM-DD')} ${time?.format('HH:mm')}`,
      });
    }
  }, [date, time]);

  const onChangeMinCapacity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const changedMinCapacity = Number(e.target.value);
    if (changedMinCapacity > post.maxCapacity) {
      alert('최대 모집 인원을 초과할 수 없습니다');
    } else {
      setPost({ ...post, minCapacity: changedMinCapacity });
    }
  };

  const onChangeMaxCapacity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const changedMaxCapacity = Number(e.target.value);
    if (changedMaxCapacity < post.minCapacity) {
      alert('최소 모집 인원 미만일 수 없습니다');
    } else {
      setPost({ ...post, maxCapacity: changedMaxCapacity });
    }
  };

  const onClickSetPlace = () => {
    const { placeName, x, y, roadAddressName, phone } = selectedPlace;
    getGuDong(x, y).then((value) => {
      const { gu, dong } = value;
      setPost({
        ...post,
        place: {
          ...post.place,
          gu,
          dong,
          name: placeName,
          latitude: y,
          longitude: x,
          address: roadAddressName,
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

  const onclickSubmit = async () => {
    if (post.exerciseName === '종목' || post.expectedLevel === '기대 실력') {
      alert('운동 종목과 기대 실력을 바르게 입력해주세요.');
    } else if (!post.title) {
      alert('제목을 입력해주세요.');
    } else if (!post.description) {
      alert('설명을 입력해주세요.');
    } else if (!post.kakaotalkLink) {
      alert('카카오톡 오픈채팅방 링크를 입력해주세요.');
    } else if (!/[open.kakao.com]/.test(post.kakaotalkLink)) {
      alert('올바른 링크를 입력해주세요.');
    } else if (
      !post.place.name ||
      !post.place.latitude ||
      !post.place.longitude
    ) {
      alert('운동 장소를 설정해주세요.');
    } else {
      const { gu, dong } = await getGuDong(
        post.place.longitude,
        post.place.latitude,
      );
      setPost({ ...post, place: { ...post.place, gu, dong } });
      try {
        const newPost = (await createPost({ createPayload: post })).entity;
        history.push(`/post/${newPost.postId}`);
        // api
        // api
      } catch (e: any) {
        if (e?.response?.status === 500) {
          alert('게시글 작성 중 문제가 발생했습니다.');
        }
      }
    }
  };

  const onKeyPressSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onClickSearch();
    }
  };

  const capacityOptions = () => {
    const CAPACITY = 10;
    const options = [];
    for (let i = 1; i <= CAPACITY; i++) {
      options.push(
        <option key={i} value={i}>
          {i}명
        </option>,
      );
    }
    return options;
  };

  return (
    <div id="post-create">
      <form id="post-create-container">
        <div id="header">
          <h1>새로운 모임 만들기</h1>
          <div id="select-container">
            <img src={whiteExercise} alt="exercise icon" />
            <select
              name="exerciseType"
              id="exerciseType"
              value={post.exerciseName}
              onChange={(e) =>
                setPost({ ...post, exerciseName: e.target.value })
              }
            >
              <option value="종목" hidden>
                종목
              </option>
              <option value="축구">축구</option>
              <option value="농구">농구</option>
              <option value="배드민턴">배드민턴</option>
              <option value="테니스">테니스</option>
              <option value="탁구">탁구</option>
              <option value="러닝">러닝</option>
              <option value="라이딩">라이딩</option>
            </select>
            <img src={whiteLevel} alt="level icon" />
            <select
              name="expectedLevel"
              id="expectedLevel"
              value={post.expectedLevel}
              onChange={(e) =>
                setPost({ ...post, expectedLevel: e.target.value })
              }
            >
              <option value="기대 실력" hidden>
                기대 실력
              </option>
              <option value="상">상</option>
              <option value="중">중</option>
              <option value="하">하</option>
              <option value="상관 없음">상관 없음</option>
            </select>
          </div>
        </div>
        <div id="post-body">
          <div className="left">
            <div className="date box">
              <span>날짜</span>
              <div className="date-time-input">
                <DatePicker
                  id="date-picker"
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
              </div>
            </div>
            <div className="capacity box">
              <span>인원</span>
              <div className="capacity-content">
                <div>
                  <label htmlFor="min-capacity">최소</label>
                  <select
                    id="min-capacity"
                    value={post.minCapacity}
                    onChange={(e) => onChangeMinCapacity(e)}
                  >
                    {capacityOptions()}
                  </select>
                </div>
                <div>
                  <label htmlFor="max-capacity">최대</label>
                  <select
                    id="max-capacity"
                    value={post.maxCapacity}
                    onChange={(e) => onChangeMaxCapacity(e)}
                  >
                    {capacityOptions()}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="title shadow box">
              <span>제목</span>
              <input
                id="title-input"
                placeholder="제목을 입력해주세요"
                onChange={(e) => setPost({ ...post, title: e.target.value })}
              />
            </div>
            <div className="introduction shadow box">
              <span>설명</span>
              <input
                id="introduction-input"
                placeholder="운동 모임에 대한 설명을 입력해주세요"
                onChange={(e) =>
                  setPost({ ...post, description: e.target.value })
                }
              />
            </div>
            <div className="kakaotalk-link shadow box">
              <span>카카오톡 오픈채팅</span>
              <input
                id="kakaotalk-link-input"
                placeholder="오픈 채팅방 주소를 입력해주세요"
                onChange={(e) =>
                  setPost({ ...post, kakaotalkLink: e.target.value })
                }
              />
            </div>
          </div>
        </div>
        <div id="map-container" className="box">
          <span>위치</span>
          <div id="map-container-content">
            <div id="content-top">
              <div id="map" style={{ width: '500px', height: '350px' }} />
              <div id="map-container-right">
                <div id="search-container">
                  <input
                    placeholder="운동할 장소를 입력해주세요 ex. 서울대학교 테니스장"
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyPress={onKeyPressSearch}
                  />
                  <button type="button" onClick={onClickSearch}>
                    <img src={searchIcon} alt="search" />
                  </button>
                </div>
                <div />
              </div>
            </div>
            {selectedPlace && (
              <>
                <Divider />
                <div id="selected-place">
                  <div>
                    <span id="place-name">{selectedPlace.placeName}</span>
                    <span id="place-address">
                      {selectedPlace.roadAddressName}
                    </span>
                  </div>
                  <button type="button" onClick={onClickSetPlace}>
                    선택
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <button id="submit-button" type="button" onClick={onclickSubmit}>
          <img src={participateIcon} alt="participate" />
          모임 만들기
        </button>
      </form>
    </div>
  );
};

export default PostCreate;
