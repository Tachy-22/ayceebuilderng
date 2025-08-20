
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Truck, Package, MapPin, Calculator } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import GooglePlacesAutocomplete from "@/components/ui/GooglePlacesAutocomplete";
import { calculateHaversineDistance, geocodeAddress } from "@/lib/googlePlaces";

const DeliveryEstimator = () => {
  const [distance, setDistance] = useState(5);
  const [weight, setWeight] = useState(50);
  const [volume, setVolume] = useState(1);
  const [transportType, setTransportType] = useState("truck");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [originCoords, setOriginCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);

  const calculateActualDistance = async () => {
    if (!origin || !destination) {
      toast({
        title: "Missing information",
        description: "Please enter both origin and destination addresses.",
        variant: "destructive",
      });
      return;
    }

    setIsCalculatingDistance(true);

    try {
      // Use coordinates if available, otherwise geocode
      let originCoordinates = originCoords;
      let destinationCoordinates = destinationCoords;

      if (!originCoordinates) {
        const geocodedOrigin = await geocodeAddress(origin);
        if (geocodedOrigin) {
          originCoordinates = { lat: geocodedOrigin.lat, lng: geocodedOrigin.lng };
        }
      }

      if (!destinationCoordinates) {
        const geocodedDestination = await geocodeAddress(destination);
        if (geocodedDestination) {
          destinationCoordinates = { lat: geocodedDestination.lat, lng: geocodedDestination.lng };
        }
      }

      if (originCoordinates && destinationCoordinates) {
        const calculatedDistance = calculateHaversineDistance(
          originCoordinates.lat,
          originCoordinates.lng,
          destinationCoordinates.lat,
          destinationCoordinates.lng
        );

        // Update the distance slider
        setDistance(Math.round(calculatedDistance));

        toast({
          title: "Distance calculated",
          description: `Actual distance: ${Math.round(calculatedDistance)} km.`,
        });
      } else {
        let errorMessage = "Could not find valid addresses. ";
        
        if (!originCoordinates && !destinationCoordinates) {
          errorMessage += "Both pickup and delivery addresses appear to be invalid or not found in Nigeria.";
        } else if (!originCoordinates) {
          errorMessage += "Pickup address appears to be invalid or not found in Nigeria.";
        } else {
          errorMessage += "Delivery address appears to be invalid or not found in Nigeria.";
        }
        
        errorMessage += " Please enter real, specific addresses (e.g., '123 Allen Avenue, Ikeja, Lagos' or 'Shoprite Ikeja').";
        
        toast({
          variant: "destructive",
          title: "Invalid address(es)",
          description: errorMessage,
        });
        
        throw new Error("Invalid addresses provided");
      }
    } catch (error) {
      console.error("Error calculating distance:", error);
      toast({
        variant: "destructive",
        title: "Error calculating distance",
        description: "Could not calculate the actual distance. Please check your addresses.",
      });
    } finally {
      setIsCalculatingDistance(false);
    }
  };

  const calculateDeliveryCost = () => {
    if (!origin || !destination) {
      toast({
        title: "Missing information",
        description: "Please enter both origin and destination addresses.",
        variant: "destructive",
      });
      return;
    }

    // Check if we have valid coordinates (from successful geocoding)
    if (!originCoords || !destinationCoords) {
      toast({
        title: "Invalid addresses",
        description: "Please use the 'Calculate Actual Distance' button first to verify your addresses are valid.",
        variant: "destructive",
      });
      return;
    }

    // Base rates per transport type (in Naira)
    const baseRates = {
      truck: 1000,
      van: 750,
      motorcycle: 300,
    };

    // Calculate based on formula: base + (distance * weightFactor * volumeFactor)
    const base = baseRates[transportType as keyof typeof baseRates];
    const distanceFactor = distance * 50; // 50 Naira per km
    const weightFactor = weight * 2; // 2 Naira per kg
    const volumeFactor = volume * 500; // 500 Naira per cubic meter

    // Apply transport type multiplier
    const transportMultiplier =
      transportType === "truck" ? 1.0 :
        transportType === "van" ? 0.8 : 0.5;

    // Calculate total cost
    const cost = (base + distanceFactor + weightFactor + volumeFactor) * transportMultiplier;

    // Round to nearest 100 Naira
    const roundedCost = Math.ceil(cost / 100) * 100;

    setEstimatedCost(roundedCost);

    toast({
      title: "Estimate calculated",
      description: `The estimated delivery cost is ₦${roundedCost.toLocaleString()}.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20">
        <div className="bg-secondary/50 py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">Delivery Cost Estimator</h1>
            <p className="text-muted-foreground">
              Calculate approximate delivery costs for your construction materials
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    <span>Delivery Calculator</span>
                  </CardTitle>
                  <CardDescription>
                    Enter the details below to estimate your delivery cost
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <GooglePlacesAutocomplete
                    value={origin}
                    onChange={setOrigin}
                    onPlaceSelect={(place) => {
                      setOrigin(place.address);
                      setOriginCoords({ lat: place.lat, lng: place.lng });
                    }}
                    label="Pickup Location (Depot/Warehouse)"
                    placeholder="Enter pickup address in Nigeria"
                  />

                  <GooglePlacesAutocomplete
                    value={destination}
                    onChange={setDestination}
                    onPlaceSelect={(place) => {
                      setDestination(place.address);
                      setDestinationCoords({ lat: place.lat, lng: place.lng });
                    }}
                    label="Delivery Location"
                    placeholder="Enter delivery address in Nigeria"
                  />

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={calculateActualDistance}
                      disabled={!origin || !destination || isCalculatingDistance}
                      className="flex-1"
                    >
                      {isCalculatingDistance ? "Calculating..." : "Calculate Actual Distance"}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="distance">Distance (km)</Label>
                      <span className="text-sm text-muted-foreground">{distance.toFixed()} km</span>
                    </div>
                    <Slider
                      id="distance"
                      min={1}
                      max={50}
                      step={1}
                      value={[distance]}
                      onValueChange={(values) => setDistance(values[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <span className="text-sm text-muted-foreground">{weight} kg</span>
                    </div>
                    <Slider
                      id="weight"
                      min={10}
                      max={500}
                      step={10}
                      value={[weight]}
                      onValueChange={(values) => setWeight(values[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="volume">Volume (cubic meters)</Label>
                      <span className="text-sm text-muted-foreground">{volume} m³</span>
                    </div>
                    <Slider
                      id="volume"
                      min={0.1}
                      max={10}
                      step={0.1}
                      value={[volume]}
                      onValueChange={(values) => setVolume(values[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transport-type">Transport Type</Label>
                    <Select value={transportType} onValueChange={setTransportType}>
                      <SelectTrigger id="transport-type">
                        <SelectValue placeholder="Select transport type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="truck">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            <span>Truck (Heavy materials)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="van">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            <span>Van (Medium loads)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="motorcycle">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            <span>Motorcycle (Small items only)</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={calculateDeliveryCost} className="w-full">
                    Calculate Delivery Cost
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card className="bg-secondary/30">
                <CardHeader>
                  <CardTitle>Delivery Cost Breakdown</CardTitle>
                  <CardDescription>
                    Understanding how delivery costs are calculated
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {estimatedCost ? (
                    <div className="bg-background p-6 rounded-lg border">
                      <h3 className="text-xl font-bold mb-4">Estimated Cost</h3>
                      <div className="text-4xl font-bold text-primary mb-4">
                        ₦{estimatedCost.toLocaleString()}
                      </div>

                      <div className="space-y-2 pt-4 border-t">
                        <div className="flex justify-between">
                          <span>From:</span>
                          <span className="font-medium">{origin}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>To:</span>
                          <span className="font-medium">{destination}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Distance:</span>
                          <span className="font-medium">{distance.toFixed()} km</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Weight:</span>
                          <span className="font-medium">{weight} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Volume:</span>
                          <span className="font-medium">{volume} m³</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Transport Type:</span>
                          <span className="font-medium capitalize">{transportType}</span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <Button variant="outline" className="w-full">
                          Save Estimate
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Factors Affecting Delivery Cost:</h3>

                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">Distance</h4>
                            <p className="text-sm text-muted-foreground">
                              Longer distances incur higher costs due to fuel and time
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">Weight & Volume</h4>
                            <p className="text-sm text-muted-foreground">
                              Heavier and bulkier items require more resources to transport
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Truck className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">Transport Type</h4>
                            <p className="text-sm text-muted-foreground">
                              Different vehicles have different operating costs
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-primary/5 p-4 rounded-lg mt-6">
                        <p className="text-sm">
                          Enter your delivery details on the left to get an instant cost estimate.
                          This is an approximation and the final cost may vary slightly.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="mt-6 bg-background p-6 rounded-lg border">
                <h3 className="text-lg font-medium mb-4">Delivery Information</h3>
                <div className="space-y-4 text-sm">
                  <p>
                    <span className="font-medium">Standard Delivery:</span> 3-5 working days
                  </p>
                  <p>
                    <span className="font-medium">Express Delivery:</span> 1-2 working days (additional charges apply)
                  </p>
                  <p>
                    <span className="font-medium">Delivery Hours:</span> Monday to Saturday, 8am - 6pm
                  </p>
                  <p>
                    <span className="font-medium">Note:</span> Delivery to some remote areas may take longer
                    and incur additional charges. Our customer service will contact you if your location
                    falls under this category.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DeliveryEstimator;
