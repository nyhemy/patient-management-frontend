import React from 'react';
import { cleanup, render, screen, act, waitFor, getByText, queryByText, fireEvent } from '@testing-library/react';
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

it('displays header and back button', () => {
  const { getByText, queryByText } = render(toRender(1));
  expect(screen.queryByText('Patient Details')).toBeTruthy();
  expect(screen.queryByText('Back to Patients')).toBeTruthy();
});

it('checks if id is 404', async () => {
  // need to change useParam, change from mock to spyOn
  fetch.mockResponseOnce('{ "id": 1 }', { status: 404, headers: { 'content-type': 'application/json' } });
  const { getByText, queryByText } = render(toRender('999'));

  await waitFor(() => getByText('404 Not Found'));
  expect(screen.queryByText('404 Not Found')).toBeTruthy();
});

it('checks if id is nan', async () => {
  // need to change useParam, change from mock to spyOn
  const { getByText, queryByText } = render(toRender('garbage'));

  await waitFor(() => getByText('Oops something went wrong'));
  expect(screen.queryByText('Oops something went wrong')).toBeTruthy();
});
