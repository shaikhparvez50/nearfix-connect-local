
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster as HotToaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PostJob from "./pages/PostJob";
import BecomeSeller from "./pages/BecomeSeller";
import SearchResults from "./pages/SearchResults";
import JobConfirmation from "./pages/JobConfirmation";
import SellerConfirmation from "./pages/SellerConfirmation";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Services from "./pages/Services";
import HowItWorks from "./pages/HowItWorks";
import Dashboard from "./pages/Dashboard";
import SearchServices from "./pages/SearchServices";
import JobSearch from "./pages/JobSearch";
import { useState } from "react";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <HotToaster />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicRoute><Index /></PublicRoute>} />
              <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
              <Route path="/about" element={<PublicRoute><AboutUs /></PublicRoute>} />
              <Route path="/contact" element={<PublicRoute><ContactUs /></PublicRoute>} />
              <Route path="/services" element={<PublicRoute><Services /></PublicRoute>} />
              <Route path="/how-it-works" element={<PublicRoute><HowItWorks /></PublicRoute>} />
              
              {/* Protected Routes - Require authentication and registration */}
              <Route path="/post-job" element={
                <ProtectedRoute>
                  <PostJob />
                </ProtectedRoute>
              } />
              <Route path="/become-seller" element={
                <ProtectedRoute>
                  <BecomeSeller />
                </ProtectedRoute>
              } />
              <Route path="/search" element={
                <ProtectedRoute>
                  <SearchResults />
                </ProtectedRoute>
              } />
              <Route path="/job-confirmation" element={
                <ProtectedRoute>
                  <JobConfirmation />
                </ProtectedRoute>
              } />
              <Route path="/seller-confirmation" element={
                <ProtectedRoute>
                  <SellerConfirmation />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/search-services" element={
                <ProtectedRoute>
                  <SearchServices />
                </ProtectedRoute>
              } />
              <Route path="/job-search" element={
                <ProtectedRoute>
                  <JobSearch />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
