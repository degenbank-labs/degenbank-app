"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import { Swords, Vault } from "lucide-react";

// Dummy data for charts
const totalPnLData = [
  { date: "15 Oct 2024", cumulativePnl: 0 },
  { date: "16 Oct 2024", cumulativePnl: 150.25 },
  { date: "17 Oct 2024", cumulativePnl: -320.5 },
  { date: "18 Oct 2024", cumulativePnl: 280.75 },
  { date: "19 Oct 2024", cumulativePnl: 450.3 },
  { date: "20 Oct 2024", cumulativePnl: 1250.34 },
];

// Dummy data
const portfolioData = {
  totalValue: 12450.67,
  totalPnL: 1250.34,
  totalPnLPercentage: 11.15,
  dayChange: 234.56,
  dayChangePercentage: 1.92,
  positions: [
    {
      id: 1,
      vault: "Solana DCA Vault",
      manager: "DegenTrader",
      amount: 5000,
      value: 5234.56,
      pnl: 234.56,
      pnlPercentage: 4.69,
      apy: "12.5%",
      status: "Active",
      symbol:
        "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
    },
    {
      id: 2,
      vault: "BONK DCA Vault",
      manager: "MemeKing",
      amount: 3000,
      value: 3456.78,
      pnl: 456.78,
      pnlPercentage: 15.23,
      apy: "25.8%",
      status: "Active",
      symbol:
        "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
    },
    {
      id: 3,
      vault: "RWA Stable Vault",
      manager: "SafeYield",
      amount: 4000,
      value: 3759.33,
      pnl: -240.67,
      pnlPercentage: -6.02,
      apy: "8.2%",
      status: "Active",
      symbol:
        "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
    },
    {
      id: 4,
      vault: "Jupiter LP Vault",
      manager: "LPMaster",
      amount: 2500,
      value: 2789.45,
      pnl: 289.45,
      pnlPercentage: 11.58,
      apy: "18.3%",
      status: "Active",
      symbol:
        "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
    },
    {
      id: 5,
      vault: "Drift Leverage Vault",
      manager: "YieldHunter",
      amount: 1800,
      value: 1654.32,
      pnl: -145.68,
      pnlPercentage: -8.09,
      apy: "22.1%",
      status: "Active",
      symbol:
        "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
    },
    {
      id: 6,
      vault: "Kamino Stable Vault",
      manager: "StableYield",
      amount: 6000,
      value: 6234.78,
      pnl: 234.78,
      pnlPercentage: 3.91,
      apy: "12.3%",
      status: "Active",
      symbol:
        "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
    },
    {
      id: 7,
      vault: "Raydium LP Vault",
      manager: "RayMaster",
      amount: 3500,
      value: 3892.15,
      pnl: 392.15,
      pnlPercentage: 11.2,
      apy: "16.7%",
      status: "Active",
      symbol:
        "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
    },
    {
      id: 8,
      vault: "Orca Whirlpool Vault",
      manager: "OrcaExpert",
      amount: 2200,
      value: 2156.89,
      pnl: -43.11,
      pnlPercentage: -1.96,
      apy: "14.5%",
      status: "Active",
      symbol:
        "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
    },
    {
      id: 9,
      vault: "Marinade Staking Vault",
      manager: "StakeKing",
      amount: 4500,
      value: 4723.56,
      pnl: 223.56,
      pnlPercentage: 4.97,
      apy: "7.8%",
      status: "Active",
      symbol:
        "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
    },
    {
      id: 10,
      vault: "Mango Markets Vault",
      manager: "MangoTrader",
      amount: 1500,
      value: 1389.67,
      pnl: -110.33,
      pnlPercentage: -7.36,
      apy: "19.2%",
      status: "Active",
      symbol:
        "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
    },
    {
      id: 11,
      vault: "Serum DEX Vault",
      manager: "SerumPro",
      amount: 2800,
      value: 3045.23,
      pnl: 245.23,
      pnlPercentage: 8.76,
      apy: "15.4%",
      status: "Active",
      symbol:
        "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
    },
    {
      id: 12,
      vault: "Tulip Protocol Vault",
      manager: "TulipFarmer",
      amount: 3200,
      value: 3098.44,
      pnl: -101.56,
      pnlPercentage: -3.17,
      apy: "13.9%",
      status: "Active",
      symbol:
        "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
    },
  ],
};

