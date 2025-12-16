"use client";
import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { analytics } from "@/lib/analytics";

import { motion } from "framer-motion";
import {
  Trash2,
  Plus,
  Minus,
  AlertCircle,
  ArrowRight,
  ShoppingBag,
  Calculator,
  MapPin,
  Truck,
  X,
  Search,
  Loader2,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "@/hooks/use-toast";
import { getPaystackConfig } from "@/lib/paystack";
import { createOrder, updateUserProfile } from "@/lib/firestore";
import { OrderItem, OrderStatus } from "@/types/order";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import GooglePlacesAutocomplete from "@/components/ui/GooglePlacesAutocomplete";
import { geocodeAddress, calculateHaversineDistance } from "@/lib/googlePlaces";
import { getAllStateNames, getCitiesForState, validateStateCity, calculateFallbackDistance } from "@/lib/nigerianLocations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Interface for place coordinates
interface PlaceCoordinates {
  lat: number;
  lng: number;
  address: string;
  placeId: string;
}

// Dynamically import PaystackButton with SSR disabled:
const PaystackButton = dynamic(
  async () => {
    const { PaystackButton } = await import("react-paystack");
    return PaystackButton;
  },
  { ssr: false }
);

// New import for receipt
const DownloadableReceipt = dynamic(
  () => import("@/components/DownloadableReceipt"),
  { ssr: false }
);

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, loading: cartLoading } = useCart();
  const { settings } = useSettings();

  // Debug logging
  console.log('Cart items:', cartItems);
  cartItems.forEach((item, index) => {
    console.log(`Item ${index}:`, {
      name: item.product.name,
      variant: item.variant,
      price: item.product.price,
      discountPrice: item.product.discountPrice,
      variantPrice: item.variant?.variant_price
    });
  });

  // Wrapper functions to handle async cart operations
  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      // Find the cart item to track the change
      const cartItem = cartItems.find(item => item.id === itemId);
      if (cartItem) {
        const oldQuantity = cartItem.quantity;
        const action = newQuantity > oldQuantity ? 'increase' : 'decrease';
        
        // Track quantity change event
        analytics.trackQuantityChange(
          cartItem.product.id,
          cartItem.product.name,
          action,
          newQuantity
        );
      }
      
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveFromCart = async (itemId: string) => {
    try {
      // Find the cart item to track removal
      const cartItem = cartItems.find(item => item.id === itemId);
      if (cartItem) {
        const price = (cartItem.variant && cartItem.variant.variant_price) 
          ? cartItem.variant.variant_price 
          : (cartItem.product.discountPrice || cartItem.product.price);
        
        // Track remove from cart event
        analytics.trackRemoveFromCart(
          cartItem.product.id,
          cartItem.product.name,
          cartItem.product.category,
          price,
          cartItem.quantity
        );
      }
      
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };
  const { user, userProfile } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [deliveryLocation, setDeliveryLocation] = useState("lagos");
  const [deliveryDistance, setDeliveryDistance] = useState(10);
  const [deliveryWeight, setDeliveryWeight] = useState(500);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [orderReference, setOrderReference] = useState("");
  const [confirmedItems, setConfirmedItems] = useState<any[]>([]);
  const [confirmedTotal, setConfirmedTotal] = useState(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [savedUsers, setSavedUsers] = useState<
    | {
      name: string;
      email: string;
      address: string;
      phone: string
    }[]
    | []
  >([]);
  const [selectedUser, setSelectedUser] = useState<{
    name: string;
    email: string;
    address: string;
    phone: string | null;
  } | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [newUserDetails, setNewUserDetails] = useState<{
    name: string;
    email: string;
    address: string;
    phone: string;
  }>({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  // State for Google Places address autocomplete
  const [addressInput, setAddressInput] = useState("");
  const [selectedPlaceCoordinates, setSelectedPlaceCoordinates] = useState<PlaceCoordinates | null>(null);

  // State for distance calculation
  const [calculatedDistance, setCalculatedDistance] = useState<number | null>(
    null
  );
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);

  // New state for address management
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [showQuickAddressForm, setShowQuickAddressForm] = useState(false);
  const [quickAddressForm, setQuickAddressForm] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    phone: '',
    isFromGooglePlaces: false
  });
  const [productLocation, setProductLocation] = useState(
    "Ikeja City Mall, Alausa, Obafemi Awolowo Wy, Oregun, Ikeja"
  );
  // Add state to track if we're showing the address selection UI
  const [showAddressSelection, setShowAddressSelection] = useState(false);
  
  // State for estimated billing agreement
  const [agreedToEstimatedBilling, setAgreedToEstimatedBilling] = useState(false);
  const [showEstimatedBillingForm, setShowEstimatedBillingForm] = useState(false);
  const [estimatedBillingForm, setEstimatedBillingForm] = useState({
    address: '',
    postalCode: '',
    city: '',
    state: '',
    phone: ''
  });

  // Helper function to convert color names to hex values
  const getColorValue = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      white: "#FFFFFF",
      "off-white": "#F5F5F5",
      ivory: "#FFFFF0",
      cream: "#FFFDD0",
      beige: "#F5F5DC",
      eggshell: "#F0EAD6",
      "light gray": "#D3D3D3",
      silver: "#C0C0C0",
      gray: "#808080",
      charcoal: "#36454F",
      pewter: "#899499",
      "sky blue": "#87CEEB",
      "baby blue": "#89CFF0",
      "powder blue": "#B0E0E6",
      "navy blue": "#000080",
      "royal blue": "#4169E1",
      teal: "#008080",
      turquoise: "#40E0D0",
      cyan: "#00FFFF",
      aqua: "#00FFFF",
      periwinkle: "#CCCCFF",
      "steel blue": "#4682B4",
      blue: "#0000FF",
      mint: "#98FB98",
      "lime green": "#32CD32",
      "forest green": "#228B22",
      "olive green": "#808000",
      sage: "#BCB88A",
      emerald: "#50C878",
      seafoam: "#71EEB8",
      green: "#008000",
      lemon: "#FFF44F",
      butter: "#F0E36B",
      marigold: "#EAA221",
      mustard: "#E1AD01",
      gold: "#FFD700",
      amber: "#FFBF00",
      tangerine: "#F28500",
      peach: "#FFE5B4",
      coral: "#FF7F50",
      orange: "#FFA500",
      apricot: "#FBCEB1",
      yellow: "#FFFF00",
      pink: "#FFC0CB",
      rose: "#FF007F",
      fuchsia: "#FF00FF",
      magenta: "#FF00FF",
      burgundy: "#800020",
      maroon: "#800000",
      crimson: "#DC143C",
      rust: "#B7410E",
      salmon: "#FA8072",
      terracotta: "#E2725B",
      cherry: "#DE3163",
      red: "#FF0000",
      lavender: "#E6E6FA",
      lilac: "#C8A2C8",
      plum: "#8E4585",
      violet: "#8F00FF",
      amethyst: "#9966CC",
      indigo: "#4B0082",
      purple: "#800080",
      tan: "#D2B48C",
      khaki: "#C3B091",
      caramel: "#C68E17",
      taupe: "#483C32",
      chocolate: "#7B3F00",
      mahogany: "#4A0100",
      coffee: "#6F4E37",
      mocha: "#A38068",
      brown: "#964B00",
      "jet black": "#000000",
      onyx: "#353839",
      black: "#000000",
    };

    if (!colorName) return "#D3D3D3"; // Default to light gray if color is undefined

    const lowerColorName = colorName.toLowerCase().trim();
    if (lowerColorName in colorMap) {
      return colorMap[lowerColorName];
    }

    for (const [key, value] of Object.entries(colorMap)) {
      if (lowerColorName.includes(key) || key.includes(lowerColorName)) {
        return value;
      }
    }

    return "#D3D3D3"; // Default to light gray
  };

  // Set initial state based on saved users
  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
    const existingUsers = localStorage.getItem("savedUsers");
    if (existingUsers) {
      const parsedUsers = JSON.parse(existingUsers);
      setSavedUsers(parsedUsers);

      // Automatically show the form if there are no saved users
      if (parsedUsers.length === 0) {
        setShowUserForm(true);
      }
    } else {
      // No users in localStorage, show the form
      setShowUserForm(true);
    }
  }, []);

  // Handle Google Places selection
  const handlePlaceSelect = (place: PlaceCoordinates) => {
    console.log('Place selected:', place);
    setAddressInput(place.address);
    setNewUserDetails({
      ...newUserDetails,
      address: place.address,
    });
    setSelectedPlaceCoordinates(place);
  };

  // Calculate product location based on cart items
  useEffect(() => {
    if (cartItems.length > 0) {
      // Use the location of the first product in the cart or the default
      const firstProductLocation =
        cartItems[0].product.location ||
        "Ikeja City Mall, Alausa, Obafemi Awolowo Wy, Oregun, Ikeja";
      setProductLocation(firstProductLocation);
    }
  }, [cartItems]);


  // Calculate the actual distance between product location and delivery address
  const calculateActualDistance = async () => {
    console.log('calculateActualDistance called', {
      selectedUser: selectedUser?.address,
      productLocation,
      selectedPlaceCoordinates
    });

    if (!selectedUser?.address) {
      toast({
        variant: "destructive",
        title: "Missing address",
        description: "Please select a delivery address first.",
      });
      return;
    }

    setIsCalculatingDistance(true);

    try {
      // Use selected place coordinates if available, otherwise geocode the address
      let userCoords: PlaceCoordinates | null = selectedPlaceCoordinates;

      console.log('User coordinates:', userCoords);

      if (!userCoords) {
        console.log('No coordinates available, geocoding address:', selectedUser.address);
        // Fallback to geocoding if no coordinates available
        userCoords = await geocodeAddress(selectedUser.address);
        console.log('Geocoded user coordinates:', userCoords);
      }

      // Geocode the product location
      console.log('Geocoding product location:', productLocation);
      const productCoords = await geocodeAddress(productLocation);
      console.log('Product coordinates:', productCoords);

      if (productCoords && userCoords) {
        // Calculate distance using Google Places coordinates
        const distance = calculateHaversineDistance(
          productCoords.lat,
          productCoords.lng,
          userCoords.lat,
          userCoords.lng
        );

        console.log('Calculated distance:', distance);

        // Round to nearest integer
        const roundedDistance = Math.round(distance);
        setCalculatedDistance(roundedDistance);

        // Update delivery distance for cost calculation
        setDeliveryDistance(roundedDistance);

        console.log('Distance calculation complete:', roundedDistance);

        toast({
          title: "Distance calculated",
          description: `Delivery distance: ${roundedDistance} km.`,
        });
      } else {
        console.error('Missing coordinates:', { productCoords, userCoords });
        console.log('Geocoding failed, trying fallback distance calculation');
        
        // Try fallback distance calculation using Nigerian states
        const fallbackDistance = calculateFallbackDistance(productLocation, selectedUser.address);
        
        if (fallbackDistance) {
          console.log('Fallback distance calculated:', fallbackDistance);
          const roundedFallbackDistance = Math.round(fallbackDistance);
          setCalculatedDistance(roundedFallbackDistance);
          setDeliveryDistance(roundedFallbackDistance);
          
          toast({
            title: "Distance estimated",
            description: `Using approximate distance: ${roundedFallbackDistance} km (based on state/city location).`,
            duration: 5000,
          });
        } else {
          console.log('Both geocoding and fallback failed, using default shipping');
          setCalculatedDistance(null);
          setDeliveryDistance(10); // Keep legacy deliveryDistance for backward compatibility
        }
      }
    } catch (error) {
      console.error("Error calculating distance:", error);
      
      // Try fallback even in error case
      try {
        if (selectedUser?.address) {
          const fallbackDistance = calculateFallbackDistance(productLocation, selectedUser.address);
          if (fallbackDistance) {
            console.log('Fallback distance calculated after error:', fallbackDistance);
            const roundedFallbackDistance = Math.round(fallbackDistance);
            setCalculatedDistance(roundedFallbackDistance);
            setDeliveryDistance(roundedFallbackDistance);
            
            toast({
              title: "Distance estimated",
              description: `Using approximate distance: ${roundedFallbackDistance} km (Google Maps unavailable).`,
              duration: 5000,
            });
          } else {
            setCalculatedDistance(null);
            setDeliveryDistance(10);
          }
        } else {
          setCalculatedDistance(null);
          setDeliveryDistance(10);
        }
      } catch (fallbackError) {
        console.error('Fallback distance calculation also failed:', fallbackError);
        toast({
          variant: "destructive",
          title: "Error calculating distance",
          description:
            "Could not calculate the delivery distance. Using default estimate.",
        });
        
        setCalculatedDistance(null);
        setDeliveryDistance(10); // Keep legacy deliveryDistance for backward compatibility
      }
    } finally {
      setIsCalculatingDistance(false);
    }
  };

  // Calculate delivery cost based on the new pricing structure with fixed values
  const calculateDeliveryCost = () => {
    console.log('calculateDeliveryCost called', {
      selectedAddress: !!selectedAddress,
      calculatedDistance,
      deliveryWeight
    });

    if (!selectedAddress || calculatedDistance === null) {
      console.log('Delivery cost calculation skipped - using default shipping fee from settings');
      return settings?.shippingFee || 0; // Use default shipping fee from settings
    }

    // Base fare
    const baseFare = 750;

    // Time cost (using 30 minutes as default travel time, or ~2 mins per km)
    const estimatedTimeHours = Math.max(0.5, calculatedDistance * 0.0033); // at least 30 minutes
    const timeCost = 50 * estimatedTimeHours;

    // Distance cost
    const distanceCost = 90 * calculatedDistance;

    // Fixed fees - no longer toggle-based
    const surgeCost = 2000; // Heavy traffic fee always applied
    const tollsCost = 300; // Toll fee always applied
    const waitTimeCost = 300; // Wait time fee always applied

    // Weight cost calculation based on weight tiers
    let weightCost = 0;
    if (deliveryWeight <= 200) {
      weightCost = deliveryWeight * 10; // 1-200kg @ ₦100 per kg
    } else if (deliveryWeight <= 500) {
      weightCost = deliveryWeight * 15; // 201-500kg @ ₦150 per kg
    } else {
      weightCost = deliveryWeight * 20; // 500kg+ @ ₦200 per kg
    }

    // Calculate subtotal before service fee
    const subtotalDeliveryCost =
      baseFare +
      timeCost +
      distanceCost +
      surgeCost +
      tollsCost +
      waitTimeCost +
      weightCost;

    // Service fee (use tax rate from settings)
    const serviceFee = subtotalDeliveryCost * ((settings?.taxRate || 7.5) / 100);

    // Total delivery cost
    const totalCost = subtotalDeliveryCost + serviceFee;
    console.log('Delivery cost calculated:', {
      baseFare,
      timeCost,
      distanceCost,
      surgeCost,
      tollsCost,
      waitTimeCost,
      weightCost,
      subtotalDeliveryCost,
      serviceFee,
      totalCost
    });
    return totalCost;
  };

  // Calculate delivery cost breakdown for display
  const getDeliveryBreakdown = () => {
    if (!selectedAddress || calculatedDistance === null) return null;

    const baseFare = 750;
    const estimatedTimeHours = Math.max(0.5, calculatedDistance * 0.0033);
    const timeCost = 500 * estimatedTimeHours;
    const distanceCost = 900 * calculatedDistance;
    const surgeCost = 2000; // Fixed heavy traffic fee
    const tollsCost = 300; // Fixed toll fee
    const waitTimeCost = 300; // Fixed wait time fee

    let weightCost = 0;
    let weightRate = 0;
    if (deliveryWeight <= 200) {
      weightCost = deliveryWeight * 10;
      weightRate = 10;
    } else if (deliveryWeight <= 500) {
      weightCost = deliveryWeight * 15;
      weightRate = 15;
    } else {
      weightCost = deliveryWeight * 20;
      weightRate = 20;
    }

    const subtotalDeliveryCost =
      baseFare +
      timeCost +
      distanceCost +
      surgeCost +
      tollsCost +
      waitTimeCost +
      weightCost;
    const serviceFee = subtotalDeliveryCost * ((settings?.taxRate || 7.5) / 100);

    return {
      baseFare,
      timeCost,
      timeHours: estimatedTimeHours.toFixed(1),
      distanceCost,
      surgeCost,
      tollsCost,
      waitTimeCost,
      weightCost,
      weightRate,
      subtotalDeliveryCost,
      serviceFee,
      total: subtotalDeliveryCost + serviceFee,
    };
  };

  // Calculate total weight from cart items and update deliveryWeight
  useEffect(() => {
    const calculatedWeight = cartItems.reduce(
      (sum, item) => sum + item.quantity * (item.product.weight || 0),
      0
    );
    console.log({ cartItems })
    // Use the calculated weight if it's greater than 0, otherwise use default 500kg
    setDeliveryWeight(calculatedWeight);

  }, [cartItems]);

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => {
    // Use variant price if available, otherwise use product price
    let price =  item.product.price;
    if (item.variant && typeof item.variant.variant_price === 'number') {
      price = item.variant.variant_price;
    }
    return sum + price * item.quantity;
  }, 0);

  const tax = subtotal * ((settings?.taxRate || 7.5) / 100); // VAT from settings
  const deliveryCost = calculateDeliveryCost();
  const total = subtotal + tax + deliveryCost - discountAmount;

  console.log('Cart totals:', {
    subtotal,
    tax,
    deliveryCost,
    discountAmount,
    total,
    calculatedDistance,
    selectedAddress: !!selectedAddress
  });

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "WELCOME10") {
      const discount = subtotal * 0.1; // 10% discount
      setDiscountAmount(discount);
      setPromoApplied(true);
      
      // Track promo code application
      analytics.trackPromoCodeApply(promoCode.toUpperCase(), true, discount);
      
      toast({
        title: "Promo code applied",
        description: "10% discount has been applied to your order",
      });
    } else {
      setPromoApplied(false);
      setDiscountAmount(0);
      
      // Track failed promo code attempt
      analytics.trackPromoCodeApply(promoCode, false);
      
      toast({
        variant: "destructive",
        title: "Invalid promo code",
        description: "The promo code you entered is invalid or expired",
      });
    }
  };

  const handlePaystackSuccess = async (reference: any) => {
    try {
      setIsProcessingPayment(true);
      
      // Track begin checkout event when payment starts
      analytics.trackBeginCheckout(total, cartItems.length);
      
      if (selectedAddress && user && userProfile) {
        const itemsForReceipt = cartItems.map((item) => ({
          productName: item.product.name,
          unitPrice: (item.variant && typeof item.variant.variant_price === 'number') 
            ? item.variant.variant_price 
            : (item.product.discountPrice || item.product.price),
          quantity: item.quantity,
          color: item.color,
          variant: item.variant?.variant_name,
        }));

        // Create order items for Firestore
        const orderItems: OrderItem[] = cartItems.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: (item.variant && typeof item.variant.variant_price === 'number') 
            ? item.variant.variant_price 
            : (item.product.discountPrice || item.product.price),
          image: item.product.image,
          category: item.product.category,
          vendor: item.product.vendor?.name,
          color: item.color,
          variant: item.variant?.variant_name,
        }));

        // Use the selected address for shipping
        const shippingAddress = {
          id: selectedAddress.id,
          type: selectedAddress.type,
          name: selectedAddress.name,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          country: selectedAddress.country || 'Nigeria',
          phone: selectedAddress.phone || userProfile.phone,
          isDefault: selectedAddress.isDefault,
        };

        // Create order in Firestore
        try {
          console.log('🛒 Starting order creation for user:', user.uid);
          console.log('📦 Selected address:', shippingAddress);
          console.log('🛍️ Order items:', orderItems);
          console.log('💰 Total amount:', total);
          
          // Calculate estimated delivery date (3 weeks from now)
          const estimatedDeliveryDate = new Date();
          estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 21); // 3 weeks = 21 days

          const orderData = {
            userId: user.uid,
            orderNumber: '', // Will be generated automatically
            status: 'confirmed' as OrderStatus,
            items: orderItems,
            totalAmount: total,
            shippingAddress,
            estimatedDeliveryDate,
            notes: `Payment Reference: ${reference.reference}`,
          };

          console.log('📋 Order data prepared:', JSON.stringify(orderData, null, 2));

          const order = await createOrder(orderData);

          console.log('✅ Order created successfully:', order);
        } catch (firestoreError) {
          console.error('❌ Error creating order in Firestore:', firestoreError);
          if (firestoreError instanceof Error) {
            console.error('❌ Firestore error details:', {
              name: firestoreError.name,
              message: firestoreError.message,
              stack: firestoreError.stack
            });
          }
          // Continue with the original flow even if Firestore fails
        }

        // Continue with original payment flow
        const res = await fetch("/api/paystack", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference: reference.reference,
            user: {
              email: user.email,
              name: userProfile.name,
              address: selectedAddress.street,
              phone: selectedAddress.phone || userProfile.phone || "",
            },
            items: itemsForReceipt,
            totalAmount: total,
            location: selectedAddress.street,
            transportFare: deliveryCost,
            distance: deliveryDistance,
            weight: deliveryWeight,
          }),
        });
        console.log({ res })
        if (res.ok) {
          console.log('Payment verification successful:', { res });
          
          // Track successful purchase
          analytics.trackPurchaseCompleted(
            reference.reference,
            total,
            orderItems
          );
          
          setOrderReference(reference.reference);
          setConfirmedItems(itemsForReceipt);
          setConfirmedTotal(total);

          // Clear cart after a slight delay to show processing
          await new Promise(resolve => setTimeout(resolve, 1000));
          await clearCart();
          setPaymentConfirmed(true);

          // Show success message
          toast({
            title: "Order placed successfully!",
            description: "Your order has been created and you can track it in your dashboard.",
          });
        } else {
          console.error('Payment verification failed:', res.status, res.statusText);
          const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Error details:', errorData);

          toast({
            variant: "destructive",
            title: "Payment verification failed",
            description: errorData.error || "Please contact support if payment was deducted.",
          });
        }
      } else if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please log in to place an order.",
        });
      }
    } catch (error) {
      console.error("Error processing order:", error);
      toast({
        variant: "destructive",
        title: "Order failed",
        description: error instanceof Error ? error.message : "There was an error processing your order. Please try again.",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaystackClose = () => {
    // ...handle close...
  };
  const handleSaveNewUser = () => {
    if (
      !newUserDetails.name.trim() ||
      !newUserDetails.email.trim() ||
      !newUserDetails.address.trim() ||
      !newUserDetails.phone.trim()
    ) {
      toast({
        variant: "destructive",
        title: "Invalid details",
        description: "Please fill out all user fields.",
      });
      return;
    }
    const updatedUsers = [...savedUsers, newUserDetails];
    setSavedUsers(updatedUsers);
    localStorage.setItem("savedUsers", JSON.stringify(updatedUsers));
    setShowUserForm(false);
    setSelectedUser(newUserDetails);
    // Reset address input when user is saved, but keep coordinates for this session
    setAddressInput("");
    // Don't reset selectedPlaceCoordinates here since we want to use them for distance calculation
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setShowAddressSelection(false); // Hide the address selection after selecting
    setShowUserForm(false);
    // Reset calculated distance so it can be recalculated
    setCalculatedDistance(null);
    // Reset place coordinates when selecting existing user
    setSelectedPlaceCoordinates(null);
  };

  // Effect to auto-calculate distance when a user is selected or coordinates change (legacy system)
  useEffect(() => {
    if (selectedUser && selectedUser.address && productLocation) {
      console.log('Auto-calculating distance due to useEffect (legacy)');
      calculateActualDistance();
    }
  }, [selectedUser, productLocation, selectedPlaceCoordinates]);

  // New address management functions
  const handleAddressSelect = (address: any) => {
    console.log('Address selected:', address);
    setSelectedAddress(address);
    setCalculatedDistance(null);
    // Note: Distance calculation will be triggered by useEffect
  };

  const calculateAddressDistance = useCallback(async (addressStr: string) => {
    try {
      setIsCalculatingDistance(true);
      console.log('Starting distance calculation for:', addressStr);
      
      // Use geocoding first, then calculate distance
      const originCoords = await geocodeAddress(productLocation);
      const destCoords = await geocodeAddress(addressStr);

      if (originCoords && destCoords) {
        const distance = calculateHaversineDistance(
          originCoords.lat,
          originCoords.lng,
          destCoords.lat,
          destCoords.lng
        );
        console.log('Google Maps distance calculated:', distance);
        setCalculatedDistance(distance);
      } else {
        console.log('Geocoding failed, trying fallback distance calculation');
        // Try fallback distance calculation using Nigerian states
        const fallbackDistance = calculateFallbackDistance(productLocation, addressStr);
        
        if (fallbackDistance) {
          console.log('Fallback distance calculated:', fallbackDistance);
          setCalculatedDistance(fallbackDistance);
          
          toast({
            title: "Distance estimated",
            description: `Using approximate distance: ${Math.round(fallbackDistance)} km (based on state/city location).`,
            duration: 5000,
          });
        } else {
          console.log('Both geocoding and fallback failed, using default shipping');
          setCalculatedDistance(null); // Use default shipping when all methods fail
        }
      }
    } catch (error) {
      console.error('Error calculating distance:', error);
      
      // Try fallback even in error case
      try {
        const fallbackDistance = calculateFallbackDistance(productLocation, addressStr);
        if (fallbackDistance) {
          console.log('Fallback distance calculated after error:', fallbackDistance);
          setCalculatedDistance(fallbackDistance);
          
          toast({
            title: "Distance estimated",
            description: `Using approximate distance: ${Math.round(fallbackDistance)} km (Google Maps unavailable).`,
            duration: 5000,
          });
        } else {
          setCalculatedDistance(null); // Use default shipping when all methods fail
        }
      } catch (fallbackError) {
        console.error('Fallback distance calculation also failed:', fallbackError);
        setCalculatedDistance(null); // Use default shipping when all methods fail
      }
    } finally {
      setIsCalculatingDistance(false);
    }
  }, [productLocation, toast]);

  // Effect to auto-calculate distance when address is selected (new system)
  useEffect(() => {
    if (selectedAddress && selectedAddress.street && productLocation) {
      console.log('Auto-calculating distance for selected address:', selectedAddress);
      const fullAddress = `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, Nigeria`;
      calculateAddressDistance(fullAddress);
    }
  }, [selectedAddress, productLocation, calculateAddressDistance]);

  const handleQuickAddressSave = async () => {
    if (!user || !userProfile) return;

    // Validate required fields
    if (!quickAddressForm.street.trim()) {
      toast({
        variant: "destructive",
        title: "Incomplete address",
        description: "Please select a valid address.",
      });
      return;
    }
    
    // Check if we have city and state (should be extracted from GooglePlaces)
    // if (!quickAddressForm.city.trim() || !quickAddressForm.state.trim()) {
    //   toast({
    //     variant: "destructive",
    //     title: "Address incomplete",
    //     description: "Please select an address from the suggestions to ensure proper delivery.",
    //   });
    //   return;
    // }

    // Validate phone number is required
    if (!quickAddressForm.phone.trim()) {
      toast({
        variant: "destructive",
        title: "Phone number required",
        description: "Please provide a phone number for delivery contact.",
      });
      return;
    }

    // Validate state-city combination (skip if address is from Google Places)
    if (!quickAddressForm.isFromGooglePlaces && !validateStateCity(quickAddressForm.state, quickAddressForm.city)) {
      toast({
        variant: "destructive", 
        title: "Invalid location",
        description: `${quickAddressForm.city} is not a valid city in ${quickAddressForm.state} state.`,
      });
      return;
    }

    // Basic validation for street address (skip if address is from Google Places)
    if (!quickAddressForm.isFromGooglePlaces && quickAddressForm.street.trim().length < 10) {
      toast({
        variant: "destructive",
        title: "Invalid street address", 
        description: "Please enter a complete street address (minimum 10 characters).",
      });
      return;
    }

    try {
      // Auto-generate address name based on existing addresses count
      const existingAddresses = userProfile.addresses || [];
      const addressCount = existingAddresses.length + 1;
      const autoGeneratedName = `Address ${addressCount}`;
      
      const newAddress = {
        id: Date.now().toString(),
        type: 'other' as const,
        name: autoGeneratedName,
        street: quickAddressForm.street,
        city: quickAddressForm.city,
        state: quickAddressForm.state,
        country: 'Nigeria',
        phone: quickAddressForm.phone,
        isDefault: false,
      };

      const updatedAddresses = [...existingAddresses, newAddress];

      await updateUserProfile(user.uid, {
        addresses: updatedAddresses,
      });

      setSelectedAddress(newAddress);
      setShowQuickAddressForm(false);
      setQuickAddressForm({ name: '', street: '', city: '', state: '', phone: '', isFromGooglePlaces: false });

      toast({
        title: "Address saved",
        description: "Your new address has been added and selected for delivery.",
      });

      // Calculate distance for the new address
      if (newAddress.street && productLocation) {
        calculateAddressDistance(`${newAddress.street}, ${newAddress.city}, ${newAddress.state}, Nigeria`);
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        variant: "destructive",
        title: "Error saving address",
        description: "Please try again.",
      });
    }
  };

  // Auto-select default address when user profile loads
  useEffect(() => {
    if (userProfile && userProfile.addresses && userProfile.addresses.length > 0 && !selectedAddress) {
      const defaultAddress = userProfile.addresses.find(addr => addr.isDefault) || userProfile.addresses[0];
      console.log('Auto-selecting default address:', defaultAddress);
      handleAddressSelect(defaultAddress);
    }
  }, [userProfile]);

  // Function to remove a saved user (keeping for backward compatibility)
  const handleRemoveUser = (email: string) => {
    const updatedUsers = savedUsers.filter((user) => user.email !== email);
    setSavedUsers(updatedUsers);
    localStorage.setItem("savedUsers", JSON.stringify(updatedUsers));

    // If the removed user was selected, clear selection
    if (selectedUser && selectedUser.email === email) {
      setSelectedUser(null);
      setCalculatedDistance(null);
    }

    toast({
      title: "User removed",
      description: "User has been removed from your saved addresses",
    });
  };

  // Handle estimated billing agreement
  const handleAgreeToEstimatedBilling = (prefilledAddress?: string) => {
    setAgreedToEstimatedBilling(true);
    setShowEstimatedBillingForm(true);
    setShowQuickAddressForm(false); // Close the quick address form
    
    // Pre-fill the estimated billing form with the address user was typing
    if (prefilledAddress) {
      setEstimatedBillingForm(prev => ({
        ...prev,
        address: prefilledAddress
      }));
      
      // Try to calculate distance with the prefilled address if we have coordinates
      if (productLocation) {
        calculateAddressDistance(prefilledAddress);
      }
    }
    
    // If no prefilled address or distance calculation fails, keep null to use default shipping
    if (!prefilledAddress) {
      setCalculatedDistance(null);
    }
    
    toast({
      title: "Using estimated delivery cost",
      description: "Complete address details for better estimates.",
    });
  };

  // Handle estimated billing form submission
  const handleEstimatedBillingFormSubmit = async () => {
    if (!user || !userProfile) return;

    // Validate form
    if (!estimatedBillingForm.address.trim() || !estimatedBillingForm.city.trim() || 
        !estimatedBillingForm.state.trim() || !estimatedBillingForm.postalCode.trim() ||
        !estimatedBillingForm.phone.trim()) {
      toast({
        variant: "destructive",
        title: "Incomplete address",
        description: "Please fill in all required fields including phone number.",
      });
      return;
    }

    // Validate state-city combination
    if (!validateStateCity(estimatedBillingForm.state, estimatedBillingForm.city)) {
      toast({
        variant: "destructive",
        title: "Invalid location",
        description: `${estimatedBillingForm.city} is not a valid city in ${estimatedBillingForm.state} state.`,
      });
      return;
    }

    try {
      // Auto-generate address name based on existing addresses count
      const existingAddresses = userProfile.addresses || [];
      const addressCount = existingAddresses.length + 1;
      const autoGeneratedName = `Address ${addressCount}`;
      
      const newAddress = {
        id: Date.now().toString(),
        type: 'other' as const,
        name: autoGeneratedName,
        street: `${estimatedBillingForm.address}, ${estimatedBillingForm.postalCode}`,
        city: estimatedBillingForm.city,
        state: estimatedBillingForm.state,
        country: 'Nigeria',
        phone: estimatedBillingForm.phone,
        isDefault: false,
      };

      const updatedAddresses = [...(userProfile.addresses || []), newAddress];

      await updateUserProfile(user.uid, {
        addresses: updatedAddresses,
      });

      setSelectedAddress(newAddress);
      setShowEstimatedBillingForm(false);
      
      // Calculate distance with the new address
      if (newAddress.street && productLocation) {
        calculateAddressDistance(`${newAddress.street}, ${newAddress.city}, ${newAddress.state}, Nigeria`);
      }

      toast({
        title: "Address saved",
        description: "Your estimated billing address has been saved and selected.",
      });
    } catch (error) {
      console.error('Error saving estimated billing address:', error);
      toast({
        variant: "destructive",
        title: "Error saving address",
        description: "Please try again.",
      });
    }
  };

  const config = getPaystackConfig(
    selectedUser?.email || user?.email as string,
    total * 100,
    settings?.paystackPublicKey
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Your Cart - Aycee Builder</title>
        <meta
          name="description"
          content="Review your cart items and checkout"
        />
        <meta
          property="og:title"
          content="Your Shopping Cart - Aycee Builder"
        />
        <meta
          property="og:description"
          content="Review your selected construction materials and complete your purchase."
        />
        <meta property="og:image" content="/images/og-cart.jpg" />
        <meta property="og:type" content="website" />
      </Head>

      <main className="flex-grow pt-20">
        <div className="bg-secondary/5 py-6">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold mb-2">Your Cart</h1>
              <div className="flex items-center text-sm text-muted-foreground">
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <span>Cart</span>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className={`container mx-auto px-4 py-10 transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"
            }`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {paymentConfirmed ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-3">
                  Payment confirmed, Order processing
                </h2>
                <p className="text-muted-foreground mb-8">
                  Your order has been received and is being processed.
                  You&apos;ll receive a confirmation email shortly.
                </p>

                {/* Receipt Download Button - Update to use saved items */}
                {selectedUser && (
                  <DownloadableReceipt
                    orderData={{
                      reference: orderReference,
                      user: {
                        name: selectedUser.name,
                        email: selectedUser.email,
                        address: selectedUser.address,
                        phone: selectedUser.phone || "",
                      },
                      items: confirmedItems,
                      totalAmount: confirmedTotal,
                      transportFare: deliveryCost,
                      distance: deliveryDistance,
                      weight: deliveryWeight,
                    }}
                  />
                )}

                <Link href="/products" className="block mt-6">
                  <Button size="lg">Continue Shopping</Button>
                </Link>
              </div>
            </div>
          ) : cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
              {/* Cart Items */}
              <motion.div
                variants={itemVariants}
                className="lg:col-span-2 overflow-x-hidden"
              >
                <div className="overflow-x-auto bg-white rounded-xl border flex flex-col">
                  <div className="p-4 border-b bg-secondary/10  min-w-[50rem]  ">
                    <div className="grid grid-cols-12 gap-4 text-sm font-medium">
                      <div className="col-span-6">Product</div>
                      <div className="col-span-2 text-center">Price</div>
                      <div className="col-span-2 text-center">Quantity</div>
                      <div className="col-span-2 text-right">Total</div>
                    </div>
                  </div>

                  <div className="divide-y  min-w-[50rem]">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        className="p-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-6">
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-16 bg-secondary/20 rounded overflow-hidden">
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <Link
                                  href={`/products/${item.product.id
                                    }?searchTitle=${encodeURIComponent(
                                      item.product.name
                                    )}`}
                                  className="font-medium hover:text-primary"
                                >
                                  {" "}
                                  {item.product.name}
                                </Link>
                                {item.product.inStock ? (
                                  <div className="text-xs text-green-600 mt-1">
                                    In Stock
                                  </div>
                                ) : (
                                  <div className="text-xs text-red-500 mt-1 flex items-center">
                                    <AlertCircle size={12} className="mr-1" />
                                    Out of Stock
                                  </div>
                                )}
                                {item.color && (
                                  <div className="flex items-center text-xs text-gray-600 mt-1">
                                    <div
                                      className="w-3 h-3 rounded-full mr-1.5"
                                      style={{
                                        backgroundColor: getColorValue(
                                          item.color
                                        ),
                                        border: "1px solid rgba(0,0,0,0.1)",
                                      }}
                                    ></div>
                                    Color: {item.color}
                                  </div>
                                )}
                                {item.variant && (
                                  <div className="text-xs text-gray-600 mt-1">
                                    Variant: {item.variant.variant_name}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="col-span-2 text-center">
                            {/* Use variant price if available, otherwise use product price */}
                            {(() => {
                              // console.log('Cart item for price display:', {
                              //   productName: item.product.name,
                              //   hasVariant: !!item.variant,
                              //   variantName: item.variant?.variant_name,
                              //   variantPrice: item.variant?.variant_price,
                              //   productPrice: item.product.price,
                              //   productDiscountPrice: item.product.discountPrice
                              // });
                              
                                                              const displayPrice = item.product.price * 1.2;

                              if (item.variant && typeof item.variant.variant_price === 'number') {
                                return (
                                  <div className="font-medium">
                                    <div>₦{item.variant.variant_price.toLocaleString()}</div>
                                    <div className="text-xs text-green-600">Variant: {item.variant.variant_name}</div>
                                  </div>
                                );
                              } else if (item.product.price) {
                                return (
                                  <div>
                                    <div className="font-medium">
                                      ₦{item.product.price.toFixed(2).toLocaleString()}
                                    </div>
                                    <div className="text-xs text-muted-foreground line-through">
                                      ₦{displayPrice}
                                    </div>
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="font-medium">
                                    ₦{item.product.price.toFixed(2).toLocaleString()}
                                  </div>
                                );
                              }
                            })()}
                          </div>

                          <div className="col-span-2 flex justify-center">
                            <div className="flex items-center border rounded-md">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-none"
                                onClick={() =>
                                  handleUpdateQuantity(item.id, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={14} />
                              </Button>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleUpdateQuantity(
                                    item.id,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="w-12 h-8 text-center border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-none"
                                onClick={() =>
                                  handleUpdateQuantity(item.id, item.quantity + 1)
                                }
                              >
                                <Plus size={14} />
                              </Button>
                            </div>
                          </div>

                          <div className="col-span-2 text-right">
                            <div className="font-medium">
                              ₦
                              {(() => {
                                let unitPrice = item.product.discountPrice || item.product.price;
                                if (item.variant && item.variant.variant_price) {
                                  unitPrice = item.variant.variant_price;
                                }
                                console.log('Line total calculation:', { itemName: item.product.name, unitPrice, quantity: item.quantity, total: unitPrice * item.quantity });
                                return (unitPrice * item.quantity).toLocaleString();
                              })()}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRemoveFromCart(item.id)}
                            >
                              <Trash2 size={14} className="mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 justify-between mt-6">
                  <Link href="/products">
                    <Button variant="outline">
                      <ArrowRight size={16} className="mr-2 rotate-180" />
                      Continue Shopping
                    </Button>
                  </Link>

                  <Button variant="outline" onClick={clearCart}>
                    <Trash2 size={16} className="mr-2" />
                    Clear Cart
                  </Button>
                </div>
              </motion.div>

              {/* Order Summary */}
              <motion.div variants={itemVariants} className="lg:col-span-1">
                <div className="bg-white rounded-xl border p-6 space-y-6 sticky top-24">
                  <h2 className="text-lg font-bold">Order Summary</h2>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">
                        ₦{subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">VAT (7.5%)</span>
                      <span className="font-medium">
                        ₦{tax.toLocaleString()}
                      </span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span className="font-medium">
                          -₦{discountAmount.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {/* Delivery Options - New Clean Design */}
                    <div className="pt-3 pb-1 border-t">
                      <h3 className="font-medium mb-2">Delivery Information</h3>

                      {userProfile ? (
                        <div className="space-y-3">
                          {/* User Info Display */}
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm font-medium">{userProfile.name}</div>
                            <div className="text-sm text-gray-600">{user?.email}</div>
                            {userProfile.phone && (
                              <div className="text-sm text-gray-600">{userProfile.phone}</div>
                            )}
                          </div>

                          {/* Address Selection */}
                          {userProfile.addresses && userProfile.addresses.length > 0 ? (
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Label className="text-sm font-medium">Delivery Address</Label>
                                <Link
                                  href="/dashboard/profile"
                                  onClick={() => {
                                    localStorage.setItem('authRedirectUrl', window.location.pathname + window.location.search);
                                  }}
                                >
                                  <Button variant="link" className="text-xs p-0 h-auto">
                                    Manage addresses
                                  </Button>
                                </Link>
                              </div>

                              <div className="space-y-2">
                                {userProfile.addresses.map((address) => (
                                  <div
                                    key={address.id}
                                    className={`p-3 border rounded-lg cursor-pointer transition-all ${selectedAddress?.id === address.id
                                      ? "border-primary bg-primary/5"
                                      : "hover:border-gray-400"
                                      }`}
                                    onClick={() => handleAddressSelect(address)}
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                          <span className="font-medium text-sm">{address.name}</span>
                                          <Badge variant={address.type === 'home' ? 'default' : 'secondary'} className="text-xs">
                                            {address.type}
                                          </Badge>
                                          {address.isDefault && (
                                            <Badge variant="outline" className="text-xs">Default</Badge>
                                          )}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                          {address.street}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          {address.city}, {address.state}
                                        </div>
                                        {address.phone && (
                                          <div className="text-xs text-gray-500 mt-1">
                                            📞 {address.phone}
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {selectedAddress?.id === address.id && calculatedDistance !== null && (
                                      <div className="mt-2 pt-2 border-t border-gray-200">
                                        <div className="flex items-center text-sm text-primary">
                                          <Truck size={14} className="mr-1" />
                                          <span>Distance: {calculatedDistance.toFixed()} km</span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>

                              {/* Quick Add Address Option */}
                              <div
                                className="p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors"
                                onClick={() => setShowQuickAddressForm(true)}
                              >
                                <div className="flex items-center justify-center space-x-2 text-gray-600">
                                  <Plus size={16} />
                                  <span className="text-sm">Add new delivery address</span>
                                </div>
                              </div>

                              {/* Quick Address Form */}
                              {showQuickAddressForm && (
                                <div className="border border-primary/20 rounded-lg p-4 bg-primary/5">
                                  <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium text-sm">Add New Address</h4>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setShowQuickAddressForm(false);
                                        setQuickAddressForm({ name: '', street: '', city: '', state: '', phone: '', isFromGooglePlaces: false });
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>

                                  <div className="space-y-3">
                                    <GooglePlacesAutocomplete
                                      value={quickAddressForm.street}
                                      onChange={(value) => setQuickAddressForm(prev => ({ ...prev, street: value }))}
                                      onPlaceSelect={(place) => {
                                        // Validate address before accepting it
                                        const addressStr = place.address || place.formatted_address || place.name || '';
                                        if (!addressStr || addressStr.trim().length < 10) {
                                          toast({
                                            variant: "destructive",
                                            title: "Invalid address",
                                            description: "Please enter a complete, valid address in Nigeria (e.g., '123 Allen Avenue, Ikeja, Lagos').",
                                          });
                                          return;
                                        }
                                        
                                        // Extract city and state from the address string
                                        const addressParts = addressStr.split(',').map(part => part.trim());
                                        let extractedCity = '';
                                        let extractedState = '';
                                        
                                        // Try to identify state and city from address parts
                                        const allStates = getAllStateNames();
                                        for (const part of addressParts) {
                                          // Skip country names
                                          if (part.toLowerCase().includes('nigeria')) continue;
                                          
                                          const matchingState = allStates.find(state => 
                                            part.toLowerCase().includes(state.toLowerCase()) ||
                                            (state.toLowerCase().includes(part.toLowerCase()) && part.length > 3)
                                          );
                                          if (matchingState) {
                                            extractedState = matchingState;
                                            break;
                                          }
                                        }
                                        
                                        // If we found a state, try to find a city
                                        if (extractedState) {
                                          const stateCities = getCitiesForState(extractedState);
                                          for (const part of addressParts) {
                                            const matchingCity = stateCities.find(city => 
                                              part.toLowerCase().includes(city.toLowerCase()) || 
                                              city.toLowerCase().includes(part.toLowerCase())
                                            );
                                            if (matchingCity) {
                                              extractedCity = matchingCity;
                                              break;
                                            }
                                          }
                                        }

                                        setQuickAddressForm(prev => ({ 
                                          ...prev, 
                                          street: addressStr,
                                          city: extractedCity,
                                          state: extractedState,
                                          isFromGooglePlaces: true
                                        }));
                                        // Only set coordinates if they are valid (not 0,0)
                                        if (place.lat && place.lng && (place.lat !== 0 || place.lng !== 0)) {
                                          setSelectedPlaceCoordinates({
                                            lat: place.lat,
                                            lng: place.lng,
                                            address: addressStr,
                                            placeId: place.placeId
                                          });
                                        } else {
                                          setSelectedPlaceCoordinates(null);
                                        }

                                        toast({
                                          title: "Address validated",
                                          description: "Valid address selected for delivery.",
                                        });
                                      }}
                                      placeholder="Start typing your address"
                                      showEstimatedBillingOption={true}
                                      onAgreeToEstimatedBilling={handleAgreeToEstimatedBilling}
                                    />
                                    <div className="space-y-2">
                                      <Label htmlFor="quickPhoneNumber">Phone Number *</Label>
                                      <Input
                                        id="quickPhoneNumber"
                                        type="tel"
                                        value={quickAddressForm.phone}
                                        onChange={(e) => setQuickAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                                        placeholder="Enter your phone number"
                                        required
                                      />
                                    </div>
                                    <Button
                                      className="w-full"
                                      onClick={handleQuickAddressSave}
                                      disabled={!quickAddressForm.street.trim() || !quickAddressForm.phone.trim()}
                                    >
                                      Save & Select Address
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-6">
                              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                              <p className="text-sm text-gray-600 mb-3">No delivery addresses saved</p>
                              <Link
                                href="/dashboard/profile"
                                onClick={() => {
                                  localStorage.setItem('authRedirectUrl', window.location.pathname + window.location.search);
                                }}
                              >
                                <Button variant="outline" size="sm">
                                  Add Address in Profile
                                </Button>
                              </Link>
                            </div>
                          )}

                          {/* Distance Calculation Status */}
                          {selectedAddress && isCalculatingDistance && (
                            <div className="flex items-center justify-center text-sm text-gray-600 py-2">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Calculating delivery distance...
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <UserX className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-600 mb-3">Complete your profile to continue</p>
                          <Link
                            href="/dashboard/profile"
                            onClick={() => {
                              localStorage.setItem('authRedirectUrl', window.location.pathname + window.location.search);
                            }}
                          >
                            <Button size="sm">
                              Complete Profile
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Sliding form for estimated billing address */}
                    {showEstimatedBillingForm && (
                      <div className="border border-orange-200 rounded-lg p-4 bg-orange-50 mt-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-sm text-orange-800">Estimated Billing Address</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setShowEstimatedBillingForm(false);
                              setAgreedToEstimatedBilling(false);
                              setCalculatedDistance(null);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <Input
                            placeholder="Street address"
                            value={estimatedBillingForm.address}
                            onChange={(e) => setEstimatedBillingForm(prev => ({ ...prev, address: e.target.value }))}
                            className="text-sm"
                          />
                          
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              placeholder="Postal code"
                              value={estimatedBillingForm.postalCode}
                              onChange={(e) => setEstimatedBillingForm(prev => ({ ...prev, postalCode: e.target.value }))}
                              className="text-sm"
                            />
                            <div>
                              <Select
                                value={estimatedBillingForm.state}
                                onValueChange={(value) => setEstimatedBillingForm(prev => ({ ...prev, state: value, city: '' }))}
                              >
                                <SelectTrigger className="text-sm">
                                  <SelectValue placeholder="State" />
                                </SelectTrigger>
                                <SelectContent className="max-h-32 overflow-y-auto">
                                  {getAllStateNames().map((state) => (
                                    <SelectItem key={state} value={state} className="text-sm">
                                      {state}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div>
                            <Select
                              value={estimatedBillingForm.city}
                              onValueChange={(value) => setEstimatedBillingForm(prev => ({ ...prev, city: value }))}
                              disabled={!estimatedBillingForm.state}
                            >
                              <SelectTrigger className="text-sm">
                                <SelectValue placeholder={estimatedBillingForm.state ? "Select City" : "Select State first"} />
                              </SelectTrigger>
                              <SelectContent className="max-h-32 overflow-y-auto">
                                {estimatedBillingForm.state && getCitiesForState(estimatedBillingForm.state).map((city) => (
                                  <SelectItem key={city} value={city} className="text-sm">
                                    {city}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-sm">Phone Number *</Label>
                            <Input
                              type="tel"
                              placeholder="Enter your phone number"
                              value={estimatedBillingForm.phone}
                              onChange={(e) => setEstimatedBillingForm(prev => ({ ...prev, phone: e.target.value }))}
                              className="text-sm"
                              required
                            />
                          </div>

                          <Button
                            className="w-full text-sm h-8"
                            onClick={handleEstimatedBillingFormSubmit}
                            disabled={!estimatedBillingForm.address || !estimatedBillingForm.postalCode || !estimatedBillingForm.city || !estimatedBillingForm.state || !estimatedBillingForm.phone}
                          >
                            Save Estimated Address
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedAddress && (
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-muted-foreground font-medium">
                            Delivery Details
                          </span>
                          {getDeliveryBreakdown() && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs p-0 underline"
                              onClick={() => {
                                const breakdown = getDeliveryBreakdown();
                                toast({
                                  title: "Delivery Cost Breakdown",
                                  description: (
                                    <div className="text-sm space-y-1 mt-2">
                                      <div className="flex justify-between">
                                        <span>Base Fare:</span>
                                        <span>
                                          ₦
                                          {breakdown?.baseFare.toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>
                                          Distance ({calculatedDistance?.toFixed()}km):
                                        </span>
                                        <span>
                                          ₦
                                          {breakdown?.distanceCost.toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>
                                          Time ({breakdown?.timeHours}h):
                                        </span>
                                        <span>
                                          ₦
                                          {breakdown?.timeCost.toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>
                                          Weight ({deliveryWeight}kg @ ₦
                                          {breakdown?.weightRate}/kg):
                                        </span>
                                        <span>
                                          ₦
                                          {breakdown?.weightCost.toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Heavy Traffic Fee:</span>
                                        <span>
                                          ₦
                                          {breakdown?.surgeCost.toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Toll Fee:</span>
                                        <span>
                                          ₦
                                          {breakdown?.tollsCost.toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Wait Time Fee:</span>
                                        <span>
                                          ₦
                                          {breakdown?.waitTimeCost.toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="border-t pt-1 mt-1"></div>
                                      <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>
                                          ₦
                                          {breakdown?.subtotalDeliveryCost.toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Service Fee (7.5%):</span>
                                        <span>
                                          ₦
                                          {breakdown?.serviceFee.toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex justify-between font-medium">
                                        <span>Total Delivery:</span>
                                        <span>
                                          ₦{breakdown?.total.toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                  ),
                                  duration: 8000,
                                });
                              }}
                            >
                              View breakdown
                            </Button>
                          )}
                        </div>

                        {calculatedDistance !== null ? (
                          getDeliveryBreakdown() && (
                            <div className="text-sm space-y-1.5">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Distance
                                </span>
                                <span>{calculatedDistance.toFixed()} km</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Weight
                                </span>
                                <span>{deliveryWeight} kg</span>
                              </div>
                              <div className="flex justify-between font-medium">
                                <span className="text-muted-foreground">
                                  Delivery Fee
                                </span>
                                <span>₦{deliveryCost.toLocaleString()}</span>
                              </div>
                            </div>
                          )
                        ) : (
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Weight</span>
                              <span>{deliveryWeight} kg</span>
                            </div>
                          
                            
                          </div>
                        )}
                      </div>
                    )}


                    <div className="border-t pt-3 flex justify-between items-center">
                      <span className="font-bold">Total</span>
                      <span className="text-xl font-bold">
                        ₦{total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Promo Code</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className={promoApplied ? "border-green-500" : ""}
                      />
                      <Button
                        variant="outline"
                        disabled={!promoCode || promoApplied}
                        onClick={applyPromoCode}
                        className={`${promoApplied
                          ? "bg-green-500 text-white cursor-not-allowed"
                          : "bg-primary text-white"
                          } px-4 py-2 rounded-xl shadow hover:bg-primary/80 transition-all `}
                      >
                        Apply
                      </Button>
                    </div>
                    {promoApplied && (
                      <p className="text-xs text-green-600">
                        Promo code applied successfully!
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <Link href="/building-quotation">
                      <Button variant="outline" className="w-full mb-3">
                        <Calculator size={16} className="mr-2" />
                        Building Quotation Tool
                      </Button>
                    </Link>

                    {!user ? (
                      <div className="space-y-3">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-center space-x-2">
                            <UserX className="h-5 w-5 text-yellow-600" />
                            <p className="text-sm text-yellow-800">
                              Please sign in to place an order
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            href="/login"
                            className="flex-1"
                            onClick={() => {
                              // Store current cart URL for redirect after login
                              localStorage.setItem('authRedirectUrl', window.location.pathname + window.location.search);
                            }}
                          >
                            <Button variant="outline" className="w-full">
                              Sign In
                            </Button>
                          </Link>
                          <Link
                            href="/register"
                            className="flex-1"
                            onClick={() => {
                              // Store current cart URL for redirect after registration
                              localStorage.setItem('authRedirectUrl', window.location.pathname + window.location.search);
                            }}
                          >
                            <Button className="w-full">
                              Sign Up
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => {
                          if (selectedAddress && calculatedDistance !== null) {
                            analytics.trackProceedToCheckout(
                              total,
                              cartItems.length,
                              'NGN',
                              `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}`
                            );
                          }
                        }}
                      >
                        <PaystackButton
                          text={
                            !selectedAddress
                              ? "Select delivery address to proceed"
                              : calculatedDistance === null
                                ? "Calculate delivery distance to proceed"
                                : "Proceed to Checkout"
                          }
                          disabled={!selectedAddress || calculatedDistance === null}
                          className={`w-full px-4 py-2 rounded-xl shadow transition-all ${!selectedAddress || calculatedDistance === null
                            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                            : "bg-primary text-white hover:bg-primary/80"
                            }`}
                          {...config}
                          onSuccess={handlePaystackSuccess}
                          onClose={handlePaystackClose}
                        />
                      </div>
                    )}

                    <div className="mt-4 text-xs text-center text-muted-foreground">
                      By proceeding, you agree to our Terms of Service and
                      Privacy Policy
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            <motion.div className="text-center py-16" variants={itemVariants}>
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-secondary/30 flex items-center justify-center">
                  <ShoppingBag size={32} className="text-muted-foreground" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Looks like you haven&apos;t added any products to your cart yet.
                Browse our collection and find quality construction materials
                for your project.
              </p>
              <Link href="/products">
                <Button size="lg">Start Shopping</Button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Payment Processing Overlay */}
      {isProcessingPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
            <div className="flex justify-center mb-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please wait while we verify your payment and process your order...
            </p>
            <div className="text-xs text-gray-500">
              This may take a few moments
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
