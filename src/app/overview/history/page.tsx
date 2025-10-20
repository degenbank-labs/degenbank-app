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
import {
  ArrowUpIcon,
  PlusIcon,
  MinusIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useState } from "react";

// Extended dummy data for transaction history with profit/loss and full hashes
const transactionHistory = [
  {
    id: "1",
    type: "deposit",
    vault: "ETH Yield Maximizer",
    amount: 50000,
    hash: "0x1234567890abcdef1234567890abcdef12345678",
    hashFull: "0x1234567890abcdef1234567890abcdef12345678",
    timestamp: "2024-01-15T10:30:00Z",
    status: "completed",
    fee: 25,
    pnl: 2500,
    pnlPercentage: 5.0,
  },
  {
    id: "2",
    type: "withdrawal",
    vault: "BTC Conservative",
    amount: 5000,
    hash: "0xabcdef1234567890abcdef1234567890abcdef12",
    hashFull: "0xabcdef1234567890abcdef1234567890abcdef12",
    timestamp: "2024-01-20T14:45:00Z",
    status: "completed",
    fee: 15,
    pnl: -250,
    pnlPercentage: -5.0,
  },
  {
    id: "3",
    type: "deposit",
    vault: "DeFi Alpha Hunter",
    amount: 15000,
    hash: "0x9876543210fedcba9876543210fedcba98765432",
    hashFull: "0x9876543210fedcba9876543210fedcba98765432",
    timestamp: "2024-02-01T09:15:00Z",
    status: "completed",
    fee: 30,
    pnl: 1800,
    pnlPercentage: 12.0,
  },
  {
    id: "4",
    type: "reinvest",
    vault: "ETH Yield Maximizer",
    amount: 2500,
    hash: "0xfedcba0987654321fedcba0987654321fedcba09",
    hashFull: "0xfedcba0987654321fedcba0987654321fedcba09",
    timestamp: "2024-02-05T16:20:00Z",
    status: "completed",
    fee: 12,
    pnl: 375,
    pnlPercentage: 15.0,
  },
  {
    id: "5",
    type: "deposit",
    vault: "Stablecoin Yield",
    amount: 30000,
    hash: "0x1111222233334444555566667777888899990000",
    hashFull: "0x1111222233334444555566667777888899990000",
    timestamp: "2024-01-10T11:00:00Z",
    status: "completed",
    fee: 20,
    pnl: 900,
    pnlPercentage: 3.0,
  },
  {
    id: "6",
    type: "withdrawal",
    vault: "DeFi Alpha Hunter",
    amount: 1000,
    hash: "0x5555666677778888999900001111222233334444",
    hashFull: "0x5555666677778888999900001111222233334444",
    timestamp: "2024-02-10T13:30:00Z",
    status: "pending",
    fee: 8,
    pnl: -120,
    pnlPercentage: -12.0,
  },
  {
    id: "7",
    type: "deposit",
    vault: "Arbitrage Master",
    amount: 20000,
    hash: "0x9999aaaabbbbccccddddeeeeffffaaaa11112222",
    hashFull: "0x9999aaaabbbbccccddddeeeeffffaaaa11112222",
    timestamp: "2024-02-05T08:45:00Z",
    status: "completed",
    fee: 25,
    pnl: 1400,
    pnlPercentage: 7.0,
  },
  {
    id: "8",
    type: "withdrawal",
    vault: "Layer 2 Optimizer",
    amount: 8500,
    hash: "0x3333444455556666777788889999000011112222",
    hashFull: "0x3333444455556666777788889999000011112222",
    timestamp: "2024-02-08T12:15:00Z",
    status: "completed",
    fee: 18,
    pnl: -340,
    pnlPercentage: -4.0,
  },
  {
    id: "9",
    type: "deposit",
    vault: "NFT Yield Farm",
    amount: 12000,
    hash: "0x4444555566667777888899990000aaaabbbbcccc",
    hashFull: "0x4444555566667777888899990000aaaabbbbcccc",
    timestamp: "2024-02-12T09:30:00Z",
    status: "completed",
    fee: 22,
    pnl: 2400,
    pnlPercentage: 20.0,
  },
  {
    id: "10",
    type: "reinvest",
    vault: "Liquid Staking Pro",
    amount: 6000,
    hash: "0x6666777788889999000011112222333344445555",
    hashFull: "0x6666777788889999000011112222333344445555",
    timestamp: "2024-02-14T16:45:00Z",
    status: "completed",
    fee: 15,
    pnl: 720,
    pnlPercentage: 12.0,
  },
  {
    id: "11",
    type: "withdrawal",
    vault: "Meme Coin Hunter",
    amount: 3500,
    hash: "0x7777888899990000111122223333444455556666",
    hashFull: "0x7777888899990000111122223333444455556666",
    timestamp: "2024-02-16T11:20:00Z",
    status: "failed",
    fee: 10,
    pnl: -875,
    pnlPercentage: -25.0,
  },
  {
    id: "12",
    type: "deposit",
    vault: "Stable Yield Plus",
    amount: 25000,
    hash: "0x8888999900001111222233334444555566667777",
    hashFull: "0x8888999900001111222233334444555566667777",
    timestamp: "2024-02-18T14:10:00Z",
    status: "completed",
    fee: 28,
    pnl: 750,
    pnlPercentage: 3.0,
  },
  {
    id: "13",
    type: "withdrawal",
    vault: "Cross-Chain Bridge",
    amount: 4200,
    hash: "0x9999000011112222333344445555666677778888",
    hashFull: "0x9999000011112222333344445555666677778888",
    timestamp: "2024-02-20T10:05:00Z",
    status: "pending",
    fee: 12,
    pnl: -210,
    pnlPercentage: -5.0,
  },
  {
    id: "14",
    type: "deposit",
    vault: "AI Trading Bot",
    amount: 18000,
    hash: "0xaaaa1111bbbb2222cccc3333dddd4444eeee5555",
    hashFull: "0xaaaa1111bbbb2222cccc3333dddd4444eeee5555",
    timestamp: "2024-02-22T13:25:00Z",
    status: "completed",
    fee: 24,
    pnl: 1980,
    pnlPercentage: 11.0,
  },
  {
    id: "15",
    type: "reinvest",
    vault: "GameFi Yield",
    amount: 7500,
    hash: "0xbbbb2222cccc3333dddd4444eeee5555ffff6666",
    hashFull: "0xbbbb2222cccc3333dddd4444eeee5555ffff6666",
    timestamp: "2024-02-24T15:40:00Z",
    status: "completed",
    fee: 16,
    pnl: 1125,
    pnlPercentage: 15.0,
  },
  {
    id: "16",
    type: "withdrawal",
    vault: "Real World Assets",
    amount: 9800,
    hash: "0xcccc3333dddd4444eeee5555ffff6666aaaa7777",
    hashFull: "0xcccc3333dddd4444eeee5555ffff6666aaaa7777",
    timestamp: "2024-02-26T08:15:00Z",
    status: "completed",
    fee: 20,
    pnl: -294,
    pnlPercentage: -3.0,
  },
  {
    id: "17",
    type: "deposit",
    vault: "Perpetual Futures",
    amount: 14000,
    hash: "0xdddd4444eeee5555ffff6666aaaa7777bbbb8888",
    hashFull: "0xdddd4444eeee5555ffff6666aaaa7777bbbb8888",
    timestamp: "2024-02-28T12:50:00Z",
    status: "completed",
    fee: 26,
    pnl: 2800,
    pnlPercentage: 20.0,
  },
  {
    id: "18",
    type: "withdrawal",
    vault: "Options Strategies",
    amount: 5600,
    hash: "0xeeee5555ffff6666aaaa7777bbbb8888cccc9999",
    hashFull: "0xeeee5555ffff6666aaaa7777bbbb8888cccc9999",
    timestamp: "2024-03-01T09:35:00Z",
    status: "pending",
    fee: 14,
    pnl: -168,
    pnlPercentage: -3.0,
  },
  {
    id: "19",
    type: "deposit",
    vault: "Yield Aggregator",
    amount: 22000,
    hash: "0xffff6666aaaa7777bbbb8888cccc9999dddd0000",
    hashFull: "0xffff6666aaaa7777bbbb8888cccc9999dddd0000",
    timestamp: "2024-03-03T14:20:00Z",
    status: "completed",
    fee: 30,
    pnl: 1320,
    pnlPercentage: 6.0,
  },
  {
    id: "20",
    type: "reinvest",
    vault: "Flash Loan Arbitrage",
    amount: 3200,
    hash: "0x1111777722228888333399994444aaaabbbbcccc",
    hashFull: "0x1111777722228888333399994444aaaabbbbcccc",
    timestamp: "2024-03-05T11:45:00Z",
    status: "completed",
    fee: 8,
    pnl: 480,
    pnlPercentage: 15.0,
  },
];

