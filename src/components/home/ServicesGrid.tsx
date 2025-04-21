
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Wrench, Zap, Droplet, School, Home, Briefcase } from 'lucide-react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  className?: string;
}

const ServiceCard = ({ icon, title, description, href, className }: ServiceCardProps) => (
  <Link
    to={href}
    className={cn(
      "flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 text-center group",
      className
    )}
  >
    <div className="p-3 rounded-full bg-nearfix-50 text-nearfix-600 mb-4 group-hover:bg-nearfix-100 transition-colors">
      {icon}
    </div>
    <h3 className="font-heading font-medium text-lg text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
  </Link>
);

const ServicesGrid = () => {
  const services = [
    {
      icon: <Wrench className="h-6 w-6" />,
      title: "Fabrication",
      description: "Custom metal work, welding, and structural fabrication services",
      href: "/search?service=fabrication",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Electrical",
      description: "Wiring, fixtures, repairs, and electrical installations",
      href: "/search?service=electrical",
    },
    {
      icon: <Droplet className="h-6 w-6" />,
      title: "Plumbing",
      description: "Pipe repairs, installations, and maintenance services",
      href: "/search?service=plumbing",
    },
    {
      icon: <School className="h-6 w-6" />,
      title: "Tuition",
      description: "Private tutoring for all subjects and grade levels",
      href: "/search?service=tuition",
    },
    {
      icon: <Home className="h-6 w-6" />,
      title: "Home Repair",
      description: "General repairs, maintenance, and home improvement",
      href: "/search?service=home-repair",
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "More Services",
      description: "Explore all the other professional services available",
      href: "/services",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-nearfix-900 mb-4">
            Popular Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover skilled professionals in your area offering a wide range of services
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
              href={service.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
