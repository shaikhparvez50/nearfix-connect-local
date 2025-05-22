
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PostJob from "./pages/PostJob";
import BecomeSeller from "./pages/BecomeSeller";
import SearchResults from "./pages/SearchResults";
import JobConfirmation from "./pages/JobConfirmation";
import SellerConfirmation from "./pages/SellerConfirmation";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Services from "./pages/Services";
import HowItWorks from "./pages/HowItWorks";
import Dashboard from "./pages/Dashboard";
import ProviderProfile from "./pages/ProviderProfile";
import JobDetails from "./pages/JobDetails";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useState } from "react";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <SidebarProvider>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <div className="flex-1">
                  <Toaster />
                  <Sonner />
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/provider/:id" element={<ProviderProfile />} />
                    <Route path="/job/:id" element={<JobDetails />} />
                    
                    {/* Protected routes */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="/post-job" element={<PostJob />} />
                      <Route path="/become-seller" element={<BecomeSeller />} />
                      <Route path="/job-confirmation" element={<JobConfirmation />} />
                      <Route path="/seller-confirmation" element={<SellerConfirmation />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                    </Route>
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </div>
            </SidebarProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
