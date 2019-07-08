import React from 'react';
import {
  render,
  cleanup,
} from '@testing-library/react';
import 'jest-dom/extend-expect';
import App from './App';

afterEach(cleanup);

test.only('Application renders successfully', () => {
  const {
    getByText,
    getAllByText,
    getAllByTitle,
    getAllByAltText,
    container,
  } = render(<App />);

  // Map out our UI nodes
  const headerNode = getByText('Hello, world!');
  const sectionNodes = getAllByText("Here's a", { exact: false });
  const catImgNodes = getAllByAltText('A cat');
  const jsLogoNodes = [
    ...getAllByTitle('JavaScript logo'),
    ...getAllByAltText('JavaScript logo'),
  ];

  // Tests
  expect(container).toMatchSnapshot();
  expect(sectionNodes.length).toBe(5);
  expect(catImgNodes.length).toBe(2);
  expect(jsLogoNodes.length).toBe(3);
});
