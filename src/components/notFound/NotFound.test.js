import React from 'react';
import { render } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import renderer from 'react-test-renderer';
import NotFound from './NotFound';
import '@testing-library/jest-dom/extend-expect';

test('renders w/o crashing', () => {
  const div = document.createElement('div');
  render(<NotFound />, div);
  unmountComponentAtNode(div);
});

test('component matches snapshot', () => {
  const component = renderer.create(<NotFound />);
  const tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});
