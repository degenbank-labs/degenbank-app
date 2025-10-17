"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowRightIcon,
  TrophyIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import PixelBlast from "./pixel-blast";

export function Hero() {
  const { login, ready } = useAuth();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* PixelBlast Background */}
      <div className="absolute inset-0 z-0">
        <PixelBlast
          variant="square"
          pixelSize={4}
          patternScale={3}
          patternDensity={0.8}
          enableRipples={true}
          rippleIntensityScale={2}
          rippleSpeed={0.4}
          speed={0.3}
          edgeFade={0.3}
          className="h-full w-full"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="from-background/20 via-background/60 to-background/90 absolute inset-0 z-10 bg-gradient-to-b" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center">
        <div className="mx-auto max-w-5xl">
          {/* Main Heading */}
          <h1 className="mb-6 text-5xl leading-tight font-bold tracking-tight text-white md:text-7xl lg:text-8xl">
            DeFi Vault Competition
            <br />
            <span className="from-primary via-primary to-accent bg-gradient-to-r bg-clip-text text-transparent">
              For Yield Farmers
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-white/80 md:text-xl">
            Highly competitive yield farming platform that makes
            <br />
            your DeFi strategies truly stand out
          </p>

          {/* CTA Button */}
          <div className="mb-16">
            <Button
              onClick={login}
              disabled={!ready}
              className="bg-primary hover:bg-primary hover:shadow-primary/50 cursor-pointer rounded-full border border-white/20 px-12 py-6 text-base font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              Enter the Arena
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 transform">
        <div className="animate-bounce">
          <div className="border-primary flex h-10 w-6 justify-center rounded-full border-2">
            <div className="bg-primary mt-2 h-3 w-1 animate-pulse rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
