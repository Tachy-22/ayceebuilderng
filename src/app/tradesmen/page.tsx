"use client";

import Tradesmen from "@/layouts/Tradesmen";
import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Tradesman interface matching the layout component
interface Tradesman {
  id: string;
  name: string;
  email: string;
  phone: string;
  trade: string;
  description: string;
  location: string;
  profileImage?: string;
  workImages?: string[];
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
  emergencyAvailable: boolean;
  travelDistance: number;
  languages: string[];
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
}

const TradesmenPage = () => {
  const [tradesmenData, setTradesmenData] = useState<Tradesman[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTradesmen = async () => {
    try {
      setLoading(true);
      
      if (!db) {
        throw new Error('Database not initialized');
      }

      const tradesmenRef = collection(db, 'tradesmen');
      const q = query(
        tradesmenRef, 
        where('status', '==', 'approved'),
        orderBy('featured', 'desc'),
        orderBy('rating', 'desc')
      );
      const snapshot = await getDocs(q);

      const fetchedTradesmen = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Tradesman[];

      setTradesmenData(fetchedTradesmen);
    } catch (error) {
      console.error("Error fetching tradesmen data:", error);
      setTradesmenData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTradesmen();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      <Tradesmen fetchedTradesmen={tradesmenData} />
    </div>
  );
};

export default TradesmenPage;
