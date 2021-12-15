import React from 'react';
import { shallow } from 'enzyme';
import * as reactRedux from 'react-redux';
import userInfo from '../../mocks/userInfo.json';
import * as actionCreators from '../../backend/api/api';
import { PostEntity } from '../../backend/entity/post';
import Main from '.';

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

  beforeEach(() => {
    main = <Main />;
    useSelectorMock.mockImplementation((callback) =>
      callback({ user: { user: userInfo } }),
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
      .mockReturnValueOnce(['meet_at', jest.fn()]);
    spyQueryPosts = jest
      .spyOn(actionCreators, 'queryPosts')
      .mockResolvedValue({ items: mockPosts });
    console.log = jest.fn().mockImplementation();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('should render without error', () => {
    const component = shallow(main);
    expect(component.find('.main').length).toBe(1);
  });
});
