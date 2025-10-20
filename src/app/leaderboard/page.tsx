"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrophyIcon,
  ShieldCheckIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { MainNavbar } from "@/components/main-navbar";

// Dummy leaderboard data
interface LeaderboardEntry {
  rank: number;
  manager: string;
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

const leaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    manager: "DegenTrader",
    managerType: "verified",
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
    managerType: "verified",
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
    managerType: "verified",
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
    managerType: "verified",
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
    managerType: "ecosystem",
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

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("managers");
  const [timeframe, setTimeframe] = useState("quarterly");

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
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  const getManagerBadge = (managerType: string) => {
    switch (managerType) {
      case "verified":
        return (
          <div className="flex items-center space-x-1">
            <ShieldCheckIcon className="h-4 w-4 text-primary" />
            <span className="text-primary text-xs">Verified</span>
          </div>
        );
      case "ecosystem":
        return (
          <div className="flex items-center space-x-1">
            <TrophyIcon className="h-4 w-4 text-yellow-500" />
            <span className="text-yellow-500 text-xs">Ecosystem</span>
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

  const getPerformanceValue = (entry: LeaderboardEntry, timeframe: string) => {
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
    <div className="min-h-screen bg-background">
      <MainNavbar />
      
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
          <p className="text-muted-foreground mt-2">
            Top performing vault managers and their strategies
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardDescription>Total Managers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {leaderboardData.length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardDescription>Combined TVL</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(leaderboardData.reduce((sum, entry) => sum + entry.totalTVL, 0))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardDescription>Total P&L</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500 flex items-center">
                <ArrowUpIcon className="h-5 w-5 mr-1" />
                {formatCurrency(leaderboardData.reduce((sum, entry) => sum + entry.totalPnL, 0))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardDescription>Avg Win Rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {(leaderboardData.reduce((sum, entry) => sum + entry.winRate, 0) / leaderboardData.length).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-muted-foreground text-sm">Performance Period:</span>
          <div className="flex space-x-1">
            {["daily", "weekly", "monthly", "quarterly"].map((period) => (
              <Button
                key={period}
                variant={timeframe === period ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(period)}
                className={timeframe === period ? "bg-primary text-black" : ""}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-white">Manager Rankings</CardTitle>
            <CardDescription>Ranked by total performance and TVL</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 text-sm text-muted-foreground border-b border-border pb-2">
                <div className="col-span-1">Rank</div>
                <div className="col-span-3">Manager</div>
                <div className="col-span-2">TVL</div>
                <div className="col-span-2">P&L</div>
                <div className="col-span-2">Performance</div>
                <div className="col-span-1">Win Rate</div>
                <div className="col-span-1">Vaults</div>
              </div>

              {/* Table Rows */}
              {leaderboardData.map((entry) => (
                <div key={entry.rank} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-border/50 hover:bg-muted/5 transition-colors">
                  {/* Rank */}
                  <div className="col-span-1 flex items-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Manager */}
                  <div className="col-span-3">
                    <div className="flex items-center space-x-2">
                      <div>
                        <div className="text-white font-medium">{entry.manager}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          {getManagerBadge(entry.managerType)}
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <StarIcon className="h-3 w-3" />
                            <span>{entry.followers}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TVL */}
                  <div className="col-span-2">
                    <div className="text-white font-medium">
                      {formatCurrency(entry.totalTVL)}
                    </div>
                  </div>

                  {/* P&L */}
                  <div className="col-span-2">
                    <div className="text-green-500 font-medium flex items-center">
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                      {formatCurrency(entry.totalPnL)}
                    </div>
                  </div>

                  {/* Performance */}
                  <div className="col-span-2">
                    <div className={`font-medium ${
                      getPerformanceValue(entry, timeframe) >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {formatPercentage(getPerformanceValue(entry, timeframe))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Top: {entry.topVault.name}
                    </div>
                  </div>

                  {/* Win Rate */}
                  <div className="col-span-1">
                    <div className="text-white font-medium">
                      {entry.winRate}%
                    </div>
                  </div>

                  {/* Vaults */}
                  <div className="col-span-1">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {entry.vaultCount}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-card border-border">
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-bold text-white mb-2">Want to compete?</h3>
            <p className="text-muted-foreground mb-4">
              Create your own vault and climb the leaderboard
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-black">
              Become a Manager
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}