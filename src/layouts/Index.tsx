import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import {
  categories,
  featuredProducts,
  bestSellerProducts,
  products,
} from "@/data/products";

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

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 lg:pt-32 overflow-hidden relative w-full ">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between ">
          <motion.div
            className=" lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Badge variant="outline" className="mb-4 py-1.5">
              Nigeria's Premier Construction Marketplace
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Building Nigeria, <br />
              One Material at a Time
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Premium construction supplies delivered to your doorstep. From
              cement to steel, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products">
                <Button size="lg" className="w-full sm:w-auto">
                  Shop Now
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link to="/categories">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Browse Categories
                </Button>
              </Link>
            </div>
            <div className="flex items-center mt-10 space-x-8">
              <div className="flex items-center">
                <span className="font-medium mr-2">20K+</span>
                <span className="text-sm text-muted-foreground">Products</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">500+</span>
                <span className="text-sm text-muted-foreground">Vendors</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">50K+</span>
                <span className="text-sm text-muted-foreground">Customers</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="lg:w-1/2 w-full mt-10 lg:mt-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            <div className="w-full  h-[400px] lg:h-[500px]">
              <div className=" w-full h-full rounded-xl overflow-hidden">
                <img
                  src="/hero-img.webp"
                  alt="Construction materials"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -right-5 -bottom-5 w-64 h-64 bg-primary/5 rounded-full" />
              <div className="absolute -left-10 -top-10 w-32 h-32 bg-primary/5 rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* New Section: Building Quotation Tool */}
      <section className="py-10 bg-primary/10 mt-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div className="lg:col-span-3" variants={fadeIn}>
              <Badge className="mb-2">FREE TOOL</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Building Material Quotation Tool
              </h2>
              <p className="text-lg mb-6">
                Plan your construction project with our free Building Quotation
                Tool. Calculate material requirements and costs based on your
                project specifications.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/building-quotation">
                  <Button size="lg">
                    Try Building Quotation Tool
                    <Building size={16} className="ml-2" />
                  </Button>
                </Link>
                <Link to="/products">
                  <Button size="lg" variant="outline">
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

      {/* Free Delivery Estimator Banner */}
      {/* <section className="py-10 bg-secondary/30 mt-0">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div className="lg:col-span-3" variants={fadeIn}>
              <Badge className="mb-2">DELIVERY</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Integrated Delivery Cost Calculator</h2>
              <p className="text-lg mb-6">
                Our delivery calculator is now integrated into the checkout process! Get accurate delivery estimates based on your location and order details.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/cart">
                  <Button size="lg">
                    Check it in Cart
                    <Truck size={16} className="ml-2" />
                  </Button>
                </Link>
                <Link to="/delivery-estimator">
                  <Button size="lg" variant="outline">
                    Advanced Estimator
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div className="lg:col-span-2" variants={fadeIn}>
              <div className="bg-white p-6 rounded-xl shadow-lg border">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="text-primary" size={24} />
                  <div>
                    <h3 className="font-medium">Smart Location Detection</h3>
                    <p className="text-sm text-muted-foreground">Automatically finds the nearest depot</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <Calculator className="text-primary" size={24} />
                  <div>
                    <h3 className="font-medium">Accurate Estimates</h3>
                    <p className="text-sm text-muted-foreground">Based on real-time logistics data</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="text-primary" size={24} />
                  <div>
                    <h3 className="font-medium">Multiple Vehicle Options</h3>
                    <p className="text-sm text-muted-foreground">Choose the right transportation for your materials</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section> */}

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
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

      {/* Categories Section */}
      <section className="py-16 md:py-24 bg-gray-200/20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl font-bold mb-4">Shop by Categories</h2>
            <p className="text-muted-foreground">
              Browse our wide range of construction materials categorized for
              your convenience.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {categories.slice(0, 5).map((category, index) => (
              <motion.div key={category.id} variants={fadeIn}>
                <Link
                  to={`/categories/${category.id}`}
                  className="bg-white rounded-xl p-4 text-center transition-all duration-300 hover:shadow-md hover-lift border block"
                >
                  <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary text-xl">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-medium">{category.name}</h3>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Link to="/categories">
              <Button variant="outline">
                View All Categories
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-col md:flex-row md:items-end justify-between mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div>
              <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
              <p className="text-muted-foreground max-w-xl">
                Explore our handpicked selection of high-quality construction
                materials from trusted vendors.
              </p>
            </div>
            <Link
              to="/products"
              className="text-primary font-medium hover:underline mt-4 md:mt-0 inline-flex items-center"
            >
              View All Products
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </motion.div>

          <Tabs defaultValue="featured" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="bestsellers">Best Sellers</TabsTrigger>
              <TabsTrigger value="new">New Arrivals</TabsTrigger>
            </TabsList>

            <TabsContent value="featured" className="mt-0">
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
              >
                {featuredProducts.map((product) => (
                  <motion.div key={product.id} variants={fadeIn}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="bestsellers" className="mt-0">
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
              >
                {bestSellerProducts.map((product) => (
                  <motion.div key={product.id} variants={fadeIn}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="new" className="mt-0">
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
              >
                {products.slice(0, 4).map((product) => (
                  <motion.div key={product.id} variants={fadeIn}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Customer Benefits */}
      <section className="py-16 md:py-24 bg-secondary/5">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Why Choose Ayceebuilder?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing the best construction materials
              shopping experience in Nigeria
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <Card className="border-0 shadow-md">
                <CardContent className="p-8">
                  <div className="rounded-full w-12 h-12 bg-green-100 flex items-center justify-center mb-6">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Quality Guaranteed</h3>
                  <p className="text-muted-foreground">
                    All our products undergo strict quality control. We only
                    partner with trusted manufacturers and vendors who meet our
                    standards.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
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

            <motion.div variants={fadeIn}>
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
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div>
              <h2 className="text-3xl font-bold mb-4">Project Showcase</h2>
              <p className="text-muted-foreground max-w-xl">
                See how our materials have been used in some of Nigeria's most
                impressive construction projects
              </p>
            </div>
            {/* <Button variant="outline" className="mt-4 md:mt-0">
              View All Projects
            </Button> */}
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div
              className="rounded-xl overflow-hidden group cursor-pointer"
              variants={fadeIn}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <motion.img
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&auto=format&fit=crop"
                  alt="Residential project"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05, transition: { duration: 0.4 } }}
                />
              </div>
              <div className="p-4 bg-white">
                <Badge className="mb-2">Residential</Badge>
                <h3 className="text-lg font-bold mb-1">Modern Family Home</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Lagos, Nigeria
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Completed in 2023</span>
                  {/* <Button variant="ghost" size="sm" className="gap-1">
                    View Details
                    <ArrowRight size={14} />
                  </Button> */}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="rounded-xl overflow-hidden group cursor-pointer"
              variants={fadeIn}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <motion.img
                  src="https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2000&auto=format&fit=crop"
                  alt="Commercial project"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05, transition: { duration: 0.4 } }}
                />
              </div>
              <div className="p-4 bg-white">
                <Badge variant="secondary" className="mb-2">
                  Commercial
                </Badge>
                <h3 className="text-lg font-bold mb-1">Office Complex</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Abuja, Nigeria
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Completed in 2022</span>
                  <Button variant="ghost" size="sm" className="gap-1">
                    View Details
                    <ArrowRight size={14} />
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="rounded-xl overflow-hidden group cursor-pointer"
              variants={fadeIn}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <motion.img
                  src="https://www.julius-berger.com/fileadmin/_processed_/1/7/csm_julius_berger_reference_second_river_niger_bridge_8__large__693a6a81a6.jpg"
                  alt="Infrastructure project"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05, transition: { duration: 0.4 } }}
                />
              </div>
              <div className="p-4 bg-white">
                <Badge variant="outline" className="mb-2">
                  Infrastructure
                </Badge>
                <h3 className="text-lg font-bold mb-1">Highway Bridge</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Port Harcourt, Nigeria
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Completed in 2023</span>
                  {/* <Button variant="ghost" size="sm" className="gap-1">
                    View Details
                    <ArrowRight size={14} />
                  </Button> */}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Market Insights */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl font-bold mb-4">Market Insights</h2>
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
                  {/* <Button variant="outline" size="sm" className="w-full">
                    Read Analysis
                  </Button> */}
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
                  {/* <Button variant="outline" size="sm" className="w-full">
                    View Report
                  </Button> */}
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
                  {/* <Button variant="outline" size="sm" className="w-full">
                    Explore Trends
                  </Button> */}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Link to="/market-insights">
              <Button>
                View All Market Insights
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </motion.div> */}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 md:py-24 bg-primary relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-2xl mx-auto text-center text-white"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Ayceebuilder as a Vendor
            </h2>
            <p className="text-white/80 mb-8 text-lg">
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
                  <p className="text-sm text-white/70">Monthly Visitors</p>
                </motion.div>
                <motion.div
                  className="bg-white/10 p-3 rounded-lg"
                  variants={fadeIn}
                >
                  <h3 className="text-xl font-bold mb-1">₦50M+</h3>
                  <p className="text-sm text-white/70">Monthly Sales</p>
                </motion.div>
                <motion.div
                  className="bg-white/10 p-3 rounded-lg"
                  variants={fadeIn}
                >
                  <h3 className="text-xl font-bold mb-1">15,000+</h3>
                  <p className="text-sm text-white/70">Active Customers</p>
                </motion.div>
              </motion.div>
              <Link to="/vendors/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  Become a Vendor
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground">
              Don't just take our word for it — hear from some of our satisfied
              customers.
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
                  <h4 className="font-medium ">Adeyemi Oluwaseun</h4>
                  <p className="text-sm text-muted-foreground">
                    Contractor, Lagos
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                "Ayceebuilder has simplified my material procurement process.
                The quality is consistent, and I save a lot of time."
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
                  <h4 className="font-medium">Chukwudi Madueke</h4>
                  <p className="text-sm text-muted-foreground">
                    Real Estate Developer, Abuja
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                "The variety of products available on Ayceebuilder is
                impressive. I can find everything I need for my projects in one
                place."
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
                  <h4 className="font-medium">Folake Ibrahim</h4>
                  <p className="text-sm text-muted-foreground">
                    Homeowner, Port Harcourt
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                "As a first-time homebuilder, the guidance I received from
                Ayceebuilder vendors was invaluable. Great service!"
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

      <Footer />
    </div>
  );
};

export default Index;
