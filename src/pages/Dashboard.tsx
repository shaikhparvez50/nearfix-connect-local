import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Plus, Clock, CheckCircle, AlertCircle, MapPin, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useLocation } from "@/hooks/useLocation"; 
import { LocationButton } from "@/components/dashboard/LocationButton";
import { LocationDisplay } from "@/components/dashboard/LocationDisplay";
import { NearbyProviders } from "@/components/dashboard/NearbyProviders";
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
      <section className="py-4 md:py-8 lg:py-12 bg-gray-50">
        <div className="container mx-auto px-3 md:px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6 lg:mb-8">
              <div>
                <h1 className="font-heading text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  My Dashboard
                </h1>
                <p className="text-sm md:text-base text-gray-600">
                  Manage your jobs and track responses from service providers
                </p>
                
                <LocationDisplay className="mt-2" />
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2 md:gap-3">
                {!userLocation && (
                  <LocationButton />
                )}
                <Button asChild className="bg-nearfix-600 hover:bg-nearfix-700 h-9 text-xs md:text-sm px-3 md:px-4">
                  <Link to="/post-job">
                    <Plus className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" /> Post a Job
                  </Link>
                </Button>
                <Button asChild className="bg-nearfix-600 hover:bg-nearfix-700 h-9 text-xs md:text-sm px-3 md:px-4">
                  <Link to="/become-seller">
                    <Store className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" /> Create Shop
                  </Link>
                </Button>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6 lg:space-y-8">
              <TabsList className="bg-white border overflow-x-auto w-full flex-nowrap max-w-full">
                <TabsTrigger value="active" className="data-[state=active]:bg-nearfix-50 data-[state=active]:text-nearfix-900 flex-shrink-0">
                  <Clock className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" /> Active Jobs
                </TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-nearfix-50 data-[state=active]:text-nearfix-900 flex-shrink-0">
                  <CheckCircle className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" /> Completed Jobs
                </TabsTrigger>
                <TabsTrigger value="profile" className="data-[state=active]:bg-nearfix-50 data-[state=active]:text-nearfix-900 flex-shrink-0">
                  Profile Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="space-y-4 md:space-y-6">
                {!userLocation && (
                  <div className="mb-4">
                    <Alert className="bg-blue-50 border-blue-200">
                      <MapPin className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                      <AlertDescription className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs md:text-sm">
                        <span>Share your location to find service providers near you.</span>
                        <LocationButton 
                          className="bg-white border-blue-200 text-blue-700 hover:bg-blue-100 h-8 md:h-9 text-xs"
                        />
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                <NearbyProviders />

                {activeJobs.length > 0 ? (
                  activeJobs.map(job => (
                    <Card key={job.id} className="border-0 shadow-sm">
                      <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-base md:text-lg">{job.title}</h3>
                              {getStatusBadge(job.status)}
                            </div>
                            <p className="text-xs md:text-sm text-gray-600 flex items-center">
                              <MapPin className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 text-gray-400" /> {job.location}
                            </p>
                            <p className="text-xs md:text-sm text-gray-500 mt-1">
                              Posted on: {new Date(job.date).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                            <div className="text-center px-3 md:px-4 py-2 bg-gray-50 rounded-lg">
                              <p className="text-xs md:text-sm text-gray-600">Responses</p>
                              <p className="font-bold text-lg md:text-xl text-nearfix-600">{job.responses}</p>
                            </div>
                            
                            <Button variant="outline" size="sm" className="sm:self-center text-xs md:text-sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 md:py-10 lg:py-16 bg-white rounded-md">
                    <AlertCircle className="mx-auto mb-3 md:mb-4 h-8 w-8 md:h-12 md:w-12 text-gray-400" />
                    <h3 className="text-base md:text-lg font-medium text-gray-900 mb-1">No active jobs found</h3>
                    <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6 px-4">
                      You don't have any active job postings at the moment.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-2 md:gap-4 px-4">
                      <Button asChild className="bg-nearfix-600 hover:bg-nearfix-700 text-xs md:text-sm">
                        <Link to="/post-job">
                          <Plus className="mr-1 h-3 w-3 md:h-4 md:w-4" /> Post Your First Job
                        </Link>
                      </Button>
                      <Button asChild className="bg-nearfix-600 hover:bg-nearfix-700 text-xs md:text-sm">
                        <Link to="/become-seller">
                          <Store className="mr-1 h-3 w-3 md:h-4 md:w-4" /> Create Your Shop
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-4 md:space-y-6">
                {completedJobs.length > 0 ? (
                  completedJobs.map(job => (
                    <Card key={job.id} className="border-0 shadow-sm">
                      <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-base md:text-lg">{job.title}</h3>
                              {getStatusBadge(job.status)}
                            </div>
                            <p className="text-xs md:text-sm text-gray-600 flex items-center">
                              <MapPin className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 text-gray-400" /> {job.location}
                            </p>
                            <p className="text-xs md:text-sm text-gray-500 mt-1">
                              Completed on: {new Date(job.date).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 md:gap-3">
                            <Button variant="outline" size="sm" className="text-xs md:text-sm">
                              View Details
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs md:text-sm">
                              Leave Review
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 md:py-10 lg:py-16 bg-white rounded-md">
                    <CheckCircle className="mx-auto mb-3 md:mb-4 h-8 w-8 md:h-12 md:w-12 text-gray-400" />
                    <h3 className="text-base md:text-lg font-medium text-gray-900 mb-1">No completed jobs</h3>
                    <p className="text-xs md:text-sm text-gray-600">Your completed jobs will appear here.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="profile" className="bg-white p-4 md:p-6 rounded-md shadow-sm">
                <h2 className="font-medium text-lg md:text-xl mb-4 md:mb-6">Profile Settings</h2>
                <p className="text-xs md:text-sm text-gray-600 mb-4">
                  Manage your personal information, contact details, and preferences.
                </p>
                <div className="grid gap-4 md:gap-6 max-w-2xl">
                  <div>
                    <h3 className="font-medium text-sm md:text-base mb-1 md:mb-2">Personal Information</h3>
                    <p className="text-xs md:text-sm text-gray-500 mb-2 md:mb-3">Update your name, photo and personal details</p>
                    <Button variant="outline" size="sm" className="text-xs md:text-sm">
                      Edit Personal Info
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm md:text-base mb-1 md:mb-2">Contact Information</h3>
                    <p className="text-xs md:text-sm text-gray-500 mb-2 md:mb-3">Manage your contact details and notification preferences</p>
                    <Button variant="outline" size="sm" className="text-xs md:text-sm">
                      Edit Contact Info
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm md:text-base mb-1 md:mb-2">Security Settings</h3>
                    <p className="text-xs md:text-sm text-gray-500 mb-2 md:mb-3">Update your security preferences and account settings</p>
                    <Button variant="outline" size="sm" className="text-xs md:text-sm">
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
              <MapPin className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
              Enable location
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Dashboard;
