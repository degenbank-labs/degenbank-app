import { useState, useEffect } from 'react';
import { apiService, Vault, GetVaultsResponse } from '@/lib/api';

export interface VaultWithMetrics extends Vault {
  // Frontend-specific fields
  id: string; // mapped from vault_id
  name: string; // mapped from vault_name
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  apy: string;
  age: string;
  symbolImage: string;
  tvl: number;
  managerType: 'verified' | 'ecosystem';
  risk: 'Low' | 'Medium' | 'High';
  depositAsset: string;
  minDeposit: number;
  status: string;
  strategy: string; // mapped from vault_strategy
}

export interface VaultStats {
  totalTVL: number;
  totalPnL: number;
  verifiedManagers: number;
  ecosystemManagers: number;
}

export const useVaults = () => {
  const [vaults, setVaults] = useState<VaultWithMetrics[]>([]);
  const [stats, setStats] = useState<VaultStats>({
    totalTVL: 0,
    totalPnL: 0,
    verifiedManagers: 0,
    ecosystemManagers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVaults = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch vaults from API
      const response: GetVaultsResponse = await apiService.getAllVaults(0, 100);
      
      if (response.results) {
        // Transform API data to match frontend interface
        const transformedVaults: VaultWithMetrics[] = response.results.map((vault: Vault) => ({
          ...vault,
          // Map API fields to frontend fields
          id: vault.vault_id,
          name: vault.vault_name,
          strategy: vault.vault_strategy,
          // Add mock performance data since it's not in the API yet
          performance: {
            daily: Math.random() * 2 - 1, // Random between -1 and 1
            weekly: Math.random() * 10 - 5, // Random between -5 and 5
            monthly: Math.random() * 20 - 10, // Random between -10 and 10
          },
          // Calculate APY based on vault data (mock calculation)
          apy: `${(Math.random() * 30 + 5).toFixed(1)}%`,
          // Calculate age (mock - could be based on created_at if available)
          age: `${Math.floor(Math.random() * 90 + 1)} days`,
          // Default symbol image
          symbolImage: vault.vault_image || "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
          // Mock additional fields
          tvl: Math.floor(Math.random() * 20000000 + 1000000),
          managerType: Math.random() > 0.4 ? 'verified' : 'ecosystem',
          risk: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High',
          depositAsset: ['USDC', 'SOL', 'USDT'][Math.floor(Math.random() * 3)],
          minDeposit: Math.floor(Math.random() * 1000 + 50),
          status: 'Active',
        }));

        setVaults(transformedVaults);

        // Calculate stats
        const totalTVL = transformedVaults.reduce((sum, vault) => {
          return sum + (vault.tvl || 0);
        }, 0);

        const totalPnL = transformedVaults.reduce((sum, vault) => {
          // Mock P&L calculation based on performance
          const pnl = vault.performance ? vault.performance.monthly * 10000 : 0;
          return sum + pnl;
        }, 0);

        // Count manager types
        const verifiedCount = transformedVaults.filter(v => v.managerType === 'verified').length;
        const ecosystemCount = transformedVaults.filter(v => v.managerType === 'ecosystem').length;

        setStats({
          totalTVL,
          totalPnL,
          verifiedManagers: verifiedCount,
          ecosystemManagers: ecosystemCount,
        });
      } else {
        throw new Error('Failed to fetch vaults');
      }
    } catch (err) {
      console.error('Error fetching vaults:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch vaults');
      
      // Fallback to empty data
      setVaults([]);
      setStats({
        totalTVL: 0,
        totalPnL: 0,
        verifiedManagers: 0,
        ecosystemManagers: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const getVaultById = async (vaultId: string): Promise<VaultWithMetrics | null> => {
    try {
      const vault = await apiService.getVault(vaultId);
      if (vault) {
        return {
          ...vault,
          // Map API fields to frontend fields
          id: vault.vault_id,
          name: vault.vault_name,
          strategy: vault.vault_strategy,
          performance: {
            daily: Math.random() * 2 - 1,
            weekly: Math.random() * 10 - 5,
            monthly: Math.random() * 20 - 10,
          },
          apy: `${(Math.random() * 30 + 5).toFixed(1)}%`,
          age: `${Math.floor(Math.random() * 90 + 1)} days`,
          symbolImage: vault.vault_image || "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
          tvl: Math.floor(Math.random() * 20000000 + 1000000),
          managerType: Math.random() > 0.4 ? 'verified' : 'ecosystem',
          risk: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High',
          depositAsset: ['USDC', 'SOL', 'USDT'][Math.floor(Math.random() * 3)],
          minDeposit: Math.floor(Math.random() * 1000 + 50),
          status: 'Active',
        };
      }
      return null;
    } catch (err) {
      console.error('Error fetching vault by ID:', err);
      return null;
    }
  };

  const refreshVaults = () => {
    fetchVaults();
  };

  useEffect(() => {
    fetchVaults();
  }, []);

  return {
    vaults,
    stats,
    loading,
    error,
    refreshVaults,
    getVaultById,
  };
};