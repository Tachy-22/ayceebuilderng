"use client";

import { useState } from "react";
import { Plus, X, Store } from "lucide-react";
import { Button } from "./ui/button";
import { FileInput } from "./FileInput";
import SubmitButton from "./ui/SubmitButton";
import { addDocument } from "@/app/actions/addDocument";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import Image from "next/image";
import GooglePlacesAutocomplete from "./ui/GooglePlacesAutocomplete";
import { getAllStateNames, getCitiesForState, validateStateCity } from "@/lib/nigerianLocations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VendorRegistrationFormProps {
  onSuccess?: () => void;
}

interface VendorRegistrationData {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  description: string;
  location: string;
  state: string;
  city: string;
  streetAddress: string;
  website?: string;
  profileImage?: string;
  businessImages: string[];
  licenseDocuments: string[];
  specializations: string[];
  yearsOfExperience: number;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  workingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  services: string[];
  priceRange: 'budget' | 'mid-range' | 'premium';
  status: 'pending';
}

const businessTypes = [
  'Manufacturer',
  'Wholesaler',
  'Retailer',
  'Distributor',
  'Service Provider',
  'Importer',
  'Exporter'
];

const VendorRegistrationForm: React.FC<VendorRegistrationFormProps> = ({
  onSuccess,
}) => {
  const defaultData: VendorRegistrationData = {
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "",
    description: "",
    location: "",
    state: "",
    city: "",
    streetAddress: "",
    website: "",
    profileImage: "",
    businessImages: [],
    licenseDocuments: [],
    specializations: [],
    yearsOfExperience: 0,
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
    },
    workingHours: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },
    services: [],
    priceRange: 'mid-range',
    status: 'pending',
  };

  const [formData, setFormData] = useState<VendorRegistrationData>(defaultData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceInput, setServiceInput] = useState("");
  const [specializationInput, setSpecializationInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleProfileImageUpload = (files: FileMetadata[]) => {
    if (files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        profileImage: files[0].url,
      }));
    }
  };

  const handleBusinessImagesUpload = (files: FileMetadata[]) => {
    const urls = files.map((file) => file.url);
    setFormData((prev) => ({
      ...prev,
      businessImages: urls,
    }));
  };

  const handleLicenseUpload = (files: FileMetadata[]) => {
    const urls = files.map((file) => file.url);
    setFormData((prev) => ({
      ...prev,
      licenseDocuments: urls,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }

    if (!formData.businessType.trim()) {
      newErrors.businessType = "Business type is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Business description is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = "Street address is required";
    }

    // Validate state-city combination
    if (formData.state && formData.city && !validateStateCity(formData.state, formData.city)) {
      newErrors.city = `${formData.city} is not a valid city in ${formData.state} state`;
    }

    if (formData.licenseDocuments.length === 0) {
      newErrors.licenseDocuments = "At least one business document is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('socialMedia.')) {
      const socialField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [socialField]: value,
        },
      }));
    } else if (name.startsWith('workingHours.')) {
      const dayField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        workingHours: {
          ...prev.workingHours,
          [dayField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddService = () => {
    if (serviceInput.trim()) {
      const newService = serviceInput.trim();
      if (!formData.services.includes(newService)) {
        setFormData((prev) => ({
          ...prev,
          services: [...prev.services, newService],
        }));
      }
      setServiceInput("");
    }
  };

  const handleRemoveService = (serviceToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((service) => service !== serviceToRemove),
    }));
  };

  const handleAddSpecialization = () => {
    if (specializationInput.trim()) {
      const newSpecialization = specializationInput.trim();
      if (!formData.specializations.includes(newSpecialization)) {
        setFormData((prev) => ({
          ...prev,
          specializations: [...prev.specializations, newSpecialization],
        }));
      }
      setSpecializationInput("");
    }
  };

  const handleRemoveSpecialization = (specializationToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((spec) => spec !== specializationToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setIsSubmitting(true);

      const submissionData = {
        ...formData,
        // Ensure location is properly formatted
        location: `${formData.streetAddress}, ${formData.city}, ${formData.state}, Nigeria`.replace(/^,\s*/, ''),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rating: 0,
        reviewCount: 0,
        verified: false,
        featured: false,
      };

      const result = await addDocument("vendors", submissionData, "/vendors");
      if ("success" in result && result.success) {
        toast.success("Registration submitted successfully! We'll review your application and contact you soon.");
        setFormData(defaultData);
        onSuccess?.();
      } else {
        toast.error(
          "message" in result ? result.message : "Failed to submit registration"
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Register as a Vendor</h2>
        <p className="text-gray-600">Join our platform and showcase your products to construction professionals.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Business Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
                Contact Person Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="businessName" className="block font-medium text-gray-700 mb-1">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className={`w-full border ${errors.businessName ? "border-red-500" : "border-gray-300"} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your business name"
              />
              {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your email address"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full border ${errors.phone ? "border-red-500" : "border-gray-300"} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your phone number"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Business Type <span className="text-red-500">*</span>
              </label>
              <Select value={formData.businessType} onValueChange={(value) => handleSelectChange('businessType', value)}>
                <SelectTrigger className={`w-full ${errors.businessType ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.businessType && <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <Select value={formData.priceRange} onValueChange={(value) => handleSelectChange('priceRange', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="mid-range">Mid-Range</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="yearsOfExperience" className="block font-medium text-gray-700 mb-1">
                Years of Experience
              </label>
              <input
                type="number"
                id="yearsOfExperience"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                min="0"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter years of experience"
              />
            </div>

            <div>
              <label htmlFor="website" className="block font-medium text-gray-700 mb-1">
                Website URL
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-3">Business Location <span className="text-red-500">*</span></h4>
            
            <div className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Street Address <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  className={`w-full border ${errors.streetAddress ? "border-red-500" : "border-gray-300"} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter your street address (e.g., 123 Allen Avenue)"
                />
                {errors.streetAddress && <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">State <span className="text-red-500">*</span></label>
                  <Select 
                    value={formData.state} 
                    onValueChange={(value) => {
                      setFormData(prev => ({ 
                        ...prev, 
                        state: value, 
                        city: '',
                        location: '' // Clear combined location when state changes
                      }));
                      if (errors.state) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.state;
                          return newErrors;
                        });
                      }
                    }}
                  >
                    <SelectTrigger className={`w-full ${errors.state ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48 overflow-y-auto">
                      {getAllStateNames().map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
                  <Select 
                    value={formData.city} 
                    onValueChange={(value) => {
                      setFormData(prev => ({ 
                        ...prev, 
                        city: value,
                        location: `${prev.streetAddress}, ${value}, ${prev.state}, Nigeria`.replace(/^,\s*/, '') // Update combined location
                      }));
                      if (errors.city) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.city;
                          return newErrors;
                        });
                      }
                    }}
                    disabled={!formData.state}
                  >
                    <SelectTrigger className={`w-full ${errors.city ? "border-red-500" : ""}`}>
                      <SelectValue placeholder={formData.state ? "Select City" : "Select State first"} />
                    </SelectTrigger>
                    <SelectContent className="max-h-48 overflow-y-auto">
                      {formData.state && getCitiesForState(formData.state).map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="description" className="block font-medium text-gray-700 mb-1">
              Business Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full border ${errors.description ? "border-red-500" : "border-gray-300"} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Describe your business, products, and services"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* Files */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Documents & Images</h3>
          
          <div className="space-y-4">
            <div>
              <div className="pb-3 text-gray-900">
                Business Logo/Profile Image
              </div>
              <FileInput
                multiple={false}
                accept="image/*"
                maxFileSize={5}
                onUploadComplete={handleProfileImageUpload}
                initialFiles={formData.profileImage ? [formData.profileImage] : []}
              />
            </div>

            <div>
              <div className="pb-3 text-gray-900">
                Business Images
              </div>
              <FileInput
                multiple={true}
                accept="image/*"
                maxFileSize={5}
                onUploadComplete={handleBusinessImagesUpload}
                initialFiles={formData.businessImages || []}
              />
            </div>

            <div>
              <div className="pb-3 text-gray-900">
                National Identity Card <span className="text-red-500">*</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Upload National Identity Card as an image
              </p>
              <FileInput
                multiple={false}
                accept=".jpg,.jpeg,.png"
                maxFileSize={10}
                onUploadComplete={handleLicenseUpload}
                initialFiles={formData.licenseDocuments || []}
              />
              {errors.licenseDocuments && <p className="text-red-500 text-sm mt-1">{errors.licenseDocuments}</p>}
            </div>
          </div>
        </div>

        {/* Services and Specializations */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Services & Specializations</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Services Offered</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.services.map((service) => (
                  <Badge key={service} variant="secondary" className="px-3 py-1">
                    {service}
                    <button
                      type="button"
                      onClick={() => handleRemoveService(service)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={serviceInput}
                  onChange={(e) => setServiceInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddService())}
                  className="flex-1 border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a service"
                />
                <Button
                  type="button"
                  onClick={handleAddService}
                  className="rounded-l-none bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Specializations</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.specializations.map((specialization) => (
                  <Badge key={specialization} variant="secondary" className="px-3 py-1">
                    {specialization}
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialization(specialization)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={specializationInput}
                  onChange={(e) => setSpecializationInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSpecialization())}
                  className="flex-1 border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a specialization"
                />
                <Button
                  type="button"
                  onClick={handleAddSpecialization}
                  className="rounded-l-none bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <SubmitButton
            disabled={isSubmitting}
            loadingtext="Submitting..."
            className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition"
          >
            Submit Registration
          </SubmitButton>
        </div>

        <div className="text-center text-sm text-gray-600">
          By registering, you agree to our Terms of Service and Privacy Policy. 
          Your application will be reviewed and you&quot;ll be contacted within 2-3 business days.
        </div>
      </form>
    </div>
  );
};

export default VendorRegistrationForm;