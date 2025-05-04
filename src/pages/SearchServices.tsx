import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "../integrations/supabase/client";
import { Search, MapPin, Clock, DollarSign } from "lucide-react";

interface ServiceProvider {
  id: string;
  business_name: string;
  description: string;
  hourly_rate: number | null;
  service_types: string[];
  is_available: boolean;
  user_id: string;
}

const SearchServices = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchServices = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .or(`business_name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,service_types.cs.{${searchQuery}}`)
        .eq('is_available', true);

      if (error) throw error;

      setServiceProviders(data || []);
    } catch (err) {
      setError("Failed to fetch services. Please try again.");
      console.error("Error searching services:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchServices();
  };

  return (
    <MainLayout>
      <section className="py-12 bg-gradient-to-br from-nearfix-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-heading text-3xl font-bold text-nearfix-900 mb-2">
                Find Service Providers
              </h1>
              <p className="text-gray-600">
                Search for skilled professionals in your area
              </p>
            </div>

            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search for services (e.g., plumbing, electrical, tutoring)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
            </form>

            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
                {error}
              </div>
            )}

            <div className="grid gap-6">
              {serviceProviders.map((provider) => (
                <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{provider.business_name}</CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Available
                      </span>
                      {provider.hourly_rate && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {provider.hourly_rate}/hour
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{provider.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {provider.service_types.map((service, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-nearfix-50 text-nearfix-600 rounded-full text-sm"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {!loading && serviceProviders.length === 0 && searchQuery && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No service providers found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default SearchServices; 