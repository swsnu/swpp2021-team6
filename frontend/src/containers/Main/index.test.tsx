/* eslint-disable function-paren-newline */
/* eslint-disable prefer-const */
import { Provider } from 'react-redux';
import * as reactRedux from 'react-redux';
import { mount } from 'enzyme';
import mockStore, { history } from '../../store/store';
import mockPosts from '../../mocks/posts.json';
import Main from '.';
import * as postActionCreators from '../../store/actions/post';

const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');

describe('Main', () => {
  let main: any;
  let spyHistoryPush: any;
  let spyGetPosts: any;
  beforeEach(() => {
    main = (
      <Provider store={mockStore}>
        <Main history={history} />
      </Provider>
    );
    useSelectorMock.mockReturnValue(mockPosts);
    useDispatchMock.mockReturnValue(jest.fn());
    spyHistoryPush = jest.spyOn(history, 'push').mockImplementation();
    spyGetPosts = jest
      .spyOn(postActionCreators, 'getPosts')
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
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should render without error', () => {
    const component = mount(main);
    expect(component.find('.main').length).toBe(1);
    expect(spyGetPosts).toBeCalledTimes(1);
  });

  it('should render mockPosts', () => {
    const component = mount(main);
    expect(component.find('.post').length).toBe(1);
  });
});
