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
import { useUserVaultPositions } from "@/hooks/useUserVaultPositions";
import { UserVaultPosition } from "@/lib/api";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { ShieldCheckIcon, Eye } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

// Modal component for position details
function PositionDetailsModal({ 
  position, 
  isOpen, 
  onClose 
}: { 
  position: UserVaultPosition | null; 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  if (!isOpen || !position) return null;

  const pnl = calculatePnL(position.current_value, position.cumulative_deposits);
  const pnlPercentage = calculatePnLPercentage(position.current_value, position.cumulative_deposits);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Position Details</h2>
            <Button variant="outline" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Vault Name</label>
                <p className="text-white font-medium">{position.vault?.vault_name || "Unknown Vault"}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Vault Type</label>
                <p className="text-white">{position.vault?.vault_type || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Strategy</label>
                <p className="text-white">{position.vault?.vault_strategy || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">APY</label>
                <p className="text-green-400 font-medium">{formatPercentage(position.vault?.apy || 0)}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Vault Shares</label>
                <p className="text-white">{parseFloat(position.vault_shares).toFixed(4)}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Total Deposits</label>
                <p className="text-white">{formatCurrency(parseFloat(position.cumulative_deposits))}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Total Withdrawals</label>
                <p className="text-white">{formatCurrency(parseFloat(position.cumulative_withdrawals))}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Current Value</label>
                <p className="text-white font-medium">{formatCurrency(parseFloat(position.current_value))}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">PnL</label>
                <div className={`${pnl >= 0 ? "text-profit" : "text-loss"}`}>
                  <div className="flex items-center">
                    {pnl >= 0 ? (
                      <ArrowUpIcon className="mr-1 h-4 w-4" />
                    ) : (
                      <ArrowDownIcon className="mr-1 h-4 w-4" />
                    )}
                    {formatCurrency(Math.abs(pnl))} ({formatPercentage(pnlPercentage)})
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">High Water Mark</label>
                <p className="text-white">{formatCurrency(parseFloat(position.high_water_mark))}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Fees Paid</label>
                <p className="text-white">{formatCurrency(parseFloat(position.fees_paid))}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">First Deposit</label>
                <p className="text-white">{formatDate(position.first_deposit_at)}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Last Transaction</label>
                <p className="text-white">{formatDate(position.last_transaction_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
const calculatePnL = (currentValue: string, deposits: string) => {
  const current = parseFloat(currentValue);
  const deposited = parseFloat(deposits);
  return current - deposited;
};

const calculatePnLPercentage = (currentValue: string, deposits: string) => {
  const current = parseFloat(currentValue);
  const deposited = parseFloat(deposits);
  if (deposited === 0) return 0;
  return ((current - deposited) / deposited) * 100;
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

export default function PositionsPage() {
  const { user, loading, authenticated, login } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPosition, setSelectedPosition] = useState<UserVaultPosition | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  // Use the hook to fetch user vault positions
  const {
    positions,
    loading: positionsLoading,
    error,
    hasMore,
    loadMore,
    refetch
  } = useUserVaultPositions({
    userId: user?.userId || null,
    limit: itemsPerPage
  });

  // Calculate pagination based on current positions
  const totalItems = positions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedPositions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return positions.slice(startIndex, endIndex);
  }, [positions, currentPage]);

  // Load more data when page changes and we need more data
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    if (startIndex >= positions.length && hasMore && !positionsLoading) {
      loadMore();
    }
  }, [currentPage, positions.length, hasMore, positionsLoading, loadMore]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openDetailsModal = (position: UserVaultPosition) => {
    setSelectedPosition(position);
    setIsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsModalOpen(false);
    setSelectedPosition(null);
  };

  // Check if vault is in battle (battle_id exists and battle is not completed)
  const isVaultInBattle = (position: UserVaultPosition) => {
    return position.vault?.battle_id !== null;
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
                  <th className="text-muted-foreground px-4 py-3 text-right text-sm font-medium">
                    Current Value
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-right text-sm font-medium">
                    PnL
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
                {paginatedPositions.map((position) => {
                  const pnl = calculatePnL(position.current_value, position.cumulative_deposits);
                  const pnlPercentage = calculatePnLPercentage(position.current_value, position.cumulative_deposits);
                  const inBattle = isVaultInBattle(position);
                  
                  return (
                    <tr
                      key={position.position_id}
                      className="border-border/50 hover:bg-muted/5 border-b"
                    >
                      {/* Vault Column */}
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {position.vault?.vault_image ? (
                              <Image
                                src={position.vault.vault_image}
                                alt={position.vault.vault_name || "Vault"}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium">
                                  {position.vault?.vault_name?.charAt(0) || "V"}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-white truncate">
                              {position.vault?.vault_name || "Unknown Vault"}
                            </div>
                            <div className="text-muted-foreground text-sm truncate">
                              {position.vault?.vault_type || "Unknown Type"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Current Value */}
                      <td className="px-4 py-4 text-right">
                        <div className="text-white font-medium">
                          {formatCurrency(parseFloat(position.current_value))}
                        </div>
                      </td>

                      {/* PnL */}
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <div
                            className={`flex items-center whitespace-nowrap ${
                              pnl >= 0 ? "text-profit" : "text-loss"
                            }`}
                          >
                            {pnl >= 0 ? (
                              <ArrowUpIcon className="mr-1 h-4 w-4 flex-shrink-0" />
                            ) : (
                              <ArrowDownIcon className="mr-1 h-4 w-4 flex-shrink-0" />
                            )}
                            <span className="font-medium">
                              {formatCurrency(Math.abs(pnl))}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`text-right text-sm whitespace-nowrap ${
                            pnl >= 0 ? "text-profit" : "text-loss"
                          }`}
                        >
                          {formatPercentage(pnlPercentage)}
                        </div>
                      </td>

                      {/* APY */}
                      <td className="px-4 py-4 text-right">
                        <div className="text-green-400 font-medium">
                          {formatPercentage(position.vault?.apy || 0)}
                        </div>
                      </td>

                      {/* Deposit Date */}
                      <td className="px-4 py-4 text-center">
                        <div className="text-muted-foreground text-sm">
                          {formatDate(position.first_deposit_at)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex justify-center space-x-2">
                          {inBattle ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-orange-400 border-orange-400/50 cursor-not-allowed"
                              disabled
                            >
                              <ShieldCheckIcon className="h-4 w-4 mr-1" />
                              In Battle
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="cursor-pointer"
                            >
                              Withdraw
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => openDetailsModal(position)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

      {/* Position Details Modal */}
      <PositionDetailsModal
        position={selectedPosition}
        isOpen={isModalOpen}
        onClose={closeDetailsModal}
      />
    </div>
  );
}
