
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  User,
  Plus,
  Search,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Link to="/" className="flex items-center mr-6">
            <span className="text-2xl font-bold font-heading text-nearfix-800">Near<span className="text-nearfix-500">Fix</span></span>
          </Link>
          
          <nav className="hidden items-center space-x-4 md:flex">
            <Link to="/services" className="text-sm font-medium text-nearfix-900 hover:text-nearfix-700 transition-colors">
              Services
            </Link>
            <Link to="/how-it-works" className="text-sm font-medium text-nearfix-900 hover:text-nearfix-700 transition-colors">
              How It Works
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-2">
          <LanguageSwitcher className="hidden md:flex mr-2" />
          
          <Link to="/search">
            <Button variant="outline" size="sm" className="hidden md:inline-flex">
              <Search className="h-4 w-4 mr-2" />
              Find Services
            </Button>
          </Link>
          
          {user ? (
            <>
              <Link to="/post-job">
                <Button size="sm" className="hidden md:inline-flex bg-nearfix-500 hover:bg-nearfix-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Post a Job
                </Button>
              </Link>
              
              <Link to="/dashboard">
                <Button variant="ghost" size="icon" className="hidden md:inline-flex">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:inline-flex"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Link to="/signin">
              <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="absolute top-16 inset-x-0 bg-white shadow-lg rounded-b-lg md:hidden">
          <div className="container mx-auto px-4 py-3 space-y-3">
            <Link
              to="/services"
              className="block w-full p-2 text-left rounded-md hover:bg-nearfix-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/how-it-works"
              className="block w-full p-2 text-left rounded-md hover:bg-nearfix-50"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <div className="pt-2 flex items-center">
              <LanguageSwitcher />
            </div>
            <div className="pt-2 flex flex-col space-y-2">
              <Link to="/search" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-start">
                  <Search className="h-4 w-4 mr-2" />
                  Find Services
                </Button>
              </Link>
              
              {user ? (
                <>
                  <Link to="/post-job" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full justify-start bg-nearfix-500 hover:bg-nearfix-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Post a Job
                    </Button>
                  </Link>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="secondary" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleSignOut();
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="secondary" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
