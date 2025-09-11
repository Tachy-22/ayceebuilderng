"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Plus, X, Tag as TagIcon, Star } from "lucide-react";
import { Button } from "./ui/button";
import { FileInput } from "./FileInput";
import SubmitButton from "./ui/SubmitButton";
import { updateDocument } from "@/app/actions/updateDocument";
import { addDocument } from "@/app/actions/addDocument";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Product, ProductVariant } from "@/data/products";
import Image from "next/image";
import GooglePlacesAutocomplete from "./ui/GooglePlacesAutocomplete";

interface ProductEditorProps {
  update?: boolean;
  product?: Product;
  onClose?: () => void;
}

const ProductEditor: React.FC<ProductEditorProps> = ({
  update = false,
  product,
  onClose,
}) => {
  const router = useRouter();
  const path = usePathname();

  const defaultProductData: Omit<Product, 'id'> = {
    name: "",
    category: "",
    subCategory: "",
    price: 0,
    discountPrice: undefined,
    image: "",
    images: [],
    rating: 0,
    reviewCount: 0,
    description: "",
    features: [],
    specifications: {},
    inStock: true,
    featured: false,
    bestSeller: false,
    new: false,
    location: "",
    vendor: {
      name: "",
      rating: 5,
      verified: true,
    },
    weight: 0,
    colors: [],
    selectedColor: "",
    variants: [],
    selectedVariant: undefined,
  };

  const [productData, setProductData] = useState<Omit<Product, 'id'>>(
    update && product ? { ...product } : defaultProductData
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featureInput, setFeatureInput] = useState("");
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");
  const [variantName, setVariantName] = useState("");
  const [variantPrice, setVariantPrice] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleUploadComplete = (files: FileMetadata[]) => {
    const urls = files.map((file) => file.url);
    console.log("Uploaded files:", files);

    setProductData((prev) => ({
      ...prev,
      images: urls,
      image: urls.length > 0 ? urls[0] : prev.image,
    }));

    if (errors.images) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }
  };

  useEffect(() => {
    if (update && product) {
      setProductData(product);
    }
  }, [update, product]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!productData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!productData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (productData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!productData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!productData.vendor.name.trim()) {
      newErrors.vendorName = "Vendor name is required";
    }

    if (productData.images.length === 0) {
      newErrors.images = "At least one product image is required";
    }

    if (productData.weight <= 0) {
      newErrors.weight = "Weight must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name.startsWith('vendor.')) {
      const vendorField = name.split('.')[1];
      setProductData((prev) => ({
        ...prev,
        vendor: {
          ...prev.vendor,
          [vendorField]: type === 'number' ? parseFloat(value) || 0 : value,
        },
      }));
    } else {
      setProductData((prev) => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setProductData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      const newFeature = featureInput.trim();
      if (!productData.features.includes(newFeature)) {
        setProductData((prev) => ({
          ...prev,
          features: [...prev.features, newFeature],
        }));
      }
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (featureToRemove: string) => {
    setProductData((prev) => ({
      ...prev,
      features: prev.features.filter((feature) => feature !== featureToRemove),
    }));
  };

  const handleAddSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      setProductData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey.trim()]: specValue.trim(),
        },
      }));
      setSpecKey("");
      setSpecValue("");
    }
  };

  const handleRemoveSpecification = (key: string) => {
    setProductData((prev) => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return {
        ...prev,
        specifications: newSpecs,
      };
    });
  };

  const handleAddVariant = () => {
    if (variantName.trim() && variantPrice.trim()) {
      const price = parseFloat(variantPrice.trim());
      if (price <= 0) {
        toast.error("Variant price must be greater than 0");
        return;
      }
      
      const newVariant: ProductVariant = {
        id: `variant-${Date.now()}`,
        variant_name: variantName.trim(),
        variant_price: price,
        inStock: true,
      };
      
      // Check if variant with same name already exists
      const existingVariant = productData.variants?.find(v => v.variant_name === newVariant.variant_name);
      if (existingVariant) {
        toast.error("A variant with this name already exists");
        return;
      }
      
      setProductData((prev) => ({
        ...prev,
        variants: [...(prev.variants || []), newVariant],
      }));
      setVariantName("");
      setVariantPrice("");
    }
  };

  const handleRemoveVariant = (variantToRemove: ProductVariant) => {
    setProductData((prev) => ({
      ...prev,
      variants: prev.variants?.filter((variant) => variant.id !== variantToRemove.id) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setIsSubmitting(true);

      const updatedProductData = {
        ...productData,
        updatedAt: new Date().toISOString(),
        createdAt: productData.createdAt || new Date().toISOString(),
      };

      if (update && product) {
        const result = await updateDocument(
          "products",
          product.id,
          updatedProductData,
          path
        );
        if ("success" in result && result.success) {
          toast.success("Product updated successfully");
          onClose?.();
          router.refresh();
        } else {
          toast.error(
            "message" in result ? result.message : "Failed to update product"
          );
        }
      } else {
        const result = await addDocument("products", updatedProductData, path);
        if ("success" in result && result.success) {
          toast.success("Product created successfully");
          setProductData(defaultProductData);
          onClose?.();
          router.refresh();
        } else {
          toast.error(
            "message" in result ? result.message : "Failed to create product"
          );
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    "tiles", "electrical", "paint", "sanitaryware", "cladding",
    "adhesive and admix", "plumbing", "lighting"
  ];

  return (
    <div className="h-full flex flex-col">
      <form className="flex flex-col gap-6 h-full" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 min-h-0">
          {/* Product Form */}
          <div className="lg:col-span-3 bg-gray-50 rounded-lg p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Product Details</h3>
            <div className="flex flex-col gap-4">
              {/* Basic Information */}
              <div>
                <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={productData.name}
                  onChange={handleChange}
                  className={`w-full border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter product name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={productData.category}
                    onChange={handleChange}
                    className={`w-full border ${errors.category ? "border-red-500" : "border-gray-300"} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>

                <div>
                  <label htmlFor="subCategory" className="block font-medium text-gray-700 mb-1">
                    Sub Category
                  </label>
                  <input
                    type="text"
                    id="subCategory"
                    name="subCategory"
                    value={productData.subCategory || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter sub category"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block font-medium text-gray-700 mb-1">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={productData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={`w-full border ${errors.price ? "border-red-500" : "border-gray-300"} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="0.00"
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label htmlFor="discountPrice" className="block font-medium text-gray-700 mb-1">
                    Discount Price
                  </label>
                  <input
                    type="number"
                    id="discountPrice"
                    name="discountPrice"
                    value={productData.discountPrice || ""}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="weight" className="block font-medium text-gray-700 mb-1">
                  Weight (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={productData.weight}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full border ${errors.weight ? "border-red-500" : "border-gray-300"} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="0.00"
                />
                {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
              </div>

              <div>
                <GooglePlacesAutocomplete
                  value={productData.location}
                  onChange={(value) => {
                    setProductData((prev) => ({
                      ...prev,
                      location: value,
                    }));
                  }}
                  onPlaceSelect={(place) => {
                    setProductData((prev) => ({
                      ...prev,
                      location: place.formatted_address || place.address,
                    }));
                  }}
                  label="Product Location"
                  placeholder="Enter product location or address"
                  className="w-full"
                />
              </div>

              {/* Vendor Information */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-3">Vendor Information</h4>
                <div>
                  <label htmlFor="vendor.name" className="block font-medium text-gray-700 mb-1">
                    Vendor Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="vendor.name"
                    name="vendor.name"
                    value={productData.vendor.name}
                    onChange={handleChange}
                    className={`w-full border ${errors.vendorName ? "border-red-500" : "border-gray-300"} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter vendor name"
                  />
                  {errors.vendorName && <p className="text-red-500 text-sm mt-1">{errors.vendorName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <label htmlFor="vendor.rating" className="block font-medium text-gray-700 mb-1">
                      Vendor Rating
                    </label>
                    <input
                      type="number"
                      id="vendor.rating"
                      name="vendor.rating"
                      value={productData.vendor.rating}
                      onChange={handleChange}
                      min="0"
                      max="5"
                      step="0.1"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center mt-6">
                    <Checkbox
                      id="vendor.verified"
                      checked={productData.vendor.verified}
                      onCheckedChange={(checked) => {
                        setProductData(prev => ({
                          ...prev,
                          vendor: { ...prev.vendor, verified: checked === true }
                        }));
                      }}
                    />
                    <Label htmlFor="vendor.verified" className="ml-2">Verified Vendor</Label>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={productData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full border ${errors.description ? "border-red-500" : "border-gray-300"} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter product description"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Product Images */}
              <div className="border-t pt-4">
                <div className="pb-3 text-gray-900">
                  Product Images <span className="text-red-500">*</span>
                </div>
                <FileInput
                  multiple={true}
                  accept="image/*"
                  maxFileSize={10}
                  onUploadComplete={handleUploadComplete}
                  initialFiles={productData.images || []}
                />
                {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
              </div>

              {/* Product Features */}
              <div className="border-t pt-4">
                <label className="block font-medium text-gray-700 mb-1">Features</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {productData.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="px-3 py-1">
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feature)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFeature())}
                    className="flex-1 border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a feature"
                  />
                  <Button
                    type="button"
                    onClick={handleAddFeature}
                    className="rounded-l-none bg-gray-200 hover:bg-gray-300 text-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Specifications */}
              <div className="border-t pt-4">
                <label className="block font-medium text-gray-700 mb-1">Specifications</label>
                <div className="space-y-2 mb-3">
                  {Object.entries(productData.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                      <span><strong>{key}:</strong> {value}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecification(key)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Specification name"
                  />
                  <input
                    type="text"
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Specification value"
                  />
                  <Button
                    type="button"
                    onClick={handleAddSpecification}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Product Variants */}
              <div className="border-t pt-4">
                <label className="block font-medium text-gray-700 mb-1">Product Variants</label>
                <p className="text-sm text-gray-500 mb-3">Add different size or type variants with their prices</p>
                <div className="space-y-2 mb-3">
                  {productData.variants?.map((variant) => (
                    <div key={variant.id} className="flex items-center justify-between bg-gray-100 p-3 rounded">
                      <div className="flex items-center space-x-4">
                        <span><strong>{variant.variant_name}:</strong> ₦{variant.variant_price.toLocaleString()}</span>
                        <Badge variant={variant.inStock ? "default" : "secondary"}>
                          {variant.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(variant)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {!productData.variants?.length && (
                    <p className="text-sm text-gray-400 italic">No variants added yet. Add variants like sizes (SM, MD, LG) or types.</p>
                  )}
                </div>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={variantName}
                    onChange={(e) => setVariantName(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Variant name (e.g., Small, Large, 25kg)"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddVariant())}
                  />
                  <input
                    type="number"
                    value={variantPrice}
                    onChange={(e) => setVariantPrice(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Price (₦)"
                    min="0"
                    step="0.01"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddVariant())}
                  />
                  <Button
                    type="button"
                    onClick={handleAddVariant}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                    disabled={!variantName.trim() || !variantPrice.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Product Status */}
              <div className="border-t pt-4 space-y-3">
                <h4 className="font-medium text-gray-700">Product Status</h4>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={productData.inStock}
                    onCheckedChange={(checked) => handleCheckboxChange("inStock", checked === true)}
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={productData.featured}
                    onCheckedChange={(checked) => handleCheckboxChange("featured", checked === true)}
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="bestSeller"
                    checked={productData.bestSeller}
                    onCheckedChange={(checked) => handleCheckboxChange("bestSeller", checked === true)}
                  />
                  <Label htmlFor="bestSeller">Best Seller</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="new"
                    checked={productData.new}
                    onCheckedChange={(checked) => handleCheckboxChange("new", checked === true)}
                  />
                  <Label htmlFor="new">New Product</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Product Preview */}
          <div className="bg-white lg:col-span-2 rounded-lg border border-gray-200 overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-800">Preview</h3>
            </div>
            <div className="p-4">
              <div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow">
                {productData.images.length > 0 && (
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={productData.images[0]}
                      alt={productData.name || "Product"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {productData.featured && (
                      <Badge className="absolute top-2 left-2 bg-yellow-500">Featured</Badge>
                    )}
                    {productData.new && (
                      <Badge className="absolute top-2 right-2 bg-green-500">New</Badge>
                    )}
                  </div>
                )}
                <div className="p-4">
                  <h5 className="text-lg font-semibold text-gray-900 mb-2">
                    {productData.name || "Product Name"}
                  </h5>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < productData.rating ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">({productData.reviewCount})</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg font-bold text-gray-900">
                      ₦{productData.discountPrice || productData.price}
                    </span>
                    {productData.discountPrice && (
                      <span className="text-sm text-gray-500 line-through">₦{productData.price}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {productData.description.substring(0, 100)}...
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {productData.bestSeller && <Badge variant="secondary">Best Seller</Badge>}
                    {!productData.inStock && <Badge variant="destructive">Out of Stock</Badge>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4 border-t border-gray-200">
          {onClose && (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
          <SubmitButton
            disabled={isSubmitting}
            loadingtext="Saving..."
            className="flex-1 bg-primary text-white py-3 rounded font-medium hover:bg-primary/90 transition"
          >
            {update ? "Update Product" : "Create Product"}
          </SubmitButton>
        </div>
      </form>
    </div>
  );
};

export default ProductEditor;