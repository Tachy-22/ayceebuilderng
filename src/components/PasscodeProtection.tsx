"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface PasscodeProtectionProps {
  children: React.ReactNode;
}

const PasscodeProtection: React.FC<PasscodeProtectionProps> = ({ children }) => {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Check if the user has already authenticated
  useEffect(() => {
    const adminAuth = localStorage.getItem("admin-auth");
    if (adminAuth === "authenticated") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passcode === "AYCEEBUILDER") {
      setIsAuthenticated(true);
      localStorage.setItem("admin-auth", "authenticated");
      setError("");
    } else {
      setError("Invalid passcode. Please try again.");
      setPasscode("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-auth");
    setIsAuthenticated(false);
    router.push("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Admin Access</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please enter the passcode to access the admin area
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="passcode" className="sr-only">
                Passcode
              </label>
              <Input
                id="passcode"
                name="passcode"
                type="password"
                autoComplete="off"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Enter passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
              <Button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Enter Admin Area
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gray-100 p-2 flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogout}
          className="text-sm"
        >
          Logout Admin
        </Button>
      </div>
      {children}
    </div>
  );
};

export default PasscodeProtection;
