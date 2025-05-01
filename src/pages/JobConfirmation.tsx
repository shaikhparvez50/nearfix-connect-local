
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const JobConfirmation = () => {
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
            Job Posted Successfully!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your job has been posted successfully. Local service providers will be notified and you'll be contacted soon.
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={() => navigate("/dashboard")}
              className="w-full bg-nearfix-600 hover:bg-nearfix-700"
            >
              Go to Dashboard
            </Button>
            
           
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobConfirmation;
