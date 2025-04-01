"use client";

import { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setProducts } from "@/lib/redux/productSlice";
import { Product, ProductNew } from "@/data/products";

interface ProductsProviderProps {
  products: ProductNew[];
  children: ReactNode;
}

const ProductsProvider: React.FC<ProductsProviderProps> = ({
  products,
  children,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (products.length) {
      dispatch(setProducts(products));
    }
  }, [products, dispatch]);

  return <>{children}</>;
};

export default ProductsProvider;
