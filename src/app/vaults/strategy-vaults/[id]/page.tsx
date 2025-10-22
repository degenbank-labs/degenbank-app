"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import {
  ShieldCheckIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useVaults, VaultWithMetrics } from "@/hooks/useVaults";
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { SolanaIconSvg } from "@/components/svg";

// Performance chart data for 14D period
const performanceData14D = [
  { date: "02 Nov", value: 0, roi: 0, sharePrice: 1.0, vaultBalance: 5500000 },
  {
    date: "03 Nov",
    value: 1.8,
    roi: 1.8,
    sharePrice: 1.018,
    vaultBalance: 5650000,
  },
  {
    date: "04 Nov",
    value: -0.5,
    roi: -0.5,
    sharePrice: 0.995,
    vaultBalance: 5480000,
  },
  {
    date: "05 Nov",
    value: 3.2,
    roi: 3.2,
    sharePrice: 1.032,
    vaultBalance: 5720000,
  },
  {
    date: "06 Nov",
    value: 2.1,
    roi: 2.1,
    sharePrice: 1.021,
    vaultBalance: 5680000,
  },
  {
    date: "07 Nov",
    value: 5.4,
    roi: 5.4,
    sharePrice: 1.054,
    vaultBalance: 6100000,
  },
  {
    date: "08 Nov",
    value: 4.3,
    roi: 4.3,
    sharePrice: 1.043,
    vaultBalance: 6050000,
  },
  {
    date: "09 Nov",
    value: 1.2,
    roi: 1.2,
    sharePrice: 1.012,
    vaultBalance: 5850000,
  },
  {
    date: "10 Nov",
    value: 6.8,
    roi: 6.8,
    sharePrice: 1.068,
    vaultBalance: 6200000,
  },
  {
    date: "11 Nov",
    value: 8.5,
    roi: 8.5,
    sharePrice: 1.085,
    vaultBalance: 6450000,
  },
  {
    date: "12 Nov",
    value: 7.1,
    roi: 7.1,
    sharePrice: 1.071,
    vaultBalance: 6380000,
  },
  {
    date: "13 Nov",
    value: 10.2,
    roi: 10.2,
    sharePrice: 1.102,
    vaultBalance: 6750000,
  },
  {
    date: "14 Nov",
    value: 9.4,
    roi: 9.4,
    sharePrice: 1.094,
    vaultBalance: 6680000,
  },
  {
    date: "15 Nov",
    value: 12.6,
    roi: 12.6,
    sharePrice: 1.126,
    vaultBalance: 7200000,
  },
];

