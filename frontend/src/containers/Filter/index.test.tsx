import { shallow } from 'enzyme';
import Filter from '.';

describe('Filter', () => {
  it('should render without errors', () => {
    const component = shallow(<Filter />);
    const wrapper = component.find('.filter');
    expect(wrapper.length).toBe(1);
  });
});
