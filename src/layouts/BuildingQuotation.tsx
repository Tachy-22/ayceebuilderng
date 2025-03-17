
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  Calculator, 
  Ruler, 
  ShoppingBag, 
  // ArrowRight, 
  // Home, 
  ChevronRight,
  // PlusCircle,
  // Save,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from '@/hooks/use-toast';
import { 
  calculateWallArea, 
  calculateFloorArea, 
  calculateRoofArea,
  calculateCementBags,
  calculateBricks,
  calculatePaint,
  calculateTiles
} from '@/lib/utils';
import { Product, products } from '@/data/products';

// Define project types with their descriptions
const projectTypes = [
  { id: 'house', name: 'Residential Building', description: 'Single family home or apartment building' },
  { id: 'commercial', name: 'Commercial Building', description: 'Office, retail, or other commercial space' },
  { id: 'room', name: 'Room Addition', description: 'Adding a new room to existing structure' },
  { id: 'renovation', name: 'Renovation', description: 'Renovating existing space' },
];

// Define roof types
const roofTypes = [
  { id: 'flat', name: 'Flat Roof' },
  { id: 'gable', name: 'Gable Roof' },
  { id: 'hip', name: 'Hip Roof' },
];

// Define brick types
const brickTypes = [
  { id: 'standard', name: 'Standard Bricks' },
  { id: 'hollow', name: 'Hollow Blocks' },
  { id: 'face', name: 'Face Bricks' },
];

// Define tile sizes
const tileSizes = [
  { id: 'small', name: 'Small (25×25cm)' },
  { id: 'medium', name: 'Medium (50×50cm)' },
  { id: 'large', name: 'Large (100×100cm)' },
];

// Define TypeScript interfaces for our state
interface Dimensions {
  length: number;
  width: number;
  height: number;
}

interface Material {
  quantity: number;
  unit: string;
  cost: number;
}

interface Areas {
  wallArea: number;
  floorArea: number;
  roofArea: number;
}

interface CalculatedResults {
  areas: Areas;
  materials: {
    cement: Material;
    bricks: Material;
    paint: Material;
    tiles: Material;
  };
  totalCost: number;
}

