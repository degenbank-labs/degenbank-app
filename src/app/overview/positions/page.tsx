"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { useAuth } from "@/hooks/useAuth";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState, useMemo } from "react";
import { ShieldCheckIcon, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

// Extended dummy data for positions (25 items for pagination demo)
const allPositions = [
  {
    id: "1",
    vault: "ETH Yield Maximizer",
    manager: "0x1234...5678",
    managerFullAddress: "0x1234567890abcdef1234567890abcdef12345678",
    amount: 50000,
    value: 52500,
    pnl: 2500,
    pnlPercentage: 5.0,
    apy: "12.5%",
    status: "active",
    depositDate: "2024-01-15",
    strategy: "Automated yield farming across multiple DeFi protocols",
  },
  {
    id: "2",
    vault: "BTC Conservative",
    manager: "0x9876...5432",
    managerFullAddress: "0x9876543210fedcba9876543210fedcba98765432",
    amount: 25000,
    value: 24750,
    pnl: -250,
    pnlPercentage: -1.0,
    apy: "8.2%",
    status: "locked",
    depositDate: "2024-01-20",
    strategy: "Low-risk Bitcoin lending and staking strategies",
  },
  {
    id: "3",
    vault: "DeFi Alpha Hunter",
    manager: "0xabcd...efgh",
    managerFullAddress: "0xabcdef1234567890abcdef1234567890abcdefgh",
    amount: 15000,
    value: 16800,
    pnl: 1800,
    pnlPercentage: 12.0,
    apy: "18.7%",
    status: "active",
    depositDate: "2024-02-01",
    strategy: "High-yield opportunities in emerging DeFi protocols",
  },
  {
    id: "4",
    vault: "Stablecoin Yield",
    manager: "0x5555...7777",
    managerFullAddress: "0x5555666677778888999900001111222233334444",
    amount: 30000,
    value: 30900,
    pnl: 900,
    pnlPercentage: 3.0,
    apy: "6.8%",
    status: "closed",
    depositDate: "2024-01-10",
    strategy: "Stable yield generation through lending protocols",
  },
  {
    id: "5",
    vault: "Arbitrage Master",
    manager: "0x2222...8888",
    managerFullAddress: "0x2222333344445555666677778888999900001111",
    amount: 20000,
    value: 21400,
    pnl: 1400,
    pnlPercentage: 7.0,
    apy: "15.3%",
    status: "active",
    depositDate: "2024-02-05",
    strategy: "Cross-chain arbitrage and MEV extraction",
  },
  {
    id: "6",
    vault: "Layer 2 Optimizer",
    manager: "0x3333...9999",
    managerFullAddress: "0x3333444455556666777788889999000011112222",
    amount: 35000,
    value: 37100,
    pnl: 2100,
    pnlPercentage: 6.0,
    apy: "14.2%",
    status: "locked",
    depositDate: "2024-01-25",
    strategy: "Optimized yield farming on Layer 2 networks",
  },
  {
    id: "7",
    vault: "NFT Yield Farm",
    manager: "0x4444...aaaa",
    managerFullAddress: "0x4444555566667777888899990000aaaabbbbcccc",
    amount: 18000,
    value: 17640,
    pnl: -360,
    pnlPercentage: -2.0,
    apy: "9.8%",
    status: "active",
    depositDate: "2024-02-10",
    strategy: "NFT-backed lending and yield generation",
  },
  {
    id: "8",
    vault: "Liquid Staking Pro",
    manager: "0x6666...bbbb",
    managerFullAddress: "0x6666777788889999000011112222333344445555",
    amount: 42000,
    value: 44520,
    pnl: 2520,
    pnlPercentage: 6.0,
    apy: "11.8%",
    status: "closed",
    depositDate: "2024-01-08",
    strategy: "Professional liquid staking strategies",
  },
  {
    id: "9",
    vault: "Meme Coin Hunter",
    manager: "0x7777...cccc",
    managerFullAddress: "0x7777888899990000111122223333444455556666",
    amount: 12000,
    value: 15600,
    pnl: 3600,
    pnlPercentage: 30.0,
    apy: "45.2%",
    status: "active",
    depositDate: "2024-02-12",
    strategy: "High-risk meme coin trading strategies",
  },
  {
    id: "10",
    vault: "Stable Yield Plus",
    manager: "0x8888...dddd",
    managerFullAddress: "0x8888999900001111222233334444555566667777",
    amount: 28000,
    value: 28840,
    pnl: 840,
    pnlPercentage: 3.0,
    apy: "7.5%",
    status: "locked",
    depositDate: "2024-01-30",
    strategy: "Enhanced stablecoin yield strategies",
  },
  {
    id: "11",
    vault: "Cross-Chain Bridge",
    manager: "0x9999...eeee",
    managerFullAddress: "0x9999000011112222333344445555666677778888",
    amount: 22000,
    value: 23320,
    pnl: 1320,
    pnlPercentage: 6.0,
    apy: "13.1%",
    status: "active",
    depositDate: "2024-02-03",
    strategy: "Cross-chain bridge arbitrage opportunities",
  },
  {
    id: "12",
    vault: "AI Trading Bot",
    manager: "0xaaaa...ffff",
    managerFullAddress: "0xaaaa1111bbbb2222cccc3333dddd4444eeee5555",
    amount: 38000,
    value: 40280,
    pnl: 2280,
    pnlPercentage: 6.0,
    apy: "16.8%",
    status: "active",
    depositDate: "2024-01-18",
    strategy: "AI-powered algorithmic trading strategies",
  },
  {
    id: "13",
    vault: "GameFi Yield",
    manager: "0xbbbb...1111",
    managerFullAddress: "0xbbbb2222cccc3333dddd4444eeee5555ffff6666",
    amount: 16000,
    value: 17440,
    pnl: 1440,
    pnlPercentage: 9.0,
    apy: "19.3%",
    status: "locked",
    depositDate: "2024-02-07",
    strategy: "Gaming token yield farming strategies",
  },
  {
    id: "14",
    vault: "Real World Assets",
    manager: "0xcccc...2222",
    managerFullAddress: "0xcccc3333dddd4444eeee5555ffff6666aaaa7777",
    amount: 45000,
    value: 46350,
    pnl: 1350,
    pnlPercentage: 3.0,
    apy: "8.9%",
    status: "closed",
    depositDate: "2024-01-12",
    strategy: "Tokenized real-world asset investments",
  },
  {
    id: "15",
    vault: "Perpetual Futures",
    manager: "0xdddd...3333",
    managerFullAddress: "0xdddd4444eeee5555ffff6666aaaa7777bbbb8888",
    amount: 33000,
    value: 31680,
    pnl: -1320,
    pnlPercentage: -4.0,
    apy: "22.1%",
    status: "active",
    depositDate: "2024-02-14",
    strategy: "Perpetual futures trading strategies",
  },
  {
    id: "16",
    vault: "Options Strategies",
    manager: "0xeeee...4444",
    managerFullAddress: "0xeeee5555ffff6666aaaa7777bbbb8888cccc9999",
    amount: 27000,
    value: 28890,
    pnl: 1890,
    pnlPercentage: 7.0,
    apy: "17.4%",
    status: "active",
    depositDate: "2024-01-22",
    strategy: "Advanced options trading strategies",
  },
  {
    id: "17",
    vault: "Yield Aggregator",
    manager: "0xffff...5555",
    managerFullAddress: "0xffff6666aaaa7777bbbb8888cccc9999dddd0000",
    amount: 31000,
    value: 32240,
    pnl: 1240,
    pnlPercentage: 4.0,
    apy: "10.6%",
    status: "locked",
    depositDate: "2024-02-01",
    strategy: "Multi-protocol yield aggregation",
  },
  {
    id: "18",
    vault: "Flash Loan Arbitrage",
    manager: "0x1111...6666",
    managerFullAddress: "0x1111777722228888333399994444aaaabbbbcccc",
    amount: 24000,
    value: 25440,
    pnl: 1440,
    pnlPercentage: 6.0,
    apy: "15.7%",
    status: "active",
    depositDate: "2024-01-28",
    strategy: "Flash loan arbitrage opportunities",
  },
  {
    id: "19",
    vault: "Governance Token Farm",
    manager: "0x2222...7777",
    managerFullAddress: "0x2222888833339999444400005555bbbbccccdddd",
    amount: 19000,
    value: 20520,
    pnl: 1520,
    pnlPercentage: 8.0,
    apy: "18.9%",
    status: "closed",
    depositDate: "2024-02-06",
    strategy: "Governance token farming strategies",
  },
  {
    id: "20",
    vault: "Synthetic Assets",
    manager: "0x3333...8888",
    managerFullAddress: "0x3333999944440000555511116666ccccddddeeee",
    amount: 36000,
    value: 37800,
    pnl: 1800,
    pnlPercentage: 5.0,
    apy: "12.3%",
    status: "active",
    depositDate: "2024-01-16",
    strategy: "Synthetic asset trading strategies",
  },
  {
    id: "21",
    vault: "Liquidity Mining Pro",
    manager: "0x4444...9999",
    managerFullAddress: "0x4444000055551111666622227777ddddeeeeaaaa",
    amount: 29000,
    value: 30740,
    pnl: 1740,
    pnlPercentage: 6.0,
    apy: "14.8%",
    status: "active",
    depositDate: "2024-02-09",
    strategy: "Professional liquidity mining strategies",
  },
  {
    id: "22",
    vault: "Algorithmic Stablecoin",
    manager: "0x5555...aaaa",
    managerFullAddress: "0x5555111166662222777733338888eeeeffff9999",
    amount: 21000,
    value: 20580,
    pnl: -420,
    pnlPercentage: -2.0,
    apy: "11.2%",
    status: "locked",
    depositDate: "2024-01-26",
    strategy: "Algorithmic stablecoin strategies",
  },
  {
    id: "23",
    vault: "Metaverse Assets",
    manager: "0x6666...bbbb",
    managerFullAddress: "0x6666222277773333888844449999ffffaaaa0000",
    amount: 17000,
    value: 18360,
    pnl: 1360,
    pnlPercentage: 8.0,
    apy: "20.1%",
    status: "active",
    depositDate: "2024-02-11",
    strategy: "Metaverse and virtual world investments",
  },
  {
    id: "24",
    vault: "Privacy Coin Yield",
    manager: "0x7777...cccc",
    managerFullAddress: "0x7777333388884444999955550000aaaabbbb1111",
    amount: 26000,
    value: 27040,
    pnl: 1040,
    pnlPercentage: 4.0,
    apy: "9.7%",
    status: "closed",
    depositDate: "2024-01-31",
    strategy: "Privacy-focused cryptocurrency strategies",
  },
  {
    id: "25",
    vault: "Institutional Grade",
    manager: "0x8888...dddd",
    managerFullAddress: "0x8888444499995555000066661111bbbbcccc2222",
    amount: 55000,
    value: 57200,
    pnl: 2200,
    pnlPercentage: 4.0,
    apy: "8.1%",
    status: "active",
    depositDate: "2024-01-05",
    strategy: "Institutional-grade investment strategies",
  },
];

export default function PositionsPage() {
  const { user, loading, authenticated, login } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalItems = allPositions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedPositions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allPositions.slice(startIndex, endIndex);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const copyToClipboard = async (fullAddress: string) => {
    try {
      await navigator.clipboard.writeText(fullAddress);
      setCopiedAddress(fullAddress);
      toast.success("Address copied to clipboard!");
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (error) {
      console.error("Failed to copy address:", error);
      toast.error("Failed to copy address");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(1)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mx-auto max-w-md text-center">
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Wallet</CardTitle>
              <CardDescription>
                You need to connect your wallet to view your positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={login}
                className="bg-primary hover:bg-primary/90 w-full text-black"
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">All Positions</h1>
          <p className="text-muted-foreground">
            Manage and monitor your vault positions
          </p>
        </div>
        <Link href="/overview">
          <Button variant="outline" className="cursor-pointer">
            Back to Overview
          </Button>
        </Link>
      </div>

      {/* Positions Table */}
      <Card className="bg-card border-border rounded-none">
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-border border-b">
                  <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                    Vault
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                    Manager
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-right text-sm font-medium">
                    Amount
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-right text-sm font-medium">
                    Current Value
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-right text-sm font-medium">
                    P&L
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-right text-sm font-medium">
                    APY
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-center text-sm font-medium">
                    Deposit Date
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-center text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedPositions.map((position) => (
                  <tr
                    key={position.id}
                    className="border-border/50 hover:bg-muted/5 border-b"
                  >
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-medium text-white">
                          {position.vault}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {position.strategy}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground font-mono text-sm">
                          {position.manager}
                        </span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => copyToClipboard(position.managerFullAddress)}
                            className="text-muted-foreground hover:text-white transition-colors cursor-pointer p-1"
                            title={copiedAddress === position.managerFullAddress ? "Copied!" : "Copy address"}
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          <a
                            href={`https://solscan.io/account/${position.managerFullAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-white transition-colors cursor-pointer p-1"
                            title="View on Solscan"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="text-white">
                        {formatCurrency(position.amount)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="text-white">
                        {formatCurrency(position.value)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div
                        className={`flex items-center justify-end ${
                          position.pnl >= 0 ? "text-profit" : "text-loss"
                        }`}
                      >
                        {position.pnl >= 0 ? (
                          <ArrowUpIcon className="mr-1 h-4 w-4" />
                        ) : (
                          <ArrowDownIcon className="mr-1 h-4 w-4" />
                        )}
                        {formatCurrency(Math.abs(position.pnl))}
                      </div>
                      <div
                        className={`text-right text-sm ${
                          position.pnl >= 0 ? "text-profit" : "text-loss"
                        }`}
                      >
                        {formatPercentage(position.pnlPercentage)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="text-primary font-medium">
                        {position.apy}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="text-muted-foreground text-sm">
                        {formatDate(position.depositDate)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center space-x-2">
                        {position.status === "active" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer"
                          >
                            Withdraw
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-primary cursor-not-allowed border-none"
                            disabled
                          >
                            <ShieldCheckIcon className="text-primary h-4 w-4" />
                            Locked
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => {
                            window.location.href = `/vault/${position.id}`;
                          }}
                        >
                          Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 px-4 pb-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
