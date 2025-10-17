"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export function Navbar() {
  const { login, ready } = useAuth();

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-white/10">
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
          </div>

          <div className="flex items-center gap-12">
            {/* Navigation Menu - Centered */}
            <div className="hidden flex-1 items-center justify-center md:flex">
              <div className="flex items-center space-x-12 rounded-full border border-white/10 bg-white/5 px-12 py-4 backdrop-blur-sm">
                <a
                  href="#home"
                  className="text-base font-medium tracking-wide text-white/90 transition-all duration-300 hover:scale-105 hover:text-white"
                >
                  How It Works
                </a>
                <a
                  href="#about"
                  className="text-base font-medium tracking-wide text-white/90 transition-all duration-300 hover:scale-105 hover:text-white"
                >
                  Vault
                </a>
                <a
                  href="#contact"
                  className="text-base font-medium tracking-wide text-white/90 transition-all duration-300 hover:scale-105 hover:text-white"
                >
                  Whitepaper
                </a>
              </div>
            </div>

            {/* Login Button */}
            <div className="flex items-center">
              <Button
                onClick={login}
                disabled={!ready}
                className="bg-primary hover:bg-primary hover:shadow-primary/50 cursor-pointer rounded-full border border-white/20 px-12 py-6 text-base font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                Login
                <ArrowRightIcon className="ml-2 h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="mt-4 border-t border-white/10 pt-4 md:hidden">
          <div className="flex flex-col space-y-3">
            <a
              href="#home"
              className="py-2 text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              Home
            </a>
            <a
              href="#about"
              className="py-2 text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              About
            </a>
            <a
              href="#contact"
              className="py-2 text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
