
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LocationButton } from "./LocationButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLocation } from "@/hooks/useLocation";
import { Phone } from "lucide-react";

type Provider = {
  provider_id: string;
  user_id: string;
  business_name: string;
  service_types: string[];
  description: string;
  hourly_rate: number;
  distance: number;
  latitude: number;
  longitude: number;
  address: string;
};

export const NearbyProviders = () => {
  const [nearbyProviders, setNearbyProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { latitude, longitude, address } = useLocation();
  
  // Derived state for userLocation
  const userLocation = latitude && longitude ? {
    latitude,
    longitude,
    address
  } : null;
  
  useEffect(() => {
    if (userLocation) {
      fetchNearbyProviders();
    }
  }, [userLocation]);
  
  const fetchNearbyProviders = async () => {
    if (!userLocation) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('find_nearest_providers', {
        user_lat: userLocation.latitude,
        user_lon: userLocation.longitude,
        limit_count: 3
      });

      if (error) throw error;
      setNearbyProviders(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch nearby providers");
      console.error("Error fetching providers:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };
  
  if (!userLocation) {
    return (
      <div className="mb-4 md:mb-6 text-center p-6 bg-white rounded-lg border">
        <p className="text-sm md:text-base mb-4">Share your location to find service providers near you.</p>
        <LocationButton />
      </div>
    );
  }
  
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <h3 className="font-medium text-base md:text-lg">Nearby Service Providers</h3>
        <LocationButton 
          variant="ghost" 
          className="h-7 md:h-8 text-xs px-2" 
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nearfix-600"></div>
        </div>
      ) : nearbyProviders.length > 0 ? (
        <div className="grid gap-3 md:gap-4">
          {nearbyProviders.map((provider) => (
            <Card key={provider.provider_id} className="border-0 shadow-sm overflow-hidden">
              <CardContent className="p-3 md:p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <Link to={`/provider/${provider.provider_id}`} className="hover:underline">
                      <h4 className="font-medium text-sm md:text-base truncate">{provider.business_name}</h4>
                    </Link>
                    <p className="text-xs md:text-sm text-gray-600 truncate max-w-[250px] md:max-w-full">
                      {provider.service_types.join(', ')}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500">
                      {provider.distance.toFixed(1)} km away
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs md:text-sm"
                      asChild
                    >
                      <Link to={`/provider/${provider.provider_id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 md:py-8 bg-white rounded-md border">
          <p className="text-sm md:text-base mb-3">No providers found nearby. Try updating your location.</p>
          <LocationButton />
        </div>
      )}
    </div>
  );
};
