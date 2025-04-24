
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await signIn(email, password);
      toast({
        title: "Login successful!",
        description: "Welcome back to NearFix.",
      });
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-md">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <Link to="/">
                <img 
                  src="/placeholder.svg" 
                  alt="NearFix Logo" 
                  className="h-10 w-auto" 
                />
              </Link>
            </div>
            <CardTitle className="text-2xl font-heading">
              Welcome Back to NearFix
            </CardTitle>
            <CardDescription>
              Connect to trusted people near you
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-nearfix-600 hover:bg-nearfix-700">
                Sign In <LogIn className="ml-2 h-4 w-4" />
              </Button>
              
              <div className="text-center text-sm">
                <span className="text-gray-600">New here? </span>
                <Link to="/signup" className="text-nearfix-600 hover:underline">
                  Sign Up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
