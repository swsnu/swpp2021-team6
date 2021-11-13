import React from 'react';
import { mount } from 'enzyme';
import SignUp from './index';

describe('SignUp', () => {
  let signup: any;
  beforeEach(() => {
    signup = <SignUp />;
  });

  it('SignUp renders without crashing', () => {
    const component = mount(signup);
    expect(component.find('SignUp').length).toBe(1);
  });
});
