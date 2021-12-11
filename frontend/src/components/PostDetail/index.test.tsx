import { mount } from 'enzyme';
import axios from 'axios';
import Detail from '.';
import { PostEntity } from '../../backend/entity/post';
import * as kakaoMap from '../../utils/getKakaoMap';

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

const stubIsHostWithoutParticipantsProps = {
  post: stubPost,
  isHost: true,
  isParticipant: false,
  applyStatus: null,
  onDelete: jest.fn(),
  onParticipate: jest.fn(),
  participants: [],
  setParticipants: jest.fn(),
  setPost: jest.fn(),
};

const stubIsHostProps = {
  post: stubPost,
  isHost: true,
  isParticipant: false,
  applyStatus: null,
  onDelete: jest.fn(),
  onParticipate: jest.fn(),
  participants: [
    { userId: 2, userName: '구미', status: 'PENDING' },
    { userId: 3, userName: '구미구미', status: 'ACCEPTED' },
    { userId: 3, userName: '구미구미', status: '' },
  ],
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

window.alert = jest.fn();
const mockPush = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({ push: mockPush }),
  useParams: () => ({ id: '1' }),
}));
jest.spyOn(kakaoMap, 'getKakaoMapWithMarker').mockImplementation();

describe('Detail', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should render without error', () => {
    const component = mount(<Detail {...stubIsHostProps} />);
    expect(component.find('#post-detail-component').length).toBe(1);
  });

  it('should open toggle and accept participant', () => {
    window.confirm = jest.fn().mockReturnValue(true);
    jest.spyOn(axios, 'post').mockResolvedValue({ status: 204 });
    const component = mount(<Detail {...stubIsHostProps} />);
    component.find('#participant-toggle-button').simulate('click');
    component.find('#pending-button').simulate('click');
  });

  it('should open toggle and delcline participant', () => {
    window.confirm = jest.fn().mockReturnValue(true);
    jest.spyOn(axios, 'post').mockResolvedValue({ status: 204 });
    const component = mount(<Detail {...stubIsHostProps} />);
    component.find('#participant-toggle-button').simulate('click');
    component.find('#participant-delete-button').at(0).simulate('click');
  });

  it('should alert when there is no participant', () => {
    const component = mount(<Detail {...stubIsHostWithoutParticipantsProps} />);
    component.find('#participant-toggle-button').simulate('click');
    expect(window.alert).toBeCalledTimes(1);
  });

  it('should edit post', () => {
    const component = mount(<Detail {...stubIsHostProps} />);
    component.find('#post-edit-button').at(0).simulate('click');
  });

  it('should delete post', () => {
    const component = mount(<Detail {...stubIsHostProps} />);
    component.find('#post-delete-button').at(0).simulate('click');
  });

  it("should redirect to participnat's profile", () => {
    const component = mount(<Detail {...stubIsHostProps} />);
    component.find('#participant-nickname').at(0).simulate('click');
    expect(mockPush).toBeCalledTimes(1);
  });

  it("should redirect to host's profile", () => {
    const component = mount(<Detail {...stubIsNotHostProps} />);
    component.find('#profile').find('button').simulate('click');
    expect(mockPush).toBeCalledTimes(1);
  });
});
