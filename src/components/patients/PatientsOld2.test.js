// import React from 'react';
// import '@testing-library/jest-dom/';
// import '@testing-library/jest-dom/extend-expect';
// import { render, cleanup, screen, waitForElement, waitFor, getByText } from '@testing-library/react';
// import { createMemoryHistory } from 'history';
// import { Router, Route, Switch } from 'react-router-dom';
// import fetchMock from 'jest-fetch-mock';
// import axios from 'axios';
// import Patients from './Patients';

// jest.mock('axios');

// it('renders patients data axios', async () => {
//   const test = [{"id":1,"firstName":"Jane","lastName":"Doe","email":"jd@gmail.com","street":"Drew Dr","city":"Turboville","state":"MA","postal":"01545","age":23,"height":64,"weight":112,"insurance":"Turbosure","gender":"female","ssn":"000-00-0000"},{"id":2,"firstName":"Jason","lastName":"Bourne","email":"null@gmail.com","street":"REDACTED","city":"REDACTED","state":"AK","postal":"01545","age":40,"height":73,"weight":165,"insurance":"REDACTED","gender":"male","ssn":"000-00-0000"},{"id":3,"firstName":"Zero","lastName":"Encounters","email":"zero@gmail.com","street":"Place St","city":"Ether","state":"FL","postal":"01545","age":25,"height":67,"weight":180,"insurance":"Weewoo Gotchu Inc","gender":"male","ssn":"000-00-0000"}];

//   axios.get.mockImplementationOnce(() => Promise.resolve(test));

//   const { getByText } = render(<Patients />);

//   await waitFor(() => getByText('Name: Jane Doe'));
// });
