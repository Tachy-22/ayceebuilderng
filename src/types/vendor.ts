export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  description: string;
  location: string;
  website?: string;
  profileImage?: string;
  businessImages: string[];
  licenseDocuments: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  featured: boolean;
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
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface VendorFormData extends Omit<Vendor, 'id' | 'verified' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'> {
  rating?: number;
  reviewCount?: number;
}