// Performance chart data for 30D period
const performanceData30D = [
  { date: "17 Oct", value: 0, roi: 0, sharePrice: 1.0, vaultBalance: 5500000 },
  {
    date: "18 Oct",
    value: 1.2,
    roi: 1.2,
    sharePrice: 1.012,
    vaultBalance: 5650000,
  },
  {
    date: "19 Oct",
    value: -0.8,
    roi: -0.8,
    sharePrice: 0.992,
    vaultBalance: 5480000,
  },
  {
    date: "20 Oct",
    value: 2.5,
    roi: 2.5,
    sharePrice: 1.025,
    vaultBalance: 5720000,
  },
  {
    date: "21 Oct",
    value: 1.8,
    roi: 1.8,
    sharePrice: 1.018,
    vaultBalance: 5680000,
  },
  {
    date: "22 Oct",
    value: 4.2,
    roi: 4.2,
    sharePrice: 1.042,
    vaultBalance: 6100000,
  },
  {
    date: "23 Oct",
    value: 3.1,
    roi: 3.1,
    sharePrice: 1.031,
    vaultBalance: 6050000,
  },
  {
    date: "24 Oct",
    value: -1.5,
    roi: -1.5,
    sharePrice: 0.985,
    vaultBalance: 5850000,
  },
  {
    date: "25 Oct",
    value: 2.8,
    roi: 2.8,
    sharePrice: 1.028,
    vaultBalance: 6200000,
  },
  {
    date: "26 Oct",
    value: 6.3,
    roi: 6.3,
    sharePrice: 1.063,
    vaultBalance: 6450000,
  },
  {
    date: "27 Oct",
    value: 5.1,
    roi: 5.1,
    sharePrice: 1.051,
    vaultBalance: 6380000,
  },
  {
    date: "28 Oct",
    value: 8.7,
    roi: 8.7,
    sharePrice: 1.087,
    vaultBalance: 6750000,
  },
  {
    date: "29 Oct",
    value: 7.2,
    roi: 7.2,
    sharePrice: 1.072,
    vaultBalance: 6680000,
  },
  {
    date: "30 Oct",
    value: 11.4,
    roi: 11.4,
    sharePrice: 1.114,
    vaultBalance: 7200000,
  },
  {
    date: "31 Oct",
    value: 9.8,
    roi: 9.8,
    sharePrice: 1.098,
    vaultBalance: 7050000,
  },
  {
    date: "01 Nov",
    value: 13.6,
    roi: 13.6,
    sharePrice: 1.136,
    vaultBalance: 7580000,
  },
  {
    date: "02 Nov",
    value: 12.1,
    roi: 12.1,
    sharePrice: 1.121,
    vaultBalance: 7420000,
  },
  {
    date: "03 Nov",
    value: 15.9,
    roi: 15.9,
    sharePrice: 1.159,
    vaultBalance: 8100000,
  },
  {
    date: "04 Nov",
    value: 14.2,
    roi: 14.2,
    sharePrice: 1.142,
    vaultBalance: 7950000,
  },
  {
    date: "05 Nov",
    value: 18.5,
    roi: 18.5,
    sharePrice: 1.185,
    vaultBalance: 8650000,
  },
  {
    date: "06 Nov",
    value: 16.8,
    roi: 16.8,
    sharePrice: 1.168,
    vaultBalance: 8480000,
  },
  {
    date: "07 Nov",
    value: 21.3,
    roi: 21.3,
    sharePrice: 1.213,
    vaultBalance: 9200000,
  },
  {
    date: "08 Nov",
    value: 19.7,
    roi: 19.7,
    sharePrice: 1.197,
    vaultBalance: 9050000,
  },
  {
    date: "09 Nov",
    value: 24.8,
    roi: 24.8,
    sharePrice: 1.248,
    vaultBalance: 9850000,
  },
  {
    date: "10 Nov",
    value: 22.4,
    roi: 22.4,
    sharePrice: 1.224,
    vaultBalance: 9650000,
  },
  {
    date: "11 Nov",
    value: 27.6,
    roi: 27.6,
    sharePrice: 1.276,
    vaultBalance: 10500000,
  },
  {
    date: "12 Nov",
    value: 25.9,
    roi: 25.9,
    sharePrice: 1.259,
    vaultBalance: 10300000,
  },
  {
    date: "13 Nov",
    value: 31.2,
    roi: 31.2,
    sharePrice: 1.312,
    vaultBalance: 11200000,
  },
  {
    date: "14 Nov",
    value: 28.8,
    roi: 28.8,
    sharePrice: 1.288,
    vaultBalance: 10950000,
  },
  {
    date: "15 Nov",
    value: 34.5,
    roi: 34.5,
    sharePrice: 1.345,
    vaultBalance: 12100000,
  },
];

// Function to get performance data based on selected period
const getPerformanceData = (period: "14D" | "30D") => {
  return period === "14D" ? performanceData14D : performanceData30D;
};

// Dummy data for vault details
// Using VaultWithMetrics interface from useVaults hook instead of local VaultData interface

