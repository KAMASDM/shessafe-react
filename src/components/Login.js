import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Card, CardContent, Typography, Box } from '@mui/material';
import logo from '../assets/logo.png';  // Ensure this path is correct

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      console.log('beforeinstallprompt Event fired');
      setDeferredPrompt(e);
    };
    
    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://cloudconnectcampaign.com/sheissafe/api/login/', { email, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user_id', response.data.user_id);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        gap: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', p: 2, textAlign: 'center' }}>
        <img src={logo} alt="Logo" style={{ width: '150px', marginBottom: '16px' }} />
      </Card>
      <Card sx={{ maxWidth: 400, width: '100%', p: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h5" component="div" mb={2}>Login</Typography>
        </Box>
        <CardContent>
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
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleLogin} sx={{ mt: 2 }}>Login</Button>
          <Button variant="text" fullWidth onClick={() => navigate('/register')} sx={{ mt: 1 }}>Register</Button>
        </CardContent>
      </Card>
      {deferredPrompt && (
        <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={handleInstallClick}>
          Install App
        </Button>
      )}
    </Box>
  );
};

export default Login;
