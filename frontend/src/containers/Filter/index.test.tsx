import { mount, shallow } from 'enzyme';
import Filter from '.';
import { FilterInputDTO } from '../../backend/entity/exercise';

describe('Filter', () => {
  let filter: any;
  const stubFilterArray: FilterInputDTO[] = [
    { exerciseName: '축구', skillLevel: '상' },
  ];
  const setFilterArrayMock = jest.fn();
  const onClickApplyFilterMock = jest.fn();
  const setsortMock = jest.fn();
  const setScopeMock = jest.fn();
  beforeEach(() => {
    filter = (
      <Filter
        filterArray={stubFilterArray}
        setFilterArray={setFilterArrayMock}
        onClickApplyFilter={onClickApplyFilterMock}
        scope={5}
        setSort={setsortMock}
        setScope={setScopeMock}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should render without errors', () => {
    const component = shallow(
      <Filter
        filterArray={stubFilterArray}
        setFilterArray={setFilterArrayMock}
        onClickApplyFilter={onClickApplyFilterMock}
        scope={5}
        setSort={setsortMock}
        setScope={setScopeMock}
      />,
    );
    const wrapper = component.find('.filter');
    expect(wrapper.length).toBe(1);
  });

  it('should delete filter content', () => {
    const component = mount(filter);
    component.find('.filter-content').find('button').simulate('click');
  });

  it('should set selected filter', () => {
    const component = mount(filter);
    component
      .find('#exercise-select')
      .simulate('change', { target: { value: '농구' } });
    component
      .find('.level-select')
      .simulate('change', { target: { value: '상' } });
  });

  it('should not set selected filter that is duplicate', () => {
    const component = mount(filter);
    component
      .find('#exercise-select')
      .simulate('change', { target: { value: '축구' } });
    component
      .find('.level-select')
      .simulate('change', { target: { value: '상' } });
  });

  it('should set distance', () => {
    const component = mount(filter);
    component
      .find('#range-container')
      .find('input')
      .simulate('change', { target: { value: 3 } });
  });

  it('should set sort', () => {
    const component = mount(filter);
    component
      .find('#sort-select')
      .simulate('change', { target: { value: 'meet_at' } });
  });
});
