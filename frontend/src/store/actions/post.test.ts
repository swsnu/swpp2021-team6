import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as actionCreators from './post';
import stubPost from '../../mocks/post.json';
import stubPosts from '../../mocks/posts.json';
import { CreatePostEntity } from '../../types/post';
import { PostState } from '../reducers/post';
import { getMockStore } from '../../test-utils/mocks';

const stubNewPost: CreatePostEntity = {
  exerciseName: '축구',
  expectedLevel: '상',
  title: '우리 축구해요',
  description: '가볍게 축구하실 분 구해요',
  meetAt: '2021-11-11 19:00',
  minCapacity: 3,
  maxCapacity: 7,
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
};

const stubInitialState: PostState = {
  posts: [],
  post: null,
};

const mockStore = getMockStore(stubInitialState);
console.log = jest.fn().mockImplementation();

describe('ActionCreators', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("'getPosts' should fetch posts", (done) => {
    const spy = jest.spyOn(axios, 'get').mockResolvedValue({
      status: 200,
      data: stubPosts,
    });

    mockStore.dispatch<any>(actionCreators.getPosts()).then(() => {
      expect(spy).toBeCalledTimes(1);
      done();
    });
  });

  it("'getPosts' should log error when failing", (done) => {
    const spy = jest.spyOn(axios, 'get').mockRejectedValue({
      status: 400,
    });

    mockStore.dispatch<any>(actionCreators.getPosts());
    expect(spy).toBeCalledTimes(1);
    done();
  });

  it("'getPost' should fetch post", (done) => {
    const spy = jest
      .spyOn(axios, 'get')
      .mockResolvedValue({ status: 200, data: stubPost });

    mockStore.dispatch<any>(actionCreators.getPost(1)).then(() => {
      expect(spy).toBeCalledTimes(1);
      done();
    });
  });

  it("'getPost' should log error when failing", (done) => {
    const spy = jest.spyOn(axios, 'get').mockRejectedValue({
      status: 400,
    });

    mockStore.dispatch<any>(actionCreators.getPost(1));
    expect(spy).toBeCalledTimes(1);
    done();
  });

  it("'selectPost' should set selectedPost", () => {
    jest.spyOn(axios, 'get').mockRejectedValue({
      status: 400,
    });

    mockStore.dispatch<any>(actionCreators.selectPost(1));
    const returnAction = actionCreators.selectPost_(1);
    expect(returnAction.type).toBe(actionTypes.SELECT_POST);
  });

  it("'createPost' should create post", (done) => {
    const spy = jest.spyOn(axios, 'post').mockResolvedValue({
      status: 201,
      data: stubPost,
    });

    mockStore.dispatch<any>(actionCreators.createPost(stubNewPost)).then(() => {
      expect(spy).toBeCalledTimes(1);
      done();
    });
  });
});
