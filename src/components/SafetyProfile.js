import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, CardContent, Typography, Stepper, Step, StepLabel, Box, Container } from '@mui/material';

const SafetyProfile = ({ onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [healthWordText, setHealthWordText] = useState('');
  const [healthWordAudio, setHealthWordAudio] = useState(null);
  const [healthContact1, setHealthContact1] = useState('');
  const [healthContact2, setHealthContact2] = useState('');
  const [healthContact3, setHealthContact3] = useState('');
  const [threatWordText, setThreatWordText] = useState('');
  const [threatWordAudio, setThreatWordAudio] = useState(null);
  const [threatContact1, setThreatContact1] = useState('');
  const [threatContact2, setThreatContact2] = useState('');
  const [threatContact3, setThreatContact3] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const userId = localStorage.getItem('user_id');

  const steps = ['Health Word', 'Health Emergency Contacts', 'Threat Word', 'Threat Emergency Contacts'];

  useEffect(() => {
    const fetchSafetyProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/safetysafetyprofiles/?user=${userId}`);
        if (response.data.length > 0) {
          const profile = response.data[0];
          setHealthWordText(profile.health_word_text);
          setHealthContact1(profile.health_contact1);
          setHealthContact2(profile.health_contact2);
          setHealthContact3(profile.health_contact3);
          setThreatWordText(profile.threat_word_text);
          setThreatContact1(profile.threat_contact1);
          setThreatContact2(profile.threat_contact2);
          setThreatContact3(profile.threat_contact3);
          setIsEdit(true);
        }
      } catch (error) {
        console.error('Failed to fetch safety profile', error);
      }
    };

    fetchSafetyProfile();
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
      const profileData = new FormData();
      profileData.append('health_word_text', healthWordText);
      if (healthWordAudio) {
        profileData.append('health_word_audio', healthWordAudio, 'health_word_audio.mp3');
      }
      profileData.append('health_contact1', healthContact1);
      profileData.append('health_contact2', healthContact2);
      profileData.append('health_contact3', healthContact3);
      profileData.append('threat_word_text', threatWordText);
      if (threatWordAudio) {
        profileData.append('threat_word_audio', threatWordAudio, 'threat_word_audio.mp3');
      }
      profileData.append('threat_contact1', threatContact1);
      profileData.append('threat_contact2', threatContact2);
      profileData.append('threat_contact3', threatContact3);
      profileData.append('user', userId);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (isEdit) {
        await axios.put(`http://localhost:8000/api/safetysafetyprofiles/${userId}/`, profileData, config);
        setSuccess('Safety profile updated successfully');
      } else {
        await axios.post('http://localhost:8000/api/safetysafetyprofiles/', profileData, config);
        setSuccess('Safety profile created successfully');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data);
      } else {
        setError('Safety profile update failed. Please try again.');
      }
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    setMediaRecorder(mediaRecorder);

    const audioChunks = [];
    mediaRecorder.ondataavailable = event => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
      if (activeStep === 0) {
        setHealthWordAudio(audioBlob);
        await convertAudioToText(audioBlob, setHealthWordText);
      } else if (activeStep === 2) {
        setThreatWordAudio(audioBlob);
        await convertAudioToText(audioBlob, setThreatWordText);
      }
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);
  };

  const convertAudioToText = async (audioBlob, setText) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.mp3');

    try {
      const response = await axios.post('http://localhost:8000/api/convert-audio-to-text/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setText(response.data.text);
    } catch (error) {
      console.error('Failed to convert audio to text', error);
      setError('Failed to convert audio to text. Please try again.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <CardContent>
        <Typography variant="h5" component="div" mb={3} textAlign="center">Safety Profile</Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </CardContent>
      {activeStep === 0 && (
        <Box mt={3}>
          <Typography variant="h6" textAlign="center">Record Health Word Audio</Typography>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={recording ? stopRecording : startRecording}
            >
              {recording ? 'Stop Recording' : 'Start Recording'}
            </Button>
          </Box>
          <TextField
            label="Health Word Text"
            fullWidth
            variant="outlined"
            margin="normal"
            value={healthWordText}
            onChange={(e) => setHealthWordText(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Box mt={2} display="flex" justifyContent="space-between">
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
            label="Health Contact 1"
            fullWidth
            variant="outlined"
            margin="normal"
            value={healthContact1}
            onChange={(e) => setHealthContact1(e.target.value)}
          />
          <TextField
            label="Health Contact 2"
            fullWidth
            variant="outlined"
            margin="normal"
            value={healthContact2}
            onChange={(e) => setHealthContact2(e.target.value)}
          />
          <TextField
            label="Health Contact 3"
            fullWidth
            variant="outlined"
            margin="normal"
            value={healthContact3}
            onChange={(e) => setHealthContact3(e.target.value)}
          />
          <Box mt={2} display="flex" justifyContent="space-between">
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
          <Typography variant="h6" textAlign="center">Record Threat Word Audio</Typography>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={recording ? stopRecording : startRecording}
            >
              {recording ? 'Stop Recording' : 'Start Recording'}
            </Button>
          </Box>
          <TextField
            label="Threat Word Text"
            fullWidth
            variant="outlined"
            margin="normal"
            value={threatWordText}
            onChange={(e) => setThreatWordText(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          </Box>
        </Box>
      )}
      {activeStep === 3 && (
        <Box mt={3}>
          <TextField
            label="Threat Contact 1"
            fullWidth
            variant="outlined"
            margin="normal"
            value={threatContact1}
            onChange={(e) => setThreatContact1(e.target.value)}
          />
          <TextField
            label="Threat Contact 2"
            fullWidth
            variant="outlined"
            margin="normal"
            value={threatContact2}
            onChange={(e) => setThreatContact2(e.target.value)}
          />
          <TextField
            label="Threat Contact 3"
            fullWidth
            variant="outlined"
            margin="normal"
            value={threatContact3}
            onChange={(e) => setThreatContact3(e.target.value)}
          />
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
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
            <Button variant="contained" color="primary" onClick={handleProfileSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default SafetyProfile;
