
// pages/PostJob.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { JobPostingType } from '../types/types';
import MainLayout from '@/components/layout/MainLayout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Upload, MapPin, Calendar, ArrowRight, Info } from 'lucide-react';

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<JobPostingType>>({
    title: '',
    description: '',
    category: '',
    location: '',
    user_id: '',
    budget: 0,
    status: 'open',
  });
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setFormData((prev) => ({ ...prev, user_id: user.id }));
      } else {
        setMessage('⚠️ Please log in to post a job.');
      }
    };
    getUser();
  }, []);

  const nextStep = () => {
    if (step === 1) {
      if (!formData.title || !formData.category || !formData.description) {
        setMessage('❌ Please fill in all required fields before continuing.');
        return;
      }
    }
    if (step === 2) {
      if (!formData.location || formData.budget === null || formData.budget <= 0) {
        setMessage('❌ Please enter location and valid budget before continuing.');
        return;
      }
    }
    setMessage('');
    setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'budget' ? Number(value) || null : value,
    }));
    setMessage('');
  };

  const handleSelectChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const timestamp = new Date().toISOString();

    const { error } = await supabase.from('job_postings').insert([
      {
        ...formData,
        created_at: timestamp,
        updated_at: timestamp,
      },
    ]);

    if (error) {
      setMessage(`❌ Error: ${error.message}`);
    } else {
      navigate('/job-confirmation');
    }

    setLoading(false);
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
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="E.g., Electrical wiring repair needed"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Service Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleSelectChange('category', value)}
                          required
                        >
                          <SelectTrigger id="category">
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
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Describe the job in detail..."
                          rows={5}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <div className="relative">
                          <Input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Enter your address"
                            className="pl-10"
                            required
                          />
                          <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget (₹)</Label>
                        <Input
                          id="budget"
                          name="budget"
                          value={formData.budget ?? ''}
                          onChange={handleChange}
                          placeholder="e.g., 2500"
                          type="number"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <p className="text-sm text-gray-600">
                        Your contact info is already linked to your NearFix account.
                      </p>
                      <div className="flex items-start space-x-2">
                        <Info className="h-5 w-5 text-nearfix-600 mt-0.5" />
                        <p className="text-sm text-gray-600">
                          Your contact information will only be shared with service providers who respond to your job post.
                        </p>
                      </div>

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
                  )}

                  <div className="flex justify-between mt-8">
                    {step > 1 ? (
                      <Button type="button" variant="outline" onClick={prevStep}>
                        Back
                      </Button>
                    ) : <div />}
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
                        disabled={loading}
                        className={`bg-nearfix-600 hover:bg-nearfix-700 text-white px-6 py-2 rounded-md transition-all duration-300 ${
                          loading ? 'opacity-70 cursor-not-allowed scale-95' : 'hover:scale-105'
                        }`}
                      >
                        {loading ? 'Posting...' : 'Post Job'}
                      </Button>
                    )}
                  </div>
                </form>
                {message && <p className="text-sm mt-4 text-center text-red-600">{message}</p>}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default PostJob;
