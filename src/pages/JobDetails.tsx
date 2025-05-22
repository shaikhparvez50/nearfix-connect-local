import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { JobPostingType } from '@/types/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Phone, Calendar, MapPin, Clock, DollarSign, UserCircle2, Camera, Mail } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobPostingType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        const { data: jobData, error: jobError } = await supabase
          .from('job_postings')
          .select('*')
          .eq('id', id)
          .single();

        if (jobError) {
          throw new Error(jobError.message);
        }

        if (jobData) {
          // Transform data to match JobPostingType
          const formattedJob: JobPostingType = {
            id: jobData.id,
            title: jobData.title,
            description: jobData.description,
            category: jobData.category,
            location: jobData.location,
            budget: jobData.budget || 0,
            created_at: jobData.created_at,
            status: jobData.status,
            user_id: jobData.user_id,
            skills_required: jobData.skills_required || [],
            images: jobData.images || [],
            contact_email: jobData.contact_email || jobData.email || "",
            contact_phone: jobData.contact_phone ? String(jobData.contact_phone) : 
                          jobData.Phone_Number ? String(jobData.Phone_Number) : "",
            duration: jobData.duration || "",
            preferred_time: jobData.preferred_time || ""
          };

          setJob(formattedJob);
        }
      } catch (err: any) {
        console.error('Error fetching job details:', err);
        setError(err.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const handleCall = () => {
    if (job?.contact_phone) {
      window.location.href = `tel:${job.contact_phone}`;
    }
  };

  const handleEmail = () => {
    if (job?.contact_email) {
      window.location.href = `mailto:${job.contact_email}`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-4 w-40 mb-6" />
            <Skeleton className="h-64 w-full rounded-lg mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !job) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Job not found'}</p>
          <Link to="/search">
            <Button>Back to Search</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden mb-6">
            <CardContent className="p-0">
              {job.images && job.images.length > 0 ? (
                <div className="aspect-video bg-gray-100 relative">
                  <img 
                    src={job.images[0]} 
                    alt={job.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <Camera className="h-12 w-12 text-gray-300" />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Posted on {formatDate(job.created_at)}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </span>
                      <Badge variant="outline" className="bg-nearfix-50 text-nearfix-600 border-none">
                        {job.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-nearfix-600">₹{job.budget}</div>
                    <span className="text-sm text-gray-500">
                      {job.duration ? job.duration : 'Budget estimate'}
                    </span>
                  </div>
                </div>
                
                <div className="border-t border-b border-gray-200 py-4 my-4">
                  <h2 className="font-semibold text-lg mb-2">Job Description</h2>
                  <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {job.preferred_time && (
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-nearfix-500 mt-0.5 flex-shrink-0" />
                      <div className="ml-2">
                        <h3 className="font-medium text-sm">Preferred Time</h3>
                        <p className="text-gray-700">{job.preferred_time}</p>
                      </div>
                    </div>
                  )}
                  
                  {job.duration && (
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-nearfix-500 mt-0.5 flex-shrink-0" />
                      <div className="ml-2">
                        <h3 className="font-medium text-sm">Duration</h3>
                        <p className="text-gray-700">{job.duration}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start">
                    <DollarSign className="h-5 w-5 text-nearfix-500 mt-0.5 flex-shrink-0" />
                    <div className="ml-2">
                      <h3 className="font-medium text-sm">Budget</h3>
                      <p className="text-gray-700">₹{job.budget}</p>
                    </div>
                  </div>
                </div>
                
                {job.skills_required && job.skills_required.length > 0 && (
                  <div className="mb-6">
                    <h2 className="font-semibold text-lg mb-2">Skills Required</h2>
                    <div className="flex flex-wrap gap-2">
                      {job.skills_required.map((skill, idx) => (
                        <Badge 
                          key={idx}
                          variant="outline" 
                          className="bg-gray-50"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {job.images && job.images.length > 1 && (
                  <div className="mb-6">
                    <h2 className="font-semibold text-lg mb-3">Job Images</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {job.images.map((image, idx) => (
                        <div key={idx} className="aspect-square rounded-md overflow-hidden bg-gray-100">
                          <img 
                            src={image} 
                            alt={`Job image ${idx + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-4">Contact Information</h2>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  {job.contact_email && (
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-nearfix-500 mr-2" />
                      <span>{job.contact_email}</span>
                    </div>
                  )}
                  {job.contact_phone && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-nearfix-500 mr-2" />
                      <span>{job.contact_phone}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
                  {job.contact_phone && (
                    <Button 
                      className="w-full sm:w-auto bg-nearfix-600 hover:bg-nearfix-700" 
                      onClick={handleCall}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                  )}
                  {job.contact_email && (
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto" 
                      onClick={handleEmail}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center">
            <Link to="/search">
              <Button variant="outline">Back to Search</Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobDetails;
