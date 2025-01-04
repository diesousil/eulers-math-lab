import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResultDisplay from './ResultDisplay';

describe('<ResultDisplay />', () => {
  test('it should mount', () => {
    render(<ResultDisplay />);

    const resultDisplay = screen.getByTestId('ResultDisplay');

    expect(resultDisplay).toBeInTheDocument();
  });
});