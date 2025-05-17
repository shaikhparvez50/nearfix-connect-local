
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Briefcase, Clock, MapPin, DollarSign, User, Phone, Mail, Send } from 'lucide-react';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    serviceType: '',
    description: '',
    address: '',
    city: '',
    pincode: '',
    timing: '',
    budgetRange: '',
    name: '',
    phone: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showAuthModal, setShowAuthModal } = useAuthCheck();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!user) {
        toast.error("You must be logged in to post a job");
        setShowAuthModal(true);
        setIsSubmitting(false);
        return;
      }

      // Fixed type issue: Convert phone to number if provided, otherwise set to null
      const phoneNumber = formData.phone ? parseFloat(formData.phone) : null;

      const data = {
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.serviceType,
        location: `${formData.address}, ${formData.city}, ${formData.pincode}`,
        budget: parseFloat(formData.budgetRange) || null,
        Phone_Number: phoneNumber,
        email: formData.email
      };

      const { error } = await supabase.from('job_postings').insert(data);

      if (error) throw error;

      // Success response handling
      toast.success("Job posted successfully");
      navigate('/job-confirmation');
    } catch (error) {
      console.error("Error posting job:", error);
      toast.error("Failed to post job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
          </DialogHeader>
          <p>You must sign in to post a job.</p>
        </DialogContent>
      </Dialog>

      <div className="w-full max-w-2xl">
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <div className="mx-auto text-center mb-2">
              <img
                className="h-14 w-auto"
                src="/placeholder.svg"
                alt="NearFix"
              />
            </div>
            <CardTitle className="text-3xl font-bold text-center">Post a Job</CardTitle>
            <CardDescription className="text-blue-100 text-center">
              Let us know what you need and we'll find the right professional for you
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="font-medium">Job Title</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      autoComplete="off"
                      required
                      className="pl-10"
                      placeholder="e.g. Fix leaking sink"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="serviceType" className="font-medium">Service Type</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, serviceType: value }))}>
                    <SelectTrigger className="w-full pl-10 relative">
                      <div className="absolute left-3 top-3">
                        <MapPin className="h-4 w-4 text-gray-400" />
                      </div>
                      <SelectValue placeholder="Select a service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Plumbing">Plumbing</SelectItem>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      <SelectItem value="Carpentry">Carpentry</SelectItem>
                      <SelectItem value="Painting">Painting</SelectItem>
                      <SelectItem value="Cleaning">Cleaning</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="font-medium">Job Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  className="resize-none"
                  placeholder="Please provide details about the job, requirements, and any specific instructions"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="address" className="font-medium">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      autoComplete="off"
                      required
                      className="pl-10"
                      placeholder="Street address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city" className="font-medium">City</Label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="off"
                    required
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="pincode" className="font-medium">Pincode</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    type="text"
                    autoComplete="off"
                    required
                    placeholder="Postal code"
                    value={formData.pincode}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timing" className="font-medium">Preferred Timing</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="timing"
                      name="timing"
                      type="text"
                      autoComplete="off"
                      className="pl-10"
                      placeholder="e.g. Weekdays after 5PM"
                      value={formData.timing}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budgetRange" className="font-medium">Budget Range</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="budgetRange"
                    name="budgetRange"
                    type="text"
                    autoComplete="off"
                    className="pl-10"
                    placeholder="Your budget for this job"
                    value={formData.budgetRange}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                <h3 className="text-lg font-medium text-blue-800">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-medium">Your Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="off"
                        className="pl-10"
                        placeholder="Full name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-medium">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        name="phone"
                        type="text"
                        autoComplete="off"
                        className="pl-10"
                        placeholder="Contact number"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="pl-10"
                      placeholder="Your email address"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              
              <CardFooter className="px-0 pt-4">
                <Button
                  type="submit"
                  className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Posting...' : 'Post Job'}
                  <Send className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostJob;
