/* eslint-disable no-proto */
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { DatePicker } from 'antd';
import PostCreate from '.';
import mockStore from '../../store/store';
import * as API from '../../backend/api/api';
import { UserInfoEntity } from '../../backend/entity/user';
import * as kakaoMap from '../../utils/getKakaoMap';

const StubUserInfo: UserInfoEntity = {
  userId: 1,
  nickname: 'nickname',
  latitude: 123,
  longitude: 456,
  gu: '관악구',
  dong: '신림동',
  gender: '여성',
  introduction: '',
  preferredExercise: [{ exerciseName: '축구', skillLevel: '상' }],
  participatingPost: [],
  hostingPost: [],
};

describe('PostCreate', () => {
  let postCreate: any;
  let readUserInfoMock: any;
  beforeEach(() => {
    postCreate = (
      <Provider store={mockStore}>
        <PostCreate />
      </Provider>
    );

    readUserInfoMock = jest.spyOn(API, 'readUserInfo').mockResolvedValue({
      entity: StubUserInfo,
    });
    jest.spyOn(kakaoMap, 'getKakaoMap').mockImplementation();
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValueOnce(1);
    window.alert = jest.fn();
  });

  it('should render without error', () => {
    const component = mount(postCreate);
    expect(component.find('#post-create').length).toBe(1);
    expect(readUserInfoMock).toBeCalledTimes(1);
  });

  it('should handle capacity input change properly', () => {
    const component = mount(postCreate);
    component
      .find('#min-capacity')
      .simulate('change', { target: { value: 2 } });
    component
      .find('#max-capacity')
      .simulate('change', { target: { value: 3 } });
    component
      .find('#min-capacity')
      .simulate('change', { target: { value: 5 } });
    expect(window.alert).toBeCalledTimes(1);

    component
      .find('#max-capacity')
      .simulate('change', { target: { value: 1 } });
    expect(window.alert).toBeCalledTimes(2);
  });

  it('should search places', () => {
    const component = mount(postCreate);
    const searchInput = component.find('#search-container > input');
    searchInput.simulate('change', {
      target: { value: '서울대학교 테니스장' },
    });
    searchInput.simulate('keypress', { key: 'Enter' });
    component.find('#search-container > button').simulate('click');
  });

  it('should validate submit form', () => {
    const component = mount(postCreate);
    const submitButton = component.find('#submit-button');

    // alert when exercise & skill level are not set
    submitButton.simulate('click');
    expect(window.alert).toBeCalledTimes(1);

    // alert when post title is not set
    component
      .find('#exerciseType')
      .simulate('change', { target: { value: '축구' } });
    component
      .find('#expectedLevel')
      .simulate('change', { target: { value: '상' } });
    submitButton.simulate('click');
    expect(window.alert).toBeCalledTimes(2);

    // alert when description is not set
    component
      .find('#title-input')
      .simulate('change', { target: { value: 'title' } });
    submitButton.simulate('click');
    expect(window.alert).toBeCalledTimes(3);

    // alert when kakaotalk link is not set
    component
      .find('#introduction-input')
      .simulate('change', { target: { value: 'description' } });
    submitButton.simulate('click');
    expect(window.alert).toBeCalledTimes(4);

    // alert when kakaotalk link is not valid
    component
      .find('#kakaotalk-link-input')
      .simulate('change', { target: { value: 'kakaotalk link' } });
    submitButton.simulate('click');
    expect(window.alert).toBeCalledTimes(5);

    // alert when place is not set
    component
      .find('#kakaotalk-link-input')
      .simulate('change', { target: { value: 'open.kakao.com' } });
    submitButton.simulate('click');
    expect(window.alert).toBeCalledTimes(6);
  });
});
