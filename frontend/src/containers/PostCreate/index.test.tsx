import * as reactRedux from 'react-redux';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import * as postActionCreators from '../../store/actions/post';
import PostCreate from '.';
import mockStore, { history } from '../../store/store';
import mockUser from '../../mocks/user.json';
import * as kakaoMapFunctions from '../../utils/getKakaoMap';

const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
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
    useSelectorMock.mockReturnValue(mockUser);
    useDispatchMock.mockReturnValue(jest.fn());
    spyCreatePost = jest
      .spyOn(postActionCreators, 'createPost')
      .mockImplementation();
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
    const component = shallow(postCreate);
    // expect(component.find('form').length).toBe(1);
  });
});
