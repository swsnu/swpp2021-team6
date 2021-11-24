import { mount } from 'enzyme';
import { history } from '../../store/store';
import AddButton from '.';

const mockPush = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({ push: mockPush }),
}));

describe('Add Button', () => {
  window.matchMedia =
    window.matchMedia ||
    function () {
      return {
        matches: false,
        addListener() {},
        removeListener() {},
      };
    };
  it('should render Add Button', () => {
    const addButton = <AddButton />;
    const component = mount(addButton);
    component.find('.plus-button').simulate('click');
    expect(mockPush).toBeCalledTimes(1);
  });
});
