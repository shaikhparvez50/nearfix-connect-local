
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MapPin, Calendar, User, CheckCircle, MessageCircle } from "lucide-react";

const HowItWorks = () => {
  const customerSteps = [
    {
      icon: <MapPin className="h-12 w-12 text-nearfix-600" />,
      title: "Share Your Location",
      description: "Enable location services or enter your address to find local service providers in your area."
    },
    {
      icon: <Calendar className="h-12 w-12 text-nearfix-600" />,
      title: "Post Your Job",
      description: "Describe what you need, when you need it, and set your budget range."
    },
    {
      icon: <User className="h-12 w-12 text-nearfix-600" />,
      title: "Connect with Providers",
      description: "Review matched service providers or wait for them to contact you directly."
    },
    {
      icon: <MessageCircle className="h-12 w-12 text-nearfix-600" />,
      title: "Communicate Directly",
      description: "Discuss details, pricing, and schedule directly with service providers."
    },
    {
      icon: <CheckCircle className="h-12 w-12 text-nearfix-600" />,
      title: "Get the Job Done",
      description: "Meet the provider in person and get your job completed to satisfaction."
    }
  ];

  const sellerSteps = [
    {
      title: "Create Your Profile",
      description: "Sign up as a service provider and create a detailed profile with your skills and experience."
    },
    {
      title: "Set Your Service Area",
      description: "Define your service radius to only get job requests from your preferred locations."
    },
    {
      title: "Mark Your Availability",
      description: "Set up your availability calendar so customers know when you're free to work."
    },
    {
      title: "Receive Job Notifications",
      description: "Get notifications for new jobs posted in your area that match your skills."
    },
    {
      title: "Connect With Customers",
      description: "Respond to job requests, communicate directly, and arrange services offline."
    }
  ];

  const faqs = [
    {
      question: "How does NearFix work?",
      answer: "NearFix connects you with verified local service providers based on your location, the type of service you need, and availability. You can post a job or browse through service providers, contact them directly, and arrange services offline."
    },
    {
      question: "Does NearFix charge any fees?",
      answer: "No, NearFix does not charge any commission or fees to either buyers or sellers. The platform is completely free to use for connecting service providers with customers."
    },
    {
      question: "How are service providers verified?",
      answer: "All service providers on NearFix go through a verification process that includes ID verification, skill assessment, and background checks to ensure safety and quality of service."
    },
    {
      question: "How are payments handled?",
      answer: "NearFix does not handle payments between customers and service providers. All payment arrangements are made directly between the two parties offline."
    },
    {
      question: "Can I leave reviews for service providers?",
      answer: "Yes, after a service is completed, you can leave ratings and reviews for service providers to help others make informed decisions."
    }
  ];

  return (
    <MainLayout>
      <section className="py-16 bg-gradient-to-br from-nearfix-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="font-heading text-3xl font-bold text-nearfix-900 mb-4">
              How NearFix Works
            </h1>
            <p className="text-lg text-gray-600">
              Simple steps to connect local service needs with trusted professionals
            </p>
          </div>
          
          {/* For Customers */}
          <div className="max-w-5xl mx-auto mb-20">
            <h2 className="text-2xl font-semibold text-center mb-10">For Customers</h2>
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-nearfix-100 hidden md:block" />
              
              <div className="space-y-16">
                {customerSteps.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="flex flex-col md:flex-row items-center">
                      <div className="md:w-1/2 flex justify-end pr-0 md:pr-10 mb-6 md:mb-0">
                        {index % 2 === 0 ? (
                          <div className="text-center md:text-right">
                            <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                            <p className="text-gray-600">{step.description}</p>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white border border-nearfix-100 shadow-sm z-10">
                            {step.icon}
                          </div>
                        )}
                      </div>
                      
                      <div className="md:w-1/2 flex justify-start pl-0 md:pl-10">
                        {index % 2 === 0 ? (
                          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white border border-nearfix-100 shadow-sm z-10">
                            {step.icon}
                          </div>
                        ) : (
                          <div className="text-center md:text-left">
                            <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                            <p className="text-gray-600">{step.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Link to="/post-job">
                <Button size="lg" className="bg-nearfix-600 hover:bg-nearfix-700">
                  Post a Job Now
                </Button>
              </Link>
            </div>
          </div>
          
          {/* For Sellers */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-2xl font-semibold text-center mb-10">For Service Providers</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {sellerSteps.map((step, index) => (
                <Card key={index} className="border-0 shadow-sm">
                  <CardContent className="p-6 text-center">
                    <div className="w-10 h-10 rounded-full bg-nearfix-50 text-nearfix-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                      {index + 1}
                    </div>
                    <h3 className="font-medium mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/become-seller">
                <Button size="lg" className="bg-nearfix-600 hover:bg-nearfix-700">
                  Become a Service Provider
                </Button>
              </Link>
            </div>
          </div>
          
          {/* FAQs */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HowItWorks;
