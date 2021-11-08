import { PostEntity } from '../../model/post';

export type PostState = {
  postList: PostEntity[];
  post: PostEntity | null;
};

const initialState: PostState = {
  postList: [],
  post: null,
};

const reducer = {};

export default reducer;
