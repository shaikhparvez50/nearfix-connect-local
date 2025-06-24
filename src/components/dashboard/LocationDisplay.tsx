
import React from "react";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/hooks/useLocation";

interface LocationDisplayProps {
  className?: string;
}

export const LocationDisplay = ({ className = "" }: LocationDisplayProps) => {
  const { address, latitude, longitude, loading, detectLocation } = useLocation();
  
  if (!latitude || !longitude) {
    return null;
  }
  
  const handleUpdateLocation = () => {
    // Force reload when user explicitly clicks update
    detectLocation(true);
  };
  
  return (
    <div className={`flex flex-wrap items-center text-xs md:text-sm text-nearfix-600 ${className}`}>
      <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1 flex-shrink-0" />
      <span className="truncate max-w-[180px] md:max-w-[300px] mr-1">
        {address || `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`}
      </span>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleUpdateLocation} 
        className="h-6 md:h-7 text-xs p-1"
        disabled={loading}
      >
        <Navigation className="h-3 w-3 mr-1" /> 
        {loading ? "Updating..." : "Update"}
      </Button>
    </div>
  );
};
