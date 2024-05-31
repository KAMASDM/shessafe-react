import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';

const NearestPoliceStations = () => {
  const [policeStations, setPoliceStations] = useState([]);

  useEffect(() => {
    const fetchPoliceStations = async () => {
      // Get the current location
      navigator.geolocation.getCurrentPosition(async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const response = await axios.get(
            `https://api.example.com/nearest-police-stations?latitude=${latitude}&longitude=${longitude}`
          );
          setPoliceStations(response.data.policeStations);
        } catch (error) {
          console.error('Error fetching nearest police stations', error);
        }
      });
    };

    fetchPoliceStations();
  }, []);

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6">Nearest Police Stations</Typography>
        {policeStations.length > 0 ? (
          policeStations.map((station, index) => (
            <Typography key={index}>
              {station.name} - {station.contact} - {station.location}
            </Typography>
          ))
        ) : (
          <Typography>Fetching nearest police stations...</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default NearestPoliceStations;
