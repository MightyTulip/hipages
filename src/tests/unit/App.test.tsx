import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
import App from 'App'; 

describe('App Unit Tests', () => {
  test('should display initial state correctly', () => {
    render(<App />);
    const categoryInput = screen.getByLabelText(/Category/i);
    const priceInput = screen.getByLabelText(/Price/i);

    expect(categoryInput).toHaveValue('');
    expect(priceInput).toHaveValue(null);
  });
  
  test('handles price input correctly', () => {
      render(<App />);
      const categoryInput = screen.getByLabelText(/Category/i);
      const priceInput = screen.getByLabelText(/Price/i);

      fireEvent.change(categoryInput, {target: { value: 'Plumber' }});
      expect(categoryInput).toHaveValue('Plumber');

      fireEvent.change(priceInput, { target: { value: 123.55 }});
      expect(priceInput).toHaveValue(123.55);
  });
});
