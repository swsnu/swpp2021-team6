/* eslint-disable no-proto */
import { Provider } from 'react-redux';
import React from 'react';
import { mount } from 'enzyme';
import PostDetailContainer from '.';
import * as API from '../../backend/api/api';
import { CommentEntity } from '../../backend/entity/comment';
import { ParticipantType, PostEntity } from '../../backend/entity/post';
import mockStore, { history } from '../../store/store';
import * as kakaoMap from '../../utils/getKakaoMap';

const stubComments: CommentEntity[] = [
  {
    commentId: 1,
    authorName: 'gdori',
    authorId: 1,
    postId: 1,
    content: 'comment',
    createdAt: '7초 전',
  },
  {
    commentId: 1,
    authorName: 'gdori',
    authorId: 1,
    postId: 1,
    content: 'comment',
    createdAt: '7초 전',
  },
];

const stubParticipants: ParticipantType[] = [
  {
    userId: 1,
    userName: 'gdori',
    status: 'PENDING',
  },
  {
    userId: 2,
    userName: 'gdori',
    status: 'ACCEPTED',
  },
  {
    userId: 3,
    userName: 'gdori',
    status: 'DECLINED',
  },
];

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
  participants: stubParticipants,
  kakaotalkLink: 'https://open.kakao.com/o/stl6nIeb',
  status: '모집 중',
  keywords: ['자동 태그 생성 중입니다'],
};

const mockPush = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({ push: mockPush }),
  useParams: () => ({ id: '1' }),
}));

jest.spyOn(kakaoMap, 'getKakaoMapWithMarker').mockImplementation();
const useStateMock = jest.spyOn(React, 'useState');
const setPostMock = jest.fn();
const setParticipantsMock = jest.fn();
const setCommentItemsMock = jest.fn();
const setNewCommentMock = jest.fn();
const setCommentsUpdatedMock = jest.fn();
const setKeywordsUpdatedMock = jest.fn();
const setIsParticipantMock = jest.fn();
const setApplyStatusMock = jest.fn();
const setToggleOpenMock = jest.fn();

// const mockStore = createStore(
//   combineReducers({
//     router: connectRouter(history),
//     user: (
//       state = { loginUserId: 1, notification: mockNotification },
//       action,
//     ) => state,
//   }),
//   applyMiddleware(routerMiddleware(history)),
// );

describe('Post Detail', () => {
  let postDetail: any;
  let readPostMock: any;
  let readCommentMock: any;

  beforeEach(() => {
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValueOnce(1);

    jest.spyOn(API, 'createApply').mockResolvedValueOnce(200);
    jest.spyOn(API, 'createComment').mockResolvedValueOnce({ entityId: '0' });
    jest.spyOn(API, 'createKeywords').mockResolvedValueOnce(['aaa', 'bbb']);
    jest.spyOn(API, 'deletePost').mockResolvedValueOnce();
    readCommentMock = jest
      .spyOn(API, 'queryComments')
      .mockResolvedValueOnce({ items: stubComments });
    readPostMock = jest
      .spyOn(API, 'readPost')
      .mockResolvedValueOnce({ entity: stubPost });
    jest.spyOn(API, 'acceptApply').mockResolvedValueOnce(200);
    jest.spyOn(API, 'declineApply').mockResolvedValueOnce(200);

    postDetail = (
      <Provider store={mockStore}>
        <PostDetailContainer />
      </Provider>
    );

    // readUserInfoMock = jest.spyOn(API, 'readUserInfo').mockResolvedValue({
    //   entity: stubUserInfo,
    // });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should render without error', async () => {
    useStateMock
      .mockReturnValueOnce([stubPost, setPostMock])
      .mockReturnValueOnce([stubParticipants, setParticipantsMock])
      .mockReturnValueOnce([stubComments, setCommentItemsMock])
      .mockReturnValueOnce(['hi', setNewCommentMock])
      .mockReturnValueOnce([true, setCommentsUpdatedMock])
      .mockReturnValueOnce([false, setKeywordsUpdatedMock])
      .mockReturnValueOnce([true, setIsParticipantMock])
      .mockReturnValueOnce([null, setApplyStatusMock]);
    // .mockReturnValueOnce([true, setToggleOpenMock]);
    const component = mount(postDetail);
    expect(component.find('.background').length).toBe(1);
  });

  it('should change comment input', () => {
    useStateMock
      .mockReturnValueOnce([stubPost, setPostMock])
      .mockReturnValueOnce([stubParticipants, setParticipantsMock])
      .mockReturnValueOnce([stubComments, setCommentItemsMock])
      .mockReturnValueOnce(['hi', setNewCommentMock])
      .mockReturnValueOnce([true, setCommentsUpdatedMock])
      .mockReturnValueOnce([false, setKeywordsUpdatedMock])
      .mockReturnValueOnce([true, setIsParticipantMock])
      .mockReturnValueOnce([null, setApplyStatusMock]);
    // .mockReturnValueOnce([true, setToggleOpenMock]);

    const component = mount(postDetail);
    component
      .find('#new-comment-content-input')
      .simulate('change', { target: { value: 'test comment' } });
    // expect(component.find('#new-comment-content-input').length).toBe(1);

    // expect(setNewCommentMock).toBeCalledTimes(1);
  });

  it('should add comment', () => {
    useStateMock
      .mockReturnValueOnce([stubPost, setPostMock])
      .mockReturnValueOnce([stubParticipants, setParticipantsMock])
      .mockReturnValueOnce([stubComments, setCommentItemsMock])
      .mockReturnValueOnce(['not empty', setNewCommentMock])
      .mockReturnValueOnce([true, setCommentsUpdatedMock])
      .mockReturnValueOnce([false, setKeywordsUpdatedMock])
      .mockReturnValueOnce([true, setIsParticipantMock])
      .mockReturnValueOnce([null, setApplyStatusMock]);
    // .mockReturnValueOnce([true, setToggleOpenMock]);

    const component = mount(postDetail);
    const wrapper = component.find('#confirm-create-comment-button');
    expect(wrapper.length).toBe(1);
    wrapper
      .simulate('change', { target: { value: 'test comment' } })
      .simulate('click');
    // wrapper.simulate('click');
  });

  it('should delete post', () => {
    useStateMock
      .mockReturnValueOnce([stubPost, setPostMock])
      .mockReturnValueOnce([stubParticipants, setParticipantsMock])
      .mockReturnValueOnce([stubComments, setCommentItemsMock])
      .mockReturnValueOnce(['not empty', setNewCommentMock])
      .mockReturnValueOnce([true, setCommentsUpdatedMock])
      .mockReturnValueOnce([false, setKeywordsUpdatedMock])
      .mockReturnValueOnce([true, setIsParticipantMock])
      .mockReturnValueOnce([null, setApplyStatusMock]);
    // .mockReturnValueOnce([true, setToggleOpenMock]);

    const component = mount(postDetail);
    const wrapper = component.find('PostDetail');
    // expect(wrapper.length).toBe(1);
    // wrapper.simulate('click');
  });
});
