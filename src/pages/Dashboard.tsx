import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  LayoutDashboard, Briefcase, Users, MessageSquare, Settings, 
  Calendar, MapPin, DollarSign, Search, ChevronRight, Clock,
  User // Add this import from lucide-react
} from 'lucide-react';

// Define our own local types to avoid conflicts with imported ones
interface DashboardProvider {
  provider_id: string;
  business_name: string;
  service_types: string[];
  distance: number;
  address: string;
  description: string;
  hourly_rate: number;
}

interface DashboardJob {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: number;
  email?: string;
  Phone_Number?: string;
  status: string;
  created_at: string;
  responses?: number;
}

interface DashboardSellerPost {
  id: string;
  title: string;
  description: string;
  service_types: string[];
  hourly_rate: number;
  location: string;
  status: string;
  created_at: string;
  responses: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userRole, requestLocationPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [providers, setProviders] = useState<DashboardProvider[]>([]);
  const [jobs, setJobs] = useState<DashboardJob[]>([]);
  const [sellerPosts, setSellerPosts] = useState<DashboardSellerPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);
  
  const fetchUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch providers nearby if we have location permission
      const hasLocation = await requestLocationPermission();
      if (hasLocation) {
        fetchNearbyProviders();
      }
      
      // Fetch jobs based on user role
      fetchJobs();
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchNearbyProviders = async () => {
    if (!user?.id) return;
    
    try {
      // Get user location
      const { data: locationData, error: locationError } = await supabase
        .from('geo_locations')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (locationError || !locationData) {
        console.error('No location data found:', locationError);
        return;
      }
      
      // Use Supabase function to find nearest providers
      const { data: nearbyProviders, error: providersError } = await supabase
        .rpc('find_nearest_providers', { 
          user_lat: locationData.latitude, 
          user_lon: locationData.longitude,
          limit_count: 5 
        });
      
      if (providersError) {
        console.error('Error fetching nearby providers:', providersError);
        return;
      }
      
      if (nearbyProviders && nearbyProviders.length > 0) {
        const formattedProviders = nearbyProviders.map(provider => ({
          provider_id: provider.provider_id,
          business_name: provider.business_name,
          service_types: provider.service_types,
          distance: provider.distance,
          address: provider.address,
          description: provider.description,
          hourly_rate: provider.hourly_rate
        }));
        
        setProviders(formattedProviders);
      }
    } catch (error) {
      console.error('Error in fetchNearbyProviders:', error);
    }
  };
  
  const fetchJobs = async () => {
    if (!user?.id) return;
    
    try {
      // Fetch job postings from the actual table that exists
      const { data: jobsData, error: jobsError } = await supabase
        .from('job_postings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (jobsError) {
        console.error('Error fetching jobs:', jobsError);
        return;
      }
      
      if (jobsData) {
        setJobs(jobsData.map(job => ({
          id: job.id,
          title: job.title,
          description: job.description,
          category: job.category,
          location: job.location,
          budget: job.budget,
          email: job.email,
          Phone_Number: job.Phone_Number ? String(job.Phone_Number) : undefined,
          status: job.status,
          created_at: job.created_at,
          responses: 0 // Default to 0 since we don't have actual response count
        })));
      }
      
    } catch (error) {
      console.error('Error in fetchJobs:', error);
    }
  };
  
  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Rendering based on user role
  const renderContent = () => {
    if (!user) {
      return (
        <Card className="shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to view your dashboard</p>
            <Button onClick={() => navigate('/signin')} className="bg-blue-600 hover:bg-blue-700">
              Sign In
            </Button>
          </CardContent>
        </Card>
      );
    }
    
    if (loading) {
      return (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    return (
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <div className="bg-white rounded-lg p-2 shadow-sm">
          <TabsList className="grid grid-cols-3 md:grid-cols-5 gap-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden md:inline">Jobs</span>
            </TabsTrigger>
            <TabsTrigger value="providers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Providers</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden md:inline">Messages</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">Settings</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview" className="space-y-6">
          <Card className="shadow-md border-0">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg pb-8">
              <CardTitle className="text-2xl">Dashboard Overview</CardTitle>
              <CardDescription className="text-blue-100">
                Welcome to your NearFix dashboard, {user.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="-mt-6">
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Signed in as:</p>
                    <p className="text-lg">{user.email}</p>
                    <p className="text-sm text-gray-500">Role: {userRole || 'Not set'}</p>
                  </div>
                  <Button onClick={fetchUserData} variant="outline" size="sm">
                    Refresh Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                  Recent Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {jobs.length > 0 ? (
                  <div className="space-y-3">
                    {jobs.slice(0, 3).map(job => (
                      <div key={job.id} className="border-b pb-3">
                        <p className="font-medium text-blue-800">{job.title}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{job.category}</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatDate(job.created_at)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 py-4 text-center">No recent jobs</p>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" className="w-full text-blue-600 justify-between" onClick={() => setActiveTab('jobs')}>
                  View all jobs <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Nearby Providers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {providers.length > 0 ? (
                  <div className="space-y-3">
                    {providers.slice(0, 3).map(provider => (
                      <div key={provider.provider_id} className="border-b pb-3">
                        <p className="font-medium text-blue-800">{provider.business_name}</p>
                        <div className="text-sm text-gray-500 mt-1">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{provider.distance.toFixed(1)} km away</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Briefcase className="h-3 w-3 mr-1" />
                            <span>{provider.service_types.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 py-4 text-center">No nearby providers found</p>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" className="w-full text-blue-600 justify-between" onClick={() => setActiveTab('providers')}>
                  View all providers <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100" 
                  onClick={() => navigate('/post-job')}>
                  <Briefcase className="h-4 w-4 mr-2" />
                  Post a New Job
                </Button>
                <Button className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100"
                  onClick={() => navigate('/search-services')}>
                  <Search className="h-4 w-4 mr-2" />
                  Find Service Providers
                </Button>
                <Button className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100">
                  <User className="h-4 w-4 mr-2" />
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="jobs" className="space-y-6">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Available Jobs</CardTitle>
                <CardDescription>Browse and apply for jobs near you</CardDescription>
              </div>
              <Button onClick={() => navigate('/post-job')} className="bg-blue-600 hover:bg-blue-700">
                Post New Job
              </Button>
            </CardHeader>
            <CardContent>
              {jobs.length > 0 ? (
                <div className="space-y-6">
                  {jobs.map(job => (
                    <Card key={job.id} className="overflow-hidden shadow-sm hover:shadow-md transition-all">
                      <CardHeader className="bg-blue-50 pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl text-blue-800">{job.title}</CardTitle>
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {job.category}
                          </span>
                        </div>
                        <CardDescription className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-gray-700 mb-4">{job.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center text-gray-700">
                            <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                            <span>Budget: ${job.budget}</span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <Calendar className="h-4 w-4 mr-1 text-blue-600" />
                            <span>Posted: {formatDate(job.created_at)}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-gray-50 border-t">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Apply Now
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <p className="text-gray-500 mb-4">No jobs found</p>
                  <Button onClick={() => navigate('/post-job')}>
                    Post Your First Job
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="providers" className="space-y-6">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Service Providers Near You</CardTitle>
                <CardDescription>Connect with verified professionals in your area</CardDescription>
              </div>
              <Button onClick={() => navigate('/search-services')} variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Search Services
              </Button>
            </CardHeader>
            <CardContent>
              {providers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {providers.map(provider => (
                    <Card key={provider.provider_id} className="overflow-hidden shadow-sm hover:shadow-md transition-all">
                      <CardHeader className="bg-blue-50 pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl text-blue-800">{provider.business_name}</CardTitle>
                          <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                            <MapPin className="h-3 w-3 mr-1" />
                            {provider.distance.toFixed(1)} km
                          </div>
                        </div>
                        <CardDescription>
                          {provider.service_types.join(' • ')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-gray-700 mb-4">{provider.description || 'No description available'}</p>
                        <div className="flex items-center text-gray-700">
                          <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                          <span>Rate: ${provider.hourly_rate}/hr</span>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-gray-50 border-t flex justify-between">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                        <Button size="sm" variant="outline">
                          View Profile
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <p className="text-gray-500 mb-4">No service providers found nearby</p>
                  <Button onClick={() => requestLocationPermission()}>
                    Update Location
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Manage your conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-16 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No messages yet</p>
                <p className="text-sm text-gray-400 mt-2">
                  Messages from service providers and clients will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-16 text-center">
                <Settings className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Settings coming soon</p>
                <p className="text-sm text-gray-400 mt-2">
                  You'll be able to manage your profile and preferences here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  };
  
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-900">Dashboard</h1>
        {user && (
          <Button onClick={fetchUserData} variant="outline" size="sm" className="flex items-center gap-2">
            <span>Refresh</span>
          </Button>
        )}
      </div>
      {renderContent()}
    </div>
  );
};

export default Dashboard;
