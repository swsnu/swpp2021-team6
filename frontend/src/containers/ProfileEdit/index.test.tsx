import React from 'react';
import { mount } from 'enzyme';
import ProfileEdit from './index';

describe('ProfileEdit', () => {
  let profileEdit: any;
  beforeEach(() => {
    profileEdit = <ProfileEdit />;
  });

  it('SignUp renders without crashing', () => {
    const component = mount(profileEdit);
    expect(component.find('ProfileEdit').length).toBe(1);
  });
});
