import * as reactRedux from 'react-redux';
import { mount, shallow } from 'enzyme';
import * as postActionCreators from '../../store/actions/post';
import PostCreate from '.';

const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');

describe('PostCreate', () => {
  let postCreate: any;
  let spyCreatePost: any;

  beforeEach(() => {
    postCreate = <PostCreate />;
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
    expect(component.find('form').length).toBe(1);
  });
});
