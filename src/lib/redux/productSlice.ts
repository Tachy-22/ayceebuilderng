import { Product } from "@/data/products";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state using that type
export interface productState {
  product: Product | null;
}

// Define the initial state using that type
const initialState: productState = {
  product: null,
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    updateProduct: (state, action: PayloadAction<Product>) => ({
      product: action.payload,
    }),
  },
});

export const { updateProduct } = productSlice.actions;

export default productSlice.reducer;
