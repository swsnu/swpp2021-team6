import { Provider } from 'react-redux';
import React from 'react';
import { mount, shallow } from 'enzyme';
import axios from 'axios';
import * as reactRedux from 'react-redux';
import PostDetailContainer from '.';
import mockStore from '../../store/store';
import * as API from '../../backend/api/api';
import { UserInfoEntity } from '../../backend/entity/user';
import { CommentEntity } from '../../backend/entity/comment';
import { ParticipantType, PostEntity } from '../../backend/entity/post';

jest.useFakeTimers();

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
    status: '승인 대기 중',
  },
];

const mockPush = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({ push: mockPush }),
  useParams: () => ({ id: '1' }),
}));

const useStateMock = jest.spyOn(React, 'useState');
const setPostMock = jest.fn();
const setParticipantsMock = jest.fn();
const setCommentItemsMock = jest.fn();
const setNewCommentMock = jest.fn();
const setCommentsUpdatedMock = jest.fn();
const setIsParticipantMock = jest.fn();
const setApplyStatusMock = jest.fn();

describe('PostCreate', () => {
  let postDetail: any;
  let readUserInfoMock: any;
  let readPostMock: any;
  let readCommentMock: any;
  const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');

  beforeEach(() => {
    useStateMock
      .mockReturnValueOnce([stubPost, setPostMock])
      .mockReturnValueOnce([stubParticipants, setParticipantsMock])
      .mockReturnValueOnce([stubComments, setCommentItemsMock])
      .mockReturnValueOnce(['hi', setNewCommentMock])
      .mockReturnValueOnce([false, setCommentsUpdatedMock])
      .mockReturnValueOnce([false, setIsParticipantMock])
      .mockReturnValueOnce([null, setApplyStatusMock]);
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
    // readCommentMock = jest
    //   .spyOn(API, 'queryComments')
    //   .mockResolvedValue({ items: stubComments });
  });

  it('should render without error', () => {
    // jest.spyOn(axios, 'get').mockResolvedValueOnce({ entity: stubUserInfo });
    // jest.spyOn(axios, 'get').mockResolvedValueOnce({ items: stubComments });
    const component = mount(postDetail);
    // component.find('#post-detail-page');
  });

  // it('should change commentinput', () => {
  //   const component = mount(postDetail);
  //   component
  //     .find('#new-comment-content-input')
  //     .simulate('change', { target: { value: 'test comment' } });
  //   expect(setNewCommentMock).toBeCalledTimes(1);
  // });

  // it('should render without error', () => {
  //   jest.spyOn(axios, 'get').mockResolvedValueOnce({ entity: stubUserInfo });
  //   jest.spyOn(axios, 'get').mockResolvedValueOnce({ items: stubComments });
  //   const component = mount(postDetail);
  //   // expect(component.find('#post-detail-page').length).toBe(1);
  // });
});
