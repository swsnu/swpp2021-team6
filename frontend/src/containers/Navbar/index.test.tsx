import { mount, shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import Navbar from './index';
import mockStore from '../../store/store';

describe('<Navbar /', () => {
  let navbar: any;
  const history = createMemoryHistory({ initialEntries: ['/'] });

  beforeEach(() => {
    navbar = (
      <Provider store={mockStore}>
        <Navbar history={history} />
      </Provider>
    );
  });

  it('should render without errors', () => {
    const component = mount(navbar);
    const wrapper = component.find('.nav-bar');
    expect(wrapper.length).toBe(1);
  });

  it('should handle click home button', () => {
    const spyHistoryPush = jest.spyOn(history, 'push').mockImplementation();
    const component = mount(navbar);
    const wrapper = component.find('.logo');
    wrapper.simulate('click');
    expect(spyHistoryPush).toBeCalledTimes(1);
  });

  it('should handle click mypage button', () => {
    // const mockClickHome = jest.fn();
    const spyHistoryPush = jest.spyOn(history, 'push').mockImplementation();
    const component = mount(navbar);
    const wrapper = component.find('.mypage');
    wrapper.simulate('click');
    expect(spyHistoryPush).toBeCalledTimes(1);
  });

  it('should handle click notification button', () => {
    const spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const component = mount(navbar);
    const wrapper = component.find('.notification');
    wrapper.simulate('click');
    expect(spyAlert).toBeCalledTimes(1);
  });
});
