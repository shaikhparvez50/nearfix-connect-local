
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MapPin, UserCircle2, Phone, Mail, Calendar } from 'lucide-react';
import { ProviderType } from '@/types/types';
import { Skeleton } from '@/components/ui/skeleton';

const ProviderProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [provider, setProvider] = useState<ProviderType & { profile_image?: string, email?: string, phone?: string }>(); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviderDetails = async () => {
      setLoading(true);
      try {
        // First, try to get provider details from the seller_profiles table
        const { data: sellerProfile, error: sellerError } = await supabase
          .from('seller_profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (sellerError && sellerError.code !== 'PGRST116') {
          throw new Error(sellerError.message);
        }

        if (sellerProfile) {
          // Get user details for additional info
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('email, phone')
            .eq('id', sellerProfile.user_id)
            .single();

          if (userError && userError.code !== 'PGRST116') {
            console.error('Error fetching user data:', userError);
          }

          setProvider({
            provider_id: sellerProfile.id,
            user_id: sellerProfile.user_id,
            business_name: sellerProfile.business_name || 'Unnamed Business',
            service_types: sellerProfile.services || [],
            description: sellerProfile.description || '',
            hourly_rate: sellerProfile.hourly_rate || 0,
            rating: sellerProfile.rating || 0,
            reviews: sellerProfile.reviews_count || 0,
            distance: 0,
            address: sellerProfile.address || '',
            profile_image: sellerProfile.profile_image || undefined,
            email: userData?.email || '',
            phone: userData?.phone || '',
            verified: sellerProfile.verified || false,
            work_samples: sellerProfile.work_samples || []
          });
        } else {
          throw new Error('Provider not found');
        }
      } catch (err: any) {
        console.error('Error fetching provider details:', err);
        setError(err.message || 'Failed to load provider details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProviderDetails();
    }
  }, [id]);

  const handleCall = () => {
    if (provider?.phone) {
      window.location.href = `tel:${provider.phone}`;
    }
  };

  const handleEmail = () => {
    if (provider?.email) {
      window.location.href = `mailto:${provider.email}`;
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-64 w-full rounded-lg mb-6" />
            <Skeleton className="h-8 w-72 mb-2" />
            <Skeleton className="h-4 w-40 mb-6" />
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

  if (error || !provider) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Provider not found'}</p>
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
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-nearfix-600 to-nearfix-400 h-32 md:h-48"></div>
            <div className="px-4 pb-6 relative">
              <div className="flex flex-col md:flex-row md:items-end -mt-16 mb-4">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white bg-white">
                  {provider.profile_image ? (
                    <AvatarImage 
                      src={provider.profile_image} 
                      alt={provider.business_name} 
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-nearfix-100">
                      <UserCircle2 className="h-16 w-16 text-gray-400" />
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <h1 className="text-2xl font-bold">{provider.business_name}</h1>
                      <div className="flex items-center mt-1">
                        {provider.verified && (
                          <Badge className="mr-2 bg-green-100 text-green-800 border-green-200">
                            Verified
                          </Badge>
                        )}
                        <div className="flex items-center text-yellow-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-current"
                              fillOpacity={i < Math.floor(provider.rating || 0) ? 1 : 0.2}
                            />
                          ))}
                          <span className="ml-1 text-sm text-gray-600">
                            ({provider.reviews || 0} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 mt-2 md:mt-0">
                      {provider.phone && (
                        <Button 
                          className="w-full sm:w-auto bg-nearfix-600 hover:bg-nearfix-700" 
                          onClick={handleCall}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call Now
                        </Button>
                      )}
                      {provider.email && (
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
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {provider.service_types.map((service, idx) => (
                  <Badge 
                    key={idx}
                    variant="secondary" 
                    className="bg-nearfix-50 text-nearfix-600"
                  >
                    {service}
                  </Badge>
                ))}
              </div>
              
              {provider.address && (
                <div className="flex items-start text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 text-nearfix-500 mt-0.5 flex-shrink-0" />
                  <span className="ml-2">{provider.address}</span>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-4 mt-2">
                <h2 className="font-semibold text-lg mb-2">About</h2>
                <p className="text-gray-700">{provider.description || 'No description provided.'}</p>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="services" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="services" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Services Offered</h3>
                  <ul className="space-y-3">
                    {provider.service_types.length > 0 ? (
                      provider.service_types.map((service, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-nearfix-600 mr-2">•</span>
                          <span>{service}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">No services listed</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="portfolio" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Work Samples</h3>
                  {provider.work_samples && provider.work_samples.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {provider.work_samples.map((image, idx) => (
                        <div key={idx} className="aspect-square rounded-md overflow-hidden bg-gray-100">
                          <img 
                            src={image} 
                            alt={`Work sample ${idx + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No work samples available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="pricing" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Pricing Information</h3>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-3">
                    <span className="font-medium">Hourly Rate</span>
                    <span className="text-lg font-semibold">₹{provider.hourly_rate}/hr</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    * Actual pricing may vary based on the complexity and requirements of your project.
                    Contact the service provider directly for an accurate quote.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center">
            <Link to="/search">
              <Button variant="outline">Back to Search</Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProviderProfile;
