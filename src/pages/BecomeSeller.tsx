
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { SellerRegistration } from "@/components/SellerRegistration";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BadgeCheck,
  Calendar,
  MapPin,
  Shield,
} from "lucide-react";

const BecomeSeller = () => {
  const [step, setStep] = useState(1);
  
  const benefits = [
    {
      icon: <MapPin className="h-5 w-5 text-nearfix-600" />,
      title: "Get Local Jobs",
      description: "Connect with customers in your area looking for your services"
    },
    {
      icon: <BadgeCheck className="h-5 w-5 text-nearfix-600" />,
      title: "Zero Commission",
      description: "Keep 100% of your earnings with no platform fees"
    },
    {
      icon: <Calendar className="h-5 w-5 text-nearfix-600" />,
      title: "Flexible Schedule",
      description: "Work when you want, manage your own availability"
    },
    {
      icon: <Shield className="h-5 w-5 text-nearfix-600" />,
      title: "Verified Status",
      description: "Build trust with customers through our verification process"
    }
  ];

  return (
    <MainLayout>
      <section className="py-12 bg-gradient-to-br from-nearfix-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-heading text-3xl font-bold text-nearfix-900 mb-2">
                Become a Service Provider
              </h1>
              <p className="text-gray-600">
                Join NearFix to connect with customers looking for your skills
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 p-4">
                  <div className="p-2 bg-nearfix-50 rounded-full">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-nearfix-50 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>Seller Registration</CardTitle>
                  <div className="text-sm text-gray-500">Step {step} of 3</div>
                </div>
                <CardDescription>
                  {step === 1 && "Basic information"}
                  {step === 2 && "Service details and experience"}
                  {step === 3 && "Verification and contact information"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                <SellerRegistration step={step} setStep={setStep} />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default BecomeSeller;
