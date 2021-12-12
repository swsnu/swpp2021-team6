import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import axios from 'axios';
import * as reactRedux from 'react-redux';
import PostDetailContainer from '.';
import mockStore from '../../store/store';
import * as API from '../../backend/api/api';
import { UserInfoEntity } from '../../backend/entity/user';
import { CommentEntity } from '../../backend/entity/comment';
import { PostEntity } from '../../backend/entity/post';

const stubUserInfo: UserInfoEntity = {
  userId: 1,
  nickname: 'gdori',
  latitude: 123,
  longitude: 456,
  gu: '관악구',
  dong: '신림동',
  gender: '여성',
  introduction: '',
  preferredExercise: [{ exerciseName: '축구', skillLevel: '상' }],
  participatingPost: [],
  hostingPost: [],
};

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

const stubComments: CommentEntity[] = [
  {
    comment_id: 1,
    author_id: 1,
    post_id: 1,
    content: 'comment',
    created_at: '7초 전',
  },
];

const mockPush = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({ push: mockPush }),
  useParams: () => ({ id: '1' }),
}));

describe('PostCreate', () => {
  let postDetail: any;
  let readUserInfoMock: any;
  let readPostMock: any;
  const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');

  beforeEach(() => {
    postDetail = (
      <Provider store={mockStore}>
        <PostDetailContainer />
      </Provider>
    );

    useSelectorMock.mockImplementation((callback) =>
      callback({ user: { loginUserId: 1 } }),
    );

    // readUserInfoMock = jest.spyOn(API, 'readUserInfo').mockResolvedValue({
    //   entity: stubUserInfo,
    // });
    // readPostMock = jest.spyOn(API, 'readPost').mockResolvedValue({
    //   entity: stubPost,
    // });
    // readPostMock = jest
    //   .spyOn(API, 'queryComments')
    //   .mockResolvedValue({ items: stubComments });
  });

  it('should render without error', () => {
    jest.spyOn(axios, 'get').mockResolvedValueOnce({ entity: stubUserInfo });
    jest.spyOn(axios, 'get').mockResolvedValueOnce({ items: stubComments });
    // const component = mount(postDetail);
    // expect(component.find('#post-detail-page').length).toBe(1);
  });

  // it('should render without error', () => {
  //   jest.spyOn(axios, 'get').mockResolvedValueOnce({ entity: stubUserInfo });
  //   jest.spyOn(axios, 'get').mockResolvedValueOnce({ items: stubComments });
  //   const component = mount(postDetail);
  //   // expect(component.find('#post-detail-page').length).toBe(1);
  // });
});
