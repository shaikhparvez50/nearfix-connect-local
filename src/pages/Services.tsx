
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Services = () => {
  const serviceCategories = [
    {
      name: "Fabrication",
      description: "Custom metal works, welding, and structural fabrication services for residential and commercial needs.",
      image: "/placeholder.svg",
      popular: true
    },
    {
      name: "Plumbing",
      description: "Installation, repair, and maintenance services for all types of plumbing systems and fixtures.",
      image: "/placeholder.svg",
      popular: true
    },
    {
      name: "Electrical Work",
      description: "Professional electrical services including installation, repair, and maintenance of electrical systems.",
      image: "/placeholder.svg",
      popular: true
    },
    {
      name: "Tuition",
      description: "Private academic tutoring for students of all ages and educational levels.",
      image: "/placeholder.svg",
      popular: false
    },
    {
      name: "Home Repair",
      description: "General home maintenance and repair services for all your household needs.",
      image: "/placeholder.svg",
      popular: true
    },
    {
      name: "Carpentry",
      description: "Custom woodworking, furniture making, and carpentry services by skilled craftspeople.",
      image: "/placeholder.svg",
      popular: false
    },
    {
      name: "Painting",
      description: "Interior and exterior painting services for homes and commercial properties.",
      image: "/placeholder.svg",
      popular: false
    },
    {
      name: "House Cleaning",
      description: "Professional cleaning services for homes and apartments, regular or one-time cleaning.",
      image: "/placeholder.svg",
      popular: false
    },
    {
      name: "Appliance Repair",
      description: "Repair and maintenance services for household appliances like refrigerators, washing machines, etc.",
      image: "/placeholder.svg",
      popular: false
    },
  ];

  return (
    <MainLayout>
      <section className="py-16 bg-gradient-to-br from-nearfix-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="font-heading text-3xl font-bold text-nearfix-900 mb-4">
              Our Services
            </h1>
            <p className="text-lg text-gray-600">
              Connect with trusted local professionals for all your service needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {serviceCategories.map((service, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-md transition-all hover:shadow-lg">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                    {service.popular && (
                      <span className="bg-nearfix-100 text-nearfix-600 text-xs px-2 py-1 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="px-6 pb-6 pt-0">
                  <Link to={`/search?service=${service.name.toLowerCase()}`} className="w-full">
                    <Button className="w-full bg-nearfix-600 hover:bg-nearfix-700">
                      Find Providers <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="max-w-3xl mx-auto mt-16 text-center">
            <h2 className="text-2xl font-semibold mb-6">Need Something Specific?</h2>
            <p className="text-gray-600 mb-8">
              Don't see the service you're looking for? Post a job and describe exactly what you need.
            </p>
            <Link to="/post-job">
              <Button size="lg" className="bg-nearfix-600 hover:bg-nearfix-700">
                Post a Job
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Services;
