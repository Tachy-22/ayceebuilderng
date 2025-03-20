export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  price: number;
  discountPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  inStock: boolean;
  featured?: boolean;
  bestSeller?: boolean;
  new?: boolean;
  vendor: {
    name: string;
    rating: number;
    verified: boolean;
  };
  weight: number;
}

export const categories = [
  { id: 'tiles', name: 'Tiles', icon: '🔲', itemCount: 20 },
  { id: 'electrical', name: 'Electrical', icon: '⚡', itemCount: 22 },
  { id: 'sanitary-ware', name: 'Sanitary Ware', icon: '🚰', itemCount: 12 },
  { id: 'cladding', name: 'Cladding', icon: '🧱', itemCount: 14 },
  { id: 'adhesive&admix', name: 'Adhesives & Admixtures', icon: '🧪', itemCount: 9 },
  { id: 'plumbing', name: 'Plumbing', icon: '💧', itemCount: 18 },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Dangote Cement (42.5R)",
    category: "adhesive&admix",
    price: 4500,
    image:
      "https://dangotecement.com/wp-content/uploads/2021/03/3X-425R-bag.png",
    rating: 4.8,
    reviewCount: 420,
    description:
      "High-quality Portland Cement suitable for a wide range of construction applications including concrete structures, mortar, and plastering.",
    features: [
      "Superior strength development",
      "Consistent quality",
      "Excellent workability",
      "Durable for all weather conditions",
    ],
    specifications: {
      Type: "Portland Cement",
      Grade: "42.5R",
      Weight: "50kg",
      "Setting Time": "45 minutes",
      "Compression Strength": ">42.5 MPa after 28 days",
    },
    inStock: true,
    featured: true,
    bestSeller: true,
    vendor: {
      name: "Dangote Cement Distributors",
      rating: 4.9,
      verified: true,
    },
     weight: 50,
  },
  {
    id: "2",
    name: "Reinforcement Steel Rods (16mm)",
    category: "cladding",
    price: 7800,
    discountPrice: 7200,
    image:
      "https://images.unsplash.com/photo-1536566482680-fca31930a0bd?q=80&w=2000&auto=format&fit=crop",
    rating: 4.7,
    reviewCount: 215,
    description:
      "High tensile reinforcement steel rods for concrete structures. Made from premium quality steel ensuring durability and strength.",
    features: [
      "High tensile strength",
      "Corrosion resistant",
      "Excellent bonding with concrete",
      "Meets Nigerian and international standards",
    ],
    specifications: {
      Diameter: "16mm",
      Length: "12m",
      Grade: "Fe500",
      Type: "TMT (Thermo Mechanically Treated)",
      "Yield Strength": "≥500 N/mm²",
    },
    inStock: true,
    vendor: {
      name: "Lagos Steel Supplies Ltd",
      rating: 4.5,
      verified: true,
    },
    weight: 12,
  },
  {
    id: "3",
    name: "Ceramic Floor Tiles (60x60cm)",
    category: "tiles",
    price: 3200,
    image:
      "https://tilesng.com/wp-content/uploads/2024/12/1000187487-592x444.jpg",
    rating: 4.6,
    reviewCount: 178,
    description:
      "Premium ceramic floor tiles with elegant finish. Ideal for living rooms, bedrooms, and commercial spaces.",
    features: [
      "Stain resistant",
      "Easy to clean",
      "Scratch resistant",
      "Anti-slip surface",
      "Consistent color and texture",
    ],
    specifications: {
      Size: "60cm x 60cm",
      Thickness: "8mm",
      Material: "Ceramic",
      Finish: "Matt",
      Usage: "Floor",
      "Water Absorption": "<0.5%",
    },
    inStock: true,
    featured: true,
    vendor: {
      name: "Royal Ceramics Nigeria",
      rating: 4.7,
      verified: true,
    },
    weight: 20,
  },
  {
    id: "4",
    name: "Berger Weather Proof Exterior Paint",
    category: "adhesive&admix",
    price: 12000,
    discountPrice: 10500,
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2000&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 310,
    description:
      "Premium exterior emulsion paint designed to withstand harsh weather conditions. Provides excellent protection against rain, heat, and UV radiation.",
    features: [
      "Weather resistant",
      "UV protection",
      "Anti-fungal properties",
      "Excellent coverage",
      "Long-lasting color",
    ],
    specifications: {
      Type: "Exterior Emulsion",
      Volume: "20 Liters",
      Coverage: "10-12 m²/L",
      "Drying Time": "2-3 hours",
      "Recoat Time": "4-6 hours",
      Finish: "Matt",
    },
    inStock: true,
    bestSeller: true,
    vendor: {
      name: "Berger Paints Nigeria",
      rating: 4.8,
      verified: true,
    },
    weight: 25,
  },
  {
    id: "5",
    name: "Premium Hardwood Planks",
    category: "cladding",
    price: 5600,
    image:
      "https://images.unsplash.com/photo-1520333789090-1afc82db536a?q=80&w=2000&auto=format&fit=crop",
    rating: 4.5,
    reviewCount: 156,
    description:
      "High-quality hardwood planks suitable for furniture making, flooring, and carpentry work. Carefully seasoned for stability and durability.",
    features: [
      "Naturally beautiful grain",
      "High density and strength",
      "Resistant to insects",
      "Long-lasting durability",
      "Environmentally sourced",
    ],
    specifications: {
      "Wood Type": "Mahogany",
      Dimensions: "2400mm x 300mm x 25mm",
      "Moisture Content": "<12%",
      Finishing: "Planed",
      Density: "High",
    },
    inStock: true,
    vendor: {
      name: "Forest Products Nigeria",
      rating: 4.6,
      verified: true,
    },
    weight: 30,
  },
  {
    id: "6",
    name: "Waterproof Roofing Sheets",
    category: "cladding",
    price: 3200,
    image: "https://surplus.lk/wp-content/uploads/2022/09/XL.jpg",
    rating: 4.7,
    reviewCount: 204,
    description:
      "Durable aluminum roofing sheets with excellent weather resistance. Designed to withstand Nigeria's tropical climate conditions.",
    features: [
      "Lightweight yet strong",
      "Corrosion resistant",
      "Easy installation",
      "Long service life",
      "Available in various colors",
    ],
    specifications: {
      Material: "Aluminum",
      Thickness: "0.55mm",
      Length: "3600mm",
      Width: "1070mm",
      "Effective Cover": "1000mm",
      Profile: "Corrugated",
    },
    inStock: true,
    featured: true,
    vendor: {
      name: "Rooftech Nigeria Ltd",
      rating: 4.4,
      verified: true,
    },
    weight: 15,
  },
  {
    id: "7",
    name: "PVC Plumbing Pipes (1 inch)",
    category: "plumbing",
    price: 1200,
    image:
      "https://pictures-nigeria.jijistatic.net/49843451_img-20191214-120714-058_1125x1500.webp",
    rating: 4.6,
    reviewCount: 189,
    description:
      "High-quality PVC pipes for water supply and distribution. Manufactured with non-toxic materials, ideal for residential and commercial plumbing.",
    features: [
      "Rust and corrosion proof",
      "Smooth interior for better flow",
      "UV resistant",
      "Easy to install",
      "Long service life",
    ],
    specifications: {
      Material: "PVC",
      Diameter: "1 inch (25mm)",
      Length: "6 meters",
      "Pressure Rating": "PN 10",
      Color: "White",
      Standard: "ISO 4422",
    },
    inStock: true,
    vendor: {
      name: "Plumbing Solutions Nigeria",
      rating: 4.5,
      verified: true,
    },
    weight: 5,
  },
  {
    id: "8",
    name: "Concrete Hollow Blocks (9 inches)",
    category: "cladding",
    price: 350,
    image: "https://gwg.ng/wp-content/uploads/2024/07/Blocks.webp",
    rating: 4.4,
    reviewCount: 220,
    description:
      "Standard hollow concrete blocks for construction of walls and partitions. Manufactured with high-quality materials for strength and durability.",
    features: [
      "Uniform size and shape",
      "High compressive strength",
      "Good sound insulation",
      "Fire resistant",
      "Cost-effective construction",
    ],
    specifications: {
      Size: "450mm x 225mm x 225mm (9 inches)",
      Weight: "Approximately 25kg",
      Material: "Concrete",
      "Compressive Strength": ">3.5 N/mm²",
      Type: "Hollow",
    },
    inStock: true,
    bestSeller: true,
    vendor: {
      name: "Reliable Blocks Manufacturing",
      rating: 4.3,
      verified: true,
    },
    weight: 25,
  },
];

export const featuredProducts = products.filter(product => product.featured);
export const bestSellerProducts = products.filter(product => product.bestSeller);
