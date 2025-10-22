"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrophyIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { MainNavbar } from "@/components/main-navbar";
import Cubes from "@/components/ui/cubes";
import LightRays from "@/components/ui/light-rays";
import CubeLoader from "@/components/ui/cube-loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useBattles } from "@/hooks/useBattles";

// Import BattleWithMetrics type
type BattleWithMetrics = {
  id: string;
  name: string;
  type: string;
  status: string;
  phase: string;
  timeRemaining: string;
  totalTVL: number;
  activeVaults: number;
  participants: number;
  prizePool: number;
  description: string;
  color: string;
  cubePosition: { row: number; col: number };
};

// Using BattleWithMetrics interface from useBattles hook

export default function BattleArenaPage() {
  const router = useRouter();
  const [hoveredArena, setHoveredArena] = useState<string | null>(null);
  const [selectedCube, setSelectedCube] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use battles hook for real data
  const { battles: arenas, stats, loading, error, refreshBattles } = useBattles();

  // Calculate dynamic grid size based on number of battles
  const calculateGridSize = (battleCount: number): number => {
    if (battleCount <= 1) return 1;
    if (battleCount <= 4) return 2;
    if (battleCount <= 9) return 3;
    if (battleCount <= 16) return 4;
    return Math.ceil(Math.sqrt(battleCount));
  };

  const gridSize = calculateGridSize(arenas.length);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ongoing Battle":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Open Deposit":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Starting Soon":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Coming Soon":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const handleCubeClick = (arena: BattleWithMetrics, row: number, col: number) => {
    setIsLoading(true);

    // Simulate loading time before navigation
    setTimeout(() => {
      router.push(`/arena/battle/${arena.id}`);
    }, 2000);
  };

  const handleCubeHover = (
    arena: BattleWithMetrics | null,
    row: number,
    col: number
  ) => {
    setHoveredArena(arena ? arena.id : null);
  };

  const currentArena = hoveredArena
    ? arenas.find((a) => a.id === hoveredArena)
    : null;

  // Loading state
  if (loading) {
    return (
      <div className="h-screen w-full overflow-hidden bg-black text-white">
        <MainNavbar />
        <div className="relative flex h-full flex-col overflow-hidden">
          <div className="absolute inset-0 z-0">
            <LightRays
              raysOrigin="top-center"
              raysColor="#6fb7a5"
              raysSpeed={0.6}
              lightSpread={0.6}
              rayLength={5.0}
              pulsating={true}
              fadeDistance={2.0}
              followMouse={false}
              mouseInfluence={0.0}
              noiseAmount={0.012}
              distortion={0.008}
              className="opacity-80"
            />
          </div>
          <div className="relative z-10 flex h-full items-center justify-center">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-white/80">Loading battle arenas...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen w-full overflow-hidden bg-black text-white">
        <MainNavbar />
        <div className="relative flex h-full flex-col overflow-hidden">
          <div className="absolute inset-0 z-0">
            <LightRays
              raysOrigin="top-center"
              raysColor="#6fb7a5"
              raysSpeed={0.6}
              lightSpread={0.6}
              rayLength={5.0}
              pulsating={true}
              fadeDistance={2.0}
              followMouse={false}
              mouseInfluence={0.0}
              noiseAmount={0.012}
              distortion={0.008}
              className="opacity-80"
            />
          </div>
          <div className="relative z-10 flex h-full items-center justify-center">
            <div className="text-center space-y-4">
              <ExclamationTriangleIcon className="h-8 w-8 mx-auto text-red-500" />
              <p className="text-red-500">Error loading battle arenas: {error}</p>
              <Button onClick={refreshBattles} variant="outline" className="rounded-none">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-black text-white">
      <MainNavbar />

      {/* Fullscreen Cube Loader */}
      <CubeLoader isVisible={isLoading} />

      <div className="relative flex h-full flex-col overflow-hidden">
        {/* Background Light Rays */}
        <div className="absolute inset-0 z-0">
          <LightRays
            raysOrigin="top-center"
            raysColor="#6fb7a5"
            raysSpeed={0.6}
            lightSpread={0.6}
            rayLength={5.0}
            pulsating={true}
            fadeDistance={2.0}
            followMouse={false}
            mouseInfluence={0.0}
            noiseAmount={0.012}
            distortion={0.008}
            className="opacity-80"
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex h-full flex-col">
          {/* Header Section */}
          <div className="container mx-auto px-4 pt-8 pb-6">
            <div className="mb-8 text-center">
              <h1 className="font-cirka mb-6 text-4xl font-bold md:text-6xl lg:text-7xl">
                <span className="text-white">Battle </span>
                <span className="from-primary via-primary to-accent bg-gradient-to-r bg-clip-text text-transparent">
                  Arenas
                </span>
              </h1>

              <p className="mx-auto mb-8 max-w-3xl font-sans text-lg text-white/80 md:text-xl">
                Choose your arena. Each cube represents a different battle where
                vault managers compete for the highest returns. Select your
                strategy and join the competition.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Badge
                  variant="outline"
                  className="border-primary text-primary rounded-none px-4 py-2"
                >
                  <TrophyIcon className="mr-2 h-4 w-4" />
                  {
                    arenas.filter((a) => a.status === "Ongoing Battle").length
                  }{" "}
                  Active Battles
                </Badge>
                <Badge
                  variant="outline"
                  className="text-profit border-profit rounded-none px-4 py-2"
                >
                  <CurrencyDollarIcon className="mr-2 h-4 w-4" />$
                  {(
                    arenas.reduce((sum, a) => sum + a.prizePool, 0) / 1000
                  ).toFixed(0)}
                  K Total Prizes
                </Badge>
                <Badge
                  variant="outline"
                  className="text-purple rounded-none border-purple-400 bg-transparent px-4 py-2"
                >
                  <UsersIcon className="mr-2 h-4 w-4" />
                  {arenas.reduce((sum, a) => sum + a.participants, 0)} Total
                  Participants
                </Badge>
              </div>
            </div>
          </div>

          {/* Main Arena Grid - Full Height Container */}
          <div className="relative flex flex-1 items-center justify-center px-4">
            {/* Centered Arena Cubes */}
            <div className="w-fit">
              <Cubes
                gridSize={gridSize}
                cubeSize={150}
                maxAngle={60}
                radius={12}
                easing="power1.out"
                duration={{ enter: 0.05, leave: 0.1 }}
                borderStyle="2px solid #6fb7a5"
                faceColor="transparent"
                rippleColor="#6fb7a5"
                rippleSpeed={1.5}
                autoAnimate={false}
                rippleOnClick={true}
                cellGap={60}
                arenaData={arenas}
                onCubeClick={handleCubeClick}
                onCubeHover={handleCubeHover}
              />
            </div>

            {/* Selected Arena Details - Responsive positioning */}
            {currentArena && (
              <div className="animate-in slide-in-from-right-5 absolute top-1/2 right-80 z-50 w-80 max-w-[calc(100vw-32px)] -translate-y-1/2 transform duration-300 ease-out">
                <Card className="bg-card/95 border-border/50 rounded-none shadow-2xl backdrop-blur-md">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-cirka mb-2 text-2xl font-bold text-white">
                        {currentArena.name}
                      </h3>
                      <p className="mb-4 text-sm text-white/60">
                        {currentArena.description}
                      </p>

                      <div className="mb-4 flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(currentArena.status)} rounded-none`}
                        >
                          {currentArena.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="rounded-none border-blue-400 px-2 py-1 text-xs text-blue-400"
                        >
                          <ClockIcon className="mr-1 h-3 w-3" />
                          {currentArena.timeRemaining}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-white/60">Total TVL</p>
                          <p className="font-bold text-white">
                            ${(currentArena.totalTVL / 1000).toFixed(0)}K
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60">Prize Pool</p>
                          <p className="font-bold text-white">
                            ${(currentArena.prizePool / 1000).toFixed(0)}K
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60">Active Vaults</p>
                          <p className="font-bold text-white">
                            {currentArena.activeVaults}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60">Participants</p>
                          <p className="font-bold text-white">
                            {currentArena.participants}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
