import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
import { ILead } from './types/ILead';

function App() {
  const [category, setCategory] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [leads, setLeads] = useState<ILead[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch('/leads');
      const data: ILead[] = await response.json();
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); 
      setLeads(data);
    } catch (error) {
      setError('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    setLoading(true);
    event.preventDefault();
    try {
      const response = await fetch('/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, price })
      });
      if (response.ok) {
        await fetchLeads();
        setPrice('');
        setCategory('');
      }
    } catch (error) {
      setError('Failed to submit lead');
    }
  };

  const handleStatusChange = async (leadId: number, status: string) => {
    try {
      const response = await fetch(`/lead/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchLeads();
      }
    } catch (error) {
      setError('Failed to update lead');
    }
  };

  const handlePriceChange = (newValue: string) => {
    if (/^\d*\.?\d{0,2}$/.test(newValue)) {
      setPrice(newValue);
    }
  };

  if (error) return <p>Error: {error}</p>;
  return (
    <div>
      <Paper style={{ padding: '20px', marginBottom: '20px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <TextField
            label="Category"
            variant="outlined"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={{ marginRight: '10px' }}
          />
          <TextField
                label="Price"
                type="number"
                variant="outlined"
                name="price"
                value={price}
                onChange={(e) => handlePriceChange(e.target.value)}
                required
                inputProps={{ step: '0.01' }}
              />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            size="large"
            name="submit"
            disabled={loading}
          >
            Submit
          </Button>
        </form>
      </Paper>

      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="table">
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map((lead: ILead) => (
              <TableRow key={lead.id}>
                <TableCell>{lead.category}</TableCell>
                <TableCell>${lead.price}</TableCell>
                <TableCell style={{ display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                  {lead.status ? (
                    (lead.status).toUpperCase()
                  ) : (
                    <>
                      <Button 
                        variant="contained" 
                        onClick={() => handleStatusChange(lead.id, 'accepted')} 
                        color="success"
                        name="accept"
                        >
                          Accept
                        </Button>
                      <Button 
                        variant="contained" 
                        onClick={() => handleStatusChange(lead.id, 'declined')} 
                        color="error"
                        name="decline"
                        >
                          Decline
                        </Button>
                    </>
                  )}
                </TableCell>
                <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;
