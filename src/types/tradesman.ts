export interface Tradesman {
  id: string;
  name: string;
  email: string;
  phone: string;
  trade: string;
  description: string;
  location: string;
  profileImage?: string;
  workImages: string[];
  licenseDocuments: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  featured: boolean;
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
  travelDistance: number; // in kilometers
  languages: string[];
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TradesmanFormData extends Omit<Tradesman, 'id' | 'verified' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'> {
  rating?: number;
  reviewCount?: number;
}

export const TRADE_TYPES = [
  'Plumber',
  'Electrician',
  'Carpenter',
  'Mason',
  'Painter',
  'Tiler',
  'Roofer',
  'HVAC Technician',
  'Landscaper',
  'General Contractor',
  'Welder',
  'Glazier',
  'Flooring Specialist',
  'Plasterer',
  'Bricklayer'
] as const;