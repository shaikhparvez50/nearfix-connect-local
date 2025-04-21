
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Upload,
  Shield,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BecomeSeller = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the seller registration
    navigate("/confirmation");
  };
  
  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };
  
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
                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="seller-type">Seller Type</Label>
                        <Select required>
                          <SelectTrigger id="seller-type">
                            <SelectValue placeholder="Select your seller type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">Individual Professional</SelectItem>
                            <SelectItem value="company">Company/Small Business</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name/Business Name</Label>
                          <Input id="name" placeholder="Your name or business name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input 
                            id="phone" 
                            placeholder="Your phone number" 
                            type="tel"
                            required 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          placeholder="Your email address" 
                          type="email"
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="profile-photo">Profile Photo</Label>
                        <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            Upload a clear profile photo or business logo
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            JPG or PNG format, max 5MB
                          </p>
                          <Input 
                            id="profile-photo"
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="service-categories">Service Categories</Label>
                        <Select required>
                          <SelectTrigger id="service-categories">
                            <SelectValue placeholder="Select primary service category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fabrication">Fabrication</SelectItem>
                            <SelectItem value="plumbing">Plumbing</SelectItem>
                            <SelectItem value="electrical">Electrical Work</SelectItem>
                            <SelectItem value="tuition">Tuition</SelectItem>
                            <SelectItem value="home-repair">Home Repair</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500 mt-1">You can add more services later</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="experience">Years of Experience</Label>
                        <Select required>
                          <SelectTrigger id="experience">
                            <SelectValue placeholder="Select years of experience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-2">1-2 years</SelectItem>
                            <SelectItem value="3-5">3-5 years</SelectItem>
                            <SelectItem value="5-10">5-10 years</SelectItem>
                            <SelectItem value="10+">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Service Description</Label>
                        <Textarea 
                          id="description" 
                          placeholder="Describe your services, expertise, and what makes you stand out" 
                          rows={4}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Work Samples (Optional)</Label>
                        <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            Upload photos of your previous work
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Up to 10 images (JPG, PNG), 5MB each
                          </p>
                          <Input 
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            multiple 
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="address">Service Area Address</Label>
                        <div className="relative">
                          <Input 
                            id="address" 
                            placeholder="Your business address or service area" 
                            className="pl-10"
                            required
                          />
                          <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" placeholder="City" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pincode">PIN Code</Label>
                          <Input id="pincode" placeholder="PIN Code" required />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="service-radius">Service Radius</Label>
                        <Select required>
                          <SelectTrigger id="service-radius">
                            <SelectValue placeholder="How far will you travel for service?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">Up to 5 km</SelectItem>
                            <SelectItem value="10">Up to 10 km</SelectItem>
                            <SelectItem value="15">Up to 15 km</SelectItem>
                            <SelectItem value="20">Up to 20 km</SelectItem>
                            <SelectItem value="25+">25+ km</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="id-proof">ID Verification</Label>
                        <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            Upload a government-issued ID for verification
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Aadhaar Card, PAN Card, or Business Registration
                          </p>
                          <Input 
                            id="id-proof"
                            type="file" 
                            className="hidden" 
                            accept="image/*, application/pdf" 
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-500 flex items-center mt-2">
                          <Shield className="h-3 w-3 mr-1 text-nearfix-600" />
                          Your documents are securely stored and only used for verification
                        </p>
                      </div>
                      
                      <div className="border-t border-gray-200 mt-6 pt-6">
                        <div className="flex items-start gap-2">
                          <input 
                            type="checkbox" 
                            id="terms" 
                            className="mt-1"
                            required
                          />
                          <Label htmlFor="terms" className="text-sm font-normal">
                            I agree to NearFix's <a href="/terms" className="text-nearfix-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-nearfix-600 hover:underline">Privacy Policy</a>
                          </Label>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between mt-8">
                    {step > 1 ? (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={prevStep}
                      >
                        Back
                      </Button>
                    ) : (
                      <div />
                    )}
                    
                    {step < 3 ? (
                      <Button 
                        type="button" 
                        onClick={nextStep}
                        className="bg-nearfix-600 hover:bg-nearfix-700"
                      >
                        Next Step <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        type="submit"
                        className="bg-nearfix-600 hover:bg-nearfix-700"
                      >
                        Submit Application <CheckCircle className="ml-2 h-4 w-4" />
                      </Button>
                    )}
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

export default BecomeSeller;
