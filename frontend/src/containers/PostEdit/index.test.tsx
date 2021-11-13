import React from 'react';
import { mount } from 'enzyme';
import PostEdit from './index';

describe('PostEdit', () => {
  let postEdit: any;
  beforeEach(() => {
    postEdit = <PostEdit />;
  });

  it('SignUp renders without crashing', () => {
    const component = mount(postEdit);
    expect(component.find('PostEdit').length).toBe(1);
  });
});
