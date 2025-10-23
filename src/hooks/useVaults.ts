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
  apy: number; // Changed from string to number to match Vault interface
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
          // Use performance data from backend (now includes dummy data)
          performance: {
            daily: Number(vault.daily_performance) || 0,
            weekly: Number(vault.weekly_performance) || 0,
            monthly: Number(vault.monthly_performance) || 0,
          },
          // Use APY from backend (now includes dummy data)
          apy: Number(vault.apy) || 0,
          // Calculate age based on creation date
          age: vault.created_at 
            ? `${Math.floor((Date.now() - new Date(vault.created_at).getTime()) / (1000 * 60 * 60 * 24))} days`
            : 'N/A',
          // Use vault image or default
          symbolImage: vault.vault_image || "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
          // Use TVL from backend (now includes dummy data)
          tvl: Number(vault.total_value_locked) || 0,
          // Determine manager type based on vault type
          managerType: vault.vault_type === 'banker' ? 'verified' : 'ecosystem',
          // Use risk level from backend (now includes dummy data)
          risk: vault.risk_level || 'Medium',
          // Use deposit asset from backend (now includes dummy data)
          depositAsset: vault.deposit_asset || 'USDC',
          // Use minimum deposit from backend (now includes dummy data)
          minDeposit: Number(vault.min_deposit) || 100,
          // Use battle status or default to Active
          status: vault.is_disqualified ? 'Disqualified' : (vault.battle_status || 'Active'),
        }));

        setVaults(transformedVaults);

        // Calculate stats
        const totalTVL = transformedVaults.reduce((sum, vault) => {
          return sum + (Number(vault.tvl) || 0);
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
          // Use performance data from backend (now includes dummy data)
          performance: {
            daily: Number(vault.daily_performance) || 0,
            weekly: Number(vault.weekly_performance) || 0,
            monthly: Number(vault.monthly_performance) || 0,
          },
          // Use APY from backend (now includes dummy data)
          apy: Number(vault.apy) || 0,
          // Calculate age based on creation date
          age: vault.created_at 
            ? `${Math.floor((Date.now() - new Date(vault.created_at).getTime()) / (1000 * 60 * 60 * 24))} days`
            : 'N/A',
          // Use vault image or default
          symbolImage: vault.vault_image || "https://drift-public.s3.eu-central-1.amazonaws.com/protocols/knighttrade_square.png",
          // Use TVL from backend (now includes dummy data)
          tvl: Number(vault.total_value_locked) || 0,
          // Determine manager type based on manager KYB status
          managerType: vault.manager?.is_kyb ? 'verified' : 'ecosystem',
          // Use risk level from backend (now includes dummy data)
          risk: (vault.risk_level as 'Low' | 'Medium' | 'High') || 'Medium',
          // Use deposit asset from backend (now includes dummy data)
          depositAsset: vault.deposit_asset || 'SOL',
          // Use min deposit from backend (now includes dummy data)
          minDeposit: Number(vault.min_deposit) || 0,
          // Use battle status or default to Active
          status: vault.battle_status || 'Active',
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