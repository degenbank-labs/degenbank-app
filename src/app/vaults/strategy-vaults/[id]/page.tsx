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
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useVaults, VaultWithMetrics } from "@/hooks/useVaults";
import {
  useVaultPerformance,
  PerformanceDataPoint,
} from "@/hooks/useVaultPerformance";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useVaultOperations } from "@/hooks/useVaultOperations";
import { useAuth } from "@/hooks/useAuth";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { UsdcIconSvg } from "@/components/svg";

// Using VaultWithMetrics interface from useVaults hook instead of local VaultData interface

export default function VaultDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const vaultId = params.id as string;
  
  // Get referrer information from URL parameters
  const fromPage = searchParams.get('from');
  const battleId = searchParams.get('battleId');
  const [activeTab, setActiveTab] = useState("vault-performance");
  const [selectedPeriod, setSelectedPeriod] = useState<"14D" | "30D">("30D");
  const [selectedChart, setSelectedChart] = useState<
    "roi" | "sharePrice" | "vaultBalance"
  >("roi");
  const [depositWithdrawTab, setDepositWithdrawTab] = useState<
    "deposit" | "withdraw"
  >("deposit");
  const [amount, setAmount] = useState<string>("");

  // Use real API data
  const { getVaultById, loading, error } = useVaults();
  const [vaultData, setVaultData] = useState<VaultWithMetrics | null>(null);

  // Auth and vault operations
  const { authenticated, walletAddress, login } = useAuth();
  const { deposit, withdraw, depositState, withdrawState, isConnected } =
    useVaultOperations();

  // User balance
  const { balance, isLoading: balanceLoading, tokenSymbol } = useTokenBalance();

  // Use real performance data
  const {
    performanceData,
    loading: performanceLoading,
    error: performanceError,
    refetch: refetchPerformance,
  } = useVaultPerformance(vaultId);

  // Use real leaderboard data
  const { managers: leaderboardData } = useLeaderboard();

  // Handle dynamic back navigation
  const handleBackNavigation = () => {
    if (fromPage === 'battle' && battleId) {
      // Navigate back to specific battle detail page
      router.push(`/arena/battle/${battleId}`);
    } else {
      // Default navigation to vaults list
      router.push('/vaults/strategy-vaults');
    }
  };

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
  }, [vaultId]); // Removed getVaultById from dependencies to prevent unnecessary re-renders

  // Refetch performance data when period changes
  useEffect(() => {
    if (vaultId) {
      refetchPerformance(selectedPeriod);
    }
  }, [selectedPeriod, vaultId]);

  // Handle deposit
  const handleDeposit = async () => {
    if (!authenticated) {
      login();
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    try {
      // Pre-validate battle data if vault is associated with a battle
      if (vaultData?.battle_id) {
        console.log("Validating battle data before deposit...");
        try {
          const { apiService } = await import("@/lib/api");
          const battleData = await apiService.getBattle(
            vaultData.battle_id.toString()
          );

          if (!battleData) {
            throw new Error(
              `Battle data not found for battle ID: ${vaultData.battle_id}`
            );
          }

          if (!battleData.pda_address && !battleData.pda_address) {
            throw new Error(
              `Battle ${battleData.battle_id} does not have a valid PDA address. The battle may not be properly initialized.`
            );
          }

          console.log("✓ Battle data validated:", {
            battle_id: battleData.battle_id,
            battle_name: battleData.battle_name,
            pda_address: battleData.pda_address || battleData.pda_address,
            battle_status: battleData.battle_status,
          });
        } catch (battleError) {
          console.error("Battle validation failed:", battleError);
          throw new Error(
            `Battle validation failed: ${battleError instanceof Error ? battleError.message : "Unknown error"}`
          );
        }
      }

      const result = await deposit(vaultId, parseFloat(amount));
      if (result.success) {
        setAmount("");
        // Optionally refetch vault data to update balances
      }
    } catch (error) {
      console.error("Deposit failed:", error);
    }
  };

  // Handle withdraw
  const handleWithdraw = async () => {
    if (!authenticated) {
      login();
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    try {
      const result = await withdraw(vaultId, parseFloat(amount));
      if (result.success) {
        setAmount("");
        // Optionally refetch vault data to update balances
      }
    } catch (error) {
      console.error("Withdraw failed:", error);
    }
  };

  // Handle max button click
  const handleMaxClick = () => {
    if (depositWithdrawTab === "deposit") {
      // Use user's actual balance for deposit
      setAmount(balance.toString());
    } else {
      // For withdraw, we would need user's vault position
      // For now, use 0 as placeholder until we implement vault position tracking
      setAmount("0");
    }
  };

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
          <Button onClick={handleBackNavigation}>Back</Button>
        </div>
      </div>
    );
  }

  // Get chart data based on selected chart type and period
  const getChartData = () => {
    // Use real performance data only
    const currentData = performanceData;

    if (!currentData || currentData.length === 0) {
      return [];
    }

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
          value: item.vaultBalance,
        }));
      default:
        return currentData.map((item) => ({
          ...item,
          value: item.roi,
        }));
    }
  };

  // Get chart label and format based on selected chart type
  const getChartConfig = () => {
    const currentData = performanceData;

    if (!currentData || currentData.length === 0) {
      return {
        label: "ROI (%)",
        format: (value: number) => `${value.toFixed(2)}%`,
        color: "#34CB88",
        domain: [0, 100],
      };
    }

    switch (selectedChart) {
      case "roi":
        // Determine if we have negative values in ROI data
        const hasNegativeROI = currentData.some(
          (item: PerformanceDataPoint) => item.roi < 0
        );
        const maxROI = Math.max(
          ...currentData.map((item: PerformanceDataPoint) => item.roi)
        );
        const minROI = Math.min(
          ...currentData.map((item: PerformanceDataPoint) => item.roi)
        );

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
          label: "Share Price (USDC)",
          format: (value: number) => `${value.toFixed(3)} USDC`,
          color: "#6fb7a5",
          hasNegativeValues: false,
        };
      case "vaultBalance":
        return {
          label: "Vault Balance (M USDC)",
          format: (value: number) => `${value.toFixed(2)}M USDC`,
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

  const formatPercentage = (percentage: number | null | undefined) => {
    // Convert to number and handle null/undefined/invalid values
    const numericPercentage = Number(percentage) || 0;
    return `${numericPercentage >= 0 ? "+" : ""}${numericPercentage.toFixed(2)}%`;
  };

  const formatAPY = (apy: number | null | undefined) => {
    // Convert to number and handle null/undefined/invalid values
    const numericAPY = Number(apy) || 0;
    return `${numericAPY.toFixed(1)}%`;
  };

  const getManagerBadge = (managerType?: string) => {
    // Ensure managerType has a fallback value
    const safeManagerType = managerType || "verified";

    switch (safeManagerType) {
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
        return (
          <div className="flex items-center space-x-1">
            <ShieldCheckIcon className="text-primary h-4 w-4" />
          </div>
        );
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header with Back Button */}
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <button
          onClick={handleBackNavigation}
          className="text-muted-foreground flex items-center text-sm hover:text-white cursor-pointer"
        >
          ← Back
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Main Header */}
        <div className="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-start">
          <div className="flex w-full flex-col items-start space-y-3 sm:w-auto sm:flex-row sm:space-y-0 sm:space-x-4">
            {/* Symbol Image */}
            <div className="flex-shrink-0">
              <div className="bg-primary/20 flex h-12 w-12 items-center justify-center rounded-lg">
                <UsdcIconSvg className="h-8 w-8" />
              </div>
            </div>

            {/* Vault Info */}
            <div className="w-full sm:w-auto">
              <div className="mb-1 flex items-center space-x-3">
                <h1 className="text-xl font-bold text-white sm:text-2xl">
                  {vaultData?.vault_name || "Vault Name"}
                </h1>
              </div>
              <div className="flex flex-col space-y-2 text-sm sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-1">
                  <span className="text-muted-foreground">Manager:</span>
                  {getManagerBadge(vaultData?.managerType)}
                  <span className="font-medium text-white">
                    {vaultData?.manager?.manager_name || "Unknown Manager"}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">Deposit:</span>
                    <UsdcIconSvg className="h-4 w-4" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">Trading:</span>
                    <UsdcIconSvg className="h-4 w-4" />
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
                {formatAPY(vaultData?.apy)}
              </div>
            </div>
            <div className="border-border border-b px-4 py-4 sm:border-r sm:border-b-0 sm:px-8">
              <div className="text-muted-foreground text-xs tracking-wide uppercase">
                Strategy
              </div>
              <div className="mt-1 text-base font-bold text-white sm:text-lg">
                {vaultData?.vault_strategy || "N/A"}
              </div>
            </div>
            <div className="border-border border-r px-4 py-4 sm:px-8">
              <div className="text-muted-foreground text-xs tracking-wide uppercase">
                TVL
              </div>
              <div className="mt-1 text-base font-bold text-white sm:text-lg">
                ${" "}
                {vaultData?.total_value_locked
                  ? (Number(vaultData.total_value_locked) / 1000000).toFixed(
                      1
                    ) + "M"
                  : vaultData?.total_value_locked && typeof vaultData.total_value_locked === "number"
                  ? (vaultData.total_value_locked / 1000000).toFixed(1) + "M"
                    : "0.0M"}
              </div>
            </div>
            <div className="px-4 py-4 sm:px-8">
              <div className="text-muted-foreground text-xs tracking-wide uppercase">
                Risk Level
              </div>
              <div className="mt-1 text-base font-bold text-white sm:text-lg">
                {vaultData?.risk_level || "Medium"}
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
                        <button
                          onClick={handleMaxClick}
                          className="text-muted-foreground cursor-pointer text-sm hover:text-white"
                        >
                          Max: {balanceLoading ? "..." : balance.toFixed(4)}
                        </button>
                      </div>
                      <div className="bg-background border-border relative border">
                        <div className="absolute top-1/2 left-3 flex -translate-y-1/2 transform items-center space-x-2">
                          <UsdcIconSvg width={20} height={20} />
                          <span className="text-sm font-medium text-white">
                            {tokenSymbol}
                          </span>
                        </div>
                        <input
                          type="number"
                          placeholder="0"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full [appearance:textfield] bg-transparent py-3 pr-4 pl-20 text-right text-2xl font-medium text-white focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                      </div>
                    </div>

                    {/* Balance */}
                    <div className="mb-6 flex justify-between text-sm">
                      <span className="text-muted-foreground">Balance</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-white">
                          {balanceLoading
                            ? "Loading..."
                            : `${balance.toFixed(4)} ${tokenSymbol}`}
                        </span>
                        <UsdcIconSvg width={16} height={16} />
                      </div>
                    </div>

                    {/* Action Button */}
                    {!isConnected ? (
                      <Button
                        onClick={login}
                        className="w-full cursor-pointer bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Login to{" "}
                        {depositWithdrawTab === "deposit"
                          ? "Deposit"
                          : "Withdraw"}
                      </Button>
                    ) : (
                      <Button
                        onClick={
                          depositWithdrawTab === "deposit"
                            ? handleDeposit
                            : handleWithdraw
                        }
                        disabled={
                          depositWithdrawTab === "deposit"
                            ? depositState.isLoading
                            : withdrawState.isLoading
                        }
                        className={`w-full cursor-pointer py-3 text-sm font-medium ${
                          depositWithdrawTab === "deposit"
                            ? "bg-profit hover:bg-profit/90 text-black"
                            : "bg-loss hover:bg-loss/90 text-white"
                        }`}
                      >
                        {depositWithdrawTab === "deposit"
                          ? depositState.isLoading
                            ? "Processing..."
                            : "Confirm Deposit"
                          : withdrawState.isLoading
                            ? "Processing..."
                            : "Request Withdrawal"}
                      </Button>
                    )}

                    {/* Error Messages */}
                    {depositState.error && depositWithdrawTab === "deposit" && (
                      <div className="mt-4 rounded border border-red-500/30 bg-red-900/20 p-3 text-sm text-red-400">
                        {depositState.error}
                      </div>
                    )}
                    {withdrawState.error &&
                      depositWithdrawTab === "withdraw" && (
                        <div className="mt-4 rounded border border-red-500/30 bg-red-900/20 p-3 text-sm text-red-400">
                          {withdrawState.error}
                        </div>
                      )}

                    {/* Success Messages */}
                    {depositState.txSignature &&
                      !depositState.error &&
                      depositWithdrawTab === "deposit" && (
                        <div className="mt-4 rounded border border-green-500/30 bg-green-900/20 p-3 text-sm text-green-400">
                          Deposit successful! Transaction:{" "}
                          {depositState.txSignature}
                        </div>
                      )}
                    {withdrawState.txSignature &&
                      !withdrawState.error &&
                      depositWithdrawTab === "withdraw" && (
                        <div className="mt-4 rounded border border-green-500/30 bg-green-900/20 p-3 text-sm text-green-400">
                          Withdrawal request successful! Transaction:{" "}
                          {withdrawState.txSignature}
                        </div>
                      )}

                    {/* Error Messages */}
                    {depositState.error && depositWithdrawTab === "deposit" && (
                      <div className="mt-4 rounded border border-red-500/30 bg-red-900/20 p-3 text-sm text-red-400">
                        {depositState.error}
                      </div>
                    )}
                    {withdrawState.error &&
                      depositWithdrawTab === "withdraw" && (
                        <div className="mt-4 rounded border border-red-500/30 bg-red-900/20 p-3 text-sm text-red-400">
                          {withdrawState.error}
                        </div>
                      )}

                    {/* Success Messages */}
                    {depositState.txSignature &&
                      !depositState.error &&
                      depositWithdrawTab === "deposit" && (
                        <div className="mt-4 rounded border border-green-500/30 bg-green-900/20 p-3 text-sm text-green-400">
                          Deposit successful! Transaction:{" "}
                          {depositState.txSignature}
                        </div>
                      )}
                    {withdrawState.txSignature &&
                      !withdrawState.error &&
                      depositWithdrawTab === "withdraw" && (
                        <div className="mt-4 rounded border border-green-500/30 bg-green-900/20 p-3 text-sm text-green-400">
                          Withdrawal request successful! Transaction:{" "}
                          {withdrawState.txSignature}
                        </div>
                      )}
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
                      <UsdcIconSvg width={16} height={16} />
                      {/* TODO: Integrate with user cumulative deposits API */}
                      <span className="font-medium text-white">0</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* TODO: Integrate with user performance percentage API */}
                    <span className="text-sm text-[#6B7280]">0%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <Tooltip content="The number of vault shares you currently own">
                      <span className="cursor-help border-b border-dotted border-[#6B7280] text-sm text-[#6B7280]">
                        Vault Shares
                      </span>
                    </Tooltip>
                    {/* TODO: Integrate with user vault shares API */}
                    <span className="font-medium text-white">0</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <Tooltip content="The largest single-day loss experienced by your position">
                      <span className="cursor-help border-b border-dotted border-[#6B7280] text-sm text-[#6B7280]">
                        Max Daily Drawdown
                      </span>
                    </Tooltip>
                    {/* TODO: Integrate with user max daily drawdown API */}
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
                      <UsdcIconSvg width={16} height={16} />
                      {/* TODO: Integrate with user fees paid API */}
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
                      <UsdcIconSvg width={16} height={16} />
                      {/* TODO: Integrate with user high-water mark API */}
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
                      <button
                        onClick={handleMaxClick}
                        className="text-muted-foreground cursor-pointer text-sm hover:text-white"
                      >
                        Max: {balanceLoading ? "..." : balance.toFixed(4)}
                      </button>
                    </div>
                    <div className="bg-background border-border relative border">
                      <div className="absolute top-1/2 left-3 flex -translate-y-1/2 transform items-center space-x-2">
                        <UsdcIconSvg width={20} height={20} />
                        <span className="text-sm font-medium text-white">
                          {tokenSymbol}
                        </span>
                      </div>
                      <input
                        type="number"
                        placeholder="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full [appearance:textfield] bg-transparent py-3 pr-4 pl-20 text-right text-2xl font-medium text-white focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="mb-6 flex justify-between text-sm">
                    <span className="text-muted-foreground">Balance</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white">
                        {balanceLoading
                          ? "Loading..."
                          : `${balance.toFixed(4)} ${tokenSymbol}`}
                      </span>
                      <UsdcIconSvg width={16} height={16} />
                    </div>
                  </div>

                  {/* Action Button */}
                  {!isConnected ? (
                    <Button
                      onClick={login}
                      className="w-full cursor-pointer bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Login to{" "}
                      {depositWithdrawTab === "deposit"
                        ? "Deposit"
                        : "Withdraw"}
                    </Button>
                  ) : (
                    <Button
                      onClick={
                        depositWithdrawTab === "deposit"
                          ? handleDeposit
                          : handleWithdraw
                      }
                      disabled={
                        depositWithdrawTab === "deposit"
                          ? depositState.isLoading
                          : withdrawState.isLoading
                      }
                      className={`w-full cursor-pointer py-3 text-sm font-medium ${
                        depositWithdrawTab === "deposit"
                          ? "bg-profit hover:bg-profit/90 text-black"
                          : "bg-loss hover:bg-loss/90 text-white"
                      }`}
                    >
                      {depositWithdrawTab === "deposit"
                        ? depositState.isLoading
                          ? "Processing..."
                          : "Confirm Deposit"
                        : withdrawState.isLoading
                          ? "Processing..."
                          : "Request Withdrawal"}
                    </Button>
                  )}

                  {/* Error Messages */}
                  {depositState.error && depositWithdrawTab === "deposit" && (
                    <div className="mt-4 rounded border border-red-500/30 bg-red-900/20 p-3 text-sm text-red-400">
                      {depositState.error}
                    </div>
                  )}
                  {withdrawState.error && depositWithdrawTab === "withdraw" && (
                    <div className="mt-4 rounded border border-red-500/30 bg-red-900/20 p-3 text-sm text-red-400">
                      {withdrawState.error}
                    </div>
                  )}

                  {/* Success Messages */}
                  {depositState.txSignature &&
                    !depositState.error &&
                    depositWithdrawTab === "deposit" && (
                      <div className="mt-4 rounded border border-green-500/30 bg-green-900/20 p-3 text-sm text-green-400">
                        Deposit successful! Transaction:{" "}
                        {depositState.txSignature}
                      </div>
                    )}
                  {withdrawState.txSignature &&
                    !withdrawState.error &&
                    depositWithdrawTab === "withdraw" && (
                      <div className="mt-4 rounded border border-green-500/30 bg-green-900/20 p-3 text-sm text-green-400">
                        Withdrawal request successful! Transaction:{" "}
                        {withdrawState.txSignature}
                      </div>
                    )}
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
                          {vaultData.vault_strategy}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`rounded-none ${
                            vaultData.risk_level === "Low"
                              ? "text-profit border-profit"
                              : vaultData.risk_level === "Medium"
                                ? "border-yellow-400 text-yellow-400"
                                : "text-loss border-loss"
                          }`}
                        >
                          {vaultData.risk_level} Risk
                        </Badge>
                      </div>
                    </div>

                    {/* Strategy details section removed - not available in API */}
                  </CardContent>
                </Card>

                {/* Vault Address Card */}
                <Card className="bg-card border-border rounded-none">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-white">
                      Vault Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <span className="text-muted-foreground mb-1 block text-sm">
                          Contract Address
                        </span>
                        <span className="font-mono text-sm break-all text-white">
                          {vaultData?.vault_address || "N/A"}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-border hover:bg-background/50 ml-4 flex items-center space-x-2 text-white"
                        onClick={() => {
                          if (vaultData?.vault_address) {
                            window.open(
                              `https://solscan.io/account/${vaultData.vault_address}`,
                              "_blank"
                            );
                          }
                        }}
                      >
                        <span>View on Explorer</span>
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </Button>
                    </div>
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
                            <UsdcIconSvg width={16} height={16} />
                            <span className="font-medium text-white">
                              {vaultData.deposit_asset}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">
                            Min Deposit
                          </span>
                          <span className="font-medium text-white">
                            {vaultData.min_deposit} USDC
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
                            {vaultData.battle_status}
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
                        <button
                          onClick={handleMaxClick}
                          className="text-muted-foreground cursor-pointer text-sm hover:text-white"
                        >
                          Max: {balanceLoading ? "..." : balance.toFixed(4)}
                        </button>
                      </div>
                      <div className="bg-background border-border relative border">
                        <div className="absolute top-1/2 left-3 flex -translate-y-1/2 transform items-center space-x-2">
                          <UsdcIconSvg width={20} height={20} />
                          <span className="text-sm font-medium text-white">
                            {tokenSymbol}
                          </span>
                        </div>
                        <input
                          type="number"
                          placeholder="0"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full [appearance:textfield] bg-transparent py-3 pr-4 pl-20 text-right text-2xl font-medium text-white focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                      </div>
                    </div>

                    {/* Balance */}
                    <div className="mb-6 flex justify-between text-sm">
                      <span className="text-muted-foreground">Balance</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-white">
                          {balanceLoading
                            ? "Loading..."
                            : `${balance.toFixed(4)} ${tokenSymbol}`}
                        </span>
                        <UsdcIconSvg width={16} height={16} />
                      </div>
                    </div>

                    {/* Action Button */}
                    {!isConnected ? (
                      <Button
                        onClick={login}
                        className="w-full cursor-pointer bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Login to{" "}
                        {depositWithdrawTab === "deposit"
                          ? "Deposit"
                          : "Withdraw"}
                      </Button>
                    ) : (
                      <Button
                        onClick={
                          depositWithdrawTab === "deposit"
                            ? handleDeposit
                            : handleWithdraw
                        }
                        disabled={
                          depositWithdrawTab === "deposit"
                            ? depositState.isLoading
                            : withdrawState.isLoading
                        }
                        className={`w-full cursor-pointer py-3 text-sm font-medium ${
                          depositWithdrawTab === "deposit"
                            ? "bg-profit hover:bg-profit/90 text-black"
                            : "bg-loss hover:bg-loss/90 text-white"
                        }`}
                      >
                        {depositWithdrawTab === "deposit"
                          ? depositState.isLoading
                            ? "Processing..."
                            : "Confirm Deposit"
                          : withdrawState.isLoading
                            ? "Processing..."
                            : "Request Withdrawal"}
                      </Button>
                    )}
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
