import React from 'react';
import { cleanup, render, screen, act, waitFor, getByText, queryByText, fireEvent, getByAltText, getByTestId, queryByTestId } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router, Route, MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import fetchMock from 'jest-fetch-mock';
import userEvent from '@testing-library/user-event';
import CreateEncounter from './CreateEncounter';
import '@testing-library/jest-dom/extend-expect';

// const history = createMemoryHistory();

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

afterEach(cleanup);

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const toRender = (id) => {
  const routerEntry = `/patients/${id}/encounters/create`;
  return (
    <MemoryRouter initialEntries={[routerEntry]}>
      <Route path="/patients/:id/encounters/create">
        <CreateEncounter />
      </Route>
    </MemoryRouter>
  );
};

const fillInputData = () => {
  userEvent.type(screen.getByTestId('notes'), 'test');
  userEvent.type(screen.getByTestId('visit'), 'test');
  userEvent.type(screen.getByTestId('provider'), 'test');
  userEvent.type(screen.getByTestId('billing'), '123.456.790-01');
  userEvent.type(screen.getByTestId('icd10'), 'B11');
  userEvent.type(screen.getByTestId('total'), '99.99');
  userEvent.type(screen.getByTestId('copay'), '0');
  userEvent.type(screen.getByTestId('complaint'), 'zilch');
  userEvent.type(screen.getByTestId('pulse'), '1');
  userEvent.type(screen.getByTestId('systolic'), '1');
  userEvent.type(screen.getByTestId('diastolic'), '1');
  userEvent.type(screen.getByTestId('date'), '20171015');
};

it('renders and matches snapshot', () => {
  render(toRender(1));
  expect(screen.queryByText('Create Encounter')).toBeTruthy();

  const component = renderer.create(toRender(1));
  const tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});

it('updates encounter data', async () => {
  fetch
    .mockResponseOnce({ status: 200, method: 'POST', headers: { 'content-type': 'application/json' } });

  const { getByText, queryByText, getByTestId, getByAltText, debug } = render(toRender(1));

  fillInputData();
  debug();

  const selectButton = getByText('Create');
  fireEvent.click(selectButton);
  await waitFor(() => getByAltText('loading...'));
  expect(mockHistoryPush).toHaveBeenCalledWith('/patients/1');
});

// test('component matches snapshot', () => {
//   const component = renderer.create(<CreateEncounter />);
//   const tree = component.toJSON();

//   expect(tree).toMatchSnapshot();
// });

// test('verify that form invalidates', () => {
//   const { getByText } = render(<Router history={history}><CreateEncounter /></Router>);

//   fireEvent.click(getByText('Create'));

//   expect(getByText('Must be valid visit code')).toBeInTheDocument();
//   expect(getByText('Must be valid billing code')).toBeInTheDocument();
//   expect(getByText('Must be valid provider')).toBeInTheDocument();
//   expect(getByText('Must be valid total cost')).toBeInTheDocument();
//   expect(getByText('Must be valid icd10')).toBeInTheDocument();
//   expect(getByText('Must be valid chief complaint')).toBeInTheDocument();
//   expect(getByText('Must be valid copay')).toBeInTheDocument();
//   expect(getByText('Must be valid date')).toBeInTheDocument();
// });
