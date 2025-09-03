"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Building,
  Users,
  Heart,
  Lightbulb,
  ShieldCheck,
  Award,
  Target,
  ChevronRight,
  Star,
  Leaf,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { whatsappNumber } from "@/lib/utils";
import Image from "next/image";

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

const About = () => {
  const whatsappMessage =
    "Hello, I'm interested in becoming a partner with Aycee Builder.";
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 lg:pt-32 bg-primary/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4 py-1.5">
              About Aycee Builder
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-grey-800">
              Building Africa&apos;s Construction Future
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Africa&apos;s premier online marketplace for construction and
              finishing materials, dedicated to quality, customization, and
              sustainable practices.
            </p>
          </motion.div>
        </div>
        <div className="absolute right-0 bottom-0 w-1/2 h-1/2 bg-primary/5 rounded-tl-full -z-10" />
      </section>

      {/* Overview Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold mb-6 text-grey-800">
                Who We Are
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Aycee Builder is focused on becoming Africa&apos;s leading
                online marketplace for construction and finishing materials. We
                are dedicated to delivering high-quality products and services,
                emphasizing customization, sustainability, and excellence in the
                construction industry.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Our platform connects suppliers, contractors, and homeowners,
                creating a seamless ecosystem that transforms how construction
                materials are sourced and delivered across Africa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href="/products">
                  <Button size="lg">
                    Explore Our Products
                    <ChevronRight size={16} className="ml-2" />
                  </Button>
                </Link>
                <a href={whatsappURL} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg">
                    Become a Partner
                  </Button>
                </a>
              </div>
            </motion.div>
            <motion.div
              className="relative overflow-hidden"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <div className="rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="https://media.istockphoto.com/id/1178452628/photo/attractive-black-businessman-being-encouraged-by-diverse-multi-ethnic-group-of-coworkers.jpg?s=612x612&w=0&k=20&c=0CseKVV2CEx7jCgdfwpFwcNbnVfPpsF32EKVsyAB-ik="
                  alt="Aycee Builder Team"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-primary/10 rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <Badge className="mb-4">Our Purpose</Badge>
            <h2 className="text-3xl font-bold mb-6 text-grey-800">
              Vision & Mission
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              className="bg-white p-8 rounded-xl border shadow-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <Target className="text-blue-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-grey-800">
                Our Vision
              </h3>
              <p className="text-muted-foreground">
                To become Africa&apos;s premier online marketplace for
                construction and finishing materials, recognized for quality,
                customization, and promoting sustainable production and
                consumption.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-8 rounded-xl border shadow-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <Star className="text-green-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-grey-800">
                Our Mission
              </h3>
              <p className="text-muted-foreground">
                To provide high-quality construction and finishing materials to
                both high-end and regular markets through efficient and
                convenient means, ensuring customer satisfaction and
                contributing to sustainable development across Africa.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="max-w-3xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <Badge className="mb-4">The Principles That Guide Us</Badge>
            <h2 className="text-3xl font-bold mb-6 text-grey-800">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              At Aycee Builder, our values define who we are and guide how we
              operate. They are the foundation of our company culture and shape
              our interactions with customers, partners, and the communities we
              serve.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeIn}
              className="bg-white p-6 rounded-xl border hover-lift subtle-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Award className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-grey-800">Quality</h3>
              <p className="text-muted-foreground">
                Committed to offering only the highest-quality materials and
                products, ensuring durability and longevity for every project.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white p-6 rounded-xl border hover-lift subtle-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-grey-800">
                Customer-centricity
              </h3>
              <p className="text-muted-foreground">
                Places customers at the core of operations, striving to meet
                unique needs with tailored solutions and exceptional service.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white p-6 rounded-xl border hover-lift subtle-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ShieldCheck className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-grey-800">
                Integrity
              </h3>
              <p className="text-muted-foreground">
                Operates with transparency and honesty, fostering trust and
                reliability in all interactions.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white p-6 rounded-xl border hover-lift subtle-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Lightbulb className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-grey-800">
                Innovation
              </h3>
              <p className="text-muted-foreground">
                Embraces the latest advancements and trends to provide
                cutting-edge solutions that enhance the construction and
                finishing experience.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <Badge className="mb-4">Why Choose Us</Badge>
            <h2 className="text-3xl font-bold mb-6 text-grey-800">
              What Sets Us Apart
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover the Aycee Builder difference and why we&apos;re the
              preferred choice for construction materials across Africa.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex flex-shrink-0 items-center justify-center">
                <CheckCircle className="text-primary h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-grey-800">
                  Unmatched Excellence
                </h3>
                <p className="text-muted-foreground">
                  We are committed to delivering superior quality in every
                  product and service. Our rigorous quality control ensures that
                  you receive only the best materials for your projects.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex flex-shrink-0 items-center justify-center">
                <Heart className="text-primary h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-grey-800">
                  Customer-Focused Approach
                </h3>
                <p className="text-muted-foreground">
                  We prioritize your needs and preferences, offering a
                  personalized experience that ensures your construction and
                  finishing requirements are met with precision and care.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex flex-shrink-0 items-center justify-center">
                <ShieldCheck className="text-primary h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-grey-800">
                  Trusted Integrity
                </h3>
                <p className="text-muted-foreground">
                  We build lasting relationships through transparent practices.
                  Our commitment to honesty and reliability has earned us the
                  trust of countless customers and partners.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex flex-shrink-0 items-center justify-center">
                <Lightbulb className="text-primary h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-grey-800">
                  Innovative Solutions
                </h3>
                <p className="text-muted-foreground">
                  We stay ahead of industry trends to provide advanced and
                  effective solutions. Our innovative approach ensures that you
                  have access to the latest and most efficient construction
                  materials.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <Badge className="mb-4">What We Offer</Badge>
              <h2 className="text-3xl font-bold mb-6 text-grey-800">
                Our Services
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Aycee Builder provides a comprehensive range of services
                designed to meet all your construction and finishing needs, from
                supplying top-quality materials to offering expert
                consultations.
              </p>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-primary h-5 w-5 mt-1" />
                  <div>
                    <h3 className="font-bold text-grey-800">
                      Premium Building Materials
                    </h3>
                    <p className="text-muted-foreground">
                      Supply of top-quality building materials including
                      plumbing, tiling, lighting, fixtures, and more.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-primary h-5 w-5 mt-1" />
                  <div>
                    <h3 className="font-bold text-grey-800">
                      Home Finishing Solutions
                    </h3>
                    <p className="text-muted-foreground">
                      Premium home finishing solutions that blend aesthetics and
                      functionality.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-primary h-5 w-5 mt-1" />
                  <div>
                    <h3 className="font-bold text-grey-800">
                      Professional Services
                    </h3>
                    <p className="text-muted-foreground">
                      Design consultations, project management, and construction
                      expertise.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-primary h-5 w-5 mt-1" />
                  <div>
                    <h3 className="font-bold text-grey-800">
                      Eco-Friendly Products
                    </h3>
                    <p className="text-muted-foreground">
                      Sustainable construction materials supporting responsible
                      practices and local suppliers.
                    </p>
                  </div>
                </li>
              </ul>
            </motion.div>

            <motion.div variants={fadeIn} className="grid grid-cols-2 gap-6">
              <div className="bg-primary/5 p-6 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4">
                  <Building className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-bold mb-2 text-grey-800">
                  Construction Materials
                </h3>
                <p className="text-sm text-muted-foreground">
                  Quality materials for every stage of your construction
                  project.
                </p>
              </div>

              <div className="bg-primary/5 p-6 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4">
                  <MessageSquare className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-bold mb-2 text-grey-800">
                  Expert Consultation
                </h3>
                <p className="text-sm text-muted-foreground">
                  Professional advice on material selection and project
                  planning.
                </p>
              </div>

              <div className="bg-primary/5 p-6 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4">
                  <Leaf className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-bold mb-2 text-grey-800">
                  Sustainable Options
                </h3>
                <p className="text-sm text-muted-foreground">
                  Eco-friendly materials for environmentally conscious projects.
                </p>
              </div>

              <div className="bg-primary/5 p-6 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4">
                  <BarChart3 className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-bold mb-2 text-grey-800">
                  Market Insights
                </h3>
                <p className="text-sm text-muted-foreground">
                  Stay updated with trends and competitive pricing information.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Delivery Policy Section */}
      <section id="delivery-policy" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <Badge className="mb-4">Delivery & Returns</Badge>
            <h2 className="text-3xl font-bold mb-6 text-grey-800">
              Delivery Policy
            </h2>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="bg-white p-8 rounded-xl border">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="delivery-process" className="border-b">
                  <AccordionTrigger className="text-xl font-bold text-grey-800 hover:no-underline">
                    How does delivery work at AYCEE Builder?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-2">
                    We partner with trusted logistics companies and independent drivers who specialise in the
                    delivery of construction materials. Once an order is confirmed, processing begins within 24
                    hours. We then schedule delivery based on your location, the type of product (e.g., tiles,
                    lighting), and handling requirements. You will receive updates via SMS, WhatsApp, and a call
                    from our delivery partner before arrival.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="delivery-times" className="border-b">
                  <AccordionTrigger className="text-xl font-bold text-grey-800 hover:no-underline">
                    Delivery Times
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-2">
                    <p className="mb-4">
                      Delivery times vary depending on your location and the product type:
                    </p>
                    <ul className="mb-4 list-disc list-inside space-y-1">
                      <li>Lagos, Abuja, Port Harcourt: 1–3 working days</li>
                      <li>Other urban areas: 2–5 working days</li>
                      <li>Remote/under-served areas: 3–7 working days</li>
                    </ul>
                    <p>
                      For custom orders, please note that delivery can take up to 14 days for urban areas and up to
                      21 days for remote areas.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="delivery-charges" className="border-b">
                  <AccordionTrigger className="text-xl font-bold text-grey-800 hover:no-underline">
                    Delivery Charges
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-2">
                    A flat, subsidised delivery rate is applied based on the product's weight and destination. Free
                    delivery may be available for select premium or bulk orders, which will be communicated at
                    checkout.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="unavailable-delivery" className="border-b">
                  <AccordionTrigger className="text-xl font-bold text-grey-800 hover:no-underline">
                    What if I am not available to receive my delivery?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-2">
                    We will attempt to contact you twice. You can reschedule the first attempt at no additional cost
                    or nominate an alternative person to receive the delivery on your behalf. A small fee may be
                    charged for re-delivery after a second failed attempt.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="installation" className="border-b">
                  <AccordionTrigger className="text-xl font-bold text-grey-800 hover:no-underline">
                    Installation and Assembly
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-2">
                    We understand that some products are heavy or fragile. Therefore, we offer optional installation
                    and assembly services through our network of artisan partners and technicians for an additional
                    fee.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="international-delivery" className="border-b">
                  <AccordionTrigger className="text-xl font-bold text-grey-800 hover:no-underline">
                    International Delivery
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-2">
                    Currently, we do not offer direct delivery outside Nigeria. However, our vendor partners in South
                    Africa, Egypt, and Ghana can assist with cross-border project needs.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="delivery-methods" className="border-b">
                  <AccordionTrigger className="text-xl font-bold text-grey-800 hover:no-underline">
                    Delivery Methods
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-2">
                    We utilise various delivery methods, including in-house dispatch riders, freight handlers,
                    third-party logistics companies like GIGM and Kwik Delivery, and independent drivers for remote
                    areas. We also prioritise eco-friendly delivery options, such as using reusable packaging and
                    supporting local courier companies.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="order-pickup" className="border-b">
                  <AccordionTrigger className="text-xl font-bold text-grey-800 hover:no-underline">
                    Order Pickup
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-2">
                    You may choose to pick up your order yourself from our Experience Centres in Lagos and
                    Abuja, or from our partner warehouses.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="damaged-products" className="border-b">
                  <AccordionTrigger className="text-xl font-bold text-grey-800 hover:no-underline">
                    Damaged or Incorrect Products
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-2">
                    If your product arrives damaged or incorrect, you must take clear photos and notify us within 48
                    hours of delivery. We will inspect the issue and, if a return is approved, will either replace the
                    item or offer a full refund if the item is out of stock.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="custom-orders" className="border-b">
                  <AccordionTrigger className="text-xl font-bold text-grey-800 hover:no-underline">
                    Custom Orders
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-2">
                    Please note that custom-made products, which are tailored to client specifications, are not
                    eligible for refunds. These items are produced for a specific customer and cannot be restocked
                    or resold.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="general-returns">
                  <AccordionTrigger className="text-xl font-bold text-grey-800 hover:no-underline">
                    General Returns
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-2">
                    We partner with trusted manufacturers and vendors who meet our standards and are certified by
                    the Standards Organisation of Nigeria (SON) and the International Standards Organisation
                    (ISO). If you are not satisfied with your purchase, please contact us for a possible return or
                    exchange.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>

            <div className="space-y-8 mt-[2rem]">
              <motion.div variants={fadeIn} className="bg-white p-8 rounded-xl border">
                <h3 className="text-xl font-bold mb-6 text-grey-800">
                  Delivery Summary
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-semibold text-grey-800">Item Type</th>
                        <th className="text-left py-2 font-semibold text-grey-800">Urban Areas</th>
                        <th className="text-left py-2 font-semibold text-grey-800">Remote Areas</th>
                        <th className="text-left py-2 font-semibold text-grey-800">Extra Services</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b">
                        <td className="py-2">Tiles, Lighting</td>
                        <td className="py-2">1–3 days</td>
                        <td className="py-2">5–7 days</td>
                        <td className="py-2">Installation on request</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Furniture</td>
                        <td className="py-2">3–7 days</td>
                        <td className="py-2">5–10 days</td>
                        <td className="py-2">Assembly available</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Plumbing/Wiring</td>
                        <td className="py-2">1–2 days</td>
                        <td className="py-2">3–5 days</td>
                        <td className="py-2">Site drop-off</td>
                      </tr>
                      <tr>
                        <td className="py-2">Custom Orders</td>
                        <td className="py-2">Up to 14 days</td>
                        <td className="py-2">Up to 21 days</td>
                        <td className="py-2">Dedicated support</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className="bg-white p-8 rounded-xl border">
                <h3 className="text-xl font-bold mb-4 text-grey-800">
                  3. Contact Us
                </h3>
                <p className="text-muted-foreground mb-4">
                  For any urgent delivery needs or support, you can contact us at:
                </p>
                <ul className="text-muted-foreground space-y-2">
                  <li>
                    <strong>Email:</strong> aycee10@ayceebuilder.com
                  </li>
                  <li>
                    <strong>Website:</strong> www.ayceebuilder.com
                  </li>
                  <li>
                    <strong>Phone:</strong> +234 703 952 0579
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section explore our */}
      <section className="py-16 mt-[4rem] md:py-24 bg-primary relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-2xl mx-auto text-center text-black/90"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join the Aycee Builder Journey
            </h2>
            <p className="text-[#004d40] mb-8 text-lg">
              Partner with us to revolutionize Africa&apos;s construction
              industry. Whether you&apos;re a supplier, contractor, or property
              developer, we&apos;d love to explore collaboration opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button className="w-full sm:w-auto bg-[#004d40] hover:bg-[#004d40]/90 text-white">
                  Explore Our Products
                </Button>
              </Link>
              {/* who we */}
              <a href={whatsappURL} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" className="w-full sm:w-auto">
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
                    Become a Partner
                  </span>
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/20" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
      </section>
    </div>
  );
};

export default About;

//team