"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MainNavbar } from "@/components/main-navbar";
import LightRays from "@/components/ui/light-rays";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  TrophyIcon,
  ChartBarIcon,
  ClockIcon,
  UsersIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

// Mock data for demonstration - Updated to match project.md
const mockVaults = [
  {
    id: 1,
    name: "Solana DCA",
    manager: "0x1234...5678",
    strategy: "DCA Strategy",
    tvl: 125000,
    apy: 12.5,
    performance: 15.2,
    risk: "Medium",
    status: "active",
    participants: 45,
    color: "#6fb7a5",
  },
  {
    id: 2,
    name: "BONK DCA",
    manager: "0x9876...5432",
    strategy: "DCA Strategy",
    tvl: 89000,
    apy: 24.8,
    performance: 12.8,
    risk: "High",
    status: "active",
    participants: 32,
    color: "#FB605C",
  },
  {
    id: 3,
    name: "Raydium DCA",
    manager: "0xabcd...efgh",
    strategy: "DCA Strategy",
    tvl: 67000,
    apy: 18.2,
    performance: 9.5,
    risk: "Medium",
    status: "active",
    participants: 28,
    color: "#FFB800",
  },
];

const battlePhases = [
  { name: "Stake Phase", status: "completed", duration: "3 days" },
  { name: "Lock Phase", status: "completed", duration: "1 day" },
  { name: "Battle Phase", status: "active", duration: "12 days remaining" },
  { name: "Resolution", status: "pending", duration: "1 day" },
];

