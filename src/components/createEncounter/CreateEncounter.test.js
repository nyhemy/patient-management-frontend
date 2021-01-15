import React from 'react';
import { render } from '@testing-library/react';
// import { unmountComponentAtNode } from 'react-dom';
import '@testing-library/jest-dom/extend-expect';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
// import renderer from 'react-test-renderer';
import CreateEncounter from './CreateEncounter';

const history = createMemoryHistory();

test('renders w/o crashing', () => {
  render(
    <Router history={history}>
      <CreateEncounter />
    </Router>
  );
});

// test('component matches snapshot', () => {
//   const component = renderer.create(<CreateEncounter />);
//   const tree = component.toJSON();

//   expect(tree).toMatchSnapshot();
// });

// test('verify that form invalidates', () => {
//   const { getByText } = render(<Router history={history}><CreateEncounter /></Router>);

//   fireEvent.click(getByText('Create'));

//   expect(getByText('Must be valid visit code')).toBeInTheDocument();
//   expect(getByText('Must be valid billing code')).toBeInTheDocument();
//   expect(getByText('Must be valid provider')).toBeInTheDocument();
//   expect(getByText('Must be valid total cost')).toBeInTheDocument();
//   expect(getByText('Must be valid icd10')).toBeInTheDocument();
//   expect(getByText('Must be valid chief complaint')).toBeInTheDocument();
//   expect(getByText('Must be valid copay')).toBeInTheDocument();
//   expect(getByText('Must be valid date')).toBeInTheDocument();
// });
