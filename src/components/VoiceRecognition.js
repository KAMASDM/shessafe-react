import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Dialog, DialogTitle, DialogContent } from '@mui/material';
import axios from 'axios';

const VoiceRecognition = ({ userId, listening, setListening }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [healthWord, setHealthWord] = useState('');
  const [threatWord, setThreatWord] = useState('');
  const recognitionRef = React.useRef(null);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await axios.get(`https://cloudconnectcampaign.com/sheissafe/api/safetysafetyprofiles/?user=${userId}`);
        if (response.data.length > 0) {
          const profile = response.data[0];
          setHealthWord(profile.health_word_text.toLowerCase());
          setThreatWord(profile.threat_word_text.toLowerCase());
        }
      } catch (error) {
        console.error('Failed to fetch safety profile', error);
      }
    };

    fetchWords();
  }, [userId]);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) return;

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log(`Recognized text: ${transcript}`);

      if (transcript.includes(healthWord)) {
        showDialog('Health word is a match');
      } else if (transcript.includes(threatWord)) {
        showDialog('Threat word is a match');
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error(`Error occurred in recognition: ${event.error}`);
      setListening(false);
    };

    recognitionRef.current.onend = () => {
      setListening(false);
      console.log('Voice recognition ended.');
    };
  }, [healthWord, threatWord, setListening]);

  useEffect(() => {
    if (listening) {
      recognitionRef.current?.start();
    } else {
      recognitionRef.current?.stop();
    }
  }, [listening]);

  const showDialog = (message) => {
    setDialogMessage(message);
    setDialogOpen(true);
  };

  const toggleListening = () => {
    setListening((prevListening) => !prevListening);
  };

  return (
    <Box>
      <Button 
        variant="contained" 
        color={listening ? "error" : "primary"} 
        onClick={toggleListening} 
        sx={{ mt: 2, mr: 2 }}
      >
        {listening ? "Stop Listening" : "Start Listening"}
      </Button>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Recognition Result</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default VoiceRecognition;
