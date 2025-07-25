import React, { useEffect, useState } from 'react';
import './App.css';
import { Button, TextField, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, AppBar, Toolbar, Box, Container, MenuItem, Accordion, AccordionSummary, AccordionDetails, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ServiceRequestForm from './ServiceRequestForm';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, useLocation } from 'react-router-dom';
import InventoryPage from './InventoryPage';
import Link from '@mui/material/Link';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple fake auth: username: admin, password: admin
    if (username === 'admin' && password === 'admin') {
      onLogin();
    } else {
      setError('Invalid credentials. Try admin/admin.');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f6fa">
      <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Username" fullWidth margin="normal" value={username} onChange={e => setUsername(e.target.value)} />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Login</Button>
        </form>
      </Paper>
    </Box>
  );
}

const TECHNICIANS = [
  { id: 1, name: 'Ravi Kumar' },
  { id: 2, name: 'Sita Devi' },
  { id: 3, name: 'Amit Singh' },
];

function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [csvFile, setCsvFile] = useState(null);
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvUploadMsg, setCsvUploadMsg] = useState("");
  const [assigning, setAssigning] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [parts, setParts] = useState({}); // { [requestId]: [parts] }
  const [inventory, setInventory] = useState([]);
  const [partDialog, setPartDialog] = useState({ open: false, requestId: null, edit: null });
  const [partForm, setPartForm] = useState({ part_code: '', part_name: '', quantity_used: 1 });
  const [addDialog, setAddDialog] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', chassis_number: '', request_type: '', description: '', location: '', alternate_contact: '' });

  // Fetch inventory for dropdowns
  useEffect(() => {
    fetch('https://adwita-agros.onrender.com/inventory/')
      .then(res => res.json())
      .then(setInventory);
  }, []);

  // Fetch parts used for a request
  const fetchParts = (requestId) => {
    fetch(`https://adwita-agros.onrender.com/service-requests/${requestId}/parts`)
      .then(res => res.json())
      .then(data => setParts(prev => ({ ...prev, [requestId]: data })));
  };

  // Handle accordion expand
  const handleExpand = (requestId) => {
    setExpanded(expanded === requestId ? null : requestId);
    if (expanded !== requestId) fetchParts(requestId);
  };

  // Handle add/edit part dialog
  const openPartDialog = (requestId, edit = null) => {
    setPartDialog({ open: true, requestId, edit });
    if (edit) {
      setPartForm({ ...edit });
    } else {
      setPartForm({ part_code: '', part_name: '', quantity_used: 1 });
    }
  };
  const closePartDialog = () => setPartDialog({ open: false, requestId: null, edit: null });
  const handlePartFormChange = (e) => {
    setPartForm({ ...partForm, [e.target.name]: e.target.value });
  };
  const handlePartSubmit = async (e) => {
    e.preventDefault();
    const method = partDialog.edit ? 'PUT' : 'POST';
    const url = partDialog.edit
      ? `https://adwita-agros.onrender.com/service-requests/${partDialog.requestId}/parts/${partDialog.edit.id}`
      : `https://adwita-agros.onrender.com/service-requests/${partDialog.requestId}/parts`;
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        part_code: partForm.part_code,
        part_name: inventory.find(i => i.part_code === partForm.part_code)?.part_name || '',
        quantity_used: parseInt(partForm.quantity_used, 10),
        who_gave_parts: '',
        old_parts_location: '',
        manufacturer_replacement_status: ''
      })
    });
    fetchParts(partDialog.requestId);
    closePartDialog();
    // Refresh inventory
    fetch('https://adwita-agros.onrender.com/inventory/').then(res => res.json()).then(setInventory);
  };
  const handlePartDelete = async (requestId, partId) => {
    await fetch(`https://adwita-agros.onrender.com/service-requests/${requestId}/parts/${partId}`, { method: 'DELETE' });
    fetchParts(requestId);
    fetch('https://adwita-agros.onrender.com/inventory/').then(res => res.json()).then(setInventory);
  };

  // Manual add service request dialog
  const openAddDialog = () => setAddDialog(true);
  const closeAddDialog = () => setAddDialog(false);
  const handleAddFormChange = (e) => setAddForm({ ...addForm, [e.target.name]: e.target.value });
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    await fetch('https://adwita-agros.onrender.com/public-service-request/', {
      method: 'POST',
      body: new URLSearchParams(addForm)
    });
    setLoading(true);
    fetch('https://adwita-agros.onrender.com/service-requests/')
      .then(res => res.json())
      .then(data => {
        setRequests(data);
        setLoading(false);
      });
    closeAddDialog();
  };

  useEffect(() => {
    fetch('https://adwita-agros.onrender.com/service-requests/')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRequests(data);
        } else if (data && typeof data === 'object' && data.results && Array.isArray(data.results)) {
          setRequests(data.results);
        } else if (data && typeof data === 'object') {
          setRequests([data]);
        } else {
          setRequests([]);
        }
        setLoading(false);
      });
  }, []);

  const handleEdit = (r) => {
    setEditId(r.id);
    setEditData({ ...r });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    await fetch(`https://adwita-agros.onrender.com/service-requests/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData)
    });
    setEditId(null);
    setLoading(true);
    fetch('https://adwita-agros.onrender.com/service-requests/')
      .then(res => res.json())
      .then(data => {
        setRequests(data);
        setLoading(false);
      });
  };

  const handleCsvChange = (e) => {
    setCsvFile(e.target.files[0]);
    setCsvUploadMsg("");
  };

  const handleCsvUpload = async () => {
    if (!csvFile) {
      setCsvUploadMsg("Please choose a file first.");
      return;
    }
    setCsvUploading(true);
    setCsvUploadMsg("");
    const formData = new FormData();
    formData.append("file", csvFile);
    try {
      const res = await fetch("https://adwita-agros.onrender.com/import-csv/", {
        method: "POST",
        body: formData
      });
      let result;
      try {
        result = await res.json();
      } catch (jsonErr) {
        const text = await res.text();
        setCsvUploadMsg(`Upload failed. Server response: ${text}`);
        setCsvUploading(false);
        return;
      }
      if (res.ok && !result.errors) {
        setCsvUploadMsg("CSV uploaded and database updated successfully.");
        setCsvFile(null);
        setLoading(true);
        fetch('https://adwita-agros.onrender.com/service-requests/')
          .then(res => res.json())
          .then(data => {
            setRequests(data);
            setLoading(false);
          });
      } else if (result.errors) {
        setCsvUploadMsg(
          `Upload completed with errors. Imported: ${result.imported}. Errors: \n` +
          result.errors.join("\n")
        );
      } else {
        setCsvUploadMsg("Upload failed. Please check your CSV format.");
      }
    } catch (err) {
      setCsvUploadMsg("Error uploading CSV.");
    }
    setCsvUploading(false);
  };

  const handleAssignTechnician = async (requestId, technicianId) => {
    setAssigning(prev => ({ ...prev, [requestId]: true }));
    // Placeholder: In real app, send to backend
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, technician_id: technicianId } : r));
    setAssigning(prev => ({ ...prev, [requestId]: false }));
  };

  const handleSendMail = (request) => {
    // Placeholder: In real app, call backend to send mail
    alert(`Send mail for ticket ${request.ticket_number}`);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f6fa', minHeight: '100vh' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Service Requests Dashboard</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>Bulk Import Service Requests (CSV)</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Button variant="contained" component="label" color="secondary">
              Choose File
              <input type="file" accept=".csv" hidden onChange={handleCsvChange} />
            </Button>
            <Button onClick={handleCsvUpload} disabled={csvUploading} variant="contained" color="primary">
              {csvUploading ? "Uploading..." : "Upload"}
            </Button>
            {csvFile && <Typography variant="body2">{csvFile.name}</Typography>}
          </Box>
          {csvUploadMsg && <Typography sx={{ mt: 2 }} color={csvUploadMsg.includes("success") ? "green" : "red"}>{csvUploadMsg}</Typography>}
        </Paper>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" gutterBottom>Service Requests</Typography>
            <Button variant="outlined" color="primary" component={RouterLink} to="/inventory">
              Go to Inventory
            </Button>
          </Box>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Ticket Number</TableCell>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>Chassis Number</TableCell>
                    <TableCell>Request Type</TableCell>
                    <TableCell>Warranty Status</TableCell>
                    <TableCell>Request Status</TableCell>
                    <TableCell>Technician</TableCell>
                    <TableCell>Send Mail</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Media</TableCell>
                    <TableCell>Edit</TableCell>
                    <TableCell>Spare Parts Used</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(requests) && requests.length > 0 ? (
                    requests.map((r, idx) => (
                      <React.Fragment key={r.id}>
                        <TableRow>
                          <TableCell>{r.ticket_number}</TableCell>
                          <TableCell>{r.description}</TableCell>
                          <TableCell>{r.chassis_number}</TableCell>
                          <TableCell>{r.request_type}</TableCell>
                          <TableCell>{r.warranty_status}</TableCell>
                          <TableCell>{r.request_status}</TableCell>
                          <TableCell>
                            <TextField
                              select
                              size="small"
                              value={r.technician_id || ''}
                              onChange={e => handleAssignTechnician(r.id, e.target.value)}
                              disabled={assigning[r.id]}
                              style={{ minWidth: 120 }}
                            >
                              <MenuItem value="">Unassigned</MenuItem>
                              {TECHNICIANS.map(t => (
                                <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                              ))}
                            </TextField>
                          </TableCell>
                          <TableCell>
                            <Button variant="contained" color="secondary" size="small" onClick={() => handleSendMail(r)}>
                              Send Mail
                            </Button>
                          </TableCell>
                          <TableCell>{r.created_at ? r.created_at.split('T')[0] : ''}</TableCell>
                          <TableCell>{r.description}</TableCell>
                          <TableCell>
                            {r.photos && (
                              <a href={`https://adwita-agros.onrender.com/${r.photos}`} target="_blank" rel="noopener noreferrer">Photo</a>
                            )}
                            {r.videos && r.videos.split(',').map((v, i) => (
                              <span key={i}>
                                {' '}
                                <a href={`https://adwita-agros.onrender.com/${v}`} target="_blank" rel="noopener noreferrer">Media {i + 1}</a>
                              </span>
                            ))}
                          </TableCell>
                          <TableCell>
                            <Button onClick={() => handleEdit(r)} variant="outlined" size="small">Edit</Button>
                          </TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleExpand(r.id)}>
                              <ExpandMore />
                            </IconButton>
                            <IconButton onClick={() => openPartDialog(r.id)}>
                              <AddIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        {expanded === r.id && (
                          <TableRow>
                            <TableCell colSpan={13} style={{ background: '#f9f9f9' }}>
                              <Typography variant="subtitle1">Spare Parts Used</Typography>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Part Code</TableCell>
                                    <TableCell>Part Name</TableCell>
                                    <TableCell>Quantity Used</TableCell>
                                    <TableCell>Current Inventory</TableCell>
                                    <TableCell>Actions</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {(parts[r.id] || []).map(part => (
                                    <TableRow key={part.id}>
                                      <TableCell>{part.part_code}</TableCell>
                                      <TableCell>{part.part_name}</TableCell>
                                      <TableCell>{part.quantity_used}</TableCell>
                                      <TableCell>{inventory.find(i => i.part_code === part.part_code)?.quantity ?? 'N/A'}</TableCell>
                                      <TableCell>
                                        <IconButton onClick={() => openPartDialog(r.id, part)}><EditIcon /></IconButton>
                                        <IconButton onClick={() => handlePartDelete(r.id, part.id)} color="error"><DeleteIcon /></IconButton>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={14} style={{color: 'red'}}>No service requests found.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
      <Dialog open={partDialog.open} onClose={closePartDialog}>
        <DialogTitle>{partDialog.edit ? 'Edit Part Used' : 'Add Part Used'}</DialogTitle>
        <form onSubmit={handlePartSubmit}>
          <DialogContent>
            <TextField
              select
              label="Part Code"
              name="part_code"
              value={partForm.part_code}
              onChange={handlePartFormChange}
              fullWidth
              margin="normal"
              required
            >
              {inventory.map(i => (
                <MenuItem key={i.part_code} value={i.part_code}>{i.part_code} - {i.part_name} (Qty: {i.quantity})</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Quantity Used"
              name="quantity_used"
              type="number"
              value={partForm.quantity_used}
              onChange={handlePartFormChange}
              fullWidth
              margin="normal"
              required
              inputProps={{ min: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closePartDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">{partDialog.edit ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={addDialog} onClose={closeAddDialog}>
        <DialogTitle>Add Service Request</DialogTitle>
        <form onSubmit={handleAddSubmit}>
          <DialogContent>
            <TextField label="Name" name="name" value={addForm.name} onChange={handleAddFormChange} fullWidth margin="normal" required />
            <TextField label="Chassis Number" name="chassis_number" value={addForm.chassis_number} onChange={handleAddFormChange} fullWidth margin="normal" required />
            <TextField label="Request Type" name="request_type" value={addForm.request_type} onChange={handleAddFormChange} fullWidth margin="normal" required />
            <TextField label="Description" name="description" value={addForm.description} onChange={handleAddFormChange} fullWidth margin="normal" />
            <TextField label="Location" name="location" value={addForm.location} onChange={handleAddFormChange} fullWidth margin="normal" />
            <TextField label="Alternate Contact" name="alternate_contact" value={addForm.alternate_contact} onChange={handleAddFormChange} fullWidth margin="normal" />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeAddDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} sx={{ mt: 2 }} onClick={openAddDialog}>
        Add Service Request
      </Button>
    </Box>
  );
}

function AppNavBar() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Adwita Agros
        </Typography>
        <Box>
          <Link component={RouterLink} to="/" color="inherit" underline="none" sx={{ mx: 2 }}>
            Dashboard
          </Link>
          <Link component={RouterLink} to="/inventory" color="inherit" underline="none" sx={{ mx: 2 }}>
            Inventory
          </Link>
          <Link component={RouterLink} to="/service-request" color="inherit" underline="none" sx={{ mx: 2 }}>
            Service Request Form
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === '/' && !loggedIn;
  return (
    <>
      {!isLoginPage && <AppNavBar />}
      <Routes>
        <Route path="/service-request" element={<ServiceRequestForm />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/*" element={loggedIn ? <Dashboard /> : <Login onLogin={() => setLoggedIn(true)} />} />
      </Routes>
    </>
  );
}

export default App;