// Available vaults data
const availableVaults = [
  {
    id: "drift-leverage",
    name: "Drift Leverage Vault",
    manager: "YieldHunter",
    managerType: "ecosystem",
    tvl: 6780000,
    apy: 22.1,
    riskLevel: "High",
    depositAsset: "USDC",
    minDeposit: 1,
    strategy: "Leveraged yield farming on Drift Protocol",
    status: "Open",
    symbol:
      "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
  },
  {
    id: "jup-lp",
    name: "Jupiter LP Vault",
    manager: "LPMaster",
    managerType: "ecosystem",
    tvl: 4320000,
    apy: 19.7,
    riskLevel: "Medium",
    depositAsset: "USDC",
    minDeposit: 250,
    strategy: "Optimized LP positions on Jupiter Exchange",
    status: "Open",
    symbol:
      "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
  },
  {
    id: "kamino-stable",
    name: "Kamino Stable Vault",
    manager: "StableYield",
    managerType: "verified",
    tvl: 8900000,
    apy: 12.3,
    riskLevel: "Low",
    depositAsset: "USDC",
    minDeposit: 100,
    strategy: "Conservative lending on Kamino",
    status: "Open",
    symbol:
      "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
  },
  {
    id: "raydium-lp",
    name: "Raydium LP Vault",
    manager: "RayMaster",
    managerType: "ecosystem",
    tvl: 5450000,
    apy: 16.7,
    riskLevel: "Medium",
    depositAsset: "USDC",
    minDeposit: 0.5,
    strategy: "Automated LP management on Raydium",
    status: "Open",
    symbol:
      "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
  },
  {
    id: "orca-whirlpool",
    name: "Orca Whirlpool Vault",
    manager: "OrcaExpert",
    managerType: "verified",
    tvl: 3890000,
    apy: 14.5,
    riskLevel: "Medium",
    depositAsset: "USDC",
    minDeposit: 200,
    strategy: "Concentrated liquidity on Orca Whirlpools",
    status: "Open",
    symbol:
      "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
  },
  {
    id: "marinade-staking",
    name: "Marinade Staking Vault",
    manager: "StakeKing",
    managerType: "verified",
    tvl: 12500000,
    apy: 7.8,
    riskLevel: "Low",
    depositAsset: "USDC",
    minDeposit: 1,
    strategy: "Liquid staking with Marinade Finance",
    status: "Open",
    symbol:
      "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
  },
  {
    id: "mango-markets",
    name: "Mango Markets Vault",
    manager: "MangoTrader",
    managerType: "ecosystem",
    tvl: 2340000,
    apy: 19.2,
    riskLevel: "High",
    depositAsset: "USDC",
    minDeposit: 500,
    strategy: "Leveraged trading on Mango Markets",
    status: "Open",
    symbol:
      "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
  },
  {
    id: "serum-dex",
    name: "Serum DEX Vault",
    manager: "SerumPro",
    managerType: "ecosystem",
    tvl: 1890000,
    apy: 15.4,
    riskLevel: "Medium",
    depositAsset: "USDC",
    minDeposit: 0.8,
    strategy: "Market making on Serum DEX",
    status: "Open",
    symbol:
      "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
  },
  {
    id: "tulip-protocol",
    name: "Tulip Protocol Vault",
    manager: "TulipFarmer",
    managerType: "verified",
    tvl: 4560000,
    apy: 13.9,
    riskLevel: "Low",
    depositAsset: "USDC",
    minDeposit: 150,
    strategy: "Yield farming on Tulip Protocol",
    status: "Open",
    symbol:
      "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
  },
  {
    id: "solend-lending",
    name: "Solend Lending Vault",
    manager: "LendMaster",
    managerType: "verified",
    tvl: 7890000,
    apy: 11.2,
    riskLevel: "Low",
    depositAsset: "USDC",
    minDeposit: 100,
    strategy: "Optimized lending on Solend",
    status: "Open",
    symbol:
      "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
  },
  {
    id: "francium-leverage",
    name: "Francium Leverage Vault",
    manager: "FranciumPro",
    managerType: "ecosystem",
    tvl: 3210000,
    apy: 24.3,
    riskLevel: "High",
    depositAsset: "USDC",
    minDeposit: 2,
    strategy: "Leveraged yield farming on Francium",
    status: "Open",
    symbol:
      "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
  },
  {
    id: "saber-stable",
    name: "Saber Stable Vault",
    manager: "SaberExpert",
    managerType: "verified",
    tvl: 6120000,
    apy: 9.8,
    riskLevel: "Low",
    depositAsset: "USDC",
    minDeposit: 50,
    strategy: "Stable coin LP on Saber",
    status: "Open",
    symbol:
      "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
  },
];

