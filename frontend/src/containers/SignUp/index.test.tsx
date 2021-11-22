import React from 'react';
import { mount } from 'enzyme';
import SignUp from './index';
import { history } from '../../store/store';
import { mockNavigatorGeolocation } from '../../test-utils/mockNavigatorGeolocation';
import { SignUpInputDTO } from '../../types/user';

const mockResult = { gu: '관악구', dong: '신림동' };
jest.mock('../../utils/getGuDong', () => jest.fn(() => mockResult));

describe('SignUp', () => {
  let signup: any;
  beforeEach(() => {
    signup = <SignUp history={history} />;
    window.alert = jest.fn().mockImplementation();
  });

  it('should render without crashing', () => {
    const component = mount(signup);
    expect(component.find('SignUp').length).toBe(1);
  });

  it('cannot call getGuDong without geolocation', () => {
    const component = mount(signup);
    expect(component.find('.gu-dong-loading').text()).toBe('동네 정보 조회 중');
    expect(window.alert).toBeCalledTimes(1);
  });

  it('should call getGuDong with geolocation', () => {
    const { getCurrentPositionMock } = mockNavigatorGeolocation();
    getCurrentPositionMock.mockImplementation();
    const component = mount(signup);
    // expect(component.find('.gu-dong').text()).toBe('관악구 신림동');
  });

  it('should change username', () => {
    const component = mount(signup);
    // component
    //   .find('.username-input')
    //   .at(0)
    //   .simulate('change', { target: { value: 'test username' } });
    component.find('.signup-submit-button').at(0).simulate('click');
    expect(window.alert).toBeCalledTimes(1);
  });
});
