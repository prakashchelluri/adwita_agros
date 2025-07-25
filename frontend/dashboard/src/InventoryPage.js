import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Typography, Paper, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ part_code: '', part_name: '', quantity: '', location: '' });

  const fetchItems = () => {
    setLoading(true);
    fetch('https://adwita-agros.onrender.com/inventory/')
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpen = (item = null) => {
    setEditItem(item);
    setForm(item ? { ...item } : { part_code: '', part_name: '', quantity: '', location: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditItem(null);
    setForm({ part_code: '', part_name: '', quantity: '', location: '' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editItem ? 'PUT' : 'POST';
    const url = editItem ? `https://adwita-agros.onrender.com/inventory/${editItem.id}` : 'https://adwita-agros.onrender.com/inventory/';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        part_code: form.part_code,
        part_name: form.part_name,
        quantity: parseInt(form.quantity, 10),
        location: form.location
      })
    });
    fetchItems();
    handleClose();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this item?')) {
      await fetch(`https://adwita-agros.onrender.com/inventory/${id}`, { method: 'DELETE' });
      fetchItems();
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Inventory Management</Typography>
          <Button variant="contained" color="primary" onClick={() => handleOpen()}>Add Item</Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Part Code</TableCell>
                <TableCell>Part Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5}>Loading...</TableCell></TableRow>
              ) : items.length === 0 ? (
                <TableRow><TableCell colSpan={5}>No items found.</TableCell></TableRow>
              ) : (
                items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.part_code}</TableCell>
                    <TableCell>{item.part_name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpen(item)}><EditIcon /></IconButton>
                      <IconButton onClick={() => handleDelete(item.id)} color="error"><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editItem ? 'Edit Item' : 'Add Item'}</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <TextField label="Part Code" name="part_code" value={form.part_code} onChange={handleChange} fullWidth margin="normal" required />
              <TextField label="Part Name" name="part_name" value={form.part_name} onChange={handleChange} fullWidth margin="normal" required />
              <TextField label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} fullWidth margin="normal" required />
              <TextField label="Location" name="location" value={form.location} onChange={handleChange} fullWidth margin="normal" required />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">{editItem ? 'Update' : 'Add'}</Button>
            </DialogActions>
          </form>
        </Dialog>
      </Paper>
    </Container>
  );
} 