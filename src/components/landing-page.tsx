"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRightIcon, WalletIcon, UserIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export function LandingPage() {
  const { login, ready } = useAuth();

  const features = [
    {
      icon: <UserIcon className="h-8 w-8" />,
      title: "Google Authentication",
      description: "Secure login with your Google account for quick access.",
    },
    {
      icon: <WalletIcon className="h-8 w-8" />,
      title: "Solana Wallet",
      description: "Connect your Solana wallet or create an embedded wallet.",
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-black">Hackathon Mode</h1>
            <Button
              onClick={login}
              disabled={!ready}
              className="bg-black text-white hover:bg-gray-800"
            >
              Get Started
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-black mb-6">
            Build Fast, Ship Faster
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A modern hackathon template with authentication, wallet integration, 
            and everything you need to build your next big idea.
          </p>
          <Button
            onClick={login}
            disabled={!ready}
            size="lg"
            className="bg-black text-white hover:bg-gray-800 text-lg px-8 py-3"
          >
            Start Building Now
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-black mb-4">
              Everything You Need
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pre-configured with the best tools and practices for rapid development.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-gray-100 rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-black">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-black mb-6">
            Ready to Start Your Project?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Join thousands of developers who are building the future with our template.
          </p>
          <Button
            onClick={login}
            disabled={!ready}
            size="lg"
            className="bg-black text-white hover:bg-gray-800 text-lg px-8 py-3"
          >
            Get Started for Free
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            © 2024 Hackathon Mode. Built with Next.js, Privy.io, and Solana.
          </p>
        </div>
      </footer>
    </div>
  );
}