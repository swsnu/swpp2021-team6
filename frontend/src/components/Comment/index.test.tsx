import React from 'react';
import * as reactRedux from 'react-redux';
import { mount } from 'enzyme';
import axios from 'axios';
import Comment from '.';

const stubCommentProps = {
  commentId: 1,
  content: 'hello',
  authorId: 1,
  authorName: 'username',
  postId: 1,
  createdAt: '7분 전',
  setCommentsUpdated: jest.fn(),
};

const useStateMock = jest.spyOn(React, 'useState');
describe('Comment', () => {
  let comment: any;

  beforeEach(() => {
    comment = <Comment {...stubCommentProps} />;
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockImplementation((callback) =>
      callback({ user: { loginUserId: 1 } }),
    );
    jest.spyOn(axios, 'delete').mockResolvedValueOnce({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should render without error', () => {
    useStateMock
      .mockReturnValueOnce([false, jest.fn()])
      .mockReturnValueOnce(['new comment', jest.fn()]);
    const component = mount(comment);
    expect(component.find('#comments-list-item').length).toBe(1);
  });

  it('should delete comment', () => {
    useStateMock
      .mockReturnValueOnce([false, jest.fn()])
      .mockReturnValueOnce(['new comment', jest.fn()]);
    const component = mount(comment);
    component.find('#delete-comment-button').simulate('click');
  });

  it('should edit comment', () => {
    jest.spyOn(axios, 'patch').mockResolvedValueOnce({});
    useStateMock
      .mockReturnValueOnce([true, jest.fn()])
      .mockReturnValueOnce(['new comment', jest.fn()]);
    const component = mount(comment);
    component.find('#edit-comment-button').simulate('click');
    component
      .find('#content-edit-input')
      .simulate('change', { target: { value: 'new comment' } });
    component.find('#edit-done-button').simulate('click');
  });
});
