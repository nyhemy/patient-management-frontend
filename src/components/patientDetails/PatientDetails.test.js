import React from 'react';
import { cleanup, render, screen, act, waitFor, getByText, queryByText, fireEvent, getByAltText, getByTestId, queryByTestId, waitForElementToBeRemoved } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router, Route, MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import fetchMock from 'jest-fetch-mock';
import userEvent from '@testing-library/user-event';
import PatientDetails from './PatientDetails';
import '@testing-library/jest-dom/extend-expect';

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
  const routerEntry = `/patients/${id}`;
  return (
    <MemoryRouter initialEntries={[routerEntry]}>
      <Route path="/patients/:id">
        <PatientDetails />
      </Route>
    </MemoryRouter>
  );
};

const patientDataMock = JSON.stringify(
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
);

const encounterDataMock = JSON.stringify(
  [{
    billingCode: "123.456.790-01",
    chiefComplaint: "REDACTED",
    copay: 0,
    date: "2017-10-15",
    diastolic: 60,
    icd10: "B11",
    id: 3,
    notes: "REDACTED",
    patientId: 1,
    provider: "REDACTED",
    pulse: 40,
    systolic: 110,
    totalCost: 99.99,
    visitCode: "A1S 3D1"
  }]
);

it('renders properly and matches snapshot', () => {
  render(toRender(1));

  const component = renderer.create(toRender(1));
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('displays headers and buttons', () => {
  const { getByText, queryByText } = render(toRender(1));
  expect(screen.queryByText('Patient Details')).toBeTruthy();
  expect(screen.queryByText('Back to Patients')).toBeTruthy();
  expect(screen.queryByText('Encounters')).toBeTruthy();
  expect(screen.queryByText('Create Encounter')).toBeTruthy();
});

it('checks if id is 404', async () => {
  fetch
    .mockResponse('{ "id": 1 }', { status: 404, headers: { 'content-type': 'application/json' } });

  const { getByText, queryByText, getByAltText } = render(toRender('999'));

  expect(getByAltText('loading...')).toBeTruthy();

  await waitForElementToBeRemoved(() => getByAltText('loading...'));
  // expect(getByAltText('loading...')).toBeFalsy();
  expect(screen.queryByText('404 Not Found')).toBeTruthy();
});

it('checks if id is nan', async () => {
  fetch
    .mockResponse('{ "id": 1 }', { status: 400, headers: { 'content-type': 'application/json' } });

  const { getByText, queryByText, getByAltText } = render(toRender('garbage'));

  expect(getByAltText('loading...')).toBeTruthy();

  await waitForElementToBeRemoved(() => getByAltText('loading...'));
  expect(screen.queryByText('Id not a number')).toBeTruthy();
});

it('catches patient reject', async () => {
  fetch
    .mockReject(new Error('error'));

  const { getByText, queryByText, getByAltText } = render(toRender('1'));

  expect(getByAltText('loading...')).toBeTruthy();

  await waitForElementToBeRemoved(() => getByAltText('loading...'));
  expect(screen.queryByText('Oops something went wrong')).toBeTruthy();
});

it('catches patient error', async () => {
  fetch
    .mockResponse('{ "id": 1 }', { status: 500, headers: { 'content-type': 'application/json' } });

  const { getByText, queryByText, getByAltText } = render(toRender('1'));

  expect(getByAltText('loading...')).toBeTruthy();

  await waitForElementToBeRemoved(() => getByAltText('loading...'));
  expect(screen.queryByText('Error 500')).toBeTruthy();
});

it('catches encounter error', async () => {
  fetch
    .mockResponseOnce('{ "id": 1 }', { status: 200, headers: { 'content-type': 'application/json' } });

  const { getByText, queryByText, getByAltText } = render(toRender('1'));

  expect(getByAltText('loading...')).toBeTruthy();

  await waitForElementToBeRemoved(() => getByAltText('loading...'));
  expect(screen.queryByText('Error with encounter')).toBeTruthy();
});

it('displays patient data', async () => {
  fetch
  // patients call
    .mockResponseOnce(patientDataMock)
  // encounter call
    .mockResponseOnce(encounterDataMock);

  const { getByText, queryByText, getByTestId, queryByTestId, getByAltText } = render(toRender('1'));

  expect(getByAltText('loading...')).toBeTruthy();

  await waitForElementToBeRemoved(() => getByAltText('loading...'));

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
  const { getByText, queryByText, getByAltText } = render(toRender(1));

  expect(getByAltText('loading...')).toBeTruthy();

  const selectButton = getByText('Back to Patients');
  fireEvent.click(selectButton);
  expect(mockHistoryPush).toHaveBeenCalledWith('/patients');
});

it('redirects to create encounter page', () => {
  const { getByText, queryByText, getByAltText } = render(toRender(1));

  expect(getByAltText('loading...')).toBeTruthy();

  const selectButton = getByText('Create Encounter');
  fireEvent.click(selectButton);
  expect(mockHistoryPush).toHaveBeenCalledWith('/patients/1/encounters/create');
});

it('redirects to encounter details', async () => {
  fetch
  // patients call
    .mockResponseOnce(patientDataMock)
  // encounter call
    .mockResponseOnce(encounterDataMock);

  const { getByText, queryByText, getByAltText } = render(toRender(1));

  expect(getByAltText('loading...')).toBeTruthy();

  await waitForElementToBeRemoved(() => getByAltText('loading...'));
  const selectButton = getByText('Details');
  fireEvent.click(selectButton);
  expect(mockHistoryPush).toHaveBeenCalledWith('/patients/1/encounters/3');
});

it('updates patient data', async () => {
  fetch
  // patients call
    .mockResponseOnce(patientDataMock)
  // encounter call
    .mockResponseOnce(encounterDataMock)
    .mockResponseOnce({ status: 200, method: 'PUT', headers: { 'content-type': 'application/json' } });

  const { getByText, queryByText, getByTestId, getByAltText, debug } = render(toRender(1));

  expect(getByAltText('loading...')).toBeTruthy();

  await waitForElementToBeRemoved(() => getByAltText('loading...'));
  const selectButton = getByText('Submit');
  fireEvent.click(selectButton);
  await waitFor(() => getByAltText('loading...'));
  expect(mockHistoryPush).toHaveBeenCalledWith('/patients');
});

it('fails put request', async () => {
  fetch
  // patients call
    .mockResponseOnce(patientDataMock)
  // encounter call
    .mockResponseOnce(encounterDataMock)
    .mockReject(new Error('error'));

  const { getByText, queryByText, getByTestId, getByAltText } = render(toRender(1));

  expect(getByAltText('loading...')).toBeTruthy();

  await waitForElementToBeRemoved(() => getByAltText('loading...'));
  const selectButton = getByText('Submit');
  fireEvent.click(selectButton);
  await waitFor(() => getByAltText('loading...'));
  expect(queryByText('PUT: Oops something went wrong')).toBeTruthy();
});

it('tests if input error messages appear', async () => {
  const { getByText, queryByText, getByAltText } = render(toRender(1));

  expect(getByAltText('loading...')).toBeTruthy();

  const selectButton = getByText('Submit');
  fireEvent.click(selectButton);
  await waitFor(() => getByText('Must be valid first name'));
  expect(queryByText('Must be valid first name')).toBeTruthy();
  expect(queryByText('Must be valid last name')).toBeTruthy();
  expect(queryByText('Must be valid ssn')).toBeTruthy();
  expect(queryByText('Must be valid email')).toBeTruthy();
  expect(queryByText('Must be valid street')).toBeTruthy();
  expect(queryByText('Must be valid city')).toBeTruthy();
  expect(queryByText('Must be valid state')).toBeTruthy();
  expect(queryByText('Must be valid zipcode')).toBeTruthy();
  expect(queryByText('Must be valid age')).toBeTruthy();
  expect(queryByText('Must be valid height')).toBeTruthy();
  expect(queryByText('Must be valid weight')).toBeTruthy();
  expect(queryByText('Must be valid insurance')).toBeTruthy();
  expect(queryByText('Must be valid gender')).toBeTruthy();
});

it('changes input data', async () => {
  fetch
  // patients call
    .mockResponseOnce(patientDataMock)
  // encounter call
    .mockResponseOnce(encounterDataMock);

  const { getByText, queryByText, getByTestId, queryByTestId, getByAltText } = render(toRender('1'));

  expect(getByAltText('loading...')).toBeTruthy();

  await waitForElementToBeRemoved(() => getByAltText('loading...'));
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

  userEvent.type(screen.getByTestId('f-name'), '-test');
  userEvent.type(screen.getByTestId('l-name'), '-test');
  userEvent.type(screen.getByTestId('ssn'), '1');
  userEvent.type(screen.getByTestId('email'), 'm');
  userEvent.type(screen.getByTestId('street'), ' Gabba');
  userEvent.type(screen.getByTestId('city'), 'o');
  userEvent.type(screen.getByTestId('state'), 'A');
  userEvent.type(screen.getByTestId('zipcode'), '1');
  userEvent.type(screen.getByTestId('age'), '0');
  userEvent.type(screen.getByTestId('height'), '0');
  userEvent.type(screen.getByTestId('weight'), '0');
  userEvent.type(screen.getByTestId('insurance'), ' Co');
  userEvent.selectOptions(screen.getByTestId('gender-select'), ['male']);

  expect(getByTestId('f-name').value).toBe('Test-test');
  expect(getByTestId('l-name').value).toBe('Last-test');
  expect(getByTestId('ssn').value).toBe('000-00-00001');
  expect(getByTestId('email').value).toBe('tl@gmail.comm');
  expect(getByTestId('street').value).toBe('Yo Dr Gabba');
  expect(getByTestId('city').value).toBe('Heyvalleyo');
  expect(getByTestId('state').value).toBe('NHA');
  expect(getByTestId('zipcode').value).toBe('000001');
  expect(getByTestId('age').value).toBe('230');
  expect(getByTestId('height').value).toBe('640');
  expect(getByTestId('weight').value).toBe('1120');
  expect(getByTestId('insurance').value).toBe('Wooshoo Inc Co');
  expect(screen.getByTestId('male-select').selected).toBe(true);
  expect(screen.getByTestId('female-select').selected).toBe(false);
});
