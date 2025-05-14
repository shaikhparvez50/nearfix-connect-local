import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TablesInsert } from "@/integrations/supabase/types";

// Update the form interface to match the database schema
interface JobPostingForm extends Omit<TablesInsert<'job_postings'>, 'Phone_Number'> {
  Phone_Number?: string; // Set this as string for the form, will convert to number when submitting
}

const PostJob = () => {
  const [formValues, setFormValues] = useState<JobPostingForm>({
    title: '',
    description: '',
    category: '',
    location: '',
    budget: 0,
    Phone_Number: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormValues(prevValues => ({
      ...prevValues,
      category: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare form data, converting Phone_Number to number if provided
      const formData: TablesInsert<'job_postings'> = {
        ...formValues,
        user_id: user?.id || '',
        // Convert Phone_Number to number if it exists and is not empty
        Phone_Number: formValues.Phone_Number ? Number(formValues.Phone_Number) : undefined,
      };

      const { error } = await supabase
        .from('job_postings')
        .insert(formData);

      if (error) throw error;

      toast.success("Job posted successfully");
      navigate('/job-confirmation');
    } catch (error: any) {
      toast.error(error.message || "Failed to post job");
      console.error("Error posting job:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-8">
              <h2 className="font-bold text-2xl text-gray-800 mb-8">Post a New Job</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</Label>
                  <div className="mt-1">
                    <Input
                      type="text"
                      id="title"
                      name="title"
                      value={formValues.title}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-nearfix-500 focus:border-nearfix-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description" className="block text-sm font-medium text-gray-700">Job Description</Label>
                  <div className="mt-1">
                    <Textarea
                      id="description"
                      name="description"
                      value={formValues.description}
                      onChange={handleChange}
                      rows={4}
                      className="shadow-sm focus:ring-nearfix-500 focus:border-nearfix-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</Label>
                  <div className="mt-1">
                    <Select onValueChange={handleSelectChange}>
                      <SelectTrigger className="w-full text-left shadow-sm focus:ring-nearfix-500 focus:border-nearfix-500 block w-full sm:text-sm border-gray-300 rounded-md">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Plumbing">Plumbing</SelectItem>
                        <SelectItem value="Electrical">Electrical</SelectItem>
                        <SelectItem value="Home Repair">Home Repair</SelectItem>
                        <SelectItem value="Cleaning">Cleaning</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</Label>
                  <div className="mt-1">
                    <Input
                      type="text"
                      id="location"
                      name="location"
                      value={formValues.location}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-nearfix-500 focus:border-nearfix-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget</Label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                      <span className="text-gray-500 sm:text-sm">₹</span>
                    </div>
                    <Input
                      type="number"
                      id="budget"
                      name="budget"
                      value={formValues.budget}
                      onChange={handleChange}
                      className="focus:ring-nearfix-500 focus:border-nearfix-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">INR</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="Phone_Number" className="block text-sm font-medium text-gray-700">Phone Number</Label>
                  <div className="mt-1">
                    <Input
                      type="tel"
                      id="Phone_Number"
                      name="Phone_Number"
                      value={formValues.Phone_Number}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-nearfix-500 focus:border-nearfix-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</Label>
                  <div className="mt-1">
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formValues.email}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-nearfix-500 focus:border-nearfix-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <Button type="submit" disabled={isSubmitting} className="w-full bg-nearfix-600 hover:bg-nearfix-700">
                    {isSubmitting ? 'Posting...' : 'Post Job'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default PostJob;
