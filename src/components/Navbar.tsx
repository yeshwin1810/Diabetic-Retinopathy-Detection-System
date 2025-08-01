
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isDoctor = user?.role === "doctor";

  return (
    <header className="border-b">
      <div className="container py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Eye className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">DR Detector</span>
        </Link>
        
        <nav>
          <ul className="flex items-center space-x-6">
            <li>
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            
            {user ? (
              <>
                <li>
                  <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                </li>
                
                {isDoctor && (
                  <>
                    <li>
                      <Link to="/patients" className="text-sm font-medium hover:text-primary transition-colors">
                        Patients
                      </Link>
                    </li>
                    <li>
                      <Link to="/upload" className="text-sm font-medium hover:text-primary transition-colors">
                        Upload Scan
                      </Link>
                    </li>
                  </>
                )}
                
                <li>
                  <Button onClick={handleLogout} variant="outline" size="sm">
                    Logout
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Button onClick={() => navigate("/login")} variant="outline" size="sm">
                    Doctor Login
                  </Button>
                </li>
                <li>
                  <Button onClick={() => navigate("/register")} variant="default" size="sm">
                    Register
                  </Button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
