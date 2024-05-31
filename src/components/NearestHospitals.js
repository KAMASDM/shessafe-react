import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { GoogleMap, LoadScript, PlacesService, StandaloneSearchBox } from '@react-google-maps/api';

const NearestHospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [location, setLocation] = useState(null);
  const googleMapsApiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your actual API key

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setLocation(currentLocation);
      fetchHospitals(currentLocation);
    });
  }, []);

  const fetchHospitals = (location) => {
    const map = new window.google.maps.Map(document.createElement('div'));
    const service = new window.google.maps.places.PlacesService(map);

    const request = {
      location,
      radius: '5000',
      type: ['hospital'],
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setHospitals(results.slice(0, 3));
      } else {
        console.error('Error fetching nearest hospitals', status);
      }
    });
  };

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6">Nearest Hospitals</Typography>
        {location ? (
          <LoadScript googleMapsApiKey={googleMapsApiKey}>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '400px' }}
              center={location}
              zoom={15}
            >
              {hospitals.map((hospital, index) => (
                <Card key={index} sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="body1">
                      <strong>{hospital.name}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Address: {hospital.vicinity}
                    </Typography>
                    <Typography variant="body2">
                      Rating: {hospital.rating} ({hospital.user_ratings_total} reviews)
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </GoogleMap>
          </LoadScript>
        ) : (
          <Typography>Fetching nearest hospitals...</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default NearestHospitals;
