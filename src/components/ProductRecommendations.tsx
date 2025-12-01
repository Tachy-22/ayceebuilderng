import { useState, useEffect } from 'react';
import { Product } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductRecommendationsProps {
  currentProduct: Product;
  limit?: number;
}

const ProductRecommendations = ({ currentProduct, limit = 8 }: ProductRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        
        // First try to get products from the same category
        let response = await fetch(`/api/products?category=${currentProduct.category}&limit=${limit + 5}&exclude=${currentProduct.id}`);
        let data = await response.json();
        
        let products = data.success ? data.data : [];
        
        // If we don't have enough products from the same category, get some from other categories
        if (products.length < limit) {
          const additionalNeeded = limit - products.length;
          const otherResponse = await fetch(`/api/products?limit=${additionalNeeded + 5}&exclude=${currentProduct.id}&sortBy=rating&sortDirection=desc`);
          const otherData = await otherResponse.json();
          
          if (otherData.success) {
            // Filter out products we already have and products from the same category
            const filteredOthers = otherData.data.filter(
              (p: Product) => 
                !products.find((existing: Product) => existing.id === p.id) &&
                p.id !== currentProduct.id
            );
            
            products = [...products, ...filteredOthers];
          }
        }
        
        // Limit to the requested number
        const finalProducts = products.slice(0, limit);
        setRecommendations(finalProducts);
      } catch (error) {
        console.error('Error fetching product recommendations:', error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentProduct?.id) {
      fetchRecommendations();
    }
  }, [currentProduct?.id, currentProduct?.category, limit]);

  const nextSlide = () => {
    const maxIndex = Math.max(0, recommendations.length - 4);
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  if (loading) {
    return (
      <div className="py-12">
        <h2 className="text-2xl font-bold mb-6">You might also like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-[4/3] rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-3 rounded mb-2"></div>
              <div className="bg-gray-200 h-8 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!recommendations.length) {
    return null;
  }

  return (
    <div className="py-12 border-t">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">You might also like</h2>
        
        {recommendations.length > 4 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              disabled={currentIndex >= recommendations.length - 4}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>

      <div className="overflow-hidden">
        <div 
          className="flex gap-6 transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / 4)}%)` }}
        >
          {recommendations.map((product) => (
            <div 
              key={product.id} 
              className="w-full md:w-1/2 lg:w-1/4 flex-shrink-0"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {recommendations.length > 4 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: Math.ceil(recommendations.length / 4) }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                Math.floor(currentIndex / 4) === index ? 'bg-primary' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentIndex(index * 4)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductRecommendations;