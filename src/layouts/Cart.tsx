"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { getPaystackConfig } from "@/lib/paystack";
import Link from "next/link";
import { Label } from "@/components/ui/label";

// Interface for geocoding response
interface GeocodingResult {
  lat: string;
  lon: string;
  display_name: string;
}

// Dynamically import PaystackButton with SSR disabled:
const PaystackButton = dynamic(
  async () => {
    const { PaystackButton } = await import("react-paystack");
    return PaystackButton;
  },
  { ssr: false }
);

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isLoaded, setIsLoaded] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [deliveryLocation, setDeliveryLocation] = useState("lagos");
  const [deliveryDistance, setDeliveryDistance] = useState(10);
  const [deliveryWeight, setDeliveryWeight] = useState(500);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [savedUsers, setSavedUsers] = useState<
    | {
        name: string;
        email: string;
        address: string;
      }[]
    | []
  >([]);
  const [selectedUser, setSelectedUser] = useState<{
    name: string;
    email: string;
    address: string;
  } | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [newUserDetails, setNewUserDetails] = useState<{
    name: string;
    email: string;
    address: string;
  }>({
    name: "",
    email: "",
    address: "",
  });

  // New state for address autocomplete
  const [addressInput, setAddressInput] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<
    Array<{ display_name: string; place_id: string }>
  >([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // State for distance calculation
  const [calculatedDistance, setCalculatedDistance] = useState<number | null>(
    null
  );
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [productLocation, setProductLocation] = useState(
    "Ikeja City Mall, Alausa, Obafemi Awolowo Wy, Oregun, Ikeja"
  );

  // Add state to track if we're showing the address selection UI
  const [showAddressSelection, setShowAddressSelection] = useState(false);

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

  // Function to fetch address suggestions
  const fetchAddressSuggestions = async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingAddresses(true);
    try {
      const response = await fetch(
        `https://api.locationiq.com/v1/autocomplete?key=${
          process.env.NEXT_PUBLIC_LOCATION_IQ_API_KEY
        }&q=${encodeURIComponent(query)}&limit=5&dedupe=1`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch address suggestions");
      }

      const data = await response.json();
      setAddressSuggestions(data || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load address suggestions",
      });
      setAddressSuggestions([]);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  // Debounce function for address input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (addressInput) {
        fetchAddressSuggestions(addressInput);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [addressInput]);

  // Handle selecting an address from suggestions
  const handleSelectAddress = (address: string) => {
    setAddressInput(address);
    setNewUserDetails({
      ...newUserDetails,
      address,
    });
    setShowSuggestions(false);
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

  // Function to geocode an address using LocationIQ
  const geocodeAddress = async (
    address: string
  ): Promise<GeocodingResult | null> => {
    try {
      const response = await fetch(
        `https://us1.locationiq.com/v1/search.php?key=${
          process.env.NEXT_PUBLIC_LOCATION_IQ_API_KEY
        }&q=${encodeURIComponent(address)}&format=json`
      );

      if (!response.ok) {
        throw new Error("Failed to geocode address");
      }

      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: data[0].lat,
          lon: data[0].lon,
          display_name: data[0].display_name,
        };
      }
      return null;
    } catch (error) {
      console.error("Error geocoding address:", error);
      return null;
    }
  };

  // Calculate distance between two points using Haversine formula
  const calculateHaversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  // Calculate the actual distance between product location and delivery address
  const calculateActualDistance = async () => {
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
      // Geocode the product location
      const productCoords = await geocodeAddress(productLocation);

      // Geocode the user's address
      const userCoords = await geocodeAddress(selectedUser.address);

      if (productCoords && userCoords) {
        // Calculate distance
        const distance = calculateHaversineDistance(
          parseFloat(productCoords.lat),
          parseFloat(productCoords.lon),
          parseFloat(userCoords.lat),
          parseFloat(userCoords.lon)
        );

        // Round to nearest integer
        const roundedDistance = Math.round(distance);
        setCalculatedDistance(roundedDistance);

        // Update delivery distance for cost calculation
        setDeliveryDistance(roundedDistance);

        toast({
          title: "Distance calculated",
          description: `Delivery distance: ${roundedDistance} km.`,
        });
      } else {
        throw new Error("Could not geocode addresses");
      }
    } catch (error) {
      console.error("Error calculating distance:", error);
      toast({
        variant: "destructive",
        title: "Error calculating distance",
        description:
          "Could not calculate the delivery distance. Using default estimate.",
      });
    } finally {
      setIsCalculatingDistance(false);
    }
  };

  // Calculate delivery cost based on location, distance, and weight
  const calculateDeliveryCost = () => {
    // Base delivery cost
    let baseCost = 1000;

    // Adjust based on location
    if (deliveryLocation === "abuja") baseCost += 500;
    if (deliveryLocation === "other") baseCost += 1000;

    // Adjust based on actual distance (₦50 per km) if available
    const distanceCost = deliveryDistance * 50;

    // Adjust based on weight (₦1 per kg)
    const weightCost = deliveryWeight * 1;

    return baseCost + distanceCost + weightCost;
  };

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const tax = subtotal * 0.075; // 7.5% VAT
  const deliveryCost = calculateDeliveryCost();
  const total = subtotal + tax + deliveryCost - discountAmount;

  const totalWeight = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.weight,
    0
  );

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "WELCOME10") {
      const discount = subtotal * 0.1; // 10% discount
      setDiscountAmount(discount);
      setPromoApplied(true);
      toast({
        title: "Promo code applied",
        description: "10% discount has been applied to your order",
      });
    } else {
      setPromoApplied(false);
      setDiscountAmount(0);
      toast({
        variant: "destructive",
        title: "Invalid promo code",
        description: "The promo code you entered is invalid or expired",
      });
    }
  };

  const handlePaystackSuccess = async (reference: string) => {
    try {
      if (selectedUser) {
        const res = await fetch("/api/paystack", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference,
            user: {
              email: selectedUser.email,
              name: selectedUser.name,
              address: selectedUser.address,
            },
            items: cartItems.map((item) => ({
              productName: item.product.name,
              unitPrice: item.product.discountPrice || item.product.price,
              quantity: item.quantity,
            })),
            totalAmount: total,
            location: selectedUser.address,
            transportFare: deliveryCost,
            distance: deliveryDistance,
            weight: deliveryWeight,
          }),
        });

        if (res.ok) {
          console.log({ res });
          clearCart();
          setPaymentConfirmed(true);
        }
      }
      // ...existing code...
    } catch (error) {
      console.error("Error sending payment data:", error);
    }
  };

  const handlePaystackClose = () => {
    // ...handle close...
  };

  const handleSaveNewUser = () => {
    if (
      !newUserDetails.name.trim() ||
      !newUserDetails.email.trim() ||
      !newUserDetails.address.trim()
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
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setShowAddressSelection(false); // Hide the address selection after selecting
    setShowUserForm(false);
    // Reset calculated distance so it can be recalculated
    setCalculatedDistance(null);
  };

  // Effect to auto-calculate distance when a user is selected
  useEffect(() => {
    if (selectedUser && selectedUser.address && productLocation) {
      calculateActualDistance();
    }
  }, [selectedUser, productLocation]);

  // Function to remove a saved user
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

  const config = getPaystackConfig("user@example.com", total * 100);

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
          className={`container mx-auto px-4 py-10 transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {paymentConfirmed ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-3">
                Payment confirmed, Order processing
              </h2>
              <p className="text-muted-foreground mb-8">
                Continue shopping for more items
              </p>
              <Link href="/products">
                <Button size="lg">Shop Now</Button>
              </Link>
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
                                  href={`/products/${item.product.id}`}
                                  className="font-medium hover:text-primary"
                                >
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
                              </div>
                            </div>
                          </div>

                          <div className="col-span-2 text-center">
                            {item.product.discountPrice ? (
                              <div>
                                <div className="font-medium">
                                  ₦{item.product.discountPrice.toLocaleString()}
                                </div>
                                <div className="text-xs text-muted-foreground line-through">
                                  ₦{item.product.price.toLocaleString()}
                                </div>
                              </div>
                            ) : (
                              <div className="font-medium">
                                ₦{item.product.price.toLocaleString()}
                              </div>
                            )}
                          </div>

                          <div className="col-span-2 flex justify-center">
                            <div className="flex items-center border rounded-md">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-none"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
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
                                  updateQuantity(
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
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                              >
                                <Plus size={14} />
                              </Button>
                            </div>
                          </div>

                          <div className="col-span-2 text-right">
                            <div className="font-medium">
                              ₦
                              {(
                                (item.product.discountPrice ||
                                  item.product.price) * item.quantity
                              ).toLocaleString()}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => removeFromCart(item.id)}
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

                    {/* Delivery Options */}
                    <div className="pt-3 pb-1 border-t">
                      <h3 className="font-medium mb-2">Delivery Information</h3>

                      <div className="space-y-3">
                        {/* Updated User Selection UI - Modified logic to handle empty savedUsers */}
                        {savedUsers.length > 0 && 
                         (showAddressSelection || (!selectedUser && !showUserForm)) ? (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label className="text-sm font-medium">
                                {selectedUser ? "Change delivery address" : "Select a saved address"}
                              </Label>
                              <Button 
                                variant="link" 
                                className="text-xs p-0 h-auto"
                                onClick={() => {
                                  setSelectedUser(null);
                                  setShowUserForm(true);
                                  setShowAddressSelection(false);
                                }}
                              >
                                Add new
                              </Button>
                            </div>

                            {/* User Cards */}
                            <div className="space-y-3">
                              {savedUsers.map((user, idx) => (
                                <div
                                  key={idx}
                                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                    selectedUser &&
                                    selectedUser.email === user.email
                                      ? "border-primary bg-primary/5"
                                      : "hover:border-gray-400"
                                  }`}
                                  onClick={() => handleSelectUser(user)}
                                >
                                  <div className="flex justify-between">
                                    <div className="font-medium">
                                      {user.name}
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveUser(user.email);
                                      }}
                                    >
                                      <UserX size={14} />
                                    </Button>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {user.email}
                                  </div>
                                  <div className="text-sm mt-1 break-words">
                                    {user.address}
                                  </div>

                                  {selectedUser &&
                                    selectedUser.email === user.email &&
                                    calculatedDistance !== null && (
                                      <div className="mt-2 text-sm flex items-center text-primary">
                                        <Truck size={14} className="mr-1" />
                                        <span>
                                          Distance: {calculatedDistance} km
                                        </span>
                                      </div>
                                    )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : showUserForm || savedUsers.length === 0 ? (
                          // User form - shown by default if no saved users
                          <div className="flex flex-col gap-4">
                            {savedUsers.length > 0 && (
                              <div className="flex justify-end">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setShowUserForm(false);
                                    setNewUserDetails({
                                      name: "",
                                      email: "",
                                      address: "",
                                    });
                                    setAddressInput("");
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                            <Label className="text-sm font-medium">
                              {savedUsers.length === 0 ? "Enter delivery details" : "Enter user details"}
                            </Label>
                            <div className="space-y-2">
                              <Label className="text-black/80">Name</Label>
                              <Input
                                placeholder="Jane Doe"
                                value={newUserDetails.name}
                                onChange={(e) =>
                                  setNewUserDetails({
                                    ...newUserDetails,
                                    name: e.target.value,
                                  })
                                }
                              />
                              <Label className="text-black/80">Email</Label>
                              <Input
                                placeholder="janedoe@gmail.com"
                                value={newUserDetails.email}
                                onChange={(e) =>
                                  setNewUserDetails({
                                    ...newUserDetails,
                                    email: e.target.value,
                                  })
                                }
                              />
                              <Label className="text-black/80">Address</Label>
                              <div className="relative">
                                <div className="flex">
                                  <Input
                                    placeholder="Start typing your address"
                                    value={addressInput}
                                    onChange={(e) =>
                                      setAddressInput(e.target.value)
                                    }
                                    className="w-full"
                                  />
                                  {isLoadingAddresses && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    </div>
                                  )}
                                </div>

                                {showSuggestions &&
                                  addressSuggestions.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                                      {addressSuggestions.map((suggestion) => (
                                        <div
                                          key={suggestion.place_id}
                                          className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-start"
                                          onClick={() =>
                                            handleSelectAddress(
                                              suggestion.display_name
                                            )
                                          }
                                        >
                                          <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                                          <span>{suggestion.display_name}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                              </div>
                            </div>
                            <Button
                              className="mt-3 w-full"
                              onClick={handleSaveNewUser}
                            >
                              Save User
                            </Button>
                          </div>
                        ) : selectedUser ? (
                          // Selected address with change button
                          <div className="mt-2 bg-secondary/10 p-3 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">
                                Delivery Address
                              </span>
                              <Button
                                variant="link"
                                className="text-xs p-0 h-auto"
                                onClick={() => setShowAddressSelection(true)}
                              >
                                Change address
                              </Button>
                            </div>

                            <div className="text-sm font-medium">
                              {selectedUser.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {selectedUser.email}
                            </div>
                            <div className="text-sm mt-1 break-words">
                              {selectedUser.address}
                            </div>

                            {isCalculatingDistance ? (
                              <div className="flex items-center text-sm mt-2 text-muted-foreground">
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                Calculating delivery distance...
                              </div>
                            ) : calculatedDistance !== null ? (
                              <div className="flex items-center text-sm mt-2 text-primary">
                                <Truck size={14} className="mr-1" />
                                <span>
                                  Estimated distance: {calculatedDistance} km
                                </span>
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {calculatedDistance && (
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-muted-foreground">
                          Delivery Fee
                        </span>
                        <span className="font-medium">
                          ₦{deliveryCost.toLocaleString()}
                          {calculatedDistance && (
                            <span className="text-xs text-muted-foreground ml-1">
                              ({calculatedDistance} km)
                            </span>
                          )}
                        </span>
                      </div>
                    )}

                    <div className="border-t pt-3 flex justify-between items-center">
                      <span className="font-bold">Total</span>
                      <span className="text-xl font-bold">
                        ₦{total.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Total Weight
                      </span>
                      <span className="font-medium">{totalWeight} kg</span>
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
                        className={`${
                          promoApplied
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

                    <PaystackButton
                      text="Proceed to Checkout"
                      disabled={!selectedUser}
                      className="w-full bg-primary text-white px-4 py-2 rounded-xl shadow hover:bg-primary/80 transition-all"
                      {...config}
                      onSuccess={handlePaystackSuccess}
                      onClose={handlePaystackClose}
                    />

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
    </div>
  );
};

export default Cart;