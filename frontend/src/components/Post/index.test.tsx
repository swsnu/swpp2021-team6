import { mount } from 'enzyme';
import Post from '.';
import { history } from '../../store/store';

const soccerMockPost = {
  postId: 1,
  hostId: 1,
  exerciseName: '축구',
  expectedLevel: '상',
  title: '용산구에서 같이 축구하실 분~',
  description: '가볍게 축구하실 분 구해요',
  meetAt: '2021-11-11 19:00',
  minCapacity: 5,
  maxCapacity: 10,
  memberCount: 3,
  place: {
    name: '용산공업고등학교',
    latitude: 37.524298,
    longitude: 126.967529,
    gu: '용산구',
    dong: '용산동',
    address: '서울특별시 용산구 한강로3가',
    telephone: '02-2648-1264',
  },
  kakaotalkLink: 'https://open.kakao.com/o/stl6nIeb',
  status: '모집 중',
  keywords: ['뒤풀이', 'MBTI E', '이번 주말'],
};

const basketballMockPost = {
  postId: 1,
  hostId: 1,
  exerciseName: '농구',
  expectedLevel: '중',
  title: '용산구에서 같이 축구하실 분~',
  description: '가볍게 축구하실 분 구해요',
  meetAt: '2021-11-11 19:00',
  minCapacity: 5,
  maxCapacity: 10,
  memberCount: 3,
  place: {
    name: '용산공업고등학교',
    latitude: 37.524298,
    longitude: 126.967529,
    gu: '용산구',
    dong: '용산동',
    address: '서울특별시 용산구 한강로3가',
    telephone: '02-2648-1264',
  },
  kakaotalkLink: 'https://open.kakao.com/o/stl6nIeb',
  status: '모집 중',
  keywords: ['뒤풀이', 'MBTI E', '이번 주말'],
};

const levelLowMockPost = {
  postId: 1,
  hostId: 1,
  exerciseName: '농구',
  expectedLevel: '하',
  title: '용산구에서 같이 축구하실 분~',
  description: '가볍게 축구하실 분 구해요',
  meetAt: '2021-11-11 19:00',
  minCapacity: 5,
  maxCapacity: 10,
  memberCount: 3,
  place: {
    name: '용산공업고등학교',
    latitude: 37.524298,
    longitude: 126.967529,
    gu: '용산구',
    dong: '용산동',
    address: '서울특별시 용산구 한강로3가',
    telephone: '02-2648-1264',
  },
  kakaotalkLink: 'https://open.kakao.com/o/stl6nIeb',
  status: '모집 중',
  keywords: ['뒤풀이', 'MBTI E', '이번 주말'],
};

const levelNoneMockPost = {
  postId: 1,
  hostId: 1,
  exerciseName: '축구',
  expectedLevel: '상관 없음',
  title: '용산구에서 같이 축구하실 분~',
  description: '가볍게 축구하실 분 구해요',
  meetAt: '2021-11-11 19:00',
  minCapacity: 5,
  maxCapacity: 10,
  memberCount: 3,
  place: {
    name: '용산공업고등학교',
    latitude: 37.524298,
    longitude: 126.967529,
    gu: '용산구',
    dong: '용산동',
    address: '서울특별시 용산구 한강로3가',
    telephone: '02-2648-1264',
  },
  kakaotalkLink: 'https://open.kakao.com/o/stl6nIeb',
  status: '모집 중',
  keywords: ['뒤풀이', 'MBTI E', '이번 주말'],
};

const mockPostWithWrongData = {
  postId: 1,
  hostId: 1,
  exerciseName: '양궁',
  expectedLevel: '고수',
  title: '용산구에서 같이 축구하실 분~',
  description: '가볍게 축구하실 분 구해요',
  meetAt: '2021-11-11 19:00',
  minCapacity: 5,
  maxCapacity: 10,
  memberCount: 3,
  place: {
    name: '용산공업고등학교',
    latitude: 37.524298,
    longitude: 126.967529,
    gu: '용산구',
    dong: '용산동',
    address: '서울특별시 용산구 한강로3가',
    telephone: '02-2648-1264',
  },
  kakaotalkLink: 'https://open.kakao.com/o/stl6nIeb',
  status: '모집 중',
  keywords: ['뒤풀이', 'MBTI E', '이번 주말'],
};

const mockPush = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({ push: mockPush }),
}));

describe('Post', () => {
  window.matchMedia =
    window.matchMedia ||
    function () {
      return {
        matches: false,
        addListener() {},
        removeListener() {},
      };
    };
  it('should render soccer image with level high label', () => {
    const post = <Post post={soccerMockPost} />;
    const component = mount(post);
    expect(component.find('.level-label').at(0).text()).toBe('실력 : 상');
  });

  it('should render basketball image with level middle label', () => {
    const post = <Post post={basketballMockPost} />;
    const component = mount(post);
    expect(component.find('.level-label').at(0).text()).toBe('실력 : 중');
  });

  it('should render basketball image with level low label', () => {
    const post = <Post post={levelLowMockPost} />;
    const component = mount(post);
    expect(component.find('.level-label').at(0).text()).toBe('실력 : 하');
  });

  it('should render soccer image with level none label', () => {
    const post = <Post post={levelNoneMockPost} />;
    const component = mount(post);
    expect(component.find('.level-label').at(0).text()).toBe(
      '실력 : 상관 없음',
    );
  });

  it('should alert with wrong data', () => {
    window.alert = jest.fn().mockImplementation();
    const post = <Post post={mockPostWithWrongData} />;
    const component = mount(post);
  });

  it('should redirect to post detail page when clicked', () => {
    const post = <Post post={soccerMockPost} />;
    const component = mount(post);
    component.find('.post').simulate('click');
    expect(mockPush).toHaveBeenCalled();
  });
});
