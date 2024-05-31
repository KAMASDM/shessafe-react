import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Card, CardContent, Typography } from '@mui/material';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError(''); // Clear previous errors
    try {
      const response = await axios.post('http://localhost:8000/api/register/', { name, email, phone, password });
      navigate('/');
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        setError(error.response.data);
      } else {
        // Something else happened
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', mt: 5 }}>
      <CardContent>
        <Typography variant="h5" component="div" mb={2}>Register</Typography>
        <TextField
          label="Name"
          fullWidth
          variant="outlined"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Phone"
          fullWidth
          variant="outlined"
          margin="normal"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <Typography color="error" variant="body2" mt={2}>
            {JSON.stringify(error)}
          </Typography>
        )}
        <Button variant="contained" color="primary" fullWidth onClick={handleRegister}>Register</Button>
        <Button variant="text" fullWidth onClick={() => navigate('/')}>Login</Button>
      </CardContent>
    </Card>
  );
};

export default Register;
