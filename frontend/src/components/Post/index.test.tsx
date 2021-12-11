import { mount } from 'enzyme';
import Post from '.';
import {
  tabletennis,
  badminton,
  running,
  riding,
} from '../../utils/thumbnails';

const soccerMockPost = {
  postId: 1,
  hostId: 1,
  hostName: 'gdori',
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
  participants: [],
  kakaotalkLink: 'https://open.kakao.com/o/stl6nIeb',
  status: '모집 중',
  keywords: ['뒤풀이', 'MBTI E', '이번 주말'],
};

const basketballMockPost = {
  postId: 1,
  hostId: 1,
  hostName: 'gdori',
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
  participants: [],
  kakaotalkLink: 'https://open.kakao.com/o/stl6nIeb',
  status: '모집 중',
  keywords: ['뒤풀이', 'MBTI E', '이번 주말'],
};
const tennisMockPost = {
  postId: 1,
  hostId: 1,
  hostName: 'gdori',
  exerciseName: '테니스',
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
  participants: [],
  kakaotalkLink: 'https://open.kakao.com/o/stl6nIeb',
  status: '모집 중',
  keywords: ['뒤풀이', 'MBTI E', '이번 주말'],
};
const runningMockPost = {
  postId: 1,
  hostId: 1,
  hostName: 'gdori',
  exerciseName: '러닝',
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
  participants: [],
  kakaotalkLink: 'https://open.kakao.com/o/stl6nIeb',
  status: '모집 중',
  keywords: ['뒤풀이', 'MBTI E', '이번 주말'],
};
const ridingMockPost = {
  postId: 1,
  hostId: 1,
  hostName: 'gdori',
  exerciseName: '라이딩',
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
  participants: [],
  kakaotalkLink: 'https://open.kakao.com/o/stl6nIeb',
  status: '모집 중',
  keywords: ['뒤풀이', 'MBTI E', '이번 주말'],
};

const tabletennisMockPost = {
  postId: 1,
  hostId: 1,
  hostName: 'gdori',
  exerciseName: '탁구',
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
  participants: [],
  kakaotalkLink: 'https://open.kakao.com/o/stl6nIeb',
  status: '모집 중',
  keywords: ['뒤풀이', 'MBTI E', '이번 주말'],
};

const badmintonMockPost = {
  postId: 1,
  hostId: 1,
  hostName: 'gdori',
  exerciseName: '배드민턴',
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
  participants: [],
  kakaotalkLink: 'https://open.kakao.com/o/stl6nIeb',
  status: '모집 중',
  keywords: ['뒤풀이', 'MBTI E', '이번 주말'],
};

const mockPostWithWrongData = {
  postId: 1,
  hostId: 1,
  hostName: 'gdori',
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
  participants: [],
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
  it('should render soccer image', () => {
    const post = <Post post={soccerMockPost} />;
    const component = mount(post);
  });

  it('should render basketball image', () => {
    const post = <Post post={basketballMockPost} />;
    const component = mount(post);
  });

  it('should render badminton image', () => {
    const post = <Post post={badmintonMockPost} />;
    const component = mount(post);
  });

  it('should render tennis image', () => {
    const post = <Post post={tennisMockPost} />;
    const component = mount(post);
  });

  it('should render tabletennis image', () => {
    const post = <Post post={tabletennisMockPost} />;
    const component = mount(post);
  });

  it('should render running image', () => {
    const post = <Post post={runningMockPost} />;
    const component = mount(post);
  });

  it('should render riding image', () => {
    const post = <Post post={ridingMockPost} />;
    const component = mount(post);
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
