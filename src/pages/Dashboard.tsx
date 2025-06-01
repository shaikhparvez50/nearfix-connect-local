import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Plus, Clock, CheckCircle, AlertCircle, MapPin, Store, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useLocation } from "@/hooks/useLocation"; 
import { LocationButton } from "@/components/dashboard/LocationButton";
import { LocationDisplay } from "@/components/dashboard/LocationDisplay";
import { NearbyProviders } from "@/components/dashboard/NearbyProviders";
import { useIsMobile } from "@/hooks/use-mobile";
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

const Dashboard = () => {
  const [activeJobs, setActiveJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  
  const { user } = useAuth();
  const { latitude, longitude, detectLocation } = useLocation();
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const isMobile = useIsMobile();
  
  // Derived state for userLocation
  const userLocation = latitude && longitude ? { latitude, longitude } : null;
  
  const handleLocationRequest = async () => {
    const success = await detectLocation();
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
      <section className="py-3 md:py-6 lg:py-10 bg-gray-50">
        <div className="container mx-auto px-3 md:px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 md:mb-5 lg:mb-6">
              <div>
                <h1 className="font-heading text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">
                  My Dashboard
                </h1>
                <p className="text-sm md:text-base text-gray-600">
                  Manage your jobs and track responses from service providers
                </p>
                
                <LocationDisplay className="mt-2" />
              </div>
              
              <div className="mt-3 md:mt-0 flex flex-wrap items-center gap-2 md:gap-3">
                {!userLocation && (
                  <LocationButton />
                )}
                <Button asChild className="bg-nearfix-600 hover:bg-nearfix-700 h-8 md:h-9 text-xs md:text-sm px-2 md:px-3">
                  <Link to="/post-job">
                    <Plus className="mr-1 h-3 w-3 md:h-4 md:w-4" /> Post Job
                  </Link>
                </Button>
                <Button asChild className="bg-nearfix-600 hover:bg-nearfix-700 h-8 md:h-9 text-xs md:text-sm px-2 md:px-3">
                  <Link to="/become-seller">
                    <Store className="mr-1 h-3 w-3 md:h-4 md:w-4" /> Create Shop
                  </Link>
                </Button>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <div className="overflow-x-auto thin-scrollbar pb-1">
                <TabsList className="bg-white border w-full md:w-auto flex">
                  <TabsTrigger value="active" className="data-[state=active]:bg-nearfix-50 data-[state=active]:text-nearfix-900 flex-shrink-0 min-w-fit">
                    <Clock className="mr-1 h-3 w-3 md:h-4 md:w-4" /> 
                    {!isMobile ? "Active Jobs" : "Active"}
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="data-[state=active]:bg-nearfix-50 data-[state=active]:text-nearfix-900 flex-shrink-0 min-w-fit">
                    <CheckCircle className="mr-1 h-3 w-3 md:h-4 md:w-4" /> 
                    {!isMobile ? "Completed Jobs" : "Completed"}
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="data-[state=active]:bg-nearfix-50 data-[state=active]:text-nearfix-900 flex-shrink-0 min-w-fit">
                    <Settings className="mr-1 h-3 w-3 md:h-4 md:w-4" /> 
                    {!isMobile ? "Profile Settings" : "Settings"}
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="active" className="space-y-4">
                {!userLocation && (
                  <div className="mb-3 md:mb-4">
                    <Alert className="bg-blue-50 border-blue-200">
                      <MapPin className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                      <AlertDescription className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs md:text-sm">
                        <span>Share your location to find service providers near you.</span>
                        <LocationButton 
                          className="bg-white border-blue-200 text-blue-700 hover:bg-blue-100 h-8 text-xs px-2"
                        />
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                <NearbyProviders />

                {activeJobs.length > 0 ? (
                  <div className="grid gap-3 md:gap-4">
                    {activeJobs.map(job => (
                      <Card key={job.id} className="border-0 shadow-sm">
                        <CardContent className="p-3 md:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h3 className="font-medium text-base max-w-[200px] sm:max-w-full truncate">{job.title}</h3>
                                {getStatusBadge(job.status)}
                              </div>
                              <p className="text-xs md:text-sm text-gray-600 flex items-center">
                                <MapPin className="h-3 w-3 mr-1 text-gray-400" /> 
                                <span className="truncate max-w-[250px]">{job.location}</span>
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Posted on: {new Date(job.date).toLocaleDateString()}
                              </p>
                            </div>
                            
                            <div className="flex flex-row sm:flex-row gap-2 items-center">
                              <div className="text-center px-3 py-1 md:py-2 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-600">Responses</p>
                                <p className="font-bold text-base md:text-lg text-nearfix-600">{job.responses}</p>
                              </div>
                              
                              <Button variant="outline" size="sm" className="text-xs h-8">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 md:py-8 bg-white rounded-md">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Button asChild className="bg-nearfix-600 hover:bg-nearfix-700 text-sm px-6 py-3">
                        <Link to="/search">
                          Find Service Providers
                        </Link>
                      </Button>
                      <div className="flex flex-row flex-wrap justify-center gap-2">
                        <Button asChild variant="outline" className="text-xs h-8">
                          <Link to="/post-job">
                            <Plus className="mr-1 h-3 w-3" /> Post Job
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="text-xs h-8">
                          <Link to="/become-seller">
                            <Store className="mr-1 h-3 w-3" /> Create Shop
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-4">
                {completedJobs.length > 0 ? (
                  <div className="grid gap-3 md:gap-4">
                    {completedJobs.map(job => (
                      <Card key={job.id} className="border-0 shadow-sm">
                        <CardContent className="p-3 md:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h3 className="font-medium text-base max-w-[200px] sm:max-w-full truncate">{job.title}</h3>
                                {getStatusBadge(job.status)}
                              </div>
                              <p className="text-xs md:text-sm text-gray-600 flex items-center">
                                <MapPin className="h-3 w-3 mr-1 text-gray-400" /> 
                                <span className="truncate max-w-[250px]">{job.location}</span>
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Completed on: {new Date(job.date).toLocaleDateString()}
                              </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              <Button variant="outline" size="sm" className="text-xs h-8">
                                View Details
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs h-8">
                                Leave Review
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 md:py-8 bg-white rounded-md">
                    <CheckCircle className="mx-auto mb-3 h-8 w-8 md:h-10 md:w-10 text-gray-400" />
                    <h3 className="text-base font-medium text-gray-900 mb-1">No completed jobs</h3>
                    <p className="text-xs md:text-sm text-gray-600">Your completed jobs will appear here.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="profile" className="bg-white p-3 md:p-4 rounded-md shadow-sm">
                <h2 className="font-medium text-base md:text-lg mb-3 md:mb-4">Profile Settings</h2>
                <p className="text-xs md:text-sm text-gray-600 mb-4">
                  Manage your personal information, contact details, and preferences.
                </p>
                <div className="grid gap-4 max-w-2xl">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-sm md:text-base mb-1">Personal Information</h3>
                    <p className="text-xs md:text-sm text-gray-500 mb-2">Update your name, photo and personal details</p>
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      Edit Personal Info
                    </Button>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-sm md:text-base mb-1">Contact Information</h3>
                    <p className="text-xs md:text-sm text-gray-500 mb-2">Manage your contact details and notification preferences</p>
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      Edit Contact Info
                    </Button>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-sm md:text-base mb-1">Security Settings</h3>
                    <p className="text-xs md:text-sm text-gray-500 mb-2">Update your security preferences and account settings</p>
                    <Button variant="outline" size="sm" className="text-xs h-8">
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
        <AlertDialogContent className="max-w-[90vw] w-[450px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Share your location</AlertDialogTitle>
            <AlertDialogDescription className="text-xs md:text-sm">
              Allow NearFix to access your location to find nearby service providers. 
              This helps us connect you with the most relevant professionals in your area.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="text-xs md:text-sm mt-0">Not now</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLocationRequest} 
              className="text-xs md:text-sm"
              disabled={false}
            >
              <MapPin className="mr-1 h-3 w-3 md:h-4 md:w-4" />
              Enable location
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Dashboard;
