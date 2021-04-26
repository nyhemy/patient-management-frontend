import React from 'react';
import { cleanup, render, screen, act, getByText, waitFor, getByAltText, queryByAltText } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import renderer from 'react-test-renderer';
import Patients from './Patients';

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

afterEach(cleanup);

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
  fetch.mockResponse(JSON.stringify([
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
  ]));
  const { getByText, queryByText } = render(<Patients />);
  await waitFor(() => getByText('Name: Test Last'));
  expect(screen.queryByText('Name: Test Last')).toBeTruthy();
  expect(screen.queryByText('Create')).toBeTruthy();
});

it('show error message when fetch error occurs', async () => {
  fetch.mockReject(new Error('error'));
  const { getByText, queryByText } = render(<Patients />);

  await waitFor(() => getByText('Oops something went wrong'));
  expect(screen.queryByText('Oops something went wrong')).toBeTruthy();
});

// global.fetch = jest.fn(() =>
//   Promise.resolve({
//     json: () =>
//       Promise.resolve([{
//         id: 1,
//         firstName: "Test",
//         lastName: "Last",
//         email: "tl@gmail.com",
//         street: "Yo Dr",
//         city: "Heyvalley",
//         state: "NH",
//         postal: "00000",
//         age: 23,
//         height: 64,
//         weight: 112,
//         insurance: "Wooshoo Inc",
//         gender: "female",
//         ssn: "000-00-0000"
//       }])
//   })
// );

// describe("Patients", () => {
//   it("loads patient data on mount", async () => {
//     await act(async () => render(<Patients />));
//     expect(screen.getByText("Name: Jane Doe")).toBeInTheDocument();
//   });
// });
