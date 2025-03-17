import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, Star, Truck, ShoppingCart, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  useEffect(() => {
    // Find the product by ID
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setTimeout(() => setIsLoaded(true), 100);
    }
  }, [id]);
  
  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/products">
            <Button>Browse All Products</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  const handleAddToWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Product link copied to clipboard",
    });
  };

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const wishlisted = isInWishlist(product.id);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <ChevronRight size={14} className="mx-2" />
            <Link to="/products" className="hover:text-foreground">Products</Link>
            <ChevronRight size={14} className="mx-2" />
            <Link to={`/categories/${product.category}`} className="hover:text-foreground">
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-foreground truncate">{product.name}</span>
          </div>
        </div>
        
        <div className={`container mx-auto px-4 py-8 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Product Image */}
            <div className="bg-secondary/20 rounded-xl overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
            
            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-medium">{product.rating}</span>
                  </div>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{product.reviewCount} reviews</span>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <span className={product.inStock ? "text-green-600" : "text-red-500"}>
                    {product.inStock ? "In stock" : "Out of stock"}
                  </span>
                </div>
              </div>
              
              <div>
                {hasDiscount ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">₦{product.discountPrice.toLocaleString()}</span>
                    <span className="text-xl text-muted-foreground line-through">
                      ₦{product.price.toLocaleString()}
                    </span>
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-sm">
                      {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold">₦{product.price.toLocaleString()}</span>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-none"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <span className="text-xl font-medium">-</span>
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-16 text-center border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-none"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <span className="text-xl font-medium">+</span>
                    </Button>
                  </div>
                  
                  <Button 
                    className="flex-1"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Add to Cart
                  </Button>
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    className={`flex-1 ${wishlisted ? "border-primary text-primary" : ""}`}
                    onClick={handleAddToWishlist}
                  >
                    <Heart size={18} className={`mr-2 ${wishlisted ? "fill-primary" : ""}`} />
                    {wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleShare}
                  >
                    <Share2 size={18} className="mr-2" />
                    Share
                  </Button>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-start gap-2 text-sm">
                  <Truck size={18} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">Delivery:</span> Available nationwide. 
                    <Link to="/delivery-estimator" className="text-primary ml-1">
                      Calculate delivery cost
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <Tabs defaultValue="description">
              <TabsList className="w-full border-b rounded-none justify-start">
                <TabsTrigger value="description" className="text-base">Description</TabsTrigger>
                <TabsTrigger value="specifications" className="text-base">Specifications</TabsTrigger>
                <TabsTrigger value="reviews" className="text-base">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <div className="prose max-w-none">
                  <p>{product.description}</p>
                  <p>This premium construction material is designed to meet the highest industry standards and is suitable for both professional and DIY construction projects. Built with durability in mind, it will withstand the test of time and environmental conditions.</p>
                  <h3>Key Features</h3>
                  <ul>
                    <li>High-quality material composition</li>
                    <li>Durability and long-lasting performance</li>
                    <li>Easy to install and maintain</li>
                    <li>Compatible with standard construction practices</li>
                    <li>Environmentally friendly manufacturing process</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="specifications" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Technical Specifications</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Material</span>
                        <span>Premium-grade</span>
                      </div>
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Dimensions</span>
                        <span>Standard</span>
                      </div>
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Weight</span>
                        <span>25kg per unit</span>
                      </div>
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Color</span>
                        <span>Natural</span>
                      </div>
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Warranty</span>
                        <span>2 years</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Packaging Information</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Package Contents</span>
                        <span>1 unit</span>
                      </div>
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Package Weight</span>
                        <span>25.5kg</span>
                      </div>
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Package Dimensions</span>
                        <span>Standard</span>
                      </div>
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Certification</span>
                        <span>ISO Certified</span>
                      </div>
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">Country of Origin</span>
                        <span>Nigeria</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Customer Reviews</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={18}
                              className={star <= Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                            />
                          ))}
                        </div>
                        <span className="ml-2">{product.rating} out of 5</span>
                        <span className="mx-2 text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{product.reviewCount} reviews</span>
                      </div>
                    </div>
                    <Button>Write a Review</Button>
                  </div>
                  
                  <div className="space-y-4">
                    {[1, 2, 3].map((review) => (
                      <div key={review} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="font-medium">Customer {review}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(2023, 6 + review, 10 + review).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={14}
                                className={star <= 5 - review % 2 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm">
                          {review === 1 ? 
                            "Excellent quality product. I've used it for multiple projects and it has never disappointed. Highly recommend!" :
                            review === 2 ?
                            "Good product overall. Delivery was prompt and the material quality is as described. Would purchase again." :
                            "Decent product for the price. Packaging could be improved but the material itself is good quality."
                          }
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <Button variant="outline">Load More Reviews</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
