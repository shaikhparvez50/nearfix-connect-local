import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { SERVICE_CATEGORIES, JobPostingType } from '../types/types';
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
import { Badge } from '@/components/ui/badge';
import { Upload, MapPin, Calendar, ArrowRight, Info, Clock, Trash2, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';

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
    skills_required: [],
    duration: '',
    preferred_time: '',
    contact_email: '',
    contact_phone: '',
    images: []
  });
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setFormData((prev) => ({ ...prev, user_id: user.id }));
        
        // Fetch user profile to auto-fill contact details
        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', user.id)
          .single();
          
        if (profile) {
          setFormData((prev) => ({ 
            ...prev, 
            contact_email: profile.email || user.email || ''
          }));
        }
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
      if (!formData.location || formData.budget === undefined || formData.budget <= 0) {
        setMessage('❌ Please enter location and valid budget before continuing.');
        return;
      }
    }
    setMessage('');
    setStep((s) => Math.min(s + 1, 4));
  };

  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'budget' ? Number(value) || 0 : value,
    }));
    setMessage('');
  };

  const handleSelectChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addSkill = () => {
    if (skillInput && !formData.skills_required?.includes(skillInput)) {
      setFormData((prev) => ({
        ...prev,
        skills_required: [...(prev.skills_required || []), skillInput],
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills_required: prev.skills_required?.filter((s) => s !== skill),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newFiles = Array.from(files);
    setImageFiles((prev) => [...prev, ...newFiles]);
    
    // Generate preview URLs
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    const newFiles = [...imageFiles];
    const newPreviewUrls = [...imagePreviewUrls];
    
    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewUrls[index]);
    
    newFiles.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    
    setImageFiles(newFiles);
    setImagePreviewUrls(newPreviewUrls);
  };

  const uploadImages = async () => {
    if (imageFiles.length === 0) return [];
    
    const uploadedUrls: string[] = [];
    setUploading(true);
    
    try {
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `job_images/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('job_images')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from('job_images')
          .getPublicUrl(filePath);
          
        uploadedUrls.push(publicUrlData.publicUrl);
      }
      
      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images. Please try again.');
      return [];
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const timestamp = new Date().toISOString();

    try {
      // Upload images first
      let uploadedImageUrls: string[] = [];
      
      if (imageFiles.length > 0) {
        uploadedImageUrls = await uploadImages();
        if (uploadedImageUrls.length === 0) {
          setLoading(false);
          setMessage('❌ Failed to upload images. Please try again.');
          return;
        }
      }

      // Ensure all required fields are present and properly typed
      if (!formData.title || !formData.description || !formData.category || 
          !formData.location || !formData.user_id) {
        setMessage('❌ All required fields must be filled');
        setLoading(false);
        return;
      }

      // Create a properly typed object for insertion that matches the DbJobPosting type
      const jobData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        user_id: formData.user_id,
        budget: formData.budget || null,
        status: formData.status || 'open',
        created_at: timestamp,
        updated_at: timestamp,
        skills_required: formData.skills_required || [],
        duration: formData.duration || null,
        preferred_time: formData.preferred_time || null,
        contact_email: formData.contact_email || null,
        contact_phone: formData.contact_phone || null, // Keep as string, matching our updated type
        images: uploadedImageUrls
      };

      const { error } = await supabase.from('job_postings').insert(jobData);

      if (error) {
        setMessage(`❌ Error: ${error.message}`);
      } else {
        toast.success('Job posted successfully!');
        navigate('/job-confirmation');
      }
    } catch (error) {
      console.error('Error submitting job:', error);
      setMessage('❌ An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6 md:mb-8">
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-nearfix-900 mb-2">
                Post a Job
              </h1>
              <p className="text-gray-600">
                Fill in the details below to find the right service provider for your needs
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div 
                    key={stepNumber}
                    className={`flex flex-col items-center ${
                      stepNumber < step ? 'text-nearfix-600' : 
                      stepNumber === step ? 'text-nearfix-600' : 'text-gray-400'
                    }`}
                  >
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                        stepNumber < step ? 'bg-nearfix-600 text-white' : 
                        stepNumber === step ? 'border-2 border-nearfix-600' : 'border-2 border-gray-300'
                      }`}
                    >
                      {stepNumber}
                    </div>
                    <span className="text-xs hidden md:block">
                      {stepNumber === 1 ? "Details" : 
                       stepNumber === 2 ? "Location" : 
                       stepNumber === 3 ? "Images" : "Contact"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="border-0 shadow-md">
              <CardHeader className="bg-nearfix-50 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {step === 1 && "Job Details"}
                    {step === 2 && "Location and Schedule"}
                    {step === 3 && "Add Images"}
                    {step === 4 && "Contact Information"}
                  </CardTitle>
                </div>
                <CardDescription>
                  {step === 1 && "Tell us what you need"}
                  {step === 2 && "Where and when do you need the service?"}
                  {step === 3 && "Upload photos to help providers understand your job better"}
                  {step === 4 && "How should providers contact you?"}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title *</Label>
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
                        <Label htmlFor="category">Service Category *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleSelectChange('category', value)}
                          required
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select the type of service" />
                          </SelectTrigger>
                          <SelectContent>
                            {SERVICE_CATEGORIES.map(category => (
                              <SelectItem key={category} value={category.toLowerCase()}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Job Description *</Label>
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
                      
                      <div className="space-y-2">
                        <Label>Skills Required</Label>
                        <div className="flex gap-2">
                          <Input
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            placeholder="E.g., welding, painting"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            onClick={addSkill}
                            variant="outline"
                          >
                            Add
                          </Button>
                        </div>
                        
                        {formData.skills_required && formData.skills_required.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formData.skills_required.map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="px-3 py-1 flex items-center gap-1"
                              >
                                {skill}
                                <button 
                                  type="button"
                                  onClick={() => removeSkill(skill)}
                                  className="ml-1 hover:text-red-500"
                                >
                                  ✕
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
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
                        <Label htmlFor="budget">Budget (₹) *</Label>
                        <Input
                          id="budget"
                          name="budget"
                          value={formData.budget?.toString() || ''}
                          onChange={handleChange}
                          placeholder="e.g., 2500"
                          type="number"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="duration">Estimated Duration</Label>
                        <Select
                          value={formData.duration}
                          onValueChange={(value) => handleSelectChange('duration', value)}
                        >
                          <SelectTrigger id="duration">
                            <SelectValue placeholder="How long will the job take?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="less_than_1_hour">Less than 1 hour</SelectItem>
                            <SelectItem value="1_3_hours">1-3 hours</SelectItem>
                            <SelectItem value="half_day">Half day</SelectItem>
                            <SelectItem value="full_day">Full day</SelectItem>
                            <SelectItem value="2_3_days">2-3 days</SelectItem>
                            <SelectItem value="1_week">1 week</SelectItem>
                            <SelectItem value="more_than_1_week">More than 1 week</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="preferred_time">Preferred Time</Label>
                        <Select
                          value={formData.preferred_time}
                          onValueChange={(value) => handleSelectChange('preferred_time', value)}
                        >
                          <SelectTrigger id="preferred_time">
                            <SelectValue placeholder="When would you like the service?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Morning (8am - 12pm)</SelectItem>
                            <SelectItem value="afternoon">Afternoon (12pm - 5pm)</SelectItem>
                            <SelectItem value="evening">Evening (5pm - 9pm)</SelectItem>
                            <SelectItem value="anytime">Anytime</SelectItem>
                            <SelectItem value="weekends">Weekends only</SelectItem>
                            <SelectItem value="weekdays">Weekdays only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label>Upload Images (Optional)</Label>
                        <p className="text-sm text-gray-500 mb-2">
                          Add photos to help service providers understand your requirements better
                        </p>
                        
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <input
                            type="file"
                            id="images"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                          <label 
                            htmlFor="images"
                            className="flex flex-col items-center cursor-pointer"
                          >
                            <ImagePlus className="h-10 w-10 text-gray-400 mb-2" />
                            <span className="text-sm font-medium text-nearfix-600">Click to upload images</span>
                            <span className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (Max 5MB each)</span>
                          </label>
                        </div>
                        
                        {imagePreviewUrls.length > 0 && (
                          <div className="mt-4">
                            <Label className="mb-2 block">Uploaded Images</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {imagePreviewUrls.map((url, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    className="h-24 w-full object-cover rounded-md"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="contact_email">Contact Email *</Label>
                        <Input
                          id="contact_email"
                          name="contact_email"
                          value={formData.contact_email}
                          onChange={handleChange}
                          type="email"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contact_phone">Phone Number</Label>
                        <Input
                          id="contact_phone"
                          name="contact_phone"
                          value={formData.contact_phone}
                          onChange={handleChange}
                          placeholder="Your phone number"
                        />
                      </div>
                      
                      <div className="flex items-start gap-2 mt-4">
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
                      
                      <div className="flex items-start space-x-2 bg-blue-50 p-3 rounded-md mt-4">
                        <Info className="h-5 w-5 text-nearfix-600 mt-0.5" />
                        <p className="text-sm text-gray-600">
                          Your contact information will only be shared with service providers who respond to your job post.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between mt-8">
                    {step > 1 ? (
                      <Button type="button" variant="outline" onClick={prevStep} disabled={loading || uploading}>
                        Back
                      </Button>
                    ) : <div />}
                    
                    {step < 4 ? (
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
                        disabled={loading || uploading}
                        className={`bg-nearfix-600 hover:bg-nearfix-700 text-white px-6 py-2 rounded-md transition-all duration-300 ${
                          loading || uploading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading || uploading ? 'Posting...' : 'Post Job'}
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