export default function BattleDetailPage() {
  const params = useParams();
  const battleId = params.id;
  
  const [timeRemaining, setTimeRemaining] = useState("12d 14h 32m");
  const [selectedVault, setSelectedVault] = useState<number | null>(null);

  // Sort vaults by performance for leaderboard
  const sortedVaults = [...mockVaults].sort(
    (a, b) => b.performance - a.performance
  );

  useEffect(() => {
    // Simulate countdown timer
    const interval = setInterval(() => {
      // This would be real countdown logic
      setTimeRemaining("12d 14h 31m");
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-green-400";
      case "Medium":
        return "text-blue-400";
      case "High":
        return "text-orange-400";
      case "Extreme":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <ShieldCheckIcon className="h-4 w-4 text-green-400" />;
      case "warning":
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-400" />;
      default:
        return <ShieldCheckIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <MainNavbar />

      <div className="relative overflow-hidden">
        {/* Background Light Rays */}
        <div className="absolute inset-0 z-0">
          <LightRays
            raysOrigin="top-center"
            raysColor="#6fb7a5"
            raysSpeed={1.2}
            lightSpread={0.4}
            rayLength={4.0}
            pulsating={true}
            fadeDistance={1.5}
            followMouse={false}
            mouseInfluence={0.0}
            noiseAmount={0.008}
            distortion={0.005}
            className="opacity-60"
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          {/* Header Section */}
          <div className="container mx-auto px-4 pt-8 pb-6">
            <div className="mb-8 text-center">
              <h1 className="font-cirka mb-6 text-4xl font-bold md:text-6xl lg:text-7xl">
                <span className="text-white">Battle Arena </span>
                <span className="from-primary via-primary to-accent bg-gradient-to-r bg-clip-text text-transparent">
                  #{battleId}
                </span>
              </h1>

              <p className="mx-auto mb-6 max-w-3xl font-sans text-lg text-white/80 md:text-xl">
                <span className="text-primary font-semibold">Vault managers compete with strategy.</span>
                <br />
                <span className="text-white/80">Users stake with conviction.</span>
                <br />
                <span className="text-primary font-semibold">
                  The best vault wins it all.
                </span>
              </p>

              {/* Battle Status */}
              <div className="mb-6 flex flex-wrap items-center justify-center gap-4">
                <Badge
                  variant="outline"
                  className="border-primary text-primary px-4 py-2"
                >
                  DCA Arena - Phase #1
                </Badge>
                <Badge
                  variant="outline"
                  className="border-blue-400 px-4 py-2 text-blue-400"
                >
                  <ClockIcon className="mr-2 h-4 w-4" />
                  {timeRemaining}
                </Badge>
              </div>
            </div>

            {/* Battle Phases Progress */}
            <div className="mx-auto mb-12 max-w-4xl">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {battlePhases.map((phase, index) => (
                  <div key={phase.name} className="text-center">
                    <div
                      className={`mb-2 h-2 w-full ${
                        phase.status === "completed"
                          ? "bg-primary"
                          : phase.status === "active"
                            ? "from-primary bg-gradient-to-r to-blue-400"
                            : "bg-gray-700"
                      }`}
                    />
                    <h3
                      className={`text-sm font-semibold ${
                        phase.status === "active"
                          ? "text-primary"
                          : "text-white/60"
                      }`}
                    >
                      {phase.name}
                    </h3>
                    <p className="text-xs text-white/40">{phase.duration}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Battle Arena */}
          <div className="container mx-auto px-4 pb-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left Column - Vault Leaderboard */}
              <div className="space-y-6 lg:col-span-2">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-cirka flex items-center text-2xl font-bold text-white md:text-3xl">
                    <TrophyIcon className="text-primary mr-3 h-8 w-8" />
                    <span className="text-white">Battle Leaderboard</span>
                  </h2>
                  <Badge
                    variant="outline"
                    className="border-primary text-primary"
                  >
                    Live Performance
                  </Badge>
                </div>

                {/* Vault Cards */}
                <div className="space-y-4">
                  {sortedVaults.map((vault, index) => (
                    <Card
                      key={vault.id}
                      className={`bg-card/50 border-border/50 backdrop-blur-sm transition-all duration-300 hover:bg-card/70 ${
                        selectedVault === vault.id
                          ? "border-primary ring-primary/30 ring-2 shadow-lg shadow-primary/20"
                          : "border-border/50"
                      }`}
                      onClick={() => setSelectedVault(vault.id)}
                    >
                      <CardContent className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <div
                                className="flex h-12 w-12 items-center justify-center text-lg font-bold text-white rounded-lg"
                                style={{ backgroundColor: vault.color }}
                              >
                                #{index + 1}
                              </div>
                              {index === 0 && (
                                <TrophyIcon className="absolute -top-2 -right-2 h-6 w-6 text-primary" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-cirka text-xl font-bold text-white">
                                {vault.name}
                              </h3>
                              <p className="text-sm text-white/60">
                                {vault.strategy}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(vault.status)}
                            <span
                              className={`text-sm font-semibold ${getRiskColor(vault.risk)}`}
                            >
                              {vault.risk} Risk
                            </span>
                          </div>
                        </div>

                        <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                          <div>
                            <p className="mb-1 text-xs text-white/60">
                              Performance
                            </p>
                            <p
                              className={`text-lg font-bold ${
                                vault.performance > 0
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {vault.performance > 0 ? "+" : ""}
                              {vault.performance}%
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 text-xs text-white/60">APY</p>
                            <p className="text-lg font-bold text-white">
                              {vault.apy}%
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 text-xs text-white/60">TVL</p>
                            <p className="text-lg font-bold text-white">
                              ${(vault.tvl / 1000).toFixed(0)}K
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 text-xs text-white/60">
                              Stakers
                            </p>
                            <p className="flex items-center text-lg font-bold text-white">
                              <UsersIcon className="mr-1 h-4 w-4" />
                              {vault.participants}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="mb-1 flex justify-between text-xs text-white/60">
                            <span>Performance Progress</span>
                            <span>
                              {vault.performance > 0 ? "+" : ""}
                              {vault.performance}%
                            </span>
                          </div>
                          <Progress
                            value={Math.max(
                              0,
                              Math.min(100, (vault.performance + 10) * 5)
                            )}
                            className="h-2"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-xs text-white/60">
                            Manager:{" "}
                            <span className="text-primary">
                              {vault.manager}
                            </span>
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-primary text-primary hover:bg-primary hover:text-black font-semibold transition-all duration-300"
                          >
                            Enter Battle
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Right Column - Arena Stats & Vault Spotlight */}
              <div className="space-y-6">
                {/* Arena Stats */}
                <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <ChartBarIcon className="text-primary mr-2 h-5 w-5" />
                      <span className="text-white font-bold">Arena Statistics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-white/60">Total TVL</span>
                      <span className="font-bold text-white">$281K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Active Vaults</span>
                      <span className="font-bold text-white">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Total Stakers</span>
                      <span className="font-bold text-white">105</span>
                    </div>
                    <div className="flex justify-between border-t border-white/20 pt-3">
                      <span className="text-primary font-semibold">Prize Pool</span>
                      <span className="text-primary font-bold text-lg">$21.2K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Battle Duration</span>
                      <span className="font-bold text-white">14 days</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Leading Vault Info */}
                <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <TrophyIcon className="text-primary mr-2 h-5 w-5" />
                      <span className="text-white font-bold">Leading Vault</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-6">
                      <h3 className="font-cirka mb-2 text-2xl font-bold text-white">
                        {sortedVaults[0]?.name}
                      </h3>
                      <p className="text-primary text-lg font-semibold">
                        Currently Leading
                      </p>
                      <div className="bg-primary/10 border-primary/20 mt-4 border p-4 rounded-lg">
                        <div className="mb-1 text-3xl font-bold text-green-400">
                          +{sortedVaults[0]?.performance}%
                        </div>
                        <div className="text-sm text-white/60">
                          Performance Lead
                        </div>
                      </div>
                    </div>

                    <div className="mb-6 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/60">Current Lead</span>
                        <span className="font-bold text-green-400">
                          +{sortedVaults[0]?.performance}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Strategy</span>
                        <span className="text-white">
                          {sortedVaults[0]?.strategy}
                        </span>
                      </div>
                    </div>

                    <Button className="bg-primary hover:bg-primary/80 w-full font-bold text-black transition-all duration-300 hover:shadow-lg hover:shadow-primary/30">
                      Stake with Leader
                    </Button>
                  </CardContent>
                </Card>

                {/* AI Commentary */}
                <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <span className="text-white font-bold">Battle Commentary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p className="text-white/80 italic">
                        &ldquo;<span className="text-green-400">Solana DCA</span> dominates with <span className="text-primary">15.2% gains</span>, while <span className="text-blue-400">Raydium DCA</span> trails at <span className="text-blue-400">9.5%</span> — the gap widens as the battle intensifies!&rdquo;
                      </p>
                      <p className="text-xs text-primary/80 font-semibold">
                        AI Battle Analyst • Live Updates
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}