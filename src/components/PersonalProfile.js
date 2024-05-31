import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, CardContent, Typography, MenuItem, Stepper, Step, StepLabel, Box } from '@mui/material';

const PersonalProfile = ({ onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  const userId = localStorage.getItem('user_id');

  const steps = ['Personal Info', 'Contact Info', 'Additional Info'];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/personalprofiles/?user=${userId}`);
        if (response.data.length > 0) {
          const profile = response.data[0];
          setFirstName(profile.first_name);
          setLastName(profile.last_name);
          setEmail(profile.email);
          setPhoneNumber(profile.phone_number);
          setAddress(profile.address);
          setCity(profile.city);
          setState(profile.state);
          setBloodGroup(profile.blood_group);
          setIsEdit(true);
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleProfileSubmit = async () => {
    setError('');
    setSuccess('');
    try {
      const profileData = {
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phoneNumber,
        address,
        city,
        state,
        blood_group: bloodGroup,
        user: userId
      };

      if (isEdit) {
        await axios.put(`http://localhost:8000/api/personalprofiles/${userId}/`, profileData);
        setSuccess('Profile updated successfully');
      } else {
        await axios.post('http://localhost:8000/api/personalprofiles/', profileData);
        setSuccess('Profile created successfully');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data);
      } else {
        setError('Profile update failed. Please try again.');
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 5 }}>
      <CardContent>
        <Typography variant="h5" component="div" mb={2}>Personal Profile</Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === 0 && (
          <Box mt={3}>
            <TextField
              label="First Name"
              fullWidth
              variant="outlined"
              margin="normal"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              label="Last Name"
              fullWidth
              variant="outlined"
              margin="normal"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <Box mt={2}>
              <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            </Box>
          </Box>
        )}
        {activeStep === 1 && (
          <Box mt={3}>
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
              label="Phone Number"
              fullWidth
              variant="outlined"
              margin="normal"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <TextField
              label="Address"
              fullWidth
              variant="outlined"
              margin="normal"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Box mt={2}>
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            </Box>
          </Box>
        )}
        {activeStep === 2 && (
          <Box mt={3}>
            <TextField
              label="City"
              fullWidth
              variant="outlined"
              margin="normal"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <TextField
              label="State"
              fullWidth
              variant="outlined"
              margin="normal"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <TextField
              label="Blood Group"
              select
              fullWidth
              variant="outlined"
              margin="normal"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
            >
              <MenuItem value="A+">A+</MenuItem>
              <MenuItem value="A-">A-</MenuItem>
              <MenuItem value="B+">B+</MenuItem>
              <MenuItem value="B-">B-</MenuItem>
              <MenuItem value="AB+">AB+</MenuItem>
              <MenuItem value="AB-">AB-</MenuItem>
              <MenuItem value="O+">O+</MenuItem>
              <MenuItem value="O-">O-</MenuItem>
            </TextField>
            {error && (
              <Typography color="error" variant="body2" mt={2}>
                {JSON.stringify(error)}
              </Typography>
            )}
            {success && (
              <Typography color="primary" variant="body2" mt={2}>
                {success}
              </Typography>
            )}
            <Box mt={2}>
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={handleProfileSubmit}>
                Submit
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Box>
  );
};

export default PersonalProfile;
