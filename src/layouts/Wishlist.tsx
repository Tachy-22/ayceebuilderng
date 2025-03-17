
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Heart, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
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

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
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
              <h1 className="text-3xl font-bold mb-2">Your Wishlist</h1>
              <div className="flex items-center text-sm text-muted-foreground">
                <Link to="/" className="hover:text-foreground">Home</Link>
                <span className="mx-2">/</span>
                <span>Wishlist</span>
              </div>
            </motion.div>
          </div>
        </div>
        
        <motion.div
          className={`container mx-auto px-4 py-10 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {wishlistItems.length > 0 ? (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
                </p>
                <Button variant="outline" onClick={clearWishlist}>
                  <Trash2 size={16} className="mr-2" />
                  Clear Wishlist
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((product) => (
                  <motion.div 
                    key={product.id} 
                    className="border rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-all"
                    variants={itemVariants}
                  >
                    <Link to={`/products/${product.id}`} className="block relative">
                      <div className="aspect-[4/3] overflow-hidden bg-secondary/20">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      
                      {product.discountPrice && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                          {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                        </div>
                      )}
                    </Link>
                    
                    <div className="p-4">
                      <Link to={`/products/${product.id}`} className="block">
                        <h3 className="font-medium line-clamp-1 hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                          {product.category}
                        </p>
                      </Link>
                      
                      <div className="flex items-baseline mb-4">
                        {product.discountPrice ? (
                          <>
                            <span className="text-lg font-bold">
                              ₦{product.discountPrice.toLocaleString()}
                            </span>
                            <span className="text-sm text-muted-foreground line-through ml-2">
                              ₦{product.price.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold">
                            ₦{product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Button 
                          className="w-full"
                          onClick={() => handleMoveToCart(product)}
                          disabled={!product.inStock}
                        >
                          <ShoppingBag size={16} className="mr-2" />
                          Add to Cart
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="w-full text-red-500 hover:text-red-600"
                          onClick={() => removeFromWishlist(product.id)}
                        >
                          <Trash2 size={16} className="mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <motion.div 
              className="text-center py-16"
              variants={itemVariants}
            >
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-secondary/30 flex items-center justify-center">
                  <Heart size={32} className="text-muted-foreground" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-3">Your wishlist is empty</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                You haven't added any products to your wishlist yet. Browse our collection and save items for later.
              </p>
              <Link to="/products">
                <Button size="lg">
                  Start Shopping
                </Button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Wishlist;
