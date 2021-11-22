import React from 'react';
import { mount } from 'enzyme';
import SignUp from './index';
import { history } from '../../store/store';

describe('SignUp', () => {
  let signup: any;
  beforeEach(() => {
    signup = <SignUp history={history} />;
    window.alert = jest.fn().mockImplementation();
  });

  it('SignUp renders without crashing', () => {
    const component = mount(signup);
    expect(component.find('SignUp').length).toBe(1);
  });
});
