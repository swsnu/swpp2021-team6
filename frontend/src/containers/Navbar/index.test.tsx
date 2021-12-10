import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import Navbar from './index';
import mockStore from '../../store/store';

const mockPush = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({ push: mockPush }),
  useParams: () => ({ id: '1' }),
}));

describe('<Navbar /', () => {
  let navbar: any;

  beforeEach(() => {
    navbar = (
      <Provider store={mockStore}>
        <Navbar />
      </Provider>
    );
  });

  it('should render without errors', () => {
    const component = mount(navbar);
    const wrapper = component.find('.nav-bar');
    expect(wrapper.length).toBe(1);
  });

  it('should handle click home button', () => {
    const component = mount(navbar);
    const wrapper = component.find('.logo');
    wrapper.simulate('click');
    expect(mockPush).toBeCalledTimes(1);
  });

  it('should handle click mypage button', () => {
    const component = mount(navbar);
    const wrapper = component.find('.mypage');
    wrapper.simulate('click');
    expect(mockPush).toBeCalledTimes(1);
  });

  it('should handle click notification button', () => {
    const spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const component = mount(navbar);
    const wrapper = component.find('Notification');
  });
});
