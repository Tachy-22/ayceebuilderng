import React from "react";
//import { cn } from "@/lib/utils";
import { Instagram, Twitter, Facebook, Globe, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const footerLinks = [
  {
    title: "Shop",
    links: [
      { name: "All Products", href: "/products" },
      { name: "Categories", href: "/categories" },
      { name: "Vendors", href: "/vendors" },
    ],
  },
  // {
  //   title: "Company",
  //   links: [
  //     { name: "About Us", href: "/about" },
  //     { name: "Careers", href: "/careers" },
  //     { name: "Blog", href: "/blog" },
  //     { name: "Press", href: "/press" },
  //     { name: "Partners", href: "/partners" },
  //   ],
  // },
  // {
  //   title: "Support",
  //   links: [
  //     { name: "Contact Us", href: "/#" },
  //     // { name: "FAQ", href: "/faq" },
  //     // { name: "Returns", href: "/returns" },
  //     // { name: "Order Status", href: "/orders" },
  //     // { name: "Payment Methods", href: "/payment" },
  //   ],
  // },
  {
    title: "Legal",
    links: [
      { name: "Terms of Service", href: "#" },
      { name: "Privacy Policy", href: "#" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-secondary mt-16">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand and newsletter */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              {/* <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                Ayceebuilder
              </h2> */}
              <img
                src="aycee-logo.png"
                alt="Ayceebuilder"
                className="h-[2rem]"
              />
            </Link>
            <p className="text-white/60 mb-6 max-w-md">
              Your one-stop shop for all construction materials. Quality
              products at competitive prices.
            </p>
            <h3 className="font-medium mb-3">Subscribe to our newsletter</h3>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="max-w-xs"
              />
              <Button>Subscribe</Button>
            </div>
            <div className="flex space-x-4 mt-8">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10 text-white"
              >
                <Instagram size={20} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10 text-white"
              >
                <Twitter size={20} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10 text-white"
              >
                <Facebook size={20} />
              </Button>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="font-medium mb-4 text-white">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-4 md:mb-0">
              <div className="flex items-center">
                <Globe size={16} className="mr-2 text-white/50" />
                <span className="text-sm text-white/50">Nigeria (English)</span>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-2 text-white/50" />
                <span className="text-sm text-white/50">
                  support@ayceebuilder.ng
                </span>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-2 text-white/50" />
                <span className="text-sm text-white/50">
                  +234 (0) 123 456 7890
                </span>
              </div>
            </div>
            <p className="text-sm text-white/50">
              © {new Date().getFullYear()} Ayceebuilder Nigeria. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
