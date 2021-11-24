import { mount } from 'enzyme';
import { history } from '../../store/store';
import AddButton from '.';

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
    const spyHistoryPush = jest.spyOn(history, 'push').mockImplementation();
    const addButton = <AddButton />;
    const component = mount(addButton);
    component.find('.plus-button').simulate('click');
    expect(spyHistoryPush).toBeCalledTimes(1);
  });
});
