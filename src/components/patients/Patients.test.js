import React from 'react';
import '@testing-library/jest-dom/';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup, screen, waitForElement, waitFor, getByText } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router, Route, Switch } from 'react-router-dom';
import fetchMock from 'jest-fetch-mock';
import Patients from './Patients';

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
  const test = JSON.stringify([
    {
      id: 1,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jd@gmail.com',
      street: 'Drew Dr',
      city: 'Turboville',
      state: 'MA',
      postal: '01545',
      age: 23,
      height: 64,
      weight: 112,
      insurance: 'Turbosure',
      gender: 'female',
      ssn: '000-00-0000'
    },
    {
      id: 2,
      firstName: 'Bob',
      lastName: 'Dude',
      email: 'bd@gmail.com',
      street: 'Dude Dr',
      city: 'Dudeville',
      state: 'NH',
      postal: '00000',
      age: 25,
      height: 70,
      weight: 144,
      insurance: 'Bubba',
      gender: 'male',
      ssn: '000-00-0001'
    }
  ]);

  console.log(test);
  fetch.mockResponse(test);

  // fetch.mockResponseOnce(JSON.stringify([
  //   {"id":1,
  //   "firstName":"Jane",
  //   "lastName":"Doe",
  //   "email":"jd@gmail.com",
  //   "street":"Drew Dr",
  //   "city":"Turboville",
  //   "state":"MA",
  //   "postal":"01545",
  //   "age":23,
  //   "height":64,
  //   "weight":112,
  //   "insurance":"Turbosure",
  //   "gender":"female",
  //   "ssn":"000-00-0000"},
  //   {"id":2,"firstName":"Jason","lastName":"Bourne","email":"null@gmail.com","street":"REDACTED","city":"REDACTED","state":"AK","postal":"01545","age":40,"height":73,"weight":165,"insurance":"REDACTED","gender":"male","ssn":"000-00-0000"},{"id":3,"firstName":"Zero","lastName":"Encounters","email":"zero@gmail.com","street":"Place St","city":"Ether","state":"FL","postal":"01545","age":25,"height":67,"weight":180,"insurance":"Weewoo Gotchu Inc","gender":"male","ssn":"000-00-0000"}
  // ]));
});

afterEach(cleanup);

const history = createMemoryHistory();

const renderWithRouter = (component, url) => {
  history.push(url);

  return {
    ...render(
      <Router history={history}>
        <Switch>
          <Route
            path={url}
            render={() => component}
            exact
          />
        </Switch>
      </Router>
    )
  };
};

test('renders w/o crashing', async () => {
  const { getByText, getAllByText } = render(
    <Router history={history}>
      <Patients />
    </Router>
  );

  await waitFor(() => getByText('Oops something went wrong'));
  expect(screen.queryByText('Oops something went wrong')).toBeTruthy();
});

it('renders correctly and matches snapshot', () => {
  const { asFragment } = render(<Patients />);

  expect(asFragment(<Patients />)).toMatchSnapshot();
});

it('renders patients data', async () => {
  // fetch.mockResponse(JSON.stringify([
  //   {
  //     id: 1,
  //     firstName: 'Jane',
  //     lastName: 'Doe',
  //     email: 'jd@gmail.com',
  //     street: 'Drew Dr',
  //     city: 'Turboville',
  //     state: 'MA',
  //     postal: '01545',
  //     age: 23,
  //     height: 64,
  //     weight: 112,
  //     insurance: 'Turbosure',
  //     gender: 'female',
  //     ssn: '000-00-0000'
  //   }
  // ]));
  const { getByText, getAllByText } = renderWithRouter(<Patients />, '/patients');

  await waitFor(() => getByText('Name: Jane Doe'));
  // expect(screen.queryByText('name', { exact: false })).toBeTruthy();
  // expect(screen.queryByText('404 Not Found')).toBeTruthy();
  // expect(screen.queryByText('Age: 23')).toBeTruthy();
  // expect(screen.queryByText('Gender: female')).toBeTruthy();
});

//*[@id="root"]/div/div/div[2]/div/div/div[1]