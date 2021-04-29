import React from 'react';
import { cleanup, render, screen, act, waitFor, getByText, queryByText, fireEvent, getByAltText, getByTestId, queryByTestId } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router, Route, MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import fetchMock from 'jest-fetch-mock';
import EncounterDetails from './EncounterDetails';
import '@testing-library/jest-dom/extend-expect';

const history = createMemoryHistory();

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

afterEach(cleanup);

const toRender = (id) => {
  const routerEntry = `/posts/${id}`;
  return (
    <MemoryRouter initialEntries={[routerEntry]}>
      <Route path="/posts/:id">
        <EncounterDetails history={history} />
      </Route>
    </MemoryRouter>
  );
};

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

// test('renders w/o crashing', () => {
//   render(
//     <Router history={history}>
//       <EncounterDetails />
//     </Router>
//   );
// });

it('renders properly and matches snapshot', () => {
  render(toRender(1));
  expect(screen.queryByText('Encounter Details')).toBeTruthy();

  const component = renderer.create(toRender(1));
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('checks if id is 404', async () => {
  // need to change useParam, change from mock to spyOn
  fetch
    .mockResponse('{ "id": 1 }', { status: 404, headers: { 'content-type': 'application/json' } });

  const { getByText, queryByText } = render(toRender('999'));

  await waitFor(() => getByText('404 Not Found'));
  expect(screen.queryByText('404 Not Found')).toBeTruthy();
});
