
import { useState, useEffect } from 'react';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  loading: boolean;
  error: string | null;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    address: null,
    loading: false,
    error: null
  });

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocation(prev => ({ 
        ...prev, 
        error: 'Geolocation is not supported by your browser',
        loading: false
      }));
      return;
    }

    setLocation(prev => ({ ...prev, loading: true, error: null }));
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Convert coordinates to address using Nominatim API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          
          if (!response.ok) {
            throw new Error('Failed to get address from coordinates');
          }
          
          const data = await response.json();
          const address = data.display_name || '';
          
          setLocation({
            latitude,
            longitude,
            address,
            loading: false,
            error: null
          });
        } catch (error) {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
          });
        }
      },
      (error) => {
        setLocation({
          latitude: null,
          longitude: null,
          address: null,
          loading: false,
          error: getLocationErrorMessage(error)
        });
      }
    );
  };

  const getLocationErrorMessage = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'User denied the request for Geolocation';
      case error.POSITION_UNAVAILABLE:
        return 'Location information is unavailable';
      case error.TIMEOUT:
        return 'The request to get user location timed out';
      default:
        return 'An unknown error occurred';
    }
  };

  return {
    ...location,
    detectLocation
  };
};
