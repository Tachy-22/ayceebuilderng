import { Product, ProductNew } from "@/data/products";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the state type
export interface ProductState {
  product: Product | null;
  products: ProductNew[]; // Added state for all products
}

// Define the initial state
const initialState: ProductState = {
  product: null,
  products: [],
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    updateProduct: (state, action: PayloadAction<Product>) => {
      state.product = action.payload;
    },
    setProducts: (state, action: PayloadAction<ProductNew[]>) => {
      state.products = action.payload;
    },

    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(
        (product) => product.id?.toString() !== action.payload
      );
    },
    updateProductInList: (state, action: PayloadAction<ProductNew>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
  },
});

export const {
  updateProduct,
  setProducts,
  removeProduct,
  updateProductInList,
} = productSlice.actions;

export default productSlice.reducer;
