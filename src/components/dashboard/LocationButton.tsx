
import React from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "@/hooks/useLocation";
import { useIsMobile } from "@/hooks/use-mobile";

interface LocationButtonProps {
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"; 
  onLocationDetected?: (success: boolean) => void;
}

export const LocationButton = ({ 
  className = "", 
  variant = "outline",
  onLocationDetected 
}: LocationButtonProps) => {
  const { detectLocation, loading, latitude, longitude } = useLocation();
  const isMobile = useIsMobile();
  
  const handleDetectLocation = async () => {
    try {
      // Pass true to force reload if user specifically clicks the button
      const success = await detectLocation(true);
      if (onLocationDetected) {
        onLocationDetected(success);
      }
    } catch (error) {
      toast.error("Failed to detect location");
      if (onLocationDetected) {
        onLocationDetected(false);
      }
    }
  };
  
  // If location already exists, show update button instead
  const hasLocation = latitude && longitude;
  
  return (
    <Button 
      variant={variant} 
      size={isMobile ? "sm" : "default"} 
      className={className}
      onClick={handleDetectLocation}
      disabled={loading}
    >
      {loading ? (
        <>
          <span className="animate-spin mr-2">◌</span>
          {!isMobile && "Detecting..."}
        </>
      ) : (
        <>
          {variant === "outline" || hasLocation ? 
            <Navigation className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" /> : 
            <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
          }
          {isMobile ? 
            (hasLocation ? "Update" : "Location") : 
            (hasLocation ? "Update Location" : "Detect Location")
          }
        </>
      )}
    </Button>
  );
};
