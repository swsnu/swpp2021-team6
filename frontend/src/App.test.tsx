import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from './App';
import { getMockStore } from './test-utils/mocks';
import { history } from './store/store';

const mockStore = getMockStore({});

test('renders learn react link', () => {
  render(
    <Provider store={mockStore}>
      <App history={history} />
    </Provider>,
  );
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
