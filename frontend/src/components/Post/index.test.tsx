import { mount } from 'enzyme';
import Post from '.';
import { history } from '../../store/store';

const soccerMockPost = {
  post_id: 1,
  host_id: 1,
  exercise_name: '축구',
  expected_level: '상',
  title: '용산구에서 같이 축구하실 분~',
  description: '가볍게 축구하실 분 구해요',
  meet_at: '2021-11-11 19:00',
  min_capacity: 5,
  max_capacity: 10,
  member_count: 3,
  place: {
    name: '용산공업고등학교',
    latitude: 37.524298,
    longitude: 126.967529,
    gu: '용산구',
    dong: '용산동',
    address: '서울특별시 용산구 한강로3가',
    telephone: '02-2648-1264',
  },
  kakaotalk_link: 'https://open.kakao.com/o/stl6nIeb',
  status: '모집 중',
  keywords: ['뒤풀이', 'MBTI E', '이번 주말'],
};

const basketballMockPost = {
  post_id: 1,
  host_id: 1,
  exercise_name: '농구',
  expected_level: '중',
  title: '용산구에서 같이 축구하실 분~',
  description: '가볍게 축구하실 분 구해요',
  meet_at: '2021-11-11 19:00',
  min_capacity: 5,
  max_capacity: 10,
  member_count: 3,
  place: {
    name: '용산공업고등학교',
    latitude: 37.524298,
    longitude: 126.967529,
    gu: '용산구',
    dong: '용산동',
    address: '서울특별시 용산구 한강로3가',
    telephone: '02-2648-1264',
  },
  kakaotalk_link: 'https://open.kakao.com/o/stl6nIeb',
  status: '모집 중',
  keywords: ['뒤풀이', 'MBTI E', '이번 주말'],
};

const levelLowMockPost = {
  post_id: 1,
  host_id: 1,
  exercise_name: '농구',
  expected_level: '하',
  title: '용산구에서 같이 축구하실 분~',
  description: '가볍게 축구하실 분 구해요',
  meet_at: '2021-11-11 19:00',
  min_capacity: 5,
  max_capacity: 10,
  member_count: 3,
  place: {
    name: '용산공업고등학교',
    latitude: 37.524298,
    longitude: 126.967529,
    gu: '용산구',
    dong: '용산동',
    address: '서울특별시 용산구 한강로3가',
    telephone: '02-2648-1264',
  },
  kakaotalk_link: 'https://open.kakao.com/o/stl6nIeb',
  status: '모집 중',
  keywords: ['뒤풀이', 'MBTI E', '이번 주말'],
};

const levelNoneMockPost = {
  post_id: 1,
  host_id: 1,
  exercise_name: '축구',
  expected_level: '상관 없음',
  title: '용산구에서 같이 축구하실 분~',
  description: '가볍게 축구하실 분 구해요',
  meet_at: '2021-11-11 19:00',
  min_capacity: 5,
  max_capacity: 10,
  member_count: 3,
  place: {
    name: '용산공업고등학교',
    latitude: 37.524298,
    longitude: 126.967529,
    gu: '용산구',
    dong: '용산동',
    address: '서울특별시 용산구 한강로3가',
    telephone: '02-2648-1264',
  },
  kakaotalk_link: 'https://open.kakao.com/o/stl6nIeb',
  status: '모집 중',
  keywords: ['뒤풀이', 'MBTI E', '이번 주말'],
};

const mockPostWithWrongData = {
  post_id: 1,
  host_id: 1,
  exercise_name: '양궁',
  expected_level: '고수',
  title: '용산구에서 같이 축구하실 분~',
  description: '가볍게 축구하실 분 구해요',
  meet_at: '2021-11-11 19:00',
  min_capacity: 5,
  max_capacity: 10,
  member_count: 3,
  place: {
    name: '용산공업고등학교',
    latitude: 37.524298,
    longitude: 126.967529,
    gu: '용산구',
    dong: '용산동',
    address: '서울특별시 용산구 한강로3가',
    telephone: '02-2648-1264',
  },
  kakaotalk_link: 'https://open.kakao.com/o/stl6nIeb',
  status: '모집 중',
  keywords: ['뒤풀이', 'MBTI E', '이번 주말'],
};

describe('Post', () => {
  window.matchMedia =
    window.matchMedia ||
    function () {
      return {
        matches: false,
        addListener() {},
        removeListener() {},
      };
    };
  it('should render soccer image with level high label', () => {
    const post = <Post history={history} post={soccerMockPost} />;
    const component = mount(post);
    expect(component.find('.level-label').at(0).text()).toBe('실력 : 상');
  });

  it('should render basketball image with level middle label', () => {
    const post = <Post history={history} post={basketballMockPost} />;
    const component = mount(post);
    expect(component.find('.level-label').at(0).text()).toBe('실력 : 중');
  });

  it('should render basketball image with level low label', () => {
    const post = <Post history={history} post={levelLowMockPost} />;
    const component = mount(post);
    expect(component.find('.level-label').at(0).text()).toBe('실력 : 하');
  });

  it('should render soccer image with level none label', () => {
    const post = <Post history={history} post={levelNoneMockPost} />;
    const component = mount(post);
    expect(component.find('.level-label').at(0).text()).toBe(
      '실력 : 상관 없음',
    );
  });

  it('should alert with wrong data', () => {
    window.alert = jest.fn().mockImplementation();
    const post = <Post history={history} post={mockPostWithWrongData} />;
    const component = mount(post);
  });

  it('should redirect to post detail page when clicked', () => {
    const spyHistoryPush = jest.spyOn(history, 'push').mockImplementation();
    const post = <Post history={history} post={soccerMockPost} />;
    const component = mount(post);
    component.find('.post').simulate('click');
    expect(spyHistoryPush).toBeCalledTimes(1);
  });
});
