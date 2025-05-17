"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Star, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { whatsappNumber } from "@/lib/utils";

// Mock vendors data
const vendors = [
  {
    id: "v1",
    name: "AceCement Nigeria Ltd",
    logo: "https://images.unsplash.com/photo-1521791055366-0d553872125f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGxvZ298ZW58MHx8MHx8fDA%3D",
    location: "Lagos, Nigeria",
    rating: 4.8,
    reviewCount: 124,
    description:
      "Leading supplier of high-quality cement and concrete products for all construction needs.",
    verified: true,
    yearsActive: 12,
    productCount: 48,
  },
  {
    id: "v2",
    name: "SteelMasters International",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGxvZ298ZW58MHx8MHx8fDA%3D",
    location: "Abuja, Nigeria",
    rating: 4.6,
    reviewCount: 98,
    description:
      "Premier provider of structural steel and metal products for construction projects of all sizes.",
    verified: true,
    yearsActive: 8,
    productCount: 36,
  },
  {
    id: "v3",
    name: "TileWorld Nigeria",
    logo: "https://images.unsplash.com/photo-1622632169740-85c306c57aa2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGxvZ298ZW58MHx8MHx8fDA%3D",
    location: "Port Harcourt, Nigeria",
    rating: 4.7,
    reviewCount: 76,
    description:
      "Extensive collection of premium ceramic and porcelain tiles for flooring and wall applications.",
    verified: true,
    yearsActive: 5,
    productCount: 120,
  },
  {
    id: "v4",
    name: "ElectroWorks Nigeria",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGxvZ298ZW58MHx8MHx8fDA%3D",
    location: "Kano, Nigeria",
    rating: 4.5,
    reviewCount: 62,
    description:
      "Complete range of electrical products and solutions for residential and commercial construction.",
    verified: true,
    yearsActive: 7,
    productCount: 85,
  },
  {
    id: "v5",
    name: "LumberKing Enterprises",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGxvZ298ZW58MHx8MHx8fDA%3D",
    location: "Enugu, Nigeria",
    rating: 4.4,
    reviewCount: 53,
    description:
      "Quality timber, plywood, and wood products sourced sustainably for construction projects.",
    verified: false,
    yearsActive: 4,
    productCount: 42,
  },
  {
    id: "v6",
    name: "NigeriaGlass & Aluminium",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGxvZ298ZW58MHx8MHx8fDA%3D",
    location: "Lagos, Nigeria",
    rating: 4.9,
    reviewCount: 87,
    description:
      "Specialized in glass products, windows, doors, and aluminum framing for modern construction.",
    verified: true,
    yearsActive: 9,
    productCount: 64,
  },
];

