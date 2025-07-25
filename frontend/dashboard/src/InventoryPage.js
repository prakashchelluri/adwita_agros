import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Typography, Paper, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Pagination } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNotification } from './App';

export default function InventoryPage({ role }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ part_code: '', part_name: '', quantity: '', location: '' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;
  const notify = useNotification();

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
    try {
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
      await fetchItems();
      handleClose();
      notify(editItem ? 'Item updated successfully!' : 'Item added successfully!', 'success');
    } catch (err) {
      notify('Failed to save item.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this item?')) {
      try {
        await fetch(`https://adwita-agros.onrender.com/inventory/${id}`, { method: 'DELETE' });
        fetchItems();
        notify('Item deleted successfully!', 'success');
      } catch (err) {
        notify('Failed to delete item.', 'error');
      }
    }
  };

  // Filter items based on search
  const filteredItems = items.filter(item =>
    item.part_code.toLowerCase().includes(search.toLowerCase()) ||
    item.part_name.toLowerCase().includes(search.toLowerCase()) ||
    item.location.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedItems = filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Inventory Management</Typography>
          {role === 'admin' && (
            <Button variant="contained" color="primary" onClick={() => handleOpen()}>Add Item</Button>
          )}
        </Box>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <TextField
            label="Search Inventory"
            variant="outlined"
            size="small"
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ minWidth: 250 }}
          />
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
              ) : paginatedItems.length === 0 ? (
                <TableRow><TableCell colSpan={5}>No items found.</TableCell></TableRow>
              ) : (
                paginatedItems.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.part_code}</TableCell>
                    <TableCell>{item.part_name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>
                      {role === 'admin' && (
                        <>
                          <IconButton onClick={() => handleOpen(item)}><EditIcon /></IconButton>
                          <IconButton onClick={() => handleDelete(item.id)} color="error"><DeleteIcon /></IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={Math.ceil(filteredItems.length / itemsPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
          sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
        />
        {role === 'admin' && (
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
        )}
      </Paper>
    </Container>
  );
} 