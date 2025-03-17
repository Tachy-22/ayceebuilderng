
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

// Filter products with a discount
const discountedProducts = products.filter(product => product.discountPrice && product.discountPrice < product.price);

// Create flash deals (ending soon)
const flashDeals = discountedProducts.slice(0, 6).map(product => ({
  ...product,
  endsIn: Math.floor(Math.random() * 24) + 1, // Random hours left (1-24)
  soldPercentage: Math.floor(Math.random() * 80) + 10, // Random percentage sold (10-90%)
}));

// Create bundle deals
const bundleDeals = [
  {
    id: "bundle1",
    title: "Home Renovation Bundle",
    image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHJlbm92YXRpb258ZW58MHx8MHx8fDA%3D",
    originalPrice: 82500,
    bundlePrice: 68000,
    items: [products[0], products[2], products[5]],
    savingsPercentage: 18
  },
  {
    id: "bundle2",
    title: "Kitchen Build Package",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8a2l0Y2hlbnxlbnwwfHwwfHx8MA%3D%3D",
    originalPrice: 120000,
    bundlePrice: 96000,
    items: [products[1], products[3], products[8]],
    savingsPercentage: 20
  },
  {
    id: "bundle3",
    title: "Bathroom Essentials",
    image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJhdGhyb29tfGVufDB8fDB8fHww",
    originalPrice: 95000,
    bundlePrice: 79500,
    items: [products[4], products[6], products[9]],
    savingsPercentage: 16
  }
];

const Deals = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [timeLeft, setTimeLeft] = useState({});
  
  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
    
    // Initialize countdown timers
    const initialTimers = {};
    flashDeals.forEach(deal => {
      initialTimers[deal.id] = {
        hours: deal.endsIn,
        minutes: Math.floor(Math.random() * 60),
        seconds: Math.floor(Math.random() * 60)
      };
    });
    setTimeLeft(initialTimers);
    
    // Update countdown every second
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(id => {
          if (updated[id].hours === 0 && updated[id].minutes === 0 && updated[id].seconds === 0) {
            return; // Timer complete
          }
          
          if (updated[id].seconds > 0) {
            updated[id].seconds--;
          } else if (updated[id].minutes > 0) {
            updated[id].minutes--;
            updated[id].seconds = 59;
          } else if (updated[id].hours > 0) {
            updated[id].hours--;
            updated[id].minutes = 59;
            updated[id].seconds = 59;
          }
        });
        return updated;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format timer display
  const formatTime = (time) => {
    if (!time) return "00:00:00";
    return `${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">Special Deals & Offers</h1>
            <p className="text-muted-foreground">
              Limited time offers on quality construction materials
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-10">
          {/* Flash Deals */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Flash Deals</h2>
                <p className="text-sm text-muted-foreground">Hurry up! These deals are ending soon</p>
              </div>
              <Link to="/products">
                <Button variant="ghost" className="gap-1">
                  View All
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {flashDeals.map((deal, index) => (
                <div 
                  key={deal.id} 
                  className={`relative border rounded-xl bg-white overflow-hidden transition-all hover:shadow-md ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
                  style={{ animationDelay: `${0.05 * index}s` }}
                >
                  <div className="absolute top-3 left-3 z-10 bg-red-100 text-red-700 rounded-full px-3 py-1 text-sm font-medium flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>{formatTime(timeLeft[deal.id])}</span>
                  </div>
                  
                  <Link to={`/products/${deal.id}`}>
                    <div className="aspect-video overflow-hidden bg-secondary/20">
                      <img
                        src={deal.image}
                        alt={deal.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-medium text-lg mb-2 line-clamp-1">{deal.name}</h3>
                      
                      <div className="flex gap-2 items-baseline mb-3">
                        <span className="text-xl font-bold">₦{deal.discountPrice.toLocaleString()}</span>
                        <span className="text-muted-foreground line-through">₦{deal.price.toLocaleString()}</span>
                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs">
                          {Math.round(((deal.price - deal.discountPrice) / deal.price) * 100)}% OFF
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Sold: {deal.soldPercentage}%</span>
                          <span>Available: {100 - deal.soldPercentage}%</span>
                        </div>
                        <Progress value={deal.soldPercentage} className="h-2" />
                      </div>
                      
                      <Button className="w-full mt-4">
                        Add to Cart
                      </Button>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          
          {/* Bundle Deals */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Bundle Deals</h2>
                <p className="text-sm text-muted-foreground">Save more when you buy these items together</p>
              </div>
            </div>
            
            <div className="space-y-8">
              {bundleDeals.map((bundle, index) => (
                <div 
                  key={bundle.id}
                  className={`border rounded-xl overflow-hidden bg-white transition-all ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
                      <img
                        src={bundle.image}
                        alt={bundle.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="p-6 md:col-span-2">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{bundle.title}</h3>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-2xl font-bold">₦{bundle.bundlePrice.toLocaleString()}</span>
                            <span className="text-muted-foreground line-through">₦{bundle.originalPrice.toLocaleString()}</span>
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-sm">
                              Save {bundle.savingsPercentage}%
                            </span>
                          </div>
                        </div>
                        <Button>
                          Add Bundle to Cart
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">Bundle Includes:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {bundle.items.map(item => (
                            <div key={item.id} className="flex items-center gap-3">
                              <div className="w-16 h-16 rounded bg-secondary/20 overflow-hidden flex-shrink-0">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h5 className="font-medium line-clamp-2 text-sm">{item.name}</h5>
                                <div className="text-sm text-muted-foreground">₦{item.price.toLocaleString()}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Clearance */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Clearance Sale</h2>
                <p className="text-sm text-muted-foreground">Limited stock, maximum savings</p>
              </div>
              <Link to="/products">
                <Button variant="ghost" className="gap-1">
                  View All
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {discountedProducts.slice(6, 14).map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  className={isLoaded ? 'animate-fade-in' : 'opacity-0'}
                  style={{ animationDelay: `${0.05 * index}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Deals;