export default function VaultDetailPage() {
  const params = useParams();
  const vaultId = params.id as string;
  const [activeTab, setActiveTab] = useState("vault-performance");
  const [selectedPeriod, setSelectedPeriod] = useState<"14D" | "30D">("30D");
  const [selectedChart, setSelectedChart] = useState<
    "roi" | "sharePrice" | "vaultBalance"
  >("roi");
  const [depositWithdrawTab, setDepositWithdrawTab] = useState<
    "deposit" | "withdraw"
  >("deposit");

  // Use real API data
  const { getVaultById, loading, error } = useVaults();
  const [vaultData, setVaultData] = useState<VaultWithMetrics | null>(null);

  useEffect(() => {
    const fetchVault = async () => {
      if (vaultId) {
        try {
          const vault = await getVaultById(vaultId);
          setVaultData(vault);
        } catch (err) {
          console.error("Failed to fetch vault:", err);
        }
      }
    };
    fetchVault();
  }, [vaultId, getVaultById]);

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="text-primary mx-auto mb-4 h-8 w-8 animate-spin" />
            <p className="text-neutral-400">Loading vault details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h1 className="mb-4 text-2xl font-bold text-white">
            Failed to load vault
          </h1>
          <p className="mb-6 text-neutral-400">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Vault not found
  if (!vaultData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-white">
            Vault Not Found
          </h1>
          <p className="mb-6 text-neutral-400">
            The vault you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/vaults/strategy-vaults">
            <Button>Back to Vaults</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get chart data based on selected chart type and period
  const getChartData = () => {
    const currentData = getPerformanceData(selectedPeriod);

    switch (selectedChart) {
      case "roi":
        return currentData.map((item) => ({
          ...item,
          value: item.roi,
        }));
      case "sharePrice":
        return currentData.map((item) => ({
          ...item,
          value: item.sharePrice,
        }));
      case "vaultBalance":
        return currentData.map((item) => ({
          ...item,
          value: item.vaultBalance / 1000000, // Convert to millions for better display
        }));
      default:
        return currentData;
    }
  };

  // Get chart label and format based on selected chart type
  const getChartConfig = () => {
    const currentData = getPerformanceData(selectedPeriod);

    switch (selectedChart) {
      case "roi":
        // Determine if we have negative values in ROI data
        const hasNegativeROI = currentData.some((item) => item.roi < 0);
        const maxROI = Math.max(...currentData.map((item) => item.roi));
        const minROI = Math.min(...currentData.map((item) => item.roi));

        return {
          label: "ROI (%)",
          format: (value: number) => `${value.toFixed(2)}%`,
          color: hasNegativeROI
            ? maxROI >= 0
              ? "#34CB88"
              : "#FB605C"
            : "#34CB88",
          hasNegativeValues: hasNegativeROI,
          maxValue: maxROI,
          minValue: minROI,
        };
      case "sharePrice":
        return {
          label: "Share Price (SOL)",
          format: (value: number) => `${value.toFixed(3)} SOL`,
          color: "#6fb7a5",
          hasNegativeValues: false,
        };
      case "vaultBalance":
        return {
          label: "Vault Balance (M SOL)",
          format: (value: number) => `${value.toFixed(2)}M SOL`,
          color: "#8b5cf6",
          hasNegativeValues: false,
        };
      default:
        return {
          label: "ROI (%)",
          format: (value: number) => `${value.toFixed(2)}%`,
          color: "#34CB88",
          hasNegativeValues: false,
        };
    }
  };

  const chartData = getChartData();
  const chartConfig = getChartConfig();

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? "+" : ""}${percentage.toFixed(2)}%`;
  };

  const getManagerBadge = (managerType: string) => {
    switch (managerType) {
      case "verified":
        return (
          <div className="flex items-center space-x-1">
            <ShieldCheckIcon className="text-primary h-4 w-4" />
          </div>
        );
      case "ecosystem":
        return (
          <div className="flex items-center space-x-1">
            <UserGroupIcon className="h-4 w-4 text-purple-400/60" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header with Back Button */}
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <Link
          href="/vaults/strategy-vaults"
          className="text-muted-foreground flex items-center text-sm hover:text-white"
        >
          ← Back
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Main Header */}
        <div className="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-start">
          <div className="flex w-full flex-col items-start space-y-3 sm:w-auto sm:flex-row sm:space-y-0 sm:space-x-4">
            {/* Symbol Image */}
            <div className="flex-shrink-0">
              <div className="bg-primary/20 flex h-12 w-12 items-center justify-center rounded-lg">
                <SolanaIconSvg className="h-8 w-8" />
              </div>
            </div>

            {/* Vault Info */}
            <div className="w-full sm:w-auto">
              <h1 className="mb-1 text-xl font-bold text-white sm:text-2xl">
                {vaultData.name || "Vault Name"}
              </h1>
              <div className="flex flex-col space-y-2 text-sm sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-1">
                  <span className="text-muted-foreground">Manager:</span>
                  {getManagerBadge(vaultData.managerType || "verified")}
                  <span className="font-medium text-white">
                    {vaultData.manager?.manager_name || "Unknown Manager"}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">Deposit:</span>
                    <SolanaIconSvg className="h-4 w-4" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">Trading:</span>
                    <SolanaIconSvg className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Menu - Stack vertically on mobile */}
        <div className="mb-6 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button
            variant={activeTab === "vault-performance" ? "default" : "outline"}
            onClick={() => setActiveTab("vault-performance")}
            className={`hover:bg-primary w-full cursor-pointer rounded-none border-gray-400 bg-transparent hover:text-black sm:w-auto ${
              activeTab === "vault-performance"
                ? "bg-primary text-black"
                : "text-white"
            }`}
          >
            Vault Performance
          </Button>
          <Button
            variant={activeTab === "your-performance" ? "default" : "outline"}
            onClick={() => setActiveTab("your-performance")}
            className={`hover:bg-primary w-full cursor-pointer rounded-none border-gray-400 bg-transparent hover:text-black sm:w-auto ${
              activeTab === "your-performance"
                ? "bg-primary text-black"
                : "text-white"
            }`}
          >
            Your Performance
          </Button>
          <Button
            variant={activeTab === "overview" ? "default" : "outline"}
            onClick={() => setActiveTab("overview")}
            className={`hover:bg-primary w-full cursor-pointer rounded-none border-gray-400 bg-transparent hover:text-black sm:w-auto ${
              activeTab === "overview" ? "bg-primary text-black" : "text-white"
            }`}
          >
            Overview
          </Button>
        </div>

        {/* Key Metrics - Responsive grid with proper borders */}
        <Card className="bg-card border-border mb-6 rounded-none">
          <div className="grid grid-cols-2 sm:grid-cols-4">
            <div className="border-border border-r border-b px-4 py-4 sm:border-b-0 sm:px-8">
              <div className="text-muted-foreground text-xs tracking-wide uppercase">
                APY (90 days)
              </div>
              <div className="text-primary mt-1 text-base font-bold sm:text-lg">
                {vaultData.apy || "0.00%"}
              </div>
            </div>
            <div className="border-border border-b px-4 py-4 sm:border-r sm:border-b-0 sm:px-8">
              <div className="text-muted-foreground text-xs tracking-wide uppercase">
                Strategy
              </div>
              <div className="mt-1 text-base font-bold text-white sm:text-lg">
                {vaultData.strategy || "N/A"}
              </div>
            </div>
            <div className="border-border border-r px-4 py-4 sm:px-8">
              <div className="text-muted-foreground text-xs tracking-wide uppercase">
                TVL
              </div>
              <div className="mt-1 text-base font-bold text-white sm:text-lg">
                $ {vaultData.tvl ? (vaultData.tvl / 1000).toFixed(1) : "0.0"}K
              </div>
            </div>
            <div className="px-4 py-4 sm:px-8">
              <div className="text-muted-foreground text-xs tracking-wide uppercase">
                Risk Level
              </div>
              <div className="mt-1 text-base font-bold text-white sm:text-lg">
                {vaultData.risk || "N/A"}
              </div>
            </div>
          </div>
        </Card>

        {/* Tab Content */}
        {activeTab === "vault-performance" && (
          <div className="space-y-6">
            {/* Main Content */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left Column - Chart */}
              <div className="lg:col-span-2">
                <Card className="bg-card border-border rounded-none">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-white">
                      Vault Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Chart Legend Buttons */}
                    <div className="flex flex-wrap gap-2 sm:gap-4">
                      <button
                        onClick={() => setSelectedChart("roi")}
                        className={`min-w-0 flex-1 px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
                          selectedChart === "roi"
                            ? "bg-primary text-black"
                            : "text-muted-foreground bg-transparent hover:text-white"
                        }`}
                      >
                        ROI
                      </button>
                      <button
                        onClick={() => setSelectedChart("sharePrice")}
                        className={`min-w-0 flex-1 px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
                          selectedChart === "sharePrice"
                            ? "bg-primary text-black"
                            : "text-muted-foreground bg-transparent hover:text-white"
                        }`}
                      >
                        Share Price
                      </button>
                      <button
                        onClick={() => setSelectedChart("vaultBalance")}
                        className={`min-w-0 flex-1 px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
                          selectedChart === "vaultBalance"
                            ? "bg-primary text-black"
                            : "text-muted-foreground bg-transparent hover:text-white"
                        }`}
                      >
                        Vault Balance
                      </button>
                    </div>

                    {/* Period Selection */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedPeriod("14D")}
                        className={`px-3 py-1 text-xs font-medium transition-colors sm:text-sm ${
                          selectedPeriod === "14D"
                            ? "bg-primary text-black"
                            : "text-muted-foreground bg-transparent hover:text-white"
                        }`}
                      >
                        14D
                      </button>
                      <button
                        onClick={() => setSelectedPeriod("30D")}
                        className={`px-3 py-1 text-xs font-medium transition-colors sm:text-sm ${
                          selectedPeriod === "30D"
                            ? "bg-primary text-black"
                            : "text-muted-foreground bg-transparent hover:text-white"
                        }`}
                      >
                        30D
                      </button>
                    </div>

                    {/* Chart */}
                    <div className="h-64 w-full sm:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                          data={chartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <defs>
                            {selectedChart === "roi" &&
                            chartConfig.hasNegativeValues &&
                            chartConfig.maxValue !== undefined &&
                            chartConfig.minValue !== undefined ? (
                              // Dynamic gradient for ROI with positive and negative values
                              <>
                                <linearGradient
                                  id="roiSplitColor"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="0%"
                                    stopColor={
                                      chartConfig.maxValue >= 0
                                        ? "#34CB88"
                                        : "#FB605C"
                                    }
                                    stopOpacity={0.6}
                                  />
                                  <stop
                                    offset={`${100 - (chartConfig.maxValue > 0 && chartConfig.minValue < 0 ? Math.max(0, Math.min(100, ((0 - chartConfig.minValue) / (chartConfig.maxValue - chartConfig.minValue)) * 100)) : 50)}%`}
                                    stopColor={
                                      chartConfig.maxValue >= 0
                                        ? "#34CB88"
                                        : "#FB605C"
                                    }
                                    stopOpacity={0.001}
                                  />
                                  <stop
                                    offset={`${100 - (chartConfig.maxValue > 0 && chartConfig.minValue < 0 ? Math.max(0, Math.min(100, ((0 - chartConfig.minValue) / (chartConfig.maxValue - chartConfig.minValue)) * 100)) : 50)}%`}
                                    stopColor={
                                      chartConfig.minValue < 0
                                        ? "#FB605C"
                                        : "#34CB88"
                                    }
                                    stopOpacity={0.001}
                                  />
                                  <stop
                                    offset="100%"
                                    stopColor={
                                      chartConfig.minValue < 0
                                        ? "#FB605C"
                                        : "#34CB88"
                                    }
                                    stopOpacity={0.6}
                                  />
                                </linearGradient>
                                <linearGradient
                                  id="roiStrokeGradient"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="0%"
                                    stopColor={
                                      chartConfig.maxValue >= 0
                                        ? "#34CB88"
                                        : "#FB605C"
                                    }
                                    stopOpacity={1}
                                  />
                                  <stop
                                    offset={`${100 - (chartConfig.maxValue > 0 && chartConfig.minValue < 0 ? Math.max(0, Math.min(100, ((0 - chartConfig.minValue) / (chartConfig.maxValue - chartConfig.minValue)) * 100)) : 50)}%`}
                                    stopColor={
                                      chartConfig.maxValue >= 0
                                        ? "#34CB88"
                                        : "#FB605C"
                                    }
                                    stopOpacity={1}
                                  />
                                  <stop
                                    offset={`${100 - (chartConfig.maxValue > 0 && chartConfig.minValue < 0 ? Math.max(0, Math.min(100, ((0 - chartConfig.minValue) / (chartConfig.maxValue - chartConfig.minValue)) * 100)) : 50)}%`}
                                    stopColor={
                                      chartConfig.minValue < 0
                                        ? "#FB605C"
                                        : "#34CB88"
                                    }
                                    stopOpacity={1}
                                  />
                                  <stop
                                    offset="100%"
                                    stopColor={
                                      chartConfig.minValue < 0
                                        ? "#FB605C"
                                        : "#34CB88"
                                    }
                                    stopOpacity={1}
                                  />
                                </linearGradient>
                              </>
                            ) : (
                              // Standard gradient for other charts or ROI without negative values
                              <linearGradient
                                id="colorValue"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor={chartConfig.color}
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor={chartConfig.color}
                                  stopOpacity={0.1}
                                />
                              </linearGradient>
                            )}
                          </defs>
                          <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#9ca3af", fontSize: 10 }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#9ca3af", fontSize: 10 }}
                            tickFormatter={(value) => chartConfig.format(value)}
                          />
                          <RechartsTooltip
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                const value = payload[0].value as number;
                                let textColor = "text-white";

                                if (selectedChart === "roi") {
                                  textColor =
                                    value < 0 ? "text-loss" : "text-profit";
                                } else if (selectedChart === "sharePrice") {
                                  textColor = "text-[#6fb7a5]";
                                } else if (selectedChart === "vaultBalance") {
                                  textColor = "text-[#8b5cf6]";
                                }

                                return (
                                  <div className="bg-background border-border border p-3 shadow-lg">
                                    <p className="text-muted-foreground text-sm">
                                      {label}
                                    </p>
                                    <p
                                      className={`text-sm font-medium ${textColor}`}
                                    >
                                      {chartConfig.label}:{" "}
                                      {chartConfig.format(value)}
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          {selectedChart === "roi" && (
                            <ReferenceLine
                              y={0}
                              stroke="#6B7280"
                              strokeDasharray="3 3"
                              strokeWidth={1}
                            />
                          )}
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke={
                              selectedChart === "roi" &&
                              chartConfig.hasNegativeValues &&
                              chartConfig.maxValue !== undefined &&
                              chartConfig.minValue !== undefined
                                ? "url(#roiStrokeGradient)"
                                : chartConfig.color
                            }
                            strokeWidth={2}
                            fill={
                              selectedChart === "roi" &&
                              chartConfig.hasNegativeValues &&
                              chartConfig.maxValue !== undefined &&
                              chartConfig.minValue !== undefined
                                ? "url(#roiSplitColor)"
                                : "url(#colorValue)"
                            }
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Bottom note */}
                    <div className="border-border mt-4 border-t pt-4">
                      <div className="text-muted-foreground text-xs">
                        * ROI is based on the change in share price, not
                        inclusive of fees
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Deposit/Withdraw Panel */}
              <div className="space-y-6">
                {/* Deposit/Withdraw Panel */}
                <Card className="bg-card border-border rounded-none">
                  <CardContent className="p-6">
                    {/* Tab Buttons */}
                    <div className="mb-6 flex">
                      <button
                        onClick={() => setDepositWithdrawTab("deposit")}
                        className={`flex-1 cursor-pointer px-4 py-2 text-sm font-medium ${
                          depositWithdrawTab === "deposit"
                            ? "bg-profit text-black"
                            : "text-muted-foreground bg-transparent hover:text-white"
                        }`}
                      >
                        Deposit
                      </button>
                      <button
                        onClick={() => setDepositWithdrawTab("withdraw")}
                        className={`flex-1 cursor-pointer px-4 py-2 text-sm font-medium ${
                          depositWithdrawTab === "withdraw"
                            ? "bg-loss text-white"
                            : "text-muted-foreground bg-transparent hover:text-white"
                        }`}
                      >
                        Withdraw
                      </button>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground mb-6 text-xs">
                      {depositWithdrawTab === "deposit"
                        ? "Deposited funds are subject to a 1 day redemption period."
                        : "After the 1 day redemption period, your funds can be withdrawn to your wallet.\n\nThe maximum withdrawal amount is based on share value at request time, though the final amount may be lower."}
                    </p>

                    {/* Amount Input */}
                    <div className="mb-6">
                      <div className="mb-2 flex items-center justify-between">
                        <label className="text-muted-foreground text-sm">
                          Amount
                        </label>
                        <span className="text-muted-foreground text-sm">
                          Max: 0.00
                        </span>
                      </div>
                      <div className="bg-background border-border relative border">
                        <div className="absolute top-1/2 left-3 flex -translate-y-1/2 transform items-center space-x-2">
                          <SolanaIconSvg width={20} height={20} />
                          <span className="text-sm font-medium text-white">
                            SOL
                          </span>
                        </div>
                        <input
                          type="number"
                          placeholder=""
                          className="w-full [appearance:textfield] bg-transparent py-3 pr-4 pl-20 text-right text-2xl font-medium text-white focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          defaultValue="0"
                        />
                      </div>
                    </div>

                    {/* Balance */}
                    <div className="mb-6 flex justify-between text-sm">
                      <span className="text-muted-foreground">Balance</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-white">0.00</span>
                        <SolanaIconSvg width={16} height={16} />
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      className={`w-full cursor-pointer py-3 text-sm font-medium ${
                        depositWithdrawTab === "deposit"
                          ? "bg-profit hover:bg-profit/90 text-black"
                          : "bg-loss hover:bg-loss/90 text-white"
                      }`}
                    >
                      {depositWithdrawTab === "deposit"
                        ? "Confirm Deposit"
                        : "Request Withdrawal"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeTab === "your-performance" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Performance Breakdown Section */}
            <div className="border p-4 sm:p-6 lg:col-span-2">
              <h3 className="mb-4 text-lg font-medium text-white sm:mb-6">
                Performance Breakdown
              </h3>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Tooltip content="The total amount you have deposited into this vault minus any withdrawals">
                      <span className="cursor-help border-b border-dotted border-[#6B7280] text-sm text-[#6B7280]">
                        Your Cumulative Net Deposits
                      </span>
                    </Tooltip>
                    <div className="flex items-center gap-2">
                      <SolanaIconSvg width={16} height={16} />
                      <span className="font-medium text-white">0</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6B7280]">0%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <Tooltip content="The number of vault shares you currently own">
                      <span className="cursor-help border-b border-dotted border-[#6B7280] text-sm text-[#6B7280]">
                        Vault Shares
                      </span>
                    </Tooltip>
                  </div>

                  <div className="flex items-center justify-between">
                    <Tooltip content="The largest single-day loss experienced by your position">
                      <span className="cursor-help border-b border-dotted border-[#6B7280] text-sm text-[#6B7280]">
                        Max Daily Drawdown
                      </span>
                    </Tooltip>
                    <span className="font-medium text-white">0.00%</span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Tooltip content="Total fees paid to the vault manager for management and performance">
                      <span className="cursor-help border-b border-dotted border-[#6B7280] text-sm text-[#6B7280]">
                        Fees Paid
                      </span>
                    </Tooltip>
                    <div className="flex items-center gap-2">
                      <SolanaIconSvg width={16} height={16} />
                      <span className="font-medium text-white">0</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Tooltip content="The highest value your position has reached, used to calculate performance fees">
                      <span className="cursor-help border-b border-dotted border-[#6B7280] text-sm text-[#6B7280]">
                        High-Water Mark
                      </span>
                    </Tooltip>
                    <div className="flex items-center gap-2">
                      <SolanaIconSvg width={16} height={16} />
                      <span className="font-medium text-white">0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Deposit/Withdraw Panel */}
            <div className="space-y-6">
              {/* Deposit/Withdraw Panel */}
              <Card className="bg-card border-border rounded-none">
                <CardContent className="p-6">
                  {/* Tab Buttons */}
                  <div className="mb-6 flex">
                    <button
                      onClick={() => setDepositWithdrawTab("deposit")}
                      className={`flex-1 cursor-pointer px-4 py-2 text-sm font-medium ${
                        depositWithdrawTab === "deposit"
                          ? "bg-profit text-black"
                          : "text-muted-foreground bg-transparent hover:text-white"
                      }`}
                    >
                      Deposit
                    </button>
                    <button
                      onClick={() => setDepositWithdrawTab("withdraw")}
                      className={`flex-1 cursor-pointer px-4 py-2 text-sm font-medium ${
                        depositWithdrawTab === "withdraw"
                          ? "bg-loss text-white"
                          : "text-muted-foreground bg-transparent hover:text-white"
                      }`}
                    >
                      Withdraw
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-6 text-xs">
                    {depositWithdrawTab === "deposit"
                      ? "Deposited funds are subject to a 1 day redemption period."
                      : "After the 1 day redemption period, your funds can be withdrawn to your wallet.\n\nThe maximum withdrawal amount is based on share value at request time, though the final amount may be lower."}
                  </p>

                  {/* Amount Input */}
                  <div className="mb-6">
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-muted-foreground text-sm">
                        Amount
                      </label>
                      <span className="text-muted-foreground text-sm">
                        Max: 0.00
                      </span>
                    </div>
                    <div className="bg-background border-border relative border">
                      <div className="absolute top-1/2 left-3 flex -translate-y-1/2 transform items-center space-x-2">
                        <SolanaIconSvg width={20} height={20} />
                        <span className="text-sm font-medium text-white">
                          SOL
                        </span>
                      </div>
                      <input
                        type="number"
                        placeholder=""
                        className="w-full [appearance:textfield] bg-transparent py-3 pr-4 pl-20 text-right text-2xl font-medium text-white focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        defaultValue="0"
                      />
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="mb-6 flex justify-between text-sm">
                    <span className="text-muted-foreground">Balance</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white">0.00</span>
                      <SolanaIconSvg width={16} height={16} />
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    className={`w-full cursor-pointer py-3 text-sm font-medium ${
                      depositWithdrawTab === "deposit"
                        ? "bg-profit hover:bg-profit/90 text-black"
                        : "bg-loss hover:bg-loss/90 text-white"
                    }`}
                  >
                    {depositWithdrawTab === "deposit"
                      ? "Confirm Deposit"
                      : "Request Withdrawal"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Main Content */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left Column - Overview Content */}
              <div className="space-y-6 lg:col-span-2">
                {/* Strategy Description */}
                <Card className="bg-card border-border rounded-none">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-white">
                      Strategy Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-white">
                        Description
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {vaultData.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-2 text-sm font-medium text-white">
                        Strategy Type
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className="text-primary border-primary rounded-none"
                        >
                          {vaultData.strategy}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`rounded-none ${
                            vaultData.risk === "Low"
                              ? "text-profit border-profit"
                              : vaultData.risk === "Medium"
                                ? "border-yellow-400 text-yellow-400"
                                : "text-loss border-loss"
                          }`}
                        >
                          {vaultData.risk} Risk
                        </Badge>
                      </div>
                    </div>

                    {/* Strategy details section removed - not available in API */}
                  </CardContent>
                </Card>

                {/* Fees and allocation sections removed - not available in VaultWithMetrics interface */}

                {/* Vault Information */}
                <Card className="bg-card border-border rounded-none">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-white">
                      Vault Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">
                            Deposit Asset
                          </span>
                          <div className="flex items-center space-x-2">
                            <SolanaIconSvg width={16} height={16} />
                            <span className="font-medium text-white">
                              {vaultData.depositAsset}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">
                            Min Deposit
                          </span>
                          <span className="font-medium text-white">
                            {vaultData.minDeposit} SOL
                          </span>
                        </div>
                        {/* Max deposit removed - not available in VaultWithMetrics */}
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">
                            Vault Age
                          </span>
                          <span className="font-medium text-white">
                            {vaultData.age}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">
                            Status
                          </span>
                          <Badge
                            variant="outline"
                            className="text-profit border-profit rounded-none"
                          >
                            {vaultData.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Deposit/Withdraw Panel */}
              <div className="space-y-6">
                {/* Deposit/Withdraw Panel */}
                <Card className="bg-card border-border rounded-none">
                  <CardContent className="p-6">
                    {/* Tab Buttons */}
                    <div className="mb-6 flex">
                      <button
                        onClick={() => setDepositWithdrawTab("deposit")}
                        className={`flex-1 cursor-pointer px-4 py-2 text-sm font-medium ${
                          depositWithdrawTab === "deposit"
                            ? "bg-profit text-black"
                            : "text-muted-foreground bg-transparent hover:text-white"
                        }`}
                      >
                        Deposit
                      </button>
                      <button
                        onClick={() => setDepositWithdrawTab("withdraw")}
                        className={`flex-1 cursor-pointer px-4 py-2 text-sm font-medium ${
                          depositWithdrawTab === "withdraw"
                            ? "bg-loss text-white"
                            : "text-muted-foreground bg-transparent hover:text-white"
                        }`}
                      >
                        Withdraw
                      </button>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground mb-6 text-xs">
                      {depositWithdrawTab === "deposit"
                        ? "Deposited funds are subject to a 1 day redemption period."
                        : "After the 1 day redemption period, your funds can be withdrawn to your wallet.\n\nThe maximum withdrawal amount is based on share value at request time, though the final amount may be lower."}
                    </p>

                    {/* Amount Input */}
                    <div className="mb-6">
                      <div className="mb-2 flex items-center justify-between">
                        <label className="text-muted-foreground text-sm">
                          Amount
                        </label>
                        <span className="text-muted-foreground text-sm">
                          Max: 0.00
                        </span>
                      </div>
                      <div className="bg-background border-border relative border">
                        <div className="absolute top-1/2 left-3 flex -translate-y-1/2 transform items-center space-x-2">
                          <SolanaIconSvg width={20} height={20} />
                          <span className="text-sm font-medium text-white">
                            SOL
                          </span>
                        </div>
                        <input
                          type="number"
                          placeholder=""
                          className="w-full [appearance:textfield] bg-transparent py-3 pr-4 pl-20 text-right text-2xl font-medium text-white focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          defaultValue="0"
                        />
                      </div>
                    </div>

                    {/* Balance */}
                    <div className="mb-6 flex justify-between text-sm">
                      <span className="text-muted-foreground">Balance</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-white">0.00</span>
                        <SolanaIconSvg width={16} height={16} />
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      className={`w-full cursor-pointer py-3 text-sm font-medium ${
                        depositWithdrawTab === "deposit"
                          ? "bg-profit hover:bg-profit/90 text-black"
                          : "bg-loss hover:bg-loss/90 text-white"
                      }`}
                    >
                      {depositWithdrawTab === "deposit"
                        ? "Confirm Deposit"
                        : "Request Withdrawal"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
