/* eslint-disable no-proto */
import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import * as reactRedux from 'react-redux';
import * as API from '../../backend/api/api';
import PostEdit from '.';
import mockStore from '../../store/store';

const mockPush = jest.fn();
const useStateMock = jest.spyOn(React, 'useState');
const setPostMock = jest.fn();
const setPostUpdateMock = jest.fn();

const mockPost = {
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

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({ push: mockPush }),
  useParams: () => ({ id: '1' }),
}));

const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
window.alert = jest.fn();
const confirmMock = jest.spyOn(window, 'confirm');

describe('PostCreate', () => {
  let postEdit: any;
  let readPostMock: any;
  let updatePostMock: any;
  beforeEach(() => {
    postEdit = (
      <Provider store={mockStore}>
        <PostEdit />
      </Provider>
    );

    readPostMock = jest
      .spyOn(API, 'readPost')
      .mockResolvedValue({ entity: mockPost });
    updatePostMock = jest.spyOn(API, 'updatePost').mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should render without error', () => {
    useSelectorMock.mockImplementation((callback) =>
      callback({ user: { loginUserId: 1 } }),
    );

    useStateMock
      .mockReturnValueOnce([mockPost, setPostMock])
      .mockReturnValueOnce([
        { title: '종목', description: '실력' },
        setPostUpdateMock,
      ]);
    const component = mount(postEdit);
    expect(component.find('#post-edit-container').length).toBe(1);
  });

  it('should alert when login user is not the host', () => {
    useSelectorMock.mockImplementation((callback) =>
      callback({ user: { loginUserId: 2 } }),
    );

    useStateMock
      .mockReturnValueOnce([mockPost, setPostMock])
      .mockReturnValueOnce([
        { title: '종목', description: '실력' },
        setPostUpdateMock,
      ]);
    const component = mount(postEdit);
  });

  it('should handle input change', () => {
    confirmMock.mockReturnValue(true);

    useSelectorMock.mockImplementation((callback) =>
      callback({ user: { loginUserId: 1 } }),
    );
    useStateMock
      .mockReturnValueOnce([mockPost, setPostMock])
      .mockReturnValueOnce([{ title: '', description: '' }, setPostUpdateMock]);
    const component = mount(postEdit);

    component
      .find('#title-input')
      .simulate('change', { target: { value: 'title change' } });
    component
      .find('#introduction-input')
      .simulate('change', { target: { value: 'description change' } });

    component.find('#edit-submit-button').simulate('click');
  });

  it('should alert on clicking cancel button', () => {
    confirmMock.mockReturnValue(true);
    useSelectorMock.mockImplementation((callback) =>
      callback({ user: { loginUserId: 1 } }),
    );
    useStateMock
      .mockReturnValueOnce([mockPost, setPostMock])
      .mockReturnValueOnce([{ title: '', description: '' }, setPostUpdateMock]);
    const component = mount(postEdit);

    component
      .find('#title-input')
      .simulate('change', { target: { value: 'title change' } });
    component
      .find('#introduction-input')
      .simulate('change', { target: { value: 'description change' } });

    component.find('#edit-cancel-button').simulate('click');
  });

  it('should verify form on submit', () => {
    useSelectorMock.mockImplementation((callback) =>
      callback({ user: { loginUserId: 1 } }),
    );
    useStateMock
      .mockReturnValueOnce([mockPost, setPostMock])
      .mockReturnValueOnce([
        { title: 'title', description: 'description' },
        setPostUpdateMock,
      ]);
    const component = mount(postEdit);

    component
      .find('#title-input')
      .simulate('change', { target: { value: '' } });

    component.find('#edit-submit-button').simulate('click');

    component
      .find('#title-input')
      .simulate('change', { target: { value: 'title' } });
    component
      .find('#introduction-input')
      .simulate('change', { target: { value: '' } });

    component.find('#edit-submit-button').simulate('click');
  });
});
