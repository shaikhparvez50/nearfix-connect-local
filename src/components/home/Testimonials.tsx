
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialProps {
  quote: string;
  name: string;
  role: string;
  rating: number;
  avatar: string;
}

const Testimonial = ({ quote, name, role, rating, avatar }: TestimonialProps) => {
  return (
    <Card className="bg-white border-0 shadow-sm hover:shadow transition-shadow">
      <CardContent className="p-6">
        <div className="flex mb-4">
          {Array(5).fill(0).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <p className="text-gray-700 mb-6 italic">"{quote}"</p>
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="bg-nearfix-100 text-nearfix-700">
              {name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium text-gray-900">{name}</h4>
            <p className="text-sm text-gray-500">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      quote: "I found an amazing electrician within minutes. The service was fast and the work quality was excellent!",
      name: "Raj Sharma",
      role: "Homeowner",
      rating: 5,
      avatar: "/placeholder.svg"
    },
    {
      quote: "As a plumber, NearFix helped me connect with clients in my neighborhood without charging any commission.",
      name: "Anjali Patel",
      role: "Professional Plumber",
      rating: 5,
      avatar: "/placeholder.svg"
    },
    {
      quote: "I needed urgent fabrication work for my shop. NearFix connected me with a professional who delivered quality work on time.",
      name: "Suresh Kumar",
      role: "Shop Owner",
      rating: 4,
      avatar: "/placeholder.svg"
    }
  ];

  return (
    <section className="py-16 bg-nearfix-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-nearfix-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real experiences from customers and service providers who use NearFix
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              name={testimonial.name}
              role={testimonial.role}
              rating={testimonial.rating}
              avatar={testimonial.avatar}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
