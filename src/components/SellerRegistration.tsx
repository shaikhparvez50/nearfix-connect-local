
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from '@/hooks/useLocation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { MapPin, Upload } from 'lucide-react';

const sellerFormSchema = z.object({
  sellerType: z.string({required_error: "Please select a seller type"}),
  businessName: z.string({required_error: "Business name is required"}).min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string({required_error: "Phone number is required"}).min(10, "Enter a valid phone number"),
  email: z.string({required_error: "Email is required"}).email("Enter a valid email address"),
  serviceCategory: z.string({required_error: "Please select a service category"}),
  experience: z.string({required_error: "Please select your experience level"}),
  description: z.string({required_error: "Please provide a description"}).min(20, "Description must be at least 20 characters"),
  address: z.string({required_error: "Address is required"}).min(5, "Enter a valid address"),
  city: z.string({required_error: "City is required"}).min(2, "City name must be at least 2 characters"),
  pincode: z.string({required_error: "PIN code is required"}).min(6, "Enter a valid PIN code"),
  serviceRadius: z.string({required_error: "Please select a service radius"}),
  termsAgreed: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions" }),
  })
});

export const SellerRegistration = ({ step, setStep }: { step: number, setStep: (step: number) => void }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { detectLocation, latitude, longitude, address: locationAddress, loading } = useLocation();
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [workSamples, setWorkSamples] = useState<File[]>([]);
  const [idProof, setIdProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof sellerFormSchema>>({
    resolver: zodResolver(sellerFormSchema),
    defaultValues: {
      sellerType: "",
      businessName: "",
      phoneNumber: "",
      email: user?.email || "",
      serviceCategory: "",
      experience: "",
      description: "",
      address: "",
      city: "",
      pincode: "",
      serviceRadius: "",
    }
  });

  const handleDetectLocation = async () => {
    const success = await detectLocation();
    if (success && locationAddress) {
      // Try to parse the address components from the returned address string
      const addressParts = locationAddress.split(', ');
      
      if (addressParts.length > 2) {
        const city = addressParts[addressParts.length - 3]; // Usually city is third from last
        const pincode = addressParts[addressParts.length - 2].match(/\d+/)?.[0] || ""; // Extract digits from second to last part
        
        form.setValue('address', locationAddress);
        form.setValue('city', city);
        form.setValue('pincode', pincode);
      } else {
        form.setValue('address', locationAddress);
      }
    }
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const handleWorkSamplesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setWorkSamples(prev => [...prev, ...newFiles].slice(0, 10)); // Limit to 10 images
    }
  };

  const handleIdProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdProof(e.target.files[0]);
    }
  };

  const removeWorkSample = (index: number) => {
    setWorkSamples(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File, bucket: string, folder: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);
      
      if (error) throw error;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);
      
      return publicUrlData.publicUrl;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleNextStep = async (currentStep: number) => {
    if (currentStep === 1) {
      // First step validation
      const result = await form.trigger(['sellerType', 'businessName', 'phoneNumber', 'email']);
      if (!result) return;
      
      setStep(2);
    } else if (currentStep === 2) {
      // Second step validation
      const result = await form.trigger(['serviceCategory', 'experience', 'description']);
      if (!result) return;
      
      setStep(3);
    }
  };

  const onSubmit = async (values: z.infer<typeof sellerFormSchema>) => {
    if (!user) {
      toast.error("You must be logged in to register as a seller");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload images if provided
      let profilePhotoUrl = null;
      let workSampleUrls: string[] = [];
      let idProofUrl = null;

      // Upload profile photo
      if (profilePhoto) {
        profilePhotoUrl = await uploadFile(profilePhoto, 'seller-profiles', `${user.id}/profile`);
      }

      // Upload work samples
      if (workSamples.length > 0) {
        const uploadPromises = workSamples.map(file => 
          uploadFile(file, 'seller-profiles', `${user.id}/work-samples`)
        );
        workSampleUrls = await Promise.all(uploadPromises);
      }

      // Upload ID proof
      if (idProof) {
        idProofUrl = await uploadFile(idProof, 'seller-profiles', `${user.id}/id-proof`);
      }

      // 1. Update user role
      const { error: userError } = await supabase
        .from('users')
        .update({ user_role: 'provider' })
        .eq('id', user.id);

      if (userError) throw userError;

      // 2. Create seller profile
      const { error: sellerError } = await supabase
        .from('seller_profiles')
        .insert({
          user_id: user.id,
          business_name: values.businessName,
          services: [values.serviceCategory],
          description: values.description,
          profile_image: profilePhotoUrl,
          work_samples: workSampleUrls,
          id_proof: idProofUrl
        });

      if (sellerError) throw sellerError;

      // 3. If we have location data, store it
      if (latitude && longitude) {
        const { error: geoError } = await supabase
          .from('geo_locations')
          .insert({
            user_id: user.id,
            latitude,
            longitude,
            address: values.address
          });

        if (geoError) {
          console.error("Error saving location data:", geoError);
          // Continue anyway as this is not critical
        }
      }

      toast.success("Your application has been submitted successfully!");
      navigate('/seller-confirmation');
    } catch (error: any) {
      toast.error(error.message || "Failed to submit seller application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {step === 1 && (
        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleNextStep(1);
              }} 
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="sellerType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seller Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your seller type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="individual">Individual Professional</SelectItem>
                        <SelectItem value="company">Company/Small Business</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name/Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name or business name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Your phone number" type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email address" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <Label htmlFor="profile-photo">Profile Photo</Label>
                <div 
                  className="border border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => document.getElementById('profile-photo')?.click()}
                >
                  {profilePhoto ? (
                    <div className="flex flex-col items-center">
                      <img 
                        src={URL.createObjectURL(profilePhoto)} 
                        alt="Profile Preview" 
                        className="h-32 w-32 object-cover rounded-full mb-2"
                      />
                      <p className="text-sm text-gray-600">Click to change</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Upload a clear profile photo or business logo</p>
                      <p className="text-xs text-gray-500 mt-1">JPG or PNG format, max 5MB</p>
                    </>
                  )}
                  <Input 
                    id="profile-photo"
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleProfilePhotoChange}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <Button type="submit">Next Step</Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleNextStep(2);
              }} 
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="serviceCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Categories</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select primary service category" />
                        </SelectTrigger>
                      </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select years of experience" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-2">1-2 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your services, expertise, and what makes you stand out" 
                        rows={4}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label>Work Samples (Optional)</Label>
                <div 
                  className="border border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => document.getElementById('work-samples')?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Upload photos of your previous work
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Up to 10 images (JPG, PNG), 5MB each
                  </p>
                  <Input 
                    id="work-samples"
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    multiple 
                    onChange={handleWorkSamplesChange}
                  />
                </div>
                {workSamples.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">{workSamples.length} file(s) selected</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {workSamples.map((file, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={URL.createObjectURL(file)}
                            alt={`Work sample ${index + 1}`}
                            className="h-20 w-20 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeWorkSample(index);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-8">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit">Next Step</Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col space-y-2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Area Address</FormLabel>
                      <div className="relative flex items-center gap-2">
                        <FormControl className="flex-1">
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder="Your business address or service area"
                              className="pl-10"
                            />
                            <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          </div>
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={handleDetectLocation}
                          disabled={loading}
                        >
                          {loading ? "Detecting..." : "Detect Location"}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PIN Code</FormLabel>
                      <FormControl>
                        <Input placeholder="PIN Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="serviceRadius"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Radius</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="How far will you travel for service?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="5">Up to 5 km</SelectItem>
                        <SelectItem value="10">Up to 10 km</SelectItem>
                        <SelectItem value="15">Up to 15 km</SelectItem>
                        <SelectItem value="20">Up to 20 km</SelectItem>
                        <SelectItem value="25+">25+ km</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label htmlFor="id-proof">ID Verification</Label>
                <div 
                  className="border border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => document.getElementById('id-proof')?.click()}
                >
                  {idProof ? (
                    <div className="flex flex-col items-center">
                      <div className="bg-gray-100 p-2 rounded mb-2">
                        <p className="text-sm font-medium">{idProof.name}</p>
                        <p className="text-xs text-gray-500">{(idProof.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <p className="text-sm text-gray-600">Click to change</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Upload a government-issued ID for verification
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Aadhaar Card, PAN Card, or Business Registration
                      </p>
                    </>
                  )}
                  <Input 
                    id="id-proof"
                    type="file" 
                    className="hidden" 
                    accept="image/*, application/pdf"
                    onChange={handleIdProofChange}
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6">
                <FormField
                  control={form.control}
                  name="termsAgreed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="mt-1"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">
                          I agree to NearFix's <a href="/terms" className="text-nearfix-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-nearfix-600 hover:underline">Privacy Policy</a>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-between mt-8">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </>
  );
};
