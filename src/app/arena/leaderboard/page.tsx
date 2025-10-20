"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";

import {
  TrophyIcon,
  ShieldCheckIcon,
  ArrowUpIcon,
  StarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useState, useMemo } from "react";
import { MainNavbar } from "@/components/main-navbar";
import Particles from "@/components/ui/particles";
import Link from "next/link";

// Dummy leaderboard data for Vault Managers
interface LeaderboardEntry {
  rank: number;
  manager: string;
  managerFullAddress: string;
  managerType: "verified" | "ecosystem";
  totalTVL: number;
  totalPnL: number;
  winRate: number;
  avgAPY: number;
  vaultCount: number;
  followers: number;
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
    quarterly: number;
  };
  topVault: {
    name: string;
    apy: number;
  };
}

// Dummy data for Vault Stakers
interface StakerEntry {
  rank: number;
  staker: string;
  stakerFullAddress: string;
  stakerType: "whale" | "regular" | "new";
  totalStaked: number;
  totalRewards: number;
  stakingPeriod: number; // in days
  avgAPY: number;
  vaultCount: number;
  joinDate: string;
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
    quarterly: number;
  };
  favoriteVault: {
    name: string;
    staked: number;
  };
}

// Generate Solana wallet addresses with seed for consistency
const generateSolanaAddress = (seed: number): string => {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  // Use seed-based generation for consistent results
  for (let i = 0; i < 44; i++) {
    const index = (seed + i * 7) % chars.length;
    result += chars.charAt(index);
  }
  return result;
};

// Truncate wallet address helper
const truncateAddress = (address: string): string => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

// Generate more dummy data for managers (25 entries for pagination)
const generateManagerData = (): LeaderboardEntry[] => {
  const baseData = [
    {
      rank: 1,
      manager: "DegenTrader",
      managerFullAddress: generateSolanaAddress(1001),
      managerType: "verified" as const,
      totalTVL: 45600000,
      totalPnL: 8900000,
      winRate: 78.5,
      avgAPY: 24.8,
      vaultCount: 3,
      followers: 1250,
      performance: {
        daily: 0.45,
        weekly: 3.2,
        monthly: 12.8,
        quarterly: 24.8,
      },
      topVault: {
        name: "Solana DCA Vault",
        apy: 15.8,
      },
    },
    {
      rank: 2,
      manager: "YieldHunter",
      managerFullAddress: generateSolanaAddress(1002),
      managerType: "verified" as const,
      totalTVL: 38200000,
      totalPnL: 7100000,
      winRate: 72.3,
      avgAPY: 21.5,
      vaultCount: 2,
      followers: 980,
      performance: {
        daily: 0.38,
        weekly: 2.9,
        monthly: 11.2,
        quarterly: 21.5,
      },
      topVault: {
        name: "Drift Leverage Vault",
        apy: 22.1,
      },
    },
    {
      rank: 3,
      manager: "MemeKing",
      managerFullAddress: generateSolanaAddress(1003),
      managerType: "verified" as const,
      totalTVL: 29800000,
      totalPnL: 6200000,
      winRate: 68.9,
      avgAPY: 28.5,
      vaultCount: 1,
      followers: 2100,
      performance: {
        daily: 0.89,
        weekly: 5.67,
        monthly: 18.23,
        quarterly: 28.5,
      },
      topVault: {
        name: "BONK DCA Vault",
        apy: 28.5,
      },
    },
    {
      rank: 4,
      manager: "SafeYield",
      managerFullAddress: generateSolanaAddress(1004),
      managerType: "verified" as const,
      totalTVL: 25400000,
      totalPnL: 2100000,
      winRate: 85.2,
      avgAPY: 8.2,
      vaultCount: 1,
      followers: 650,
      performance: {
        daily: 0.02,
        weekly: 0.15,
        monthly: 0.68,
        quarterly: 8.2,
      },
      topVault: {
        name: "RWA Stable Vault",
        apy: 8.2,
      },
    },
    {
      rank: 5,
      manager: "LPMaster",
      managerFullAddress: generateSolanaAddress(1005),
      managerType: "ecosystem" as const,
      totalTVL: 18700000,
      totalPnL: 3800000,
      winRate: 74.1,
      avgAPY: 19.7,
      vaultCount: 2,
      followers: 420,
      performance: {
        daily: 0.34,
        weekly: 2.78,
        monthly: 9.45,
        quarterly: 19.7,
      },
      topVault: {
        name: "Jupiter LP Vault",
        apy: 19.7,
      },
    },
  ];

  // Generate additional entries
  const additionalEntries: LeaderboardEntry[] = [];
  const managerNames = [
    "CryptoWizard",
    "DeFiGuru",
    "YieldFarmer",
    "TokenMaster",
    "BlockchainPro",
    "SmartTrader",
    "AlphaSeeker",
    "RiskManager",
    "ProfitHunter",
    "StrategyKing",
    "VaultExpert",
    "TradingBot",
    "YieldOptimizer",
    "DeFiNinja",
    "CryptoSage",
    "TokenWhale",
    "StrategyMaster",
    "YieldGuru",
    "DeFiLord",
    "CryptoKnight",
  ];
  const vaultNames = [
    "ETH Yield Vault",
    "BTC Strategy Vault",
    "SOL DeFi Vault",
    "USDC Stable Vault",
    "Multi-Asset Vault",
    "Leverage Vault",
    "Arbitrage Vault",
    "Staking Vault",
    "LP Token Vault",
    "Options Vault",
  ];

  for (let i = 6; i <= 25; i++) {
    const seed = i * 123; // Use deterministic seed
    const randomManager = managerNames[(seed + i) % managerNames.length];
    const randomVault = vaultNames[(seed + i * 2) % vaultNames.length];
    const tvl = ((seed * 7) % 15000000) + 5000000;
    const pnl = ((seed * 3) % 3000000) + 500000;
    const winRate = ((seed * 5) % 30) + 60;
    const apy = ((seed * 11) % 20) + 5;

    additionalEntries.push({
      rank: i,
      manager: `${randomManager}${i}`,
      managerFullAddress: generateSolanaAddress(1000 + i),
      managerType: (seed % 10) > 7 ? "ecosystem" : "verified",
      totalTVL: tvl,
      totalPnL: pnl,
      winRate: winRate,
      avgAPY: apy,
      vaultCount: ((seed * 13) % 4) + 1,
      followers: ((seed * 17) % 1000) + 100,
      performance: {
        daily: ((seed * 19) % 200 - 100) / 100,
        weekly: ((seed * 23) % 800 - 200) / 100,
        monthly: ((seed * 29) % 2000 - 500) / 100,
        quarterly: apy,
      },
      topVault: {
        name: randomVault,
        apy: apy + ((seed * 31) % 500) / 100,
      },
    });
  }

  return [...baseData, ...additionalEntries];
};

