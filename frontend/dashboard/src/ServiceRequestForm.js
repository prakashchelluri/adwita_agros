import React, { useState } from 'react';
import { Box, Button, Container, Typography, Paper, TextField, MenuItem, Grid, InputLabel, FormControl, Select, Alert, CircularProgress } from '@mui/material';

const REQUEST_TYPES = [
  { value: 'Oilchange/Service', label: 'Oilchange/Service' },
  { value: 'Vehicle breakdown', label: 'Vehicle breakdown' },
  { value: 'Warranty claim', label: 'Warranty claim' },
  { value: 'Other', label: 'Other' },
];

const FIELDS = {
  'Oilchange/Service': [
    { name: 'name', label: 'Please enter your name', required: true },
    { name: 'chassis_number', label: 'Please enter your vehicle chassis number (10 digit)', required: true, type: 'chassis' },
    { name: 'location', label: 'Please enter your vehicle current location', required: true },
    { name: 'alternate_contact', label: 'Please enter your alternate contact number', required: true },
    { name: 'description', label: 'Describe the issue', required: false, type: 'desc' },
  ],
  'Vehicle breakdown': [
    { name: 'name', label: 'Please enter your name', required: true },
    { name: 'chassis_number', label: 'Please enter your vehicle chassis number (10 digit)', required: true, type: 'chassis' },
    { name: 'location', label: 'Please enter your vehicle current location', required: true },
    { name: 'alternate_contact', label: 'Please enter your alternate contact number', required: true },
    { name: 'description', label: 'Describe the issue', required: false, type: 'desc' },
  ],
  'Warranty claim': [
    { name: 'name', label: 'Please enter your name', required: true },
    { name: 'chassis_number', label: 'Please enter your vehicle chassis number (10 digit)', required: true, type: 'chassis' },
    { name: 'alternate_contact', label: 'Please enter your alternate contact number', required: true },
    { name: 'description', label: 'Describe the issue', required: false, type: 'desc' },
  ],
  'Other': [
    { name: 'name', label: 'Please enter your name', required: true },
    { name: 'chassis_number', label: 'Please enter your vehicle chassis number (10 digit)', required: true, type: 'chassis' },
    { name: 'alternate_contact', label: 'Please enter your alternate contact number', required: true },
    { name: 'description', label: 'Describe the issue', required: false, type: 'desc' },
  ],
};

export default function ServiceRequestForm() {
  const [requestType, setRequestType] = useState('');
  const [form, setForm] = useState({});
  const [photoChassis, setPhotoChassis] = useState(null);
  const [mediaIssue, setMediaIssue] = useState([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTypeChange = (e) => {
    setRequestType(e.target.value);
    setForm({});
    setPhotoChassis(null);
    setMediaIssue([]);
    setSuccess(null);
    setError('');
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChassis = (e) => {
    setPhotoChassis(e.target.files[0]);
  };

  const handleMediaIssue = (e) => {
    setMediaIssue(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError('');
    const data = new FormData();
    data.append('request_type', requestType);
    FIELDS[requestType].forEach(f => {
      data.append(f.name, form[f.name] || '');
    });
    if (photoChassis) {
      data.append('photo_chassis', photoChassis);
    }
    if (mediaIssue.length > 0) {
      mediaIssue.forEach(file => data.append('media_issue', file));
    }
    try {
      const res = await fetch('http://localhost:8000/public-service-request/', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      if (result.success) {
        setSuccess(result.ticket_number);
        setForm({});
        setPhotoChassis(null);
        setMediaIssue([]);
      } else {
        setError('Submission failed. Please try again.');
      }
    } catch (err) {
      setError('Submission failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Thank you for contacting Adwitha Agros<br />Please choose one of the options below
        </Typography>
        <Box mb={3}>
          <FormControl fullWidth>
            <InputLabel>Request Type</InputLabel>
            <Select value={requestType} label="Request Type" onChange={handleTypeChange}>
              {REQUEST_TYPES.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {requestType && (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Grid container spacing={2}>
              {FIELDS[requestType].map(f => (
                <Grid item xs={12} key={f.name}>
                  <TextField
                    label={f.label}
                    name={f.name}
                    value={form[f.name] || ''}
                    onChange={handleInputChange}
                    required={f.required}
                    fullWidth
                    inputProps={f.name === 'chassis_number' ? { maxLength: 10, pattern: '\\d{10}' } : {}}
                  />
                  {f.type === 'chassis' && (
                    <Box mt={1}>
                      <Button variant="outlined" component="label">
                        Upload Chassis Photo
                        <input type="file" accept="image/*" hidden onChange={handlePhotoChassis} />
                      </Button>
                      {photoChassis && <Typography variant="body2" sx={{ ml: 2 }}>{photoChassis.name}</Typography>}
                    </Box>
                  )}
                  {f.type === 'desc' && (
                    <Box mt={1}>
                      <Button variant="outlined" component="label">
                        Add Photo/Video of Issue
                        <input type="file" accept="image/*,video/*" multiple hidden onChange={handleMediaIssue} />
                      </Button>
                      {mediaIssue.length > 0 && (
                        <Typography variant="body2" sx={{ ml: 2 }}>{mediaIssue.map(f => f.name).join(', ')}</Typography>
                      )}
                    </Box>
                  )}
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : 'Submit'}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
        {success && <Alert severity="success" sx={{ mt: 3 }}>Request submitted! Your ticket number is <b>{success}</b>.</Alert>}
        {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
      </Paper>
    </Container>
  );
} 