import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import App from './App';
import { getMockStore } from './test-utils/mocks';
import { history } from './store/store';

const mockStore = getMockStore({});
describe('App', () => {
  let app: any;

  beforeEach(() => {
    app = (
      <Provider store={mockStore}>
        <App history={history} />
      </Provider>
    );
  });

  it('renders without errors', () => {
    const component = mount(app);
    expect(component.find('.intro-container').length).toBe(1);
  });
});
