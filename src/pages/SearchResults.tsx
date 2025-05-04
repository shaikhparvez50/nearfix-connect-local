import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Search, MapPin, Star, Phone, Calendar, Filter, 
  Check, ChevronDown, ChevronUp, UserCheck, Navigation
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Provider {
  provider_id: string;
  business_name: string;
  rating?: number;
  reviews?: number;
  service_types: string[];
  distance: number;
  address: string;
  verified?: boolean;
  available?: string;
  description?: string;
  hourly_rate?: number;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get('service') || '';
  const locationParam = searchParams.get('location') || '';
  
  const [service, setService] = useState(serviceParam);
  const [location, setLocation] = useState(locationParam);
  const [maxDistance, setMaxDistance] = useState([10]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
  const [selectedProviderType, setSelectedProviderType] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [onlyVerified, setOnlyVerified] = useState(false);
  
  const { userLocation, requestLocationPermission } = useAuth();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [showLocationAlert, setShowLocationAlert] = useState(false);
  
  useEffect(() => {
    if (!userLocation && !locationParam) {
      setShowLocationAlert(true);
    } else {
      setShowLocationAlert(false);
    }
    
    if (serviceParam) {
      searchServices();
    }
  }, [serviceParam, locationParam, userLocation]);
  
  const searchServices = async () => {
    if (!service.trim()) return;
    
    setLoading(true);
    setError("");

    try {
      let query = supabase
        .from('service_providers')
        .select('*')
        .or(`business_name.ilike.%${service}%,description.ilike.%${service}%,service_types.cs.{${service}}`)
        .eq('is_available', true);

      // Apply filters
      if (selectedServiceTypes.length > 0) {
        query = query.contains('service_types', selectedServiceTypes);
      }
      
      if (selectedProviderType) {
        query = query.eq('provider_type', selectedProviderType);
      }
      
      if (onlyVerified) {
        query = query.eq('verified', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      // If location is provided, filter by distance
      let filteredData = data || [];
      if (userLocation) {
        filteredData = filteredData.filter(provider => {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            provider.latitude,
            provider.longitude
          );
          return distance <= maxDistance[0];
        });
      }

      setProviders(filteredData);
    } catch (err) {
      setError("Failed to fetch services. Please try again.");
      console.error("Error searching services:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };
  
  const handleLocationRequest = async () => {
    const success = await requestLocationPermission();
    if (success) {
      setShowLocationAlert(false);
      toast.success("Showing service providers near your location");
      searchServices();
    }
  };
  
  const toggleServiceType = (type: string) => {
    if (selectedServiceTypes.includes(type)) {
      setSelectedServiceTypes(selectedServiceTypes.filter(t => t !== type));
    } else {
      setSelectedServiceTypes([...selectedServiceTypes, type]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchServices();
  };

  return (
    <MainLayout>
      <section className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <form onSubmit={handleSearch}>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Service type"
                      className="pl-10"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Location"
                      className="pl-10"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" className="bg-nearfix-600 hover:bg-nearfix-700">
                  Search
                </Button>
              </div>
            </form>
          </div>

          {showLocationAlert && (
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <MapPin className="h-4 w-4 text-blue-600" />
              <AlertDescription className="flex items-center justify-between">
                <span>Share your location to find service providers near you.</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white border-blue-200 text-blue-700 hover:bg-blue-100"
                  onClick={handleLocationRequest}
                >
                  <Navigation className="mr-2 h-3 w-3" />
                  Detect My Location
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {userLocation && (
            <div className="mb-6 flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-1 text-nearfix-600" />
              <span className="font-medium">Your location:</span>
              <span className="ml-2 text-gray-600">
                {userLocation.address || 
                  `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2 h-7 text-xs text-nearfix-600"
                onClick={requestLocationPermission}
              >
                <Navigation className="h-3 w-3 mr-1" /> Update
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="font-heading font-medium text-lg">Filters</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="lg:hidden"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className={`p-4 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  <div>
                    <h3 className="font-medium text-sm mb-3">Maximum Distance</h3>
                    <div className="px-2">
                      <Slider
                        defaultValue={[10]}
                        max={25}
                        step={1}
                        value={maxDistance}
                        onValueChange={setMaxDistance}
                      />
                      <div className="mt-2 text-sm text-gray-600">
                        Up to {maxDistance[0]} km
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm mb-3">Service Type</h3>
                    <div className="space-y-2">
                      {['Fabrication', 'Electrical', 'Plumbing', 'Tuition', 'Home Repair'].map((type) => (
                        <label key={type} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedServiceTypes.includes(type)}
                            onChange={() => toggleServiceType(type)}
                            className="rounded text-nearfix-600"
                          />
                          <span className="text-sm">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm mb-3">Provider Type</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="provider-type"
                          value="individual"
                          checked={selectedProviderType === 'individual'}
                          onChange={() => setSelectedProviderType('individual')}
                          className="text-nearfix-600"
                        />
                        <span className="text-sm">Individual</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="provider-type"
                          value="company"
                          checked={selectedProviderType === 'company'}
                          onChange={() => setSelectedProviderType('company')}
                          className="text-nearfix-600"
                        />
                        <span className="text-sm">Company/Business</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="provider-type"
                          value=""
                          checked={selectedProviderType === ''}
                          onChange={() => setSelectedProviderType('')}
                          className="text-nearfix-600"
                        />
                        <span className="text-sm">Both</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm mb-3">Minimum Rating</h3>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setSelectedRating(rating)}
                          className={`p-1 rounded-md ${selectedRating >= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          <Star className={`h-5 w-5 ${selectedRating >= rating ? 'fill-yellow-400' : ''}`} />
                        </button>
                      ))}
                      {selectedRating > 0 && (
                        <button 
                          onClick={() => setSelectedRating(0)}
                          className="text-xs text-gray-500 ml-2 hover:text-nearfix-600"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={onlyVerified}
                        onChange={(e) => setOnlyVerified(e.target.checked)}
                        className="rounded text-nearfix-600"
                      />
                      <span className="text-sm">Only Verified Providers</span>
                    </label>
                  </div>
                  
                  <Button 
                    className="w-full lg:hidden bg-nearfix-600 hover:bg-nearfix-700"
                    onClick={() => setShowFilters(false)}
                  >
                    Apply Filters <Filter className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-3">
              {error && (
                <Alert className="mb-6 bg-red-50 border-red-200">
                  <AlertDescription className="text-red-600">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : providers.length > 0 ? (
                <div className="space-y-4">
                  {providers.map((provider) => (
                    <Card key={provider.provider_id} className="border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-lg">{provider.business_name}</h3>
                              {provider.verified && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
                                  <UserCheck className="h-3 w-3 mr-1" /> Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 flex items-center">
                              <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" /> {provider.address}
                            </p>
                            {provider.description && (
                              <p className="text-sm text-gray-500 mt-1">{provider.description}</p>
                            )}
                            {provider.hourly_rate && (
                              <p className="text-sm text-gray-500 mt-1">
                                Hourly Rate: ${provider.hourly_rate}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2 mt-2">
                              {provider.service_types.map((service, index) => (
                                <Badge key={index} variant="outline" className="bg-nearfix-50 text-nearfix-600 hover:bg-nearfix-50 border-nearfix-200">
                                  {service}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <Button variant="outline" title="View provider profile">
                              View Profile
                            </Button>
                            <Button className="bg-nearfix-500 hover:bg-nearfix-600" title="Contact provider">
                              <Phone className="h-4 w-4 mr-2" />
                              Contact
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : service ? (
                <div className="text-center py-16 bg-white rounded-md">
                  <Search className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No service providers found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default SearchResults;