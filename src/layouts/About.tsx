"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Building,
  Users,
  Heart,
  LightbulbIcon,
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
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <div className="rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/about-image.webp"
                  alt="Aycee Builder Team"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop";
                  }}
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

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <Badge className="mb-4">Meet Our Team</Badge>
            <h2 className="text-3xl font-bold mb-6 text-grey-800">
              The People Behind Aycee Builder
            </h2>
            <p className="text-lg text-muted-foreground">
              Our diverse team of experts is committed to transforming
              Africa&apos;s construction industry through innovation, quality,
              and excellence.
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
              variants={fadeIn}
              className="bg-white p-6 rounded-xl border hover-lift subtle-shadow text-center"
            >
              <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                <Image
                  src="/team-member-1.webp"
                  alt="Team Member - CEO"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://randomuser.me/api/portraits/men/32.jpg";
                  }}
                />
              </div>
              <h3 className="text-xl font-bold mb-1 text-grey-800">
                Ayo Christopher
              </h3>
              <p className="text-primary font-medium mb-3">Founder & CEO</p>
              <p className="text-muted-foreground text-sm mb-4">
                Visionary leader with extensive experience in construction and
                business development.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white p-6 rounded-xl border hover-lift subtle-shadow text-center"
            >
              <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                <Image
                  src="/team-member-2.webp"
                  alt="Team Member - COO"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://randomuser.me/api/portraits/women/44.jpg";
                  }}
                />
              </div>
              <h3 className="text-xl font-bold mb-1 text-grey-800">
                Sarah Johnson
              </h3>
              <p className="text-primary font-medium mb-3">
                Chief Operations Officer
              </p>
              <p className="text-muted-foreground text-sm mb-4">
                Operational expert with a track record of streamlining processes
                and enhancing efficiency.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white p-6 rounded-xl border hover-lift subtle-shadow text-center"
            >
              <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                <Image
                  src="/team-member-3.webp"
                  alt="Team Member - CTO"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://randomuser.me/api/portraits/men/67.jpg";
                  }}
                />
              </div>
              <h3 className="text-xl font-bold mb-1 text-grey-800">
                Daniel Okonkwo
              </h3>
              <p className="text-primary font-medium mb-3">
                Chief Technology Officer
              </p>
              <p className="text-muted-foreground text-sm mb-4">
                Tech innovator dedicated to leveraging digital solutions for
                construction excellence.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary relative overflow-hidden">
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
                <Button className="w-full sm:w-auto bg-[#004d40] hover:bg-[#004d40]/90">
                  Explore Our Products
                </Button>
              </Link>
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
