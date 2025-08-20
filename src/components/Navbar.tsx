"use client";
import React, { useState, useEffect } from "react";
import {
  Menu,
  Search,
  ShoppingCart,
  Heart,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { categories } from "@/data/products";
import { User, LogOut } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const pathname = usePathname();
  const { getItemCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, userProfile, logout, loading } = useAuth();
  const { settings } = useSettings();
  const router = useRouter();

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

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/products?category=${categoryId}&page=1&limit=12`);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", path: "/" },

    { name: "Products", path: "/products" },
    { name: "Blog", path: "/blog" },

    { name: "Building Quotation", path: "/building-quotation" },
    { name: "Tradesmen", path: "/tradesmen" },
    { name: "Vendors", path: "/vendors" },

    { name: "About", path: "/about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-white shadow-md py-2"
        : "bg-white/80 backdrop-blur-md py-3"
        }`}
    >
      <div className="max-w-7xl mx-auto w-full px-4 ">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {/* <span className="text-xl font-bold text-primary">Ayceebuilder</span> */}
            <img
              width={1383}
              height={196}
              src="/aycee-logo.png"
              alt={`${settings?.siteName || 'Ayceebuilder'} logo`}
              className="h-[2rem] w-fit max-w-[10rem] lg:flex hidden"
              loading="lazy"
            />
            <img
              width={206}
              height={196}
              src="/aycee-icon.png"
              alt={`${settings?.siteName || 'Ayceebuilder'} icon`}
              className="h-[2rem] w-fit lg:hidden flex"
              loading="lazy"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === link.path
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
            {!loading && (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground"
                    >
                      <User size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-3 py-2 border-b">
                      <p className="text-sm font-medium">{userProfile?.name || user.displayName || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link href="/dashboard" className="block px-3 py-2 text-sm hover:bg-gray-50">
                        Dashboard
                      </Link>
                      <Link href="/dashboard/orders" className="block px-3 py-2 text-sm hover:bg-gray-50">
                        Order History
                      </Link>
                      <Link href="/dashboard/profile" className="block px-3 py-2 text-sm hover:bg-gray-50">
                        Profile Settings
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={logout}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )
            )}

            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-muted-foreground "
                  aria-label="Open mobile menu"
                >
                  <Menu size={20} />
                </Button>
              </SheetTrigger>{" "}
              <SheetContent
                side="left"
                className="w-[300px] sm:w-[350px] overflow-hidden flex flex-col p-0"
              >
                <div className="flex flex-col h-full max-h-full">
                  <div className="flex items-center justify-between py-4 border-b px-6 flex-shrink-0">
                    <span className="text-xl font-bold text-primary">
                      Ayceebuilder
                    </span>
                  </div>
                  <nav className="flex flex-col py-4 space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        href={link.path}
                        className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${pathname === link.path
                          ? "bg-secondary/10 text-primary"
                          : "hover:bg-secondary/5"
                          }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                    <button
                      onClick={() =>
                        setShowMobileCategories(!showMobileCategories)
                      }
                      className="flex items-center justify-between px-4 py-3 rounded-md text-sm font-medium transition-colors hover:bg-secondary/5"
                    >
                      Categories
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${showMobileCategories ? "rotate-180" : ""
                          }`}
                      />
                    </button>{" "}
                    {showMobileCategories && (
                      <div className="pl-4 space-y-1 max-h-[40vh] overflow-y-auto overscroll-contain pr-2 pb-1">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            className="flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors hover:bg-secondary/5 w-full text-left"
                          >
                            <ChevronRight
                              size={18}
                              className="mr-2 flex-shrink-0"
                            />
                            <span className="line-clamp-2">
                              {category.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
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
