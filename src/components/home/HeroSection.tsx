
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Search, MapPin, Plus, UserPlus, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "@/hooks/useLocation";
import { useToast } from "@/hooks/use-toast";

const HeroSection = () => {
  const [serviceType, setServiceType] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const locationHook = useLocation();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serviceType && !location) {
      toast({
        title: "Search fields empty",
        description: "Please select a service type or enter a location",
        variant: "destructive"
      });
      return;
    }
    
    navigate(`/search?service=${serviceType}&location=${location}`);
  };

  const handleDetectLocation = () => {
    locationHook.detectLocation();
  };

  // Update location input when we get location from the hook
  useState(() => {
    if (locationHook.address) {
      setLocation(locationHook.address);
    }
  });

  return (
    <div className="relative bg-gradient-to-r from-nearfix-50 to-white py-12 md:py-20 px-4 md:px-0">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-nearfix-900 mb-4 md:mb-6">
            Find Trusted Local Service Providers
          </h1>
          <p className="text-base md:text-xl text-nearfix-700 mb-6 md:mb-8 max-w-2xl mx-auto">
            Connect with skilled professionals near you for fabrication, plumbing, electrical work, tuition, and more.
          </p>

          <form onSubmit={handleSearch} className="relative z-10">
            <div className="flex flex-col md:flex-row gap-3 p-2 md:p-3 bg-white rounded-xl shadow-lg">
              <div className="flex-1">
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger className="w-full border-0 shadow-none focus:ring-0 h-12 px-4">
                    <div className="flex items-center">
                      <Search className="h-4 w-4 mr-2 text-nearfix-500" />
                      <SelectValue placeholder="What service do you need?" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fabrication">Fabrication</SelectItem>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="electrical">Electrical Work</SelectItem>
                    <SelectItem value="tuition">Tuition</SelectItem>
                    <SelectItem value="home-repair">Home Repair</SelectItem>
                    <SelectItem value="other">Other Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <div className="relative flex w-full items-center">
                  <div className="flex w-full border-0 md:border-l border-gray-200 items-center">
                    <MapPin className="h-4 w-4 ml-4 mr-2 text-nearfix-500" />
                    <Input
                      type="text"
                      placeholder="Your location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="border-0 shadow-none focus:ring-0 h-12 flex-1"
                    />
                    <Button 
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mr-1"
                      onClick={handleDetectLocation}
                      disabled={locationHook.loading}
                    >
                      <Compass className="h-4 w-4 text-nearfix-500" />
                      <span className="sr-only">Detect location</span>
                    </Button>
                  </div>
                </div>
                {locationHook.error && (
                  <p className="text-xs text-red-500 mt-1 ml-4">{locationHook.error}</p>
                )}
                {locationHook.loading && (
                  <p className="text-xs text-nearfix-600 mt-1 ml-4">Detecting your location...</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                size="lg"
                className="bg-nearfix-600 hover:bg-nearfix-700 text-white h-12 px-6 rounded-lg"
              >
                Search
              </Button>
            </div>
          </form>
          
          <div className="mt-8 md:mt-10 flex flex-col md:flex-row items-center justify-center gap-4">
            <Button 
              className="bg-nearfix-500 hover:bg-nearfix-600 h-12 px-6 rounded-lg w-full md:w-auto"
              onClick={() => navigate("/post-job")}
            >
              <Plus className="h-4 w-4 mr-2" /> 
              Post a Job
            </Button>
            <Button 
              variant="outline" 
              className="border-nearfix-500 text-nearfix-600 hover:bg-nearfix-50 h-12 px-6 rounded-lg w-full md:w-auto"
              onClick={() => navigate("/become-seller")}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Become a Seller
            </Button>
          </div>
        </div>
      </div>
      {/* Decorative elements */}
      <div className="absolute bottom-0 right-0 w-24 h-24 md:w-48 md:h-48 bg-nearfix-100 rounded-tl-[100px] -z-10"></div>
      <div className="absolute top-0 left-0 w-16 h-16 md:w-40 md:h-40 bg-nearfix-50 rounded-br-[80px] -z-10"></div>
    </div>
  );
};

export default HeroSection;
