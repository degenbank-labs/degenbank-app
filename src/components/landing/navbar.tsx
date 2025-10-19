"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRightIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";

export function Navbar() {
  const { login, ready } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false); // Close mobile menu after clicking
  };

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/assets/logo/degenbank-logo.png"
              alt="Degen Bank"
              width={180}
              height={56}
              className="h-12 w-auto"
              priority
            />
            <p className="font-cirka ml-2 text-2xl md:text-4xl font-bold text-white">
              DEGEN BANK
            </p>
          </div>

          <div className="flex items-center gap-4 md:gap-12">
            {/* Navigation Menu - Desktop */}
            <div className="hidden flex-1 items-center justify-center md:flex">
              <div className="flex items-center space-x-12 border border-white/10 bg-white/5 px-10 py-3 backdrop-blur-sm rounded-lg">
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-sm font-medium tracking-wide text-white/90 transition-all duration-300 hover:scale-105 hover:text-white cursor-pointer"
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollToSection('vault')}
                  className="text-sm font-medium tracking-wide text-white/90 transition-all duration-300 hover:scale-105 hover:text-white cursor-pointer"
                >
                  Vault
                </button>
                <button
                  onClick={() => handleExternalLink('#')}
                  className="text-sm font-medium tracking-wide text-white/90 transition-all duration-300 hover:scale-105 hover:text-white cursor-pointer"
                >
                  Whitepaper
                </button>
              </div>
            </div>

            {/* Login Button - Desktop */}
            <div className="hidden md:flex items-center">
              <Button
                onClick={login}
                disabled={!ready}
                className="bg-primary hover:bg-primary/90 hover:shadow-primary/50 cursor-pointer border border-white/20 px-8 py-3 text-base font-medium text-black transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                Login
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-white hover:text-primary transition-colors duration-200 p-2"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100 mt-4 border-t border-white/10 pt-4' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="flex flex-col space-y-4 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="py-3 text-left text-base font-medium text-white/90 transition-colors hover:text-white hover:bg-white/10 rounded-md px-3"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('vault')}
              className="py-3 text-left text-base font-medium text-white/90 transition-colors hover:text-white hover:bg-white/10 rounded-md px-3"
            >
              Vault
            </button>
            <button
              onClick={() => handleExternalLink('#')}
              className="py-3 text-left text-base font-medium text-white/90 transition-colors hover:text-white hover:bg-white/10 rounded-md px-3"
            >
              Whitepaper
            </button>
            
            {/* Mobile Login Button */}
            <div className="pt-2 border-t border-white/10">
              <Button
                onClick={login}
                disabled={!ready}
                className="w-full bg-primary hover:bg-primary/90 hover:shadow-primary/50 cursor-pointer border border-white/20 px-6 py-3 text-base font-medium text-black transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                Login
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
