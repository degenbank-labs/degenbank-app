"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MainNavbar } from "@/components/main-navbar";
import LightRays from "@/components/ui/light-rays";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ClockIcon,
  UsersIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Loader2, Swords } from "lucide-react";
import { useBattles } from "@/hooks/useBattles";
import { useBattleVaults } from "@/hooks/useBattleVaults";
import { getBattlePhases, getBattlePhase } from "@/utils/battleStatus";

export default function BattleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const battleId = params.id as string;
  const [selectedVault, setSelectedVault] = useState<string | null>(null);

  // Use battles hook for real data
  const { getBattleById, loading, error } = useBattles();
  const [battle, setBattle] = useState<
    import("@/hooks/useBattles").BattleWithMetrics | null
  >(null);

  // Use battle vaults hook for real vault data
  const {
    vaults: battleVaults,
    loading: vaultsLoading,
    error: vaultsError,
  } = useBattleVaults(battleId);

  useEffect(() => {
    const fetchBattle = async () => {
      if (battleId) {
        try {
          const battleData = await getBattleById(battleId);
          setBattle(battleData);
        } catch (err) {
          console.error("Failed to fetch battle:", err);
        }
      }
    };
    fetchBattle();
  }, [battleId, getBattleById]);

  // Real-time duration update
  useEffect(() => {
    const interval = setInterval(() => {
      if (battle) {
        const fetchBattle = async () => {
          try {
            const battleData = await getBattleById(battleId);
            setBattle(battleData);
          } catch (err) {
            console.error("Failed to refresh battle:", err);
          }
        };
        fetchBattle();
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [battle, battleId, getBattleById]);

  // Get dynamic battle phases based on timestamps
  const battlePhases = battle
    ? getBattlePhases(battle.battle_start, battle.battle_end)
    : [];

  // Handle Enter Battle navigation
  const handleEnterBattle = (vaultId: string) => {
    router.push(
      `/vaults/strategy-vaults/${vaultId}?from=battle&battleId=${battleId}`
    );
  };

  // Sort vaults by performance for leaderboard (already sorted in hook)
  const sortedVaults = battleVaults;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-neutral-200";
      case "Medium":
        return "text-neutral-200";
      case "High":
        return "text-neutral-200";
      case "Extreme":
        return "text-neutral-200";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <ShieldCheckIcon className="text-primary h-4 w-4" />;
      case "warning":
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-400" />;
      default:
        return <ShieldCheckIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <MainNavbar />
        <div className="relative overflow-hidden">
          <LightRays />
          <div className="relative z-10 flex min-h-[80vh] items-center justify-center">
            <div className="text-center">
              <Loader2 className="text-primary mx-auto mb-4 h-8 w-8 animate-spin" />
              <p className="text-neutral-400">Loading battle details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <MainNavbar />
        <div className="relative overflow-hidden">
          <LightRays />
          <div className="relative z-10 flex min-h-[80vh] items-center justify-center">
            <div className="text-center">
              <ExclamationTriangleIcon className="mx-auto mb-4 h-12 w-12 text-red-500" />
              <h2 className="mb-2 text-xl font-semibold">
                Failed to load battle
              </h2>
              <p className="mb-4 text-neutral-400">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <span className="text-white">
                  {battle?.battle_name || "Battle Arena"}{" "}
                </span>
              </h1>

              <p className="mx-auto mb-6 max-w-3xl font-sans text-lg text-white/80 md:text-xl">
                {battle?.battle_description}
              </p>

              {/* Battle Status */}
              <div className="mb-6 flex flex-wrap items-center justify-center gap-4">
                <Badge
                  variant="outline"
                  className="border-primary text-primary rounded-none px-4 py-2"
                >
                  {battle?.arena_type || "DCA Arena"} -{" "}
                  {battle
                    ? getBattlePhase(battle.battle_start, battle.battle_end)
                    : "Phase #1"}
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-none border-purple-400 px-4 py-2 text-purple-400"
                >
                  <ClockIcon className="mr-2 h-4 w-4" />
                  {battle?.timeRemaining || "Loading..."}
                </Badge>
              </div>
            </div>

            {/* Battle Phases Progress */}
            <div className="mx-auto mb-12 max-w-4xl">
              <div className="grid grid-cols-3 gap-4">
                {battlePhases.map((phase) => (
                  <div key={phase.name} className="text-center">
                    <div
                      className={`mb-2 h-2 w-full ${
                        phase.status === "completed"
                          ? "bg-primary"
                          : phase.status === "active"
                            ? "to-primary from-primary bg-gradient-to-r"
                            : "bg-neutral-800"
                      }`}
                    />
                    <h3
                      className={`text-sm font-semibold ${
                        phase.status === "active"
                          ? "text-primary"
                          : phase.status === "completed"
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
                    <Swords className="text-primary mr-3 h-8 w-8" />
                    <span className="text-white">Vault Battle Leaderboard</span>
                  </h2>
                  <Badge
                    variant="outline"
                    className="border-primary text-primary rounded-none"
                  >
                    Live Performance
                  </Badge>
                </div>

                {/* Vault Cards */}
                <div className="space-y-4">
                  {sortedVaults.map((vault, index) => (
                    <Card
                      key={vault.vault_id}
                      className={`bg-card/50 border-border/50 hover:bg-card/70 rounded-none backdrop-blur-sm transition-all duration-300 ${
                        selectedVault === vault.vault_id
                          ? "border-primary ring-primary/30 shadow-primary/20 shadow-lg ring-2"
                          : "border-border/50"
                      }`}
                      onClick={() => setSelectedVault(vault.vault_id)}
                    >
                      <CardContent className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h3 className="font-cirka text-2xl font-bold text-white">
                                {vault.vault_name}
                              </h3>
                              <p className="text-sm text-white/60">
                                {vault.vault_strategy}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(vault.battle_status || "active")}
                            <span
                              className={`text-sm font-semibold ${getRiskColor(vault.risk_level || "Medium")}`}
                            >
                              {vault.risk_level || "Medium"} Risk
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
                                (vault.apy || 0) > 0
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {(vault.apy || 0) > 0 ? "+" : ""}
                              {(vault.apy || 0).toFixed(1)}%
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 text-xs text-white/60">APY</p>
                            <p className="text-lg font-bold text-white">
                              {(vault.apy || 0).toFixed(1)}%
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 text-xs text-white/60">TVL</p>
                            <p className="text-lg font-bold text-white">
                              {/* TODO: Replace with actual TVL from backend */}
                              $ 0K
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 text-xs text-white/60">
                              Stakers
                            </p>
                            <p className="flex items-center text-lg font-bold text-white">
                              <UsersIcon className="mr-1 h-4 w-4" />
                              {/* TODO: Replace with actual participants count from backend */}
                              0
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="mb-1 flex justify-between text-xs text-white/60">
                            <span>Performance Progress</span>
                            <span>
                              {(vault.apy || 0) > 0 ? "+" : ""}
                              {(vault.apy || 0).toFixed(1)}%
                            </span>
                          </div>
                          <Progress
                            value={Math.max(
                              0,
                              Math.min(100, ((vault.apy || 0) + 10) * 5)
                            )}
                            className="h-2"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-xs text-white/60">
                            Manager:{" "}
                            <span className="text-primary">
                              {vault.managerName}
                            </span>
                          </p>
                          <Button
                            size="sm"
                            variant="default"
                            className="border-primary hover:bg-primary/80 cursor-pointer font-semibold text-black transition-all duration-300 hover:text-black"
                            onClick={() => handleEnterBattle(vault.vault_id)}
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
                <Card className="bg-card/50 border-border/50 rounded-none backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <span className="font-bold text-white">
                        Arena Statistics
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-white/60">Total TVL</span>
                      <span className="font-bold text-white">
                        {/* TODO: Replace with actual total TVL from backend */}
                        $ 0K
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Active Vaults</span>
                      <span className="font-bold text-white">
                        {battleVaults.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Total Stakers</span>
                      <span className="font-bold text-white">
                        {/* TODO: Replace with actual total participants from backend */}
                        0
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-white/20 pt-3">
                      <span className="text-primary font-semibold">
                        Prize Pool
                      </span>
                      <span className="text-primary text-lg font-bold">
                        ${((battle?.prize_pool || 0) / 1000).toFixed(1)}K
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Battle Duration</span>
                      <span className="font-bold text-white">
                        {battle?.timeRemaining || "Loading..."}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Commentary */}
                <Card className="bg-card/50 border-border/50 rounded-none backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <span className="font-bold text-white">
                        Battle Commentary
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p className="text-white/80 italic">
                        &ldquo;
                        <span className="text-green-400">Solana DCA</span>{" "}
                        dominates with{" "}
                        <span className="text-primary">15.2% gains</span>, while{" "}
                        <span className="text-blue-400">Raydium DCA</span>{" "}
                        trails at <span className="text-blue-400">9.5%</span> —
                        the gap widens as the battle intensifies!&rdquo;
                      </p>
                      <p className="text-primary/80 text-xs font-semibold">
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
