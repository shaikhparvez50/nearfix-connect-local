
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
  const { detectLocation, loading } = useLocation();
  const isMobile = useIsMobile();
  
  const handleDetectLocation = async () => {
    try {
      const success = await detectLocation();
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
          {variant === "outline" ? <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" /> : 
                                  <Navigation className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />}
          {isMobile ? "Location" : "Detect Location"}
        </>
      )}
    </Button>
  );
};
