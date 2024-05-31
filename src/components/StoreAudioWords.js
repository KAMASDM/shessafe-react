import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const StoreAudioWords = () => {
  const [healthWordText, setHealthWordText] = useState('');
  const [threatWordText, setThreatWordText] = useState('');

  const handleSave = () => {
    localStorage.setItem('healthWordText', healthWordText);
    localStorage.setItem('threatWordText', threatWordText);
    alert('Audio words saved to local storage.');
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 5 }}>
      <Typography variant="h5" component="div" mb={2}>Store Audio Words</Typography>
      <TextField
        label="Health Word Text"
        fullWidth
        variant="outlined"
        margin="normal"
        value={healthWordText}
        onChange={(e) => setHealthWordText(e.target.value)}
      />
      <TextField
        label="Threat Word Text"
        fullWidth
        variant="outlined"
        margin="normal"
        value={threatWordText}
        onChange={(e) => setThreatWordText(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
        Save
      </Button>
    </Box>
  );
};

export default StoreAudioWords;
