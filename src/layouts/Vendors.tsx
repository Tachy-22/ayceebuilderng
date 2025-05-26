"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Star,
  MapPin,
  CheckCircle,
  Search,
  MessageSquare,
  Calendar,
  Package,
  Phone,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Vendor interface
interface Vendor {
  id: string;
  name: string;
  photo: string;
  category: string;
  location: string;
  rating?: number;
  reviews: number;
  established: string;
  description: string;
  verified: boolean;
  completedTransactions: number;
  whatsAppNumber?: string;
  products?: string[];
}

// Vendors props interface
interface VendorsProps {
  fetchedVendors?: Vendor[];
}

// Categories for dropdown
const categoryOptions = [
  "Building Materials",
  "Electrical Supplies",
  "Plumbing Supplies",
  "Timber & Wood",
  "Metal & Steel",
  "Paints & Finishes",
  "Doors & Windows",
  "Roofing Materials",
  "Flooring Products",
  "Hardware & Tools",
  "Cement & Concrete",
  "Glass Products",
  "Landscaping Materials",
  "Kitchen & Bath",
  "Other",
];

// Establishment year options for dropdown
const establishmentOptions = [
  "Less than 1 year",
  "1-3 years",
  "3-5 years",
  "5-10 years",
  "10+ years",
];

