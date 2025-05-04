import { useState, useEffect } from "react";
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
import { supabase } from "../integrations/supabase/client";
import { TablesInsert } from "../integrations/supabase/types";
import { toast } from "react-hot-toast";

const BecomeSeller = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<TablesInsert<'service_providers'>>({
    user_id: '',
    business_name: '',
    description: '',
    hourly_rate: null,
    is_available: true,
    service_types: [],
    availability_schedule: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setFormData((prev) => ({ ...prev, user_id: user.id }));
      } else {
        setMessage('⚠️ Please log in to become a service provider.');
      }
    };
    getUser();

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setMessage('⚠️ Please enable location access to find nearby customers.');
        }
      );
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'hourly_rate' ? (value ? Number(value) : null) : value,
    }));
    setMessage('');
  };

  const handleSelectChange = (field: keyof typeof formData, value: string) => {
    if (field === 'service_types') {
      setFormData((prev) => ({
        ...prev,
        service_types: [...(prev.service_types || []), value],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'profile_photo' | 'work_samples') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${field}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('seller-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('seller-files')
        .getPublicUrl(filePath);

      if (field === 'profile_photo') {
        setFormData(prev => ({ ...prev, profile_photo_url: publicUrl }));
      } else {
        setFormData(prev => ({ 
          ...prev, 
          work_samples_urls: [...(prev.work_samples_urls || []), publicUrl] 
        }));
      }
    } catch (error) {
      setMessage(`❌ Error uploading file: ${error.message}`);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // First, get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      // Check if user is already a service provider
      const { data: existingProvider, error: checkError } = await supabase
        .from('service_providers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw checkError;
      }

      if (existingProvider) {
        setMessage('❌ You are already registered as a service provider.');
        toast.error("You are already registered as a service provider");
        return;
      }

      // Prepare the data for submission
      const submissionData = {
        user_id: user.id,
        business_name: formData.business_name,
        description: formData.description,
        hourly_rate: formData.hourly_rate ? Number(formData.hourly_rate) : null,
        is_available: true,
        service_types: formData.service_types,
        availability_schedule: formData.availability_schedule,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Insert into service_providers table
      const { error: insertError } = await supabase
        .from('service_providers')
        .insert([submissionData]);

      if (insertError) throw insertError;
      
      // Update user role to provider
      const { error: updateError } = await supabase
        .from('users')
        .update({ user_role: 'provider' })
        .eq('id', user.id);

      if (updateError) throw updateError;
      
      toast.success("Successfully registered as a service provider!");
      navigate("/seller-confirmation");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setMessage(`❌ Error: ${error.message}`);
      toast.error("Failed to register as a service provider");
    } finally {
      setLoading(false);
    }
  };
  
  const nextStep = () => {
    if (step === 1) {
      if (!formData.business_name || !formData.service_types.length) {
        setMessage('❌ Please fill in all required fields before continuing.');
        return;
      }
    }
    if (step === 2) {
      if (!formData.description) {
        setMessage('❌ Please provide a description before continuing.');
        return;
      }
    }
    setMessage('');
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
            
            {message && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
                {message}
              </div>
            )}
            
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
                  <CardTitle>Service Provider Registration</CardTitle>
                  <div className="text-sm text-gray-500">Step {step} of 3</div>
                </div>
                <CardDescription>
                  {step === 1 && "Basic information"}
                  {step === 2 && "Service details and pricing"}
                  {step === 3 && "Verification and terms"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="business_name">Business Name</Label>
                        <Input 
                          id="business_name" 
                          name="business_name"
                          value={formData.business_name || ''}
                          onChange={handleChange}
                          placeholder="Your business name" 
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="service_types">Service Types</Label>
                        <Select 
                          value={formData.service_types.join(',')}
                          onValueChange={(value) => handleSelectChange('service_types', value)}
                          required
                        >
                          <SelectTrigger id="service_types">
                            <SelectValue placeholder="Select service types" />
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
                    </div>
                  )}
                  
                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="description">Service Description</Label>
                        <Textarea 
                          id="description" 
                          name="description"
                          value={formData.description || ''}
                          onChange={handleChange}
                          placeholder="Describe your services, expertise, and what makes you stand out" 
                          rows={4}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="hourly_rate">Hourly Rate (Optional)</Label>
                        <Input 
                          id="hourly_rate" 
                          name="hourly_rate"
                          type="number"
                          min="0"
                          value={formData.hourly_rate?.toString() || ''}
                          onChange={handleChange}
                          placeholder="Enter your hourly rate" 
                        />
                      </div>
                    </div>
                  )}
                  
                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          id="terms"
                          name="terms"
                          aria-label="Accept terms and conditions"
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
                    {step > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={loading}
                      >
                        Back
                      </Button>
                    )}
                    
                    {step < 3 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={loading}
                        className="ml-auto"
                      >
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={loading}
                        className="ml-auto"
                      >
                        {loading ? "Submitting..." : "Submit Registration"}
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
