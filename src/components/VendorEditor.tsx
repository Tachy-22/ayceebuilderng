"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Plus, X, Star, Store } from "lucide-react";
import { Button } from "./ui/button";
import { FileInput } from "./FileInput";
import SubmitButton from "./ui/SubmitButton";
import { updateDocument } from "@/app/actions/updateDocument";
import { addDocument } from "@/app/actions/addDocument";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Vendor, VendorFormData } from "@/types/vendor";
import Image from "next/image";
import GooglePlacesAutocomplete from "./ui/GooglePlacesAutocomplete";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VendorEditorProps {
  update?: boolean;
  vendor?: Vendor;
  onClose?: () => void;
}

const VendorEditor: React.FC<VendorEditorProps> = ({
  update = false,
  vendor,
  onClose,
}) => {
  const router = useRouter();
  const path = usePathname();

  const defaultVendorData: VendorFormData = {
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "",
    description: "",
    location: "",
    website: "",
    profileImage: "",
    businessImages: [],
    licenseDocuments: [],
    featured: false,
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

  const [vendorData, setVendorData] = useState<VendorFormData>(
    update && vendor ? { ...vendor } : defaultVendorData
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceInput, setServiceInput] = useState("");
  const [specializationInput, setSpecializationInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleProfileImageUpload = (files: FileMetadata[]) => {
    if (files.length > 0) {
      setVendorData((prev) => ({
        ...prev,
        profileImage: files[0].url,
      }));
    }
  };

  const handleBusinessImagesUpload = (files: FileMetadata[]) => {
    const urls = files.map((file) => file.url);
    setVendorData((prev) => ({
      ...prev,
      businessImages: urls,
    }));
  };

  const handleLicenseUpload = (files: FileMetadata[]) => {
    const urls = files.map((file) => file.url);
    setVendorData((prev) => ({
      ...prev,
      licenseDocuments: urls,
    }));
  };

  useEffect(() => {
    if (update && vendor) {
      setVendorData(vendor);
    }
  }, [update, vendor]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!vendorData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!vendorData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(vendorData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!vendorData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!vendorData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }

    if (!vendorData.businessType.trim()) {
      newErrors.businessType = "Business type is required";
    }

    if (!vendorData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!vendorData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (vendorData.licenseDocuments.length === 0) {
      newErrors.licenseDocuments = "At least one license document is required";
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
      setVendorData((prev) => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [socialField]: value,
        },
      }));
    } else if (name.startsWith('workingHours.')) {
      const dayField = name.split('.')[1];
      setVendorData((prev) => ({
        ...prev,
        workingHours: {
          ...prev.workingHours,
          [dayField]: value,
        },
      }));
    } else {
      setVendorData((prev) => ({
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
    setVendorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setVendorData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddService = () => {
    if (serviceInput.trim()) {
      const newService = serviceInput.trim();
      if (!vendorData.services.includes(newService)) {
        setVendorData((prev) => ({
          ...prev,
          services: [...prev.services, newService],
        }));
      }
      setServiceInput("");
    }
  };

  const handleRemoveService = (serviceToRemove: string) => {
    setVendorData((prev) => ({
      ...prev,
      services: prev.services.filter((service) => service !== serviceToRemove),
    }));
  };

  const handleAddSpecialization = () => {
    if (specializationInput.trim()) {
      const newSpecialization = specializationInput.trim();
      if (!vendorData.specializations.includes(newSpecialization)) {
        setVendorData((prev) => ({
          ...prev,
          specializations: [...prev.specializations, newSpecialization],
        }));
      }
      setSpecializationInput("");
    }
  };

  const handleRemoveSpecialization = (specializationToRemove: string) => {
    setVendorData((prev) => ({
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

      const updatedVendorData = {
        ...vendorData,
        updatedAt: new Date().toISOString(),
        createdAt:  new Date().toISOString(),
        rating: vendor?.rating || 0,
        reviewCount: vendor?.reviewCount || 0,
        verified: vendor?.verified || false,
      };

      if (update && vendor) {
        const result = await updateDocument(
          "vendors",
          vendor.id,
          updatedVendorData,
          path
        );
        if ("success" in result && result.success) {
          toast.success("Vendor updated successfully");
          onClose?.();
          router.refresh();
        } else {
          toast.error(
            "message" in result ? result.message : "Failed to update vendor"
          );
        }
      } else {
        const result = await addDocument("vendors", updatedVendorData, path);
        if ("success" in result && result.success) {
          toast.success("Vendor created successfully");
          setVendorData(defaultVendorData);
          onClose?.();
          router.refresh();
        } else {
          toast.error(
            "message" in result ? result.message : "Failed to create vendor"
          );
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const businessTypes = [
    "Construction Company",
    "Building Materials Supplier",
    "Hardware Store",
    "Electrical Supplier",
    "Plumbing Supplier",
    "Paint & Decoration Store",
    "Tile & Flooring Specialist",
    "Roofing Contractor",
    "HVAC Supplier",
    "Landscaping Supplier",
    "General Contractor",
    "Specialty Tools & Equipment"
  ];

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="h-full flex flex-col">
      <form className="flex flex-col gap-6 h-full" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 min-h-0">
          {/* Vendor Form */}
          <div className="lg:col-span-3 bg-gray-50 rounded-lg p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Vendor Details</h3>
            <div className="flex flex-col gap-4">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={vendorData.name}
                    onChange={handleChange}
                    className={`w-full border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter full name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={vendorData.email}
                    onChange={handleChange}
                    className={`w-full border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter email address"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={vendorData.phone}
                    onChange={handleChange}
                    className={`w-full border ${errors.phone ? "border-red-500" : "border-gray-300"} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="businessName" className="block font-medium text-gray-700 mb-1">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={vendorData.businessName}
                    onChange={handleChange}
                    className={`w-full border ${errors.businessName ? "border-red-500" : "border-gray-300"} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter business name"
                  />
                  {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Business Type <span className="text-red-500">*</span>
                  </label>
                  <Select value={vendorData.businessType} onValueChange={(value) => handleSelectChange('businessType', value)}>
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
                  <Select value={vendorData.priceRange} onValueChange={(value) => handleSelectChange('priceRange', value)}>
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
              </div>

              <div>
                <label htmlFor="yearsOfExperience" className="block font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  value={vendorData.yearsOfExperience}
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
                  value={vendorData.website || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>

              {/* Admin Only Fields - Rating and Reviews */}
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <label htmlFor="rating" className="block font-medium text-gray-700 mb-1">
                    Rating (Admin Only)
                  </label>
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    value={vendorData.rating || 0}
                    onChange={handleChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.0"
                  />
                </div>

                <div>
                  <label htmlFor="reviewCount" className="block font-medium text-gray-700 mb-1">
                    Review Count (Admin Only)
                  </label>
                  <input
                    type="number"
                    id="reviewCount"
                    name="reviewCount"
                    value={vendorData.reviewCount || 0}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <GooglePlacesAutocomplete
                  value={vendorData.location}
                  onChange={(value) => {
                    setVendorData((prev) => ({
                      ...prev,
                      location: value,
                    }));
                  }}
                  onPlaceSelect={(place) => {
                    setVendorData((prev) => ({
                      ...prev,
                      location: place.formatted_address || place.address,
                    }));
                  }}
                  label="Business Location"
                  placeholder="Enter business address"
                  className="w-full"
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              <div>
                <label htmlFor="description" className="block font-medium text-gray-700 mb-1">
                  Business Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={vendorData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full border ${errors.description ? "border-red-500" : "border-gray-300"} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Describe your business and services"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Profile Image */}
              <div className="border-t pt-4">
                <div className="pb-3 text-gray-900">
                  Profile Image
                </div>
                <FileInput
                  multiple={false}
                  accept="image/*"
                  maxFileSize={5}
                  onUploadComplete={handleProfileImageUpload}
                  initialFiles={vendorData.profileImage ? [vendorData.profileImage] : []}
                />
              </div>

              {/* Business Images */}
              <div className="border-t pt-4">
                <div className="pb-3 text-gray-900">
                  Business Images
                </div>
                <FileInput
                  multiple={true}
                  accept="image/*"
                  maxFileSize={5}
                  onUploadComplete={handleBusinessImagesUpload}
                  initialFiles={vendorData.businessImages || []}
                />
              </div>

              {/* License Documents */}
              <div className="border-t pt-4">
                <div className="pb-3 text-gray-900">
                National Identity Card <span className="text-red-500">*</span>
                </div>
                <FileInput
                  multiple={true}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  maxFileSize={10}
                  onUploadComplete={handleLicenseUpload}
                  initialFiles={vendorData.licenseDocuments || []}
                />
                {errors.licenseDocuments && <p className="text-red-500 text-sm mt-1">{errors.licenseDocuments}</p>}
              </div>

              {/* Services */}
              <div className="border-t pt-4">
                <label className="block font-medium text-gray-700 mb-1">Services Offered</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {vendorData.services.map((service) => (
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

              {/* Specializations */}
              <div className="border-t pt-4">
                <label className="block font-medium text-gray-700 mb-1">Specializations</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {vendorData.specializations.map((specialization) => (
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

              {/* Social Media */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-3">Social Media</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="socialMedia.facebook" className="block text-sm text-gray-600 mb-1">Facebook</label>
                    <input
                      type="url"
                      id="socialMedia.facebook"
                      name="socialMedia.facebook"
                      value={vendorData.socialMedia?.facebook || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Facebook URL"
                    />
                  </div>
                  <div>
                    <label htmlFor="socialMedia.instagram" className="block text-sm text-gray-600 mb-1">Instagram</label>
                    <input
                      type="url"
                      id="socialMedia.instagram"
                      name="socialMedia.instagram"
                      value={vendorData.socialMedia?.instagram || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Instagram URL"
                    />
                  </div>
                  <div>
                    <label htmlFor="socialMedia.twitter" className="block text-sm text-gray-600 mb-1">Twitter</label>
                    <input
                      type="url"
                      id="socialMedia.twitter"
                      name="socialMedia.twitter"
                      value={vendorData.socialMedia?.twitter || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Twitter URL"
                    />
                  </div>
                  <div>
                    <label htmlFor="socialMedia.linkedin" className="block text-sm text-gray-600 mb-1">LinkedIn</label>
                    <input
                      type="url"
                      id="socialMedia.linkedin"
                      name="socialMedia.linkedin"
                      value={vendorData.socialMedia?.linkedin || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="LinkedIn URL"
                    />
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-3">Working Hours</h4>
                <div className="grid grid-cols-1 gap-3">
                  {days.map((day) => (
                    <div key={day} className="flex items-center gap-4">
                      <label className="w-24 text-sm text-gray-600 capitalize">{day}</label>
                      <input
                        type="text"
                        name={`workingHours.${day}`}
                        value={vendorData.workingHours?.[day as keyof typeof vendorData.workingHours] || ""}
                        onChange={handleChange}
                        className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 9:00 AM - 5:00 PM or Closed"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="border-t pt-4 space-y-3">
                <h4 className="font-medium text-gray-700">Status</h4>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={vendorData.featured}
                    onCheckedChange={(checked) => handleCheckboxChange("featured", checked === true)}
                  />
                  <Label htmlFor="featured">Featured Vendor</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Vendor Preview */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-800">Preview</h3>
            </div>
            <div className="p-4">
              <div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow">
                <div className="relative h-48 overflow-hidden rounded-t-lg bg-gray-100">
                  {vendorData.profileImage ? (
                    <Image
                      src={vendorData.profileImage}
                      alt={vendorData.businessName || "Vendor"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Store className="h-16 w-16" />
                    </div>
                  )}
                  {vendorData.featured && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500">Featured</Badge>
                  )}
                </div>
                <div className="p-4">
                  <h5 className="text-lg font-semibold text-gray-900 mb-2">
                    {vendorData.businessName || "Business Name"}
                  </h5>
                  <p className="text-sm text-gray-600 mb-2">
                    {vendorData.businessType || "Business Type"}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    {vendorData.location || "Location"}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    {vendorData.description.substring(0, 100)}...
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{vendorData.yearsOfExperience} years experience</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {vendorData.services.slice(0, 3).map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {vendorData.services.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{vendorData.services.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4 border-t border-gray-200">
          {onClose && (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
          <SubmitButton
            disabled={isSubmitting}
            loadingtext="Saving..."
            className="flex-1 bg-primary text-white py-3 rounded font-medium hover:bg-primary/90 transition"
          >
            {update ? "Update Vendor" : "Create Vendor"}
          </SubmitButton>
        </div>
      </form>
    </div>
  );
};

export default VendorEditor;