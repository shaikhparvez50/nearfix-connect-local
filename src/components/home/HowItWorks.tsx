
import { Check } from "lucide-react";

const StepCard = ({ 
  number, 
  title, 
  description, 
  features
}: { 
  number: string; 
  title: string; 
  description: string;
  features: string[];
}) => {
  return (
    <div className="relative bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-nearfix-600 text-white flex items-center justify-center font-heading font-bold text-xl">
        {number}
      </div>
      <div className="pt-6">
        <h3 className="font-heading text-xl font-semibold text-nearfix-800 mb-3">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-nearfix-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Describe Your Needs",
      description: "Tell us what service you're looking for in your local area.",
      features: [
        "Select service category",
        "Specify your location",
        "Add job details and requirements",
        "Upload photos if needed"
      ]
    },
    {
      number: "2",
      title: "Connect with Providers",
      description: "Browse and connect with verified local professionals.",
      features: [
        "View provider profiles and portfolios",
        "Check availability calendars",
        "Read authentic customer reviews",
        "Contact providers directly"
      ]
    },
    {
      number: "3",
      title: "Get the Job Done",
      description: "Meet, discuss, and complete the work offline.",
      features: [
        "No platform fees or commissions",
        "Direct communication with providers",
        "In-person service delivery",
        "Pay providers directly"
      ]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-nearfix-900 mb-4">
            How NearFix Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A simple, transparent process to connect you with trusted local service providers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {steps.map((step) => (
            <StepCard
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              features={step.features}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
