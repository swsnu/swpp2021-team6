import axios from 'axios';
import humps from 'humps';
import {
  SignUpDTO,
  UserProfileDTO,
  UserInfoEntity,
  UpdateProfileDTO,
  UserIdEntity,
} from '../entity/user';
import { CommentEntity, CreateCommentEntity } from '../entity/comment';
import { CreatePostEntity, PostEntity, UpdatePostDTO } from '../entity/post';
import {
  CreateProps,
  produceCreateAPI,
  produceDeleteAPI,
  produceQueryAPI,
  produceReadAPI,
  produceUpdateAPI,
  queryReturnType,
} from './apiUtils';

export const createPost = produceCreateAPI<CreatePostEntity, PostEntity>(
  '/posts/',
);
export const queryPosts = produceQueryAPI<PostEntity>('/posts/get');
export const readPost = produceReadAPI<PostEntity>('/posts/get');
export const deletePost = produceDeleteAPI('/posts');
export const updatePost = produceUpdateAPI<UpdatePostDTO>('/posts');

export const createUser = produceCreateAPI<SignUpDTO, UserIdEntity>(
  '/users/signup',
);
export const createUserProfile = async ({
  createPayload,
  userId,
}: CreateProps<UserProfileDTO> & { userId: number }) => {
  await axios.post(`/users/${userId}`, createPayload);
};

export const readUserInfo = produceReadAPI<UserInfoEntity>('/users/get');
export const updateProfile = produceUpdateAPI<UpdateProfileDTO>('/users');

export const queryFilterPosts = async (
  filterString: string,
): Promise<queryReturnType<PostEntity>> => {
  const res = await axios.get(`/posts/?${filterString}`);
  return { items: humps.camelizeKeys(res.data) as PostEntity[] };
};

export const createApply = async (postId: number): Promise<number> => {
  const { status } = await axios.post(`/posts/${postId}/apply`);
  return status;
};
export const acceptApply = async (
  postId: number,
  userId: number,
): Promise<number> => {
  const { status } = await axios.post(
    `/posts/${postId}/participants/${userId}/accept`,
  );
  return status;
};

export const declineApply = async (
  postId: number,
  userId: number,
): Promise<number> => {
  const { status } = await axios.post(
    `/posts/${postId}/participants/${userId}/decline`,
  );
  return status;
};

export const queryComments = async ({
  postId,
}: {
  postId: number;
}): Promise<queryReturnType<CommentEntity>> => {
  const res = await axios.get(`/posts/get/${postId}/comments`);
  return { items: res.data };
};

export const createComment = async ({
  createPayload,
  postId,
}: CreateProps<CreateCommentEntity> & { postId: number }): Promise<{
  entityId: string;
}> => {
  const res: any = await axios.post(`/posts/${postId}/comments`, createPayload);
  return { entityId: `${res.data.id}` };
};

export const readComment = produceReadAPI<CommentEntity>('/posts/get/comments');
export const updateComment = produceUpdateAPI<CommentEntity>('/posts/comments');
export const deleteComment = produceDeleteAPI('/posts/comments');
