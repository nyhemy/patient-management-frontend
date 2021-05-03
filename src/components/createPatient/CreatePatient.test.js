import React from 'react';
import { cleanup, render, screen, act, waitFor, getByText, queryByText, fireEvent, getByAltText, getByTestId, queryByTestId } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router, Route, MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import fetchMock from 'jest-fetch-mock';
import userEvent from '@testing-library/user-event';
import CreatePatient from './CreatePatient';
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

const fillInputData = () => {
  userEvent.type(screen.getByTestId('f-name'), 'test');
  userEvent.type(screen.getByTestId('l-name'), 'test');
  userEvent.type(screen.getByTestId('ssn'), '000-00-0000');
  userEvent.type(screen.getByTestId('email'), 'test@test.test');
  userEvent.type(screen.getByTestId('street'), 'test');
  userEvent.type(screen.getByTestId('city'), 'test');
  userEvent.type(screen.getByTestId('state'), 'MA');
  userEvent.type(screen.getByTestId('zipcode'), '00000');
  userEvent.type(screen.getByTestId('age'), '1');
  userEvent.type(screen.getByTestId('height'), '1');
  userEvent.type(screen.getByTestId('weight'), '1');
  userEvent.type(screen.getByTestId('insurance'), 'Test');
  userEvent.selectOptions(screen.getByTestId('gender-select'), ['male']);
};

// const patientDataMock = JSON.stringify(
//   {
//     id: 1,
//     firstName: "Test",
//     lastName: "Last",
//     email: "tl@gmail.com",
//     street: "Yo Dr",
//     city: "Heyvalley",
//     state: "NH",
//     postal: "00000",
//     age: 23,
//     height: 64,
//     weight: 112,
//     insurance: "Wooshoo Inc",
//     gender: "female",
//     ssn: "000-00-0000"
//   }
// );

it('renders and matches snapshot', () => {
  render(<CreatePatient />);
  expect(screen.queryByText('Create Patient')).toBeTruthy();

  const component = renderer.create(<CreatePatient />);
  const tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});

it('updates patient data', async () => {
  fetch
    .mockResponseOnce({ status: 200, method: 'POST', headers: { 'content-type': 'application/json' } });

  const { getByText, queryByText, getByTestId, getByAltText } = render(<CreatePatient />);

  fillInputData();

  const selectButton = getByText('Create');
  fireEvent.click(selectButton);
  await waitFor(() => getByAltText('loading...'));
  expect(mockHistoryPush).toHaveBeenCalledWith('/patients');
});

it('fails post request', async () => {
  fetch
    .mockResponse('{ "id": 1 }', { status: 409, headers: { 'content-type': 'application/json' } });

  const { getByText, queryByText, getByTestId, getByAltText } = render(<CreatePatient />);

  fillInputData();

  const selectButton = getByText('Create');
  fireEvent.click(selectButton);
  await waitFor(() => getByAltText('loading...'));
  expect(queryByText('Conflicts with existing data, likely email')).toBeTruthy();
});

it('catches generic error', async () => {
  fetch
    .mockReject(new Error('error'));

  const { getByText, queryByText, getByTestId, getByAltText } = render(<CreatePatient />);

  fillInputData();

  const selectButton = getByText('Create');
  fireEvent.click(selectButton);
  await waitFor(() => getByAltText('loading...'));
  expect(queryByText('Oops something went wrong')).toBeTruthy();
});

it('tests if input error messages appear', async () => {
  const { getByText, queryByText } = render(<CreatePatient />);

  const selectButton = getByText('Create');
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
