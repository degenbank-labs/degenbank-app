"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import {
  UserIcon,
  WalletIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export function MainNavbar() {
  const {
    user,
    loading,
    walletAddress,
    userName,
    userImage,
    logout,
    login,
    authenticated,
  } = useAuth();

  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const navItems = [
    { name: "Overview", href: "/overview" },
    { name: "Vaults", href: "/vaults/strategy-vaults" },
    { name: "Battle", href: "/battle" },
    { name: "Leaderboard", href: "/leaderboard" },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/overview") {
      return pathname.startsWith("/overview");
    }
    if (href === "/vaults/strategy-vaults") {
      return pathname.startsWith("/vaults");
    }
    if (href === "/battle") {
      return pathname.startsWith("/battle");
    }
    return pathname === href;
  };

  return (
    <nav className="border-border sticky top-0 z-50 border-b bg-black">
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Navigation - Left side */}
          <div className="flex items-center space-x-8">
            {/* Logo - Always redirects to landing page */}
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/logo/degenbank-logo.png"
                alt="Degen Bank"
                width={120}
                height={37}
                className="h-8 w-auto"
                priority
              />
              <p className="font-cirka ml-2 text-xl font-bold text-white md:text-2xl">
                DEGEN BANK
              </p>
            </Link>

            {/* Desktop Navigation - Moved to left side */}
            <div className="hidden items-center space-x-6 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`hover:text-primary text-sm font-medium transition-colors ${
                    isActiveLink(item.href) ? "text-primary" : "text-white/80"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Profile Section - Updated to rectangular shape */}
          <div className="flex items-center space-x-4">
            {authenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 cursor-pointer border border-white/20 bg-white/5 px-3 py-2 transition-all duration-200 hover:bg-white/10"
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={userImage || ""}
                          alt={userName || "User"}
                        />
                        <AvatarFallback className="bg-primary text-xs text-black">
                          {userName ? (
                            getInitials(userName)
                          ) : (
                            <UserIcon className="h-3 w-3" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      {walletAddress && (
                        <span className="text-sm font-medium text-white/90">
                          {formatAddress(walletAddress)}
                        </span>
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-none"
                  align="end"
                  forceMount
                >
                  <DropdownMenuItem asChild className="rounded-none">
                    <Link
                      href="/overview"
                      className="flex cursor-pointer items-center"
                    >
                      <UserIcon className="mr-2 h-4 w-4 hover:text-black" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {walletAddress && (
                    <DropdownMenuItem
                      onClick={() => handleCopyAddress(walletAddress)}
                      className="cursor-pointer rounded-none"
                    >
                      <WalletIcon className="mr-2 h-4 w-4 hover:text-black" />
                      <span>Copy Address</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer rounded-none"
                  >
                    <ArrowRightOnRectangleIcon className="text-loss mr-2 h-4 w-4 hover:text-black" />
                    <span className="text-loss hover:text-black">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={login}
                disabled={loading}
                className="bg-primary hover:bg-primary/90 cursor-pointer text-black"
              >
                {loading ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              className="h-10 w-10 cursor-pointer p-0 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6 text-white" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-white" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Overlay style */}
        {mobileMenuOpen && (
          <div className="absolute top-full right-0 left-0 z-50 border-t border-white/10 bg-black/95 backdrop-blur-sm md:hidden">
            <div className="flex flex-col space-y-2 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`cursor-pointer px-3 py-3 text-base font-medium transition-colors hover:bg-white/10 hover:text-white ${
                    isActiveLink(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-white/90"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
