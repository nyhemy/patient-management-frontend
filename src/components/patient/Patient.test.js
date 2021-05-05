import React from 'react';
import { cleanup, render, screen, act, getByText, waitFor, getByAltText, queryByAltText, fireEvent } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import renderer from 'react-test-renderer';
import fetchMock from 'jest-fetch-mock';
import { MemoryRouter } from 'react-router-dom';
import Patient from './Patient';
import '@testing-library/jest-dom/extend-expect';

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

it('renders w/o crashing and matches snapshot', () => {
  const div = document.createElement('div');
  render(<Patient />, div);

  const component = renderer.create(<Patient />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('shows error for 409', async () => {
  fetch.mockResponseOnce('{ "id": 1 }', { status: 409, headers: { 'content-type': 'application/json' } });
  const { getByText, queryByText } = render(<Patient />);

  const deleteButton = getByText('Delete');
  fireEvent.click(deleteButton);
  await waitFor(() => getByText('Cannot delete patient with existing encounters'));
  expect(screen.queryByText('Cannot delete patient with existing encounters')).toBeTruthy();
});

it('shows generic error', async () => {
  fetch.mockResponseOnce('{ "id": 1 }', { status: 500, headers: { 'content-type': 'application/json' } });
  const { getByText, queryByText } = render(<Patient />);

  const deleteButton = getByText('Delete');
  fireEvent.click(deleteButton);
  await waitFor(() => getByText('Oops something went wrong'));
  expect(screen.queryByText('Oops something went wrong')).toBeTruthy();
});

it('deletes', () => {
  const { getByText, queryByText } = render(<Patient />);

  expect(screen.queryByText('Name:', { exact: false })).toBeTruthy();
  const deleteButton = getByText('Delete');
  fireEvent.click(deleteButton);
  expect(screen.queryByText('Name:', { exact: false })).toBeFalsy();
  expect(screen.queryByText('Oops something went wrong')).toBeFalsy();
});

it('redirects to patient details', () => {
  const { getByText, queryByText } = render(<Patient />);

  const selectButton = getByText('Select');
  fireEvent.click(selectButton);
  expect(mockHistoryPush).toHaveBeenCalledWith('/patients/undefined');
});

it('shows data and buttons', async () => {
  const { getByText, queryByText } = render(<Patient />);
  await waitFor(() => getByText('Name: undefined undefined'));
  expect(screen.queryByText('Name: undefined undefined')).toBeTruthy();
  expect(screen.queryByText('Age: undefined', { exact: false })).toBeTruthy();
  expect(screen.queryByText('Gender: undefined', { exact: false })).toBeTruthy();
  expect(screen.queryByText('Select')).toBeTruthy();
  expect(screen.queryByText('Delete')).toBeTruthy();
});
