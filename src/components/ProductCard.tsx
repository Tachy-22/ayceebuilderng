import React, { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { updateProduct } from "@/lib/redux/productSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

export interface ProductCardProps {
  product: Product;
  className?: string;
  style?: React.CSSProperties;
}

// Function to calculate discount percentage
const calculateDiscountPercentage = (originalPrice: number, discountPrice: number): number => {
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className,
  style,
}) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);
  const dispatch = useDispatch();
  const router = useRouter();

  // Add state to track which image to show
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to handle mouse enter - show second image if available
  const handleMouseEnter = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  // Function to handle mouse leave - always go back to first image
  const handleMouseLeave = () => {
    setCurrentImageIndex(0);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (wishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleProductClick = () => {
    // Store product in Redux for quick access
    dispatch(updateProduct(product));
    // Navigate to product detail page
    router.push(`/products/${product.id}`);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Store product in Redux for quick access
    dispatch(updateProduct(product));

    // Encode the product name/title for URL
    const encodedTitle = encodeURIComponent(product.name);

    // Navigate to product detail page with search parameter
    router.push(
      `/products/${product.id}?searchTitle=${encodedTitle}&sheet=${product.category}`
    );
  };

  return (
    <div
      className={`group !relative border rounded-xl bg-white overflow-hidden transition-all hover:shadow-md ${className}`}
      style={style}
      aria-label={`View details for ${product.name}`}
      //  onClick={handleProductClick}
    >
      <div className="absolute top-3 right-3 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-white shadow-sm hover:text-primary"
          onClick={toggleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          name={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={16}
            className={wishlisted ? "fill-primary text-primary" : ""}
          />
        </Button>
      </div>

      {product.discountPrice && (
        <Badge
          variant="destructive"
          className="absolute top-3 left-3 z-10 px-2 py-1"
        >
          {calculateDiscountPercentage(product.price, product.discountPrice)}% OFF
        </Badge>
      )}

      {/* Image container with hover effect to switch images */}
      <div
        className="aspect-[4/3] overflow-hidden bg-secondary/20"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleImageClick} // Added specific handler for image clicks
      >
        <img
          src={product.images[currentImageIndex] || product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/600x400?text=No+Image";
          }}
        />
      </div>

      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-medium line-clamp-1">{product.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {product.category}
          </p>
        </div>

        <div className="flex items-baseline mb-3">
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

        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center">
            <div className="flex">
              {/* Star rating display */}
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(product.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200 fill-gray-200"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-1 text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>
          {product.inStock ? (
            <span className="text-green-600">In Stock</span>
          ) : (
            <span className="text-red-500">Out of Stock</span>
          )}
        </div>

        <Button
          className="w-full gap-2"
          onClick={handleAddToCart}
          disabled={!product.inStock}
          aria-label={`Add ${product.name} to cart`}
          name={`Add ${product.name} to cart`}
        >
          <ShoppingBag size={16} />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
