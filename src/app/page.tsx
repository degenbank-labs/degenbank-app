"use client";

import { useAuth } from "@/hooks/useAuth";
import { LandingPage } from "@/components/landing-page";
import { Dashboard } from "@/components/dashboard";

export default function Home() {
  const { ready, authenticated } = useAuth();

  // Show loading state while Privy is initializing
  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show dashboard if authenticated, otherwise show landing page
  return authenticated ? <Dashboard /> : <LandingPage />;
}
