import React from 'react';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import CreatePatient from './CreatePatient';
import '@testing-library/jest-dom/extend-expect';

const history = createMemoryHistory();

test('renders w/o crashing', () => {
  render(
    <Router history={history}>
      <CreatePatient />
    </Router>
  );
});
