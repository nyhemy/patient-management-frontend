import React from 'react';
import { render } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import renderer from 'react-test-renderer';
import App from './App';
import '@testing-library/jest-dom/extend-expect';

test('renders w/o crashing', () => {
  const div = document.createElement('div');
  render(<App />, div);
  unmountComponentAtNode(div);
});

test('app component matches snapshot', () => {
  const component = renderer.create(<App />);
  const tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});
