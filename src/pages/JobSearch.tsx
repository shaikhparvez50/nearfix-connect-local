
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MapPin, Clock, DollarSign, MessageSquare, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Job = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: number;
  status: string;
  created_at: string;
  Phone_Number: string;
  email: string;
};

const JobSearch = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('job_postings')
        .select('*')
        .eq('status', 'open');

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }
      
      console.log('Fetched jobs:', data);
      // Convert Phone_Number to string if it's a number
      const typeSafeJobs = (data || []).map(job => ({
        ...job,
        Phone_Number: job.Phone_Number?.toString() || ''
      })) as Job[];
      
      setJobs(typeSafeJobs);
    } catch (error: any) {
      console.error('Error in fetchJobs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch jobs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleConnect = async (job: Job) => {
    setSelectedJob(job);
    setShowDetails(true);
  };

  const handleContact = (type: 'email' | 'phone') => {
    if (!selectedJob) return;

    if (type === 'email') {
      window.location.href = `mailto:${selectedJob.email}`;
    } else if (type === 'phone') {
      window.location.href = `tel:${selectedJob.Phone_Number}`;
    }
  };

  return (
    <MainLayout>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-heading text-3xl font-bold text-nearfix-900 mb-2">
                Find Jobs Near You
              </h1>
              <p className="text-gray-600">
                Browse and connect with service providers in your area
              </p>
            </div>

            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border rounded-md"
                  aria-label="Select job category"
                >
                  <option value="">All Categories</option>
                  <option value="fabrication">Fabrication</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical Work</option>
                  <option value="tuition">Tuition</option>
                  <option value="home-repair">Home Repair</option>
                  <option value="other">Other</option>
                </select>
                <Button type="submit" className="bg-nearfix-600 hover:bg-nearfix-700">
                  Search
                </Button>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full text-center">Loading...</div>
              ) : jobs.length === 0 ? (
                <div className="col-span-full text-center text-gray-600">
                  No jobs found matching your criteria
                </div>
              ) : (
                jobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{job.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(job.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm font-semibold text-nearfix-600">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {job.budget}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleConnect(job)}
                        className="w-full bg-nearfix-600 hover:bg-nearfix-700"
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <AlertDialog open={showDetails} onOpenChange={setShowDetails}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{selectedJob?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4">
                <p className="text-gray-600">{selectedJob?.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {selectedJob?.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Budget: ₹{selectedJob?.budget}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {selectedJob?.Phone_Number}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {selectedJob?.email}
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowDetails(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                onClick={() => handleContact('email')}
                className="flex-1 bg-nearfix-600 hover:bg-nearfix-700"
              >
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
              <Button 
                onClick={() => handleContact('phone')}
                className="flex-1 bg-nearfix-600 hover:bg-nearfix-700"
              >
                <Phone className="mr-2 h-4 w-4" />
                Call
              </Button>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default JobSearch;
