import { mount } from 'enzyme';
import { history } from '../../store/store';
import AddButton from '.';

describe('Add Button', () => {
  window.matchMedia =
    window.matchMedia ||
    // eslint-disable-next-line func-names
    function () {
      return {
        matches: false,
        addListener() {},
        removeListener() {},
      };
    };
  it('should render Add Button', () => {
    const spyHistoryPush = jest.spyOn(history, 'push').mockImplementation();
    const addButton = <AddButton history={history} />;
    const component = mount(addButton);
    component.find('.plus-button').simulate('click');
    expect(spyHistoryPush).toBeCalledTimes(1);
  });
});
