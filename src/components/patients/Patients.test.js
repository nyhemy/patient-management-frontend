import React from 'react';
import { cleanup, render, screen, act, getByText, waitFor, getByAltText, queryByAltText, fireEvent } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import renderer from 'react-test-renderer';
import Patients from './Patients';

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

const patientDataMock = JSON.stringify(
  [
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
  ]
);

it('renders properly and matches snapshot', () => {
  render(<Patients />);
  expect(screen.queryByText('Patients')).toBeTruthy();

  const component = renderer.create(<Patients />);
  const tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});

it('displays loading image on app start', () => {
  act(() => {
    const { queryByAltText } = render(<Patients />);
  });
  expect(screen.queryByAltText('loading...')).toBeTruthy();
});

it('loads patient data and create button', async () => {
  fetch.mockResponse(patientDataMock);

  const { getByText, queryByText } = render(<Patients />);
  await waitFor(() => getByText('Name: Test Last'));
  expect(screen.queryByText('Name: Test Last')).toBeTruthy();
  expect(screen.queryByText('Create')).toBeTruthy();
});

it('redirects to patient create', async () => {
  fetch.mockResponse(patientDataMock);

  const { getByText, queryByText, getByTestId, getByAltText } = render(<Patients />);

  await waitFor(() => getByText('Patients'));
  const selectButton = getByText('Create');
  fireEvent.click(selectButton);
  expect(mockHistoryPush).toHaveBeenCalledWith('/patients/create');
});

it('show error message when fetch error occurs', async () => {
  fetch.mockReject(new Error('error'));
  const { getByText, queryByText } = render(<Patients />);

  await waitFor(() => getByText('Oops something went wrong'));
  expect(screen.queryByText('Oops something went wrong')).toBeTruthy();
});
