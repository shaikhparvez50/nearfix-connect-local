
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { useState } from "react";

const App = () => {
  // Create a new QueryClient instance inside the component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/become-seller" element={<BecomeSeller />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/job-confirmation" element={<JobConfirmation />} />
            <Route path="/seller-confirmation" element={<SellerConfirmation />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/services" element={<Services />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
