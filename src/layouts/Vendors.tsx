"use client";
import React, { useState, useEffect } from "react";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Link from "next/link";
import { whatsappNumber } from "@/lib/utils";

// Mock vendors data
const vendors = [
  {
    id: "v1",
    name: "AceCement Nigeria Ltd",
    logo: "https://images.unsplash.com/photo-1521791055366-0d553872125f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGxvZ298ZW58MHx8MHx8fDA%3D",
    location: "Lagos, Nigeria",
    rating: 4.8,
    reviewCount: 124,
    description:
      "Leading supplier of high-quality cement and concrete products for all construction needs.",
    verified: true,
    yearsActive: 12,
    productCount: 48,
  },
  {
    id: "v2",
    name: "SteelMasters International",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGxvZ298ZW58MHx8MHx8fDA%3D",
    location: "Abuja, Nigeria",
    rating: 4.6,
    reviewCount: 98,
    description:
      "Premier provider of structural steel and metal products for construction projects of all sizes.",
    verified: true,
    yearsActive: 8,
    productCount: 36,
  },
  {
    id: "v3",
    name: "TileWorld Nigeria",
    logo: "https://images.unsplash.com/photo-1622632169740-85c306c57aa2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGxvZ298ZW58MHx8MHx8fDA%3D",
    location: "Port Harcourt, Nigeria",
    rating: 4.7,
    reviewCount: 76,
    description:
      "Extensive collection of premium ceramic and porcelain tiles for flooring and wall applications.",
    verified: true,
    yearsActive: 5,
    productCount: 120,
  },
  {
    id: "v4",
    name: "ElectroWorks Nigeria",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGxvZ298ZW58MHx8MHx8fDA%3D",
    location: "Kano, Nigeria",
    rating: 4.5,
    reviewCount: 62,
    description:
      "Complete range of electrical products and solutions for residential and commercial construction.",
    verified: true,
    yearsActive: 7,
    productCount: 85,
  },
  {
    id: "v5",
    name: "LumberKing Enterprises",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGxvZ298ZW58MHx8MHx8fDA%3D",
    location: "Enugu, Nigeria",
    rating: 4.4,
    reviewCount: 53,
    description:
      "Quality timber, plywood, and wood products sourced sustainably for construction projects.",
    verified: false,
    yearsActive: 4,
    productCount: 42,
  },
  {
    id: "v6",
    name: "NigeriaGlass & Aluminium",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGxvZ298ZW58MHx8MHx8fDA%3D",
    location: "Lagos, Nigeria",
    rating: 4.9,
    reviewCount: 87,
    description:
      "Specialized in glass products, windows, doors, and aluminum framing for modern construction.",
    verified: true,
    yearsActive: 9,
    productCount: 64,
  },
];

const Vendors = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [filteredVendors, setFilteredVendors] = useState(vendors);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  useEffect(() => {
    let results = [...vendors];

    if (searchQuery) {
      results = results.filter(
        (vendor) =>
          vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vendor.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (locationFilter) {
      results = results.filter((vendor) =>
        vendor.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setFilteredVendors(results);
  }, [searchQuery, locationFilter]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  const whatsappMessage =
    "Hello, I'm interested in becoming a vendor on Ayceebuilder.";
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-grow pt-20">
        <div className="bg-secondary/5 py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">Our Vendors</h1>
            <p className="text-muted-foreground mb-6">
              Browse our verified suppliers of quality construction materials
            </p>

            <form onSubmit={handleSearch} className="max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <Input
                  placeholder="Search vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
                <Input
                  placeholder="Filter by location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full"
                />
                <Button type="submit" className="w-full">
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          {filteredVendors.length > 0 ? (
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-500 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
            >
              {filteredVendors.map((vendor, index) => (
                <Link
                  key={vendor.id}
                  href={`/vendors/${vendor.id}`}
                  className="block border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  style={{
                    animationDelay: `${0.05 * index}s`,
                    animation: isLoaded ? "fadeIn 0.5s ease forwards" : "none",
                  }}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-secondary/20 flex-shrink-0">
                        <img
                          src={vendor.logo}
                          alt={vendor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{vendor.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin size={14} className="mr-1" />
                          {vendor.location}
                        </div>
                        {vendor.verified && (
                          <span className="inline-flex items-center text-xs bg-green-100 text-green-800 rounded-full px-2 py-0.5 mt-1">
                            Verified Vendor
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {vendor.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="font-medium">
                          {vendor.productCount}
                        </span>
                        <span className="text-muted-foreground ml-1">
                          Products
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">
                          {vendor.yearsActive} years
                        </span>
                        <span className="text-muted-foreground ml-1">
                          on Ayceebuilder
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Star
                          size={14}
                          className="fill-yellow-400 text-yellow-400 mr-1"
                        />
                        <span className="font-medium">{vendor.rating}</span>
                        <span className="text-muted-foreground ml-1">
                          ({vendor.reviewCount})
                        </span>
                      </div>
                    </div>

                    {/* <Button variant="outline" className="w-full mt-4">
                      View Vendor Profile{" "}
                      <ExternalLink size={14} className="ml-1" />
                    </Button> */}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No vendors found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or location filter
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setLocationFilter("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          <div className="mt-10 bg-secondary/5 rounded-xl p-6">
            <h3 className="text-lg font-medium mb-2">Are you a vendor?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Join Ayceebuilder as a verified vendor and start selling your
              construction materials to thousands of customers.
            </p>
            <a href={whatsappURL} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full">
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
                  Become a Vendor <ArrowRight size={16} className="ml-2" />
                </span>
              </Button>
            </a>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Vendors;
