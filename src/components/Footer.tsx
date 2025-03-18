"use client";

import React from "react";
//import { cn } from "@/lib/utils";
import { Instagram, Twitter, Facebook, Globe, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";

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
  // // },
  // {
  //   title: "Legal",
  //   links: [
  //     { name: "Terms of Service", href: "#" },
  //     { name: "Privacy Policy", href: "#" },
  //   ],
  // },
];

const Footer = () => {
  return (
    <footer className="bg-secondary mt-16">
      <div className="max-w-7xl w-full mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand and newsletter */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              aria-label="Go to Ayceebuilder homepage"
              className="inline-block mb-4 w-full"
            >
              {/* <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                Ayceebuilder
              </h2> */}
              <Image
                width={1383}
                height={196}
                src="/aycee-logo.png"
                alt="Ayceebuilder logo"
                className="h-[2rem] w-fit flex "
                priority
              />
            </Link>
            <p className="text-white/60 mb-6 max-w-md">
              Your one-stop shop for all construction materials. Quality
              products at competitive prices.
            </p>
            <h3 className="font-medium mb-3 text-white/50">Subscribe to our newsletter</h3>
            <div className="flex gap-2">
              <Input
                type="email"
                aria-label="Enter your email address"
                placeholder="Your email address"
                className="max-w-xs"
              />
              <Button aria-label="Subscribe to our newsletter" name="subscribe">
                Subscribe
              </Button>
            </div>
            <div className="flex space-x-4 mt-8">
              <a
                href="https://www.instagram.com/aycee_builder"
                aria-label="Visit our Instagram"
                className=""
                target="_blank"
              >
                {" "}
                <Button
                  aria-label="Visit our Instagram"
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10 text-white"
                >
                  <Instagram size={20} />
                </Button>
              </a>

              <a
                href="#"
                aria-label="Visit our Twitter"
                className=""
                target="_blank"
              >
                {" "}
                <Button
                  aria-label="Visit our Twitter"
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10 text-white"
                >
                  <Twitter size={20} />
                </Button>
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=100083060214875"
                aria-label="Visit our Facebook"
                className=""
                target="_blank"
              >
                {" "}
                <Button
                  aria-label="Visit our Facebook"
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10 text-white"
                >
                  <Facebook size={20} />
                </Button>
              </a>
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
                      aria-label={`Go to ${link.name}`}
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
                <a
                  href="mailto:ayceemarket505@gmail.com"
                  className="text-sm text-white/50 hover:underline"
                >
                  ayceemarket505@gmail.com
                </a>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-2 text-white/50" />
                <span className="text-sm text-white/50">
                  +234 (0) 703 952 0579
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
