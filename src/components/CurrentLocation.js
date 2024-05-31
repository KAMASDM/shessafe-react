import React, { useState, useEffect, useRef } from 'react';
import { Button, Typography, Box } from '@mui/material';

const CurrentLocation = () => {
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);

  const handleFetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error fetching location', error);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    if (location) {
      loadGoogleMaps(() => {
        if (googleMapRef.current) {
          const map = new window.google.maps.Map(googleMapRef.current, {
            center: { lat: location.latitude, lng: location.longitude },
            zoom: 15,
          });
          new window.google.maps.Marker({
            position: { lat: location.latitude, lng: location.longitude },
            map,
          });
        }
      });
    }
  }, [location]);

  const loadGoogleMaps = (callback) => {
    const existingScript = document.getElementById('googleMaps');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY`; // Replace YOUR_API_KEY with your actual API key
      script.id = 'googleMaps';
      document.body.appendChild(script);
      script.onload = () => {
        if (callback) callback();
      };
    } else {
      if (callback) callback();
    }
  };

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={handleFetchLocation}>
        Get Current Location
      </Button>
      {location && (
        <>
          <Typography variant="body1" mt={2}>
            Latitude: {location.latitude}, Longitude: {location.longitude}
          </Typography>
          <Box ref={googleMapRef} sx={{ width: '100%', height: '400px', mt: 2 }} />
        </>
      )}
    </Box>
  );
};

export default CurrentLocation;
