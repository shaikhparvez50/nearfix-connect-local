
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const SellerConfirmation = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md w-full text-center p-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Application Submitted!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your service provider application has been submitted successfully. Our team will review your details and verify your account shortly.
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={() => navigate("/dashboard")}
              className="w-full bg-nearfix-600 hover:bg-nearfix-700"
            >
              Go to Dashboard
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SellerConfirmation;
