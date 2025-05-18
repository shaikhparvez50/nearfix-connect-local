
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Compass, MapPin, Search, Filter, Star, Clock, Briefcase } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLocation as useLocationHook } from '@/hooks/useLocation';
import { JobPostingType, ProviderType } from '@/types/types';
import { Skeleton } from '@/components/ui/skeleton';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('service') || '');
  const [searchLocation, setSearchLocation] = useState(searchParams.get('location') || '');
  const [activeTab, setActiveTab] = useState('providers');
  const [providers, setProviders] = useState<ProviderType[]>([]);
  const [jobs, setJobs] = useState<JobPostingType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const locationHook = useLocationHook();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch providers
        let providerQuery = supabase.from('service_providers').select('*');
        
        if (searchTerm) {
          providerQuery = providerQuery.contains('service_types', [searchTerm]);
        }

        const { data: providersData, error: providersError } = await providerQuery;
        
        if (providersError) throw new Error(providersError.message);
        
        // Transform data to match ProviderType
        const transformedProviders: ProviderType[] = providersData?.map(provider => ({
          provider_id: provider.id,
          user_id: provider.user_id,
          business_name: provider.business_name || 'Unnamed Business',
          service_types: provider.service_types,
          description: provider.description || '',
          hourly_rate: provider.hourly_rate || 0,
          distance: 0, // Default distance
          address: ''  // Will be populated if we get location data
        })) || [];
        
        setProviders(transformedProviders);
        
        // Fetch jobs
        let jobsQuery = supabase.from('job_postings').select('*');
        
        if (searchTerm) {
          jobsQuery = jobsQuery.ilike('category', `%${searchTerm}%`);
        }
        
        if (searchLocation) {
          jobsQuery = jobsQuery.ilike('location', `%${searchLocation}%`);
        }
        
        const { data: jobsData, error: jobsError } = await jobsQuery;
        
        if (jobsError) throw new Error(jobsError.message);
        
        // Transform data to match JobPostingType
        const transformedJobs: JobPostingType[] = jobsData?.map(job => ({
          id: job.id,
          title: job.title,
          description: job.description,
          category: job.category,
          location: job.location,
          budget: job.budget || 0,
          created_at: job.created_at,
          status: job.status,
          user_id: job.user_id
        })) || [];
        
        setJobs(transformedJobs);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch search results. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, searchLocation, toast]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?service=${encodeURIComponent(searchTerm)}&location=${encodeURIComponent(searchLocation)}`);
    
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch providers
        let providerQuery = supabase.from('service_providers').select('*');
        
        if (searchTerm) {
          providerQuery = providerQuery.contains('service_types', [searchTerm]);
        }

        const { data: providersData, error: providersError } = await providerQuery;
        
        if (providersError) throw new Error(providersError.message);
        
        // Transform data to match ProviderType
        const transformedProviders: ProviderType[] = providersData?.map(provider => ({
          provider_id: provider.id,
          user_id: provider.user_id,
          business_name: provider.business_name || 'Unnamed Business',
          service_types: provider.service_types,
          description: provider.description || '',
          hourly_rate: provider.hourly_rate || 0,
          distance: 0,
          address: ''
        })) || [];
        
        setProviders(transformedProviders);
        
        // Fetch jobs
        let jobsQuery = supabase.from('job_postings').select('*');
        
        if (searchTerm) {
          jobsQuery = jobsQuery.ilike('category', `%${searchTerm}%`);
        }
        
        if (searchLocation) {
          jobsQuery = jobsQuery.ilike('location', `%${searchLocation}%`);
        }
        
        const { data: jobsData, error: jobsError } = await jobsQuery;
        
        if (jobsError) throw new Error(jobsError.message);
        
        // Transform data to match JobPostingType
        const transformedJobs: JobPostingType[] = jobsData?.map(job => ({
          id: job.id,
          title: job.title,
          description: job.description,
          category: job.category,
          location: job.location,
          budget: job.budget || 0,
          created_at: job.created_at,
          status: job.status,
          user_id: job.user_id
        })) || [];
        
        setJobs(transformedJobs);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch search results. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  };

  const handleDetectLocation = () => {
    locationHook.detectLocation();
  };

  // Update location input when we get location from the hook
  useEffect(() => {
    if (locationHook.address) {
      setSearchLocation(locationHook.address);
    }
  }, [locationHook.address]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-4 md:py-8 px-4 md:px-0">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-xl md:text-3xl font-bold text-nearfix-900 mb-4 md:mb-6">
              Search Results
            </h1>

            {/* Search form */}
            <form onSubmit={handleSearch} className="bg-white p-3 md:p-4 rounded-xl shadow-md mb-4 md:mb-6">
              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Service type"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-10"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative flex items-center">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Location"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="pl-9 h-10 pr-10"
                    />
                    <Button 
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-8"
                      onClick={handleDetectLocation}
                      disabled={locationHook.loading}
                    >
                      <Compass className="h-4 w-4 text-nearfix-500" />
                      <span className="sr-only">Detect location</span>
                    </Button>
                  </div>
                  {locationHook.error && (
                    <p className="text-xs text-red-500 mt-1">{locationHook.error}</p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="bg-nearfix-600 hover:bg-nearfix-700 w-full md:w-auto"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Results Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList className="w-full md:w-auto">
                  <TabsTrigger value="providers" className="flex-1 text-xs md:text-sm">
                    <Briefcase className="h-3 w-3 mr-1 hidden md:inline" />
                    Service Providers
                  </TabsTrigger>
                  <TabsTrigger value="jobs" className="flex-1 text-xs md:text-sm">
                    <Clock className="h-3 w-3 mr-1 hidden md:inline" />
                    Jobs
                  </TabsTrigger>
                </TabsList>
                <Button variant="outline" size="sm" className="hidden md:flex text-xs gap-1">
                  <Filter className="h-3 w-3" />
                  Filters
                </Button>
              </div>

              <TabsContent value="providers">
                <div className="space-y-4">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex justify-between">
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-[200px]" />
                              <Skeleton className="h-3 w-[150px]" />
                            </div>
                            <Skeleton className="h-4 w-[80px]" />
                          </div>
                          <Skeleton className="h-12 w-full mt-3" />
                          <div className="mt-4 flex justify-end">
                            <Skeleton className="h-8 w-[90px] mr-2" />
                            <Skeleton className="h-8 w-[90px]" />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : providers.length > 0 ? (
                    providers.map((provider) => (
                      <Card key={provider.provider_id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start flex-wrap gap-2">
                            <div>
                              <h3 className="font-semibold text-lg line-clamp-1">{provider.business_name}</h3>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {provider.service_types.slice(0, 3).map((service, idx) => (
                                  <span 
                                    key={idx}
                                    className="bg-nearfix-100 text-nearfix-600 px-2 py-0.5 rounded text-xs"
                                  >
                                    {service}
                                  </span>
                                ))}
                                {provider.service_types.length > 3 && (
                                  <span className="text-xs text-gray-500">+{provider.service_types.length - 3} more</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-medium">₹{provider.hourly_rate}/hr</span>
                              {provider.distance > 0 && (
                                <p className="text-sm text-gray-500">{provider.distance.toFixed(1)} km away</p>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-600 mt-2 line-clamp-2 text-sm md:text-base">
                            {provider.description || 'No description provided.'}
                          </p>
                          <div className="mt-4 flex flex-wrap justify-end gap-2">
                            <Button variant="outline" size="sm" className="text-nearfix-600 w-full sm:w-auto">
                              View Profile
                            </Button>
                            <Button size="sm" className="bg-nearfix-600 w-full sm:w-auto">
                              Contact
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-white rounded-lg shadow-sm">
                      <p className="text-gray-500">No service providers found matching your criteria</p>
                      <p className="text-sm text-gray-400 mt-1">Try adjusting your search terms</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="jobs">
                <div className="space-y-4">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex justify-between">
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-[200px]" />
                              <Skeleton className="h-3 w-[150px]" />
                            </div>
                            <Skeleton className="h-4 w-[80px]" />
                          </div>
                          <Skeleton className="h-12 w-full mt-3" />
                          <div className="mt-4 flex justify-end">
                            <Skeleton className="h-8 w-[90px] mr-2" />
                            <Skeleton className="h-8 w-[90px]" />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : jobs.length > 0 ? (
                    jobs.map((job) => (
                      <Card key={job.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start flex-wrap gap-2">
                            <div>
                              <h3 className="font-semibold text-lg line-clamp-1">{job.title}</h3>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span className="line-clamp-1">{job.location}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-medium">₹{job.budget || 'Negotiable'}</span>
                              <p className="text-xs text-gray-500">
                                Posted on {formatDate(job.created_at)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className="bg-nearfix-100 text-nearfix-600 px-2 py-0.5 rounded text-xs">
                              {job.category}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-2 line-clamp-2 text-sm md:text-base">
                            {job.description}
                          </p>
                          <div className="mt-4 flex flex-wrap justify-end gap-2">
                            <Button variant="outline" size="sm" className="text-nearfix-600 w-full sm:w-auto">
                              View Details
                            </Button>
                            <Button size="sm" className="ml-0 sm:ml-2 bg-nearfix-600 w-full sm:w-auto">
                              Apply
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-white rounded-lg shadow-sm">
                      <p className="text-gray-500">No jobs found matching your criteria</p>
                      <p className="text-sm text-gray-400 mt-1">Try different search terms or check back later</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SearchResults;