interface CartItem {
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

const BuildingQuotation = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [projectType, setProjectType] = useState('house');
  const [dimensions, setDimensions] = useState<Dimensions>({
    length: 10,
    width: 8,
    height: 3
  });
  const [roofType, setRoofType] = useState('flat');
  const [brickType, setBrickType] = useState('standard');
  const [tileSize, setTileSize] = useState('medium');
  const [paintCoats, setPaintCoats] = useState(2);
  const [calculatedResults, setCalculatedResults] = useState<CalculatedResults | null>(null);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const calculateQuotation = () => {
    const wallArea = calculateWallArea(dimensions.length, dimensions.width, dimensions.height);
    const floorArea = calculateFloorArea(dimensions.length, dimensions.width);
    const roofArea = calculateRoofArea(dimensions.length, dimensions.width, roofType);

    // Calculate material quantities
    const cementForWalls = calculateCementBags(wallArea, 2, 'plastering');
    const cementForFlooring = calculateCementBags(floorArea, 5, 'flooring');
    const bricks = calculateBricks(wallArea, brickType);
    const paintLiters = calculatePaint(wallArea, paintCoats);
    const floorTiles = calculateTiles(floorArea, tileSize);
    
    // Find product matches and calculate costs
    const cementProduct = products.find(p => p.name.toLowerCase().includes('cement'));
    const brickProduct = products.find(p => p.name.toLowerCase().includes('brick') || p.name.toLowerCase().includes('block'));
    const paintProduct = products.find(p => p.name.toLowerCase().includes('paint'));
    const tileProduct = products.find(p => p.name.toLowerCase().includes('tile'));
    
    const cementPrice = cementProduct ? (cementProduct.discountPrice || cementProduct.price) : 3500;
    const brickPrice = brickProduct ? (brickProduct.discountPrice || brickProduct.price) / 50 : 100; // Price per brick
    const paintPrice = paintProduct ? (paintProduct.discountPrice || paintProduct.price) : 5000; // Per 5 liters
    const tilePrice = tileProduct ? (tileProduct.discountPrice || tileProduct.price) / 10 : 1500; // Price per tile
    
    const cementCost = (cementForWalls + cementForFlooring) * cementPrice;
    const brickCost = bricks * brickPrice;
    const paintCost = paintLiters * (paintPrice / 5); // Adjust for per-liter price
    const tileCost = floorTiles * tilePrice;
    
    const totalCost = cementCost + brickCost + paintCost + tileCost;
    
    // Prepare cart items
    const items: CartItem[] = [];
    
    if (cementProduct) {
      items.push({
        product: cementProduct,
        quantity: cementForWalls + cementForFlooring,
        price: cementPrice,
        total: cementCost
      });
    }
    
    if (brickProduct) {
      items.push({
        product: brickProduct,
        quantity: Math.ceil(bricks / 50), // Assuming bricks come in packs of 50
        price: brickProduct.discountPrice || brickProduct.price,
        total: brickCost
      });
    }
    
    if (paintProduct) {
      items.push({
        product: paintProduct,
        quantity: Math.ceil(paintLiters / 5), // Assuming paint comes in 5L cans
        price: paintPrice,
        total: paintCost
      });
    }
    
    if (tileProduct) {
      items.push({
        product: tileProduct,
        quantity: Math.ceil(floorTiles / 10), // Assuming tiles come in packs of 10
        price: tileProduct.discountPrice || tileProduct.price,
        total: tileCost
      });
    }
    
    const results: CalculatedResults = {
      areas: { wallArea, floorArea, roofArea },
      materials: {
        cement: { quantity: cementForWalls + cementForFlooring, unit: 'bags', cost: cementCost },
        bricks: { quantity: bricks, unit: 'pieces', cost: brickCost },
        paint: { quantity: paintLiters, unit: 'liters', cost: paintCost },
        tiles: { quantity: floorTiles, unit: 'pieces', cost: tileCost }
      },
      totalCost
    };
    
    setCalculatedResults(results);
    setEstimatedCost(totalCost);
    setCartItems(items);
    
    toast({
      title: "Quotation Generated",
      description: "Your building materials quotation has been calculated.",
    });
  };

  const addToCart = () => {
    // This would typically update a global cart state via context or Redux
    // For now, we'll just show a toast and navigate to the cart
    toast({
      title: "Added to Cart",
      description: "All estimated materials have been added to your cart.",
    });
    
    setTimeout(() => {
      navigate('/cart');
    }, 1500);
  };

