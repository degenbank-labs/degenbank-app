"use client";

import { Navbar, Hero, Footer } from "@/components/landing";

export function LandingPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
}
