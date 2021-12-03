import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import { PostEntity } from '../../backend/entity/post';
import PostDetail from '../../components/PostDetail';
import { AppState } from '../../store/store';
import {
  createComment,
  deletePost,
  queryComments,
  readPost,
  readUser,
} from '../../backend/api/api';
import CommentsListItem from '../../components/Comment';
import { UserEntity } from '../../backend/entity/user';
import { CommentEntity } from '../../backend/entity/comment';

type PostItem = PostEntity & { hostName: string };
type CommentItem = CommentEntity & { authorName: string };

const PostDetailContainer: React.FC = () => {
  const history = useHistory();
  const postId: number = Number(useParams<{ id: string }>().id);
  const [postItem, setPost] = useState<PostItem>();
  const [commentItems, setCommentItems] = React.useState<CommentItem[]>([]);
  const [newComment, setNewComment] = React.useState<string>('');
  const [commentsUpdated, setCommentsUpdated] = React.useState<boolean>(false);
  const { user } = useSelector((state: AppState) => state.user);

  const onCommentConfirm = async (comment: string | null) => {
    if (user?.userId && comment) {
      await createComment({
        createPayload: {
          author_id: user?.userId,
          content: comment,
          post_id: postId,
        },
        postId,
      });
      setCommentsUpdated(true);
      setNewComment('');
    }
  };

  const onPostDelete = async () => {
    await deletePost({ id: postId });
    history.push('/main');
  };

  // Fetch Post on mount
  // useEffect(() => {
  //   readPost({ id: postId }).then((res) => {
  //     setPost(res.entity);
  //   });
  // }, [postId]);

  const fetchPostItem = async () => {
    const post: PostEntity = (await readPost({ id: postId })).entity;
    const host: UserEntity = (await readUser({ id: post.hostId })).entity;
    setPost({ ...post, hostName: host.nickname });
  };

  const fetchComments = async () => {
    const comments: CommentEntity[] = (
      await queryComments({ postId })
    ).items.filter((c) => c.post_id === postId);
    console.log(comments);
    const commentsList: CommentItem[] = (
      await Promise.all(comments.map((c) => readUser({ id: c.author_id })))
    ).map((u, i) => ({
      ...comments[i],
      authorName: u.entity.nickname,
    }));
    setCommentItems(commentsList);
  };

  // Redirect to sign-in page if not signed in
  useEffect(() => {
    if (user === null) history.push('/signin');
  }, [user]);

  useEffect(() => {
    fetchPostItem();
    fetchComments();
  }, []);

  useEffect(() => {
    if (commentsUpdated) {
      fetchComments();
      setCommentsUpdated(false);
    }
  }, [commentsUpdated]);
  // Render Component
  if (postItem === undefined) return null;
  return (
    <>
      <div id="post-detail-page">
        <PostDetail
          post={postItem}
          isHost={user?.userId === postItem.hostId}
          onDelete={onPostDelete}
        />
        {commentItems.map((c, i) => (
          <CommentsListItem
            commentId={c.comment_id}
            content={c.content}
            authorId={c.author_id}
            authorName={c.authorName}
            postId={c.post_id}
            createdAt={c.created_at}
            setCommentsUpdated={setCommentsUpdated}
            key={i}
          />
        ))}
        Comment
        <textarea
          id="new-comment-content-input"
          rows={2}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          id="confirm-create-comment-button"
          onClick={() => onCommentConfirm(newComment)}
          disabled={!newComment}
        >
          Confirm Comment
        </button>
        <br /> <br />
        <button
          id="back-detail-article-button"
          onClick={() => history.push('/articles')}
        >
          Back
        </button>
      </div>
    </>
  );
};

export default PostDetailContainer;
