import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

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
                  to={`/vendors/${vendor.id}`}
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

                    <Button variant="outline" className="w-full mt-4">
                      View Vendor Profile{" "}
                      <ExternalLink size={14} className="ml-1" />
                    </Button>
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

          <div className="mt-12 bg-secondary/30 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Are you a supplier?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Join Ayceebuilder as a verified vendor and reach thousands of
              customers looking for quality construction materials.
            </p>
            <Button size="lg">Become a Vendor</Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Vendors;