// Generate dummy data for stakers (25 entries for pagination)
const generateStakerData = (): StakerEntry[] => {
  const stakerNames = [
    "CryptoWhale",
    "YieldSeeker",
    "DeFiStaker",
    "TokenHolder",
    "SmartInvestor",
    "PassiveEarner",
    "StakingPro",
    "YieldChaser",
    "CryptoSaver",
    "DeFiUser",
    "TokenStaker",
    "YieldFan",
    "CryptoHodler",
    "StakeKing",
    "YieldLover",
    "DeFiFan",
    "TokenBull",
    "StakeMaster",
    "YieldHunter",
    "CryptoGem",
  ];
  const vaultNames = [
    "ETH Yield Vault",
    "BTC Strategy Vault",
    "SOL DeFi Vault",
    "USDC Stable Vault",
    "Multi-Asset Vault",
    "Leverage Vault",
    "Arbitrage Vault",
    "Staking Vault",
    "LP Token Vault",
    "Options Vault",
  ];

  const stakerData: StakerEntry[] = [];

  for (let i = 1; i <= 25; i++) {
    const seed = i * 456; // Use deterministic seed for stakers
    const randomStaker = stakerNames[(seed + i) % stakerNames.length];
    const randomVault = vaultNames[(seed + i * 3) % vaultNames.length];
    const totalStaked = ((seed * 7) % 500000) + 10000;
    const totalRewards = ((seed * 11) % 50000) + 1000;
    const stakingPeriod = ((seed * 13) % 300) + 30;
    const apy = ((seed * 17) % 15) + 5;

    stakerData.push({
      rank: i,
      staker: `${randomStaker}${i}`,
      stakerFullAddress: generateSolanaAddress(2000 + i),
      stakerType:
        totalStaked > 100000
          ? "whale"
          : totalStaked > 50000
            ? "regular"
            : "new",
      totalStaked: totalStaked,
      totalRewards: totalRewards,
      stakingPeriod: stakingPeriod,
      avgAPY: apy,
      vaultCount: ((seed * 19) % 3) + 1,
      joinDate: `2024-${String(((seed * 23) % 12) + 1).padStart(2, "0")}-${String(((seed * 29) % 28) + 1).padStart(2, "0")}`,
      performance: {
        daily: ((seed * 31) % 120 - 20) / 100,
        weekly: ((seed * 37) % 400 - 100) / 100,
        monthly: ((seed * 41) % 1200 - 300) / 100,
        quarterly: apy,
      },
      favoriteVault: {
        name: randomVault,
        staked: Math.floor(totalStaked * 0.6),
      },
    });
  }

  return stakerData;
};

