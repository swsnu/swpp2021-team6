import * as reactRedux from 'react-redux';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import PostCreate from '.';
import mockStore from '../../store/store';
import mockUser from '../../mocks/user.json';

const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
jest.mock('../../utils/getKakaoMap', () =>
  jest.fn((props) => <div {...props} className="map" />),
);

describe('PostCreate', () => {
  let postCreate: any;
  let spyCreatePost: any;

  beforeEach(() => {
    postCreate = (
      <Provider store={mockStore}>
        <PostCreate />
      </Provider>
    );

    window.matchMedia =
      window.matchMedia ||
      function () {
        return {
          matches: false,
          addListener() {},
          removeListener() {},
        };
      };
  });

  it('should render without error', () => {
    const component = mount(postCreate);
    // expect(component.find('form').length).toBe(1);
  });
});