// Battle arenas data based on project.md
const battleArenas = [
  {
    id: "dca-arena-1",
    name: "DCA Arena - Phase #1",
    status: "ongoing",
    phase: "Battle Phase",
    timeRemaining: "5 days 12 hours",
    totalTVL: 45000,
    participants: 3,
    vaults: [
      {
        id: 1,
        name: "Solana DCA",
        manager: "DegenTrader",
        tvl: 15000,
        currentROI: 8.5,
        position: 1,
        status: "Leading",
      },
      {
        id: 2,
        name: "BONK DCA",
        manager: "MemeKing",
        tvl: 18000,
        currentROI: 6.2,
        position: 2,
        status: "Active",
      },
      {
        id: 3,
        name: "Raydium DCA",
        manager: "RayMaster",
        tvl: 12000,
        currentROI: 4.1,
        position: 3,
        status: "Active",
      },
    ],
  },
  {
    id: "lending-arena",
    name: "Lending Arena",
    status: "open_deposit",
    phase: "Stake Phase",
    timeRemaining: "2 days 8 hours",
    totalTVL: 0,
    participants: 3,
    vaults: [
      {
        id: 1,
        name: "Jup Vault",
        manager: "JupMaster",
        tvl: 0,
        strategy: "Deposit USDC in Jupiter",
        status: "Open",
      },
      {
        id: 2,
        name: "Drift Vault",
        manager: "DriftPro",
        tvl: 0,
        strategy: "Deposit USDC in Drift",
        status: "Open",
      },
      {
        id: 3,
        name: "Kamino Vault",
        manager: "KaminoExpert",
        tvl: 0,
        strategy: "Deposit USDC in Kamino",
        status: "Open",
      },
    ],
  },
  {
    id: "rwa-vs-degen",
    name: "RWA VS Degen",
    status: "open_deposit",
    phase: "Stake Phase",
    timeRemaining: "1 day 4 hours",
    totalTVL: 0,
    participants: 2,
    vaults: [
      {
        id: 1,
        name: "RWA Vault",
        manager: "SafeYield",
        tvl: 0,
        strategy: "70% T-bills, 30% DeFi money markets",
        riskLevel: "Low",
        status: "Open",
      },
      {
        id: 2,
        name: "Degen Vault",
        manager: "DegenKing",
        tvl: 0,
        strategy: "50% USDC/SOL LP, 30% Drift Vault, 20% Memecoins",
        riskLevel: "High",
        status: "Open",
      },
    ],
  },
  {
    id: "leverage-arena",
    name: "Leverage Arena",
    status: "ongoing",
    phase: "Battle Phase",
    timeRemaining: "3 days 6 hours",
    totalTVL: 78000,
    participants: 4,
    vaults: [
      {
        id: 1,
        name: "Drift Leverage",
        manager: "YieldHunter",
        tvl: 25000,
        currentROI: 12.3,
        position: 1,
        status: "Leading",
      },
      {
        id: 2,
        name: "Mango Leverage",
        manager: "MangoTrader",
        tvl: 20000,
        currentROI: 9.8,
        position: 2,
        status: "Active",
      },
      {
        id: 3,
        name: "Francium Leverage",
        manager: "FranciumPro",
        tvl: 18000,
        currentROI: 7.2,
        position: 3,
        status: "Active",
      },
      {
        id: 4,
        name: "Tulip Leverage",
        manager: "TulipFarmer",
        tvl: 15000,
        currentROI: 5.1,
        position: 4,
        status: "Active",
      },
    ],
  },
  {
    id: "stablecoin-arena",
    name: "Stablecoin Arena",
    status: "open_deposit",
    phase: "Stake Phase",
    timeRemaining: "4 days 2 hours",
    totalTVL: 0,
    participants: 5,
    vaults: [
      {
        id: 1,
        name: "Kamino Stable",
        manager: "StableYield",
        tvl: 0,
        strategy: "Conservative USDC lending",
        status: "Open",
      },
      {
        id: 2,
        name: "Solend Stable",
        manager: "LendMaster",
        tvl: 0,
        strategy: "Optimized USDC lending",
        status: "Open",
      },
      {
        id: 3,
        name: "Saber Stable",
        manager: "SaberExpert",
        tvl: 0,
        strategy: "Stable coin LP farming",
        status: "Open",
      },
      {
        id: 4,
        name: "Port Finance",
        manager: "PortMaster",
        tvl: 0,
        strategy: "USDC lending on Port",
        status: "Open",
      },
      {
        id: 5,
        name: "Larix Stable",
        manager: "LarixPro",
        tvl: 0,
        strategy: "USDC lending on Larix",
        status: "Open",
      },
    ],
  },
  {
    id: "meme-arena",
    name: "Meme Arena",
    status: "ongoing",
    phase: "Battle Phase",
    timeRemaining: "1 day 18 hours",
    totalTVL: 32000,
    participants: 3,
    vaults: [
      {
        id: 1,
        name: "BONK Vault",
        manager: "MemeKing",
        tvl: 15000,
        currentROI: 25.7,
        position: 1,
        status: "Leading",
      },
      {
        id: 2,
        name: "WIF Vault",
        manager: "WifMaster",
        tvl: 10000,
        currentROI: 18.3,
        position: 2,
        status: "Active",
      },
      {
        id: 3,
        name: "PEPE Vault",
        manager: "PepeLord",
        tvl: 7000,
        currentROI: 12.1,
        position: 3,
        status: "Active",
      },
    ],
  },
  {
    id: "lp-arena",
    name: "LP Arena",
    status: "open_deposit",
    phase: "Stake Phase",
    timeRemaining: "6 days 12 hours",
    totalTVL: 0,
    participants: 4,
    vaults: [
      {
        id: 1,
        name: "Raydium LP",
        manager: "RayMaster",
        tvl: 0,
        strategy: "USDC/SOL LP on Raydium",
        status: "Open",
      },
      {
        id: 2,
        name: "Orca LP",
        manager: "OrcaExpert",
        tvl: 0,
        strategy: "Concentrated liquidity on Orca",
        status: "Open",
      },
      {
        id: 3,
        name: "Jupiter LP",
        manager: "LPMaster",
        tvl: 0,
        strategy: "Multi-pool LP on Jupiter",
        status: "Open",
      },
      {
        id: 4,
        name: "Serum LP",
        manager: "SerumPro",
        tvl: 0,
        strategy: "Market making on Serum",
        status: "Open",
      },
    ],
  },
  {
    id: "yield-arena",
    name: "Yield Arena",
    status: "ongoing",
    phase: "Battle Phase",
    timeRemaining: "2 days 4 hours",
    totalTVL: 95000,
    participants: 6,
    vaults: [
      {
        id: 1,
        name: "Marinade Yield",
        manager: "StakeKing",
        tvl: 20000,
        currentROI: 8.9,
        position: 1,
        status: "Leading",
      },
      {
        id: 2,
        name: "Tulip Yield",
        manager: "TulipFarmer",
        tvl: 18000,
        currentROI: 7.8,
        position: 2,
        status: "Active",
      },
      {
        id: 3,
        name: "Francium Yield",
        manager: "FranciumPro",
        tvl: 16000,
        currentROI: 6.5,
        position: 3,
        status: "Active",
      },
      {
        id: 4,
        name: "Solend Yield",
        manager: "LendMaster",
        tvl: 15000,
        currentROI: 5.2,
        position: 4,
        status: "Active",
      },
      {
        id: 5,
        name: "Kamino Yield",
        manager: "StableYield",
        tvl: 14000,
        currentROI: 4.8,
        position: 5,
        status: "Active",
      },
      {
        id: 6,
        name: "Port Yield",
        manager: "PortMaster",
        tvl: 12000,
        currentROI: 3.9,
        position: 6,
        status: "Active",
      },
    ],
  },
  {
    id: "arbitrage-arena",
    name: "Arbitrage Arena",
    status: "open_deposit",
    phase: "Stake Phase",
    timeRemaining: "3 days 15 hours",
    totalTVL: 0,
    participants: 3,
    vaults: [
      {
        id: 1,
        name: "Jupiter Arbitrage",
        manager: "ArbMaster",
        tvl: 0,
        strategy: "Cross-DEX arbitrage",
        status: "Open",
      },
      {
        id: 2,
        name: "Serum Arbitrage",
        manager: "SerumPro",
        tvl: 0,
        strategy: "Order book arbitrage",
        status: "Open",
      },
      {
        id: 3,
        name: "Orca Arbitrage",
        manager: "OrcaExpert",
        tvl: 0,
        strategy: "AMM arbitrage",
        status: "Open",
      },
    ],
  },
  {
    id: "defi-arena",
    name: "DeFi Arena",
    status: "ongoing",
    phase: "Battle Phase",
    timeRemaining: "4 days 8 hours",
    totalTVL: 67000,
    participants: 5,
    vaults: [
      {
        id: 1,
        name: "Multi-Protocol",
        manager: "DefiKing",
        tvl: 18000,
        currentROI: 15.2,
        position: 1,
        status: "Leading",
      },
      {
        id: 2,
        name: "Yield Optimizer",
        manager: "YieldHunter",
        tvl: 16000,
        currentROI: 13.8,
        position: 2,
        status: "Active",
      },
      {
        id: 3,
        name: "Risk Balanced",
        manager: "SafeYield",
        tvl: 14000,
        currentROI: 11.5,
        position: 3,
        status: "Active",
      },
      {
        id: 4,
        name: "Aggressive Growth",
        manager: "DegenKing",
        tvl: 12000,
        currentROI: 9.7,
        position: 4,
        status: "Active",
      },
      {
        id: 5,
        name: "Conservative Mix",
        manager: "StableYield",
        tvl: 7000,
        currentROI: 6.3,
        position: 5,
        status: "Active",
      },
    ],
  },
  {
    id: "nft-arena",
    name: "NFT Arena",
    status: "open_deposit",
    phase: "Stake Phase",
    timeRemaining: "5 days 20 hours",
    totalTVL: 0,
    participants: 2,
    vaults: [
      {
        id: 1,
        name: "Magic Eden Vault",
        manager: "NFTMaster",
        tvl: 0,
        strategy: "NFT trading and royalties",
        status: "Open",
      },
      {
        id: 2,
        name: "Tensor Vault",
        manager: "TensorPro",
        tvl: 0,
        strategy: "NFT market making",
        status: "Open",
      },
    ],
  },
  {
    id: "completed-arena-1",
    name: "Solana Ecosystem Arena",
    status: "completed",
    phase: "Completed",
    timeRemaining: "Finished",
    totalTVL: 125000,
    participants: 4,
    vaults: [
      {
        id: 1,
        name: "Jupiter Winner",
        manager: "JupMaster",
        tvl: 45000,
        finalROI: 28.5,
        position: 1,
        status: "Winner",
      },
      {
        id: 2,
        name: "Raydium Runner-up",
        manager: "RayMaster",
        tvl: 35000,
        finalROI: 22.3,
        position: 2,
        status: "Completed",
      },
      {
        id: 3,
        name: "Orca Third",
        manager: "OrcaExpert",
        tvl: 28000,
        finalROI: 18.7,
        position: 3,
        status: "Completed",
      },
      {
        id: 4,
        name: "Serum Fourth",
        manager: "SerumPro",
        tvl: 17000,
        finalROI: 12.1,
        position: 4,
        status: "Completed",
      },
    ],
  },
  {
    id: "completed-arena-2",
    name: "Meme Coin Battle #1",
    status: "completed",
    phase: "Completed",
    timeRemaining: "Finished",
    totalTVL: 89000,
    participants: 3,
    vaults: [
      {
        id: 1,
        name: "BONK Champion",
        manager: "MemeKing",
        tvl: 42000,
        finalROI: 156.8,
        position: 1,
        status: "Winner",
      },
      {
        id: 2,
        name: "WIF Silver",
        manager: "WifMaster",
        tvl: 28000,
        finalROI: 89.2,
        position: 2,
        status: "Completed",
      },
      {
        id: 3,
        name: "PEPE Bronze",
        manager: "PepeLord",
        tvl: 19000,
        finalROI: 45.6,
        position: 3,
        status: "Completed",
      },
    ],
  },
];