export default function HistoryPage() {
  const { authenticated, login } = useAuth();
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <PlusIcon className="h-4 w-4 text-green-400" />;
      case "withdrawal":
        return <MinusIcon className="h-4 w-4 text-red-400" />;
      case "reinvest":
        return <ArrowPathIcon className="h-4 w-4 text-blue-400" />;
      default:
        return <ArrowUpIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-primary";
      case "pending":
        return "text-yellow-200";
      case "failed":
        return "text-loss";
      default:
        return "text-gray-200";
    }
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const copyToClipboard = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopiedHash(hash);
      toast.success("Transaction hash copied to clipboard!");
      setTimeout(() => setCopiedHash(null), 2000);
    } catch (error) {
      toast.error("Failed to copy transaction hash");
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(transactionHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactionHistory.slice(startIndex, endIndex);

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mx-auto max-w-md text-center">
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Wallet</CardTitle>
              <CardDescription>
                You need to connect your wallet to view your transaction history
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

  const totalDeposits = transactionHistory
    .filter((tx) => tx.type === "deposit" && tx.status === "completed")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalWithdrawals = transactionHistory
    .filter((tx) => tx.type === "withdrawal" && tx.status === "completed")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalFees = transactionHistory
    .filter((tx) => tx.status === "completed")
    .reduce((sum, tx) => sum + tx.fee, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Transaction History</h1>
          <p className="text-muted-foreground">
            Complete record of your vault transactions
          </p>
        </div>
        <Link href="/overview">
          <Button variant="outline" className="cursor-pointer">
            Back to Overview
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="bg-card border-border rounded-none">
          <CardHeader className="pb-2">
            <CardDescription>Total Deposits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-profit text-xl font-bold">
              {formatCurrency(totalDeposits)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border rounded-none">
          <CardHeader className="pb-2">
            <CardDescription>Total Withdrawals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-loss text-xl font-bold">
              {formatCurrency(totalWithdrawals)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border rounded-none">
          <CardHeader className="pb-2">
            <CardDescription>Total Fees Paid</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white">
              {formatCurrency(totalFees)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border rounded-none">
          <CardHeader className="pb-2">
            <CardDescription>Total Transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white">
              {transactionHistory.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History Table */}
      <Card className="bg-card border-border rounded-none">
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>
            Chronological list of all your vault transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-border border-b">
                  <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                    Type
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                    Vault
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-right text-sm font-medium">
                    Amount
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-right text-sm font-medium">
                    P&L
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-right text-sm font-medium">
                    Fee
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-center text-sm font-medium">
                    Status
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                    Transaction Hash
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-center text-sm font-medium">
                    Date & Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-border/50 hover:bg-muted/5 border-b"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        {getTransactionIcon(transaction.type)}
                        <span className="text-sm font-medium text-white capitalize">
                          {transaction.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-white">
                        {transaction.vault}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div
                        className={`text-sm font-medium ${
                          transaction.type === "deposit" ||
                          transaction.type === "reinvest"
                            ? "text-profit"
                            : "text-loss"
                        }`}
                      >
                        {transaction.type === "deposit" ||
                        transaction.type === "reinvest"
                          ? "+"
                          : "-"}
                        {formatCurrency(transaction.amount)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div
                        className={`text-sm font-medium ${
                          transaction.pnl >= 0 ? "text-profit" : "text-loss"
                        }`}
                      >
                        {transaction.pnl >= 0 ? "+" : ""}
                        {formatCurrency(transaction.pnl)}
                        <span className="ml-1 text-xs">
                          ({transaction.pnlPercentage >= 0 ? "+" : ""}
                          {transaction.pnlPercentage.toFixed(1)}%)
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="text-muted-foreground text-sm">
                        {formatCurrency(transaction.fee)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(transaction.status)}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="text-muted-foreground font-mono text-xs">
                          {truncateHash(transaction.hash)}
                        </div>
                        <button
                          onClick={() => copyToClipboard(transaction.hashFull)}
                          className="hover:bg-muted/20 cursor-pointer rounded p-1 transition-colors"
                          title="Copy transaction hash"
                        >
                          <Copy className="text-muted-foreground h-3 w-3 hover:text-white" />
                        </button>
                        <a
                          href={`https://solscan.io/tx/${transaction.hashFull}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:bg-muted/20 cursor-pointer rounded p-1 transition-colors"
                          title="View on Solscan"
                        >
                          <ExternalLink className="text-muted-foreground h-3 w-3 hover:text-white" />
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="text-muted-foreground text-xs">
                        {formatDateTime(transaction.timestamp)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-border/50 flex items-center justify-between border-t px-6 py-4">
            <div className="text-muted-foreground text-sm">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, transactionHistory.length)} of{" "}
              {transactionHistory.length} transactions
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="border-border/50 hover:bg-muted/20 cursor-pointer border px-3 py-1 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`border-border/50 cursor-pointer border px-3 py-1 text-sm transition-colors ${
                        currentPage === page
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted/20"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="border-border/50 hover:bg-muted/20 cursor-pointer border px-3 py-1 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
