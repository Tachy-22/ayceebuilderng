"use client";
import React, { useState, useEffect } from "react";
import {
  Building,
  Calculator,
  Ruler,
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  Check,
  AlertTriangle,
  HardHat,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { toast } from "@/hooks/use-toast";
import Link from "next/link";

// Define project types with their descriptions
const projectTypes = [
  {
    id: "house",
    name: "Residential Building",
    description: "Single family home or apartment building",
  },
  {
    id: "commercial",
    name: "Commercial Building",
    description: "Office, retail, or other commercial space",
  },
  {
    id: "room",
    name: "Room Addition",
    description: "Adding a new room to existing structure",
  },
  {
    id: "renovation",
    name: "Renovation",
    description: "Renovating existing space",
  },
];

// Define roof types
const roofTypes = [
  { id: "flat", name: "Flat Roof" },
  { id: "gable", name: "Gable Roof" },
  { id: "hip", name: "Hip Roof" },
];

// Define building styles
const buildingStyles = [
  { id: "basic", name: "Basic (Minimum Standards)" },
  { id: "standard", name: "Standard (Average Quality)" },
  { id: "premium", name: "Premium (High-End Finishes)" },
];

// Define brick types
const wallMaterialTypes = [
  { id: "standard", name: "Standard Bricks" },
  { id: "hollow", name: "Hollow Blocks" },
  { id: "face", name: "Face Bricks" },
  { id: "concrete", name: "Concrete Panels" },
];

// Define floor types
const floorTypes = [
  { id: "ceramic", name: "Ceramic Tiles" },
  { id: "porcelain", name: "Porcelain Tiles" },
  { id: "concrete", name: "Concrete Flooring" },
  { id: "marble", name: "Marble/Granite" },
  { id: "wood", name: "Wooden Flooring" },
];

// Define tile sizes
const tileSizes = [
  { id: "small", name: "Small (25×25cm)" },
  { id: "medium", name: "Medium (50×50cm)" },
  { id: "large", name: "Large (100×100cm)" },
];

// Define material categories
const materialCategories = [
  {
    id: "foundation",
    name: "Foundation Materials",
    description: "Materials needed for the building foundation",
  },
  {
    id: "structure",
    name: "Structural Materials",
    description: "Concrete, reinforcement and structural elements",
  },
  {
    id: "walls",
    name: "Wall Materials",
    description: "Bricks, blocks and wall materials",
  },
  {
    id: "roofing",
    name: "Roofing Materials",
    description: "Roofing sheets, trusses and accessories",
  },
  {
    id: "flooring",
    name: "Flooring Materials",
    description: "Tiles, concrete and floor finishes",
  },
  {
    id: "electrical",
    name: "Electrical Materials",
    description: "Wires, outlets, switches and fixtures",
  },
  {
    id: "plumbing",
    name: "Plumbing Materials",
    description: "Pipes, fittings and fixtures",
  },
  {
    id: "finishing",
    name: "Finishing Materials",
    description: "Paint, doors, windows and finishes",
  },
];

// Define project templates with specific configurations
const projectTemplates = [
  {
    id: "bungalow",
    title: "2-Bedroom Bungalow",
    dimensions: "10m × 8m × 3m",
    rooms: "2 Bedrooms, 1 Bathroom, Kitchen, Living Area",
    keyMaterials: "5000 Blocks, 120 Bags of Cement, 40 Roofing Sheets",
    config: {
      projectType: "house",
      buildingStyle: "standard",
      dimensions: {
        length: 10,
        width: 8,
        height: 3,
        floors: 1,
        rooms: 2,
        bathrooms: 1,
      },
      roofType: "gable",
      wallMaterial: "standard",
      floorType: "ceramic",
      tileSize: "medium",
    }
  },
  {
    id: "duplex",
    title: "3-Bedroom Duplex",
    dimensions: "12m × 10m × 7m (2 floors)",
    rooms: "3 Bedrooms, 3 Bathrooms, Kitchen, Living Areas",
    keyMaterials: "12000 Blocks, 250 Bags of Cement, 60 Roofing Sheets",
    config: {
      projectType: "house",
      buildingStyle: "premium",
      dimensions: {
        length: 12,
        width: 10,
        height: 3.5,
        floors: 2,
        rooms: 3,
        bathrooms: 3,
      },
      roofType: "hip",
      wallMaterial: "standard",
      floorType: "porcelain",
      tileSize: "large",
    }
  },
  {
    id: "shop",
    title: "Small Shop/Office Space",
    dimensions: "6m × 4m × 3m",
    rooms: "Open Space, 1 Bathroom",
    keyMaterials: "2000 Blocks, 60 Bags of Cement, 15 Roofing Sheets",
    config: {
      projectType: "commercial",
      buildingStyle: "basic",
      dimensions: {
        length: 6,
        width: 4,
        height: 3,
        floors: 1,
        rooms: 1,
        bathrooms: 1,
      },
      roofType: "flat",
      wallMaterial: "hollow",
      floorType: "ceramic",
      tileSize: "medium",
    }
  },
];

// Define TypeScript interfaces for our state
interface Dimensions {
  length: number;
  width: number;
  height: number;
  floors: number;
  rooms: number;
  bathrooms: number;
}

interface MaterialQuantity {
  name: string;
  quantity: number;
  unit: string;
}

interface MaterialCategory {
  category: string;
  materials: MaterialQuantity[];
}

interface Areas {
  totalArea: number;
  wallArea: number;
  floorArea: number;
  roofArea: number;
}

interface CalculatedResults {
  areas: Areas;
  materials: MaterialCategory[];
}

const BuildingQuotation = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [projectType, setProjectType] = useState("house");
  const [buildingStyle, setBuildingStyle] = useState("standard");
  const [dimensions, setDimensions] = useState<Dimensions>({
    length: 10,
    width: 8,
    height: 3,
    floors: 1,
    rooms: 3,
    bathrooms: 2,
  });
  const [roofType, setRoofType] = useState("gable");
  const [wallMaterial, setWallMaterial] = useState("standard");
  const [floorType, setFloorType] = useState("ceramic");
  const [tileSize, setTileSize] = useState("medium");
  
  const [calculatedResults, setCalculatedResults] = useState<CalculatedResults | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Calculate building materials based on dimensions and selections
  const calculateMaterials = () => {
    // Calculate areas
    const { length, width, height, floors, rooms, bathrooms } = dimensions;
    
    const floorArea = length * width * floors;
    const perimeterLength = 2 * (length + width);
    const wallArea = perimeterLength * height * floors;
    const internalWallLength = (rooms + bathrooms) * 5; // Rough estimate of internal wall length
    const internalWallArea = internalWallLength * height * floors;
    const totalWallArea = wallArea + internalWallArea;
    
    // Calculate roof area with adjustment for roof type
    let roofMultiplier = 1.0;
    if (roofType === "gable") roofMultiplier = 1.15;
    if (roofType === "hip") roofMultiplier = 1.3;
    const roofArea = length * width * roofMultiplier;
    
    const totalArea = floorArea; // Total floor area

    // Foundation materials
    const foundationMaterials: MaterialQuantity[] = [
      {
        name: "Cement",
        quantity: Math.ceil(floorArea * 0.15),
        unit: "bags"
      },
      {
        name: "Sand",
        quantity: Math.ceil(floorArea * 0.3),
        unit: "m³"
      },
      {
        name: "Gravel",
        quantity: Math.ceil(floorArea * 0.45),
        unit: "m³"
      },
      {
        name: "Reinforcement Bars (12mm)",
        quantity: Math.ceil(floorArea * 3),
        unit: "rods"
      },
      {
        name: "Reinforcement Bars (10mm)",
        quantity: Math.ceil(floorArea * 2),
        unit: "rods"
      },
      {
        name: "Binding Wire",
        quantity: Math.ceil(floorArea * 0.1),
        unit: "kg"
      }
    ];

    // Structure materials
    const structureMaterials: MaterialQuantity[] = [
      {
        name: "Cement for Columns",
        quantity: Math.ceil(floors * 4),
        unit: "bags"
      },
      {
        name: "Sand for Columns",
        quantity: Math.ceil(floors * 0.8),
        unit: "m³"
      },
      {
        name: "Gravel for Columns",
        quantity: Math.ceil(floors * 1),
        unit: "m³"
      },
      {
        name: "Reinforcement Bars (16mm)",
        quantity: Math.ceil(floors * 12),
        unit: "rods"
      },
      {
        name: "Reinforcement Bars (8mm for Stirrups)",
        quantity: Math.ceil(floors * 8),
        unit: "rods"
      },
      {
        name: "Cement for Beams",
        quantity: Math.ceil(perimeterLength * 0.2 * floors),
        unit: "bags"
      },
      {
        name: "Sand for Beams",
        quantity: Math.ceil(perimeterLength * 0.05 * floors),
        unit: "m³"
      },
      {
        name: "Gravel for Beams",
        quantity: Math.ceil(perimeterLength * 0.08 * floors),
        unit: "m³"
      }
    ];

    // Wall materials
    let blockFactor = 13; // Blocks per square meter
    if (wallMaterial === "hollow") blockFactor = 10;
    if (wallMaterial === "face") blockFactor = 50; // Face bricks are smaller
    if (wallMaterial === "concrete") blockFactor = 2; // Concrete panels are larger
    
    const wallMaterials: MaterialQuantity[] = [
      {
        name: wallMaterial === "concrete" ? "Concrete Panels" : 
              wallMaterial === "face" ? "Face Bricks" : 
              wallMaterial === "hollow" ? "Hollow Blocks" : "Standard Blocks",
        quantity: Math.ceil(totalWallArea * blockFactor),
        unit: "pieces"
      },
      {
        name: "Cement for Mortar",
        quantity: Math.ceil(totalWallArea * 0.1),
        unit: "bags"
      },
      {
        name: "Sand for Mortar",
        quantity: Math.ceil(totalWallArea * 0.03),
        unit: "m³"
      },
      {
        name: "Cement for Plastering",
        quantity: Math.ceil(totalWallArea * 0.15),
        unit: "bags"
      },
      {
        name: "Sand for Plastering",
        quantity: Math.ceil(totalWallArea * 0.04),
        unit: "m³"
      }
    ];

    // Roofing materials
    let roofingSheetFactor = 1.1; // Sheet coverage factor
    if (roofType === "gable") roofingSheetFactor = 1.15;
    if (roofType === "hip") roofingSheetFactor = 1.3;
    
    const roofMaterials: MaterialQuantity[] = [
      {
        name: "Roofing Sheets",
        quantity: Math.ceil(roofArea / 3), // Assuming standard sheet covers ~3 m²
        unit: "sheets"
      },
      {
        name: "Roofing Nails",
        quantity: Math.ceil(roofArea * 0.5),
        unit: "kg"
      },
      {
        name: "Wood for Trusses",
        quantity: Math.ceil(roofArea * 0.4),
        unit: "m"
      },
      {
        name: "Wood for Purlins",
        quantity: Math.ceil(roofArea * 0.8),
        unit: "m"
      },
      {
        name: "Nails and Fasteners",
        quantity: Math.ceil(roofArea * 0.2),
        unit: "kg"
      },
      {
        name: "Ridge Capping",
        quantity: Math.ceil(length * (roofType === "flat" ? 0 : 1.2)),
        unit: "pcs"
      }
    ];

    // Calculate tile quantity based on size
    let tileFactor = 16; // Tiles per square meter (for small tiles)
    if (tileSize === "medium") tileFactor = 4;
    if (tileSize === "large") tileFactor = 1;
    
    // Flooring materials
    const flooringMaterials: MaterialQuantity[] = [
      {
        name: floorType === "ceramic" ? "Ceramic Tiles" : 
              floorType === "porcelain" ? "Porcelain Tiles" : 
              floorType === "marble" ? "Marble/Granite Tiles" : 
              floorType === "wood" ? "Wooden Floor Panels" : "Concrete Floor",
        quantity: Math.ceil(floorArea * (floorType === "concrete" ? 0 : tileFactor)),
        unit: floorType === "concrete" ? "m³" : "pieces"
      },
      {
        name: "Cement for Floor Screed",
        quantity: Math.ceil(floorArea * 0.2),
        unit: "bags"
      },
      {
        name: "Sand for Floor Screed",
        quantity: Math.ceil(floorArea * 0.05),
        unit: "m³"
      },
      {
        name: floorType !== "concrete" ? "Tile Adhesive" : "Concrete Mix",
        quantity: Math.ceil(floorType !== "concrete" ? floorArea * 0.3 : floorArea * 0.15),
        unit: "bags"
      },
      {
        name: floorType !== "concrete" ? "Grout" : "Concrete Hardener",
        quantity: Math.ceil(floorType !== "concrete" ? floorArea * 0.1 : floorArea * 0.05),
        unit: "kg"
      }
    ];

    // Electrical materials (based on number of rooms)
    const totalRooms = rooms + bathrooms + 1; // +1 for living area
    
    const electricalMaterials: MaterialQuantity[] = [
      {
        name: "Electrical Wires",
        quantity: Math.ceil(floorArea * 2),
        unit: "m"
      },
      {
        name: "Socket Outlets",
        quantity: Math.ceil(totalRooms * 3),
        unit: "pcs"
      },
      {
        name: "Light Switches",
        quantity: Math.ceil(totalRooms * 2),
        unit: "pcs"
      },
      {
        name: "Light Fixtures",
        quantity: Math.ceil(totalRooms * 1.5),
        unit: "pcs"
      },
      {
        name: "Distribution Board",
        quantity: 1,
        unit: "pc"
      },
      {
        name: "Circuit Breakers",
        quantity: Math.ceil(5 + totalRooms * 0.5),
        unit: "pcs"
      },
      {
        name: "Conduit Pipes",
        quantity: Math.ceil(floorArea * 1.5),
        unit: "m"
      }
    ];

    // Plumbing materials (based on number of bathrooms)
    const plumbingMaterials: MaterialQuantity[] = [
      {
        name: "PVC Pipes (4 inch)",
        quantity: Math.ceil(bathrooms * 5),
        unit: "m"
      },
      {
        name: "PVC Pipes (2 inch)",
        quantity: Math.ceil(bathrooms * 10),
        unit: "m"
      },
      {
        name: "PVC Pipes (1/2 inch)",
        quantity: Math.ceil(bathrooms * 15 + rooms * 2),
        unit: "m"
      },
      {
        name: "Toilet Sets",
        quantity: bathrooms,
        unit: "sets"
      },
      {
        name: "Bathroom Sinks",
        quantity: bathrooms,
        unit: "pcs"
      },
      {
        name: "Kitchen Sink",
        quantity: 1,
        unit: "pc"
      },
      {
        name: "Water Taps",
        quantity: Math.ceil(bathrooms * 2 + 1), // +1 for kitchen
        unit: "pcs"
      },
      {
        name: "Pipe Fittings (Elbows, Tees, etc.)",
        quantity: Math.ceil(bathrooms * 10),
        unit: "pcs"
      }
    ];

    // Finishing materials
    const finishingMaterials: MaterialQuantity[] = [
      {
        name: "Paint (Interior)",
        quantity: Math.ceil(totalWallArea * 0.1),
        unit: "gallons"
      },
      {
        name: "Paint (Exterior)",
        quantity: Math.ceil(wallArea * 0.25 * 0.1),
        unit: "gallons"
      },
      {
        name: "Doors",
        quantity: rooms + bathrooms + 2, // +2 for main entrance and back door
        unit: "sets"
      },
      {
        name: "Windows",
        quantity: Math.ceil(rooms * 1.5 + 2), // Estimate number of windows
        unit: "sets"
      },
      {
        name: "Door Handles",
        quantity: rooms + bathrooms + 2,
        unit: "sets"
      },
      {
        name: "Door Locks",
        quantity: rooms + bathrooms + 2,
        unit: "pcs"
      },
      {
        name: "Ceiling Boards",
        quantity: Math.ceil(floorArea * 1.05),
        unit: "m²"
      },
      {
        name: "Cornices",
        quantity: Math.ceil(rooms * 8 + bathrooms * 6), // Perimeter of each room
        unit: "m"
      }
    ];

    // Create the results object
    const results: CalculatedResults = {
      areas: {
        totalArea,
        wallArea: totalWallArea,
        floorArea,
        roofArea
      },
      materials: [
        { category: "Foundation", materials: foundationMaterials },
        { category: "Structure", materials: structureMaterials },
        { category: "Walls", materials: wallMaterials },
        { category: "Roofing", materials: roofMaterials },
        { category: "Flooring", materials: flooringMaterials },
        { category: "Electrical", materials: electricalMaterials },
        { category: "Plumbing", materials: plumbingMaterials },
        { category: "Finishing", materials: finishingMaterials }
      ]
    };

    setCalculatedResults(results);

    toast({
      title: "Material Estimation Complete",
      description: "Your building materials estimation has been calculated.",
    });
  };

  const handleInputChange = (field: keyof Dimensions, value: string) => {
    setDimensions((prev) => ({
      ...prev,
      [field]: parseInt(value) || 0,
    }));
  };

  // Function to apply a template configuration and calculate materials
  const applyTemplate = (templateId: string) => {
    const template = projectTemplates.find(t => t.id === templateId);
    
    if (!template) return;
    
    // Apply template configuration to state
    setProjectType(template.config.projectType);
    setBuildingStyle(template.config.buildingStyle);
    setDimensions(template.config.dimensions);
    setRoofType(template.config.roofType);
    setWallMaterial(template.config.wallMaterial);
    setFloorType(template.config.floorType);
    setTileSize(template.config.tileSize);
    
    // Scroll to top of the page to show the form with the applied template
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Calculate materials after a short delay to ensure state has updated
    setTimeout(() => {
      calculateMaterials();
      
      toast({
        title: "Template Applied",
        description: `${template.title} configuration has been applied and materials calculated.`,
      });
    }, 100);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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
              <h1 className="text-3xl font-bold mb-2">
                Building Material Estimator
              </h1>
              <div className="flex items-center text-sm text-muted-foreground">
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
                <ChevronRight size={14} className="mx-2" />
                <span>  Free Quotation</span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          <motion.div
            className={`transition-opacity duration-500 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <div className="max-w-3xl mx-auto text-center mb-10">
                <Badge className="mb-2">FREE TOOL</Badge>
                <h2 className="text-3xl font-bold mb-4">
                  Estimate Your Building Materials
                </h2>
                <p className="text-muted-foreground">
                  Our Building Material Estimator helps you calculate the approximate quantities 
                  of materials needed for your construction project.
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Input Form */}
              <motion.div variants={itemVariants} className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                    <CardDescription>
                      Enter your building specifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-type">Project Type</Label>
                      <Select
                        defaultValue={projectType}
                        onValueChange={setProjectType}
                      >
                        <SelectTrigger id="project-type">
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        {
                          projectTypes.find((t) => t.id === projectType)
                            ?.description
                        }
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="building-style">Building Standard</Label>
                      <Select
                        defaultValue={buildingStyle}
                        onValueChange={setBuildingStyle}
                      >
                        <SelectTrigger id="building-style">
                          <SelectValue placeholder="Select building standard" />
                        </SelectTrigger>
                        <SelectContent>
                          {buildingStyles.map((style) => (
                            <SelectItem key={style.id} value={style.id}>
                              {style.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />
                    
                    <div>
                      <Label className="text-base font-semibold">
                        Building Dimensions
                      </Label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <div className="space-y-1">
                          <Label htmlFor="length">Length (m)</Label>
                          <Input
                            id="length"
                            type="number"
                            value={dimensions.length}
                            onChange={(e) =>
                              handleInputChange("length", e.target.value)
                            }
                            min="1"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="width">Width (m)</Label>
                          <Input
                            id="width"
                            type="number"
                            value={dimensions.width}
                            onChange={(e) =>
                              handleInputChange("width", e.target.value)
                            }
                            min="1"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="height">Height (m)</Label>
                          <Input
                            id="height"
                            type="number"
                            value={dimensions.height}
                            onChange={(e) =>
                              handleInputChange("height", e.target.value)
                            }
                            min="1"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="floors">Number of Floors</Label>
                          <Input
                            id="floors"
                            type="number"
                            value={dimensions.floors}
                            onChange={(e) =>
                              handleInputChange("floors", e.target.value)
                            }
                            min="1"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-base font-semibold">
                        Room Configuration
                      </Label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <div className="space-y-1">
                          <Label htmlFor="rooms">Number of Rooms</Label>
                          <Input
                            id="rooms"
                            type="number"
                            value={dimensions.rooms}
                            onChange={(e) =>
                              handleInputChange("rooms", e.target.value)
                            }
                            min="1"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="bathrooms">Number of Bathrooms</Label>
                          <Input
                            id="bathrooms"
                            type="number"
                            value={dimensions.bathrooms}
                            onChange={(e) =>
                              handleInputChange("bathrooms", e.target.value)
                            }
                            min="1"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="roof-type">Roof Type</Label>
                      <Select
                        defaultValue={roofType}
                        onValueChange={setRoofType}
                      >
                        <SelectTrigger id="roof-type">
                          <SelectValue placeholder="Select roof type" />
                        </SelectTrigger>
                        <SelectContent>
                          {roofTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="wall-material">Wall Material</Label>
                      <Select
                        defaultValue={wallMaterial}
                        onValueChange={setWallMaterial}
                      >
                        <SelectTrigger id="wall-material">
                          <SelectValue placeholder="Select wall material" />
                        </SelectTrigger>
                        <SelectContent>
                          {wallMaterialTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="floor-type">Floor Type</Label>
                      <Select
                        defaultValue={floorType}
                        onValueChange={setFloorType}
                      >
                        <SelectTrigger id="floor-type">
                          <SelectValue placeholder="Select floor type" />
                        </SelectTrigger>
                        <SelectContent>
                          {floorTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tile-size">Floor Tile Size</Label>
                      <Select
                        defaultValue={tileSize}
                        onValueChange={setTileSize}
                        disabled={floorType === 'concrete' || floorType === 'wood'}
                      >
                        <SelectTrigger id="tile-size">
                          <SelectValue placeholder="Select tile size" />
                        </SelectTrigger>
                        <SelectContent>
                          {tileSizes.map((size) => (
                            <SelectItem key={size.id} value={size.id}>
                              {size.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={calculateMaterials} className="w-full">
                      <Calculator size={16} className="mr-2" />
                      Calculate Materials
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>

              {/* Results */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Material Estimation</CardTitle>
                    <CardDescription>
                      Based on your project specifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {calculatedResults ? (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-3">
                            Project Areas
                          </h3>
                          <div className="grid grid-cols-4 gap-2">
                            <div className="bg-secondary/20 p-3 rounded-lg text-center">
                              <p className="text-sm text-muted-foreground">
                                Total Area
                              </p>
                              <p className="text-xl font-bold">
                                {calculatedResults.areas.totalArea.toFixed(2)} m²
                              </p>
                            </div>
                            <div className="bg-secondary/20 p-3 rounded-lg text-center">
                              <p className="text-sm text-muted-foreground">
                                Wall Area
                              </p>
                              <p className="text-xl font-bold">
                                {calculatedResults.areas.wallArea.toFixed(2)} m²
                              </p>
                            </div>
                            <div className="bg-secondary/20 p-3 rounded-lg text-center">
                              <p className="text-sm text-muted-foreground">
                                Floor Area
                              </p>
                              <p className="text-xl font-bold">
                                {calculatedResults.areas.floorArea.toFixed(2)} m²
                              </p>
                            </div>
                            <div className="bg-secondary/20 p-3 rounded-lg text-center">
                              <p className="text-sm text-muted-foreground">
                                Roof Area
                              </p>
                              <p className="text-xl font-bold">
                                {calculatedResults.areas.roofArea.toFixed(2)} m²
                              </p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-lg font-medium mb-3">
                            Material Requirements by Category
                          </h3>
                          
                          <Accordion type="single" collapsible className="w-full">
                            {calculatedResults.materials.map((category, idx) => (
                              <AccordionItem key={idx} value={`item-${idx}`}>
                                <AccordionTrigger className="hover:no-underline font-medium">
                                  {category.category} Materials
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="rounded-md border overflow-hidden mt-2">
                                    <table className="w-full">
                                      <thead className="bg-secondary/20">
                                        <tr>
                                          <th className="text-left p-2 pl-3">Material</th>
                                          <th className="text-right p-2">Quantity</th>
                                          <th className="text-right p-2 pr-3">Unit</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y">
                                        {category.materials.map((material, index) => (
                                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-secondary/5'}>
                                            <td className="p-2 pl-3">{material.name}</td>
                                            <td className="text-right p-2">{material.quantity.toLocaleString()}</td>
                                            <td className="text-right p-2 pr-3">{material.unit}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </div>

                        <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Important Disclaimer</AlertTitle>
                          <AlertDescription>
                            This is only a rough estimation based on standard calculations. 
                            Actual material requirements may vary based on many factors including site conditions, 
                            building design, local building codes, and construction methods. 
                            We strongly recommend consulting with a professional builder, architect, 
                            or engineer for accurate quantities before purchasing materials.
                          </AlertDescription>
                        </Alert>

                        <div className="pt-4">
                          <div className="flex flex-col md:flex-row gap-4">
                            <Button onClick={calculateMaterials} variant="outline" className="flex-1">
                              <Calculator size={16} className="mr-2" />
                              Recalculate
                            </Button>
                            
                            <Link href="/products" className="flex-1">
                              <Button className="w-full">
                                <ShoppingBag size={16} className="mr-2" />
                                Browse Building Materials
                              </Button>
                            </Link>
                          </div>

                          <div className="mt-6 text-center text-sm text-muted-foreground">
                            <p className="flex items-center justify-center gap-2">
                              <HardHat size={14} />
                              Need professional advice? Consider consulting with a licensed contractor.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center py-10 text-center">
                        <Building
                          size={48}
                          className="text-muted-foreground mb-4"
                        />
                        <h3 className="text-xl font-medium mb-2">
                          Enter Your Project Details
                        </h3>
                        <p className="text-muted-foreground max-w-md mb-6">
                          Fill in your project specifications and click
                          &quot;Calculate Materials&quot; to see your estimated
                          material requirements.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-lg">
                          <div className="bg-secondary/10 p-3 rounded-lg text-center">
                            <Ruler
                              size={24}
                              className="mx-auto mb-2 text-primary"
                            />
                            <p className="text-sm">Input Dimensions</p>
                          </div>
                          <div className="bg-secondary/10 p-3 rounded-lg text-center">
                            <Calculator
                              size={24}
                              className="mx-auto mb-2 text-primary"
                            />
                            <p className="text-sm">Get Estimates</p>
                          </div>
                          <div className="bg-secondary/10 p-3 rounded-lg text-center">
                            <ShoppingBag
                              size={24}
                              className="mx-auto mb-2 text-primary"
                            />
                            <p className="text-sm">Find Materials</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Popular Building Projects */}
            <motion.div variants={itemVariants} className="mt-16">
              <h2 className="text-2xl font-bold mb-6">
                Popular Building Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projectTemplates.map((template, index) => (
                  <Card
                    key={index}
                    className="hover-lift transition-all duration-300"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle>{template.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Dimensions:
                          </span>
                          <span className="font-medium">
                            {template.dimensions}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Configuration:
                          </span>
                          <span className="font-medium text-right max-w-[200px]">
                            {template.rooms}
                          </span>
                        </div>
                        <div>
                          <div className="text-muted-foreground">
                            Main Materials:
                          </div>
                          <div className="font-medium mt-1">
                            {template.keyMaterials}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => applyTemplate(template.id)}
                      >
                        Use Template
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Construction Tips */}
            <motion.div
              variants={itemVariants}
              className="mt-16 bg-secondary/5 p-8 rounded-xl"
            >
              <h2 className="text-2xl font-bold mb-6">Construction Tips</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Material Estimation Tips
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check size={18} className="text-green-600 mr-2 mt-0.5" />
                      <span>
                        Always add 10-15% extra for material wastage and cutting
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check size={18} className="text-green-600 mr-2 mt-0.5" />
                      <span>Consider seasonal availability of certain materials</span>
                    </li>
                    <li className="flex items-start">
                      <Check size={18} className="text-green-600 mr-2 mt-0.5" />
                      <span>Plan for proper material storage at the construction site</span>
                    </li>
                    <li className="flex items-start">
                      <Check size={18} className="text-green-600 mr-2 mt-0.5" />
                      <span>Purchase critical materials early to avoid delays</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Project Planning Guidance
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check size={18} className="text-green-600 mr-2 mt-0.5" />
                      <span>
                        Obtain all necessary permits before starting construction
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check size={18} className="text-green-600 mr-2 mt-0.5" />
                      <span>
                        Hire qualified professionals for specialized work like electrical and plumbing
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check size={18} className="text-green-600 mr-2 mt-0.5" />
                      <span>
                        Schedule material deliveries to match your construction timeline
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check size={18} className="text-green-600 mr-2 mt-0.5" />
                      <span>
                        Budget for at least 20% contingency for unexpected expenses
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <Link href="/products">
                  <Button size="lg">
                    <ShoppingBag className="mr-2" />
                    Shop for Construction Materials
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default BuildingQuotation;