  const handleInputChange = (field: keyof Dimensions, value: string) => {
    setDimensions(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="bg-secondary/5 py-6">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold mb-2">Building Material Quotation Tool</h1>
              <div className="flex items-center text-sm text-muted-foreground">
                <Link to="/" className="hover:text-foreground">Home</Link>
                <ChevronRight size={14} className="mx-2" />
                <span>Building Quotation</span>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-10">
          <motion.div 
            className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <div className="max-w-3xl mx-auto text-center mb-10">
                <Badge className="mb-2">FREE TOOL</Badge>
                <h2 className="text-3xl font-bold mb-4">Plan Your Construction Project</h2>
                <p className="text-muted-foreground">
                  Our Building Quotation Tool helps you estimate the materials needed for your construction project and their costs.
                </p>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Input Form */}
              <motion.div variants={itemVariants} className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                    <CardDescription>Enter your project specifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-type">Project Type</Label>
                      <Select defaultValue={projectType} onValueChange={setProjectType}>
                        <SelectTrigger id="project-type">
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectTypes.map(type => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        {projectTypes.find(t => t.id === projectType)?.description}
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-base font-semibold">Dimensions (meters)</Label>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        <div className="space-y-1">
                          <Label htmlFor="length">Length</Label>
                          <Input
                            id="length"
                            type="number"
                            value={dimensions.length}
                            onChange={(e) => handleInputChange('length', e.target.value)}
                            min="1"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="width">Width</Label>
                          <Input
                            id="width"
                            type="number"
                            value={dimensions.width}
                            onChange={(e) => handleInputChange('width', e.target.value)}
                            min="1"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="height">Height</Label>
                          <Input
                            id="height"
                            type="number"
                            value={dimensions.height}
                            onChange={(e) => handleInputChange('height', e.target.value)}
                            min="1"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="roof-type">Roof Type</Label>
                      <Select defaultValue={roofType} onValueChange={setRoofType}>
                        <SelectTrigger id="roof-type">
                          <SelectValue placeholder="Select roof type" />
                        </SelectTrigger>
                        <SelectContent>
                          {roofTypes.map(type => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="brick-type">Brick/Block Type</Label>
                      <Select defaultValue={brickType} onValueChange={setBrickType}>
                        <SelectTrigger id="brick-type">
                          <SelectValue placeholder="Select brick type" />
                        </SelectTrigger>
                        <SelectContent>
                          {brickTypes.map(type => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tile-size">Floor Tile Size</Label>
                      <Select defaultValue={tileSize} onValueChange={setTileSize}>
                        <SelectTrigger id="tile-size">
                          <SelectValue placeholder="Select tile size" />
                        </SelectTrigger>
                        <SelectContent>
                          {tileSizes.map(size => (
                            <SelectItem key={size.id} value={size.id}>
                              {size.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="paint-coats">Paint Coats</Label>
                      <Select defaultValue={String(paintCoats)} onValueChange={(val) => setPaintCoats(parseInt(val))}>
                        <SelectTrigger id="paint-coats">
                          <SelectValue placeholder="Select number of coats" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Coat</SelectItem>
                          <SelectItem value="2">2 Coats</SelectItem>
                          <SelectItem value="3">3 Coats</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={calculateQuotation} 
                      className="w-full"
                    >
                      <Calculator size={16} className="mr-2" />
                      Calculate Quotation
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
              
              {/* Results */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Material Estimate</CardTitle>
                    <CardDescription>Based on your project specifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {calculatedResults ? (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-3">Project Areas</h3>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-secondary/20 p-3 rounded-lg text-center">
                              <p className="text-sm text-muted-foreground">Wall Area</p>
                              <p className="text-xl font-bold">{calculatedResults.areas.wallArea.toFixed(2)} m²</p>
                            </div>
                            <div className="bg-secondary/20 p-3 rounded-lg text-center">
                              <p className="text-sm text-muted-foreground">Floor Area</p>
                              <p className="text-xl font-bold">{calculatedResults.areas.floorArea.toFixed(2)} m²</p>
                            </div>
                            <div className="bg-secondary/20 p-3 rounded-lg text-center">
                              <p className="text-sm text-muted-foreground">Roof Area</p>
                              <p className="text-xl font-bold">{calculatedResults.areas.roofArea.toFixed(2)} m²</p>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-3">Material Requirements</h3>
                          <div className="space-y-4">
                            <div className="grid grid-cols-4 gap-2 text-sm text-muted-foreground font-medium">
                              <div>Material</div>
                              <div>Quantity</div>
                              <div>Unit</div>
                              <div className="text-right">Estimated Cost</div>
                            </div>
                            
                            <Separator />
                            
                            {Object.entries(calculatedResults.materials).map(([material, details]) => (
                              <div key={material} className="grid grid-cols-4 gap-2 items-center">
                                <div className="font-medium capitalize">{material}</div>
                                <div>{Math.ceil(details.quantity).toLocaleString()}</div>
                                <div>{details.unit}</div>
                                <div className="text-right">₦{details.cost.toLocaleString()}</div>
                              </div>
                            ))}
                            
                            <Separator />
                            
                            <div className="grid grid-cols-4 gap-2 items-center pt-2">
                              <div className="col-span-3 text-lg font-bold">Total Estimated Cost</div>
                              <div className="text-right text-lg font-bold">₦{calculatedResults.totalCost.toLocaleString()}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <Button 
                            onClick={addToCart} 
                            className="w-full"
                          >
                            <ShoppingBag size={16} className="mr-2" />
                            Add All Materials to Cart
                          </Button>
                          
                          <div className="mt-6 text-center text-sm text-muted-foreground">
                            <p>This is an estimate based on the information provided. Actual material requirements may vary.</p>
                            <p className="mt-1">Prices are approximate and subject to change.</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center py-10 text-center">
                        <Building size={48} className="text-muted-foreground mb-4" />
                        <h3 className="text-xl font-medium mb-2">Enter Your Project Details</h3>
                        <p className="text-muted-foreground max-w-md mb-6">
                          Fill in your project specifications and click "Calculate Quotation" to see your estimated material requirements and costs.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-lg">
                          <div className="bg-secondary/10 p-3 rounded-lg text-center">
                            <Ruler size={24} className="mx-auto mb-2 text-primary" />
                            <p className="text-sm">Input Dimensions</p>
                          </div>
                          <div className="bg-secondary/10 p-3 rounded-lg text-center">
                            <Calculator size={24} className="mx-auto mb-2 text-primary" />
                            <p className="text-sm">Get Estimates</p>
                          </div>
                          <div className="bg-secondary/10 p-3 rounded-lg text-center">
                            <ShoppingBag size={24} className="mx-auto mb-2 text-primary" />
                            <p className="text-sm">Add to Cart</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Popular Project Templates */}
            <motion.div 
              variants={itemVariants}
              className="mt-16"
            >
              <h2 className="text-2xl font-bold mb-6">Popular Project Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "2-Bedroom Bungalow",
                    dimensions: "10m × 8m",
                    materials: "Cement, Blocks, Roofing Sheets, Tiles",
                    estimate: "₦2,500,000"
                  },
                  {
                    title: "3-Bedroom Duplex",
                    dimensions: "12m × 10m",
                    materials: "Cement, Blocks, Roofing Sheets, Tiles, Paint",
                    estimate: "₦4,800,000"
                  },
                  {
                    title: "Small Shop/Store",
                    dimensions: "6m × 4m",
                    materials: "Cement, Blocks, Roofing Sheets",
                    estimate: "₦950,000"
                  }
                ].map((template, index) => (
                  <Card key={index} className="hover-lift transition-all duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle>{template.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dimensions:</span>
                          <span className="font-medium">{template.dimensions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Key Materials:</span>
                          <span className="font-medium">{template.materials}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Est. Cost:</span>
                          <span className="font-medium">{template.estimate}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
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
                  <h3 className="text-lg font-semibold mb-3">Material Estimation Tips</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check size={18} className="text-green-600 mr-2 mt-0.5" />
                      <span>Always add 5-10% extra for wastage and cutting</span>
                    </li>
                    <li className="flex items-start">
                      <Check size={18} className="text-green-600 mr-2 mt-0.5" />
                      <span>Consider material availability in your region</span>
                    </li>
                    <li className="flex items-start">
                      <Check size={18} className="text-green-600 mr-2 mt-0.5" />
                      <span>Factor in seasonal price fluctuations</span>
                    </li>
                    <li className="flex items-start">
                      <Check size={18} className="text-green-600 mr-2 mt-0.5" />
                      <span>Plan for proper material storage at the site</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Building Project Guidance</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check size={18} className="text-green-600 mr-2 mt-0.5" />
                      <span>Obtain necessary permits before starting construction</span>
                    </li>
                    <li className="flex items-start">
                      <Check size={18} className="text-green-600 mr-2 mt-0.5" />
                      <span>Hire qualified professionals for specialized work</span>
                    </li>
                    <li className="flex items-start">
                      <Check size={18} className="text-green-600 mr-2 mt-0.5" />
                      <span>Schedule deliveries to match construction timeline</span>
                    </li>
                    <li className="flex items-start">
                      <Check size={18} className="text-green-600 mr-2 mt-0.5" />
                      <span>Budget for unexpected expenses (15-20% buffer)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BuildingQuotation;
