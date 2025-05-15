import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Provider } from '@/types/types';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const SearchResults = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userLocation } = useAuth();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userLocation) {
      fetchDataFromBackend();
    } else {
      toast.error("Please enable location services to find nearby providers.");
    }
  }, [userLocation]);

  const fetchDataFromBackend = async () => {
    setIsLoading(true);
    
    try {
      // Call the Supabase function to find nearest providers
      const { data, error } = await supabase.rpc('find_nearest_providers', { 
        user_lat: userLocation?.latitude || 0, 
        user_lon: userLocation?.longitude || 0,
        limit_count: 10
      });

      if (error) throw error;
      
      if (data) {
        // Map the data to match the Provider interface
        const providers: Provider[] = data.map(item => ({
          provider_id: item.provider_id,
          business_name: item.business_name,
          service_types: item.service_types,
          distance: item.distance,
          address: item.address,
          description: item.description,
          hourly_rate: item.hourly_rate,
          latitude: item.latitude,
          longitude: item.longitude,
          verified: false,
          user_id: item.user_id
        }));
        
        setProviders(providers);
      }
    } catch (err) {
      console.error("Error fetching providers:", err);
      toast.error("Failed to get nearby service providers.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    // Implement search logic here, e.g., filter providers based on searchTerm
    console.log('Searching for:', searchTerm);
  };

  const handleBookNow = (providerId: string) => {
    // Navigate to a booking page or trigger a booking flow
    console.log('Booking service with provider ID:', providerId);
    navigate('/services');
  };

  const mockResults = () => {
    const mockData: Provider[] = [
      {
        provider_id: "1",
        user_id: "mock-user-1",
        business_name: "Quick Fix Plumbing",
        service_types: ["Plumbing", "Bathroom Installation"],
        distance: 1.2,
        address: "123 Main St, Boston",
        description: "Professional plumbing services with 10+ years experience",
        hourly_rate: 45,
        verified: false
      },
      {
        provider_id: "2",
        user_id: "mock-user-2",
        business_name: "Green Gardens Landscaping",
        service_types: ["Landscaping", "Gardening", "Lawn Care"],
        distance: 2.5,
        address: "456 Elm St, Cambridge",
        description: "Full-service landscaping and garden maintenance",
        hourly_rate: 35,
        verified: true
      },
      {
        provider_id: "3",
        user_id: "mock-user-3",
        business_name: "Sparkle Cleaning Services",
        service_types: ["House Cleaning", "Office Cleaning"],
        distance: 3.8,
        address: "789 Oak St, Somerville",
        description: "Reliable and thorough cleaning for homes and offices",
        hourly_rate: 25,
        verified: false
      },
    ];
    
    setProviders(mockData);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Service Providers Near You</h1>

      <div className="flex items-center mb-4">
        <Input
          type="text"
          placeholder="Search for services or providers..."
          className="mr-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={handleSearch}>
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
        <Button onClick={mockResults} className="ml-2">
          Load Mock Results
        </Button>
      </div>

      {isLoading ? (
        <p>Loading service providers...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((provider) => (
            <div key={provider.provider_id} className="border rounded-md p-4">
              <h2 className="text-lg font-semibold">{provider.business_name}</h2>
              <p className="text-gray-600">{provider.service_types.join(', ')}</p>
              <p className="text-sm">Distance: {provider.distance.toFixed(1)} miles</p>
              <p className="text-sm">{provider.address}</p>
              <p className="text-sm">{provider.description}</p>
              <p className="text-sm">Hourly Rate: ${provider.hourly_rate}</p>
              <Button onClick={() => handleBookNow(provider.provider_id)}>Book Now</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
