import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Plus, Clock, CheckCircle, AlertCircle, MapPin, Navigation, Briefcase, User, Store, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Job = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: number;
  status: string;
  created_at: string;
  responses: number;
};

type SellerPost = {
  id: string;
  title: string;
  description: string;
  service_types: string[];
  hourly_rate: number;
  location: string;
  status: string;
  created_at: string;
  responses: number;
};

type Provider = {
  provider_id: string;
  user_id: string;
  business_name: string;
  service_types: string[];
  description: string;
  hourly_rate: number;
  distance: number;
  latitude: number;
  longitude: number;
  address: string;
};

const Dashboard = () => {
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [completedJobs, setCompletedJobs] = useState<Job[]>([]);
  const [sellerPosts, setSellerPosts] = useState<SellerPost[]>([]);
  const [nearbyProviders, setNearbyProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isLoadingSellerPosts, setIsLoadingSellerPosts] = useState(false);
  
  const { userLocation, requestLocationPermission, user } = useAuth();
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  
  useEffect(() => {
    if (userLocation) {
      fetchNearbyProviders();
    }
  }, [userLocation]);

  useEffect(() => {
    if (user) {
      fetchJobs();
      fetchSellerPosts();
    }
  }, [user]);
  
  const fetchJobs = async () => {
    setIsLoadingJobs(true);
    try {
      const { data: activeData, error: activeError } = await supabase
        .from('job_postings')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      const { data: completedData, error: completedError } = await supabase
        .from('job_postings')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (activeError) throw activeError;
      if (completedError) throw completedError;

      // Get response counts for each job
      const jobsWithResponses = await Promise.all(
        [...(activeData || []), ...(completedData || [])].map(async (job) => {
          const { count, error } = await supabase
            .from('job_responses')
            .select('*', { count: 'exact', head: true })
            .eq('job_id', job.id);

          if (error) throw error;
          return { ...job, responses: count || 0 };
        })
      );

      setActiveJobs(jobsWithResponses.filter(job => job.status === 'open'));
      setCompletedJobs(jobsWithResponses.filter(job => job.status === 'completed'));
    } catch (error: any) {
      toast.error("Failed to fetch jobs");
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const fetchSellerPosts = async () => {
    setIsLoadingSellerPosts(true);
    try {
      const { data, error } = await supabase
        .from('seller_posts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get response counts for each seller post
      const postsWithResponses = await Promise.all(
        (data || []).map(async (post) => {
          const { count, error } = await supabase
            .from('seller_responses')
            .select('*', { count: 'exact', head: true })
            .eq('seller_post_id', post.id);

          if (error) throw error;
          return { ...post, responses: count || 0 };
        })
      );

      setSellerPosts(postsWithResponses);
    } catch (error: any) {
      toast.error("Failed to fetch seller posts");
      console.error("Error fetching seller posts:", error);
    } finally {
      setIsLoadingSellerPosts(false);
    }
  };

  const fetchNearbyProviders = async () => {
    if (!userLocation) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('find_nearest_providers', {
        user_lat: userLocation.latitude,
        user_lon: userLocation.longitude,
        limit_count: 3
      });

      if (error) throw error;
      setNearbyProviders(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch nearby providers");
      console.error("Error fetching providers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationRequest = async () => {
    const success = await requestLocationPermission();
    setShowLocationDialog(false);
    
    if (success) {
      toast.success("We can now show service providers near you");
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">Active</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200">Pending</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">Completed</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <MainLayout>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="font-heading text-2xl font-bold text-gray-900 mb-2">
                  My Dashboard
                </h1>
                <p className="text-gray-600">
                  Manage your jobs and track responses from service providers
                </p>
                
                {userLocation && (
                  <div className="mt-2 flex items-center text-sm text-nearfix-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>
                      {userLocation.address || 
                        `Lat: ${userLocation.latitude.toFixed(4)}, Long: ${userLocation.longitude.toFixed(4)}`}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={requestLocationPermission} 
                      className="ml-2 h-7 text-xs"
                    >
                      <Navigation className="h-3 w-3 mr-1" /> Update
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center gap-3">
                {!userLocation && (
                  <Button 
                    variant="outline" 
                    onClick={requestLocationPermission}
                    className="flex items-center gap-1"
                  >
                    <MapPin className="h-4 w-4" /> Set Location
                  </Button>
                )}
                <Button asChild className="bg-nearfix-600 hover:bg-nearfix-700">
                  <Link to="/post-job">
                    <Plus className="mr-2 h-4 w-4" /> Post a New Job
                  </Link>
                </Button>
                <Button asChild className="bg-nearfix-600 hover:bg-nearfix-700">
                  <Link to="/become-seller">
                    <Plus className="mr-2 h-4 w-4" /> Become a Seller
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/job-search">
                    <Search className="mr-2 h-4 w-4" />
                    Browse Jobs
                  </Link>
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="jobs" className="space-y-8">
              <TabsList className="bg-white border">
                <TabsTrigger value="jobs" className="data-[state=active]:bg-nearfix-50 data-[state=active]:text-nearfix-900">
                  <Briefcase className="mr-2 h-4 w-4" /> My Jobs
                </TabsTrigger>
                <TabsTrigger value="sellers" className="data-[state=active]:bg-nearfix-50 data-[state=active]:text-nearfix-900">
                  <User className="mr-2 h-4 w-4" /> My Seller Profile
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="jobs" className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-6">My Job Posts</h2>
                  
                  <Tabs defaultValue="active" className="space-y-6">
                    <TabsList className="bg-gray-50 border">
                      <TabsTrigger value="active" className="data-[state=active]:bg-nearfix-50 data-[state=active]:text-nearfix-900">
                        <Clock className="mr-2 h-4 w-4" /> Active Jobs
                      </TabsTrigger>
                      <TabsTrigger value="completed" className="data-[state=active]:bg-nearfix-50 data-[state=active]:text-nearfix-900">
                        <CheckCircle className="mr-2 h-4 w-4" /> Completed Jobs
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="active" className="space-y-6">
                      {isLoadingJobs ? (
                        <div className="text-center py-8">
                          <p>Loading your jobs...</p>
                        </div>
                      ) : activeJobs.length > 0 ? (
                        activeJobs.map(job => (
                          <Card key={job.id} className="border-0 shadow-sm">
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-medium text-lg">{job.title}</h3>
                                    {getStatusBadge(job.status)}
                                  </div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-lg">{job.email}</h4>
                                  </div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-lg">{job.Phone_Number}</h4>
                                  </div>
                                  <p className="text-sm text-gray-600">{job.description}</p>
                                  <p className="text-sm text-gray-600 flex items-center mt-2">
                                    <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" /> {job.location}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    Posted on: {new Date(job.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-3">
                                  <div className="text-center px-4 py-2 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Budget</p>
                                    <p className="font-bold text-xl text-nearfix-600">₹{job.budget}</p>
                                  </div>
                                  <div className="text-center px-4 py-2 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Responses</p>
                                    <p className="font-bold text-xl text-nearfix-600">{job.responses}</p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-600">No active jobs found.</p>
                          <Button asChild className="mt-4">
                            <Link to="/post-job">
                              <Plus className="mr-2 h-4 w-4" /> Post a New Job
                            </Link>
                          </Button>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="completed" className="space-y-6">
                      {isLoadingJobs ? (
                        <div className="text-center py-8">
                          <p>Loading completed jobs...</p>
                        </div>
                      ) : completedJobs.length > 0 ? (
                        completedJobs.map(job => (
                          <Card key={job.id} className="border-0 shadow-sm">
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-medium text-lg">{job.title}</h3>
                                    {getStatusBadge(job.status)}
                                  </div>
                                  <p className="text-sm text-gray-600">{job.description}</p>
                                  <p className="text-sm text-gray-600 flex items-center mt-2">
                                    <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" /> {job.location}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    Posted on: {new Date(job.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-3">
                                  <div className="text-center px-4 py-2 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Budget</p>
                                    <p className="font-bold text-xl text-nearfix-600">₹{job.budget}</p>
                                  </div>
                                  <div className="text-center px-4 py-2 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Responses</p>
                                    <p className="font-bold text-xl text-nearfix-600">{job.responses}</p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-600">No completed jobs found.</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </TabsContent>

              <TabsContent value="sellers" className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-6">My Seller Profile</h2>
                  
                  <div className="mb-8">
                    <h3 className="font-medium text-lg mb-4">My Service Posts</h3>
                    {isLoadingSellerPosts ? (
                      <div className="text-center py-8">
                        <p>Loading your service posts...</p>
                      </div>
                    ) : sellerPosts.length > 0 ? (
                      <div className="grid gap-4">
                        {sellerPosts.map((post) => (
                          <Card key={post.id} className="border-0 shadow-sm">
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-medium text-lg">{post.title}</h3>
                                    {getStatusBadge(post.status)}
                                  </div>
                                  <p className="text-sm text-gray-600">{post.description}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <p className="text-sm text-gray-600">
                                      <Store className="h-3.5 w-3.5 mr-1 text-gray-400 inline" />
                                      {post.service_types.join(', ')}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400 inline" />
                                      {post.location}
                                    </p>
                                  </div>
                                  <p className="text-sm text-gray-500 mt-1">
                                    Posted on: {new Date(post.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-3">
                                  <div className="text-center px-4 py-2 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Rate</p>
                                    <p className="font-bold text-xl text-nearfix-600">₹{post.hourly_rate}/hr</p>
                                  </div>
                                  <div className="text-center px-4 py-2 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Responses</p>
                                    <p className="font-bold text-xl text-nearfix-600">{post.responses}</p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600">No service posts found.</p>
                        <Button asChild className="mt-4">
                          <Link to="/become-seller">
                            <Plus className="mr-2 h-4 w-4" /> Create Service Post
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>

                  {userLocation && (
                    <div className="mb-8">
                      <h3 className="font-medium text-lg mb-4">Nearby Service Providers</h3>
                      {isLoading ? (
                        <p className="text-center py-4">Loading nearby providers...</p>
                      ) : nearbyProviders.length > 0 ? (
                        <div className="grid gap-4">
                          {nearbyProviders.map((provider) => (
                            <Card key={provider.provider_id} className="border-0 shadow-sm">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h4 className="font-medium">{provider.business_name}</h4>
                                    <p className="text-sm text-gray-600">
                                      {provider.service_types.join(', ')}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {provider.distance.toFixed(1)} km away
                                    </p>
                                  </div>
                                  <Button variant="outline" size="sm">
                                    Contact
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p>No providers found nearby. Try expanding your search area.</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={requestLocationPermission}
                          >
                            <MapPin className="mr-2 h-3 w-3" /> Update Location
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {!userLocation && (
                    <div className="mb-6">
                      <Alert className="bg-blue-50 border-blue-200">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="flex items-center justify-between">
                          <span>Share your location to find service providers near you.</span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-white border-blue-200 text-blue-700 hover:bg-blue-100"
                            onClick={requestLocationPermission}
                          >
                            <MapPin className="mr-2 h-3 w-3" />
                            Enable Location
                          </Button>
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  <div className="mt-8">
                    <h3 className="font-medium text-lg mb-4">Seller Profile Settings</h3>
                    <div className="grid gap-6">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Business Information</h4>
                        <p className="text-sm text-gray-600 mb-4">Update your business details and services</p>
                        <Button variant="outline" size="sm">
                          Edit Business Info
                        </Button>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Service Areas</h4>
                        <p className="text-sm text-gray-600 mb-4">Manage the areas where you provide services</p>
                        <Button variant="outline" size="sm">
                          Edit Service Areas
                        </Button>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Availability</h4>
                        <p className="text-sm text-gray-600 mb-4">Set your working hours and availability</p>
                        <Button variant="outline" size="sm">
                          Edit Availability
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
      
      <AlertDialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Share your location</AlertDialogTitle>
            <AlertDialogDescription>
              Allow NearFix to access your location to find nearby service providers. 
              This helps us connect you with the most relevant professionals in your area.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Not now</AlertDialogCancel>
            <AlertDialogAction onClick={handleLocationRequest}>
              <MapPin className="mr-2 h-4 w-4" />
              Enable location
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Dashboard;
