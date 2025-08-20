"use client";
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Star,
  ArrowRight,
  Loader2,
  Clock,
  Briefcase,
  Award,
  Search,
  Store,
  CheckCircle,
  Package,
  Phone,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { whatsappNumber as OwnerPhone } from "@/lib/utils";
import VendorRegistrationForm from "@/components/VendorRegistrationForm";

// Vendor interface matching our database schema
interface Vendor {
  id: string;
  name: string;
  businessName: string;
  photo?: string;
  profileImage?: string;
  businessType: string;
  location: string;
  rating: number;
  reviewCount: number;
  yearsOfExperience: number;
  description: string;
  verified: boolean;
  featured: boolean;
  whatsAppNumber?: string;
  email: string;
  phone: string;
  services: string[];
  specializations: string[];
  priceRange: 'budget' | 'mid-range' | 'premium';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
}

// Vendors props interface
interface VendorsProps {
  fetchedVendors?: Vendor[];
}

// Fallback vendors data in case Firebase fails
const fallbackVendors: Vendor[] = [
  {
    id: "v1",
    name: "John Adebayo",
    businessName: "Superior Building Supplies",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60",
    businessType: "Wholesaler",
    location: "Lagos, Nigeria",
    rating: 4.8,
    reviewCount: 124,
    yearsOfExperience: 12,
    description: "Premium quality building materials supplier with over 10 years of experience in the construction industry.",
    verified: true,
    featured: true,
    whatsAppNumber: "2348123456789",
    email: "john@superiorsupplies.com",
    phone: "+234 812 345 6789",
    services: ["Cement Supply", "Steel Distribution", "Block Supply"],
    specializations: ["Bulk Orders", "Delivery Service", "Quality Assurance"],
    priceRange: "mid-range",
    status: "approved",
  },
];

const Vendors: React.FC<VendorsProps> = ({ fetchedVendors = [] }) => {
  const [vendors, setVendors] = useState<Vendor[]>(fetchedVendors);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(fetchedVendors);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");
  const [isLoaded, setIsLoaded] = useState(true);
  const [loading, setLoading] = useState(false);

  // Update vendors when fetchedVendors prop changes
  useEffect(() => {
    setVendors(fetchedVendors);
    setFilteredVendors(fetchedVendors);
  }, [fetchedVendors]);

  // Filter vendors based on search
  useEffect(() => {
    const filtered = vendors.filter(vendor =>
      vendor.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.businessType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase())) ||
      vendor.specializations.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredVendors(filtered);
  }, [searchQuery, vendors]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const whatsappMessage = "Hello, I'm interested in registering as a vendor on Ayceebuilder.";
  const whatsappURL = `https://wa.me/${OwnerPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  const getPriceRangeColor = (range: string) => {
    switch (range) {
      case 'budget': return 'text-green-600';
      case 'premium': return 'text-purple-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-7xl mx-auto">
      <main className="flex-grow pt-20">
        <div className="bg-secondary/5 py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">Building Materials Vendors</h1>
            <p className="text-muted-foreground mb-6">
              Find trusted suppliers for your construction projects or register your business
            </p>

            <Tabs
              defaultValue="browse"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
                <TabsTrigger value="browse">Browse Vendors</TabsTrigger>
                <TabsTrigger value="register">Register as Vendor</TabsTrigger>
              </TabsList>

              <TabsContent value="browse">
                <form onSubmit={handleSearch} className="max-w-4xl">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="relative">
                      <Input
                        placeholder="Search by business name, type, location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <Button type="submit" className="w-full">
                      Search
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          {activeTab === "browse" ? (
            loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading vendors...</span>
              </div>
            ) : filteredVendors.length > 0 ? (
              <div
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"
                  }`}
              >
                {filteredVendors.map((vendor, index) => (
                  <div
                    key={vendor.id}
                    className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
                    style={{
                      animationDelay: `${0.05 * index}s`,
                      animation: isLoaded ? "fadeIn 0.5s ease forwards" : "none",
                    }}
                  >
                    <div className="block p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-secondary/20 flex-shrink-0">
                          {vendor.profileImage || vendor.photo ? (
                            <img
                              src={vendor.profileImage || vendor.photo}
                              alt={vendor.businessName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10">
                              <Store className="w-8 h-8 text-primary/60" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">
                            {vendor.businessName}
                          </h3>
                          <div className="flex items-center text-sm text-primary font-medium">
                            {vendor.businessType}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin size={14} className="mr-1" />
                            {vendor.location}
                          </div>
                          {vendor.verified && (
                            <div className="flex items-center text-sm text-green-600 mt-1">
                              <CheckCircle size={14} className="mr-1" />
                              Verified
                            </div>
                          )}
                          {vendor.featured && (
                            <div className="flex items-center text-sm text-yellow-600 mt-1">
                              <Award size={14} className="mr-1" />
                              Featured
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {vendor.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="font-medium">{vendor.rating}</span>
                          <span className="text-muted-foreground ml-1">
                            ({vendor.reviewCount} reviews)
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {vendor.yearsOfExperience} years experience
                        </div>
                        <div className="flex items-center text-sm">
                          <Package className="w-4 h-4 mr-1" />
                          <span className={getPriceRangeColor(vendor.priceRange)}>
                            {vendor.priceRange.charAt(0).toUpperCase() + vendor.priceRange.slice(1)} Range
                          </span>
                        </div>
                      </div>

                      {vendor.services.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-muted-foreground mb-2">Services:</p>
                          <div className="flex flex-wrap gap-1">
                            {vendor.services.slice(0, 3).map((service, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                              >
                                {service}
                              </span>
                            ))}
                            {vendor.services.length > 3 && (
                              <span className="px-2 py-1 bg-secondary/20 text-muted-foreground text-xs rounded">
                                +{vendor.services.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        {vendor.whatsAppNumber && (
                          <Button
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => window.open(`https://wa.me/${vendor.whatsAppNumber}`, '_blank')}
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            WhatsApp
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => window.open(`tel:${vendor.phone}`, '_self')}
                        >
                          <Phone className="w-4 h-4 mr-1" />
                          Call
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium text-foreground mb-2">
                  {searchQuery ? "No vendors found" : "No vendors available"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? "Try adjusting your search terms or browse all vendors."
                    : "Be the first to register your business and connect with customers."}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {searchQuery && (
                    <Button
                      variant="outline"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear Search
                    </Button>
                  )}
                  <Button onClick={() => setActiveTab("register")}>
                    Register Your Business
                  </Button>
                </div>
              </div>
            )
          ) : submitSuccess ? (
            <div className="max-w-3xl mx-auto">
              <div className="text-center py-8 bg-green-50 rounded-lg border border-green-200">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-600"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  Registration Successful!
                </h3>
                <p className="text-green-700 mb-6">
                  Thank you for registering as a vendor. Our team will
                  review your information and contact you shortly.
                </p>
                <Button onClick={() => setSubmitSuccess(false)}>
                  Register Another Vendor
                </Button>
              </div>
            </div>
          ) : (
            // Registration form tab
            <VendorRegistrationForm onSuccess={() => setSubmitSuccess(true)} />
          )}
        </div>

        {activeTab === "browse" && (
          <div className="container mx-auto px-4 py-10">
            <div className="bg-secondary/5 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-2">
                Are you a building materials supplier?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Join Ayceebuilder as a verified vendor and connect with
                construction professionals looking for quality materials.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="flex-1"
                  onClick={() => setActiveTab("register")}
                >
                  <Store className="w-4 h-4 mr-2" />
                  Register Your Business
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open(whatsappURL, "_blank")}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Vendors;