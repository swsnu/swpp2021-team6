import React from 'react';
import { shallow, mount } from 'enzyme';
import * as reactRedux from 'react-redux';
import axios from 'axios';
import { PostEntity } from '../../backend/entity/post';
import Main from '.';
import * as API from '../../backend/api/api';

const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
const mockPush = jest.fn();
const setPostsMock = jest.fn();
const setFilterArrayMock = jest.fn();
const useStateMock = jest.spyOn(React, 'useState');

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({ push: mockPush }),
}));

const mockPosts: PostEntity[] = [
  {
    postId: 12,
    hostId: 1,
    hostName: 'gdori',
    exerciseName: '축구',
    expectedLevel: '상관 없음',
    title: '제목 1',
    description:
      '안녕하세요~ 이번 주말에 잠실에서 축구 함께 하실 분 구하고 있습니다! 저희가 다 활발한 편이어서 MBTI E에 해당하는 분들이 오시면 좋을 것 같아요! 뒷풀이도 예정하고 있으니 많은 참여 부탁드립니다!',
    meetAt: '2021-11-16T07:00:00Z',
    place: {
      latitude: 37.4810908316725,
      longitude: 126.946472346785,
      gu: '관악구',
      dong: '봉천동',
      name: '짐박스피트니스 봉천점',
      address: '서울 관악구 청룡1길 2',
      telephone: '02-876-0008',
    },
    minCapacity: 1,
    maxCapacity: 10,
    memberCount: 0,
    kakaotalkLink: 'open.kakao.com',
    participants: [{ userId: 3, userName: 'gdori', status: '승인 대기 중' }],
    status: '모집 중',
    keywords: ['뒷풀이', '이번 주말', 'MBTI E'],
  },
];
describe('Main', () => {
  let main: any;
  let spyQueryPosts: any;
  let spyQueryFilterPosts: any;

  beforeEach(() => {
    main = <Main />;
    useSelectorMock.mockImplementation((callback) =>
      callback({ user: { loginUserId: 1 } }),
    );
    useStateMock
      .mockReturnValueOnce([mockPosts, setPostsMock])
      .mockReturnValueOnce([
        [
          { exerciseName: 'soccer', skillLevel: 'high' },
          { exerciseName: 'basketball', skillLevel: 'middle' },
        ],
        setFilterArrayMock,
      ])
      .mockReturnValueOnce(['meet_at', jest.fn()])
      .mockReturnValueOnce([5, jest.fn()])
      .mockReturnValueOnce([
        {
          exerciseName: '종목',
          skillLevel: '기대 실력',
        },
        jest.fn(),
      ])
      .mockReturnValueOnce(['', jest.fn()]);
    console.log = jest.fn().mockImplementation();
    window.alert = jest.fn();
  });

  it('should render without error', (done) => {
    spyQueryPosts = jest
      .spyOn(API, 'queryPosts')
      .mockResolvedValueOnce({ items: mockPosts });
    // spyQueryFilterPosts = jest
    //   .spyOn(API, 'queryFilterPosts')
    //   .mockResolvedValueOnce({ items: mockPosts });
    const component = mount(main);
    expect(component.find('.main').length).toBe(1);
    done();
  });

  it('should alert when error ocurred while fetching posts', () => {
    spyQueryPosts = jest.spyOn(API, 'queryPosts').mockRejectedValueOnce({});
    const component = mount(main);
  });
});
