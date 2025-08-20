import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportPhone: string;
  // Payment settings
  paystackPublicKey: string;
  taxRate: number;
  shippingFee: number;
  currency: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'AyceeBuilder Nigeria',
  siteDescription: 'Your trusted marketplace for construction materials',
  contactEmail: 'admin@ayceebuilder.com',
  supportPhone: '+234 800 123 4567',
  paystackPublicKey: '',
  taxRate: 7.5,
  shippingFee: 1500,
  currency:"NGN"
};

// Get site settings from Firestore
export const getSiteSettings = async (): Promise<SiteSettings> => {
  try {
    const settingsRef = doc(db, 'settings', 'site');
    const settingsDoc = await getDoc(settingsRef);
    
    if (settingsDoc.exists()) {
      return { ...DEFAULT_SETTINGS, ...settingsDoc.data() } as SiteSettings;
    } else {
      // Create default settings if none exist
      await setDoc(settingsRef, DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return DEFAULT_SETTINGS;
  }
};

// Update site settings in Firestore
export const updateSiteSettings = async (settings: Partial<SiteSettings>): Promise<void> => {
  try {
    const settingsRef = doc(db, 'settings', 'site');
    await updateDoc(settingsRef, {
      ...settings,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating site settings:', error);
    throw error;
  }
};