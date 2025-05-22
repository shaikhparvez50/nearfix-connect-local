
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

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

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({ 
        ...prev, 
        error: 'Geolocation is not supported by your browser',
        loading: false
      }));
      toast.error('Geolocation is not supported by your browser');
      return Promise.resolve(false);
    }

    setLocation(prev => ({ ...prev, loading: true, error: null }));
    
    return new Promise<boolean>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Convert coordinates to address using Nominatim API
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
              { headers: { 'Accept-Language': 'en' } } // Request English results
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
            
            // Store location in localStorage for persistence
            localStorage.setItem('userLocation', JSON.stringify({
              latitude,
              longitude,
              address
            }));
            
            toast.success('Location detected successfully');
            resolve(true);
          } catch (error) {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              address: null,
              loading: false,
              error: error instanceof Error ? error.message : 'Unknown error occurred'
            });
            
            // Store basic location in localStorage even without address
            localStorage.setItem('userLocation', JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }));
            
            toast.warning('Location detected, but unable to get address');
            resolve(true);
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
          toast.error(getLocationErrorMessage(error));
          resolve(false);
        },
        { 
          enableHighAccuracy: true,
          timeout: 15000, // Increased timeout
          maximumAge: 0
        }
      );
    });
  }, []);

  // Attempt to restore location from localStorage on mount
  useEffect(() => {
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      try {
        const parsedLocation = JSON.parse(storedLocation);
        setLocation(prev => ({
          ...prev,
          latitude: parsedLocation.latitude,
          longitude: parsedLocation.longitude,
          address: parsedLocation.address || null
        }));
      } catch (e) {
        // Invalid JSON in localStorage, ignore it
        localStorage.removeItem('userLocation');
      }
    }
  }, []);

  const getLocationErrorMessage = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location permission was denied. Please enable location services in your browser settings.';
      case error.POSITION_UNAVAILABLE:
        return 'Location information is unavailable. Please try again later.';
      case error.TIMEOUT:
        return 'The request to get your location timed out. Please try again.';
      default:
        return 'An unknown error occurred while trying to get your location.';
    }
  };

  return {
    ...location,
    detectLocation
  };
};
