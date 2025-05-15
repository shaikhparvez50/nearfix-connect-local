
// Import necessary components and types
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const { user, userRole, requestLocationPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [providers, setProviders] = useState<DashboardProvider[]>([]);
  const [jobs, setJobs] = useState<DashboardJob[]>([]);
  const [sellerPosts, setSellerPosts] = useState<DashboardSellerPost[]>([]);
  
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);
  
  const fetchUserData = async () => {
    if (!user) return;

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
  
  // Rendering based on user role
  const renderContent = () => {
    if (!user) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your dashboard</p>
          <Button onClick={() => navigate('/signin')}>
            Sign In
          </Button>
        </div>
      );
    }
    
    return (
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Overview</CardTitle>
              <CardDescription>Welcome to your NearFix dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">You are signed in as: {user.email}</p>
              <p className="text-sm">Role: {userRole || 'Not set'}</p>
              <Button onClick={fetchUserData} variant="outline" size="sm">
                Refresh Data
              </Button>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                {jobs.length > 0 ? (
                  <div className="space-y-2">
                    {jobs.slice(0, 3).map(job => (
                      <div key={job.id} className="border-b pb-2">
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-gray-500">{job.category}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No recent jobs</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Nearby Providers</CardTitle>
              </CardHeader>
              <CardContent>
                {providers.length > 0 ? (
                  <div className="space-y-2">
                    {providers.slice(0, 3).map(provider => (
                      <div key={provider.provider_id} className="border-b pb-2">
                        <p className="font-medium">{provider.business_name}</p>
                        <p className="text-sm text-gray-500">
                          {provider.service_types.join(', ')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {provider.distance.toFixed(1)} km away
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No nearby providers found</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  Post a New Job
                </Button>
                <Button className="w-full" variant="outline">
                  Find Service Providers
                </Button>
                <Button className="w-full" variant="outline">
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Jobs</CardTitle>
              <CardDescription>Browse available jobs</CardDescription>
            </CardHeader>
            <CardContent>
              {jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.map(job => (
                    <Card key={job.id}>
                      <CardHeader>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription>{job.category} • {job.location}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-2">{job.description}</p>
                        <div className="flex justify-between text-sm">
                          <span>Budget: ${job.budget}</span>
                          <span>Posted: {new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-4">
                          <Button size="sm">View Details</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8">No jobs found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="providers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Providers</CardTitle>
              <CardDescription>Browse service providers near you</CardDescription>
            </CardHeader>
            <CardContent>
              {providers.length > 0 ? (
                <div className="space-y-4">
                  {providers.map(provider => (
                    <Card key={provider.provider_id}>
                      <CardHeader>
                        <CardTitle>{provider.business_name}</CardTitle>
                        <CardDescription>
                          {provider.service_types.join(', ')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-2">{provider.description || 'No description available'}</p>
                        <div className="flex justify-between text-sm">
                          <span>Rate: ${provider.hourly_rate}/hr</span>
                          <span>Distance: {provider.distance.toFixed(1)} km</span>
                        </div>
                        <div className="mt-4">
                          <Button size="sm">Contact Provider</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8">No service providers found nearby</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Manage your conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8">No messages yet</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {renderContent()}
    </div>
  );
};

export default Dashboard;
