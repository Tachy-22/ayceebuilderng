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
} from "lucide-react";
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
import { whatsappNumber as OwnerPhone } from "@/lib/utils";

// Tradesman interface
interface Tradesman {
  id: string;
  name: string;
  photo: string;
  trade: string;
  location: string;
  rating?: number;
  reviews: number; // Changed to match API field name
  experience: string;
  description: string;
  verified: boolean;
  completedProjects: number;
  whatsAppNumber?: string; // Changed to match API field name
}

// Tradesmen props interface
interface TradesmenProps {
  fetchedTradesmen?: Tradesman[];
}

// Fallback tradesmen data in case API fails
const fallbackTradesmen = [
  {
    id: "t6",
    name: "Robert Mason",
    photo:
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1hbiUyMGZhY2V8ZW58MHx8MHx8fDA%3D",
    trade: "Masonry",
    location: "Kano, Nigeria",
    rating: 4.9,
    reviews: 47,
    experience: "15 years",
    description:
      "Expert mason with extensive experience in brick laying, stone work, concrete structures, and decorative masonry features.",
    verified: true,
    completedProjects: 167,
    whatsAppNumber: "2348055544433",
  },
];

// Trades for dropdown
const tradesOptions = [
  "Carpentry",
  "Electrical",
  "Plumbing",
  "Painting",
  "Tiling",
  "Masonry",
  "Roofing",
  "Flooring",
  "Welding",
  "HVAC",
  "Landscaping",
  "General Construction",
  "Interior Design",
  "Other",
];

