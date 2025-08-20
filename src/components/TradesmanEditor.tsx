"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Plus, X, Star, Hammer } from "lucide-react";
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
import { Tradesman, TradesmanFormData, TRADE_TYPES } from "@/types/tradesman";
import Image from "next/image";
import GooglePlacesAutocomplete from "./ui/GooglePlacesAutocomplete";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TradesmanEditorProps {
  update?: boolean;
  tradesman?: Tradesman;
  onClose?: () => void;
}

const TradesmanEditor: React.FC<TradesmanEditorProps> = ({
  update = false,
  tradesman,
  onClose,
}) => {
  const router = useRouter();
  const path = usePathname();

  const defaultTradesmanData: TradesmanFormData = {
    name: "",
    email: "",
    phone: "",
    trade: "",
    description: "",
    location: "",
    profileImage: "",
    workImages: [],
    licenseDocuments: [],
    featured: false,
    skills: [],
    yearsOfExperience: 0,
    certifications: [],
    availability: 'available',
    hourlyRate: 0,
    projectRate: 0,
    preferredPayment: [],
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
    emergencyAvailable: false,
    travelDistance: 0,
    languages: [],
    status: 'pending',
  };

  const [tradesmanData, setTradesmanData] = useState<TradesmanFormData>(
    update && tradesman ? { ...tradesman } : defaultTradesmanData
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [certificationInput, setCertificationInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");
  const [paymentInput, setPaymentInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleProfileImageUpload = (files: FileMetadata[]) => {
    if (files.length > 0) {
      setTradesmanData((prev) => ({
        ...prev,
        profileImage: files[0].url,
      }));
    }
  };

  const handleWorkImagesUpload = (files: FileMetadata[]) => {
    const urls = files.map((file) => file.url);
    setTradesmanData((prev) => ({
      ...prev,
      workImages: urls,
    }));
  };

  const handleLicenseUpload = (files: FileMetadata[]) => {
    const urls = files.map((file) => file.url);
    setTradesmanData((prev) => ({
      ...prev,
      licenseDocuments: urls,
    }));
  };

  useEffect(() => {
    if (update && tradesman) {
      setTradesmanData(tradesman);
    }
  }, [update, tradesman]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!tradesmanData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!tradesmanData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(tradesmanData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!tradesmanData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!tradesmanData.trade.trim()) {
      newErrors.trade = "Trade is required";
    }

    if (!tradesmanData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!tradesmanData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (tradesmanData.licenseDocuments.length === 0) {
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
      setTradesmanData((prev) => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [socialField]: value,
        },
      }));
    } else if (name.startsWith('workingHours.')) {
      const dayField = name.split('.')[1];
      setTradesmanData((prev) => ({
        ...prev,
        workingHours: {
          ...prev.workingHours,
          [dayField]: value,
        },
      }));
    } else {
      setTradesmanData((prev) => ({
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
    setTradesmanData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setTradesmanData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      const newSkill = skillInput.trim();
      if (!tradesmanData.skills.includes(newSkill)) {
        setTradesmanData((prev) => ({
          ...prev,
          skills: [...prev.skills, newSkill],
        }));
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setTradesmanData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleAddCertification = () => {
    if (certificationInput.trim()) {
      const newCertification = certificationInput.trim();
      if (!tradesmanData.certifications.includes(newCertification)) {
        setTradesmanData((prev) => ({
          ...prev,
          certifications: [...prev.certifications, newCertification],
        }));
      }
      setCertificationInput("");
    }
  };

  const handleRemoveCertification = (certificationToRemove: string) => {
    setTradesmanData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((cert) => cert !== certificationToRemove),
    }));
  };

  const handleAddLanguage = () => {
    if (languageInput.trim()) {
      const newLanguage = languageInput.trim();
      if (!tradesmanData.languages.includes(newLanguage)) {
        setTradesmanData((prev) => ({
          ...prev,
          languages: [...prev.languages, newLanguage],
        }));
      }
      setLanguageInput("");
    }
  };

  const handleRemoveLanguage = (languageToRemove: string) => {
    setTradesmanData((prev) => ({
      ...prev,
      languages: prev.languages.filter((lang) => lang !== languageToRemove),
    }));
  };

  const handleAddPayment = () => {
    if (paymentInput.trim()) {
      const newPayment = paymentInput.trim();
      if (!tradesmanData.preferredPayment.includes(newPayment)) {
        setTradesmanData((prev) => ({
          ...prev,
          preferredPayment: [...prev.preferredPayment, newPayment],
        }));
      }
      setPaymentInput("");
    }
  };

  const handleRemovePayment = (paymentToRemove: string) => {
    setTradesmanData((prev) => ({
      ...prev,
      preferredPayment: prev.preferredPayment.filter((payment) => payment !== paymentToRemove),
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

      const updatedTradesmanData = {
        ...tradesmanData,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        rating: tradesman?.rating || 0,
        reviewCount: tradesman?.reviewCount || 0,
        verified: tradesman?.verified || false,
      };

      if (update && tradesman) {
        const result = await updateDocument(
          "tradesmen",
          tradesman.id,
          updatedTradesmanData,
          path
        );
        if ("success" in result && result.success) {
          toast.success("Tradesman updated successfully");
          onClose?.();
          router.refresh();
        } else {
          toast.error(
            "message" in result ? result.message : "Failed to update tradesman"
          );
        }
      } else {
        const result = await addDocument("tradesmen", updatedTradesmanData, path);
        if ("success" in result && result.success) {
          toast.success("Tradesman created successfully");
          setTradesmanData(defaultTradesmanData);
          onClose?.();
          router.refresh();
        } else {
          toast.error(
            "message" in result ? result.message : "Failed to create tradesman"
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

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="h-full flex flex-col">
      <form className="flex flex-col gap-6 h-full" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 min-h-0">
          {/* Tradesman Form */}
          <div className="lg:col-span-3 bg-gray-50 rounded-lg p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Tradesman Details</h3>
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
                    value={tradesmanData.name}
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
                    value={tradesmanData.email}
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
                    value={tradesmanData.phone}
                    onChange={handleChange}
                    className={`w-full border ${errors.phone ? "border-red-500" : "border-gray-300"} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Trade/Profession <span className="text-red-500">*</span>
                  </label>
                  <Select value={tradesmanData.trade} onValueChange={(value) => handleSelectChange('trade', value)}>
                    <SelectTrigger className={`w-full ${errors.trade ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Select your trade" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRADE_TYPES.map(trade => (
                        <SelectItem key={trade} value={trade}>{trade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.trade && <p className="text-red-500 text-sm mt-1">{errors.trade}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="yearsOfExperience" className="block font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    value={tradesmanData.yearsOfExperience}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Availability
                  </label>
                  <Select value={tradesmanData.availability} onValueChange={(value) => handleSelectChange('availability', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="travelDistance" className="block font-medium text-gray-700 mb-1">
                    Travel Distance (km)
                  </label>
                  <input
                    type="number"
                    id="travelDistance"
                    name="travelDistance"
                    value={tradesmanData.travelDistance}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="hourlyRate" className="block font-medium text-gray-700 mb-1">
                    Hourly Rate (₦)
                  </label>
                  <input
                    type="number"
                    id="hourlyRate"
                    name="hourlyRate"
                    value={tradesmanData.hourlyRate || ""}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="projectRate" className="block font-medium text-gray-700 mb-1">
                    Project Rate (₦)
                  </label>
                  <input
                    type="number"
                    id="projectRate"
                    name="projectRate"
                    value={tradesmanData.projectRate || ""}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
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
                    value={tradesmanData.rating || 0}
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
                    value={tradesmanData.reviewCount || 0}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <GooglePlacesAutocomplete
                  value={tradesmanData.location}
                  onChange={(value) => {
                    setTradesmanData((prev) => ({
                      ...prev,
                      location: value,
                    }));
                  }}
                  onPlaceSelect={(place) => {
                    setTradesmanData((prev) => ({
                      ...prev,
                      location: place.formatted_address || place.address,
                    }));
                  }}
                  label="Work Location"
                  placeholder="Enter your work location"
                  className="w-full"
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              <div>
                <label htmlFor="description" className="block font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={tradesmanData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full border ${errors.description ? "border-red-500" : "border-gray-300"} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Describe your services and expertise"
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
                  initialFiles={tradesmanData.profileImage ? [tradesmanData.profileImage] : []}
                />
              </div>

              {/* Work Images */}
              <div className="border-t pt-4">
                <div className="pb-3 text-gray-900">
                  Work Portfolio Images
                </div>
                <FileInput
                  multiple={true}
                  accept="image/*"
                  maxFileSize={5}
                  onUploadComplete={handleWorkImagesUpload}
                  initialFiles={tradesmanData.workImages || []}
                />
              </div>

              {/* License Documents */}
              <div className="border-t pt-4">
                <div className="pb-3 text-gray-900">
                  National Identity Card  <span className="text-red-500">*</span>
                </div>
                <FileInput
                  multiple={true}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  maxFileSize={10}
                  onUploadComplete={handleLicenseUpload}
                  initialFiles={tradesmanData.licenseDocuments || []}
                />
                {errors.licenseDocuments && <p className="text-red-500 text-sm mt-1">{errors.licenseDocuments}</p>}
              </div>

              {/* Skills */}
              <div className="border-t pt-4">
                <label className="block font-medium text-gray-700 mb-1">Skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tradesmanData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
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
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                    className="flex-1 border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a skill"
                  />
                  <Button
                    type="button"
                    onClick={handleAddSkill}
                    className="rounded-l-none bg-gray-200 hover:bg-gray-300 text-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Certifications */}
              <div className="border-t pt-4">
                <label className="block font-medium text-gray-700 mb-1">Certifications</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tradesmanData.certifications.map((certification) => (
                    <Badge key={certification} variant="secondary" className="px-3 py-1">
                      {certification}
                      <button
                        type="button"
                        onClick={() => handleRemoveCertification(certification)}
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
                    value={certificationInput}
                    onChange={(e) => setCertificationInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCertification())}
                    className="flex-1 border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a certification"
                  />
                  <Button
                    type="button"
                    onClick={handleAddCertification}
                    className="rounded-l-none bg-gray-200 hover:bg-gray-300 text-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Languages */}
              <div className="border-t pt-4">
                <label className="block font-medium text-gray-700 mb-1">Languages</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tradesmanData.languages.map((language) => (
                    <Badge key={language} variant="secondary" className="px-3 py-1">
                      {language}
                      <button
                        type="button"
                        onClick={() => handleRemoveLanguage(language)}
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
                    value={languageInput}
                    onChange={(e) => setLanguageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddLanguage())}
                    className="flex-1 border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a language"
                  />
                  <Button
                    type="button"
                    onClick={handleAddLanguage}
                    className="rounded-l-none bg-gray-200 hover:bg-gray-300 text-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="border-t pt-4">
                <label className="block font-medium text-gray-700 mb-1">Preferred Payment Methods</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tradesmanData.preferredPayment.map((payment) => (
                    <Badge key={payment} variant="secondary" className="px-3 py-1">
                      {payment}
                      <button
                        type="button"
                        onClick={() => handleRemovePayment(payment)}
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
                    value={paymentInput}
                    onChange={(e) => setPaymentInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddPayment())}
                    className="flex-1 border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add payment method (e.g., Cash, Bank Transfer, Mobile Money)"
                  />
                  <Button
                    type="button"
                    onClick={handleAddPayment}
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
                      value={tradesmanData.socialMedia?.facebook || ""}
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
                      value={tradesmanData.socialMedia?.instagram || ""}
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
                      value={tradesmanData.socialMedia?.twitter || ""}
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
                      value={tradesmanData.socialMedia?.linkedin || ""}
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
                        value={tradesmanData.workingHours?.[day as keyof typeof tradesmanData.workingHours] || ""}
                        onChange={handleChange}
                        className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 8:00 AM - 6:00 PM or Closed"
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
                    checked={tradesmanData.featured}
                    onCheckedChange={(checked) => handleCheckboxChange("featured", checked === true)}
                  />
                  <Label htmlFor="featured">Featured Tradesman</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emergencyAvailable"
                    checked={tradesmanData.emergencyAvailable}
                    onCheckedChange={(checked) => handleCheckboxChange("emergencyAvailable", checked === true)}
                  />
                  <Label htmlFor="emergencyAvailable">Available for Emergency Work</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Tradesman Preview */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-800">Preview</h3>
            </div>
            <div className="p-4">
              <div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow">
                <div className="relative h-48 overflow-hidden rounded-t-lg bg-gray-100">
                  {tradesmanData.profileImage ? (
                    <Image
                      src={tradesmanData.profileImage}
                      alt={tradesmanData.name || "Tradesman"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Hammer className="h-16 w-16" />
                    </div>
                  )}
                  {tradesmanData.featured && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500">Featured</Badge>
                  )}
                  <Badge className={`absolute top-2 right-2 ${
                    tradesmanData.availability === 'available' ? 'bg-green-500' :
                    tradesmanData.availability === 'busy' ? 'bg-orange-500' : 'bg-red-500'
                  }`}>
                    {tradesmanData.availability.charAt(0).toUpperCase() + tradesmanData.availability.slice(1)}
                  </Badge>
                </div>
                <div className="p-4">
                  <h5 className="text-lg font-semibold text-gray-900 mb-2">
                    {tradesmanData.name || "Tradesman Name"}
                  </h5>
                  <p className="text-sm text-gray-600 mb-2">
                    {tradesmanData.trade || "Trade/Profession"}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    {tradesmanData.location || "Location"}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    {tradesmanData.description.substring(0, 100)}...
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{tradesmanData.yearsOfExperience} years experience</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>₦{tradesmanData.hourlyRate || 0}/hr</span>
                    {tradesmanData.projectRate && (
                      <>
                        <span className="mx-2">•</span>
                        <span>₦{tradesmanData.projectRate} project rate</span>
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {tradesmanData.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {tradesmanData.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{tradesmanData.skills.length - 3} more
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
            {update ? "Update Tradesman" : "Create Tradesman"}
          </SubmitButton>
        </div>
      </form>
    </div>
  );
};

export default TradesmanEditor;