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

const mockProviders = [
  {
    id: 1,
    name: "Rahul Kumar",
    avatar: "/placeholder.svg",
    rating: 4.8,
    reviews: 36,
    services: ["Fabrication", "Welding"],
    location: "Andheri East, Mumbai",
    coordinates: { lat: 19.116, lng: 72.877 },
    distance: "2.3 km",
    verified: true,
    available: "Today"
  },
  {
    id: 2,
    name: "Priya Patel",
    avatar: "/placeholder.svg",
    rating: 4.9,
    reviews: 42,
    services: ["Electrical", "Home Repair"],
    location: "Bandra West, Mumbai",
    coordinates: { lat: 19.054, lng: 72.825 },
    distance: "3.8 km",
    verified: true,
    available: "Tomorrow"
  },
  {
    id: 3,
    name: "Tech Solutions Ltd.",
    avatar: "/placeholder.svg",
    rating: 4.6,
    reviews: 28,
    services: ["Electrical", "CCTV Installation"],
    location: "Powai, Mumbai",
    coordinates: { lat: 19.116, lng: 72.907 },
    distance: "4.5 km",
    verified: true,
    available: "This Week"
  },
  {
    id: 4,
    name: "Vikram Singh",
    avatar: "/placeholder.svg",
    rating: 4.7,
    reviews: 19,
    services: ["Plumbing", "Home Repair"],
    location: "Malad, Mumbai",
    coordinates: { lat: 19.186, lng: 72.848 },
    distance: "5.2 km",
    verified: true,
    available: "Today"
  },
  {
    id: 5,
    name: "Perfect Plumbers Co.",
    avatar: "/placeholder.svg",
    rating: 4.5,
    reviews: 31,
    services: ["Plumbing", "Bathroom Fitting"],
    location: "Juhu, Mumbai",
    coordinates: { lat: 19.100, lng: 72.826 },
    distance: "3.3 km",
    verified: true,
    available: "Tomorrow"
  }
];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return parseFloat(distance.toFixed(1));
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get('service') || '';
  const locationParam = searchParams.get('location') || '';
  
  const [service, setService] = useState(serviceParam);
  const [location, setLocation] = useState(locationParam);
  const [maxDistance, setMaxDistance] = useState([10]);
  const [showFilters, setShowFilters] = useState(false);
  
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
  const [selectedProviderType, setSelectedProviderType] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [onlyVerified, setOnlyVerified] = useState(false);
  
  const { userLocation, requestLocationPermission } = useAuth();
  const [providers, setProviders] = useState([...mockProviders]);
  const [showLocationAlert, setShowLocationAlert] = useState(false);
  
  useEffect(() => {
    if (!userLocation && !locationParam) {
      setShowLocationAlert(true);
    } else {
      setShowLocationAlert(false);
    }
    
    if (userLocation) {
      const providersWithDistance = mockProviders.map(provider => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          provider.coordinates.lat,
          provider.coordinates.lng
        );
        return {
          ...provider,
          distance: `${distance} km`
        };
      });
      
      providersWithDistance.sort((a, b) => {
        const distA = parseFloat(a.distance.split(' ')[0]);
        const distB = parseFloat(b.distance.split(' ')[0]);
        return distA - distB;
      });
      
      setProviders(providersWithDistance);
    }
  }, [userLocation, locationParam]);
  
  const handleLocationRequest = async () => {
    const success = await requestLocationPermission();
    if (success) {
      setShowLocationAlert(false);
      toast.success("Showing service providers near your location");
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
              <div className="mb-4 flex justify-between items-center">
                <div>
                  <h2 className="font-heading font-medium text-lg">
                    {providers.length} Service Providers Found
                  </h2>
                  <p className="text-sm text-gray-600">
                    Showing results for {service || 'All Services'} in {userLocation?.address || location || 'Your Area'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                {providers.map((provider) => (
                  <Card key={provider.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="p-4 md:p-6 flex-grow">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                              <AvatarImage src={provider.avatar} alt={provider.name} />
                              <AvatarFallback className="bg-nearfix-100 text-nearfix-700">
                                {provider.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-lg">{provider.name}</h3>
                                {provider.verified && (
                                  <Badge variant="secondary" className="bg-green-50 text-green-700 flex items-center gap-1">
                                    <UserCheck className="h-3 w-3" />
                                    <span className="text-xs">Verified</span>
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center mt-1">
                                <div className="flex items-center text-yellow-400 mr-2">
                                  <Star className="h-4 w-4 fill-yellow-400" />
                                  <span className="text-sm font-medium text-gray-700 ml-1">
                                    {provider.rating}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  ({provider.reviews} reviews)
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <div className="flex flex-wrap gap-2 mb-3">
                              {provider.services.map((service) => (
                                <Badge key={service} variant="outline" className="bg-nearfix-50 text-nearfix-700 border-none">
                                  {service}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{provider.location}</span>
                              <span className="mx-2">•</span>
                              <span>{provider.distance}</span>
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                              <span>Available: {provider.available}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 md:p-6 md:border-l flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 bg-gray-50">
                          <Button asChild variant="outline">
                            <a href={`/provider/${provider.id}`}>
                              View Profile
                            </a>
                          </Button>
                          <Button className="bg-nearfix-500 hover:bg-nearfix-600">
                            <Phone className="h-4 w-4 mr-2" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default SearchResults;
