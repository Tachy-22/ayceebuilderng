"use client";

import { useState } from "react";
import { Plus, X, Hammer } from "lucide-react";
import { Button } from "./ui/button";
import { FileInput } from "./FileInput";
import SubmitButton from "./ui/SubmitButton";
import { addDocument } from "@/app/actions/addDocument";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { TRADE_TYPES } from "@/types/tradesman";
import Image from "next/image";
import GooglePlacesAutocomplete from "./ui/GooglePlacesAutocomplete";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TradesmanRegistrationFormProps {
  onSuccess?: () => void;
}

interface TradesmanRegistrationData {
  name: string;
  email: string;
  phone: string;
  trade: string;
  description: string;
  location: string;
  profileImage: string;
  workImages: string[];
  licenseDocuments: string[];
  skills: string[];
  yearsOfExperience: number;
  certifications: string[];
  availability: 'available' | 'busy' | 'unavailable';
  hourlyRate?: number;
  projectRate?: number;
  preferredPayment: string[];
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
  emergencyAvailable: boolean;
  travelDistance: number;
  languages: string[];
  status: 'pending';
}

const TradesmanRegistrationForm: React.FC<TradesmanRegistrationFormProps> = ({
  onSuccess,
}) => {
  const defaultData: TradesmanRegistrationData = {
    name: "",
    email: "",
    phone: "",
    trade: "",
    description: "",
    location: "",
    profileImage: "",
    workImages: [],
    licenseDocuments: [],
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

  const [formData, setFormData] = useState<TradesmanRegistrationData>(defaultData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [certificationInput, setCertificationInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");
  const [paymentInput, setPaymentInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleProfileImageUpload = (files: FileMetadata[]) => {
    if (files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        profileImage: files[0].url,
      }));
    }
  };

  const handleWorkImagesUpload = (files: FileMetadata[]) => {
    const urls = files.map((file) => file.url);
    setFormData((prev) => ({
      ...prev,
      workImages: urls,
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

    if (!formData.trade.trim()) {
      newErrors.trade = "Trade is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (formData.licenseDocuments.length === 0) {
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

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      const newSkill = skillInput.trim();
      if (!formData.skills.includes(newSkill)) {
        setFormData((prev) => ({
          ...prev,
          skills: [...prev.skills, newSkill],
        }));
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleAddCertification = () => {
    if (certificationInput.trim()) {
      const newCertification = certificationInput.trim();
      if (!formData.certifications.includes(newCertification)) {
        setFormData((prev) => ({
          ...prev,
          certifications: [...prev.certifications, newCertification],
        }));
      }
      setCertificationInput("");
    }
  };

  const handleRemoveCertification = (certificationToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((cert) => cert !== certificationToRemove),
    }));
  };

  const handleAddLanguage = () => {
    if (languageInput.trim()) {
      const newLanguage = languageInput.trim();
      if (!formData.languages.includes(newLanguage)) {
        setFormData((prev) => ({
          ...prev,
          languages: [...prev.languages, newLanguage],
        }));
      }
      setLanguageInput("");
    }
  };

  const handleRemoveLanguage = (languageToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((lang) => lang !== languageToRemove),
    }));
  };

  const handleAddPayment = () => {
    if (paymentInput.trim()) {
      const newPayment = paymentInput.trim();
      if (!formData.preferredPayment.includes(newPayment)) {
        setFormData((prev) => ({
          ...prev,
          preferredPayment: [...prev.preferredPayment, newPayment],
        }));
      }
      setPaymentInput("");
    }
  };

  const handleRemovePayment = (paymentToRemove: string) => {
    setFormData((prev) => ({
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

      const submissionData = {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rating: 0,
        reviewCount: 0,
        verified: false,
        featured: false,
      };

      const result = await addDocument("tradesmen", submissionData, "/tradesmen");
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Register as a Tradesman</h2>
        <p className="text-gray-600">Join our platform and connect with clients looking for skilled professionals.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
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
                Trade/Profession <span className="text-red-500">*</span>
              </label>
              <Select value={formData.trade} onValueChange={(value) => handleSelectChange('trade', value)}>
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
                placeholder="0"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Current Availability
              </label>
              <Select value={formData.availability} onValueChange={(value) => handleSelectChange('availability', value)}>
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
          </div>

          <div className="mt-4">
            <GooglePlacesAutocomplete
              value={formData.location}
              onChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  location: value,
                }));
              }}
              onPlaceSelect={(place) => {
                setFormData((prev) => ({
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

          <div className="mt-4">
            <label htmlFor="description" className="block font-medium text-gray-700 mb-1">
              Professional Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full border ${errors.description ? "border-red-500" : "border-gray-300"} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Describe your services, expertise, and what makes you stand out"
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
                Profile Image
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
                Work Portfolio Images
              </div>
              <FileInput
                multiple={true}
                accept="image/*"
                maxFileSize={5}
                onUploadComplete={handleWorkImagesUpload}
                initialFiles={formData.workImages || []}
              />
            </div>

            <div>
              <div className="pb-3 text-gray-900">
                National Identity Card <span className="text-red-500">*</span>
              </div>
              <FileInput
                multiple={true}
                accept=".jpg,.jpeg,.png"
                maxFileSize={10}
                onUploadComplete={handleLicenseUpload}
                initialFiles={formData.licenseDocuments || []}
              />
              {errors.licenseDocuments && <p className="text-red-500 text-sm mt-1">{errors.licenseDocuments}</p>}
            </div>
          </div>
        </div>

        {/* Skills and Expertise */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Skills & Expertise</h3>

          <div className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Skills</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.skills.map((skill) => (
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

            <div>
              <label className="block font-medium text-gray-700 mb-1">Certifications</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.certifications.map((certification) => (
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

export default TradesmanRegistrationForm;