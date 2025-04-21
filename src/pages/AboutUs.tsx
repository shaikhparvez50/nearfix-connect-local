
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";

const AboutUs = () => {
  return (
    <MainLayout>
      <section className="py-16 bg-gradient-to-br from-nearfix-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="font-heading text-3xl font-bold text-nearfix-900 mb-4">
              About NearFix
            </h1>
            <p className="text-lg text-gray-600">
              Connecting trusted local service providers with customers
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="mb-8 border-0 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
                <p className="text-gray-700 mb-4">
                  NearFix was founded with a simple mission: to make it easier for people to find reliable, local service providers for their everyday needs. Whether you're looking for a plumber, electrician, tutor, or fabricator, our platform connects you with verified professionals in your area.
                </p>
                <p className="text-gray-700">
                  We believe in building communities through trust and accessibility. By connecting skilled professionals with local customers, we help create economic opportunities while solving everyday problems.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-8 border-0 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">How We're Different</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-nearfix-600 font-bold mr-2">•</span>
                    <span><strong>No Commissions:</strong> Unlike other platforms, we don't take a cut from service providers' earnings.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-nearfix-600 font-bold mr-2">•</span>
                    <span><strong>Purely Local:</strong> We focus only on connecting people within your community.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-nearfix-600 font-bold mr-2">•</span>
                    <span><strong>Verified Providers:</strong> We verify all service providers on our platform for your safety.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-nearfix-600 font-bold mr-2">•</span>
                    <span><strong>Direct Communication:</strong> We facilitate direct contact between customers and service providers.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Trust</h3>
                    <p className="text-sm text-gray-600">
                      Building a platform where people can feel confident about the professionals they invite into their homes.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Community</h3>
                    <p className="text-sm text-gray-600">
                      Strengthening local economies by keeping services and opportunities within the community.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Simplicity</h3>
                    <p className="text-sm text-gray-600">
                      Making the process of finding and booking services as straightforward as possible.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Transparency</h3>
                    <p className="text-sm text-gray-600">
                      Open and honest communication about our service and how we operate.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AboutUs;
