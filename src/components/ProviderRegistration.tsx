
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { MapPin } from "lucide-react";

export const ProviderRegistration = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    serviceTypes: [] as string[],
    description: '',
    hourlyRate: '',
  });
  const { user, userLocation } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !userLocation) {
      toast.error("Please enable location services to continue");
      return;
    }

    try {
      // Update user role
      const { error: userError } = await supabase
        .from('users')
        .update({ user_role: 'provider' })
        .eq('id', user.id);

      if (userError) throw userError;

      // Create provider profile
      const { error: providerError } = await supabase
        .from('service_providers')
        .insert({
          user_id: user.id,
          business_name: formData.businessName,
          service_types: formData.serviceTypes,
          description: formData.description,
          hourly_rate: parseFloat(formData.hourlyRate),
        });

      if (providerError) throw providerError;

      toast.success("Successfully registered as a service provider!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="businessName">Business Name</Label>
        <Input
          id="businessName"
          value={formData.businessName}
          onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="serviceTypes">Service Types (comma-separated)</Label>
        <Input
          id="serviceTypes"
          placeholder="e.g., Plumbing, Electrical, Carpentry"
          onChange={(e) => setFormData(prev => ({
            ...prev,
            serviceTypes: e.target.value.split(',').map(s => s.trim())
          }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
        <Input
          id="hourlyRate"
          type="number"
          value={formData.hourlyRate}
          onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
          required
        />
      </div>

      {userLocation && (
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          <span>Your location will be automatically added</span>
        </div>
      )}

      <Button type="submit" className="w-full">Register as Provider</Button>
    </form>
  );
};