const managerLeaderboardData = generateManagerData();
const stakerLeaderboardData = generateStakerData();

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState("quarterly");
  const [activeTab, setActiveTab] = useState<"managers" | "stakers">(
    "managers"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination for current tab
  const currentData =
    activeTab === "managers" ? managerLeaderboardData : stakerLeaderboardData;
  const totalItems = currentData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return currentData.slice(startIndex, endIndex);
  }, [currentData, currentPage]);

  // Reset pagination when switching tabs
  const handleTabChange = (tab: "managers" | "stakers") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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

  const getManagerBadge = (managerType: string) => {
    switch (managerType) {
      case "verified":
        return (
          <div className="flex items-center space-x-1">
            <ShieldCheckIcon className="text-primary h-4 w-4" />
            <span className="text-primary text-xs">Verified</span>
          </div>
        );
      case "ecosystem":
        return (
          <div className="flex items-center space-x-1">
            <TrophyIcon className="h-4 w-4 text-yellow-500" />
            <span className="text-xs text-yellow-500">Ecosystem</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getStakerBadge = (stakerType: string) => {
    switch (stakerType) {
      case "whale":
        return (
          <div className="flex items-center space-x-1">
            <TrophyIcon className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-blue-500">Whale</span>
          </div>
        );
      case "regular":
        return (
          <div className="flex items-center space-x-1">
            <UserGroupIcon className="h-4 w-4 text-green-500" />
            <span className="text-xs text-green-500">Regular</span>
          </div>
        );
      case "new":
        return (
          <div className="flex items-center space-x-1">
            <StarIcon className="h-4 w-4 text-purple-500" />
            <span className="text-xs text-purple-500">New</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <TrophyIcon className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <TrophyIcon className="h-5 w-5 text-gray-400" />;
      case 3:
        return <TrophyIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <span className="text-muted-foreground font-bold">#{rank}</span>;
    }
  };

  const getPerformanceValue = (
    entry: LeaderboardEntry | StakerEntry,
    timeframe: string
  ) => {
    switch (timeframe) {
      case "daily":
        return entry.performance.daily;
      case "weekly":
        return entry.performance.weekly;
      case "monthly":
        return entry.performance.monthly;
      case "quarterly":
        return entry.performance.quarterly;
      default:
        return entry.performance.quarterly;
    }
  };

  return (
    <div className="bg-background relative min-h-screen">
      <MainNavbar />

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

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div>
          <h1 className="font-cirka text-2xl font-bold text-white sm:text-3xl">
            Leaderboard
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Top performing vault managers and active stakers
          </p>
        </div>

        {/* Tab Menu */}
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button
            variant={activeTab === "managers" ? "default" : "outline"}
            onClick={() => handleTabChange("managers")}
            className={`hover:bg-primary cursor-pointer rounded-none border-gray-400 bg-transparent hover:text-black ${
              activeTab === "managers" ? "bg-primary text-black" : "text-white"
            }`}
          >
            <TrophyIcon className="mr-2 h-4 w-4" />
            Vault Managers
          </Button>
          <Button
            variant={activeTab === "stakers" ? "default" : "outline"}
            onClick={() => handleTabChange("stakers")}
            className={`hover:bg-primary cursor-pointer rounded-none border-gray-400 bg-transparent hover:text-black ${
              activeTab === "stakers" ? "bg-primary text-black" : "text-white"
            }`}
          >
            <UserGroupIcon className="mr-2 h-4 w-4" />
            Vault Stakers
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card className="bg-card border-border rounded-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs sm:text-sm">
                Total {activeTab === "managers" ? "Managers" : "Stakers"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-white sm:text-2xl">
                {currentData.length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border rounded-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs sm:text-sm">
                {activeTab === "managers" ? "Combined TVL" : "Total Staked"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-primary text-xl font-bold sm:text-2xl">
                {activeTab === "managers"
                  ? formatCurrency(
                      managerLeaderboardData.reduce(
                        (sum, entry) => sum + entry.totalTVL,
                        0
                      )
                    )
                  : formatCurrency(
                      stakerLeaderboardData.reduce(
                        (sum, entry) => sum + entry.totalStaked,
                        0
                      )
                    )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border rounded-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs sm:text-sm">
                {activeTab === "managers" ? "Total P&L" : "Total Rewards"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-profit flex items-center text-xl font-bold sm:text-2xl">
                <ArrowUpIcon className="mr-1 h-4 w-4 sm:h-5 sm:w-5" />
                {activeTab === "managers"
                  ? formatCurrency(
                      managerLeaderboardData.reduce(
                        (sum, entry) => sum + entry.totalPnL,
                        0
                      )
                    )
                  : formatCurrency(
                      stakerLeaderboardData.reduce(
                        (sum, entry) => sum + entry.totalRewards,
                        0
                      )
                    )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border rounded-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs sm:text-sm">
                {activeTab === "managers" ? "Avg Win Rate" : "Avg APY"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-white sm:text-2xl">
                {activeTab === "managers"
                  ? (
                      managerLeaderboardData.reduce(
                        (sum, entry) => sum + entry.winRate,
                        0
                      ) / managerLeaderboardData.length
                    ).toFixed(1) + "%"
                  : (
                      stakerLeaderboardData.reduce(
                        (sum, entry) => sum + entry.avgAPY,
                        0
                      ) / stakerLeaderboardData.length
                    ).toFixed(1) + "%"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeframe Selector */}
        <div className="flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
          <span className="text-muted-foreground text-sm">
            Performance Period:
          </span>
          <div className="flex flex-wrap gap-1">
            {["daily", "weekly", "monthly", "quarterly"].map((period) => (
              <Button
                key={period}
                variant={timeframe === period ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(period)}
                className={`cursor-pointer rounded-none text-xs sm:text-sm ${timeframe === period ? "bg-primary text-black" : ""}`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table */}
        <Card className="bg-card border-border rounded-none">
          <CardHeader>
            <CardTitle className="text-lg text-white sm:text-xl">
              {activeTab === "managers"
                ? "Manager Rankings"
                : "Staker Rankings"}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {activeTab === "managers"
                ? "Ranked by total performance and TVL"
                : "Ranked by total staked amount and rewards"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Desktop Table Header */}
              <div className="text-muted-foreground border-border hidden grid-cols-12 gap-4 border-b pb-2 text-sm lg:grid">
                <div className="col-span-1">Rank</div>
                <div className="col-span-3">
                  {activeTab === "managers" ? "Manager" : "Staker"}
                </div>
                <div className="col-span-2">
                  {activeTab === "managers" ? "TVL" : "Staked"}
                </div>
                <div className="col-span-2">
                  {activeTab === "managers" ? "P&L" : "Rewards"}
                </div>
                <div className="col-span-2">Performance</div>
                <div className="col-span-1">
                  {activeTab === "managers" ? "Win Rate" : "APY"}
                </div>
                <div className="col-span-1">Vaults</div>
              </div>

              {/* Table Rows */}
              {paginatedData.map((entry) => (
                <div
                  key={entry.rank}
                  className="border-border/50 hover:bg-muted/5 border-b py-3 transition-colors"
                >
                  {/* Desktop Layout */}
                  <div className="hidden grid-cols-12 items-center gap-4 lg:grid">
                    {/* Rank */}
                    <div className="col-span-1 flex items-center">
                      {getRankIcon(entry.rank)}
                    </div>

                    {/* Manager/Staker */}
                    <div className="col-span-3">
                      <div className="flex items-center space-x-2">
                        <div>
                          <div className="font-medium text-white">
                            {activeTab === "managers"
                              ? truncateAddress(
                                  (entry as LeaderboardEntry).managerFullAddress
                                )
                              : truncateAddress(
                                  (entry as StakerEntry).stakerFullAddress
                                )}
                          </div>
                          <div className="mt-1 flex items-center space-x-2">
                            {activeTab === "managers"
                              ? getManagerBadge(
                                  (entry as LeaderboardEntry).managerType
                                )
                              : getStakerBadge(
                                  (entry as StakerEntry).stakerType
                                )}
                            <div className="text-muted-foreground flex items-center space-x-1 text-xs">
                              <StarIcon className="h-3 w-3" />
                              <span>
                                {activeTab === "managers"
                                  ? (entry as LeaderboardEntry).followers
                                  : `${(entry as StakerEntry).stakingPeriod}d`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* TVL/Staked */}
                    <div className="col-span-2">
                      <div className="font-medium text-white">
                        {activeTab === "managers"
                          ? formatCurrency((entry as LeaderboardEntry).totalTVL)
                          : formatCurrency((entry as StakerEntry).totalStaked)}
                      </div>
                    </div>

                    {/* P&L/Rewards */}
                    <div className="col-span-2">
                      <div className="text-profit flex items-center font-medium">
                        <ArrowUpIcon className="mr-1 h-4 w-4" />
                        {activeTab === "managers"
                          ? formatCurrency((entry as LeaderboardEntry).totalPnL)
                          : formatCurrency((entry as StakerEntry).totalRewards)}
                      </div>
                    </div>

                    {/* Performance */}
                    <div className="col-span-2">
                      <div
                        className={`font-medium ${
                          getPerformanceValue(entry, timeframe) >= 0
                            ? "text-profit"
                            : "text-loss"
                        }`}
                      >
                        {formatPercentage(
                          getPerformanceValue(entry, timeframe)
                        )}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {activeTab === "managers"
                          ? `Top: ${(entry as LeaderboardEntry).topVault.name}`
                          : `Fav: ${(entry as StakerEntry).favoriteVault.name}`}
                      </div>
                    </div>

                    {/* Win Rate/APY */}
                    <div className="col-span-1">
                      <div className="font-medium text-white">
                        {activeTab === "managers"
                          ? `${(entry as LeaderboardEntry).winRate}%`
                          : `${(entry as StakerEntry).avgAPY}%`}
                      </div>
                    </div>

                    {/* Vaults */}
                    <div className="col-span-1">
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary rounded-none"
                      >
                        {entry.vaultCount}
                      </Badge>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="space-y-3 lg:hidden">
                    {/* Rank and Address */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getRankIcon(entry.rank)}
                        <div>
                          <div className="font-medium text-white">
                            {activeTab === "managers"
                              ? truncateAddress(
                                  (entry as LeaderboardEntry).managerFullAddress
                                )
                              : truncateAddress(
                                  (entry as StakerEntry).stakerFullAddress
                                )}
                          </div>
                          <div className="mt-1 flex items-center space-x-2">
                            {activeTab === "managers"
                              ? getManagerBadge(
                                  (entry as LeaderboardEntry).managerType
                                )
                              : getStakerBadge(
                                  (entry as StakerEntry).stakerType
                                )}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary rounded-none"
                      >
                        {entry.vaultCount} vaults
                      </Badge>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-muted-foreground text-xs">
                          {activeTab === "managers" ? "TVL" : "Staked"}
                        </div>
                        <div className="font-medium text-white">
                          {activeTab === "managers"
                            ? formatCurrency(
                                (entry as LeaderboardEntry).totalTVL
                              )
                            : formatCurrency(
                                (entry as StakerEntry).totalStaked
                              )}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">
                          {activeTab === "managers" ? "P&L" : "Rewards"}
                        </div>
                        <div className="text-profit flex items-center font-medium">
                          <ArrowUpIcon className="mr-1 h-3 w-3" />
                          {activeTab === "managers"
                            ? formatCurrency(
                                (entry as LeaderboardEntry).totalPnL
                              )
                            : formatCurrency(
                                (entry as StakerEntry).totalRewards
                              )}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">
                          Performance
                        </div>
                        <div
                          className={`font-medium ${
                            getPerformanceValue(entry, timeframe) >= 0
                              ? "text-profit"
                              : "text-loss"
                          }`}
                        >
                          {formatPercentage(
                            getPerformanceValue(entry, timeframe)
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">
                          {activeTab === "managers" ? "Win Rate" : "APY"}
                        </div>
                        <div className="font-medium text-white">
                          {activeTab === "managers"
                            ? `${(entry as LeaderboardEntry).winRate}%`
                            : `${(entry as StakerEntry).avgAPY}%`}
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="text-muted-foreground flex items-center space-x-1">
                        <StarIcon className="h-3 w-3" />
                        <span>
                          {activeTab === "managers"
                            ? `${(entry as LeaderboardEntry).followers} followers`
                            : `${(entry as StakerEntry).stakingPeriod} days`}
                        </span>
                      </div>
                      <div className="text-muted-foreground">
                        {activeTab === "managers"
                          ? `Top: ${(entry as LeaderboardEntry).topVault.name}`
                          : `Fav: ${(entry as StakerEntry).favoriteVault.name}`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                className="border-border/50 border-t pt-4"
              />
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-primary border-border rounded-none">
          <CardContent className="py-6 text-center sm:py-8">
            <h3 className="font-cirka mb-2 text-xl font-bold text-black sm:text-2xl">
              Ready to Battle?
            </h3>
            <p className="mb-4 text-sm text-gray-800 sm:text-base">
              Join the arena and compete against top managers
            </p>
            <Link href="/arena/battle">
              <Button
                variant="outline"
                className="cursor-pointer rounded-none hover:bg-gray-900 hover:text-white"
              >
                Enter Arena Battle
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
