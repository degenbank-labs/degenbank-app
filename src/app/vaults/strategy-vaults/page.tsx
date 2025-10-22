"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChartBarIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  TrophyIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Particles from "@/components/ui/particles";
import { ChartArea, VaultIcon, Loader2 } from "lucide-react";
import { useVaults } from "@/hooks/useVaults";

// Dummy data based on project.md
const vaultsData = {
  totalTVL: 45678900,
  totalPnL: 2345678,
  verifiedManagers: 12,
  ecosystemManagers: 8,
  vaults: [
    {
      id: "solana-dca",
      name: "Solana DCA Vault",
      manager: "DegenTrader",
      managerType: "verified",
      tvl: 12450000,
      apy: "15.8%",
      age: "45 days",
      strategy: "DCA into SOL with automated rebalancing",
      risk: "Medium",
      depositAsset: "USDC",
      minDeposit: 100,
      status: "Active",
      symbolImage: "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
      performance: {
        daily: 0.12,
        weekly: 2.34,
        monthly: 8.67,
      },
    },
    {
      id: "bonk-dca",
      name: "BONK DCA Vault",
      manager: "MemeKing",
      managerType: "verified",
      tvl: 8900000,
      apy: "28.5%",
      age: "32 days",
      strategy: "Aggressive DCA into BONK with momentum trading",
      risk: "High",
      depositAsset: "USDC",
      minDeposit: 50,
      status: "Active",
      symbolImage: "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
      performance: {
        daily: 0.89,
        weekly: 5.67,
        monthly: 18.23,
      },
    },
    {
      id: "rwa-stable",
      name: "RWA Stable Vault",
      manager: "SafeYield",
      managerType: "verified",
      tvl: 15600000,
      apy: "8.2%",
      age: "78 days",
      strategy: "70% T-bills, 30% DeFi money markets",
      risk: "Low",
      depositAsset: "USDC",
      minDeposit: 1000,
      status: "Active",
      symbolImage: "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
      performance: {
        daily: 0.02,
        weekly: 0.15,
        monthly: 0.68,
      },
    },
    {
      id: "drift-leverage",
      name: "Drift Leverage Vault",
      manager: "YieldHunter",
      managerType: "ecosystem",
      tvl: 6780000,
      apy: "22.1%",
      age: "23 days",
      strategy: "Leveraged yield farming on Drift Protocol",
      risk: "High",
      depositAsset: "SOL",
      minDeposit: 1,
      status: "Active",
      symbolImage: "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
      performance: {
        daily: 0.45,
        weekly: 3.21,
        monthly: 12.89,
      },
    },
    {
      id: "jup-lp",
      name: "Jupiter LP Vault",
      manager: "LPMaster",
      managerType: "ecosystem",
      tvl: 4320000,
      apy: "19.7%",
      age: "67 days",
      strategy: "Optimized LP positions on Jupiter Exchange",
      risk: "Medium",
      depositAsset: "USDC",
      minDeposit: 250,
      status: "Active",
      symbolImage: "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
      performance: {
        daily: 0.34,
        weekly: 2.78,
        monthly: 9.45,
      },
    },
  ],
};

