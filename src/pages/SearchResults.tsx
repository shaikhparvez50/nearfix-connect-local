
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Search, MapPin, Star, Phone, Calendar, Filter, 
  Check, ChevronDown, ChevronUp, UserCheck, Navigation,
  Briefcase, Clock
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
}

interface JobPosting {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: number;
  created_at: string;
  status: string;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get('service') || '';
  const locationParam = searchParams.get('location') || '';
  
  const [service, setService] = useState(serviceParam);
  const [location, setLocation] = useState(locationParam);
  const [maxDistance, setMaxDistance] = useState([10]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("providers");
  
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
  const [selectedProviderType, setSelectedProviderType] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [onlyVerified, setOnlyVerified] = useState(false);
  
  const { userLocation, requestLocationPermission } = useAuth();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLocationAlert, setShowLocationAlert] = useState(false);
  
  useEffect(() => {
    if (!userLocation && !locationParam) {
      setShowLocationAlert(true);
    } else {
      setShowLocationAlert(false);
    }
    
    const fetchProviders = async () => {
      if (!userLocation) return;
      
      try {
        const { data, error } = await supabase.rpc('find_nearest_providers', {
          user_lat: userLocation.latitude,
          user_lon: userLocation.longitude,
          limit_count: 10
        });

        if (error) throw error;
        
        setProviders(data || []);
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error fetching providers:', error);
        toast.error('Failed to load service providers');
        setIsLoading(false);
      }
    };

    const fetchJobs = async () => {
      try {
        let query = supabase
          .from('job_postings')
          .select('*')
          .eq('status', 'active');
        
        if (service) {
          query = query.ilike('category', `%${service}%`);
        }
        
        if (location) {
          query = query.ilike('location', `%${location}%`);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setJobPostings(data || []);
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error fetching job postings:', error);
        toast.error('Failed to load job postings');
        setIsLoading(false);
      }
    };

    fetchJobs();
    
    if (userLocation) {
      fetchProviders();
    }
  }, [userLocation, locationParam, service, location]);
  
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
    // Update search parameters and refetch data
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

          <Tabs defaultValue="providers" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full md:w-96 grid-cols-2 mb-4">
              <TabsTrigger value="providers" className="flex items-center">
                <UserCheck className="h-4 w-4 mr-2" /> Service Providers
              </TabsTrigger>
              <TabsTrigger value="jobs" className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2" /> Job Postings
              </TabsTrigger>
            </TabsList>
          </Tabs>

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
                  
                  {activeTab === "providers" && (
                    <>
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
                    </>
                  )}
                  
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
              <TabsContent value="providers" className="mt-0">
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
                  {isLoading ? (
                    <div className="text-center py-8">Loading providers...</div>
                  ) : providers.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No service providers found in this area.</p>
                      <p className="text-gray-500">Try changing your search criteria or location.</p>
                    </div>
                  ) : (
                    providers.map((provider) => (
                      <Card key={provider.provider_id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="p-4 md:p-6 flex-grow">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                                  <AvatarImage src="/placeholder.svg" alt={provider.business_name} />
                                  <AvatarFallback className="bg-nearfix-100 text-nearfix-700">
                                    {provider.business_name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium text-lg">{provider.business_name}</h3>
                                    {provider.verified && (
                                      <Badge variant="secondary" className="bg-green-50 text-green-700 flex items-center gap-1">
                                        <UserCheck className="h-3 w-3" />
                                        <span className="text-xs">Verified</span>
                                      </Badge>
                                    )}
                                  </div>
                                  {provider.rating && (
                                    <div className="flex items-center mt-1">
                                      <div className="flex items-center text-yellow-400 mr-2">
                                        <Star className="h-4 w-4 fill-yellow-400" />
                                        <span className="text-sm font-medium text-gray-700 ml-1">
                                          {provider.rating}
                                        </span>
                                      </div>
                                      {provider.reviews && (
                                        <span className="text-xs text-gray-500">
                                          ({provider.reviews} reviews)
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="mt-4">
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {provider.service_types.map((service) => (
                                    <Badge key={service} variant="outline" className="bg-nearfix-50 text-nearfix-700 border-none">
                                      {service}
                                    </Badge>
                                  ))}
                                </div>
                                
                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                  <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                  <span>{provider.address}</span>
                                  <span className="mx-2">•</span>
                                  <span>{provider.distance.toFixed(1)} km</span>
                                </div>
                                
                                {provider.available && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                    <span>Available: {provider.available}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="p-4 md:p-6 md:border-l flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 bg-gray-50">
                              <Button asChild variant="outline">
                                <a href={`/provider/${provider.provider_id}`}>
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
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="jobs" className="mt-0">
                <div className="mb-4 flex justify-between items-center">
                  <div>
                    <h2 className="font-heading font-medium text-lg">
                      {jobPostings.length} Job Postings Found
                    </h2>
                    <p className="text-sm text-gray-600">
                      Showing results for {service || 'All Services'} in {location || 'All Locations'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="text-center py-8">Loading job postings...</div>
                  ) : jobPostings.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No job postings found for your search criteria.</p>
                      <p className="text-gray-500">Try changing your search parameters or post a job.</p>
                    </div>
                  ) : (
                    jobPostings.map((job) => (
                      <Card key={job.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="font-medium text-lg">{job.title}</h3>
                              <Badge variant="secondary" className="bg-nearfix-50 text-nearfix-700">
                                {job.category}
                              </Badge>
                            </div>
                            
                            <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                <span>{job.location}</span>
                              </div>
                              
                              {job.budget && (
                                <div className="flex items-center">
                                  <div className="h-4 w-4 mr-2 text-gray-400 flex items-center justify-center">₹</div>
                                  <span>Budget: {job.budget}</span>
                                </div>
                              )}
                              
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                <span>Posted: {new Date(job.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t flex justify-end">
                              <Button className="bg-nearfix-600 hover:bg-nearfix-700">
                                Apply Now
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default SearchResults;
