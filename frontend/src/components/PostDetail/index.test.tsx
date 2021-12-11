import { mount } from 'enzyme';
import Detail from '.';
import { PostEntity } from '../../backend/entity/post';

const stubPost: PostEntity = {
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

const stubIsHostProps = {
  post: stubPost,
  isHost: true,
  isParticipant: false,
  applyStatus: null,
  onDelete: jest.fn(),
  onParticipate: jest.fn(),
  participants: [{ userId: 2, userName: '구미', status: '승인 대기 중' }],
  setParticipants: jest.fn(),
  setPost: jest.fn(),
};

const stubIsNotHostProps = {
  post: stubPost,
  isHost: false,
  isParticipant: false,
  applyStatus: null,
  onDelete: jest.fn(),
  onParticipate: jest.fn(),
  participants: [],
  setParticipants: jest.fn(),
  setPost: jest.fn(),
};

const mockPush = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({ push: mockPush }),
  useParams: () => ({ id: '1' }),
}));

describe('Detail', () => {
  it('should render without error', () => {
    const component = mount(<Detail {...stubIsHostProps} />);
    expect(component.find('#post-detail-component').length).toBe(1);
  });
});
