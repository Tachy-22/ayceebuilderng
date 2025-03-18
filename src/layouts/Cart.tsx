"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

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

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
    const existingUsers = localStorage.getItem("savedUsers");
    if (existingUsers) {
      setSavedUsers(JSON.parse(existingUsers));
    }
  }, []);

  // Calculate delivery cost based on location, distance, and weight
  const calculateDeliveryCost = () => {
    // Base delivery cost
    let baseCost = 1000;

    // Adjust based on location
    if (deliveryLocation === "abuja") baseCost += 500;
    if (deliveryLocation === "other") baseCost += 1000;

    // Adjust based on distance (₦50 per km)
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
            location: deliveryLocation,
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
    setShowUserForm(false);
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
                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">
                            Location
                          </label>
                          <Select
                            value={deliveryLocation}
                            onValueChange={setDeliveryLocation}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lagos">Lagos</SelectItem>
                              <SelectItem value="abuja">Abuja</SelectItem>
                              <SelectItem value="other">
                                Other Cities
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* <div>
                          <label className="text-sm text-muted-foreground mb-1 block">
                            Delivery Distance (km)
                          </label>
                          <Input
                            type="number"
                            value={deliveryDistance}
                            onChange={(e) =>
                              setDeliveryDistance(parseInt(e.target.value) || 0)
                            }
                            min="1"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">
                            Estimated Weight (kg)
                          </label>
                          <Input
                            type="number"
                            value={deliveryWeight}
                            onChange={(e) =>
                              setDeliveryWeight(parseInt(e.target.value) || 0)
                            }
                            min="1"
                          />
                        </div> */}
                      </div>
                    </div>

                    <div className="flex justify-between border-t pt-2">
                      <span className="text-muted-foreground">
                        Delivery Fee
                      </span>
                      <span className="font-medium">
                        ₦{deliveryCost.toLocaleString()}
                      </span>
                    </div>

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

                  <div className="space-y-4 p-4 border border-muted rounded-md bg-secondary/5">
                    {savedUsers.length > 0 && !showUserForm ? (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Select a saved user
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            handleSelectUser(
                              savedUsers.find((u) => u.email === value)
                            )
                          }
                          defaultValue={selectedUser?.email || ""}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="-- Select User --" />
                          </SelectTrigger>
                          <SelectContent className="">
                            {savedUsers.map((user, idx) => (
                              <SelectItem key={idx} value={user.email}>
                                {user.name} ({user.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          className="mt-2 w-full"
                          onClick={() => {
                            setSelectedUser(null);
                            setShowUserForm(true);
                          }}
                        >
                          Use new details
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
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
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <Label className="text-sm font-medium">
                          Enter user details
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
                          <Input
                            placeholder="No. 1 123 Street, City"
                            value={newUserDetails.address}
                            onChange={(e) =>
                              setNewUserDetails({
                                ...newUserDetails,
                                address: e.target.value,
                              })
                            }
                          />
                        </div>
                        <Button
                          className="mt-3 w-full"
                          onClick={handleSaveNewUser}
                        >
                          Save User
                        </Button>
                      </div>
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