const formatTVL = (amount: number) => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount}`;
};

const getRiskLevelColor = (level: string) => {
  switch (level) {
    case "Low":
      return "text-profit";
    case "Medium":
      return "text-yellow-200";
    case "High":
      return "text-loss";
    default:
      return "text-gray-200";
  }
};

const getBattleStatusColor = (status: string) => {
  switch (status) {
    case "ongoing":
      return "text-profit";
    case "open_deposit":
      return "text-blue-200";
    case "completed":
      return "text-gray-200";
    default:
      return "text-gray-200";
  }
};

export default function OverviewPage() {
  const { authenticated, login } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? "+" : ""}${percentage.toFixed(2)}%`;
  };

  const formatPnL = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      signDisplay: "always",
    }).format(value);
  };

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mx-auto max-w-md text-center">
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Wallet</CardTitle>
              <CardDescription>
                You need to connect your wallet to view your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={login}
                className="bg-primary hover:bg-primary/90 w-full cursor-pointer text-black"
              >
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border rounded-none">
          <CardHeader>
            <CardDescription>Portfolio Value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white">
              {formatCurrency(portfolioData.totalValue)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border rounded-none">
          <CardHeader className="pb-2">
            <CardDescription>All Time P&L</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`flex items-center text-xl font-bold ${
                portfolioData.totalPnL >= 0 ? "text-profit" : "text-loss"
              }`}
            >
              {portfolioData.totalPnL >= 0 ? (
                <ArrowUpIcon className="mr-1 h-5 w-5" />
              ) : (
                <ArrowDownIcon className="mr-1 h-5 w-5" />
              )}
              {formatCurrency(Math.abs(portfolioData.totalPnL))}
            </div>
            <div
              className={`text-sm ${
                portfolioData.totalPnL >= 0 ? "text-profit" : "text-loss"
              }`}
            >
              {formatPercentage(portfolioData.totalPnLPercentage)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border rounded-none">
          <CardHeader className="pb-2">
            <CardDescription>Net 300 Volume (rolling estimate)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white">
              {formatCurrency(150000)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border rounded-none">
          <CardHeader className="pb-2">
            <CardDescription>Active Positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white">
              {portfolioData.positions.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overview Menu Tabs */}
      <div className="flex space-x-2">
        <Button
          variant={activeTab === "overview" ? "default" : "outline"}
          onClick={() => setActiveTab("overview")}
          className={`hover:bg-primary cursor-pointer border-gray-400 bg-transparent hover:text-black ${
            activeTab === "overview" ? "bg-primary text-black" : "text-white"
          }`}
        >
          Overview
        </Button>
        <Link href="/overview/positions">
          <Button
            variant="outline"
            className="hover:bg-primary cursor-pointer border-gray-400 bg-transparent text-white hover:text-black"
          >
            Positions
          </Button>
        </Link>
        <Link href="/overview/history">
          <Button
            variant="outline"
            className="hover:bg-primary cursor-pointer border-gray-400 bg-transparent text-white hover:text-black"
          >
            History
          </Button>
        </Link>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Total P&L Chart - Full Height */}
        <Card className="bg-card border-border rounded-none">
          <CardHeader>
            <CardTitle className="text-white">Total P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={totalPnLData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 10,
                    bottom: 20,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="totalPnLSplitColor"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={
                          totalPnLData.length > 0 &&
                          Math.max(
                            ...totalPnLData.map((d) => d.cumulativePnl)
                          ) >= 0
                            ? "#16d2a0"
                            : "#ea3943"
                        }
                        stopOpacity={0.6}
                      />
                      <stop
                        offset={`${100 - (totalPnLData.length > 0 ? Math.max(0, Math.min(100, ((0 - Math.min(...totalPnLData.map((d) => d.cumulativePnl))) / (Math.max(...totalPnLData.map((d) => d.cumulativePnl)) - Math.min(...totalPnLData.map((d) => d.cumulativePnl)))) * 100)) : 50)}%`}
                        stopColor={
                          totalPnLData.length > 0 &&
                          Math.max(
                            ...totalPnLData.map((d) => d.cumulativePnl)
                          ) >= 0
                            ? "#16d2a0"
                            : "#ea3943"
                        }
                        stopOpacity={0.001}
                      />
                      <stop
                        offset={`${100 - (totalPnLData.length > 0 ? Math.max(0, Math.min(100, ((0 - Math.min(...totalPnLData.map((d) => d.cumulativePnl))) / (Math.max(...totalPnLData.map((d) => d.cumulativePnl)) - Math.min(...totalPnLData.map((d) => d.cumulativePnl)))) * 100)) : 50)}%`}
                        stopColor={
                          totalPnLData.length > 0 &&
                          Math.min(
                            ...totalPnLData.map((d) => d.cumulativePnl)
                          ) < 0
                            ? "#ea3943"
                            : "#16d2a0"
                        }
                        stopOpacity={0.001}
                      />
                      <stop
                        offset="100%"
                        stopColor={
                          totalPnLData.length > 0 &&
                          Math.min(
                            ...totalPnLData.map((d) => d.cumulativePnl)
                          ) < 0
                            ? "#ea3943"
                            : "#16d2a0"
                        }
                        stopOpacity={0.6}
                      />
                    </linearGradient>
                    <linearGradient
                      id="totalPnLStrokeGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={
                          totalPnLData.length > 0 &&
                          Math.max(
                            ...totalPnLData.map((d) => d.cumulativePnl)
                          ) >= 0
                            ? "#16d2a0"
                            : "#ea3943"
                        }
                        stopOpacity={1}
                      />
                      <stop
                        offset={`${100 - (totalPnLData.length > 0 ? Math.max(0, Math.min(100, ((0 - Math.min(...totalPnLData.map((d) => d.cumulativePnl))) / (Math.max(...totalPnLData.map((d) => d.cumulativePnl)) - Math.min(...totalPnLData.map((d) => d.cumulativePnl)))) * 100)) : 50)}%`}
                        stopColor={
                          totalPnLData.length > 0 &&
                          Math.max(
                            ...totalPnLData.map((d) => d.cumulativePnl)
                          ) >= 0
                            ? "#16d2a0"
                            : "#ea3943"
                        }
                        stopOpacity={1}
                      />
                      <stop
                        offset={`${100 - (totalPnLData.length > 0 ? Math.max(0, Math.min(100, ((0 - Math.min(...totalPnLData.map((d) => d.cumulativePnl))) / (Math.max(...totalPnLData.map((d) => d.cumulativePnl)) - Math.min(...totalPnLData.map((d) => d.cumulativePnl)))) * 100)) : 50)}%`}
                        stopColor={
                          totalPnLData.length > 0 &&
                          Math.min(
                            ...totalPnLData.map((d) => d.cumulativePnl)
                          ) < 0
                            ? "#ea3943"
                            : "#16d2a0"
                        }
                        stopOpacity={1}
                      />
                      <stop
                        offset="100%"
                        stopColor={
                          totalPnLData.length > 0 &&
                          Math.min(
                            ...totalPnLData.map((d) => d.cumulativePnl)
                          ) < 0
                            ? "#ea3943"
                            : "#16d2a0"
                        }
                        stopOpacity={1}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    tickFormatter={(value) => formatPnL(value)}
                    domain={[
                      (dataMin: number) => Math.min(dataMin, 0),
                      (dataMax: number) => Math.max(dataMax, 0),
                    ]}
                  />
                  <RechartsTooltip
                    content={({ active, payload, label }) => {
                      if (
                        active &&
                        payload &&
                        payload.length &&
                        payload[0]?.payload
                      ) {
                        const data = payload[0].payload;
                        return (
                          <div className="border border-neutral-800 bg-neutral-900/95 p-3 shadow-xl backdrop-blur-sm">
                            <p className="mb-2 text-xs text-gray-300">
                              {label}
                            </p>
                            <div className="space-y-1">
                              <p className="text-sm font-semibold text-white">
                                Cumulative P&L:
                                <span
                                  className={`ml-1 ${data.cumulativePnl >= 0 ? "text-profit" : "text-loss"}`}
                                >
                                  {formatPnL(data.cumulativePnl)}
                                </span>
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine
                    y={0}
                    stroke="#6b7280"
                    strokeDasharray="3 3"
                    strokeWidth={1}
                    opacity={0.8}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulativePnl"
                    stroke="url(#totalPnLStrokeGradient)"
                    strokeWidth={2}
                    fillOpacity={0.6}
                    fill="url(#totalPnLSplitColor)"
                    dot={false}
                    activeDot={{
                      r: 4,
                      stroke: "#ffffff",
                      strokeWidth: 2,
                      fill: "#000",
                    }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Positions Table - Smaller fonts, no manager */}
        <Card className="bg-card border-border rounded-none">
          <CardHeader>
            <CardTitle className="text-sm">Positions</CardTitle>
            <CardDescription className="text-xs">
              Current vault positions and their performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-border border-b">
                    <th className="text-muted-foreground px-1 py-2 text-left text-xs font-medium">
                      Vault
                    </th>
                    <th className="text-muted-foreground px-1 py-2 text-right text-xs font-medium">
                      Amount
                    </th>
                    <th className="text-muted-foreground px-1 py-2 text-right text-xs font-medium">
                      Value
                    </th>
                    <th className="text-muted-foreground px-1 py-2 text-right text-xs font-medium">
                      P&L
                    </th>
                    <th className="text-muted-foreground px-1 py-2 text-right text-xs font-medium">
                      APY
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.positions.slice(0, 6).map((position) => (
                    <tr
                      key={position.id}
                      className="border-border/50 hover:bg-primary/10 cursor-pointer border-b"
                      onClick={() =>
                        (window.location.href = `/vaults/${position.id}`)
                      }
                    >
                      <td className="px-1 py-2">
                        <div className="flex items-center space-x-2">
                          <img
                            src={position.symbol}
                            alt={position.vault}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                          <div className="text-xs font-medium text-white">
                            {position.vault}
                          </div>
                        </div>
                      </td>
                      <td className="px-1 py-2 text-right">
                        <div className="text-xs text-white">
                          {formatCurrency(position.amount)}
                        </div>
                      </td>
                      <td className="px-1 py-2 text-right">
                        <div className="text-xs text-white">
                          {formatCurrency(position.value)}
                        </div>
                      </td>
                      <td className="px-1 py-2 text-right">
                        <div
                          className={`text-xs ${
                            position.pnl >= 0 ? "text-profit" : "text-loss"
                          }`}
                        >
                          {position.pnl >= 0 ? "+" : ""}
                          {formatCurrency(position.pnl)}
                        </div>
                        <div
                          className={`text-xs ${
                            position.pnl >= 0 ? "text-profit" : "text-loss"
                          }`}
                        >
                          ({position.pnl >= 0 ? "" : ""}
                          {formatPercentage(position.pnlPercentage)})
                        </div>
                      </td>
                      <td className="px-1 py-2 text-right">
                        <div className="text-primary text-xs">
                          {parseFloat(position.apy).toFixed(1)}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2 text-center">
                <Link href="/overview/positions">
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer text-xs"
                  >
                    View All Positions
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Vaults and Battle Arenas - Table Format */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Available Vaults Table */}
        <Card className="bg-card border-border rounded-none">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Vault className="h-4 w-4" />
              <span>Available Vaults</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Open vaults ready for deposits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-border border-b">
                    <th className="text-muted-foreground px-1 py-2 text-left text-xs font-medium">
                      Vault
                    </th>
                    <th className="text-muted-foreground px-1 py-2 text-right text-xs font-medium">
                      APY
                    </th>
                    <th className="text-muted-foreground px-1 py-2 text-right text-xs font-medium">
                      TVL
                    </th>
                    <th className="text-muted-foreground px-1 py-2 text-center text-xs font-medium">
                      Risk
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {availableVaults.slice(0, 6).map((vault) => (
                    <tr
                      key={vault.id}
                      className="border-border/50 hover:bg-primary/10 cursor-pointer border-b"
                      onClick={() =>
                        (window.location.href = `/vaults/${vault.id}`)
                      }
                    >
                      <td className="px-1 py-2">
                        <div className="flex items-center space-x-2">
                          <img
                            src={vault.symbol}
                            alt={vault.name}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                          <div>
                            <div className="text-xs font-medium text-white">
                              {vault.name}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              {vault.depositAsset}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-1 py-2 text-right">
                        <div className="text-primary text-xs font-medium">
                          {vault.apy}%
                        </div>
                      </td>
                      <td className="px-1 py-2 text-right">
                        <div className="text-xs text-white">
                          {formatTVL(vault.tvl)}
                        </div>
                      </td>
                      <td className="px-1 py-2 text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getRiskLevelColor(vault.riskLevel)}`}
                        >
                          {vault.riskLevel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2 text-center">
                <Link href="/vaults/strategy-vaults">
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer text-xs"
                  >
                    View All Vaults
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Battle Arenas Table */}
        <Card className="bg-card border-border rounded-none">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Swords className="h-4 w-4" />
              <span>Battle Arenas</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Active and upcoming battle arenas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-border border-b">
                    <th className="text-muted-foreground px-1 py-2 text-left text-xs font-medium">
                      Arena
                    </th>
                    <th className="text-muted-foreground px-1 py-2 text-right text-xs font-medium">
                      TVL
                    </th>
                    <th className="text-muted-foreground px-1 py-2 text-center text-xs font-medium">
                      Status
                    </th>
                    <th className="text-muted-foreground px-1 py-2 text-center text-xs font-medium">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {battleArenas.slice(0, 6).map((arena) => (
                    <tr
                      key={arena.id}
                      className="border-border/50 hover:bg-primary/10 cursor-pointer border-b"
                      onClick={() =>
                        (window.location.href = `/battle/arena/${arena.id}`)
                      }
                    >
                      <td className="px-1 py-2">
                        <div className="text-xs font-medium text-white">
                          {arena.name}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {arena.participants} participants
                        </div>
                      </td>
                      <td className="px-1 py-2 text-right">
                        <div className="text-xs text-white">
                          {formatTVL(arena.totalTVL)}
                        </div>
                      </td>
                      <td className="px-1 py-2 text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getBattleStatusColor(arena.status)}`}
                        >
                          {arena.phase}
                        </span>
                      </td>
                      <td className="px-1 py-2 text-center">
                        <div className="text-muted-foreground text-xs">
                          {arena.timeRemaining}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2 text-center">
                <Link href="/battle">
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer text-xs"
                  >
                    View All Battles
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
