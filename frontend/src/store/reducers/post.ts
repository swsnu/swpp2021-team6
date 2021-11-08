import { PostEntity } from '../../model/post';

export type PostState = {
  articleList: PostEntity[];
  article: PostEntity | null;
};

const initialState: PostState = {
  articleList: [],
  article: null,
};

const reducer = {};

export default reducer;
