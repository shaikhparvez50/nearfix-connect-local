
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Upload, Info, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PostJob = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the job post
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

  return (
    <MainLayout>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-heading text-3xl font-bold text-nearfix-900 mb-2">
                Post a Job
              </h1>
              <p className="text-gray-600">
                Fill in the details below to find the right service provider for your needs
              </p>
            </div>
            
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-nearfix-50 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>Job Details</CardTitle>
                  <div className="text-sm text-gray-500">Step {step} of 3</div>
                </div>
                <CardDescription>
                  {step === 1 && "Tell us what you need"}
                  {step === 2 && "Location and scheduling"}
                  {step === 3 && "Contact information"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title</Label>
                        <Input 
                          id="title" 
                          placeholder="E.g., Electrical wiring repair needed" 
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="service-type">Service Category</Label>
                        <Select required>
                          <SelectTrigger id="service-type">
                            <SelectValue placeholder="Select the type of service" />
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
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Job Description</Label>
                        <Textarea 
                          id="description" 
                          placeholder="Describe the job in detail. What needs to be done? What materials are needed? Any specific requirements?" 
                          rows={5}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Attach Photos (Optional)</Label>
                        <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            Drag & drop files here or click to browse
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Max 5 images, 5MB each (JPG, PNG)
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
                  
                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <div className="relative">
                          <Input 
                            id="address" 
                            placeholder="Enter your address" 
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
                        <Label htmlFor="timing">Preferred Timing</Label>
                        <div className="relative">
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="When do you need this service?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="asap">As soon as possible</SelectItem>
                              <SelectItem value="this-week">This week</SelectItem>
                              <SelectItem value="next-week">Next week</SelectItem>
                              <SelectItem value="flexible">Flexible / Not urgent</SelectItem>
                            </SelectContent>
                          </Select>
                          <Calendar className="absolute right-10 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="budgetRange">Budget Range (Optional)</Label>
                        <Select>
                          <SelectTrigger id="budgetRange">
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-1000">Under ₹1,000</SelectItem>
                            <SelectItem value="1000-5000">₹1,000 - ₹5,000</SelectItem>
                            <SelectItem value="5000-10000">₹5,000 - ₹10,000</SelectItem>
                            <SelectItem value="10000-plus">₹10,000+</SelectItem>
                            <SelectItem value="negotiable">Negotiable</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  
                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" placeholder="Your name" required />
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
                      
                      <div className="flex items-start space-x-2 mt-4">
                        <Info className="h-5 w-5 text-nearfix-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-600">
                          Your contact information will only be shared with service providers who respond to your job post. We value your privacy.
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
                        Post Job
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

export default PostJob;