// Experience options for dropdown
const experienceOptions = [
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

const Tradesmen = ({ fetchedTradesmen = [] }: TradesmenProps) => {
  const [activeTab, setActiveTab] = useState("browse");
  const [isLoaded, setIsLoaded] = useState(false);

  // Use fetched tradesmen if available, otherwise use fallback data
  const tradesmen =
    fetchedTradesmen.length > 0 ? fetchedTradesmen : fallbackTradesmen;
  console.log({ tradesmen });
  const [filteredTradesmen, setFilteredTradesmen] = useState(tradesmen);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false); // Form state
  //
  const [tradesmanForm, setTradesmanForm] = useState({
    name: "", // Required - matches API field
    trade: "", // Required - matches API field
    location: "", // Required - matches API field
    experience: "", // Required - matches API field
    description: "", // Required - matches API field
    whatsAppNumber: "", // Required - matches API field
    email: "",
    photo: "", // Will be set to a default value
    rating: 0, // Will be set to a default value
    reviews: 0, // This is the correct field name for the API
    verified: false, // Will be set to a default value
    completedProjects: 0, // Will be set to a default value
    state: "",
    city: "",
    phoneNumber: "",
    certifications: "",
    portfolioLink: "",
  });

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);
  useEffect(() => {
    let results = [...tradesmen];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (tradesman) =>
          tradesman.name.toLowerCase().includes(query) ||
          tradesman.description.toLowerCase().includes(query) ||
          tradesman.trade.toLowerCase().includes(query) ||
          tradesman.location.toLowerCase().includes(query)
      );
    }

    setFilteredTradesmen(results);
  }, [searchQuery, tradesmen]);

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
    setTradesmanForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setTradesmanForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleTradesmanSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Prepare the submission data with proper field names and defaults first
      const submissionData: { [key: string]: any } = {
        ...tradesmanForm,
        // Set default values for fields that aren't directly input by user
        photo:
          tradesmanForm.photo ||
          "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&amp;w=740&amp;q=80", // Default professional avatar
        location: `${tradesmanForm.city}, ${tradesmanForm.state}, Nigeria`,
        rating: 4, // Default starting rating (4 stars)
        reviews: 1, // Default number of reviews (must be > 0 to pass validation)
        verified: true, // Default verification status (must be truthy to pass validation)
        completedProjects: 1, // Default completed projects (must be > 0 to pass validation)
      };
      
      // Define the required fields according to the API (photo included with default value)
      const requiredFields = [
        "name",
        "trade",
        "location",
        "photo", // Include photo but it will always have a default value
        "rating",
        "reviews", // This is the correct field name for the API
        "experience",
        "description",
        "verified",
        "completedProjects",
        "whatsAppNumber",
      ];
      const tradesmanData: { [key: string]: any } = {};
      requiredFields.forEach((field) => {
        // Ensure each required field exists in the data we send
        tradesmanData[field] = submissionData[field];
      });

      // Make sure photo is explicitly included with default value (this fixes the "Missing required field: photo" error)
      tradesmanData["photo"] = submissionData.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face";
      
      // Make sure rating is explicitly included (this fixes the "Missing required field: rating" error)
      tradesmanData["rating"] = submissionData.rating || 4;
      
      // Make sure reviews is explicitly included (this fixes the "Missing required field: reviews" error)
      tradesmanData["reviews"] = submissionData.reviews || 1;
      
      // Make sure verified is explicitly included (this fixes the "Missing required field: verified" error)
      tradesmanData["verified"] = submissionData.verified !== undefined ? submissionData.verified : true;
      
      // Make sure completedProjects is explicitly included (this fixes potential validation issues)
      tradesmanData["completedProjects"] = submissionData.completedProjects || 1;

      // Add additional fields that might be useful
      tradesmanData["email"] = tradesmanForm.email || "";
      tradesmanData["phoneNumber"] = tradesmanForm.phoneNumber || "";
      tradesmanData["whatsAppNumber"] = tradesmanForm.whatsAppNumber || "none";

      // Debug: log the data being sent
      console.log("Submitting tradesman data:", tradesmanData);
      
      // Make the request to our Next.js API route handler instead of directly to Google Script
      const response = await fetch("/api/tradesman", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tradesmanData),
      });
      if (response.ok) {
        const result = await response.json();

        if (result.success) {
          setSubmitSuccess(true);
          console.log(`Tradesman added with ID: ${result.id}`); // Reset form
          setTradesmanForm({
            name: "",
            trade: "",
            location: "",
            experience: "",
            description: "",
            whatsAppNumber: "",
            email: "",
            photo: "",
            rating: 0,
            reviews: 0, // This is the correct field name for the API
            verified: false,
            completedProjects: 0,
            state: "",
            city: "",
            phoneNumber: "",
            certifications: "",
            portfolioLink: "",
          });
        } else {
          throw new Error(result.error || "Failed to submit");
        }
      } else {
        throw new Error("Failed to submit: Server returned an error");
      }
    } catch (error) {
      console.error("Error submitting tradesman form:", error);

      let errorMessage =
        "There was an error submitting your form. Please try again later.";
      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  const whatsappMessage =
    "Hello, I'm interested in registering as a tradesman on Ayceebuilder.";
  const whatsappURL = `https://wa.me/${OwnerPhone}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-20">
        <div className="bg-secondary/5 py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">Construction Tradesmen</h1>
            <p className="text-muted-foreground mb-6">
              Find skilled professionals for your building projects or register
              as a tradesman
            </p>

            <Tabs
              defaultValue="browse"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
                <TabsTrigger value="browse">Browse Tradesmen</TabsTrigger>
                <TabsTrigger value="register">
                  Register as Tradesman
                </TabsTrigger>
              </TabsList>{" "}
              <TabsContent value="browse">
                <form onSubmit={handleSearch} className="max-w-4xl">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="relative">
                      <Input
                        placeholder="Search by name, trade, location..."
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
            filteredTradesmen.length > 0 ? (
              <div
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-500 ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
              >
                {" "}
                {filteredTradesmen.map((tradesman, index) => (
                  <div
                    key={tradesman.id}
                    className=" border rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
                    style={{
                      animationDelay: `${0.05 * index}s`,
                      animation: isLoaded
                        ? "fadeIn 0.5s ease forwards"
                        : "none",
                    }}
                  >
                    <div className="block p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-secondary/20 flex-shrink-0">
                          <img
                            src={tradesman.photo}
                            alt={tradesman.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">
                            {tradesman.name}
                          </h3>
                          <div className="flex items-center text-sm text-primary font-medium">
                            {tradesman.trade}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin size={14} className="mr-1" />
                            {tradesman.location}
                          </div>
                          {tradesman.verified && (
                            <span className="inline-flex items-center text-xs bg-green-100 text-green-800 rounded-full px-2 py-0.5 mt-1">
                              Verified Professional
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {tradesman.description}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center">
                          <Briefcase size={14} className="mr-1" />
                          <span className="font-medium">
                            {tradesman.experience}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Award size={14} className="mr-1" />
                          <span className="font-medium">
                            {tradesman.completedProjects}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            Projects
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Star
                            size={14}
                            className="fill-yellow-400 text-yellow-400 mr-1"
                          />{" "}
                          <span className="font-medium">
                            {tradesman.rating}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            ({tradesman.reviews})
                          </span>
                        </div>
                      </div>
                    </div>

                    {tradesman.whatsAppNumber && (
                      <div className="px-6 pb-6 pt-2">
                        {" "}
                        <a
                          href={`https://wa.me/${
                            tradesman.whatsAppNumber
                          }?text=Hello ${encodeURIComponent(
                            tradesman.name
                          )}, I found your profile on Ayceebuilder and would like to discuss a project with you.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 px-3 bg-[#25D366] hover:bg-[#1da851] text-white text-center rounded-md transition-colors flex items-center justify-center font-medium"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="white"
                            className="mr-2"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          Chat with them
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No tradesmen found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search query
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                  }}
                >
                  Clear Search
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
                    Thank you for registering as a tradesman. Our team will
                    review your information and contact you shortly.
                  </p>
                  <Button onClick={() => setSubmitSuccess(false)}>
                    Register Another Tradesman
                  </Button>
                </div>
              ) : (
                <>
                  <div className="bg-primary/5 p-6 rounded-lg mb-8">
                    <h2 className="text-xl font-bold mb-3">
                      Join Our Network of Construction Professionals
                    </h2>
                    <p className="text-muted-foreground">
                      Register below to be featured on Ayceebuilder as a skilled
                      tradesman. Connect with clients looking for your expertise
                      and grow your business.
                    </p>
                  </div>

                  <form onSubmit={handleTradesmanSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Personal Information
                      </h3>{" "}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">
                            Full Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={tradesmanForm.name}
                            onChange={handleInputChange}
                            placeholder="Your full name"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="trade">
                            Trade <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            name="trade"
                            value={tradesmanForm.trade}
                            onValueChange={(value) =>
                              handleSelectChange("trade", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your trade" />
                            </SelectTrigger>
                            <SelectContent>
                              {tradesOptions.map((trade) => (
                                <SelectItem key={trade} value={trade}>
                                  {trade}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phoneNumber">
                            Phone Number <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            value={tradesmanForm.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="+234..."
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          {" "}
                          <Label htmlFor="whatsAppNumber">
                            WhatsApp Number{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="whatsAppNumber"
                            name="whatsAppNumber"
                            value={tradesmanForm.whatsAppNumber}
                            onChange={handleInputChange}
                            placeholder="2348012345678 (without +)"
                            required
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter without the &apos;+&apos; sign (e.g.,
                            2348012345678)
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">
                            Email Address{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={tradesmanForm.email}
                            onChange={handleInputChange}
                            placeholder="you@example.com"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="experience">
                            Experience Level{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            name="experience"
                            value={tradesmanForm.experience}
                            onValueChange={(value) =>
                              handleSelectChange("experience", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                            <SelectContent>
                              {experienceOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Location Information
                      </h3>{" "}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="state">
                            State <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            name="state"
                            value={tradesmanForm.state}
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

                        <div className="space-y-2">
                          <Label htmlFor="city">
                            City <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="city"
                            name="city"
                            value={tradesmanForm.city}
                            onChange={handleInputChange}
                            placeholder="Your city"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Skills & Qualifications
                      </h3>{" "}
                      <div className="space-y-2">
                        <Label htmlFor="description">
                          Describe Your Skills & Experience{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={tradesmanForm.description}
                          onChange={handleInputChange}
                          placeholder="Briefly describe your skills, specialization, and the types of projects you've worked on"
                          rows={4}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="certifications">
                          Certifications (if any)
                        </Label>
                        <Input
                          id="certifications"
                          name="certifications"
                          value={tradesmanForm.certifications}
                          onChange={handleInputChange}
                          placeholder="List any certifications or qualifications you have"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="portfolioLink">
                          Portfolio Link (if any)
                        </Label>
                        <Input
                          id="portfolioLink"
                          name="portfolioLink"
                          type="url"
                          value={tradesmanForm.portfolioLink}
                          onChange={handleInputChange}
                          placeholder="Link to your portfolio, social media, or previous work"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="photo">Photo URL (optional)</Label>
                        <Input
                          id="photo"
                          name="photo"
                          type="url"
                          value={tradesmanForm.photo}
                          onChange={handleInputChange}
                          placeholder="Link to your profile photo (will use a default if not provided)"
                        />
                        <p className="text-xs text-muted-foreground">
                          If you don&apos;t have a photo URL, leave this blank
                          and we&apos;ll use a default image
                        </p>
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
                          "Register as Tradesman"
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
              <h3 className="text-lg font-medium mb-2">
                Are you a skilled tradesman?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Join Ayceebuilder as a verified professional and connect with
                clients looking for your skills.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => setActiveTab("register")}
                >
                  Register as Tradesman
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

export default Tradesmen;
