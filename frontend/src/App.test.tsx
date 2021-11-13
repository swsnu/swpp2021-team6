import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import App from './App';
import { getMockStore } from './test-utils/mocks';
import { history } from './store/store';

const mockStore = getMockStore({});
describe('App', () => {
  it('renders without errors', () => {
    const app = (
      <Provider store={mockStore}>
        <App history={history} />
      </Provider>
    );
    const component = mount(app);
    expect(component.find('.intro-container').length).toBe(1);
  });

  it('should redirect to signin page with wrong path', () => {
    const mockHistory = createMemoryHistory({ initialEntries: ['/hello'] });
    const app = (
      <Provider store={mockStore}>
        <App history={mockHistory} />
      </Provider>
    );
    const component = mount(app);
    expect(component.find('.intro-container').length).toBe(1);
  });
});
