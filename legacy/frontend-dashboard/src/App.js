import React, { useEffect, useState, createContext, useContext } from 'react';
import './App.css';
import { Button, TextField, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, AppBar, Toolbar, Box, Container, MenuItem, Accordion, AccordionSummary, AccordionDetails, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ServiceRequestForm from './ServiceRequestForm';
import { Routes, Route, Link as RouterLink, useLocation } from 'react-router-dom';
import InventoryPage from './InventoryPage';
import Link from '@mui/material/Link';
import Pagination from '@mui/material/Pagination';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple fake auth: username: admin, password: admin
    // technician: tech/tech, viewer: view/view
    let role = null;
    if (username === 'admin' && password === 'admin') {
      role = 'admin';
    } else if (username === 'tech' && password === 'tech') {
      role = 'technician';
    } else if (username === 'view' && password === 'view') {
      role = 'viewer';
    }
    if (role) {
      localStorage.setItem('role', role);
      onLogin(role);
    } else {
      setError('Invalid credentials. Try admin/admin, tech/tech, or view/view.');
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

function Dashboard({ role, showNotification }) {
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
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;
  const paginatedRequests = requests.filter(r =>
    (r.ticket_number && r.ticket_number.toLowerCase().includes(search.toLowerCase())) ||
    (r.description && r.description.toLowerCase().includes(search.toLowerCase())) ||
    (r.chassis_number && r.chassis_number.toLowerCase().includes(search.toLowerCase())) ||
    (r.request_type && r.request_type.toLowerCase().includes(search.toLowerCase())) ||
    (r.request_status && r.request_status.toLowerCase().includes(search.toLowerCase()))
  ).slice((page - 1) * itemsPerPage, page * itemsPerPage);

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
    showNotification('Part updated successfully!', 'success');
  };
  const handlePartDelete = async (requestId, partId) => {
    await fetch(`https://adwita-agros.onrender.com/service-requests/${requestId}/parts/${partId}`, { method: 'DELETE' });
    fetchParts(requestId);
    fetch('https://adwita-agros.onrender.com/inventory/').then(res => res.json()).then(setInventory);
    showNotification('Part deleted successfully!', 'success');
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
    showNotification('Service request added successfully!', 'success');
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
    showNotification('Service request updated successfully!', 'success');
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
        showNotification('CSV upload failed.', 'error');
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
        showNotification('CSV uploaded successfully!', 'success');
      } else if (result.errors) {
        setCsvUploadMsg(
          `Upload completed with errors. Imported: ${result.imported}. Errors: \n` +
          result.errors.join("\n")
        );
        showNotification(`CSV uploaded with ${result.errors.length} errors.`, 'warning');
      } else {
        setCsvUploadMsg("Upload failed. Please check your CSV format.");
        showNotification('CSV upload failed. Please check your CSV format.', 'error');
      }
    } catch (err) {
      setCsvUploadMsg("Error uploading CSV.");
      showNotification('Error uploading CSV.', 'error');
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

  // Filter requests based on search
  const filteredRequests = requests.filter(r =>
    (r.ticket_number && r.ticket_number.toLowerCase().includes(search.toLowerCase())) ||
    (r.description && r.description.toLowerCase().includes(search.toLowerCase())) ||
    (r.chassis_number && r.chassis_number.toLowerCase().includes(search.toLowerCase())) ||
    (r.request_type && r.request_type.toLowerCase().includes(search.toLowerCase())) ||
    (r.request_status && r.request_status.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f6fa', minHeight: '100vh', width: '100vw' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Service Requests Dashboard</Typography>
        </Toolbar>
      </AppBar>
      <Container disableGutters sx={{ width: '100vw', height: '100vh', p: 0, m: 0 }}>
        <Paper elevation={2} sx={{ p: 3, mb: 4, width: '100vw' }}>
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
        <Paper elevation={2} sx={{ p: 3, width: '100vw' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" gutterBottom>Service Requests</Typography>
            {/* Removed Go to Inventory button */}
          </Box>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <TextField
              label="Search Requests"
              variant="outlined"
              size="small"
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ minWidth: 250 }}
            />
          </Box>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer sx={{ width: '100vw', overflowX: 'auto' }}>
                <Table stickyHeader sx={{ width: '100vw', tableLayout: 'auto', minWidth: 900 }}>
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
                    {Array.isArray(paginatedRequests) && paginatedRequests.length > 0 ? (
                      paginatedRequests.map((r, idx) => (
                        <React.Fragment key={r.id}>
                          <TableRow>
                            <TableCell>{r.ticket_number}</TableCell>
                            <TableCell>{r.description}</TableCell>
                            <TableCell>{r.chassis_number}</TableCell>
                            <TableCell>{r.request_type}</TableCell>
                            <TableCell>{r.warranty_status}</TableCell>
                            <TableCell>{r.request_status}</TableCell>
                            <TableCell>
                              {role === 'technician' || role === 'admin' ? (
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
                              ) : (
                                TECHNICIANS.find(t => t.id === r.technician_id)?.name || 'Unassigned'
                              )}
                            </TableCell>
                            <TableCell>
                              {role === 'admin' && (
                                <Button variant="contained" color="secondary" size="small" onClick={() => handleSendMail(r)}>
                                  Send Mail
                                </Button>
                              )}
                            </TableCell>
                            <TableCell>{r.created_at ? r.created_at.split('T')[0] : ''}</TableCell>
                            <TableCell>{r.description}</TableCell>
                            <TableCell>
                              {Array.isArray(r.photos) && r.photos.length > 0 && r.photos.map((url, i) => (
                                <img key={i} src={`https://adwita-agros.onrender.com/${url}`} alt={`photo-${i}`} style={{ width: 60, height: 40, objectFit: 'cover', marginRight: 4, borderRadius: 4 }} />
                              ))}
                              {Array.isArray(r.videos) && r.videos.length > 0 && r.videos.map((url, i) => (
                                <video key={i} src={`https://adwita-agros.onrender.com/${url}`} controls style={{ width: 80, height: 40, marginRight: 4, borderRadius: 4 }} />
                              ))}
                            </TableCell>
                            <TableCell>
                              {role === 'admin' && (
                                <Button onClick={() => handleEdit(r)} variant="outlined" size="small">Edit</Button>
                              )}
                            </TableCell>
                            <TableCell>
                              {(role === 'admin' || role === 'technician') && (
                                <>
                                  <IconButton onClick={() => handleExpand(r.id)}>
                                    <ExpandMore />
                                  </IconButton>
                                  <IconButton onClick={() => openPartDialog(r.id)}>
                                    <AddIcon />
                                  </IconButton>
                                </>
                              )}
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
                                          {(role === 'admin' || role === 'technician') && (
                                            <>
                                              <IconButton onClick={() => openPartDialog(r.id, part)}><EditIcon /></IconButton>
                                              <IconButton onClick={() => handlePartDelete(r.id, part.id)} color="error"><DeleteIcon /></IconButton>
                                            </>
                                          )}
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
              <Pagination
                count={Math.ceil(filteredRequests.length / itemsPerPage)}
                page={page}
                onChange={(e, value) => setPage(value)}
                sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
              />
            </>
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
      {role === 'admin' && (
        <Button variant="contained" color="primary" startIcon={<AddIcon />} sx={{ mt: 2 }} onClick={openAddDialog}>
          Add Service Request
        </Button>
      )}
    </Box>
  );
}

function AppNavBar({ onLogout, role, darkMode, setDarkMode }) {
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Adwita Agros
        </Typography>
        <Box>
          <Typography variant="body2" sx={{ mx: 2, display: 'inline', color: 'yellow' }}>
            Role: {role}
          </Typography>
          <Button color="inherit" onClick={() => setDarkMode(dm => !dm)} sx={{ mx: 2 }}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
          <Link component={RouterLink} to="/" color="inherit" underline="none" sx={{ mx: 2 }}>
            Dashboard
          </Link>
          <Link component={RouterLink} to="/inventory" color="inherit" underline="none" sx={{ mx: 2 }}>
            Inventory
          </Link>
          <Link component={RouterLink} to="/service-request" color="inherit" underline="none" sx={{ mx: 2 }}>
            Service Request Form
          </Link>
          <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

// Add a standard class-based ErrorBoundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    // You can log error info here if needed
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, color: 'red' }}>
          <h2>Something went wrong.</h2>
          <pre>{this.state.error && this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Notification context
const NotificationContext = createContext(() => {});
export function useNotification() {
  return useContext(NotificationContext);
}

function App() {
  // Persist login state in localStorage
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem('loggedIn') === 'true';
  });
  const [role, setRole] = useState(() => localStorage.getItem('role') || '');
  const location = useLocation();
  const isLoginPage = location.pathname === '/' && !loggedIn;

  // Update localStorage when login state changes
  useEffect(() => {
    localStorage.setItem('loggedIn', loggedIn);
    if (!loggedIn) {
      localStorage.removeItem('role');
      setRole('');
    }
  }, [loggedIn]);

  // Pass setLoggedIn and setRole to Login so it can set login state and role
  // Notification state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const showNotification = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  // Add dark mode toggle and theme
  const [darkMode, setDarkMode] = useState(false);
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#1976d2' },
      secondary: { main: '#9c27b0' },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationContext.Provider value={showNotification}>
        <ErrorBoundary>
          {!isLoginPage && <AppNavBar onLogout={() => { setLoggedIn(false); localStorage.removeItem('loggedIn'); localStorage.removeItem('role'); setRole(''); }} role={role} darkMode={darkMode} setDarkMode={setDarkMode} />}
          <Routes>
            <Route path="/service-request" element={<ServiceRequestForm role={role} />} />
            <Route path="/inventory" element={<InventoryPage role={role} />} />
            <Route path="/*" element={loggedIn ? <Dashboard key={loggedIn} role={role} showNotification={showNotification} /> : <Login onLogin={(r) => { setLoggedIn(true); setRole(r); }} />} />
          </Routes>
          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </MuiAlert>
          </Snackbar>
        </ErrorBoundary>
      </NotificationContext.Provider>
    </ThemeProvider>
  );
}

export default App;