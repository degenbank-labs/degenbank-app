"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-start justify-evenly">
          {/* Brand */}
          <div className="flex-1">
            <div className="mb-4 flex items-center">
              <Image
                src="/assets/logo/degenbank-logo.png"
                alt="Degen Bank"
                width={160}
                height={36}
                className="h-8 w-auto"
                priority
              />
            </div>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-white/70">
              Where yield competes and glory compounds. The ultimate arena for
              DeFi vault managers and yield farmers.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 bg-transparent text-white/80 hover:bg-white/10 hover:text-white"
              >
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 bg-transparent text-white/80 hover:bg-white/10 hover:text-white"
              >
                Discord
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-white/60">
            © 2024 Degen Bank. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            <a
              href="#privacy"
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
