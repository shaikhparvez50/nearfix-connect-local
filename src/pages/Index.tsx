
import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/home/HeroSection";
import ServicesGrid from "@/components/home/ServicesGrid";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Map, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: <Map className="h-6 w-6 text-nearfix-600" />,
      title: "Location-Based",
      description: "Find trusted service providers in your local area"
    },
    {
      icon: <Clock className="h-6 w-6 text-nearfix-600" />,
      title: "Availability Matching",
      description: "Connect based on when you both are free"
    },
    {
      icon: <Shield className="h-6 w-6 text-nearfix-600" />,
      title: "Verified Providers",
      description: "All service providers are verified for your safety"
    }
  ];

  return (
    <MainLayout>
      <HeroSection />
      
      <ServicesGrid />
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6">
                <div className="p-3 rounded-full bg-nearfix-50 mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-heading font-medium text-lg text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <HowItWorks />
      
      <Testimonials />
      
      {/* CTA Section */}
      <section className="py-16 bg-nearfix-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold mb-6">
            Ready to Find Local Service Providers?
          </h2>
          <p className="text-lg text-nearfix-100 mb-8 max-w-2xl mx-auto">
            Join NearFix today and connect with trusted professionals in your area
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              asChild
              size="lg" 
              className="bg-white text-nearfix-800 hover:bg-gray-100"
            >
              <Link to="/post-job">
                Post a Job <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              asChild
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-nearfix-700"
            >
              <Link to="/become-seller">
                Become a Seller
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