// Product categories for dropdown
const productCategories = [
  "Tiles",
  "Electrical",
  "Paint",
  "Sanitary Ware",
  "Cladding",
  "Adhesives & Admixtures",
  "Plumbing",
  "Lighting",
  "Cement & Concrete",
  "Roofing",
  "Steel & Metal",
  "Wood & Timber",
  "Glass & Aluminum",
  "Other",
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

const Vendors = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [isLoaded, setIsLoaded] = useState(false);
  const [filteredVendors, setFilteredVendors] = useState(vendors);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form state
  const [vendorForm, setVendorForm] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    address: "",
    businessType: "",
    productCategories: "",
    description: "",
    yearsInBusiness: "",
    website: "",
    socialMedia: "",
  });

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  useEffect(() => {
    let results = [...vendors];

    if (searchQuery) {
      results = results.filter(
        (vendor) =>
          vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vendor.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (locationFilter) {
      results = results.filter((vendor) =>
        vendor.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setFilteredVendors(results);
  }, [searchQuery, locationFilter]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Search is already handled by the useEffect
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
      // Create form data in the format required by Google Sheets API
      const formData = new FormData();
      Object.entries(vendorForm).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // This would be your API endpoint that connects to Google Sheets
      const response = await fetch("/api/submit-vendor", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSubmitSuccess(true);
        // Reset form
        setVendorForm({
          companyName: "",
          contactPerson: "",
          email: "",
          phone: "",
          state: "",
          city: "",
          address: "",
          businessType: "",
          productCategories: "",
          description: "",
          yearsInBusiness: "",
          website: "",
          socialMedia: "",
        });
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      console.error("Error submitting vendor form:", error);
      alert("There was an error submitting your form. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage =
    "Hello, I'm interested in becoming a vendor on Ayceebuilder.";
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-20">
        <div className="bg-secondary/5 py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">Vendor Portal</h1>
            <p className="text-muted-foreground mb-6">
              Browse our verified suppliers or register your business as a
              vendor
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <Input
                      placeholder="Search vendors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                    <Input
                      placeholder="Filter by location..."
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full"
                    />
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
            filteredVendors.length > 0 ? (
              <div
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-500 ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
              >
                {filteredVendors.map((vendor, index) => (
                  <Link
                    key={vendor.id}
                    href={`/vendors/${vendor.id}`}
                    className="block border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                    style={{
                      animationDelay: `${0.05 * index}s`,
                      animation: isLoaded
                        ? "fadeIn 0.5s ease forwards"
                        : "none",
                    }}
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-secondary/20 flex-shrink-0">
                          <img
                            src={vendor.logo}
                            alt={vendor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">{vendor.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin size={14} className="mr-1" />
                            {vendor.location}
                          </div>
                          {vendor.verified && (
                            <span className="inline-flex items-center text-xs bg-green-100 text-green-800 rounded-full px-2 py-0.5 mt-1">
                              Verified Vendor
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {vendor.description}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="font-medium">
                            {vendor.productCount}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            Products
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">
                            {vendor.yearsActive} years
                          </span>
                          <span className="text-muted-foreground ml-1">
                            on Ayceebuilder
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Star
                            size={14}
                            className="fill-yellow-400 text-yellow-400 mr-1"
                          />
                          <span className="font-medium">{vendor.rating}</span>
                          <span className="text-muted-foreground ml-1">
                            ({vendor.reviewCount})
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No vendors found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or location filter
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setLocationFilter("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )
          ) : (
            // Registration form tab
            <div className="max-w-3xl mx-auto">
              {submitSuccess ? (
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
                    Thank you for registering as a vendor. Our team will review
                    your information and contact you shortly.
                  </p>
                  <Button onClick={() => setSubmitSuccess(false)}>
                    Register Another Vendor
                  </Button>
                </div>
              ) : (
                <>
                  <div className="bg-primary/5 p-6 rounded-lg mb-8">
                    <h2 className="text-xl font-bold mb-3">
                      Become a Vendor on Ayceebuilder
                    </h2>
                    <p className="text-muted-foreground">
                      Fill out the form below to register your business as a
                      vendor. Our team will review your information and get back
                      to you within 48 hours.
                    </p>
                  </div>

                  <form onSubmit={handleVendorSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Business Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="companyName">
                            Company Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="companyName"
                            name="companyName"
                            value={vendorForm.companyName}
                            onChange={handleInputChange}
                            placeholder="Your company name"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="businessType">
                            Business Type{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            name="businessType"
                            value={vendorForm.businessType}
                            onValueChange={(value) =>
                              handleSelectChange("businessType", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select business type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="manufacturer">
                                Manufacturer
                              </SelectItem>
                              <SelectItem value="distributor">
                                Distributor
                              </SelectItem>
                              <SelectItem value="retailer">Retailer</SelectItem>
                              <SelectItem value="wholesaler">
                                Wholesaler
                              </SelectItem>
                              <SelectItem value="importer">Importer</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="productCategories">
                          Product Categories{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          name="productCategories"
                          value={vendorForm.productCategories}
                          onValueChange={(value) =>
                            handleSelectChange("productCategories", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select product category" />
                          </SelectTrigger>
                          <SelectContent>
                            {productCategories.map((category) => (
                              <SelectItem
                                key={category}
                                value={category
                                  .toLowerCase()
                                  .replace(/\s+/g, "")}
                              >
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">
                          Business Description{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={vendorForm.description}
                          onChange={handleInputChange}
                          placeholder="Briefly describe your business and products"
                          rows={4}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="yearsInBusiness">
                            Years in Business
                          </Label>
                          <Input
                            id="yearsInBusiness"
                            name="yearsInBusiness"
                            type="number"
                            min="0"
                            value={vendorForm.yearsInBusiness}
                            onChange={handleInputChange}
                            placeholder="e.g. 5"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="website">Website (if any)</Label>
                          <Input
                            id="website"
                            name="website"
                            type="url"
                            value={vendorForm.website}
                            onChange={handleInputChange}
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="socialMedia">
                          Social Media Handles (if any)
                        </Label>
                        <Input
                          id="socialMedia"
                          name="socialMedia"
                          value={vendorForm.socialMedia}
                          onChange={handleInputChange}
                          placeholder="Instagram: @example, Facebook: @example"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Contact Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactPerson">
                            Contact Person{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="contactPerson"
                            name="contactPerson"
                            value={vendorForm.contactPerson}
                            onChange={handleInputChange}
                            placeholder="Full name"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">
                            Email Address{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={vendorForm.email}
                            onChange={handleInputChange}
                            placeholder="you@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">
                            Phone Number <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={vendorForm.phone}
                            onChange={handleInputChange}
                            placeholder="+234..."
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="state">
                            State <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            name="state"
                            value={vendorForm.state}
                            onValueChange={(value) =>
                              handleSelectChange("state", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {nigerianStates.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">
                            City <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="city"
                            name="city"
                            value={vendorForm.city}
                            onChange={handleInputChange}
                            placeholder="Your city"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">
                          Business Address{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="address"
                          name="address"
                          value={vendorForm.address}
                          onChange={handleInputChange}
                          placeholder="Your business address"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                        size="lg"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Register as Vendor"
                        )}
                      </Button>
                      <p className="text-sm text-muted-foreground text-center mt-2">
                        By registering, you agree to our Terms of Service and
                        Privacy Policy.
                      </p>
                    </div>
                  </form>
                </>
              )}
            </div>
          )}

          {activeTab === "browse" && (
            <div className="mt-10 bg-secondary/5 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-2">Are you a vendor?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Join Ayceebuilder as a verified vendor and start selling your
                construction materials to thousands of customers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => setActiveTab("register")}
                >
                  Register as Vendor
                </Button>
                <a
                  href={whatsappURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full">
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="#25D366"
                        className="mr-2"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Contact Support <ArrowRight size={16} className="ml-2" />
                    </span>
                  </Button>
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Vendors;