export default function StrategyVaultsPage() {
  const { vaults, stats, loading, error, refreshVaults } = useVaults();

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? "+" : ""}${percentage.toFixed(2)}%`;
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "Low":
        return (
          <Badge
            variant="secondary"
            className="bg-profit/10 text-profit hover:bg-profit/20 rounded-none border-none"
          >
            Low Risk
          </Badge>
        );
      case "Medium":
        return (
          <Badge
            variant="secondary"
            className="rounded-none border-none bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
          >
            Medium Risk
          </Badge>
        );
      case "High":
        return (
          <Badge
            variant="secondary"
            className="bg-loss/10 text-loss hover:bg-loss/20 rounded-none border-none"
          >
            High Risk
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="rounded-none border-none">
            {risk}
          </Badge>
        );
    }
  };

  const getManagerTypeBadge = (managerType: string) => {
    switch (managerType) {
      case "verified":
        return (
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary hover:bg-primary/20 rounded-none border-none"
          >
            <ShieldCheckIcon className="mr-1 h-3 w-3" />
            Verified
          </Badge>
        );
      case "ecosystem":
        return (
          <Badge
            variant="secondary"
            className="bg-secondary rounded-none border-none text-purple-400/60 hover:text-purple-400"
          >
            <UserGroupIcon className="mr-1 h-3 w-3" />
            Ecosystem
          </Badge>
        );
      default:
        return null;
    }
  };

  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredVaults = vaults.filter((vault) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "verified") return vault.managerType === "verified";
    if (selectedFilter === "ecosystem")
      return vault.managerType === "ecosystem";
    return true;
  });

  const totalTVL = stats.totalTVL;
  const totalPnL = stats.totalPnL;

  // Loading state
  if (loading) {
    return (
      <div className="bg-background text-foreground relative min-h-screen p-6">
        <div className="fixed inset-0 z-0">
          <Particles
            particleColors={["#ffffff", "#ffffff", "#ffffff"]}
            particleCount={150}
            particleSpread={8}
            speed={0.05}
            particleBaseSize={80}
            moveParticlesOnHover={true}
            alphaParticles={true}
            disableRotation={false}
            className="h-full w-full"
          />
        </div>
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading vaults...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-background text-foreground relative min-h-screen p-6">
        <div className="fixed inset-0 z-0">
          <Particles
            particleColors={["#ffffff", "#ffffff", "#ffffff"]}
            particleCount={150}
            particleSpread={8}
            speed={0.05}
            particleBaseSize={80}
            moveParticlesOnHover={true}
            alphaParticles={true}
            disableRotation={false}
            className="h-full w-full"
          />
        </div>
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="text-center space-y-4">
            <ExclamationTriangleIcon className="h-8 w-8 mx-auto text-red-500" />
            <p className="text-red-500">Error loading vaults: {error}</p>
            <Button onClick={refreshVaults} variant="outline" className="rounded-none">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground relative min-h-screen p-6">
      {/* Particles Background */}
      <div className="fixed inset-0 z-0">
        <Particles
          particleColors={["#ffffff", "#ffffff", "#ffffff"]}
          particleCount={150}
          particleSpread={8}
          speed={0.05}
          particleBaseSize={80}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
          className="h-full w-full"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="font-cirka text-4xl font-bold text-white md:text-5xl">
            Strategy Vaults
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Discover and invest in high-performance vaults managed by verified
            professionals and ecosystem partners.
          </p>
        </div>

        {/* Redesigned Stats Overview */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Total TVL Card */}
          <div className="border-border space-y-4 rounded-none border bg-black/80 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 rounded-none p-2">
                  <VaultIcon className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-muted-foreground text-sm font-medium">
                    Total Value Locked
                  </h3>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(totalTVL)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-muted-foreground text-xs">24h Change</div>
                <div className="text-profit flex items-center text-sm font-medium">
                  <ArrowUpIcon className="mr-1 h-4 w-4" />
                  +2.4%
                </div>
              </div>
            </div>
            <div className="bg-muted h-1 rounded-none">
              <div className="bg-primary h-full w-3/4 rounded-none"></div>
            </div>
          </div>

          {/* Total P&L Card */}
          <div className="border-border space-y-4 rounded-none border bg-black/80 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 rounded-none p-2">
                  <ChartArea className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-muted-foreground text-sm font-medium">
                    Total P&L
                  </h3>
                  <p
                    className={`text-2xl font-bold ${totalPnL >= 0 ? "text-profit" : "text-loss"}`}
                  >
                    {totalPnL >= 0 ? "+" : ""}
                    {formatCurrency(Math.abs(totalPnL))}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-muted-foreground text-xs">Performance</div>
                <div
                  className={`flex items-center text-sm font-medium ${totalPnL >= 0 ? "text-profit" : "text-loss"}`}
                >
                  {totalPnL >= 0 ? (
                    <ArrowUpIcon className="mr-1 h-4 w-4" />
                  ) : (
                    <ArrowDownIcon className="mr-1 h-4 w-4" />
                  )}
                  {totalPnL >= 0 ? "+12.8%" : "-5.2%"}
                </div>
              </div>
            </div>
            <div className="bg-muted h-1 rounded-none">
              <div
                className={`h-full w-2/3 rounded-none ${totalPnL >= 0 ? "bg-profit" : "bg-loss"}`}
              ></div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant={selectedFilter === "all" ? "default" : "outline"}
            onClick={() => setSelectedFilter("all")}
            className="cursor-pointer rounded-none"
          >
            All Vaults ({vaults.length})
          </Button>
          <Button
            variant={selectedFilter === "verified" ? "default" : "outline"}
            onClick={() => setSelectedFilter("verified")}
            className="cursor-pointer rounded-none"
          >
            <ShieldCheckIcon className="mr-2 h-4 w-4" />
            Verified Managers (
            {
              vaults.filter((v) => v.managerType === "verified")
                .length
            }
            )
          </Button>
          <Button
            variant={selectedFilter === "ecosystem" ? "default" : "outline"}
            onClick={() => setSelectedFilter("ecosystem")}
            className="cursor-pointer rounded-none"
          >
            <UserGroupIcon className="mr-2 h-4 w-4" />
            Ecosystem Partners (
            {
              vaults.filter((v) => v.managerType === "ecosystem")
                .length
            }
            )
          </Button>
        </div>

        {/* Manager Type Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Verified Vault Managers */}
          <Card className="border-border rounded-none bg-black/80">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <ShieldCheckIcon className="text-primary h-5 w-5" />
                <span>Verified Vault Managers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Professional managers with verified track records and proven
                strategies. Higher minimum deposits, institutional-grade
                security.
              </p>
            </CardContent>
          </Card>

          {/* Ecosystem Vault Managers */}
          <Card className="border-border rounded-none bg-black/80">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <UserGroupIcon className="h-5 w-5 text-purple-400/60" />
                <span>Ecosystem Vault Managers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Community-driven managers building innovative strategies.
                Accessible entry points, experimental approaches.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Vaults Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVaults.map((vault) => (
            <Card
              key={vault.id}
              className="border-border hover:border-primary/50 rounded-none bg-black/70 transition-all duration-200 hover:bg-black/90"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <img 
                      src={vault.symbolImage} 
                      alt={`${vault.name} symbol`}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{vault.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        {getManagerTypeBadge(vault.managerType)}
                        {getRiskBadge(vault.risk)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-muted-foreground text-sm">TVL</div>
                    <div className="text-lg font-bold text-white">
                      {formatCurrency(vault.tvl)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-muted-foreground text-sm">90D APY</div>
                    <div className="text-primary text-lg font-bold">
                      {vault.apy}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm">Age</div>
                    <div className="text-sm font-medium text-white">
                      {vault.age}
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-white">
                    Performance
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="text-muted-foreground">1D</div>
                      <div
                        className={`font-bold ${
                          vault.performance.daily >= 0
                            ? "text-profit"
                            : "text-loss"
                        }`}
                      >
                        {formatPercentage(vault.performance.daily)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground">7D</div>
                      <div
                        className={`font-bold ${
                          vault.performance.weekly >= 0
                            ? "text-profit"
                            : "text-loss"
                        }`}
                      >
                        {formatPercentage(vault.performance.weekly)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground">30D</div>
                      <div
                        className={`font-bold ${
                          vault.performance.monthly >= 0
                            ? "text-profit"
                            : "text-loss"
                        }`}
                      >
                        {formatPercentage(vault.performance.monthly)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Deposit Asset</div>
                    <div className="font-medium text-white">
                      {vault.depositAsset}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Min. Deposit</div>
                    <div className="font-medium text-white">
                      {formatCurrency(vault.minDeposit)}
                    </div>
                  </div>
                </div>

                <Link href={`/vaults/strategy-vaults/${vault.id}`}>
                  <Button
                    className="w-full cursor-pointer rounded-none"
                    variant="outline"
                  >
                    <EyeIcon className="mr-2 h-4 w-4" />
                    View Vault Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Leaderboard CTA */}
        <Card className="bg-primary border-primary/20 rounded-none">
          <CardContent className="space-y-4 p-8 text-center">
            <div className="space-y-2">
              <h3 className="font-cirka text-2xl font-bold text-black">
                Compete on the Leaderboard
              </h3>
              <p className="mx-auto max-w-2xl text-gray-700">
                Join the ultimate vault manager competition. Showcase your
                strategy, climb the rankings, and earn recognition in the DeFi
                community.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                variant="outline"
                size="lg"
                className="cursor-pointer rounded-none hover:bg-gray-900 hover:text-white"
              >
                <TrophyIcon className="mr-2 h-5 w-5" />
                View Leaderboard
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="cursor-pointer rounded-none hover:bg-gray-900 hover:text-white"
              >
                Submit Your Vault
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
