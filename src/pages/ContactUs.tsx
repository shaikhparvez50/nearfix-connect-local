
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ContactUs = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would submit the form data to a backend
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
  };
  
  return (
    <MainLayout>
      <section className="py-16 bg-gradient-to-br from-nearfix-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="font-heading text-3xl font-bold text-nearfix-900 mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600">
              Have questions or feedback? We'd love to hear from you!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-nearfix-50 flex items-center justify-center mb-4">
                  <Phone className="h-5 w-5 text-nearfix-600" />
                </div>
                <h3 className="font-medium text-lg mb-2">Phone</h3>
                <p className="text-gray-600 mb-2">Give us a call</p>
                <a href="tel:+917350167713" className="text-nearfix-600 font-medium hover:underline">
                  +91 7350167713
                </a>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-nearfix-50 flex items-center justify-center mb-4">
                  <Mail className="h-5 w-5 text-nearfix-600" />
                </div>
                <h3 className="font-medium text-lg mb-2">Email</h3>
                <p className="text-gray-600 mb-2">Send us a message</p>
                <a href="mailto:shaikhparbej50@gmail.com" className="text-nearfix-600 font-medium hover:underline break-all">
                  shaikhparbej50@gmail.com
                </a>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-nearfix-50 flex items-center justify-center mb-4">
                  <MapPin className="h-5 w-5 text-nearfix-600" />
                </div>
                <h3 className="font-medium text-lg mb-2">Office</h3>
                <p className="text-gray-600 mb-2">Visit our location</p>
                <address className="not-italic text-nearfix-600 font-medium">
                  NearFix Headquarters, Mumbai
                </address>
              </CardContent>
            </Card>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Card className="border-0 shadow-md">
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold mb-6 text-center">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Your name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="Your email" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="What is this regarding?" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us how we can help..." 
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="text-center">
                    <Button type="submit" className="bg-nearfix-600 hover:bg-nearfix-700">
                      Send Message <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ContactUs;
