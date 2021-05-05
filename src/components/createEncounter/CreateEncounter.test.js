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
  userEvent.type(screen.getByTestId('visit'), 'A1S 3D1');
  userEvent.type(screen.getByTestId('provider'), 'test');
  userEvent.type(screen.getByTestId('billing'), '123.456.790-01');
  userEvent.type(screen.getByTestId('icd10'), 'B11');
  userEvent.type(screen.getByTestId('total'), '99.99');
  userEvent.type(screen.getByTestId('copay'), '0');
  userEvent.type(screen.getByTestId('complaint'), 'zilch');
  userEvent.type(screen.getByTestId('pulse'), '1');
  userEvent.type(screen.getByTestId('systolic'), '1');
  userEvent.type(screen.getByTestId('diastolic'), '1');
  const input = screen.getByTestId('date');
  fireEvent.change(input, { target: { value: '2015-10-10' } });
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
    .mockResponseOnce('{ "id": 1 }', { status: 200, headers: { 'content-type': 'application/json' } })
    .mockResponseOnce({ status: 200, method: 'POST', headers: { 'content-type': 'application/json' } });

  const { getByText, queryByText, getByTestId, getByAltText } = render(toRender(1));

  fillInputData();

  await waitFor(async () => getByTestId('notes'));
  const selectButton = getByText('Create');
  fireEvent.click(selectButton);
  await waitFor(() => getByAltText('loading...'));
  expect(mockHistoryPush).toHaveBeenCalledWith('/patients/1');
});

it('checks if id is 404', async () => {
  fetch
    .mockResponse('{ "id": 1 }', { status: 404, headers: { 'content-type': 'application/json' } });

  const { getByText, queryByText } = render(toRender('999'));

  await waitFor(() => getByText('404 Patient Not Found'));
  expect(screen.queryByText('404 Patient Not Found')).toBeTruthy();
});

it('checks if id is nan', async () => {
  fetch
    .mockResponse('{ "id": 1 }', { status: 400, headers: { 'content-type': 'application/json' } });

  const { getByText, queryByText } = render(toRender('garbage'));

  await waitFor(() => getByText('Patient id must be a number'));
  expect(screen.queryByText('Patient id must be a number')).toBeTruthy();
});

it('catches generic error', async () => {
  fetch
    .mockReject(new Error('error'));

  const { getByText, queryByText, getByTestId, getByAltText } = render(toRender(1));

  fillInputData();

  const selectButton = getByText('Create');
  fireEvent.click(selectButton);
  await waitFor(() => getByAltText('loading...'));
  expect(queryByText('Oops something went wrong')).toBeTruthy();
});

it('tests if input error messages appear', async () => {
  const { getByText, queryByText } = render(toRender(1));

  const selectButton = getByText('Create');
  fireEvent.click(selectButton);
  await waitFor(() => getByText('Must be valid visit code'));
  expect(queryByText('Must be valid visit code')).toBeTruthy();
  expect(queryByText('Must be valid billing code')).toBeTruthy();
  expect(queryByText('Must be valid provider')).toBeTruthy();
  expect(queryByText('Must be valid total cost')).toBeTruthy();
  expect(queryByText('Must be valid icd10')).toBeTruthy();
  expect(queryByText('Must be valid chief complaint')).toBeTruthy();
  expect(queryByText('Must be valid copay')).toBeTruthy();
  expect(queryByText('Must be valid date')).toBeTruthy();
});
