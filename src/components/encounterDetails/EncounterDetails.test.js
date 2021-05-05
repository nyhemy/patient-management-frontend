import React from 'react';
import { cleanup, render, screen, act, waitFor, getByText, queryByText, fireEvent, getByAltText, getByTestId, queryByTestId } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router, Route, MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import fetchMock from 'jest-fetch-mock';
import userEvent from '@testing-library/user-event';
import EncounterDetails from './EncounterDetails';
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

const toRender = (id, encounterId) => {
  const routerEntry = `/patients/${id}/encounters/${encounterId}`;
  return (
    <MemoryRouter initialEntries={[routerEntry]}>
      <Route path="/patients/:id/encounters/:encounterId">
        <EncounterDetails />
      </Route>
    </MemoryRouter>
  );
};

const encounterDataMock = JSON.stringify(
  {
    billingCode: "123.456.790-01",
    chiefComplaint: "REDACTED",
    copay: 0,
    date: "2017-10-15",
    diastolic: 60,
    icd10: "B11",
    id: 3,
    notes: "Notes are for suckers",
    patientId: 1,
    provider: "ProviderCo",
    pulse: 40,
    systolic: 110,
    totalCost: 99.99,
    visitCode: "A1S 3D1"
  }
);

it('renders properly and matches snapshot', () => {
  render(toRender(1));
  expect(screen.queryByText('Encounter Details')).toBeTruthy();

  const component = renderer.create(toRender(1));
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('checks if id is 404', async () => {
  fetch
    .mockResponse('{ "id": 1 }', { status: 404, headers: { 'content-type': 'application/json' } });

  const { getByText, queryByText } = render(toRender('999'));

  await waitFor(() => getByText('404 Not Found'));
  expect(screen.queryByText('404 Not Found')).toBeTruthy();
});

it('checks if id is nan', async () => {
  fetch
    .mockResponse('{ "id": 1 }', { status: 400, headers: { 'content-type': 'application/json' } });

  const { getByText, queryByText } = render(toRender('garbage'));

  await waitFor(() => getByText('Id not a number'));
  expect(screen.queryByText('Id not a number')).toBeTruthy();
});

it('catches encounter reject', async () => {
  fetch
    .mockReject(new Error('error'));

  const { getByText, queryByText } = render(toRender('1'));

  await waitFor(() => getByText('Oops something went wrong'));
  expect(screen.queryByText('Oops something went wrong')).toBeTruthy();
});

it('catches encounter error', async () => {
  fetch
    .mockResponse('{ "id": 1 }', { status: 500, headers: { 'content-type': 'application/json' } });

  const { getByText, queryByText } = render(toRender('1'));

  await waitFor(() => getByText('Error 500'));
  expect(screen.queryByText('Error 500')).toBeTruthy();
});

it('displays encounter data', async () => {
  fetch.mockResponse(encounterDataMock);

  const { getByText, queryByText, getByTestId, queryByTestId } = render(toRender('3'));
  await waitFor(() => getByTestId('notes'));
  expect(queryByText('Id:')).toBeTruthy();
  expect(queryByText('3')).toBeTruthy();
  expect(getByTestId('notes').value).toBe('Notes are for suckers');
  expect(getByTestId('visit').value).toBe('A1S 3D1');
  expect(getByTestId('provider').value).toBe('ProviderCo');
  expect(getByTestId('billing').value).toBe('123.456.790-01');
  expect(getByTestId('icd10').value).toBe('B11');
  expect(getByTestId('total').value).toBe('99.99');
  expect(getByTestId('copay').value).toBe('0');
  expect(getByTestId('complaint').value).toBe('REDACTED');
  expect(getByTestId('pulse').value).toBe('40');
  expect(getByTestId('systolic').value).toBe('110');
  expect(getByTestId('diastolic').value).toBe('60');
  expect(getByTestId('date').value).toBe('2017-10-15');
});

it('updates encounter data', async () => {
  fetch
    .mockResponseOnce(encounterDataMock)
    .mockResponseOnce({ status: 200, method: 'PUT', headers: { 'content-type': 'application/json' } });

  const { getByText, queryByText, getByTestId, getByAltText } = render(toRender(1));

  await waitFor(async () => getByTestId('notes'));
  const selectButton = getByText('Submit');
  fireEvent.click(selectButton);
  await waitFor(() => getByAltText('loading...'));
  expect(mockHistoryPush).toHaveBeenCalledWith('/patients/1');
});

it('fails put request', async () => {
  fetch
    .mockResponseOnce(encounterDataMock)
    .mockReject(new Error('error'));

  const { getByText, queryByText, getByTestId, getByAltText } = render(toRender(1));

  await waitFor(async () => getByTestId('notes'));
  const selectButton = getByText('Submit');
  fireEvent.click(selectButton);
  await waitFor(() => getByAltText('loading...'));
  expect(queryByText('PUT: Oops something went wrong')).toBeTruthy();
});

it('tests if input error messages appear', async () => {
  const { getByText, queryByText } = render(toRender(1));
  userEvent.type(screen.getByTestId('pulse'), 'test');
  userEvent.type(screen.getByTestId('systolic'), 'test');
  userEvent.type(screen.getByTestId('diastolic'), 'test');

  const selectButton = getByText('Submit');
  fireEvent.click(selectButton);
  await waitFor(() => getByText('Must be valid visit code'));
  expect(queryByText('Must be valid provider')).toBeTruthy();
  expect(queryByText('Must be valid billing code')).toBeTruthy();
  expect(queryByText('Must be valid icd10')).toBeTruthy();
  expect(queryByText('Must be valid total cost')).toBeTruthy();
  expect(queryByText('Must be valid copay')).toBeTruthy();
  expect(queryByText('Must be valid chief complaint')).toBeTruthy();
  expect(queryByText('Must be valid pulse')).toBeTruthy();
  expect(queryByText('Must be valid systolic')).toBeTruthy();
  expect(queryByText('Must be valid diastolic')).toBeTruthy();
  expect(queryByText('Must be valid date')).toBeTruthy();
});
