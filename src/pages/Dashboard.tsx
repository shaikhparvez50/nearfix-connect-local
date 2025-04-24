import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Plus, Clock, CheckCircle, AlertCircle, MapPin, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [activeJobs, setActiveJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [nearbyProviders, setNearbyProviders] = useState([]);
  
  const { userLocation, requestLocationPermission } = useAuth();
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  
  useEffect(() => {
    if (userLocation) {
      const fetchNearbyProviders = async () => {
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
        }
      };

      fetchNearbyProviders();
    }
  }, [userLocation]);

  const handleLocationRequest = async () => {
    const success = await requestLocationPermission();
    setShowLocationDialog(false);
    
    if (success) {
      toast.success("We can now show service providers near you");
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
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
                    onClick={() => setShowLocationDialog(true)}
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
              </div>
            </div>
            
            <Tabs defaultValue="active" className="space-y-8">
              <TabsList className="bg-white border">
                <TabsTrigger value="active" className="data-[state=active]:bg-nearfix-50 data-[state=active]:text-nearfix-900">
                  <Clock className="mr-2 h-4 w-4" /> Active Jobs
                </TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-nearfix-50 data-[state=active]:text-nearfix-900">
                  <CheckCircle className="mr-2 h-4 w-4" /> Completed Jobs
                </TabsTrigger>
                <TabsTrigger value="profile" className="data-[state=active]:bg-nearfix-50 data-[state=active]:text-nearfix-900">
                  Profile Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="space-y-6">
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
                          onClick={handleLocationRequest}
                        >
                          <MapPin className="mr-2 h-3 w-3" />
                          Enable Location
                        </Button>
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {userLocation && nearbyProviders.length > 0 && (
                  <div className="mb-8">
                    <h3 className="font-medium text-lg mb-4">Nearby Service Providers</h3>
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
                  </div>
                )}

                {activeJobs.length > 0 ? (
                  activeJobs.map(job => (
                    <Card key={job.id} className="border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-lg">{job.title}</h3>
                              {getStatusBadge(job.status)}
                            </div>
                            <p className="text-sm text-gray-600 flex items-center">
                              <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" /> {job.location}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">Posted on: {new Date(job.date).toLocaleDateString()}</p>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-3">
                            <div className="text-center px-4 py-2 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600">Responses</p>
                              <p className="font-bold text-xl text-nearfix-600">{job.responses}</p>
                            </div>
                            
                            <Button variant="outline" className="sm:self-center">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-16 bg-white rounded-md">
                    <AlertCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No active jobs found</h3>
                    <p className="text-gray-600 mb-6">You don't have any active job postings at the moment.</p>
                    <Button asChild className="bg-nearfix-600 hover:bg-nearfix-700">
                      <Link to="/post-job">Post Your First Job</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-6">
                {completedJobs.length > 0 ? (
                  completedJobs.map(job => (
                    <Card key={job.id} className="border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-lg">{job.title}</h3>
                              {getStatusBadge(job.status)}
                            </div>
                            <p className="text-sm text-gray-600 flex items-center">
                              <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" /> {job.location}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">Completed on: {new Date(job.date).toLocaleDateString()}</p>
                          </div>
                          
                          <div className="flex gap-3">
                            <Button variant="outline">
                              View Details
                            </Button>
                            <Button variant="outline">
                              Leave Review
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-16 bg-white rounded-md">
                    <CheckCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No completed jobs</h3>
                    <p className="text-gray-600">Your completed jobs will appear here.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="profile" className="bg-white p-6 rounded-md shadow-sm">
                <h2 className="font-medium text-xl mb-6">Profile Settings</h2>
                <p className="text-gray-600 mb-4">
                  Manage your personal information, contact details, and preferences.
                </p>
                <div className="grid gap-6 max-w-2xl">
                  <div>
                    <h3 className="font-medium mb-2">Personal Information</h3>
                    <p className="text-sm text-gray-500 mb-3">Update your name, photo and personal details</p>
                    <Button variant="outline" size="sm">
                      Edit Personal Info
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Contact Information</h3>
                    <p className="text-sm text-gray-500 mb-3">Manage your contact details and notification preferences</p>
                    <Button variant="outline" size="sm">
                      Edit Contact Info
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Security Settings</h3>
                    <p className="text-sm text-gray-500 mb-3">Update your security preferences and account settings</p>
                    <Button variant="outline" size="sm">
                      Edit Security Settings
                    </Button>
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
