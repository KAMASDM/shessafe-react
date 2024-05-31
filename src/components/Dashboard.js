import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Container, Card, CardContent, Box, Modal, Grid } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonalProfile from './PersonalProfile';
import SafetyProfile from './SafetyProfile';
import CurrentLocation from './CurrentLocation';
import VoiceRecognition from './VoiceRecognition';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Dashboard = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const [openSafetyProfile, setOpenSafetyProfile] = useState(false);
  const [message, setMessage] = useState('');
  const [listening, setListening] = useState(false);

  const handleOpenProfile = () => setOpenProfile(true);
  const handleCloseProfile = () => setOpenProfile(false);

  const handleOpenSafetyProfile = () => setOpenSafetyProfile(true);
  const handleCloseSafetyProfile = () => setOpenSafetyProfile(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const userId = localStorage.getItem('user_id'); // Assuming user_id is stored in localStorage

  return (
    <div>
      <AppBar position="static" sx={{ background: '#6200ea' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            SheSafe Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 5 }}>
        <Typography variant="h4" component="div" mb={5} textAlign="center">
          Welcome to SheSafe
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <VoiceRecognition userId={userId} listening={listening} setListening={setListening} />
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: 'center', height: '100%' }}>
              <CardContent>
                <Typography variant="h6">Update Personal Profile</Typography>
                <Button variant="contained" color="primary" onClick={handleOpenProfile} sx={{ mt: 2 }}>
                  Update
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: 'center', height: '100%' }}>
              <CardContent>
                <Typography variant="h6">Update Safety Profile</Typography>
                <Button variant="contained" color="secondary" onClick={handleOpenSafetyProfile} sx={{ mt: 2 }}>
                  Update
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: 'center', height: '100%' }}>
              <CardContent>
                <Typography variant="h6">Current Location</Typography>
                <CurrentLocation />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: 'center', height: '100%' }}>
              <CardContent>
                <Typography variant="h6">Emergency Contacts</Typography>
                <Button variant="contained" startIcon={<WhatsAppIcon />} sx={{ mt: 2 }}>
                  WhatsApp
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: 'center', height: '100%' }}>
              <CardContent>
                <Typography variant="h6">Nearby Hospitals</Typography>
                <Button variant="contained" startIcon={<LocationOnIcon />} sx={{ mt: 2 }}>
                  Find
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: 'center', height: '100%' }}>
              <CardContent>
                <Typography variant="h6">Nearby Police Stations</Typography>
                <Button variant="contained" startIcon={<LocationOnIcon />} sx={{ mt: 2 }}>
                  Find
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {message && (
          <Typography variant="h6" component="div" mt={4} color="error" textAlign="center">
            {message}
          </Typography>
        )}
      </Container>
      <Modal
        open={openProfile}
        onClose={handleCloseProfile}
        aria-labelledby="personal-profile-modal"
        aria-describedby="personal-profile-modal-description"
      >
        <Box sx={{ maxWidth: 600, margin: 'auto', mt: 5, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <PersonalProfile onClose={handleCloseProfile} />
        </Box>
      </Modal>
      <Modal
        open={openSafetyProfile}
        onClose={handleCloseSafetyProfile}
        aria-labelledby="safety-profile-modal"
        aria-describedby="safety-profile-modal-description"
      >
        <Box sx={{ maxWidth: 600, margin: 'auto', mt: 5, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <SafetyProfile onClose={handleCloseSafetyProfile} />
        </Box>
      </Modal>
    </div>
  );
};

export default Dashboard;
