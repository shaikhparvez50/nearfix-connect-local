
import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, Phone, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div>
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold font-heading text-nearfix-800">
                Near<span className="text-nearfix-500">Fix</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 max-w-xs">
              Connecting customers with trusted local service providers 
              for all kinds of skilled work.
            </p>
            <div className="flex items-center mt-4 space-x-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="rounded-full bg-nearfix-50 p-2 text-nearfix-700 hover:bg-nearfix-100 transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="rounded-full bg-nearfix-50 p-2 text-nearfix-700 hover:bg-nearfix-100 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="rounded-full bg-nearfix-50 p-2 text-nearfix-700 hover:bg-nearfix-100 transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-base font-semibold text-gray-900">For Customers</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/post-job" className="text-sm text-gray-600 hover:text-nearfix-600">Post a Job</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-sm text-gray-600 hover:text-nearfix-600">How It Works</Link>
              </li>
              <li>
                <Link to="/search" className="text-sm text-gray-600 hover:text-nearfix-600">Find Services</Link>
              </li>
              <li>
                <Link to="/safety" className="text-sm text-gray-600 hover:text-nearfix-600">Safety Tips</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading text-base font-semibold text-gray-900">Contact Us</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2 text-nearfix-600" />
                <a href="tel:7350167713" className="text-sm hover:text-nearfix-600">+91 7350167713</a>
              </li>
              <li className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2 text-nearfix-600" />
                <a href="mailto:shaikhparbej50@gmail.com" className="text-sm hover:text-nearfix-600 break-all">shaikhparbej50@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} NearFix. All rights reserved.
          </p>
          <div className="flex space-x-4 text-xs text-gray-500">
            <Link to="/terms" className="hover:text-nearfix-600">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-nearfix-600">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
