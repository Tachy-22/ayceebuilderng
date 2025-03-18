"use client";
import React, { useState, useEffect } from "react";
import {
  Menu,
  Search,
  ShoppingCart,
  Heart,
  User,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  // DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { getItemCount } = useCart();
  const { wishlistItems } = useWishlist();

  const cartItemCount = getItemCount();
  const wishlistItemCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const navLinks = [
    { name: "Products", path: "/products" },
    { name: "Categories", path: "/categories" },
    { name: "Vendors", path: "/vendors" },
    // { name: "Deals", path: "/deals" },
    // { name: "Delivery Estimator", path: "/delivery-estimator" },
    { name: "Building Quotation", path: "/building-quotation" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md py-2"
          : "bg-white/80 backdrop-blur-md py-3"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {/* <span className="text-xl font-bold text-primary">Ayceebuilder</span> */}
            <Image
              width={1383}
              height={196}
              src="/aycee-logo.png"
              alt="Ayceebuilder logo"
              className="h-[2rem] lg:flex hidden"
              loading="lazy"
            />
            <Image
              width={206}
              height={196}
              src="/aycee-icon.png"
              alt="Ayceebuilder icon"
              className="h-[2rem] lg:hidden flex"
              loading="lazy"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.path
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search, Cart, Wishlist, Account */}
          <div className="flex items-center space-x-1">
            {/* Search Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground"
                  aria-label="Search"
                >
                  <Search size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px] p-3">
                <form
                  onSubmit={handleSearch}
                  role="search"
                  className="flex space-x-2"
                >
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="sm">
                    Search
                  </Button>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {wishlistItemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                  >
                    {wishlistItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground"
                aria-label="View cart"
              >
                <ShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Account */}
            {/* <Link href="/auth">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
              >
                <User size={20} />
              </Button>
            </Link> */}

            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-muted-foreground"
                  aria-label="Open mobile menu"
                >
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-4 border-b">
                    <span className="text-xl font-bold text-primary">
                      Ayceebuilder
                    </span>
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <X size={18} />
                    </Button> */}
                  </div>
                  <nav className="flex flex-col py-4 space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        href={link.path}
                        className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                          pathname === link.path
                            ? "bg-secondary/10 text-primary"
                            : "hover:bg-secondary/5"
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </nav>
                  {/* <div className="mt-auto py-4 border-t">
                    <Link
                      href="/auth"
                      className="flex items-center px-4 py-3 rounded-md text-sm font-medium hover:bg-secondary/50"
                    >
                      <User size={18} className="mr-2" />
                      Account
                    </Link>
                  </div> */}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
