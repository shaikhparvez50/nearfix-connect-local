import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from '../supabaseClient';
import { User, Mail, Lock, UserPlus } from "lucide-react";
import { useToastAction } from "../components/ui/use-toast";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'buyer' | 'seller';
}

const SignUp = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer"
  });
  
  const { toast } = useToastAction();
  const navigate = useNavigate();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRoleChange = (value: 'buyer' | 'seller') => {
    setFormData(prev => ({
      ...prev,
      role: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: formData.role
          }
        }
      });

      if (error) throw error;
      
      toast({
        title: "Account created successfully!",
        description: `Welcome to NearFix as a ${formData.role}. You can now sign in.`,
      });
      
      navigate("/login");
    } catch (err: any) {
      toast({
        title: "Registration failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="border-0 shadow-md rounded-lg bg-white p-6">
          <div className="text-center space-y-2 mb-6">
            <div className="flex justify-center mb-2">
              <Link to="/">
                <img 
                  src="/placeholder.svg" 
                  alt="NearFix Logo" 
                  className="h-10 w-auto" 
                />
              </Link>
            </div>
            <h2 className="text-2xl font-bold">Join NearFix</h2>
            <p className="text-gray-600">
              Create an account to get started
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">I want to join NearFix as:</label>
              <div className="pt-2">
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="radio"
                    id="signup-buyer"
                    name="role"
                    value="buyer"
                    checked={formData.role === "buyer"}
                    onChange={(e) => handleRoleChange(e.target.value as 'buyer' | 'seller')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="signup-buyer" className="text-sm text-gray-700">Service Buyer (hire professionals)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="signup-seller"
                    name="role"
                    value="seller"
                    checked={formData.role === "seller"}
                    onChange={(e) => handleRoleChange(e.target.value as 'buyer' | 'seller')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="signup-seller" className="text-sm text-gray-700">Service Provider (offer services)</label>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center"
            >
              Create Account <UserPlus className="ml-2 h-4 w-4" />
            </button>
            
            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
