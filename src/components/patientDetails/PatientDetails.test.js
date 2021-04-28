import React from 'react';
import { cleanup, render, screen, act, waitFor, getByText, queryByText, fireEvent, getByAltText, getByTestId, queryByTestId } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router, Route, MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import fetchMock from 'jest-fetch-mock';
import PatientDetails from './PatientDetails';
import '@testing-library/jest-dom/extend-expect';

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

afterEach(cleanup);

// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useParams: () => ({
//     id: 1
//   })
// }));

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const toRender = (id) => {
  const routerEntry = `/posts/${id}`;
  return (
    <MemoryRouter initialEntries={[routerEntry]}>
      <Route path="/posts/:id">
        <PatientDetails />
      </Route>
    </MemoryRouter>
  );
};

it('renders properly and matches snapshot', () => {
  render(toRender(1));

  const component = renderer.create(toRender(1));
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('displays headers and buttons', () => {
  const { getByText, queryByText, debug } = render(toRender(1));
  expect(screen.queryByText('Patient Details')).toBeTruthy();
  expect(screen.queryByText('Back to Patients')).toBeTruthy();
  expect(screen.queryByText('Encounters')).toBeTruthy();
  expect(screen.queryByText('Create Encounter')).toBeTruthy();
});

it('checks if id is 404', async () => {
  // need to change useParam, change from mock to spyOn
  fetch
    .mockResponse('{ "id": 1 }', { status: 404, headers: { 'content-type': 'application/json' } });

  const { getByText, queryByText } = render(toRender('999'));

  await waitFor(() => getByText('404 Not Found'));
  expect(screen.queryByText('404 Not Found')).toBeTruthy();
});

it('checks if id is nan', async () => {
  // need to change useParam, change from mock to spyOn
  fetch
    .mockResponse('{ "id": 1 }', { status: 400, headers: { 'content-type': 'application/json' } });

  const { getByText, queryByText } = render(toRender('garbage'));

  await waitFor(() => getByText('Id not a number'));
  expect(screen.queryByText('Id not a number')).toBeTruthy();
});

it('catches encounter error', async () => {
  fetch
    .mockResponseOnce('{ "id": 1 }', { status: 200, headers: { 'content-type': 'application/json' } });
  // eslint-disable-next-line max-len
  // .mockResponseOnce('{ "id": 1 }', { status: 400, headers: { 'content-type': 'application/json' } });

  const { getByText, queryByText } = render(toRender('1'));

  await waitFor(() => getByText('Error with encounter'));
  expect(screen.queryByText('Error with encounter')).toBeTruthy();
});

it('displays patient data', async () => {
  fetch
  // patients call
    .mockResponseOnce(JSON.stringify(
      {
        id: 1,
        firstName: "Test",
        lastName: "Last",
        email: "tl@gmail.com",
        street: "Yo Dr",
        city: "Heyvalley",
        state: "NH",
        postal: "00000",
        age: 23,
        height: 64,
        weight: 112,
        insurance: "Wooshoo Inc",
        gender: "female",
        ssn: "000-00-0000"
      }
    ))
  // encounter call
    .mockResponseOnce(JSON.stringify(
      [{
        billingCode: "123.456.790-01",
        chiefComplaint: "REDACTED",
        copay: 0,
        date: "2017-10-15",
        diastolic: 60,
        icd10: "B11",
        id: 3,
        notes: "REDACTED",
        patientId: 2,
        provider: "REDACTED",
        pulse: 40,
        systolic: 110,
        totalCost: 99.99,
        visitCode: "A1S 3D1"
      }]
    ));

  const { getByText, queryByText, getByTestId, queryByTestId, debug } = render(toRender('1'));
  await waitFor(() => getByTestId('f-name'));
  // debug();
  expect(queryByText('Id:')).toBeTruthy();
  expect(queryByText('1')).toBeTruthy();
  expect(getByTestId('f-name').value).toBe('Test');
  expect(getByTestId('l-name').value).toBe('Last');
  expect(getByTestId('ssn').value).toBe('000-00-0000');
  expect(getByTestId('email').value).toBe('tl@gmail.com');
  expect(getByTestId('street').value).toBe('Yo Dr');
  expect(getByTestId('city').value).toBe('Heyvalley');
  expect(getByTestId('state').value).toBe('NH');
  expect(getByTestId('zipcode').value).toBe('00000');
  expect(getByTestId('age').value).toBe('23');
  expect(getByTestId('height').value).toBe('64');
  expect(getByTestId('weight').value).toBe('112');
  expect(getByTestId('insurance').value).toBe('Wooshoo Inc');
  expect(getByTestId('gender-select').value).toBe('female');

  expect(queryByText('Id: 3')).toBeTruthy();
  expect(queryByText('Visit Code: A1S 3D1')).toBeTruthy();
  expect(queryByText('Provider: REDACTED')).toBeTruthy();
  expect(queryByText('Date: 2017-10-15')).toBeTruthy();
});

it('goes back to patients', () => {
  const { getByText, queryByText } = render(toRender(1));

  const selectButton = getByText('Back to Patients');
  fireEvent.click(selectButton);
  expect(mockHistoryPush).toHaveBeenCalledWith('/patients');
});

it('redirect to create encounter page', () => {
  const { getByText, queryByText } = render(toRender(1));

  const selectButton = getByText('Create Encounter');
  fireEvent.click(selectButton);
  expect(mockHistoryPush).toHaveBeenCalledWith('/patients/1/encounters/create');
});
