"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MainNavbar } from "@/components/main-navbar";
import LightRays from "@/components/ui/light-rays";
import Cubes from "@/components/ui/cubes";
import CubeLoader from "@/components/ui/cube-loader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrophyIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface ArenaData {
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
}

// Arena data based on project.md
const arenas: ArenaData[] = [
  {
    id: "dca-arena-1",
    name: "DCA Arena #1",
    type: "DCA Strategy",
    status: "Ongoing Battle",
    phase: "Battle Phase",
    timeRemaining: "12d 14h 32m",
    totalTVL: 281000,
    activeVaults: 3,
    participants: 105,
    prizePool: 21200,
    description:
      "Dollar Cost Averaging strategies compete for the highest yield",
    color: "#6fb7a5",
    cubePosition: { row: 0, col: 0 },
  },
  {
    id: "lending-arena-1",
    name: "Lending Arena #1",
    type: "Lending Strategy",
    status: "Open Deposit",
    phase: "Stake Phase",
    timeRemaining: "2d 8h 15m",
    totalTVL: 450000,
    activeVaults: 5,
    participants: 78,
    prizePool: 35000,
    description: "Lending protocols battle for the best risk-adjusted returns",
    color: "#FB605C",
    cubePosition: { row: 0, col: 1 },
  },
  {
    id: "rwa-vs-degen-1",
    name: "RWA vs Degen #1",
    type: "Mixed Strategy",
    status: "Starting Soon",
    phase: "Registration",
    timeRemaining: "5d 12h 45m",
    totalTVL: 0,
    activeVaults: 0,
    participants: 23,
    prizePool: 50000,
    description:
      "Real World Assets vs Degen strategies in the ultimate showdown",
    color: "#FFB800",
    cubePosition: { row: 1, col: 0 },
  },
  {
    id: "yield-farming-1",
    name: "Yield Farming Arena #1",
    type: "Yield Farming",
    status: "Coming Soon",
    phase: "Preparation",
    timeRemaining: "14d 6h 30m",
    totalTVL: 0,
    activeVaults: 0,
    participants: 0,
    prizePool: 75000,
    description: "Advanced yield farming strategies compete for maximum APY",
    color: "#9333EA",
    cubePosition: { row: 1, col: 1 },
  },
];

export default function BattleArenaPage() {
  const router = useRouter();
  const [hoveredArena, setHoveredArena] = useState<string | null>(null);
  const [selectedCube, setSelectedCube] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleCubeClick = (arena: ArenaData, row: number, col: number) => {
    setIsLoading(true);

    // Simulate loading time before navigation
    setTimeout(() => {
      router.push(`/arena/battle/${arena.id}`);
    }, 2000);
  };

  const handleCubeHover = (
    arena: ArenaData | null,
    row: number,
    col: number
  ) => {
    setHoveredArena(arena ? arena.id : null);
  };

  const currentArena = hoveredArena
    ? arenas.find((a) => a.id === hoveredArena)
    : null;

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
                gridSize={2}
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
