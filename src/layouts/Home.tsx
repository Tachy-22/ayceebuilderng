"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getHomePageStats } from "@/lib/firestore";
import {
  ArrowRight,
  ChevronRight,
  ShoppingBag,
  TrendingUp,
  Truck,
  CreditCard,
  Heart,
  Gift,
  CheckCircle,
  MapPin,
  Calculator,
  Star,
  Users,
  BarChart3,
  Building,
  Award,
  ShieldCheck,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
//import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

//import ProductCard from "@/components/ProductCard";
import {
  categories,
  // featuredProducts,
  // bestSellerProducts,
  // products,
  Product,
} from "@/data/products";
import Link from "next/link";
import { whatsappNumber } from "@/lib/utils";
import Image from "next/image";
import Footer from "@/components/Footer";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const getCategoryDescription = (categoryName: string) => {
  const descriptions: { [key: string]: string } = {
    Cement: "High-quality cement for all your construction needs.",
    Steel: "Durable steel materials for reinforcement and structures.",
    Roofing: "Premium roofing materials for lasting protection.",
    Tiling: "Elegant tiles to enhance your spaces.",
    Plumbing: "Reliable plumbing supplies for efficient systems.",
    Electrical: "Top-notch electrical components for safe installations.",
    Paints: "Vibrant paints for a perfect finish.",
    Wood: "Quality wood for furniture and construction.",
    Glass: "Clear and durable glass for modern designs.",
    Tools: "Essential tools for every construction project.",
  };
  return descriptions[categoryName] || "Explore our wide range of materials.";
};

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState({
    products: 0,
    vendors: 0,
    customers: 0
  });
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    setIsLoaded(true);

    // Fetch real-time statistics from Firebase
    const fetchStats = async () => {
      try {
        const homePageStats = await getHomePageStats();
        setStats(homePageStats);
      } catch (error) {
        console.error('Error fetching homepage stats:', error);
      }
    };

    // Fetch featured products
    const fetchFeaturedProducts = async () => {
      try {
        // First try to get featured products
        let response = await fetch('/api/products?featured=true&limit=6');
        let data = await response.json();

        // If no featured products found, get some regular products as fallback
        if (data.success && (!data.data || data.data.length === 0)) {
          console.log('No featured products found, fetching recent products as fallback');
          response = await fetch('/api/products?limit=6&sortBy=createdAt&sortDirection=desc');
          data = await response.json();
        }

        if (data.success && data.data && data.data.length > 0) {
          setFeaturedProducts(data.data);
          console.log('Fetched products for slideshow:', data.data.length);
        } else {
          console.log('No products found for slideshow');
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    fetchStats();
    fetchFeaturedProducts();
  }, []);

  const whatsappMessage =
    "Hello, I'm interested in becoming a vendor on Ayceebuilder.";
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="pt-24 lg:pt-32 overflow-hidden relative w-full ">
        <div className="max-w-7xl w-full mx-auto px-4 flex flex-col lg:flex-row gap-6 items-center justify-between ">
          <div className="  w-full lg:w-1/2">
            <Badge variant="outline" className="mb-4 py-1.5">
              Ayceebuilder
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl flex flex-col gap-3 font-bold leading-tight mb-6 text-grey-800">
              {/* <span className="text-2xl">Ayceebuilder
              </span> */}
              Shop Premium  <br />
              Building Supplies
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-[80%]">
              From tiling
              to roofing, delivered to your doorstep we&apos;ve got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products" aria-label="Go to Products page">
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  aria-label="Shop Now"
                >
                  Shop Now
                  <ArrowRight size={16} className="ml-2" aria-hidden="true" />
                </Button>
              </Link>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello, I need help with construction materials")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                  aria-label="Contact us on WhatsApp"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="#25D366"
                    className="mr-2"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Us
                </Button>
              </a>

            </div>
            {/* <div className=" items-center mt-10 justify-between md:justify-start  lg:flex hidden gap-4">
              <div className="flex items-center">
                <span className="font-medium mr-2">{stats.products.toLocaleString()}+</span>
                <span className="text-sm text-muted-foreground">Products</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">{stats.vendors.toLocaleString()}+</span>
                <span className="text-sm text-muted-foreground">Vendors</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">{stats.customers.toLocaleString()}+</span>
                <span className="text-sm text-muted-foreground">Customers</span>
              </div>
            </div> */}
          </div>
          <div className="lg:w-1/2 w-full mt-10 lg:mt-0 relative">
            <div className="w-full  h-[400px] lg:h-[500px]">
              <div className=" w-full h-full rounded-xl overflow-hidden">
                <img

                  width={7495}
                  height={4996}
                  src="/hero-img2.jpg"
                  alt="Construction materials"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -right-5 -bottom-5 w-64 h-64 bg-primary/5 rounded-full" />
              <div className="absolute -left-10 -top-10 w-32 h-32 bg-primary/5 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* New Section: Building Quotation Tool categories */}
      <section className="py-10 bg-primary/10 mt-16">
        <div className="max-w-7xl w-full mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div className="lg:col-span-3" variants={fadeIn}>
              <Badge className="mb-2 text-[#004d40]">FREE TOOL</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-grey-800">
                Get Free Quotation
              </h2>
              <p className="text-lg mb-6">
                Plan your construction project with our free Building Quotation
                Tool. Calculate material requirements and costs based on your
                project specifications.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/building-quotation"
                  aria-label="Try Building Quotation Tool"
                >
                  <Button size="lg" aria-label="Try Building Quotation Tool">
                    Calculate Material Required
                    <Building size={16} className="ml-2" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/products" aria-label="Shop Products">
                  <Button
                    size="lg"
                    variant="outline"
                    aria-label="Shop Products"
                  >
                    Shop Products
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div className="lg:col-span-2" variants={fadeIn}>
              <div className="bg-white p-6 rounded-xl shadow-lg border">
                <div className="flex items-center gap-3 mb-4">
                  <Building className="text-primary" size={24} />
                  <div>
                    <h3 className="font-medium">Project-Based Calculations</h3>
                    <p className="text-sm text-muted-foreground">
                      Material estimates based on your specifications
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <Calculator className="text-primary" size={24} />
                  <div>
                    <h3 className="font-medium">Accurate Cost Estimates</h3>
                    <p className="text-sm text-muted-foreground">
                      Get detailed breakdown of material costs
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShoppingBag className="text-primary" size={24} />
                  <div>
                    <h3 className="font-medium">Add to Cart with One Click</h3>
                    <p className="text-sm text-muted-foreground">
                      Easily order all needed materials
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>



      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="max-w-7xl w-full mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Badge className="mb-4">
                {featuredProducts.some(p => p.featured) ? 'Featured Products' : 'Latest Products'}
              </Badge>
              <h2 className="text-3xl font-bold mb-4 text-grey-800">
                Top Quality Products
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover our selection of premium construction materials
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full "
              >
                <CarouselContent>
                  {featuredProducts.map((product) => (
                    <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
                      <div className="p-1 ">
                        <Card className="hover-lift">
                          <CardContent className="p-0 ">
                            <div className="relative aspect-square overflow-hidden rounded-t-lg">
                              <img
                                src={product.image || product.images?.[0] || "https://placehold.co/300x300?text=No+Image"}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              {product.featured && (
                                <div className="absolute top-3 left-3">
                                  <Badge className="bg-primary text-white">Featured</Badge>
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                                {product.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {product.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                  <span className="font-bold text-lg">
                                    ₦{product.price?.toLocaleString()}
                                  </span>
                                  {product.discountPrice && product.discountPrice !== product.price && (
                                    <span className="text-sm text-muted-foreground line-through">
                                      ₦{product.discountPrice.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                                <Link href={`/products/${product.id}`}>
                                  <Button size="sm">
                                    View Details
                                    <ArrowRight size={14} className="ml-1" />
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </motion.div>

            <div className="text-center mt-8">
              <Link href="/products">
                <Button variant="outline" size="lg">
                  View All Products
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section who we are */}
      <section className=" !h-[68rem] bg-gray-200/20">
        <div className="max-w-7xl w-full mx-auto px-4">
          <motion.div
            className="text-center max-w-xl mx-auto py-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl font-bold mb-4 text-grey-800">
              Shop by Categories
            </h2>
            <p className="text-muted-foreground ">
              Browse our wide range of construction materials categorized for
              your convenience.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-9 lg:grid-rows-4 gap-4 md:gap-6 max-w-7xl mx-auto pt-4  lg:h-[60rem]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* First item - Large */}
            <motion.div
              variants={fadeIn}
              className="lg:col-span-3 lg:row-span-2 overflow-hidden rounded-xl border"
            >
              <Link
                href={`/products?category=${categories[0].id}&page=1&limit=8`}
                className="group relative h-full block w-full"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/5 to-black/90 z-10" />
                <div className="relative h-full w-full bg-gray-200 overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-1706629503586-2731f65587ae?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zmxvb3IlMjB0aWxlc3xlbnwwfHwwfHx8MA%3D%3D`}
                    alt={categories[0].name}
                    width={800}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 transform  z-20">
                  <div className="backdrop-blur-sm p-3 rounded-lg shadow-md">
                    <h3 className="font-medium text-white text-xl">
                      {categories[0].name}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-300  transition-all duration-300 group-hover:opacity-100 group-hover:max-h-20">
                        {getCategoryDescription(categories[0].name)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Second item */}
            <motion.div
              variants={fadeIn}
              className="lg:col-span-4 lg:row-span-1 overflow-hidden rounded-xl border"
            >
              <Link
                href={`/products?category=${categories[1].id}&page=1&limit=8`}
                className="group relative h-full block w-full"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/5 to-black/90 z-10" />
                <div className="relative h-full w-full bg-gray-200 overflow-hidden">
                  <img
                    src={`https://media.istockphoto.com/id/1472464806/photo/decorative-antique-edison-style-filament-light-bulbs-hanging-an-electrician-is-installing.jpg?s=612x612&w=0&k=20&c=3wirHrNX0E-pN-UTaAJhQ18jyoCuUM3ZwOaUHwqbls0=`}
                    alt={categories[1].name}
                    width={500}
                    height={300}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 transform  z-20">
                  <div className="backdrop-blur-sm p-3 rounded-lg shadow-md">
                    <h3 className="font-medium text-white">
                      {categories[1].name}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-300  transition-all duration-300 group-hover:opacity-100 group-hover:max-h-20">
                        {getCategoryDescription(categories[1].name)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Third item */}
            <motion.div
              variants={fadeIn}
              className="lg:col-span-2 lg:row-span-1 overflow-hidden rounded-xl border"
            >
              <Link
                href={`/products?category=${categories[2].id}&page=1&limit=8`}
                className="group relative h-full block w-full"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/5 to-black/90 z-10" />
                <div className="relative h-full w-full bg-gray-200 overflow-hidden">
                  <img
                    src="https://www.nobroker.in/blog/wp-content/uploads/2023/07/emulsion-paint-1200x673.webp"
                    alt={categories[2].name}
                    width={400}
                    height={300}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 transform  z-20">
                  <div className="backdrop-blur-sm p-3 rounded-lg shadow-md">
                    <h3 className="font-medium text-white">
                      {categories[2].name}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-300  transition-all duration-300 group-hover:opacity-100 group-hover:max-h-20">
                        {getCategoryDescription(categories[2].name)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Fourth item */}
            <motion.div
              variants={fadeIn}
              className="lg:col-span-2 lg:row-span-1 overflow-hidden rounded-xl border"
            >
              <Link
                href={`/products?category=${categories[3].id}&page=1&limit=8`}
                className="group relative h-full block w-full"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/5 to-black/90 z-10" />
                <div className="relative h-full w-full bg-gray-200 overflow-hidden">
                  <img
                    src={`https://5.imimg.com/data5/IR/AL/PO/SELLER-43531398/sanitary-ware.JPG`}

                    alt={categories[3].name}
                    width={400}
                    height={300}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 transform  z-20">
                  <div className="backdrop-blur-sm p-3 rounded-lg shadow-md">
                    <h3 className="font-medium text-white">
                      {categories[3].name}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-300  transition-all duration-300 group-hover:opacity-100 group-hover:max-h-20">
                        {getCategoryDescription(categories[3].name)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Fifth item */}
            <motion.div
              variants={fadeIn}
              className="lg:col-span-2 lg:row-span-1 overflow-hidden rounded-xl border"
            >
              <Link
                href={`/products?category=${categories[4].id}&page=1&limit=8`}
                className="group relative h-full block w-full"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/5 to-black/90 z-10" />
                <div className="relative h-full w-full bg-gray-200 overflow-hidden">
                  <img
                    src={`https://media.istockphoto.com/id/2150737447/photo/living-room-designed-in-a-modern-minimalist-style.jpg?s=612x612&w=0&k=20&c=dLISljRiuau099SmQboAzWvnHYQzM6ezn_7XD_WzPS0=`}


                    alt={categories[4].name}
                    width={400}
                    height={300}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 transform  z-20">
                  <div className="backdrop-blur-sm p-3 rounded-lg shadow-md">
                    <h3 className="font-medium text-white">
                      {categories[4].name}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-300  transition-all duration-300 group-hover:opacity-100 group-hover:max-h-20">
                        {getCategoryDescription(categories[4].name)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Sixth item */}
            <motion.div
              variants={fadeIn}
              className="lg:col-span-2 lg:row-span-1 overflow-hidden rounded-xl border"
            >
              <Link
                href={`/products?category=${categories[5].id}&page=1&limit=8`}
                className="group relative h-full block w-full"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/5 to-black/90 z-10" />
                <div className="relative h-full w-full bg-gray-200 overflow-hidden">
                  <img
                    src={`https://media.istockphoto.com/id/1314469297/photo/pouring-glue-into-glue-container.jpg?s=612x612&w=0&k=20&c=z5biCsx3lpS-g0aNDpRYnLGP5d5yHF705ZQa2uLD3D8=`}
                    alt={categories[5].name}
                    width={800}
                    height={300}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 transform  z-20">
                  <div className="backdrop-blur-sm p-3 rounded-lg shadow-md">
                    <h3 className="font-medium text-white">
                      {categories[5].name}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-300  transition-all duration-300 group-hover:opacity-100 group-hover:max-h-20">
                        {getCategoryDescription(categories[5].name)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
            {/* Seventh item */}
            <motion.div
              variants={fadeIn}
              className="lg:col-span-9 lg:row-span-0 overflow-hidden rounded-xl border"
            >
              <Link
                href={`/products?category=${categories[6].id}&page=1&limit=8`}
                className="group relative h-full block w-full"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/5 to-black/90 z-10" />
                <div className="relative h-full w-full bg-gray-200 overflow-hidden">
                  <img
                    src={`https://media.istockphoto.com/id/1135314838/photo/repair-of-hydraulic-heating-system-in-the-house.jpg?s=612x612&w=0&k=20&c=Z8-BohVX0_Niqp72nroZzeK3m8C69U2xLcvQYE_iHuA=`}
                    alt={categories[6].name}
                    width={800}
                    height={300}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 transform  z-20">
                  <div className="backdrop-blur-sm p-3 rounded-lg shadow-md">
                    <h3 className="font-medium text-white">
                      {categories[6].name}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-300  transition-all duration-300 group-hover:opacity-100 group-hover:max-h-20">
                        {getCategoryDescription(categories[6].name)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          <div className=" text-center translate-y-[-12rem]">
            <Link href="/products">
              <Button variant="outline">
                View All Categories
                <ChevronRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section (New) */}
      {/* <section className="py-16 md:py-24">
        <div className="max-w-7xl w-full mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <Badge className="mb-4">About Aycee Builder</Badge>
              <h2 className="text-3xl font-bold mb-6 text-grey-800">
                Building Africa&apos;s Construction Future
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                Aycee Builder is focused on becoming Africa&apos;s leading
                online marketplace for construction and finishing materials. We
                are dedicated to delivering high-quality products and services,
                emphasizing customization, sustainability, and excellence.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Our mission is to provide high-quality construction and
                finishing materials to both high-end and regular markets through
                efficient and convenient means.
              </p>

              <div className="flex flex-wrap gap-4 mt-6">
                <Link href="/about">
                  <Button variant="outline" size="lg">
                    Learn More About Us
                    <ChevronRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="grid grid-cols-2 gap-6">
              <div className="bg-primary/5 p-6 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4">
                  <Award className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-bold mb-2">Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Committed to offering only the highest-quality materials.
                </p>
              </div>

              <div className="bg-primary/5 p-6 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4">
                  <Users className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-bold mb-2">Customer-centric</h3>
                <p className="text-sm text-muted-foreground">
                  We place customers at the core of everything we do.
                </p>
              </div>

              <div className="bg-primary/5 p-6 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4">
                  <ShieldCheck className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-bold mb-2">Integrity</h3>
                <p className="text-sm text-muted-foreground">
                  We operate with transparency and honesty.
                </p>
              </div>

              <div className="bg-primary/5 p-6 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4">
                  <Lightbulb className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-bold mb-2">Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  Embracing the latest trends and advancements.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section> */}

      {/* Customer Benefits */}
      <section className="py-16 md:py-24 bg-secondary/5">
        <div className="max-w-7xl w-full mx-auto px-4">
          <motion.div
            className="text-center mb-16 "
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl font-bold mb-4 text-grey-800">
              Why Choose Ayceebuilder?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We&apos;re committed to providing the best construction materials
              shopping experience in Nigeria
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div className="h-full" variants={fadeIn}>
              <Card className="border-0 shadow-md">
                <CardContent className="p-8">
                  <div className="rounded-full w-12 h-12 bg-green-100 flex items-center justify-center mb-6">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 ">
                    Quality Guaranteed
                  </h3>
                  <p className="text-muted-foreground">
                    All our products undergo strict quality control. We only
                    partner with trusted manufacturers and vendors that meet
                    our standards.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div className="h-full" variants={fadeIn}>
              <Card className="border-0 shadow-md">
                <CardContent className="p-8">
                  <div className="rounded-full w-12 h-12 bg-blue-100 flex items-center justify-center mb-6">
                    <TrendingUp className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Best Market Prices</h3>
                  <p className="text-muted-foreground">
                    Our direct relationships with manufacturers allow us to
                    offer competitive prices without compromising on quality.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div className="h-full" variants={fadeIn}>
              <Card className="border-0 shadow-md">
                <CardContent className="p-8">
                  <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-6">
                    <Users className="text-purple-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Expert Advice</h3>
                  <p className="text-muted-foreground">
                    Our team of construction experts is always available to help
                    you choose the right materials for your specific project
                    needs.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Project Showcase */}


      {/* Market Insights */}
      {/* <section className="py-16 md:py-24 bg-primary/5">
        <div className="max-w-7xl w-full mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl text-grey-800 font-bold mb-4">
              Market Insights
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest trends and prices in the construction
              materials market
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="h-full">
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">Cement Market</Badge>
                    <BarChart3 size={20} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">
                    Cement Prices Stabilizing
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    After months of fluctuation, cement prices across Nigeria
                    are beginning to stabilize, making it an ideal time for bulk
                    purchases.
                  </p>
            
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">Steel Industry</Badge>
                    <TrendingUp size={20} className="text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">
                    Local Steel Production Up
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Increased local production is driving down the cost of steel
                    reinforcement bars, creating opportunities for construction
                    projects.
                  </p>
                 
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">Sustainable Materials</Badge>
                    <Star size={20} className="text-yellow-500" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">
                    Green Building Materials Trending
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Eco-friendly construction materials are seeing increased
                    demand as more developers commit to sustainable building
                    practices.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

     
        </div>
      </section> */}

      {/* Features Section */}
      <section className="pt-16 md:pt-24">
        <div className="max-w-7xl w-full mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div
              className="bg-white p-6 rounded-xl border flex items-start gap-4 hover-lift subtle-shadow"
              variants={fadeIn}
            >
              <div className="bg-primary/5 rounded-full p-3">
                <Truck className="text-primary h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Free delivery for orders above ₦50,000
                </p>
              </div>
            </motion.div>
            <motion.div
              className="bg-white p-6 rounded-xl border flex items-start gap-4 hover-lift subtle-shadow"
              variants={fadeIn}
            >
              <div className="bg-primary/5 rounded-full p-3">
                <CreditCard className="text-primary h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">
                  100% secure payment methods
                </p>
              </div>
            </motion.div>
            <motion.div
              className="bg-white p-6 rounded-xl border flex items-start gap-4 hover-lift subtle-shadow"
              variants={fadeIn}
            >
              <div className="bg-primary/5 rounded-full p-3">
                <Gift className="text-primary h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Quality Products</h3>
                <p className="text-sm text-muted-foreground">
                  Verified vendors and quality materials
                </p>
              </div>
            </motion.div>
            <motion.div
              className="bg-white p-6 rounded-xl border flex items-start gap-4 hover-lift subtle-shadow"
              variants={fadeIn}
            >
              <div className="bg-primary/5 rounded-full p-3">
                <Heart className="text-primary h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Customer Support</h3>
                <p className="text-sm text-muted-foreground">
                  Dedicated support 7 days a week
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl w-full mx-auto px-4">
          <motion.div
            className="text-center max-w-xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground">
              Don&apos;t just take our word for it — hear from some of our
              satisfied customers.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div
              className="bg-white p-6 rounded-xl border hover-lift subtle-shadow"
              variants={fadeIn}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mr-3">
                  <span className="font-medium text-white">AO</span>
                </div>
                <div>
                  <p className="font-medium ">Adeyemi Oluwaseun</p>
                  <p className="text-sm text-muted-foreground">
                    Contractor, Lagos
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                &quot;Ayceebuilder has simplified my material procurement
                process. The quality is consistent, and I save a lot of
                time.&quot;
              </p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-5 h-5 fill-yellow-400"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl border hover-lift subtle-shadow"
              variants={fadeIn}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mr-3">
                  <span className="font-medium text-white">CM</span>
                </div>
                <div>
                  <p className="font-medium">Chukwudi Madueke</p>
                  <p className="text-sm text-muted-foreground">
                    Real Estate Developer, Abuja
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                &quot;The variety of products available on Ayceebuilder is
                impressive. I can find everything I need for my projects in one
                place.&quot;
              </p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-5 h-5 fill-yellow-400"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl border hover-lift subtle-shadow"
              variants={fadeIn}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mr-3">
                  <span className="font-medium text-white">FI</span>
                </div>
                <div>
                  <p className="font-medium">Folake Ibrahim</p>
                  <p className="text-sm text-muted-foreground">
                    Homeowner, Port Harcourt
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                &quot;As a first-time homebuilder, the guidance I received from
                Ayceebuilder vendors was invaluable. Great service!&quot;
              </p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-5 h-5 fill-yellow-400"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* CTA Banner */}
      <section className="py-16 md:py-24 bg-primary relative overflow-hidden">
        <div className="max-w-7xl w-full mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-2xl mx-auto text-center text-black/90"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Ayceebuilder as a Vendor
            </h2>
            <p className="text-[#004d40] mb-8 text-lg">
              Expand your business reach and sell your construction materials to
              thousands of customers across Nigeria.
            </p>
            <div className="space-y-4">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <motion.div
                  className="bg-white/10 p-3 rounded-lg"
                  variants={fadeIn}
                >
                  <h3 className="text-xl font-bold mb-1">500K+</h3>
                  <p className="text-sm text-[#004d40]">Monthly Visitors</p>
                </motion.div>
                <motion.div
                  className="bg-white/10 p-3 rounded-lg"
                  variants={fadeIn}
                >
                  <h3 className="text-xl font-bold mb-1">₦50M+</h3>
                  <p className="text-sm text-[#004d40]">Monthly Sales</p>
                </motion.div>
                <motion.div
                  className="bg-white/10 p-3 rounded-lg"
                  variants={fadeIn}
                >
                  <h3 className="text-xl font-bold mb-1">15,000+</h3>
                  <p className="text-sm text-[#004d40]">Active Customers</p>
                </motion.div>
              </motion.div>
              <a
                href={whatsappURL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Become a Vendor via WhatsApp"
              >
                <Button
                  variant="secondary"
                  className="w-full bg-[#004d40] hover:bg-[#004d40]/90"
                  aria-label="Become a Vendor"
                >
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="#25D366"
                      className="mr-2"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Become a Vendor{" "}
                    <ArrowRight size={16} className="ml-2" aria-hidden="true" />
                  </span>
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/20" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
      </section>

      <Footer />

    </div>
  );
};

export default Home;
