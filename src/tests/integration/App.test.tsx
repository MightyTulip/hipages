import React from 'react';
import { fireEvent, screen, render, waitFor, within } from '@testing-library/react';
import App from 'App'; 

describe('App Integration Tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch empty initial state and submit form', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const newLead = {
      id: '1',
      price: '99.99',
      category: 'Electrician'
    };

    fetchSpy
        //@ts-ignore
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) })
          //@ts-ignore
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(newLead) })
          //@ts-ignore
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([newLead]) });

    render(<App />);
    const table = screen.getByLabelText(/table/i);
    expect(within(table).queryByText(/Electrician/i)).toBeNull();
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: newLead.category } });
    fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: newLead.price } });

    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith('/lead', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ category: newLead.category, price: newLead.price }),
      });
    });

    expect(await within(table).findByText(/Electrician/i)).toBeInTheDocument();
    expect(await within(table).findByText(/99.99/i)).toBeInTheDocument();
    expect(await within(table).findByText(/accept/i)).toBeInTheDocument();
    expect(await within(table).findByText(/decline/i)).toBeInTheDocument();
  });

  it('should accept a lead with empty status', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const newLead = {
      id: '1',
      price: '99.99',
      category: 'Electrician',
      status: null
    };

    fetchSpy
        //@ts-ignore
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([newLead]) })
        //@ts-ignore
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ...newLead, status: 'accepted' }) })
      // @ts-ignore
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([{ ...newLead, status: 'accepted' }]) });

    render(<App />);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith('/leads');
    });

    expect(await screen.findByText(/Electrician/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /accept/i }));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith('/lead/1', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'accepted' }),
      });
    });

    expect(await screen.findByText(/accepted/i)).toBeInTheDocument();
  });

  it('should decline a lead with empty status', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const newLead = {
      id: '1',
      price: '99.99',
      category: 'Electrician',
      status: null
    };

    fetchSpy
        //@ts-ignore
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([newLead]) })
        //@ts-ignore
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ...newLead, status: 'declined' }) })
      // @ts-ignore
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([{ ...newLead, status: 'declined' }]) });

    render(<App />);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith('/leads');
    });

    expect(await screen.findByText(/Electrician/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /decline/i }));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith('/lead/1', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'declined' }),
      });
    });

    expect(await screen.findByText(/declined/i)).toBeInTheDocument();
  });
});