// Nigerian states for dropdown
const nigerianStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT (Abuja)",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const Vendors = ({ fetchedVendors = [] }: VendorsProps) => {
  const [activeTab, setActiveTab] = useState("browse");
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();
  // Use only fetched vendors, no fallback
  const vendors = fetchedVendors || [];
  const [filteredVendors, setFilteredVendors] = useState(vendors);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Set isLoaded to true after a short delay for the loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timer); // Cleanup the timeout on unmount
  }, []);

  const [vendorForm, setVendorForm] = useState({
    name: "",
    category: "",
    location: "",
    established: "",
    description: "",
    whatsAppNumber: "",
    email: "",
    photo: "",
    rating: 0,
    reviews: 0,
    verified: false,
    completedTransactions: 0,
    state: "",
    city: "",
    phoneNumber: "",
    products: "",
    websiteUrl: "",
  });
  useEffect(() => {
    // Update filtered vendors whenever the original vendors list changes
    setFilteredVendors(vendors);
  }, [vendors]);

  useEffect(() => {
    // Filter vendors based on search query
    if (searchQuery.trim() === "") {
      setFilteredVendors(vendors);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = vendors.filter((vendor) => {
        return (
          vendor.name.toLowerCase().includes(lowerCaseQuery) ||
          vendor.category.toLowerCase().includes(lowerCaseQuery) ||
          vendor.location.toLowerCase().includes(lowerCaseQuery) ||
          (vendor.products &&
            vendor.products.some((product) =>
              product.toLowerCase().includes(lowerCaseQuery)
            ))
        );
      });
      setFilteredVendors(filtered);
    }
  }, [searchQuery, vendors]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Search is handled by the useEffect above
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setVendorForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setVendorForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVendorSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Form validation
      if (
        !vendorForm.name ||
        !vendorForm.category ||
        !vendorForm.state ||
        !vendorForm.phoneNumber
      ) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Format the location
      const location = vendorForm.city
        ? `${vendorForm.city}, ${vendorForm.state}, Nigeria`
        : `${vendorForm.state}, Nigeria`; // Prepare the data for submission
      const vendorData = {
        name: vendorForm.name,
        category: vendorForm.category,
        location: location,
        established: vendorForm.established,
        description: vendorForm.description,
        whatsAppNumber: vendorForm.whatsAppNumber || vendorForm.phoneNumber,
        email: vendorForm.email,
        phoneNumber: vendorForm.phoneNumber,
        products: vendorForm.products.split(",").map((item) => item.trim()),
        websiteUrl: vendorForm.websiteUrl,
        // These fields will be set by the admin
        photo: "",
        rating: 0,
        reviews: 0,
        verified: false,
        completedTransactions: 0,
        sheet: "vendors", // Specify the sheet to update
      };

      // Submit to API
      const response = await fetch("/api/vendor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vendorData),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitSuccess(true);
        toast({
          title: "Submission successful",
          description: "Your vendor information has been submitted for review.",
        });

        // Reset the form
        setVendorForm({
          name: "",
          category: "",
          location: "",
          established: "",
          description: "",
          whatsAppNumber: "",
          email: "",
          photo: "",
          rating: 0,
          reviews: 0,
          verified: false,
          completedTransactions: 0,
          state: "",
          city: "",
          phoneNumber: "",
          products: "",
          websiteUrl: "",
        });
      } else {
        throw new Error(result.error || "Failed to submit vendor information");
      }
    } catch (error) {
      console.error("Error submitting vendor:", error);
      toast({
        title: "Submission failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while submitting your information.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-[7rem]">
      <h1 className="text-3xl font-bold text-center mb-2">
        Building Material Vendors
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Find reliable suppliers of construction materials across Nigeria
      </p>

      <Tabs
        defaultValue="browse"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="browse">Browse Vendors</TabsTrigger>
          <TabsTrigger value="register">Register as a Vendor</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Search form */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <form
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row gap-4"
            >
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search by name, category, location, or products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </form>
          </div>
          {/* Results counter */}
          <div className="text-sm text-gray-600 mb-4">
            Showing {filteredVendors.length} vendors
          </div>{" "}
          {/* Vendors list */}
          {!isLoaded ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                >
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 animate-pulse rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded mb-2 w-1/2"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded mb-2 w-2/3"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded mb-2 w-1/3"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded mb-2 w-full"></div>
                    <div className="h-10 bg-gray-200 animate-pulse rounded mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <Package className="mx-auto h-16 w-16 text-gray-300" />
              <h3 className="mt-4 text-xl font-semibold text-gray-800">
                No vendors found
              </h3>
              <p className="mt-2 text-gray-500 max-w-md mx-auto">
                {searchQuery ? (
                  <>
                    No vendors match your search criteria. Try adjusting your
                    search terms or browse all vendors.
                  </>
                ) : (
                  <>
                    There are no vendors registered yet. Be the first to
                    register your business!
                  </>
                )}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              )}
              <Button
                className="mt-4 ml-2"
                onClick={() => setActiveTab("register")}
              >
                Register as Vendor
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  {" "}
                  <div className="h-48 overflow-hidden relative">
                    <Image
                      src={
                        vendor.photo ||
                        "https://cdns.sipmm.edu.sg/publication/wp-content/uploads/2020/02/15183231/Construction-and-Supplier-SIPMM.jpg"
                      }
                      alt={vendor.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg">{vendor.name}</h3>
                      {vendor.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {vendor.location}
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Package className="w-4 h-4 mr-1" />
                      {vendor.category}
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      Est. {vendor.established}
                    </div>

                    {vendor.rating && (
                      <div className="flex items-center mt-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="ml-1 text-sm font-medium">
                            {vendor.rating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500 ml-2">
                          ({vendor.reviews} reviews)
                        </span>
                      </div>
                    )}

                    <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {vendor.description}
                    </div>

                    {vendor.products && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-1">Products:</p>
                        <div className="flex flex-wrap gap-1">
                          {vendor.products.slice(0, 4).map((product, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                            >
                              {product}
                            </span>
                          ))}
                          {vendor.products.length > 4 && (
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                              +{vendor.products.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex justify-between">
                      <span className="text-xs text-gray-500">
                        {vendor.completedTransactions} transactions
                      </span>
                      {vendor.whatsAppNumber && (
                        <a
                          href={`https://wa.me/${vendor.whatsAppNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded flex items-center"
                        >
                          <MessageSquare className="w-3 h-3 mr-1" />
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="register" className="space-y-6">
          {submitSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-green-800 mb-2">
                Submission Successful!
              </h3>
              <p className="text-green-700 mb-4">
                Thank you for registering your vendor information. Our team will
                review your submission and it will be listed after verification.
              </p>
              <Button
                onClick={() => {
                  setSubmitSuccess(false);
                  setActiveTab("browse");
                }}
              >
                Browse Vendors
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">
                Register as a Building Materials Vendor
              </h2>
              <p className="text-gray-600 mb-6">
                Fill out the form below to register your business as a vendor on
                our platform. Your information will be reviewed before being
                listed.
              </p>

              <form onSubmit={handleVendorSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Business name */}
                  <div>
                    <Label htmlFor="name">
                      Business Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={vendorForm.name}
                      onChange={handleInputChange}
                      placeholder="Enter your business name"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <Label htmlFor="category">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="category"
                      name="category"
                      value={vendorForm.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select a category</option>
                      {categoryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* State */}
                  <div>
                    <Label htmlFor="state">
                      State <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="state"
                      name="state"
                      value={vendorForm.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select a state</option>
                      {nigerianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={vendorForm.city}
                      onChange={handleInputChange}
                      placeholder="Enter city"
                    />
                  </div>

                  {/* Year established */}
                  <div>
                    <Label htmlFor="established">Year Established</Label>
                    <select
                      id="established"
                      name="established"
                      value={vendorForm.established}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select years in business</option>
                      {establishmentOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Phone number */}
                  <div>
                    <Label htmlFor="phoneNumber">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={vendorForm.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., 08012345678"
                      required
                    />
                  </div>

                  {/* WhatsApp number */}
                  <div>
                    <Label htmlFor="whatsAppNumber">
                      WhatsApp Number (if different)
                    </Label>
                    <Input
                      id="whatsAppNumber"
                      name="whatsAppNumber"
                      value={vendorForm.whatsAppNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., 08012345678"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={vendorForm.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                    />
                  </div>

                  {/* Website */}
                  <div>
                    <Label htmlFor="websiteUrl">Website (if available)</Label>
                    <Input
                      id="websiteUrl"
                      name="websiteUrl"
                      value={vendorForm.websiteUrl}
                      onChange={handleInputChange}
                      placeholder="e.g., https://yourwebsite.com"
                    />
                  </div>

                  {/* Products */}
                  <div className="md:col-span-2">
                    <Label htmlFor="products">Products (comma separated)</Label>
                    <Input
                      id="products"
                      name="products"
                      value={vendorForm.products}
                      onChange={handleInputChange}
                      placeholder="e.g., Cement, Bricks, Sand, Gravel"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Business Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={vendorForm.description}
                      onChange={handleInputChange}
                      placeholder="Describe your business, products, and services"
                      rows={4}
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : "Submit Vendor Information"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Vendors;
