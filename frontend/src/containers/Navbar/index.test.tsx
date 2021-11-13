import React from 'react';
import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import Navbar from './index';

describe('<Navbar /', () => {
  // beforeEach(
  //   const history = createMemoryHistory({ initialEntries: ['/'] });
  // );
  it('should render without errors', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    const component = shallow(<Navbar history={history} />);
    const wrapper = component.find('.nav-bar');
    expect(wrapper.length).toBe(1);
  });

  it('should handle click home button', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    // const mockClickHome = jest.fn();
    const spyHistoryPush = jest.spyOn(history, 'push').mockImplementation();
    const component = shallow(<Navbar history={history} />);
    const wrapper = component.find('.Logo');
    wrapper.simulate('click');
    expect(spyHistoryPush).toBeCalledTimes(1);
  });

  it('should handle click mypage button', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    // const mockClickHome = jest.fn();
    const spyHistoryPush = jest.spyOn(history, 'push').mockImplementation();
    const component = shallow(<Navbar history={history} />);
    const wrapper = component.find('.mypage');
    wrapper.simulate('click');
    expect(spyHistoryPush).toBeCalledTimes(1);
  });

  it('should handle click notification button', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    const spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
    // const mockClickHome = jest.fn();
    const component = shallow(<Navbar history={history} />);
    const wrapper = component.find('.notification');
    wrapper.simulate('click');
    expect(spyAlert).toBeCalledTimes(1);
  });
});
